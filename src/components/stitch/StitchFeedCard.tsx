'use client';

import React from 'react';
import MeasuringRail from '@/components/feed/MeasuringRail';
import { hueForTopic } from '@/lib/design/topicHue';
import { useAudioPlayer, requestTTS } from '@/hooks/useAudioPlayer';

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

/** Build the text to narrate from article fields — strips nothing displayed */
function buildNarration(article: FeedArticle): string {
  const parts: string[] = [];
  if (article.title) parts.push(article.title + '.');
  if (article.excerpt) parts.push(article.excerpt);
  if (article.paragraphs?.length) parts.push(article.paragraphs.join('\n\n'));
  if (article.analogy) parts.push('In simple words: ' + article.analogy);
  if (article.keyTakeaway) parts.push('Key insight: ' + article.keyTakeaway);
  return parts.join('\n\n');
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

  const { articleId, status } = useAudioPlayer();
  const isThisLoading = articleId === article.id && status === 'loading';
  const isThisPlaying = articleId === article.id && status === 'playing';

  const handleListen = (e: React.MouseEvent) => {
    e.stopPropagation();
    requestTTS({
      id: article.id,
      title: article.title ?? article.topic,
      topic: article.topic,
      text: buildNarration(article),
    });
  };

  return (
    <div className="w-full flex items-stretch gap-2 sm:gap-[16px]">
      {/* Measuring Rail - 56px wide on sm+, 40px on xs */}
      <MeasuringRail wordCount={article.wordCount} topic={article.topic} />

      {/* Card Body Container */}
      <article
        onClick={() => onRead(article)}
        className="feed-card flex-1 min-w-0 bg-[var(--insert)] border border-[var(--rule)] rounded-[var(--r-card)] overflow-hidden flex flex-col justify-between cursor-pointer transition-shadow shadow-[0_1px_2px_rgba(26,24,20,0.04)] hover:shadow-md"
      >
        {/* ── Header area: slightly darker background for visual hierarchy ── */}
        <div className="bg-[var(--rule)] px-4 sm:px-[20px] pt-4 sm:pt-[20px] pb-3 border-b border-[var(--rule)]">
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
            <h2 className="t-title">
              {article.title}
            </h2>
          )}
        </div>

        {/* ── Content area: white background ── */}
        <div className="flex-1 px-4 sm:px-[20px] pt-4 pb-0">
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
        <div className="px-4 sm:px-[20px] py-3 mt-2 border-t border-[var(--rule)] flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-[24px]">
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

          {/* ▶ Listen — TTS */}
          <button
            type="button"
            aria-label={isThisLoading ? 'Generating audio' : isThisPlaying ? 'Now playing' : `Listen to ${article.title ?? 'this article'}`}
            onClick={handleListen}
            className={`t-ui cursor-pointer transition-colors ${
              isThisPlaying
                ? 'font-semibold text-[var(--ink)]'
                : isThisLoading
                ? 'text-[var(--graphite)] opacity-50'
                : 'text-[var(--graphite)] hover:text-[var(--ink)]'
            }`}
          >
            {isThisLoading ? '▶ …' : isThisPlaying ? '▶ Playing' : '▶ Listen'}
          </button>

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
