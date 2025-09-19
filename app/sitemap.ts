// app/sitemap.ts
export default function sitemap() {
  const base = "https://your-domain.com"; // TODO: set your real domain after deploy
  const now = new Date();
  return [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
