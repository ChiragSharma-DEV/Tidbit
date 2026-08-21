import { StaminaGate } from '@/types';

export interface ThresholdRules {
  short: number; // upper limit for short gate (exclusive)
  medium: number; // upper limit for medium gate (exclusive)
}

export const STANDARD_THRESHOLDS: ThresholdRules = {
  short: 300,  // 0 to 299s (5 mins)
  medium: 900, // 300s to 899s (15 mins)
};

export const DEMO_THRESHOLDS: ThresholdRules = {
  short: 30,   // 0 to 29s
  medium: 90,  // 30 to 89s
};

/**
 * Evaluates active reading seconds into the current stamina gate.
 */
export function getStaminaGate(activeSeconds: number, isDemoMode: boolean = false): StaminaGate {
  const rules = isDemoMode ? DEMO_THRESHOLDS : STANDARD_THRESHOLDS;
  
  if (activeSeconds < rules.short) {
    return 'short';
  } else if (activeSeconds < rules.medium) {
    return 'medium';
  } else {
    return 'long';
  }
}

/**
 * Returns the threshold limits for the active mode.
 */
export function getThresholdRules(isDemoMode: boolean = false): ThresholdRules {
  return isDemoMode ? DEMO_THRESHOLDS : STANDARD_THRESHOLDS;
}
