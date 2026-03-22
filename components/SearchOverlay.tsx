"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { categoryLabels, searchToolsLexical, type Tool } from "@/data/tools";
import { searchToolsAsync } from "@/lib/search/search-async";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function SearchOverlay({ open, onClose }: Props) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Tool[]>(() => searchToolsLexical("").slice(0, 8));
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    const delay = q.trim() ? 120 : 0;
    const t = window.setTimeout(() => {
      searchToolsAsync(q).then((r) => {
        if (!cancelled) {
          setResults(r.slice(0, 8));
        }
      });
    }, delay);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [q]);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [q]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => Math.min(i + 1, Math.max(0, results.length - 1)));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && results[active]) {
        router.push(`/${results[active].slug}`);
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, results, active, router]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center bg-slate-900/40 px-4 pt-[10vh] backdrop-blur-sm dark:bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-label="Search tools"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-[560px] overflow-hidden rounded-2xl border border-[var(--border-color)]/80 bg-[var(--card-bg)]/95 p-1 shadow-[var(--shadow-lg)] ring-1 ring-black/[0.04] backdrop-blur-xl dark:bg-[var(--card-bg)]/90 dark:ring-white/[0.06]">
        <div className="p-3 pb-0">
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tools…"
            className="font-display h-12 w-full rounded-xl border border-[var(--border-color)]/90 bg-[var(--input-bg)] px-4 text-[15px] text-[var(--text-primary)] shadow-inner outline-none transition focus:border-[var(--blue-primary)]/45 focus:ring-2 focus:ring-[var(--blue-primary)]/20"
          />
        </div>
        <ul className="mt-2 max-h-[min(52vh,420px)] overflow-auto px-2 pb-2">
          {results.map((t, i) => (
            <li key={t.slug}>
              <Link
                href={`/${t.slug}`}
                onClick={onClose}
                className={`flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                  i === active
                    ? "bg-[var(--blue-light)] ring-1 ring-[var(--blue-primary)]/15 dark:bg-[var(--blue-primary)]/18"
                    : "hover:bg-[var(--bg-tertiary)]/80"
                }`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--blue-primary)] to-indigo-600 text-xs font-bold text-white shadow-md">
                  {t.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display font-semibold text-[var(--text-primary)]">{t.name}</span>
                    <span className="rounded-lg bg-[var(--bg-tertiary)] px-2 py-0.5 font-display text-[10px] font-medium uppercase tracking-wide text-[var(--text-tertiary)]">
                      {categoryLabels[t.category]}
                    </span>
                  </div>
                  <p className="line-clamp-1 text-sm text-[var(--text-secondary)]">{t.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        {results.length === 0 ? (
          <p className="py-8 text-center font-display text-sm text-[var(--text-tertiary)]">No matches</p>
        ) : null}
        <p className="border-t border-[var(--border-color)]/80 px-4 py-2.5 text-center font-display text-[11px] text-[var(--text-tertiary)]">
          <kbd className="rounded border border-[var(--border-color)] bg-[var(--bg-tertiary)] px-1.5 py-0.5 font-mono text-[10px]">↑</kbd>{" "}
          <kbd className="rounded border border-[var(--border-color)] bg-[var(--bg-tertiary)] px-1.5 py-0.5 font-mono text-[10px]">↓</kbd>{" "}
          navigate ·{" "}
          <kbd className="rounded border border-[var(--border-color)] bg-[var(--bg-tertiary)] px-1.5 py-0.5 font-mono text-[10px]">Enter</kbd>{" "}
          open · Esc close
        </p>
      </div>
    </div>
  );
}
