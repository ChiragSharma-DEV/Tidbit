'use client';

import React from 'react';
import Link from 'next/link';

interface StitchTopAppBarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  staminaLevel?: number;
  onOpenSearch?: () => void;
  onOpenMenu?: () => void;
}

export default function StitchTopAppBar({
  currentTab,
  onTabChange,
  staminaLevel = 34,
  onOpenSearch,
  onOpenMenu,
}: StitchTopAppBarProps) {
  return (
    <header className="flex justify-between items-center px-4 md:px-margin-page py-4 w-full bg-paper border-b border-hairline sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMenu}
          aria-label="Menu"
          className="text-ink-blue hover:opacity-80 transition-opacity flex items-center justify-center p-1"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>
        <button
          onClick={() => onTabChange('feed')}
          className="font-display-lg-mobile text-[28px] md:text-[32px] text-ink-blue tracking-tight font-serif text-left leading-none"
        >
          Tidbit
        </button>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-8 font-ui-button text-ui-button items-center">
        <button
          onClick={() => onTabChange('feed')}
          className={`pb-1 border-b-2 transition-all ${
            currentTab === 'feed'
              ? 'text-ink-blue font-bold border-ink-blue'
              : 'text-graphite hover:text-ink-blue border-transparent'
          }`}
        >
          Feed
        </button>
        <button
          onClick={() => onTabChange('path')}
          className={`pb-1 border-b-2 transition-all ${
            currentTab === 'path'
              ? 'text-ink-blue font-bold border-ink-blue'
              : 'text-graphite hover:text-ink-blue border-transparent'
          }`}
        >
          Path
        </button>
        <button
          onClick={() => onTabChange('library')}
          className={`pb-1 border-b-2 transition-all ${
            currentTab === 'library'
              ? 'text-ink-blue font-bold border-ink-blue'
              : 'text-graphite hover:text-ink-blue border-transparent'
          }`}
        >
          Library
        </button>
        <button
          onClick={() => onTabChange('stats')}
          className={`pb-1 border-b-2 transition-all ${
            currentTab === 'stats'
              ? 'text-ink-blue font-bold border-ink-blue'
              : 'text-graphite hover:text-ink-blue border-transparent'
          }`}
        >
          Stats
        </button>
        <button
          onClick={() => onTabChange('design-system')}
          className={`pb-1 border-b-2 transition-all ${
            currentTab === 'design-system'
              ? 'text-ink-blue font-bold border-ink-blue'
              : 'text-graphite hover:text-ink-blue border-transparent'
          }`}
        >
          Design System
        </button>
      </nav>

      {/* Right controls: Stamina meter & Search */}
      <div className="flex items-center gap-4">
        <div
          onClick={() => onTabChange('stats')}
          className="cursor-pointer hidden sm:flex flex-col items-end group"
          title="Current Attention Stamina Level"
        >
          <span className="font-label-mono text-[10px] text-graphite uppercase tracking-widest mb-1 group-hover:text-ink-blue transition-colors">
            STAMINA {staminaLevel}
          </span>
          <div className="w-12 h-[2px] bg-paper-border relative">
            <div
              className="absolute left-0 top-0 h-full bg-ink-blue transition-all"
              style={{ width: `${Math.min(100, staminaLevel * 2.5)}%` }}
            />
          </div>
        </div>

        <button
          onClick={onOpenSearch}
          aria-label="Search"
          className="text-ink-blue hover:opacity-80 transition-opacity flex items-center justify-center p-1"
        >
          <span className="material-symbols-outlined text-[24px]">search</span>
        </button>
      </div>
    </header>
  );
}
