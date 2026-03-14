import type { MetadataRoute } from "next";

import { siteUrl, tools } from "@/data/tools";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/tools", "/about", "/privacy", "/contact"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date()
  }));

  const toolPages = tools.map((tool) => ({
    url: `${siteUrl}/tools/${tool.slug}`,
    lastModified: new Date()
  }));

  return [...staticPages, ...toolPages];
}
