import type { Metadata } from "next";
import { Suspense } from "react";

import { HomeClient } from "@/components/home-client";
import { parseCategoryQuery, siteUrl, tools, type ToolCategory } from "@/data/tools";

export const metadata: Metadata = {
  title: "PandaPath Tools — Free Browser Tools for Developers",
  description: `${tools.length}+ free developer tools that run entirely in your browser. JSON formatter, regex tester, base64, UUID generator and more. No sign-up.`,
  alternates: { canonical: "/" },
  openGraph: {
    title: "PandaPath Tools — Free Browser Tools for Developers",
    description: `${tools.length}+ free developer tools that run entirely in your browser.`,
    url: `${siteUrl}/tools`,
    type: "website"
  }
};

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.category) ? sp.category[0] : sp.category;
  const initialCategory: ToolCategory | "all" = parseCategoryQuery(raw) ?? "all";

  return (
    <Suspense fallback={<div className="min-h-[200px]" aria-hidden />}>
      <HomeClient initialCategory={initialCategory} />
    </Suspense>
  );
}
