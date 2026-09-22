"use client";

import { useAppStore } from '@/lib/store';
import { 
  Settings as SettingsIcon, 
  Building2, 
  User, 
  BrainCircuit, 
  Moon, 
  DatabaseBackup,
  MonitorPlay,
  GraduationCap,
  HardHat,
  Check
} from 'lucide-react';
import { WorkspaceType } from '@/lib/types';
import clsx from 'clsx';
import { useState } from 'react';

export default function SettingsPage() {
  const { 
    workspace, 
    setWorkspace, 
    resetDemoData,
    groundedResponses,
    humanApprovalGates,
    evidenceRequirement,
    toggleGroundedResponses,
    toggleHumanApprovalGates,
    toggleEvidenceRequirement
  } = useAppStore();

  const [resetMessage, setResetMessage] = useState('');

  const handleReset = () => {
    resetDemoData();
    setResetMessage('Demo data reset to defaults.');
    setTimeout(() => setResetMessage(''), 3000);
  };

  const handleWorkspaceChange = (newWorkspace: WorkspaceType) => {
    setWorkspace(newWorkspace);
    setResetMessage(`Workspace switched to ${newWorkspace}.`);
    setTimeout(() => setResetMessage(''), 3000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto pb-24">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <SettingsIcon size={32} className="text-primary" />
          Settings
        </h1>
        <p className="text-textMuted mt-2 text-lg">Manage workspace configuration and demo controls.</p>
      </header>

      <div className="space-y-8">
        {/* Workspace & User Profile */}
        <section className="glass-panel p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-textMuted mb-6 flex items-center gap-2 border-b border-border pb-3">
            <Building2 size={16} /> Workspace & User
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-xs uppercase tracking-wider text-textMuted mb-2">Current Workspace</p>
              <div className="bg-surface border border-border rounded p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {workspace === 'Engineering Demo' ? 'NS' : 'MBA'}
                </div>
                <div>
                  <p className="text-white font-medium">{workspace}</p>
                  <p className="text-xs text-textMuted">Local Environment</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-textMuted mb-2">Current User</p>
              <div className="bg-surface border border-border rounded p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-white font-medium">{workspace === 'Engineering Demo' ? 'Demo Engineer' : 'MBA Student'}</p>
                  <p className="text-xs text-textMuted">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Intelligence Settings */}
        <section className="glass-panel p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-textMuted mb-6 flex items-center gap-2 border-b border-border pb-3">
            <BrainCircuit size={16} /> Intelligence Settings
          </h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-surface border border-border rounded cursor-pointer hover:bg-white/5 transition-colors">
              <div>
                <p className="text-white font-medium mb-1">Grounded Responses</p>
                <p className="text-xs text-textMuted max-w-md">Restrict AI explanations strictly to evidence found in work memory.</p>
              </div>
              <div className={clsx("w-12 h-6 rounded-full relative transition-colors", groundedResponses ? 'bg-primary' : 'bg-surface border border-border')}>
                <div className={clsx("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", groundedResponses ? 'left-7' : 'left-1')} />
              </div>
              <input type="checkbox" className="hidden" checked={groundedResponses} onChange={toggleGroundedResponses} />
            </label>

            <label className="flex items-center justify-between p-4 bg-surface border border-border rounded cursor-pointer hover:bg-white/5 transition-colors">
              <div>
                <p className="text-white font-medium mb-1">Human Approval Gates</p>
                <p className="text-xs text-textMuted max-w-md">Require manual engineer sign-off for critical procedure deviations.</p>
              </div>
              <div className={clsx("w-12 h-6 rounded-full relative transition-colors", humanApprovalGates ? 'bg-primary' : 'bg-surface border border-border')}>
                <div className={clsx("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", humanApprovalGates ? 'left-7' : 'left-1')} />
              </div>
              <input type="checkbox" className="hidden" checked={humanApprovalGates} onChange={toggleHumanApprovalGates} />
            </label>

            <label className="flex items-center justify-between p-4 bg-surface border border-border rounded cursor-pointer hover:bg-white/5 transition-colors">
              <div>
                <p className="text-white font-medium mb-1">Evidence Requirement</p>
                <p className="text-xs text-textMuted max-w-md">Prevent accepting decisions without attached telemetry or links.</p>
              </div>
              <div className={clsx("w-12 h-6 rounded-full relative transition-colors", evidenceRequirement ? 'bg-primary' : 'bg-surface border border-border')}>
                <div className={clsx("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", evidenceRequirement ? 'left-7' : 'left-1')} />
              </div>
              <input type="checkbox" className="hidden" checked={evidenceRequirement} onChange={toggleEvidenceRequirement} />
            </label>
          </div>
        </section>

        {/* Demo Controls */}
        <section className="glass-panel p-6 border border-primary/30 shadow-[0_0_15px_rgba(0,240,255,0.1)] relative overflow-hidden">
          <div className="absolute -right-10 -top-10 text-primary/10 rotate-12 pointer-events-none">
            <MonitorPlay size={120} />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-6 flex items-center gap-2 border-b border-primary/20 pb-3">
            <MonitorPlay size={16} /> Demo Controls
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button 
              onClick={() => handleWorkspaceChange('Engineering Demo')}
              className={clsx(
                "p-4 rounded border text-left transition-colors flex items-center gap-3",
                workspace === 'Engineering Demo' ? 'bg-primary/10 border-primary text-white' : 'bg-surface border-border text-textMuted hover:bg-white/5'
              )}
            >
              <HardHat size={20} className={workspace === 'Engineering Demo' ? 'text-primary' : ''} />
              <div>
                <p className="font-bold">Engineering Demo</p>
                <p className="text-xs mt-1 opacity-80">Infrastructure Monitoring</p>
              </div>
            </button>

            <button 
              onClick={() => handleWorkspaceChange('MBA Student Demo')}
              className={clsx(
                "p-4 rounded border text-left transition-colors flex items-center gap-3",
                workspace === 'MBA Student Demo' ? 'bg-primary/10 border-primary text-white' : 'bg-surface border-border text-textMuted hover:bg-white/5'
              )}
            >
              <GraduationCap size={20} className={workspace === 'MBA Student Demo' ? 'text-primary' : ''} />
              <div>
                <p className="font-bold">MBA Student Demo</p>
                <p className="text-xs mt-1 opacity-80">Market Entry Strategy</p>
              </div>
            </button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <p className="text-white font-medium mb-1">Reset Local Storage</p>
              <p className="text-xs text-textMuted max-w-md">Restore default seed data for the current workspace.</p>
            </div>
            <button 
              onClick={handleReset}
              className="btn-secondary text-danger hover:bg-danger/10 hover:text-danger hover:border-danger/30 flex items-center gap-2"
            >
              <DatabaseBackup size={16} /> Reset Demo Data
            </button>
          </div>

          {resetMessage && (
            <div className="mt-4 p-3 bg-success/10 border border-success/30 rounded text-success text-sm flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
              <Check size={16} /> {resetMessage}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
