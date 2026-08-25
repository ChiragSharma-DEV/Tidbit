'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/lib/auth/simpleAuth';
import StitchApp from '@/components/stitch/StitchApp';

export default function FeedPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/start');
    }
  }, [router]);

  // Synchronous guard on client: avoids flash of feed before redirect
  if (typeof window !== 'undefined' && !isLoggedIn()) {
    return null;
  }

  return <StitchApp initialTab="feed" />;
}
