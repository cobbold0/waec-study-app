import type { Metadata } from "next";
import { DashboardClient } from "@/components/progress/dashboard-client";
import { getPublishedSubjects } from "@/lib/subjects";

export const metadata: Metadata = {
  title: "Your progress",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  const subjects = getPublishedSubjects().map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    icon: s.icon,
    topics: s.topics.map((t) => ({ id: t.id, slug: t.slug, name: t.name })),
  }));
  return (
    <>
      <h1 className="text-3xl font-bold">Your progress</h1>
      <p className="mt-1 text-sm text-muted">Saved on this device only. No account needed.</p>
      <DashboardClient subjects={subjects} />
    </>
  );
}
