import { z } from "zod";

export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const topicSchema = z.object({
  id: slugSchema,
  slug: slugSchema,
  name: z.string().min(1),
  description: z.string().min(1),
  published: z.boolean(),
});

export const subjectSchema = z.object({
  id: slugSchema,
  slug: slugSchema,
  name: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  published: z.boolean(),
  intro: z.array(z.string().min(1)).min(1),
  studyTips: z.array(z.string().min(1)).min(1),
  topics: z.array(topicSchema).min(1),
});

export const sourceTypeSchema = z.enum(["original", "official", "licensed", "user_generated"]);
export const difficultySchema = z.enum(["easy", "medium", "hard"]);

export const questionSchema = z
  .object({
    id: z.string().min(1),
    subjectId: slugSchema,
    topicId: slugSchema,
    question: z.string().min(1),
    options: z.array(z.string().min(1)).min(2).max(5),
    correctOption: z.number().int().nonnegative(),
    explanation: z.string().min(1),
    difficulty: difficultySchema,
    questionType: z.literal("multiple_choice"),
    sourceType: sourceTypeSchema,
    image: z
      .object({
        src: z.string().min(1),
        alt: z.string().min(1),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
      })
      .optional(),
    published: z.boolean(),
  })
  .refine((q) => q.correctOption < q.options.length, {
    message: "correctOption must index an existing option",
  });

export const practiceModeSchema = z.enum(["topic", "mixed", "quick", "exam"]);

export const practiceSessionSchema = z.object({
  id: z.string().min(1),
  subjectId: slugSchema,
  topicId: slugSchema.nullable(),
  mode: practiceModeSchema,
  questionIds: z.array(z.string().min(1)).min(1),
  answers: z.array(z.number().int().nonnegative().nullable()),
  currentIndex: z.number().int().nonnegative(),
  startedAt: z.number(),
  completedAt: z.number().nullable(),
  timeLimitSec: z.number().int().positive().nullable(),
});

const tallySchema = z.object({
  attempted: z.number().int().nonnegative(),
  correct: z.number().int().nonnegative(),
});

export const sessionSummarySchema = z.object({
  id: z.string().min(1),
  subjectId: slugSchema,
  topicId: slugSchema.nullable(),
  mode: practiceModeSchema,
  total: z.number().int().nonnegative(),
  answered: z.number().int().nonnegative(),
  correct: z.number().int().nonnegative(),
  accuracy: z.number().min(0).max(100),
  startedAt: z.number(),
  completedAt: z.number(),
  topicResults: z.record(z.string(), tallySchema),
});

export const progressSchema = z.object({
  version: z.literal(1),
  questionStats: z.record(
    z.string(),
    tallySchema.extend({ lastCorrect: z.boolean(), lastSeen: z.number() }),
  ),
  topicStats: z.record(z.string(), tallySchema),
  recentSessions: z.array(sessionSummarySchema),
});

export type Topic = z.infer<typeof topicSchema>;
export type Subject = z.infer<typeof subjectSchema>;
export type Question = z.infer<typeof questionSchema>;
export type SourceType = z.infer<typeof sourceTypeSchema>;
export type Difficulty = z.infer<typeof difficultySchema>;
export type PracticeMode = z.infer<typeof practiceModeSchema>;
export type PracticeSession = z.infer<typeof practiceSessionSchema>;
export type SessionSummary = z.infer<typeof sessionSummarySchema>;
export type Tally = z.infer<typeof tallySchema>;
export type Progress = z.infer<typeof progressSchema>;
export type QuestionStats = Progress["questionStats"];

export const reportReasonSchema = z.enum(["wrong_answer", "typo", "unclear_explanation", "other"]);

export const questionReportSchema = z.object({
  questionId: z.string().min(1).max(100),
  reason: reportReasonSchema,
  details: z.string().trim().max(500).default(""),
});

export type ReportReason = z.infer<typeof reportReasonSchema>;
