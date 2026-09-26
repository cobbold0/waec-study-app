import { calculateAccuracy, calculateScore, isCorrectAnswer } from "@/lib/questions/engine";
import type { PracticeMode, PracticeSession, Question, SessionSummary, Tally } from "@/lib/validation/schemas";
import { PRACTICE_MODES } from "./modes";

export function createSession(input: {
  id: string;
  subjectId: string;
  topicId: string | null;
  mode: PracticeMode;
  questionIds: string[];
  now: number;
}): PracticeSession {
  const perQuestion = PRACTICE_MODES[input.mode].secondsPerQuestion;
  return {
    id: input.id,
    subjectId: input.subjectId,
    topicId: input.topicId,
    mode: input.mode,
    questionIds: input.questionIds,
    answers: input.questionIds.map(() => null),
    currentIndex: 0,
    startedAt: input.now,
    completedAt: null,
    timeLimitSec: perQuestion ? perQuestion * input.questionIds.length : null,
  };
}

export function answerCurrent(session: PracticeSession, optionIndex: number): PracticeSession {
  if (session.completedAt !== null) return session;
  const answers = [...session.answers];
  answers[session.currentIndex] = optionIndex;
  return { ...session, answers };
}

export function goToQuestion(session: PracticeSession, index: number): PracticeSession {
  const clamped = Math.min(Math.max(index, 0), session.questionIds.length - 1);
  return { ...session, currentIndex: clamped };
}

export function completeSession(session: PracticeSession, now: number): PracticeSession {
  return session.completedAt === null ? { ...session, completedAt: now } : session;
}

export function isLastQuestion(session: PracticeSession): boolean {
  return session.currentIndex === session.questionIds.length - 1;
}

/** Resolves the session's question ids against a pool; returns null if any are missing. */
export function resolveQuestions(session: PracticeSession, pool: Question[]): Question[] | null {
  const byId = new Map(pool.map((q) => [q.id, q]));
  const resolved = session.questionIds.map((id) => byId.get(id));
  return resolved.every(Boolean) ? (resolved as Question[]) : null;
}

export function summarizeSession(session: PracticeSession, questions: Question[]): SessionSummary {
  const { correct, answered, total } = calculateScore(questions, session.answers);
  const topicResults: Record<string, Tally> = {};
  questions.forEach((q, i) => {
    const answer = session.answers[i] ?? null;
    if (answer === null) return;
    const tally = (topicResults[q.topicId] ??= { attempted: 0, correct: 0 });
    tally.attempted++;
    if (isCorrectAnswer(q, answer)) tally.correct++;
  });
  return {
    id: session.id,
    subjectId: session.subjectId,
    topicId: session.topicId,
    mode: session.mode,
    total,
    answered,
    correct,
    accuracy: calculateAccuracy(correct, answered),
    startedAt: session.startedAt,
    completedAt: session.completedAt ?? session.startedAt,
    topicResults,
  };
}
