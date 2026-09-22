"use client";

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { 
  BrainCircuit, 
  GitBranch, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal,
  XCircle,
  Lightbulb,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WorkMemory() {
  const memory = useAppStore(state => state.memory);
  const [isResuming, setIsResuming] = useState(false);
  const [resumed, setResumed] = useState(false);

  const handleResume = () => {
    setIsResuming(true);
    setTimeout(() => {
      setIsResuming(false);
      setResumed(true);
    }, 1500);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <BrainCircuit size={32} className="text-primary" />
          Instant Resume Engine
        </h1>
        <p className="text-textMuted mt-2 text-lg">Resume work with the context that was present when you stopped.</p>
      </header>

      <div className="glass-panel overflow-hidden">
        <div className="bg-surface p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-textMuted">Current Context</h2>
            <p className="text-xl font-bold text-white mt-1">{memory.project}</p>
          </div>
          
          <div className="flex gap-6 text-sm">
            <div className="flex flex-col items-end">
              <span className="text-textMuted flex items-center gap-1 uppercase tracking-wider text-[10px]">
                <GitBranch size={12} /> Branch
              </span>
              <span className="font-mono text-primary">{memory.branch}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-textMuted flex items-center gap-1 uppercase tracking-wider text-[10px]">
                <Clock size={12} /> Last Activity
              </span>
              <span className="text-white">{memory.lastActivityTime}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-textMuted uppercase tracking-wider text-[10px]">Progress</span>
              <span className="font-mono font-bold text-white">{memory.progress}%</span>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4">
            <div className="mt-1">
              <CheckCircle2 size={24} className="text-success" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-textMuted mb-1">Last Completed</p>
              <p className="text-lg text-white">{memory.lastCompleted}</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex gap-4 p-4 bg-danger/10 border border-danger/30 rounded-lg">
            <div className="mt-1">
              <AlertTriangle size={24} className="text-danger" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-danger mb-1">Current Blocker</p>
              <p className="text-lg text-white font-medium">{memory.currentBlocker}</p>
            </div>
          </motion.div>

          {memory.lastCommand && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex gap-4">
              <div className="mt-1">
                <Terminal size={24} className="text-textMuted" />
              </div>
              <div className="w-full">
                <p className="text-xs font-bold uppercase tracking-wider text-textMuted mb-1">Last Command</p>
                <div className="bg-background border border-border p-3 rounded font-mono text-sm text-primary w-full">
                  {memory.lastCommand}
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-border/50">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex gap-4">
              <div className="mt-1">
                <XCircle size={20} className="text-warning" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-textMuted mb-1">Failed Attempt</p>
                <p className="text-sm text-white mb-2">{memory.failedAttempt}</p>
                {memory.failedReason && (
                  <p className="text-xs text-textMuted italic">Why: {memory.failedReason}</p>
                )}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex gap-4">
              <div className="mt-1">
                <Lightbulb size={20} className="text-secondary" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-textMuted mb-1">Decision / Insight</p>
                <p className="text-sm text-white mb-2">
                  {memory.decision || "Validate configuration adjustments against latest test outcomes."}
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex gap-4 bg-surface p-6 rounded-lg border border-border mt-8">
            <div className="mt-1">
              <ArrowRight size={24} className="text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Next Recommended Step</p>
              <p className="text-xl text-white font-medium mb-1">{memory.nextStep}</p>
              {memory.recommendedAction && (
                <p className="text-sm text-textMuted">Action: {memory.recommendedAction}</p>
              )}
            </div>
          </motion.div>
        </div>
        
        <div className="bg-surface p-6 border-t border-border flex justify-end items-center">
          <AnimatePresence mode="wait">
            {!resumed ? (
              <button 
                key="resume-btn"
                onClick={handleResume}
                disabled={isResuming}
                className="btn-primary px-8 py-3 text-sm flex items-center gap-2 min-w-[200px] justify-center"
              >
                {isResuming ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Resuming Workspace...
                  </>
                ) : (
                  <>
                    RESUME WORK
                  </>
                )}
              </button>
            ) : (
              <motion.div 
                key="success-msg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-success font-medium flex items-center gap-2 bg-success/10 px-6 py-3 rounded border border-success/30"
              >
                <CheckCircle2 size={18} /> Context restored successfully.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
