"use client";

import type { ToolCategory } from "@/data/tools";
import { categoryLabels, tools } from "@/data/tools";

const categoryColors: Record<ToolCategory, string> = {
  developer: "#2563eb",
  text: "#16a34a",
  color: "#db2777",
  network: "#0d9488",
  math: "#7c3aed",
  image: "#ea580c",
  file: "#f97316",
  date: "#64748b",
  designer: "#c026d3"
};

const categoryOrder: ToolCategory[] = [
  "developer",
  "text",
  "color",
  "network",
  "math",
  "image",
  "file",
  "date",
  "designer"
];

type Props = {
  active: ToolCategory | "all";
  onSelect: (category: ToolCategory | "all") => void;
};

export function CategorySidebar({ active, onSelect }: Props) {
  const counts = categoryOrder.reduce(
    (acc, cat) => {
      acc[cat] = tools.filter((t) => t.category === cat).length;
      return acc;
    },
    {} as Record<ToolCategory, number>
  );

  const items: { key: ToolCategory | "all"; label: string; count: number; color?: string }[] = [
    { key: "all", label: "All", count: tools.length },
    ...categoryOrder.map((cat) => ({
      key: cat,
      label: categoryLabels[cat],
      count: counts[cat],
      color: categoryColors[cat]
    }))
  ];

  return (
    <aside
      className="hidden w-[196px] shrink-0 border-r border-[var(--border-color)]/80 bg-[var(--bg-secondary)]/50 md:block"
      style={{ position: "sticky", top: "56px", alignSelf: "flex-start" }}
    >
      <nav className="flex flex-col gap-1 py-5 pr-3">
        <p className="mb-2 px-3 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
          Categories
        </p>
        {items.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelect(item.key)}
              className={`group flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left font-display text-sm transition-all ${
                isActive
                  ? "bg-[var(--blue-light)] font-semibold text-[var(--blue-primary)] shadow-sm ring-1 ring-[var(--blue-primary)]/15 dark:bg-[var(--blue-primary)]/18 dark:text-[#93c5fd]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]/90 hover:text-[var(--text-primary)]"
              }`}
            >
              {item.color ? (
                <span
                  className="h-2 w-2 shrink-0 rounded-full shadow-sm ring-2 ring-white/20 dark:ring-black/20"
                  style={{ background: item.color }}
                  aria-hidden
                />
              ) : (
                <span
                  className="h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-slate-400 to-slate-500"
                  aria-hidden
                />
              )}
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              <span
                className={`shrink-0 rounded-lg px-2 py-0.5 font-display text-[11px] font-semibold tabular-nums ${
                  isActive
                    ? "bg-white/80 text-[var(--blue-primary)] dark:bg-black/25 dark:text-[#bfdbfe]"
                    : "bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]"
                }`}
              >
                {item.count}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
