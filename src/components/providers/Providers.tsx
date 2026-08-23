'use client';

import { SessionProvider } from 'next-auth/react';
import { ToastProvider } from '@/components/ui/Toast';
import { AttentionTrainerProvider } from '@/contexts/AttentionTrainerContext';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ToastProvider>
        <AttentionTrainerProvider>{children}</AttentionTrainerProvider>
      </ToastProvider>
    </SessionProvider>
  );
}
