"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { buttonClass } from "@/components/ui/button";
import { saveConsent, useConsent } from "@/lib/storage/stores";

/** Loads analytics only after consent (ads always, see AdSlot), and asks with a non-blocking banner. */
export function ConsentManager({ gaId, adsenseClient }: { gaId?: string; adsenseClient?: string }) {
  const consent = useConsent();
  const pathname = usePathname();

  if (!gaId && !adsenseClient) return null;

  // Ads load for everyone (non-personalised without consent, see AdSlot); analytics only after Accept.
  const scripts = (
    <>
      {consent === "granted" && gaId && <GoogleAnalytics gaId={gaId} />}
      {consent !== undefined && adsenseClient && (
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
      )}
    </>
  );

  // Not hydrated yet, already chosen, or mid-practice (never cover the answer controls).
  if (consent !== null || pathname.startsWith("/practice")) return scripts;

  return (
    <>
      {scripts}
      <section
        aria-label="Cookie consent"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card p-4 shadow-lg"
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center">
          <p className="flex-1 text-sm">
            We use cookies for analytics{adsenseClient ? " and personalised ads" : ""} to improve Prep Ghana.
            Your answers and personal details are never shared.{" "}
            <Link href="/privacy" className="text-primary underline">
              Learn more
            </Link>
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={() => saveConsent("denied")} className={buttonClass("secondary", "flex-1 text-sm")}>
              Decline
            </button>
            <button type="button" onClick={() => saveConsent("granted")} className={buttonClass("primary", "flex-1 text-sm")}>
              Accept
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
