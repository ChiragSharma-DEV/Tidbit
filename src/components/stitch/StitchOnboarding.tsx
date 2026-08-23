'use client';

import React, { useState } from 'react';
import { useAttentionTrainer } from '@/contexts/AttentionTrainerContext';

interface StitchOnboardingProps {
  onComplete?: (preferences: { interests: string[]; startingLength: number }) => void;
  onCancel?: () => void;
}

export default function StitchOnboarding({ onComplete, onCancel }: StitchOnboardingProps) {
  const {
    selectedInterests: initialInterests,
    baselineLength: initialLength,
    saveOnboardingPreferences,
  } = useAttentionTrainer();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    initialInterests.length > 0
      ? initialInterests
      : ['AI & Tech', 'Philosophy', 'Cognitive Science', 'Minimalism']
  );
  const [selectedLength, setSelectedLength] = useState<number>(initialLength || 140);

  const interestOptions = [
    'AI & Tech',
    'Philosophy',
    'Architecture',
    'Cognitive Science',
    'Minimalism',
    'Deep Work',
    'Economics',
    'Literature',
    'Design Systems',
    'History',
    'Neuroscience',
    'Typography',
  ];

  const toggleInterest = (topic: string) => {
    if (selectedInterests.includes(topic)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((t) => t !== topic));
      }
    } else {
      setSelectedInterests([...selectedInterests, topic]);
    }
  };

  const handleFinish = () => {
    saveOnboardingPreferences(selectedInterests, selectedLength);
    onComplete?.({
      interests: selectedInterests,
      startingLength: selectedLength,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-paper overflow-y-auto min-h-screen text-on-surface flex flex-col">
      {/* Header Bar */}
      <div className="px-6 py-4 flex justify-between items-center border-b border-hairline bg-paper sticky top-0 z-10">
        <span className="font-display-lg-mobile text-[24px] text-ink-blue font-serif">
          Tidbit
        </span>
        {onCancel && (
          <button
            onClick={onCancel}
            className="font-ui-button text-[13px] text-graphite hover:text-ink-blue cursor-pointer"
          >
            Skip for now
          </button>
        )}
      </div>

      <div className="flex-1 max-w-xl mx-auto w-full px-6 py-8 flex flex-col justify-between">
        {step === 1 ? (
          /* Step 1: Interests Selection */
          <div className="flex flex-col gap-6">
            <header className="flex flex-col gap-2">
              <div className="font-label-mono text-[11px] text-graphite uppercase font-bold tracking-wider">
                Step 1 of 2
              </div>
              <h1 className="font-headline-md text-[28px] md:text-[32px] text-on-background font-serif leading-tight">
                Select your reading domains.
              </h1>
              <p className="font-article-body-mobile text-[16px] text-graphite">
                Choose the ideas and disciplines you want to cultivate focus in.
              </p>
            </header>

            {/* Interest Pills Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
              {interestOptions.map((topic) => {
                const isSelected = selectedInterests.includes(topic);
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => toggleInterest(topic)}
                    className={`py-3 px-4 rounded border text-left font-ui-button text-[14px] transition-all flex justify-between items-center cursor-pointer ${
                      isSelected
                        ? 'bg-ink-blue border-ink-blue text-white shadow-sm'
                        : 'bg-surface-container-lowest border-hairline text-on-surface hover:border-outline-variant'
                    }`}
                  >
                    <span>{topic}</span>
                    {isSelected && <span className="text-xs">✓</span>}
                  </button>
                );
              })}
            </div>

            <div className="text-center font-label-mono text-[11px] text-graphite uppercase tracking-widest">
              {selectedInterests.length} SELECTED
            </div>

            <div className="mt-8">
              <button
                disabled={selectedInterests.length === 0}
                onClick={() => setStep(2)}
                className="w-full bg-primary-container hover:bg-ink-blue disabled:opacity-50 text-white font-ui-button text-ui-button py-3.5 rounded transition-colors shadow-sm cursor-pointer"
              >
                Continue to Length Calibration →
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Stamina Picker */
          <div className="flex flex-col gap-6">
            <header className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-label-mono text-[11px] text-graphite uppercase font-bold tracking-wider">
                  Step 2 of 2
                </span>
                <button
                  onClick={() => setStep(1)}
                  className="font-label-mono text-[11px] text-ink-blue uppercase hover:underline cursor-pointer"
                >
                  ← Back to Topics
                </button>
              </div>
              <h1 className="font-headline-md text-[28px] md:text-[32px] text-on-background font-serif leading-tight">
                Let's find your starting length.
              </h1>
              <p className="font-article-body-mobile text-[16px] text-graphite">
                Read these three options. Tap the one that feels comfortable.
              </p>
            </header>

            {/* 3 Length Options */}
            <div className="flex flex-col gap-4 my-2">
              {/* Short (30 Words) */}
              <button
                type="button"
                onClick={() => setSelectedLength(30)}
                className={`w-full text-left bg-surface-container-lowest border rounded p-5 flex flex-row group transition-all cursor-pointer ${
                  selectedLength === 30
                    ? 'border-hairline border-l-[4px] border-l-ink-blue shadow-sm'
                    : 'border-hairline hover:border-outline-variant opacity-85 hover:opacity-100'
                }`}
              >
                <div className="w-gutter-ruler flex-shrink-0 relative flex justify-center h-full min-h-[70px]">
                  <div className="w-[2px] bg-paper-border absolute top-0 bottom-0" />
                  <div
                    className="w-[2px] bg-ink-blue absolute top-0"
                    style={{ height: '25%' }}
                  />
                </div>
                <div className="flex-1 pl-4 flex flex-col gap-1.5">
                  <span
                    className={`font-label-mono text-[11px] uppercase font-semibold ${
                      selectedLength === 30 ? 'text-ink-blue' : 'text-graphite'
                    }`}
                  >
                    30 Words · Micro Focus
                  </span>
                  <p className="font-article-body-mobile text-[15px] text-on-surface leading-relaxed">
                    Attention is the most precious resource we have. When we give it freely to the noise, we rob ourselves of the silence needed to think deeply.
                  </p>
                </div>
              </button>

              {/* Medium (140 Words) */}
              <button
                type="button"
                onClick={() => setSelectedLength(140)}
                className={`w-full text-left bg-surface-container-lowest border rounded p-5 flex flex-row group transition-all cursor-pointer ${
                  selectedLength === 140
                    ? 'border-hairline border-l-[4px] border-l-ink-blue shadow-sm'
                    : 'border-hairline hover:border-outline-variant opacity-85 hover:opacity-100'
                }`}
              >
                <div className="w-gutter-ruler flex-shrink-0 relative flex justify-center h-full min-h-[110px]">
                  <div className="w-[2px] bg-paper-border absolute top-0 bottom-0" />
                  <div
                    className="w-[2px] bg-ink-blue absolute top-0"
                    style={{ height: '55%' }}
                  />
                </div>
                <div className="flex-1 pl-4 flex flex-col gap-1.5">
                  <span
                    className={`font-label-mono text-[11px] uppercase font-semibold ${
                      selectedLength === 140 ? 'text-ink-blue' : 'text-graphite'
                    }`}
                  >
                    140 Words · Medium Focus
                  </span>
                  <p className="font-article-body-mobile text-[15px] text-on-surface leading-relaxed">
                    The modern digital landscape is engineered for interruption. Every notification, infinite scroll, and algorithmic feed is designed to fragment our focus. By stepping away from the stream, we reclaim cognitive sovereignty.
                  </p>
                </div>
              </button>

              {/* Long (420 Words) */}
              <button
                type="button"
                onClick={() => setSelectedLength(420)}
                className={`w-full text-left bg-surface-container-lowest border rounded p-5 flex flex-row group transition-all cursor-pointer ${
                  selectedLength === 420
                    ? 'border-hairline border-l-[4px] border-l-ink-blue shadow-sm'
                    : 'border-hairline hover:border-outline-variant opacity-85 hover:opacity-100'
                }`}
              >
                <div className="w-gutter-ruler flex-shrink-0 relative flex justify-center h-full min-h-[130px]">
                  <div className="w-[2px] bg-paper-border absolute top-0 bottom-0" />
                  <div
                    className="w-[2px] bg-ink-blue absolute top-0"
                    style={{ height: '90%' }}
                  />
                </div>
                <div className="flex-1 pl-4 flex flex-col gap-1.5">
                  <span
                    className={`font-label-mono text-[11px] uppercase font-semibold ${
                      selectedLength === 420 ? 'text-ink-blue' : 'text-graphite'
                    }`}
                  >
                    420 Words · Sustained Focus
                  </span>
                  <p className="font-article-body-mobile text-[15px] text-on-surface leading-relaxed">
                    Technology was originally envisioned as a bicycle for the mind, a tool to amplify innate capabilities. Reversing digital distraction requires structurally redesigning our relationship with information and cultivating quiet focus.
                  </p>
                </div>
              </button>
            </div>

            {/* Footer Finish */}
            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleFinish}
                className="w-full bg-primary-container hover:bg-ink-blue text-white font-ui-button text-ui-button py-3.5 rounded transition-colors shadow-sm cursor-pointer"
              >
                Start Reading with {selectedLength} Words
              </button>
              <p className="text-center font-article-body-mobile text-[14px] text-graphite">
                We'll automatically adjust and level up your stamina as you read.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
