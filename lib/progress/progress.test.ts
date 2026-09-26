import { describe, expect, it } from "vitest";
import { questions } from "@/content/questions";
import { emptyProgress, getOverallStats, getSubjectStats, getTopicInsights, MAX_RECENT_SESSIONS, parseProgress, recordAnswer, recordSession } from "./progress";

const q = questions[0];

describe("parseProgress", () => {
  it("returns empty progress for missing data", () => expect(parseProgress(null)).toEqual(emptyProgress()));
  it("returns empty progress for corrupt JSON", () => expect(parseProgress("{not json")).toEqual(emptyProgress()));
  it("returns empty progress for wrong shape", () => expect(parseProgress('{"version":2}')).toEqual(emptyProgress()));

  it("round-trips valid progress", () => {
    const p = recordAnswer(emptyProgress(), q, true, 1);
    expect(parseProgress(JSON.stringify(p))).toEqual(p);
  });
});

describe("recording", () => {
  it("records answers per question and topic", () => {
    let p = recordAnswer(emptyProgress(), q, true, 1);
    p = recordAnswer(p, q, false, 2);
    expect(p.questionStats[q.id]).toEqual({ attempted: 2, correct: 1, lastCorrect: false, lastSeen: 2 });
    expect(getSubjectStats(p, q.subjectId)).toEqual({ attempted: 2, correct: 1, accuracy: 50 });
    expect(getOverallStats(p)).toEqual({ attempted: 2, correct: 1, accuracy: 50 });
  });

  it("keeps a bounded, de-duplicated list of recent sessions", () => {
    let p = emptyProgress();
    const summary = { id: "x", subjectId: "mathematics", topicId: null, mode: "mixed" as const, total: 1, answered: 1, correct: 1, accuracy: 100, startedAt: 0, completedAt: 1, topicResults: {} };
    for (let i = 0; i < MAX_RECENT_SESSIONS + 5; i++) p = recordSession(p, { ...summary, id: `s${i}` });
    p = recordSession(p, { ...summary, id: "s24" });
    expect(p.recentSessions).toHaveLength(MAX_RECENT_SESSIONS);
    expect(p.recentSessions.filter((s) => s.id === "s24")).toHaveLength(1);
  });

  it("identifies strong and weak topics after enough attempts", () => {
    const [a, b] = [questions.find((x) => x.topicId === "algebra")!, questions.find((x) => x.topicId === "geometry")!];
    let p = emptyProgress();
    for (let i = 0; i < 4; i++) p = recordAnswer(p, a, true, i);
    for (let i = 0; i < 4; i++) p = recordAnswer(p, b, i === 0, i);
    const { strong, weak } = getTopicInsights(p);
    expect(strong.map((s) => s.topicId)).toEqual(["algebra"]);
    expect(weak.map((s) => s.topicId)).toEqual(["geometry"]);
  });
});
