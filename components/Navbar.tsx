'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import {
  Sparkles,
  RefreshCw,
  Layers,
  CheckCircle2,
  LogOut,
  User,
  ChevronDown,
  ShieldCheck,
  LogIn,
  UserPlus,
} from 'lucide-react';

interface NavbarProps {
  currentProjectTitle?: string;
  onSeedSuccess?: () => void;
}

export default function Navbar({ currentProjectTitle, onSeedSuccess }: NavbarProps) {
  const { user, loading: authLoading, logout } = useAuth();
  const [seeding, setSeeding] = useState(false);
  const [seedDone, setSeedDone] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSeed = async () => {
    try {
      setSeeding(true);
      const res = await fetch('/api/seed', { method: 'POST' });
      if (res.ok) {
        setSeedDone(true);
        setTimeout(() => setSeedDone(false), 3000);
        if (onSeedSuccess) onSeedSuccess();
        window.location.reload();
      }
    } catch (err) {
      console.error('Seed error:', err);
    } finally {
      setSeeding(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border-subtle bg-surface/80 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400 font-bold text-white shadow-glow-brand group-hover:scale-105 transition-transform">
            <Layers className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              AUREVEX
              <span className="rounded bg-brand-500/20 px-1.5 py-0.5 text-[10px] font-medium tracking-normal text-brand-300 border border-brand-500/30 font-mono">
                ENTERPRISE
              </span>
            </span>
          </div>
        </Link>

        {currentProjectTitle && (
          <div className="hidden items-center gap-2 border-l border-border pl-4 md:flex">
            <span className="text-xs text-slate-400">Project:</span>
            <span className="max-w-[280px] truncate text-xs font-medium text-slate-200 bg-surface-raised px-2.5 py-1 rounded border border-border">
              {currentProjectTitle}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={handleSeed}
          disabled={seeding}
          className="flex items-center gap-1.5 rounded-lg border border-brand-500/40 bg-brand-500/10 px-3 py-1.5 text-xs font-medium text-brand-300 hover:bg-brand-500/20 hover:border-brand-500 transition-all shadow-sm"
          title="Seed realistic enterprise demo data into database"
        >
          {seeding ? (
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-brand-400" />
          ) : seedDone ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <Sparkles className="h-3.5 w-3.5 text-brand-400" />
          )}
          <span>{seeding ? 'Seeding...' : seedDone ? 'Demo Seeded!' : 'Seed Demo Data'}</span>
        </button>

        {/* User Account or Auth Links */}
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 rounded-xl border border-border bg-surface-raised px-3 py-1.5 text-xs text-slate-200 hover:border-brand-500/50 hover:bg-surface transition-all"
            >
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="font-semibold text-slate-100 max-w-[140px] truncate">
                {user.name}
              </span>
              <span className="hidden sm:inline-block text-[10px] text-slate-400 font-mono">
                ({user.role})
              </span>
              <ChevronDown className="h-3 w-3 text-slate-400 ml-0.5" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-surface-card p-2 shadow-2xl animate-in fade-in slide-in-from-top-2 z-50">
                <div className="px-3 py-2 border-b border-border/80 mb-1">
                  <span className="text-xs font-bold text-white block truncate">{user.name}</span>
                  <span className="text-[11px] text-slate-400 block truncate">{user.email}</span>
                  <span className="mt-1 inline-block rounded bg-brand-500/20 px-1.5 py-0.2 text-[9px] font-mono text-brand-300">
                    {user.role}
                  </span>
                </div>

                <div className="py-1">
                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-300 hover:bg-surface-raised hover:text-white rounded-lg transition-colors"
                  >
                    <Layers className="h-3.5 w-3.5 text-brand-400" />
                    <span>Workspace Dashboard</span>
                  </Link>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 rounded-lg transition-colors mt-1"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-raised px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-surface transition-all"
            >
              <LogIn className="h-3.5 w-3.5 text-brand-400" />
              <span>Sign In</span>
            </Link>
            <Link
              href="/signup"
              className="hidden sm:flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-500 shadow-glow-brand transition-all"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Sign Up</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
