'use client';

import React, { useState } from 'react';
import StitchLogo from './StitchLogo';
import { useAttentionTrainer } from '@/contexts/AttentionTrainerContext';

interface StitchWelcomeSplashProps {
  onStartCalibration: () => void;
  onExploreGuest: () => void;
}

export default function StitchWelcomeSplash({
  onStartCalibration,
  onExploreGuest,
}: StitchWelcomeSplashProps) {
  const { currentUser, loginUser, isDarkMode } = useAttentionTrainer();
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [authError, setAuthError] = useState<string | null>(null);

  const handleDemoLogin = (targetRole: 'student' | 'teacher') => {
    loginUser({
      name: targetRole === 'student' ? 'Alex Rivera' : 'Prof. Sarah Jenkins',
      email: targetRole === 'student' ? 'alex@tidbit.edu' : 'sarah@tidbit.edu',
      role: targetRole,
    });
    onExploreGuest();
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!email || !password) {
      setAuthError('Please fill in all required fields.');
      return;
    }

    if (authModal === 'register' && !name) {
      setAuthError('Please enter your full name.');
      return;
    }

    loginUser({
      name: name || email.split('@')[0],
      email,
      role,
    });

    setAuthModal(null);
    onExploreGuest();
  };

  return (
    <div className="min-h-screen bg-[var(--stock)] text-[var(--ink)] flex flex-col justify-center items-center px-4 sm:px-6 py-12 relative">
      {/* Background Graphic */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#1A1814_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="w-full max-w-xl mx-auto text-center relative z-10 flex flex-col items-center gap-8">
        <div className="space-y-4">
          <StitchLogo variant="full" size="lg" showTagline={true} />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--r-control)] bg-[var(--insert)] border border-[var(--rule)] text-[var(--ink)] t-label font-bold">
            ATTENTION RECALIBRATION ENGINE
          </div>

          <h1 className="t-hero font-display text-[34px] sm:text-[42px] leading-tight">
            Train your attention span with quiet, calibrated reading.
          </h1>

          <p className="t-body text-[16px] text-[var(--graphite)] max-w-md mx-auto">
            Step away from infinite algorithms. Select your reading niches, calibrate your cognitive stamina with swipe cards, and master ideas from beginner to advanced.
          </p>
        </div>

        {/* Main Action Triggers */}
        <div className="w-full max-w-sm flex flex-col gap-3">
          <button
            onClick={onStartCalibration}
            className="w-full bg-[var(--ink)] text-[var(--insert)] hover:opacity-90 t-ui font-semibold py-3.5 rounded-[var(--r-control)] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_1px_2px_rgba(26,24,20,0.04)]"
          >
            <span>Start Niche & Swipe Calibration</span>
          </button>

          <button
            onClick={onExploreGuest}
            className="w-full bg-[var(--insert)] border border-[var(--rule)] text-[var(--ink)] hover:border-[var(--ink)] t-ui font-semibold py-3 rounded-[var(--r-control)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Enter as Guest Explorer</span>
          </button>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setAuthModal('login')}
              className="flex-1 py-2.5 rounded-[var(--r-control)] bg-[var(--insert)] border border-[var(--rule)] text-[var(--graphite)] hover:text-[var(--ink)] t-ui font-semibold cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthModal('register')}
              className="flex-1 py-2.5 rounded-[var(--r-control)] bg-[var(--insert)] border border-[var(--rule)] text-[var(--graphite)] hover:text-[var(--ink)] t-ui font-semibold cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Fast Demo Profiles */}
        <div className="w-full max-w-sm pt-4 border-t border-[var(--rule)] flex flex-col gap-2">
          <span className="t-label text-[var(--graphite)] font-bold">
            FAST 1-CLICK DEMO PROFILES:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoLogin('student')}
              className="p-2.5 rounded-[var(--r-control)] bg-[var(--insert)] border border-[var(--rule)] text-left hover:border-[var(--ink)] transition-colors cursor-pointer group"
            >
              <div className="t-ui font-bold text-[var(--ink)]">
                Student Mode
              </div>
              <div className="t-label text-[var(--graphite)] truncate">
                Alex (Level 2 Reader)
              </div>
            </button>

            <button
              onClick={() => handleDemoLogin('teacher')}
              className="p-2.5 rounded-[var(--r-control)] bg-[var(--insert)] border border-[var(--rule)] text-left hover:border-[var(--ink)] transition-colors cursor-pointer group"
            >
              <div className="t-ui font-bold text-[var(--ink)]">
                Teacher Mode
              </div>
              <div className="t-label text-[var(--graphite)] truncate">
                Prof. Sarah Jenkins
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Auth Modal Overlay */}
      {authModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setAuthModal(null)}
            className="fixed inset-0 bg-[#1A1814]/40"
          />

          <div className="relative w-full max-w-md bg-[var(--insert)] border border-[var(--rule)] rounded-[var(--r-card)] p-6 z-50 shadow-[0_1px_2px_rgba(26,24,20,0.04)] animate-slide-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="t-title font-display text-[24px]">
                {authModal === 'login' ? 'Sign In to Tidbit' : 'Create Your Tidbit Account'}
              </h2>
              <button
                onClick={() => setAuthModal(null)}
                className="t-ui text-[var(--graphite)] hover:text-[var(--ink)] cursor-pointer"
              >
                Close
              </button>
            </div>

            {authError && (
              <div className="mb-4 p-3 rounded-[var(--r-control)] bg-[var(--inset)] border border-[var(--rule)] t-body text-[13px] text-[var(--ink)]">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authModal === 'register' && (
                <div>
                  <label className="t-label block mb-1">FULL NAME</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full px-3 py-2 bg-[var(--insert)] border border-[var(--rule)] rounded-[var(--r-control)] t-ui text-[var(--ink)]"
                  />
                </div>
              )}

              <div>
                <label className="t-label block mb-1">EMAIL ADDRESS</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full px-3 py-2 bg-[var(--insert)] border border-[var(--rule)] rounded-[var(--r-control)] t-ui text-[var(--ink)]"
                />
              </div>

              <div>
                <label className="t-label block mb-1">PASSWORD</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-[var(--insert)] border border-[var(--rule)] rounded-[var(--r-control)] t-ui text-[var(--ink)]"
                />
              </div>

              <div>
                <label className="t-label block mb-1">ACCOUNT TYPE</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-2 rounded-[var(--r-control)] t-ui text-[13px] font-semibold cursor-pointer ${
                      role === 'student'
                        ? 'bg-[var(--ink)] text-[var(--insert)]'
                        : 'bg-[var(--insert)] border border-[var(--rule)] text-[var(--graphite)]'
                    }`}
                  >
                    Student / Reader
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`py-2 rounded-[var(--r-control)] t-ui text-[13px] font-semibold cursor-pointer ${
                      role === 'teacher'
                        ? 'bg-[var(--ink)] text-[var(--insert)]'
                        : 'bg-[var(--insert)] border border-[var(--rule)] text-[var(--graphite)]'
                    }`}
                  >
                    Teacher / Author
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-4 rounded-[var(--r-control)] bg-[var(--ink)] text-[var(--insert)] t-ui font-semibold cursor-pointer"
              >
                {authModal === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
