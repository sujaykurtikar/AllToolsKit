"use client";

import { useMemo, useState } from "react";

import { ToolInput } from "@/components/tool/ToolInput";
import { ToolOutput } from "@/components/tool/ToolOutput";
import { tailwindPalette } from "@/data/tailwind-palette";
import {
  contrastRatio,
  hslToRgb,
  parseHex,
  rgbToHex,
  rgbToHsl,
  type Rgb
} from "@/lib/color-utils";

export function ColorSection({ slug }: { slug: string }) {
  switch (slug) {
    case "color-converter":
      return <ColorConv />;
    case "color-palette":
      return <ColorPal />;
    case "gradient-generator":
      return <GradGen />;
    case "contrast-checker":
      return <Contrast />;
    case "tailwind-colors":
      return <TwColors />;
    default:
      return null;
  }
}

function ColorConv() {
  const [input, setInput] = useState("#1a56db");
  const rgb = useMemo(() => {
    const h = parseHex(input);
    if (h) {
      return h;
    }
    const m = input.match(/rgba?\(([^)]+)\)/i);
    if (m) {
      const [r, g, b] = m[1].split(",").map((x) => Number(x.trim()));
      if ([r, g, b].every((n) => Number.isFinite(n))) {
        return { r, g, b };
      }
    }
    return parseHex("#1a56db") as Rgb;
  }, [input]);
  const hsl = useMemo(() => rgbToHsl(rgb), [rgb]);
  const out = useMemo(() => {
    const hex = rgbToHex(rgb);
    const { h, s, l } = hsl;
    return [`HEX: ${hex}`, `RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}`, `HSL: ${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}%`].join("\n");
  }, [rgb, hsl]);
  return (
    <div className="grid gap-4">
      <ToolInput value={input} onChange={setInput} placeholder="#RRGGBB or rgb()" />
      <div className="h-24 rounded-lg border" style={{ background: rgbToHex(rgb) }} />
      <ToolOutput value={out} />
    </div>
  );
}

function ColorPal() {
  const [base, setBase] = useState("#3b82f6");
  const rgb = useMemo(() => parseHex(base) ?? { r: 59, g: 130, b: 246 }, [base]);
  const comps = useMemo(() => {
    const { h, s, l } = rgbToHsl(rgb);
    const complementary = hslToRgb((h + 180) % 360, s, l);
    const analogous = [h - 30, h + 30].map((x) => hslToRgb((x + 360) % 360, s, l));
    return { complementary, analogous };
  }, [rgb]);
  return (
    <div className="grid gap-4">
      <ToolInput value={base} onChange={setBase} />
      <div className="flex gap-2">
        <div className="h-16 flex-1 rounded" style={{ background: rgbToHex(comps.complementary) }} />
        {comps.analogous.map((c, i) => (
          <div key={i} className="h-16 flex-1 rounded" style={{ background: rgbToHex(c) }} />
        ))}
      </div>
    </div>
  );
}

function GradGen() {
  const [a, setA] = useState("#1a56db");
  const [b, setB] = useState("#e6f1fb");
  const [angle, setAngle] = useState(90);
  const css = useMemo(
    () => `background: linear-gradient(${angle}deg, ${a}, ${b});`,
    [a, b, angle]
  );
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-4">
        <label className="text-sm">
          From
          <input type="color" value={a} onChange={(e) => setA(e.target.value)} />
        </label>
        <label className="text-sm">
          To
          <input type="color" value={b} onChange={(e) => setB(e.target.value)} />
        </label>
        <label className="text-sm">
          Angle
          <input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(Number(e.target.value))} />
        </label>
      </div>
      <div className="h-32 w-full rounded-lg border" style={{ background: `linear-gradient(${angle}deg, ${a}, ${b})` }} />
      <ToolOutput value={css} />
    </div>
  );
}

function Contrast() {
  const [fg, setFg] = useState("#111827");
  const [bg, setBg] = useState("#ffffff");
  const ratio = useMemo(() => {
    const a = parseHex(fg) ?? { r: 17, g: 24, b: 39 };
    const b = parseHex(bg) ?? { r: 255, g: 255, b: 255 };
    return contrastRatio(a, b);
  }, [fg, bg]);
  const aa = ratio >= 4.5;
  const aaa = ratio >= 7;
  return (
    <div className="grid gap-4">
      <div className="flex gap-4">
        <label className="text-sm">
          Text
          <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} />
        </label>
        <label className="text-sm">
          Background
          <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} />
        </label>
      </div>
      <div className="rounded-lg border p-6" style={{ background: bg, color: fg }}>
        Sample text for contrast preview
      </div>
      <p className="text-sm">
        Ratio: {ratio.toFixed(2)}:1 — AA {aa ? "pass" : "fail"} — AAA {aaa ? "pass" : "fail"}
      </p>
    </div>
  );
}

function TwColors() {
  const [q, setQ] = useState("");
  const [mode, setMode] = useState<"class" | "hex">("class");
  const filtered = useMemo(() => {
    return Object.entries(tailwindPalette).filter(([name]) => name.includes(q.toLowerCase()));
  }, [q]);
  return (
    <div className="grid gap-4">
      <input className="rounded border px-3 py-2" placeholder="Search color" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="flex gap-2">
        <button type="button" className={mode === "class" ? "font-bold" : ""} onClick={() => setMode("class")}>
          Class
        </button>
        <button type="button" className={mode === "hex" ? "font-bold" : ""} onClick={() => setMode("hex")}>
          Hex
        </button>
      </div>
      <div className="grid max-h-96 grid-cols-2 gap-2 overflow-auto sm:grid-cols-4">
        {filtered.flatMap(([name, shades]) =>
          Object.entries(shades).map(([shade, hex]) => (
            <button
              key={`${name}-${shade}`}
              type="button"
              className="h-10 rounded border text-left text-xs"
              style={{ background: hex, color: Number(shade) >= 500 ? "#fff" : "#000" }}
              onClick={() =>
                void navigator.clipboard.writeText(mode === "class" ? `${name}-${shade}` : hex)
              }
            >
              {name}-{shade}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
