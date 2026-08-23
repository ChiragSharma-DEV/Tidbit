'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface QuickCheckOption {
  key: string;
  text: string;
  isCorrect: boolean;
}

export interface QuickCheckQuiz {
  question: string;
  nodeStep?: string;
  options: QuickCheckOption[];
  explanation: string;
}

export interface ArticleWithQuiz {
  id: string;
  type: 'short' | 'medium' | 'long' | 'refresher';
  topic: string;
  title?: string;
  excerpt: string;
  paragraphs?: string[];
  wordCount: number;
  progressPercent: number;
  highlightWords?: string[];
  pullQuote?: {
    quote: string;
    author: string;
  };
  keyTakeaway?: string;
  saved?: boolean;
  completed?: boolean;
  quiz?: QuickCheckQuiz;
  lastReadAt?: string;
  difficultyLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  analogy?: string;
}

export interface PathNode {
  id: number;
  numberStr: string;
  title: string;
  highlightWord?: string;
  description: string;
  wordCount: number;
  status: 'completed' | 'current' | 'locked';
}

export interface SkillTreeNode {
  id: number;
  numberStr: string;
  title: string;
  shortTitle: string;
  icon: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  stars: 1 | 2 | 3;
  description: string;
  analogy: string;
  wordCount: number;
  readTimeMins: number;
  status: 'completed' | 'current' | 'locked';
  xpAward: number;
  quiz: QuickCheckQuiz;
}

export interface MasteredContext {
  id: string;
  topic: string;
  title: string;
  description: string;
  completedAt: string;
  difficultyLevel?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  isGuest?: boolean;
}

export interface StreakDay {
  day: string;
  dateStr: string;
  isToday: boolean;
  completed: boolean;
  wordsRead: number;
}

export interface StaminaHistoryItem {
  sessionPeriod: string;
  sessionCountLabel: string;
  avgMinutes: number;
  avgWords: number;
  dateRange: string;
}

export const DEFAULT_ARTICLES: ArticleWithQuiz[] = [
  {
    id: 'art-ai-intro',
    type: 'short',
    topic: 'AI & Machine Learning',
    difficultyLevel: 'Beginner',
    title: 'How AI Reads: The Autocomplete Analogy',
    excerpt: 'Imagine a supercharged autocomplete that has read the entire internet. It does not "think" with human feelings; it calculates the most likely next word with precision.',
    analogy: 'Like guessing the next word a close friend is going to say based on years of conversations.',
    paragraphs: [
      `At its core, a Large Language Model (LLM) is not a conscious entity trapped inside silicon. Instead, think of it as an extraordinarily sophisticated prediction engine.`,
      `When you type "The sky is...", the model calculates the statistical probability of every word in its vocabulary. "Blue" might score 88%, "cloudy" 9%, and "cheeseburger" 0.0001%. It selects tokens one by one, building sentences that sound strikingly human.`,
      `By understanding that AI is statistical pattern recognition rather than magic, we learn to prompt it with structured constraints rather than emotional appeals.`,
    ],
    wordCount: 85,
    progressPercent: 100,
    completed: true,
    highlightWords: ['prediction', 'statistical', 'constraints', 'tokens'],
    pullQuote: {
      quote: 'AI is not magic. It is the mathematics of high-dimensional next-word probability.',
      author: 'ANDREJ KARPATHY',
    },
    keyTakeaway: 'AI models predict the next most probable word based on patterns in their training data.',
    saved: true,
    quiz: {
      question: 'What is the fundamental mechanism behind large language models?',
      nodeStep: 'ESSAY CHECK · AI FOUNDATIONS',
      options: [
        { key: 'A', text: 'Statistical probability of predicting the next token', isCorrect: true },
        { key: 'B', text: 'Conscious human-like emotional reasoning', isCorrect: false },
        { key: 'C', text: 'Direct keyword lookup in a hardcoded database', isCorrect: false },
        { key: 'D', text: 'Randomly picking words from a dictionary', isCorrect: false },
      ],
      explanation: 'Language models assign mathematical probabilities to upcoming tokens based on context patterns learned during training.',
    },
  },
  {
    id: 'art-ai-edge',
    type: 'medium',
    topic: 'AI & Machine Learning',
    difficultyLevel: 'Intermediate',
    title: 'Small Language Models: Fast, Private, On-Device Intelligence',
    excerpt: 'Why send every question to a massive cloud datacenter when a lightweight 3-billion parameter model can run instantly on your laptop or phone?',
    analogy: 'A pocket Swiss Army knife on your keychain vs driving to a giant hardware store for a screwdriver.',
    paragraphs: [
      `For years, the AI narrative was dominated by "bigger is better." Trillion-parameter frontier models achieved remarkable general reasoning, but at steep computing costs and high latency.`,
      `Small Language Models (SLMs)—ranging from 1B to 7B parameters—represent a pivotal shift. Through technique known as quantization (reducing decimal precision from 16-bit to 4-bit) and domain fine-tuning, these compact models run locally on consumer chips.`,
      `On-device execution guarantees zero network latency, offline operation, and 100% privacy because your personal data never leaves your hardware.`,
    ],
    wordCount: 165,
    progressPercent: 35,
    highlightWords: ['quantization', 'latency', 'privacy', 'fine-tuning'],
    keyTakeaway: 'Small models trade encyclopedic trivia for instant edge speed, zero server costs, and complete privacy.',
    saved: true,
    quiz: {
      question: 'What is a primary benefit of running Small Language Models on edge devices?',
      nodeStep: 'ESSAY CHECK · EDGE AI',
      options: [
        { key: 'A', text: 'Complete privacy and zero latency by processing locally', isCorrect: true },
        { key: 'B', text: 'Having more parameters than frontier cloud models', isCorrect: false },
        { key: 'C', text: 'Requiring constant high-speed internet connectivity', isCorrect: false },
        { key: 'D', text: 'Replacing all distributed databases with hardware chips', isCorrect: false },
      ],
      explanation: 'Edge SLMs process prompts directly on local silicon, preserving user privacy and eliminating cloud server lag.',
    },
  },
  {
    id: 'art-attention-residue',
    type: 'medium',
    topic: 'Cognitive Science',
    difficultyLevel: 'Intermediate',
    title: 'Attention Residue: The Hidden Tax of Quick Interruptions',
    excerpt: 'Checking a 5-second Slack message does not cost 5 seconds; it costs up to 23 minutes of mental friction while your brain struggles to clear leftover context.',
    analogy: 'Leaving 50 browser tabs open on an old computer until the whole system stutters.',
    paragraphs: [
      `When you switch from writing an essay to checking an incoming notification, your attention does not transition cleanly. A fragment of your working memory remains stuck on the unfinished message.`,
      `Researcher Sophie Leroy termed this phenomenon "Attention Residue." Even after you return to your primary task, your cognitive throughput is significantly impaired because part of your neural bandwidth is still processing the previous stimulus.`,
      `True intellectual stamina is built by defending unbroken focus blocks, allowing working memory to fully engage with a single problem.`,
    ],
    wordCount: 145,
    progressPercent: 65,
    highlightWords: ['bandwidth', 'residue', 'throughput', 'working memory'],
    pullQuote: {
      quote: 'When you try to focus on everything, you comprehend nothing deeply.',
      author: 'DR. GLORIA MARK',
    },
    keyTakeaway: 'Every context switch leaves mental residue that degrades cognitive depth for over 20 minutes.',
    saved: false,
    quiz: {
      question: 'What happens to human cognition during rapid task-switching?',
      nodeStep: 'ESSAY CHECK · COGNITIVE SCIENCE',
      options: [
        { key: 'A', text: 'Attention residue lingers on prior tasks, reducing mental throughput', isCorrect: true },
        { key: 'B', text: 'Working memory doubles in capacity automatically', isCorrect: false },
        { key: 'C', text: 'The brain permanently accelerates text comprehension', isCorrect: false },
        { key: 'D', text: 'Neural pathways immediately reset with zero fatigue', isCorrect: false },
      ],
      explanation: 'Attention residue causes parts of working memory to remain focused on the previous task, creating cognitive drag.',
    },
  },
  {
    id: 'art-stoic-control',
    type: 'short',
    topic: 'Philosophy & Stoicism',
    difficultyLevel: 'Beginner',
    title: 'The Dichotomy of Control: Protecting Mental Peace',
    excerpt: 'Epictetus taught a simple filter that eliminates 90% of daily anxiety: Divide every event into what you control vs what you do not.',
    analogy: 'An archer who can aim perfectly, but cannot control a sudden gust of wind once the arrow leaves the bow.',
    paragraphs: [
      `Ancient Stoic philosopher Epictetus opened the Enchiridion with a timeless axiom: "Some things are in our control, and others are not."`,
      `In our control: your attention, your actions, your judgments, your discipline. Not in your control: algorithmic feeds, other people's opinions, market swings, the weather.`,
      `When you direct 100% of your energy exclusively toward what is in your control, anxiety evaporates and deep focus becomes effortless.`,
    ],
    wordCount: 95,
    progressPercent: 100,
    completed: true,
    highlightWords: ['control', 'discipline', 'agency', 'judgment'],
    keyTakeaway: 'Focus only on your inputs and discipline; release attachment to uncontrollable external outcomes.',
    saved: true,
    quiz: {
      question: 'According to Stoic philosophy, what falls strictly within your control?',
      nodeStep: 'ESSAY CHECK · STOICISM',
      options: [
        { key: 'A', text: 'Your conscious attention, judgments, and deliberate actions', isCorrect: true },
        { key: 'B', text: 'The opinions of others on social media feeds', isCorrect: false },
        { key: 'C', text: 'Global market volatility and macroeconomic swings', isCorrect: false },
        { key: 'D', text: 'The exact timing of sudden external events', isCorrect: false },
      ],
      explanation: 'Epictetus emphasized that only our internal intentions, decisions, and attention are within our agency.',
    },
  },
  {
    id: 'art-growth-cac-ltv',
    type: 'long',
    topic: 'Growth & Marketing',
    difficultyLevel: 'Advanced',
    title: 'CAC to LTV Payback: The Golden Rule of Sustainable Growth',
    excerpt: 'A business is only as healthy as its unit economics. If acquiring a customer costs $100 but they generate $300 over their lifetime, you have a repeatable engine.',
    analogy: 'Planting seeds that yield 3x the fruit needed to buy more seeds each harvest.',
    paragraphs: [
      `In venture-backed and bootstrapped ventures alike, vanity metrics like gross signups often mask financial decay. The true health of any product engine is governed by the ratio between Customer Acquisition Cost (CAC) and Lifetime Value (LTV).`,
      `A healthy benchmark ratio is 3:1 (LTV is three times CAC). If your ratio is 1:1, you are burning capital on customer acquisition without creating enterprise value. If it is 5:1+, you are likely under-investing in growth.`,
      `Equally vital is the Payback Period: how many months of customer revenue are required to fully recover the CAC. Top-quartile software products aim for payback within 6 to 12 months, enabling continuous reinvestment into viral distribution.`,
    ],
    wordCount: 220,
    progressPercent: 20,
    highlightWords: ['payback', 'unit economics', 'retention', 'cac-ltv'],
    keyTakeaway: 'Aim for a 3:1 LTV:CAC ratio with a payback period under 12 months for compounding growth.',
    saved: false,
    quiz: {
      question: 'What is considered an ideal, healthy target for the LTV to CAC ratio in growth companies?',
      nodeStep: 'ESSAY CHECK · UNIT ECONOMICS',
      options: [
        { key: 'A', text: '3:1 (LTV is three times the cost of acquisition)', isCorrect: true },
        { key: 'B', text: '1:1 (LTV equals CAC exactly)', isCorrect: false },
        { key: 'C', text: '0.5:1 (Spending twice as much on acquisition as lifetime value)', isCorrect: false },
        { key: 'D', text: '100:1 with zero marketing expenditure', isCorrect: false },
      ],
      explanation: 'A 3:1 ratio provides a strong margin of safety while leaving enough capital to reinvest in acquisition and product development.',
    },
  },
];

