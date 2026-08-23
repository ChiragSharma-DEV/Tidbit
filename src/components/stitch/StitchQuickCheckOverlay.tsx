'use client';

import React, { useState, useEffect } from 'react';

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

  const isSelectedCorrect = options.find((o) => o.key === selectedKey)?.isCorrect;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#16171B]/55 backdrop-blur-sm transition-opacity"
      />

      {/* Bottom Sheet / Modal Dialog */}
      <div className="relative w-full max-w-lg bg-surface-container-lowest border-t sm:border border-hairline rounded-t-xl sm:rounded-lg z-50 p-6 md:p-8 flex flex-col max-h-[85vh] overflow-y-auto shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-graphite hover:text-ink-blue transition-colors p-1"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Header Tag */}
        <div className="mb-4">
          <span className="font-label-mono text-[11px] text-ink-blue uppercase tracking-widest block font-bold">
            QUICK CHECK · {nodeStep}
          </span>
          <h3 className="font-headline-md text-[22px] md:text-[25px] text-on-background leading-tight tracking-tight font-serif mt-2">
            {question}
          </h3>
        </div>

        {/* Options List */}
        <div className="flex flex-col gap-2.5 my-4">
          {options.map((option) => {
            const isSelected = selectedKey === option.key;
            let buttonClasses =
              'w-full text-left bg-surface-container-lowest border border-hairline rounded flex items-center p-3.5 transition-all text-on-surface hover:border-outline-variant cursor-pointer';

            if (isSelected) {
              if (hasSubmitted) {
                if (option.isCorrect) {
                  buttonClasses =
                    'w-full text-left bg-ink-blue/[0.07] border-2 border-ink-blue rounded flex items-center p-3.5 transition-all text-on-surface shadow-sm';
                } else {
                  buttonClasses =
                    'w-full text-left bg-red-50 border-2 border-red-500 rounded flex items-center p-3.5 transition-all text-on-surface';
                }
              } else {
                buttonClasses =
                  'w-full text-left bg-paper border-2 border-ink-blue rounded flex items-center p-3.5 transition-all text-on-surface';
              }
            } else if (hasSubmitted && option.isCorrect) {
              buttonClasses =
                'w-full text-left bg-green-50/50 border border-green-600 rounded flex items-center p-3.5 transition-all text-on-surface';
            }

            return (
              <button
                key={option.key}
                onClick={() => handleSelect(option.key)}
                className={buttonClasses}
              >
                <span
                  className={`font-label-mono text-[12px] mr-3 w-5 uppercase font-semibold ${
                    isSelected && option.isCorrect && hasSubmitted
                      ? 'text-ink-blue font-bold'
                      : 'text-graphite'
                  }`}
                >
                  {option.key}
                </span>
                <span className="font-ui-button text-[14px] md:text-[15px] flex-1">
                  {option.text}
                </span>
                {hasSubmitted && option.isCorrect && (
                  <span className="text-ink-blue text-sm font-bold">✓</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Block */}
        {hasSubmitted && (
          <div className="mt-2 p-4 bg-paper rounded border border-hairline transition-all">
            <p className="font-label-mono text-[10px] text-graphite uppercase tracking-wider mb-1 font-bold">
              {isSelectedCorrect ? '✓ CORRECT' : 'NOTE'}
            </p>
            <p className="font-article-body text-[14px] leading-[22px] text-graphite">
              {explanation}
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-hairline flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-ink-blue text-[18px]">
              bolt
            </span>
            <span className="font-label-mono text-[11px] text-graphite uppercase tracking-widest font-bold">
              +{xpAward} XP
            </span>
          </div>

          <button
            disabled={!selectedKey}
            onClick={handleSubmitOrContinue}
            className="bg-primary-container hover:bg-ink-blue disabled:opacity-40 text-white font-ui-button text-ui-button px-6 py-2.5 rounded transition-colors cursor-pointer"
          >
            {hasSubmitted ? 'Continue' : 'Check Answer'}
          </button>
        </div>
      </div>
    </div>
  );
}
