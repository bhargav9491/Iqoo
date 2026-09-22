'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Layers,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';
  const registeredSuccess = searchParams.get('registered') === 'true';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(
    registeredSuccess ? 'Account created successfully. Please sign in.' : ''
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email address and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Invalid email or password. Please try again.');
        return;
      }

      router.push(redirectUrl);
      router.refresh();
    } catch (err) {
      console.error('Login request failed:', err);
      setErrorMessage('Network error occurred. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoFill = () => {
    setEmail('alex.chen@aurevex.internal');
    setPassword('password123');
    setErrorMessage('');
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-surface-card p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="space-y-1.5 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 px-3 py-0.5 text-[11px] font-mono text-brand-300 mb-1">
          <ShieldCheck className="h-3.5 w-3.5 text-brand-400" />
          <span>AUTHENTICATION</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Sign In to AUREVEX</h1>
        <p className="text-xs text-slate-400">
          Access your digital work memory, architectural decisions, and procedure workflows.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-950/30 p-3.5 flex items-start gap-3 text-xs text-rose-200 animate-in fade-in">
          <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{errorMessage}</div>
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3.5 flex items-start gap-3 text-xs text-emerald-200 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{successMessage}</div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 block">
            Work Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="engineer@company.com"
              className="w-full rounded-xl border border-border bg-surface pl-10 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 block">
              Password
            </label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-xl border border-border bg-surface pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 transition-colors"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-slate-700 bg-surface text-brand-500 focus:ring-brand-500"
            />
            <span>Remember session</span>
          </label>

          <span className="text-[11px] text-slate-500 font-mono">
            Secure JWT & Cookie
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-2.5 text-xs font-semibold text-white shadow-glow-brand hover:bg-brand-500 disabled:opacity-50 transition-all cursor-pointer"
        >
          {loading ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Verifying Credentials...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Quick Demo Fill Button */}
      <div className="pt-2 border-t border-border">
        <button
          type="button"
          onClick={handleQuickDemoFill}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-brand-500/30 bg-brand-950/20 py-2 text-xs font-medium text-brand-300 hover:bg-brand-950/40 hover:border-brand-500/50 transition-all"
        >
          <Sparkles className="h-3.5 w-3.5 text-brand-400" />
          <span>Fill Demo Credentials (Alex Chen)</span>
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col justify-between relative bg-grid-pattern selection:bg-brand-500 selection:text-white">
      {/* Top Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-radial-gradient pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-6xl mx-auto p-6 flex items-center justify-between relative z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400 font-bold text-white shadow-glow-brand group-hover:scale-105 transition-transform">
            <Layers className="h-5 w-5" />
          </div>
          <span className="font-mono text-lg font-bold tracking-tight text-white">
            AUREVEX
          </span>
        </Link>

        <div className="text-xs text-slate-400">
          Don't have an account?{' '}
          <Link
            href="/signup"
            className="text-brand-400 hover:text-brand-300 font-semibold underline underline-offset-4"
          >
            Create account
          </Link>
        </div>
      </header>

      {/* Main Login Card wrapped in Suspense */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <Suspense
          fallback={
            <div className="w-full max-w-md rounded-2xl border border-border bg-surface-card p-8 text-center text-xs text-slate-400">
              <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-brand-400" />
              Loading login interface...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto p-6 text-center text-xs text-slate-500 font-mono">
        AUREVEX • Intelligence That Evolves With Your Work.
      </footer>
    </div>
  );
}
