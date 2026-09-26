import Link from "next/link";
import { site } from "@/lib/site";

const links = [
  { href: "/subjects", label: "Subjects" },
  { href: "/waec-study-tips", label: "Tips" },
  { href: "/dashboard", label: "Progress" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-card">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-3"
      >
        <Link href="/" className="text-lg font-bold text-primary">
          {site.name}
        </Link>
        <ul className="flex items-center gap-1 text-sm font-medium">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="rounded-md px-2.5 py-2 hover:bg-primary-soft">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
