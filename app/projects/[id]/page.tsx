'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import KnowledgeGraphView from '@/components/KnowledgeGraphView';
import ProcedureInspector from '@/components/ProcedureInspector';
import HandoverExporter from '@/components/HandoverExporter';
import AssistantChat from '@/components/AssistantChat';
import {
  Layers,
  FileText,
  GitCommit,
  ShieldCheck,
  FileCheck,
  MessageSquare,
  GitGraph,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  Sparkles,
  RefreshCw,
  FolderGit2,
  User,
  Tag,
  Check,
} from 'lucide-react';
import { cn, formatDate, formatRelativeTime } from '@/lib/utils';

export default function ProjectWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<any>(null);
  const [graphData, setGraphData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'memory' | 'decisions' | 'procedures' | 'handover' | 'assistant' | 'graph'>('overview');
  const [loading, setLoading] = useState(true);

  // Work Context Form state
  const [contextCategory, setContextCategory] = useState('PROGRESS');
  const [contextTitle, setContextTitle] = useState('');
  const [contextContent, setContextContent] = useState('');
  const [contextTags, setContextTags] = useState('kernel, testing');
  const [submittingContext, setSubmittingContext] = useState(false);

  // Decision Form state
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decTitle, setDecTitle] = useState('');
  const [decContext, setDecContext] = useState('');
  const [decOptions, setDecOptions] = useState('Option A: Sync ISR Polling\nOption B: Async Lock-Free Ring Buffer');
  const [decSelected, setDecSelected] = useState('');
  const [decReasoning, setDecReasoning] = useState('');
  const [decImpact, setDecImpact] = useState('');
  const [submittingDec, setSubmittingDec] = useState(false);

  // Task Form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('MEDIUM');

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const [projRes, graphRes] = await Promise.all([
        fetch(`/api/projects/${projectId}`),
        fetch(`/api/projects/${projectId}/graph`),
      ]);

      const projJson = await projRes.json();
      const graphJson = await graphRes.json();

      setProject(projJson.project);
      setGraphData(graphJson.graph);
    } catch (err) {
      console.error('Failed to fetch project workspace data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectData();
    }
  }, [projectId]);

  const handleAddContext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contextTitle.trim() || !contextContent.trim()) return;

    try {
      setSubmittingContext(true);
      const tags = contextTags.split(',').map((t) => t.trim()).filter(Boolean);
      const res = await fetch(`/api/projects/${projectId}/context`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: contextCategory,
          title: contextTitle,
          content: contextContent,
          tags,
        }),
      });

      if (res.ok) {
        setContextTitle('');
        setContextContent('');
        fetchProjectData();
      }
    } catch (err) {
      console.error('Add context failed:', err);
    } finally {
      setSubmittingContext(false);
    }
  };

  const handleAddDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decTitle.trim() || !decContext.trim() || !decSelected.trim() || !decReasoning.trim()) return;

    try {
      setSubmittingDec(true);
      const options = decOptions.split('\n').map((o) => o.trim()).filter(Boolean);
      const res = await fetch(`/api/projects/${projectId}/decisions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: decTitle,
          context: decContext,
          optionsConsidered: options,
          selectedOption: decSelected,
          reasoning: decReasoning,
          expectedImpact: decImpact,
        }),
      });

      if (res.ok) {
        setShowDecisionModal(false);
        setDecTitle('');
        setDecContext('');
        setDecSelected('');
        setDecReasoning('');
        setDecImpact('');
        fetchProjectData();
      }
    } catch (err) {
      console.error('Add decision failed:', err);
    } finally {
      setSubmittingDec(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const res = await fetch(`/api/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTaskTitle,
          priority: newTaskPriority,
        }),
      });

      if (res.ok) {
        setNewTaskTitle('');
        fetchProjectData();
      }
    } catch (err) {
      console.error('Add task failed:', err);
    }
  };

  const handleToggleTaskStatus = async (task: any) => {
    const nextStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      await fetch(`/api/projects/${projectId}/tasks`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: task.id,
          status: nextStatus,
        }),
      });
      fetchProjectData();
    } catch (err) {
      console.error('Toggle task status failed:', err);
    }
  };

  if (loading || !project) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex items-center gap-3 text-slate-400 font-mono text-xs">
            <RefreshCw className="h-4 w-4 animate-spin text-brand-400" />
            <span>Loading Project Memory Cockpit...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar currentProjectTitle={project.name} onSeedSuccess={fetchProjectData} />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 pb-24 md:pb-12">
          {/* Project Header Banner */}
          <div className="rounded-2xl border border-border bg-surface-card p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-brand-500/20 px-2.5 py-0.5 text-[10px] font-mono font-bold text-brand-300 border border-brand-500/30">
                    {project.priority} PRIORITY
                  </span>
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-300 border border-emerald-500/30">
                    {project.status}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {project.name}
                </h1>
                <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
                  {project.objective}
                </p>
              </div>

              {/* Progress Ring / Gauge */}
              <div className="flex items-center gap-4 bg-surface p-3 rounded-xl border border-border shrink-0">
                <div>
                  <div className="text-xs font-mono text-slate-400">Task Completion</div>
                  <div className="text-lg font-bold text-white">{project.progress}%</div>
                </div>
                <div className="h-10 w-20 bg-surface-raised rounded-full overflow-hidden p-1 border border-border">
                  <div
                    className="h-full bg-gradient-to-r from-brand-600 to-emerald-400 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Team Members Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border text-xs text-slate-400">
              <span className="font-mono text-[11px] text-slate-500">Team:</span>
              {(project.teamMembers || []).map((m: string, i: number) => (
                <span key={i} className="rounded-full bg-surface-raised px-2.5 py-0.5 text-[11px] text-slate-300 border border-border">
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto border-b border-border pb-1">
            {[
              { id: 'overview', label: 'Overview & Tasks', icon: FolderGit2 },
              { id: 'memory', label: `Work Memory (${project.workContexts?.length || 0})`, icon: Layers },
              { id: 'decisions', label: `Decisions (${project.decisions?.length || 0})`, icon: GitCommit },
              { id: 'procedures', label: `Procedures (${project.procedures?.length || 0})`, icon: ShieldCheck },
              { id: 'handover', label: 'Handover Studio', icon: FileCheck },
              { id: 'assistant', label: 'Knowledge QA', icon: MessageSquare },
              { id: 'graph', label: 'Continuity Graph', icon: GitGraph },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition-all',
                    isActive
                      ? 'bg-brand-600 text-white shadow-glow-brand'
                      : 'bg-surface text-slate-400 hover:text-slate-200 border border-border'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW & TASKS */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Task Pipeline (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                <div className="rounded-2xl border border-border bg-surface-card p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                      Technical Milestones & Tasks ({project.tasks?.length || 0})
                    </h2>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Click checkmark to toggle complete
                    </span>
                  </div>

                  {/* Add Quick Task Form */}
                  <form onSubmit={handleAddTask} className="flex gap-2">
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="Add a new milestone or verification step..."
                      className="flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-brand-500 focus:outline-none"
                    />
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value)}
                      className="rounded-xl border border-border bg-surface px-2.5 py-2 text-xs text-slate-300"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                    <button
                      type="submit"
                      className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-glow-brand hover:bg-brand-500"
                    >
                      Add
                    </button>
                  </form>

                  {/* Tasks List */}
                  <div className="space-y-2">
                    {project.tasks.map((task: any) => {
                      const isDone = task.status === 'COMPLETED';
                      const isBlocked = task.status === 'BLOCKED';
                      return (
                        <div
                          key={task.id}
                          className={cn(
                            'flex items-center justify-between p-3 rounded-xl border transition-colors',
                            isDone
                              ? 'bg-surface/50 border-border opacity-70'
                              : isBlocked
                              ? 'bg-rose-950/20 border-rose-900/40'
                              : 'bg-surface border-border hover:border-slate-600'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleToggleTaskStatus(task)}
                              className={cn(
                                'h-5 w-5 rounded-md border flex items-center justify-center transition-colors',
                                isDone
                                  ? 'bg-emerald-600 border-emerald-500 text-white'
                                  : 'border-slate-600 hover:border-brand-400'
                              )}
                            >
                              {isDone && <Check className="h-3.5 w-3.5" />}
                            </button>
                            <div>
                              <span
                                className={cn(
                                  'text-xs font-medium block',
                                  isDone ? 'line-through text-slate-500' : 'text-slate-200'
                                )}
                              >
                                {task.title}
                              </span>
                              {task.assignee && (
                                <span className="text-[10px] text-slate-500 font-mono">
                                  Assignee: {task.assignee}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                'text-[10px] font-mono px-2 py-0.5 rounded-full border',
                                isBlocked
                                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                  : task.priority === 'HIGH'
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                  : 'bg-slate-800 text-slate-400 border-slate-700'
                              )}
                            >
                              {task.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Activity Stream (4 cols) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="rounded-2xl border border-border bg-surface-card p-5 space-y-3">
                  <h3 className="text-xs font-mono font-bold uppercase text-slate-400">
                    Live Memory Stream
                  </h3>
                  <div className="space-y-3">
                    {project.activities.map((act: any) => (
                      <div key={act.id} className="text-xs border-l-2 border-brand-500 pl-3 py-1 space-y-0.5">
                        <span className="font-semibold text-slate-200 block">{act.title}</span>
                        <p className="text-slate-400 text-[11px] line-clamp-2">{act.description}</p>
                        <span className="text-[10px] text-slate-500 font-mono block">
                          {formatRelativeTime(act.createdAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WORK MEMORY */}
          {activeTab === 'memory' && (
            <div className="space-y-6">
              {/* Add Memory Context Form */}
              <div className="rounded-2xl border border-border bg-surface-card p-5 space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-300">
                  Record Digital Work Context
                </h3>
                <form onSubmit={handleAddContext} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400 font-mono">Category</label>
                      <select
                        value={contextCategory}
                        onChange={(e) => setContextCategory(e.target.value)}
                        className="w-full rounded-xl border border-border bg-surface p-2 text-xs text-slate-100"
                      >
                        <option value="PROGRESS">PROGRESS LOG</option>
                        <option value="NOTE">WORK NOTE</option>
                        <option value="BLOCKED">ACTIVE BLOCKER</option>
                        <option value="ATTEMPT">FAILED ATTEMPT (DO NOT REPEAT)</option>
                        <option value="RESOURCE">RESOURCE / LINK</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-slate-400 font-mono">Title</label>
                      <input
                        type="text"
                        required
                        value={contextTitle}
                        onChange={(e) => setContextTitle(e.target.value)}
                        placeholder="e.g. Asynchronous DMA buffer telemetry verified"
                        className="w-full rounded-xl border border-border bg-surface p-2 text-xs text-slate-100 placeholder-slate-500 focus:border-brand-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400 font-mono">Context Details & Observations</label>
                    <textarea
                      required
                      rows={3}
                      value={contextContent}
                      onChange={(e) => setContextContent(e.target.value)}
                      placeholder="Detail technical findings, bench measurements, or root causes..."
                      className="w-full rounded-xl border border-border bg-surface p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-brand-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2">
                      <Tag className="h-3.5 w-3.5 text-slate-500" />
                      <input
                        type="text"
                        value={contextTags}
                        onChange={(e) => setContextTags(e.target.value)}
                        placeholder="Tags comma separated"
                        className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-slate-300 w-48"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingContext}
                      className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-glow-brand hover:bg-brand-500 disabled:opacity-50"
                    >
                      {submittingContext ? 'Saving...' : 'Save Context to Memory'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Memory Context Stream Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.workContexts.map((ctx: any) => {
                  const isAttempt = ctx.category === 'ATTEMPT';
                  const isBlocker = ctx.category === 'BLOCKED';

                  return (
                    <div
                      key={ctx.id}
                      className={cn(
                        'rounded-2xl border p-5 space-y-3 shadow-sm',
                        isAttempt
                          ? 'border-rose-900/40 bg-rose-950/20'
                          : isBlocker
                          ? 'border-amber-900/40 bg-amber-950/20'
                          : 'border-border bg-surface-card'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={cn(
                            'rounded px-2 py-0.5 text-[10px] font-mono font-bold uppercase',
                            isAttempt
                              ? 'bg-rose-500/20 text-rose-300'
                              : isBlocker
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-brand-500/20 text-brand-300'
                          )}
                        >
                          {ctx.category}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {formatRelativeTime(ctx.createdAt)}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white">{ctx.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{ctx.content}</p>

                      <div className="flex flex-wrap items-center justify-between pt-2 border-t border-border text-[11px] text-slate-400 font-mono">
                        <span>By {ctx.author}</span>
                        <div className="flex gap-1">
                          {(ctx.tags || []).map((t: string, ti: number) => (
                            <span key={ti} className="bg-surface px-1.5 py-0.5 rounded text-[10px] text-slate-400">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: DECISIONS */}
          {activeTab === 'decisions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">Architectural Decision Records (ADRs)</h2>
                  <p className="text-xs text-slate-400">
                    Chronological record of technical trade-offs, rationale, and selected approaches.
                  </p>
                </div>

                <button
                  onClick={() => setShowDecisionModal(true)}
                  className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500 shadow-sm transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span>Record Decision</span>
                </button>
              </div>

              <div className="space-y-4">
                {project.decisions.map((dec: any) => (
                  <div key={dec.id} className="rounded-2xl border border-purple-500/30 bg-surface-card p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-purple-300 border border-purple-500/30">
                        {dec.status}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Recorded on {formatDate(dec.createdAt)} by {dec.author}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white">{dec.title}</h3>

                    <div className="text-xs text-slate-300 bg-surface-raised p-3 rounded-xl border border-border space-y-1">
                      <span className="font-semibold text-slate-400 font-mono block uppercase text-[10px]">Context & Problem:</span>
                      <p>{dec.context}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="rounded-xl bg-purple-950/20 border border-purple-900/40 p-3">
                        <span className="font-mono text-[10px] font-bold text-purple-300 uppercase block">Selected Approach:</span>
                        <p className="font-semibold text-slate-100 mt-1">{dec.selectedOption}</p>
                      </div>

                      <div className="rounded-xl bg-surface-raised border border-border p-3">
                        <span className="font-mono text-[10px] font-bold text-slate-400 uppercase block">Reasoning / Rationale:</span>
                        <p className="text-slate-200 mt-1">{dec.reasoning}</p>
                      </div>
                    </div>

                    {dec.expectedImpact && (
                      <div className="text-[11px] text-slate-400 font-mono pt-1">
                        Expected Impact: <span className="text-slate-200">{dec.expectedImpact}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROCEDURES */}
          {activeTab === 'procedures' && (
            <div className="space-y-6">
              {project.procedures.length > 0 ? (
                <ProcedureInspector
                  procedure={project.procedures[0]}
                  projectId={project.id}
                  onUpdate={fetchProjectData}
                />
              ) : (
                <div className="p-12 text-center text-xs text-slate-500 bg-surface-card rounded-2xl border border-border">
                  No procedures defined for this project yet.
                </div>
              )}
            </div>
          )}

          {/* TAB 5: HANDOVER STUDIO */}
          {activeTab === 'handover' && (
            <HandoverExporter
              handover={project.handovers[0]}
              projectId={project.id}
              onRegenerate={fetchProjectData}
            />
          )}

          {/* TAB 6: ASSISTANT QA */}
          {activeTab === 'assistant' && (
            <AssistantChat projectId={project.id} projectName={project.name} />
          )}

          {/* TAB 7: KNOWLEDGE GRAPH */}
          {activeTab === 'graph' && graphData && (
            <div className="h-[600px] w-full">
              <KnowledgeGraphView
                nodes={graphData.nodes}
                edges={graphData.edges}
                projectName={project.name}
              />
            </div>
          )}
        </main>
      </div>

      {/* Record Decision Modal */}
      {showDecisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-surface-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-base font-bold text-white">Record Architectural Decision (ADR)</h2>
              <button
                onClick={() => setShowDecisionModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-surface-raised"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDecision} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Decision Title *</label>
                <input
                  type="text"
                  required
                  value={decTitle}
                  onChange={(e) => setDecTitle(e.target.value)}
                  placeholder="e.g. ADR-06: Event-driven Webhook streaming vs Sync Poll"
                  className="w-full rounded-xl border border-border bg-surface p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Problem & Context *</label>
                <textarea
                  required
                  rows={2}
                  value={decContext}
                  onChange={(e) => setDecContext(e.target.value)}
                  placeholder="What constraint or issue forced this decision?"
                  className="w-full rounded-xl border border-border bg-surface p-2 text-xs text-slate-100 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Options Considered (Line separated)</label>
                <textarea
                  rows={2}
                  value={decOptions}
                  onChange={(e) => setDecOptions(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface p-2 text-xs text-slate-100 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-purple-300">Selected Option *</label>
                <input
                  type="text"
                  required
                  value={decSelected}
                  onChange={(e) => setDecSelected(e.target.value)}
                  placeholder="e.g. Option B: Async Lock-Free Ring Buffer"
                  className="w-full rounded-xl border border-purple-500/50 bg-purple-950/20 p-2.5 text-xs text-purple-100 placeholder-purple-400/50 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Reasoning / Rationale *</label>
                <textarea
                  required
                  rows={2}
                  value={decReasoning}
                  onChange={(e) => setDecReasoning(e.target.value)}
                  placeholder="Why was this option chosen over the alternatives?"
                  className="w-full rounded-xl border border-border bg-surface p-2 text-xs text-slate-100 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Expected Impact</label>
                <input
                  type="text"
                  value={decImpact}
                  onChange={(e) => setDecImpact(e.target.value)}
                  placeholder="e.g. Zero CPU spikes, +1.8% efficiency"
                  className="w-full rounded-xl border border-border bg-surface p-2 text-xs text-slate-100 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowDecisionModal(false)}
                  className="rounded-xl border border-border bg-surface-raised px-4 py-2 text-xs font-medium text-slate-300 hover:bg-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingDec}
                  className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-semibold text-white hover:bg-purple-500 shadow-sm disabled:opacity-50"
                >
                  {submittingDec ? 'Recording...' : 'Record ADR'}
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
