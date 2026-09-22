'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import {
  FolderGit2,
  PlayCircle,
  Clock,
  ShieldAlert,
  Layers,
  ArrowRight,
  Plus,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Activity,
  FileCheck,
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

export default function DashboardPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [resumeData, setResumeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [projRes, resumeRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/resume/my-work'),
      ]);

      const projJson = await projRes.json();
      const resumeJson = await resumeRes.json();

      setProjects(projJson.projects || []);
      setResumeData(resumeJson);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const primaryProject = projects[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSeedSuccess={fetchDashboardData} />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 pb-24 md:pb-12">
          {/* Top Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Work Intelligence Command
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Overview of preserved work memory, active projects, and procedure deviations.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/projects"
                className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-glow-brand hover:bg-brand-500 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>New Project</span>
              </Link>
            </div>
          </div>

          {/* Quick Resume Hero Banner */}
          {resumeData?.project && resumeData?.resumeState && (
            <div className="rounded-2xl border border-brand-500/40 bg-gradient-to-r from-brand-950/60 via-surface-card to-surface-raised p-5 sm:p-6 shadow-xl relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-300">
                      INTERRUPTED WORK RECOVERY
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    {resumeData.project.name}
                  </h2>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {resumeData.resumeState.lastActiveContext}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                    <span className="bg-surface px-2.5 py-1 rounded border border-border">
                      {resumeData.resumeState.pendingSummary.length} pending items
                    </span>
                    {resumeData.resumeState.blockers.length > 0 && (
                      <span className="bg-rose-950/40 text-rose-300 border border-rose-800/40 px-2.5 py-1 rounded flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {resumeData.resumeState.blockers.length} active blocker
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col items-end gap-2 shrink-0">
                  <Link
                    href="/resume"
                    className="flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white shadow-glow-brand hover:bg-brand-500 transition-all"
                  >
                    <PlayCircle className="h-4 w-4" />
                    <span>Resume My Work</span>
                  </Link>
                  <Link
                    href={`/projects/${resumeData.project.id}`}
                    className="text-xs text-brand-300 hover:underline flex items-center gap-1"
                  >
                    <span>Open Project Workspace</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-border bg-surface-card p-4 space-y-1">
              <span className="text-[11px] font-mono uppercase text-slate-500">Active Projects</span>
              <div className="text-xl font-bold text-white">{projects.length}</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span>100% synchronized</span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface-card p-4 space-y-1">
              <span className="text-[11px] font-mono uppercase text-slate-500">Decisions Recorded</span>
              <div className="text-xl font-bold text-purple-300">
                {projects.reduce((acc, p) => acc + (p._count?.decisions || 0), 0)}
              </div>
              <div className="text-[10px] text-slate-400">Architectural ADRs</div>
            </div>

            <div className="rounded-2xl border border-border bg-surface-card p-4 space-y-1">
              <span className="text-[11px] font-mono uppercase text-slate-500">Procedure Audits</span>
              <div className="text-xl font-bold text-amber-300">
                {projects.reduce((acc, p) => acc + (p._count?.procedures || 0), 0)}
              </div>
              <div className="text-[10px] text-amber-400">Active review protocol</div>
            </div>

            <div className="rounded-2xl border border-border bg-surface-card p-4 space-y-1">
              <span className="text-[11px] font-mono uppercase text-slate-500">Memory Continuity</span>
              <div className="text-xl font-bold text-brand-300">Active</div>
              <div className="text-[10px] text-slate-400">Grounded RAG enabled</div>
            </div>
          </div>

          {/* Active Projects & Recent Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Active Projects (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <FolderGit2 className="h-4 w-4 text-brand-400" />
                  <span>Active Workspaces ({projects.length})</span>
                </h2>
                <Link href="/projects" className="text-xs text-brand-400 hover:underline">
                  View all
                </Link>
              </div>

              <div className="space-y-3">
                {projects.map((proj) => (
                  <Link
                    key={proj.id}
                    href={`/projects/${proj.id}`}
                    className="group block rounded-2xl border border-border bg-surface-card p-5 hover:border-brand-500/50 transition-all hover:bg-surface-raised shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-brand-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-brand-300 border border-brand-500/30">
                            {proj.priority} PRIORITY
                          </span>
                          <h3 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors">
                            {proj.name}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">{proj.objective}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-200">{proj.progress}%</span>
                          <span className="text-[10px] text-slate-500 block">Progress</span>
                        </div>
                        <div className="h-8 w-16 bg-surface rounded-full overflow-hidden p-0.5 border border-border">
                          <div
                            className="h-full bg-gradient-to-r from-brand-600 to-emerald-400 rounded-full"
                            style={{ width: `${proj.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2 font-mono">
                      <div className="flex items-center gap-3">
                        <span>{proj._count?.workContexts || 0} memory logs</span>
                        <span>•</span>
                        <span>{proj._count?.decisions || 0} decisions</span>
                        <span>•</span>
                        <span>{proj._count?.procedures || 0} procedures</span>
                      </div>
                      <span className="text-slate-400">Updated {formatRelativeTime(proj.updatedAt)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Decisions & Activity Feed (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Quick Actions / Shortcuts */}
              <div className="rounded-2xl border border-border bg-surface-card p-5 space-y-3">
                <h3 className="text-xs font-mono font-bold uppercase text-slate-400">Intelligence Quick Links</h3>
                <div className="space-y-2">
                  <Link
                    href="/resume"
                    className="flex items-center justify-between rounded-xl bg-surface p-3 text-xs text-slate-200 hover:bg-surface-raised border border-border hover:border-brand-500/40 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <PlayCircle className="h-4 w-4 text-brand-400" />
                      <span>Resume My Work</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                  </Link>

                  <Link
                    href="/decisions"
                    className="flex items-center justify-between rounded-xl bg-surface p-3 text-xs text-slate-200 hover:bg-surface-raised border border-border hover:border-purple-500/40 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-400" />
                      <span>Decision Time Machine</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                  </Link>

                  <Link
                    href="/procedures"
                    className="flex items-center justify-between rounded-xl bg-surface p-3 text-xs text-slate-200 hover:bg-surface-raised border border-border hover:border-amber-500/40 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-amber-400" />
                      <span>Procedure Intelligence</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                  </Link>

                  <Link
                    href="/graph"
                    className="flex items-center justify-between rounded-xl bg-surface p-3 text-xs text-slate-200 hover:bg-surface-raised border border-border hover:border-cyan-500/40 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-cyan-400" />
                      <span>Knowledge Graph</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                  </Link>
                </div>
              </div>

              {/* Responsible AI Disclaimer */}
              <div className="rounded-2xl border border-border bg-surface-card p-4 text-[11px] text-slate-400 leading-relaxed space-y-1">
                <span className="font-semibold text-white block">Continuous Verification</span>
                <p>
                  Every state change updates project context automatically, ensuring zero unrecorded assumptions during team handovers.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
