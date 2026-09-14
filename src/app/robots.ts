import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/profile", "/messages", "/bookings"],
      },
    ],
    sitemap: "https://weshare-ride.com/sitemap.xml",
  };
}