export const NICHE_SKILL_TREES: Record<string, SkillTreeNode[]> = {
  'AI & Machine Learning': [
    {
      id: 1,
      numberStr: '01',
      title: 'Neural Autocomplete & Tokens',
      shortTitle: 'AI Tokens',
      icon: 'smart_toy',
      category: 'AI & Tech',
      difficulty: 'Beginner',
      stars: 1,
      description: 'How language models break sentences into token chunks and predict next words using statistical weights.',
      analogy: 'Like guessing the next word a friend says based on years of conversation habits.',
      wordCount: 80,
      readTimeMins: 2,
      status: 'completed',
      xpAward: 60,
      quiz: {
        question: 'How do neural models process text?',
        nodeStep: 'SKILL NODE 01',
        options: [
          { key: 'A', text: 'They tokenize text into sub-words and predict probabilistic next tokens', isCorrect: true },
          { key: 'B', text: 'They store fixed sentences in a dictionary lookup table', isCorrect: false },
          { key: 'C', text: 'They read entire books as one unified image pixel', isCorrect: false },
          { key: 'D', text: 'They generate words purely by random dice rolls', isCorrect: false },
        ],
        explanation: 'Models split text into tokens (sub-words) and calculate probability distributions for the next token.',
      },
    },
    {
      id: 2,
      numberStr: '02',
      title: 'Small Language Models & Edge AI',
      shortTitle: 'Edge Models',
      icon: 'memory',
      category: 'AI & Tech',
      difficulty: 'Intermediate',
      stars: 2,
      description: 'Why 3B-7B parameter models running directly on smartphones provide zero-latency and 100% data privacy.',
      analogy: 'Having a smart assistant in your pocket vs waiting on hold with an overseas call center.',
      wordCount: 160,
      readTimeMins: 4,
      status: 'completed',
      xpAward: 90,
      quiz: {
        question: 'What is the main benefit of edge-quantized models?',
        nodeStep: 'SKILL NODE 02',
        options: [
          { key: 'A', text: 'Local private execution without internet lag or server costs', isCorrect: true },
          { key: 'B', text: 'Higher memory consumption than cloud datacenters', isCorrect: false },
          { key: 'C', text: 'Requires thousands of server GPUs to run', isCorrect: false },
          { key: 'D', text: 'Zero mathematical weight quantization', isCorrect: false },
        ],
        explanation: 'Quantized models fit onto device RAM, ensuring private, offline, low-latency execution.',
      },
    },
    {
      id: 3,
      numberStr: '03',
      title: 'Transformer Self-Attention',
      shortTitle: 'Self-Attention',
      icon: 'neurology',
      category: 'AI & Tech',
      difficulty: 'Intermediate',
      stars: 2,
      description: 'Understanding Query, Key, and Value matrices that allow models to link words across long paragraphs simultaneously.',
      analogy: 'A searchlight that instantly highlights related clues across an entire detective board.',
      wordCount: 240,
      readTimeMins: 6,
      status: 'current',
      xpAward: 120,
      quiz: {
        question: 'What makes the transformer self-attention mechanism revolutionary?',
        nodeStep: 'SKILL NODE 03',
        options: [
          { key: 'A', text: 'It connects every word in a sequence simultaneously in parallel', isCorrect: true },
          { key: 'B', text: 'It forces the computer to read strictly one letter at a time', isCorrect: false },
          { key: 'C', text: 'It completely eliminates all mathematical matrices', isCorrect: false },
          { key: 'D', text: 'It only works for black and white text files', isCorrect: false },
        ],
        explanation: 'Self-attention processes entire contexts in parallel, calculating attention weights between all token pairs.',
      },
    },
    {
      id: 4,
      numberStr: '04',
      title: 'KV-Cache & Context Expansion',
      shortTitle: 'KV-Caching',
      icon: 'dynamic_feed',
      category: 'AI & Tech',
      difficulty: 'Advanced',
      stars: 3,
      description: 'Memory optimization techniques that store past token keys and values so generating new words stays fast.',
      analogy: 'Taking shorthand notes during a lecture so you never have to re-listen to the whole recording.',
      wordCount: 360,
      readTimeMins: 9,
      status: 'locked',
      xpAward: 160,
      quiz: {
        question: 'Why is KV-caching critical during autoregressive generation?',
        nodeStep: 'SKILL NODE 04',
        options: [
          { key: 'A', text: 'It avoids re-computing attention keys/values for previous tokens', isCorrect: true },
          { key: 'B', text: 'It deletes all user conversations immediately', isCorrect: false },
          { key: 'C', text: 'It converts neural networks into simple HTML files', isCorrect: false },
          { key: 'D', text: 'It requires zero RAM on the host GPU', isCorrect: false },
        ],
        explanation: 'Without KV-cache, every single token generation would require re-calculating attention over the entire prompt.',
      },
    },
    {
      id: 5,
      numberStr: '05',
      title: 'Autonomous Reasoning Loops',
      shortTitle: 'Agent Loops',
      icon: 'psychology',
      category: 'AI & Tech',
      difficulty: 'Advanced',
      stars: 3,
      description: 'Chaining tool calls, state memory, and reflective verification to build autonomous problem-solving agents.',
      analogy: 'A scientist who formulates a hypothesis, runs an experiment, reviews results, and iterates until proven.',
      wordCount: 450,
      readTimeMins: 12,
      status: 'locked',
      xpAward: 200,
      quiz: {
        question: 'What distinguishes an agentic loop from a standard one-shot prompt?',
        nodeStep: 'SKILL NODE 05',
        options: [
          { key: 'A', text: 'Iterative action, tool use, environment feedback, and self-correction', isCorrect: true },
          { key: 'B', text: 'Using fewer than 10 tokens per prompt', isCorrect: false },
          { key: 'C', text: 'Running exclusively without an operating system', isCorrect: false },
          { key: 'D', text: 'Relying solely on hardcoded if-else statements', isCorrect: false },
        ],
        explanation: 'Agents interact with external tools and check output against goal criteria in persistent execution loops.',
      },
    },
  ],

  'Growth & Marketing': [
    {
      id: 1,
      numberStr: '01',
      title: 'AARRR Pirate Funnel',
      shortTitle: 'Pirate Funnel',
      icon: 'filter_alt',
      category: 'Growth',
      difficulty: 'Beginner',
      stars: 1,
      description: 'The classic stages of product-led growth: Acquisition, Activation, Retention, Referral, and Revenue.',
      analogy: 'Welcoming guests to a restaurant, making sure the first bite is delicious, and having them invite friends.',
      wordCount: 90,
      readTimeMins: 2,
      status: 'completed',
      xpAward: 60,
      quiz: {
        question: 'Which stage of the AARRR funnel represents the user experiencing their first "aha!" value moment?',
        nodeStep: 'SKILL NODE 01',
        options: [
          { key: 'A', text: 'Activation', isCorrect: true },
          { key: 'B', text: 'Acquisition', isCorrect: false },
          { key: 'C', text: 'Revenue', isCorrect: false },
          { key: 'D', text: 'Referral', isCorrect: false },
        ],
        explanation: 'Activation is when a newly acquired user experiences the core value proposition of the product.',
      },
    },
    {
      id: 2,
      numberStr: '02',
      title: 'CAC to LTV Unit Economics',
      shortTitle: 'Unit Economics',
      icon: 'trending_up',
      category: 'Growth',
      difficulty: 'Intermediate',
      stars: 2,
      description: 'Balancing customer acquisition costs against lifetime revenue to ensure profitable, compounding growth.',
      analogy: 'Spending $10 to plant a tree that reliably produces $30 of fruit every year.',
      wordCount: 180,
      readTimeMins: 4,
      status: 'current',
      xpAward: 90,
      quiz: {
        question: 'What is the benchmark LTV:CAC ratio for sustainable growth businesses?',
        nodeStep: 'SKILL NODE 02',
        options: [
          { key: 'A', text: '3:1 or higher', isCorrect: true },
          { key: 'B', text: '0.5:1', isCorrect: false },
          { key: 'C', text: '1:1', isCorrect: false },
          { key: 'D', text: 'Zero margin', isCorrect: false },
        ],
        explanation: 'A 3:1 ratio provides solid gross margins and covers overhead, churn, and channel testing.',
      },
    },
    {
      id: 3,
      numberStr: '03',
      title: 'Viral Distribution Loops & K-Factor',
      shortTitle: 'Viral Loops',
      icon: 'share',
      category: 'Growth',
      difficulty: 'Intermediate',
      stars: 2,
      description: 'Designing user actions that naturally expose the product to new potential users with minimal friction.',
      analogy: 'A multiplayer game where inviting teammates is essential to playing the game.',
      wordCount: 260,
      readTimeMins: 6,
      status: 'locked',
      xpAward: 120,
      quiz: {
        question: 'When is a viral loop self-sustaining without paid marketing?',
        nodeStep: 'SKILL NODE 03',
        options: [
          { key: 'A', text: 'When the viral coefficient K-factor is greater than 1.0', isCorrect: true },
          { key: 'B', text: 'When ad spend exceeds total revenue', isCorrect: false },
          { key: 'C', text: 'When users are prohibited from sharing links', isCorrect: false },
          { key: 'D', text: 'When K-factor is exactly 0.0', isCorrect: false },
        ],
        explanation: 'K > 1 means each existing user brings in more than one new user on average, generating exponential viral growth.',
      },
    },
    {
      id: 4,
      numberStr: '04',
      title: 'Cohort Retention & Decay Curves',
      shortTitle: 'Cohort Retention',
      icon: 'insights',
      category: 'Growth',
      difficulty: 'Advanced',
      stars: 3,
      description: 'Grouping users by signup month and flattening the retention curve into a stable asymptote of true advocates.',
      analogy: 'A bucket that stops leaking once only the most loyal water droplets remain at the bottom.',
      wordCount: 370,
      readTimeMins: 9,
      status: 'locked',
      xpAward: 160,
      quiz: {
        question: 'What does a flattening retention curve indicate?',
        nodeStep: 'SKILL NODE 04',
        options: [
          { key: 'A', text: 'True product-market fit with a core group of persistent active users', isCorrect: true },
          { key: 'B', text: 'That all users have churned completely', isCorrect: false },
          { key: 'C', text: 'That the database is experiencing high latency', isCorrect: false },
          { key: 'D', text: 'That marketing budgets should be stopped immediately', isCorrect: false },
        ],
        explanation: 'A flattened retention curve shows that a consistent cohort of users stays engaged indefinitely.',
      },
    },
    {
      id: 5,
      numberStr: '05',
      title: 'Category Design & Power Laws',
      shortTitle: 'Category Design',
      icon: 'workspace_premium',
      category: 'Growth',
      difficulty: 'Advanced',
      stars: 3,
      description: 'Creating and dominating an entirely new market category where you write the rules and capture 76% of economics.',
      analogy: 'Inventing the electric guitar instead of competing to make a slightly louder acoustic guitar.',
      wordCount: 460,
      readTimeMins: 12,
      status: 'locked',
      xpAward: 200,
      quiz: {
        question: 'What is the goal of category design?',
        nodeStep: 'SKILL NODE 05',
        options: [
          { key: 'A', text: 'To frame a new problem and define the category so your product is the only logical answer', isCorrect: true },
          { key: 'B', text: 'To copy existing competitors and lower prices by 5%', isCorrect: false },
          { key: 'C', text: 'To eliminate all branding from your website', isCorrect: false },
          { key: 'D', text: 'To avoid patenting any proprietary technology', isCorrect: false },
        ],
        explanation: 'Category kings educate the market on a new problem and capture the vast majority of category economics.',
      },
    },
  ],

  'Cognitive Science': [
    {
      id: 1,
      numberStr: '01',
      title: 'Single-Tasking & Attention Bandwidth',
      shortTitle: 'Single Tasking',
      icon: 'center_focus_strong',
      category: 'Mind & Focus',
      difficulty: 'Beginner',
      stars: 1,
      description: 'Human conscious attention is a serial processor. Multitasking is an illusion that reduces IQ and focus depth.',
      analogy: 'A single high-power laser beam vs a scattered flashlight bulb.',
      wordCount: 85,
      readTimeMins: 2,
      status: 'completed',
      xpAward: 60,
      quiz: {
        question: 'What does scientific research show about human multitasking?',
        nodeStep: 'SKILL NODE 01',
        options: [
          { key: 'A', text: 'The brain rapidly switches between tasks, degrading performance on both', isCorrect: true },
          { key: 'B', text: 'The human brain can process 10 complex tasks simultaneously in parallel', isCorrect: false },
          { key: 'C', text: 'Multitasking increases reading speed by 300%', isCorrect: false },
          { key: 'D', text: 'Working memory expands with each open browser window', isCorrect: false },
        ],
        explanation: 'Cognitive research proves multitasking is rapid context-switching with high cognitive switching penalties.',
      },
    },
    {
      id: 2,
      numberStr: '02',
      title: 'Attention Residue & Switch Costs',
      shortTitle: 'Attention Residue',
      icon: 'psychology',
      category: 'Mind & Focus',
      difficulty: 'Intermediate',
      stars: 2,
      description: 'How checking quick messages leaves unfinished mental loops that penalize creative thinking for up to 23 minutes.',
      analogy: 'Leaving messy cooking pots on the stove while trying to bake a delicate soufflé.',
      wordCount: 170,
      readTimeMins: 4,
      status: 'completed',
      xpAward: 90,
      quiz: {
        question: 'What is attention residue?',
        nodeStep: 'SKILL NODE 02',
        options: [
          { key: 'A', text: 'Lingering cognitive engagement on an incomplete prior task', isCorrect: true },
          { key: 'B', text: 'Physical eye strain caused by reading in dim light', isCorrect: false },
          { key: 'C', text: 'The permanent loss of vocabulary due to aging', isCorrect: false },
          { key: 'D', text: 'A computer virus that infects text editors', isCorrect: false },
        ],
        explanation: 'Attention residue occurs when working memory remains partially tethered to a previous interruption.',
      },
    },
    {
      id: 3,
      numberStr: '03',
      title: '4-Chunk Working Memory Capacity',
      shortTitle: 'Working Memory',
      icon: 'hub',
      category: 'Mind & Focus',
      difficulty: 'Intermediate',
      stars: 2,
      description: 'Cognitive load theory reveals human short-term memory holds only ~4 chunks. Cluttered design destroys understanding.',
      analogy: 'A small table that can only comfortably hold 4 dinner plates at one time.',
      wordCount: 250,
      readTimeMins: 6,
      status: 'current',
      xpAward: 120,
      quiz: {
        question: 'According to Nelson Cowan, how many information chunks can working memory hold simultaneously?',
        nodeStep: 'SKILL NODE 03',
        options: [
          { key: 'A', text: 'Approximately 4 chunks', isCorrect: true },
          { key: 'B', text: '50 to 100 chunks', isCorrect: false },
          { key: 'C', text: 'Unlimited chunks', isCorrect: false },
          { key: 'D', text: 'Only 1 letter', isCorrect: false },
        ],
        explanation: 'Modern cognitive science establishes working memory capacity at roughly 4 discrete chunks without rehearsal.',
      },
    },
    {
      id: 4,
      numberStr: '04',
      title: 'Circadian Peak & Ultradian Rhythms',
      shortTitle: 'Ultradian Rhythms',
      icon: 'schedule',
      category: 'Mind & Focus',
      difficulty: 'Advanced',
      stars: 3,
      description: 'Aligning 90-minute deep work sprints with natural biological alertness cycles and physiological reset periods.',
      analogy: 'Surfing on top of ocean waves instead of paddling against the incoming tide.',
      wordCount: 380,
      readTimeMins: 9,
      status: 'locked',
      xpAward: 160,
      quiz: {
        question: 'What is an ultradian cycle in human performance?',
        nodeStep: 'SKILL NODE 04',
        options: [
          { key: 'A', text: 'A ~90-minute cycle of peak mental energy followed by a 15-minute trough', isCorrect: true },
          { key: 'B', text: 'A monthly seasonal weather pattern', isCorrect: false },
          { key: 'C', text: 'An uninterrupted 24-hour reading marathon', isCorrect: false },
          { key: 'D', text: 'A heart rate metric during intense sprint exercise', isCorrect: false },
        ],
        explanation: 'Human biology operates in ~90-minute ultradian cycles where focus peaks before requiring a short recharge.',
      },
    },
    {
      id: 5,
      numberStr: '05',
      title: 'Flow State Induction & High-Signal Habits',
      shortTitle: 'Flow State Mastery',
      icon: 'bolt',
      category: 'Mind & Focus',
      difficulty: 'Advanced',
      stars: 3,
      description: 'Engineering the optimal ratio of challenge to skill, clear feedback loops, and zero environmental distractions.',
      analogy: 'A musician getting completely lost in the rhythm of a master concerto.',
      wordCount: 470,
      readTimeMins: 12,
      status: 'locked',
      xpAward: 200,
      quiz: {
        question: 'What is the primary condition for entering a psychological flow state?',
        nodeStep: 'SKILL NODE 05',
        options: [
          { key: 'A', text: 'A balance where the challenge level slightly stretches your highest skill capacity', isCorrect: true },
          { key: 'B', text: 'Doing repetitive, boring tasks with constant television noise', isCorrect: false },
          { key: 'C', text: 'Switching between 20 tasks every 3 minutes', isCorrect: false },
          { key: 'D', text: 'Having zero goals or immediate feedback', isCorrect: false },
        ],
        explanation: 'Mihaly Csikszentmihalyi found flow occurs when high challenge meets high skill with clear, immediate feedback.',
      },
    },
  ],

  'Philosophy & Stoicism': [
    {
      id: 1,
      numberStr: '01',
      title: 'Dichotomy of Control (Epictetus)',
      shortTitle: 'Stoic Control',
      icon: 'self_improvement',
      category: 'Philosophy',
      difficulty: 'Beginner',
      stars: 1,
      description: 'Separating reality into what is in your power vs what is not to eliminate anxiety and protect cognitive energy.',
      analogy: 'An archer who aims with total focus, but accepts that wind can blow once the arrow flies.',
      wordCount: 85,
      readTimeMins: 2,
      status: 'completed',
      xpAward: 60,
      quiz: {
        question: 'What is in our control according to Epictetus?',
        nodeStep: 'SKILL NODE 01',
        options: [
          { key: 'A', text: 'Our actions, judgments, desires, and focus', isCorrect: true },
          { key: 'B', text: 'The weather, stock market, and other people’s thoughts', isCorrect: false },
          { key: 'C', text: 'The physical laws of gravity', isCorrect: false },
          { key: 'D', text: 'External algorithm feed changes', isCorrect: false },
        ],
        explanation: 'Stoicism teaches that our agency lies entirely in internal judgment, intention, and deliberate action.',
      },
    },
    {
      id: 2,
      numberStr: '02',
      title: 'Inversion Thinking (Jacobi)',
      shortTitle: 'Inversion Thinking',
      icon: 'swap_vert',
      category: 'Philosophy',
      difficulty: 'Intermediate',
      stars: 2,
      description: '“Invert, always invert.” Instead of asking how to succeed, ask how you could guarantee catastrophic failure and avoid it.',
      analogy: 'Planning a safe mountain hike by studying where previous climbers tripped and fell.',
      wordCount: 175,
      readTimeMins: 4,
      status: 'current',
      xpAward: 90,
      quiz: {
        question: 'How does inversion thinking improve decision making?',
        nodeStep: 'SKILL NODE 02',
        options: [
          { key: 'A', text: 'By identifying and avoiding the exact paths that guarantee failure', isCorrect: true },
          { key: 'B', text: 'By assuming everything will work out perfectly without effort', isCorrect: false },
          { key: 'C', text: 'By flipping coin tosses for every choice', isCorrect: false },
          { key: 'D', text: 'By ignoring all potential risks', isCorrect: false },
        ],
        explanation: 'Inversion illuminates hidden hazards by methodically solving the reverse of your intended goal.',
      },
    },
    {
      id: 3,
      numberStr: '03',
      title: 'Antifragility & Convexity (Taleb)',
      shortTitle: 'Antifragility',
      icon: 'balance',
      category: 'Philosophy',
      difficulty: 'Intermediate',
      stars: 2,
      description: 'Building habits and mental models that gain strength from volatility, stress, and surprises rather than shattering.',
      analogy: 'Bones and muscles that grow denser and stronger after lifting heavy weights.',
      wordCount: 260,
      readTimeMins: 6,
      status: 'locked',
      xpAward: 120,
      quiz: {
        question: 'What defines an antifragile system?',
        nodeStep: 'SKILL NODE 03',
        options: [
          { key: 'A', text: 'It benefits and grows stronger from disorder, stressors, and volatility', isCorrect: true },
          { key: 'B', text: 'It breaks immediately when exposed to any minor disturbance', isCorrect: false },
          { key: 'C', text: 'It remains completely unchanged under any circumstance', isCorrect: false },
          { key: 'D', text: 'It requires zero inputs to exist', isCorrect: false },
        ],
        explanation: 'Antifragility goes beyond resilience; resilient resists shock, while antifragile actually improves from stress.',
      },
    },
    {
      id: 4,
      numberStr: '04',
      title: 'Memento Mori & Radical Clarity',
      shortTitle: 'Memento Mori',
      icon: 'hourglass_empty',
      category: 'Philosophy',
      difficulty: 'Advanced',
      stars: 3,
      description: 'Using the awareness of our finite lifespan as a sharp lens to cut away trivial distractions and honor each hour.',
      analogy: 'Checking your flight departure timer so you never waste time in line for novelty souvenirs.',
      wordCount: 390,
      readTimeMins: 9,
      status: 'locked',
      xpAward: 160,
      quiz: {
        question: 'What is the practical psychological purpose of Memento Mori in Stoicism?',
        nodeStep: 'SKILL NODE 04',
        options: [
          { key: 'A', text: 'To cut through superficial trivialities and focus intensely on meaningful work', isCorrect: true },
          { key: 'B', text: 'To cause despair and nihilistic hopelessness', isCorrect: false },
          { key: 'C', text: 'To memorize historical battlefield dates', isCorrect: false },
          { key: 'D', text: 'To predict the exact future date of world events', isCorrect: false },
        ],
        explanation: 'Remembering mortality provides acute clarity, helping humans shed petty trivialities and act with urgency.',
      },
    },
    {
      id: 5,
      numberStr: '05',
      title: 'First-Principles Deconstruction',
      shortTitle: 'First Principles',
      icon: 'account_tree',
      category: 'Philosophy',
      difficulty: 'Advanced',
      stars: 3,
      description: 'Boiling down complex systems to fundamental ground truths and reasoning upward rather than blindly copying.',
      analogy: 'Taking apart a clock into springs and gears to understand time, rather than looking at another clock’s face.',
      wordCount: 480,
      readTimeMins: 12,
      status: 'locked',
      xpAward: 200,
      quiz: {
        question: 'What does reasoning from first principles require?',
        nodeStep: 'SKILL NODE 05',
        options: [
          { key: 'A', text: 'Breaking problems down to essential fundamental truths and reasoning upward', isCorrect: true },
          { key: 'B', text: 'Copying what everyone else in the industry is already doing', isCorrect: false },
          { key: 'C', text: 'Accepting traditional dogma without questioning', isCorrect: false },
          { key: 'D', text: 'Rejecting all empirical scientific data', isCorrect: false },
        ],
        explanation: 'First-principles reasoning cuts through analogy and dogma to construct novel solutions from bedrock facts.',
      },
    },
  ],
};

