"use client";

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Lock,
  Search,
  Activity,
  UserCheck,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function ProcedureGuardPage() {
  const procedures = useAppStore(state => state.procedures);
  const [approvedSteps, setApprovedSteps] = useState<Record<string, boolean>>({});
  const [approving, setApproving] = useState<string | null>(null);

  const handleApprove = (stepId: string) => {
    setApproving(stepId);
    setTimeout(() => {
      setApproving(null);
      setApprovedSteps(prev => ({ ...prev, [stepId]: true }));
    }, 1500);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <ShieldAlert size={32} className="text-primary" />
          Procedure Guard
        </h1>
        <p className="text-textMuted mt-2 text-lg">AI flags. Engineers decide.</p>
      </header>

      <div className="space-y-8">
        {procedures.map(procedure => (
          <div key={procedure.id} className="glass-panel overflow-hidden border-warning/30">
            <div className="bg-warning/10 p-6 border-b border-warning/20">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle size={20} className="text-warning" />
                <span className="text-xs font-bold uppercase tracking-wider text-warning">
                  {procedure.warning}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">{procedure.title}</h2>
              {procedure.reason && (
                <p className="text-sm text-textMuted">{procedure.reason}</p>
              )}
            </div>

            <div className="p-6">
              <h3 className="text-xs uppercase tracking-wider text-textMuted font-bold mb-6">Verification Steps</h3>
              
              <div className="space-y-4">
                {procedure.steps.map((step, index) => {
                  const isApproved = approvedSteps[step.id];
                  const isPending = step.status === 'Sign-off Required' && !isApproved;
                  
                  return (
                    <motion.div 
                      key={step.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={clsx(
                        "flex items-center justify-between p-4 rounded border",
                        step.status === 'Verified' || isApproved ? 'bg-success/5 border-success/20' : 
                        step.status === 'Deviation' ? 'bg-danger/5 border-danger/20' : 
                        step.status === 'Active' ? 'bg-primary/5 border-primary/20' : 
                        'bg-surface border-border'
                      )}
                    >
                      <div className="flex items-center gap-4">
                        {step.status === 'Verified' || isApproved ? (
                          <CheckCircle2 size={20} className="text-success" />
                        ) : step.status === 'Deviation' ? (
                          <AlertTriangle size={20} className="text-danger" />
                        ) : step.status === 'Active' ? (
                          <Activity size={20} className="text-primary" />
                        ) : (
                          <Lock size={20} className="text-warning" />
                        )}
                        <span className={clsx(
                          "font-medium",
                          step.status === 'Verified' || isApproved ? 'text-textMuted line-through' : 'text-white'
                        )}>
                          {step.text}
                        </span>
                      </div>
                      
                      {isPending && (
                        <div className="flex gap-2">
                          <button className="btn-secondary text-xs flex items-center gap-1">
                            <FileText size={12} /> Inspect Evidence
                          </button>
                          <button 
                            onClick={() => handleApprove(step.id)}
                            disabled={approving === step.id}
                            className="btn-primary text-xs flex items-center gap-1 bg-success/10 text-success border-success/30 hover:bg-success/20"
                          >
                            {approving === step.id ? (
                              'Processing...'
                            ) : (
                              <>
                                <UserCheck size={12} /> Approve Step
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {isApproved && (
                        <span className="text-xs uppercase tracking-wider text-success font-bold flex items-center gap-1">
                          <UserCheck size={14} /> Engineer Approved
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="bg-surface p-4 border-t border-border flex justify-end gap-3">
              <button className="btn-secondary">View Telemetry</button>
              <button className="btn-danger">Reject Procedure</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
