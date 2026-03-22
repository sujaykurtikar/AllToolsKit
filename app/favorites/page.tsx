"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ToolCard } from "@/components/ToolCard";
import type { Tool } from "@/data/tools";
import { getToolBySlug } from "@/data/tools";
import { getFavorites } from "@/lib/storage";

export default function FavoritesPage() {
  const [favs, setFavs] = useState<Tool[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFavs(
      getFavorites()
        .map((s) => getToolBySlug(s))
        .filter((t): t is Tool => Boolean(t))
    );
    setHydrated(true);
  }, []);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 md:px-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Favorites</h1>
      <p className="mt-2 text-[var(--text-secondary)]">Tools you have starred.</p>
      {!hydrated ? (
        <div
          className="mt-10 min-h-[160px]"
          aria-busy="true"
          aria-label="Loading favorites"
        />
      ) : favs.length === 0 ? (
        <p className="mt-10 text-center text-[var(--text-secondary)]">
          No favorites yet. Star any tool to save it here.{" "}
          <Link href="/" className="text-[var(--blue-primary)]">
            Browse tools
          </Link>
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {favs.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      )}
    </div>
  );
}
