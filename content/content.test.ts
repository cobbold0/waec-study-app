import { describe, expect, it } from "vitest";
import { guides } from "@/content/guides";
import { questions } from "@/content/questions";
import { subjects } from "@/content/subjects";
import { questionSchema, subjectSchema } from "@/lib/validation/schemas";

describe("content integrity", () => {
  it("subjects are valid and unique", () => {
    subjects.forEach((s) => subjectSchema.parse(s));
    expect(new Set(subjects.map((s) => s.slug)).size).toBe(subjects.length);
  });

  it("questions are valid, unique and reference existing topics", () => {
    const ids = new Set<string>();
    for (const q of questions) {
      questionSchema.parse(q);
      expect(ids.has(q.id), `duplicate id ${q.id}`).toBe(false);
      ids.add(q.id);
      const subject = subjects.find((s) => s.id === q.subjectId);
      expect(subject, `${q.id} subject`).toBeDefined();
      expect(subject!.topics.some((t) => t.id === q.topicId), `${q.id} topic`).toBe(true);
      expect(new Set(q.options).size, `${q.id} duplicate options`).toBe(q.options.length);
    }
  });

  it("every published topic has questions", () => {
    for (const s of subjects.filter((s) => s.published))
      for (const t of s.topics.filter((t) => t.published))
        expect(questions.filter((q) => q.subjectId === s.id && q.topicId === t.id).length, `${s.id}/${t.id}`).toBeGreaterThanOrEqual(5);
  });

  it("no question is labelled official without review", () => {
    expect(questions.filter((q) => q.sourceType !== "original")).toEqual([]);
  });

  it("guides link to existing subjects and guides", () => {
    const slugs = new Set(guides.map((g) => g.slug));
    for (const g of guides) {
      g.relatedSubjects.forEach((s) => expect(subjects.some((x) => x.slug === s)).toBe(true));
      g.relatedGuides.forEach((s) => expect(slugs.has(s)).toBe(true));
    }
  });
});
