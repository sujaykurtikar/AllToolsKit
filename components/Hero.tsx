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
  { key: "date", label: "Date" },
  { key: "designer", label: "Designer" }
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
    <section className="relative w-full overflow-hidden px-4 pb-10 pt-10 md:px-6 md:pb-12 md:pt-14">
      {/* Soft ambient orbs */}
      <div
        className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[var(--blue-primary)]/15 blur-3xl dark:bg-[var(--blue-primary)]/20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 top-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/15"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-48 w-[120%] -translate-x-1/2 bg-gradient-to-t from-[var(--bg-secondary)] to-transparent dark:from-[var(--bg-secondary)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[720px] text-center">
        <p className="inline-flex items-center justify-center rounded-full border border-[var(--blue-primary)]/20 bg-[var(--blue-light)]/80 px-3 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--blue-primary)] shadow-sm backdrop-blur-sm dark:border-[var(--blue-primary)]/30 dark:bg-[var(--blue-primary)]/15 dark:text-[#93c5fd]">
          100% client-side · No sign-up · Nothing leaves your browser
        </p>
        <h1 className="font-display mt-6 text-balance text-3xl font-extrabold tracking-tight text-[var(--text-primary)] md:text-[2.35rem] md:leading-[1.15]">
          Fast browser tools for{" "}
          <span className="text-gradient-brand">everyday dev work</span>
        </h1>
        <p className="mx-auto mt-4 max-w-[540px] text-pretty text-[15px] leading-relaxed text-[var(--text-secondary)] md:text-base">
          Search {tools.length}+ utilities for JSON, text, color, network, and more — everything runs locally in
          your browser.
        </p>
      </div>

      <div className="relative mx-auto mt-9 max-w-[720px]">
        <div
          role="search"
          className="flex items-center gap-2 rounded-2xl border border-[var(--border-color)]/80 bg-[var(--card-bg)]/90 px-3 py-2 shadow-[var(--shadow-lg)] ring-1 ring-black/[0.03] backdrop-blur-md transition-shadow duration-300 focus-within:border-[var(--blue-primary)]/40 focus-within:shadow-glow dark:bg-[var(--card-bg)]/70 dark:ring-white/[0.06] sm:gap-3 sm:px-4 sm:py-3"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            className="pointer-events-none shrink-0 text-[var(--blue-primary)]/70"
            aria-hidden
          >
            <path
              d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search tools… JSON, regex, base64, QR…"
            className="input-unstyled min-h-[2.5rem] min-w-0 flex-1 bg-transparent py-1 text-[15px] leading-normal text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] focus:outline-none focus-visible:ring-0 appearance-none"
            aria-label="Search tools"
          />
          <span className="inline-flex shrink-0 select-none items-center justify-center rounded-xl bg-gradient-to-br from-[var(--blue-primary)] to-indigo-600 px-3 py-2 font-display text-[11px] font-bold leading-none text-white shadow-md tabular-nums dark:from-blue-500 dark:to-indigo-500">
            {tools.length}
          </span>
        </div>
      </div>

      <div className="relative mx-auto mt-7 flex max-w-[920px] flex-wrap justify-center gap-2 md:gap-2.5">
        {pills.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => onCategoryFilter(p.key)}
            className={`font-display rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-200 md:px-4 ${
              activeCategory === p.key
                ? "border-transparent bg-gradient-to-br from-[var(--blue-primary)] to-indigo-600 text-white shadow-md shadow-[var(--blue-primary)]/25 dark:from-blue-500 dark:to-indigo-600"
                : "border-[var(--border-color)] bg-[var(--card-bg)]/90 text-[var(--text-secondary)] shadow-sm backdrop-blur-sm hover:border-[var(--blue-primary)]/35 hover:text-[var(--blue-primary)] dark:bg-[var(--card-bg)]/60"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {recent.length > 0 ? (
        <div className="relative mx-auto mt-10 max-w-[920px]">
          <p className="mb-3 font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
            Recently used
          </p>
          <div className="flex flex-wrap gap-2">
            {recent.map((t) => (
              <Link
                key={t.slug}
                href={`/${t.slug}`}
                className="group inline-flex items-center gap-2 rounded-full border border-[var(--border-color)]/90 bg-[var(--card-bg)]/90 px-3.5 py-2 text-sm font-medium text-[var(--text-primary)] shadow-sm backdrop-blur-sm transition-all hover:border-[var(--blue-primary)]/40 hover:shadow-md dark:bg-[var(--card-bg)]/70"
              >
                <span
                  className="h-2 w-2 rounded-full bg-gradient-to-br from-[var(--blue-primary)] to-violet-500 opacity-90 transition-transform group-hover:scale-110"
                  aria-hidden
                />
                {t.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
