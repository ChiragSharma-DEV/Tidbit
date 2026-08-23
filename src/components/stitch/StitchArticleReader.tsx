'use client';

import React, { useState, useEffect, useRef } from 'react';
import StitchLogo from './StitchLogo';
import { ArticleWithQuiz } from '@/contexts/AttentionTrainerContext';

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
  const [highlightActive, setHighlightActive] = useState(true);
  const [fontSizeClass, setFontSizeClass] = useState<'normal' | 'large'>('normal');
  const [readingSeconds, setReadingSeconds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(article.completed || false);
  const contentRef = useRef<HTMLDivElement>(null);

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
    <div className="bg-paper text-on-surface min-h-screen flex flex-col fixed inset-0 z-50 overflow-hidden transition-colors duration-200">
      {/* Top Reading Navigation Bar */}
      <header className="flex justify-between items-center px-4 md:px-margin-page py-3 w-full bg-paper border-b border-hairline sticky top-0 z-50">
        <button
          onClick={onBack}
          className="text-graphite hover:text-ink-blue transition-colors flex items-center gap-1.5 font-ui-button text-[14px] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          <span>Back</span>
        </button>

        <div className="flex flex-col items-center">
          <StitchLogo variant="horizontal" size="sm" showTagline={false} />
          <span className="font-label-mono text-[9px] text-graphite uppercase tracking-widest hidden sm:inline mt-0.5">
            Focus Time: {formatTimer(readingSeconds)}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setHighlightActive(!highlightActive)}
            title="Toggle Highlighter"
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              highlightActive
                ? 'bg-tertiary-fixed text-on-surface dark:bg-indigo-950 dark:text-indigo-200'
                : 'text-graphite hover:text-ink-blue'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">border_color</span>
          </button>
          <button
            onClick={() =>
              setFontSizeClass(fontSizeClass === 'normal' ? 'large' : 'normal')
            }
            title="Change Text Size"
            className="p-1.5 text-graphite hover:text-ink-blue transition-colors font-label-mono text-[12px] font-bold cursor-pointer"
          >
            {fontSizeClass === 'normal' ? 'A+' : 'A-'}
          </button>
          {onToggleSave && (
            <button
              onClick={onToggleSave}
              className="text-graphite hover:text-ink-blue transition-colors p-1.5 cursor-pointer"
              title={article.saved ? 'Remove bookmark' : 'Bookmark article'}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{
                  fontVariationSettings: article.saved ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                bookmark
              </span>
            </button>
          )}
        </div>
      </header>

      {/* Main Reading Canvas */}
      <main
        ref={contentRef}
        className="flex-grow w-full max-w-3xl mx-auto px-4 md:px-margin-page py-8 overflow-y-auto"
      >
        <div className="flex h-full min-h-[600px]">
          {/* 28px Left Gutter & Interactive Progress Ruler */}
          <div className="w-gutter-ruler flex-shrink-0 relative mr-4 md:mr-stack-md h-full min-h-[500px]">
            {/* Base Track */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-paper-border dark:bg-[#282933]" />
            {/* Active Ink Blue Progress Fill */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] bg-ink-blue transition-all duration-300 ease-out"
              style={{ height: `${scrollProgress}%` }}
            />
          </div>

          {/* Reading Content */}
          <article className="flex-grow pt-2 pb-28">
            {/* Meta Info: Topic & Word Count */}
            <div className="w-full flex justify-between items-center mb-6">
              <span className="font-label-mono text-label-mono text-graphite uppercase tracking-widest">
                {article.topic}
              </span>
              <div className="flex items-center gap-2">
                {article.difficultyLevel && (
                  <span className="font-label-mono text-[10px] uppercase font-bold text-ink-blue bg-surface-container-lowest border border-hairline px-2 py-0.5 rounded">
                    {article.difficultyLevel}
                  </span>
                )}
                <span className="font-label-mono text-label-mono text-secondary dark:text-emerald-400 uppercase tracking-widest font-semibold">
                  {article.wordCount} WORDS · {scrollProgress}% READ
                </span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="font-display-lg-mobile text-[30px] md:font-display-lg md:text-[42px] text-on-surface mb-6 font-serif leading-[1.15]">
              {article.title || 'The Art of Noticing'}
            </h1>

            {/* Analogy Box if present */}
            {article.analogy && (
              <div className="mb-6 my-4 pl-4 border-l-2 border-[var(--ink)]">
                <span className="t-label block mb-1">
                  IN SIMPLE WORDS
                </span>
                <p className="t-quote">
                  "{article.analogy}"
                </p>
              </div>
            )}

            {/* Key Takeaway Quote Box */}
            {article.keyTakeaway && (
              <div className="mb-8 pl-4 border-l-2 border-[var(--ink)] text-on-surface t-quote">
                "{article.keyTakeaway}"
              </div>
            )}

            {/* Body Text */}
            <div
              className={`text-on-surface-variant space-y-6 ${
                fontSizeClass === 'large'
                  ? 'font-article-body text-[22px] leading-[36px]'
                  : 'font-article-body-mobile text-[18px] md:font-article-body md:text-[20px] leading-[30px] md:leading-[32px]'
              }`}
            >
              {defaultParagraphs.map((para, idx) => (
                <p key={idx}>
                  {idx === 0 && highlightActive ? (
                    <>
                      {para.split(' ').map((w, i) =>
                        ['model', 'attention', 'silence', 'technology', 'focus', 'clarity', 'signals', 'bandwidth'].some((k) =>
                          w.toLowerCase().includes(k)
                        ) ? (
                          <span
                            key={i}
                            className="bg-tertiary-fixed text-on-surface highlight-felt inline-block px-1 rounded-xs"
                          >
                            {w}{' '}
                          </span>
                        ) : (
                          w + ' '
                        )
                      )}
                    </>
                  ) : (
                    para
                  )}
                </p>
              ))}

              {/* Minimalist Pull Quote Block */}
              {article.pullQuote ? (
                <div className="my-8 border border-hairline bg-surface-container-lowest p-6 md:p-8 rounded">
                  <p className="font-headline-md text-[22px] md:text-headline-md text-on-surface italic mb-2 font-serif">
                    "{article.pullQuote.quote}"
                  </p>
                  <p className="font-label-mono text-[11px] md:text-label-mono text-graphite text-right uppercase tracking-widest">
                    — {article.pullQuote.author}
                  </p>
                </div>
              ) : (
                <div className="my-8 border border-hairline bg-surface-container-lowest p-6 md:p-8 rounded">
                  <p className="font-headline-md text-[22px] md:text-headline-md text-on-surface italic mb-2 font-serif">
                    "Attention is the rarest and purest form of generosity."
                  </p>
                  <p className="font-label-mono text-[11px] md:text-label-mono text-graphite text-right uppercase tracking-widest">
                    — SIMONE WEIL
                  </p>
                </div>
              )}
            </div>

            {/* End of Read Action: Quick Check & Milestone Share Overlay */}
            <div className="mt-12 pt-8 border-t border-hairline flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-container-lowest border border-hairline p-6 rounded-lg shadow-sm">
              <div>
                <span className="font-label-mono text-[11px] text-ink-blue uppercase tracking-widest block mb-1 font-bold">
                  {isCompleted ? '✓ COMPLETED READ' : 'CHECK UNDERSTANDING'}
                </span>
                <p className="font-headline-md text-[20px] text-on-surface font-serif">
                  {isCompleted ? 'Milestone Certificate Unlocked' : 'Test comprehension & gain +50 XP'}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {onOpenMilestoneCard && (
                  <button
                    onClick={onOpenMilestoneCard}
                    className="px-4 py-3 rounded-[var(--r-control)] border border-[var(--rule)] bg-[var(--insert)] hover:border-[var(--ink)] text-[var(--ink)] t-ui flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>View Certificate</span>
                  </button>
                )}

                {onTakeQuickCheck && (
                  <button
                    onClick={onTakeQuickCheck}
                    className="bg-primary-container hover:bg-ink-blue text-white font-ui-button text-ui-button px-6 py-3 rounded transition-colors shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <span>Take Quick Check</span>
                    <span>→</span>
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
