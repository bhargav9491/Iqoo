'use client';

import React, { useState, useMemo } from 'react';
import {
  Layers,
  GitCommit,
  FileText,
  CheckSquare,
  ShieldCheck,
  FileSpreadsheet,
  Info,
  Filter,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Node {
  id: string;
  label: string;
  type: 'PROJECT' | 'DECISION' | 'CONTEXT' | 'TASK' | 'PROCEDURE' | 'HANDOVER';
  status?: string;
  category?: string;
  details?: string;
  author?: string;
  priority?: string;
  x?: number;
  y?: number;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  relation: string;
}

interface KnowledgeGraphProps {
  nodes: Node[];
  edges: Edge[];
  projectName?: string;
}

export default function KnowledgeGraphView({ nodes, edges, projectName }: KnowledgeGraphProps) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Filter nodes based on selected type
  const filteredNodes = useMemo(() => {
    if (filterType === 'ALL') return nodes;
    return nodes.filter((n) => n.type === filterType || n.type === 'PROJECT');
  }, [nodes, filterType]);

  // Position nodes radially around the central project node
  const positionedNodes = useMemo(() => {
    const width = 800;
    const height = 520;
    const centerX = width / 2;
    const centerY = height / 2;

    const nonCenterNodes = filteredNodes.filter((n) => n.type !== 'PROJECT');
    const total = nonCenterNodes.length;

    const result: Node[] = [];

    // Central Project Node
    const projectNode = filteredNodes.find((n) => n.type === 'PROJECT');
    if (projectNode) {
      result.push({ ...projectNode, x: centerX, y: centerY });
    }

    // Surround in radial rings according to type
    nonCenterNodes.forEach((node, idx) => {
      let radius = 170;
      if (node.type === 'DECISION') radius = 150;
      if (node.type === 'CONTEXT') radius = 190;
      if (node.type === 'TASK') radius = 220;
      if (node.type === 'PROCEDURE') radius = 160;
      if (node.type === 'HANDOVER') radius = 200;

      const angle = (idx / Math.max(total, 1)) * 2 * Math.PI - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      result.push({ ...node, x, y });
    });

    return result;
  }, [filteredNodes]);

  // Helper colors and icons
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'PROJECT':
        return 'stroke-brand-500 fill-brand-950/80 text-brand-300';
      case 'DECISION':
        return 'stroke-purple-500 fill-purple-950/80 text-purple-300';
      case 'CONTEXT':
        return 'stroke-cyan-500 fill-cyan-950/80 text-cyan-300';
      case 'TASK':
        return 'stroke-emerald-500 fill-emerald-950/80 text-emerald-300';
      case 'PROCEDURE':
        return 'stroke-amber-500 fill-amber-950/80 text-amber-300';
      case 'HANDOVER':
        return 'stroke-blue-500 fill-blue-950/80 text-blue-300';
      default:
        return 'stroke-slate-500 fill-slate-900 text-slate-300';
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'PROJECT':
        return <Layers className="h-4 w-4" />;
      case 'DECISION':
        return <GitCommit className="h-4 w-4" />;
      case 'CONTEXT':
        return <FileText className="h-4 w-4" />;
      case 'TASK':
        return <CheckSquare className="h-4 w-4" />;
      case 'PROCEDURE':
        return <ShieldCheck className="h-4 w-4" />;
      case 'HANDOVER':
        return <FileSpreadsheet className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="relative flex flex-col h-full w-full rounded-2xl border border-border bg-surface-card overflow-hidden shadow-xl">
      {/* Top Filter Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-border bg-surface px-4 py-3 gap-2">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-brand-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
            Graph Filter:
          </span>
          <div className="flex flex-wrap gap-1">
            {['ALL', 'DECISION', 'CONTEXT', 'TASK', 'PROCEDURE', 'HANDOVER'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={cn(
                  'rounded-lg px-2.5 py-1 text-xs font-medium transition-all',
                  filterType === t
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-surface-raised text-slate-400 hover:text-slate-200 border border-border'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span>{positionedNodes.length} Active Nodes</span>
          <div className="flex items-center gap-1 border-l border-border pl-2">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
              className="p-1 hover:text-white rounded bg-surface-raised border border-border"
              title="Zoom out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
              className="p-1 hover:text-white rounded bg-surface-raised border border-border"
              title="Zoom in"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main SVG Graph Canvas */}
      <div className="relative flex-1 bg-grid-pattern overflow-hidden flex items-center justify-center p-4">
        <svg
          viewBox="0 0 800 520"
          className="w-full h-full max-h-[520px] transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Render Connections / Edges */}
          <g className="edges opacity-40">
            {edges.map((edge) => {
              const sourceNode = positionedNodes.find((n) => n.id === edge.source);
              const targetNode = positionedNodes.find((n) => n.id === edge.target);
              if (!sourceNode || !targetNode || sourceNode.x === undefined || targetNode.x === undefined) {
                return null;
              }

              return (
                <line
                  key={edge.id}
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke="#4f46e5"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                />
              );
            })}
          </g>

          {/* Render Nodes */}
          {positionedNodes.map((node) => {
            if (node.x === undefined || node.y === undefined) return null;
            const isSelected = selectedNode?.id === node.id;
            const isProject = node.type === 'PROJECT';

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => setSelectedNode(node)}
                className="cursor-pointer group"
              >
                {/* Glow ring on hover/selected */}
                <circle
                  r={isProject ? 36 : 24}
                  className={cn(
                    'transition-all duration-300',
                    isSelected ? 'fill-brand-500/30 stroke-brand-400 stroke-2 animate-pulse' : 'fill-transparent'
                  )}
                />

                {/* Node Body */}
                <circle
                  r={isProject ? 28 : 18}
                  className={cn(
                    'stroke-2 transition-all group-hover:scale-110',
                    getNodeColor(node.type),
                    isSelected && 'stroke-white'
                  )}
                />

                {/* Node Label Text */}
                <text
                  y={isProject ? 42 : 28}
                  textAnchor="middle"
                  className="fill-slate-200 text-[11px] font-medium pointer-events-none drop-shadow-md"
                >
                  {node.label.length > 20 ? `${node.label.slice(0, 18)}...` : node.label}
                </text>

                {/* Node Type Tag */}
                <text
                  y={isProject ? 54 : 39}
                  textAnchor="middle"
                  className="fill-slate-500 text-[9px] font-mono uppercase pointer-events-none"
                >
                  {node.type}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="absolute bottom-4 right-4 max-w-sm w-full rounded-xl border border-border bg-surface/95 p-4 backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between border-b border-border pb-2 mb-2">
              <div className="flex items-center gap-2">
                <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase', getNodeColor(selectedNode.type))}>
                  {selectedNode.type}
                </span>
                <span className="text-xs font-semibold text-white truncate max-w-[180px]">
                  {selectedNode.label}
                </span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-surface-raised"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {selectedNode.details || 'No detailed annotations recorded.'}
            </p>

            {selectedNode.author && (
              <div className="text-[11px] text-slate-400 font-mono">
                Recorded by: <span className="text-slate-200">{selectedNode.author}</span>
              </div>
            )}
            {selectedNode.status && (
              <div className="text-[11px] text-slate-400 font-mono mt-1">
                Status: <span className="text-brand-300 font-semibold">{selectedNode.status}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
