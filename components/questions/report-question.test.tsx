// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ReportQuestion } from "./report-question";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("ReportQuestion", () => {
  it("sends a report and confirms", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 202 }));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<ReportQuestion questionId="math-num-001" />);

    await user.click(screen.getByRole("button", { name: "Report a problem with this question" }));
    const send = screen.getByRole("button", { name: "Send report" });
    expect(send).toBeDisabled();
    await user.click(screen.getByRole("radio", { name: "The marked answer is wrong" }));
    await user.type(screen.getByRole("textbox", { name: /Details/ }), "Should be B");
    await user.click(send);

    expect(await screen.findByRole("status")).toHaveTextContent("Thanks for the report");
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      questionId: "math-num-001",
      reason: "wrong_answer",
      details: "Should be B",
    });
  });

  it("shows an error and keeps the form when sending fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: "Too many reports." }), { status: 429 })));
    const user = userEvent.setup();
    render(<ReportQuestion questionId="math-num-001" />);
    await user.click(screen.getByRole("button", { name: "Report a problem with this question" }));
    await user.click(screen.getByRole("radio", { name: "Something else" }));
    await user.click(screen.getByRole("button", { name: "Send report" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Too many reports.");
    expect(screen.getByRole("button", { name: "Send report" })).toBeEnabled();
  });
});
