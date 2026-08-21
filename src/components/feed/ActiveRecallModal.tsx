'use client';

import { useState, useEffect } from 'react';
import { Sparkles, BrainCircuit, XCircle, CheckCircle, HelpCircle } from 'lucide-react';
import { ActiveRecallQuiz } from '@/types';

interface ActiveRecallModalProps {
  quiz: ActiveRecallQuiz;
  onSubmit: (optionId: string) => Promise<{ isCorrect: boolean }>;
  onClose: (isCorrect: boolean) => void;
}

export default function ActiveRecallModal({ quiz, onSubmit, onClose }: ActiveRecallModalProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [confettiParticles, setConfettiParticles] = useState<Array<{ id: number; left: string; color: string; size: string; delay: string; duration: string }>>([]);

  const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  const triggerConfetti = () => {
    const particles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: `${Math.random() * 8 + 6}px`,
      delay: `${Math.random() * 0.5}s`,
      duration: `${Math.random() * 1.5 + 1.5}s`,
    }));
    setConfettiParticles(particles);
  };

  const handleSelectOption = async (optionId: string) => {
    if (selectedOptionId || isSubmitting) return;

    setSelectedOptionId(optionId);
    setIsSubmitting(true);

    try {
      const res = await onSubmit(optionId);
      setIsCorrect(res.isCorrect);

      if (res.isCorrect) {
        triggerConfetti();
      }

      // Auto-dismiss after 1.5 seconds
      setTimeout(() => {
        onClose(res.isCorrect);
      }, 1500);
    } catch (err) {
      console.error('Failed to submit active recall answer:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity">
      {/* Dynamic Confetti CSS Style Inject */}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-50px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(105vh) rotate(720deg);
            opacity: 0;
          }
        }
        .confetti-particle {
          position: absolute;
          top: -20px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 99;
          animation: fall linear forwards;
        }
      `}</style>

      {/* Confetti Render */}
      {confettiParticles.map((p) => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            left: p.left,
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}

      <div className="bg-background border border-primary/20 rounded-2xl w-full max-w-xl shadow-2xl relative overflow-hidden transition-all transform scale-100 max-h-[90vh] flex flex-col">
        {/* Animated Banner based on score */}
        <div className={`p-6 border-b border-border flex items-center gap-3 ${
          isCorrect === true
            ? 'bg-success/15 text-success'
            : isCorrect === false
            ? 'bg-error/15 text-error'
            : 'bg-primary/10 text-primary'
        }`}>
          {isCorrect === true ? (
            <Sparkles className="w-8 h-8 animate-bounce" />
          ) : isCorrect === false ? (
            <BrainCircuit className="w-8 h-8 text-error animate-pulse" />
          ) : (
            <BrainCircuit className="w-8 h-8 text-primary animate-pulse" />
          )}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider block">
              The Speed Breaker
            </span>
            <h3 className="text-lg font-bold">
              {isCorrect === true
                ? 'Excellent Memory!'
                : isCorrect === false
                ? 'Not Quite! Injecting Refresher Card...'
                : 'Active Recall Check! Unlock Next Topic'}
            </h3>
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Question Text */}
          <div className="space-y-2">
            <span className="text-xs text-muted font-bold uppercase flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-primary" />
              Quick Quiz
            </span>
            <p className="text-lg font-semibold text-foreground leading-relaxed">
              {quiz.question}
            </p>
          </div>

          {/* Option list */}
          <div className="grid grid-cols-1 gap-3">
            {quiz.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const hasAnswered = selectedOptionId !== null;
              
              let buttonStyle = 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/5';

              if (hasAnswered) {
                if (option.isCorrect) {
                  buttonStyle = 'border-success bg-success/15 text-success font-semibold';
                } else if (isSelected && !option.isCorrect) {
                  buttonStyle = 'border-error bg-error/15 text-error font-semibold';
                } else {
                  buttonStyle = 'border-border opacity-50 bg-card text-muted pointer-events-none';
                }
              }

              return (
                <button
                  key={option.id}
                  disabled={hasAnswered}
                  onClick={() => handleSelectOption(option.id)}
                  className={`w-full p-4 rounded-xl border text-left text-base transition-all flex items-center justify-between gap-3 ${buttonStyle}`}
                >
                  <span>{option.text}</span>
                  {hasAnswered && option.isCorrect && (
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  )}
                  {hasAnswered && isSelected && !option.isCorrect && (
                    <XCircle className="w-5 h-5 text-error flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
