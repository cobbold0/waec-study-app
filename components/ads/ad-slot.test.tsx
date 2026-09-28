// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT", "ca-pub-123");
  vi.stubEnv("NEXT_PUBLIC_ADSENSE_SLOT", "456");
  localStorage.clear();
  delete window.adsbygoogle;
  vi.resetModules();
});
afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

describe("AdSlot", () => {
  it("shows a non-personalised ad when cookies were not accepted", async () => {
    const { AdSlot } = await import("./ad-slot");
    render(<AdSlot />);
    expect(screen.getByRole("complementary", { name: "Advertisement" })).toBeInTheDocument();
    expect(window.adsbygoogle?.requestNonPersonalizedAds).toBe(1);
    expect(window.adsbygoogle).toHaveLength(1);
  });

  it("requests personalised ads after consent", async () => {
    localStorage.setItem("waec-study:consent:v1", "granted");
    const { AdSlot } = await import("./ad-slot");
    render(<AdSlot />);
    expect(window.adsbygoogle?.requestNonPersonalizedAds).toBe(0);
  });
});
