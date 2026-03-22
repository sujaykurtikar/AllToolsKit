"use client";

import { useMemo, useState } from "react";

import { ToolInput } from "@/components/tool/ToolInput";
import { ToolOutput } from "@/components/tool/ToolOutput";

const PAIRS: { heading: string; body: string }[] = [
  { heading: "Playfair Display", body: "Source Sans 3" },
  { heading: "Merriweather", body: "Open Sans" },
  { heading: "Space Grotesk", body: "Inter" },
  { heading: "Fraunces", body: "Nunito Sans" }
];

export function FontPairingPreview() {
  const [pairIdx, setPairIdx] = useState(0);
  const [text, setText] = useState("The quick brown fox jumps over the lazy dog.");
  const pair = PAIRS[pairIdx];
  const href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(pair.heading)}:wght@600&family=${encodeURIComponent(pair.body)}:wght@400;600&display=swap`;
  return (
    <div className="grid gap-4">
      <link href={href} rel="stylesheet" />
      <label className="text-sm">
        Pairing
        <select
          className="ml-2 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1"
          value={pairIdx}
          onChange={(e) => setPairIdx(Number(e.target.value))}
        >
          {PAIRS.map((p, i) => (
            <option key={p.heading} value={i}>
              {p.heading} / {p.body}
            </option>
          ))}
        </select>
      </label>
      <ToolInput label="Sample" value={text} onChange={setText} minHeight={80} />
      <div className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
        <p className="text-2xl font-semibold" style={{ fontFamily: `"${pair.heading}", serif` }}>
          {text}
        </p>
        <p className="mt-3 text-base leading-relaxed text-[var(--text-secondary)]" style={{ fontFamily: `"${pair.body}", sans-serif` }}>
          {text}
        </p>
      </div>
      <ToolOutput value={`@import url('${href}');\n\n.heading { font-family: "${pair.heading}", serif; }\n.body { font-family: "${pair.body}", sans-serif; }`} />
    </div>
  );
}

export function LetterSpacingConverter() {
  const [tracking, setTracking] = useState("50");
  const [fontPx, setFontPx] = useState("16");
  const [mode, setMode] = useState<"figma" | "pt">("figma");
  const out = useMemo(() => {
    const fs = Number.parseFloat(fontPx);
    const tr = Number.parseFloat(tracking);
    if (!Number.isFinite(fs) || fs <= 0 || !Number.isFinite(tr)) {
      return "";
    }
    if (mode === "figma") {
      const em = tr / 1000;
      return `letter-spacing: ${em}em; /* Figma tracking ${tr} (÷1000) */`;
    }
    const px = (tr * 96) / 72;
    const em = px / fs;
    return `letter-spacing: ${em.toFixed(4)}em; /* ${tr}pt at ${fs}px */`;
  }, [tracking, fontPx, mode]);
  return (
    <div className="grid gap-4">
      <label className="text-sm">
        Mode
        <select className="ml-2 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={mode} onChange={(e) => setMode(e.target.value as "figma" | "pt")}>
          <option value="figma">Figma tracking (÷1000 em)</option>
          <option value="pt">Points → em</option>
        </select>
      </label>
      <div className="flex flex-wrap gap-4">
        <label className="text-sm">
          {mode === "figma" ? "Tracking" : "Tracking (pt)"}
          <input className="ml-2 w-24 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={tracking} onChange={(e) => setTracking(e.target.value)} />
        </label>
        <label className="text-sm">
          Font size (px)
          <input className="ml-2 w-24 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={fontPx} onChange={(e) => setFontPx(e.target.value)} />
        </label>
      </div>
      <ToolOutput value={out} />
    </div>
  );
}

export function FluidTypography() {
  const [minPx, setMinPx] = useState("16");
  const [maxPx, setMaxPx] = useState("24");
  const [minVw, setMinVw] = useState("375");
  const [maxVw, setMaxVw] = useState("1200");
  const out = useMemo(() => {
    const minF = Number.parseFloat(minPx);
    const maxF = Number.parseFloat(maxPx);
    const vw1 = Number.parseFloat(minVw);
    const vw2 = Number.parseFloat(maxVw);
    if (![minF, maxF, vw1, vw2].every(Number.isFinite) || vw2 <= vw1 || minF <= 0) {
      return "";
    }
    return `font-size: clamp(${minF}px, calc(${minF}px + (${maxF} - ${minF}) * ((100vw - ${vw1}px) / (${vw2} - ${vw1}))), ${maxF}px);`;
  }, [minPx, maxPx, minVw, maxVw]);
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <label className="text-sm">
          Min (px)
          <input className="mt-1 w-full rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={minPx} onChange={(e) => setMinPx(e.target.value)} />
        </label>
        <label className="text-sm">
          Max (px)
          <input className="mt-1 w-full rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={maxPx} onChange={(e) => setMaxPx(e.target.value)} />
        </label>
        <label className="text-sm">
          Min vw
          <input className="mt-1 w-full rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={minVw} onChange={(e) => setMinVw(e.target.value)} />
        </label>
        <label className="text-sm">
          Max vw
          <input className="mt-1 w-full rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={maxVw} onChange={(e) => setMaxVw(e.target.value)} />
        </label>
      </div>
      <ToolOutput value={out} />
    </div>
  );
}

export function GoogleFontsCssGenerator() {
  const [family, setFamily] = useState("Inter");
  const [weights, setWeights] = useState("400;500;600;700");
  const href = useMemo(() => {
    const w = weights.replace(/\s/g, "").replace(/;/g, ";");
    const f = family.replace(/\s+/g, "+");
    return `https://fonts.googleapis.com/css2?family=${f}:wght@${w}&display=swap`;
  }, [family, weights]);
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-4">
        <label className="text-sm">
          Family
          <input className="ml-2 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={family} onChange={(e) => setFamily(e.target.value)} />
        </label>
        <label className="text-sm">
          Weights (semicolon-separated)
          <input className="ml-2 w-48 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1 font-mono text-xs" value={weights} onChange={(e) => setWeights(e.target.value)} />
        </label>
      </div>
      <ToolOutput
        value={[
          `<link rel="preconnect" href="https://fonts.googleapis.com" />`,
          `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />`,
          `<link href="${href}" rel="stylesheet" />`,
          "",
          `/* @import */`,
          `@import url('${href}');`
        ].join("\n")}
      />
    </div>
  );
}

