/**
 * Lightweight localStorage wrapper with namespaced keys.
 * Used as offline fallback when Supabase is not configured.
 */
const PREFIX = 'rafiq_';

export const store = {
  get<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
      const v = localStorage.getItem(PREFIX + key);
      return v ? JSON.parse(v) : fallback;
    } catch { return fallback; }
  },
  set(key: string, value: unknown) {
    if (typeof window === 'undefined') return;
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch {}
  },
  remove(key: string) {
    if (typeof window === 'undefined') return;
    try { localStorage.removeItem(PREFIX + key); } catch {}
  },
};
