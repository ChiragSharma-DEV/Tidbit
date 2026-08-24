'use client';

import React, { useState } from 'react';
import { hueForTopic } from '@/lib/design/topicHue';

interface ConceptCard {
  id: string;
  topic: string;
  title: string;
  summary: string;
  question: string;
  difficulty: 1 | 2 | 3;
}

const CALIBRATION_DECK_SEED: ConceptCard[] = [
  {
    id: 'calib-1',
    topic: 'AI & Machine Learning',
    title: 'Transformer Architecture & Self-Attention',
    summary: 'The breakthrough in 2017 that allows models to process all words in parallel, scoring relevance between every pair of words in a sentence.',
    question: 'Do you understand how query, key, and value vectors compute self-attention matrix weights?',
    difficulty: 2,
  },
  {
    id: 'calib-2',
    topic: 'Cognitive Science',
    title: 'Working Memory Capacity & Miller\'s Law',
    summary: 'Human working memory can hold roughly 4–7 discrete chunks of information before cognitive overload degrades synthesis velocity.',
    question: 'Are you familiar with cognitive load theory and chunking mechanisms for deep retention?',
    difficulty: 1,
  },
  {
    id: 'calib-3',
    topic: 'Growth & Marketing',
    title: 'CAC to LTV Ratio & Payback Velocity',
    summary: 'Customer Acquisition Cost must be recovered within 12 months, yielding a lifetime value at least 3x higher than acquisition expense.',
    question: 'Can you analyze unit economics for viral referral loops and payback period benchmarks?',
    difficulty: 2,
  },
  {
    id: 'calib-4',
    topic: 'Software Architecture',
    title: 'Event-Driven Microservices & CQRS',
    summary: 'Separating read and write data paths to achieve scale, using asynchronous event streams for eventual consistency across services.',
    question: 'Have you built or designed systems using Command Query Responsibility Segregation?',
    difficulty: 3,
  },
  {
    id: 'calib-5',
    topic: 'Deep Work & Focus',
    title: 'Attention Residue & Task Switching Debt',
    summary: 'Switching tasks leaves a portion of your attention stuck on the previous task for up to 20 minutes, reducing overall cognitive depth.',
    question: 'Do you understand the neural cost of micro-interruptions on deep problem solving?',
    difficulty: 1,
  },
];

interface StitchCalibrationDeckProps {
  selectedInterests: string[];
  onComplete: (result: {
    score: number;
    recommendedLevel: 1 | 2 | 3;
    recommendedLength: number;
    answers: { conceptId: string; title: string; status: 'known' | 'new' | 'familiar' }[];
  }) => void;
  onBackToNiched?: () => void;
}

