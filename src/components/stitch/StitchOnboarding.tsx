'use client';

import React, { useState } from 'react';
import { useAttentionTrainer } from '@/contexts/AttentionTrainerContext';
import StitchCalibrationDeck from './StitchCalibrationDeck';

interface TopicOption {
  name: string;
  category: 'tech' | 'business' | 'mind' | 'design' | 'science';
  icon: string;
  description: string;
}

const ALL_TOPICS: TopicOption[] = [
  // AI & Tech
  { name: 'AI & Machine Learning', category: 'tech', icon: 'smart_toy', description: 'LLMs, neural networks & transformers' },
  { name: 'Small Models & Edge AI', category: 'tech', icon: 'memory', description: 'Local inference, SLMs & edge devices' },
  { name: 'Software Architecture', category: 'tech', icon: 'account_tree', description: 'System design, microservices & scale' },
  { name: 'Cybersecurity & Crypto', category: 'tech', icon: 'lock', description: 'Zero-trust, encryption & protocols' },
  { name: 'Robotics & Automation', category: 'tech', icon: 'precision_manufacturing', description: 'Embodied AI & control loops' },
  { name: 'Web3 & Decentralization', category: 'tech', icon: 'hub', description: 'Smart contracts & distributed ledgers' },

  // Growth & Business
  { name: 'Growth & Marketing', category: 'business', icon: 'trending_up', description: 'CAC/LTV, distribution & viral loops' },
  { name: 'Startups & Venture', category: 'business', icon: 'rocket_launch', description: 'Product-market fit & fundraising' },
  { name: 'Economics & Markets', category: 'business', icon: 'show_chart', description: 'Macro trends, incentives & liquidity' },
  { name: 'Pricing & Monetization', category: 'business', icon: 'payments', description: 'Willingness to pay & value capture' },
  { name: 'Product Strategy', category: 'business', icon: 'dashboard_customize', description: 'Roadmaps, moats & user empathy' },
  { name: 'Leadership & Execution', category: 'business', icon: 'groups', description: 'High-output teams & async cultures' },

  // Mind & Cognition
  { name: 'Cognitive Science', category: 'mind', icon: 'psychology', description: 'Working memory & mental bandwidth' },
  { name: 'Deep Work & Focus', category: 'mind', icon: 'center_focus_strong', description: 'Protecting uninterrupted thinking' },
  { name: 'Behavioral Psychology', category: 'mind', icon: 'alt_route', description: 'Habit loops, biases & decision making' },
  { name: 'Neuroplasticity', category: 'mind', icon: 'neurology', description: 'Neural rewiring & adaptive learning' },
  { name: 'Stoic Philosophy', category: 'mind', icon: 'self_improvement', description: 'Epictetus, Marcus Aurelius & agency' },
  { name: 'Mental Models', category: 'mind', icon: 'view_in_ar', description: 'First-principles & inversion thinking' },

  // Design & Systems
  { name: 'Design Systems', category: 'design', icon: 'palette', description: 'Tokens, component reuse & typography' },
  { name: 'Minimalism & Quiet UI', category: 'design', icon: 'crop_free', description: 'Subtractive aesthetics & zero clutter' },
  { name: 'Product Design (UX)', category: 'design', icon: 'touch_app', description: 'Interaction flow & user affordance' },
  { name: 'Acoustic Architecture', category: 'design', icon: 'volume_off', description: 'Physical & digital spaces of silence' },
  { name: 'Information Architecture', category: 'design', icon: 'schema', description: 'Content hierarchy & navigation' },

  // Science & Culture
  { name: 'Biohacking & Longevity', category: 'science', icon: 'monitor_heart', description: 'Circadian rhythms & metabolic focus' },
  { name: 'Astrophysics & Space', category: 'science', icon: 'public', description: 'Cosmology, entropy & scale' },
  { name: 'History of Computing', category: 'science', icon: 'history_edu', description: 'From Turing to Silicon Valley' },
  { name: 'Literature & Prose', category: 'science', icon: 'menu_book', description: 'Style, narrative craft & essays' },
  { name: 'Epistemology & Logic', category: 'science', icon: 'balance', description: 'The structure of knowledge & truth' },
];

interface StitchOnboardingProps {
  onComplete?: (preferences: { interests: string[]; startingLength: number; level: 1 | 2 | 3 }) => void;
  onCancel?: () => void;
}

