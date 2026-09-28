// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadConsent } from "@/lib/storage/stores";
import { ConsentManager } from "./consent-manager";

let pathname = "/";
vi.mock("next/navigation", () => ({ usePathname: () => pathname }));
vi.mock("next/script", () => ({ default: ({ src }: { src: string }) => <div data-testid="adsense">{src}</div> }));
vi.mock("@next/third-parties/google", () => ({
  GoogleAnalytics: ({ gaId }: { gaId: string }) => <div data-testid="ga">{gaId}</div>,
}));

beforeEach(() => {
  localStorage.clear();
  pathname = "/";
});
afterEach(cleanup);

describe("ConsentManager", () => {
  it("asks for consent and loads GA only after Accept", async () => {
    render(<ConsentManager gaId="G-TEST" />);
    expect(screen.queryByTestId("ga")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Accept" }));
    expect(loadConsent()).toBe("granted");
    expect(screen.getByTestId("ga")).toHaveTextContent("G-TEST");
    expect(screen.queryByRole("region", { name: "Cookie consent" })).not.toBeInTheDocument();
  });

  it("never loads GA after Decline", async () => {
    render(<ConsentManager gaId="G-TEST" />);
    await userEvent.click(screen.getByRole("button", { name: "Decline" }));
    expect(loadConsent()).toBe("denied");
    expect(screen.queryByTestId("ga")).not.toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Cookie consent" })).not.toBeInTheDocument();
  });

  it("does not show the banner during practice", () => {
    pathname = "/practice/mathematics";
    render(<ConsentManager gaId="G-TEST" />);
    expect(screen.queryByRole("region", { name: "Cookie consent" })).not.toBeInTheDocument();
  });

  it("loads AdSense for everyone, even before a choice is made", () => {
    render(<ConsentManager gaId="G-TEST" adsenseClient="ca-pub-123" />);
    expect(screen.getByTestId("adsense")).toHaveTextContent("client=ca-pub-123");
    expect(screen.queryByTestId("ga")).not.toBeInTheDocument();
  });

  it("renders nothing when analytics and ads are not configured", () => {
    render(<ConsentManager />);
    expect(screen.queryByRole("region", { name: "Cookie consent" })).not.toBeInTheDocument();
  });
});
