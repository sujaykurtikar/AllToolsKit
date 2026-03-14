"use client";

import { useMemo, useState } from "react";

import type { Tool } from "@/data/tools";

import { ToolCard } from "@/components/tool-card";

type ToolBrowserProps = {
  title: string;
  description: string;
  tools: Tool[];
  eyebrow?: string;
};

export function ToolBrowser({
  title,
  description,
  tools,
  eyebrow = "Free Developer Tools"
}: ToolBrowserProps) {
  const [query, setQuery] = useState("");

  const filteredTools = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return tools;
    }

    return tools.filter((tool) =>
      [tool.name, tool.description, tool.slug].some((value) =>
        value.toLowerCase().includes(normalized)
      )
    );
  }, [query, tools]);

  return (
    <div className="grid gap-6">
      <section className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_38%),linear-gradient(180deg,_#f8fbff_0%,_#ffffff_55%)] px-6 py-10 sm:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">{description}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex flex-1 items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <span className="text-lg text-slate-400">Q</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tools..."
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </label>
            <div className="rounded-2xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm">
              {filteredTools.length} tool{filteredTools.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
        {filteredTools.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-slate-500 md:col-span-2">
            No tools matched "{query}". Try JSON, GUID, timestamp, or Base64.
          </div>
        ) : null}
      </section>
    </div>
  );
}
