"use client";

import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { PRACTICE_MODES, practiceHref } from "@/lib/practice/modes";
import { getOverallStats, getSubjectStats, getTopicInsights, type TopicInsight } from "@/lib/progress/progress";
import { clearActiveSession, clearProgress, useActiveSession, useProgress } from "@/lib/storage/stores";

type DashboardSubject = {
  id: string;
  slug: string;
  name: string;
  icon: string;
  topics: { id: string; slug: string; name: string }[];
};

type LabelledInsight = TopicInsight & { subject: DashboardSubject; topic: DashboardSubject["topics"][number] };

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export function DashboardClient({ subjects }: { subjects: DashboardSubject[] }) {
  const progress = useProgress();
  const activeSession = useActiveSession();

  if (progress === undefined) {
    return (
      <div role="status" className="mt-6 animate-pulse space-y-3">
        <span className="sr-only">Loading progress…</span>
        <div className="h-24 rounded-xl bg-border" />
        <div className="h-40 rounded-xl bg-border" />
      </div>
    );
  }

  const subjectById = new Map(subjects.map((s) => [s.id, s]));
  const findTopic = (subjectId: string, topicId: string | null) =>
    topicId ? subjectById.get(subjectId)?.topics.find((t) => t.id === topicId) : undefined;

  const overall = getOverallStats(progress);
  const { strong, weak } = getTopicInsights(progress);

  const resumable =
    activeSession && activeSession.completedAt === null && subjectById.has(activeSession.subjectId) ? activeSession : null;

  if (overall.attempted === 0 && !resumable) {
    return (
      <div className="mt-6 rounded-xl border border-border bg-card p-6 text-center">
        <h2 className="text-lg font-semibold">No practice yet</h2>
        <p className="mt-1 text-muted">Answer a few questions and your progress will appear here.</p>
        <Link href="/subjects" className={buttonClass("primary", "mt-4")}>
          Start Studying
        </Link>
      </div>
    );
  }

  const withLabels = (list: TopicInsight[]): LabelledInsight[] =>
    list.flatMap((i) => {
      const subject = subjectById.get(i.subjectId);
      const topic = findTopic(i.subjectId, i.topicId);
      return subject && topic ? [{ ...i, subject, topic }] : [];
    });

  return (
    <div className="mt-6 space-y-8">
      {resumable && (
        <section aria-labelledby="continue" className="rounded-xl border-2 border-primary bg-primary-soft p-4">
          <h2 id="continue" className="font-semibold">Continue studying</h2>
          <p className="mt-1 text-sm">
            {subjectById.get(resumable.subjectId)?.name}
            {findTopic(resumable.subjectId, resumable.topicId) && `: ${findTopic(resumable.subjectId, resumable.topicId)?.name}`} ·{" "}
            {PRACTICE_MODES[resumable.mode].label} · {resumable.answers.filter((a) => a !== null).length} of{" "}
            {resumable.questionIds.length} answered
          </p>
          <Link
            href={practiceHref(
              subjectById.get(resumable.subjectId)!.slug,
              resumable.mode,
              findTopic(resumable.subjectId, resumable.topicId)?.slug,
            )}
            className={buttonClass("primary", "mt-3")}
          >
            Resume
          </Link>
        </section>
      )}

      <section aria-labelledby="overall">
        <h2 id="overall" className="sr-only">Overall</h2>
        <dl className="grid grid-cols-3 gap-3 text-center">
          {[
            ["Answered", overall.attempted],
            ["Correct", overall.correct],
            ["Accuracy", `${overall.accuracy}%`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-border bg-card p-3">
              <dt className="text-xs text-muted">{label}</dt>
              <dd className="text-2xl font-bold">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="subjects-progress">
        <h2 id="subjects-progress" className="text-xl font-bold">Subjects</h2>
        <ul className="mt-3 space-y-2">
          {subjects.map((s) => {
            const stats = getSubjectStats(progress, s.id);
            return (
              <li key={s.id}>
                <Link
                  href={`/subjects/${s.slug}`}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 hover:border-primary"
                >
                  <span aria-hidden className="text-xl">{s.icon}</span>
                  <span className="flex-1">
                    <span className="block font-medium">{s.name}</span>
                    <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-border" aria-hidden>
                      <span className="block h-full bg-primary" style={{ width: `${stats.accuracy}%` }} />
                    </span>
                  </span>
                  <span className="text-right text-sm text-muted">
                    {stats.attempted > 0 ? `${stats.accuracy}% of ${stats.attempted}` : "Not started"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="grid gap-6 sm:grid-cols-2">
        <InsightList
          title="Needs improvement"
          empty="No weak topics yet. Topics with under 60% accuracy (after at least 3 answers) will show here."
          items={withLabels(weak)}
        />
        <InsightList
          title="Strong areas"
          empty="Topics with 75% accuracy or more (after at least 3 answers) will show here."
          items={withLabels(strong)}
        />
      </div>

      {progress.recentSessions.length > 0 && (
        <section aria-labelledby="recent">
          <h2 id="recent" className="text-xl font-bold">Recent practice</h2>
          <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-card">
            {progress.recentSessions.slice(0, 10).map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 p-3 text-sm">
                <span>
                  <span className="block font-medium">
                    {subjectById.get(r.subjectId)?.name ?? r.subjectId}
                    {findTopic(r.subjectId, r.topicId) && `: ${findTopic(r.subjectId, r.topicId)?.name}`}
                  </span>
                  <span className="text-muted">
                    {PRACTICE_MODES[r.mode].label} · {dateFormat.format(r.completedAt)}
                  </span>
                </span>
                <span className="shrink-0 font-semibold">
                  {r.correct}/{r.total}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="border-t border-border pt-6">
        <button
          type="button"
          className="text-sm text-danger underline"
          onClick={() => {
            if (window.confirm("Delete all progress saved on this device? This cannot be undone.")) {
              clearProgress();
              clearActiveSession();
            }
          }}
        >
          Reset progress
        </button>
      </section>
    </div>
  );
}

function InsightList({ title, empty, items }: { title: string; empty: string; items: LabelledInsight[] }) {
  return (
    <section aria-label={title}>
      <h2 className="text-xl font-bold">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-muted">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.slice(0, 5).map((item) => (
            <li key={`${item.subjectId}/${item.topicId}`}>
              <Link
                href={practiceHref(item.subject.slug, "topic", item.topic.slug)}
                className="flex justify-between gap-2 rounded-lg border border-border bg-card p-3 text-sm hover:border-primary"
              >
                <span>
                  <span className="block font-medium">{item.topic.name}</span>
                  <span className="text-muted">{item.subject.name}</span>
                </span>
                <span className="shrink-0 font-semibold">{item.accuracy}%</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
