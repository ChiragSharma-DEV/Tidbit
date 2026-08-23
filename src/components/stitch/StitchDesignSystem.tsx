'use client';

import React from 'react';

export default function StitchDesignSystem() {
  return (
    <main className="max-w-3xl mx-auto px-4 md:px-margin-page py-8 flex flex-col gap-10 pb-28 text-on-surface">
      {/* Title */}
      <div>
        <div className="font-label-mono text-[11px] text-ink-blue uppercase tracking-widest font-bold mb-1">
          DESIGN CONTRACT & TOKENS
        </div>
        <h1 className="font-display-lg text-[36px] md:text-[44px] text-on-background font-serif">
          Quiet Print Design System
        </h1>
        <p className="font-article-body-mobile text-graphite mt-2 text-[16px] leading-relaxed">
          Rooted in a disciplined minimalism with a tactile, paper-like quality. It rejects 3D drop-shadows and glassmorphism in favor of hairline borders, paper tones, and the signature 28px left gutter attention ruler.
        </p>
      </div>

      {/* Brand & Elevation Philosophy */}
      <section className="flex flex-col gap-4">
        <h2 className="font-headline-md text-[24px] font-serif border-b border-hairline pb-2">
          Elevation & Depth
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-paper border border-hairline p-5 rounded">
            <span className="font-label-mono text-[11px] text-graphite uppercase tracking-wider block mb-1">
              LEVEL 0 · CANVAS
            </span>
            <div className="font-headline-md text-[18px] text-on-surface font-serif">
              Paper Stock (#F4F4F0)
            </div>
            <p className="font-article-body-mobile text-[14px] text-graphite mt-1">
              Primary canvas reducing digital eye strain compared to stark white.
            </p>
          </div>
          <div className="bg-surface-container-lowest border border-hairline p-5 rounded">
            <span className="font-label-mono text-[11px] text-graphite uppercase tracking-wider block mb-1">
              LEVEL 1 · SURFACE INSERT
            </span>
            <div className="font-headline-md text-[18px] text-on-surface font-serif">
              Pure White (#FFFFFF)
            </div>
            <p className="font-article-body-mobile text-[14px] text-graphite mt-1">
              Framed by a 1px hairline border (#DFDFD7) to create quiet structural clarity.
            </p>
          </div>
        </div>
      </section>

      {/* Color Palette */}
      <section className="flex flex-col gap-4">
        <h2 className="font-headline-md text-[24px] font-serif border-b border-hairline pb-2">
          Color Tokens
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-surface-container-lowest border border-hairline p-3 rounded flex flex-col gap-2">
            <div className="w-full h-12 bg-primary-container rounded-sm" />
            <div>
              <div className="font-label-mono text-[11px] text-ink-blue font-bold">Ink Blue</div>
              <div className="font-label-mono text-[10px] text-graphite">#2F2BC4 · Primary</div>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-hairline p-3 rounded flex flex-col gap-2">
            <div className="w-full h-12 bg-tertiary-fixed rounded-sm border border-hairline" />
            <div>
              <div className="font-label-mono text-[11px] text-on-surface font-bold">Felt Highlight</div>
              <div className="font-label-mono text-[10px] text-graphite">#FFDBD1 · Accent</div>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-hairline p-3 rounded flex flex-col gap-2">
            <div className="w-full h-12 bg-[#16171B] rounded-sm" />
            <div>
              <div className="font-label-mono text-[11px] text-on-surface font-bold">Ink Black</div>
              <div className="font-label-mono text-[10px] text-graphite">#16171B · Text</div>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-hairline p-3 rounded flex flex-col gap-2">
            <div className="w-full h-12 bg-graphite rounded-sm" />
            <div>
              <div className="font-label-mono text-[11px] text-on-surface font-bold">Graphite</div>
              <div className="font-label-mono text-[10px] text-graphite">#5E5E63 · Meta</div>
            </div>
          </div>
        </div>
      </section>

      {/* Typography Hierarchy */}
      <section className="flex flex-col gap-4">
        <h2 className="font-headline-md text-[24px] font-serif border-b border-hairline pb-2">
          Typography System
        </h2>
        <div className="bg-surface-container-lowest border border-hairline rounded p-6 flex flex-col gap-6">
          <div className="border-b border-hairline pb-4">
            <span className="font-label-mono text-[10px] text-graphite uppercase tracking-widest block mb-1">
              DISPLAY LG · INSTRUMENT SERIF
            </span>
            <div className="font-display-lg text-[36px] md:text-[44px] text-on-surface font-serif leading-tight">
              Reclaiming Human Focus
            </div>
          </div>

          <div className="border-b border-hairline pb-4">
            <span className="font-label-mono text-[10px] text-graphite uppercase tracking-widest block mb-1">
              HEADLINE MD · INSTRUMENT SERIF
            </span>
            <div className="font-headline-md text-[24px] text-on-surface font-serif">
              The Architecture of Silence
            </div>
          </div>

          <div className="border-b border-hairline pb-4">
            <span className="font-label-mono text-[10px] text-graphite uppercase tracking-widest block mb-1">
              ARTICLE BODY · NEWSREADER
            </span>
            <p className="font-article-body text-[18px] text-on-surface-variant leading-[28px]">
              True perception requires a deliberate slowing down. When you read a physical page, there are no unread badges sliding down from the top edge. It is a closed system that demands undivided attention.
            </p>
          </div>

          <div>
            <span className="font-label-mono text-[10px] text-graphite uppercase tracking-widest block mb-1">
              LABEL MONO · IBM PLEX MONO
            </span>
            <div className="font-label-mono text-[12px] text-graphite uppercase tracking-widest">
              AI & TECH · 450 WORDS · 62% COMPLETED
            </div>
          </div>
        </div>
      </section>

      {/* Signature Component Anatomy: 28px Gutter Ruler */}
      <section className="flex flex-col gap-4">
        <h2 className="font-headline-md text-[24px] font-serif border-b border-hairline pb-2">
          Signature Anatomy: 28px Left Gutter Ruler
        </h2>
        <div className="bg-card-white border border-hairline rounded p-6 flex items-start gap-6">
          <div className="w-gutter-ruler flex-shrink-0 border-r border-hairline h-32 relative flex justify-center">
            <div className="w-[2px] bg-paper-border h-full absolute" />
            <div className="w-[2px] bg-ink-blue h-2/3 absolute top-0" />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <span className="font-label-mono text-[11px] text-ink-blue uppercase tracking-wider font-bold">
              ATTENTION PROGRESS METRIC
            </span>
            <p className="font-article-body-mobile text-[15px] text-graphite">
              Every content card incorporates the 28px left gutter ruler. As readers scroll and advance, the Ink Blue column tracks unbroken reading depth in real time.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
