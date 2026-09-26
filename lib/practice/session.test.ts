import { describe, expect, it } from "vitest";
import { questions } from "@/content/questions";
import { answerCurrent, completeSession, createSession, goToQuestion, isLastQuestion, resolveQuestions, summarizeSession } from "./session";

const pool = questions.filter((q) => q.subjectId === "mathematics").slice(0, 3);
const base = { id: "s1", subjectId: "mathematics", topicId: null, questionIds: pool.map((q) => q.id), now: 1000 };

describe("practice session", () => {
  it("creates an untimed session with empty answers", () => {
    const s = createSession({ ...base, mode: "mixed" });
    expect(s.answers).toEqual([null, null, null]);
    expect(s.timeLimitSec).toBeNull();
    expect(s.completedAt).toBeNull();
  });

  it("sets a time limit for timed mode", () => {
    expect(createSession({ ...base, mode: "exam" }).timeLimitSec).toBe(180);
  });

  it("runs a full flow: answer, next, finish, summarise", () => {
    let s = createSession({ ...base, mode: "mixed" });
    s = answerCurrent(s, pool[0].correctOption);
    s = goToQuestion(s, 1);
    s = answerCurrent(s, (pool[1].correctOption + 1) % pool[1].options.length);
    s = goToQuestion(s, 2);
    expect(isLastQuestion(s)).toBe(true);
    s = completeSession(s, 5000);
    expect(answerCurrent(s, 0)).toBe(s); // no changes after completion

    const summary = summarizeSession(s, resolveQuestions(s, pool)!);
    expect(summary).toMatchObject({ total: 3, answered: 2, correct: 1, accuracy: 50, completedAt: 5000 });
  });

  it("clamps navigation", () => {
    const s = createSession({ ...base, mode: "mixed" });
    expect(goToQuestion(s, -1).currentIndex).toBe(0);
    expect(goToQuestion(s, 99).currentIndex).toBe(2);
  });

  it("returns null when questions are missing from the pool", () => {
    const s = createSession({ ...base, mode: "mixed" });
    expect(resolveQuestions(s, pool.slice(0, 2))).toBeNull();
  });
});
