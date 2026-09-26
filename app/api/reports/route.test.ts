import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { questions } from "@/content/questions";
import { POST } from "./route";

const questionId = questions[0].id;
let ip = 0;
const post = (body: unknown, headers: Record<string, string> = {}) =>
  POST(
    new Request("http://localhost/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": `10.0.0.${++ip}`, ...headers },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );

beforeEach(() => {
  vi.spyOn(console, "info").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("POST /api/reports", () => {
  it("accepts a valid report and logs it when no webhook is configured", async () => {
    vi.stubEnv("REPORT_WEBHOOK_URL", "");
    const res = await post({ questionId, reason: "wrong_answer", details: "  Option B is right  " });
    expect(res.status).toBe(202);
    const logged = JSON.parse(vi.mocked(console.info).mock.calls[0][1] as string);
    expect(logged).toMatchObject({ questionId, reason: "wrong_answer", details: "Option B is right" });
    expect(logged).not.toHaveProperty("ip");
  });

  it("rejects invalid JSON, unknown reasons, unknown questions and long details", async () => {
    expect((await post("{bad")).status).toBe(400);
    expect((await post({ questionId, reason: "spam" })).status).toBe(400);
    expect((await post({ questionId: "nope", reason: "typo" })).status).toBe(400);
    expect((await post({ questionId, reason: "typo", details: "x".repeat(501) })).status).toBe(400);
  });

  it("forwards to the configured webhook", async () => {
    vi.stubEnv("REPORT_WEBHOOK_URL", "https://hooks.example.com/abc");
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);
    expect((await post({ questionId, reason: "typo" })).status).toBe(202);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://hooks.example.com/abc");
    const body = JSON.parse(init.body);
    expect(body.text).toContain(questionId);
    expect(body.report).toMatchObject({ questionId, reason: "typo" });
  });

  it("returns 502 when the webhook fails", async () => {
    vi.stubEnv("REPORT_WEBHOOK_URL", "https://hooks.example.com/abc");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 500 })));
    expect((await post({ questionId, reason: "typo" })).status).toBe(502);
  });

  it("rate limits repeated reports from one client", async () => {
    vi.stubEnv("REPORT_WEBHOOK_URL", "");
    const statuses = [];
    for (let i = 0; i < 6; i++) statuses.push((await post({ questionId, reason: "other" }, { "x-forwarded-for": "10.9.9.9" })).status);
    expect(statuses.slice(0, 5).every((s) => s === 202)).toBe(true);
    expect(statuses[5]).toBe(429);
  });
});
