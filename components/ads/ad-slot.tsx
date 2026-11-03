"use client";

import { useEffect, useRef, useState } from "react";
import { useConsent } from "@/lib/storage/stores";

const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-5952797612434262";
const defaultSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT || "1273092714";

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
 *
 * Unfilled ads collapse cleanly without leaving broken placeholder texts.
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
  const isConfigured = Boolean(activeClient && activeSlot);
  const [isUnfilled, setIsUnfilled] = useState(false);

  useEffect(() => {
    if (!isConfigured || !ref.current || ref.current.dataset.adsbygoogleStatus) return;
    try {
      const queue = (window.adsbygoogle = window.adsbygoogle || []);
      queue.requestNonPersonalizedAds = consent === "granted" ? 0 : 1;
      queue.push({});
    } catch {
      // ignore
    }

    const ins = ref.current;
    if (!ins) return;
    const observer = new MutationObserver(() => {
      if (ins.getAttribute("data-ad-status") === "unfilled") {
        setIsUnfilled(true);
      }
    });
    observer.observe(ins, { attributes: true, attributeFilter: ["data-ad-status"] });
    return () => observer.disconnect();
  }, [isConfigured, consent]);

  const variantStyles = {
    banner: "w-full my-6 min-h-[90px] sm:min-h-[100px] text-center",
    sidebar: "w-full min-h-[600px] flex flex-col items-center justify-start sticky top-20",
    inline: "w-full my-8 min-h-[250px] text-center",
  };

  if (!isConfigured || isUnfilled) {
    return null;
  }

  return (
    <aside
      aria-label={label}
      className={`print:hidden overflow-hidden transition-all duration-300 ${variantStyles[variant]} ${className}`}
    >
      <p className="mb-1 text-center text-[9px] font-medium tracking-wider text-muted-foreground/60 uppercase select-none">
        {label}
      </p>
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
