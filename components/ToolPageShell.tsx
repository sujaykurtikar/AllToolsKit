"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ToolContent } from "@/components/tool-content";
import { categoryLabels, getToolBySlug, type Tool } from "@/data/tools";
import { addRecentTool, isFavorite, toggleFavorite } from "@/lib/storage";

function StarOutline() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function StarFilled() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function ToolPageShell({ tool }: { tool: Tool }) {
  const [fav, setFav] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    addRecentTool(tool.slug);
    setFav(isFavorite(tool.slug));
  }, [tool.slug]);

  const onStar = () => {
    const next = toggleFavorite(tool.slug);
    setFav(next);
  };

  const onShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      prompt("Copy URL:", url);
    }
  };

  return (
    <div>
      <nav className="border-b border-[var(--border-color)] px-4 py-3 text-[12px] text-[var(--text-tertiary)] md:px-6">
        <Link href="/" className="hover:text-[var(--blue-primary)]">
          Home
        </Link>
        <span className="mx-2">›</span>
        <Link
          href={`/?category=${encodeURIComponent(tool.category)}`}
          className="text-[var(--text-secondary)] transition hover:text-[var(--blue-primary)]"
        >
          {categoryLabels[tool.category]}
        </Link>
        <span className="mx-2">›</span>
        <span className="font-medium text-[var(--blue-primary)]">{tool.name}</span>
      </nav>

      <header className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-6 md:px-6">
        <div className="mx-auto flex max-w-[900px] flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--blue-primary)] text-sm font-bold text-white">
              {tool.icon}
            </div>
            <div>
              <h1 className="text-[22px] font-bold text-[var(--text-primary)]">{tool.name}</h1>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{tool.description}</p>
              <span className="mt-3 inline-flex items-center rounded-full bg-[var(--green-light)] px-3 py-1 text-xs font-medium text-[var(--green)]">
                🔒 Runs in browser only
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onStar}
              className={`rounded-lg border border-[var(--border-color)] p-2 ${fav ? "text-amber-500" : "text-[var(--text-tertiary)]"}`}
              aria-label="Favorite"
            >
              {fav ? <StarFilled /> : <StarOutline />}
            </button>
            <button
              type="button"
              onClick={() => void onShare()}
              className="rounded-lg border border-[var(--border-color)] px-3 py-2 text-sm text-[var(--text-secondary)]"
            >
              {copied ? "Copied!" : "Share"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[900px] px-4 py-6 md:px-6">
        <ToolContent slug={tool.slug} />
      </div>

      <section className="border-t border-[var(--border-color)] px-4 py-4 md:px-6">
        <p className="mb-2 text-sm font-medium text-[var(--text-secondary)]">Related tools</p>
        <div className="flex flex-wrap gap-2">
          {tool.related.map((r) => {
            const t = getToolBySlug(r);
            if (!t) {
              return null;
            }
            return (
              <Link
                key={r}
                href={`/${t.slug}`}
                className="rounded-full border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-1.5 text-sm hover:border-[var(--blue-primary)]"
              >
                {t.name}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
