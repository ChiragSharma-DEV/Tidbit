'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

export interface CalibrationConcept {
  id: string;
  topic: string;
  category: 'tech' | 'business' | 'mind' | 'systems' | 'general';
  title: string;
  summary: string;
  question: string;
  difficulty: 1 | 2 | 3;
  icon: string;
}

export const CALIBRATION_CONCEPTS_POOL: CalibrationConcept[] = [
  // AI & Tech (Beginner to Advanced)
  {
    id: 'ai-prompt-eval',
    topic: 'AI & Machine Learning',
    category: 'tech',
    title: 'Prompt Conditioning & Few-Shot Learning',
    summary: 'Guiding an AI model by giving it 2-3 clear examples before asking it to complete your task.',
    question: 'Do you know how to write structured system prompts and few-shot examples?',
    difficulty: 1,
    icon: 'terminal',
  },
  {
    id: 'ai-slm',
    topic: 'AI & Machine Learning',
    category: 'tech',
    title: 'Small Language Models (SLMs)',
    summary: 'Lightweight AI models (2B–7B numbers) trimmed down to run fast on your phone with zero delay and 100% privacy.',
    question: 'Do you understand why local micro-models are faster and more private than giant cloud models?',
    difficulty: 2,
    icon: 'memory',
  },
  {
    id: 'ai-transformer',
    topic: 'AI & Machine Learning',
    category: 'tech',
    title: 'Transformer Self-Attention',
    summary: 'How modern AI reads: Comparing all words in a sentence simultaneously instead of reading one word at a time.',
    question: 'Can you explain how attention matrices link words across a paragraph in parallel?',
    difficulty: 3,
    icon: 'neurology',
  },

  // Growth & Marketing (Beginner to Advanced)
  {
    id: 'mkt-funnel',
    topic: 'Growth & Marketing',
    category: 'business',
    title: 'The Simple Growth Funnel (AARRR)',
    summary: 'Acquiring visitors, activating their first "aha!" moment, retaining them, and converting them to revenue.',
    question: 'Have you optimized user onboarding steps to reduce drop-off?',
    difficulty: 1,
    icon: 'filter_alt',
  },
  {
    id: 'mkt-cac-ltv',
    topic: 'Growth & Marketing',
    category: 'business',
    title: 'CAC to LTV Unit Economics',
    summary: 'The golden rule of sustainable business: Making at least $3 from a customer for every $1 spent acquiring them.',
    question: 'Can you calculate customer acquisition cost and payback months for a product?',
    difficulty: 2,
    icon: 'trending_up',
  },
  {
    id: 'mkt-distribution',
    topic: 'Growth & Marketing',
    category: 'business',
    title: 'Organic Viral Distribution Loops',
    summary: 'Designing products where normal user actions naturally invite new users (like collaborative documents).',
    question: 'Do you know how to calculate viral coefficients and build self-reinforcing growth loops?',
    difficulty: 3,
    icon: 'share',
  },

  // Mind & Deep Work (Beginner to Advanced)
  {
    id: 'mind-focus',
    topic: 'Deep Work & Focus',
    category: 'mind',
    title: 'Single-Tasking & Focus Sprints',
    summary: 'Defending unbroken 25–45 minute focus blocks without checking emails, tabs, or notifications.',
    question: 'Do you regularly practice deliberate distraction-free reading sessions?',
    difficulty: 1,
    icon: 'timer',
  },
  {
    id: 'mind-residue',
    topic: 'Cognitive Science',
    category: 'mind',
    title: 'Attention Residue & Context Switching',
    summary: 'When you check a quick ping, your brain leaves focus behind on that message, slowing thinking for 20+ minutes.',
    question: 'Do you structure your day to minimize switching between communication and deep work?',
    difficulty: 2,
    icon: 'psychology',
  },
  {
    id: 'mind-load',
    topic: 'Cognitive Science',
    category: 'mind',
    title: 'Cognitive Load Theory (4-Item Limit)',
    summary: 'Human conscious working memory can only juggle ~4 items. Noisy layouts choke comprehension before learning starts.',
    question: 'Do you know the difference between intrinsic, germane, and extraneous mental load?',
    difficulty: 3,
    icon: 'hub',
  },

  // Systems & Architecture (Beginner to Advanced)
  {
    id: 'sys-first-principles',
    topic: 'System Architecture',
    category: 'systems',
    title: 'First-Principles Thinking',
    summary: 'Boiling any problem down to fundamental non-negotiable truths instead of copying what others do.',
    question: 'Do you break problems into atomic truths before designing solutions?',
    difficulty: 2,
    icon: 'account_tree',
  },
  {
    id: 'sys-cap-theorem',
    topic: 'System Architecture',
    category: 'systems',
    title: 'CAP Theorem & Eventual Consistency',
    summary: 'Distributed databases can only guarantee two out of three: Consistency, Availability, and Partition tolerance.',
    question: 'Are you familiar with data synchronization tradeoffs in distributed cloud networks?',
    difficulty: 3,
    icon: 'database',
  },
  {
    id: 'sys-antifragility',
    topic: 'Economics & Venture',
    category: 'systems',
    title: 'Antifragility & Asymmetric Upside',
    summary: 'Building systems and career habits that gain strength from volatility and surprises rather than breaking.',
    question: 'Can you spot convex bets where downside is limited but upside is open-ended?',
    difficulty: 2,
    icon: 'balance',
  },

  // Philosophy & Culture (Beginner to Advanced)
  {
    id: 'phil-stoicism',
    topic: 'Philosophy & Stoicism',
    category: 'general',
    title: 'Dichotomy of Control (Epictetus)',
    summary: 'Separating what is in your power (focus, actions) from what is not (algorithms, external opinions).',
    question: 'Do you actively filter daily stress by focusing solely on what you control?',
    difficulty: 1,
    icon: 'self_improvement',
  },
  {
    id: 'phil-minimalism',
    topic: 'Quiet Design & Minimalism',
    category: 'general',
    title: 'Subtractive Design (Less Ink, More Signal)',
    summary: 'Improving thinking and interfaces not by adding features, but by removing every ounce of distraction.',
    question: 'Do you create clarity by eliminating unnecessary elements rather than adding decorations?',
    difficulty: 2,
    icon: 'ink_pen',
  },
];

