'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { FeedArticle } from '@/components/stitch/StitchFeedCard';
import { PathNode } from '@/components/stitch/StitchLearningPath';

export interface QuickCheckData {
  question: string;
  nodeStep?: string;
  options: { key: string; text: string; isCorrect: boolean }[];
  explanation: string;
}

export interface MasteredContext {
  id: string;
  topic: string;
  title: string;
  description: string;
  completedAt: string;
}

export interface ArticleWithQuiz extends FeedArticle {
  quiz?: QuickCheckData;
  completed?: boolean;
  lastReadAt?: string;
}

const DEFAULT_ARTICLES: ArticleWithQuiz[] = [
  {
    id: 'art-1',
    type: 'short',
    topic: 'AI & Tech',
    title: 'Small models are eating the easy jobs',
    excerpt:
      'A three-billion-parameter model runs on your phone, answers in under a second, and costs almost nothing. It will not write your novel. It does not need to.',
    paragraphs: [
      'A three-billion-parameter model runs on your phone, answers in under a second, and costs almost nothing. It will not write your novel. It does not need to.',
      'By limiting parameter count and fine-tuning on specific datasets, SLMs (Small Language Models) run locally with zero latency, complete offline availability, and guaranteed user privacy.',
      'Narrow work is cheap work. The future of artificial intelligence is modular, specialized, and localized to the edge.',
    ],
    wordCount: 52,
    progressPercent: 0,
    keyTakeaway: 'Narrow work is cheap work.',
    saved: false,
    quiz: {
      question: 'What is the primary operational advantage of Small Language Models (SLMs)?',
      nodeStep: 'CALIBRATION 1',
      options: [
        { key: 'A', text: 'They replace large foundation models entirely', isCorrect: false },
        { key: 'B', text: 'They run locally with zero latency and high privacy', isCorrect: true },
        { key: 'C', text: 'They have unlimited training parameters', isCorrect: false },
        { key: 'D', text: 'They are slower but generate longer creative novels', isCorrect: false },
      ],
      explanation: 'SLMs are intentionally optimized for specific functional tasks to run with low memory and zero latency directly on user devices.',
    },
  },
  {
    id: 'art-2',
    type: 'medium',
    topic: 'Philosophy',
    title: 'The Architecture of Silence',
    excerpt:
      'In an era defined by constant interruption, silence has transitioned from a natural state to a luxury commodity. We must consciously construct physical and digital environments that block out the noise.',
    paragraphs: [
      'In an era defined by constant interruption, silence has transitioned from a natural state to a luxury commodity. We must consciously construct physical and digital environments that block out the noise, allowing our minds to reset and recalibrate.',
      'It is in these intentionally quiet spaces, devoid of algorithmic friction, that deep work and genuine creativity find the structural room they need to breathe and expand into something lasting.',
      'True perception requires a deliberate slowing down. When you read a physical page, there are no unread badges sliding down from the top edge, no hyperlinked detours waiting to distract you.',
      'Silence is not the absence of thought; it is the presence of attention.',
    ],
    wordCount: 114,
    progressPercent: 45,
    saved: true,
    quiz: {
      question: 'According to the essay, why is silence described as a "luxury commodity"?',
      nodeStep: 'REFLECTIVE CHECK',
      options: [
        { key: 'A', text: 'It can only be bought through expensive acoustic panels', isCorrect: false },
        { key: 'B', text: 'Digital noise and algorithmic interruptions make quiet spaces rare', isCorrect: true },
        { key: 'C', text: 'It requires complete abandonment of modern technology', isCorrect: false },
        { key: 'D', text: 'It is strictly limited to architectural monuments', isCorrect: false },
      ],
      explanation: 'Constant digital notifications and hyper-connectivity make intentional quietude a rare, highly valuable state for cognitive restoration.',
    },
  },
  {
    id: 'art-3',
    type: 'refresher',
    topic: 'AI & Tech',
    title: 'Broad knowledge is the thing small models trade away',
    excerpt:
      'Small Language Models achieve their speed through a ruthless editing process. They optimize heavily for specific functional tasks, discarding vast trivia networks.',
    paragraphs: [
      'Small Language Models (SLMs) achieve their impressive speed and local-execution capabilities through a ruthless editing process. They optimize heavily for specific functional tasks like document summarization, code generation, or structured data extraction.',
      'To fit inside restricted memory footprints—like a smartphone’s RAM—these models discard the vast, sprawling web of general trivia that bulk up larger foundation models.',
      'It is an intentional, calculated trade-off: specialized speed and accuracy over encyclopedic breadth.',
    ],
    wordCount: 88,
    progressPercent: 0,
    saved: false,
    quiz: {
      question: 'Which of these is traded away to make small language models lightweight?',
      nodeStep: 'NODE 3 OF 6',
      options: [
        { key: 'A', text: 'Execution speed', isCorrect: false },
        { key: 'B', text: 'Local device capability', isCorrect: false },
        { key: 'C', text: 'Vast general trivia knowledge', isCorrect: true },
        { key: 'D', text: 'Functional specialization', isCorrect: false },
      ],
      explanation: 'Small models trade encyclopedic trivia breadth in order to fit into restricted memory footprints and execute quickly.',
    },
  },
  {
    id: 'art-4',
    type: 'long',
    topic: 'Cognitive Science',
    title: 'Paper as Technology & Cognitive Sovereignty',
    excerpt:
      'The bound book remains one of the most perfectly refined pieces of technology in human history. It enforces linearity, single-tasking, and deep cognitive retention.',
    paragraphs: [
      'We tend to think of technology as inherently digital—glass screens, glowing silicon chips, and invisible networks spanning the globe. Yet, the bound book remains one of the most perfectly refined pieces of technology in human history.',
      'It requires no battery, boasts an essentially infinite shelf life if kept dry, and provides a physical interface that is immediately understood by almost anyone.',
      'More importantly, paper dictates a specific kind of cognitive engagement. It enforces linearity and single-tasking. When you read a physical page, there are no unread badges sliding down from the top edge, no hyperlinked detours waiting to distract you.',
      'It is a closed system that demands, and fundamentally rewards, undivided attention. In a distracted world, that constraint is a feature, not a bug.',
    ],
    wordCount: 156,
    progressPercent: 0,
    saved: false,
    quiz: {
      question: 'What makes paper an enduring cognitive technology according to the author?',
      nodeStep: 'DEEP DIVE',
      options: [
        { key: 'A', text: 'It connects readers to real-time internet discussions', isCorrect: false },
        { key: 'B', text: 'It enforces linearity and eliminates hyperlinked distractions', isCorrect: true },
        { key: 'C', text: 'It produces higher dopamine spikes than glowing screens', isCorrect: false },
        { key: 'D', text: 'It updates content automatically over wireless networks', isCorrect: false },
      ],
      explanation: 'Paper acts as a closed, distraction-free system that enforces focused linearity and single-task engagement.',
    },
  },
  {
    id: 'art-5',
    type: 'short',
    topic: 'Minimalism',
    excerpt:
      'The shortest path to clarity is often removing the extraneous rather than adding the profound. Less ink, more signal.',
    paragraphs: [
      'The shortest path to clarity is often removing the extraneous rather than adding the profound. Less ink, more signal.',
      'Every unnecessary adjective, superfluous visual gradient, and unsolicited notification dilutes the core truth.',
      'Quiet design creates the mental room needed for clear synthesis.',
    ],
    wordCount: 38,
    progressPercent: 15,
    saved: true,
    quiz: {
      question: 'What is the core principle of "Less ink, more signal"?',
      nodeStep: 'MINIMALISM 1',
      options: [
        { key: 'A', text: 'Adding complex ornamentation to captivate attention', isCorrect: false },
        { key: 'B', text: 'Stripping out extraneous noise to elevate essential truth', isCorrect: true },
        { key: 'C', text: 'Writing longer paragraphs to explain basic ideas', isCorrect: false },
        { key: 'D', text: 'Using bright gradients on all UI elements', isCorrect: false },
      ],
      explanation: 'Removing clutter and extraneous details maximizes clarity and focus on the fundamental signal.',
    },
  },
  {
    id: 'art-6',
    type: 'medium',
    topic: 'Deep Work',
    title: 'The Cost of Context Switching',
    excerpt:
      'Every time you glance at a notification, your brain leaves an attention residue on that interrupted task. Recovering deep focus takes up to 23 minutes.',
    paragraphs: [
      'Gloria Mark’s research at UC Irvine demonstrated that it takes an average of 23 minutes and 15 seconds to regain deep focus after a single interruption.',
      'When we toggle between messaging apps, email inboxes, and documents, our attention does not cleanly follow us. Instead, a psychological phenomenon known as "attention residue" lingers on the previous topic.',
      'Protecting unbroken reading blocks is the single highest leverage habit for intellectual output in the information age.',
    ],
    wordCount: 92,
    progressPercent: 0,
    saved: false,
    quiz: {
      question: 'What is "attention residue"?',
      nodeStep: 'DEEP WORK 1',
      options: [
        { key: 'A', text: 'Eye fatigue caused by reading paper books', isCorrect: false },
        { key: 'B', text: 'Cognitive focus remaining stuck on an interrupted task', isCorrect: true },
        { key: 'C', text: 'The brain chemistry that allows instant multi-tasking', isCorrect: false },
        { key: 'D', text: 'The memory buffer used by small language models', isCorrect: false },
      ],
      explanation: 'Attention residue occurs when cognitive capacity remains attached to a prior unfinished interruption, degrading performance on the current task.',
    },
  },
  {
    id: 'art-7',
    type: 'long',
    topic: 'Neuroscience',
    title: 'Neuroplasticity & The Reading Brain',
    excerpt:
      'The human brain was never hardwired to read; it re-purposed visual and language pathways. The medium we use rewires the circuits we rely upon.',
    paragraphs: [
      'Unlike spoken language, which is genetically encoded through hundreds of thousands of years of evolution, reading is a cultural invention that is scarcely 5,000 years old.',
      'To read, our brains execute a brilliant feat of neuroplasticity—stitching together visual object recognition circuits in the occipito-temporal cortex with auditory and linguistic processing centers.',
      'When we consume fast-scrolling, fragmented snippets, our neural pathways adapt for rapid scanning and keyword extraction. Conversely, deep, sustained reading strengthens the myelination of circuits responsible for critical analysis, empathy, and deductive reasoning.',
      'You become how you read.',
    ],
    wordCount: 138,
    progressPercent: 0,
    saved: false,
    quiz: {
      question: 'How did human brains develop the ability to read?',
      nodeStep: 'NEUROSCIENCE 1',
      options: [
        { key: 'A', text: 'It was genetically encoded from the origin of human biology', isCorrect: false },
        { key: 'B', text: 'By repurposing visual and language circuits through neuroplasticity', isCorrect: true },
        { key: 'C', text: 'Through synthetic implants developed in antiquity', isCorrect: false },
        { key: 'D', text: 'Reading evolved before spoken communication', isCorrect: false },
      ],
      explanation: 'Reading is an invented cognitive discipline that repurposes preexisting visual and linguistic neural circuits.',
    },
  },
];

