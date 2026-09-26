// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { questions } from "@/content/questions";
import { STORAGE_KEYS } from "@/lib/storage/local";
import { loadActiveSession, loadProgress } from "@/lib/storage/stores";
import { PracticeClient, type PracticeClientProps } from "./practice-client";

const pool = questions.filter((q) => q.subjectId === "mathematics" && q.topicId === "algebra");
const props: PracticeClientProps = {
  subject: { id: "mathematics", slug: "mathematics", name: "Mathematics" },
  topic: { id: "algebra", slug: "algebra", name: "Algebra" },
  topicNames: { algebra: "Algebra" },
  mode: "quick",
  pool,
};

function currentQuestion() {
  const legend = screen.getByRole("group").querySelector("legend")!;
  return pool.find((q) => q.question === legend.textContent)!;
}

beforeEach(() => localStorage.clear());
afterEach(cleanup);

describe("PracticeClient", () => {
  it("runs a full instant-feedback session and saves progress", async () => {
    const user = userEvent.setup();
    render(<PracticeClient {...props} />);
    expect(screen.getByText("Question 1 of 5")).toBeInTheDocument();

    const check = screen.getByRole("button", { name: "Check answer" });
    expect(check).toBeDisabled();

    // Answer the first question wrongly.
    let q = currentQuestion();
    const wrong = (q.correctOption + 1) % q.options.length;
    await user.click(screen.getByRole("radio", { name: q.options[wrong] }));
    await user.click(check);
    expect(screen.getByRole("heading", { name: /Not quite/ })).toBeInTheDocument();
    expect(screen.getByText(q.explanation)).toBeInTheDocument();
    expect(screen.getByText("✗ Your answer")).toBeInTheDocument();
    expect(screen.getByText("✓ Correct answer")).toBeInTheDocument();

    // Answer the rest correctly.
    for (let i = 1; i < 5; i++) {
      await user.click(screen.getByRole("button", { name: "Next question" }));
      q = currentQuestion();
      await user.click(screen.getByRole("radio", { name: q.options[q.correctOption] }));
      await user.click(screen.getByRole("button", { name: "Check answer" }));
      expect(screen.getByRole("heading", { name: /Correct!/ })).toBeInTheDocument();
    }

    await user.click(screen.getByRole("button", { name: "See results" }));
    expect(screen.getByText("4 / 5")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Review your mistakes" })).toBeInTheDocument();

    const progress = loadProgress();
    expect(progress.recentSessions).toHaveLength(1);
    expect(progress.topicStats["mathematics/algebra"]).toEqual({ attempted: 5, correct: 4 });
    expect(loadActiveSession()?.completedAt).not.toBeNull();
  });

  it("resumes an unfinished session after reload", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<PracticeClient {...props} />);
    const q = currentQuestion();
    await user.click(screen.getByRole("radio", { name: q.options[q.correctOption] }));
    await user.click(screen.getByRole("button", { name: "Check answer" }));
    await user.click(screen.getByRole("button", { name: "Next question" }));
    unmount();

    render(<PracticeClient {...props} />);
    expect(screen.getByText("Question 2 of 5")).toBeInTheDocument();
  });

  it("starts fresh when stored session data is corrupt", () => {
    localStorage.setItem(STORAGE_KEYS.session, "{broken");
    localStorage.setItem(STORAGE_KEYS.progress, "nonsense");
    render(<PracticeClient {...props} />);
    expect(screen.getByText("Question 1 of 5")).toBeInTheDocument();
  });

  it("timed mode hides feedback until the end and reviews all answers", async () => {
    const user = userEvent.setup();
    render(<PracticeClient {...props} mode="exam" />);
    const total = pool.length; // fewer than 20 in this topic
    expect(screen.getByText(`Question 1 of ${total}`)).toBeInTheDocument();
    expect(screen.getByText(/Time left/)).toBeInTheDocument();

    const q = currentQuestion();
    await user.click(screen.getByRole("radio", { name: q.options[q.correctOption] }));
    expect(screen.queryByRole("heading", { name: /Correct!/ })).not.toBeInTheDocument();

    for (let i = 1; i < total; i++) await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: /Finish \(1\/\d+ answered\)/ }));

    expect(screen.getByText(`1 / ${total}`)).toBeInTheDocument();
    const review = screen.getByRole("heading", { name: "Review your answers" }).parentElement!;
    expect(within(review).getAllByRole("listitem")).toHaveLength(total);
    expect(loadProgress().topicStats["mathematics/algebra"]).toEqual({ attempted: 1, correct: 1 });
  });
});
