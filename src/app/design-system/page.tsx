'use client';

import React from 'react';
import MeasuringRail from '@/components/feed/MeasuringRail';
import StitchFeedCard from '@/components/stitch/StitchFeedCard';
import RefresherCard from '@/components/feed/RefresherCard';
import MilestoneCard from '@/components/feed/MilestoneCard';

export default function DesignSystemAcceptancePage() {
  return (
    <div className="min-h-screen bg-[var(--stock)] text-[var(--ink)] p-6 md:p-12 max-w-5xl mx-auto space-y-12">
      {/* Page Header */}
      <header className="border-b border-[var(--rule)] pb-6">
        <span className="t-label block mb-1">ACCEPTANCE TEST & SPECIFICATION</span>
        <h1 className="t-hero">Tidbit Design System</h1>
        <p className="t-body mt-2">
          Strict warm-stock theme, 4-font typography scale, measuring rail, and topic-hue mapping.
        </p>
      </header>

      {/* 1. Surfaces & Tokens */}
      <section className="space-y-4">
        <h2 className="t-title">1. Surfaces & Radii</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[
            { name: '--stock', bg: 'var(--stock)', border: true },
            { name: '--insert', bg: 'var(--insert)', border: true },
            { name: '--ink', bg: 'var(--ink)', textLight: true },
            { name: '--graphite', bg: 'var(--graphite)', textLight: true },
            { name: '--rule', bg: 'var(--rule)', border: true },
            { name: '--inset', bg: 'var(--inset)', border: true },
          ].map((s) => (
            <div
              key={s.name}
              className="p-4 rounded-[var(--r-card)] border border-[var(--rule)] flex flex-col justify-between h-24"
              style={{ backgroundColor: s.bg, color: s.textLight ? 'var(--insert)' : 'var(--ink)' }}
            >
              <span className="t-label font-bold">{s.name}</span>
              <span className="t-num">{s.bg}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Topic Hues */}
      <section className="space-y-4">
        <h2 className="t-title">2. Topic Hues (One Per Screen/Card)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: '--hue-tech (#5C6B8A)', varName: '--hue-tech', label: 'AI & Tech (Slate)' },
            { name: '--hue-psych (#B87A5E)', varName: '--hue-psych', label: 'Psychology (Clay)' },
            { name: '--hue-marketing (#7A9070)', varName: '--hue-marketing', label: 'Marketing (Sage)' },
            { name: '--hue-writing (#8A82B5)', varName: '--hue-writing', label: 'Writing (Lavender)' },
            { name: '--hue-money (#B08A3E)', varName: '--hue-money', label: 'Money (Ochre)' },
            { name: '--hue-space (#4E5A9B)', varName: '--hue-space', label: 'Space (Indigo)' },
            { name: '--hue-health (#7D9B8F)', varName: '--hue-health', label: 'Health (Eucalyptus)' },
            { name: '--hue-default (#6B655C)', varName: '--hue-default', label: 'Fallback (Graphite)' },
          ].map((h) => (
            <div
              key={h.varName}
              className="p-4 rounded-[var(--r-card)] border border-[var(--rule)] bg-[var(--insert)] flex flex-col justify-between h-24"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-sm shrink-0"
                  style={{ backgroundColor: `var(${h.varName})` }}
                />
                <span className="t-label font-bold">{h.label}</span>
              </div>
              <span className="t-num text-[var(--graphite)]">{h.varName}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Typography Scale */}
      <section className="space-y-4 border-t border-[var(--rule)] pt-8">
        <h2 className="t-title">3. Typography Scale (Violent 4x Contrast)</h2>
        <div className="space-y-6 bg-[var(--insert)] p-6 rounded-[var(--r-card)] border border-[var(--rule)]">
          <div>
            <span className="t-label block mb-1">.t-hero (Display 40px/42px)</span>
            <p className="t-hero">Single-Tasking & Attention Bandwidth</p>
          </div>
          <div>
            <span className="t-label block mb-1">.t-title (Display 26px/30px)</span>
            <p className="t-title">How AI Reads: The Autocomplete Analogy</p>
          </div>
          <div>
            <span className="t-label block mb-1">.t-body (Newsreader 17px/27px, max-w 34rem)</span>
            <p className="t-body">
              Imagine a supercharged autocomplete that has read the entire internet. It does not think with human feelings; it calculates the most likely next word with precision.
            </p>
          </div>
          <div>
            <span className="t-label block mb-1">.t-quote (Newsreader 17px/27px Italic)</span>
            <p className="t-quote">
              Like guessing the next word a close friend is going to say based on years of conversations.
            </p>
          </div>
          <div>
            <span className="t-label block mb-1">.t-ui (Instrument Sans 14px/20px weight 500)</span>
            <p className="t-ui text-[var(--ink)]">
              Save · Quick check · Share · Focus
            </p>
          </div>
          <div>
            <span className="t-label block mb-1">.t-label & .t-num (IBM Plex Mono 10px / 11px uppercase)</span>
            <p className="t-label">BEGINNER · 85 WORDS</p>
          </div>
        </div>
      </section>

      {/* 4. Measuring Rail Variants */}
      <section className="space-y-4 border-t border-[var(--rule)] pt-8">
        <h2 className="t-title">4. Measuring Rail (31, 138 & 421 Words Side by Side)</h2>
        <div className="flex gap-8 bg-[var(--insert)] p-6 rounded-[var(--r-card)] border border-[var(--rule)] h-[320px] items-stretch">
          <div className="flex flex-col items-center gap-2">
            <span className="t-label">31 WORDS</span>
            <MeasuringRail wordCount={31} topic="AI & Machine Learning" className="h-[240px]" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="t-label">138 WORDS</span>
            <MeasuringRail wordCount={138} topic="Cognitive Science" className="h-[240px]" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="t-label">421 WORDS</span>
            <MeasuringRail wordCount={421} topic="Growth & Marketing" className="h-[240px]" />
          </div>
        </div>
      </section>

      {/* 5. Feed Cards in Various States */}
      <section className="space-y-6 border-t border-[var(--rule)] pt-8">
        <h2 className="t-title">5. Feed Cards (Phone Width 420px Column)</h2>
        <div className="max-w-[420px] mx-auto space-y-6">
          {/* Short Card */}
          <div>
            <span className="t-label block mb-2">SHORT CARD · AI & TECH (SLATE HUE)</span>
            <StitchFeedCard
              article={{
                id: 'demo-short',
                type: 'short',
                topic: 'AI & Machine Learning',
                title: 'How AI Reads: Autocomplete Analogy',
                excerpt: 'Imagine a supercharged autocomplete that has read the entire internet. It calculates the most likely next word.',
                wordCount: 45,
                progressPercent: 20,
                difficultyLevel: 'Beginner',
                analogy: 'Like guessing the next word a close friend will say.',
                keyTakeaway: 'AI models predict the next most probable word.',
              }}
              onRead={() => {}}
            />
          </div>

          {/* Medium Card */}
          <div>
            <span className="t-label block mb-2">MEDIUM CARD · PSYCHOLOGY (CLAY HUE)</span>
            <StitchFeedCard
              article={{
                id: 'demo-medium',
                type: 'medium',
                topic: 'Cognitive Science',
                title: 'Single-Tasking & Attention Residue',
                excerpt: 'When you check a quick notification, your brain leaves focus behind on that task, slowing thinking for 20 minutes.',
                wordCount: 140,
                progressPercent: 50,
                difficultyLevel: 'Intermediate',
                analogy: 'Like trying to accelerate a car with the handbrake engaged.',
                keyTakeaway: 'Context switching creates cognitive debt.',
              }}
              onRead={() => {}}
            />
          </div>

          {/* Long Card */}
          <div>
            <span className="t-label block mb-2">LONG CARD · MARKETING (SAGE HUE)</span>
            <StitchFeedCard
              article={{
                id: 'demo-long',
                type: 'long',
                topic: 'Growth & Marketing',
                title: 'CAC to LTV Unit Economics',
                excerpt: 'The golden rule of sustainable growth: making at least $3 from a customer for every $1 spent acquiring them across organic loops.',
                wordCount: 420,
                progressPercent: 85,
                difficultyLevel: 'Advanced',
                analogy: 'Replenishing a reservoir faster than evaporation occurs.',
                keyTakeaway: 'Sustainable loop velocity beats ad spend.',
              }}
              onRead={() => {}}
            />
          </div>

          {/* Refresher Card */}
          <div>
            <span className="t-label block mb-2">REFRESHER CARD · WRITING (LAVENDER HUE)</span>
            <RefresherCard
              card={{
                _id: 'demo-refresher',
                type: 'refresher',
                topic: 'Literature & Prose',
                content: {
                  title: 'Active Voice & Concrete Nouns',
                  summary: 'Subtractive editing strips filler words to let active verbs drive narrative momentum.',
                  keyTakeaway: 'Prefer specific nouns over abstract adjectives.',
                  wordCount: 110,
                },
              }}
              onRead={() => {}}
            />
          </div>

          {/* Milestone Card */}
          <div>
            <span className="t-label block mb-2">MILESTONE CARD · MONEY (OCHRE HUE)</span>
            <MilestoneCard
              milestone={{
                nicheId: 'niche-money',
                nicheTitle: 'Pricing & Monetization',
                nodeTitle: 'Willingness to Pay',
                nodeIndex: 3,
                xpReward: 100,
                nextNodeTitle: 'Value Capture Architecture',
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
