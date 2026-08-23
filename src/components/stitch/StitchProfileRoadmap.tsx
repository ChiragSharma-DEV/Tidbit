'use client';

import React, { useState } from 'react';
import { useAttentionTrainer, SkillTreeNode, ArticleWithQuiz } from '@/contexts/AttentionTrainerContext';

interface StitchProfileRoadmapProps {
  onOpenReader?: (article: ArticleWithQuiz) => void;
  onOpenQuickCheck?: (article: ArticleWithQuiz) => void;
}

export default function StitchProfileRoadmap({
  onOpenReader,
  onOpenQuickCheck,
}: StitchProfileRoadmapProps) {
  const {
    currentUser,
    calibratedLevel,
    staminaLevel,
    xp,
    streakDays,
    streakWeek,
    sessionStaminaHistory,
    averageReadingTimeMinutes,
    nicheSkillTrees,
    activeSkillTreeNiche,
    setActiveSkillTreeNiche,
    selectedInterests,
    masteredContexts,
    longestUnbrokenRead,
    totalWordsReadToday,
    dailyGoalWords,
    setOnboardingOpen,
    setAuthGatewayOpen,
    openReader,
    openQuickCheck,
    openMilestoneModal,
    completeSkillTreeNode,
  } = useAttentionTrainer();

  const [activeView, setActiveView] = useState<'roadmap' | 'stats'>('roadmap');

  // Active tree nodes
  const availableNiches = Object.keys(nicheSkillTrees);
  const currentNicheKey =
    nicheSkillTrees[activeSkillTreeNiche] ? activeSkillTreeNiche : availableNiches[0] || 'AI & Machine Learning';
  const nodes = nicheSkillTrees[currentNicheKey] || [];

  const completedNodesCount = nodes.filter((n) => n.status === 'completed').length;
  const totalNodesCount = nodes.length;
  const nicheProgressPercent = Math.round((completedNodesCount / (totalNodesCount || 1)) * 100);

  const handleLaunchNode = (node: SkillTreeNode) => {
    if (node.status === 'locked') return;

    const nodeArticle: ArticleWithQuiz = {
      id: `skill-node-${node.id}`,
      type: 'medium',
      topic: currentNicheKey,
      difficultyLevel: node.difficulty,
      title: `${node.numberStr}. ${node.title}`,
      excerpt: node.description,
      analogy: node.analogy,
      paragraphs: [
        `${node.title} — ${node.description}`,
        `In cognitive skill acquisition, mastering "${node.shortTitle}" requires training your attention across progressively dense technical concepts.`,
        `By sustaining uninterrupted observation for ${node.wordCount} words, your neural pathways adapt to high-signal information intake without digital fatigue.`,
        `Core Principle: ${node.analogy}`,
      ],
      wordCount: node.wordCount,
      progressPercent: node.status === 'completed' ? 100 : 20,
      saved: false,
      keyTakeaway: `Mastering ${node.shortTitle}: ${node.description}`,
      quiz: node.quiz,
    };

    if (onOpenReader) {
      onOpenReader(nodeArticle);
    } else {
      openReader(nodeArticle);
    }
  };

  const handleShareNodeCertificate = (e: React.MouseEvent, node: SkillTreeNode) => {
    e.stopPropagation();
    openMilestoneModal({
      topicTitle: node.title,
      category: currentNicheKey,
      earnedXp: node.xpAward,
      wordsMastered: node.wordCount,
      accuracyPercent: 96,
      badgeIcon: node.icon,
    });
  };

  // Milestone Achievements
  const achievements = [
    {
      id: 'ach-1',
      title: 'First Spark',
      desc: 'Completed first calibrated reading session',
      icon: 'local_fire_department',
      unlocked: true,
      tier: 'Bronze',
    },
    {
      id: 'ach-2',
      title: '7-Day Streak Sovereign',
      desc: 'Maintained 7 consecutive days of daily focus',
      icon: 'whatshot',
      unlocked: streakDays >= 7,
      tier: 'Gold',
    },
    {
      id: 'ach-3',
      title: '500W Deep Scholar',
      desc: 'Surpassed 500+ unbroken words in a single read',
      icon: 'psychology',
      unlocked: longestUnbrokenRead >= 500,
      tier: 'Platinum',
    },
    {
      id: 'ach-4',
      title: 'Cross-Domain Polymath',
      desc: 'Mastered concepts across 3 different niches',
      icon: 'hub',
      unlocked: masteredContexts.length >= 3,
      tier: 'Silver',
    },
  ];

  return (
    <main className="max-w-3xl mx-auto px-4 md:px-margin-page py-8 flex flex-col gap-8 pb-32">
      {/* ================= 1. USER PROFILE HERO CARD ================= */}
      <section className="bg-surface-container-lowest border border-hairline rounded-xl p-6 md:p-8 shadow-sm flex flex-col gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-ink-blue via-indigo-500 to-emerald-500" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Avatar & User Details */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-ink-blue text-white flex items-center justify-center font-bold text-xl shadow-sm border-2 border-paper">
              {currentUser?.name ? currentUser.name[0].toUpperCase() : 'E'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-headline-md text-[22px] md:text-[26px] font-serif text-on-surface leading-tight">
                  {currentUser?.name || 'Explorer'}
                </h1>
                <span className="font-label-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-ink-blue/10 text-ink-blue border border-ink-blue/20">
                  Level {calibratedLevel} · {calibratedLevel === 1 ? 'Foundational' : calibratedLevel === 2 ? 'Synthesizer' : 'Deep Scholar'}
                </span>
              </div>
              <p className="font-sans text-[13px] text-graphite mt-0.5">
                {currentUser?.email || 'guest@tidbit.ai'} · {selectedInterests.length} Active Niches
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            <button
              onClick={() => openMilestoneModal()}
              className="px-3.5 py-1.5 rounded-[var(--r-control)] border border-[var(--rule)] bg-[var(--insert)] text-[var(--ink)] hover:border-[var(--ink)] t-ui transition-all cursor-pointer font-semibold"
            >
              <span>Share Milestone</span>
            </button>
            <button
              onClick={() => setOnboardingOpen(true)}
              className="px-3 py-1.5 rounded-[var(--r-control)] border border-[var(--rule)] bg-[var(--insert)] text-[var(--graphite)] hover:text-[var(--ink)] t-ui transition-colors cursor-pointer"
            >
              <span>Calibrate</span>
            </button>
            <button
              onClick={() => setAuthGatewayOpen(true)}
              className="px-3 py-1.5 rounded-[var(--r-control)] border border-[var(--rule)] bg-[var(--insert)] text-[var(--graphite)] hover:text-[var(--ink)] t-ui transition-colors cursor-pointer"
            >
              <span>Account</span>
            </button>
          </div>
        </div>

        {/* XP & Stamina Meters Bento */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[var(--rule)]">
          <div className="bg-[var(--insert)] p-3 rounded-[var(--r-card)] border border-[var(--rule)] flex flex-col">
            <span className="t-label text-[var(--graphite)]">TOTAL XP</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="t-num font-bold text-[var(--ink)] text-[20px]">{xp}</span>
              <span className="t-label text-[var(--graphite)]">XP</span>
            </div>
          </div>

          <div className="bg-[var(--insert)] p-3 rounded-[var(--r-card)] border border-[var(--rule)] flex flex-col">
            <span className="t-label text-[var(--graphite)]">STAMINA LEVEL</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="t-num font-bold text-[var(--ink)] text-[20px]">{staminaLevel}%</span>
              <span className="t-label text-[var(--graphite)]">Tier {calibratedLevel}</span>
            </div>
          </div>

          <div className="bg-[var(--insert)] p-3 rounded-[var(--r-card)] border border-[var(--rule)] flex flex-col">
            <span className="t-label text-[var(--graphite)]">MAX DEPTH</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="t-num font-bold text-[var(--ink)] text-[20px]">{longestUnbrokenRead}</span>
              <span className="t-label text-[var(--graphite)]">Words</span>
            </div>
          </div>

          <div className="bg-[var(--insert)] p-3 rounded-[var(--r-card)] border border-[var(--rule)] flex flex-col">
            <span className="t-label text-[var(--graphite)]">FOCUS STREAK</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="t-num font-bold text-[var(--ink)] text-[20px]">{streakDays}</span>
              <span className="t-label text-[var(--graphite)]">Days</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. VIEW SWITCHER TABS ================= */}
      <div className="flex justify-between items-center border-b border-hairline pb-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView('roadmap')}
            className={`px-4 py-2 rounded-lg font-ui-button text-[14px] flex items-center gap-2 transition-all cursor-pointer ${
              activeView === 'roadmap'
                ? 'bg-ink-blue text-white font-bold shadow-xs'
                : 'bg-surface-container-lowest border border-hairline text-graphite hover:text-ink-blue'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">route</span>
            <span>Skill Tree Roadmap</span>
          </button>
          <button
            onClick={() => setActiveView('stats')}
            className={`px-4 py-2 rounded-lg font-ui-button text-[14px] flex items-center gap-2 transition-all cursor-pointer ${
              activeView === 'stats'
                ? 'bg-ink-blue text-white font-bold shadow-xs'
                : 'bg-surface-container-lowest border border-hairline text-graphite hover:text-ink-blue'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">insights</span>
            <span>Session Stamina & Streak</span>
          </button>
        </div>

        <span className="font-label-mono text-[11px] text-graphite uppercase hidden sm:inline">
          {activeView === 'roadmap' ? `${nicheProgressPercent}% Track Mastered` : 'Live Cognitive Metrics'}
        </span>
      </div>

      {/* ================= 3. DUOLINGO-STYLE SKILL TREE ROADMAP ================= */}
      {activeView === 'roadmap' && (
        <section className="flex flex-col gap-6 animate-slide-in">
          {/* Niche Switcher Bar */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="font-label-mono text-[11px] text-graphite uppercase font-bold tracking-wider">
                SELECT NICHE CURRICULUM ({availableNiches.length} AVAILABLE)
              </span>
              <span className="font-label-mono text-[11px] text-ink-blue font-bold">
                {completedNodesCount} OF {totalNodesCount} NODES MASTERED
              </span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {availableNiches.map((niche) => {
                const isSelected = niche === currentNicheKey;
                const nicheNodes = nicheSkillTrees[niche] || [];
                const doneCount = nicheNodes.filter((n) => n.status === 'completed').length;

                return (
                  <button
                    key={niche}
                    onClick={() => setActiveSkillTreeNiche(niche)}
                    className={`px-3.5 py-2 rounded-lg font-ui-button text-[13px] whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-surface-container-lowest border-2 border-ink-blue text-ink-blue font-bold shadow-xs'
                        : 'bg-surface-container-lowest border border-hairline text-graphite hover:border-outline-variant'
                    }`}
                  >
                    <span>{niche}</span>
                    <span className="font-label-mono text-[10px] px-1.5 py-0.5 rounded bg-paper text-graphite font-semibold">
                      {doneCount}/{nicheNodes.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DUOLINGO VERTICAL TREE CONTAINER */}
          <div className="bg-surface-container-lowest border border-hairline rounded-xl p-6 md:p-10 shadow-xs relative overflow-hidden flex flex-col items-center">
            {/* Header of the Active Niche */}
            <div className="w-full text-center pb-8 border-b border-hairline mb-8">
              <span className="font-label-mono text-[11px] text-ink-blue uppercase tracking-widest font-bold block mb-1">
                {currentNicheKey.toUpperCase()} ROADMAP
              </span>
              <h2 className="font-headline-md text-[26px] md:text-[30px] font-serif text-on-surface">
                Progressive Mastery Tree
              </h2>
              <p className="font-article-body-mobile text-[15px] text-graphite mt-1 max-w-md mx-auto">
                Green nodes are unlocked & mastered. Glowing nodes are active. Grey nodes unlock upon completion.
              </p>

              {/* Progress Bar */}
              <div className="max-w-xs mx-auto mt-4">
                <div className="w-full bg-paper border border-hairline h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-ink-blue h-full transition-all duration-700 ease-out"
                    style={{ width: `${nicheProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* DUOLINGO NODES VERTICAL STACK WITH ZIG-ZAG ALIGNMENT */}
            <div className="relative w-full max-w-lg py-4 flex flex-col items-center gap-10">
              <div className="absolute top-8 bottom-12 left-1/2 -translate-x-1/2 w-[3px] bg-paper-border dark:bg-[#282933] z-0" />

              {nodes.map((node, index) => {
                const isCompleted = node.status === 'completed';
                const isCurrent = node.status === 'current';
                const isLocked = node.status === 'locked';

                const offsetPattern = [0, 40, -40, 30, -30];
                const xOffset = offsetPattern[index % offsetPattern.length];

                return (
                  <div
                    key={node.id}
                    style={{ transform: `translateX(${xOffset}px)` }}
                    className="relative z-10 flex flex-col items-center transition-transform duration-300 group"
                  >
                    {/* Floating XP / Action Pill */}
                    <div className="mb-2">
                      {isCompleted ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-label-mono text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800 shadow-xs flex items-center gap-1">
                            <span>✓ MASTERED</span>
                            <span>+{node.xpAward} XP</span>
                          </span>
                          <button
                            onClick={(e) => handleShareNodeCertificate(e, node)}
                            className="t-label text-[var(--graphite)] hover:text-[var(--ink)] cursor-pointer"
                            title="Share Certificate"
                          >
                            Certificate
                          </button>
                        </div>
                      ) : isCurrent ? (
                        <span className="font-label-mono text-[10px] uppercase font-bold text-ink-blue bg-ink-blue/10 px-2.5 py-0.5 rounded-full border border-ink-blue/30 shadow-xs animate-pulse flex items-center gap-1">
                          <span>▶ CURRENT FOCUS</span>
                          <span>+{node.xpAward} XP</span>
                        </span>
                      ) : (
                        <span className="font-label-mono text-[10px] uppercase text-graphite bg-paper px-2 py-0.5 rounded-full border border-hairline">
                          LOCKED · {node.wordCount}W
                        </span>
                      )}
                    </div>

                    {/* Interactive Duolingo Circular Node */}
                    <button
                      type="button"
                      disabled={isLocked}
                      onClick={() => handleLaunchNode(node)}
                      className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 relative select-none shadow-md ${
                        isCompleted
                          ? 'bg-emerald-500 text-white border-4 border-emerald-400 hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-emerald-500/20'
                          : isCurrent
                          ? 'bg-ink-blue text-white border-4 border-white dark:border-paper hover:scale-110 active:scale-95 cursor-pointer ring-8 ring-ink-blue/25 animate-bounce-subtle'
                          : 'bg-paper text-graphite border-4 border-paper-border dark:border-[#282933] cursor-not-allowed opacity-60'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[28px] md:text-[32px]">
                        {isCompleted ? 'check_circle' : isLocked ? 'lock' : node.icon}
                      </span>
                      <span className="font-label-mono text-[10px] md:text-[11px] font-bold tracking-wider mt-0.5">
                        {isCompleted ? 'DONE' : isCurrent ? 'START' : `0${node.id}`}
                      </span>
                    </button>

                    {/* Node Info Card Box Below */}
                    <div
                      onClick={() => !isLocked && handleLaunchNode(node)}
                      className={`mt-3 w-64 md:w-72 bg-paper border rounded-lg p-3.5 text-center transition-all shadow-xs ${
                        isCurrent
                          ? 'border-2 border-ink-blue shadow-md cursor-pointer hover:border-ink-blue'
                          : isCompleted
                          ? 'border-hairline hover:border-emerald-500 cursor-pointer'
                          : 'border-hairline opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] font-label-mono text-graphite mb-1">
                        <span className="uppercase font-bold text-ink-blue">{node.difficulty}</span>
                        <span>{node.readTimeMins} MIN READ · {node.wordCount} WORDS</span>
                      </div>
                      <h3 className="font-headline-md text-[16px] md:text-[17px] font-serif text-on-surface leading-snug">
                        {node.title}
                      </h3>
                      <p className="font-sans text-[12px] text-graphite mt-1 line-clamp-2 leading-relaxed">
                        {node.description}
                      </p>

                      {/* Action Links */}
                      {!isLocked && (
                        <div className="mt-2.5 pt-2 border-t border-hairline/80 flex items-center justify-center gap-3 font-ui-button text-[12px]">
                          <span className="text-ink-blue font-bold hover:underline">
                            {isCompleted ? 'Review Concept →' : 'Start Reading Lesson →'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* End of Path Trophy Node */}
              <div className="mt-4 flex flex-col items-center text-center">
                <div
                  onClick={() =>
                    openMilestoneModal({
                      topicTitle: `${currentNicheKey} Track Mastery`,
                      category: currentNicheKey,
                      earnedXp: 500,
                      wordsMastered: 1500,
                      badgeIcon: 'military_tech',
                    })
                  }
                  className={`w-16 h-16 rounded-full flex items-center justify-center border-4 cursor-pointer transition-transform hover:scale-105 ${
                    completedNodesCount === totalNodesCount
                      ? 'bg-amber-400 text-slate-900 border-amber-300 ring-8 ring-amber-400/20'
                      : 'bg-paper text-graphite border-paper-border dark:border-[#282933] opacity-60'
                  }`}
                >
                  <span className="material-symbols-outlined text-[30px]">military_tech</span>
                </div>
                <h4 className="t-title font-display mt-2">
                  {completedNodesCount === totalNodesCount
                    ? `${currentNicheKey} Mastered!`
                    : `Complete All 5 Nodes to Master Track`}
                </h4>
                <p className="t-body text-[13px] text-[var(--graphite)] max-w-xs mt-0.5">
                  Unlocks +500 Bonus XP and verified certificate badge.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* COMPREHENSIVE STATS & SESSION STAMINA */}
      {activeView === 'stats' && (
        <section className="flex flex-col gap-8 animate-slide-in">
          {/* A. 7-DAY STREAK CALENDAR & CONSISTENCY */}
          <div className="bg-[var(--insert)] border border-[var(--rule)] rounded-[var(--r-card)] p-6 md:p-8 shadow-[0_1px_2px_rgba(26,24,20,0.04)] flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="t-title font-display leading-tight">
                    {streakDays}-Day Focus Streak
                  </h2>
                  <p className="font-sans text-[13.5px] text-graphite">
                    You're in the <strong className="text-ink-blue">top 5%</strong> of disciplined readers this month.
                  </p>
                </div>
              </div>

              <span className="font-label-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                ✓ DAILY GOAL MET
              </span>
            </div>

            {/* Weekly Day Circles */}
            <div className="grid grid-cols-7 gap-2 sm:gap-4 pt-2">
              {streakWeek.map((day) => (
                <div
                  key={day.day}
                  className={`p-3 rounded-lg border flex flex-col items-center gap-1.5 transition-all ${
                    day.completed
                      ? 'bg-paper border-ink-blue/40 shadow-xs'
                      : 'bg-surface-container-lowest border-hairline opacity-60'
                  }`}
                >
                  <span className="font-label-mono text-[11px] text-graphite uppercase font-bold">
                    {day.day}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                      day.completed
                        ? 'bg-ink-blue text-white shadow-xs'
                        : 'bg-paper border border-hairline text-graphite'
                    }`}
                  >
                    {day.completed ? '✓' : '—'}
                  </div>
                  <span className="font-label-mono text-[10px] text-graphite text-center truncate max-w-full">
                    {day.wordsRead > 0 ? `${day.wordsRead}W` : '0W'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* B. SESSION STAMINA GROWTH CHART */}
          <div className="bg-surface-container-lowest border border-hairline rounded-xl p-6 md:p-8 shadow-xs flex flex-col gap-6">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-label-mono text-[11px] text-ink-blue uppercase tracking-widest font-bold">
                  ATTENTION STAMINA EXPANSION
                </span>
                <span className="font-label-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                  +{averageReadingTimeMinutes.growthPercent}% GROWTH
                </span>
              </div>
              <h2 className="font-headline-md text-[24px] md:text-[28px] font-serif text-on-surface leading-tight">
                Average Session Stamina grew from{' '}
                <span className="text-graphite line-through decoration-ink-blue">{averageReadingTimeMinutes.initial} mins</span> to{' '}
                <span className="text-ink-blue underline font-bold">{averageReadingTimeMinutes.current} mins</span>.
              </h2>
              <p className="font-article-body-mobile text-[15px] text-graphite mt-1">
                Your sustained cognitive stamina now handles dense multi-paragraph abstract essays without context switching.
              </p>
            </div>

            {/* Visual Stamina Growth Comparison Bars */}
            <div className="flex flex-col gap-4 pt-4 border-t border-hairline">
              <div className="space-y-3">
                {sessionStaminaHistory.map((item, idx) => {
                  const maxMins = 15;
                  const barWidth = Math.min(100, Math.round((item.avgMinutes / maxMins) * 100));
                  const isLatest = idx === sessionStaminaHistory.length - 1;

                  return (
                    <div key={item.sessionPeriod} className="space-y-1">
                      <div className="flex justify-between items-center text-[12px] font-ui-button">
                        <span className={`font-medium ${isLatest ? 'text-ink-blue font-bold' : 'text-on-surface'}`}>
                          {item.sessionPeriod} · {item.sessionCountLabel}
                        </span>
                        <span className="font-label-mono text-[11px] text-graphite font-bold">
                          {item.avgMinutes} Mins · {item.avgWords} Words
                        </span>
                      </div>

                      <div className="w-full h-4 bg-paper rounded-full overflow-hidden border border-hairline p-0.5 relative">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            isLatest
                              ? 'bg-gradient-to-r from-ink-blue to-indigo-500 shadow-sm'
                              : 'bg-paper-border dark:bg-[#323340]'
                          }`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chart Legend */}
              <div className="flex justify-between items-center text-[10px] font-label-mono text-graphite pt-2">
                <span>STARTING: 2.0 MINS (140W)</span>
                <span>CURRENT COGNITIVE DEPTH: 12.4 MINS (840W)</span>
              </div>
            </div>
          </div>

          {/* C. MILESTONE ACHIEVEMENTS BADGES */}
          <div className="flex flex-col gap-4">
            <h3 className="font-label-mono text-[11px] text-graphite uppercase font-bold tracking-wider">
              EARNED ATTENTION MEDALS & MILESTONES ({achievements.filter((a) => a.unlocked).length}/{achievements.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  onClick={() =>
                    openMilestoneModal({
                      topicTitle: `${ach.title} Milestone`,
                      category: 'Attention Achievement',
                      badgeIcon: ach.icon,
                    })
                  }
                  className={`p-4 rounded-xl border flex items-start justify-between gap-3.5 transition-all cursor-pointer group ${
                    ach.unlocked
                      ? 'bg-surface-container-lowest border-hairline hover:border-ink-blue shadow-xs'
                      : 'bg-surface-container-lowest/50 border-hairline opacity-50'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        ach.unlocked
                          ? 'bg-ink-blue/10 text-ink-blue border border-ink-blue/20'
                          : 'bg-paper text-graphite border border-hairline'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[24px]">
                        {ach.unlocked ? ach.icon : 'lock'}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-headline-md text-[16px] font-serif text-on-surface group-hover:text-ink-blue transition-colors">
                          {ach.title}
                        </h4>
                        <span className="font-label-mono text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-paper text-graphite border border-hairline">
                          {ach.tier}
                        </span>
                      </div>
                      <p className="font-sans text-[12px] text-graphite mt-0.5">
                        {ach.desc}
                      </p>
                    </div>
                  </div>

                  {ach.unlocked && (
                    <span className="text-ink-blue font-label-mono text-[11px] uppercase font-bold hover:underline shrink-0 pt-1">
                      Share ↗
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
