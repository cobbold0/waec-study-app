import { describe, expect, it } from "vitest";
import type { Question } from "@/lib/validation/schemas";
import { calculateAccuracy, calculateScore, filterQuestions, isCorrectAnswer, selectQuestions, shuffle } from "./engine";

const make = (id: string, topicId = "t1", subjectId = "s1", correctOption = 0): Question => ({
  id,
  subjectId,
  topicId,
  question: `Q ${id}`,
  options: ["a", "b", "c", "d"],
  correctOption,
  explanation: "because",
  difficulty: "easy",
  questionType: "multiple_choice",
  sourceType: "original",
  published: true,
});

const seeded = (seed = 1) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

describe("filterQuestions", () => {
  const pool = [make("a", "t1"), make("b", "t2"), make("c", "t1", "s2")];
  it("filters by subject", () => expect(filterQuestions(pool, { subjectId: "s1" }).map((q) => q.id)).toEqual(["a", "b"]));
  it("filters by subject and topic", () =>
    expect(filterQuestions(pool, { subjectId: "s1", topicId: "t1" }).map((q) => q.id)).toEqual(["a"]));
});

describe("shuffle", () => {
  it("keeps all items and does not mutate input", () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffle(input, seeded());
    expect([...out].sort()).toEqual(input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("selectQuestions", () => {
  const pool = ["a", "b", "c", "d", "e"].map((id) => make(id));

  it("returns at most count questions without duplicates", () => {
    const picked = selectQuestions(pool, 3, {}, seeded());
    expect(picked).toHaveLength(3);
    expect(new Set(picked.map((q) => q.id)).size).toBe(3);
  });

  it("returns the whole pool when count exceeds it", () => expect(selectQuestions(pool, 10)).toHaveLength(5));
  it("handles an empty pool", () => expect(selectQuestions([], 5)).toEqual([]));

  it("prefers unseen, then previously wrong questions", () => {
    const stats = {
      a: { attempted: 1, correct: 1, lastCorrect: true, lastSeen: 1 },
      b: { attempted: 1, correct: 1, lastCorrect: true, lastSeen: 2 },
      c: { attempted: 1, correct: 0, lastCorrect: false, lastSeen: 3 },
      d: { attempted: 1, correct: 1, lastCorrect: true, lastSeen: 4 },
    };
    const picked = selectQuestions(pool, 2, stats, seeded()).map((q) => q.id).sort();
    expect(picked).toEqual(["c", "e"]);
  });
});

describe("scoring", () => {
  const qs = [make("a", "t1", "s1", 0), make("b", "t1", "s1", 2), make("c", "t1", "s1", 1)];

  it("checks correct and incorrect answers", () => {
    expect(isCorrectAnswer(qs[1], 2)).toBe(true);
    expect(isCorrectAnswer(qs[1], 0)).toBe(false);
    expect(isCorrectAnswer(qs[1], null)).toBe(false);
  });

  it("calculates score ignoring unanswered questions", () =>
    expect(calculateScore(qs, [0, 1, null])).toEqual({ correct: 1, answered: 2, total: 3 }));

  it("calculates accuracy", () => {
    expect(calculateAccuracy(2, 3)).toBe(67);
    expect(calculateAccuracy(0, 0)).toBe(0);
  });
});
