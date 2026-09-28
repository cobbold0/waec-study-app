# WAEC Study App — Next Steps

## Owner must do

- Google Search Console: check the Sitemaps report shows "Success" with 13 discovered URLs, then watch Pages/Indexing over the next few weeks.
- Have a qualified teacher review all practice questions, explanations and study guides before public launch (`content/`).
- Verify the factual Ghana/WAEC statements in content, for example the Social Studies governance questions and the "official WAEC Ghana website" references in guides.
- Set up where question error reports go: create a Slack or Discord incoming webhook (or any endpoint that accepts JSON POST), set it as `REPORT_WEBHOOK_URL` in the hosting environment, send one test report, and assign someone to review reports. Until then, reports are only written to server logs.
- Official past questions: decide whether to seek a licence from WAEC (or a licensed publisher). Free APIs such as ALOC exist but give no evidence of WAEC permission, so none are integrated.
- Google Analytics: confirm visits appear in GA → Reports → Realtime (accept cookies in the banner first); optionally mark `practice_completed` as a key event. Expect lower GA numbers than real traffic, since visitors who decline are not counted.
- AdSense: the site is covered by the `cobbold.dev` AdSense site and its root `ads.txt` (hosted on the portfolio). Wait for AdSense to approve `cobbold.dev`; ads stay blank until then. Decide whether ads should show to visitors who decline or ignore the cookie banner (currently they don't).
- Review legal and privacy requirements (for example Ghana's Data Protection Act) before launch and before enabling ads, including whether the consent banner wording and behaviour are sufficient. Update `/privacy` as needed.

## Optional improvements

- Add a larger question bank, and add subjects such as Biology, Chemistry, Physics, Economics, Geography, Government, Accounting and ICT
- Add question diagrams and images (the data model and UI already support them)
- Add an admin question-management interface
- Add a full timed mock examination format
- Add user accounts and cloud synchronization
- Add personalized study plans
- Add AI-powered explanations
- Add AI tutor functionality
- Add offline study support (PWA)
- Add premium question banks
- Add ad-free premium experience
- Add Android application
- Expand beyond Ghana

## Completed

- Next.js 16 + TypeScript + Tailwind foundation with lint, type-check, unit/component tests and Playwright e2e tests
- Structured, Zod-validated content model for subjects, topics and questions, with `sourceType` labelling
- 4 subjects (Mathematics, English Language, Integrated Science, Social Studies), 25 topics, 151 original practice questions with explanations
- Question engine: filtering, history-aware selection, scoring and accuracy
- Practice modes: topic, mixed, quick, and timed (feedback shown at the end)
- Accessible practice UI: native radio inputs, keyboard support, labels that don't rely on colour alone, focus management, sticky mobile action bar
- Instant feedback with the correct answer and an explanation, plus a results screen with a per-topic breakdown and review
- Local progress persistence with resume-after-reload and handling of corrupt data
- Progress dashboard: continue studying, overall stats, subject progress, strong and weak topics, recent sessions, reset
- Public SEO pages: home, subjects, 4 subject pages, 5 study guides, about, privacy. Each has a unique title, description, canonical URL and Open Graph image; subject and guide pages also have breadcrumb structured data
- Sitemap and robots.txt; practice and dashboard pages are noindex
- Question error reporting: "Report a problem" after each answered question and on the results review, a validated `/api/reports` endpoint with rate limiting, delivery to a configurable webhook, and no personal data collected
- Labelled ad slots (off until configured) on home, subject pages, guides and results only, never in the question interface
- Deployed on Vercel at https://prepghana.cobbold.dev (domain verified in Vercel; `www` redirects to it); live robots.txt and sitemap.xml verified to use the production domain
- GitHub default branch and Vercel production branch set to `main`; pushes to `main` deploy to production (verified)
- Google Search Console property created and sitemap submitted (by owner)
- Google Analytics 4 live in production (tag verified on the live site) with `study_started`, `question_answered` and `practice_completed` events
- Cookie consent banner: Google Analytics and AdSense load only after "Accept"; Decline has equal prominence; banner hidden during practice; choice can be changed on `/privacy`
- AdSense publisher ID and ad slot configured in production; `google-adsense-account` meta tag on every page
- Light and dark themes; mobile layout checked on Pixel 7 with no horizontal overflow
