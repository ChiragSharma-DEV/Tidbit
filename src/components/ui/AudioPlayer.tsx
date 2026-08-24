'use client';

/**
 * AudioPlayer — compact sticky bar at the bottom of the screen.
 * Appears whenever an article is being loaded or played.
 * Uses the module-level singleton from useAudioPlayer — no provider needed.
 */

import React, { useId } from 'react';
import {
  useAudioPlayer,
  audioToggle,
  audioSeek,
  audioSetRate,
  audioClose,
  PLAYBACK_RATES,
  PlaybackRate,
} from '@/hooks/useAudioPlayer';
import { hueForTopic } from '@/lib/design/topicHue';

// ── Tiny helpers ───────────────────────────────────────────────

function fmt(s: number): string {
  if (!s || !isFinite(s) || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? '0' : ''}${sec}`;
}

// ── Inline SVG icons (no dependency on lucide or material icons) ──

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
      <path d="M3 1.5l9 5.5-9 5.5V1.5z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
      <rect x="2.5" y="1.5" width="3.5" height="11" rx="1" />
      <rect x="8" y="1.5" width="3.5" height="11" rx="1" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25" />
      <path d="M12.5 7a5.5 5.5 0 00-5.5-5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────

export default function AudioPlayer() {
  const {
    articleId,
    articleTitle,
    articleTopic,
    status,
    errorMessage,
    currentTime,
    duration,
    playbackRate,
  } = useAudioPlayer();

  const progressInputId = useId();

  // Hidden when idle
  if (status === 'idle') return null;

  const hueVar = hueForTopic(articleTopic);
  const isPlaying = status === 'playing';
  const isLoading = status === 'loading';
  const isError = status === 'error';
  const progress = duration > 0 ? currentTime / duration : 0;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    audioSeek(parseFloat(e.target.value));
  };

  const handleRateClick = () => {
    const idx = PLAYBACK_RATES.indexOf(playbackRate);
    const next = PLAYBACK_RATES[(idx + 1) % PLAYBACK_RATES.length];
    audioSetRate(next as PlaybackRate);
  };

  return (
    /*
     * Positioning:
     *  - Mobile: sits above the 64px bottom nav  →  bottom-16 (4rem)
     *  - Desktop: sits at the very bottom        →  md:bottom-0
     * z-40 keeps it below modal overlays (z-50).
     */
    <div
      role="region"
      aria-label="Audio player"
      className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-[var(--insert)] border-t border-[var(--rule)] shadow-[0_-1px_6px_rgba(26,24,20,0.08)]"
    >
      {/* Topic-hue accent line across the top */}
      <div
        className="h-[2px] w-full"
        style={{ backgroundColor: `var(${hueVar})` }}
        aria-hidden="true"
      />

      <div className="max-w-3xl mx-auto px-3 sm:px-5 py-2">

        {/* ── Error state ─────────────────────────────── */}
        {isError && (
          <div className="flex items-center justify-between gap-3 py-0.5">
            <p className="t-label text-red-500 flex-1 truncate">
              ✕ {errorMessage ?? 'Audio unavailable'}
            </p>
            <button
              type="button"
              aria-label="Close audio player"
              onClick={audioClose}
              className="text-[var(--graphite)] hover:text-[var(--ink)] cursor-pointer p-1"
            >
              <CloseIcon />
            </button>
          </div>
        )}

        {/* ── Normal state ─────────────────────────────── */}
        {!isError && (
          <>
            {/* Row 1: play button + title + time + speed + close */}
            <div className="flex items-center gap-2 sm:gap-3">

              {/* Play / Pause / Loading button */}
              <button
                type="button"
                aria-label={isPlaying ? 'Pause' : isLoading ? 'Loading audio' : 'Play'}
                disabled={isLoading}
                onClick={audioToggle}
                className="w-8 h-8 flex items-center justify-center rounded-[var(--r-control)] bg-[var(--ink)] text-[var(--insert)] hover:opacity-85 disabled:opacity-50 cursor-pointer shrink-0 transition-opacity"
              >
                {isLoading ? <SpinnerIcon /> : isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>

              {/* Article title */}
              <div className="flex-1 min-w-0">
                <p className="t-ui text-[var(--ink)] truncate leading-[18px]" title={articleTitle}>
                  {articleTitle}
                </p>
                {isLoading && (
                  <p className="t-label text-[var(--graphite)]">Generating audio…</p>
                )}
              </div>

              {/* Time — hidden on very small screens, shown sm+ */}
              {!isLoading && (
                <span className="t-num text-[var(--graphite)] tabular-nums shrink-0 hidden sm:inline text-[10px]">
                  {fmt(currentTime)}{duration > 0 ? ` / ${fmt(duration)}` : ''}
                </span>
              )}

              {/* Playback speed */}
              <button
                type="button"
                aria-label={`Playback speed ${playbackRate}x, click to change`}
                onClick={handleRateClick}
                className="t-num text-[var(--graphite)] hover:text-[var(--ink)] cursor-pointer border border-[var(--rule)] hover:border-[var(--graphite)] rounded px-1.5 py-0.5 text-[10px] tabular-nums shrink-0 transition-colors"
              >
                {playbackRate}×
              </button>

              {/* Close */}
              <button
                type="button"
                aria-label="Close audio player"
                onClick={audioClose}
                className="text-[var(--graphite)] hover:text-[var(--ink)] cursor-pointer p-1 shrink-0 transition-colors"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Row 2: seek bar (hidden while loading) */}
            {!isLoading && (
              <div className="flex items-center gap-2 mt-1.5">
                {/* Mobile time */}
                <span className="t-num text-[var(--graphite)] tabular-nums text-[10px] shrink-0 sm:hidden">
                  {fmt(currentTime)}
                </span>

                <label htmlFor={progressInputId} className="sr-only">
                  Seek position
                </label>
                <input
                  id={progressInputId}
                  type="range"
                  min={0}
                  max={duration > 0 ? duration : 100}
                  step={0.5}
                  value={currentTime}
                  onChange={handleSeek}
                  disabled={duration === 0}
                  aria-valuemin={0}
                  aria-valuemax={duration}
                  aria-valuenow={Math.round(currentTime)}
                  aria-valuetext={`${fmt(currentTime)} of ${fmt(duration)}`}
                  className="flex-1 h-[3px] cursor-pointer disabled:opacity-40 rounded-full appearance-none"
                  style={{
                    background: `linear-gradient(to right, var(${hueVar}) ${progress * 100}%, var(--rule) ${progress * 100}%)`,
                    accentColor: `var(${hueVar})`,
                  }}
                />

                {/* Mobile duration */}
                <span className="t-num text-[var(--graphite)] tabular-nums text-[10px] shrink-0 sm:hidden">
                  {duration > 0 ? fmt(duration) : '--:--'}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
