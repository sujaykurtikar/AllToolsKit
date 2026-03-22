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
        className="flex h-full flex-col rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4 transition hover:border-[var(--blue-primary)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
      >
        <div className="flex items-start justify-between gap-2">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[var(--blue-primary)] text-xs font-bold text-white"
            aria-hidden
          >
            {tool.icon}
          </div>
          <button
            type="button"
            onClick={onStar}
            className={`rounded-lg p-1.5 transition ${
              fav ? "text-amber-500" : "text-[var(--text-tertiary)] hover:text-amber-500"
            }`}
            aria-label={fav ? "Remove from favorites" : "Add to favorites"}
          >
            {fav ? <StarFilled /> : <StarOutline />}
          </button>
        </div>
        <h3 className="mt-3 line-clamp-1 text-[15px] font-semibold text-[var(--text-primary)]">
          {tool.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-[13px] leading-[1.4] text-[var(--text-secondary)]">
          {tool.description}
        </p>
        <span className="mt-4 inline-flex w-fit items-center justify-center rounded-lg bg-[var(--blue-primary)] px-4 py-2.5 text-sm font-medium text-white">
          Open tool
        </span>
      </Link>
    </div>
  );
}
