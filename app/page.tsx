import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ads/ad-slot";
import { AddThis } from "@/components/social/AddThis";
import { SubjectList } from "@/components/subjects/subject-list";
import { buttonClass } from "@/components/ui/button";
import { guides } from "@/content/guides";
import { getPublishedSubjects } from "@/lib/subjects";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Prep Ghana — Free WAEC & WASSCE Practice Questions with Explanations",
  description:
    "Free online WAEC practice questions for Ghanaian secondary school students. Master Core Mathematics, English Language, Integrated Science and Social Studies on mobile with instant step-by-step explanations.",
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

const features = [
  { title: "Core WAEC Subjects", body: "Comprehensive coverage of Mathematics, English, Integrated Science, and Social Studies, syllabus-aligned." },
  { title: "Authentic Practice Questions", body: "Original, high-yield practice questions modeling recent WAEC examination patterns." },
  { title: "Instant Explanations", body: "Immediate grading with clear conceptual explanations for every right and wrong option." },
  { title: "Personal Progress Tracking", body: "Pinpoint your strengths and identify weak subtopics without needing account registration." },
];

const faqs = [
  {
    question: "Is Prep Ghana completely free for students?",
    answer: "Yes, Prep Ghana is 100% free with no subscription, paywall, or sign-up needed. All practice questions, subject quizzes, and study guides are openly accessible on phones and computers.",
  },
  {
    question: "What subjects does Prep Ghana cover?",
    answer: "Prep Ghana covers the four mandatory WAEC core subjects: Core Mathematics, English Language, Integrated Science, and Social Studies.",
  },
  {
    question: "How does the WASSCE grading system work?",
    answer: "WASSCE uses an 8-point numerical scale: A1 (75-100%, Excellent), B2 (70-74%, Very Good), B3 (65-69%, Good), C4 (60-64%, Credit), C5 (55-59%, Credit), C6 (50-54%, Credit), D7 (45-49%, Pass), E8 (40-44%, Pass), and F9 (0-39%, Fail). Most tertiary institutions in Ghana require grades A1 to C6 in core subjects.",
  },
  {
    question: "Can I use Prep Ghana on my phone with low data?",
    answer: "Yes. Prep Ghana is built as a lightweight, fast web application optimized for low data usage and mobile browsers, allowing smooth revision anywhere in Ghana.",
  },
];

export default function HomePage() {
  const subjects = getPublishedSubjects();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      name: site.name,
      url: site.url,
      logo: `${site.url}/icon.svg`,
      description: site.description,
      sameAs: ["https://github.com/cobbold0/waec-study-app"],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: site.name,
      url: site.url,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="py-4 sm:py-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Free WAEC &amp; WASSCE Practice for Ghana</p>
        <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl text-foreground">
          Master Your WAEC Exams with Instant Feedback
        </h1>
        <p className="mt-3 max-w-xl text-lg text-muted">
          Pick a subject, practise past-style questions, get instant explanations, and discover exactly which topics need more revision before exam day.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/subjects" className={buttonClass("primary")}>
            Start Studying Now
          </Link>
          <Link href="#subjects" className={buttonClass("secondary")}>
            Browse Core Subjects
          </Link>
        </div>
      </section>

      {/* Top Banner Ad below hero */}
      <AdSlot variant="banner" label="Advertisement" className="my-6" />

      {/* Social Share Bar */}
      <AddThis className="my-6" />

      <section aria-labelledby="features" className="mt-6">
        <h2 id="features" className="sr-only">What you get</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {features.map((f) => (
            <li key={f.title} className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground text-base">{f.title}</h3>
              <p className="mt-1 text-sm text-muted leading-relaxed">{f.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* In-Content Ad */}
      <AdSlot variant="inline" label="Sponsored Learning Resources" className="my-8" />

      <section id="subjects" aria-labelledby="subjects-heading" className="mt-10 scroll-mt-4">
        <div className="flex items-center justify-between">
          <h2 id="subjects-heading" className="text-2xl font-bold text-foreground">Core WAEC Subjects</h2>
          <Link href="/subjects" className="text-sm font-semibold text-primary hover:underline">
            View all
          </Link>
        </div>
        <SubjectList subjects={subjects} className="mt-4" />
      </section>

      {/* Deep Educational Content on WAEC Exam Success */}
      <section className="mt-12 space-y-6 border-t border-border pt-8">
        <h2 className="text-2xl font-bold text-foreground">How to Excel in WAEC / WASSCE Examinations</h2>
        <p className="text-muted leading-relaxed">
          The West African Senior School Certificate Examination (WASSCE) administered by WAEC determines admission eligibility
          into Ghanaian public universities, technical universities, and colleges of education.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border p-5 bg-card">
            <h3 className="font-bold text-foreground">1. Active Recall Practice</h3>
            <p className="mt-2 text-sm text-muted">
              Testing yourself on practice questions produces significantly stronger memory retention than passively re-reading textbooks.
            </p>
          </div>
          <div className="rounded-xl border border-border p-5 bg-card">
            <h3 className="font-bold text-foreground">2. Understanding Marking Schemes</h3>
            <p className="mt-2 text-sm text-muted">
              WAEC examiners award method marks in Mathematics and Science. Always show step-by-step working rather than writing bare final answers.
            </p>
          </div>
          <div className="rounded-xl border border-border p-5 bg-card">
            <h3 className="font-bold text-foreground">3. Timing &amp; Speed Drills</h3>
            <p className="mt-2 text-sm text-muted">
              Section A multiple-choice papers require quick calculations. Regular timed practice builds the necessary speed to complete all 50 questions.
            </p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="mt-12 border-t border-border pt-8" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
        <div className="mt-4 space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-border p-5 bg-card">
              <h3 className="font-semibold text-foreground text-base">{faq.question}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Second In-Content Ad */}
      <AdSlot variant="inline" label="Advertisement" className="my-8" />

      <section aria-labelledby="guides-heading" className="mt-10 border-t border-border pt-8">
        <h2 id="guides-heading" className="text-2xl font-bold text-foreground">Subject Study Guides</h2>
        <ul className="mt-4 space-y-3">
          {guides.map((g) => (
            <li key={g.slug} className="rounded-lg border border-border p-4 bg-card hover:border-primary/40 transition">
              <Link href={`/${g.slug}`} className="font-semibold text-primary hover:underline text-base">
                {g.title}
              </Link>
              <p className="text-sm text-muted mt-1">{g.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
