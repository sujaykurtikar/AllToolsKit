# PandaPath Tools (AllToolsKit)

## Tool search

Search runs **entirely in the browser**: no search API on your server.

- **Lexical:** Multi-word queries use AND matching over `getSearchableText()` (name, description, tags, optional `searchText`, slug words, related-tool slugs). If nothing matches, the same AND is retried with **fuzzy word matching** (Levenshtein distance by token length) so typos like “genarter” still match “generator”.
- **Semantic:** For queries of 2+ characters, results are merged with cosine similarity using precomputed embeddings in `public/tool-embeddings.json` (model `Xenova/all-MiniLM-L6-v2`). The embedding model loads lazily on first semantic search. If **lexical** finds no matches (e.g. heavy typos), ranking uses the **full** semantic list, not a short slice, so relevant tools can still surface.

Regenerate vectors after changing tool copy:

```bash
npm run generate:embeddings
```

`npm run build` runs `generate:embeddings` automatically (`prebuild`).

## Editorial metadata

Optional per-tool `searchText` in [`data/tools.ts`](data/tools.ts) and [`lib/designer-tools-data.ts`](lib/designer-tools-data.ts) adds synonyms and use cases for search without changing card subtitles. Expand `searchText` for more tools over time.
