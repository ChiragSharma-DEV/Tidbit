'use client';

import React, { useState, useRef, useCallback } from 'react';
import StitchLogo from './StitchLogo';
import { useAttentionTrainer, MilestoneCertificate } from '@/contexts/AttentionTrainerContext';

interface StitchMilestoneCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone?: MilestoneCertificate | null;
}

export default function StitchMilestoneCardModal({
  isOpen,
  onClose,
  milestone: customMilestone,
}: StitchMilestoneCardModalProps) {
  const {
    currentUser,
    calibratedLevel,
    streakDays,
    longestUnbrokenRead,
    averageReadingTimeMinutes,
    xp,
    showToast,
  } = useAttentionTrainer();

  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Default certificate data if none passed
  const recipientName = customMilestone?.recipientName || currentUser?.name || 'Curious Learner';
  const topicTitle = customMilestone?.topicTitle || 'Basics of Content Writing & Attention Architecture';
  const category = customMilestone?.category || 'Deep Work & Focus';
  const level = customMilestone?.level || calibratedLevel || 2;
  const wordsMastered = customMilestone?.wordsMastered || 840;
  const unbrokenReadingMins = customMilestone?.unbrokenReadingMins || averageReadingTimeMinutes.current || 12.4;
  const streak = customMilestone?.streakDays || streakDays || 7;
  const accuracy = customMilestone?.accuracyPercent || 96;
  const earnedXp = customMilestone?.earnedXp || 150;
  const issuedDate = customMilestone?.issuedDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const certHash = customMilestone?.certificateHash || `TIDBIT-CERT-${Math.floor(1000 + Math.random() * 9000)}-${category.slice(0, 2).toUpperCase()}`;
  const badgeIcon = customMilestone?.badgeIcon || 'military_tech';

  // Share text and links
  const shareText = `Completed "${topicTitle}" on Tidbit.\n\nUnbroken Reading Stamina: ${unbrokenReadingMins} mins (${wordsMastered} words)\nFocus Streak: ${streak} Days\nComprehension: ${accuracy}%\n\nTrain your attention span: https://tidbit.ai`;
  const encodedShareText = encodeURIComponent(shareText);
  const appUrl = encodeURIComponent('https://tidbit.ai');

  const shareOnWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodedShareText}`, '_blank');
    showToast('Opening WhatsApp Share...');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${appUrl}&summary=${encodedShareText}`, '_blank');
    showToast('Opening LinkedIn Share...');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodedShareText}`, '_blank');
    showToast('Opening X / Twitter Share...');
  };

  const copyShareText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedLink(true);
      showToast('Milestone text & link copied to clipboard! ✓');
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      showToast('Failed to copy. Please try manual copy.');
    }
  };

  // High-Res Canvas PNG Download
  const handleDownloadImage = useCallback(() => {
    setIsDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 675; // 16:9 ratio perfect for LinkedIn & Twitter preview
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Background Paper
      ctx.fillStyle = '#0E0F14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Certificate Inner Card
      ctx.fillStyle = '#17181F';
      ctx.roundRect ? ctx.roundRect(40, 40, 1120, 595, 20) : ctx.fillRect(40, 40, 1120, 595);
      ctx.fill();

      // Border & Gold Accent
      ctx.strokeStyle = '#2F2BC4';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Header Brand
      ctx.fillStyle = '#818CF8';
      ctx.font = 'bold 24px monospace';
      ctx.fillText('TIDBIT ATTENTION TRAINER · OFFICIAL MILESTONE', 80, 100);

      // Certificate Title
      ctx.fillStyle = '#F3F4F6';
      ctx.font = 'bold 44px Georgia, serif';
      ctx.fillText('Certificate of Attention Mastery', 80, 170);

      // Recipient Line
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '20px sans-serif';
      ctx.fillText(`This certifies that ${recipientName} has mastered:`, 80, 220);

      // Topic Name
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 36px Georgia, serif';
      ctx.fillText(topicTitle, 80, 275);

      // Stats Divider Line
      ctx.strokeStyle = '#282933';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(80, 320);
      ctx.lineTo(1120, 320);
      ctx.stroke();

      // Stats Blocks
      ctx.fillStyle = '#818CF8';
      ctx.font = 'bold 32px Georgia, serif';
      ctx.fillText(`${unbrokenReadingMins} Mins`, 80, 380);
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '16px monospace';
      ctx.fillText('UNBROKEN STAMINA', 80, 410);

      ctx.fillStyle = '#6B655C';
      ctx.font = 'bold 32px Georgia, serif';
      ctx.fillText(`${streak} Days`, 360, 380);
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '16px monospace';
      ctx.fillText('FOCUS STREAK', 360, 410);

      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 32px Georgia, serif';
      ctx.fillText(`${accuracy}%`, 640, 380);
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '16px monospace';
      ctx.fillText('COMPREHENSION', 640, 410);

      ctx.fillStyle = '#818CF8';
      ctx.font = 'bold 32px Georgia, serif';
      ctx.fillText(`+${earnedXp} XP`, 920, 380);
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '16px monospace';
      ctx.fillText('LEVEL 2 VERIFIED', 920, 410);

      // Bottom Footer & Security Hash
      ctx.strokeStyle = '#282933';
      ctx.beginPath();
      ctx.moveTo(80, 470);
      ctx.lineTo(1120, 470);
      ctx.stroke();

      ctx.fillStyle = '#6B7280';
      ctx.font = '16px monospace';
      ctx.fillText(`VERIFIED ID: ${certHash} · ISSUED ON ${issuedDate}`, 80, 530);

      ctx.fillStyle = '#818CF8';
      ctx.font = 'bold 18px monospace';
      ctx.fillText('TRAINED ON TIDBIT · HTTPS://TIDBIT.AI', 80, 570);

      // Convert canvas to download link
      const link = document.createElement('a');
      link.download = `Tidbit_Certificate_${topicTitle.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('Certificate PNG downloaded! Ready to share.');
    } catch (err) {
      console.error(err);
      showToast('Error generating certificate image.');
    } finally {
      setIsDownloading(false);
    }
  }, [recipientName, topicTitle, unbrokenReadingMins, streak, accuracy, earnedXp, certHash, issuedDate, showToast]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#0E0F14]/75 backdrop-blur-md transition-opacity"
      />

      {/* Main Dialog Container */}
      <div className="relative w-full max-w-xl bg-surface-container-lowest border-2 border-hairline dark:border-[#282933] rounded-2xl shadow-2xl z-50 p-5 sm:p-8 flex flex-col gap-6 animate-slide-in max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-graphite hover:text-ink-blue p-1 rounded-full hover:bg-paper cursor-pointer transition-colors"
        >
          <span className="material-symbols-outlined text-[22px]">close</span>
        </button>

        {/* Celebration Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 font-label-mono text-[11px] font-bold border border-emerald-300 dark:border-emerald-800 shadow-xs mb-1">
            <span>🎉</span>
            <span>TOPIC UNIT MASTERED</span>
          </div>
          <h2 className="font-headline-md text-[24px] md:text-[28px] font-serif text-on-surface">
            Congratulations, {recipientName}!
          </h2>
          <p className="font-sans text-[13.5px] text-graphite max-w-md mx-auto">
            You just completed a calibrated learning unit. Here is your official Shareable Milestone Card.
          </p>
        </div>

        {/* ================= PREVIEW CERTIFICATE CARD (SCREENSHOT-READY) ================= */}
        <div
          ref={certificateRef}
          className="relative bg-paper dark:bg-[#12131A] border-2 border-ink-blue/40 rounded-xl p-6 sm:p-7 flex flex-col justify-between shadow-lg overflow-hidden select-none group"
        >
          {/* Subtle watermark seal stamp */}
          <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none">
            <span className="material-symbols-outlined text-[200px] text-ink-blue">
              verified
            </span>
          </div>

          {/* Certificate Header */}
          <div className="flex justify-between items-start border-b border-hairline pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <StitchLogo variant="horizontal" size="sm" showTagline={false} />
                <span className="font-label-mono text-[9px] uppercase tracking-widest text-graphite bg-surface-container-lowest px-2 py-0.5 rounded border border-hairline font-bold">
                  OFFICIAL MILESTONE
                </span>
              </div>
              <span className="font-label-mono text-[9.5px] text-graphite uppercase tracking-wider block mt-1">
                CERTIFICATE OF ATTENTION MASTERY
              </span>
            </div>

            <div className="w-10 h-10 rounded-full bg-ink-blue/10 border border-ink-blue/30 flex items-center justify-center text-ink-blue shadow-xs">
              <span className="material-symbols-outlined text-[22px]">
                {badgeIcon}
              </span>
            </div>
          </div>

          {/* Body: Recipient & Unit Name */}
          <div className="space-y-1.5 mb-5">
            <span className="font-label-mono text-[11px] text-graphite uppercase font-medium">
              THIS CERTIFIES THAT
            </span>
            <div className="font-headline-md text-[20px] sm:text-[22px] font-serif text-on-surface font-bold text-ink-blue">
              {recipientName}
            </div>
            <span className="font-label-mono text-[11px] text-graphite uppercase font-medium block pt-1">
              HAS SUCCESSFULLY COMPLETED
            </span>
            <h3 className="font-headline-md text-[18px] sm:text-[20px] font-serif text-on-surface leading-snug">
              {topicTitle}
            </h3>
          </div>

          {/* Cognitive Performance Bento Metrics */}
          <div className="grid grid-cols-4 gap-2 py-3 border-y border-[var(--rule)] bg-[var(--inset)] rounded-[var(--r-control)] px-3 mb-4">
            <div className="flex flex-col items-center text-center">
              <span className="t-label text-[var(--graphite)]">STAMINA</span>
              <span className="t-num font-bold text-[var(--ink)] mt-0.5">{unbrokenReadingMins}m</span>
            </div>

            <div className="flex flex-col items-center text-center">
              <span className="t-label text-[var(--graphite)]">STREAK</span>
              <span className="t-num font-bold text-[var(--ink)] mt-0.5">{streak}D</span>
            </div>

            <div className="flex flex-col items-center text-center">
              <span className="t-label text-[var(--graphite)]">ACCURACY</span>
              <span className="t-num font-bold text-[var(--ink)] mt-0.5">{accuracy}%</span>
            </div>

            <div className="flex flex-col items-center text-center">
              <span className="t-label text-[var(--graphite)]">REWARD</span>
              <span className="t-num font-bold text-[var(--ink)] mt-0.5">+{earnedXp} XP</span>
            </div>
          </div>

          {/* Certificate Footer */}
          <div className="flex justify-between items-center t-num text-[var(--graphite)] pt-1">
            <span>ID: {certHash}</span>
            <span className="font-bold text-[var(--ink)]">tidbit.ai</span>
            <span>{issuedDate}</span>
          </div>
        </div>

        {/* VIRAL SHARE ACTIONS */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center t-label text-[var(--graphite)]">
            <span>SHARE TO SOCIALS</span>
            <span className="text-[var(--ink)] font-semibold">1-CLICK SHARE</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* WhatsApp */}
            <button
              onClick={shareOnWhatsApp}
              className="py-2.5 px-3 rounded-[var(--r-control)] border border-[var(--rule)] bg-[var(--insert)] hover:border-[var(--ink)] text-[var(--ink)] t-ui flex items-center justify-center transition-all cursor-pointer font-semibold"
            >
              <span>WhatsApp</span>
            </button>

            {/* LinkedIn */}
            <button
              onClick={shareOnLinkedIn}
              className="py-2.5 px-3 rounded-lg bg-[#0A66C2] hover:bg-[#004182] text-white font-ui-button text-[13px] flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <span className="text-base">💼</span>
              <span>LinkedIn</span>
            </button>

            {/* Twitter / X */}
            <button
              onClick={shareOnTwitter}
              className="py-2.5 px-3 rounded-lg bg-slate-900 hover:bg-black text-white dark:bg-paper dark:hover:bg-paper/80 dark:text-on-surface font-ui-button text-[13px] flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <span className="text-base">𝕏</span>
              <span>X (Twitter)</span>
            </button>
          </div>

          {/* Secondary Actions: Download PNG & Copy Text */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleDownloadImage}
              disabled={isDownloading}
              className="flex-1 py-3 px-4 rounded-lg bg-surface-container-lowest border border-hairline hover:border-ink-blue text-on-surface font-ui-button text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px] text-ink-blue">
                download
              </span>
              <span>{isDownloading ? 'Generating Image...' : 'Download Certificate (PNG)'}</span>
            </button>

            <button
              onClick={copyShareText}
              className="py-3 px-4 rounded-lg bg-surface-container-lowest border border-hairline hover:border-ink-blue text-on-surface font-ui-button text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px] text-ink-blue">
                {copiedLink ? 'check' : 'content_copy'}
              </span>
              <span>{copiedLink ? 'Copied!' : 'Copy Text'}</span>
            </button>
          </div>
        </div>

        {/* Footer Dismiss CTA */}
        <div className="pt-2 border-t border-hairline text-center">
          <button
            onClick={onClose}
            className="text-graphite hover:text-ink-blue font-ui-button text-[13px] cursor-pointer"
          >
            Continue Learning & Expanding Stamina →
          </button>
        </div>
      </div>
    </div>
  );
}
