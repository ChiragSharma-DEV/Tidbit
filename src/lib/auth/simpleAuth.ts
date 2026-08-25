/**
 * simpleAuth
 * ──────────
 * Purely client-side "logged-in" flag stored in localStorage.
 * NOT real authentication — no JWT, no server session, no validation.
 * Purpose: drive the login → feed navigation flow only.
 */

const KEY = 'tidbit_logged_in';

export interface SimpleUser {
  username: string;
  email: string;
}

export function setLoggedIn(user: SimpleUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function getLoggedInUser(): SimpleUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SimpleUser;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return getLoggedInUser() !== null;
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
}
