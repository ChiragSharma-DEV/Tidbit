'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/lib/auth/simpleAuth';

/**
 * Root route: redirect to /feed if logged in, otherwise to /start (login page).
 */
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn()) {
      router.replace('/feed');
    } else {
      router.replace('/start');
    }
  }, [router]);

  return null;
}
