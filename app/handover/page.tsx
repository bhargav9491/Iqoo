"use client";

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { 
  FileOutput, 
  Download, 
  CheckCircle2, 
  AlertTriangle,
  History,
  XCircle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HandoverPage() {
  const { workspace, memory, decisions, tasks } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const completedTasks = tasks.filter(t => t.status === 'Completed');
  const activeBlockers = tasks.filter(t => t.status === 'Blocked');
  const acceptedDecisions = decisions.filter(d => d.status === 'ACCEPTED');

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setReportGenerated(true);
    }, 2000);
  };

  const handleExport = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      // Simulate download
      const a = document.createElement('a');
      a.href = 'data:text/plain;charset=utf-8,Mock%20PDF%20Content';
      a.download = `AUREVEX_Handover_${workspace.replace(/\s+/g, '_')}.pdf`;
      a.click();
    }, 1000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-10 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
            <FileOutput size={32} className="text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">1-Click Handover</h1>
        <p className="text-textMuted mt-2 text-lg">Turn work context into an instant handover dossier.</p>
      </header>

      {!reportGenerated ? (
        <div className="flex justify-center mt-12">
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="btn-primary px-12 py-4 text-base flex items-center gap-3 relative overflow-hidden group"
          >
            {isGenerating ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Compiling Context...
              </>
            ) : (
              <>
                <FileOutput size={20} />
                GENERATE HANDOVER
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
              </>
            )}
          </button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel overflow-hidden"
        >
          <div className="bg-surface p-6 border-b border-border flex justify-between items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-textMuted mb-1">Generated Dossier</p>
              <h2 className="text-xl font-bold text-white">Project: {memory.project}</h2>
            </div>
            <button 
              onClick={handleExport}
              disabled={downloading}
              className="btn-primary flex items-center gap-2 bg-success/10 text-success border-success/30 hover:bg-success/20"
            >
              {downloading ? <Loader2 size={16} className="animate-spin"/> : <Download size={16} />}
              Export PDF
            </button>
          </div>

          <div className="p-8 space-y-8 bg-background print-area">
            
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2 border-b border-border pb-2">
                <CheckCircle2 size={16} /> Completed Milestones
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">●</span>
                  <span className="text-white">{memory.lastCompleted}</span>
                </li>
                {completedTasks.map(t => (
                  <li key={t.id} className="flex items-start gap-3">
                    <span className="text-primary mt-1">●</span>
                    <span className="text-white">{t.title}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-danger mb-4 flex items-center gap-2 border-b border-border pb-2">
                <AlertTriangle size={16} /> Active Blocker
              </h3>
              <div className="bg-danger/5 border border-danger/20 p-4 rounded text-white">
                {memory.currentBlocker}
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-warning mb-4 flex items-center gap-2 border-b border-border pb-2">
                <XCircle size={16} /> Failed Attempts
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-textMuted">
                  <span className="text-warning mt-1">●</span>
                  <span>{memory.failedAttempt}</span>
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-secondary mb-4 flex items-center gap-2 border-b border-border pb-2">
                <History size={16} /> Key Decision Trail
              </h3>
              <ul className="space-y-3">
                {acceptedDecisions.map(d => (
                  <li key={d.id} className="flex items-start gap-3">
                    <span className="text-secondary mt-1">●</span>
                    <span className="text-white font-medium">{d.id} — {d.selectedApproach}</span>
                  </li>
                ))}
                {acceptedDecisions.length === 0 && (
                  <li className="text-textMuted italic">No major decisions recorded yet.</li>
                )}
              </ul>
            </section>

            <section className="pt-4 border-t border-border">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4">Recommended Next Actions</h3>
              <ul className="space-y-4">
                {memory.recommendedAction && (
                  <li className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-surface text-white border border-border flex items-center justify-center text-xs font-bold shrink-0">1</div>
                    <p className="text-white text-sm mt-0.5">{memory.recommendedAction}</p>
                  </li>
                )}
                <li className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-surface text-white border border-border flex items-center justify-center text-xs font-bold shrink-0">2</div>
                  <p className="text-white text-sm mt-0.5">Execute human sign-off on Step 05</p>
                </li>
                {workspace === 'Engineering Demo' && (
                  <li className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-surface text-white border border-border flex items-center justify-center text-xs font-bold shrink-0">3</div>
                    <p className="text-white text-sm mt-0.5">Verify sub-5ms threshold</p>
                  </li>
                )}
              </ul>
            </section>
          </div>
        </motion.div>
      )}
    </div>
  );
}
