# WAEC Study App — Product Specification

## Product Goal

Build a simple, fast study platform for students preparing for WAEC-related examinations, starting with Ghana.

The product should make it easy for a student to:

**Pick a subject → pick a topic → practice → understand mistakes → track progress.**

The initial product should focus on useful practice rather than trying to become a complete school-management or education platform.

## Target Users

Primary users:

- SHS students
- WASSCE candidates
- BECE candidates where applicable
- Recent graduates preparing for resits
- Students studying independently
- Ghanaian students preparing for major examinations

Secondary future market:

- Other West African students
- African examination preparation

## Core Product

The MVP should provide:

### Subjects

Students can browse available subjects.

Example initial subjects:

- Mathematics
- English Language
- Integrated Science
- Social Studies
- Biology
- Chemistry
- Physics
- Economics
- Geography
- Government
- Accounting
- ICT / Computing

The architecture must make subjects configurable rather than hardcoded into UI components.

### Topics

Each subject can contain topics.

Example — Mathematics:

- Algebra
- Geometry
- Statistics
- Probability
- Trigonometry
- Number
- Mensuration

Topics should be represented as structured data.

### Practice Modes

Initial modes:

- **Topic Practice** — Student selects a topic and receives questions related to it.
- **Mixed Practice** — Questions are selected from multiple topics within a subject.
- **Quick Practice** — A short session with a small number of questions.
- **Exam Mode** — Future-oriented architecture for timed practice sessions. The initial MVP may implement a simplified exam mode if practical.

## Question Experience

Each question should support:

- Question text
- Optional image/diagram
- Multiple-choice answers
- Correct answer
- Explanation
- Subject
- Topic
- Difficulty
- Source/type
- Optional metadata

Students should receive immediate feedback after answering.

Example:

- Correct: **Correct!**
- Incorrect: **Not quite.**

Then show:

- Correct answer
- Explanation

Avoid overly childish feedback.

## Original vs Official Content

The application must clearly distinguish original practice questions from official WAEC material.

The initial system should favor original practice content unless properly licensed material is available.

Never imply that an original question is an official WAEC past-paper question.

## Progress

Track useful study information such as:

- Questions attempted
- Questions answered correctly
- Accuracy
- Topics practiced
- Recent sessions
- Subject progress
- Streaks only if they genuinely improve the experience

Progress should help students identify weak areas.

## Student Dashboard

The dashboard should provide:

- Continue studying
- Subjects
- Recent practice
- Overall progress
- Strong areas
- Areas needing improvement

Keep the dashboard simple.

## Landing Page

Homepage should immediately explain the product.

Suggested positioning: **Practice smarter. Prepare better.**

Explain:

- Subjects
- Practice questions
- Instant explanations
- Progress tracking

Primary CTA: **Start Studying**

Secondary CTA: **Browse Subjects**

## Public SEO Content

Build useful public pages such as:

- `/`
- `/subjects`
- `/subjects/mathematics`
- `/subjects/english`
- `/subjects/integrated-science`
- `/subjects/social-studies`
- `/waec-study`
- `/waec-practice-questions`
- `/waec-mathematics`
- `/waec-english`
- `/waec-study-tips`

Only create pages that contain genuinely useful content.

## Accounts

Do not require account creation before the student can experience the core product.

Anonymous/local progress is acceptable for the MVP.

If server-side accounts are implemented, keep onboarding lightweight.

Authentication should be designed so it can be added without rebuilding the study engine.

## Content Management

Questions should not be scattered throughout UI components.

Use a structured question/content model.

The architecture should make it possible to eventually:

- Import question banks
- Add questions through an admin interface
- Categorize questions
- Edit explanations
- Publish/unpublish questions
- Track content quality

An admin CMS does not need to be fully implemented in the first MVP unless useful.

## Future Features

Potential future features:

- AI explanations
- AI tutor
- Personalized study plans
- Timed mock examinations
- Leaderboards
- Teacher accounts
- School accounts
- Question discussions
- Offline study
- Native Android app
- Premium question banks
- Advanced analytics
- Personalized weak-topic recommendations

Do not build these unnecessarily into the MVP.

## Explicitly Out of Scope

Do not build:

- School ERP
- Student fee management
- Payroll
- School attendance
- Recruitment
- Social network
- Chat platform
- Cryptocurrency
- Complex LMS
- Video streaming platform
- Native mobile app initially

## Business Model

Initial product: free study experience supported by advertising.

Potential future revenue:

- Premium question banks
- Ad-free experience
- AI tutor
- Premium mock exams
- Advanced analytics
- School partnerships
- Educational affiliate products

Do not damage the free study experience to force monetization.

## Product Principle

The most important metric is not how many pages exist.

It is whether a student can quickly start practicing and understand their mistakes.
