import { sendGAEvent } from "@next/third-parties/google";
import { loadConsent } from "@/lib/storage/stores";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

type EventName = "study_started" | "question_answered" | "practice_completed";

/** Product-level events only. Never send question content or personal data. */
export function track(event: EventName, params: Record<string, string | number | boolean>) {
  if (GA_ID && loadConsent() === "granted") sendGAEvent("event", event, params);
}
