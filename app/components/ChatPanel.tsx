"use client";

import { useState, useEffect, useRef } from "react";
import ChatBackdrop from "./ChatBackdrop";
import { X, Mic, Loader2, ArrowRight, ChevronRight, ChevronDown, Brain } from "lucide-react";

/* Minimal Web Speech API typings (not in TS's DOM lib). Recognition runs in the
   visitor's browser; audio never reaches this site's server. */
interface SpeechResultEvent {
  resultIndex: number;
  results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
}
interface Recognizer {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  processLocally?: boolean;
  onresult: ((e: SpeechResultEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
interface RecognizerCtor {
  new (): Recognizer;
  available?: (o: { langs: string[]; processLocally: boolean }) => Promise<string>;
  install?: (o: { langs: string[]; processLocally: boolean }) => Promise<boolean>;
}

function getRecognizer(): RecognizerCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognizerCtor; webkitSpeechRecognition?: RecognizerCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

type VoiceLang = "en-US" | "id-ID";

function browserLang(): VoiceLang {
  return navigator.language?.toLowerCase().startsWith("id") ? "id-ID" : "en-US";
}

const ID_WORDS = /\b(yang|dan|di|ke|dari|ini|itu|dengan|untuk|adalah|tidak|saya|kamu|dia|juga|bisa|sudah|akan|atau|pada|dalam|ada|karena|seperti|lebih|tentang)\b/gi;

/** Pick the voice by the reply's own language so Indonesian answers aren't read in an English accent. */
function detectLang(text: string, fallback: VoiceLang): VoiceLang {
  const words = text.split(/\s+/).length || 1;
  const hits = text.match(ID_WORDS)?.length ?? 0;
  if (hits / words > 0.06) return "id-ID";
  if (words > 6 && hits === 0) return "en-US";
  return fallback;
}

function speak(text: string, fallback: VoiceLang) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const clean = text.replace(/\*\*/g, "").replace(/^\s*[-*•]\s+/gm, "");
  const u = new SpeechSynthesisUtterance(clean);
  u.lang = detectLang(clean, fallback);
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

interface ThinkStep {
  label: string;
  items?: string[];
  ms: number; // server time since the request started
}

interface Thinking {
  steps: ThinkStep[];
  reasoning: string;
  startedAt: number; // client clock
  thoughtMs?: number; // until the first answer token
  totalMs?: number;
  model?: string;
  failed?: boolean;
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  thinking?: Thinking;
}

/** tidy model output for display: no em dashes, en-dash separators become colons */
function cleanText(text: string) {
  return text.replace(/\s*(—|--)\s*/g, ", ").replace(/\s+–\s+/g, ": ");
}

function secs(ms: number) {
  return `${(ms / 1000).toFixed(ms < 10000 ? 1 : 0)}s`;
}

/** Claude-style collapsible "Thinking" header with a live timer and the pipeline steps. */
function ThinkingBlock({ thinking }: { thinking: Thinking }) {
  const active = thinking.thoughtMs === undefined && !thinking.failed;
  const [manual, setManual] = useState<boolean | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const open = manual ?? false;

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, [active]);

  const elapsed = active ? Math.max(0, now - thinking.startedAt) : thinking.thoughtMs ?? thinking.totalMs ?? 0;
  const title = active ? `Thinking ${secs(elapsed)}` : `Thought for ${secs(elapsed)}`;

  return (
    <div className="chat-msg-in w-full text-[11px] sm:text-xs">
      <button
        type="button"
        onClick={() => setManual(!open)}
        aria-expanded={open}
        className="chat-empty-desc inline-flex items-center gap-1.5 py-1 cursor-pointer transition-opacity hover:opacity-70"
      >
        <Brain size={13} aria-hidden="true" className={active ? "animate-pulse" : "opacity-80"} />
        <span className="font-medium tabular-nums">{title}</span>
        <ChevronDown
          size={12}
          aria-hidden="true"
          className={`transition-transform duration-300 ease-out ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* grid-rows 0fr -> 1fr animates to the content's real height in both directions */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="overflow-hidden">
          {/* remount on open so the steps cascade in each time */}
          <div key={open ? "open" : "closed"} className="chat-empty-desc pt-1.5 pb-1 pl-0.5">
            <ol className="space-y-2">
              {thinking.steps.map((step, i) => (
                <li
                  key={i}
                  className="thinking-step flex gap-2.5"
                  style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}
                >
                  <span className="mt-[7px] w-1 h-1 shrink-0 rounded-full bg-current opacity-50" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <span>{step.label}</span>
                      <span className="shrink-0 tabular-nums opacity-60">{secs(step.ms)}</span>
                    </div>
                    {step.items && step.items.length > 0 && (
                      <p className="mt-0.5 opacity-70">{step.items.join(" · ")}</p>
                    )}
                  </div>
                </li>
              ))}
              {active && (
                <li className="thinking-step flex gap-2.5 opacity-60">
                  <span className="mt-[7px] w-1 h-1 shrink-0 rounded-full bg-current animate-pulse" aria-hidden="true" />
                  Working…
                </li>
              )}
            </ol>
            {thinking.reasoning && (
              <p className="thinking-step mt-2 pl-3.5 max-h-40 overflow-y-auto whitespace-pre-wrap italic opacity-60 scrollbar-hide">
                {thinking.reasoning.trim()}
              </p>
            )}
            {thinking.totalMs !== undefined && !thinking.failed && (
              <p className="thinking-step mt-2 pl-3.5 opacity-50 tabular-nums">
                Answered in {secs(thinking.totalMs)}
                {thinking.model ? ` · ${thinking.model}` : ""}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Short, readable label for a URL: "https://www.narra.angkasa.tech/" -> "narra.angkasa.tech" */
function linkLabel(url: string) {
  try {
    const u = new URL(url);
    const path = u.pathname.replace(/\/$/, "");
    return u.hostname.replace(/^www\./, "") + (path.length > 1 && path.length < 28 ? path : path.length > 1 ? "/…" : "");
  } catch {
    return url;
  }
}

/** **bold**, [text](url) and bare URLs; trailing punctuation stays outside links */
function renderInline(text: string, keyBase: string) {
  const out: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s)]+[^\s).,!?;:'"])/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = `${keyBase}-${i++}`;
    if (m[1] !== undefined) {
      out.push(
        <strong key={key} className="font-semibold">
          {m[1]}
        </strong>,
      );
    } else {
      const href = m[3] ?? m[4];
      out.push(
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-current/30 underline-offset-2 hover:decoration-current"
        >
          {m[2] ?? linkLabel(href)}
        </a>,
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Light markdown for answers: paragraphs, bullet and numbered lists, inline formatting. */
function renderFormattedText(text: string) {
  type Block = { kind: "p"; lines: string[] } | { kind: "h"; text: string } | { kind: "ul" | "ol"; items: string[] };
  const blocks: Block[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    const bullet = line.match(/^[-*•]\s+(.*)$/);
    const numbered = line.match(/^\d+[.)]\s+(.*)$/);
    const prev = blocks.at(-1);
    const heading = line.match(/^#{1,6}\s+(.*)$/) ?? line.match(/^\*\*([^*]+)\*\*:?$/);
    if (heading) {
      blocks.push({ kind: "h", text: heading[1].replace(/\*\*/g, "") });
    } else if (!line) {
      blocks.push({ kind: "p", lines: [] }); // paragraph break
    } else if (bullet || numbered) {
      const kind = bullet ? "ul" : "ol";
      const item = (bullet ?? numbered)![1];
      if (prev && prev.kind === kind) prev.items.push(item);
      else blocks.push({ kind, items: [item] });
    } else if (prev && prev.kind === "p") {
      prev.lines.push(line);
    } else {
      blocks.push({ kind: "p", lines: [line] });
    }
  }

  return (
    <div className="space-y-3">
      {blocks.map((block, bi) => {
        if (block.kind === "h") {
          return (
            <p key={bi} className="pt-1 font-semibold">
              {block.text}
            </p>
          );
        }
        if (block.kind === "p") {
          if (block.lines.length === 0) return null;
          return <p key={bi}>{renderInline(block.lines.join(" "), `p${bi}`)}</p>;
        }
        const List = block.kind === "ul" ? "ul" : "ol";
        return (
          <List
            key={bi}
            className={`space-y-2 pl-5 ${block.kind === "ul" ? "list-disc" : "list-decimal"} marker:text-neutral-400 dark:marker:text-neutral-500`}
          >
            {block.items.map((item, ii) => (
              <li key={ii} className="pl-0.5">
                {renderInline(item, `l${bi}-${ii}`)}
              </li>
            ))}
          </List>
        );
      })}
    </div>
  );
}

const BUSY = "Gagah's Chatbot is busy right now. Please try again later.";

const SUGGESTIONS = [
  "Who is Gagah?",
  "What projects has he built?",
  "What's his tech stack?",
];

export default function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [voiceError, setVoiceError] = useState("");
  const [lang, setLang] = useState<VoiceLang>("en-US");
  // keep the panel mounted while it slides out
  const [mounted, setMounted] = useState(isOpen);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // wait a frame so the off-screen position is painted before sliding in
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      return () => cancelAnimationFrame(id);
    }
    setShown(false);
    const t = setTimeout(() => setMounted(false), 300);
    return () => clearTimeout(t);
  }, [isOpen]);
  const recRef = useRef<Recognizer | null>(null);
  const sendRef = useRef<(text?: string, spoken?: boolean) => void>(() => {});

  useEffect(() => {
    setVoiceSupported(getRecognizer() !== null);
    setLang(browserLang());
  }, []);

  // stop the mic and any speech when the panel closes
  useEffect(() => {
    if (isOpen) return;
    recRef.current?.abort();
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }, [isOpen]);

  useEffect(() => () => {
    recRef.current?.abort();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      // jump while tokens stream in (smooth scrolling on every token stutters)
      messagesEndRef.current.scrollIntoView({ behavior: isLoading ? "auto" : "smooth", block: "end" });
    }
  }, [messages, isLoading, isOpen]);

  if (!mounted) return null;

  async function handleSend(text?: string, spoken = false) {
    const userText = (text ?? input).trim();
    if (!userText || isLoading) return;
    // the browser recognizer hears one language at a time, so follow whichever the visitor is using
    const userLang = detectLang(userText, lang);
    setLang(userLang);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    const botId = (Date.now() + 1).toString();
    const startedAt = Date.now();
    setMessages((prev) => [
      ...prev,
      { id: botId, sender: "bot", text: "", thinking: { steps: [], reasoning: "", startedAt } },
    ]);
    const update = (fn: (m: ChatMessage) => ChatMessage) =>
      setMessages((prev) => prev.map((m) => (m.id === botId ? fn(m) : m)));
    const think = (fn: (t: Thinking) => Thinking) => update((m) => ({ ...m, thinking: fn(m.thinking!) }));
    let answer = "";
    let failed = false;
    // ends the thinking timer once; a partial answer is kept as is
    const fail = (text: string) => {
      if (failed || answer) return;
      failed = true;
      update((m) => ({
        ...m,
        text,
        thinking: { ...m.thinking!, failed: true, totalMs: Date.now() - startedAt },
      }));
    };

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(({ sender, text }) => ({ sender, text })),
        }),
      });

      if (!res.ok || !res.body) {
        fail(
          res.status === 400
            ? "Sorry, I couldn't read that message. Please try again."
            : BUSY,
        );
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) >= 0) {
          const line = buf.slice(0, nl).trim();
          buf = buf.slice(nl + 1);
          if (!line) continue;
          const e = JSON.parse(line);
          if (e.t === "step") {
            think((t) => ({ ...t, steps: [...t.steps, { label: e.label, items: e.items, ms: e.ms }] }));
          } else if (e.t === "reasoning") {
            think((t) => ({ ...t, reasoning: t.reasoning + e.text }));
          } else if (e.t === "answer") {
            const first = answer === "";
            answer += e.text;
            const text = answer;
            update((m) => ({
              ...m,
              text,
              thinking: first ? { ...m.thinking!, thoughtMs: Date.now() - startedAt } : m.thinking,
            }));
          } else if (e.t === "done") {
            think((t) => ({ ...t, totalMs: Date.now() - startedAt, model: e.model }));
          } else if (e.t === "error") {
            fail(e.message || BUSY);
          }
        }
      }
      if (!answer) fail(BUSY);
      else if (spoken) speak(answer, userLang);
    } catch {
      fail("Sorry, I couldn't reach the assistant. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  sendRef.current = handleSend;

  async function toggleVoice() {
    if (listening) {
      recRef.current?.stop();
      return;
    }
    const SR = getRecognizer();
    if (!SR || isLoading) return;
    setVoiceError("");
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();

    const rec = new SR();
    rec.lang = lang;
    rec.interimResults = true;
    rec.continuous = false;

    // Prefer fully on-device recognition when the browser offers it.
    if (SR.available) {
      try {
        const status = await SR.available({ langs: [lang], processLocally: true });
        if (status === "available") rec.processLocally = true;
        else if (status === "downloadable" && SR.install) void SR.install({ langs: [lang], processLocally: true });
      } catch {
        /* fall back to the browser's default recognizer */
      }
    }

    let finalText = "";
    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interim += r[0].transcript;
      }
      setInput((finalText + interim).trim());
    };
    rec.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") setVoiceError("Microphone access was blocked.");
      else if (e.error === "no-speech") setVoiceError("Didn't catch that — try again.");
      else if (e.error !== "aborted") setVoiceError("Voice input isn't available right now.");
    };
    rec.onend = () => {
      setListening(false);
      recRef.current = null;
      if (finalText.trim()) sendRef.current(finalText, true);
    };

    recRef.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch {
      setVoiceError("Voice input isn't available right now.");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300 motion-reduce:transition-none ${shown ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Slide-over Right Chat Panel */}
      <aside className={`chat-panel-container fixed right-0 top-0 bottom-0 z-50 border-l border-line shadow-2xl transition-transform duration-300 ease-in-out motion-reduce:transition-none ${shown ? "translate-x-0" : "translate-x-full pointer-events-none"} flex flex-col w-full md:left-[calc(50%+384px)] md:right-0 md:w-auto min-w-[280px] overflow-hidden`}>
        <ChatBackdrop dim={messages.length > 0} />
        {/* Close button only on mobile, where the panel covers the tab bar; on desktop the Chat tab toggles it */}
        <div className="relative z-10 flex md:hidden items-center justify-end px-4 h-14 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="chat-close-btn p-1.5 rounded-full transition-colors cursor-pointer"
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="relative z-10 flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-hide">
          {messages.length === 0 ? (
            null
          ) : (

            messages.map((msg) =>
              msg.sender === "user" ? (
                <div key={msg.id} className="chat-msg-in flex justify-end">
                  <div className="chat-user-bubble max-w-[85%] px-4 py-2.5 rounded-2xl rounded-br-md text-[13.5px] sm:text-sm leading-[1.6] [overflow-wrap:anywhere]">
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div key={msg.id} className="flex flex-col items-start gap-1.5">
                  {msg.thinking && <ThinkingBlock thinking={msg.thinking} />}
                  {msg.text && (
                    <div className="chat-msg-in chat-answer w-full px-0.5 text-[13.5px] sm:text-sm leading-[1.75] [overflow-wrap:anywhere]">
                      {renderFormattedText(cleanText(msg.text))}
                    </div>
                  )}
                </div>
              ),
            )
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input Area Card */}
        <div className="relative z-10 p-4">
          {messages.length === 0 && (
            <div className="flex flex-col gap-1 mb-6">
              {SUGGESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSend(q)}
                  disabled={isLoading}
                  className="group chat-empty-desc w-full flex items-center gap-2 bg-transparent border-0 px-1 py-1 text-xs sm:text-sm text-left transition-opacity hover:opacity-70 active:opacity-70 focus-visible:opacity-70 cursor-pointer disabled:cursor-not-allowed"
                >
                  <span aria-hidden="true" className="leading-none">⠿</span>
                  <span className="flex-1">{q}</span>
                  <ChevronRight
                    size={14}
                    aria-hidden="true"
                    className="shrink-0 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 group-active:opacity-100 group-active:translate-x-0"
                  />
                </button>
              ))}
            </div>
          )}
          <div className="chat-input-card rounded-2xl p-3 flex flex-col justify-between gap-3 shadow-xs">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder={listening ? "Listening..." : "How can I help you?"}
              className="chat-input-field w-full bg-transparent text-xs sm:text-sm outline-none border-none focus:outline-none disabled:opacity-50"
            />

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  type="button"
                  onClick={toggleVoice}
                  disabled={!voiceSupported || isLoading}
                  aria-pressed={listening}
                  title={voiceSupported ? (listening ? "Stop listening" : "Ask by voice") : "Voice input isn't supported in this browser"}
                  aria-label={listening ? "Stop listening" : "Ask by voice"}
                  className="chat-pill-btn w-7 h-7 shrink-0 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {listening ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
                  ) : (
                    <Mic size={14} aria-hidden="true" />
                  )}
                </button>
                {voiceError && (
                  <span className="chat-empty-desc text-[11px] truncate" role="status">
                    {voiceError}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                  input.trim() && !isLoading
                    ? "chat-send-active hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                    : "chat-send-inactive cursor-not-allowed"
                }`}
                aria-label="Send message"
                title="Send message"
              >
                {isLoading ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <ArrowRight size={14} />
                )}
              </button>
            </div>
          </div>
        </div>
      </aside>

    </>
  );
}
