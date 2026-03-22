/**
 * Build-time: embed getSearchableText() for each tool with the same model as the browser.
 * Run: npm run generate:embeddings
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "@xenova/transformers";
import { tools, getSearchableText } from "../data/tools";

const MODEL = "Xenova/all-MiniLM-L6-v2";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const outPath = join(__dirname, "../public/tool-embeddings.json");

async function main() {
  const extract = await pipeline("feature-extraction", MODEL);
  const embeddings: Record<string, number[]> = {};
  let dim = 384;
  for (const t of tools) {
    let text = getSearchableText(t);
    if (text.length > 512) {
      text = text.slice(0, 512);
    }
    const out = await extract(text, { pooling: "mean", normalize: true });
    const raw = out.data;
    const arr = Array.from(
      raw instanceof Float32Array ? raw : new Float32Array(raw as ArrayLike<number>)
    );
    dim = arr.length;
    embeddings[t.slug] = arr;
  }
  writeFileSync(outPath, JSON.stringify({ model: MODEL, dim, embeddings }));
  // eslint-disable-next-line no-console -- CLI script
  console.log("Wrote", outPath, "tools:", Object.keys(embeddings).length, "dim:", dim);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
