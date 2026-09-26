import Link from "next/link";
import { AdSlot } from "@/components/ads/ad-slot";
import { ReportQuestion } from "@/components/questions/report-question";
import { buttonClass } from "@/components/ui/button";
import { calculateAccuracy, isCorrectAnswer } from "@/lib/questions/engine";
import type { Question, SessionSummary } from "@/lib/validation/schemas";

type Props = {
  summary: SessionSummary;
  questions: Question[];
  answers: (number | null)[];
  topicNames: Record<string, string>;
  subjectSlug: string;
  /** Review every question (timed mode) instead of only mistakes. */
  reviewAll: boolean;
  onRestart: () => void;
};

function message(accuracy: number) {
  if (accuracy >= 80) return "Excellent work. Keep it up.";
  if (accuracy >= 60) return "Good effort. Review the explanations below to improve further.";
  return "Keep practising. Read each explanation carefully, then try again.";
}

export function SessionResults({ summary, questions, answers, topicNames, subjectSlug, reviewAll, onRestart }: Props) {
  const review = questions
    .map((q, i) => ({ q, answer: answers[i] ?? null }))
    .filter(({ q, answer }) => reviewAll || !isCorrectAnswer(q, answer));
  const topics = Object.entries(summary.topicResults);

  return (
    <div>
      <section className="rounded-xl border border-border bg-card p-6 text-center" aria-labelledby="results-heading">
        <h2 id="results-heading" className="text-lg font-semibold text-muted">Session complete</h2>
        <p className="mt-2 text-4xl font-bold">
          {summary.correct} / {summary.total}
        </p>
        <p className="mt-1 text-muted">
          {summary.accuracy}% accuracy
          {summary.answered < summary.total && ` · ${summary.total - summary.answered} unanswered`}
        </p>
        <p className="mt-3">{message(summary.accuracy)}</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button type="button" onClick={onRestart} className={buttonClass("primary")}>
            Practise again
          </button>
          <Link href={`/subjects/${subjectSlug}`} className={buttonClass("secondary")}>
            Choose another topic
          </Link>
          <Link href="/dashboard" className={buttonClass("ghost")}>
            View progress
          </Link>
        </div>
      </section>

      {topics.length > 1 && (
        <section className="mt-6" aria-labelledby="by-topic">
          <h2 id="by-topic" className="text-lg font-bold">By topic</h2>
          <ul className="mt-2 divide-y divide-border rounded-xl border border-border bg-card">
            {topics.map(([topicId, t]) => (
              <li key={topicId} className="flex justify-between p-3 text-sm">
                <span>{topicNames[topicId] ?? topicId}</span>
                <span className="text-muted">
                  {t.correct}/{t.attempted} · {calculateAccuracy(t.correct, t.attempted)}%
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <AdSlot />

      {review.length > 0 && (
        <section className="mt-6" aria-labelledby="review">
          <h2 id="review" className="text-lg font-bold">{reviewAll ? "Review your answers" : "Review your mistakes"}</h2>
          <ol className="mt-3 space-y-4">
            {review.map(({ q, answer }) => {
              const correct = isCorrectAnswer(q, answer);
              return (
                <li key={q.id} className="rounded-xl border border-border bg-card p-4">
                  <p className="font-semibold">{q.question}</p>
                  <p className={`mt-2 text-sm ${correct ? "text-success" : "text-danger"}`}>
                    {answer === null ? "Not answered" : `${correct ? "✓" : "✗"} Your answer: ${q.options[answer]}`}
                  </p>
                  {!correct && (
                    <p className="text-sm text-success">✓ Correct answer: {q.options[q.correctOption]}</p>
                  )}
                  <p className="mt-2 text-sm text-muted">{q.explanation}</p>
                  <ReportQuestion questionId={q.id} />
                </li>
              );
            })}
          </ol>
        </section>
      )}
    </div>
  );
}