const DEFAULT_PATH_NODES: PathNode[] = [
  {
    id: 1,
    numberStr: '01',
    title: 'What a model is',
    highlightWord: 'model',
    description: 'An introduction to the statistical foundations of AI.',
    wordCount: 340,
    status: 'completed',
  },
  {
    id: 2,
    numberStr: '02',
    title: 'How models learn',
    highlightWord: 'learn',
    description: 'Understanding the backpropagation process.',
    wordCount: 410,
    status: 'completed',
  },
  {
    id: 3,
    numberStr: '03',
    title: 'Neural networks',
    highlightWord: 'networks',
    description: 'The architecture of deep learning.',
    wordCount: 520,
    status: 'completed',
  },
  {
    id: 4,
    numberStr: '04',
    title: 'Attention Mechanisms',
    highlightWord: 'Attention',
    description: 'How transformer models focus on what matters.',
    wordCount: 680,
    status: 'current',
  },
  {
    id: 5,
    numberStr: '05',
    title: 'Large language models',
    description: 'Scaling parameters up to human-like text generation.',
    wordCount: 450,
    status: 'locked',
  },
  {
    id: 6,
    numberStr: '06',
    title: 'Fine-tuning & Alignment',
    description: 'Specializing a model with RLHF and LoRA adapters.',
    wordCount: 300,
    status: 'locked',
  },
];

