"use client";

import { useMemo, useState } from "react";

import { ToolInput } from "@/components/tool/ToolInput";
import { ToolOutput } from "@/components/tool/ToolOutput";

export function CssUnitsConverter() {
  const [val, setVal] = useState("16");
  const [unit, setUnit] = useState<"px" | "rem" | "em" | "pt" | "vw">("px");
  const [root, setRoot] = useState("16");
  const [vp, setVp] = useState("375");
  const out = useMemo(() => {
    const r = Number.parseFloat(root);
    const v = Number.parseFloat(vp);
    const n = Number.parseFloat(val);
    if (!Number.isFinite(n) || !Number.isFinite(r) || r <= 0) {
      return "";
    }
    const px =
      unit === "px"
        ? n
        : unit === "rem" || unit === "em"
          ? n * r
          : unit === "pt"
            ? (n * 96) / 72
            : (n / 100) * v;
    if (!Number.isFinite(px)) {
      return "";
    }
    return [
      `≈ ${px.toFixed(4)} px`,
      `≈ ${(px / r).toFixed(4)} rem (root ${r}px)`,
      `≈ ${(px / r).toFixed(4)} em (same context)`,
      `≈ ${((px * 72) / 96).toFixed(4)} pt`,
      v > 0 ? `≈ ${((px / v) * 100).toFixed(4)} vw (viewport ${v}px wide)` : ""
    ]
      .filter(Boolean)
      .join("\n");
  }, [val, unit, root, vp]);
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-4">
        <label className="text-sm">
          Value
          <input className="ml-2 w-24 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={val} onChange={(e) => setVal(e.target.value)} />
        </label>
        <label className="text-sm">
          Unit
          <select className="ml-2 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={unit} onChange={(e) => setUnit(e.target.value as typeof unit)}>
            <option value="px">px</option>
            <option value="rem">rem</option>
            <option value="em">em</option>
            <option value="pt">pt</option>
            <option value="vw">vw</option>
          </select>
        </label>
        <label className="text-sm">
          Root px
          <input className="ml-2 w-20 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={root} onChange={(e) => setRoot(e.target.value)} />
        </label>
        <label className="text-sm">
          Viewport px (for vw)
          <input className="ml-2 w-20 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={vp} onChange={(e) => setVp(e.target.value)} />
        </label>
      </div>
      <ToolOutput value={out} />
    </div>
  );
}

export function FigmaToCss() {
  const [raw, setRaw] = useState("box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);\nborder-radius: 8px;");
  const out = useMemo(() => {
    return raw
      .split("\n")
      .map((line) => line.replace(/\s*:\s*/, ": ").replace(/;\s*$/, ";").trim())
      .filter(Boolean)
      .join("\n");
  }, [raw]);
  return (
    <div className="grid gap-4">
      <p className="text-sm text-[var(--text-secondary)]">Paste Figma / inspect snippets; this normalizes spacing around colons and semicolons.</p>
      <ToolInput label="Pasted CSS" value={raw} onChange={setRaw} minHeight={140} />
      <ToolOutput value={out} />
    </div>
  );
}

export function TailwindConfigGenerator() {
  const [primary, setPrimary] = useState("#2563eb");
  const [spacing, setSpacing] = useState("4");
  const out = useMemo(
    () =>
      `/** tailwind.config.js */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '${primary}',
          foreground: '#ffffff',
        },
      },
      spacing: {
        '18': '${Number.parseFloat(spacing || "4") * 4.5}px',
      },
    },
  },
};`,
    [primary, spacing]
  );
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-4">
        <label className="text-sm">
          Brand
          <input type="color" className="ml-2" value={primary.slice(0, 7)} onChange={(e) => setPrimary(e.target.value)} />
        </label>
        <label className="text-sm">
          Base spacing (px)
          <input className="ml-2 w-20 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={spacing} onChange={(e) => setSpacing(e.target.value)} />
        </label>
      </div>
      <ToolOutput value={out} />
    </div>
  );
}

export function CssAnimationGenerator() {
  const [name, setName] = useState("fade-in");
  const [dur, setDur] = useState("0.6");
  const [from, setFrom] = useState("opacity: 0");
  const [to, setTo] = useState("opacity: 1");
  const out = useMemo(
    () =>
      `@keyframes ${name} {
  from { ${from}; }
  to { ${to}; }
}

.animate-${name} {
  animation: ${name} ${dur}s ease forwards;
}`,
    [name, dur, from, to]
  );
  return (
    <div className="grid gap-4">
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-sm">
          Name
          <input className="mt-1 w-full rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={name} onChange={(e) => setName(e.target.value.replace(/\s/g, "-"))} />
        </label>
        <label className="text-sm">
          Duration (s)
          <input className="mt-1 w-full rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={dur} onChange={(e) => setDur(e.target.value)} />
        </label>
        <label className="text-sm sm:col-span-2">
          From
          <input className="mt-1 w-full rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label className="text-sm sm:col-span-2">
          To
          <input className="mt-1 w-full rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
      </div>
      <div className="rounded-lg border border-[var(--border-color)] p-8">
        <div className="h-12 w-12 rounded bg-[var(--blue-primary)]" style={{ animation: `${name} ${dur}s ease forwards` }} />
        <style>{`@keyframes ${name} { from { ${from}; } to { ${to}; } }`}</style>
      </div>
      <ToolOutput value={out} />
    </div>
  );
}

