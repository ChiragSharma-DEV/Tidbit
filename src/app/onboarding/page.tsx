'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import StitchOnboarding from '@/components/stitch/StitchOnboarding';

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <StitchOnboarding
      onComplete={(prefs) => {
        router.push('/trainer');
      }}
      onCancel={() => {
        router.push('/trainer');
      }}
    />
  );
}
