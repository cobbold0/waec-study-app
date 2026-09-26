import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { buttonClass } from "@/components/ui/button";
import { getGuide, guides } from "@/content/guides";
import { getSubject } from "@/lib/subjects";

export function generateStaticParams() {
  return guides.map((g) => ({ guide: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[guide]">): Promise<Metadata> {
  const guide = getGuide((await params).guide);
  if (!guide) return {};
  return {
    title: { absolute: guide.metaTitle },
    description: guide.description,
    alternates: { canonical: `/${guide.slug}` },
    openGraph: { type: "article", url: `/${guide.slug}`, title: guide.metaTitle, description: guide.description },
  };
}

export default async function GuidePage({ params }: PageProps<"/[guide]">) {
  const guide = getGuide((await params).guide);
  if (!guide) notFound();

  const subjects = guide.relatedSubjects.map(getSubject).filter((s) => s !== undefined);
  const relatedGuides = guide.relatedGuides.map(getGuide).filter((g) => g !== undefined);

  return (
    <article>
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: guide.navTitle, href: `/${guide.slug}` }]} />
      <h1 className="text-3xl font-bold leading-tight">{guide.title}</h1>
      {guide.intro.map((p) => (
        <p key={p} className="mt-3 text-lg text-muted">{p}</p>
      ))}

      {guide.sections.map((section, i) => (
        <section key={section.heading} className="mt-8">
          <h2 className="text-xl font-bold">{section.heading}</h2>
          {section.paragraphs?.map((p) => (
            <p key={p} className="mt-3">{p}</p>
          ))}
          {section.list && (
            <ul className="mt-3 list-disc space-y-2 pl-5">
              {section.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          {i === 1 && <AdSlot />}
        </section>
      ))}

      <section aria-labelledby="start" className="mt-10 rounded-xl border border-border bg-card p-5">
        <h2 id="start" className="text-xl font-bold">Start practising</h2>
        <p className="mt-1 text-muted">Free questions with instant explanations. No sign-up needed.</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {subjects.map((s) => (
            <li key={s.id}>
              <Link href={`/subjects/${s.slug}`} className={buttonClass(subjects.length === 1 ? "primary" : "secondary")}>
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {relatedGuides.length > 0 && (
        <nav aria-labelledby="related-guides" className="mt-8">
          <h2 id="related-guides" className="text-xl font-bold">Related guides</h2>
          <ul className="mt-3 space-y-1">
            {relatedGuides.map((g) => (
              <li key={g.slug}>
                <Link href={`/${g.slug}`} className="text-primary hover:underline">{g.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </article>
  );
}