interface AttentionTrainerContextType {
  // State
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  articles: ArticleWithQuiz[];
  activeArticle: ArticleWithQuiz | null;
  pathNodes: PathNode[];
  staminaLevel: number;
  xp: number;
  longestUnbrokenRead: number;
  sessionWordsRead: number;
  totalWordsReadToday: number;
  dailyGoalWords: number;
  masteredContexts: MasteredContext[];
  selectedInterests: string[];
  baselineLength: number;
  rollingAverages: number[];
  quickCheckOpen: boolean;
  quickCheckArticle: ArticleWithQuiz | null;
  onboardingOpen: boolean;
  toastMessage: string | null;
  
  // Actions
  toggleSaveArticle: (articleId: string) => void;
  updateArticleProgress: (articleId: string, percent: number) => void;
  markArticleComplete: (articleId: string) => void;
  completeQuickCheck: (earnedXp: number, articleId?: string) => void;
  completePathNode: (nodeId: number) => void;
  saveOnboardingPreferences: (interests: string[], baselineLength: number) => void;
  openReader: (article: ArticleWithQuiz) => void;
  closeReader: () => void;
  openQuickCheck: (article?: ArticleWithQuiz) => void;
  closeQuickCheck: () => void;
  setOnboardingOpen: (open: boolean) => void;
  showToast: (message: string) => void;
  recordSessionWords: (words: number) => void;
}

