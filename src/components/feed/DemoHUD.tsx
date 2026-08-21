'use client';

import { Play, Pause, RefreshCw, Zap, ShieldAlert, Cpu } from 'lucide-react';
import { StaminaGate } from '@/types';
import { getThresholdRules } from '@/lib/stamina/thresholdEngine';

interface DemoHUDProps {
  activeSeconds: number;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
  isDemoMode: boolean;
  setIsDemoMode: (demoMode: boolean) => void;
  onOverrideGate: (gate: StaminaGate) => void;
  currentGate: StaminaGate;
  onReset: () => void;
}

export default function DemoHUD({
  activeSeconds,
  isPaused,
  setIsPaused,
  isDemoMode,
  setIsDemoMode,
  onOverrideGate,
  currentGate,
  onReset,
}: DemoHUDProps) {
  const rules = getThresholdRules(isDemoMode);

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white rounded-xl border border-slate-700 shadow-2xl p-5 w-80 font-sans transition-all duration-300">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-400" />
          <span className="font-bold text-sm uppercase tracking-wider text-indigo-200">
            Judge Demo Controller
          </span>
        </div>
        <span className="bg-rose-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full animate-pulse">
          HUD Active
        </span>
      </div>

      {/* Timer & Play Control */}
      <div className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800 mb-4">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest block">
            Stamina Reading Session
          </span>
          <span className="text-3xl font-mono font-bold tracking-widest text-indigo-400">
            {Math.floor(activeSeconds / 60)
              .toString()
              .padStart(2, '0')}
            :{(activeSeconds % 60).toString().padStart(2, '0')}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`p-2 rounded-lg transition-colors border ${
              isPaused
                ? 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-500'
                : 'bg-amber-600 border-amber-500 text-white hover:bg-amber-500'
            }`}
            title={isPaused ? 'Resume Session Timer' : 'Pause Session Timer'}
          >
            {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
          </button>
          <button
            onClick={onReset}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-white hover:bg-slate-700"
            title="Reset active time to 0"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Fast Demo Mode Toggle */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold">Hackathon Speed Mode</span>
            <span className="text-[10px] text-slate-400">Standard triggers scaled down</span>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isDemoMode}
            onChange={(e) => setIsDemoMode(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>

      {/* Threshold indicator */}
      <div className="grid grid-cols-3 gap-1 text-[9px] text-slate-400 text-center mb-4">
        <div className={`p-1.5 rounded ${currentGate === 'short' ? 'bg-indigo-950/80 border border-indigo-700 font-bold text-white' : 'bg-slate-950'}`}>
          SHORT<br />&lt; {rules.short}s
        </div>
        <div className={`p-1.5 rounded ${currentGate === 'medium' ? 'bg-indigo-950/80 border border-indigo-700 font-bold text-white' : 'bg-slate-950'}`}>
          MEDIUM<br />&lt; {rules.medium}s
        </div>
        <div className={`p-1.5 rounded ${currentGate === 'long' ? 'bg-indigo-950/80 border border-indigo-700 font-bold text-white' : 'bg-slate-950'}`}>
          LONG<br />&gt;= {rules.medium}s
        </div>
      </div>

      {/* Manual Gate Override */}
      <div>
        <span className="text-[10px] text-slate-400 uppercase tracking-widest block mb-2 font-bold flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> Instant Gate Override
        </span>
        <div className="grid grid-cols-3 gap-2">
          {(['short', 'medium', 'long'] as StaminaGate[]).map((gate) => (
            <button
              key={gate}
              onClick={() => onOverrideGate(gate)}
              className={`py-1.5 text-xs rounded-lg font-bold border transition-all uppercase ${
                currentGate === gate
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-950'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {gate}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
