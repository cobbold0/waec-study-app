import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SubjectList } from "@/components/subjects/subject-list";
import { getPublishedSubjects } from "@/lib/subjects";

export const metadata: Metadata = {
  title: "WAEC Subjects — Practice by Subject and Topic",
  description:
    "Choose a subject to practise WAEC-style questions by topic: Mathematics, English Language, Integrated Science and Social Studies.",
  alternates: { canonical: "/subjects" },
  openGraph: { url: "/subjects" },
};

export default function SubjectsPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Subjects", href: "/subjects" }]} />
      <h1 className="text-3xl font-bold">Choose a subject</h1>
      <p className="mt-2 text-muted">
        Pick a subject to see its topics, then start practising. Your progress is saved on this device.
      </p>
      <SubjectList subjects={getPublishedSubjects()} className="mt-6" />
    </>
  );
}
