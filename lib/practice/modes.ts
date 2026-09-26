import type { PracticeMode } from "@/lib/validation/schemas";

type ModeConfig = {
  label: string;
  description: string;
  questionCount: number;
  /** Exam mode hides feedback until the end. */
  instantFeedback: boolean;
  secondsPerQuestion: number | null;
};

export const PRACTICE_MODES: Record<PracticeMode, ModeConfig> = {
  topic: {
    label: "Topic practice",
    description: "Up to 10 questions from one topic with instant feedback.",
    questionCount: 10,
    instantFeedback: true,
    secondsPerQuestion: null,
  },
  mixed: {
    label: "Mixed practice",
    description: "10 questions from across the subject with instant feedback.",
    questionCount: 10,
    instantFeedback: true,
    secondsPerQuestion: null,
  },
  quick: {
    label: "Quick practice",
    description: "5 quick questions when you only have a few minutes.",
    questionCount: 5,
    instantFeedback: true,
    secondsPerQuestion: null,
  },
  exam: {
    label: "Timed practice",
    description: "20 questions, 1 minute each. Answers and explanations are shown at the end.",
    questionCount: 20,
    instantFeedback: false,
    secondsPerQuestion: 60,
  },
};

export function practiceHref(subjectSlug: string, mode: PracticeMode, topicSlug?: string | null): string {
  const params = new URLSearchParams({ mode });
  if (topicSlug) params.set("topic", topicSlug);
  return `/practice/${subjectSlug}?${params}`;
}
