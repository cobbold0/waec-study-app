// localStorage can be unavailable (private mode, blocked storage) or full. Never throw.

export const STORAGE_KEYS = {
  progress: "waec-study:progress:v1",
  session: "waec-study:session:v1",
} as const;

const CHANGE_EVENT = "waec-study:storage";

export function readItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeItem(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage full or blocked: progress simply won't persist.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function removeItem(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {}
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Subscribes to changes from this tab and others; for useSyncExternalStore. */
export function subscribeStorage(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}
