import { tools, type Tool } from "@/data/tools";

/**
 * Combine lexical ordering with semantic cosine scores.
 * When lexical is empty (e.g. typos), use the full semantic ordering so good matches are not cut off.
 */
export function mergeLexicalSemantic(
  lexical: Tool[],
  semantic: { slug: string; score: number }[]
): Tool[] {
  const toolBySlug = new Map(tools.map((t) => [t.slug, t]));

  if (lexical.length === 0) {
    return semantic
      .map((s) => toolBySlug.get(s.slug))
      .filter((t): t is Tool => Boolean(t));
  }

  const lexRank = new Map(lexical.map((t, i) => [t.slug, i]));
  const semMap = new Map(semantic.map((s) => [s.slug, s.score]));
  const slugs = new Set<string>();
  lexical.forEach((t) => slugs.add(t.slug));
  semantic.slice(0, 48).forEach((s) => slugs.add(s.slug));

  const rows: { t: Tool; combined: number }[] = [];
  for (const slug of slugs) {
    const t = toolBySlug.get(slug);
    if (!t) {
      continue;
    }
    const lr = lexRank.get(slug);
    const lexPart = lr !== undefined ? 1 / (1 + lr * 0.12) : 0;
    const semPart = semMap.get(slug) ?? 0;
    const combined = 0.38 * lexPart + 0.62 * semPart;
    rows.push({ t, combined });
  }
  rows.sort((a, b) => b.combined - a.combined);
  return rows.map((r) => r.t);
}