const STACKS: { name: string; value: string }[] = [
  { name: "System UI", value: 'system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' },
  { name: "Serif classic", value: 'Georgia, "Times New Roman", Times, serif' },
  { name: "Mono code", value: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace' }
];

export function CssFontStackGenerator() {
  const [idx, setIdx] = useState(0);
  const [custom, setCustom] = useState("");
  const stack = custom.trim() || STACKS[idx].value;
  return (
    <div className="grid gap-4">
      <label className="text-sm">
        Preset
        <select className="ml-2 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={idx} onChange={(e) => setIdx(Number(e.target.value))}>
          {STACKS.map((s, i) => (
            <option key={s.name} value={i}>
              {s.name}
            </option>
          ))}
        </select>
      </label>
      <ToolInput label="Override stack (optional)" value={custom} onChange={setCustom} minHeight={80} placeholder="Leave empty to use preset" />
      <p className="rounded-lg border border-[var(--border-color)] p-4 text-lg" style={{ fontFamily: stack }}>
        The quick brown fox…
      </p>
      <ToolOutput value={`font-family: ${stack};`} />
    </div>
  );
}

export function VariableFontTester() {
  const [wght, setWght] = useState("400");
  const [wdth, setWdth] = useState("100");
  const href = "https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght,wdth@8..144,100..1000,25..151&display=swap";
  return (
    <div className="grid gap-4">
      <link href={href} rel="stylesheet" />
      <div className="flex flex-wrap gap-4">
        <label className="text-sm">
          Weight (wght)
          <input type="range" min="100" max="1000" className="ml-2" value={wght} onChange={(e) => setWght(e.target.value)} />
          <span className="ml-1 tabular-nums">{wght}</span>
        </label>
        <label className="text-sm">
          Width (wdth)
          <input type="range" min="25" max="151" className="ml-2" value={wdth} onChange={(e) => setWdth(e.target.value)} />
          <span className="ml-1 tabular-nums">{wdth}</span>
        </label>
      </div>
      <p
        className="rounded-lg border border-[var(--border-color)] p-6 text-2xl"
        style={{
          fontFamily: '"Roboto Flex", sans-serif',
          fontVariationSettings: `"wght" ${wght}, "wdth" ${wdth}`
        }}
      >
        Variable font axis preview — Roboto Flex
      </p>
      <ToolOutput value={`font-family: "Roboto Flex", sans-serif;\nfont-variation-settings: "wght" ${wght}, "wdth" ${wdth};`} />
    </div>
  );
}

export function ResponsiveFontPreviewer() {
  const [text, setText] = useState("Responsive preview");
  return (
    <div className="grid gap-4">
      <ToolInput label="Text" value={text} onChange={setText} minHeight={60} />
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-[var(--border-color)] p-3" style={{ maxWidth: 375 }}>
          <p className="mb-2 text-[10px] uppercase text-[var(--text-tertiary)]">~375px</p>
          <p className="text-sm">{text}</p>
        </div>
        <div className="rounded-lg border border-[var(--border-color)] p-3" style={{ maxWidth: 768 }}>
          <p className="mb-2 text-[10px] uppercase text-[var(--text-tertiary)]">~768px</p>
          <p className="text-base">{text}</p>
        </div>
        <div className="rounded-lg border border-[var(--border-color)] p-3">
          <p className="mb-2 text-[10px] uppercase text-[var(--text-tertiary)]">Desktop</p>
          <p className="text-lg">{text}</p>
        </div>
      </div>
    </div>
  );
}
