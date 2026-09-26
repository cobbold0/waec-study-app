import { questions } from "@/content/questions";
import type { Question } from "@/lib/validation/schemas";
import { filterQuestions } from "./engine";

/** Server-side access to the question bank. Only pass the filtered pool to the client. */
export function getQuestions(filter: { subjectId: string; topicId?: string | null }): Question[] {
  return filterQuestions(
    questions.filter((q) => q.published),
    filter,
  );
}

export function countQuestionsByTopic(subjectId: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const q of getQuestions({ subjectId })) counts[q.topicId] = (counts[q.topicId] ?? 0) + 1;
  return counts;
}
