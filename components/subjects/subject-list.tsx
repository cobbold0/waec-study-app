import Link from "next/link";
import type { Subject } from "@/lib/validation/schemas";

export function SubjectList({ subjects, className = "" }: { subjects: Subject[]; className?: string }) {
  if (subjects.length === 0) {
    return <p className={`text-muted ${className}`}>No subjects are available yet. Please check back soon.</p>;
  }
  return (
    <ul className={`grid gap-3 sm:grid-cols-2 ${className}`}>
      {subjects.map((s) => (
        <li key={s.id}>
          <Link
            href={`/subjects/${s.slug}`}
            className="flex h-full gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary"
          >
            <span aria-hidden className="text-2xl">{s.icon}</span>
            <span>
              <span className="block font-semibold">{s.name}</span>
              <span className="mt-1 block text-sm text-muted">{s.description}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
