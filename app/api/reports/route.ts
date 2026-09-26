import { getQuestionById } from "@/lib/questions";
import { questionReportSchema } from "@/lib/validation/schemas";

const REASON_LABELS = {
  wrong_answer: "Wrong answer",
  typo: "Typo or wording",
  unclear_explanation: "Unclear explanation",
  other: "Other",
} as const;

// Best-effort, per-instance rate limit: 5 reports per minute per client.
const WINDOW_MS = 60_000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

function isRateLimited(key: string, now: number): boolean {
  if (hits.size > 10_000) hits.clear();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > LIMIT;
}

export async function POST(request: Request) {
  const client = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (isRateLimited(client, Date.now())) {
    return Response.json({ error: "Too many reports. Please try again in a minute." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = questionReportSchema.safeParse(body);
  const question = parsed.success ? getQuestionById(parsed.data.questionId) : undefined;
  if (!parsed.success || !question) {
    return Response.json({ error: "Invalid report." }, { status: 400 });
  }

  const { reason, details } = parsed.data;
  const report = {
    questionId: question.id,
    subjectId: question.subjectId,
    topicId: question.topicId,
    reason,
    details,
    reportedAt: new Date().toISOString(),
  };

  const webhook = process.env.REPORT_WEBHOOK_URL;
  if (!webhook) {
    // No destination configured yet: keep the report in server logs. No IP or personal data is recorded.
    console.info("[question-report]", JSON.stringify(report));
    return Response.json({ ok: true }, { status: 202 });
  }

  const text = [
    `Question report: ${question.id} (${question.subjectId}/${question.topicId})`,
    `Reason: ${REASON_LABELS[reason]}`,
    `Question: ${question.question}`,
    details && `Details: ${details}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    // `text` suits Slack-style webhooks, `content` suits Discord; `report` has structured fields.
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, content: text.slice(0, 2000), report }),
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
  } catch (error) {
    console.error("[question-report] delivery failed:", error instanceof Error ? error.message : error);
    return Response.json({ error: "Could not send report. Please try again later." }, { status: 502 });
  }

  return Response.json({ ok: true }, { status: 202 });
}
