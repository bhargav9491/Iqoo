'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderGit2,
  PlayCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MobileNav() {
  const pathname = usePathname();

  const items = [
    { label: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', href: '/projects', icon: FolderGit2 },
    { label: 'Resume', href: '/resume', icon: PlayCircle },
    { label: 'Decisions', href: '/decisions', icon: Clock },
    { label: 'Procedures', href: '/procedures', icon: ShieldCheck },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-border-subtle bg-surface/95 px-2 backdrop-blur-lg md:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center gap-1 py-1 text-[10px] font-medium transition-colors w-14',
              isActive ? 'text-brand-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            )}
          >
            <Icon className={cn('h-5 w-5', isActive && 'text-brand-400')} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
