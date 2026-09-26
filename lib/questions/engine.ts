import type { Question, QuestionStats } from "@/lib/validation/schemas";

export type Rng = () => number;

export function filterQuestions(
  pool: Question[],
  { subjectId, topicId }: { subjectId: string; topicId?: string | null },
): Question[] {
  return pool.filter((q) => q.subjectId === subjectId && (!topicId || q.topicId === topicId));
}

/** Fisher–Yates shuffle returning a new array. */
export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Picks up to `count` questions, preferring unseen questions, then ones last answered
 * wrongly, then the least recently seen, so students do not see the same few repeatedly.
 */
export function selectQuestions(
  pool: Question[],
  count: number,
  stats: QuestionStats = {},
  rng: Rng = Math.random,
): Question[] {
  const priority = (q: Question) => {
    const s = stats[q.id];
    if (!s) return 0;
    return s.lastCorrect ? 2 : 1;
  };
  const ranked = shuffle(pool, rng).sort(
    (a, b) => priority(a) - priority(b) || (stats[a.id]?.lastSeen ?? 0) - (stats[b.id]?.lastSeen ?? 0),
  );
  return shuffle(ranked.slice(0, Math.max(0, count)), rng);
}

export function isCorrectAnswer(question: Question, optionIndex: number | null): boolean {
  return optionIndex === question.correctOption;
}

export function calculateScore(questions: Question[], answers: (number | null)[]) {
  let correct = 0;
  let answered = 0;
  questions.forEach((q, i) => {
    const answer = answers[i] ?? null;
    if (answer === null) return;
    answered++;
    if (isCorrectAnswer(q, answer)) correct++;
  });
  return { correct, answered, total: questions.length };
}

/** Whole-number percentage; 0 when nothing has been attempted. */
export function calculateAccuracy(correct: number, attempted: number): number {
  return attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
}
