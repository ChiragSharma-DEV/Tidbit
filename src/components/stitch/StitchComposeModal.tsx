'use client';

import React, { useState } from 'react';
import { useAttentionTrainer, ArticleWithQuiz } from '@/contexts/AttentionTrainerContext';

interface StitchComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StitchComposeModal({ isOpen, onClose }: StitchComposeModalProps) {
  const {
    selectedInterests,
    currentUser,
    calibratedLevel,
    showToast,
    openReader,
    openMilestoneModal,
  } = useAttentionTrainer();

  // Form State
  const [title, setTitle] = useState('');
  const [niche, setNiche] = useState(selectedInterests[0] || 'AI & Machine Learning');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [analogy, setAnalogy] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [keyTakeaway, setKeyTakeaway] = useState('');
  const [monetizationTier, setMonetizationTier] = useState<'free' | 'micropayment'>('free');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  if (!isOpen) return null;

  const wordCount = bodyText.trim() ? bodyText.trim().split(/\s+/).length : 0;
  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 75));

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !bodyText.trim()) {
      showToast('Please enter a Title and Lesson content before publishing.');
      return;
    }

    const newArticle: ArticleWithQuiz = {
      id: `ugc-${Date.now()}`,
      type: wordCount > 200 ? 'long' : wordCount > 100 ? 'medium' : 'short',
      topic: niche,
      difficultyLevel: difficulty,
      title: title.trim(),
      excerpt: bodyText.trim().slice(0, 160) + (bodyText.length > 160 ? '...' : ''),
      paragraphs: bodyText.split('\n\n').filter(Boolean),
      wordCount: Math.max(wordCount, 40),
      progressPercent: 0,
      analogy: analogy.trim() || undefined,
      keyTakeaway: keyTakeaway.trim() || undefined,
      saved: true,
      quiz: {
        question: `Regarding "${title.trim()}", what is the primary takeaway?`,
        nodeStep: 'UGC VERIFICATION CHECK',
        options: [
          { key: 'A', text: keyTakeaway.trim() || 'Sustained focus and structured application creates deep mastery.', isCorrect: true },
          { key: 'B', text: 'Skimming and fragmented multitasking is superior.', isCorrect: false },
          { key: 'C', text: 'No background knowledge is required.', isCorrect: false },
          { key: 'D', text: 'This topic has zero real-world utility.', isCorrect: false },
        ],
        explanation: 'Creators craft high-signal takeaways to reinforce reader comprehension.',
      },
    };

    onClose();
    showToast('🎉 Card published to your local stream! +100 Creator XP awarded.');

    // Prompt milestone celebration after publishing
    setTimeout(() => {
      openMilestoneModal({
        topicTitle: `UGC: ${title.trim()}`,
        category: niche,
        earnedXp: 100,
        wordsMastered: wordCount,
        badgeIcon: 'edit_note',
      });
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#0E0F14]/75 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-surface-container-lowest border-2 border-hairline dark:border-[#282933] rounded-2xl shadow-2xl z-50 p-6 sm:p-8 flex flex-col gap-6 animate-slide-in max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex justify-between items-start border-b border-[var(--rule)] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="t-title font-display">
                Creator Studio & Compose
              </h2>
              <span className="t-label text-[var(--graphite)]">
                UGC BETA
              </span>
            </div>
            <p className="t-body text-[14px] text-[var(--graphite)] mt-0.5">
              Draft & publish high-signal attention cards.
            </p>
          </div>

          <button
            onClick={onClose}
            className="t-ui text-[var(--graphite)] hover:text-[var(--ink)] cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* Investor Pitch Banner */}
        <div className="p-4 rounded-[var(--r-card)] bg-[var(--inset)] border border-[var(--rule)] flex flex-col gap-2">
          <span className="t-label font-bold">
            Post-MVP Monetization & Creator Economy Pitch
          </span>
          <p className="t-body text-[14px]">
            <strong>Substack × Twitter for High-Signal Depth:</strong> Post-MVP, Tidbit transforms into an open creator marketplace. Verified writers, researchers, and engineers publish interactive flash-cards and monetize directly through <strong>reader micropayments</strong>, <strong>monthly subscriptions</strong>, and <strong>sponsor masterclasses</strong>.
          </p>
          <div className="flex items-center gap-3 pt-1 t-num text-[var(--graphite)]">
            <span>Revenue Split: 85% Creator / 15% Tidbit</span>
            <span>·</span>
            <span>$0.05 / Verified Read</span>
          </div>
        </div>

        {/* View Switcher: Editor vs Live Preview */}
        <div className="flex justify-between items-center bg-[var(--inset)] p-1 rounded-[var(--r-control)] border border-[var(--rule)]">
          <button
            type="button"
            onClick={() => setIsPreviewMode(false)}
            className={`flex-1 py-1.5 text-center t-ui cursor-pointer ${
              !isPreviewMode
                ? 'bg-[var(--insert)] text-[var(--ink)] font-semibold border border-[var(--rule)]'
                : 'text-[var(--graphite)]'
            }`}
          >
            Draft Editor
          </button>
          <button
            type="button"
            onClick={() => setIsPreviewMode(true)}
            className={`flex-1 py-1.5 text-center t-ui cursor-pointer ${
              isPreviewMode
                ? 'bg-[var(--insert)] text-[var(--ink)] font-semibold border border-[var(--rule)]'
                : 'text-[var(--graphite)]'
            }`}
          >
            Live Stream Preview
          </button>
        </div>

        {/* Form Body */}
        {!isPreviewMode ? (
          <form onSubmit={handlePublish} className="flex flex-col gap-4">
            <div>
              <label className="t-label block mb-1">
                CARD TITLE / HEADLINE
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. How AI Reads: The Autocomplete Analogy"
                className="w-full px-3.5 py-2.5 bg-[var(--insert)] border border-[var(--rule)] rounded-[var(--r-control)] t-ui text-[var(--ink)]"
              />
            </div>

            {/* Niche & Difficulty Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="t-label block mb-1">
                  NICHE / DOMAIN
                </label>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[var(--insert)] border border-[var(--rule)] rounded-[var(--r-control)] t-ui text-[var(--ink)]"
                >
                  <option value="AI & Machine Learning">AI & Machine Learning</option>
                  <option value="Growth & Marketing">Growth & Marketing</option>
                  <option value="Cognitive Science">Cognitive Science & Focus</option>
                  <option value="Philosophy & Stoicism">Philosophy & Stoicism</option>
                  <option value="Software Architecture">Software Architecture</option>
                  <option value="Content Writing">Content Writing & Copy</option>
                  <option value="Biohacking & Health">Biohacking & Longevity</option>
                </select>
              </div>

              <div>
                <label className="t-label block mb-1">
                  TARGET DIFFICULTY TIER
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDifficulty(lvl)}
                      className={`py-2 text-center border t-label transition-all cursor-pointer rounded-[var(--r-control)] ${
                        difficulty === lvl
                          ? 'bg-[var(--ink)] text-[var(--insert)] font-bold border-[var(--ink)]'
                          : 'bg-[var(--insert)] border-[var(--rule)] text-[var(--graphite)]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Intuitive Analogy */}
            <div>
              <label className="t-label block mb-1">
                INTUITIVE ANALOGY (IN SIMPLE WORDS)
              </label>
              <input
                type="text"
                value={analogy}
                onChange={(e) => setAnalogy(e.target.value)}
                placeholder="e.g. Think of RAM like your desk surface and hard drive like warehouse storage."
                className="w-full px-3.5 py-2.5 bg-[var(--insert)] border border-[var(--rule)] rounded-[var(--r-control)] t-ui text-[var(--ink)] italic"
              />
            </div>

            {/* Lesson Body Content */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="t-label block">
                  LESSON CONTENT / PROSE BODY
                </label>
                <span className="t-num text-[var(--graphite)]">
                  {wordCount} WORDS
                </span>
              </div>
              <textarea
                required
                rows={4}
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                placeholder="Write your short, high-signal reading concept..."
                className="w-full p-3.5 bg-[var(--insert)] border border-[var(--rule)] rounded-[var(--r-control)] t-body text-[15px] leading-[24px]"
              />
            </div>

            {/* Key Takeaway */}
            <div>
              <label className="t-label block mb-1">
                KEY INSIGHT TAKEAWAY
              </label>
              <input
                type="text"
                value={keyTakeaway}
                onChange={(e) => setKeyTakeaway(e.target.value)}
                placeholder="e.g. Context switching creates cognitive debt that slows synthesis."
                className="w-full px-3.5 py-2.5 bg-[var(--insert)] border border-[var(--rule)] rounded-[var(--r-control)] t-ui text-[var(--ink)]"
              />
            </div>

            {/* Monetization Tier Selection */}
            <div className="p-3 bg-[var(--inset)] rounded-[var(--r-control)] border border-[var(--rule)] flex flex-col gap-2">
              <span className="t-label font-bold">
                POST-MVP MONETIZATION MODEL
              </span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 t-ui text-[var(--ink)] cursor-pointer">
                  <input
                    type="radio"
                    name="monetization"
                    checked={monetizationTier === 'free'}
                    onChange={() => setMonetizationTier('free')}
                  />
                  <span>Free Open Access</span>
                </label>
                <label className="flex items-center gap-2 t-ui text-[var(--ink)] cursor-pointer">
                  <input
                    type="radio"
                    name="monetization"
                    checked={monetizationTier === 'micropayment'}
                    onChange={() => setMonetizationTier('micropayment')}
                  />
                  <span>Creator Pro ($0.05 / read royalty)</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2 border-t border-[var(--rule)]">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-[var(--r-control)] border border-[var(--rule)] bg-[var(--insert)] text-[var(--graphite)] hover:text-[var(--ink)] t-ui cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-[var(--r-control)] bg-[var(--ink)] text-[var(--insert)] t-ui font-semibold cursor-pointer"
              >
                Publish to Feed Stream
              </button>
            </div>
          </form>
        ) : (
          /* LIVE CARD PREVIEW */
          <div className="flex flex-col gap-4">
            <span className="t-label">
              HOW YOUR CARD APPEARS IN THE FEED:
            </span>

            <div className="bg-[var(--insert)] border border-[var(--rule)] rounded-[var(--r-card)] p-5 flex flex-col gap-3 shadow-[0_1px_2px_rgba(26,24,20,0.04)]">
              <div className="flex justify-between items-center">
                <span className="t-label font-bold">
                  {niche} · By {currentUser?.name || 'Creator'}
                </span>
                <span className="t-label text-[var(--graphite)]">
                  {difficulty} · {wordCount || 80} WORDS
                </span>
              </div>

              <h3 className="t-title font-display">
                {title || 'Untitled Attention Lesson'}
              </h3>

              <p className="t-body text-[15px] leading-[24px]">
                {bodyText || 'Your drafted lesson paragraphs will appear here in clean Quiet Print typography...'}
              </p>

              {analogy && (
                <div className="my-3 pl-4 border-l-2 border-[var(--ink)]">
                  <span className="t-label block mb-1">IN SIMPLE WORDS</span>
                  <p className="t-quote">
                    {analogy}
                  </p>
                </div>
              )}

              {keyTakeaway && (
                <div className="pt-2 border-t border-[var(--rule)] t-ui text-[var(--ink)]">
                  <span className="font-semibold">Key Insight:</span> {keyTakeaway}
                </div>
              )}

              <div className="pt-3 border-t border-[var(--rule)] flex justify-between items-center t-ui text-[var(--graphite)]">
                <span>UGC Verified Card</span>
                <span className="text-[var(--ink)] font-semibold">Focus</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsPreviewMode(false)}
                className="flex-1 py-2.5 rounded-[var(--r-control)] border border-[var(--rule)] bg-[var(--insert)] text-[var(--graphite)] hover:text-[var(--ink)] t-ui cursor-pointer"
              >
                Back to Editor
              </button>
              <button
                type="button"
                onClick={handlePublish}
                className="flex-1 py-2.5 rounded-[var(--r-control)] bg-[var(--ink)] text-[var(--insert)] t-ui font-semibold cursor-pointer"
              >
                Publish Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
