/**
 * Session management utilities for anonymous users
 * Generates and stores a cryptographically secure session ID
 */

const SESSION_KEY = 'dobro_session_id';

/**
 * Generates a cryptographically secure session ID
 */
function generateSessionId(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const timestamp = Date.now().toString(36);
  const randomPart = Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return `session_${timestamp}_${randomPart}`;
}

/**
 * Gets the current session ID, creating one if it doesn't exist
 * Uses sessionStorage so session is cleared when browser is closed
 */
export function getSessionId(): string {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  
  return sessionId;
}

/**
 * Clears the current session
 */
export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

/**
 * Checks if a session exists
 */
export function hasSession(): boolean {
  return sessionStorage.getItem(SESSION_KEY) !== null;
}
