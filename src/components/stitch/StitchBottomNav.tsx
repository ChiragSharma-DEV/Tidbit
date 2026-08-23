'use client';

import React from 'react';

interface StitchBottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export default function StitchBottomNav({
  currentTab,
  onTabChange,
}: StitchBottomNavProps) {
  const tabs = [
    { id: 'feed', label: 'Feed', icon: 'auto_stories' },
    { id: 'path', label: 'Path', icon: 'route' },
    { id: 'library', label: 'Library', icon: 'bookmarks' },
    { id: 'stats', label: 'Stats', icon: 'insights' },
    { id: 'design-system', label: 'Design', icon: 'palette' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2.5 pb-safe bg-surface-container-lowest border-t border-hairline md:hidden shadow-sm">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 transition-all ${
              isActive
                ? 'text-ink-blue font-bold scale-105'
                : 'text-graphite hover:text-ink-blue opacity-80 hover:opacity-100'
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px] mb-0.5"
              style={{
                fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              {tab.icon}
            </span>
            <span className="font-ui-button text-[11px] tracking-wide">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
