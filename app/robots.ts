// app/robots.ts
export default function robots() {
  const base = "https://your-domain.com"; // TODO: set your real domain after deploy
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
