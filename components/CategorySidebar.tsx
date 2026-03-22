"use client";

import type { ToolCategory } from "@/data/tools";
import { categoryLabels, tools } from "@/data/tools";

const categoryColors: Record<ToolCategory, string> = {
  developer: "#1a56db",
  text: "#16a34a",
  color: "#db2777",
  network: "#0d9488",
  math: "#7c3aed",
  image: "#ea580c",
  file: "#f97316",
  date: "#6b7280",
  designer: "#be185d"
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
      className="hidden w-[180px] shrink-0 border-r border-[var(--border-color)] md:block"
      style={{ position: "sticky", top: "56px", alignSelf: "flex-start" }}
    >
      <nav className="flex flex-col gap-0.5 py-4 pr-2">
        {items.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelect(item.key)}
              className={`flex w-full items-center gap-2 rounded-r-lg px-3 py-2 text-left text-sm transition ${
                isActive
                  ? "border-l-2 border-[var(--blue-primary)] bg-[var(--blue-light)] font-medium text-[var(--blue-primary)]"
                  : "border-l-2 border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
              }`}
            >
              {item.color ? (
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: item.color }}
                  aria-hidden
                />
              ) : (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--text-tertiary)]" aria-hidden />
              )}
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              <span className="shrink-0 rounded-full bg-[var(--bg-tertiary)] px-1.5 py-0.5 text-[11px] text-[var(--text-tertiary)]">
                {item.count}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
