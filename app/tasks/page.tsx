"use client";

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Task, TaskStatus, TaskPriority } from '@/lib/types';
import { 
  CheckSquare, 
  Search, 
  Plus, 
  Filter, 
  Edit2,
  Trash2,
  X,
  ChevronRight,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const statusColors: Record<TaskStatus, string> = {
  'Not Started': 'text-textMuted border-border bg-surface',
  'In Progress': 'text-secondary border-secondary/30 bg-secondary/10',
  'Blocked': 'text-danger border-danger/30 bg-danger/10',
  'Review': 'text-warning border-warning/30 bg-warning/10',
  'Completed': 'text-success border-success/30 bg-success/10'
};

export default function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask, workspace } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('Not Started');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [progress, setProgress] = useState(0);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setPriority(task.priority);
      setProgress(task.progress);
    } else {
      setEditingTask(null);
      setTitle('');
      setDescription('');
      setStatus('Not Started');
      setPriority('Medium');
      setProgress(0);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSave = () => {
    if (!title) return;
    if (editingTask) {
      updateTask({ ...editingTask, title, description, status, priority, progress, updatedAt: 'Just now' });
    } else {
      addTask({
        id: `t-${uuidv4().slice(0, 6)}`,
        title,
        description,
        project: workspace === 'Engineering Demo' ? 'Smart Infrastructure Monitoring' : 'MBA Strategic Management',
        owner: workspace === 'Engineering Demo' ? 'Demo Engineer' : 'MBA Student',
        status, priority, progress,
        subtasks: [],
        updatedAt: 'Just now'
      });
    }
    closeModal();
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <CheckSquare size={30} className="text-primary" />
              Task Management
            </h1>
            <p className="text-textMuted mt-1">Track progress, blockers, and completions.</p>
          </div>
          <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
            <Plus size={15} /> New Task
          </button>
        </header>

        {/* Search + Filter */}
        <div className="glass-panel p-4 mb-6 flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
            <input 
              type="text" 
              placeholder="Search tasks, projects..." 
              className="w-full bg-background border border-border rounded pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Filter size={15} className="text-textMuted" />
            <select 
              className="bg-background border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Blocked">Blocked</option>
              <option value="Review">Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="glass-panel overflow-hidden">
          {filteredTasks.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center">
              <CheckSquare size={40} className="text-border mb-3" />
              <p className="text-white font-medium mb-1">No tasks found</p>
              <p className="text-textMuted text-sm mb-4">Adjust your filter or create a new task</p>
              <button onClick={() => openModal()} className="btn-primary">Create Task</button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface text-[10px] uppercase tracking-widest text-textMuted">
                  <th className="px-5 py-3 font-medium">Task</th>
                  <th className="px-5 py-3 font-medium">Owner</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Priority</th>
                  <th className="px-5 py-3 font-medium">Progress</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-sm">
                {filteredTasks.map(task => (
                  <tr 
                    key={task.id} 
                    className={clsx("hover:bg-white/5 transition-colors group cursor-pointer", selectedTask?.id === task.id && 'bg-primary/5')}
                    onClick={() => setSelectedTask(selectedTask?.id === task.id ? null : task)}
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-white mb-0.5">{task.title}</p>
                      <p className="text-[11px] text-textMuted">{task.project}</p>
                    </td>
                    <td className="px-5 py-4 text-textMuted text-xs">{task.owner}</td>
                    <td className="px-5 py-4">
                      <span className={clsx('inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border', statusColors[task.status])}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={clsx('px-2 py-0.5 rounded text-[10px] font-bold border',
                        task.priority === 'High' ? 'bg-danger/10 text-danger border-danger/20' : 
                        task.priority === 'Medium' ? 'bg-warning/10 text-warning border-warning/20' : 
                        'bg-surface border-border text-textMuted'
                      )}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden w-20">
                          <div className={`h-full rounded-full ${task.progress === 100 ? 'bg-success' : 'bg-primary'}`} style={{ width: `${task.progress}%` }}></div>
                        </div>
                        <span className="text-[11px] font-mono text-textMuted w-8">{task.progress}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal(task)} className="p-1.5 text-textMuted hover:text-white hover:bg-surface rounded">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => { deleteTask(task.id); if(selectedTask?.id === task.id) setSelectedTask(null); }} className="p-1.5 text-textMuted hover:text-danger hover:bg-danger/10 rounded">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail Side Panel */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-l border-border bg-surface h-full flex flex-col shrink-0 overflow-hidden"
          >
            <div className="p-5 border-b border-border flex justify-between items-start">
              <div className="flex-1 pr-4">
                <span className={clsx('text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border', statusColors[selectedTask.status])}>
                  {selectedTask.status}
                </span>
                <h3 className="text-sm font-bold text-white mt-2 leading-snug">{selectedTask.title}</h3>
                <p className="text-[11px] text-textMuted mt-1">{selectedTask.project}</p>
              </div>
              <button onClick={() => setSelectedTask(null)} className="text-textMuted hover:text-white shrink-0">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-5">
              {selectedTask.description && (
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-textMuted mb-2">Description</p>
                  <p className="text-xs text-white leading-relaxed">{selectedTask.description}</p>
                </div>
              )}

              <div>
                <p className="text-[9px] uppercase tracking-widest text-textMuted mb-1">Progress</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${selectedTask.progress === 100 ? 'bg-success' : 'bg-primary'}`} style={{ width: `${selectedTask.progress}%` }}></div>
                  </div>
                  <span className="text-xs font-mono text-white">{selectedTask.progress}%</span>
                </div>
              </div>

              {selectedTask.subtasks.length > 0 && (
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-textMuted mb-2">
                    Subtasks ({selectedTask.subtasks.filter(s => s.completed).length}/{selectedTask.subtasks.length})
                  </p>
                  <ul className="space-y-2">
                    {selectedTask.subtasks.map(sub => (
                      <li key={sub.id} className="flex items-start gap-2">
                        {sub.completed 
                          ? <CheckCircle2 size={14} className="text-success shrink-0 mt-0.5" /> 
                          : <Circle size={14} className="text-border shrink-0 mt-0.5" />
                        }
                        <span className={clsx('text-xs', sub.completed ? 'text-textMuted line-through' : 'text-white')}>{sub.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-textMuted mb-1">Owner</p>
                  <p className="text-xs text-white">{selectedTask.owner}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-textMuted mb-1">Priority</p>
                  <p className={clsx('text-xs font-bold',
                    selectedTask.priority === 'High' ? 'text-danger' : 
                    selectedTask.priority === 'Medium' ? 'text-warning' : 'text-textMuted'
                  )}>{selectedTask.priority}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[9px] uppercase tracking-widest text-textMuted mb-1">Last Updated</p>
                  <p className="text-xs text-white">{selectedTask.updatedAt}</p>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-border">
              <button onClick={() => openModal(selectedTask)} className="btn-secondary w-full flex items-center justify-center gap-2">
                <Edit2 size={14} /> Edit Task
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel w-full max-w-lg bg-surface flex flex-col max-h-[90vh]"
          >
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-base font-bold text-white">{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
              <button onClick={closeModal} className="text-textMuted hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-textMuted mb-1.5">Title *</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                  placeholder="Task title..." />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-textMuted mb-1.5">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-white focus:border-primary focus:outline-none min-h-[80px] resize-none"
                  placeholder="Describe the task..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-textMuted mb-1.5">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-white focus:border-primary focus:outline-none">
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Blocked">Blocked</option>
                    <option value="Review">Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-textMuted mb-1.5">Priority</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-white focus:border-primary focus:outline-none">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-textMuted mb-1.5">Progress ({progress}%)</label>
                <input type="range" min="0" max="100" value={progress} onChange={(e) => setProgress(parseInt(e.target.value))}
                  className="w-full accent-primary" />
              </div>
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3 bg-background/50">
              <button onClick={closeModal} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} className="btn-primary" disabled={!title}>
                {editingTask ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