export function generatePathNodesForLevel(level: 1 | 2 | 3): PathNode[] {
  if (level === 1) {
    return [
      {
        id: 1,
        numberStr: '01',
        title: 'The Autocomplete Analogy & Token Basics',
        highlightWord: 'Autocomplete',
        description: 'How AI calculates probabilities for words using simple analogies.',
        wordCount: 80,
        status: 'completed',
      },
      {
        id: 2,
        numberStr: '02',
        title: 'Single-Tasking: Stopping Notification Friction',
        highlightWord: 'Single-Tasking',
        description: 'Defending unbroken 15-minute focus intervals.',
        wordCount: 100,
        status: 'current',
      },
      {
        id: 3,
        numberStr: '03',
        title: 'The Dichotomy of Control in Daily Focus',
        highlightWord: 'Control',
        description: 'Filtering what you control vs what you must release.',
        wordCount: 110,
        status: 'locked',
      },
      {
        id: 4,
        numberStr: '04',
        title: 'The Simple Growth Funnel: AARRR',
        highlightWord: 'Funnel',
        description: 'Understanding how products attract and delight visitors.',
        wordCount: 120,
        status: 'locked',
      },
    ];
  }

  if (level === 3) {
    return [
      {
        id: 1,
        numberStr: '01',
        title: 'Transformer Multi-Head Self-Attention',
        highlightWord: 'Self-Attention',
        description: 'Query, Key, and Value dot-products with quadratic context scaling.',
        wordCount: 420,
        status: 'completed',
      },
      {
        id: 2,
        numberStr: '02',
        title: 'Quantization & Low-Rank Adaptation (LoRA)',
        highlightWord: 'Quantization',
        description: 'Compressing FP16 weights into 4-bit precision for local edge execution.',
        wordCount: 520,
        status: 'current',
      },
      {
        id: 3,
        numberStr: '03',
        title: 'Attention Residue & Cognitive Throughput',
        highlightWord: 'Residue',
        description: 'Neural bandwidth recovery times across fragmented multitasking regimes.',
        wordCount: 610,
        status: 'locked',
      },
      {
        id: 4,
        numberStr: '04',
        title: 'High-Dimensional Synthesis & Cross-Lattices',
        highlightWord: 'Synthesis',
        description: 'Synthesizing multi-domain abstractions under sustained deep focus regimes.',
        wordCount: 780,
        status: 'locked',
      },
    ];
  }

  // Level 2 default: Synthesizer
  return [
    {
      id: 1,
      numberStr: '01',
      title: 'What a Model Is & How Weights Adjust',
      highlightWord: 'Model',
      description: 'Understanding neural weights, training datasets, and parameter efficiency.',
      wordCount: 140,
      status: 'completed',
    },
    {
      id: 2,
      numberStr: '02',
      title: 'Small Language Models & Edge Computing',
      highlightWord: 'Edge',
      description: 'Why quantized micro-models run directly on user devices with zero latency.',
      wordCount: 220,
      status: 'current',
    },
    {
      id: 3,
      numberStr: '03',
      title: 'Working Memory & Cognitive Bandwidth',
      highlightWord: 'Memory',
      description: 'The science of how 4-chunk working memory processes structured text.',
      wordCount: 280,
      status: 'locked',
    },
    {
      id: 4,
      numberStr: '04',
      title: 'Growth Loops & Payback Dynamics',
      highlightWord: 'Loops',
      description: 'Connecting customer acquisition economics to product distribution loops.',
      wordCount: 340,
      status: 'locked',
    },
    {
      id: 5,
      numberStr: '05',
      title: 'Subtractive UI & High-Signal Reading',
      description: 'Eliminating extraneous friction to double comprehension and reading speed.',
      wordCount: 320,
      status: 'locked',
    },
  ];
}

