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
  CircleDot,
  Search
} from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';

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

export default function Sidebar() {
  const pathname = usePathname();
  const workspace = useAppStore(state => state.workspace);
  const demoMode = useAppStore(state => state.demoMode);

  return (
    <div className="w-64 bg-[#0d0d0d] border-r border-[#1e1e1e] h-full flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-[#1e1e1e]">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 bg-primary/20 rounded flex items-center justify-center">
            <BrainCircuit size={16} className="text-primary" />
          </div>
          <h1 className="text-base font-bold tracking-[0.2em] text-white">AUREVEX</h1>
        </div>
        <p className="text-[9px] uppercase tracking-widest text-textMuted leading-relaxed">
          Digital Memory · Architectural Rationale · Continuity
        </p>
      </div>
      
      {/* Workspace */}
      <div className="px-5 py-3 border-b border-[#1e1e1e]">
        <p className="text-[9px] uppercase text-textMuted tracking-widest mb-1">Workspace</p>
        <p className="text-[11px] font-mono text-white font-medium truncate">
          {workspace === 'Engineering Demo' ? 'NORTHSTAR SYSTEMS LABS' : 'MBA STRATEGIC MANAGEMENT'}
        </p>
        <div className="flex items-center gap-1.5 mt-2">
          <CircleDot size={10} className="text-success" />
          <span className="text-[9px] text-success tracking-widest uppercase font-medium">System Online</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        <ul className="space-y-0.5 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2 rounded text-[12px] font-medium transition-all",
                    isActive 
                      ? "bg-primary/10 text-primary border-r-2 border-primary" 
                      : "text-textMuted hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon size={15} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Demo Badge */}
      {demoMode && (
        <div className="p-4 border-t border-[#1e1e1e]">
          <div 
            className="bg-primary/5 border border-primary/20 px-3 py-2 rounded text-center cursor-help"
            title="This prototype uses local mock data. Production integrations will be connected later."
          >
            <p className="text-[9px] text-primary font-bold tracking-[0.2em] uppercase">⬡ Demo Mode</p>
            <p className="text-[8px] text-textMuted mt-0.5">Local mock data only</p>
          </div>
        </div>
      )}
    </div>
  );
}
