'use client';

import React, { useState } from 'react';
import { useAttentionTrainer } from '@/contexts/AttentionTrainerContext';
import StitchCalibrationDeck from './StitchCalibrationDeck';
import { hueForTopic } from '@/lib/design/topicHue';

interface TopicOption {
  name: string;
  category: 'tech' | 'business' | 'mind' | 'design' | 'science';
  code: string;
  description: string;
}

const ALL_TOPICS: TopicOption[] = [
  // AI & Tech
  { name: 'AI & Machine Learning', category: 'tech', code: 'AI', description: 'LLMs, neural networks & transformers' },
  { name: 'Small Models & Edge AI', category: 'tech', code: 'SL', description: 'Local inference, SLMs & edge devices' },
  { name: 'Software Architecture', category: 'tech', code: 'SA', description: 'System design, microservices & scale' },
  { name: 'Cybersecurity & Crypto', category: 'tech', code: 'CY', description: 'Zero-trust, encryption & protocols' },
  { name: 'Robotics & Automation', category: 'tech', code: 'RO', description: 'Embodied AI & control loops' },
  { name: 'Web3 & Decentralization', category: 'tech', code: 'W3', description: 'Smart contracts & distributed ledgers' },

  // Growth & Business
  { name: 'Growth & Marketing', category: 'business', code: 'GR', description: 'CAC/LTV, distribution & viral loops' },
  { name: 'Startups & Venture', category: 'business', code: 'SU', description: 'Product-market fit & fundraising' },
  { name: 'Economics & Markets', category: 'business', code: 'EC', description: 'Macro trends, incentives & liquidity' },
  { name: 'Pricing & Monetization', category: 'business', code: 'PR', description: 'Willingness to pay & value capture' },
  { name: 'Product Strategy', category: 'business', code: 'PD', description: 'Roadmaps, moats & user empathy' },
  { name: 'Leadership & Execution', category: 'business', code: 'LD', description: 'High-output teams & async cultures' },

  // Mind & Cognition
  { name: 'Cognitive Science', category: 'mind', code: 'CS', description: 'Working memory & mental bandwidth' },
  { name: 'Deep Work & Focus', category: 'mind', code: 'DW', description: 'Protecting uninterrupted thinking' },
  { name: 'Behavioral Psychology', category: 'mind', code: 'BP', description: 'Habit loops, biases & decision making' },
  { name: 'Neuroplasticity', category: 'mind', code: 'NP', description: 'Neural rewiring & adaptive learning' },
  { name: 'Stoic Philosophy', category: 'mind', code: 'SP', description: 'Epictetus, Marcus Aurelius & agency' },
  { name: 'Mental Models', category: 'mind', code: 'MM', description: 'First-principles & inversion thinking' },

  // Design & Systems
  { name: 'Design Systems', category: 'design', code: 'DS', description: 'Tokens, component reuse & typography' },
  { name: 'Minimalism & Quiet UI', category: 'design', code: 'QU', description: 'Subtractive aesthetics & zero clutter' },
  { name: 'Product Design (UX)', category: 'design', code: 'UX', description: 'Interaction flow & user affordance' },
  { name: 'Acoustic Architecture', category: 'design', code: 'AA', description: 'Physical & digital spaces of silence' },
  { name: 'Information Architecture', category: 'design', code: 'IA', description: 'Content hierarchy & navigation' },

  // Science & Culture
  { name: 'Biohacking & Longevity', category: 'science', code: 'BH', description: 'Circadian rhythms & metabolic focus' },
  { name: 'Astrophysics & Space', category: 'science', code: 'AS', description: 'Cosmology, entropy & scale' },
  { name: 'History of Computing', category: 'science', code: 'HC', description: 'From Turing to Silicon Valley' },
  { name: 'Literature & Prose', category: 'science', code: 'LP', description: 'Style, narrative craft & essays' },
  { name: 'Epistemology & Logic', category: 'science', code: 'EL', description: 'The structure of knowledge & truth' },
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

  const filteredTopics = ALL_TOPICS.filter((t) => {
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDeckComplete = (result: {
    score: number;
    recommendedLevel: 1 | 2 | 3;
    recommendedLength: number;
    answers: { conceptId: string; title: string; status: 'known' | 'new' | 'familiar' }[];
  }) => {
    setCalibrationScore(result.score);
    setCalibratedLevel(result.recommendedLevel);
    setSelectedLength(result.recommendedLength);
    setCalibrationAnswers(result.answers);
    setStep(3);
  };

  const handleFinalSave = () => {
    saveOnboardingPreferences(selectedInterests, selectedLength, calibratedLevel);
    onComplete?.({
      interests: selectedInterests,
      startingLength: selectedLength,
      level: calibratedLevel,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onCancel}
        className="fixed inset-0 bg-[#1A1814]/40 transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-[var(--insert)] border border-[var(--rule)] rounded-[var(--r-card)] z-50 p-6 sm:p-8 flex flex-col gap-6 shadow-[0_1px_2px_rgba(26,24,20,0.04)] max-h-[92vh] overflow-y-auto">
        {/* Step Indicator Header */}
        <div className="flex justify-between items-center border-b border-[var(--rule)] pb-4">
          <div className="flex items-center gap-3">
            <span className="t-label text-[var(--graphite)]">
              STEP {step} OF 3
            </span>
            <span className="t-label font-bold text-[var(--ink)]">
              {step === 1 && 'Niche Selection'}
              {step === 2 && 'Swipe Calibration Assessment'}
              {step === 3 && 'Curriculum Calibration Revealed'}
            </span>
          </div>

          {onCancel && (
            <button
              onClick={onCancel}
              className="t-ui text-[var(--graphite)] hover:text-[var(--ink)] cursor-pointer"
            >
              Close
            </button>
          )}
        </div>

        {/* STEP 1: NICHE SELECTION GRID */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="t-title font-display text-[26px]">
                Calibrate Your Niche Interests
              </h1>
              <p className="t-body text-[15px] text-[var(--graphite)] mt-1">
                Select 2–6 core domains to synthesize your daily reading stream.
              </p>
            </div>

            {/* Category Filters & Search */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
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
                  className="w-full px-3.5 py-1.5 bg-[var(--insert)] border border-[var(--rule)] rounded-[var(--r-control)] t-ui text-[var(--ink)]"
                />
              </div>
            </div>

            {/* Niche Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
              {filteredTopics.map((topic) => {
                const isSelected = selectedInterests.includes(topic.name);
                const hueVar = hueForTopic(topic.name);

                return (
                  <button
                    key={topic.name}
                    type="button"
                    onClick={() => toggleInterest(topic.name)}
                    className="p-3.5 rounded-[var(--r-control)] border text-left transition-all flex items-start gap-3 cursor-pointer"
                    style={{
                      borderColor: isSelected ? `var(${hueVar})` : 'var(--rule)',
                      backgroundColor: isSelected ? `rgba(92, 107, 138, 0.04)` : 'var(--insert)',
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-[var(--r-control)] flex items-center justify-center shrink-0 border border-[var(--rule)] bg-[var(--inset)]"
                    >
                      <span
                        className="t-num font-bold"
                        style={{ color: isSelected ? `var(${hueVar})` : 'var(--ink)' }}
                      >
                        {topic.code}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span
                          className={`t-ui font-medium truncate ${isSelected ? 'font-bold' : ''}`}
                          style={{ color: isSelected ? `var(${hueVar})` : 'var(--ink)' }}
                        >
                          {topic.name}
                        </span>
                        <span className="t-ui text-[var(--graphite)]">
                          {isSelected ? '✓' : '+'}
                        </span>
                      </div>
                      <p className="t-body text-[12px] text-[var(--graphite)] line-clamp-1">
                        {topic.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Sticky Footer Continue Bar */}
            <div className="sticky bottom-0 bg-[var(--stock)] pt-4 pb-2 border-t border-[var(--rule)] flex flex-col sm:flex-row justify-between items-center gap-3 z-20">
              <div className="flex flex-col text-center sm:text-left">
                <span className="t-label font-bold text-[var(--ink)]">
                  {selectedInterests.length} OF 6 TOPICS SELECTED
                </span>
                <span className="t-body text-[12px] text-[var(--graphite)] hidden sm:inline">
                  {selectedInterests.length < 2
                    ? 'Pick 2–4 niches to optimize your calibrated stream'
                    : 'Personalized curriculum ready for swipe calibration'}
                </span>
              </div>

              <button
                disabled={selectedInterests.length < 1}
                onClick={() => setStep(2)}
                className="w-full sm:w-auto bg-[var(--ink)] text-[var(--insert)] hover:opacity-90 disabled:opacity-30 t-ui font-semibold px-6 py-2.5 rounded-[var(--r-control)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Continue to Swipe Calibration</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: TINDER SWIPE CALIBRATION */}
        {step === 2 && (
          <div className="animate-slide-in">
            <StitchCalibrationDeck
              selectedInterests={selectedInterests}
              onComplete={handleDeckComplete}
              onBackToNiched={() => setStep(1)}
            />
          </div>
        )}

        {/* STEP 3: CALIBRATION RESULT & REVEAL */}
        {step === 3 && (
          <div className="flex flex-col gap-6 animate-slide-in">
            <header className="flex flex-col gap-2">
              <span className="t-label font-bold text-[var(--ink)]">
                CALIBRATION COMPLETE · TRACK UNLOCKED
              </span>
              <h1 className="t-title font-display text-[28px]">
                Your Calibrated Starting Track: Level {calibratedLevel}
              </h1>
              <p className="t-body text-[15px] text-[var(--graphite)]">
                Based on your assessment, we've tuned your curriculum depth and initial cognitive stamina baseline.
              </p>
            </header>

            {/* Level Card Highlight */}
            <div className="bg-[var(--insert)] border border-[var(--rule)] rounded-[var(--r-card)] p-6 shadow-[0_1px_2px_rgba(26,24,20,0.04)] flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="t-label font-bold">
                    RECOMMENDED CURRICULUM TIER
                  </span>
                  <h2 className="t-title font-display text-[22px] mt-1">
                    {calibratedLevel === 1 && 'Level 1: Foundational Track (Atomic Focus)'}
                    {calibratedLevel === 2 && 'Level 2: Synthesizer Track (Structured Focus)'}
                    {calibratedLevel === 3 && 'Level 3: Deep Scholar Track (Sustained Rigor)'}
                  </h2>
                </div>

                <div className="px-3 py-1 bg-[var(--ink)] text-[var(--insert)] rounded-[var(--r-control)] t-label font-bold">
                  LEVEL {calibratedLevel}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[var(--rule)]">
                <div>
                  <span className="t-label text-[var(--graphite)]">INITIAL CARD MEASURE</span>
                  <p className="t-ui text-[var(--ink)] font-semibold mt-0.5">{selectedLength} WORDS</p>
                </div>
                <div>
                  <span className="t-label text-[var(--graphite)]">INTERLEAVED DOMAINS</span>
                  <p className="t-ui text-[var(--ink)] font-semibold mt-0.5">{selectedInterests.length} ACTIVE NICHES</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-[var(--rule)]">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="t-ui text-[var(--graphite)] hover:text-[var(--ink)] cursor-pointer"
              >
                Back to Niches
              </button>
              <button
                type="button"
                onClick={handleFinalSave}
                className="px-6 py-2.5 rounded-[var(--r-control)] bg-[var(--ink)] text-[var(--insert)] t-ui font-semibold cursor-pointer"
              >
                Start Reading Stream
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