interface AttentionTrainerContextType {
  // Navigation & Core State
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  articles: ArticleWithQuiz[];
  activeArticle: ArticleWithQuiz | null;
  pathNodes: PathNode[];
  staminaLevel: number;
  calibratedLevel: 1 | 2 | 3;
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
  authGatewayOpen: boolean;
  isDarkMode: boolean;
  currentUser: UserProfile | null;
  toastMessage: string | null;

  // Streak & Session Stamina Tracking
  streakDays: number;
  streakWeek: StreakDay[];
  sessionStaminaHistory: StaminaHistoryItem[];
  averageReadingTimeMinutes: { initial: number; current: number; growthPercent: number };
  
  // Duolingo Skill Tree
  nicheSkillTrees: Record<string, SkillTreeNode[]>;
  activeSkillTreeNiche: string;
  setActiveSkillTreeNiche: (niche: string) => void;
  completeSkillTreeNode: (nicheKey: string, nodeId: number) => void;

  // Milestone & Certificate Share Modal
  milestoneModalOpen: boolean;
  activeMilestone: MilestoneCertificate | null;
  openMilestoneModal: (milestone?: Partial<MilestoneCertificate>) => void;
  closeMilestoneModal: () => void;

  // Compose / Creator Studio Modal (UGC)
  composeModalOpen: boolean;
  openComposeModal: () => void;
  closeComposeModal: () => void;
  createAndPublishArticle: (article: ArticleWithQuiz) => void;

