'use client';

import { useState, useEffect, useRef } from 'react';

export function useStaminaTimer(courseId?: string) {
  const sessionStorageKey = courseId
    ? `Tidbit_stamina_active_seconds_${courseId}`
    : 'Tidbit_stamina_active_seconds';

  const [activeSeconds, _setActiveSeconds] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const isPausedRef = useRef(isPaused);

  // Initialize from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(sessionStorageKey);
      if (saved) {
        _setActiveSeconds(parseInt(saved, 10) || 0);
      }
    }
  }, [sessionStorageKey]);

  // Keep isPausedRef in sync with isPaused state
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Set active seconds state and sync with sessionStorage
  const setActiveSeconds = (value: number | ((prev: number) => number)) => {
    _setActiveSeconds((prev) => {
      const nextValue = typeof value === 'function' ? value(prev) : value;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(sessionStorageKey, nextValue.toString());
      }
      return nextValue;
    });
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const tick = () => {
      if (!isPausedRef.current && document.visibilityState === 'visible' && document.hasFocus()) {
        setActiveSeconds((prev) => prev + 1);
      }
    };

    intervalId = setInterval(tick, 1000);

    // Event listeners to handle visibility change, focus, blur
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') {
        // Paused implicitly by system visibility
      }
    };

    const handleBlur = () => {
      // Blurred implicitly by window blur
    };

    const handleFocus = () => {
      // Focused back
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [sessionStorageKey]);

  return {
    activeSeconds,
    setActiveSeconds,
    isPaused,
    setIsPaused,
  };
}
