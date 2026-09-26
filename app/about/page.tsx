import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About our questions",
  description: `How ${site.name} practice questions are written, what "original" means, and how we handle official WAEC material.`,
  alternates: { canonical: "/about" },
  openGraph: { url: "/about" },
};

export default function AboutPage() {
  return (
    <article className="space-y-4">
      <h1 className="text-3xl font-bold">About our questions</h1>
      <p>
        {site.name} is a free study tool for students in Ghana preparing for WAEC examinations such as the
        WASSCE. It is independent and is not affiliated with or endorsed by the West African Examinations
        Council (WAEC).
      </p>
      <h2 className="pt-2 text-xl font-bold">Original practice questions</h2>
      <p>
        Every question currently on the site is an <strong>original practice question</strong>. Questions
        are written to cover topics commonly studied for WAEC exams, but they are not official WAEC past
        questions and should not be treated as predictions of what will appear in an exam.
      </p>
      <p>
        Each question is labelled with its source. If we ever add official or licensed material, it will be
        labelled clearly as such.
      </p>
      <h2 className="pt-2 text-xl font-bold">Topics</h2>
      <p>
        Topics are grouped to make practice easier. They may not match the official WAEC syllabus exactly.
        Always check the current syllabus and exam details with your school and WAEC.
      </p>
      <h2 className="pt-2 text-xl font-bold">Found a mistake?</h2>
      <p>
        We work hard to make every answer and explanation accurate. If you think something is wrong, please
        let your teacher know and double-check with your textbook. We review and correct questions regularly.
      </p>
      <p>
        <Link href="/subjects" className="text-primary hover:underline">Start practising →</Link>
      </p>
    </article>
  );
}