  // Actions
  toggleSaveArticle: (articleId: string) => void;
  updateArticleProgress: (articleId: string, percent: number) => void;
  markArticleComplete: (articleId: string) => void;
  completeQuickCheck: (earnedXp: number, articleId?: string) => void;
  completePathNode: (nodeId: number) => void;
  saveOnboardingPreferences: (interests: string[], baselineLength: number, level?: 1 | 2 | 3) => void;
  openReader: (article: ArticleWithQuiz) => void;
  closeReader: () => void;
  openQuickCheck: (article?: ArticleWithQuiz) => void;
  closeQuickCheck: () => void;
  setOnboardingOpen: (open: boolean) => void;
  setAuthGatewayOpen: (open: boolean) => void;
  toggleDarkMode: () => void;
  setDarkMode: (enabled: boolean) => void;
  loginUser: (user: UserProfile) => void;
  logoutUser: () => void;
  showToast: (message: string) => void;
  recordSessionWords: (words: number) => void;
}

export interface MilestoneCertificate {
  id: string;
  recipientName: string;
  topicTitle: string;
  category: string;
  milestoneType: 'topic_unit' | 'streak' | 'stamina_record' | 'tier_calibration';
  level: number;
  wordsMastered: number;
  unbrokenReadingMins: number;
  streakDays: number;
  accuracyPercent: number;
  earnedXp: number;
  issuedDate: string;
  certificateHash: string;
  badgeIcon: string;
  quote?: string;
}

