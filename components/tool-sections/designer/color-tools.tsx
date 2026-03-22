"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ToolInput } from "@/components/tool/ToolInput";
import { ToolOutput } from "@/components/tool/ToolOutput";
import {
  contrastRatio,
  hslToRgb,
  parseHex,
  rgbToHex,
  rgbToHsl,
  type Rgb
} from "@/lib/color-utils";
import { nearestNamedColor } from "@/lib/css-named-colors";
import { applyColorBlindness, type BlindMode } from "@/lib/designer-color-blind";
import { extractPaletteFromImageData } from "@/lib/designer-image-palette";

function slugifyToken(s: string): string {
  const t = s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return t || "color";
}

function parseColorLines(input: string): { label: string; hex: string }[] {
  const lines = input.split(/\n/);
  const out: { label: string; hex: string }[] = [];
  let auto = 0;
  for (const line of lines) {
    const m = line.match(/#([0-9a-f]{3,8})\b/i);
    if (!m) {
      continue;
    }
    let h = "#" + m[1];
    if (m[1].length === 3) {
      h =
        "#" +
        m[1]
          .split("")
          .map((c) => c + c)
          .join("");
    }
    const rgb = parseHex(h);
    if (!rgb) {
      continue;
    }
    const hex = rgbToHex(rgb);
    const rest = line.replace(/#([0-9a-f]{3,8})\b/i, "").trim();
    const label = rest ? slugifyToken(rest) : `color-${auto++}`;
    out.push({ label, hex });
  }
  return out;
}

export function TintShadeGenerator() {
  const [base, setBase] = useState("#3b82f6");
  const out = useMemo(() => {
    const rgb = parseHex(base);
    if (!rgb) {
      return "";
    }
    const { h, s, l } = rgbToHsl(rgb);
    const lines: string[] = [];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      const L = Math.max(2, Math.min(98, l + (t - 0.5) * 85));
      const c = hslToRgb(h, s, L);
      lines.push(`${rgbToHex(c)} /* step ${i} L≈${L.toFixed(1)}% */`);
    }
    return lines.join("\n");
  }, [base]);
  return (
    <div className="grid gap-4">
      <label className="flex flex-col gap-2 text-sm">
        <span className="text-[var(--text-secondary)]">Base color</span>
        <input type="color" value={base.slice(0, 7)} onChange={(e) => setBase(e.target.value)} className="h-10 w-24" />
      </label>
      <div className="flex flex-wrap gap-1">
        {out.split("\n").map((line, i) => {
          const hex = line.split(" ")[0];
          return (
            <div
              key={i}
              title={line}
              className="h-10 w-10 rounded border border-[var(--border-color)]"
              style={{ background: hex }}
            />
          );
        })}
      </div>
      <ToolOutput value={out} />
    </div>
  );
}

export function ColorHarmoniesTool() {
  const [base, setBase] = useState("#1a56db");
  const swatches = useMemo(() => {
    const rgb = parseHex(base);
    if (!rgb) {
      return [];
    }
    const { h, s, l } = rgbToHsl(rgb);
    const mk = (angle: number) => rgbToHex(hslToRgb((h + angle + 360) % 360, s, l));
    return [
      { name: "Base", hex: rgbToHex(rgb) },
      { name: "Complement", hex: mk(180) },
      { name: "Split +150°", hex: mk(150) },
      { name: "Split −150°", hex: mk(-150) },
      { name: "Analogous −30°", hex: mk(-30) },
      { name: "Analogous +30°", hex: mk(30) },
      { name: "Triad +120°", hex: mk(120) },
      { name: "Triad +240°", hex: mk(240) }
    ];
  }, [base]);
  return (
    <div className="grid gap-4">
      <label className="flex flex-col gap-2 text-sm">
        <span className="text-[var(--text-secondary)]">Base</span>
        <input type="color" value={base.slice(0, 7)} onChange={(e) => setBase(e.target.value)} className="h-10 w-24" />
      </label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {swatches.map((s) => (
          <div key={s.name} className="rounded-lg border border-[var(--border-color)] p-2 text-center text-xs">
            <div className="mx-auto mb-1 h-12 w-full rounded" style={{ background: s.hex }} />
            <div className="text-[var(--text-secondary)]">{s.name}</div>
            <div className="font-mono text-[10px] text-[var(--text-tertiary)]">{s.hex}</div>
          </div>
        ))}
      </div>
      <ToolOutput value={swatches.map((s) => `${s.name}: ${s.hex}`).join("\n")} />
    </div>
  );
}

type ExportFmt = "css" | "tailwind" | "scss" | "json";

export function DesignTokenExporter() {
  const [text, setText] = useState("primary #2563eb\nsecondary #64748b\naccent #f59e0b");
  const [fmt, setFmt] = useState<ExportFmt>("css");
  const out = useMemo(() => {
    const rows = parseColorLines(text);
    if (!rows.length) {
      return "";
    }
    if (fmt === "css") {
      return `:root {\n${rows.map((r) => `  --color-${r.label}: ${r.hex};`).join("\n")}\n}`;
    }
    if (fmt === "scss") {
      return rows.map((r) => `$color-${r.label}: ${r.hex};`).join("\n");
    }
    if (fmt === "tailwind") {
      const inner = rows.map((r) => `    '${r.label}': '${r.hex}',`).join("\n");
      return `// tailwind.config.js — inside theme.extend.colors\n{\n${inner}\n}`;
    }
    return JSON.stringify(
      Object.fromEntries(rows.map((r) => [`color.${r.label}`, r.hex])),
      null,
      2
    );
  }, [text, fmt]);
  return (
    <div className="grid gap-4">
      <p className="text-sm text-[var(--text-secondary)]">One color per line: optional name then hex (e.g. primary #2563eb).</p>
      <label className="text-sm">
        <span className="text-[var(--text-secondary)]">Format</span>
        <select
          className="ml-2 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1"
          value={fmt}
          onChange={(e) => setFmt(e.target.value as ExportFmt)}
        >
          <option value="css">CSS variables</option>
          <option value="scss">SCSS</option>
          <option value="tailwind">Tailwind colors object</option>
          <option value="json">JSON</option>
        </select>
      </label>
      <ToolInput label="Colors" value={text} onChange={setText} minHeight={120} />
      <ToolOutput value={out} />
    </div>
  );
}

export function BrandPaletteBuilder() {
  const [primary, setPrimary] = useState("#2563eb");
  const [secondary, setSecondary] = useState("#64748b");
  const out = useMemo(() => {
    const p = parseHex(primary);
    const s = parseHex(secondary);
    if (!p || !s) {
      return "";
    }
    const neutral = (mix: Rgb, t: number): Rgb => ({
      r: Math.round(mix.r * (1 - t) + 128 * t),
      g: Math.round(mix.g * (1 - t) + 128 * t),
      b: Math.round(mix.b * (1 - t) + 128 * t)
    });
    const n1 = rgbToHex(neutral(p, 0.85));
    const n2 = rgbToHex(neutral(p, 0.65));
    const n3 = rgbToHex(neutral(s, 0.5));
    return [
      `--brand-primary: ${rgbToHex(p)};`,
      `--brand-secondary: ${rgbToHex(s)};`,
      `--neutral-100: ${n1};`,
      `--neutral-200: ${n2};`,
      `--neutral-300: ${n3};`
    ].join("\n");
  }, [primary, secondary]);
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-4">
        <label className="text-sm">
          Primary
          <input type="color" value={primary.slice(0, 7)} onChange={(e) => setPrimary(e.target.value)} className="ml-2" />
        </label>
        <label className="text-sm">
          Secondary
          <input type="color" value={secondary.slice(0, 7)} onChange={(e) => setSecondary(e.target.value)} className="ml-2" />
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        {out.split("\n").map((line) => {
          const hex = line.match(/#[0-9A-F]{6}/i)?.[0];
          return hex ? (
            <div key={line} className="h-12 w-16 rounded border border-[var(--border-color)]" style={{ background: hex }} />
          ) : null;
        })}
      </div>
      <ToolOutput value={out} />
    </div>
  );
}

export function ColorNameFinder() {
  const [hex, setHex] = useState("#1a56db");
  const out = useMemo(() => {
    const near = nearestNamedColor(hex);
    if (!near) {
      return "Invalid hex.";
    }
    return [
      `Nearest CSS name: ${near.name}`,
      `Named swatch: ${near.hex}`,
      `Your input: ${hex}`,
      `RGB distance²: ${near.distance.toFixed(1)} (lower is closer)`
    ].join("\n");
  }, [hex]);
  return (
    <div className="grid gap-4">
      <label className="flex items-center gap-2 text-sm">
        <span className="text-[var(--text-secondary)]">Hex</span>
        <input type="color" value={hex.slice(0, 7)} onChange={(e) => setHex(e.target.value)} />
        <input
          className="flex-1 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1 font-mono text-sm"
          value={hex}
          onChange={(e) => setHex(e.target.value)}
        />
      </label>
      <ToolOutput value={out} />
    </div>
  );
}

export function PaletteFromImage() {
  const [palette, setPalette] = useState<string[]>([]);
  const [err, setErr] = useState("");
  const onFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || !f.type.startsWith("image/")) {
      setErr("Choose an image file.");
      return;
    }
    setErr("");
    const img = new Image();
    const url = URL.createObjectURL(f);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const w = Math.min(200, img.naturalWidth);
      const h = Math.min(200, img.naturalHeight);
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d");
      if (!ctx) {
        setErr("Canvas not available.");
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      const id = ctx.getImageData(0, 0, w, h);
      setPalette(extractPaletteFromImageData(id, 8));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setErr("Could not load image.");
    };
    img.src = url;
  }, []);
  return (
    <div className="grid gap-4">
      <input type="file" accept="image/*" onChange={onFile} className="text-sm" />
      {err ? <p className="text-sm text-red-500">{err}</p> : null}
      {palette.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {palette.map((h) => (
            <div key={h} className="flex flex-col items-center gap-1 text-[10px]">
              <div className="h-14 w-14 rounded border border-[var(--border-color)]" style={{ background: h }} />
              <span className="font-mono">{h}</span>
            </div>
          ))}
        </div>
      ) : null}
      <ToolOutput value={palette.join("\n")} />
    </div>
  );
}

