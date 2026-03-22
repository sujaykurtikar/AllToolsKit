"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { categoryLabels, searchTools } from "@/data/tools";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function SearchOverlay({ open, onClose }: Props) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => searchTools(q).slice(0, 8), [q]);

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
      className="fixed inset-0 z-[200] flex items-start justify-center bg-black/50 px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search tools"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-[600px] rounded-2xl bg-[var(--card-bg)] p-4 shadow-xl">
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search tools..."
          className="h-12 w-full rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] px-4 text-[var(--text-primary)] outline-none"
        />
        <ul className="mt-3 max-h-[360px] overflow-auto">
          {results.map((t, i) => (
            <li key={t.slug}>
              <Link
                href={`/${t.slug}`}
                onClick={onClose}
                className={`flex items-start gap-3 rounded-lg px-3 py-2 ${
                  i === active ? "bg-[var(--blue-light)]" : ""
                }`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--blue-primary)] text-xs font-bold text-white">
                  {t.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-[var(--text-primary)]">{t.name}</span>
                    <span className="rounded bg-[var(--bg-tertiary)] px-2 py-0.5 text-[10px] text-[var(--text-tertiary)]">
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
          <p className="py-6 text-center text-sm text-[var(--text-tertiary)]">No matches</p>
        ) : null}
      </div>
    </div>
  );
}
