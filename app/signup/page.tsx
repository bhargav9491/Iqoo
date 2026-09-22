'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Layers,
  Lock,
  Mail,
  User,
  Briefcase,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Lead Engineer');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters in length.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (!termsAccepted) {
      setErrorMessage('Please acknowledge the terms and continuous memory data policy.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          role: role.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Registration failed. Please try again.');
        return;
      }

      router.push(redirectUrl);
      router.refresh();
    } catch (err) {
      console.error('Registration failed:', err);
      setErrorMessage('Network error occurred. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-surface-card p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="space-y-1.5 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 px-3 py-0.5 text-[11px] font-mono text-brand-300 mb-1">
          <ShieldCheck className="h-3.5 w-3.5 text-brand-400" />
          <span>CREATE WORKSPACE ACCOUNT</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Join AUREVEX</h1>
        <p className="text-xs text-slate-400">
          Start preserving work memory, architectural decisions, and procedure workflows.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-950/30 p-3.5 flex items-start gap-3 text-xs text-rose-200 animate-in fade-in">
          <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{errorMessage}</div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 block">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Chen"
              className="w-full rounded-xl border border-border bg-surface pl-10 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 block">
            Work Email Address *
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
          <label className="text-xs font-semibold text-slate-300 block">
            Professional Role
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface pl-10 pr-3.5 py-2.5 text-xs text-slate-100 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
            >
              <option value="Lead Engineer">Lead Engineer</option>
              <option value="Principal Systems Architect">Principal Systems Architect</option>
              <option value="Kernel & Firmware Engineer">Kernel & Firmware Engineer</option>
              <option value="Hardware Validation Lead">Hardware Validation Lead</option>
              <option value="Technical Product Manager">Technical Product Manager</option>
              <option value="Engineering Manager">Engineering Manager</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 chars"
                className="w-full rounded-xl border border-border bg-surface pl-10 pr-8 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full rounded-xl border border-border bg-surface pl-10 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="pt-1">
          <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-400 hover:text-slate-300">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 bg-surface text-brand-500 focus:ring-brand-500"
            />
            <span className="text-[11px] leading-relaxed">
              I agree to the continuous work memory continuity protocols and enterprise data privacy terms.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-2.5 text-xs font-semibold text-white shadow-glow-brand hover:bg-brand-500 disabled:opacity-50 transition-all cursor-pointer"
        >
          {loading ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function SignupPage() {
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
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-brand-400 hover:text-brand-300 font-semibold underline underline-offset-4"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* Main Signup Card wrapped in Suspense */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10 my-4">
        <Suspense
          fallback={
            <div className="w-full max-w-md rounded-2xl border border-border bg-surface-card p-8 text-center text-xs text-slate-400">
              <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-brand-400" />
              Loading registration interface...
            </div>
          }
        >
          <SignupForm />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto p-6 text-center text-xs text-slate-500 font-mono">
        AUREVEX • Intelligence That Evolves With Your Work.
      </footer>
    </div>
  );
}
