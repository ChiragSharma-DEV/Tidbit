'use client';

import React from 'react';
import MeasuringRail from '@/components/feed/MeasuringRail';
import { hueForTopic } from '@/lib/design/topicHue';

interface RefresherCardProps {
  card: {
    _id: string;
    type: 'refresher';
    topic?: string;
    content: {
      title: string;
      summary: string;
      keyTakeaway: string;
      bulletPoints?: string[];
      wordCount?: number;
    };
  };
  isActive?: boolean;
  onRead?: () => void;
  onSave?: () => void;
}

export default function RefresherCard({ card, onRead, onSave }: RefresherCardProps) {
  const { content } = card;
  const topic = card.topic || 'Refresher';
  const hueVar = hueForTopic(topic);
  const wordCount = content.wordCount || 110;

  return (
    <div className="w-full flex items-stretch gap-[16px]">
      <MeasuringRail wordCount={wordCount} topic={topic} />

      <article
        onClick={onRead}
        className="flex-1 min-w-0 bg-[var(--insert)] border border-[var(--rule)] rounded-[var(--r-card)] p-[20px] flex flex-col justify-between cursor-pointer shadow-[0_1px_2px_rgba(26,24,20,0.04)] hover:shadow-md transition-shadow"
      >
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span
              className="t-label font-bold"
              style={{ color: `var(${hueVar})` }}
            >
              REFRESHER · {topic}
            </span>
            <span className="t-label text-[var(--graphite)]">
              REINFORCING · {wordCount} WORDS
            </span>
          </div>

          <h2 className="t-title mb-2 font-display">
            {content.title}
          </h2>

          <p className="t-body mb-4">
            {content.summary}
          </p>

          {content.bulletPoints && content.bulletPoints.length > 0 && (
            <ul className="my-3 space-y-1.5 pl-4 list-disc marker:text-[var(--graphite)]">
              {content.bulletPoints.map((bp: string, idx: number) => (
                <li key={idx} className="t-body text-[15px] leading-[22px]">
                  {bp}
                </li>
              ))}
            </ul>
          )}

          {content.keyTakeaway && (
            <div
              className="my-4 pl-4 border-l-2"
              style={{ borderLeftColor: `var(${hueVar})` }}
            >
              <span className="t-label block mb-1">CORE TAKEAWAY</span>
              <p className="t-quote">
                {content.keyTakeaway}
              </p>
            </div>
          )}
        </div>

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
          {onRead && (
            <button
              type="button"
              onClick={onRead}
              className="t-ui text-[var(--graphite)] hover:text-[var(--ink)] cursor-pointer ml-auto"
            >
              Review
            </button>
          )}
        </div>
      </article>
    </div>
  );
}
