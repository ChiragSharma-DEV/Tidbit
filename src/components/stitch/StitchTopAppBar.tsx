'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAttentionTrainer } from '@/contexts/AttentionTrainerContext';
import { logout } from '@/lib/auth/simpleAuth';

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
  const router = useRouter();
  const {
    calibratedLevel,
    currentUser,
    openComposeModal,
    setOnboardingOpen,
    realtimeSyncStatus,
    triggerRealtimeSync,
  } = useAttentionTrainer();

  const handleLogout = () => {
    logout();
    router.push('/start');
  };

  return (
    <header className="w-full bg-[var(--stock)] border-b border-[var(--rule)] sticky top-0 z-40">
      <div className="max-w-4xl lg:max-w-6xl w-full mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
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

          {/* Real-time Data Sync Indicator Badge */}
          <button
            onClick={triggerRealtimeSync}
            title="Real-time Cross-Tab & Server Synchronization Active. Click to re-sync."
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-[10px] font-mono text-emerald-700 dark:text-emerald-300 transition-all hover:scale-105 cursor-pointer"
          >
            <span className={`w-1.5 h-1.5 rounded-full bg-emerald-500 ${realtimeSyncStatus === 'syncing' ? 'animate-ping' : 'animate-pulse'}`} />
            <span className="tracking-wider uppercase font-semibold hidden xs:inline">
              {realtimeSyncStatus === 'syncing' ? 'SYNCING' : 'LIVE SYNCED'}
            </span>
          </button>
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

          {/* Username display — desktop only */}
          <span className="t-ui text-[var(--graphite)] cursor-default hidden sm:inline">
            {currentUser?.name || 'Guest'}
          </span>

          {/* Logout */}
          <button
            onClick={handleLogout}
            aria-label="Log out"
            className="t-ui text-[var(--graphite)] hover:text-[var(--ink)] cursor-pointer transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
