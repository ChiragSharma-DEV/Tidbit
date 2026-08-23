'use client';

import React from 'react';
import { useAttentionTrainer } from '@/contexts/AttentionTrainerContext';

export interface PathNode {
  id: number;
  numberStr: string;
  title: string;
  highlightWord?: string;
  description: string;
  wordCount: number;
  status: 'completed' | 'current' | 'locked';
}

interface StitchLearningPathProps {
  onSelectNode: (node: PathNode) => void;
}

export default function StitchLearningPath({ onSelectNode }: StitchLearningPathProps) {
  const { pathNodes } = useAttentionTrainer();

  const completedCount = pathNodes.filter((n) => n.status === 'completed').length;
  const totalCount = pathNodes.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  const currentActiveNode = pathNodes.find((n) => n.status === 'current');

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-margin-page pt-8 md:pt-stack-lg relative pb-28">
      {/* Header Section */}
      <div className="mb-8 ml-8 pl-4">
        <div className="font-label-mono text-label-mono text-graphite uppercase mb-1.5 font-bold">
          YOUR PATH
        </div>
        <h1 className="font-display-lg-mobile text-[28px] md:text-[34px] leading-none mb-2 font-serif text-on-surface">
          AI & Tech
        </h1>
        <p className="font-article-body-mobile text-[16px] text-graphite">
          {completedCount} of {totalCount} sections done.{' '}
          {currentActiveNode ? `Next up, ${currentActiveNode.title.toLowerCase()}.` : 'Path completed!'}
        </p>
      </div>

      {/* Path Timeline */}
      <div className="relative pb-stack-lg">
        {/* The background vertical ruler */}
        <div className="timeline-line" />
        {/* The active progress ink blue ruler */}
        <div
          className="timeline-progress transition-all duration-700 ease-out"
          style={{ height: `${Math.max(10, progressPercent)}%` }}
        />

        <div className="flex flex-col gap-6 relative z-10">
          {pathNodes.map((node) => {
            const isCompleted = node.status === 'completed';
            const isCurrent = node.status === 'current';
            const isLocked = node.status === 'locked';

            return (
              <div
                key={node.id}
                onClick={() => !isLocked && onSelectNode(node)}
                className={`relative flex items-start pl-[56px] transition-all ${
                  isLocked
                    ? 'opacity-55 cursor-not-allowed'
                    : 'cursor-pointer hover:translate-x-0.5'
                }`}
              >
                {/* Node Bullet */}
                <div
                  className={`absolute left-[24px] top-[18px] w-[10px] h-[10px] rounded-node border-2 z-20 transition-all ${
                    isCompleted
                      ? 'bg-ink-blue border-ink-blue'
                      : isCurrent
                      ? 'bg-paper border-ink-blue ring-4 ring-ink-blue/20'
                      : 'bg-paper border-hairline'
                  }`}
                />

                {/* Node Card */}
                <div
                  className={`bg-surface-container-lowest border rounded-card p-5 w-full relative transition-all ${
                    isCurrent
                      ? 'border-hairline border-l-[3px] border-l-ink-blue shadow-sm'
                      : 'border-hairline hover:border-outline-variant'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span
                      className={`font-label-mono text-[11px] uppercase tracking-wider font-semibold ${
                        isCurrent
                          ? 'text-ink-blue'
                          : isCompleted
                          ? 'text-graphite'
                          : 'text-outline-variant'
                      }`}
                    >
                      {isCurrent
                        ? 'READING NOW'
                        : `${node.numberStr} · ${node.wordCount} WORDS`}
                    </span>
                    {isCompleted && (
                      <span className="font-label-mono text-[10px] text-ink-blue font-bold">
                        ✓ DONE
                      </span>
                    )}
                    {isLocked && (
                      <span className="material-symbols-outlined text-[16px] text-graphite opacity-60">
                        lock
                      </span>
                    )}
                  </div>

                  <h2
                    className={`font-headline-md text-[20px] mb-1 font-serif ${
                      isCurrent
                        ? 'text-ink-blue'
                        : isLocked
                        ? 'text-graphite'
                        : 'text-on-surface'
                    }`}
                  >
                    {node.title}
                  </h2>

                  <p
                    className={`font-article-body-mobile text-[14px] leading-snug ${
                      isLocked ? 'text-graphite/70' : 'text-graphite'
                    }`}
                  >
                    {node.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* End of Section Note */}
        <div className="pl-[56px] mt-10">
          <div className="font-label-mono text-[11px] uppercase text-graphite mb-1 font-bold">
            END OF SECTION
          </div>
          <h3 className="font-headline-md text-[22px] text-on-surface font-serif">
            {completedCount === totalCount
              ? 'Congratulations! You mastered this entire attention track.'
              : "Complete this path to unlock advanced attention domains."}
          </h3>
        </div>
      </div>
    </main>
  );
}
