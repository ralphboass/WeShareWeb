import type { MetadataRoute } from "next";

const routes = ["", "/rides", "/how-it-works", "/login", "/signup", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((route) => ({
    url: `https://weshare-ride.com${route}`,
    lastModified,
    changeFrequency: route === "/rides" ? "hourly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
