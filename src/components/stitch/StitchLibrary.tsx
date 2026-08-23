'use client';

import React, { useState } from 'react';
import { useAttentionTrainer, ArticleWithQuiz } from '@/contexts/AttentionTrainerContext';

interface StitchLibraryProps {
  onReadArticle: (article: ArticleWithQuiz) => void;
}

export default function StitchLibrary({ onReadArticle }: StitchLibraryProps) {
  const { articles, toggleSaveArticle } = useAttentionTrainer();
  const [filter, setFilter] = useState<'all' | 'progress' | 'completed' | 'saved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Map articles to status
  const libraryItems = articles.map((art) => {
    let status: 'in-progress' | 'completed' | 'unread' = 'unread';
    if (art.completed || (art.progressPercent && art.progressPercent >= 95)) {
      status = 'completed';
    } else if (art.progressPercent && art.progressPercent > 0) {
      status = 'in-progress';
    }

    return {
      ...art,
      progress: art.progressPercent || (status === 'completed' ? 100 : 0),
      status,
    };
  });

  const filtered = libraryItems.filter((item) => {
    if (filter === 'saved' && !item.saved) return false;
    if (filter === 'progress' && item.status !== 'in-progress') return false;
    if (filter === 'completed' && item.status !== 'completed') return false;
    if (filter === 'all' && !item.saved && item.status === 'unread') return false;

    if (
      searchQuery &&
      !item.title?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.topic.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <main className="max-w-3xl mx-auto px-4 md:px-margin-page py-8 flex flex-col gap-6 pb-28">
      {/* Header */}
      <div>
        <h2 className="font-headline-md text-[28px] md:text-headline-md text-on-background font-serif">
          Library
        </h2>
        <p className="font-article-body-mobile text-graphite mt-1">
          Your saved essays, highlighted passages, and attention reading history.
        </p>
      </div>

      {/* Search & Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-b border-hairline pb-4">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved essays..."
            className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest border border-hairline rounded font-ui-button text-[14px] focus:outline-none focus:border-ink-blue"
          />
          <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[18px] text-graphite">
            search
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Active' },
            { id: 'saved', label: 'Saved' },
            { id: 'progress', label: 'In Progress' },
            { id: 'completed', label: 'Finished' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded font-ui-button text-[13px] whitespace-nowrap transition-colors cursor-pointer ${
                filter === tab.id
                  ? 'bg-ink-blue text-white'
                  : 'bg-surface-container-lowest border border-hairline text-graphite hover:text-ink-blue'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Articles List */}
      <div className="flex flex-col gap-4">
        {filtered.map((article) => (
          <article
            key={article.id}
            onClick={() => onReadArticle(article)}
            className="bg-surface-container-lowest border border-hairline rounded flex relative group hover:border-ink-blue transition-colors cursor-pointer"
          >
            {/* Gutter & Ruler */}
            <div className="w-gutter-ruler shrink-0 border-r border-hairline flex justify-center py-4 relative">
              <div className="w-[2px] h-full bg-paper-border relative">
                <div
                  className="w-full bg-ink-blue absolute top-0 left-0 transition-all duration-500"
                  style={{ height: `${article.progress}%` }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col gap-2 relative">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="font-label-mono text-[10px] text-graphite uppercase tracking-wider block mb-1">
                    {article.topic}
                  </span>
                  <h3 className="font-headline-md text-[20px] md:text-[22px] leading-[1.2] text-on-background group-hover:text-ink-blue transition-colors font-serif">
                    {article.title}
                  </h3>
                </div>
                <div className="text-right shrink-0 flex flex-col items-end gap-1">
                  <span className="font-label-mono text-label-mono text-graphite block uppercase">
                    {article.wordCount} W
                  </span>
                  <span className="font-label-mono text-[11px] text-ink-blue font-bold">
                    {article.progress}% READ
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveArticle(article.id);
                    }}
                    className="text-graphite hover:text-ink-blue text-xs p-1"
                    title={article.saved ? 'Remove bookmark' : 'Bookmark'}
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{
                        fontVariationSettings: article.saved ? "'FILL' 1" : "'FILL' 0",
                      }}
                    >
                      bookmark
                    </span>
                  </button>
                </div>
              </div>

              <p className="font-article-body-mobile text-graphite line-clamp-2 text-[15px] leading-relaxed">
                {article.excerpt}
              </p>
            </div>
          </article>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-surface-container-lowest border border-hairline rounded">
            <span className="material-symbols-outlined text-[36px] text-graphite/40 mb-2">
              book_2
            </span>
            <p className="font-headline-md text-[20px] text-on-surface font-serif">
              No essays in this view.
            </p>
            <p className="font-article-body-mobile text-graphite text-[14px] mt-1">
              Explore your feed and bookmark or start reading essays to populate your library.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
