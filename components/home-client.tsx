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

  /** All tools matching the search (empty query = full catalog). */
  const searchMatches = useMemo(() => searchTools(searchQuery), [searchQuery]);

  /** When a category pill is selected: matches in that category (shown first). */
  const primaryTools = useMemo(() => {
    if (activeCategory === "all") {
      return [];
    }
    return searchMatches.filter((t) => t.category === activeCategory);
  }, [searchMatches, activeCategory]);

  /** When a category pill is selected: matches in every other category (shown below, no duplicates with primary). */
  const secondaryTools = useMemo(() => {
    if (activeCategory === "all") {
      return [];
    }
    return searchMatches.filter((t) => t.category !== activeCategory);
  }, [searchMatches, activeCategory]);

  const groupedSecondary = useMemo(() => {
    const map = new Map<ToolCategory, typeof tools>();
    for (const t of secondaryTools) {
      const arr = map.get(t.category) ?? [];
      arr.push(t);
      map.set(t.category, arr);
    }
    for (const [cat, arr] of map) {
      arr.sort((a, b) => a.name.localeCompare(b.name));
      map.set(cat, arr);
    }
    return map;
  }, [secondaryTools]);

  const primarySorted = useMemo(
    () => [...primaryTools].sort((a, b) => a.name.localeCompare(b.name)),
    [primaryTools]
  );

  /** When showing "All", one flat list sorted by category order then name (avoids a misleading "Developer" header). */
  const displayedSortedForAll = useMemo(() => {
    if (activeCategory !== "all") {
      return searchMatches;
    }
    return [...searchMatches].sort((a, b) => {
      const ai = CATEGORY_SECTION_ORDER.indexOf(a.category);
      const bi = CATEGORY_SECTION_ORDER.indexOf(b.category);
      if (ai !== bi) {
        return ai - bi;
      }
      return a.name.localeCompare(b.name);
    });
  }, [searchMatches, activeCategory]);

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
          {searchMatches.length === 0 ? (
            <p className="py-16 text-center text-[var(--text-secondary)]">
              No tools found for &apos;{searchQuery}&apos;
            </p>
          ) : activeCategory === "all" ? (
            <section id="cat-all">
              <div className="sticky top-14 z-10 border-b border-[var(--border-color)] bg-[var(--bg-tertiary)] px-4 py-3 md:px-6">
                <h2 className="text-lg font-bold text-[var(--text-primary)]">
                  All tools — {searchMatches.length} tools
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:p-6">
                {displayedSortedForAll.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          ) : (
            <>
              {primarySorted.length > 0 ? (
                <section id={`cat-${activeCategory}`}>
                  <div className="sticky top-14 z-10 border-b border-[var(--border-color)] bg-[var(--bg-tertiary)] px-4 py-3 md:px-6">
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">
                      {categoryLabels[activeCategory]} — {primarySorted.length} tools
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:p-6">
                    {primarySorted.map((tool) => (
                      <ToolCard key={tool.slug} tool={tool} />
                    ))}
                  </div>
                </section>
              ) : null}

              {secondaryTools.length > 0 ? (
                <section
                  id="cat-search-others"
                  className={
                    primarySorted.length > 0 ? "border-t border-[var(--border-color)]" : undefined
                  }
                >
                  <div className="sticky top-14 z-10 border-b border-[var(--border-color)] bg-[var(--bg-tertiary)] px-4 py-3 md:px-6">
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">
                      Also matching your search — {secondaryTools.length} tools
                    </h2>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">Other categories</p>
                  </div>
                  {CATEGORY_SECTION_ORDER.map((cat) => {
                    const list = groupedSecondary.get(cat);
                    if (!list?.length) {
                      return null;
                    }
                    return (
                      <div key={cat}>
                        <h3 className="px-4 pt-4 text-base font-semibold text-[var(--text-primary)] md:px-6">
                          {categoryLabels[cat]}
                        </h3>
                        <div className="grid grid-cols-1 gap-4 p-4 pt-2 sm:grid-cols-2 md:px-6 md:pb-6">
                          {list.map((tool) => (
                            <ToolCard key={tool.slug} tool={tool} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </section>
              ) : null}
            </>
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
