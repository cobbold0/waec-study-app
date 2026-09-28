"use client";

import { useEffect, useEffectEvent } from "react";
import { useConsent } from "@/lib/storage/stores";

const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT;

declare global {
  interface Window {
    adsbygoogle?: unknown[] & { requestNonPersonalizedAds?: 0 | 1 };
  }
}

/**
 * Clearly labelled display ad. Shown to everyone once AdSense is configured; ads are
 * non-personalised unless the visitor accepted cookies.
 * Never place inside the active question/answer interface.
 */
export function AdSlot({ className = "" }: { className?: string }) {
  const consent = useConsent();
  // Wait for the stored consent choice (undefined before hydration) so the first request uses the right mode.
  const enabled = Boolean(client && slot) && consent !== undefined;
  // Request exactly once per slot; the ad mode follows the consent choice at request time.
  const requestAd = useEffectEvent(() => {
    try {
      const queue = (window.adsbygoogle = window.adsbygoogle || []);
      queue.requestNonPersonalizedAds = consent === "granted" ? 0 : 1;
      queue.push({});
    } catch {}
  });
  useEffect(() => {
    if (enabled) requestAd();
  }, [enabled]);

  if (!enabled) return null;

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
