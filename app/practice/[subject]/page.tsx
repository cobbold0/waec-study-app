import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { PracticeLoader } from "@/components/study/practice-loader";
import { buttonClass } from "@/components/ui/button";
import { PRACTICE_MODES } from "@/lib/practice/modes";
import { getQuestions } from "@/lib/questions";
import { getSubject, getTopic } from "@/lib/subjects";
import { practiceModeSchema } from "@/lib/validation/schemas";

const searchSchema = z.object({
  mode: practiceModeSchema.optional(),
  topic: z.string().optional(),
});

export const metadata: Metadata = {
  title: "Practice",
  robots: { index: false, follow: false },
};

export default async function PracticePage({ params, searchParams }: PageProps<"/practice/[subject]">) {
  const subject = getSubject((await params).subject);
  const search = searchSchema.safeParse(await searchParams);
  if (!subject || !search.success) notFound();

  const topic = search.data.topic ? getTopic(subject, search.data.topic) : undefined;
  if (search.data.topic && !topic) notFound();
  const mode = search.data.mode ?? (topic ? "topic" : "mixed");
  if (mode === "topic" && !topic) notFound();

  const pool = getQuestions({ subjectId: subject.id, topicId: topic?.id });
  const heading = topic ? `${subject.name}: ${topic.name}` : subject.name;

  return (
    <>
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <div>
          <p className="text-sm text-muted">{PRACTICE_MODES[mode].label}</p>
          <h1 className="text-xl font-bold">{heading}</h1>
        </div>
        <Link href={`/subjects/${subject.slug}`} className="shrink-0 text-sm text-primary hover:underline">
          Exit
        </Link>
      </div>
      {pool.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <p>There are no questions here yet.</p>
          <Link href={`/subjects/${subject.slug}`} className={buttonClass("primary", "mt-4")}>
            Choose another topic
          </Link>
        </div>
      ) : (
        <PracticeLoader
          subject={{ id: subject.id, slug: subject.slug, name: subject.name }}
          topic={topic ? { id: topic.id, slug: topic.slug, name: topic.name } : null}
          topicNames={Object.fromEntries(subject.topics.map((t) => [t.id, t.name]))}
          mode={mode}
          pool={pool}
        />
      )}
    </>
  );
}
