"use client";

import { useState, useEffect, useRef } from "react";
import { X, ChevronDown, MessageSquare, Loader2 } from "lucide-react";

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

export default function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  if (!isOpen) return null;

  async function handleSend() {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
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
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
        onClick={onClose}
      />

      {/* Slide-over Right Chat Panel */}
      <aside className="chat-panel-container fixed right-0 top-0 bottom-0 z-50 border-l border-neutral-200 dark:border-[#3f3f3f] shadow-2xl transition-all duration-300 ease-in-out flex flex-col w-full md:left-[calc(50%+384px)] md:right-0 md:w-auto min-w-[280px]">
        {/* Header - Clean minimal close button aligned with Navbar */}
        <div className="flex items-center justify-end px-4 md:px-6 h-14 border-b border-neutral-200 dark:border-[#3f3f3f] shrink-0">
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
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-hide">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400 dark:text-neutral-500">
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">
                How can I help you?
              </p>
              <p className="text-xs text-neutral-400 dark:text-neutral-400">
                Ask anything about Gagah&apos;s projects, skills, or background.
              </p>
            </div>
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
        <div className="p-4 border-t border-neutral-200/60 dark:border-[#3f3f3f]">
          <div className="chat-input-card rounded-2xl p-3 flex flex-col justify-between gap-3 shadow-xs">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="How can I help you?"
              className="chat-input-field w-full bg-transparent text-xs sm:text-sm outline-none border-none focus:outline-none disabled:opacity-50"
            />

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                className="chat-pill-btn inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer"
              >
                <MessageSquare size={12} />
                <span>Chat</span>
                <ChevronDown size={12} />
              </button>
            </div>
          </div>
        </div>
      </aside>

    </>
  );
}
