export const site = {
  name: "Prep Ghana",
  tagline: "Practice smarter. Prepare better.",
  description:
    "Free WAEC practice questions for Ghanaian students with instant explanations and progress tracking. Practise Mathematics, English, Integrated Science and Social Studies on your phone.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
};
