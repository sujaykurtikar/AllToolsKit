"use client";

import { useEffect } from "react";

type Props = {
  primaryLabel: string;
  onPrimary: () => void;
  secondary?: { label: string; onClick: () => void }[];
};

export function ActionBar({ primaryLabel, onPrimary, secondary = [] }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        onPrimary();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onPrimary]);

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={onPrimary}
        className="h-10 rounded-lg bg-[var(--blue-primary)] px-4 text-sm font-medium text-white hover:opacity-95"
      >
        {primaryLabel}
      </button>
      {secondary.map((s) => (
        <button
          key={s.label}
          type="button"
          onClick={s.onClick}
          className="h-10 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-4 text-sm font-medium text-[var(--text-secondary)] hover:border-[var(--blue-primary)]"
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
