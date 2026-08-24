'use client';

/**
 * useAudioPlayer
 * ──────────────
 * Self-contained TTS audio player hook.
 *
 * Uses a module-level singleton (one <audio> element shared across all
 * component instances) so only one article ever plays at a time without
 * needing a React context or provider.
 *
 * No existing context, provider, or state management is touched.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// ─── Types ───────────────────────────────────────────────────

export type AudioStatus = 'idle' | 'loading' | 'ready' | 'playing' | 'paused' | 'error';
export type PlaybackRate = 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2;
export const PLAYBACK_RATES: PlaybackRate[] = [0.75, 1, 1.25, 1.5, 1.75, 2];

export interface AudioArticle {
  id: string;
  title: string;
  topic: string;
  text: string;
}

// ─── Module-level singleton state ────────────────────────────

interface SingletonState {
  audio: HTMLAudioElement | null;
  objectUrl: string | null;
  articleId: string | null;
  articleTitle: string;
  articleTopic: string;
  status: AudioStatus;
  errorMessage: string | null;
  currentTime: number;
  duration: number;
  playbackRate: PlaybackRate;
  // subscribers: components that called useAudioPlayer
  listeners: Set<() => void>;
}

const singleton: SingletonState = {
  audio: null,
  objectUrl: null,
  articleId: null,
  articleTitle: '',
  articleTopic: '',
  status: 'idle',
  errorMessage: null,
  currentTime: 0,
  duration: 0,
  playbackRate: 1,
  listeners: new Set(),
};

/** Notify all subscribed components to re-render */
function notify() {
  singleton.listeners.forEach((fn) => fn());
}

function getAudio(): HTMLAudioElement {
  if (!singleton.audio) {
    singleton.audio = new Audio();
    singleton.audio.preload = 'auto';

    singleton.audio.addEventListener('timeupdate', () => {
      singleton.currentTime = singleton.audio!.currentTime;
      notify();
    });
    singleton.audio.addEventListener('durationchange', () => {
      singleton.duration = singleton.audio!.duration || 0;
      notify();
    });
    singleton.audio.addEventListener('canplay', () => {
      singleton.duration = singleton.audio!.duration || 0;
      notify();
    });
    singleton.audio.addEventListener('play', () => {
      singleton.status = 'playing';
      notify();
    });
    singleton.audio.addEventListener('pause', () => {
      if (singleton.status !== 'idle') {
        singleton.status = 'paused';
        notify();
      }
    });
    singleton.audio.addEventListener('ended', () => {
      singleton.status = 'paused';
      notify();
    });
    singleton.audio.addEventListener('error', () => {
      singleton.status = 'error';
      singleton.errorMessage = 'Playback failed. Please try again.';
      notify();
    });
  }
  return singleton.audio;
}

function revokeUrl() {
  if (singleton.objectUrl) {
    URL.revokeObjectURL(singleton.objectUrl);
    singleton.objectUrl = null;
  }
}

// ─── Exported actions (callable outside React) ───────────────

export async function requestTTS(article: AudioArticle): Promise<void> {
  const audio = getAudio();

  // Same article already loaded — just play/resume
  if (singleton.articleId === article.id) {
    if (singleton.status === 'paused' || singleton.status === 'ready') {
      audio.play().catch(console.error);
    } else if (singleton.status === 'error') {
      // fall through to re-fetch below
    } else {
      return; // loading or already playing
    }
    if (singleton.status !== 'error') return;
  }

  // New article (or retry) — stop current playback
  audio.pause();
  revokeUrl();

  singleton.articleId = article.id;
  singleton.articleTitle = article.title;
  singleton.articleTopic = article.topic;
  singleton.status = 'loading';
  singleton.errorMessage = null;
  singleton.currentTime = 0;
  singleton.duration = 0;
  notify();

  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: article.text }),
    });

    if (!res.ok) {
      let msg = 'Could not generate audio.';
      try {
        const err = await res.json();
        if (err.error) msg = err.error;
      } catch { /* ignore */ }
      singleton.status = 'error';
      singleton.errorMessage = msg;
      notify();
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    singleton.objectUrl = url;

    audio.src = url;
    audio.playbackRate = singleton.playbackRate;
    audio.load();

    // status will update to 'playing' via the 'play' event listener
    singleton.status = 'ready';
    notify();

    // Auto-start playback after loading
    await audio.play();
  } catch (err) {
    console.error('[TTS]', err);
    singleton.status = 'error';
    singleton.errorMessage = 'Could not connect to audio service.';
    notify();
  }
}

export function audioPlay() {
  getAudio().play().catch(console.error);
}

export function audioPause() {
  getAudio().pause();
}

export function audioToggle() {
  if (singleton.status === 'playing') {
    audioPause();
  } else if (singleton.status === 'paused' || singleton.status === 'ready') {
    audioPlay();
  }
}

export function audioSeek(seconds: number) {
  const audio = getAudio();
  if (!isNaN(audio.duration) && isFinite(audio.duration)) {
    audio.currentTime = Math.max(0, Math.min(seconds, audio.duration));
  }
}

export function audioSetRate(rate: PlaybackRate) {
  singleton.playbackRate = rate;
  const audio = getAudio();
  audio.playbackRate = rate;
  notify();
}

export function audioClose() {
  const audio = getAudio();
  audio.pause();
  audio.src = '';
  revokeUrl();
  singleton.articleId = null;
  singleton.articleTitle = '';
  singleton.articleTopic = '';
  singleton.status = 'idle';
  singleton.errorMessage = null;
  singleton.currentTime = 0;
  singleton.duration = 0;
  notify();
}

// ─── React hook ───────────────────────────────────────────────

export function useAudioPlayer() {
  // Force re-render whenever singleton state changes
  const [, setTick] = useState(0);
  const rerender = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    singleton.listeners.add(rerender);
    return () => {
      singleton.listeners.delete(rerender);
    };
  }, [rerender]);

  return {
    articleId: singleton.articleId,
    articleTitle: singleton.articleTitle,
    articleTopic: singleton.articleTopic,
    status: singleton.status,
    errorMessage: singleton.errorMessage,
    currentTime: singleton.currentTime,
    duration: singleton.duration,
    playbackRate: singleton.playbackRate,
    // actions
    requestTTS,
    play: audioPlay,
    pause: audioPause,
    toggle: audioToggle,
    seek: audioSeek,
    setRate: audioSetRate,
    close: audioClose,
  };
}
