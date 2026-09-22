'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Camera,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  FileCheck,
  Upload,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  stepOrder: number;
  title: string;
  expectedAction: string;
  evidenceRequired: boolean;
  reviewStatus: string;
  observationNotes?: string | null;
  verificationOutcome?: string | null;
  observations?: any[];
}

interface Procedure {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  steps: Step[];
}

interface ProcedureInspectorProps {
  procedure: Procedure;
  projectId: string;
  onUpdate?: () => void;
}

export default function ProcedureInspector({ procedure, projectId, onUpdate }: ProcedureInspectorProps) {
  const [selectedStepId, setSelectedStepId] = useState<string>(procedure.steps[0]?.id || '');
  const [observationInput, setObservationInput] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [mockImage, setMockImage] = useState<string | null>(null);

  const currentStep = procedure.steps.find((s) => s.id === selectedStepId) || procedure.steps[0];

  const handleRunAiEvaluation = async () => {
    if (!currentStep) return;
    try {
      setAnalyzing(true);
      setAiResult(null);

      const res = await fetch(`/api/projects/${projectId}/procedures/${procedure.id}/steps/${currentStep.id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          observationText: observationInput || currentStep.observationNotes || 'Standard test bench run executed.',
          imageUrl: mockImage || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setAiResult(data.evaluation);
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      console.error('Procedure evaluation failed:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleHumanConfirmation = async (status: 'VERIFIED' | 'DEVIATION_DETECTED') => {
    if (!currentStep) return;
    try {
      setAnalyzing(true);
      const res = await fetch(`/api/projects/${projectId}/procedures/${procedure.id}/steps/${currentStep.id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          humanConfirmedStatus: status,
          observationText: observationInput || currentStep.observationNotes,
        }),
      });

      if (res.ok) {
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      console.error('Human confirmation failed:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const loadSampleTelemetry = (type: 'normal' | 'anomaly') => {
    if (type === 'normal') {
      setObservationInput('Oscilloscope Channel 1 verifies smooth 20V ramp with <0.8°C/min temperature gradient. Ripple amplitude steady at 12mV.');
      setMockImage('https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=80');
    } else {
      setObservationInput('Warning: Thermistor B registered rapid +3.1°C temperature spike during 120W peak injection. Potential deviation detected against standard threshold.');
      setMockImage('https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-border bg-surface-card p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-brand-500/20 px-2 py-0.5 text-xs font-mono font-bold text-brand-300 border border-brand-500/30">
              {procedure.category}
            </span>
            <h2 className="text-lg font-bold text-white">{procedure.title}</h2>
          </div>
          <p className="mt-1 text-xs text-slate-400">{procedure.description}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Procedure Status:</span>
          <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300 border border-amber-500/30">
            {procedure.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Steps List (Left Column) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
            Sequential Protocol Steps ({procedure.steps.length})
          </h3>
          <div className="space-y-2">
            {procedure.steps.map((step) => {
              const isSelected = step.id === currentStep?.id;
              return (
                <button
                  key={step.id}
                  onClick={() => {
                    setSelectedStepId(step.id);
                    setAiResult(null);
                    setObservationInput(step.observationNotes || '');
                  }}
                  className={cn(
                    'w-full text-left p-3.5 rounded-xl border transition-all',
                    isSelected
                      ? 'bg-surface-raised border-brand-500/60 shadow-glow-brand'
                      : 'bg-surface border-border hover:border-slate-600'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-brand-400">
                      STEP 0{step.stepOrder}
                    </span>
                    <span
                      className={cn(
                        'text-[10px] font-mono px-2 py-0.5 rounded-full border',
                        step.reviewStatus === 'VERIFIED'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : step.reviewStatus === 'DEVIATION_DETECTED'
                          ? 'bg-rose-500/10 text-rose-300 border-rose-500/30 animate-pulse'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      )}
                    >
                      {step.reviewStatus}
                    </span>
                  </div>
                  <div className="mt-1 text-xs font-medium text-slate-200 line-clamp-1">
                    {step.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Inspector & Verification Studio (Right Column) */}
        <div className="lg:col-span-8 rounded-2xl border border-border bg-surface-card p-5 space-y-5">
          {currentStep ? (
            <>
              <div className="border-b border-border pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-brand-400 font-bold">
                    STEP {currentStep.stepOrder} OF {procedure.steps.length}
                  </span>
                  {currentStep.evidenceRequired && (
                    <span className="text-[11px] text-amber-300 flex items-center gap-1">
                      <Camera className="h-3 w-3" /> Evidence Required
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-white mt-1">{currentStep.title}</h3>
                <div className="mt-2 rounded-lg bg-surface-raised p-3 border border-border">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase font-mono block">
                    Expected Action & Criteria:
                  </span>
                  <p className="text-xs text-slate-200 mt-0.5">{currentStep.expectedAction}</p>
                </div>
              </div>

              {/* Observation Input */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 font-mono">
                    Telemetry / Observation Notes:
                  </label>
                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      onClick={() => loadSampleTelemetry('normal')}
                      className="text-brand-400 hover:underline px-1.5 py-0.5 rounded bg-brand-950/40 border border-brand-800/40"
                    >
                      Load Nominal Sample
                    </button>
                    <button
                      onClick={() => loadSampleTelemetry('anomaly')}
                      className="text-rose-400 hover:underline px-1.5 py-0.5 rounded bg-rose-950/40 border border-rose-800/40"
                    >
                      Load Anomaly Sample
                    </button>
                  </div>
                </div>

                <textarea
                  rows={3}
                  value={observationInput}
                  onChange={(e) => setObservationInput(e.target.value)}
                  placeholder="Record oscilloscope readings, firmware output logs, or test bench sensor observations..."
                  className="w-full rounded-xl border border-border bg-surface p-3 text-xs text-slate-100 placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />

                {mockImage && (
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-2.5">
                    <img
                      src={mockImage}
                      alt="Telemetry Observation"
                      className="h-16 w-24 object-cover rounded border border-border"
                    />
                    <div className="text-xs text-slate-300">
                      <span className="font-semibold block text-white">Oscilloscope_Telemetry_Trace.png</span>
                      <span className="text-slate-500 font-mono text-[10px]">Captured via Lab Bench Probe 1</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <button
                    onClick={handleRunAiEvaluation}
                    disabled={analyzing}
                    className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-500 shadow-glow-brand transition-all disabled:opacity-50"
                  >
                    {analyzing ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <ShieldAlert className="h-3.5 w-3.5" />
                    )}
                    <span>{analyzing ? 'Evaluating Evidence...' : 'Run Procedure Intelligence Check'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleHumanConfirmation('VERIFIED')}
                      className="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Confirm Step
                    </button>
                    <button
                      onClick={() => handleHumanConfirmation('DEVIATION_DETECTED')}
                      className="flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20"
                    >
                      <AlertTriangle className="h-3.5 w-3.5" /> Flag Deviation
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Evaluation Alert Card */}
              {aiResult && (
                <div
                  className={cn(
                    'rounded-xl border p-4 space-y-2 transition-all',
                    aiResult.deviationDetected
                      ? 'border-rose-500/50 bg-rose-950/30'
                      : 'border-emerald-500/50 bg-emerald-950/30'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {aiResult.deviationDetected ? (
                        <AlertTriangle className="h-4 w-4 text-rose-400" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      )}
                      <span className="text-xs font-bold font-mono">
                        {aiResult.deviationDetected
                          ? 'POTENTIAL DEVIATION DETECTED'
                          : 'STEP CRITERIA SATISFIED'}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      Confidence: {Math.round(aiResult.confidence * 100)}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed">
                    {aiResult.deviationDetails || aiResult.recommendation}
                  </p>

                  <div className="text-[10px] text-slate-400 border-t border-white/10 pt-2 font-mono">
                    Responsible AI Guard: Manual verification required before concluding high-power test.
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-xs text-slate-500 text-center py-10">Select a step to inspect</div>
          )}
        </div>
      </div>
    </div>
  );
}
