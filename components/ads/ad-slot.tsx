"use client";

import { useEffect } from "react";

const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT;

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Clearly labelled display ad. Renders nothing until AdSense is configured.
 * Never place inside the active question/answer interface.
 */
export function AdSlot({ className = "" }: { className?: string }) {
  useEffect(() => {
    if (!client || !slot) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

  if (!client || !slot) return null;

  return (
    <aside aria-label="Advertisement" className={`my-8 border-y border-border py-3 ${className}`}>
      <p className="mb-1 text-center text-xs uppercase tracking-wide text-muted">Advertisement</p>
      <ins
        className="adsbygoogle block min-h-[100px]"
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
