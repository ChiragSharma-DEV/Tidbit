'use client';

import React from 'react';

export interface FeedArticle {
  id: string;
  type: 'short' | 'medium' | 'long' | 'refresher';
  topic: string;
  title?: string;
  excerpt: string;
  paragraphs?: string[];
  wordCount: number;
  progressPercent: number;
  highlightWords?: string[];
  pullQuote?: {
    quote: string;
    author: string;
  };
  keyTakeaway?: string;
  saved?: boolean;
}

interface StitchFeedCardProps {
  article: FeedArticle;
  onRead: (article: FeedArticle) => void;
  onSave?: (article: FeedArticle) => void;
  onTakeCheck?: (article: FeedArticle) => void;
}

export default function StitchFeedCard({
  article,
  onRead,
  onSave,
  onTakeCheck,
}: StitchFeedCardProps) {
  // Refresher Card layout
  if (article.type === 'refresher') {
    return (
      <article className="w-full bg-surface-container-lowest border border-paper-border rounded flex flex-col relative overflow-hidden transition-all hover:border-outline-variant group">
        <div className="w-full relative px-6 pt-4 pb-2 bg-paper/30">
          <div className="flex justify-between items-center mb-1">
            <span className="font-label-mono text-[11px] text-ink-blue uppercase tracking-widest block font-bold">
              Refresher
            </span>
            <span className="font-label-mono text-[11px] text-graphite uppercase tracking-wider">
              {article.wordCount} WORDS
            </span>
          </div>
          <div className="h-[2px] w-full bg-ink-blue absolute bottom-0 left-0" />
        </div>

        <div className="flex w-full pt-4">
          {/* Dashed Ruler Gutter */}
          <div className="w-gutter-ruler shrink-0 border-r border-transparent flex justify-center pt-2 pb-6">
            <div className="w-[1px] h-full custom-dashed-ruler" />
          </div>

          {/* Content Area */}
          <div className="flex-grow px-4 md:px-6 pb-6">
            {article.title && (
              <h2
                onClick={() => onRead(article)}
                className="font-display-lg-mobile text-[22px] md:text-[26px] leading-[1.15] tracking-[-0.02em] mb-3 text-on-surface cursor-pointer group-hover:text-ink-blue transition-colors font-serif"
              >
                {article.title}
              </h2>
            )}
            <p
              onClick={() => onRead(article)}
              className="font-article-body-mobile text-[16px] md:text-[18px] leading-[26px] md:leading-[28px] text-on-surface-variant cursor-pointer"
            >
              {article.excerpt}
            </p>

            <div className="mt-4 pt-3 border-t border-hairline flex justify-between items-center">
              <span className="font-label-mono text-[11px] text-graphite uppercase">
                {article.topic}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSave?.(article);
                  }}
                  className="font-ui-button text-[13px] text-graphite hover:text-ink-blue transition-colors"
                >
                  {article.saved ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={() => onRead(article)}
                  className="font-ui-button text-[13px] text-ink-blue font-medium hover:underline"
                >
                  Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Standard Short / Medium / Long Card layout
  return (
    <article
      onClick={() => onRead(article)}
      className="bg-card-white border border-hairline rounded relative flex min-h-[140px] group cursor-pointer transition-all hover:border-outline-variant hover:shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
    >
      {/* 28px Left Gutter & Word Depth Ruler */}
      <div className="w-gutter-ruler flex-shrink-0 border-r border-hairline relative flex justify-center py-4">
        {/* Background track */}
        <div className="absolute inset-y-4 left-1/2 -translate-x-1/2 w-[2px] bg-outline-variant opacity-25" />
        {/* Ink Blue Fill representing article length & reading depth */}
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 w-[2px] bg-primary-container transition-all duration-300 group-hover:opacity-100"
          style={{ height: `${article.progressPercent}%` }}
        />
        {/* Tick marks */}
        <div className="absolute w-[6px] h-[1px] bg-outline-variant -left-[2px] top-1/4 opacity-40" />
        <div className="absolute w-[6px] h-[1px] bg-outline-variant -left-[2px] top-2/4 opacity-40" />
        <div className="absolute w-[6px] h-[1px] bg-outline-variant -left-[2px] top-3/4 opacity-40" />
      </div>

      {/* Content Area */}
      <div className="p-5 md:p-6 pt-10 relative flex-1 flex flex-col justify-between">
        {/* Top Badges */}
        <div className="absolute top-3 left-5 right-5 flex justify-between items-center">
          <span className="font-label-mono text-[10px] md:text-label-mono text-graphite uppercase tracking-wider">
            {article.topic}
          </span>
          <span className="font-label-mono text-[10px] md:text-label-mono text-secondary uppercase tracking-wider font-semibold">
            {article.wordCount} WORDS
          </span>
        </div>

        {/* Title & Body */}
        <div>
          {article.title && (
            <h2 className="font-headline-md text-[20px] md:text-headline-md text-on-surface mb-2 font-serif group-hover:text-ink-blue transition-colors">
              {article.title}
            </h2>
          )}
          <p className="font-article-body-mobile text-[16px] md:text-article-body text-on-surface-variant leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        {/* Key Takeaway or Pull point if present */}
        {article.keyTakeaway && (
          <div className="mt-4 pt-3 border-t border-hairline flex items-center justify-between">
            <span className="font-ui-button text-[13px] md:text-[14px] text-ink-blue font-medium">
              {article.keyTakeaway}
            </span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-4 pt-2 flex justify-between items-center">
          <div className="flex items-center gap-4 text-graphite font-ui-button text-[12px] md:text-[13px]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSave?.(article);
              }}
              className="hover:text-ink-blue transition-colors"
            >
              {article.saved ? '✓ Saved' : 'Save'}
            </button>
            {onTakeCheck && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTakeCheck(article);
                }}
                className="hover:text-ink-blue transition-colors text-ink-blue font-medium"
              >
                Quick Check
              </button>
            )}
          </div>

          <span className="font-ui-button text-[12px] md:text-[13px] text-ink-blue group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
            Read <span className="text-[14px]">→</span>
          </span>
        </div>
      </div>
    </article>
  );
}
