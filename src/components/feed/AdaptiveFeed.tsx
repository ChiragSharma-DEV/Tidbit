'use client';

import { useState, useEffect, useRef } from 'react';
import { useStaminaTimer } from '@/hooks/useStaminaTimer';
import { getStaminaGate } from '@/lib/stamina/thresholdEngine';
import { StaminaGate } from '@/types';
import StaminaCard from './StaminaCard';
import MilestoneCard from './MilestoneCard';
import DemoHUD from './DemoHUD';
import { Spinner, Button } from '@/components/ui';
import { ArrowLeft, RefreshCw, AlertTriangle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useActiveRecallTrigger } from '@/hooks/useActiveRecallTrigger';
import ActiveRecallModal from './ActiveRecallModal';
import RefresherCard from './RefresherCard';

interface AdaptiveFeedProps {
  courseId: string;
  courseTitle: string;
  mode?: 'course' | 'niche';
}

export default function AdaptiveFeed({ courseId, courseTitle, mode = 'course' }: AdaptiveFeedProps) {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true); // Default to true for judge demo
  const [gateOverride, setGateOverride] = useState<StaminaGate | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [recordedCardIds, setRecordedCardIds] = useState<Set<string>>(new Set());
  const [milestoneCelebration, setMilestoneCelebration] = useState<any | null>(null);

  // courseId is empty for niche feed, use dummy or active niche ID for timer storage keys
  const timerKeyId = mode === 'niche' ? 'interleaved-niche-curriculum' : courseId;
  const {
    activeSeconds,
    setActiveSeconds,
    isPaused,
    setIsPaused,
  } = useStaminaTimer(timerKeyId);

  // Determine current active gate (override takes precedence)
  const currentGate = gateOverride || getStaminaGate(activeSeconds, isDemoMode);

  const [cards, setCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Active Recall Quiz States & Hooks
  const {
    isScrollLocked,
    setIsScrollLocked,
    activeQuizPayload,
    triggerQuiz,
    resetTrigger,
  } = useActiveRecallTrigger();

  const [quizTriggerTimer, setQuizTriggerTimer] = useState<NodeJS.Timeout | null>(null);

  // Pause stamina timer when quiz modal is active / scroll is locked
  useEffect(() => {
    if (isScrollLocked) {
      setIsPaused(true);
    } else {
      setIsPaused(false);
    }
  }, [isScrollLocked, setIsPaused]);

  // Auto-trigger active recall check after 4 seconds of viewing a card with a quiz
  useEffect(() => {
    if (quizTriggerTimer) {
      clearTimeout(quizTriggerTimer);
    }

    const currentCard = cards[activeCardIndex];
    if (
      currentCard &&
      currentCard.activeRecallQuiz &&
      !isScrollLocked &&
      currentCard.type !== 'refresher' &&
      currentCard.type !== 'milestone'
    ) {
      const timer = setTimeout(() => {
        triggerQuiz(currentCard.activeRecallQuiz);
      }, 4000);
      setQuizTriggerTimer(timer);
    }

    return () => {
      if (quizTriggerTimer) clearTimeout(quizTriggerTimer);
    };
  }, [activeCardIndex, cards, isScrollLocked]);

  const handleQuizSubmit = async (optionId: string) => {
    const currentCard = cards[activeCardIndex];
    if (!currentCard) return { isCorrect: false };

    try {
      const res = await fetch('/api/curriculum/active-recall/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: currentCard.courseId || courseId,
          cardId: currentCard._id,
          selectedOptionId: optionId,
        }),
      });
      const data = await res.json();

      if (data.success) {
        if (!data.data.isCorrect) {
          // Failure path: Inject refresher card at index = currentIndex + 1
          const refresher = {
            _id: `refresher_${Date.now()}`,
            type: 'refresher' as const,
            conceptKey: currentCard.conceptKey,
            content: data.data.refresherCard || currentCard.activeRecallQuiz.refresherCard,
          };

          setCards((prevCards) => {
            const nextCards = [...prevCards];
            nextCards.splice(activeCardIndex + 1, 0, refresher);
            return nextCards;
          });
        }
        return { isCorrect: data.data.isCorrect };
      }
    } catch (err) {
      console.error('Failed to submit active recall quiz response:', err);
    }
    return { isCorrect: false };
  };

  const handleQuizClose = (isCorrectAnswer: boolean) => {
    resetTrigger();
  };

  // Sync state for demo mode to session storage to persist across soft navigations
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = sessionStorage.getItem(`Tidbit_stamina_demo_mode_${timerKeyId}`);
      if (savedMode !== null) {
        setIsDemoMode(savedMode === 'true');
      }
    }
  }, [timerKeyId]);

  const handleSetDemoMode = (val: boolean) => {
    setIsDemoMode(val);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`Tidbit_stamina_demo_mode_${timerKeyId}`, val.toString());
    }
    // Reset override on mode switch
    setGateOverride(null);
  };

  // Fetch cards on gate change or refresh
  useEffect(() => {
    let active = true;

    async function fetchCards() {
      try {
        setIsLoading(true);
        setError(null);

        const fetchUrl =
          mode === 'niche'
            ? `/api/curriculum/interleaved-feed?gate=${currentGate}`
            : `/api/feed/adaptive?courseId=${courseId}&gate=${currentGate}`;

        const response = await fetch(fetchUrl);
        const result = await response.json();

        if (active) {
          if (result.success) {
            setCards(result.data || []);
          } else {
            setError(result.error || 'Failed to load feed cards');
          }
        }
      } catch (err) {
        console.error('Fetch error:', err);
        if (active) {
          setError('Failed to fetch cards. Please try again.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    fetchCards();

    return () => {
      active = false;
    };
  }, [courseId, currentGate, mode, refreshTrigger]);

  // Sync gate overrides to corresponding timer thresholds
  const handleOverrideGate = (gate: StaminaGate) => {
    setGateOverride(gate);
    if (gate === 'short') {
      setActiveSeconds(0);
    } else if (gate === 'medium') {
      setActiveSeconds(isDemoMode ? 30 : 300);
    } else if (gate === 'long') {
      setActiveSeconds(isDemoMode ? 90 : 900);
    }
  };

  const handleResetTimer = () => {
    setGateOverride(null);
    setActiveSeconds(0);
  };

  // Setup Intersection Observer to monitor active card index
  useEffect(() => {
    const container = containerRef.current;
    if (!container || cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
            setActiveCardIndex(index);
          }
        });
      },
      {
        root: container,
        threshold: 0.6, // Fire when 60% of card is visible
      }
    );

    const childElements = container.querySelectorAll('[data-card-wrapper]');
    childElements.forEach((el) => observer.observe(el));

    return () => {
      childElements.forEach((el) => observer.unobserve(el));
    };
  }, [cards]);

  // Send card completion progress to backend in Niche mode
  useEffect(() => {
    if (mode === 'niche' && cards.length > 0 && activeCardIndex < cards.length) {
      const card = cards[activeCardIndex];
      if (card && card._id && !recordedCardIds.has(card._id)) {
        setRecordedCardIds((prev) => {
          const next = new Set(prev);
          next.add(card._id);
          return next;
        });

        // Post completion view
        fetch('/api/curriculum/interleaved-feed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nicheId: card.nicheId, cardId: card._id }),
        })
          .then((res) => res.json())
          .then((json) => {
            if (json.success && json.data?.milestone) {
              // Trigger celebratory milestone modal
              setMilestoneCelebration(json.data.milestone);
            }
          })
          .catch((err) => console.error('Failed to log niche card completion:', err));
      }
    }
  }, [activeCardIndex, cards, mode, recordedCardIds]);

  const handleCloseMilestone = () => {
    setMilestoneCelebration(null);
    // Reset indicators and reload new node cards
    setActiveCardIndex(0);
    setRecordedCardIds(new Set());
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] w-full max-w-5xl mx-auto px-4 relative">
      {/* Header Panel */}
      <div className="flex items-center justify-between py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Link href={mode === 'niche' ? '/student/roadmap' : '/student'}>
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
          </Link>
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              {mode === 'niche' && <Sparkles className="w-5 h-5 text-primary" />}
              {courseTitle}
            </h2>
            <p className="text-xs text-muted">
              {mode === 'niche'
                ? 'Curriculum Graph: Depth progression & topic interleaving'
                : 'Stamina Feed: Adapts card length to your focus time'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full uppercase">
            Active Gate: {currentGate}
          </span>
        </div>
      </div>

      {/* Main Feed Container */}
      <div className="flex-1 relative overflow-hidden">
        {isLoading && cards.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
            <Spinner size="lg" />
            <p className="text-sm text-muted">
              {mode === 'niche'
                ? 'Interleaving selected niches and fetching active nodes...'
                : 'Analyzing course concepts & generating tri-variant feed...'}
            </p>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 max-w-md mx-auto text-center">
            <AlertTriangle className="w-12 h-12 text-error" />
            <h3 className="text-lg font-bold text-foreground">Generation / Loading Error</h3>
            <p className="text-sm text-muted">{error}</p>
            <Button leftIcon={<RefreshCw className="w-4 h-4" />} onClick={() => setRefreshTrigger((prev) => prev + 1)}>
              Try Again
            </Button>
          </div>
        ) : cards.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 text-center max-w-md mx-auto">
            <p className="text-muted">
              {mode === 'niche'
                ? 'No active curriculum cards. Please verify you have selected active niches in your Roadmap.'
                : 'No content found in this course to generate feed cards.'}
            </p>
            {mode === 'niche' && (
              <Link href="/student/roadmap">
                <Button>Go to Roadmap</Button>
              </Link>
            )}
          </div>
        ) : (
          <div
            ref={containerRef}
            className={`w-full h-full snap-y snap-mandatory scroll-smooth pb-32 ${isScrollLocked ? 'overflow-hidden' : 'overflow-y-scroll'
              }`}
            style={{ scrollbarWidth: 'none' }} // Hide scrollbar for clean snap scrolling
          >
            {cards.map((card, index) => (
              <div
                key={card._id}
                data-index={index}
                data-card-wrapper
                className="w-full min-h-[calc(100vh-200px)] flex items-center justify-center snap-start py-8"
              >
                {card.type === 'refresher' ? (
                  <RefresherCard card={card} isActive={index === activeCardIndex} />
                ) : (
                  <StaminaCard card={card} isActive={index === activeCardIndex} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Embedded Demo HUD */}
      <DemoHUD
        activeSeconds={activeSeconds}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        isDemoMode={isDemoMode}
        setIsDemoMode={handleSetDemoMode}
        onOverrideGate={handleOverrideGate}
        currentGate={currentGate}
        onReset={handleResetTimer}
      />

      {/* Celebratory Milestone Overlay Modal */}
      {milestoneCelebration && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl relative animate-in fade-in zoom-in duration-300">
            <MilestoneCard milestone={milestoneCelebration} />
            <div className="flex justify-center mt-6">
              <Button
                size="lg"
                onClick={handleCloseMilestone}
                className="px-8 bg-warning hover:bg-warning/95 text-black font-extrabold shadow-lg"
              >
                Unlock Next Node & Continue
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Active Recall Speed Breaker Pop-up Modal */}
      {activeQuizPayload && (
        <ActiveRecallModal
          quiz={activeQuizPayload}
          onSubmit={handleQuizSubmit}
          onClose={handleQuizClose}
        />
      )}
    </div>
  );
}
