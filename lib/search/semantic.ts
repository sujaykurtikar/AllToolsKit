/**
 * Client-side semantic ranking: precomputed tool vectors + query embedding (same model as build).
 * Requires /tool-embeddings.json under Next basePath.
 */
const MODEL_ID = "Xenova/all-MiniLM-L6-v2";

type EmbeddingsFile = {
  model: string;
  dim: number;
  embeddings: Record<string, number[]>;
};

let embeddingsCache: EmbeddingsFile | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- xenova pipeline instance
let extractorInstance: any = null;

export async function loadEmbeddingsData(): Promise<EmbeddingsFile> {
  if (embeddingsCache) {
    return embeddingsCache;
  }
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const res = await fetch(`${base}/tool-embeddings.json`);
  if (!res.ok) {
    throw new Error(`tool-embeddings.json: ${res.status}`);
  }
  embeddingsCache = (await res.json()) as EmbeddingsFile;
  return embeddingsCache;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const d = Math.sqrt(na) * Math.sqrt(nb);
  return d === 0 ? 0 : dot / d;
}

async function getExtractor() {
  if (!extractorInstance) {
    const { pipeline } = await import("@xenova/transformers");
    extractorInstance = await pipeline("feature-extraction", MODEL_ID);
  }
  return extractorInstance;
}

/** Cosine similarity scores for every tool slug vs the query (sorted desc). */
export async function semanticRank(
  query: string
): Promise<{ slug: string; score: number }[]> {
  const data = await loadEmbeddingsData();
  const extractor = await getExtractor();
  const out = await extractor(query, { pooling: "mean", normalize: true });
  const raw = out.data;
  const qv = Array.from(raw instanceof Float32Array ? raw : new Float32Array(raw as ArrayLike<number>));
  const scores: { slug: string; score: number }[] = [];
  for (const [slug, vec] of Object.entries(data.embeddings)) {
    scores.push({ slug, score: cosineSimilarity(qv, vec) });
  }
  scores.sort((a, b) => b.score - a.score);
  return scores;
}
