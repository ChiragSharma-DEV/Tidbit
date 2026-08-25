'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  isLoggedIn,
  hasAccount,
  saveCredentials,
  verifyCredentials,
  setLoggedIn,
} from '@/lib/auth/simpleAuth';

type Mode = 'signup' | 'login';

export default function StartPage() {
  const router = useRouter();

  // Default to login if credentials already exist, signup if fresh
  const [mode, setMode] = useState<Mode>('signup');
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  // On mount: if already logged in skip to feed; if credentials exist default to login
  useEffect(() => {
    if (isLoggedIn()) {
      router.replace('/feed');
      return;
    }
    if (hasAccount()) {
      setMode('login');
    }
  }, [router]);

  const clearForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setError('');
  };

  const switchMode = (next: Mode) => {
    clearForm();
    setMode(next);
  };

  // ── Sign Up ──────────────────────────────────────────────────
  const handleSignup = () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }
    if (hasAccount()) {
      setError('An account already exists. Please log in instead.');
      switchMode('login');
      return;
    }
    saveCredentials({ username: username.trim(), email: email.trim(), password });
    setLoggedIn({ username: username.trim(), email: email.trim() });
    router.push('/feed');
  };

  // ── Log In ───────────────────────────────────────────────────
  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    const user = verifyCredentials(email.trim(), password);
    if (!user) {
      setError('Invalid email or password.');
      return;
    }
    setLoggedIn(user);
    router.push('/feed');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (mode === 'signup') {
      handleSignup();
    } else {
      handleLogin();
    }
  };

  const isSignup = mode === 'signup';

  return (
    <div className="min-h-screen bg-[var(--stock)] flex flex-col items-center justify-center px-4">

      {/* Brand */}
      <div className="mb-10 text-center select-none">
        <h1 className="t-hero font-display text-[var(--ink)] leading-none mb-2">
          Tidbit
        </h1>
        <p className="t-label text-[var(--graphite)]">
          CALIBRATED READER · ATTENTION TRAINER
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-[var(--insert)] border border-[var(--rule)] rounded-[var(--r-card)] p-8 shadow-[var(--shadow-card)]">

        {/* Mode toggle */}
        <div className="flex gap-1 mb-6 p-1 bg-[var(--stock)] rounded-[var(--r-control)]">
          <button
            type="button"
            onClick={() => switchMode('signup')}
            className={`flex-1 py-1.5 rounded-[var(--r-control)] t-ui font-semibold transition-colors cursor-pointer ${
              isSignup
                ? 'bg-[var(--insert)] text-[var(--ink)] shadow-[var(--shadow-card)]'
                : 'text-[var(--graphite)] hover:text-[var(--ink)]'
            }`}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`flex-1 py-1.5 rounded-[var(--r-control)] t-ui font-semibold transition-colors cursor-pointer ${
              !isSignup
                ? 'bg-[var(--insert)] text-[var(--ink)] shadow-[var(--shadow-card)]'
                : 'text-[var(--graphite)] hover:text-[var(--ink)]'
            }`}
          >
            Log In
          </button>
        </div>

        {/* Heading */}
        <div className="mb-5">
          <h2 className="t-title font-display text-[var(--ink)] mb-1">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="t-ui text-[var(--graphite)] font-normal">
            {isSignup
              ? 'Set up your Tidbit account to get started.'
              : 'Log in to continue your reading streak.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

          {/* Username — signup only */}
          {isSignup && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="t-label text-[var(--graphite)]">
                USERNAME
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your name"
                className="t-ui w-full px-3 py-2.5 bg-[var(--stock)] border border-[var(--rule)] rounded-[var(--r-control)] text-[var(--ink)] placeholder:text-[var(--graphite)] focus:outline-none focus:border-[var(--ink)] transition-colors"
              />
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="t-label text-[var(--graphite)]">
              EMAIL
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="t-ui w-full px-3 py-2.5 bg-[var(--stock)] border border-[var(--rule)] rounded-[var(--r-control)] text-[var(--ink)] placeholder:text-[var(--graphite)] focus:outline-none focus:border-[var(--ink)] transition-colors"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="t-label text-[var(--graphite)]">
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="t-ui w-full px-3 py-2.5 bg-[var(--stock)] border border-[var(--rule)] rounded-[var(--r-control)] text-[var(--ink)] placeholder:text-[var(--graphite)] focus:outline-none focus:border-[var(--ink)] transition-colors"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="t-label text-red-500" role="alert">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 w-full py-2.5 rounded-[var(--r-control)] bg-[var(--ink)] text-[var(--insert)] t-ui font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            {isSignup ? 'Create Account →' : 'Log In →'}
          </button>
        </form>

        {/* Switch hint */}
        <p className="mt-5 t-label text-[var(--graphite)] text-center">
          {isSignup ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-[var(--ink)] underline cursor-pointer"
              >
                Log in
              </button>
            </>
          ) : (
            <>
              No account yet?{' '}
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className="text-[var(--ink)] underline cursor-pointer"
              >
                Sign up
              </button>
            </>
          )}
        </p>
      </div>

      {/* Footer */}
      <p className="mt-6 t-label text-[var(--graphite)] text-center">
        TIDBIT · DEMO MODE · CREDENTIALS STORED LOCALLY
      </p>
    </div>
  );
}
