import type { MetadataRoute } from "next";

import { siteUrl, tools } from "@/data/tools";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `${siteUrl}/tools`;
  const staticPages = ["", "/about", "/privacy", "/contact", "/favorites"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7
  }));

  const toolPages = tools.map((tool) => ({
    url: `${base}/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8
  }));

  return [...staticPages, ...toolPages];
}
