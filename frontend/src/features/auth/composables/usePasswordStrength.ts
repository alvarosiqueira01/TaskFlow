/**
 * features/auth/composables/usePasswordStrength.ts
 *
 * Purely client-side heuristic feedback for the Register / Reset
 * Password forms, per `UI-UX-guidelines.md` section 16 ("inline
 * validation") and section 8 (status colors reused for the strength
 * meter: gray/orange/green). This never talks to the backend — the
 * only enforced rule is the `minLength: 8` constraint already covered
 * by `passwordRule` in `shared/validation`.
 */

import { computed, type Ref } from 'vue';

export type PasswordStrengthLevel = 'empty' | 'weak' | 'fair' | 'strong';

export interface PasswordStrength {
  level: PasswordStrengthLevel;
  label: string;
  /** 0-100, for driving a `ProgressBar`. */
  score: number;
  barVariant: 'neutral' | 'warning' | 'success';
}

function scorePassword(password: string): number {
  if (!password) return 0;

  let score = 0;
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 15;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 20;
  if (/\d/.test(password)) score += 20;
  if (/[^A-Za-z0-9]/.test(password)) score += 20;

  return Math.min(score, 100);
}

export function usePasswordStrength(password: Ref<string>) {
  const strength = computed<PasswordStrength>(() => {
    const score = scorePassword(password.value);

    if (score === 0) {
      return { level: 'empty', label: '', score: 0, barVariant: 'neutral' };
    }
    if (score < 50) {
      return { level: 'weak', label: 'Weak', score, barVariant: 'warning' };
    }
    if (score < 80) {
      return { level: 'fair', label: 'Fair', score, barVariant: 'warning' };
    }
    return { level: 'strong', label: 'Strong', score, barVariant: 'success' };
  });

  return { strength };
}
