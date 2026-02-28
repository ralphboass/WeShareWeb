// app/robots.ts
import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  const base = "https://your-domain.com"; // TODO: set your real domain after deploy
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/private/",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
