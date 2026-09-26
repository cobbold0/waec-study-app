# Prep Ghana — WAEC Study App

A free, mobile-first study app for students in Ghana preparing for WAEC exams. Students pick a subject and topic, answer practice questions, get instant feedback with explanations, and track progress. No account is required.

Project context lives in `CLAUDE.md`, `PRODUCT.md`, `TECHNICAL_SPEC.md`, `MONETIZATION.md`, `SEO.md` and `NEXT_STEPS.md`.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Zod, Vitest + Testing Library, Playwright.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional; set NEXT_PUBLIC_SITE_URL for production
npm run dev                  # http://localhost:3000
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / server |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generate route types and run `tsc` |
| `npm test` | Unit, content-integrity and component tests (Vitest) |
| `npm run test:e2e` | End-to-end tests on mobile and desktop (Playwright; builds and starts the app on port 3100) |

## Environment variables

See `.env.example`. All are optional.

- `NEXT_PUBLIC_SITE_URL`: canonical base URL used for metadata, sitemap and robots. Falls back to Vercel's `VERCEL_PROJECT_PRODUCTION_URL`, then `http://localhost:3000`.
- `REPORT_WEBHOOK_URL`: secret, server-only webhook that receives question error reports (Slack- and Discord-compatible JSON). When unset, reports are logged on the server.
- `GOOGLE_SITE_VERIFICATION`: Search Console HTML-tag verification code; adds the `google-site-verification` meta tag when set.
- `NEXT_PUBLIC_GA_ID`: Google Analytics 4 measurement ID. Loads GA via `@next/third-parties` and sends `study_started`, `question_answered` and `practice_completed` events (subject, topic, mode, correctness/accuracy only). Off when unset.
- `NEXT_PUBLIC_ADSENSE_CLIENT`, `NEXT_PUBLIC_ADSENSE_SLOT`: enable labelled AdSense slots. No ads render when unset.

## Project structure

```text
app/                    Routes
  page.tsx              Landing page
  subjects/             Subject list and subject pages (static)
  practice/[subject]/   Practice session (?mode=topic|mixed|quick|exam&topic=slug), noindex
  dashboard/            Local progress dashboard, noindex
  [guide]/              SEO study guides (/waec-study, /waec-study-tips, …)
  api/reports/          Question error report endpoint
  about/, privacy/      Content policy and privacy
  sitemap.ts, robots.ts, opengraph-image.tsx
components/             UI (layout, subjects, questions, study, progress, ads)
content/                Structured content: subjects/topics, questions, guides
lib/
  questions/            Question access (server) and pure engine (selection, scoring)
  practice/             Practice modes and session state functions
  progress/             Progress recording and insights
  storage/              Safe localStorage access and React stores
  validation/           Zod schemas and shared types
e2e/                    Playwright tests
```

## How it works

- **Content** is typed data in `content/`. Each question has `sourceType` (`original`, `official`, `licensed`, `user_generated`). All current questions are `original` and labelled as such in the UI. A content test validates every question, checks ids and topic references, and requires at least 5 questions per published topic.
- **Practice pages** render on the server and send only the selected subject or topic's questions to the browser. The session runs on the client, is saved in `localStorage`, and resumes after a reload.
- **Question selection** prefers unseen questions, then ones previously answered wrongly, then the least recently seen.
- **Progress** (per-question and per-topic tallies, recent sessions) is stored locally and validated with Zod on load. Corrupt data falls back to empty progress.
- **Error reports**: students can report a question after answering it, or from the results review. `POST /api/reports` validates the input with Zod, checks that the question exists, applies a best-effort rate limit (5 per minute per client), and forwards the report to `REPORT_WEBHOOK_URL`. No IP address or personal data is stored.
- **Timed practice** (`mode=exam`) gives 60 seconds per question, hides feedback until the end, then reviews every answer.

## Adding questions

Add entries to the relevant file in `content/questions/` using `defineQuestions`. Give each one a unique `id`, the `topicId` of an existing topic in `content/subjects.ts`, 2–5 distinct options, the `correctOption` index, and an explanation. Run `npm test` to validate. Never mark a question `official` unless it is properly licensed and verified.

## Deployment

Any Next.js-compatible host works (for example Vercel, or `npm run build && npm start` on a Node server). Production: https://prepghana.cobbold.dev on Vercel. Pushes to `main` deploy automatically. Set `NEXT_PUBLIC_SITE_URL` to the production domain.
