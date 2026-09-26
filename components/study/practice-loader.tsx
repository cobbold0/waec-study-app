"use client";

import dynamic from "next/dynamic";

// The session depends on localStorage (resume + history-aware selection), so render client-only.
export const PracticeLoader = dynamic(() => import("./practice-client").then((m) => m.PracticeClient), {
  ssr: false,
  loading: () => (
    <div role="status" aria-live="polite" className="animate-pulse space-y-3">
      <span className="sr-only">Loading questions…</span>
      <div className="h-2 rounded bg-border" />
      <div className="h-24 rounded-xl bg-border" />
      <div className="h-12 rounded-lg bg-border" />
      <div className="h-12 rounded-lg bg-border" />
      <div className="h-12 rounded-lg bg-border" />
      <div className="h-12 rounded-lg bg-border" />
    </div>
  ),
});
