"use client";

import { buttonClass } from "@/components/ui/button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div role="alert" className="py-10 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-muted">Please try again. Your saved progress is safe.</p>
      <button type="button" onClick={reset} className={buttonClass("primary", "mt-6")}>
        Try again
      </button>
    </div>
  );
}
