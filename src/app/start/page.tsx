'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setLoggedIn, isLoggedIn } from '@/lib/auth/simpleAuth';

export default function StartPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // If already logged in, skip straight to feed
  useEffect(() => {
    if (isLoggedIn()) {
      router.replace('/feed');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields to continue.');
      return;
    }

    // Accept any credentials — no validation
    setLoggedIn({ username: username.trim(), email: email.trim() });
    router.push('/feed');
  };

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

        <div className="mb-6">
          <h2 className="t-title font-display text-[var(--ink)] mb-1">
            Welcome back
          </h2>
          <p className="t-ui text-[var(--graphite)] font-normal">
            Enter any details to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

          {/* Username */}
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="t-ui w-full px-3 py-2.5 bg-[var(--stock)] border border-[var(--rule)] rounded-[var(--r-control)] text-[var(--ink)] placeholder:text-[var(--graphite)] focus:outline-none focus:border-[var(--ink)] transition-colors"
            />
          </div>

          {/* Inline error */}
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
            Continue →
          </button>
        </form>
      </div>

      {/* Footer */}
      <p className="mt-6 t-label text-[var(--graphite)] text-center">
        TIDBIT · DEMO MODE · NO CREDENTIALS ARE VALIDATED
      </p>
    </div>
  );
}
