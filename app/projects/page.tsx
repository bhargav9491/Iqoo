'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import {
  FolderGit2,
  Plus,
  Search,
  Filter,
  Layers,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // New Project Form state
  const [name, setName] = useState('');
  const [objective, setObjective] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('HIGH');
  const [teamMembersInput, setTeamMembersInput] = useState('Alex Chen, Sarah Lin, David K.');
  const [submitting, setSubmitting] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !objective.trim()) return;

    try {
      setSubmitting(true);
      const team = teamMembersInput.split(',').map((t) => t.trim()).filter(Boolean);
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          objective,
          description,
          priority,
          teamMembers: team,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setName('');
        setObjective('');
        setDescription('');
        fetchProjects();
      }
    } catch (err) {
      console.error('Project creation failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.objective.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSeedSuccess={fetchProjects} />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 pb-24 md:pb-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Workspaces & Projects
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Every project maintains its own isolated digital memory, decision log, and procedures.
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-glow-brand hover:bg-brand-500 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Create Project</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface-card p-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects by name, objective, or team member..."
                className="w-full rounded-xl border border-border bg-surface pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div className="text-xs text-slate-400 font-mono pr-2">
              {filteredProjects.length} Projects
            </div>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="group rounded-2xl border border-border bg-surface-card p-5 hover:border-brand-500/50 hover:bg-surface-raised transition-all shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded bg-brand-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-brand-300 border border-brand-500/30">
                      {p.priority} PRIORITY
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Updated {formatRelativeTime(p.updatedAt)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors mt-2">
                    {p.name}
                  </h3>

                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed line-clamp-2">
                    {p.objective}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Task Completion</span>
                    <span className="font-bold text-white">{p.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-surface rounded-full overflow-hidden border border-border">
                    <div
                      className="h-full bg-gradient-to-r from-brand-600 to-emerald-400 rounded-full"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <div className="flex items-center gap-3">
                      <span>{p._count?.workContexts || 0} memory logs</span>
                      <span>{p._count?.decisions || 0} decisions</span>
                    </div>
                    <span className="text-brand-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                      Open <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>

      {/* New Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-surface-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-base font-bold text-white">Create New Project Workspace</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-surface-raised"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Project Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. High-Availability Edge Stream Gateway"
                  className="w-full rounded-xl border border-border bg-surface p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Objective *</label>
                <textarea
                  required
                  rows={2}
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="What is the primary target and success criteria of this technical task?"
                  className="w-full rounded-xl border border-border bg-surface p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface p-2.5 text-xs text-slate-100 focus:border-brand-500 focus:outline-none"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Team Members</label>
                  <input
                    type="text"
                    value={teamMembersInput}
                    onChange={(e) => setTeamMembersInput(e.target.value)}
                    placeholder="Comma separated names"
                    className="w-full rounded-xl border border-border bg-surface p-2.5 text-xs text-slate-100 focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-border bg-surface-raised px-4 py-2 text-xs font-medium text-slate-300 hover:bg-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-brand-600 px-5 py-2 text-xs font-semibold text-white shadow-glow-brand hover:bg-brand-500 disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Initialize Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <MobileNav />
    </div>
  );
}
