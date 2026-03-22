"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { CategorySidebar } from "@/components/CategorySidebar";
import { Hero } from "@/components/Hero";
import { SearchOverlay } from "@/components/SearchOverlay";
import { ToolCard } from "@/components/ToolCard";
import {
  categoryLabels,
  parseCategoryQuery,
  searchTools,
  tools,
  type ToolCategory
} from "@/data/tools";

const CATEGORY_SECTION_ORDER: ToolCategory[] = [
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

function matchesCategory(tool: (typeof tools)[number], cat: ToolCategory | "all") {
  if (cat === "all") {
    return true;
  }
  return tool.category === cat;
}

type HomeClientProps = {
  initialCategory: ToolCategory | "all";
};

export function HomeClient({ initialCategory }: HomeClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "all">(initialCategory);
  const [overlay, setOverlay] = useState(false);

  useEffect(() => {
    const next = parseCategoryQuery(searchParams.get("category")) ?? "all";
    setActiveCategory(next);
  }, [searchParams]);

  const onCategoryFilter = useCallback(
    (c: ToolCategory | "all") => {
      setActiveCategory(c);
      const p = new URLSearchParams(searchParams.toString());
      if (c === "all") {
        p.delete("category");
      } else {
        p.set("category", c);
      }
      const qs = p.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    const cat = searchParams.get("category");
    if (!cat) {
      return;
    }
    const id = cat === "all" ? "cat-all" : `cat-${cat}`;
    const el = document.getElementById(id);
    if (!el) {
      return;
    }
    const t = window.setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(t);
  }, [searchParams]);

  const displayed = useMemo(() => {
    return searchTools(searchQuery).filter((t) => matchesCategory(t, activeCategory));
  }, [searchQuery, activeCategory]);

  const grouped = useMemo(() => {
    const map = new Map<ToolCategory, typeof tools>();
    for (const t of displayed) {
      const arr = map.get(t.category) ?? [];
      arr.push(t);
      map.set(t.category, arr);
    }
    return map;
  }, [displayed]);

  /** When showing "All", one flat list sorted by category order then name (avoids a misleading "Developer" header). */
  const displayedSortedForAll = useMemo(() => {
    if (activeCategory !== "all") {
      return displayed;
    }
    return [...displayed].sort((a, b) => {
      const ai = CATEGORY_SECTION_ORDER.indexOf(a.category);
      const bi = CATEGORY_SECTION_ORDER.indexOf(b.category);
      if (ai !== bi) {
        return ai - bi;
      }
      return a.name.localeCompare(b.name);
    });
  }, [displayed, activeCategory]);

  return (
    <div>
      <Hero
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        activeCategory={activeCategory}
        onCategoryFilter={onCategoryFilter}
      />
      <div className="mx-auto flex max-w-[1200px]">
        <CategorySidebar active={activeCategory} onSelect={onCategoryFilter} />
        <div className="min-w-0 flex-1">
          {displayed.length === 0 ? (
            <p className="py-16 text-center text-[var(--text-secondary)]">
              No tools found for &apos;{searchQuery}&apos;
            </p>
          ) : activeCategory === "all" ? (
            <section id="cat-all">
              <div className="sticky top-14 z-10 border-b border-[var(--border-color)] bg-[var(--bg-tertiary)] px-4 py-3 md:px-6">
                <h2 className="text-lg font-bold text-[var(--text-primary)]">
                  All tools — {displayed.length} tools
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:p-6">
                {displayedSortedForAll.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          ) : (
            CATEGORY_SECTION_ORDER.map((cat) => {
              const list = grouped.get(cat);
              if (!list?.length) {
                return null;
              }
              return (
                <section key={cat} id={`cat-${cat}`}>
                  <div className="sticky top-14 z-10 border-b border-[var(--border-color)] bg-[var(--bg-tertiary)] px-4 py-3 md:px-6">
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">
                      {categoryLabels[cat]} — {list.length} tools
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:p-6">
                    {list.map((tool) => (
                      <ToolCard key={tool.slug} tool={tool} />
                    ))}
                  </div>
                </section>
              );
            })
          )}
        </div>
      </div>
      <SearchOverlay open={overlay} onClose={() => setOverlay(false)} />
      <KeyboardSearchOpener onOpen={() => setOverlay(true)} />
    </div>
  );
}

function KeyboardSearchOpener({ onOpen }: { onOpen: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpen();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onOpen]);
  return null;
}
