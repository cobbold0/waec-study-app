import { afterEach, describe, expect, it, vi } from "vitest";

const sendGAEvent = vi.fn();
vi.mock("@next/third-parties/google", () => ({ sendGAEvent }));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
  sendGAEvent.mockClear();
});

describe("track", () => {
  it("does nothing when no measurement ID is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_GA_ID", "");
    const { track } = await import("./analytics");
    track("study_started", { subject: "mathematics" });
    expect(sendGAEvent).not.toHaveBeenCalled();
  });

  it("sends a GA event when configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_GA_ID", "G-TEST123");
    const { track } = await import("./analytics");
    track("question_answered", { subject: "mathematics", correct: true });
    expect(sendGAEvent).toHaveBeenCalledWith("event", "question_answered", { subject: "mathematics", correct: true });
  });
});
