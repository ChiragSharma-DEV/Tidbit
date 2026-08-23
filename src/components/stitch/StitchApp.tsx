'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import StitchTopAppBar from './StitchTopAppBar';
import StitchBottomNav from './StitchBottomNav';
import StitchFeedCard from './StitchFeedCard';
import StitchArticleReader from './StitchArticleReader';
import StitchQuickCheckOverlay from './StitchQuickCheckOverlay';
import StitchLearningPath, { PathNode } from './StitchLearningPath';
import StitchLibrary from './StitchLibrary';
import StitchStaminaStats from './StitchStaminaStats';
import StitchDesignSystem from './StitchDesignSystem';
import StitchOnboarding from './StitchOnboarding';
import { useAttentionTrainer, ArticleWithQuiz } from '@/contexts/AttentionTrainerContext';

interface StitchAppProps {
  initialTab?: string;
}

export default function StitchApp({ initialTab }: StitchAppProps) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    currentTab,
    setCurrentTab,
    articles,
    activeArticle,
    staminaLevel,
    selectedInterests,
    quickCheckOpen,
    quickCheckArticle,
    onboardingOpen,
    toastMessage,
    toggleSaveArticle,
    updateArticleProgress,
    markArticleComplete,
    completeQuickCheck,
    completePathNode,
    openReader,
    closeReader,
    openQuickCheck,
    closeQuickCheck,
    setOnboardingOpen,
  } = useAttentionTrainer();

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
    // Optional clean URL sync
    if (tab === 'feed' && pathname !== '/trainer' && pathname !== '/feed') {
      router.push('/trainer');
    } else if (tab === 'path' && pathname !== '/path') {
      router.push('/path');
    } else if (tab === 'library' && pathname !== '/library') {
      router.push('/library');
    } else if (tab === 'stats' && pathname !== '/stats') {
      router.push('/stats');
    } else if (tab === 'design-system' && pathname !== '/design-system') {
      router.push('/design-system');
    }
  };

  const handleSelectPathNode = (node: PathNode) => {
    const pathArticle: ArticleWithQuiz = {
      id: `path-node-${node.id}`,
      type: 'medium',
      topic: 'AI & Tech Path',
      title: `${node.numberStr}. ${node.title}`,
      excerpt: node.description,
      paragraphs: [
        `${node.title} — ${node.description}`,
        `In deep learning, neural connections adapt weights dynamically through gradient descent and mathematical backpropagation.`,
        `By deliberately sustaining focus on this architectural module for ${node.wordCount} words, your cognitive stamina adapts similarly to backpropagation in biological neurons.`,
        `To master complex systems, one must build endurance for non-linear, deep abstraction without fragmenting focus.`,
      ],
      wordCount: node.wordCount,
      progressPercent: node.status === 'completed' ? 100 : 25,
      saved: false,
      quiz: {
        question: `Regarding ${node.title}, what is the essential takeaway?`,
        nodeStep: `PATH NODE 0${node.id}`,
        options: [
          { key: 'A', text: 'Cognitive endurance scales through sustained uninterrupted focus', isCorrect: true },
          { key: 'B', text: 'Skimming through headlines produces deeper neural retention', isCorrect: false },
          { key: 'C', text: 'Short-term context switching improves mathematical intuition', isCorrect: false },
          { key: 'D', text: 'All machine learning algorithms require zero parameters', isCorrect: false },
        ],
        explanation: `${node.title} teaches that sustained cognitive depth directly strengthens our capacity for abstract reasoning.`,
      },
    };

    openReader(pathArticle);
  };

  const filteredFeed = articles.filter((a) => {
    // Topic filter
    if (activeTopicFilter !== 'all' && a.topic.toLowerCase() !== activeTopicFilter.toLowerCase()) {
      return false;
    }
    // Search query
    if (!searchQuery) return true;
    return (
      a.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.title && a.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Extract all unique topics
  const allTopics = ['all', ...Array.from(new Set(articles.map((a) => a.topic)))];

  return (
    <div className="bg-paper min-h-screen text-on-surface flex flex-col font-sans selection:bg-tertiary-fixed selection:text-on-tertiary-fixed">
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
          <main className="max-w-2xl mx-auto px-4 md:px-margin-page py-6 md:py-stack-lg flex flex-col gap-6 md:gap-stack-lg pb-28">
            {/* Feed Subheader & Onboarding Trigger */}
            <div className="flex justify-between items-center bg-surface-container-lowest border border-hairline p-4 rounded shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-ink-blue animate-pulse" />
                <span className="font-label-mono text-[11px] text-graphite uppercase font-semibold">
                  TODAY'S CALIBRATED STREAM
                </span>
              </div>
              <button
                onClick={() => setOnboardingOpen(true)}
                className="font-label-mono text-[11px] text-ink-blue uppercase hover:underline font-bold cursor-pointer"
              >
                Recalibrate (Step 1-2)
              </button>
            </div>

            {/* Topic Filter Chips */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {allTopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setActiveTopicFilter(topic)}
                  className={`px-3 py-1.5 rounded font-ui-button text-[12px] uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                    activeTopicFilter === topic
                      ? 'bg-ink-blue text-white shadow-xs font-bold'
                      : 'bg-surface-container-lowest border border-hairline text-graphite hover:text-ink-blue'
                  }`}
                >
                  {topic === 'all' ? 'All Topics' : topic}
                </button>
              ))}
            </div>

            {/* Stream of Feed Cards */}
            {filteredFeed.map((art) => (
              <StitchFeedCard
                key={art.id}
                article={art}
                onRead={(a) => openReader(a as ArticleWithQuiz)}
                onSave={(a) => toggleSaveArticle(a.id)}
                onTakeCheck={(a) => openQuickCheck(a as ArticleWithQuiz)}
              />
            ))}

            {filteredFeed.length === 0 && (
              <div className="text-center py-16 bg-surface-container-lowest border border-hairline rounded">
                <span className="material-symbols-outlined text-[36px] text-graphite/40 mb-2">
                  filter_list_off
                </span>
                <p className="font-headline-md text-[20px] text-on-surface font-serif">
                  No articles found for "{activeTopicFilter}".
                </p>
                <button
                  onClick={() => setActiveTopicFilter('all')}
                  className="mt-3 text-ink-blue font-ui-button text-[13px] hover:underline"
                >
                  View All Topics
                </button>
              </div>
            )}
          </main>
        )}

        {currentTab === 'path' && (
          <StitchLearningPath onSelectNode={handleSelectPathNode} />
        )}

        {currentTab === 'library' && (
          <StitchLibrary onReadArticle={(a) => openReader(a)} />
        )}

        {currentTab === 'stats' && <StitchStaminaStats />}

        {currentTab === 'design-system' && <StitchDesignSystem />}
      </div>

      {/* Bottom Navigation for Mobile */}
      <StitchBottomNav currentTab={currentTab} onTabChange={handleTabChange} />

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
            if (activeArticle.id.startsWith('path-node-')) {
              const nodeId = parseInt(activeArticle.id.replace('path-node-', ''), 10);
              if (!isNaN(nodeId)) {
                completePathNode(nodeId);
              }
            }
          }}
        />
      )}

      {/* Quick Check Overlay */}
      <StitchQuickCheckOverlay
        isOpen={quickCheckOpen}
        onClose={closeQuickCheck}
        onComplete={(earnedXp) => {
          completeQuickCheck(earnedXp, quickCheckArticle?.id);
          if (quickCheckArticle?.id.startsWith('path-node-')) {
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

      {/* Onboarding Flow Modal */}
      {onboardingOpen && (
        <StitchOnboarding
          onCancel={() => setOnboardingOpen(false)}
        />
      )}

      {/* Search Dialog */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-[#16171B]/50 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
          <div className="bg-surface-container-lowest border border-hairline rounded-lg w-full max-w-lg p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <span className="font-label-mono text-[11px] text-graphite uppercase font-bold">
                SEARCH TIDBIT
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
                placeholder="Search by topic, keyword, or title..."
                className="w-full pl-10 pr-4 py-3 bg-paper border border-hairline rounded font-ui-button text-[15px] focus:outline-none focus:border-ink-blue"
              />
              <span className="material-symbols-outlined absolute left-3 top-3.5 text-[20px] text-graphite">
                search
              </span>
            </div>

            {/* Instant Results preview */}
            {searchQuery && (
              <div className="mt-4 max-h-60 overflow-y-auto divide-y divide-hairline">
                {filteredFeed.slice(0, 4).map((art) => (
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
                        {art.topic}
                      </span>
                      <span className="font-label-mono text-[10px] text-ink-blue">
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
            className="fixed inset-0 bg-[#16171B]/40 backdrop-blur-xs"
          />
          <div className="relative w-72 bg-paper border-r border-hairline h-full p-6 flex flex-col justify-between shadow-2xl z-10">
            <div>
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-hairline">
                <span className="font-display-lg-mobile text-[26px] text-ink-blue font-serif">
                  Tidbit
                </span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="text-graphite hover:text-ink-blue cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="flex flex-col gap-2 font-ui-button text-[15px]">
                {[
                  { id: 'feed', label: 'Feed & Daily Cards', icon: 'auto_stories' },
                  { id: 'path', label: 'Attention Learning Path', icon: 'route' },
                  { id: 'library', label: 'Saved Library', icon: 'bookmarks' },
                  { id: 'stats', label: 'Stamina Stats & Visualizer', icon: 'insights' },
                  { id: 'design-system', label: 'Quiet Print Design System', icon: 'palette' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      handleTabChange(item.id);
                      setMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors text-left cursor-pointer ${
                      currentTab === item.id
                        ? 'bg-surface-container-lowest border border-hairline text-ink-blue font-bold shadow-xs'
                        : 'text-graphite hover:text-ink-blue'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-hairline flex flex-col gap-3">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setOnboardingOpen(true);
                }}
                className="w-full bg-surface-container-lowest border border-hairline py-2.5 rounded text-graphite hover:text-ink-blue font-ui-button text-[13px] cursor-pointer"
              >
                Run Onboarding Calibration
              </button>
              <div className="font-label-mono text-[10px] text-graphite text-center">
                TIDBIT ATTENTION TRAINER · V2.0
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
