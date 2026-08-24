'use client';

import React from 'react';
import MeasuringRail from '@/components/feed/MeasuringRail';
import { hueForTopic } from '@/lib/design/topicHue';

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
  completed?: boolean;
  difficultyLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  analogy?: string;
}

interface StitchFeedCardProps {
  article: FeedArticle;
  onRead: (article: FeedArticle) => void;
  onSave?: (article: FeedArticle) => void;
  onTakeCheck?: (article: FeedArticle) => void;
  onShareMilestone?: (article: FeedArticle) => void;
}

function StitchFeedCardComponent({
  article,
  onRead,
  onSave,
  onTakeCheck,
  onShareMilestone,
}: StitchFeedCardProps) {
  const hueVar = hueForTopic(article.topic);
  const difficulty = (article.difficultyLevel || 'Beginner').toUpperCase();

  return (
    <div className="w-full flex items-stretch gap-2 sm:gap-[16px]">
      {/* Measuring Rail - 56px wide on sm+, 40px on xs */}
      <MeasuringRail wordCount={article.wordCount} topic={article.topic} />

      {/* Card Body Container */}
      <article
        onClick={() => onRead(article)}
        className="flex-1 min-w-0 bg-[var(--insert)] border border-[var(--rule)] rounded-[var(--r-card)] p-4 sm:p-[20px] flex flex-col justify-between cursor-pointer transition-shadow shadow-[0_1px_2px_rgba(26,24,20,0.04)] hover:shadow-md"
      >
        <div>
          {/* Top Label Row: Topic Name (in topic hue #1) + Difficulty & Word Count */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span
              className="t-label font-bold"
              style={{ color: `var(${hueVar})` }}
            >
              {article.topic}
            </span>
            <span className="t-label text-[var(--graphite)]">
              {difficulty} · {article.wordCount} WORDS
            </span>
          </div>

          {/* Headline Title */}
          {article.title && (
            <h2 className="t-title mb-2 font-display">
              {article.title}
            </h2>
          )}

          {/* Body Prose Excerpt */}
          <p className="t-body mb-4">
            {article.excerpt}
          </p>

          {/* Flush Callout / Analogy Block (Left border in topic hue #2, no background, no box inside box) */}
          {article.analogy && (
            <div
              className="my-4 pl-4 border-l-2"
              style={{ borderLeftColor: `var(${hueVar})` }}
            >
              <span className="t-label block mb-1">IN SIMPLE WORDS</span>
              <p className="t-quote">
                {article.analogy}
              </p>
            </div>
          )}

          {/* Key Insight (Inline emphasis is ink at ui weight 500, not coloured) */}
          {article.keyTakeaway && (
            <div className="mt-4 pt-3 border-t border-[var(--rule)]">
              <p className="t-ui text-[var(--ink)]">
                <span className="font-semibold">Key Insight:</span> {article.keyTakeaway}
              </p>
            </div>
          )}
        </div>

        {/* Action Row: Identical .t-ui 14px in graphite, responsive gap */}
        <div className="mt-5 pt-3 border-t border-[var(--rule)] flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-[24px]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSave?.(article);
            }}
            className={`t-ui cursor-pointer transition-colors ${
              article.saved
                ? 'font-semibold text-[var(--ink)]'
                : 'text-[var(--graphite)] hover:text-[var(--ink)]'
            }`}
          >
            Save
          </button>

          {onTakeCheck && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTakeCheck(article);
              }}
              className="t-ui text-[var(--graphite)] hover:text-[var(--ink)] cursor-pointer"
            >
              Quick check
            </button>
          )}

          {onShareMilestone && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onShareMilestone(article);
              }}
              className="t-ui text-[var(--graphite)] hover:text-[var(--ink)] cursor-pointer"
            >
              Share
            </button>
          )}

          <button
            type="button"
            onClick={() => onRead(article)}
            className={`t-ui cursor-pointer transition-colors ml-auto ${
              article.completed
                ? 'font-semibold text-[var(--ink)]'
                : 'text-[var(--graphite)] hover:text-[var(--ink)]'
            }`}
          >
            Focus
          </button>
        </div>
      </article>
    </div>
  );
}

const StitchFeedCard = React.memo(StitchFeedCardComponent);
export default StitchFeedCard;
