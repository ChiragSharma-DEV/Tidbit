/**
 * simpleAuth
 * ──────────
 * Purely client-side demo authentication using localStorage.
 * NOT real authentication — no hashing, no JWT, no server, no sessions.
 * Purpose: drive a realistic-feeling signup → login → logout flow.
 *
 * Two separate keys:
 *   CREDS_KEY  — saved signup credentials (persists across logouts)
 *   SESSION_KEY — currently logged-in user (cleared on logout)
 */

const SESSION_KEY = 'tidbit_logged_in';
const CREDS_KEY   = 'tidbit_saved_creds';

// ── Types ─────────────────────────────────────────────────────

export interface SimpleUser {
  username: string;
  email: string;
}

interface SavedCreds {
  username: string;
  email: string;
  password: string;
}

// ── Credential storage (signup) ───────────────────────────────

/** Save credentials on first signup. Does NOT mark the user as logged in. */
export function saveCredentials(creds: SavedCreds): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CREDS_KEY, JSON.stringify(creds));
}

/** Returns the saved signup credentials, or null if none exist. */
export function getSavedCredentials(): SavedCreds | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CREDS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedCreds;
  } catch {
    return null;
  }
}

/** True if the user has already signed up (credentials exist in localStorage). */
export function hasAccount(): boolean {
  return getSavedCredentials() !== null;
}

/**
 * Verify login credentials against saved signup credentials.
 * Returns the matching user on success, null on failure.
 */
export function verifyCredentials(email: string, password: string): SimpleUser | null {
  const saved = getSavedCredentials();
  if (!saved) return null;
  if (
    saved.email.trim().toLowerCase() === email.trim().toLowerCase() &&
    saved.password === password
  ) {
    return { username: saved.username, email: saved.email };
  }
  return null;
}

// ── Session (logged-in flag) ──────────────────────────────────

/** Mark a user as logged in for this browser session. */
export function setLoggedIn(user: SimpleUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

/** Returns the currently logged-in user, or null. */
export function getLoggedInUser(): SimpleUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SimpleUser;
  } catch {
    return null;
  }
}

/** True if a user is currently logged in. */
export function isLoggedIn(): boolean {
  return getLoggedInUser() !== null;
}

/**
 * Log out: clears the session flag.
 * Deliberately does NOT delete saved credentials so the user can log back in.
 */
export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}
