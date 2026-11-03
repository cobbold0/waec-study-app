import type { MetadataRoute } from "next";
import { guides } from "@/content/guides";
import { site } from "@/lib/site";
import { getPublishedSubjects } from "@/lib/subjects";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date("2026-11-03");

  const paths = [
    { path: "/", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/subjects", priority: 0.9, changeFrequency: "daily" as const },
    ...getPublishedSubjects().map((s) => ({
      path: `/subjects/${s.slug}`,
      priority: 0.85,
      changeFrequency: "weekly" as const,
    })),
    ...guides.map((g) => ({
      path: `/${g.slug}`,
      priority: 0.8,
      changeFrequency: "weekly" as const,
    })),
    { path: "/sitemap-directory", priority: 0.5, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/privacy", priority: 0.3, changeFrequency: "monthly" as const },
  ];

  return paths.map((item) => ({
    url: `${site.url}${item.path === "/" ? "" : item.path}`,
    lastModified: currentDate,
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));
}
