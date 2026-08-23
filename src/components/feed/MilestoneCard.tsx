'use client';

import React, { useState } from 'react';
import { hueForTopic } from '@/lib/design/topicHue';

interface MilestoneCardProps {
  milestone: {
    nicheId: string;
    nicheTitle: string;
    nodeTitle: string;
    nodeIndex: number;
    xpReward: number;
    nextNodeTitle?: string;
  };
  onNext?: () => void;
}

export default function MilestoneCard({ milestone, onNext }: MilestoneCardProps) {
  const { nicheTitle, nodeTitle, xpReward, nextNodeTitle } = milestone;
  const [copied, setCopied] = useState(false);
  const hueVar = hueForTopic(nicheTitle);

  const handleShare = () => {
    setCopied(true);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(
        `Completed node "${nodeTitle}" in ${nicheTitle} on Tidbit.`
      );
    }
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <article className="w-full bg-[var(--insert)] border border-[var(--rule)] rounded-[var(--r-card)] p-[20px] flex flex-col justify-between shadow-[0_1px_2px_rgba(26,24,20,0.04)]">
      <div>
        {/* Topic Label */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className="t-label font-bold"
            style={{ color: `var(${hueVar})` }}
          >
            MILESTONE · {nicheTitle}
          </span>
          <span className="t-num text-[var(--graphite)]">
            +{xpReward} XP
          </span>
        </div>

        {/* Title */}
        <h2 className="t-title mb-2 font-display">
          Node Mastered
        </h2>

        {/* Description */}
        <p className="t-body mb-4">
          You have completed all reading units for <span className="font-semibold text-[var(--ink)]">{nodeTitle}</span> in {nicheTitle}.
        </p>

        {/* Next Node Section if available */}
        {nextNodeTitle && (
          <div
            className="my-4 pl-4 border-l-2"
            style={{ borderLeftColor: `var(${hueVar})` }}
          >
            <span className="t-label block mb-1">UP NEXT</span>
            <p className="t-ui text-[var(--ink)] font-medium">
              {nextNodeTitle}
            </p>
          </div>
        )}
      </div>

      {/* Actions Row */}
      <div className="mt-5 pt-3 border-t border-[var(--rule)] flex items-center gap-[24px]">
        <button
          type="button"
          onClick={handleShare}
          className={`t-ui cursor-pointer transition-colors ${
            copied
              ? 'font-semibold text-[var(--ink)]'
              : 'text-[var(--graphite)] hover:text-[var(--ink)]'
          }`}
        >
          {copied ? 'Copied' : 'Share'}
        </button>

        {onNext && (
          <button
            type="button"
            onClick={onNext}
            className="t-ui text-[var(--graphite)] hover:text-[var(--ink)] font-semibold cursor-pointer ml-auto"
          >
            Next node
          </button>
        )}
      </div>
    </article>
  );
}
