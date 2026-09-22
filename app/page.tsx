"use client";

import { useAppStore } from '@/lib/store';
import { 
  Activity, 
  BrainCircuit, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowRight,
  ShieldAlert,
  FileOutput,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const tasks = useAppStore(state => state.tasks);
  const decisions = useAppStore(state => state.decisions);
  const procedures = useAppStore(state => state.procedures);
  const memory = useAppStore(state => state.memory);
  const workspace = useAppStore(state => state.workspace);

  const activeTasks = tasks.filter(t => t.status !== 'Completed').length;
  const blockedTasks = tasks.filter(t => t.status === 'Blocked').length;
  const verifiedSteps = procedures.flatMap(p => p.steps).filter(s => s.status === 'Verified').length;
  const totalSteps = procedures.flatMap(p => p.steps).length;

  const kpis = [
    { label: 'Active Tasks', value: activeTasks, icon: Activity, color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20' },
    { label: 'Saved Decisions', value: decisions.length, icon: BrainCircuit, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
    { label: 'Failed Attempts', value: 16, icon: XCircle, color: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/20' },
    { label: 'Verified Procedures', value: verifiedSteps, icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', border: 'border-success/20' },
    { label: 'Pending Reviews', value: procedures.length, icon: ShieldAlert, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20' },
    { label: 'Handover Readiness', value: '94%', icon: FileOutput, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-mono text-textMuted uppercase tracking-widest">
            {workspace === 'Engineering Demo' ? 'NORTHSTAR SYSTEMS LABS' : 'MBA STRATEGIC MANAGEMENT'}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Engineering Work Intelligence</h1>
        <p className="text-textMuted mt-1 text-base">Persistent memory for engineering teams. Remember → Explain → Verify → Transfer</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div 
              key={kpi.label}
              initial={{ opacity: 0, y: 12 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.07 }}
              className={`rounded-lg border p-4 ${kpi.bg} ${kpi.border}`}
            >
              <Icon size={16} className={`${kpi.color} mb-2`} />
              <p className="text-2xl font-mono font-bold text-white">{kpi.value}</p>
              <p className="text-[10px] uppercase tracking-wider text-textMuted mt-1 leading-tight">{kpi.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Main Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Work */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
          className="glass-panel p-8 flex flex-col"
        >
          <div className="flex items-center gap-2 mb-6">
            <Clock size={18} className="text-primary" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-textMuted">Current Work</h2>
          </div>

          <div className="mb-3">
            <p className="text-[10px] uppercase text-textMuted tracking-wider mb-1">Project</p>
            <p className="text-lg font-semibold text-white">{memory.project}</p>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-success/10 text-success border border-success/20 font-bold">ACTIVE</span>
            <span className="text-xs text-textMuted">{memory.lastActivityTime}</span>
          </div>

          <div className="flex-1 mb-6">
            <p className="text-[10px] uppercase text-textMuted tracking-wider mb-2">Current Focus</p>
            <p className="text-sm text-white leading-relaxed border-l-2 border-primary/50 pl-3 py-1">
              {tasks[0]?.description || memory.nextStep}
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-[10px] uppercase text-textMuted tracking-wider">Progress</span>
              <span className="text-xs font-mono text-primary">{memory.progress}%</span>
            </div>
            <div className="h-1.5 bg-background rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }} animate={{ width: `${memory.progress}%` }} transition={{ delay: 0.8, duration: 0.8 }}
                className="h-full bg-primary rounded-full"
              />
            </div>
          </div>

          <Link href="/memory" className="btn-primary inline-flex items-center justify-center gap-2 mt-auto">
            Resume Work <ArrowRight size={16} />
          </Link>
        </motion.div>

        <div className="space-y-8">
          {/* Current Blocker */}
          <motion.div 
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
            className="glass-panel p-6 border-l-4 border-l-danger"
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={16} className="text-danger" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-danger">Current Blocker</h2>
              <span className="ml-auto text-[10px] uppercase px-2 py-0.5 rounded bg-danger/10 text-danger border border-danger/20">HIGH</span>
            </div>
            <p className="text-lg font-semibold text-white mb-3">{memory.currentBlocker}</p>
            <p className="text-xs text-textMuted mb-4">Awaiting engineer review</p>
            <Link href="/procedure" className="btn-danger text-xs">Resolve →</Link>
          </motion.div>

          {/* Recommended Actions */}
          <motion.div 
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}
            className="glass-panel p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <CheckCircle2 size={16} className="text-primary" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-textMuted">Next Recommended Actions</h2>
            </div>
            <ol className="space-y-3">
              {[
                memory.recommendedAction,
                'Review thermal delta evidence',
                'Complete Step 05 engineer sign-off'
              ].filter(Boolean).map((action, i) => (
                <li key={i} className="flex items-start gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 transition-colors ${i === 0 ? 'bg-primary/20 text-primary' : 'bg-surface border border-border text-textMuted group-hover:border-primary/30'}`}>
                    {i + 1}
                  </div>
                  <p className="text-sm text-white group-hover:text-primary transition-colors">{action}</p>
                </li>
              ))}
            </ol>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
