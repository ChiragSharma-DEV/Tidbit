'use client';

import React from 'react';
import MeasuringRail from '@/components/feed/MeasuringRail';
import { hueForTopic } from '@/lib/design/topicHue';
import { useAudioPlayer, requestTTS } from '@/hooks/useAudioPlayer';

interface StaminaCardProps {
  card: {
    _id: string;
    conceptKey?: string;
    topic?: string;
    order?: number;
    gate?: 'short' | 'medium' | 'long';
    content: {
      headline?: string;
      title?: string;
      summary?: string;
      explanation?: string;
      takeaway?: string;
      keyTakeaway?: string;
      bullets?: string[];
      example?: string;
      analogy?: string;
      wordCount?: number;
      topic?: string;
      difficultyLevel?: string;
    };
  };
  isActive?: boolean;
  onRead?: () => void;
  onSave?: () => void;
  onTakeCheck?: () => void;
  onShare?: () => void;
}

/** Build narration text from StaminaCard content fields */
function buildCardNarration(card: StaminaCardProps['card']): string {
  const c = card.content || {};
  const parts: string[] = [];
  const title = c.title || c.headline;
  if (title) parts.push(title + '.');
  if (c.summary) parts.push(c.summary);
  if (c.explanation) parts.push(c.explanation);
  if (c.bullets?.length) parts.push(c.bullets.join('. '));
  if (c.analogy || c.example) parts.push('In simple words: ' + (c.analogy || c.example));
  if (c.takeaway || c.keyTakeaway) parts.push('Key insight: ' + (c.takeaway || c.keyTakeaway));
  return parts.join('\n\n');
}

export default function StaminaCard({ card, onRead, onSave, onTakeCheck, onShare }: StaminaCardProps) {
  const content = card.content || {};
  const topic = content.topic || card.topic || 'General';
  const hueVar = hueForTopic(topic);
  const wordCount = content.wordCount || (card.gate === 'short' ? 45 : card.gate === 'long' ? 420 : 140);
  const difficulty = (content.difficultyLevel || 'Beginner').toUpperCase();

  const titleText = content.title || content.headline || 'Core Concept';
  const summaryText = content.summary || content.explanation || '';
  const analogyText = content.analogy || content.example || '';
  const takeawayText = content.takeaway || content.keyTakeaway || '';

  const { articleId, status } = useAudioPlayer();
  const cardId = String(card._id);
  const isThisLoading = articleId === cardId && status === 'loading';
  const isThisPlaying = articleId === cardId && status === 'playing';

  const handleListen = (e: React.MouseEvent) => {
    e.stopPropagation();
    requestTTS({
      id: cardId,
      title: titleText,
      topic,
      text: buildCardNarration(card),
    });
  };

  return (
    <div className="w-full flex items-stretch gap-[16px]">
      <MeasuringRail wordCount={wordCount} topic={topic} />

      <article
        onClick={onRead}
        className="flex-1 min-w-0 bg-[var(--insert)] border border-[var(--rule)] rounded-[var(--r-card)] p-[20px] flex flex-col justify-between cursor-pointer shadow-[0_1px_2px_rgba(26,24,20,0.04)] hover:shadow-md transition-shadow"
      >
        <div>
          {/* Top Label Row: Topic Name (topic hue #1) + Difficulty & Word Count */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span
              className="t-label font-bold"
              style={{ color: `var(${hueVar})` }}
            >
              {topic}
            </span>
            <span className="t-label text-[var(--graphite)]">
              {difficulty} · {wordCount} WORDS
            </span>
          </div>

          {/* Headline */}
          <h2 className="t-title mb-2 font-display">
            {titleText}
          </h2>

          {/* Body Prose */}
          <p className="t-body mb-4">
            {summaryText}
          </p>

          {/* Bullets if present */}
          {content.bullets && content.bullets.length > 0 && (
            <ul className="my-3 space-y-1.5 pl-4 list-disc marker:text-[var(--graphite)]">
              {content.bullets.map((bullet, idx) => (
                <li key={idx} className="t-body text-[15px] leading-[22px]">
                  {bullet}
                </li>
              ))}
            </ul>
          )}

          {/* Flush Callout (topic hue #2 on left border) */}
          {analogyText && (
            <div
              className="my-4 pl-4 border-l-2"
              style={{ borderLeftColor: `var(${hueVar})` }}
            >
              <span className="t-label block mb-1">IN SIMPLE WORDS</span>
              <p className="t-quote">
                {analogyText}
              </p>
            </div>
          )}

          {/* Key Insight */}
          {takeawayText && (
            <div className="mt-4 pt-3 border-t border-[var(--rule)]">
              <p className="t-ui text-[var(--ink)]">
                <span className="font-semibold">Key Insight:</span> {takeawayText}
              </p>
            </div>
          )}
        </div>

        {/* Action Row */}
        <div className="mt-5 pt-3 border-t border-[var(--rule)] flex items-center gap-[24px]">
          {onSave && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSave();
              }}
              className="t-ui text-[var(--graphite)] hover:text-[var(--ink)] cursor-pointer"
            >
              Save
            </button>
          )}
          {onTakeCheck && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTakeCheck();
              }}
              className="t-ui text-[var(--graphite)] hover:text-[var(--ink)] cursor-pointer"
            >
              Quick check
            </button>
          )}
          {onShare && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
              className="t-ui text-[var(--graphite)] hover:text-[var(--ink)] cursor-pointer"
            >
              Share
            </button>
          )}

          {/* ▶ Listen — TTS */}
          <button
            type="button"
            aria-label={isThisLoading ? 'Generating audio' : isThisPlaying ? 'Now playing' : `Listen to ${titleText}`}
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

          {onRead && (
            <button
              type="button"
              onClick={onRead}
              className="t-ui text-[var(--graphite)] hover:text-[var(--ink)] cursor-pointer ml-auto"
            >
              Focus
            </button>
          )}
        </div>
      </article>
    </div>
  );
}