export function CssFilterGenerator() {
  const [blur, setBlur] = useState("0");
  const [bright, setBright] = useState("100");
  const [contrast, setContrast] = useState("100");
  const [hue, setHue] = useState("0");
  const out = useMemo(() => {
    const parts = [
      blur !== "0" ? `blur(${blur}px)` : "",
      bright !== "100" ? `brightness(${Number(bright) / 100})` : "",
      contrast !== "100" ? `contrast(${Number(contrast) / 100})` : "",
      hue !== "0" ? `hue-rotate(${hue}deg)` : ""
    ].filter(Boolean);
    const f = parts.length ? `filter: ${parts.join(" ")};` : "filter: none;";
    return f;
  }, [blur, bright, contrast, hue]);
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <label className="text-sm">
          blur (px)
          <input type="number" className="mt-1 w-full rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={blur} onChange={(e) => setBlur(e.target.value)} />
        </label>
        <label className="text-sm">
          brightness (%)
          <input type="number" className="mt-1 w-full rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={bright} onChange={(e) => setBright(e.target.value)} />
        </label>
        <label className="text-sm">
          contrast (%)
          <input type="number" className="mt-1 w-full rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={contrast} onChange={(e) => setContrast(e.target.value)} />
        </label>
        <label className="text-sm">
          hue (deg)
          <input type="number" className="mt-1 w-full rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={hue} onChange={(e) => setHue(e.target.value)} />
        </label>
      </div>
      <div className="flex justify-center rounded-lg border border-[var(--border-color)] p-8">
        <div
          className="h-24 w-24 rounded-lg bg-gradient-to-br from-amber-400 to-rose-500"
          style={{ filter: out.replace(/^filter:\s*/, "").replace(/;$/, "") }}
        />
      </div>
      <ToolOutput value={out} />
    </div>
  );
}

export function SvgPathEditor() {
  const [d, setD] = useState("M10 80 Q 95 10 180 80 T 350 80");
  return (
    <div className="grid gap-4">
      <ToolInput label='Path "d" attribute' value={d} onChange={setD} minHeight={80} />
      <svg viewBox="0 0 400 120" className="w-full max-w-lg rounded-lg border border-[var(--border-color)] bg-white">
        <path d={d} fill="none" stroke="#1a56db" strokeWidth="2" />
      </svg>
    </div>
  );
}

export function ClipPathGenerator() {
  const [shape, setShape] = useState<"inset" | "circle" | "polygon">("polygon");
  const [poly, setPoly] = useState("50% 0%, 100% 100%, 0% 100%");
  const clip = useMemo(() => {
    if (shape === "polygon") {
      return `polygon(${poly})`;
    }
    if (shape === "circle") {
      return "circle(40% at 50% 50%)";
    }
    return "inset(10% 10% 10% 10% round 12px)";
  }, [shape, poly]);
  const out = useMemo(() => `clip-path: ${clip};`, [clip]);
  return (
    <div className="grid gap-4">
      <label className="text-sm">
        Shape
        <select className="ml-2 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={shape} onChange={(e) => setShape(e.target.value as typeof shape)}>
          <option value="polygon">polygon</option>
          <option value="circle">circle</option>
          <option value="inset">inset</option>
        </select>
      </label>
      {shape === "polygon" ? <ToolInput label="Points" value={poly} onChange={setPoly} minHeight={60} /> : null}
      <div className="mx-auto h-40 w-64 rounded-lg border border-[var(--border-color)] bg-[var(--blue-light)]" style={{ clipPath: clip }} />
      <ToolOutput value={out} />
    </div>
  );
}

export function CssVariableConverter() {
  const [css, setCss] = useState(".a { color: #2563eb; }\n.b { color: #2563eb; }");
  const [token, setToken] = useState("--brand");
  const out = useMemo(() => {
    const hex = css.match(/#[0-9a-f]{6}\b/i)?.[0];
    if (!hex) {
      return "No #RRGGBB found.";
    }
    let n = 0;
    const replaced = css.replaceAll(hex, () => {
      n++;
      return `var(${token})`;
    });
    return [`:root { ${token}: ${hex}; }`, "", replaced, "", `/* Replaced ${n} occurrence(s) of ${hex} */`].join("\n");
  }, [css, token]);
  return (
    <div className="grid gap-4">
      <label className="text-sm">
        Token name
        <input className="ml-2 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1 font-mono" value={token} onChange={(e) => setToken(e.target.value)} />
      </label>
      <ToolInput label="CSS" value={css} onChange={setCss} minHeight={120} />
      <ToolOutput value={out} />
    </div>
  );
}