export default function StitchCalibrationDeck({
  selectedInterests,
  onComplete,
  onBackToNiched,
}: StitchCalibrationDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<
    { conceptId: string; title: string; status: 'known' | 'new' | 'familiar' }[]
  >([]);

  // Drag state for gesture simulation
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const currentCard = CALIBRATION_DECK_SEED[currentIndex];
  const progressPercent = Math.round((currentIndex / CALIBRATION_DECK_SEED.length) * 100);

  const handleSwipeAction = (status: 'known' | 'new' | 'familiar', direction: 'left' | 'right' | 'up') => {
    if (!currentCard) return;

    const updatedAnswers = [
      ...answers,
      { conceptId: currentCard.id, title: currentCard.title, status },
    ];
    setAnswers(updatedAnswers);

    if (currentIndex + 1 < CALIBRATION_DECK_SEED.length) {
      setCurrentIndex((prev) => prev + 1);
      setDragOffset({ x: 0, y: 0 });
    } else {
      // Calculate final calibration score and level
      const knownCount = updatedAnswers.filter((a) => a.status === 'known').length;
      const familiarCount = updatedAnswers.filter((a) => a.status === 'familiar').length;
      const totalScore = knownCount * 2 + familiarCount * 1;

      let level: 1 | 2 | 3 = 1;
      let length = 85;

      if (totalScore >= 7) {
        level = 3;
        length = 420;
      } else if (totalScore >= 3) {
        level = 2;
        length = 165;
      } else {
        level = 1;
        length = 85;
      }

      onComplete({
        score: totalScore,
        recommendedLevel: level,
        recommendedLength: length,
        answers: updatedAnswers,
      });
    }
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset.x > 90) {
      handleSwipeAction('known', 'right');
    } else if (dragOffset.x < -90) {
      handleSwipeAction('new', 'left');
    } else if (dragOffset.y < -80) {
      handleSwipeAction('familiar', 'up');
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Stamp opacity feedback based on drag offset
  const rightStampOpacity = Math.min(1, Math.max(0, dragOffset.x / 80));
  const leftStampOpacity = Math.min(1, Math.max(0, -dragOffset.x / 80));
  const familiarStampOpacity = Math.min(1, Math.max(0, -dragOffset.y / 70));

  const rotationDeg = Math.min(15, Math.max(-15, dragOffset.x * 0.08));
  const hueVar = currentCard ? hueForTopic(currentCard.topic) : '--ink';

  return (
    <div className="flex flex-col gap-5 max-w-md mx-auto py-2">
      {/* Top Deck Header */}
      <div className="flex justify-between items-center">
        <div>
          <span className="t-label text-[var(--graphite)]">
            CARD {currentIndex + 1} OF {CALIBRATION_DECK_SEED.length}
          </span>
          <span className="t-label font-bold text-[var(--ink)] block">
            Swipe Assessment
          </span>
        </div>

        {onBackToNiched && (
          <button
            onClick={onBackToNiched}
            className="t-ui text-[var(--graphite)] hover:text-[var(--ink)] cursor-pointer"
          >
            Change Niches
          </button>
        )}
      </div>

      {/* Progress Track */}
      <div className="w-full h-1 bg-[var(--rule)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--ink)] transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Swipeable Card Deck Container */}
      <div className="relative w-full h-[320px] sm:h-[360px] flex items-center justify-center touch-none">
        {currentCard && (
          <div
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotationDeg}deg)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease-out',
            }}
            className="w-full h-full bg-[var(--insert)] border border-[var(--rule)] rounded-[var(--r-card)] p-4 sm:p-6 shadow-[0_1px_2px_rgba(26,24,20,0.04)] flex flex-col justify-between cursor-grab active:cursor-grabbing relative select-none"
          >
            {/* Stamp Overlay: MASTERED */}
            <div
              style={{ opacity: rightStampOpacity }}
              className="absolute top-6 left-6 border border-[var(--rule)] text-[var(--ink)] t-label px-3 py-1 rounded-[var(--r-control)] -rotate-[12deg] pointer-events-none bg-[var(--insert)] z-30 font-bold"
            >
              I KNOW THIS
            </div>

            {/* Stamp Overlay: NEW */}
            <div
              style={{ opacity: leftStampOpacity }}
              className="absolute top-6 right-6 border border-[var(--rule)] text-[var(--ink)] t-label px-3 py-1 rounded-[var(--r-control)] rotate-[12deg] pointer-events-none bg-[var(--insert)] z-30 font-bold"
            >
              NEW TO ME
            </div>

            {/* Stamp Overlay: FAMILIAR */}
            <div
              style={{ opacity: familiarStampOpacity }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 border border-[var(--rule)] text-[var(--ink)] t-label px-4 py-1 rounded-[var(--r-control)] pointer-events-none bg-[var(--insert)] z-30 font-bold"
            >
              HEARD OF IT
            </div>

            {/* Top Bar */}
            <div className="flex justify-between items-center border-b border-[var(--rule)] pb-3">
              <span
                className="t-label font-bold"
                style={{ color: `var(${hueVar})` }}
              >
                {currentCard.topic}
              </span>
              <span className="t-label text-[var(--graphite)]">
                {currentCard.difficulty === 1 && 'BASIC'}
                {currentCard.difficulty === 2 && 'INTERMEDIATE'}
                {currentCard.difficulty === 3 && 'ADVANCED'}
              </span>
            </div>

            {/* Main Body */}
            <div className="space-y-3 my-auto py-2">
              <h2 className="t-title font-display text-[22px]">
                {currentCard.title}
              </h2>
              <p className="t-body text-[15px]">
                {currentCard.summary}
              </p>
              <div
                className="my-3 pl-4 border-l-2"
                style={{ borderLeftColor: `var(${hueVar})` }}
              >
                <span className="t-label block mb-1">INTUITIVE SELF-CHECK</span>
                <p className="t-quote text-[14px]">
                  "{currentCard.question}"
                </p>
              </div>
            </div>

            {/* Card Footer Helper */}
            <div className="border-t border-[var(--rule)] pt-3 flex justify-between items-center t-label text-[var(--graphite)]">
              <span>← Swipe Left: New</span>
              <span>Swipe Right: Mastered →</span>
            </div>
          </div>
        )}
      </div>

      {/* Tactile Action Buttons */}
      <div className="flex items-center justify-center gap-3 pt-1">
        <button
          type="button"
          onClick={() => handleSwipeAction('new', 'left')}
          className="flex-1 py-2.5 px-3 rounded-[var(--r-control)] border border-[var(--rule)] bg-[var(--insert)] text-[var(--graphite)] hover:text-[var(--ink)] t-ui font-semibold cursor-pointer"
        >
          New to me
        </button>

        <button
          type="button"
          onClick={() => handleSwipeAction('familiar', 'up')}
          className="flex-1 py-2.5 px-3 rounded-[var(--r-control)] border border-[var(--rule)] bg-[var(--insert)] text-[var(--graphite)] hover:text-[var(--ink)] t-ui font-semibold cursor-pointer"
        >
          Familiar
        </button>

        <button
          type="button"
          onClick={() => handleSwipeAction('known', 'right')}
          className="flex-1 py-2.5 px-3 rounded-[var(--r-control)] bg-[var(--ink)] text-[var(--insert)] t-ui font-semibold cursor-pointer"
        >
          I know this
        </button>
      </div>

      {/* Helper Tip */}
      <div className="text-center t-label text-[var(--graphite)]">
        Drag card left/right or tap buttons to rate familiarity
      </div>
    </div>
  );
}
