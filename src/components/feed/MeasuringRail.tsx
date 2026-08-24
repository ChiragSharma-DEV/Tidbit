'use client';

import React from 'react';
import { hueForTopic } from '@/lib/design/topicHue';

interface MeasuringRailProps {
  wordCount: number;
  topic: string;
  max?: number;
  className?: string;
}

export default function MeasuringRail({
  wordCount,
  topic,
  max = 500,
  className = '',
}: MeasuringRailProps) {
  const hueVar = hueForTopic(topic);
  const percentage = Math.min(100, Math.max(0, (wordCount / max) * 100));

  // Generate tick marks from 20 to 480 words in steps of 20
  const ticks = [];
  for (let w = 20; w < max; w += 20) {
    ticks.push({
      word: w,
      isMajor: w % 100 === 0,
      posFromBottom: (w / max) * 100,
    });
  }

  return (
    <div
      className={`w-[40px] sm:w-[56px] relative flex-shrink-0 select-none ${className}`}
      aria-label={`Word count indicator: ${wordCount} words`}
    >
      {/* 2px Track Line pinned at left = 16px */}
      <div className="absolute top-0 bottom-0 left-[16px] w-[2px] bg-[var(--rule)]" />

      {/* Tick Marks & Major Labels */}
      {ticks.map((t) => (
        <React.Fragment key={t.word}>
          <div
            className="absolute left-[16px] bg-[var(--rule)] -translate-y-1/2"
            style={{
              bottom: `${t.posFromBottom}%`,
              width: t.isMajor ? '12px' : '6px',
              height: '1px',
            }}
          />
          {t.isMajor && (
            <span
              className="t-label text-[10px] text-[var(--graphite)] absolute left-[32px] -translate-y-1/2 font-mono"
              style={{ bottom: `${t.posFromBottom}%` }}
            >
              {t.word}
            </span>
          )}
        </React.Fragment>
      ))}

      {/* Filled Track from Bottom Upward */}
      <div
        className="absolute left-[16px] bottom-0 w-[2px] transition-all duration-240 ease-out motion-reduce:transition-none"
        style={{
          height: `${percentage}%`,
          backgroundColor: `var(${hueVar})`,
        }}
      >
        {/* 8px Solid Square Marker at the Head of the Fill */}
        <div
          className="absolute -top-[4px] -left-[3px] w-[8px] h-[8px]"
          style={{ backgroundColor: `var(${hueVar})` }}
        />
      </div>
    </div>
  );
}
