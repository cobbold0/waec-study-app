import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Practice and dashboard pages use a noindex meta tag instead of Disallow,
// so crawlers can see it.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
