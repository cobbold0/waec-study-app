import { subjects } from "@/content/subjects";
import type { Subject, Topic } from "@/lib/validation/schemas";

export function getPublishedSubjects(): Subject[] {
  return subjects
    .filter((s) => s.published)
    .map((s) => ({ ...s, topics: s.topics.filter((t) => t.published) }));
}

export function getSubject(slug: string): Subject | undefined {
  return getPublishedSubjects().find((s) => s.slug === slug);
}

export function getTopic(subject: Subject, slug: string): Topic | undefined {
  return subject.topics.find((t) => t.slug === slug);
}
