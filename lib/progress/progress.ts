import { calculateAccuracy } from "@/lib/questions/engine";
import { progressSchema, type Progress, type Question, type SessionSummary, type Tally } from "@/lib/validation/schemas";

export const MAX_RECENT_SESSIONS = 20;

export function emptyProgress(): Progress {
  return { version: 1, questionStats: {}, topicStats: {}, recentSessions: [] };
}

/** Parses stored progress, falling back to empty progress when missing or corrupt. */
export function parseProgress(raw: string | null): Progress {
  if (!raw) return emptyProgress();
  try {
    const result = progressSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : emptyProgress();
  } catch {
    return emptyProgress();
  }
}

export const topicKey = (subjectId: string, topicId: string) => `${subjectId}/${topicId}`;

export function recordAnswer(progress: Progress, question: Question, correct: boolean, now: number): Progress {
  const prevQ = progress.questionStats[question.id];
  const key = topicKey(question.subjectId, question.topicId);
  const prevT = progress.topicStats[key] ?? { attempted: 0, correct: 0 };
  return {
    ...progress,
    questionStats: {
      ...progress.questionStats,
      [question.id]: {
        attempted: (prevQ?.attempted ?? 0) + 1,
        correct: (prevQ?.correct ?? 0) + (correct ? 1 : 0),
        lastCorrect: correct,
        lastSeen: now,
      },
    },
    topicStats: {
      ...progress.topicStats,
      [key]: { attempted: prevT.attempted + 1, correct: prevT.correct + (correct ? 1 : 0) },
    },
  };
}

export function recordSession(progress: Progress, summary: SessionSummary): Progress {
  const others = progress.recentSessions.filter((s) => s.id !== summary.id);
  return { ...progress, recentSessions: [summary, ...others].slice(0, MAX_RECENT_SESSIONS) };
}

export function getOverallStats(progress: Progress) {
  let attempted = 0;
  let correct = 0;
  for (const t of Object.values(progress.topicStats)) {
    attempted += t.attempted;
    correct += t.correct;
  }
  return { attempted, correct, accuracy: calculateAccuracy(correct, attempted) };
}

export function getSubjectStats(progress: Progress, subjectId: string): Tally & { accuracy: number } {
  let attempted = 0;
  let correct = 0;
  for (const [key, t] of Object.entries(progress.topicStats)) {
    if (!key.startsWith(`${subjectId}/`)) continue;
    attempted += t.attempted;
    correct += t.correct;
  }
  return { attempted, correct, accuracy: calculateAccuracy(correct, attempted) };
}

export type TopicInsight = { subjectId: string; topicId: string; attempted: number; accuracy: number };

const MIN_ATTEMPTS_FOR_INSIGHT = 3;

/** Topics with enough attempts to judge, split into strong (≥75%) and weak (<60%). */
export function getTopicInsights(progress: Progress) {
  const insights: TopicInsight[] = Object.entries(progress.topicStats)
    .filter(([, t]) => t.attempted >= MIN_ATTEMPTS_FOR_INSIGHT)
    .map(([key, t]) => {
      const [subjectId, topicId] = key.split("/");
      return { subjectId, topicId, attempted: t.attempted, accuracy: calculateAccuracy(t.correct, t.attempted) };
    });
  return {
    strong: insights.filter((i) => i.accuracy >= 75).sort((a, b) => b.accuracy - a.accuracy),
    weak: insights.filter((i) => i.accuracy < 60).sort((a, b) => a.accuracy - b.accuracy),
  };
}
