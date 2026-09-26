import type { Question } from "@/lib/validation/schemas";

type QuestionInput = Omit<Question, "subjectId" | "questionType" | "sourceType" | "published"> &
  Partial<Pick<Question, "sourceType" | "published">>;

/** Fills shared defaults. Every question written for this app is original unless stated otherwise. */
export function defineQuestions(subjectId: string, items: QuestionInput[]): Question[] {
  return items.map((item) => ({
    subjectId,
    questionType: "multiple_choice",
    sourceType: "original",
    published: true,
    ...item,
  }));
}
