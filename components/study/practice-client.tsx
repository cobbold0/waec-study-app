"use client";

import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import { QuestionCard } from "@/components/questions/question-card";
import { ReportQuestion } from "@/components/questions/report-question";
import { buttonClass } from "@/components/ui/button";
import { isCorrectAnswer, selectQuestions } from "@/lib/questions/engine";
import { PRACTICE_MODES } from "@/lib/practice/modes";
import {
  answerCurrent,
  completeSession,
  createSession,
  goToQuestion,
  isLastQuestion,
  resolveQuestions,
  summarizeSession,
} from "@/lib/practice/session";
import { recordAnswer, recordSession } from "@/lib/progress/progress";
import { loadActiveSession, loadProgress, saveActiveSession, saveProgress } from "@/lib/storage/stores";
import type { PracticeMode, PracticeSession, Question } from "@/lib/validation/schemas";
import { SessionResults } from "./session-results";

export type PracticeClientProps = {
  subject: { id: string; slug: string; name: string };
  topic: { id: string; slug: string; name: string } | null;
  topicNames: Record<string, string>;
  mode: PracticeMode;
  pool: Question[];
};

const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

function startSession({ subject, topic, mode, pool }: PracticeClientProps): PracticeSession {
  const picked = selectQuestions(pool, PRACTICE_MODES[mode].questionCount, loadProgress().questionStats);
  return createSession({
    id: newId(),
    subjectId: subject.id,
    topicId: topic?.id ?? null,
    mode,
    questionIds: picked.map((q) => q.id),
    now: Date.now(),
  });
}

function resumeOrStart(props: PracticeClientProps): PracticeSession {
  const stored = loadActiveSession();
  const resumable =
    stored &&
    stored.completedAt === null &&
    stored.subjectId === props.subject.id &&
    stored.topicId === (props.topic?.id ?? null) &&
    stored.mode === props.mode &&
    resolveQuestions(stored, props.pool);
  return resumable ? stored : startSession(props);
}

