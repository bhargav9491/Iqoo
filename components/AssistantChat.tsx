'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssistantChatProps {
  projectId: string;
  projectName: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: any[];
  missingContextNotes?: string | null;
}

export default function AssistantChat({ projectId, projectName }: AssistantChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I am the AUREVEX Knowledge Assistant for "${projectName}". Ask me about architectural decisions, work context, why specific approaches were selected or rejected, or current blockers. All answers are grounded directly in documented project records.`,
      citations: [],
    },
  ]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const samplePrompts = [
    'Why did we choose the async ring buffer over synchronous polling?',
    'What failed approaches were recorded during testing?',
    'What are the active blockers on this project?',
    'What is the current status of the 120W thermal verification?',
  ];

  const handleSend = async (questionText?: string) => {
    const q = questionText || query;
    if (!q.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: q };
    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetch(`/api/projects/${projectId}/assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.answer,
            citations: data.citations || [],
            missingContextNotes: data.missingContextNotes,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'An error occurred while querying project records.',
            citations: [],
          },
        ]);
      }
    } catch (err) {
      console.error('Assistant QA error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full rounded-2xl border border-border bg-surface-card overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-surface px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600/20 text-brand-400 border border-brand-500/30">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
              PROJECT KNOWLEDGE ASSISTANT
              <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[9px] text-emerald-300 font-normal">
                GROUNDED RAG
              </span>
            </h3>
            <span className="text-[10px] text-slate-400">Strictly cites stored decisions, context, and procedures</span>
          </div>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              'flex flex-col max-w-[88%]',
              msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
            )}
          >
            <div
              className={cn(
                'rounded-2xl p-4 text-xs leading-relaxed',
                msg.role === 'user'
                  ? 'bg-brand-600 text-white shadow-glow-brand'
                  : 'bg-surface-raised border border-border text-slate-200'
              )}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {/* Citations Box */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border/80 space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-brand-300 uppercase tracking-wider block">
                    Referenced Project Citations ({msg.citations.length}):
                  </span>
                  {msg.citations.map((c, ci) => (
                    <div
                      key={ci}
                      className="rounded bg-surface p-2 border border-border text-[11px] text-slate-300"
                    >
                      <span className="font-semibold text-brand-300 block">{c.title}</span>
                      <span className="text-slate-400 text-[10px]">{c.snippet}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Missing Context Warning */}
              {msg.missingContextNotes && (
                <div className="mt-2.5 rounded bg-amber-950/30 border border-amber-500/30 p-2 text-[10px] text-amber-200 flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span>{msg.missingContextNotes}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-surface-raised p-3 rounded-xl border border-border max-w-xs">
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-brand-400" />
            <span>Scanning project memory graph & decisions...</span>
          </div>
        )}
      </div>

      {/* Sample Quick Queries */}
      <div className="border-t border-border bg-surface/50 p-2.5 overflow-x-auto flex gap-2">
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="whitespace-nowrap rounded-lg border border-border bg-surface px-2.5 py-1 text-[11px] text-slate-300 hover:bg-surface-raised hover:border-brand-500/40 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="border-t border-border bg-surface p-3 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask project question (e.g., Why did we reject synchronous polling?)..."
          className="flex-1 rounded-xl border border-border bg-surface-card px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !query.trim()}
          className="flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-glow-brand hover:bg-brand-500 transition-all disabled:opacity-50"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
