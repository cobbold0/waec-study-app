import Image from "next/image";
import type { Question, SourceType } from "@/lib/validation/schemas";

const SOURCE_LABELS: Record<SourceType, string> = {
  original: "Original practice question",
  official: "Official past question",
  licensed: "Licensed question",
  user_generated: "Community question",
};

const LETTERS = "ABCDE";

type Props = {
  question: Question;
  selected: number | null;
  /** Show correct/incorrect states. */
  reveal: boolean;
  onSelect: (index: number) => void;
  headingRef?: React.Ref<HTMLLegendElement>;
};

export function QuestionCard({ question, selected, reveal, onSelect, headingRef }: Props) {
  return (
    <fieldset className="min-w-0">
      <div className="mb-2 flex flex-wrap gap-2 text-xs text-muted">
        <span className="rounded-full bg-primary-soft px-2 py-0.5 text-primary">{SOURCE_LABELS[question.sourceType]}</span>
        <span className="rounded-full border border-border px-2 py-0.5 capitalize">{question.difficulty}</span>
      </div>
      <legend ref={headingRef} tabIndex={-1} className="float-left w-full text-lg font-semibold leading-snug">
        {question.question}
      </legend>
      {question.image && (
        <Image
          src={question.image.src}
          alt={question.image.alt}
          width={question.image.width}
          height={question.image.height}
          className="clear-both mt-3 h-auto max-w-full rounded-lg border border-border"
          sizes="(max-width: 768px) 100vw, 720px"
        />
      )}
      <div className="clear-both space-y-2.5 pt-4">
        {question.options.map((option, i) => {
          const isSelected = selected === i;
          const isCorrect = reveal && i === question.correctOption;
          const isWrong = reveal && isSelected && !isCorrect;
          const tone = isCorrect
            ? "border-success bg-success-soft"
            : isWrong
              ? "border-danger bg-danger-soft"
              : isSelected
                ? "border-primary bg-primary-soft"
                : "border-border bg-card hover:border-primary";
          return (
            <label
              key={i}
              className={`flex min-h-12 items-center gap-3 rounded-lg border-2 px-3 py-2.5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary ${tone} ${reveal ? "cursor-default" : "cursor-pointer"}`}
            >
              <input
                type="radio"
                name={`q-${question.id}`}
                value={i}
                checked={isSelected}
                disabled={reveal}
                onChange={() => onSelect(i)}
                className="sr-only"
              />
              <span
                aria-hidden
                className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}
              >
                {LETTERS[i]}
              </span>
              <span className="flex-1">{option}</span>
              {isCorrect && <span className="shrink-0 text-sm font-semibold text-success">✓ Correct answer</span>}
              {isWrong && <span className="shrink-0 text-sm font-semibold text-danger">✗ Your answer</span>}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
