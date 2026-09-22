"use client";

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { 
  ActivitySquare, 
  CheckSquare, 
  History, 
  ShieldAlert, 
  AlertTriangle,
  FileOutput,
  Filter
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ActivityPage() {
  const activity = useAppStore(state => state.activity);
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', 'Tasks', 'Decisions', 'Procedures', 'Alerts', 'Handover'];

  const filteredActivity = filter === 'All' 
    ? activity 
    : activity.filter(a => a.category === filter);

  const getIcon = (category: string) => {
    switch(category) {
      case 'Tasks': return <CheckSquare size={16} className="text-secondary" />;
      case 'Decisions': return <History size={16} className="text-primary" />;
      case 'Procedures': return <ShieldAlert size={16} className="text-warning" />;
      case 'Alerts': return <AlertTriangle size={16} className="text-danger" />;
      case 'Handover': return <FileOutput size={16} className="text-success" />;
      default: return <ActivitySquare size={16} className="text-textMuted" />;
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <ActivitySquare size={32} className="text-primary" />
            Activity Timeline
          </h1>
          <p className="text-textMuted mt-2 text-lg">Chronological log of workspace events.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-textMuted" />
          <select 
            className="bg-background border border-border rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-primary cursor-pointer"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="glass-panel p-8">
        <div className="relative border-l border-border ml-3 space-y-8 pb-4">
          {filteredActivity.map((item, index) => (
            <motion.div 
              key={item.id} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8"
            >
              <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center">
                {getIcon(item.category)}
              </div>
              
              <div className="bg-background border border-border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-textMuted">
                    {item.category}
                  </span>
                  <span className="text-xs font-mono text-textMuted bg-surface px-2 py-1 rounded">
                    {item.time}
                  </span>
                </div>
                <p className="text-white text-sm">{item.text}</p>
              </div>
            </motion.div>
          ))}
          
          {filteredActivity.length === 0 && (
            <div className="pl-8 text-textMuted italic">No activity found for this filter.</div>
          )}
        </div>
      </div>
    </div>
  );
}
