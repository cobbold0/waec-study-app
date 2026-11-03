"use client";

import { useEffect, useRef } from "react";
import { useConsent } from "@/lib/storage/stores";

const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-5952797612434262";
const defaultSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT || "1273092714";
const showPlaceholders = process.env.NEXT_PUBLIC_AD_PLACEHOLDERS === "true" || process.env.NODE_ENV === "development";

declare global {
  interface Window {
    adsbygoogle?: unknown[] & { requestNonPersonalizedAds?: 0 | 1 };
  }
}

interface AdSlotProps {
  variant?: "banner" | "sidebar" | "inline";
  className?: string;
  slot?: string;
  label?: string;
}

/**
 * Clearly labelled display ad for Prep Ghana.
 * Shown to everyone once AdSense is configured; ads are non-personalised unless the visitor accepted cookies.
 * Supports:
 * - "banner": leaderboard (top/bottom)
 * - "sidebar": vertical skyscraper for left and right rails
 * - "inline": in-feed rectangle between topics or question reviews
 */
export function AdSlot({
  variant = "inline",
  className = "",
  slot = defaultSlot,
  label = "Advertisement",
}: AdSlotProps) {
  const consent = useConsent();
  const ref = useRef<HTMLModElement>(null);
  const activeClient = client || "ca-pub-5952797612434262";
  const activeSlot = slot || defaultSlot;
  const enabled = Boolean(activeClient && activeSlot) && consent !== undefined;

  useEffect(() => {
    if (!enabled || !ref.current || ref.current.dataset.adsbygoogleStatus) return;
    try {
      const queue = (window.adsbygoogle = window.adsbygoogle || []);
      queue.requestNonPersonalizedAds = consent === "granted" ? 0 : 1;
      queue.push({});
    } catch {
      // ignore
    }
  }, [enabled, consent]);

  const variantStyles = {
    banner: "w-full my-6 min-h-[90px] sm:min-h-[100px] text-center",
    sidebar: "w-full min-h-[600px] flex flex-col items-center justify-start sticky top-20",
    inline: "w-full my-8 min-h-[250px] text-center",
  };

  if (enabled) {
    return (
      <aside aria-label={label} className={`print:hidden overflow-hidden ${variantStyles[variant]} ${className}`}>
        <p className="mb-1 text-center text-[10px] font-semibold tracking-wider text-muted uppercase">{label}</p>
        <ins
          ref={ref}
          className="adsbygoogle block"
          style={{
            display: "block",
            minHeight: variant === "sidebar" ? 600 : variant === "banner" ? 90 : 250,
          }}
          data-ad-client={activeClient}
          data-ad-slot={activeSlot}
          data-ad-format={variant === "sidebar" ? "vertical" : "auto"}
          data-full-width-responsive={variant !== "sidebar" ? "true" : "false"}
        />
      </aside>
    );
  }

  if (showPlaceholders) {
    return (
      <aside
        aria-label={`${label} Placeholder`}
        className={`print:hidden rounded-lg border border-dashed border-border/80 bg-muted/5 p-2 text-center ${variantStyles[variant]} ${className}`}
      >
        <p className="mb-1 text-[10px] font-semibold tracking-wider text-muted uppercase">
          {label} {variant === "sidebar" ? "(Skyscraper)" : variant === "banner" ? "(Leaderboard)" : "(In-Content)"}
        </p>
        <div
          className={`flex w-full items-center justify-center rounded bg-muted/10 text-xs font-medium text-muted/80 ${
            variant === "sidebar" ? "h-[560px]" : variant === "banner" ? "h-[80px]" : "h-[220px]"
          }`}
        >
          Google AdSense Slot
        </div>
      </aside>
    );
  }

  return null;
}