const AttentionTrainerContext = createContext<AttentionTrainerContextType | undefined>(undefined);

const STORAGE_KEY = 'tidbit_attention_trainer_v4';
const THEME_KEY = 'tidbit_theme_mode';
const USER_KEY = 'tidbit_user_session';

export function AttentionTrainerProvider({ children }: { children: React.ReactNode }) {
  const [currentTab, setCurrentTab] = useState<string>('feed');
  const [articles, setArticles] = useState<ArticleWithQuiz[]>(DEFAULT_ARTICLES);
  const [pathNodes, setPathNodes] = useState<PathNode[]>(generatePathNodesForLevel(2));
  const [calibratedLevel, setCalibratedLevel] = useState<1 | 2 | 3>(2);
  const [staminaLevel, setStaminaLevel] = useState<number>(42);
  const [xp, setXp] = useState<number>(450);
  const [longestUnbrokenRead, setLongestUnbrokenRead] = useState<number>(540);
  const [sessionWordsRead, setSessionWordsRead] = useState<number>(1420);
  const [totalWordsReadToday, setTotalWordsReadToday] = useState<number>(1420);
  const [dailyGoalWords, setDailyGoalWords] = useState<number>(2000);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'AI & Machine Learning',
    'Cognitive Science',
    'Growth & Marketing',
    'Philosophy & Stoicism',
  ]);
  const [baselineLength, setBaselineLength] = useState<number>(140);
  const [rollingAverages, setRollingAverages] = useState<number[]>([
    25, 30, 35, 32, 45, 55, 60, 58, 70, 78, 85, 88, 92, 90, 96,
  ]);
  const [masteredContexts, setMasteredContexts] = useState<MasteredContext[]>([
    {
      id: 'mc-1',
      topic: 'Philosophy & Stoicism',
      title: 'Dichotomy of Control',
      description: 'Dividing reality into what you control vs what you must let go of.',
      completedAt: 'Recent',
      difficultyLevel: 'Beginner',
    },
    {
      id: 'mc-2',
      topic: 'AI & Machine Learning',
      title: 'What an AI Model Is',
      description: 'Understanding statistical probability and next-word prediction.',
      completedAt: 'Recent',
      difficultyLevel: 'Beginner',
    },
    {
      id: 'mc-3',
      topic: 'Cognitive Science',
      title: 'Attention Residue in Knowledge Workers',
      description: 'The cognitive penalty of task switching and fragmented notifications.',
      completedAt: 'Recent',
      difficultyLevel: 'Intermediate',
    },
  ]);

  // Streak & Session Stamina State
  const [streakDays, setStreakDays] = useState<number>(7);
  const [streakWeek, setStreakWeek] = useState<StreakDay[]>([
    { day: 'Mon', dateStr: 'Aug 17', isToday: false, completed: true, wordsRead: 1100 },
    { day: 'Tue', dateStr: 'Aug 18', isToday: false, completed: true, wordsRead: 1450 },
    { day: 'Wed', dateStr: 'Aug 19', isToday: false, completed: true, wordsRead: 980 },
    { day: 'Thu', dateStr: 'Aug 20', isToday: false, completed: true, wordsRead: 1800 },
    { day: 'Fri', dateStr: 'Aug 21', isToday: false, completed: true, wordsRead: 1350 },
    { day: 'Sat', dateStr: 'Aug 22', isToday: false, completed: true, wordsRead: 2100 },
    { day: 'Sun', dateStr: 'Today', isToday: true, completed: true, wordsRead: 1420 },
  ]);

  const [sessionStaminaHistory, setSessionStaminaHistory] = useState<StaminaHistoryItem[]>([
    { sessionPeriod: 'Week 1', sessionCountLabel: 'Sessions 1–3', avgMinutes: 2.1, avgWords: 140, dateRange: 'Aug 1–7' },
    { sessionPeriod: 'Week 2', sessionCountLabel: 'Sessions 4–7', avgMinutes: 4.8, avgWords: 310, dateRange: 'Aug 8–14' },
    { sessionPeriod: 'Week 3', sessionCountLabel: 'Sessions 8–12', avgMinutes: 8.2, avgWords: 560, dateRange: 'Aug 15–20' },
    { sessionPeriod: 'Week 4', sessionCountLabel: 'Sessions 13–17 (Current)', avgMinutes: 12.4, avgWords: 840, dateRange: 'Aug 21–23' },
  ]);

  const averageReadingTimeMinutes = {
    initial: 2.0,
    current: 12.4,
    growthPercent: 520,
  };

  // Duolingo Skill Tree State
  const [nicheSkillTrees, setNicheSkillTrees] = useState<Record<string, SkillTreeNode[]>>(NICHE_SKILL_TREES);
  const [activeSkillTreeNiche, setActiveSkillTreeNiche] = useState<string>('AI & Machine Learning');

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // User auth state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>({
    name: 'Explorer',
    email: 'guest@tidbit.ai',
    role: 'student',
    isGuest: true,
  });

  // Overlays
  const [activeArticle, setActiveArticle] = useState<ArticleWithQuiz | null>(null);
  const [quickCheckOpen, setQuickCheckOpen] = useState(false);
  const [quickCheckArticle, setQuickCheckArticle] = useState<ArticleWithQuiz | null>(null);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [authGatewayOpen, setAuthGatewayOpen] = useState(false);
  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
  const [activeMilestone, setActiveMilestone] = useState<MilestoneCertificate | null>(null);
  const [composeModalOpen, setComposeModalOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hydrate from localStorage safely after mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem(THEME_KEY);
        if (savedTheme) {
          const isDark = savedTheme === 'dark';
          setIsDarkMode(isDark);
          document.documentElement.classList.toggle('dark', isDark);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          setIsDarkMode(true);
          document.documentElement.classList.add('dark');
        }

        const savedUser = localStorage.getItem(USER_KEY);
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
        }

        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.articles) setArticles(parsed.articles);
          if (parsed.pathNodes) setPathNodes(parsed.pathNodes);
          if (parsed.calibratedLevel) setCalibratedLevel(parsed.calibratedLevel);
          if (parsed.staminaLevel) setStaminaLevel(parsed.staminaLevel);
          if (parsed.xp) setXp(parsed.xp);
          if (parsed.longestUnbrokenRead) setLongestUnbrokenRead(parsed.longestUnbrokenRead);
          if (parsed.sessionWordsRead) setSessionWordsRead(parsed.sessionWordsRead);
          if (parsed.totalWordsReadToday) setTotalWordsReadToday(parsed.totalWordsReadToday);
          if (parsed.masteredContexts) setMasteredContexts(parsed.masteredContexts);
          if (parsed.selectedInterests) setSelectedInterests(parsed.selectedInterests);
          if (parsed.baselineLength) setBaselineLength(parsed.baselineLength);
          if (parsed.streakDays) setStreakDays(parsed.streakDays);
          if (parsed.nicheSkillTrees) setNicheSkillTrees(parsed.nicheSkillTrees);
        }
      } catch (err) {
        console.error('Failed to parse saved Tidbit state:', err);
      } finally {
        setIsHydrated(true);
      }
    }
  }, []);

  // Sync to localStorage only after initial hydration completes
  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      try {
        const stateToSave = {
          articles,
          pathNodes,
          calibratedLevel,
          staminaLevel,
          xp,
          longestUnbrokenRead,
          sessionWordsRead,
          totalWordsReadToday,
          masteredContexts,
          selectedInterests,
          baselineLength,
          streakDays,
          nicheSkillTrees,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      } catch (err) {
        console.error('Failed to save Tidbit state:', err);
      }
    }
  }, [
    isHydrated,
    articles,
    pathNodes,
    calibratedLevel,
    staminaLevel,
    xp,
    longestUnbrokenRead,
    sessionWordsRead,
    totalWordsReadToday,
    masteredContexts,
    selectedInterests,
    baselineLength,
    streakDays,
    nicheSkillTrees,
  ]);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', next);
      }
      showToast(next ? 'Obsidian Dark Paper Active 🌙' : 'Light Paper Stock Active ☀️');
      return next;
    });
  }, [showToast]);

  const setDarkMode = useCallback(
    (enabled: boolean) => {
      setIsDarkMode(enabled);
      if (typeof window !== 'undefined') {
        localStorage.setItem(THEME_KEY, enabled ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', enabled);
      }
    },
    []
  );

  const loginUser = useCallback((user: UserProfile) => {
    setCurrentUser(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    setAuthGatewayOpen(false);
    showToast(`Welcome back, ${user.name}!`);
  }, [showToast]);

  const logoutUser = useCallback(() => {
    const guestUser: UserProfile = {
      name: 'Guest Explorer',
      email: 'guest@tidbit.ai',
      role: 'student',
      isGuest: true,
    };
    setCurrentUser(guestUser);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_KEY);
    }
    showToast('Signed out to Guest Mode');
  }, [showToast]);

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

        setActiveArticle((curr) =>
          curr && curr.id === articleId ? { ...curr, saved: isNowSaved } : curr
        );

        showToast(isNowSaved ? 'Saved to your Library ✓' : 'Removed from Library');
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

      setRollingAverages((prev) => {
        const next = [...prev];
        const lastIdx = next.length - 1;
        next[lastIdx] = Math.min(100, (next[lastIdx] || 80) + 3);
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

        setMasteredContexts((prev) => {
          if (prev.some((mc) => mc.id === `mc-${targetArticle!.id}`)) return prev;
          return [
            {
              id: `mc-${targetArticle!.id}`,
              topic: targetArticle!.topic,
              title: targetArticle!.title || targetArticle!.topic,
              description: targetArticle!.excerpt,
              completedAt: 'Just now',
              difficultyLevel: targetArticle!.difficultyLevel || 'Beginner',
            },
            ...prev,
          ];
        });
      }
    },
    [recordSessionWords]
  );

  const openMilestoneModal = useCallback(
    (customData?: Partial<MilestoneCertificate>) => {
      const defaultCert: MilestoneCertificate = {
        id: `cert-${Date.now()}`,
        recipientName: currentUser?.name || 'Curious Learner',
        topicTitle: customData?.topicTitle || 'AI & Machine Learning Foundations',
        category: customData?.category || 'AI & Tech',
        milestoneType: customData?.milestoneType || 'topic_unit',
        level: calibratedLevel || 2,
        wordsMastered: customData?.wordsMastered || sessionWordsRead || 840,
        unbrokenReadingMins: customData?.unbrokenReadingMins || averageReadingTimeMinutes.current || 12.4,
        streakDays: customData?.streakDays || streakDays || 7,
        accuracyPercent: customData?.accuracyPercent || 96,
        earnedXp: customData?.earnedXp || 150,
        issuedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        certificateHash: `TIDBIT-CERT-${Math.floor(1000 + Math.random() * 9000)}-${(customData?.category || 'AI').slice(0, 2).toUpperCase()}`,
        badgeIcon: customData?.badgeIcon || 'military_tech',
      };

      setActiveMilestone({ ...defaultCert, ...customData });
      setMilestoneModalOpen(true);
    },
    [currentUser?.name, calibratedLevel, sessionWordsRead, averageReadingTimeMinutes.current, streakDays]
  );

  const closeMilestoneModal = useCallback(() => {
    setMilestoneModalOpen(false);
    setActiveMilestone(null);
  }, []);

  const completeQuickCheck = useCallback(
    (earnedXp: number, articleId?: string) => {
      setXp((prev) => prev + earnedXp);
      setStaminaLevel((prev) => Math.min(100, prev + 3));

      let targetTitle = 'Focus & Attention Unit';
      let targetCategory = 'Cognitive Science';

      if (articleId) {
        markArticleComplete(articleId);
        const matched = articles.find((a) => a.id === articleId);
        if (matched) {
          targetTitle = matched.title || matched.topic;
          targetCategory = matched.topic;
        }
      }

      showToast(`+${earnedXp} XP! Attention stamina increased`);
      setQuickCheckOpen(false);

      // Auto-trigger Shareable Milestone Card
      setTimeout(() => {
        openMilestoneModal({
          topicTitle: targetTitle,
          category: targetCategory,
          earnedXp,
          wordsMastered: 840,
          accuracyPercent: 96,
        });
      }, 400);
    },
    [markArticleComplete, showToast, articles, openMilestoneModal]
  );

  const completePathNode = useCallback(
    (nodeId: number) => {
      let nodeTitle = `Node 0${nodeId} Unit`;
      setPathNodes((prev) => {
        return prev.map((node) => {
          if (node.id === nodeId) {
            nodeTitle = node.title;
            return { ...node, status: 'completed' };
          }
          if (node.id === nodeId + 1 && node.status === 'locked') {
            return { ...node, status: 'current' };
          }
          return node;
        });
      });

      setStaminaLevel((prev) => Math.min(100, prev + 4));
      setXp((prev) => prev + 120);
      showToast(`Node 0${nodeId} Mastered! +120 XP`);

      // Auto-trigger Shareable Milestone Card
      setTimeout(() => {
        openMilestoneModal({
          topicTitle: nodeTitle,
          category: selectedInterests[0] || 'Attention Path',
          earnedXp: 120,
          badgeIcon: 'verified',
        });
      }, 450);
    },
    [showToast, openMilestoneModal, selectedInterests]
  );

  const completeSkillTreeNode = useCallback(
    (nicheKey: string, nodeId: number) => {
      let skillTitle = `${nicheKey} Skill Node 0${nodeId}`;
      setNicheSkillTrees((prev) => {
        const tree = prev[nicheKey] || [];
        const updated = tree.map((node) => {
          if (node.id === nodeId) {
            skillTitle = node.title;
            return { ...node, status: 'completed' as const };
          }
          if (node.id === nodeId + 1 && node.status === 'locked') {
            return { ...node, status: 'current' as const };
          }
          return node;
        });
        return { ...prev, [nicheKey]: updated };
      });

      setXp((prev) => prev + 150);
      setStaminaLevel((prev) => Math.min(100, prev + 5));
      showToast(`Skill Node Mastered in ${nicheKey}! +150 XP`);

      // Auto-trigger Shareable Milestone Card
      setTimeout(() => {
        openMilestoneModal({
          topicTitle: skillTitle,
          category: nicheKey,
          earnedXp: 150,
          badgeIcon: 'military_tech',
        });
      }, 450);
    },
    [showToast, openMilestoneModal]
  );

  const saveOnboardingPreferences = useCallback(
    (interests: string[], startingLength: number, level: 1 | 2 | 3 = 2) => {
      setSelectedInterests(interests);
      setBaselineLength(startingLength);
      setCalibratedLevel(level);

      const generated = generatePathNodesForLevel(level);
      setPathNodes(generated);

      if (interests.length > 0) {
        setActiveSkillTreeNiche(interests[0]);
      }

      showToast(`Level ${level} Calibrated (${interests.length} Niches Active)`);
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

  const openQuickCheck = useCallback(
    (article?: ArticleWithQuiz) => {
      if (article) {
        setQuickCheckArticle(article);
      } else if (activeArticle) {
        setQuickCheckArticle(activeArticle);
      }
      setQuickCheckOpen(true);
    },
    [activeArticle]
  );

  const closeQuickCheck = useCallback(() => {
    setQuickCheckOpen(false);
    setQuickCheckArticle(null);
  }, []);

  const openComposeModal = useCallback(() => {
    setComposeModalOpen(true);
  }, []);

  const closeComposeModal = useCallback(() => {
    setComposeModalOpen(false);
  }, []);

  const createAndPublishArticle = useCallback(
    (newArt: ArticleWithQuiz) => {
      setArticles((prev) => [newArt, ...prev]);
      setXp((prev) => prev + 100);
      showToast('🎉 Flash-Card published to feed stream! +100 Creator XP');
    },
    [showToast]
  );

  return (
    <AttentionTrainerContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        articles,
        activeArticle,
        pathNodes,
        staminaLevel,
        calibratedLevel,
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
        authGatewayOpen,
        milestoneModalOpen,
        activeMilestone,
        openMilestoneModal,
        closeMilestoneModal,
        composeModalOpen,
        openComposeModal,
        closeComposeModal,
        createAndPublishArticle,
        isDarkMode,
        currentUser,
        toastMessage,
        streakDays,
        streakWeek,
        sessionStaminaHistory,
        averageReadingTimeMinutes,
        nicheSkillTrees,
        activeSkillTreeNiche,
        setActiveSkillTreeNiche,
        completeSkillTreeNode,
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
        setAuthGatewayOpen,
        toggleDarkMode,
        setDarkMode,
        loginUser,
        logoutUser,
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
