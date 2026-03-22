import { mergeLexicalSemantic } from "@/lib/search/merge";
import { searchToolsLexical, type Tool } from "@/data/tools";

/**
 * Lexical AND-token match + optional client-side semantic rerank (lazy-loaded model).
 * Falls back to lexical only if embeddings or model fail to load.
 */
export async function searchToolsAsync(query: string): Promise<Tool[]> {
  const lexical = searchToolsLexical(query);
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return lexical;
  }
  try {
    const { semanticRank } = await import("@/lib/search/semantic");
    const sem = await semanticRank(trimmed);
    return mergeLexicalSemantic(lexical, sem);
  } catch {
    return lexical;
  }
}
