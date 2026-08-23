'use client';

import React from 'react';

interface StitchLogoProps {
  variant?: 'full' | 'horizontal' | 'mark-only' | 'wordmark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function StitchLogo({
  variant = 'horizontal',
  size = 'md',
  showTagline = false,
  className = '',
  onClick,
}: StitchLogoProps) {
  // Dimension scales
  const markDimensions = {
    sm: { w: 26, h: 28, text: 'text-[18px]', tag: 'text-[7px]' },
    md: { w: 34, h: 38, text: 'text-[24px]', tag: 'text-[8.5px]' },
    lg: { w: 48, h: 54, text: 'text-[32px]', tag: 'text-[10px]' },
    xl: { w: 72, h: 80, text: 'text-[44px]', tag: 'text-[12px]' },
  }[size];

  // SVG Icon Mark matching the official Tidbit design
  const LogoMark = (
    <svg
      width={markDimensions.w}
      height={markDimensions.h}
      viewBox="0 0 100 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-xs select-none"
    >
      {/* Soft Peach / Terracotta Backdrop Card with rounded right top/bottom */}
      <path
        d="M38 12C38 8.68629 40.6863 6 44 6H84C90.6274 6 96 11.3726 96 18V68C96 74.6274 90.6274 80 84 80H44C40.6863 80 38 77.3137 38 74V12Z"
        fill="#E8B8A6"
        className="dark:opacity-85"
      />

      {/* Negative Space Cut / Inner Bookmark Curve */}
      <path
        d="M48 76C48 64 64 60 76 42C80 48 80 66 74 76H48Z"
        fill="#FAF7F2"
        className="dark:fill-[#12131A]"
      />

      {/* Minimalist 3 Horizontal Reading Lines */}
      <line x1="50" y1="88" x2="94" y2="88" stroke="#1A1A1A" strokeWidth="2.5" className="dark:stroke-neutral-300" />
      <line x1="50" y1="94" x2="94" y2="94" stroke="#1A1A1A" strokeWidth="2.5" className="dark:stroke-neutral-300" />
      <line x1="50" y1="100" x2="94" y2="100" stroke="#1A1A1A" strokeWidth="2.5" className="dark:stroke-neutral-300" />

      {/* High-Contrast Elegant Serif 't' Monogram */}
      <text
        x="12"
        y="78"
        fontFamily="Georgia, 'Playfair Display', serif"
        fontSize="76"
        fontWeight="bold"
        fill="#1A1A1A"
        className="dark:fill-white"
      >
        t
      </text>
    </svg>
  );

  if (variant === 'mark-only') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
        title="Tidbit"
      >
        {LogoMark}
      </div>
    );
  }

  if (variant === 'wordmark') {
    return (
      <div
        onClick={onClick}
        className={`flex flex-col ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        <span
          className={`font-serif tracking-[0.16em] lowercase text-on-surface font-bold leading-none ${markDimensions.text}`}
        >
          tidbit
        </span>
        {showTagline && (
          <span
            className={`font-label-mono uppercase tracking-[0.24em] text-graphite font-semibold mt-1 ${markDimensions.tag}`}
          >
            SMALL READS. BIG THOUGHTS.
          </span>
        )}
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div
        onClick={onClick}
        className={`flex flex-col items-center justify-center text-center p-2 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        <div className="mb-2">{LogoMark}</div>
        <span
          className={`font-serif tracking-[0.18em] lowercase text-on-surface font-bold leading-none ${markDimensions.text}`}
        >
          tidbit
        </span>
        <span
          className={`font-label-mono uppercase tracking-[0.28em] text-graphite font-semibold mt-1.5 ${markDimensions.tag}`}
        >
          SMALL READS. BIG THOUGHTS.
        </span>
      </div>
    );
  }

  // Default 'horizontal' variant
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {LogoMark}
      <div className="flex flex-col">
        <span
          className={`font-serif tracking-[0.16em] lowercase text-on-surface font-bold leading-none ${markDimensions.text}`}
        >
          tidbit
        </span>
        {(showTagline || size === 'lg' || size === 'xl') && (
          <span
            className={`font-label-mono uppercase tracking-[0.22em] text-graphite font-semibold mt-0.5 ${markDimensions.tag}`}
          >
            SMALL READS. BIG THOUGHTS.
          </span>
        )}
      </div>
    </div>
  );
}
