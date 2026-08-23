'use client';

import React, { useState, useEffect } from 'react';
import StitchLogo from './StitchLogo';
import { useAttentionTrainer } from '@/contexts/AttentionTrainerContext';

interface StitchWelcomeSplashProps {
  onStartCalibration: () => void;
  onExploreGuest: () => void;
}

const ROTATING_QUOTES = [
  'Quieting algorithmic noise...',
  'Calibrating cognitive bandwidth...',
  'Stitching unbroken focus streams...',
  'Preparing your personalized reading track...',
];

export default function StitchWelcomeSplash({
  onStartCalibration,
  onExploreGuest,
}: StitchWelcomeSplashProps) {
  const { isDarkMode, toggleDarkMode, loginUser } = useAttentionTrainer();

  // Phase: 'loading' -> 'gateway'
  const [phase, setPhase] = useState<'loading' | 'gateway'>('loading');
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [authModal, setAuthModal] = useState<'none' | 'login' | 'register'>('none');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Initial loading timer
  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % ROTATING_QUOTES.length);
    }, 600);

    const finishTimer = setTimeout(() => {
      setPhase('gateway');
      clearInterval(quoteTimer);
    }, 1400);

    return () => {
      clearInterval(quoteTimer);
      clearTimeout(finishTimer);
    };
  }, []);

  const handleDemoLogin = (userType: 'student' | 'teacher') => {
    loginUser({
      name: userType === 'student' ? 'Alex Rivera' : 'Prof. Marcus Vance',
      email: `${userType}@tidbit.ai`,
      role: userType,
      isGuest: false,
    });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter email and password');
      return;
    }
    setIsSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      loginUser({
        name: email.split('@')[0] || 'Scholar',
        email,
        role: 'student',
        isGuest: false,
      });
      setIsSubmitting(false);
      setAuthModal('none');
    }, 600);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    setIsSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      loginUser({
        name,
        email,
        role,
        isGuest: false,
      });
      setIsSubmitting(false);
      setAuthModal('none');
      onStartCalibration();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-paper text-on-surface flex flex-col justify-between overflow-y-auto selection:bg-tertiary-fixed selection:text-on-tertiary-fixed transition-colors duration-300">
      {/* Top Bar with Dark Mode Toggle */}
      <div className="px-6 py-4 flex justify-between items-center border-b border-hairline bg-paper sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <StitchLogo variant="horizontal" size="sm" showTagline={false} />
          <span className="font-label-mono text-[9px] text-graphite uppercase tracking-widest px-2 py-0.5 rounded bg-surface-container-lowest border border-hairline">
            QUIET PRINT
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-9 h-9 rounded-full border border-hairline bg-surface-container-lowest flex items-center justify-center text-graphite hover:text-ink-blue transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Center Stage */}
      <div className="flex-1 max-w-xl mx-auto w-full px-6 py-10 flex flex-col justify-center items-center text-center">
        {phase === 'loading' ? (
          /* Dynamic Loading Animation with Official Logo */
          <div className="flex flex-col items-center gap-6 animate-pulse">
            <StitchLogo variant="full" size="xl" showTagline={true} />

            <div className="space-y-2">
              <p className="font-label-mono text-[12px] text-ink-blue uppercase tracking-widest transition-all duration-300 h-5">
                {ROTATING_QUOTES[quoteIndex]}
              </p>
            </div>

            <div className="w-48 bg-surface-container-lowest border border-hairline h-1 rounded-full overflow-hidden">
              <div className="bg-ink-blue h-full w-full animate-shimmer" />
            </div>
          </div>
        ) : (
          /* Gateway View */
          <div className="w-full flex flex-col items-center gap-8 animate-slide-in">
            <div className="space-y-4">
              <StitchLogo variant="full" size="lg" showTagline={true} />

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest border border-hairline text-ink-blue font-label-mono text-[11px] uppercase font-bold tracking-wider">
                <span className="w-2 h-2 rounded-full bg-ink-blue animate-ping" />
                ATTENTION RECALIBRATION ENGINE
              </div>

              <h1 className="font-headline-md text-[34px] sm:text-[40px] font-serif text-on-surface leading-tight tracking-tight">
                Train your attention span with quiet, calibrated reading.
              </h1>

              <p className="font-article-body-mobile text-[16px] text-graphite max-w-md mx-auto leading-relaxed">
                Step away from infinite algorithms. Select your reading niches, calibrate your cognitive stamina with swipe cards, and master ideas from beginner to advanced.
              </p>
            </div>

            {/* Main Action Triggers */}
            <div className="w-full max-w-sm flex flex-col gap-3">
              {/* Option 1: Onboarding Calibration */}
              <button
                onClick={onStartCalibration}
                className="w-full bg-primary-container hover:bg-ink-blue text-white font-ui-button text-[16px] py-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <span>Start Niche & Swipe Calibration</span>
                <span className="material-symbols-outlined text-[20px]">tune</span>
              </button>

              {/* Option 2: Direct Guest Exploration */}
              <button
                onClick={onExploreGuest}
                className="w-full bg-surface-container-lowest border-2 border-hairline hover:border-ink-blue/50 text-on-surface hover:text-ink-blue font-ui-button text-[15px] py-3.5 rounded-lg transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>Enter as Guest Explorer</span>
              </button>

              {/* Option 3: Sign In / Create Account triggers */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setAuthModal('login')}
                  className="flex-1 py-2.5 rounded bg-surface-container-lowest border border-hairline text-graphite hover:text-ink-blue font-ui-button text-[13px] transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthModal('register')}
                  className="flex-1 py-2.5 rounded bg-surface-container-lowest border border-hairline text-graphite hover:text-ink-blue font-ui-button text-[13px] transition-colors cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </div>

            {/* 1-Click Demo Profiles */}
            <div className="w-full max-w-sm pt-4 border-t border-hairline flex flex-col gap-2">
              <span className="font-label-mono text-[10px] text-graphite uppercase font-bold tracking-widest">
                FAST 1-CLICK DEMO PROFILES:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleDemoLogin('student')}
                  className="p-2.5 rounded bg-surface-container-lowest border border-hairline text-left hover:border-ink-blue transition-colors cursor-pointer group"
                >
                  <div className="font-ui-button text-[12px] font-bold text-on-surface group-hover:text-ink-blue">
                    Student Mode 🎓
                  </div>
                  <div className="font-label-mono text-[10px] text-graphite truncate">
                    Alex (Level 2 Reader)
                  </div>
                </button>

                <button
                  onClick={() => handleDemoLogin('teacher')}
                  className="p-2.5 rounded bg-surface-container-lowest border border-hairline text-left hover:border-ink-blue transition-colors cursor-pointer group"
                >
                  <div className="t-ui text-[12px] font-semibold text-[var(--ink)]">
                    Curator Mode
                  </div>
                  <div className="font-label-mono text-[10px] text-graphite truncate">
                    Prof. Marcus (Level 3)
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <footer className="px-6 py-4 border-t border-hairline text-center">
        <span className="font-label-mono text-[11px] text-graphite">
          TIDBIT ATTENTION TRAINER · DESIGNED FOR DISTRACTION-FREE COGNITION
        </span>
      </footer>

      {/* Login Modal */}
      {authModal === 'login' && (
        <div className="fixed inset-0 z-50 bg-[#0E0F14]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-hairline rounded-xl w-full max-w-md p-6 shadow-2xl animate-slide-in">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-hairline">
              <div>
                <h3 className="font-headline-md text-[24px] font-serif text-on-surface">
                  Sign in to Tidbit
                </h3>
                <p className="font-sans text-[13px] text-graphite">
                  Restore your calibrated reading track & stats
                </p>
              </div>
              <button
                onClick={() => setAuthModal('none')}
                className="text-graphite hover:text-ink-blue cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 p-2.5 rounded bg-error/10 border border-error text-error text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block font-label-mono text-[11px] uppercase text-graphite mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 bg-paper border border-hairline rounded font-ui-button text-[14px] focus:outline-none focus:border-ink-blue text-on-surface"
                />
              </div>

              <div>
                <label className="block font-label-mono text-[11px] uppercase text-graphite mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-paper border border-hairline rounded font-ui-button text-[14px] focus:outline-none focus:border-ink-blue text-on-surface"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-container hover:bg-ink-blue text-white font-ui-button text-[15px] py-3 rounded transition-colors shadow-sm cursor-pointer mt-2"
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-hairline text-center text-xs text-graphite">
              Don't have an account?{' '}
              <button
                onClick={() => setAuthModal('register')}
                className="text-ink-blue font-bold hover:underline"
              >
                Create one free
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {authModal === 'register' && (
        <div className="fixed inset-0 z-50 bg-[#0E0F14]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-hairline rounded-xl w-full max-w-md p-6 shadow-2xl animate-slide-in">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-hairline">
              <div>
                <h3 className="font-headline-md text-[24px] font-serif text-on-surface">
                  Create Tidbit Account
                </h3>
                <p className="font-sans text-[13px] text-graphite">
                  Begin your personalized attention journey
                </p>
              </div>
              <button
                onClick={() => setAuthModal('none')}
                className="text-graphite hover:text-ink-blue cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 p-2.5 rounded bg-error/10 border border-error text-error text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block font-label-mono text-[11px] uppercase text-graphite mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ada Lovelace"
                  className="w-full px-3.5 py-2.5 bg-paper border border-hairline rounded font-ui-button text-[14px] focus:outline-none focus:border-ink-blue text-on-surface"
                />
              </div>

              <div>
                <label className="block font-label-mono text-[11px] uppercase text-graphite mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 bg-paper border border-hairline rounded font-ui-button text-[14px] focus:outline-none focus:border-ink-blue text-on-surface"
                />
              </div>

              <div>
                <label className="block font-label-mono text-[11px] uppercase text-graphite mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-paper border border-hairline rounded font-ui-button text-[14px] focus:outline-none focus:border-ink-blue text-on-surface"
                />
              </div>

              {/* Role Selection */}
              <div>
                <label className="block font-label-mono text-[11px] uppercase text-graphite mb-1">
                  I want to...
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-2 px-3 rounded border text-center font-ui-button text-[12px] transition-all cursor-pointer ${
                      role === 'student'
                        ? 'bg-ink-blue text-white font-bold border-ink-blue'
                        : 'bg-paper border-hairline text-graphite'
                    }`}
                  >
                    🎓 Learn & Read
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`py-2 px-3 rounded border text-center t-ui text-[12px] transition-all cursor-pointer ${
                      role === 'teacher'
                        ? 'bg-[var(--ink)] text-[var(--insert)] font-bold border-[var(--ink)]'
                        : 'bg-[var(--insert)] border-[var(--rule)] text-[var(--graphite)]'
                    }`}
                  >
                    Teach & Curate
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-container hover:bg-ink-blue text-white font-ui-button text-[15px] py-3 rounded transition-colors shadow-sm cursor-pointer mt-2"
              >
                {isSubmitting ? 'Creating account...' : 'Create Account & Calibrate'}
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-hairline text-center text-xs text-graphite">
              Already have an account?{' '}
              <button
                onClick={() => setAuthModal('login')}
                className="text-ink-blue font-bold hover:underline"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