export function AccessibleColorPairs() {
  const [bg, setBg] = useState("#ffffff");
  const out = useMemo(() => {
    const b = parseHex(bg);
    if (!b) {
      return "";
    }
    const white: Rgb = { r: 255, g: 255, b: 255 };
    const black: Rgb = { r: 0, g: 0, b: 0 };
    const cw = contrastRatio(white, b);
    const ck = contrastRatio(black, b);
    const aa = (r: number) => (r >= 4.5 ? "AA ✓" : "fail");
    const aaa = (r: number) => (r >= 7 ? "AAA ✓" : "—");
    return [
      `Background: ${rgbToHex(b)}`,
      `White text: contrast ${cw.toFixed(2)} :1 — ${aa(cw)} body / ${aaa(cw)} large`,
      `Black text: contrast ${ck.toFixed(2)} :1 — ${aa(ck)} body / ${aaa(ck)} large`,
      "",
      "Prefer the option with higher contrast that passes your target level."
    ].join("\n");
  }, [bg]);
  return (
    <div className="grid gap-4">
      <label className="flex items-center gap-2 text-sm">
        Background
        <input type="color" value={bg.slice(0, 7)} onChange={(e) => setBg(e.target.value)} />
      </label>
      <div className="flex gap-4 rounded-lg border border-[var(--border-color)] p-4" style={{ background: bg }}>
        <span className="text-lg text-white [text-shadow:0_0_2px_#000]">White label</span>
        <span className="text-lg text-black">Black label</span>
      </div>
      <ToolOutput value={out} />
    </div>
  );
}

