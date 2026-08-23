'use client';

import React from 'react';
import { useAttentionTrainer } from '@/contexts/AttentionTrainerContext';

export default function StitchStaminaStats() {
  const {
    longestUnbrokenRead,
    sessionWordsRead,
    totalWordsReadToday,
    dailyGoalWords,
    masteredContexts,
    rollingAverages,
    staminaLevel,
    xp,
    baselineLength,
  } = useAttentionTrainer();

  const goalPercent = Math.min(100, Math.round((totalWordsReadToday / dailyGoalWords) * 100));
  const growthMultiplier = (longestUnbrokenRead / Math.max(1, baselineLength)).toFixed(1);

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-margin-page pt-8 flex flex-col gap-8 pb-28">
      {/* Hero Block: Longest Unbroken Read */}
      <section className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h2 className="font-label-mono text-[11px] text-graphite uppercase tracking-widest font-bold">
            Longest Unbroken Read
          </h2>
          <span className="font-label-mono text-[11px] text-ink-blue uppercase tracking-wider font-bold">
            STAMINA LEVEL {staminaLevel} · {xp} XP
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="font-display-lg text-[64px] md:text-[76px] text-ink-blue font-serif leading-none">
            {longestUnbrokenRead}
          </span>
          <span className="font-label-mono text-[12px] text-graphite uppercase tracking-widest font-semibold">
            Words
          </span>
        </div>
        <p className="font-article-body-mobile text-[16px] text-graphite">
          Your initial calibration was {baselineLength} words. You've grown your sustained focus by {growthMultiplier}x.
        </p>
      </section>

      {/* Horizontal Ruler Visualization */}
      <section className="py-4 w-full relative">
        <div className="w-full h-[2px] bg-paper-border relative">
          {/* Fill Line */}
          <div
            className="h-[2px] bg-ink-blue absolute top-0 left-0 transition-all duration-1000 ease-in-out"
            style={{ width: `${Math.min(100, (longestUnbrokenRead / 500) * 100)}%` }}
          />
        </div>

        {/* Tick Marks container */}
        <div className="relative w-full flex justify-between pt-3">
          {[0, 100, 200, 300, 400, 500].map((val) => (
            <div key={val} className="flex flex-col items-center">
              <div className="w-[1px] h-2 bg-paper-border mb-1" />
              <span className="font-label-mono text-[10px] text-graphite font-medium">
                {val}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Bento List */}
      <section className="flex flex-col bg-surface-container-lowest border border-hairline rounded p-6 gap-2 shadow-xs">
        <div className="flex flex-row justify-between items-center py-3.5 border-b border-hairline">
          <span className="font-label-mono text-[11px] text-graphite tracking-widest uppercase">
            CURRENT SESSION
          </span>
          <span className="font-label-mono text-[13px] text-on-surface font-semibold tracking-widest">
            {sessionWordsRead.toLocaleString()} WORDS
          </span>
        </div>

        <div className="flex flex-row justify-between items-center py-3.5 border-b border-hairline">
          <span className="font-label-mono text-[11px] text-graphite tracking-widest uppercase">
            MAX DEPTH
          </span>
          <span className="font-label-mono text-[13px] text-on-surface font-semibold tracking-widest">
            {longestUnbrokenRead} WORDS
          </span>
        </div>

        <div className="flex flex-col gap-2.5 pt-3.5">
          <div className="flex flex-row justify-between items-center">
            <span className="font-label-mono text-[11px] text-graphite tracking-widest uppercase">
              DAILY GOAL: {dailyGoalWords.toLocaleString()} WORDS
            </span>
            <span className="font-label-mono text-[12px] text-ink-blue font-bold tracking-widest">
              {goalPercent}%
            </span>
          </div>
          <div className="w-full h-[3px] bg-paper-border relative rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-ink-blue transition-all duration-1000 ease-in-out"
              style={{ width: `${goalPercent}%` }}
            />
          </div>
        </div>
      </section>

      {/* Mastered Contexts Section */}
      <section className="flex flex-col gap-4">
        <h3 className="font-label-mono text-[11px] text-graphite tracking-widest uppercase font-bold">
          Mastered Contexts ({masteredContexts.length})
        </h3>
        <ul className="flex flex-col bg-surface-container-lowest border border-hairline rounded divide-y divide-hairline">
          {masteredContexts.map((ctx) => (
            <li key={ctx.id} className="p-5 hover:bg-paper/30 transition-colors">
              <div className="flex justify-between items-center mb-1">
                <span className="font-label-mono text-[10px] text-graphite uppercase tracking-wider">
                  {ctx.topic}
                </span>
                <span className="font-label-mono text-[10px] text-ink-blue font-semibold">
                  {ctx.completedAt}
                </span>
              </div>
              <p className="font-article-body-mobile text-[16px] text-on-surface leading-relaxed">
                <span className="highlight-felt font-medium">{ctx.title}</span> — {ctx.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Attention Span Visualization Rolling Average */}
      <section className="w-full bg-surface-container-lowest border border-hairline rounded relative p-6 flex flex-col items-center justify-center min-h-[180px] shadow-xs">
        <div className="w-full flex items-center justify-between mb-4 pb-2 border-b border-hairline">
          <span className="font-label-mono text-[10px] text-graphite uppercase tracking-widest font-bold">
            Attention Span Visualization
          </span>
          <span className="font-label-mono text-[10px] text-ink-blue uppercase tracking-widest font-bold">
            Rolling 15-day average
          </span>
        </div>

        {/* Minimalist Bar Graph */}
        <div className="w-full h-24 flex items-end gap-2 px-2">
          {rollingAverages.map((val, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full rounded-t-sm transition-all ${
                  idx === rollingAverages.length - 1 ? 'bg-ink-blue' : 'bg-paper-border hover:bg-ink-blue/40'
                }`}
                style={{ height: `${val}%` }}
                title={`Day ${idx + 1}: ${val}% focus depth`}
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
