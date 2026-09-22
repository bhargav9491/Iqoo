"use client";

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Task, TaskStatus, TaskPriority } from '@/lib/types';
import { 
  CheckSquare, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical,
  Edit2,
  Trash2,
  X
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask, workspace } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('Not Started');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [progress, setProgress] = useState(0);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
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
      updateTask({
        ...editingTask,
        title,
        description,
        status,
        priority,
        progress,
        updatedAt: 'Just now'
      });
    } else {
      addTask({
        id: `t-${uuidv4().slice(0, 6)}`,
        title,
        description,
        project: workspace === 'Engineering Demo' ? 'Smart Infrastructure Monitoring' : 'MBA Strategic Management',
        owner: workspace === 'Engineering Demo' ? 'Demo Engineer' : 'MBA Student',
        status,
        priority,
        progress,
        subtasks: [],
        updatedAt: 'Just now'
      });
    }
    closeModal();
  };

  const statusColors: Record<TaskStatus, string> = {
    'Not Started': 'text-textMuted',
    'In Progress': 'text-secondary',
    'Blocked': 'text-danger',
    'Review': 'text-warning',
    'Completed': 'text-success'
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <CheckSquare size={32} className="text-primary" />
            Task Management
          </h1>
          <p className="text-textMuted mt-2 text-lg">Track progress, blockers, and completions.</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Task
        </button>
      </header>

      <div className="glass-panel p-6 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="w-full bg-background border border-border rounded pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-textMuted" />
          <select 
            className="bg-background border border-border rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-primary cursor-pointer"
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

      <div className="glass-panel overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface text-xs uppercase tracking-wider text-textMuted">
              <th className="px-6 py-4 font-medium">Task</th>
              <th className="px-6 py-4 font-medium">Owner</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Priority</th>
              <th className="px-6 py-4 font-medium">Progress</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50 text-sm">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <tr key={task.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-medium text-white mb-1">{task.title}</p>
                    <p className="text-xs text-textMuted truncate max-w-sm">{task.description}</p>
                  </td>
                  <td className="px-6 py-4 text-textMuted">{task.owner}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 font-medium ${statusColors[task.status]}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      task.priority === 'High' ? 'bg-danger/10 text-danger border border-danger/20' : 
                      task.priority === 'Medium' ? 'bg-warning/10 text-warning border border-warning/20' : 
                      'bg-surface border border-border text-textMuted'
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden max-w-[100px]">
                        <div 
                          className={`h-full ${task.progress === 100 ? 'bg-success' : 'bg-primary'}`} 
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-mono text-textMuted">{task.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal(task)} className="p-1.5 text-textMuted hover:text-white hover:bg-surface rounded transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => deleteTask(task.id)} className="p-1.5 text-textMuted hover:text-danger hover:bg-danger/10 rounded transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-textMuted">
                  No tasks found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-lg bg-surface flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-lg font-bold text-white">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
              <button onClick={closeModal} className="text-textMuted hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs uppercase tracking-wider text-textMuted mb-2">Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                  placeholder="Task title..."
                />
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-wider text-textMuted mb-2">Description</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-white focus:border-primary focus:outline-none min-h-[100px]"
                  placeholder="Task description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-textMuted mb-2">Status</label>
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Blocked">Blocked</option>
                    <option value="Review">Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-textMuted mb-2">Priority</label>
                  <select 
                    value={priority} 
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-textMuted mb-2">
                  Progress ({progress}%)
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={progress} 
                  onChange={(e) => setProgress(parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-border flex justify-end gap-3 bg-background/50">
              <button onClick={closeModal} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} className="btn-primary" disabled={!title}>
                {editingTask ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
