'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import KnowledgeGraphView from '@/components/KnowledgeGraphView';
import { GitGraph, FolderGit2, RefreshCw } from 'lucide-react';

export default function GlobalGraphPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [graphData, setGraphData] = useState<any>(null);
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/projects');
      const data = await res.json();
      const projs = data.projects || [];
      setProjects(projs);
      if (projs.length > 0) {
        setSelectedProjectId(projs[0].id);
        fetchGraph(projs[0].id);
      }
    } catch (err) {
      console.error('Failed to load projects for graph:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGraph = async (id: string) => {
    try {
      const [gRes, pRes] = await Promise.all([
        fetch(`/api/projects/${id}/graph`),
        fetch(`/api/projects/${id}`),
      ]);
      const gData = await gRes.json();
      const pData = await pRes.json();
      setGraphData(gData.graph);
      setCurrentProject(pData.project);
    } catch (err) {
      console.error('Failed to fetch graph data:', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    fetchGraph(id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSeedSuccess={fetchProjects} />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 pb-24 md:pb-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <GitGraph className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                  KNOWLEDGE CONTINUITY GRAPH
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">
                Connected Knowledge Ecosystem
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Explore real relationships linking projects, tasks, architectural decisions, and procedure reviews.
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

          {/* Graph View Component */}
          {graphData ? (
            <div className="h-[620px] w-full">
              <KnowledgeGraphView
                nodes={graphData.nodes}
                edges={graphData.edges}
                projectName={currentProject?.name}
              />
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500 bg-surface-card rounded-2xl border border-border">
              Select a project to visualize continuity graph.
            </div>
          )}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
