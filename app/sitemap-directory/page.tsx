import Link from "next/link";
import { guides } from "@/content/guides";
import { getPublishedSubjects } from "@/lib/subjects";

export const metadata = {
  title: "Sitemap Directory — Prep Ghana",
  description: "Browse all WAEC subjects, practice test modules, syllabus guides, and exam preparation resources.",
};

export default function SitemapDirectoryPage() {
  const subjects = getPublishedSubjects();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Site Directory &amp; Sitemap</h1>
        <p className="mt-2 text-muted">
          All core WAEC subjects, practice modules, and revision guides on Prep Ghana.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Main Pages</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/" className="block rounded-lg border border-border bg-card p-4 hover:border-primary/50">
            <span className="font-semibold text-primary">Home</span>
            <span className="block text-xs text-muted mt-1">Homepage and study launchpad</span>
          </Link>
          <Link href="/subjects" className="block rounded-lg border border-border bg-card p-4 hover:border-primary/50">
            <span className="font-semibold text-primary">All Subjects</span>
            <span className="block text-xs text-muted mt-1">Mathematics, English, Science, Social Studies</span>
          </Link>
          <Link href="/about" className="block rounded-lg border border-border bg-card p-4 hover:border-primary/50">
            <span className="font-semibold text-primary">About Prep Ghana</span>
            <span className="block text-xs text-muted mt-1">Mission, privacy, and educational standards</span>
          </Link>
          <Link href="/privacy" className="block rounded-lg border border-border bg-card p-4 hover:border-primary/50">
            <span className="font-semibold text-primary">Privacy Policy</span>
            <span className="block text-xs text-muted mt-1">Cookies, analytics, and consent settings</span>
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Core WAEC Subjects ({subjects.length})</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {subjects.map((s) => (
            <Link key={s.slug} href={`/subjects/${s.slug}`} className="block rounded-lg border border-border bg-card p-4 hover:border-primary/50">
              <span className="font-semibold text-foreground">{s.name}</span>
              <span className="block text-xs text-muted mt-1">{s.description}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Study Guides &amp; Exam Strategy ({guides.length})</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {guides.map((g) => (
            <Link key={g.slug} href={`/${g.slug}`} className="block rounded-lg border border-border bg-card p-4 hover:border-primary/50">
              <span className="font-semibold text-foreground">{g.title}</span>
              <span className="block text-xs text-muted mt-1">{g.description}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
