# WAEC Study App — Technical Specification

## Recommended Stack

Use the existing repository stack if it is already reasonable.

Otherwise prefer:

- Next.js
- TypeScript
- React
- Tailwind CSS
- Zod
- PostgreSQL when server persistence is required

Use simple React/Next.js state management unless complexity genuinely requires another library.

## Architecture

Prefer a modular monolithic application.

Suggested structure:

```text
app/
  page.tsx
  subjects/
  practice/
  dashboard/
  api/

components/
  ui/
  study/
  questions/
  subjects/
  progress/

lib/
  questions/
  progress/
  subjects/
  validation/
  storage/

types/

content/
  subjects/
  questions/

public/
```

Adjust this structure if the existing repository has a better convention.

## Core Data Model

### Subject

```text
id
slug
name
description
icon
published
```

### Topic

```text
id
subjectId
slug
name
description
published
```

### Question

```text
id
subjectId
topicId
question
options[]
correctOption
explanation
difficulty
questionType
sourceType
image
published
```

`sourceType` should distinguish things such as:

```text
original
official
licensed
user_generated
```

Do not claim content is official without evidence.

## Practice Session

Represent a study session with:

```text
sessionId
subjectId
topicId
mode
questionIds[]
currentIndex
answers[]
startedAt
completedAt
score
```

The exact implementation can differ.

## Progress

Track:

```text
questionsAttempted
questionsCorrect
accuracy
subjectProgress
topicProgress
recentSessions
```

Avoid storing more student information than necessary.

## Anonymous Persistence

For MVP, prefer local persistence when practical.

Possible implementation:

- localStorage for small state
- IndexedDB if question/progress data becomes larger

Do not put sensitive data into localStorage.

If server persistence is introduced, use authenticated APIs and server-side validation.

## Question Engine

Create reusable functions for:

- Selecting questions
- Filtering by subject
- Filtering by topic
- Selecting random questions
- Avoiding excessive repetition
- Calculating scores
- Calculating accuracy
- Recording answers
- Building session summaries

Do not put this logic directly into React components.

## UI

Mobile-first.

Practice interface should prioritize:

1. Question
2. Answer options
3. Submit/next interaction
4. Feedback
5. Explanation
6. Progress indicator

Do not overload the screen.

Desktop can use additional spacing and layout but mobile must remain excellent.

## Question Options

Options must be accessible.

Use proper buttons/radio controls.

Support keyboard navigation.

Clearly distinguish:

- Selected
- Correct
- Incorrect
- Disabled

Do not rely on color alone.

## Images

Questions may contain diagrams/images.

Images should:

- Have alt text
- Be responsive
- Avoid layout shift
- Be optimized
- Work on slow mobile connections

## Content Loading

The application should not ship an unnecessarily huge question bank to every visitor.

Load content efficiently.

Use server-side/static approaches where appropriate.

## APIs

Only create APIs where they are necessary.

Potential APIs:

```text
GET  /api/subjects
GET  /api/subjects/:subject
GET  /api/questions
POST /api/practice/session
POST /api/progress
```

Exact routes may differ.

Validate API input with Zod or equivalent.

## SEO

Public pages should have:

- Metadata
- Canonical URLs
- Open Graph metadata
- Structured headings
- Internal links
- Sitemap
- Robots configuration

Private study sessions should not be indexed.

## Analytics

If analytics are introduced, track product-level events such as:

```text
study_started
subject_selected
topic_selected
question_answered
practice_completed
```

Do not send question content or unnecessary student information to analytics providers.

## Performance

Prioritize:

- Fast initial load
- Mobile performance
- Optimized images
- Minimal JavaScript
- Lazy loading where appropriate
- Efficient question loading
- Avoiding unnecessary client-side rendering

## Accessibility

Support:

- Keyboard navigation
- Screen readers
- Visible focus states
- Adequate touch targets
- Semantic HTML
- Accessible form controls
- Meaningful error messages

## Testing

Test:

### Question logic

- Correct answers
- Incorrect answers
- Score calculation
- Accuracy calculation
- Random selection
- Empty question sets

### Practice flow

- Start session
- Answer question
- Submit
- Feedback
- Next question
- Finish session

### Persistence

- Save progress
- Restore progress
- Handle missing/corrupt data

### UI

- Mobile layout
- Empty states
- Loading states
- Error states

## Deployment

Prefer a mainstream Next.js-compatible deployment.

Keep infrastructure inexpensive.

Do not introduce paid infrastructure unless required.

Create:

```text
.env.example
```

Never commit real secrets.

## Implementation Order

1. Inspect repository
2. Establish application foundation
3. Build subject/content model
4. Add question model
5. Build question engine
6. Build study interface
7. Build progress tracking
8. Build dashboard
9. Build public SEO pages
10. Add persistence
11. Add tests
12. Optimize mobile UX
13. Review security/accessibility/performance
14. Build production version
15. Update documentation
16. Commit and push
