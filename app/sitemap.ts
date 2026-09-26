import type { MetadataRoute } from "next";
import { guides } from "@/content/guides";
import { site } from "@/lib/site";
import { getPublishedSubjects } from "@/lib/subjects";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/subjects",
    ...getPublishedSubjects().map((s) => `/subjects/${s.slug}`),
    ...guides.map((g) => `/${g.slug}`),
    "/about",
    "/privacy",
  ];
  return paths.map((path) => ({ url: `${site.url}${path === "/" ? "" : path}` }));
}
