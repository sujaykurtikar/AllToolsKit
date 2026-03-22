import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ToolPageShell } from "@/components/ToolPageShell";
import { getAllSlugs, getToolBySlug, siteUrl, tools } from "@/data/tools";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const tool = getToolBySlug(slug);
    if (!tool) {
      return {};
    }
    const desc = `${tool.description} Free, online, runs in your browser.`;
    return {
      title: tool.name,
      description: desc,
      alternates: { canonical: `/${tool.slug}` },
      openGraph: {
        title: `${tool.name} — PandaPath Tools`,
        description: desc,
        url: `${siteUrl}/tools/${tool.slug}`
      }
    };
  });
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) {
    notFound();
  }
  return <ToolPageShell tool={tool} />;
}