export default function StitchOnboarding({ onComplete, onCancel }: StitchOnboardingProps) {
  const {
    selectedInterests: initialInterests,
    baselineLength: initialLength,
    calibratedLevel: initialLevel,
    isDarkMode,
    toggleDarkMode,
    saveOnboardingPreferences,
  } = useAttentionTrainer();

  // Steps: 1 = Niche Picker, 2 = Tinder Swipe Deck, 3 = Calibration Result & Reveal
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    initialInterests.length > 0
      ? initialInterests
      : ['AI & Machine Learning', 'Growth & Marketing', 'Cognitive Science', 'Deep Work & Focus']
  );

  const [categoryFilter, setCategoryFilter] = useState<'all' | 'tech' | 'business' | 'mind' | 'design' | 'science'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calibration outcomes
  const [calibratedLevel, setCalibratedLevel] = useState<1 | 2 | 3>(initialLevel || 2);
  const [selectedLength, setSelectedLength] = useState<number>(initialLength || 140);
  const [calibrationScore, setCalibrationScore] = useState<number>(4);
  const [calibrationAnswers, setCalibrationAnswers] = useState<
    { conceptId: string; title: string; status: 'known' | 'new' | 'familiar' }[]
  >([]);

  const toggleInterest = (topicName: string) => {
    if (selectedInterests.includes(topicName)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((t) => t !== topicName));
      }
    } else {
      if (selectedInterests.length < 6) {
        setSelectedInterests([...selectedInterests, topicName]);
      }
    }
  };

  const handleDeckComplete = (result: {
    level: 1 | 2 | 3;
    score: number;
    totalCards: number;
    recommendedLength: number;
    answers: { conceptId: string; title: string; status: 'known' | 'new' | 'familiar' }[];
  }) => {
    setCalibratedLevel(result.level);
    setCalibrationScore(result.score);
    setSelectedLength(result.recommendedLength);
    setCalibrationAnswers(result.answers);
    setStep(3);
  };

  const handleFinish = () => {
    saveOnboardingPreferences(selectedInterests, selectedLength, calibratedLevel);
    onComplete?.({
      interests: selectedInterests,
      startingLength: selectedLength,
      level: calibratedLevel,
    });
  };

  // Filter topics
  const filteredTopics = ALL_TOPICS.filter((t) => {
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    const matchesSearch =
      !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-paper overflow-y-auto min-h-screen text-on-surface flex flex-col font-sans transition-colors duration-200">
      {/* Header Bar */}
      <div className="px-6 py-4 flex justify-between items-center border-b border-hairline bg-paper sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="font-display-lg-mobile text-[24px] text-ink-blue font-serif">
            Tidbit
          </span>
          <span className="text-hairline font-thin">|</span>
          <span className="font-label-mono text-[11px] text-graphite uppercase tracking-widest">
            {step === 1 ? 'Step 1: Niche Picker' : step === 2 ? 'Step 2: Swipe Calibration' : 'Step 3: Track Assignment'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Switch to Light Paper Mode' : 'Switch to Obsidian Dark Mode'}
            className="w-8 h-8 rounded-full border border-hairline bg-surface-container-lowest flex items-center justify-center text-graphite hover:text-ink-blue transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {onCancel && (
            <button
              onClick={onCancel}
              className="font-ui-button text-[13px] text-graphite hover:text-ink-blue cursor-pointer"
            >
              Skip for now
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col justify-between">
        {/* ================= STEP 1: NICHE PICKER ================= */}
        {step === 1 && (
          <div className="flex flex-col gap-6 animate-slide-in">
            <header className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-label-mono text-[11px] text-graphite uppercase font-bold tracking-wider">
                  STEP 1 OF 2 · CURATE YOUR DOMAINS
                </span>
                <span
                  className={`font-label-mono text-[11px] px-2.5 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                    selectedInterests.length >= 3 && selectedInterests.length <= 5
                      ? 'bg-ink-blue/10 text-ink-blue'
                      : 'bg-surface-container-lowest border border-hairline text-graphite'
                  }`}
                >
                  {selectedInterests.length}/5 Picked {selectedInterests.length >= 3 ? '✓ Ready' : '(Min 3)'}
                </span>
              </div>

              <h1 className="font-headline-md text-[28px] md:text-[34px] text-on-background font-serif leading-tight">
                Select your 4–5 favorite niches.
              </h1>
              <p className="font-article-body-mobile text-[16px] text-graphite">
                Choose the disciplines where you want to cultivate sustained, distraction-free reading focus.
              </p>
            </header>

            {/* Currently Selected Chips Preview */}
            <div className="bg-surface-container-lowest border border-hairline rounded-lg p-3.5 shadow-xs">
              <div className="flex justify-between items-center mb-2">
                <span className="font-label-mono text-[10px] text-graphite uppercase font-bold tracking-wider">
                  SELECTED NICHES ({selectedInterests.length})
                </span>
                <span className="font-label-mono text-[10px] text-graphite">
                  Target: 4-5 niches
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center">
                {selectedInterests.map((interest) => (
                  <span
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-ink-blue text-white rounded font-ui-button text-[12px] shadow-xs cursor-pointer hover:bg-ink-blue/80 transition-colors"
                  >
                    <span>{interest}</span>
                    <span className="text-[10px] opacity-70">✕</span>
                  </span>
                ))}
                {selectedInterests.length === 0 && (
                  <span className="text-graphite font-label-mono text-[11px] italic">
                    Tap topics below to add to your stream...
                  </span>
                )}
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              {/* Category Tabs */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {[
                  { id: 'all', label: 'All (28)' },
                  { id: 'tech', label: 'AI & Tech' },
                  { id: 'business', label: 'Growth & Business' },
                  { id: 'mind', label: 'Cognitive Science' },
                  { id: 'design', label: 'Design' },
                  { id: 'science', label: 'Science' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id as any)}
                    className={`px-3 py-1.5 rounded-[var(--r-control)] t-label transition-colors cursor-pointer whitespace-nowrap ${
                      categoryFilter === cat.id
                        ? 'bg-[var(--ink)] text-[var(--insert)] font-bold border border-[var(--ink)]'
                        : 'bg-[var(--insert)] border border-[var(--rule)] text-[var(--graphite)]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative min-w-[180px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search topics..."
                  className="w-full pl-8 pr-3 py-1.5 bg-surface-container-lowest border border-hairline rounded font-ui-button text-[13px] focus:outline-none focus:border-ink-blue text-on-surface"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-2 text-[16px] text-graphite">
                  search
                </span>
              </div>
            </div>

            {/* Niche Grid (20-30 topics) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
              {filteredTopics.map((topic) => {
                const isSelected = selectedInterests.includes(topic.name);
                return (
                  <button
                    key={topic.name}
                    type="button"
                    onClick={() => toggleInterest(topic.name)}
                    className={`p-3.5 rounded-lg border text-left font-ui-button transition-all flex items-start gap-3 cursor-pointer group ${
                      isSelected
                        ? 'bg-surface-container-lowest border-2 border-ink-blue shadow-sm'
                        : 'bg-surface-container-lowest border-hairline text-on-surface hover:border-outline-variant'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected ? 'bg-ink-blue text-white' : 'bg-paper text-graphite group-hover:text-ink-blue'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {topic.icon}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className={`font-medium text-[14px] truncate ${isSelected ? 'text-ink-blue font-bold' : 'text-on-surface'}`}>
                          {topic.name}
                        </span>
                        {isSelected ? (
                          <span className="font-bold text-xs text-ink-blue">✓</span>
                        ) : (
                          <span className="text-xs text-graphite/40 group-hover:text-graphite">+</span>
                        )}
                      </div>
                      <p className="font-sans text-[12px] text-graphite line-clamp-1">
                        {topic.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Sticky Footer Continue Bar */}
            <div className="sticky bottom-0 bg-paper/95 backdrop-blur-md pt-4 pb-4 border-t border-hairline flex flex-col sm:flex-row justify-between items-center gap-3 z-20">
              <div className="flex flex-col text-center sm:text-left">
                <span className="font-label-mono text-[11px] text-graphite font-bold">
                  {selectedInterests.length} OF 6 TOPICS SELECTED
                </span>
                <span className="text-[12px] text-graphite hidden sm:inline">
                  {selectedInterests.length < 2
                    ? 'Pick 2–4 niches to optimize your calibrated stream'
                    : 'Personalized curriculum ready for swipe calibration'}
                </span>
              </div>

              <button
                disabled={selectedInterests.length < 1}
                onClick={() => setStep(2)}
                className="w-full sm:w-auto bg-primary-container hover:bg-ink-blue disabled:opacity-50 disabled:cursor-not-allowed text-white font-ui-button text-[14px] font-bold px-6 py-3 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <span>Continue to Swipe Calibration</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: TINDER SWIPE CALIBRATION ================= */}
        {step === 2 && (
          <div className="animate-slide-in">
            <StitchCalibrationDeck
              selectedInterests={selectedInterests}
              onComplete={handleDeckComplete}
              onBackToNiched={() => setStep(1)}
            />
          </div>
        )}

        {/* ================= STEP 3: CALIBRATION RESULT & REVEAL ================= */}
        {step === 3 && (
          <div className="flex flex-col gap-6 animate-slide-in">
            <header className="flex flex-col gap-2">
              <div className="flex items-center gap-2 font-label-mono text-[11px] text-ink-blue uppercase font-bold tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-ink-blue animate-ping" />
                CALIBRATION COMPLETE · TRACK UNLOCKED
              </div>
              <h1 className="font-headline-md text-[30px] md:text-[36px] text-on-background font-serif leading-tight">
                Your Calibrated Starting Track: Level {calibratedLevel}
              </h1>
              <p className="font-article-body-mobile text-[16px] text-graphite">
                Based on your swipe assessment, we've tuned your curriculum depth and initial cognitive stamina baseline.
              </p>
            </header>

            {/* Level Card Highlight */}
            <div className="bg-surface-container-lowest border-2 border-ink-blue rounded-xl p-6 shadow-md flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-label-mono text-[11px] uppercase tracking-wider text-ink-blue font-bold">
                    RECOMMENDED CURRICULUM TIER
                  </span>
                  <h2 className="font-headline-md text-[24px] font-serif text-on-surface mt-0.5">
                    {calibratedLevel === 1 && 'Level 1: Foundational Track (Atomic Focus)'}
                    {calibratedLevel === 2 && 'Level 2: Synthesizer Track (Structured Focus)'}
                    {calibratedLevel === 3 && 'Level 3: Deep Scholar Track (Sustained Rigor)'}
                  </h2>
                </div>

                <div className="px-3 py-1 bg-ink-blue text-white rounded font-label-mono text-[12px] font-bold">
                  LEVEL {calibratedLevel}
                </div>
              </div>

              <p className="font-article-body-mobile text-[15px] text-graphite leading-relaxed">
                {calibratedLevel === 1 &&
                  'Starts with 30–80 word high-impact atomic concepts and structured mental model scaffolds. Perfect for establishing clean, unbroken attention habits.'}
                {calibratedLevel === 2 &&
                  'Starts with 140–250 word balanced syntheses connecting cross-disciplinary principles. Built for readers with established domain familiarity.'}
                {calibratedLevel === 3 &&
                  'Starts with 420+ word dense essays and deep architectural analyses. Calibrated for users who quickly parse complex abstracts without distraction.'}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-hairline">
                <div className="bg-paper/70 p-3 rounded border border-hairline">
                  <span className="font-label-mono text-[10px] text-graphite uppercase block">BASELINE</span>
                  <span className="font-headline-md text-[18px] font-serif text-ink-blue font-bold">{selectedLength} Words</span>
                </div>
                <div className="bg-paper/70 p-3 rounded border border-hairline">
                  <span className="font-label-mono text-[10px] text-graphite uppercase block">NICHES</span>
                  <span className="font-headline-md text-[18px] font-serif text-ink-blue font-bold">{selectedInterests.length} Topics</span>
                </div>
                <div className="bg-paper/70 p-3 rounded border border-hairline">
                  <span className="font-label-mono text-[10px] text-graphite uppercase block">DAILY GOAL</span>
                  <span className="font-headline-md text-[18px] font-serif text-ink-blue font-bold">
                    {calibratedLevel === 1 ? '1,000 W' : calibratedLevel === 2 ? '2,000 W' : '3,500 W'}
                  </span>
                </div>
              </div>
            </div>

            {/* Level Adjustment / Stamina Length Overrides */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-label-mono text-[11px] text-graphite uppercase font-bold">
                  MANUAL LEVEL TUNING (OPTIONAL)
                </span>
                <span className="font-label-mono text-[10px] text-graphite">Tap to override</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { lvl: 1 as const, length: 30, title: 'Level 1 · 30W' },
                  { lvl: 2 as const, length: 140, title: 'Level 2 · 140W' },
                  { lvl: 3 as const, length: 420, title: 'Level 3 · 420W' },
                ].map((item) => (
                  <button
                    key={item.lvl}
                    type="button"
                    onClick={() => {
                      setCalibratedLevel(item.lvl);
                      setSelectedLength(item.length);
                    }}
                    className={`py-2.5 px-2 rounded border text-center font-ui-button text-[13px] transition-all cursor-pointer ${
                      calibratedLevel === item.lvl
                        ? 'bg-ink-blue text-white font-bold border-ink-blue shadow-xs'
                        : 'bg-surface-container-lowest border-hairline text-graphite hover:border-outline-variant'
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Niches Confirmation Tags */}
            <div className="bg-surface-container-lowest border border-hairline rounded-lg p-4">
              <span className="font-label-mono text-[11px] text-graphite uppercase font-bold block mb-2">
                ACTIVE DOMAINS FOR YOUR FEED:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedInterests.map((niche) => (
                  <span
                    key={niche}
                    className="px-2.5 py-1 rounded bg-paper border border-hairline font-label-mono text-[11px] text-on-surface"
                  >
                    {niche}
                  </span>
                ))}
              </div>
            </div>

            {/* Sticky Finish Launch Button */}
            <div className="sticky bottom-0 bg-paper/95 backdrop-blur-md pt-4 pb-4 border-t border-hairline flex flex-col gap-2 z-20">
              <button
                type="button"
                onClick={handleFinish}
                className="w-full bg-primary-container hover:bg-ink-blue text-white font-ui-button text-[16px] font-bold py-3.5 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <span>Launch My Calibrated Tidbit Stream</span>
                <span className="material-symbols-outlined text-[20px]">bolt</span>
              </button>
              <p className="text-center font-article-body-mobile text-[13px] text-graphite">
                Your learning path and stream adapt in real-time as your reading stamina expands.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