const AttentionTrainerContext = createContext<AttentionTrainerContextType | undefined>(undefined);

const STORAGE_KEY = 'tidbit_attention_trainer_v2';

export function AttentionTrainerProvider({ children }: { children: React.ReactNode }) {
  const [currentTab, setCurrentTab] = useState<string>('feed');
  const [articles, setArticles] = useState<ArticleWithQuiz[]>(DEFAULT_ARTICLES);
  const [pathNodes, setPathNodes] = useState<PathNode[]>(DEFAULT_PATH_NODES);
  const [staminaLevel, setStaminaLevel] = useState<number>(34);
  const [xp, setXp] = useState<number>(350);
  const [longestUnbrokenRead, setLongestUnbrokenRead] = useState<number>(421);
  const [sessionWordsRead, setSessionWordsRead] = useState<number>(1240);
  const [totalWordsReadToday, setTotalWordsReadToday] = useState<number>(1240);
  const [dailyGoalWords, setDailyGoalWords] = useState<number>(2000);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'AI & Tech',
    'Philosophy',
    'Cognitive Science',
    'Minimalism',
  ]);
  const [baselineLength, setBaselineLength] = useState<number>(140);
  const [rollingAverages, setRollingAverages] = useState<number[]>([
    20, 25, 30, 28, 35, 45, 50, 48, 60, 68, 75, 82, 90, 85, 95,
  ]);
  const [masteredContexts, setMasteredContexts] = useState<MasteredContext[]>([
    {
      id: 'mc-1',
      topic: 'Philosophy',
      title: 'Stoic philosophy',
      description: 'Origins of Stoic philosophy and its modern application in digital minimalism.',
      completedAt: 'Recent',
    },
    {
      id: 'mc-2',
      topic: 'Architecture',
      title: 'Acoustic architecture',
      description: 'Analysis of silence as an intentional structural element in physical and digital spaces.',
      completedAt: 'Recent',
    },
    {
      id: 'mc-3',
      topic: 'Cognitive Science',
      title: 'Deep work & attention residue',
      description: 'The cognitive impact of deep focus vs context switching in knowledge workers.',
      completedAt: 'Recent',
    },
  ]);

  // Overlays
  const [activeArticle, setActiveArticle] = useState<ArticleWithQuiz | null>(null);
  const [quickCheckOpen, setQuickCheckOpen] = useState(false);
  const [quickCheckArticle, setQuickCheckArticle] = useState<ArticleWithQuiz | null>(null);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hydrate from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.articles) setArticles(parsed.articles);
          if (parsed.pathNodes) setPathNodes(parsed.pathNodes);
          if (parsed.staminaLevel) setStaminaLevel(parsed.staminaLevel);
          if (parsed.xp) setXp(parsed.xp);
          if (parsed.longestUnbrokenRead) setLongestUnbrokenRead(parsed.longestUnbrokenRead);
          if (parsed.totalWordsReadToday) setTotalWordsReadToday(parsed.totalWordsReadToday);
          if (parsed.dailyGoalWords) setDailyGoalWords(parsed.dailyGoalWords);
          if (parsed.selectedInterests) setSelectedInterests(parsed.selectedInterests);
          if (parsed.baselineLength) setBaselineLength(parsed.baselineLength);
          if (parsed.masteredContexts) setMasteredContexts(parsed.masteredContexts);
        }
      } catch (err) {
        console.error('Failed to load state from localStorage', err);
      }
    }
  }, []);

  // Persist to localStorage
  const persistState = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        const dataToSave = {
          articles,
          pathNodes,
          staminaLevel,
          xp,
          longestUnbrokenRead,
          totalWordsReadToday,
          dailyGoalWords,
          selectedInterests,
          baselineLength,
          masteredContexts,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      } catch (err) {
        console.error('Failed to persist state to localStorage', err);
      }
    }
  }, [
    articles,
    pathNodes,
    staminaLevel,
    xp,
    longestUnbrokenRead,
    totalWordsReadToday,
    dailyGoalWords,
    selectedInterests,
    baselineLength,
    masteredContexts,
  ]);

  useEffect(() => {
    persistState();
  }, [persistState]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  }, []);

  const toggleSaveArticle = useCallback(
    (articleId: string) => {
      setArticles((prev) => {
        let isNowSaved = false;
        const updated = prev.map((art) => {
          if (art.id === articleId) {
            isNowSaved = !art.saved;
            return { ...art, saved: !art.saved };
          }
          return art;
        });

        // Also sync activeArticle if currently open
        setActiveArticle((curr) =>
          curr && curr.id === articleId ? { ...curr, saved: isNowSaved } : curr
        );

        showToast(isNowSaved ? 'Saved to your Library' : 'Removed from Library');
        return updated;
      });
    },
    [showToast]
  );

  const updateArticleProgress = useCallback((articleId: string, percent: number) => {
    setArticles((prev) =>
      prev.map((art) => (art.id === articleId ? { ...art, progressPercent: percent } : art))
    );
    setActiveArticle((curr) =>
      curr && curr.id === articleId ? { ...curr, progressPercent: percent } : curr
    );
  }, []);

  const recordSessionWords = useCallback(
    (words: number) => {
      if (words <= 0) return;
      setSessionWordsRead((prev) => prev + words);
      setTotalWordsReadToday((prev) => prev + words);
      setLongestUnbrokenRead((prev) => Math.max(prev, words));

      // Boost the latest rolling average bar
      setRollingAverages((prev) => {
        const next = [...prev];
        const lastIdx = next.length - 1;
        next[lastIdx] = Math.min(100, (next[lastIdx] || 80) + 2);
        return next;
      });
    },
    []
  );

  const markArticleComplete = useCallback(
    (articleId: string) => {
      let targetArticle: ArticleWithQuiz | undefined;
      setArticles((prev) =>
        prev.map((art) => {
          if (art.id === articleId) {
            targetArticle = art;
            return {
              ...art,
              progressPercent: 100,
              completed: true,
              lastReadAt: new Date().toISOString(),
            };
          }
          return art;
        })
      );

      if (targetArticle) {
        recordSessionWords(targetArticle.wordCount);

        // Add to mastered contexts if not already present
        setMasteredContexts((prev) => {
          if (prev.some((mc) => mc.id === `mc-${targetArticle!.id}`)) return prev;
          return [
            {
              id: `mc-${targetArticle!.id}`,
              topic: targetArticle!.topic,
              title: targetArticle!.title || targetArticle!.topic,
              description: targetArticle!.excerpt,
              completedAt: 'Just now',
            },
            ...prev,
          ];
        });
      }
    },
    [recordSessionWords]
  );

  const completeQuickCheck = useCallback(
    (earnedXp: number, articleId?: string) => {
      setXp((prev) => prev + earnedXp);
      setStaminaLevel((prev) => Math.min(100, prev + 2));

      if (articleId) {
        markArticleComplete(articleId);
      }

      showToast(`+${earnedXp} XP! Attention stamina increased to ${staminaLevel + 2}`);
      setQuickCheckOpen(false);
    },
    [markArticleComplete, showToast, staminaLevel]
  );

  const completePathNode = useCallback(
    (nodeId: number) => {
      setPathNodes((prev) => {
        return prev.map((node) => {
          if (node.id === nodeId) {
            return { ...node, status: 'completed' };
          }
          if (node.id === nodeId + 1 && node.status === 'locked') {
            return { ...node, status: 'current' };
          }
          return node;
        });
      });

      setStaminaLevel((prev) => Math.min(100, prev + 3));
      setXp((prev) => prev + 100);
      showToast(`Node 0${nodeId} Completed! +100 XP`);
    },
    [showToast]
  );

  const saveOnboardingPreferences = useCallback(
    (interests: string[], length: number) => {
      setSelectedInterests(interests);
      setBaselineLength(length);
      const newStamina = length <= 30 ? 25 : length <= 140 ? 34 : 50;
      setStaminaLevel(newStamina);
      showToast(
        `Calibrated with ${interests.length} topics & ${length}W baseline!`
      );
      setOnboardingOpen(false);
    },
    [showToast]
  );

  const openReader = useCallback((article: ArticleWithQuiz) => {
    setActiveArticle(article);
  }, []);

  const closeReader = useCallback(() => {
    setActiveArticle(null);
  }, []);

  const openQuickCheck = useCallback((article?: ArticleWithQuiz) => {
    setQuickCheckArticle(article || null);
    setQuickCheckOpen(true);
  }, []);

  const closeQuickCheck = useCallback(() => {
    setQuickCheckOpen(false);
  }, []);

  return (
    <AttentionTrainerContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        articles,
        activeArticle,
        pathNodes,
        staminaLevel,
        xp,
        longestUnbrokenRead,
        sessionWordsRead,
        totalWordsReadToday,
        dailyGoalWords,
        masteredContexts,
        selectedInterests,
        baselineLength,
        rollingAverages,
        quickCheckOpen,
        quickCheckArticle,
        onboardingOpen,
        toastMessage,
        toggleSaveArticle,
        updateArticleProgress,
        markArticleComplete,
        completeQuickCheck,
        completePathNode,
        saveOnboardingPreferences,
        openReader,
        closeReader,
        openQuickCheck,
        closeQuickCheck,
        setOnboardingOpen,
        showToast,
        recordSessionWords,
      }}
    >
      {children}
    </AttentionTrainerContext.Provider>
  );
}

export function useAttentionTrainer() {
  const context = useContext(AttentionTrainerContext);
  if (!context) {
    throw new Error('useAttentionTrainer must be used within an AttentionTrainerProvider');
  }
  return context;
}
