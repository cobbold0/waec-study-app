import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ads/ad-slot";
import { SubjectList } from "@/components/subjects/subject-list";
import { buttonClass } from "@/components/ui/button";
import { guides } from "@/content/guides";
import { getPublishedSubjects } from "@/lib/subjects";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

const features = [
  { title: "Core subjects", body: "Mathematics, English, Integrated Science and Social Studies, organised by topic." },
  { title: "Practice questions", body: "Original questions covering commonly studied WAEC topics." },
  { title: "Instant explanations", body: "See whether you are right straight away and learn why." },
  { title: "Progress tracking", body: "Find your strong and weak topics. No account needed." },
];

export default function HomePage() {
  const subjects = getPublishedSubjects();
  return (
    <>
      <section className="py-4 sm:py-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Free WAEC practice for Ghana</p>
        <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">{site.tagline}</h1>
        <p className="mt-3 max-w-xl text-lg text-muted">
          Pick a subject, practise questions, get instant explanations and see which topics need more
          work. Built for studying on your phone.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/subjects" className={buttonClass("primary")}>
            Start Studying
          </Link>
          <Link href="#subjects" className={buttonClass("secondary")}>
            Browse Subjects
          </Link>
        </div>
      </section>

      <section aria-labelledby="features" className="mt-6">
        <h2 id="features" className="sr-only">What you get</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {features.map((f) => (
            <li key={f.title} className="rounded-xl border border-border bg-card p-4">
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted">{f.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="subjects" aria-labelledby="subjects-heading" className="mt-10 scroll-mt-4">
        <h2 id="subjects-heading" className="text-2xl font-bold">Subjects</h2>
        <SubjectList subjects={subjects} className="mt-4" />
      </section>

      <AdSlot />

      <section aria-labelledby="guides-heading" className="mt-10">
        <h2 id="guides-heading" className="text-2xl font-bold">Study guides</h2>
        <ul className="mt-4 space-y-2">
          {guides.map((g) => (
            <li key={g.slug}>
              <Link href={`/${g.slug}`} className="font-medium text-primary hover:underline">
                {g.title}
              </Link>
              <p className="text-sm text-muted">{g.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
