import type { Rgb } from "@/lib/color-utils";
import { rgbToHex } from "@/lib/color-utils";

/** Quantize RGB to reduce noise and bucket similar pixels. */
function quantize(r: number, g: number, b: number, step: number): string {
  const q = (n: number) => Math.round(n / step) * step;
  return `${q(r)},${q(g)},${q(b)}`;
}

/**
 * Extract dominant colors from ImageData (simple frequency bucket).
 * Returns 5–10 hex colors sorted by frequency.
 */
export function extractPaletteFromImageData(data: ImageData, maxColors = 8): string[] {
  const { data: px, width, height } = data;
  const buckets = new Map<string, { r: number; g: number; b: number; n: number }>();
  const step = 24;
  const stride = Math.max(1, Math.floor(Math.sqrt((width * height) / 8000)));
  for (let y = 0; y < height; y += stride) {
    for (let x = 0; x < width; x += stride) {
      const i = (y * width + x) * 4;
      const r = px[i];
      const g = px[i + 1];
      const b = px[i + 2];
      const a = px[i + 3];
      if (a < 16) {
        continue;
      }
      const key = quantize(r, g, b, step);
      const cur = buckets.get(key);
      if (cur) {
        cur.n += 1;
        cur.r += r;
        cur.g += g;
        cur.b += b;
      } else {
        buckets.set(key, { r, g, b, n: 1 });
      }
    }
  }
  const sorted = [...buckets.entries()]
    .map(([k, v]) => ({
      key: k,
      n: v.n,
      r: Math.round(v.r / v.n),
      g: Math.round(v.g / v.n),
      b: Math.round(v.b / v.n)
    }))
    .sort((a, b) => b.n - a.n);

  const out: Rgb[] = [];
  const minDist = 35;
  for (const row of sorted) {
    const rgb = { r: row.r, g: row.g, b: row.b };
    const tooClose = out.some((o) => {
      const d = Math.hypot(o.r - rgb.r, o.g - rgb.g, o.b - rgb.b);
      return d < minDist;
    });
    if (!tooClose) {
      out.push(rgb);
    }
    if (out.length >= maxColors) {
      break;
    }
  }
  return out.map((rgb) => rgbToHex(rgb));
}
