'use client';

import React, { useState, useEffect } from 'react';
import { hueForTopic } from '@/lib/design/topicHue';

export interface QuickCheckOption {
  key: string;
  text: string;
  isCorrect: boolean;
}

export interface StitchQuickCheckOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (earnedXp: number) => void;
  question?: string;
  topic?: string;
  nodeStep?: string;
  options?: QuickCheckOption[];
  explanation?: string;
  xpAward?: number;
}

export default function StitchQuickCheckOverlay({
  isOpen,
  onClose,
  onComplete,
  question = 'Which of these is not a real advantage of small language models?',
  topic = 'AI & Tech',
  nodeStep = 'NODE 3 OF 6',
  options = [
    { key: 'A', text: 'Lower computing cost', isCorrect: false },
    { key: 'B', text: 'Faster responses', isCorrect: false },
    { key: 'C', text: 'Broader general knowledge', isCorrect: true },
    { key: 'D', text: 'Tuned for one narrow task', isCorrect: false },
  ],
  explanation = 'Small models are intentionally narrow; they lack the vast training data and broad trivia knowledge of massive foundation models.',
  xpAward = 50,
}: StitchQuickCheckOverlayProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const hueVar = hueForTopic(topic);

  useEffect(() => {
    if (isOpen) {
      setSelectedKey(null);
      setHasSubmitted(false);
    }
  }, [isOpen, question]);

  if (!isOpen) return null;

  const handleSelect = (key: string) => {
    if (hasSubmitted) return;
    setSelectedKey(key);
  };

  const handleSubmitOrContinue = () => {
    if (!hasSubmitted) {
      if (!selectedKey) return;
      setHasSubmitted(true);
    } else {
      onComplete(xpAward);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#1A1814]/40 transition-opacity"
      />

      {/* White Sheet Modal: bg-[var(--insert)], 1px border [var(--rule)] */}
      <div className="relative w-full max-w-lg bg-[var(--insert)] border border-[var(--rule)] rounded-[var(--r-card)] z-50 p-6 flex flex-col max-h-[85vh] overflow-y-auto shadow-[0_1px_2px_rgba(26,24,20,0.04)]">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span
              className="t-label font-bold"
              style={{ color: `var(${hueVar})` }}
            >
              QUICK CHECK · {nodeStep}
            </span>
            <button
              onClick={onClose}
              className="t-ui text-[var(--graphite)] hover:text-[var(--ink)] cursor-pointer"
            >
              Close
            </button>
          </div>
          <h3 className="t-title font-display mt-1">
            {question}
          </h3>
        </div>

        {/* Answer Rows with 1px rule border */}
        <div className="flex flex-col gap-2 my-4">
          {options.map((option) => {
            const isSelected = selectedKey === option.key;

            return (
              <button
                key={option.key}
                onClick={() => handleSelect(option.key)}
                className="w-full text-left p-3.5 rounded-[var(--r-control)] border transition-all flex items-center cursor-pointer"
                style={{
                  borderColor: isSelected ? `var(${hueVar})` : 'var(--rule)',
                  backgroundColor: isSelected ? `rgba(92, 107, 138, 0.06)` : 'var(--insert)',
                }}
              >
                <span className="t-num text-[var(--graphite)] mr-3 w-5">
                  {option.key}
                </span>
                <span className="t-ui text-[var(--ink)] flex-1">
                  {option.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Explanation Block: Flush block with 2px left border in topic-hue */}
        {hasSubmitted && (
          <div
            className="my-3 pl-4 border-l-2"
            style={{ borderLeftColor: `var(${hueVar})` }}
          >
            <span className="t-label block mb-1">EXPLANATION</span>
            <p className="t-body text-[15px] leading-[23px]">
              {explanation}
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-[var(--rule)] flex justify-between items-center">
          <span className="t-num text-[var(--graphite)]">
            +{xpAward} WORDS EXPANSION
          </span>

          <button
            disabled={!selectedKey}
            onClick={handleSubmitOrContinue}
            className="t-ui px-5 py-2 rounded-[var(--r-control)] bg-[var(--ink)] text-[var(--insert)] hover:opacity-90 disabled:opacity-30 cursor-pointer font-semibold"
          >
            {hasSubmitted ? 'Continue' : 'Check answer'}
          </button>
        </div>
      </div>
    </div>
  );
}
