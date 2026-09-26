import Link from "next/link";
import { guides } from "@/content/guides";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card text-sm text-muted">
      <div className="mx-auto grid max-w-3xl gap-6 px-4 py-8 sm:grid-cols-2">
        <nav aria-label="Study guides">
          <h2 className="mb-2 font-semibold text-foreground">Study guides</h2>
          <ul className="space-y-1.5">
            {guides.map((g) => (
              <li key={g.slug}>
                <Link href={`/${g.slug}`} className="hover:text-primary hover:underline">
                  {g.navTitle}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="About">
          <h2 className="mb-2 font-semibold text-foreground">{site.name}</h2>
          <ul className="space-y-1.5">
            <li><Link href="/subjects" className="hover:text-primary hover:underline">All subjects</Link></li>
            <li><Link href="/about" className="hover:text-primary hover:underline">About our questions</Link></li>
            <li><Link href="/privacy" className="hover:text-primary hover:underline">Privacy</Link></li>
          </ul>
        </nav>
        <p className="sm:col-span-2">
          {site.name} is an independent study tool and is not affiliated with or endorsed by the West
          African Examinations Council (WAEC). Practice questions are original unless clearly labelled
          otherwise.
        </p>
      </div>
    </footer>
  );
}
