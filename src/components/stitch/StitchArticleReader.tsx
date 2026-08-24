'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArticleWithQuiz } from '@/contexts/AttentionTrainerContext';
import { hueForTopic } from '@/lib/design/topicHue';

interface StitchArticleReaderProps {
  article: ArticleWithQuiz;
  onBack: () => void;
  onTakeQuickCheck?: () => void;
  onToggleSave?: () => void;
  onUpdateProgress?: (percent: number) => void;
  onMarkComplete?: () => void;
  onOpenMilestoneCard?: () => void;
}

export default function StitchArticleReader({
  article,
  onBack,
  onTakeQuickCheck,
  onToggleSave,
  onUpdateProgress,
  onMarkComplete,
  onOpenMilestoneCard,
}: StitchArticleReaderProps) {
  const [scrollProgress, setScrollProgress] = useState(article.progressPercent || 15);
  const [fontSizeClass, setFontSizeClass] = useState<'normal' | 'large'>('normal');
  const [readingSeconds, setReadingSeconds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(article.completed || false);
  const contentRef = useRef<HTMLDivElement>(null);
  const hueVar = hueForTopic(article.topic);

  // Active reading timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible' && document.hasFocus()) {
        setReadingSeconds((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Track scroll and update progress
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const el = contentRef.current;
      const totalHeight = el.scrollHeight - el.clientHeight;
      if (totalHeight <= 0) {
        setScrollProgress(100);
        return;
      }
      const currentScroll = el.scrollTop;
      const progress = Math.min(100, Math.max(10, Math.round((currentScroll / totalHeight) * 100)));
      setScrollProgress(progress);
      onUpdateProgress?.(progress);

      if (progress >= 90 && !isCompleted) {
        setIsCompleted(true);
        onMarkComplete?.();
      }
    };

    const el = contentRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (el) el.removeEventListener('scroll', handleScroll);
    };
  }, [isCompleted, onMarkComplete, onUpdateProgress]);

  const defaultParagraphs = article.paragraphs || [
    `In a world engineered to fragment our focus, the simple act of sustained observation has become a radical defiance. We move through our days enveloped in a digital haze, skimming surfaces, extracting data points, but rarely allowing ourselves to truly perceive the depth of our surroundings.`,
    `True perception requires a deliberate slowing down. It asks us to momentarily suspend our relentless drive for productivity and instead cultivate an environment where our primary task is merely to witness. This is where we find the nuance that algorithms gloss over.`,
    `Consider the texture of silence in a crowded room, or the specific slant of late afternoon light against a concrete wall. These details do not demand our Attention, they patiently await it. When we finally grant it, the mundane reveals its hidden architecture.`,
    `To notice is to inhabit your life fully, rather than merely passing through it on the way to the next objective. It is a quiet print left upon the mind, far more enduring than the fleeting ping of a notification.`,
  ];

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-[var(--stock)] text-[var(--ink)] min-h-screen flex flex-col fixed inset-0 z-50 overflow-hidden">
      {/* Top Reading Navigation Bar */}
      <header className="flex justify-between items-center px-4 md:px-8 py-3 w-full bg-[var(--stock)] border-b border-[var(--rule)] sticky top-0 z-50">
        <button
          onClick={onBack}
          className="t-ui text-[var(--graphite)] hover:text-[var(--ink)] transition-colors cursor-pointer font-semibold"
        >
          Back
        </button>

        <div className="flex flex-col items-center">
          <span className="t-title font-display text-[20px]">Tidbit</span>
          <span className="t-num text-[var(--graphite)] hidden sm:inline">
            FOCUS TIME: {formatTimer(readingSeconds)}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setFontSizeClass(fontSizeClass === 'normal' ? 'large' : 'normal')}
            className="t-ui text-[var(--graphite)] hover:text-[var(--ink)] font-semibold cursor-pointer"
          >
            {fontSizeClass === 'normal' ? 'Size +' : 'Size -'}
          </button>
          {onToggleSave && (
            <button
              onClick={onToggleSave}
              className="t-ui text-[var(--graphite)] hover:text-[var(--ink)] cursor-pointer"
            >
              {article.saved ? 'Saved' : 'Save'}
            </button>
          )}
        </div>
      </header>

      {/* Main Reading Canvas */}
      <main
        ref={contentRef}
        className="flex-grow w-full max-w-3xl mx-auto px-3 sm:px-6 md:px-8 py-6 sm:py-8 overflow-y-auto"
      >
        <div className="flex h-full min-h-[600px]">
          {/* Left Rail Track */}
          <div className="w-5 sm:w-[28px] flex-shrink-0 relative mr-3 sm:mr-6 h-full min-h-[500px]">
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-[var(--rule)]" />
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] transition-all duration-300 ease-out"
              style={{
                height: `${scrollProgress}%`,
                backgroundColor: `var(${hueVar})`,
              }}
            />
          </div>

          {/* Reading Content */}
          <article className="flex-grow min-w-0 pt-2 pb-28 max-w-full sm:max-w-[34rem]">
            {/* Meta Info */}
            <div className="w-full flex justify-between items-center mb-6">
              <span
                className="t-label font-bold"
                style={{ color: `var(${hueVar})` }}
              >
                {article.topic}
              </span>
              <span className="t-label text-[var(--graphite)]">
                {article.difficultyLevel ? article.difficultyLevel.toUpperCase() : 'BEGINNER'} · {article.wordCount} WORDS · {scrollProgress}% READ
              </span>
            </div>

            {/* Headline */}
            <h1 className="t-hero mb-6 font-display">
              {article.title || 'The Art of Noticing'}
            </h1>

            {/* Flush Callout / Analogy Box */}
            {article.analogy && (
              <div
                className="my-6 pl-4 border-l-2"
                style={{ borderLeftColor: `var(${hueVar})` }}
              >
                <span className="t-label block mb-1">IN SIMPLE WORDS</span>
                <p className="t-quote">
                  "{article.analogy}"
                </p>
              </div>
            )}

            {/* Key Takeaway Quote Box */}
            {article.keyTakeaway && (
              <div className="my-6 pt-3 border-t border-[var(--rule)]">
                <p className="t-ui text-[var(--ink)]">
                  <span className="font-semibold">Key Insight:</span> {article.keyTakeaway}
                </p>
              </div>
            )}

            {/* Body Text */}
            <div
              className={`space-y-6 ${
                fontSizeClass === 'large'
                  ? 't-body text-[20px] leading-[32px]'
                  : 't-body'
              }`}
            >
              {defaultParagraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}

              {/* Minimalist Pull Quote Block */}
              <div className="my-8 border-t border-b border-[var(--rule)] py-6">
                <p className="t-quote text-[20px] leading-[30px] mb-2">
                  "{article.pullQuote?.quote || 'Attention is the rarest and purest form of generosity.'}"
                </p>
                <p className="t-label text-[var(--graphite)] text-right">
                  — {article.pullQuote?.author || 'SIMONE WEIL'}
                </p>
              </div>
            </div>

            {/* End of Read Actions */}
            <div className="mt-12 pt-8 border-t border-[var(--rule)] flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <span
                  className="t-label block mb-1 font-bold"
                  style={{ color: `var(${hueVar})` }}
                >
                  {isCompleted ? 'COMPLETED READ' : 'CHECK UNDERSTANDING'}
                </span>
                <p className="t-title font-display text-[22px]">
                  {isCompleted ? 'Milestone Certificate Unlocked' : 'Test comprehension & gain +50 XP'}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {onOpenMilestoneCard && (
                  <button
                    onClick={onOpenMilestoneCard}
                    className="px-4 py-2.5 rounded-[var(--r-control)] border border-[var(--rule)] bg-[var(--insert)] hover:border-[var(--ink)] text-[var(--ink)] t-ui font-semibold cursor-pointer"
                  >
                    View Certificate
                  </button>
                )}

                {onTakeQuickCheck && (
                  <button
                    onClick={onTakeQuickCheck}
                    className="px-5 py-2.5 rounded-[var(--r-control)] bg-[var(--ink)] text-[var(--insert)] t-ui font-semibold cursor-pointer"
                  >
                    Take Quick Check
                  </button>
                )}
              </div>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
