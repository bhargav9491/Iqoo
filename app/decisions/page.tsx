"use client";

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { 
  History, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  BrainCircuit,
  Search,
  FileText,
  Clock,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function DecisionsPage() {
  const decisions = useAppStore(state => state.decisions);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeExplainId, setActiveExplainId] = useState<string | null>(null);

  const filteredDecisions = decisions.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.problem.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <History size={32} className="text-primary" />
            Decision Time Machine
          </h1>
          <p className="text-textMuted mt-2 text-lg">Remember WHY, not just WHAT.</p>
        </div>
        
        <div className="relative w-64">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
          <input 
            type="text" 
            placeholder="Search decisions..." 
            className="w-full bg-background border border-border rounded pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <div className="space-y-8">
        {filteredDecisions.length > 0 ? (
          filteredDecisions.map((decision) => (
            <motion.div 
              key={decision.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel overflow-hidden"
            >
              <div className="bg-surface p-6 border-b border-border flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-primary font-bold">{decision.id}</span>
                    <span className={clsx(
                      "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border",
                      decision.status === 'ACCEPTED' ? 'bg-success/10 text-success border-success/30' : 
                      decision.status === 'REJECTED' ? 'bg-danger/10 text-danger border-danger/30' : 
                      'bg-warning/10 text-warning border-warning/30'
                    )}>
                      {decision.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{decision.title}</h2>
                </div>
                <div className="text-right">
                  <span className="text-xs text-textMuted flex items-center gap-1">
                    <Clock size={12} /> {decision.date}
                  </span>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-textMuted font-bold mb-2">Problem</h3>
                  <p className="text-sm text-white mb-6 p-4 bg-background border border-border rounded">
                    {decision.problem}
                  </p>

                  <h3 className="text-xs uppercase tracking-wider text-textMuted font-bold mb-2">Rejected Option</h3>
                  <div className="p-4 bg-danger/5 border border-danger/20 rounded flex items-start gap-3">
                    <XCircle size={18} className="text-danger shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-danger mb-1">{decision.rejectedOption}</p>
                      <p className="text-xs text-textMuted">{decision.reasonRejected}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs uppercase tracking-wider text-textMuted font-bold mb-2">Selected Approach</h3>
                  <div className="p-4 bg-success/5 border border-success/20 rounded flex items-start gap-3 mb-6">
                    <CheckCircle2 size={18} className="text-success shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-success mb-1">{decision.selectedApproach}</p>
                    </div>
                  </div>

                  <h3 className="text-xs uppercase tracking-wider text-textMuted font-bold mb-2">Evidence</h3>
                  <p className="text-sm text-white p-4 bg-background border border-border rounded italic border-l-2 border-l-primary/50">
                    "{decision.evidence}"
                  </p>
                </div>
              </div>

              <div className="bg-surface p-4 border-t border-border flex justify-end gap-3">
                <button className="btn-secondary flex items-center gap-2">
                  <FileText size={14} /> View Evidence
                </button>
                <button className="btn-secondary flex items-center gap-2">
                  <History size={14} /> View History
                </button>
                <button 
                  onClick={() => setActiveExplainId(activeExplainId === decision.id ? null : decision.id)}
                  className="btn-primary flex items-center gap-2"
                >
                  <HelpCircle size={14} /> Ask Why?
                </button>
              </div>
              
              <AnimatePresence>
                {activeExplainId === decision.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 bg-primary/5 border-t border-primary/20">
                      <div className="flex gap-4">
                        <div className="mt-1">
                          <BrainCircuit size={24} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">AUREVEX Intelligence</p>
                          <p className="text-sm text-white leading-relaxed">
                            {decision.selectedApproach} was selected to address the problem of '{decision.problem}' because {decision.rejectedOption} was evaluated and {decision.reasonRejected.toLowerCase()}
                          </p>
                          <div className="mt-3 flex items-center gap-2">
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-success/20 text-success font-bold tracking-wider">
                              Confidence: Grounded
                            </span>
                            <span className="text-xs text-textMuted">Sources: {decision.id} & Commit History</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        ) : (
          <div className="glass-panel p-12 text-center flex flex-col items-center justify-center border-dashed border-2">
            <History size={48} className="text-border mb-4" />
            <p className="text-white text-lg font-medium">No decisions found.</p>
            <p className="text-textMuted mt-1 mb-6">Try adjusting your search criteria or create a new decision record.</p>
            <button className="btn-primary">Create Decision</button>
          </div>
        )}
      </div>
    </div>
  );
}
