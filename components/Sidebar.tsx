"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  CheckSquare, 
  History, 
  ShieldAlert, 
  Network, 
  FileOutput, 
  ActivitySquare, 
  Settings,
  CircleDot
} from 'lucide-react';
import clsx from 'clsx';

export default function Sidebar() {
  const pathname = usePathname();
  const workspace = useAppStore(state => state.workspace);
  const demoMode = useAppStore(state => state.demoMode);

  const navItems = [
    { name: 'Overview', href: '/', icon: LayoutDashboard },
    { name: 'Work Memory', href: '/memory', icon: BrainCircuit },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Decision Time Machine', href: '/decisions', icon: History },
    { name: 'Procedure Guard', href: '/procedure', icon: ShieldAlert },
    { name: 'Knowledge Graph', href: '/knowledge', icon: Network },
    { name: 'Handover', href: '/handover', icon: FileOutput },
    { name: 'Activity', href: '/activity', icon: ActivitySquare },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-surface border-r border-border h-full flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold tracking-widest text-primary flex items-center gap-2">
          <BrainCircuit size={24} className="text-primary" />
          AUREVEX
        </h1>
        <p className="text-[10px] uppercase tracking-wider text-textMuted mt-2">
          Digital Memory
          <br/>Architectural Rationale
          <br/>Continuity
        </p>
      </div>
      
      <div className="px-6 py-4 border-b border-border">
        <p className="text-[10px] uppercase text-textMuted tracking-wider mb-1">Workspace:</p>
        <p className="text-sm font-mono text-white truncate" title={workspace.toUpperCase()}>
          {workspace.toUpperCase()}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <CircleDot size={12} className="text-success animate-pulse" />
          <span className="text-xs text-success tracking-wide uppercase">System Online</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-textMuted hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {demoMode && (
        <div className="p-4 border-t border-border">
          <div className="bg-primary/10 border border-primary/30 p-3 rounded text-center cursor-help" title="This prototype uses local mock data. Production integrations will be connected later.">
            <p className="text-xs text-primary font-bold tracking-wider uppercase">Demo Mode</p>
          </div>
        </div>
      )}
    </div>
  );
}
