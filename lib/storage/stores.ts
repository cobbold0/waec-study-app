import { useSyncExternalStore } from "react";
import { parseProgress } from "@/lib/progress/progress";
import { practiceSessionSchema, type PracticeSession, type Progress } from "@/lib/validation/schemas";
import { readItem, removeItem, STORAGE_KEYS, subscribeStorage, writeItem } from "./local";

export function parseSession(raw: string | null): PracticeSession | null {
  if (!raw) return null;
  try {
    const result = practiceSessionSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export const loadProgress = () => parseProgress(readItem(STORAGE_KEYS.progress));
export const saveProgress = (progress: Progress) => writeItem(STORAGE_KEYS.progress, JSON.stringify(progress));
export const clearProgress = () => removeItem(STORAGE_KEYS.progress);

export const loadActiveSession = () => parseSession(readItem(STORAGE_KEYS.session));
export const saveActiveSession = (session: PracticeSession) =>
  writeItem(STORAGE_KEYS.session, JSON.stringify(session));
export const clearActiveSession = () => removeItem(STORAGE_KEYS.session);

// Snapshots must be referentially stable between renders, so cache by raw string.
function cachedReader<T>(key: string, parse: (raw: string | null) => T) {
  let lastRaw: string | null | undefined;
  let last: T;
  return () => {
    const raw = readItem(key);
    if (raw !== lastRaw) {
      lastRaw = raw;
      last = parse(raw);
    }
    return last;
  };
}

const getProgressSnapshot = cachedReader(STORAGE_KEYS.progress, parseProgress);
const getSessionSnapshot = cachedReader(STORAGE_KEYS.session, parseSession);
const getServerSnapshot = () => undefined;

/** Stored progress, or `undefined` during server render / before hydration. */
export function useProgress(): Progress | undefined {
  return useSyncExternalStore(subscribeStorage, getProgressSnapshot, getServerSnapshot);
}

/** Active session (null if none), or `undefined` before hydration. */
export function useActiveSession(): PracticeSession | null | undefined {
  return useSyncExternalStore(subscribeStorage, getSessionSnapshot, getServerSnapshot);
}
