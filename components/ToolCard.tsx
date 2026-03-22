"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { Tool } from "@/data/tools";
import { isFavorite, toggleFavorite } from "@/lib/storage";

function StarOutline() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarFilled() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="transition-transform group-hover:translate-x-0.5">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ToolCard({ tool }: { tool: Tool }) {
  const [fav, setFav] = useState(false);

  useEffect(() => {
    setFav(isFavorite(tool.slug));
  }, [tool.slug]);

  const onStar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleFavorite(tool.slug);
    setFav(next);
  };

  return (
    <div className="relative h-full">
      <Link
        href={`/${tool.slug}`}
        className="group flex h-full flex-col rounded-2xl border border-[var(--border-color)]/90 bg-[var(--card-bg)]/95 p-5 shadow-[var(--shadow-sm)] ring-1 ring-black/[0.02] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--blue-primary)]/35 hover:shadow-[var(--shadow-card-hover)] dark:bg-[var(--card-bg)]/90 dark:ring-white/[0.04]"
      >
        <div className="flex items-start justify-between gap-2">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--blue-primary)] via-blue-600 to-indigo-600 text-xs font-bold text-white shadow-md shadow-[var(--blue-primary)]/20"
            aria-hidden
          >
            {tool.icon}
          </div>
          <button
            type="button"
            onClick={onStar}
            className={`rounded-xl p-2 transition ${
              fav ? "text-amber-500" : "text-[var(--text-tertiary)] hover:bg-[var(--bg-tertiary)] hover:text-amber-500"
            }`}
            aria-label={fav ? "Remove from favorites" : "Add to favorites"}
          >
            {fav ? <StarFilled /> : <StarOutline />}
          </button>
        </div>
        <h3 className="font-display mt-4 line-clamp-1 text-[16px] font-semibold tracking-tight text-[var(--text-primary)]">
          {tool.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-[var(--text-secondary)]">
          {tool.description}
        </p>
        <span className="font-display mt-5 inline-flex w-fit items-center gap-1.5 rounded-xl bg-[var(--bg-tertiary)] px-3.5 py-2 text-sm font-semibold text-[var(--blue-primary)] transition group-hover:bg-[var(--blue-light)] dark:group-hover:bg-[var(--blue-primary)]/20">
          Open tool
          <ArrowIcon />
        </span>
      </Link>
    </div>
  );
}
