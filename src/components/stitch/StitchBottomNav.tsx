'use client';

import React from 'react';
import { useAttentionTrainer } from '@/contexts/AttentionTrainerContext';

interface StitchBottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export default function StitchBottomNav({
  currentTab,
  onTabChange,
}: StitchBottomNavProps) {
  const { openComposeModal } = useAttentionTrainer();

  const tabs = [
    { id: 'feed', label: 'Feed' },
    { id: 'path', label: 'Skill Trees' },
    { id: 'create', label: 'Create', isComposeAction: true },
    { id: 'library', label: 'Library' },
    { id: 'stats', label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-4 py-3 bg-[var(--insert)] border-t border-[var(--rule)] md:hidden">
      {tabs.map((tab) => {
        if (tab.isComposeAction) {
          return (
            <button
              key={tab.id}
              onClick={openComposeModal}
              className="t-ui text-[var(--graphite)] hover:text-[var(--ink)] cursor-pointer"
            >
              {tab.label}
            </button>
          );
        }

        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`t-ui transition-colors cursor-pointer ${
              isActive
                ? 'font-semibold text-[var(--ink)]'
                : 'text-[var(--graphite)] hover:text-[var(--ink)]'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
