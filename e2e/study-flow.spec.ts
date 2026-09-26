import { expect, test } from "@playwright/test";

test("student can go from home to practice, answer, and see progress", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Start Studying" }).click();
  await page.getByRole("link", { name: /Mathematics/ }).first().click();
  await expect(page.getByRole("heading", { level: 1, name: /Mathematics/ })).toBeVisible();

  await page.getByRole("link", { name: "Practise Algebra" }).click();
  await expect(page.getByText(/Question 1 of \d+/)).toBeVisible();

  await page.getByRole("radio").first().check({ force: true });
  await page.getByRole("button", { name: "Check answer" }).click();
  await expect(page.getByRole("heading", { name: /Correct!|Not quite/ })).toBeVisible();

  // Progress survives a reload and the session resumes.
  await page.reload();
  await expect(page.getByRole("heading", { name: /Correct!|Not quite/ })).toBeVisible();

  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "Continue studying" })).toBeVisible();
  await expect(page.getByText("Answered", { exact: true })).toBeVisible();
});

test("public pages have metadata and no horizontal overflow", async ({ page }) => {
  for (const path of ["/", "/subjects", "/subjects/english", "/waec-study-tips", "/about"]) {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow, `${path} overflows horizontally`).toBe(false);
  }
});

test("private pages are noindex and robots/sitemap work", async ({ page, request }) => {
  await page.goto("/dashboard");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Allow: /");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("/subjects/mathematics");
  expect(sitemap).not.toContain("/practice");
});

test("unknown pages return 404", async ({ request }) => {
  expect((await request.get("/not-a-real-page")).status()).toBe(404);
  expect((await request.get("/subjects/unknown")).status()).toBe(404);
  expect((await request.get("/practice/mathematics?mode=topic")).status()).toBe(404);
});
