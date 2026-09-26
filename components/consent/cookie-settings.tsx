"use client";

import { clearConsent, useConsent } from "@/lib/storage/stores";

export function CookieSettings() {
  const consent = useConsent();
  if (consent === undefined) return null;

  return (
    <p className="text-sm">
      Your current choice:{" "}
      <strong>{consent === "granted" ? "accepted" : consent === "denied" ? "declined" : "not chosen yet"}</strong>.{" "}
      {consent !== null && (
        <button
          type="button"
          className="text-primary underline"
          onClick={() => {
            clearConsent();
            // Scripts already loaded this visit can only be removed by reloading.
            if (consent === "granted") window.location.reload();
          }}
        >
          Change cookie choice
        </button>
      )}
    </p>
  );
}
