'use client';

import { useState } from 'react';
import { ActiveRecallQuiz } from '@/types';

export function useActiveRecallTrigger(nodeTargetCount = 6) {
  const [cardsReadInCurrentNode, setCardsReadInCurrentNode] = useState<number>(0);
  const [isScrollLocked, setIsScrollLocked] = useState<boolean>(false);
  const [activeQuizPayload, setActiveQuizPayload] = useState<ActiveRecallQuiz | null>(null);

  const incrementCardsRead = (quizToTrigger?: ActiveRecallQuiz) => {
    setCardsReadInCurrentNode((prev) => {
      const nextCount = prev + 1;
      
      // If a card contains an active recall quiz directly, trigger it to lock scroll
      if (quizToTrigger) {
        setIsScrollLocked(true);
        setActiveQuizPayload(quizToTrigger);
      } else if (nextCount >= nodeTargetCount) {
        // Fallback for global counter triggers
        setIsScrollLocked(true);
      }
      return nextCount;
    });
  };

  const triggerQuiz = (quiz: ActiveRecallQuiz) => {
    setIsScrollLocked(true);
    setActiveQuizPayload(quiz);
  };

  const resetTrigger = () => {
    setIsScrollLocked(false);
    setActiveQuizPayload(null);
    setCardsReadInCurrentNode(0);
  };

  return {
    cardsReadInCurrentNode,
    setCardsReadInCurrentNode,
    isScrollLocked,
    setIsScrollLocked,
    activeQuizPayload,
    triggerQuiz,
    resetTrigger,
    incrementCardsRead,
  };
}
