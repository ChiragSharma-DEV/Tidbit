'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import StitchTopAppBar from './StitchTopAppBar';
import StitchBottomNav from './StitchBottomNav';
import StitchFeedCard from './StitchFeedCard';
import StitchArticleReader from './StitchArticleReader';
import StitchQuickCheckOverlay from './StitchQuickCheckOverlay';
import StitchLearningPath, { PathNode } from './StitchLearningPath';
import StitchProfileRoadmap from './StitchProfileRoadmap';
import StitchMilestoneCardModal from './StitchMilestoneCardModal';
import StitchComposeModal from './StitchComposeModal';
import StitchLogo from './StitchLogo';
import StitchLibrary from './StitchLibrary';
import StitchStaminaStats from './StitchStaminaStats';
import StitchDesignSystem from './StitchDesignSystem';
import StitchOnboarding from './StitchOnboarding';
import StitchWelcomeSplash from './StitchWelcomeSplash';
import { useAttentionTrainer, ArticleWithQuiz } from '@/contexts/AttentionTrainerContext';

interface StitchAppProps {
  initialTab?: string;
  forceSplash?: boolean;
}

export default function StitchApp({ initialTab, forceSplash = false }: StitchAppProps) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    currentTab,
    setCurrentTab,
    articles,
    activeArticle,
    staminaLevel,
    calibratedLevel,
    selectedInterests,
    quickCheckOpen,
    quickCheckArticle,
    onboardingOpen,
    authGatewayOpen,
    milestoneModalOpen,
    activeMilestone,
    composeModalOpen,
    openComposeModal,
    closeComposeModal,
    isDarkMode,
    currentUser,
    toastMessage,
    streakDays,
    toggleSaveArticle,
    updateArticleProgress,
    markArticleComplete,
    completeQuickCheck,
    completePathNode,
    completeSkillTreeNode,
    openReader,
    closeReader,
    openQuickCheck,
    closeQuickCheck,
    openMilestoneModal,
    closeMilestoneModal,
    setOnboardingOpen,
    setAuthGatewayOpen,
    toggleDarkMode,
    logoutUser,
  } = useAttentionTrainer();

  const [showSplash, setShowSplash] = useState<boolean>(forceSplash);
  const [activeTopicFilter, setActiveTopicFilter] = useState<string>('all');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  // Sync initialTab if passed
  useEffect(() => {
    if (initialTab && initialTab !== currentTab) {
      setCurrentTab(initialTab);
    }
  }, [initialTab, setCurrentTab]);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    if (tab === 'feed' && pathname !== '/trainer' && pathname !== '/feed') {
      router.push('/trainer');
    } else if (tab === 'path' && pathname !== '/path') {
      router.push('/path');
    } else if (tab === 'library' && pathname !== '/library') {
      router.push('/library');
    } else if (tab === 'stats' && pathname !== '/stats' && pathname !== '/profile') {
      router.push('/stats');
    } else if (tab === 'design-system' && pathname !== '/design-system') {
      router.push('/design-system');
    }
  };

  const handleSelectPathNode = (node: PathNode) => {
    const levelDifficulty = calibratedLevel === 1 ? 'Beginner' : calibratedLevel === 3 ? 'Advanced' : 'Intermediate';

    const pathArticle: ArticleWithQuiz = {
      id: `path-node-${node.id}`,
      type: 'medium',
      topic: `${selectedInterests[0] || 'Attention Path'}`,
      difficultyLevel: levelDifficulty,
      title: `${node.numberStr}. ${node.title}`,
      excerpt: node.description,
      analogy:
        calibratedLevel === 1
          ? 'Like building strong mental muscles by single-tasking for 15 unbroken minutes.'
          : 'Connecting multi-variable systems through structured, low-friction synthesis.',
      paragraphs: [
        `${node.title} — ${node.description}`,
        `In deep cognition, mental representations adapt their weights through sustained focus, similar to neural weight updates in machine learning.`,
        `By deliberately sustaining focus on this architectural concept for ${node.wordCount} words, your cognitive stamina expands. Distraction is eliminated, allowing deep structural schemas to form.`,
        `To master high-dimensional thinking, one must systematically train attention stamina across progressively longer reads.`,
      ],
      wordCount: node.wordCount,
      progressPercent: node.status === 'completed' ? 100 : 25,
      saved: false,
      keyTakeaway: `Mastery of "${node.title}" requires protecting unbroken single-task attention.`,
      quiz: {
        question: `Regarding ${node.title}, what is the essential takeaway?`,
        nodeStep: `PATH NODE 0${node.id}`,
        options: [
          { key: 'A', text: 'Cognitive endurance scales through sustained, unbroken focus', isCorrect: true },
          { key: 'B', text: 'Rapid context switching improves conceptual retention', isCorrect: false },
          { key: 'C', text: 'Skimming headlines produces deeper neural connections', isCorrect: false },
          { key: 'D', text: 'All complex systems require zero focus discipline', isCorrect: false },
        ],
        explanation: `${node.title} teaches that sustained cognitive depth directly strengthens our capacity for abstract reasoning.`,
      },
    };

    openReader(pathArticle);
  };

  const filteredFeed = useMemo(() => {
    return articles.filter((a) => {
      if (activeTopicFilter !== 'all' && a.topic.toLowerCase() !== activeTopicFilter.toLowerCase()) {
        return false;
      }
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        a.topic.toLowerCase().includes(q) ||
        (a.title && a.title.toLowerCase().includes(q)) ||
        a.excerpt.toLowerCase().includes(q) ||
        (a.analogy && a.analogy.toLowerCase().includes(q))
      );
    });
  }, [articles, activeTopicFilter, searchQuery]);

  const allTopics = useMemo(() => {
    return ['all', ...Array.from(new Set(articles.map((a) => a.topic)))];
  }, [articles]);

  return (
    <div className="bg-paper min-h-screen text-on-surface flex flex-col font-sans selection:bg-tertiary-fixed selection:text-on-tertiary-fixed transition-colors duration-200">
      {/* Top App Bar */}
      <StitchTopAppBar
        currentTab={currentTab}
        onTabChange={handleTabChange}
        staminaLevel={staminaLevel}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenMenu={() => setMenuOpen(true)}
      />

      {/* Main Tab Content */}
      <div className="flex-1">
        {currentTab === 'feed' && (
          <main className="max-w-[420px] mx-auto px-[20px] py-[20px] flex flex-col gap-5 pb-28">
            {/* Feed Subheader & Onboarding Trigger */}
            <div className="flex justify-between items-center bg-[var(--insert)] border border-[var(--rule)] p-4 rounded-[var(--r-card)] shadow-[0_1px_2px_rgba(26,24,20,0.04)]">
              <span className="t-label text-[var(--graphite)]">
                STREAM · LEVEL {calibratedLevel} ({selectedInterests.length} ACTIVE NICHES)
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={openComposeModal}
                  className="t-ui text-[var(--graphite)] hover:text-[var(--ink)] cursor-pointer"
                >
                  Create
                </button>
                <span className="text-[var(--rule)]">|</span>
                <button
                  onClick={() => setOnboardingOpen(true)}
                  className="t-ui text-[var(--graphite)] hover:text-[var(--ink)] cursor-pointer"
                >
                  Niches
                </button>
              </div>
            </div>

            {/* Topic Filter Chips */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {allTopics.map((topic) => {
                const isActive = activeTopicFilter === topic;
                return (
                  <button
                    key={topic}
                    onClick={() => setActiveTopicFilter(topic)}
                    className={`t-label px-3 py-1.5 rounded-[var(--r-control)] border transition-colors cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[var(--ink)] text-[var(--insert)] border-[var(--ink)] font-bold'
                        : 'bg-[var(--insert)] text-[var(--graphite)] border-[var(--rule)] hover:border-[var(--ink)]'
                    }`}
                  >
                    {topic === 'all' ? 'All Topics' : topic}
                  </button>
                );
              })}
            </div>

            {/* Stream of Feed Cards */}
            {filteredFeed.map((art) => (
              <StitchFeedCard
                key={art.id}
                article={art}
                onRead={(a) => openReader(a as ArticleWithQuiz)}
                onSave={(a) => toggleSaveArticle(a.id)}
                onTakeCheck={(a) => openQuickCheck(a as ArticleWithQuiz)}
                onShareMilestone={(a) =>
                  openMilestoneModal({
                    topicTitle: a.title || a.topic,
                    category: a.topic,
                    wordsMastered: a.wordCount,
                  })
                }
              />
            ))}

            {filteredFeed.length === 0 && (
              <div className="text-center py-16 bg-[var(--insert)] border border-[var(--rule)] rounded-[var(--r-card)] p-6">
                <p className="t-title mb-2">
                  No articles found for "{activeTopicFilter}".
                </p>
                <button
                  onClick={() => setActiveTopicFilter('all')}
                  className="t-ui text-[var(--graphite)] hover:text-[var(--ink)] cursor-pointer font-semibold"
                >
                  View All Topics
                </button>
              </div>
            )}
          </main>
        )}

        {currentTab === 'path' && (
          <StitchProfileRoadmap
            onOpenReader={(a) => openReader(a)}
            onOpenQuickCheck={(a) => openQuickCheck(a)}
          />
        )}

        {currentTab === 'library' && (
          <StitchLibrary onReadArticle={(a) => openReader(a)} />
        )}

        {currentTab === 'stats' && (
          <StitchProfileRoadmap
            onOpenReader={(a) => openReader(a)}
            onOpenQuickCheck={(a) => openQuickCheck(a)}
          />
        )}

        {currentTab === 'design-system' && <StitchDesignSystem />}
      </div>

      {/* Bottom Navigation for Mobile */}
      <StitchBottomNav currentTab={currentTab} onTabChange={handleTabChange} />

      {/* Dynamic Welcome / Splash & Auth Gateway */}
      {(showSplash || authGatewayOpen) && (
        <StitchWelcomeSplash
          onStartCalibration={() => {
            setShowSplash(false);
            setAuthGatewayOpen(false);
            setOnboardingOpen(true);
          }}
          onExploreGuest={() => {
            setShowSplash(false);
            setAuthGatewayOpen(false);
          }}
        />
      )}

      {/* Reader Modal / Canvas */}
      {activeArticle && (
        <StitchArticleReader
          article={activeArticle}
          onBack={closeReader}
          onTakeQuickCheck={() => {
            const art = activeArticle;
            closeReader();
            openQuickCheck(art);
          }}
          onToggleSave={() => toggleSaveArticle(activeArticle.id)}
          onUpdateProgress={(p) => updateArticleProgress(activeArticle.id, p)}
          onMarkComplete={() => {
            markArticleComplete(activeArticle.id);
            if (activeArticle.id.startsWith('skill-node-')) {
              const nodeId = parseInt(activeArticle.id.replace('skill-node-', ''), 10);
              if (!isNaN(nodeId)) {
                completeSkillTreeNode(activeArticle.topic, nodeId);
              }
            } else if (activeArticle.id.startsWith('path-node-')) {
              const nodeId = parseInt(activeArticle.id.replace('path-node-', ''), 10);
              if (!isNaN(nodeId)) {
                completePathNode(nodeId);
              }
            }
          }}
          onOpenMilestoneCard={() =>
            openMilestoneModal({
              topicTitle: activeArticle.title || activeArticle.topic,
              category: activeArticle.topic,
              wordsMastered: activeArticle.wordCount,
            })
          }
        />
      )}

      {/* Quick Check Overlay */}
      <StitchQuickCheckOverlay
        isOpen={quickCheckOpen}
        onClose={closeQuickCheck}
        onComplete={(earnedXp) => {
          completeQuickCheck(earnedXp, quickCheckArticle?.id);
          if (quickCheckArticle?.id.startsWith('skill-node-')) {
            const nodeId = parseInt(quickCheckArticle.id.replace('skill-node-', ''), 10);
            if (!isNaN(nodeId)) {
              completeSkillTreeNode(quickCheckArticle.topic, nodeId);
            }
          } else if (quickCheckArticle?.id.startsWith('path-node-')) {
            const nodeId = parseInt(quickCheckArticle.id.replace('path-node-', ''), 10);
            if (!isNaN(nodeId)) {
              completePathNode(nodeId);
            }
          }
        }}
        question={
          quickCheckArticle?.quiz?.question ||
          (quickCheckArticle?.title
            ? `Regarding "${quickCheckArticle.title}", which statement best describes its core insight?`
            : undefined)
        }
        nodeStep={quickCheckArticle?.quiz?.nodeStep}
        options={quickCheckArticle?.quiz?.options}
        explanation={quickCheckArticle?.quiz?.explanation}
      />

      {/* Shareable Milestone / Certificate Card Modal */}
      <StitchMilestoneCardModal
        isOpen={milestoneModalOpen}
        onClose={closeMilestoneModal}
        milestone={activeMilestone}
      />

      {/* Creator Studio & Compose Modal (UGC) */}
      <StitchComposeModal
        isOpen={composeModalOpen}
        onClose={closeComposeModal}
      />

      {/* Onboarding Flow Modal */}
      {onboardingOpen && (
        <StitchOnboarding
          onCancel={() => setOnboardingOpen(false)}
          onComplete={() => setOnboardingOpen(false)}
        />
      )}

      {/* Search Dialog */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-[#0E0F14]/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
          <div className="bg-surface-container-lowest border border-hairline rounded-lg w-full max-w-lg p-6 shadow-xl animate-slide-in">
            <div className="flex justify-between items-center mb-4">
              <span className="font-label-mono text-[11px] text-graphite uppercase font-bold">
                SEARCH TIDBIT LESSONS & ESSAYS
              </span>
              <button
                onClick={() => setSearchOpen(false)}
                className="text-graphite hover:text-ink-blue cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="relative">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by topic, keyword, or plain-English concept..."
                className="w-full pl-10 pr-4 py-3 bg-paper border border-hairline rounded font-ui-button text-[15px] focus:outline-none focus:border-ink-blue text-on-surface"
              />
              <span className="material-symbols-outlined absolute left-3 top-3.5 text-[20px] text-graphite">
                search
              </span>
            </div>

            {/* Instant Results preview */}
            {searchQuery && (
              <div className="mt-4 max-h-60 overflow-y-auto divide-y divide-hairline">
                {filteredFeed.slice(0, 5).map((art) => (
                  <div
                    key={art.id}
                    onClick={() => {
                      setSearchOpen(false);
                      openReader(art);
                    }}
                    className="py-2.5 px-2 hover:bg-paper/50 cursor-pointer rounded transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-label-mono text-[10px] text-graphite uppercase">
                        {art.topic} · {art.difficultyLevel || 'Beginner'}
                      </span>
                      <span className="font-label-mono text-[10px] text-ink-blue font-bold">
                        {art.wordCount} W
                      </span>
                    </div>
                    <p className="font-headline-md text-[15px] text-on-surface font-serif">
                      {art.title || art.excerpt}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSearchOpen(false)}
                className="bg-primary-container text-white px-5 py-2 rounded font-ui-button text-[14px] cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-out Menu Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-[#0E0F14]/50 backdrop-blur-xs"
          />
          <div className="relative w-76 bg-paper border-r border-hairline h-full p-6 flex flex-col justify-between shadow-2xl z-10 animate-slide-in">
            <div>
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-hairline">
                <div className="flex items-center gap-2">
                  <StitchLogo variant="horizontal" size="sm" showTagline={false} />
                  <span className="font-label-mono text-[9px] text-graphite uppercase px-2 py-0.5 rounded bg-surface-container-lowest border border-hairline">
                    L{calibratedLevel}
                  </span>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="text-graphite hover:text-ink-blue cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* User Profile Summary */}
              <div className="mb-6 p-3 rounded-lg bg-surface-container-lowest border border-hairline flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-ink-blue text-white flex items-center justify-center font-bold text-xs">
                    {currentUser?.name ? currentUser.name[0].toUpperCase() : 'G'}
                  </div>
                  <div>
                    <div className="t-ui font-semibold text-[var(--ink)] truncate max-w-[120px]">
                      {currentUser?.name || 'Guest Explorer'}
                    </div>
                    <div className="t-num text-[var(--graphite)]">
                      {streakDays}-DAY FOCUS STREAK
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleTabChange('stats');
                  }}
                  className="t-label text-[var(--graphite)] hover:text-[var(--ink)] cursor-pointer font-semibold"
                >
                  View
                </button>
              </div>

              {/* Main Navigation links */}
              <div className="flex flex-col gap-1.5 font-ui-button text-[14.5px]">
                {[
                  { id: 'feed', label: 'Feed & Daily Cards' },
                  { id: 'path', label: 'Skill Trees' },
                  { id: 'library', label: 'Saved Library' },
                  { id: 'stats', label: 'Profile & Session Stamina' },
                  { id: 'design-system', label: 'Design System' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      handleTabChange(item.id);
                      setMenuOpen(false);
                    }}
                    className={`px-3 py-2.5 rounded-[var(--r-control)] transition-colors text-left cursor-pointer t-ui ${
                      currentTab === item.id
                        ? 'bg-[var(--inset)] text-[var(--ink)] font-semibold border border-[var(--rule)]'
                        : 'text-[var(--graphite)] hover:text-[var(--ink)]'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[var(--rule)] flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  openComposeModal();
                }}
                className="w-full py-2.5 px-3 rounded-[var(--r-control)] bg-[var(--ink)] text-[var(--insert)] t-ui font-semibold cursor-pointer"
              >
                Publish Card (UGC)
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  openMilestoneModal();
                }}
                className="w-full py-2.5 px-3 rounded-[var(--r-control)] bg-[var(--inset)] border border-[var(--rule)] text-[var(--ink)] t-ui font-semibold cursor-pointer"
              >
                Share Certificate
              </button>

              <button
                onClick={toggleDarkMode}
                className="w-full flex items-center justify-between px-3 py-2 rounded bg-surface-container-lowest border border-hairline text-on-surface font-ui-button text-[13px] cursor-pointer hover:border-ink-blue"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-ink-blue">
                    {isDarkMode ? 'light_mode' : 'dark_mode'}
                  </span>
                  <span>Theme Mode</span>
                </span>
                <span className="font-label-mono text-[10px] text-graphite uppercase font-bold">
                  {isDarkMode ? 'Dark' : 'Light'}
                </span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  setOnboardingOpen(true);
                }}
                className="w-full bg-surface-container-lowest border border-hairline py-2.5 rounded text-graphite hover:text-ink-blue font-ui-button text-[13px] cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">tune</span>
                <span>Recalibrate Niches (Swipe Deck)</span>
              </button>

              {currentUser && !currentUser.isGuest && (
                <button
                  onClick={() => {
                    logoutUser();
                    setMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-graphite hover:text-red-500 font-label-mono text-[11px] uppercase cursor-pointer"
                >
                  Sign Out
                </button>
              )}

              <div className="font-label-mono text-[10px] text-graphite text-center">
                TIDBIT ATTENTION TRAINER · V4.0
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-ink-blue text-white px-4 py-2.5 rounded shadow-lg font-ui-button text-[13px] flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
