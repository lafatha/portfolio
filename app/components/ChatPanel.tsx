"use client";

import { useState, useEffect, useRef } from "react";
import ChatBackdrop from "./ChatBackdrop";
import { X, Mic, Loader2, ArrowRight, ChevronRight } from "lucide-react";

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

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function renderFormattedText(text: string) {
  const lines = text.split("\n");

  return (
    <div className="space-y-1.5">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-0.5" />;

        const isBullet =
          trimmed.startsWith("- ") ||
          trimmed.startsWith("* ") ||
          trimmed.startsWith("• ");

        let content = trimmed;
        if (isBullet) {
          content = trimmed.slice(2);
        }

        const parts = content.split(/(\*\*.*?\*\*)/g);
        const parsed = parts.map((part, pIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong
                key={pIdx}
                className="font-semibold text-neutral-900 dark:text-neutral-100"
              >
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5 shrink-0">
                •
              </span>
              <span className="flex-1">{parsed}</span>
            </div>
          );
        }

        return (
          <p key={idx} className="leading-relaxed">
            {parsed}
          </p>
        );
      })}
    </div>
  );
}

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
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
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

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages,
        }),
      });

      const data = await res.json();
      if (res.ok && data.reply) {
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: data.reply,
        };
        setMessages((prev) => [...prev, botMsg]);
        if (spoken) speak(data.reply, userLang);
      } else {
        const fallbackMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text:
            "I am an AI assistant exclusively dedicated to answering questions about Gagah Athallah Fatha. Please ask me about Gagah's projects, experience, or skills!",
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      }
    } catch {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: "Sorry, I am an AI assistant for Gagah Athallah Fatha. Please try asking again!",
      };
      setMessages((prev) => [...prev, errorMsg]);
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
        <ChatBackdrop />
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

            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[88%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "chat-user-bubble rounded-br-xs font-medium"
                      : "chat-bot-bubble rounded-bl-xs"
                  }`}
                >
                  {msg.sender === "bot"
                    ? renderFormattedText(msg.text)
                    : msg.text}
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="chat-thinking-indicator px-3.5 py-2.5 rounded-2xl text-xs flex items-center gap-2">
                <Loader2
                  size={15}
                  className="animate-spin"
                />
                <span className="font-medium">
                  Thinking...
                </span>
              </div>
            </div>
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
