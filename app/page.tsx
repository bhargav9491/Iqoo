"use client";

import { useAppStore } from '@/lib/store';
import { 
  Activity, 
  BrainCircuit, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const tasks = useAppStore(state => state.tasks);
  const decisions = useAppStore(state => state.decisions);
  const procedures = useAppStore(state => state.procedures);
  const memory = useAppStore(state => state.memory);

  const activeTasks = tasks.filter(t => t.status !== 'Completed').length;
  const blockedTasks = tasks.filter(t => t.status === 'Blocked').length;
  const verifiedProcedures = procedures.filter(p => p.steps.every(s => s.status === 'Verified')).length;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight">Engineering Work Intelligence</h1>
        <p className="text-textMuted mt-2 text-lg">Persistent memory for engineering teams.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6">
          <div className="flex items-center gap-3 text-textMuted mb-2">
            <Activity size={18} className="text-secondary" />
            <span className="text-xs font-bold uppercase tracking-wider">Active Tasks</span>
          </div>
          <p className="text-3xl font-mono text-white">{activeTasks}</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6">
          <div className="flex items-center gap-3 text-textMuted mb-2">
            <BrainCircuit size={18} className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider">Saved Decisions</span>
          </div>
          <p className="text-3xl font-mono text-white">{decisions.length}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel p-6">
          <div className="flex items-center gap-3 text-textMuted mb-2">
            <ShieldAlert size={18} className="text-warning" />
            <span className="text-xs font-bold uppercase tracking-wider">Pending Reviews</span>
          </div>
          <p className="text-3xl font-mono text-white">{procedures.length - verifiedProcedures}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-panel p-6">
          <div className="flex items-center gap-3 text-textMuted mb-2">
            <CheckCircle2 size={18} className="text-success" />
            <span className="text-xs font-bold uppercase tracking-wider">Handover Readiness</span>
          </div>
          <p className="text-3xl font-mono text-white">94%</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="glass-panel p-8 flex flex-col">
          <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
            <Clock size={20} className="text-primary" /> Current Work
          </h2>
          <div className="mb-6">
            <p className="text-xs uppercase text-textMuted tracking-wider mb-1">Project</p>
            <p className="text-lg font-medium text-white">{memory.project}</p>
          </div>
          <div className="mb-6 flex-1">
            <p className="text-xs uppercase text-textMuted tracking-wider mb-1">Current Focus</p>
            <p className="text-textMain border-l-2 border-primary/50 pl-3 py-1">
              {tasks[0]?.description || memory.nextStep}
            </p>
          </div>
          <Link href="/memory" className="btn-primary inline-flex items-center justify-center gap-2 mt-auto self-start">
            Resume Work <ArrowRight size={16} />
          </Link>
        </motion.div>

        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="glass-panel p-8 border-l-4 border-l-danger">
            <h2 className="text-lg font-bold text-white mb-4 uppercase tracking-widest flex items-center gap-2 text-danger">
              <AlertTriangle size={20} /> Current Blocker
            </h2>
            <p className="text-xl font-medium text-white mb-2">{memory.currentBlocker}</p>
            <div className="flex justify-between items-end mt-6">
              <div>
                <p className="text-xs uppercase text-textMuted tracking-wider mb-1">Status</p>
                <p className="text-sm font-medium text-warning">Awaiting engineer review</p>
              </div>
              <Link href="/procedure" className="btn-secondary">
                Resolve
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="glass-panel p-8">
            <h2 className="text-lg font-bold text-white mb-4 uppercase tracking-widest">
              Next Recommended Actions
            </h2>
            <ul className="space-y-4 mt-6">
              {memory.recommendedAction && (
                <li className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">1</div>
                  <p className="text-textMain text-sm">{memory.recommendedAction}</p>
                </li>
              )}
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-surface text-textMuted flex items-center justify-center text-xs font-bold shrink-0">2</div>
                <p className="text-textMain text-sm">Review thermal delta evidence</p>
              </li>
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-surface text-textMuted flex items-center justify-center text-xs font-bold shrink-0">3</div>
                <p className="text-textMain text-sm">Complete Step 05 engineer sign-off</p>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