export interface CalibrationDeckProps {
  selectedInterests: string[];
  onComplete: (result: {
    level: 1 | 2 | 3;
    score: number;
    totalCards: number;
    recommendedLength: number;
    answers: { conceptId: string; title: string; status: 'known' | 'new' | 'familiar' }[];
  }) => void;
  onBackToNiched?: () => void;
}

export default function StitchCalibrationDeck({
  selectedInterests,
  onComplete,
  onBackToNiched,
}: CalibrationDeckProps) {
  const [deck, setDeck] = useState<CalibrationConcept[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<
    { conceptId: string; title: string; status: 'known' | 'new' | 'familiar' }[]
  >([]);

  // Drag physics state
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | 'up' | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  // Initialize deck based on selectedInterests
  useEffect(() => {
    const matching = CALIBRATION_CONCEPTS_POOL.filter((c) =>
      selectedInterests.some(
        (interest) =>
          c.topic.toLowerCase().includes(interest.toLowerCase()) ||
          interest.toLowerCase().includes(c.topic.toLowerCase())
      )
    );

    const pool = matching.length >= 4 ? matching : [...matching, ...CALIBRATION_CONCEPTS_POOL];
    const unique = Array.from(new Set(pool.map((c) => c.id)))
      .map((id) => pool.find((c) => c.id === id)!)
      .slice(0, 4);

    setDeck(unique.length >= 4 ? unique : CALIBRATION_CONCEPTS_POOL.slice(0, 4));
    setCurrentIndex(0);
    setAnswers([]);
  }, [selectedInterests]);

  const handleSwipeAction = useCallback(
    (status: 'known' | 'new' | 'familiar', direction: 'left' | 'right' | 'up') => {
      if (currentIndex >= deck.length) return;

      setExitDirection(direction);

      const currentConcept = deck[currentIndex];
      const nextAnswers = [
        ...answers,
        { conceptId: currentConcept.id, title: currentConcept.title, status },
      ];
      setAnswers(nextAnswers);

      setTimeout(() => {
        setExitDirection(null);
        setDragOffset({ x: 0, y: 0 });

        const nextIndex = currentIndex + 1;
        if (nextIndex >= deck.length) {
          const totalPoints = nextAnswers.reduce((acc, a) => {
            if (a.status === 'known') return acc + 2;
            if (a.status === 'familiar') return acc + 1;
            return acc;
          }, 0);

          let level: 1 | 2 | 3 = 1;
          let recommendedLength = 30;

          if (totalPoints >= 5) {
            level = 3;
            recommendedLength = 420;
          } else if (totalPoints >= 3) {
            level = 2;
            recommendedLength = 140;
          } else {
            level = 1;
            recommendedLength = 30;
          }

          onComplete({
            level,
            score: totalPoints,
            totalCards: deck.length,
            recommendedLength,
            answers: nextAnswers,
          });
        } else {
          setCurrentIndex(nextIndex);
        }
      }, 320);
    },
    [currentIndex, deck, answers, onComplete]
  );

  // Mouse & Touch Drag Handlers
  const handlePointerDown = (clientX: number, clientY: number) => {
    if (exitDirection) return;
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDragging || exitDirection) return;
    const dx = clientX - dragStart.x;
    const dy = clientY - dragStart.y;
    setDragOffset({ x: dx, y: dy });
  };

  const handlePointerUp = () => {
    if (!isDragging || exitDirection) return;
    setIsDragging(false);

    const SWIPE_THRESHOLD = 95;
    if (dragOffset.x > SWIPE_THRESHOLD) {
      handleSwipeAction('known', 'right');
    } else if (dragOffset.x < -SWIPE_THRESHOLD) {
      handleSwipeAction('new', 'left');
    } else if (dragOffset.y < -SWIPE_THRESHOLD) {
      handleSwipeAction('familiar', 'up');
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const currentCard = deck[currentIndex];
  const nextCard = deck[currentIndex + 1];

  const rotationAngle = dragOffset.x * 0.08;
  const rightStampOpacity = Math.min(1, Math.max(0, (dragOffset.x - 20) / 90));
  const leftStampOpacity = Math.min(1, Math.max(0, (-dragOffset.x - 20) / 90));
  const familiarStampOpacity = Math.min(1, Math.max(0, (-dragOffset.y - 30) / 80));

  if (!currentCard && currentIndex >= deck.length) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto w-full select-none">
      {/* Header & Step Tracker */}
      <header className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="font-label-mono text-[11px] text-graphite uppercase font-bold tracking-wider">
            CALIBRATION · STEP 2 OF 2
          </span>
          {onBackToNiched && (
            <button
              onClick={onBackToNiched}
              className="font-label-mono text-[11px] text-ink-blue uppercase hover:underline cursor-pointer"
            >
              ← Edit Niches
            </button>
          )}
        </div>
        <h1 className="font-headline-md text-[26px] md:text-[30px] text-on-background font-serif leading-tight">
          Attention & Knowledge Calibration
        </h1>
        <p className="font-article-body-mobile text-[15px] text-graphite leading-relaxed">
          Swipe right if you master this concept, or left if it's new to you. This calibrates your starting curriculum level.
        </p>

        {/* Progress Dots / Bar */}
        <div className="w-full bg-surface-container-lowest border border-hairline h-1.5 rounded-full overflow-hidden mt-1">
          <div
            className="bg-ink-blue h-full transition-all duration-300"
            style={{ width: `${((currentIndex) / (deck.length || 4)) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] font-label-mono text-graphite">
          <span>CONCEPT {Math.min(currentIndex + 1, deck.length)} OF {deck.length}</span>
          <span>{answers.filter((a) => a.status === 'known').length} MASTERED</span>
        </div>
      </header>

      {/* Swipeable Card Deck Arena */}
      <div className="relative w-full h-[370px] flex items-center justify-center my-2">
        {/* Background Ghost Card for Depth */}
        {nextCard && (
          <div
            className="absolute inset-x-3 bottom-0 top-6 bg-surface-container-lowest border border-hairline rounded-lg p-6 flex flex-col justify-between opacity-60 scale-95 transition-all shadow-xs pointer-events-none"
            style={{ transform: 'translateY(12px) scale(0.95)' }}
          >
            <div className="flex justify-between items-center">
              <span className="font-label-mono text-[10px] text-graphite uppercase">
                {nextCard.topic}
              </span>
              <span className="text-[12px] text-graphite font-mono">★☆☆</span>
            </div>
            <div className="space-y-2">
              <h3 className="font-headline-md text-[20px] font-serif text-on-surface">
                {nextCard.title}
              </h3>
              <p className="font-article-body-mobile text-[14px] text-graphite line-clamp-2">
                {nextCard.summary}
              </p>
            </div>
            <div className="h-6" />
          </div>
        )}

        {/* Top Active Swipe Card */}
        {currentCard && (
          <div
            ref={cardRef}
            onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
            onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={(e) =>
              e.touches[0] && handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)
            }
            onTouchMove={(e) =>
              e.touches[0] && handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)
            }
            onTouchEnd={handlePointerUp}
            style={{
              transform: exitDirection
                ? exitDirection === 'right'
                  ? 'translate3d(600px, 0, 0) rotate(25deg)'
                  : exitDirection === 'left'
                  ? 'translate3d(-600px, 0, 0) rotate(-25deg)'
                  : 'translate3d(0, -600px, 0)'
                : `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${rotationAngle}deg)`,
              transition: isDragging ? 'none' : 'transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
            className="absolute inset-0 bg-card-white border-2 border-hairline rounded-lg p-6 flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow z-20 overflow-hidden touch-none will-change-transform select-none"
          >
            {/* Stamp Overlay: I KNOW THIS (Green Stamp) */}
            <div
              style={{ opacity: rightStampOpacity }}
              className="absolute top-6 left-6 border-2 border-green-600 text-green-700 dark:text-green-300 font-label-mono text-[13px] font-bold px-3 py-1 rounded rotate-[-12deg] tracking-widest pointer-events-none bg-green-50/90 dark:bg-green-950/90 z-30"
            >
              ✓ I KNOW THIS
            </div>

            {/* Stamp Overlay: NEW TO ME (Ink Blue / Slate Stamp) */}
            <div
              style={{ opacity: leftStampOpacity }}
              className="absolute top-6 right-6 border-2 border-ink-blue text-ink-blue dark:text-indigo-300 font-label-mono text-[13px] font-bold px-3 py-1 rounded rotate-[12deg] tracking-widest pointer-events-none bg-indigo-50/90 dark:bg-indigo-950/90 z-30"
            >
              ★ NEW TO ME
            </div>

            {/* Stamp Overlay: FAMILIAR */}
            <div
              style={{ opacity: familiarStampOpacity }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 border border-[var(--rule)] text-[var(--ink)] t-label px-4 py-1 rounded-[var(--r-control)] pointer-events-none bg-[var(--insert)] z-30 font-bold"
            >
              HEARD OF IT
            </div>

            {/* Top Bar: Topic Badge & Difficulty Stars */}
            <div className="flex justify-between items-center border-b border-hairline pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-ink-blue">
                  {currentCard.icon}
                </span>
                <span className="font-label-mono text-[11px] text-graphite uppercase font-bold tracking-wider">
                  {currentCard.topic}
                </span>
              </div>
              <div className="flex gap-0.5 text-ink-blue text-xs font-mono">
                {currentCard.difficulty === 1 && <span>★☆☆ Basic</span>}
                {currentCard.difficulty === 2 && <span>★★☆ Intermediate</span>}
                {currentCard.difficulty === 3 && <span>★★★ Advanced</span>}
              </div>
            </div>

            {/* Main Body */}
            <div className="space-y-3 my-auto py-2">
              <h2 className="font-headline-md text-[23px] font-serif text-on-surface leading-tight">
                {currentCard.title}
              </h2>
              <p className="font-article-body-mobile text-[15px] text-graphite leading-relaxed">
                {currentCard.summary}
              </p>
              <div className="p-3 rounded bg-paper/60 border border-hairline/80">
                <span className="font-label-mono text-[10px] text-graphite uppercase block mb-1">
                  INTUITIVE SELF-CHECK:
                </span>
                <p className="font-sans text-[13px] font-medium text-on-surface italic">
                  "{currentCard.question}"
                </p>
              </div>
            </div>

            {/* Card Footer Helper */}
            <div className="border-t border-hairline pt-3 flex justify-between items-center text-[11px] font-label-mono text-graphite">
              <span>← Swipe Left: New</span>
              <span>Swipe Right: Mastered →</span>
            </div>
          </div>
        )}
      </div>

      {/* Tactile 1-Click Action Buttons */}
      <div className="flex items-center justify-center gap-4 pt-1">
        {/* Left: New to me */}
        <button
          type="button"
          onClick={() => handleSwipeAction('new', 'left')}
          className="flex-1 py-3 px-3 rounded-lg border border-hairline bg-surface-container-lowest hover:border-ink-blue/50 text-graphite hover:text-ink-blue font-ui-button text-[14px] flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
          <span>New to me</span>
        </button>

        {/* Center: Familiar / Heard of it */}
        <button
          type="button"
          onClick={() => handleSwipeAction('familiar', 'up')}
          className="py-3 px-4 rounded-lg border border-hairline bg-surface-container-lowest hover:border-amber-500/50 text-graphite hover:text-amber-700 dark:hover:text-amber-400 font-ui-button text-[13px] flex items-center justify-center gap-1 transition-all shadow-xs active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">chat_bubble_outline</span>
          <span>Familiar</span>
        </button>

        {/* Right: I know this */}
        <button
          type="button"
          onClick={() => handleSwipeAction('known', 'right')}
          className="flex-1 py-3 px-3 rounded-lg border border-ink-blue bg-ink-blue text-white hover:bg-ink-blue/90 font-ui-button text-[14px] flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">check</span>
          <span>I know this</span>
        </button>
      </div>

      {/* Helper Tip */}
      <div className="text-center font-label-mono text-[10px] text-graphite/80 uppercase">
        Drag card left/right or tap buttons to rate familiarity
      </div>
    </div>
  );
}
