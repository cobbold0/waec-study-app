const PRODUCTION_URL = "https://prepghana.cobbold.dev";

export const site = {
  name: "Prep Ghana",
  tagline: "Practice smarter. Prepare better.",
  description:
    "Free WAEC practice questions for Ghanaian students with instant explanations and progress tracking. Practise Mathematics, English, Integrated Science and Social Studies on your phone.",
  // Falls back to production domain, then Vercel URL, then localhost.
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NODE_ENV === "production" ? PRODUCTION_URL : "") ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    "http://localhost:3000"
  ).replace(/\/$/, ""),
};
