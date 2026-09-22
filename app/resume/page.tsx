'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import {
  PlayCircle,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Layers,
  GitCommit,
  FolderGit2,
} from 'lucide-react';
import { formatDate, formatRelativeTime } from '@/lib/utils';

export default function ResumePage() {
  const [resumeData, setResumeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchResumeData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/resume/my-work');
      const data = await res.json();
      setResumeData(data);
    } catch (err) {
      console.error('Failed to fetch resume state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumeData();
  }, []);

  if (loading || !resumeData?.project) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex items-center gap-3 text-slate-400 font-mono text-xs">
            <RefreshCw className="h-4 w-4 animate-spin text-brand-400" />
            <span>Reconstructing Work Memory & Continuity State...</span>
          </div>
        </div>
      </div>
    );
  }

  const { project, resumeState } = resumeData;

  return (
    <div className="min-h-screen bg-background">
      <Navbar currentProjectTitle={project.name} onSeedSuccess={fetchResumeData} />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 pb-24 md:pb-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-300">
                  CONTINUITY RECOVERY ENGINE
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">
                Resume My Work
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Instant catch-up on your last active state, pending items, decisions, and recommended next steps.
              </p>
            </div>

            <Link
              href={`/projects/${project.id}`}
              className="flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white shadow-glow-brand hover:bg-brand-500 transition-all"
            >
              <span>Continue in Project Workspace</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* AI Recommended Next Action (Top Highlight) */}
          <div className="rounded-2xl border border-brand-500/50 bg-gradient-to-r from-brand-950/70 via-surface-card to-surface-raised p-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-300">
              <Sparkles className="h-4 w-4 text-brand-400" />
              <span>AI RECOMMENDED NEXT ACTION</span>
              <span className="ml-auto rounded bg-brand-500/20 px-2 py-0.5 text-[10px] text-brand-300 border border-brand-500/30">
                {resumeState.suggestedNextAction.priority} PRIORITY
              </span>
            </div>

            <h2 className="text-lg font-bold text-white mt-2">
              {resumeState.suggestedNextAction.title}
            </h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {resumeState.suggestedNextAction.rationale}
            </p>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Grounded in project context & pending tasks</span>
              <span className="text-slate-400">Last activity recorded {formatRelativeTime(project.updatedAt)}</span>
            </div>
          </div>

          {/* Where You Left Off Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 6 cols: Last Known State & Pending Tasks */}
            <div className="lg:col-span-6 space-y-6">
              {/* Last Recorded Context */}
              <div className="rounded-2xl border border-border bg-surface-card p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 uppercase">
                  <Layers className="h-4 w-4 text-brand-400" />
                  <span>Where You Left Off (Last Context)</span>
                </div>
                <div className="rounded-xl bg-surface-raised p-4 border border-border">
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {resumeState.lastActiveContext}
                  </p>
                </div>
              </div>

              {/* Pending Items & Blockers */}
              <div className="rounded-2xl border border-border bg-surface-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-amber-400 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Unfinished Work Items ({resumeState.pendingSummary.length})</span>
                  </span>
                </div>
                <div className="space-y-2">
                  {resumeState.pendingSummary.map((item: string, i: number) => (
                    <div key={i} className="rounded-lg bg-surface p-3 text-xs text-slate-200 border border-border flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {resumeState.blockers.length > 0 && (
                  <div className="border-t border-border pt-3 mt-3">
                    <span className="text-[11px] font-mono font-bold text-rose-400 uppercase flex items-center gap-1.5 mb-2">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Active Blockers Requiring Resolution:
                    </span>
                    {resumeState.blockers.map((b: string, i: number) => (
                      <div key={i} className="rounded-lg bg-rose-950/20 border border-rose-900/40 p-2.5 text-xs text-rose-200">
                        {b}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right 6 cols: Crucial Decisions & Completed Milestones */}
            <div className="lg:col-span-6 space-y-6">
              {/* Important Decisions Context */}
              <div className="rounded-2xl border border-purple-500/30 bg-surface-card p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase">
                  <GitCommit className="h-4 w-4" />
                  <span>Crucial Architectural Decisions</span>
                </div>
                <div className="space-y-2.5">
                  {resumeState.crucialDecisions.map((dec: any) => (
                    <div key={dec.id} className="rounded-xl bg-purple-950/20 border border-purple-900/40 p-3 text-xs space-y-1">
                      <h4 className="font-bold text-white">{dec.title}</h4>
                      <p className="text-slate-300 text-[11px]">{dec.reasoning}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Completed Milestones */}
              <div className="rounded-2xl border border-border bg-surface-card p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Completed in Current Milestone ({resumeState.completedSummary.length})</span>
                </div>
                <div className="space-y-1.5">
                  {resumeState.completedSummary.map((item: string, i: number) => (
                    <div key={i} className="text-xs text-slate-300 flex items-center gap-2 py-1">
                      <span className="text-emerald-400">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
