'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import ProcedureInspector from '@/components/ProcedureInspector';
import {
  ShieldAlert,
  ShieldCheck,
  FolderGit2,
  RefreshCw,
  Layers,
} from 'lucide-react';

export default function ProceduresPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProcedures = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/projects');
      const data = await res.json();
      const projs = data.projects || [];
      setProjects(projs);
      if (projs.length > 0) {
        setSelectedProjectId(projs[0].id);
        fetchSingleProject(projs[0].id);
      }
    } catch (err) {
      console.error('Failed to load procedures:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleProject = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      const data = await res.json();
      setCurrentProject(data.project);
    } catch (err) {
      console.error('Failed to fetch project details:', err);
    }
  };

  useEffect(() => {
    fetchProcedures();
  }, []);

  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    fetchSingleProject(id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSeedSuccess={fetchProcedures} />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 pb-24 md:pb-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                  PROCEDURE INTELLIGENCE LAB
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">
                Standardized Protocols & Deviation Guard
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Execute structured testing protocols, inspect sensor telemetry traces, and identify safety discrepancies.
              </p>
            </div>
          </div>

          {/* Project Selector Bar */}
          <div className="flex items-center gap-2 overflow-x-auto border-b border-border pb-2">
            <span className="text-xs font-mono text-slate-400 pr-2">Workspace:</span>
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectProject(p.id)}
                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedProjectId === p.id
                    ? 'bg-brand-600 text-white shadow-glow-brand'
                    : 'bg-surface text-slate-400 hover:text-slate-200 border border-border'
                }`}
              >
                <FolderGit2 className="h-3.5 w-3.5" />
                <span>{p.name}</span>
              </button>
            ))}
          </div>

          {/* Procedure Studio */}
          {currentProject?.procedures && currentProject.procedures.length > 0 ? (
            <ProcedureInspector
              procedure={currentProject.procedures[0]}
              projectId={currentProject.id}
              onUpdate={() => fetchSingleProject(currentProject.id)}
            />
          ) : (
            <div className="p-12 text-center text-xs text-slate-500 bg-surface-card rounded-2xl border border-border">
              No procedure defined for this project.
            </div>
          )}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
