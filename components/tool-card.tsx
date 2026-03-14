"use client";

import Link from "next/link";

import type { Tool } from "@/data/tools";

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <article className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-sm font-bold text-white shadow-sm">
          {tool.badge}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            {tool.name}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{tool.description}</p>
        </div>
      </div>
      <Link
        href={`/tools/${tool.slug}`}
        className="mt-5 inline-flex items-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Open
      </Link>
    </article>
  );
}
