import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ToolClient } from "@/components/tool-client";
import { siteUrl, tools } from "@/data/tools";

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const tool = tools.find((item) => item.slug === slug);

    if (!tool) {
      return {};
    }

    return {
      title: tool.name,
      description: tool.seoDescription,
      alternates: {
        canonical: `/tools/${tool.slug}`
      },
      openGraph: {
        title: `${tool.name} | DevToolsKit`,
        description: tool.seoDescription,
        url: `${siteUrl}/tools/${tool.slug}`
      }
    };
  });
}

export default async function ToolPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = tools.find((item) => item.slug === slug);

  if (!tool) {
    notFound();
  }

  return <ToolClient slug={slug} />;
}