export function PracticeClient(props: PracticeClientProps) {
  const { mode, pool, topicNames } = props;
  const config = PRACTICE_MODES[mode];
  const [session, setSession] = useState(() => resumeOrStart(props));
  const [selected, setSelected] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const questionRef = useRef<HTMLLegendElement>(null);
  const feedbackRef = useRef<HTMLHeadingElement>(null);

  const questions = useMemo(() => resolveQuestions(session, pool) ?? [], [session, pool]);
  const index = session.currentIndex;
  const question = questions[index];
  const answer = session.answers[index] ?? null;
  const revealed = config.instantFeedback && answer !== null;
  const done = session.completedAt !== null;
  const deadline = session.timeLimitSec ? session.startedAt + session.timeLimitSec * 1000 : null;

  useEffect(() => saveActiveSession(session), [session]);

  function finish() {
    const completed = completeSession(session, Date.now());
    let progress = loadProgress();
    if (!config.instantFeedback) {
      questions.forEach((q, i) => {
        const a = completed.answers[i];
        if (a !== null && a !== undefined) progress = recordAnswer(progress, q, isCorrectAnswer(q, a), Date.now());
      });
    }
    saveProgress(recordSession(progress, summarizeSession(completed, questions)));
    setSession(completed);
  }

  const onTick = useEffectEvent(() => {
    const t = Date.now();
    setNow(t);
    if (deadline !== null && t >= deadline) finish();
  });

  useEffect(() => {
    if (deadline === null || done) return;
    const id = setInterval(onTick, 1000);
    return () => clearInterval(id);
  }, [deadline, done]);

  // Move focus to feedback after answering, and to the question after navigating.
  useEffect(() => {
    (revealed ? feedbackRef : questionRef).current?.focus();
  }, [index, revealed]);

  if (done) {
    return (
      <SessionResults
        summary={summarizeSession(session, questions)}
        questions={questions}
        answers={session.answers}
        topicNames={topicNames}
        subjectSlug={props.subject.slug}
        reviewAll={!config.instantFeedback}
        onRestart={() => {
          setSelected(null);
          setSession(startSession(props));
        }}
      />
    );
  }

  if (!question) return null;

  function handleSelect(i: number) {
    if (config.instantFeedback) setSelected(i);
    else setSession((s) => answerCurrent(s, i));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!config.instantFeedback || revealed) return;
    if (selected === null) return;
    saveProgress(recordAnswer(loadProgress(), question, isCorrectAnswer(question, selected), Date.now()));
    setSession((s) => answerCurrent(s, selected));
  }

  function goTo(i: number) {
    setSelected(null);
    setSession((s) => goToQuestion(s, i));
  }

  const total = questions.length;
  const answeredCount = session.answers.filter((a) => a !== null).length;
  const remaining = deadline !== null ? Math.max(0, Math.ceil((deadline - now) / 1000)) : null;
  const correct = revealed && isCorrectAnswer(question, answer);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-4">
        <div className="mb-1.5 flex justify-between text-sm text-muted">
          <span>
            Question {index + 1} of {total}
          </span>
          {remaining !== null && (
            <span className={remaining <= 60 ? "font-semibold text-danger" : ""} aria-live={remaining <= 60 ? "polite" : "off"}>
              <span className="sr-only">Time left: </span>
              {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}
            </span>
          )}
        </div>
        <div
          role="progressbar"
          aria-label="Session progress"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={config.instantFeedback ? index + (revealed ? 1 : 0) : answeredCount}
          className="h-2 overflow-hidden rounded-full bg-border"
        >
          <div
            className="h-full bg-primary transition-[width]"
            style={{ width: `${((config.instantFeedback ? index + (revealed ? 1 : 0) : answeredCount) / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <QuestionCard
          key={question.id}
          question={question}
          selected={config.instantFeedback ? (revealed ? answer : selected) : answer}
          reveal={revealed}
          onSelect={handleSelect}
          headingRef={questionRef}
        />
      </div>

      <div aria-live="polite">
        {revealed && (
          <section
            className={`mt-4 rounded-xl border-2 p-4 ${correct ? "border-success bg-success-soft" : "border-danger bg-danger-soft"}`}
          >
            <h2 ref={feedbackRef} tabIndex={-1} className={`text-lg font-bold ${correct ? "text-success" : "text-danger"}`}>
              {correct ? "✓ Correct!" : "✗ Not quite."}
            </h2>
            {!correct && (
              <p className="mt-1">
                The correct answer is <strong>{question.options[question.correctOption]}</strong>.
              </p>
            )}
            <p className="mt-2">{question.explanation}</p>
            <ReportQuestion key={question.id} questionId={question.id} />
          </section>
        )}
      </div>

      <div className="sticky bottom-0 -mx-4 mt-4 flex gap-3 border-t border-border bg-background/95 px-4 py-3 sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0">
        {config.instantFeedback ? (
          revealed ? (
            isLastQuestion(session) ? (
              <button type="button" onClick={finish} className={buttonClass("primary", "flex-1 sm:flex-none")}>
                See results
              </button>
            ) : (
              <button type="button" onClick={() => goTo(index + 1)} className={buttonClass("primary", "flex-1 sm:flex-none")}>
                Next question
              </button>
            )
          ) : (
            <button type="submit" disabled={selected === null} className={buttonClass("primary", "flex-1 sm:flex-none")}>
              Check answer
            </button>
          )
        ) : (
          <>
            <button type="button" onClick={() => goTo(index - 1)} disabled={index === 0} className={buttonClass("secondary")}>
              Previous
            </button>
            {isLastQuestion(session) ? (
              <button type="button" onClick={finish} className={buttonClass("primary", "flex-1 sm:flex-none")}>
                Finish ({answeredCount}/{total} answered)
              </button>
            ) : (
              <button type="button" onClick={() => goTo(index + 1)} className={buttonClass("primary", "flex-1 sm:flex-none")}>
                Next
              </button>
            )}
          </>
        )}
      </div>
    </form>
  );
}