export function DarkModeColorGenerator() {
  const [lines, setLines] = useState("#f8fafc\n#1e293b\n#3b82f6");
  const out = useMemo(() => {
    const parsed = parseColorLines(lines.replace(/^/gm, "#").replace(/##/g, "#"));
    const rows = lines
      .split(/\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => (l.startsWith("#") ? l : `#${l}`));
    const hexes = rows.map((h) => parseHex(h)).filter((x): x is Rgb => Boolean(x));
    if (!hexes.length) {
      return "";
    }
    return hexes
      .map((rgb) => {
        const { h, s, l } = rgbToHsl(rgb);
        const darkL = Math.max(8, Math.min(92, 100 - l));
        const darkS = Math.min(100, s * 0.92);
        const d = hslToRgb(h, darkS, darkL);
        return `${rgbToHex(rgb)} → ${rgbToHex(d)}`;
      })
      .join("\n");
  }, [lines]);
  return (
    <div className="grid gap-4">
      <p className="text-sm text-[var(--text-secondary)]">One hex per line. Produces a darker-surface–friendly companion using inverted lightness.</p>
      <ToolInput label="Light-theme colors" value={lines} onChange={setLines} minHeight={120} />
      <ToolOutput value={out} />
    </div>
  );
}

export function OpacityAlphaCalculator() {
  const [hex, setHex] = useState("#3b82f6");
  const [a, setA] = useState("0.5");
  const preview = useMemo(() => {
    const rgb = parseHex(hex);
    const alpha = Number.parseFloat(a);
    if (!rgb || !Number.isFinite(alpha)) {
      return null;
    }
    const al = Math.min(1, Math.max(0, alpha));
    return { ...rgb, a: al };
  }, [hex, a]);
  const css = useMemo(() => {
    if (!preview) {
      return "";
    }
    return `rgba(${preview.r}, ${preview.g}, ${preview.b}, ${preview.a})`;
  }, [preview]);
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end gap-4">
        <label className="text-sm">
          Color
          <input type="color" value={hex.slice(0, 7)} onChange={(e) => setHex(e.target.value)} className="ml-2" />
        </label>
        <label className="text-sm">
          Alpha
          <input
            type="number"
            step="0.05"
            min={0}
            max={1}
            className="ml-2 w-24 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1"
            value={a}
            onChange={(e) => setA(e.target.value)}
          />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border p-8" style={{ background: "#fff" }}>
          <div className="h-16 w-full rounded" style={{ background: css }} />
          <p className="mt-2 text-center text-xs text-[var(--text-tertiary)]">On white</p>
        </div>
        <div className="rounded-lg border p-8" style={{ background: "#0f172a" }}>
          <div className="h-16 w-full rounded" style={{ background: css }} />
          <p className="mt-2 text-center text-xs text-slate-300">On dark</p>
        </div>
      </div>
      <ToolOutput value={css ? `${css}\n\n/* solid fallback */ color-mix(in srgb, ${hex} ${Number.parseFloat(a) * 100}%, transparent);` : ""} />
    </div>
  );
}

export function CssColorVariables() {
  const [text, setText] = useState("brand #2563eb\nsurface #f1f5f9");
  const out = useMemo(() => {
    const rows = parseColorLines(text);
    if (!rows.length) {
      return "";
    }
    return rows.map((r) => `  --${r.label}: ${r.hex};`).join("\n");
  }, [text]);
  return (
    <div className="grid gap-4">
      <p className="text-sm text-[var(--text-secondary)]">Optional label per line, then hex. Outputs `--token: #hex` declarations.</p>
      <ToolInput label="Lines" value={text} onChange={setText} minHeight={120} />
      <ToolOutput value={out ? `:root {\n${out}\n}` : ""} />
    </div>
  );
}

function figmaColorsFromJson(raw: string): string {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return "Invalid JSON.";
  }
  const found: { path: string; hex: string }[] = [];
  const walk = (obj: unknown, path: string) => {
    if (obj === null || obj === undefined) {
      return;
    }
    if (typeof obj === "string") {
      const m = obj.match(/#([0-9a-f]{6})\b/i);
      if (m) {
        found.push({ path, hex: "#" + m[1].toUpperCase() });
      }
      return;
    }
    if (typeof obj === "object" && !Array.isArray(obj)) {
      const o = obj as Record<string, unknown>;
      if (
        typeof o.r === "number" &&
        typeof o.g === "number" &&
        typeof o.b === "number" &&
        o.r <= 1 &&
        o.g <= 1 &&
        o.b <= 1
      ) {
        const rgb: Rgb = {
          r: Math.round(o.r * 255),
          g: Math.round(o.g * 255),
          b: Math.round(o.b * 255)
        };
        found.push({ path, hex: rgbToHex(rgb) });
      }
      for (const [k, v] of Object.entries(o)) {
        walk(v, path ? `${path}.${k}` : k);
      }
      return;
    }
    if (Array.isArray(obj)) {
      obj.forEach((v, i) => walk(v, `${path}[${i}]`));
    }
  };
  walk(data, "");
  if (!found.length) {
    return "No colors found (looked for #RRGGBB strings and {r,g,b} 0–1 objects).";
  }
  return found.map((f) => `${f.path}: ${f.hex}`).join("\n");
}

export function FigmaVariableImporter() {
  const [raw, setRaw] = useState('{\n  "color/brand": { "r": 0.15, "g": 0.35, "b": 0.92 }\n}');
  const out = useMemo(() => figmaColorsFromJson(raw), [raw]);
  return (
    <div className="grid gap-4">
      <p className="text-sm text-[var(--text-secondary)]">Paste Figma / variables JSON. Extracts hex paths and 0–1 RGB objects.</p>
      <ToolInput label="JSON" value={raw} onChange={setRaw} minHeight={180} />
      <ToolOutput value={out} />
    </div>
  );
}

export function ColorBlindnessSimulator() {
  const [mode, setMode] = useState<BlindMode>("deuteranopia");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sourceRef = useRef<HTMLImageElement | null>(null);
  const [err, setErr] = useState("");
  const apply = useCallback(() => {
    const canvas = canvasRef.current;
    const img = sourceRef.current;
    if (!canvas || !img?.complete) {
      return;
    }
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const max = 640;
    const scale = Math.min(1, max / Math.max(w, h));
    const cw = Math.round(w * scale);
    const ch = Math.round(h * scale);
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.drawImage(img, 0, 0, cw, ch);
    const id = ctx.getImageData(0, 0, cw, ch);
    if (mode !== "off") {
      applyColorBlindness(id, mode);
    }
    ctx.putImageData(id, 0, 0);
  }, [mode]);

  const onFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (!f?.type.startsWith("image/")) {
        setErr("Choose an image.");
        return;
      }
      setErr("");
      const img = new Image();
      const url = URL.createObjectURL(f);
      img.onload = () => {
        sourceRef.current = img;
        URL.revokeObjectURL(url);
        apply();
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        setErr("Load failed.");
      };
      img.src = url;
    },
    [apply]
  );

  useEffect(() => {
    apply();
  }, [apply]);

  return (
    <div className="grid gap-4">
      <input type="file" accept="image/*" onChange={onFile} className="text-sm" />
      <label className="text-sm">
        Simulation
        <select
          className="ml-2 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1"
          value={mode}
          onChange={(e) => setMode(e.target.value as BlindMode)}
        >
          <option value="off">None (original)</option>
          <option value="protanopia">Protanopia</option>
          <option value="deuteranopia">Deuteranopia</option>
          <option value="tritanopia">Tritanopia</option>
        </select>
      </label>
      {err ? <p className="text-sm text-red-500">{err}</p> : null}
      <canvas ref={canvasRef} className="max-w-full rounded-lg border border-[var(--border-color)]" />
    </div>
  );
}
