"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui/button";
import type { ReportReason } from "@/lib/validation/schemas";

const REASONS: { value: ReportReason; label: string }[] = [
  { value: "wrong_answer", label: "The marked answer is wrong" },
  { value: "typo", label: "Typo or confusing wording" },
  { value: "unclear_explanation", label: "The explanation is unclear or wrong" },
  { value: "other", label: "Something else" },
];

type Status = "closed" | "open" | "sending" | "sent";

// Not a <form>: it is rendered inside the practice form, and forms cannot be nested.
export function ReportQuestion({ questionId }: { questionId: string }) {
  const [status, setStatus] = useState<Status>("closed");
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [details, setDetails] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (status === "sent") {
    return (
      <p role="status" className="mt-3 text-sm text-muted">
        Thanks for the report. We will check this question.
      </p>
    );
  }

  if (status === "closed") {
    return (
      <button type="button" onClick={() => setStatus("open")} className="mt-3 text-sm text-muted underline hover:text-primary">
        Report a problem with this question
      </button>
    );
  }

  async function send() {
    if (!reason) return;
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, reason, details }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Could not send report. Please try again later.");
      }
      setStatus("sent");
    } catch (e) {
      setError(e instanceof Error && e.message !== "Failed to fetch" ? e.message : "Could not send report. Check your connection and try again.");
      setStatus("open");
    }
  }

  return (
    <div role="group" aria-labelledby={`report-${questionId}`} className="mt-3 rounded-lg border border-border bg-card p-3 text-foreground">
      <h3 id={`report-${questionId}`} className="font-semibold">Report a problem</h3>
      <fieldset className="mt-2 space-y-1.5">
        <legend className="sr-only">What is wrong?</legend>
        {REASONS.map((r) => (
          <label key={r.value} className="flex min-h-9 items-center gap-2 text-sm">
            <input
              type="radio"
              name={`report-reason-${questionId}`}
              value={r.value}
              checked={reason === r.value}
              onChange={() => setReason(r.value)}
              className="size-4 accent-[var(--primary)]"
            />
            {r.label}
          </label>
        ))}
      </fieldset>
      <label className="mt-3 block text-sm">
        Details (optional)
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          maxLength={500}
          rows={3}
          className="mt-1 block w-full rounded-md border border-border bg-background p-2 text-base"
        />
      </label>
      <p className="mt-1 text-xs text-muted">Please don&apos;t include your name, phone number or other personal information.</p>
      {error && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={send} disabled={!reason || status === "sending"} className={buttonClass("primary", "text-sm")}>
          {status === "sending" ? "Sending…" : "Send report"}
        </button>
        <button type="button" onClick={() => setStatus("closed")} className={buttonClass("ghost", "text-sm")}>
          Cancel
        </button>
      </div>
    </div>
  );
}
