"use client";

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { 
  Network, 
  Search, 
  BrainCircuit,
  FileText,
  History,
  CheckSquare,
  ShieldAlert,
  ArrowRight,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function KnowledgeGraphPage() {
  const workspace = useAppStore(state => state.workspace);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Mock graph data based on workspace
  const graphData = workspace === 'Engineering Demo' ? [
    { id: 'n1', label: 'Smart Infrastructure Monitoring', type: 'project', x: 50, y: 50 },
    { id: 'n2', label: 'Telemetry Pipeline', type: 'task', x: 20, y: 30 },
    { id: 'n3', label: 'Gateway Node B', type: 'concept', x: 80, y: 30 },
    { id: 'n4', label: 'ADR-01 Buffer', type: 'decision', x: 20, y: 70 },
    { id: 'n5', label: 'Polling Failure', type: 'evidence', x: 40, y: 85 },
    { id: 'n6', label: 'Thermistor Drift', type: 'alert', x: 80, y: 70 },
    { id: 'n7', label: 'Failover Protocol', type: 'procedure', x: 50, y: 20 },
  ] : [
    { id: 'n1', label: 'MBA Strategic Management', type: 'project', x: 50, y: 50 },
    { id: 'n2', label: 'Target Customer Segment', type: 'task', x: 20, y: 30 },
    { id: 'n3', label: 'Competitor Matrix', type: 'concept', x: 80, y: 30 },
    { id: 'n4', label: 'DEC-01 Target', type: 'decision', x: 20, y: 70 },
    { id: 'n5', label: 'Broad Segmentation Failure', type: 'evidence', x: 40, y: 85 },
    { id: 'n6', label: 'Pricing Deviation', type: 'alert', x: 80, y: 70 },
    { id: 'n7', label: 'Market Entry Viability', type: 'procedure', x: 50, y: 20 },
  ];

  const getIcon = (type: string) => {
    switch(type) {
      case 'project': return <BrainCircuit size={24} className="text-white" />;
      case 'task': return <CheckSquare size={16} className="text-white" />;
      case 'decision': return <History size={16} className="text-white" />;
      case 'procedure': return <ShieldAlert size={16} className="text-white" />;
      case 'evidence': return <FileText size={16} className="text-white" />;
      default: return <Network size={16} className="text-white" />;
    }
  };

  const getColor = (type: string) => {
    switch(type) {
      case 'project': return 'bg-primary border-primary/50 text-white';
      case 'task': return 'bg-secondary border-secondary/50 text-white';
      case 'decision': return 'bg-success border-success/50 text-white';
      case 'procedure': return 'bg-warning border-warning/50 text-white';
      case 'alert': return 'bg-danger border-danger/50 text-white';
      case 'evidence': return 'bg-surface border-border text-white';
      default: return 'bg-surface border-border text-white';
    }
  };

  // Mock "Ask AUREVEX" Response
  const getAIResponse = (query: string) => {
    const q = query.toLowerCase();
    if (workspace === 'Engineering Demo') {
      if (q.includes('buffer') || q.includes('adr')) {
        return "Asynchronous lock-free buffering was selected to handle 50,000 metrics/second without thread contention, after synchronous polling failed during high-frequency telemetry trials.";
      }
      return "I don't have grounded evidence for that in the current workspace.";
    } else {
      if (q.includes('segment') || q.includes('dec')) {
        return "Focusing on urban professionals aged 25–40 was selected because the initial broad segmentation lacked a clearly defined purchasing profile, making marketing efforts too diffuse.";
      }
      return "I don't have grounded evidence for that in the current workspace.";
    }
  };

  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setAiResponse(getAIResponse(searchQuery));
  };

  const selectedNodeData = graphData.find(n => n.id === selectedNode);

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 p-8 flex flex-col relative">
        <header className="mb-6 shrink-0 z-10">
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3 mb-4">
            <Network size={32} className="text-primary" />
            Knowledge Graph
          </h1>
          
          <form onSubmit={handleSearch} className="relative max-w-xl">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
            <input 
              type="text" 
              placeholder="Ask AUREVEX..." 
              className="w-full bg-surface/80 backdrop-blur border border-primary/30 rounded-lg pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary focus:bg-surface transition-all shadow-lg shadow-primary/5"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-1 px-3">
              Ask
            </button>
          </form>

          <AnimatePresence>
            {aiResponse && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 max-w-xl glass-panel p-4 border-primary/30 bg-primary/5"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <BrainCircuit size={16} className="text-primary" />
                    <span className="text-xs uppercase font-bold text-primary tracking-wider">AUREVEX Intelligence</span>
                  </div>
                  <button onClick={() => setAiResponse(null)} className="text-textMuted hover:text-white"><X size={14}/></button>
                </div>
                <p className="text-sm text-white leading-relaxed">{aiResponse}</p>
                {aiResponse !== "I don't have grounded evidence for that in the current workspace." && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-success/20 text-success font-bold tracking-wider">
                      Confidence: Grounded
                    </span>
                    <span className="text-xs text-textMuted">Evidence: {workspace === 'Engineering Demo' ? 'ADR-01, Commit #e47f2a' : 'DEC-01, Presentation v2'}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Mock Interactive Graph Area */}
        <div className="flex-1 bg-surface border border-border rounded-lg relative overflow-hidden bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:20px_20px]">
          {/* SVG lines for connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line x1="50%" y1="50%" x2="20%" y2="30%" stroke="#27272a" strokeWidth="2" />
            <line x1="50%" y1="50%" x2="80%" y2="30%" stroke="#27272a" strokeWidth="2" />
            <line x1="50%" y1="50%" x2="20%" y2="70%" stroke="#27272a" strokeWidth="2" />
            <line x1="20%" y1="70%" x2="40%" y2="85%" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4" />
            <line x1="50%" y1="50%" x2="80%" y2="70%" stroke="#27272a" strokeWidth="2" />
            <line x1="50%" y1="50%" x2="50%" y2="20%" stroke="#27272a" strokeWidth="2" />
          </svg>

          {graphData.map(node => (
            <motion.div
              key={node.id}
              className={`absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group`}
              style={{ left: `${node.x}%`, top: `${node.y}%`, zIndex: selectedNode === node.id ? 10 : 1 }}
              onClick={() => setSelectedNode(node.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={clsx(
                "w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-lg transition-colors",
                getColor(node.type),
                selectedNode === node.id ? "ring-4 ring-primary/30" : ""
              )}>
                {getIcon(node.type)}
              </div>
              <div className="mt-2 px-2 py-1 bg-background/90 backdrop-blur border border-border rounded text-xs font-medium text-white shadow max-w-[120px] text-center">
                {node.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Side Panel */}
      <AnimatePresence>
        {selectedNode && selectedNodeData && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-l border-border bg-surface h-full flex flex-col shrink-0"
          >
            <div className="p-6 border-b border-border flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-textMuted mb-1 block">
                  {selectedNodeData.type} Node
                </span>
                <h3 className="text-lg font-bold text-white leading-tight">{selectedNodeData.label}</h3>
              </div>
              <button onClick={() => setSelectedNode(null)} className="text-textMuted hover:text-white p-1">
                <X size={16} />
              </button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              <div>
                <h4 className="text-xs uppercase tracking-wider text-textMuted mb-2">Status</h4>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-surface border border-border text-xs text-white">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div> Active
                </span>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-wider text-textMuted mb-2">Related Items</h4>
                <ul className="space-y-2">
                  <li className="text-sm text-primary flex items-center gap-2 cursor-pointer hover:underline">
                    <History size={14} /> View Decision History
                  </li>
                  <li className="text-sm text-primary flex items-center gap-2 cursor-pointer hover:underline">
                    <CheckSquare size={14} /> View Associated Task
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-wider text-textMuted mb-2">Timeline Summary</h4>
                <div className="border-l border-border ml-2 pl-4 space-y-3">
                  <div>
                    <span className="text-[10px] text-textMuted font-mono">Today, 2:15 PM</span>
                    <p className="text-xs text-white">Node created</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-textMuted font-mono">Today, 4:30 PM</span>
                    <p className="text-xs text-white">Linked to {workspace === 'Engineering Demo' ? 'ADR-01' : 'DEC-01'}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-border">
              <button className="btn-primary w-full flex items-center justify-center gap-2">
                Explore Connections <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
