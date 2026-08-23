'use client';

import React from 'react';
import { useAttentionTrainer } from '@/contexts/AttentionTrainerContext';

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
  onOpenSearch,
  onOpenMenu,
}: StitchTopAppBarProps) {
  const {
    calibratedLevel,
    currentUser,
    openComposeModal,
    setOnboardingOpen,
  } = useAttentionTrainer();

  return (
    <header className="w-full bg-[var(--stock)] border-b border-[var(--rule)] sticky top-0 z-40">
      <div className="max-w-[420px] md:max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {onOpenMenu && (
            <button
              onClick={onOpenMenu}
              aria-label="Menu"
              className="t-ui text-[var(--graphite)] hover:text-[var(--ink)] cursor-pointer md:hidden"
            >
              Menu
            </button>
          )}
          <span
            onClick={() => onTabChange('feed')}
            className="t-title font-display cursor-pointer select-none text-[22px]"
          >
            Tidbit
          </span>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-6">
          {[
            { id: 'feed', label: 'Feed' },
            { id: 'path', label: 'Skill Trees' },
            { id: 'library', label: 'Library' },
            { id: 'stats', label: 'Profile' },
            { id: 'design-system', label: 'Design System' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`t-ui transition-colors cursor-pointer ${
                currentTab === tab.id
                  ? 'font-semibold text-[var(--ink)]'
                  : 'text-[var(--graphite)] hover:text-[var(--ink)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={openComposeModal}
            className="t-ui text-[var(--graphite)] hover:text-[var(--ink)] cursor-pointer"
          >
            Create
          </button>

          <button
            onClick={() => setOnboardingOpen(true)}
            className="t-label text-[var(--graphite)] hover:text-[var(--ink)] cursor-pointer hidden sm:inline"
          >
            LEVEL {calibratedLevel}
          </button>

          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="t-ui text-[var(--graphite)] hover:text-[var(--ink)] cursor-pointer"
            >
              Search
            </button>
          )}

          <button
            onClick={() => onTabChange('stats')}
            className="t-ui text-[var(--graphite)] hover:text-[var(--ink)] cursor-pointer"
          >
            {currentUser?.name || 'Account'}
          </button>
        </div>
      </div>
    </header>
  );
}
