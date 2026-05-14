import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp, Timestamp } from 'firebase/firestore';

const DEVICE_ID_KEY = 'pathfinder_device_id';
const LOCAL_LIMIT_KEY = 'pathfinder_rate_limit';

// Limits
// Limits
const ANONYMOUS_LIMIT = 3;
const AUTHENTICATED_LIMIT = 10;
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface RateLimitStatus {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  error?: string;
}

/**
 * Gets a unique identifier for the current user or device.
 */
function getIdentifier(): string {
  if (auth?.currentUser) {
    return auth.currentUser.uid;
  }

  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

/**
 * Checks if the current user/device is within their rate limit.
 */
export async function checkRateLimit(): Promise<RateLimitStatus> {
  const identifier = getIdentifier();
  const isAuth = !!auth?.currentUser;
  const limit = isAuth ? AUTHENTICATED_LIMIT : ANONYMOUS_LIMIT;

  // If Firestore is not available, fallback to localStorage
  if (!db) {
    return checkLocalRateLimit(identifier, limit);
  }

  try {
    const docRef = doc(db, 'rate_limits', identifier);
    const docSnap = await getDoc(docRef);

    const now = Date.now();
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      const windowStart = data.windowStart?.toMillis() || now;
      const count = data.count || 0;

      // If window expired, reset
      if (now - windowStart > WINDOW_MS) {
        await setDoc(docRef, {
          count: 0,
          windowStart: serverTimestamp(),
          lastRequest: serverTimestamp(),
          isAuth
        });
        return { allowed: true, remaining: limit, resetAt: new Date(now + WINDOW_MS) };
      }

      const allowed = count < limit;
      const remaining = Math.max(0, limit - count);
      const resetAt = new Date(windowStart + WINDOW_MS);

      return { allowed, remaining, resetAt };
    } else {
      // First time initialization
      await setDoc(docRef, {
        count: 0,
        windowStart: serverTimestamp(),
        lastRequest: serverTimestamp(),
        isAuth
      });
      return { allowed: true, remaining: limit, resetAt: new Date(now + WINDOW_MS) };
    }
  } catch (error) {
    console.error('[RateLimiter] Firestore check failed, falling back to local:', error);
    return checkLocalRateLimit(identifier, limit);
  }
}

/**
 * Increments the rate limit count for the current user/device.
 */
export async function incrementRateLimit(): Promise<void> {
  const identifier = getIdentifier();

  if (!db) {
    incrementLocalRateLimit();
    return;
  }

  try {
    const docRef = doc(db, 'rate_limits', identifier);
    await updateDoc(docRef, {
      count: increment(1),
      lastRequest: serverTimestamp()
    });
  } catch (error) {
    console.error('[RateLimiter] Firestore increment failed, falling back to local:', error);
    incrementLocalRateLimit();
  }
}

// --- Local Fallback ---

function checkLocalRateLimit(id: string, limit: number): RateLimitStatus {
  const stored = localStorage.getItem(LOCAL_LIMIT_KEY);
  const now = Date.now();

  if (!stored) {
    return { allowed: true, remaining: limit, resetAt: new Date(now + WINDOW_MS) };
  }

  try {
    const { count, windowStart } = JSON.parse(stored);
    
    if (now - windowStart > WINDOW_MS) {
      return { allowed: true, remaining: limit, resetAt: new Date(now + WINDOW_MS) };
    }

    const allowed = count < limit;
    return { 
      allowed, 
      remaining: Math.max(0, limit - count), 
      resetAt: new Date(windowStart + WINDOW_MS) 
    };
  } catch {
    return { allowed: true, remaining: limit, resetAt: new Date(now + WINDOW_MS) };
  }
}

function incrementLocalRateLimit() {
  const stored = localStorage.getItem(LOCAL_LIMIT_KEY);
  const now = Date.now();

  if (!stored) {
    localStorage.setItem(LOCAL_LIMIT_KEY, JSON.stringify({ count: 1, windowStart: now }));
    return;
  }

  try {
    const { count, windowStart } = JSON.parse(stored);
    if (now - windowStart > WINDOW_MS) {
      localStorage.setItem(LOCAL_LIMIT_KEY, JSON.stringify({ count: 1, windowStart: now }));
    } else {
      localStorage.setItem(LOCAL_LIMIT_KEY, JSON.stringify({ count: count + 1, windowStart }));
    }
  } catch {
    localStorage.setItem(LOCAL_LIMIT_KEY, JSON.stringify({ count: 1, windowStart: now }));
  }
}

/**
 * Static check for UI display (does not hit Firestore if possible, or just returns last known)
 * For now, it just calls checkRateLimit but we could optimize it later.
 */
export async function getRateLimitStatus(): Promise<RateLimitStatus> {
  return checkRateLimit();
}

export class RateLimitError extends Error {
  constructor(public status: RateLimitStatus) {
    super(`Rate limit exceeded. Try again after ${status.resetAt.toLocaleTimeString()}.`);
    this.name = 'RateLimitError';
  }
}
