"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getToolBySlug, tools, type Tool, type ToolCategory } from "@/data/tools";
import { getRecentTools } from "@/lib/storage";

const pills: { key: ToolCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "developer", label: "Developer" },
  { key: "text", label: "Text" },
  { key: "color", label: "Colors" },
  { key: "network", label: "Network" },
  { key: "math", label: "Math" },
  { key: "image", label: "Image" },
  { key: "file", label: "File" },
  { key: "date", label: "Date" }
];

type Props = {
  searchQuery: string;
  onSearch: (q: string) => void;
  activeCategory: ToolCategory | "all";
  onCategoryFilter: (c: ToolCategory | "all") => void;
};

export function Hero({ searchQuery, onSearch, activeCategory, onCategoryFilter }: Props) {
  const [recent, setRecent] = useState<Tool[]>([]);

  useEffect(() => {
    setRecent(
      getRecentTools()
        .map((s) => getToolBySlug(s))
        .filter((t): t is Tool => Boolean(t))
        .slice(0, 5)
    );
  }, []);

  return (
    <section className="w-full bg-[var(--bg-secondary)] px-4 pb-8 pt-12 md:px-6">
      <p className="text-center text-[10px] font-medium uppercase tracking-[1.5px] text-[var(--blue-primary)]">
        100% CLIENT-SIDE • NO SIGN-UP • NO DATA LEAVES YOUR BROWSER
      </p>
      <h1 className="mt-4 text-center text-2xl font-bold text-[var(--text-primary)] md:text-[32px]">
        Fast browser tools for everyday dev work
      </h1>
      <p className="mx-auto mt-3 max-w-[560px] text-center text-[15px] leading-relaxed text-[var(--text-secondary)]">
        Search {tools.length}+ utilities for JSON, text, color, network, and more — everything runs locally in
        your browser.
      </p>

      <div className="mx-auto mt-8 max-w-[720px]">
        <div className="flex h-12 items-center gap-3 rounded-[10px] border border-[#d1d5db] bg-[var(--card-bg)] px-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[var(--text-tertiary)]" aria-hidden>
            <path d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search tools... e.g. JSON, regex, base64"
            className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[var(--text-primary)] outline-none"
            aria-label="Search tools"
          />
          <span className="shrink-0 rounded-full bg-[var(--blue-light)] px-3 py-1 text-xs font-semibold text-[var(--blue-primary)]">
            {tools.length} tools
          </span>
        </div>
      </div>

      <div className="mx-auto mt-6 flex max-w-[900px] flex-wrap justify-center gap-2">
        {pills.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => onCategoryFilter(p.key)}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              activeCategory === p.key
                ? "border-[var(--blue-primary)] bg-[var(--blue-primary)] text-white"
                : "border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-secondary)] hover:border-[var(--blue-primary)]"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {recent.length > 0 ? (
        <div className="mx-auto mt-8 max-w-[900px]">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--text-tertiary)]">
            Recently used
          </p>
          <div className="flex flex-wrap gap-2">
            {recent.map((t) => (
              <Link
                key={t.slug}
                href={`/${t.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-1.5 text-sm text-[var(--text-primary)] hover:border-[var(--blue-primary)]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--blue-primary)]" aria-hidden />
                {t.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
