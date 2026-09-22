"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import {
  BrainCircuit,
  MessageSquare,
  X,
  Send,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);
  const [isTyping, setIsTyping] = useState(false);

  const { workspace, memory } = useAppStore();

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    const userMsg = query;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userMsg },
    ]);

    setQuery("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: getResponse(userMsg),
        },
      ]);
    }, 1000);
  };

  const getResponse = (q: string) => {
    const lower = q.toLowerCase();

    if (lower.includes("why") && lower.includes("buffer")) {
      return "Asynchronous lock-free buffering was selected to handle 50,000 metrics/second without thread contention, after synchronous polling failed during high-frequency telemetry trials.";
    }

    if (lower.includes("where") && lower.includes("stop")) {
      return `The previous engineer stopped after completing: "${memory.lastCompleted}".`;
    }

    if (lower.includes("what failed")) {
      return `Failed attempt: ${memory.failedAttempt}. Reason: ${
        memory.failedReason || "Unknown"
      }.`;
    }

    if (
      lower.includes("what should i do") ||
      lower.includes("next")
    ) {
      return `The next recommended action is to: ${
        memory.recommendedAction || memory.nextStep
      }.`;
    }

    if (
      lower.includes("show me") &&
      lower.includes("handover")
    ) {
      return "You can view and generate the complete handover report by navigating to the Handover page from the sidebar.";
    }

    if (lower.includes("blocked")) {
      return `Currently blocked by: ${memory.currentBlocker}.`;
    }

    return "I don't have grounded evidence for that in the current workspace.";
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-black rounded-full shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center hover:scale-105 transition-transform z-40"
      >
        <MessageSquare size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 glass-panel flex flex-col z-50 overflow-hidden shadow-2xl"
            style={{ height: "500px", maxHeight: "80vh" }}
          >
            <div className="bg-surface p-4 border-b border-border flex justify-between items-center">
              <div className="flex items-center gap-2 text-primary font-bold tracking-wider uppercase text-sm">
                <BrainCircuit size={18} />
                AUREVEX Intelligence
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-textMuted hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-background flex flex-col gap-4">
              {messages.length === 0 && (
                <div className="text-center text-textMuted mt-10 text-sm">
                  <BrainCircuit
                    size={32}
                    className="mx-auto mb-3 opacity-20"
                  />

                  <p>
                    Ask me about decisions, context, or what to
                    do next in the {workspace} workspace.
                  </p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={clsx(
                    "max-w-[85%] rounded p-3 text-sm",
                    msg.role === "user"
                      ? "bg-surface border border-border self-end text-white rounded-tr-none"
                      : "bg-primary/10 border border-primary/20 self-start text-white rounded-tl-none"
                  )}
                >
                  {msg.role === "ai" && (
                    <div className="text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">
                      AUREVEX
                    </div>
                  )}

                  {msg.text}
                </div>
              ))}

              {isTyping && (
                <div className="bg-primary/10 border border-primary/20 self-start text-white rounded rounded-tl-none p-3 flex items-center gap-2">
                  <Loader2
                    size={14}
                    className="animate-spin text-primary"
                  />

                  <span className="text-xs text-primary">
                    Analyzing work memory...
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 bg-surface border-t border-border">
              <form
                onSubmit={handleSend}
                className="relative"
              >
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask AUREVEX..."
                  className="w-full bg-background border border-border rounded-full pl-4 pr-10 py-2 text-sm text-white focus:outline-none focus:border-primary"
                />

                <button
                  type="submit"
                  disabled={!query.trim() || isTyping}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-primary disabled:text-textMuted p-1 hover:bg-white/5 rounded-full"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}