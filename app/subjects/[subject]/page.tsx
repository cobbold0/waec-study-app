import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { buttonClass } from "@/components/ui/button";
import { guides } from "@/content/guides";
import { PRACTICE_MODES, practiceHref } from "@/lib/practice/modes";
import { countQuestionsByTopic } from "@/lib/questions";
import { getPublishedSubjects, getSubject } from "@/lib/subjects";

export function generateStaticParams() {
  return getPublishedSubjects().map((s) => ({ subject: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/subjects/[subject]">): Promise<Metadata> {
  const subject = getSubject((await params).subject);
  if (!subject) return {};
  const path = `/subjects/${subject.slug}`;
  return {
    title: `WAEC ${subject.name} Practice Questions by Topic`,
    description: `Practise WAEC ${subject.name} by topic with instant explanations: ${subject.topics
      .map((t) => t.name)
      .join(", ")}.`,
    alternates: { canonical: path },
    openGraph: { url: path },
  };
}

export default async function SubjectPage({ params }: PageProps<"/subjects/[subject]">) {
  const subject = getSubject((await params).subject);
  if (!subject) notFound();

  const counts = countQuestionsByTopic(subject.id);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const related = getPublishedSubjects().filter((s) => s.id !== subject.id);
  const relatedGuides = guides.filter((g) => g.relatedSubjects.includes(subject.slug));

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Subjects", href: "/subjects" },
          { name: subject.name, href: `/subjects/${subject.slug}` },
        ]}
      />
      <h1 className="text-3xl font-bold">
        <span aria-hidden>{subject.icon} </span>
        {subject.name}
      </h1>
      {subject.intro.map((p) => (
        <p key={p} className="mt-3 text-muted">{p}</p>
      ))}

      <section aria-labelledby="modes" className="mt-8">
        <h2 id="modes" className="text-xl font-bold">Practise the whole subject</h2>
        {total === 0 ? (
          <p className="mt-2 text-muted">Questions for this subject are coming soon.</p>
        ) : (
          <ul className="mt-3 grid gap-3 sm:grid-cols-3">
            {(["mixed", "quick", "exam"] as const).map((mode) => (
              <li key={mode}>
                <Link
                  href={practiceHref(subject.slug, mode)}
                  className="block h-full rounded-xl border border-border bg-card p-4 hover:border-primary"
                >
                  <span className="block font-semibold text-primary">{PRACTICE_MODES[mode].label}</span>
                  <span className="mt-1 block text-sm text-muted">{PRACTICE_MODES[mode].description}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="topics" className="mt-8">
        <h2 id="topics" className="text-xl font-bold">Topics</h2>
        <p className="mt-1 text-sm text-muted">
          Topics are grouped for practice and may not match the official WAEC syllabus exactly.
        </p>
        <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-card">
          {subject.topics.map((topic) => {
            const count = counts[topic.id] ?? 0;
            return (
              <li key={topic.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold">{topic.name}</h3>
                  <p className="text-sm text-muted">{topic.description}</p>
                  <p className="mt-1 text-xs text-muted">
                    {count} {count === 1 ? "question" : "questions"}
                  </p>
                </div>
                {count > 0 && (
                  <Link
                    href={practiceHref(subject.slug, "topic", topic.slug)}
                    className={buttonClass("secondary", "shrink-0")}
                    aria-label={`Practise ${topic.name}`}
                  >
                    Practise
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="tips" className="mt-8">
        <h2 id="tips" className="text-xl font-bold">How to study {subject.name}</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          {subject.studyTips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
        {relatedGuides.length > 0 && (
          <p className="mt-4 text-sm">
            Read more:{" "}
            {relatedGuides.map((g, i) => (
              <span key={g.slug}>
                {i > 0 && " · "}
                <Link href={`/${g.slug}`} className="text-primary hover:underline">{g.navTitle}</Link>
              </span>
            ))}
          </p>
        )}
      </section>

      <AdSlot />

      <section aria-labelledby="related" className="mt-8">
        <h2 id="related" className="text-xl font-bold">Other subjects</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {related.map((s) => (
            <li key={s.id}>
              <Link href={`/subjects/${s.slug}`} className={buttonClass("secondary", "text-sm")}>
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
