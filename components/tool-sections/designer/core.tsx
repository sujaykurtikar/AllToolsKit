"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { ToolOutput } from "@/components/tool/ToolOutput";

export function PxRemEmConverter() {
  const [pxVal, setPxVal] = useState("16");
  const [rootPx, setRootPx] = useState("16");
  const out = useMemo(() => {
    const px = Number.parseFloat(pxVal);
    const root = Number.parseFloat(rootPx);
    if (!Number.isFinite(px) || !Number.isFinite(root) || root <= 0) {
      return "";
    }
    const rem = px / root;
    const em = px / root;
    return [
      `rem (÷ ${root}px root): ${rem.toFixed(4)}rem`,
      `em (÷ ${root}px context): ${em.toFixed(4)}em`,
      `px: ${px}px`
    ].join("\n");
  }, [pxVal, rootPx]);
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-[var(--text-secondary)]">Length (px)</span>
          <input
            type="number"
            className="min-w-[120px] rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-2"
            value={pxVal}
            onChange={(e) => setPxVal(e.target.value)}
            min={0}
            step="any"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-[var(--text-secondary)]">Root / context (px)</span>
          <input
            type="number"
            className="min-w-[120px] rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-2"
            value={rootPx}
            onChange={(e) => setRootPx(e.target.value)}
            min={1}
            step="any"
          />
        </label>
      </div>
      <ToolOutput value={out} />
    </div>
  );
}

export function TypeScaleGenerator() {
  const [base, setBase] = useState("16");
  const [ratio, setRatio] = useState("1.25");
  const [steps, setSteps] = useState("6");
  const out = useMemo(() => {
    const b = Number.parseFloat(base);
    const r = Number.parseFloat(ratio);
    const n = Number.parseInt(steps, 10);
    if (!Number.isFinite(b) || b <= 0 || !Number.isFinite(r) || r <= 0 || !Number.isFinite(n) || n < 1 || n > 24) {
      return "";
    }
    const lines: string[] = [];
    for (let i = 0; i < n; i++) {
      const px = b * Math.pow(r, i);
      const rem = px / 16;
      lines.push(`--step-${i}: ${rem.toFixed(4)}rem; /* ${px.toFixed(2)}px */`);
    }
    return lines.join("\n");
  }, [base, ratio, steps]);
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-[var(--text-secondary)]">Base (px)</span>
          <input
            type="number"
            className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-2"
            value={base}
            onChange={(e) => setBase(e.target.value)}
            min={1}
            step="any"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-[var(--text-secondary)]">Ratio</span>
          <select
            className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-2"
            value={ratio}
            onChange={(e) => setRatio(e.target.value)}
          >
            <option value="1.067">Minor second (1.067)</option>
            <option value="1.125">Major second (1.125)</option>
            <option value="1.2">Minor third (1.2)</option>
            <option value="1.25">Major third (1.25)</option>
            <option value="1.333">Perfect fourth (1.333)</option>
            <option value="1.414">Aug fourth (1.414)</option>
            <option value="1.5">Perfect fifth (1.5)</option>
            <option value="1.618">Golden (1.618)</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-[var(--text-secondary)]">Steps</span>
          <input
            type="number"
            className="w-24 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-2"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            min={1}
            max={24}
          />
        </label>
      </div>
      <p className="text-xs text-[var(--text-tertiary)]">Outputs CSS custom properties assuming a 16px root for the rem comment.</p>
      <ToolOutput value={out} />
    </div>
  );
}

export function SpacingScaleGenerator() {
  const [basePx, setBasePx] = useState("4");
  const [factor, setFactor] = useState("2");
  const [count, setCount] = useState("8");
  const out = useMemo(() => {
    const b = Number.parseFloat(basePx);
    const f = Number.parseFloat(factor);
    const n = Number.parseInt(count, 10);
    if (!Number.isFinite(b) || b <= 0 || !Number.isFinite(f) || f <= 0 || !Number.isFinite(n) || n < 1 || n > 32) {
      return "";
    }
    const lines: string[] = [];
    let cur = b;
    for (let i = 0; i < n; i++) {
      const rem = cur / 16;
      lines.push(`--space-${i + 1}: ${rem.toFixed(4)}rem; /* ${cur.toFixed(2)}px */`);
      cur *= f;
    }
    return lines.join("\n");
  }, [basePx, factor, count]);
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-[var(--text-secondary)]">Base (px)</span>
          <input
            type="number"
            className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-2"
            value={basePx}
            onChange={(e) => setBasePx(e.target.value)}
            min={0.25}
            step="any"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-[var(--text-secondary)]">Multiplied by each step</span>
          <input
            type="number"
            className="w-28 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-2"
            value={factor}
            onChange={(e) => setFactor(e.target.value)}
            min={1.01}
            step="any"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-[var(--text-secondary)]">Steps</span>
          <input
            type="number"
            className="w-24 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-2"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            min={1}
            max={32}
          />
        </label>
      </div>
      <ToolOutput value={out} />
    </div>
  );
}

export function BoxShadowGenerator() {
  const [x, setX] = useState("0");
  const [y, setY] = useState("4");
  const [blur, setBlur] = useState("12");
  const [spread, setSpread] = useState("0");
  const [hex, setHex] = useState("#000000");
  const [opacityPct, setOpacityPct] = useState("25");
  const [inset, setInset] = useState(false);
  const rgba = useMemo(() => {
    const h = hex.replace("#", "");
    if (h.length !== 6) {
      return "rgba(0,0,0,0.25)";
    }
    const r = Number.parseInt(h.slice(0, 2), 16);
    const g = Number.parseInt(h.slice(2, 4), 16);
    const b = Number.parseInt(h.slice(4, 6), 16);
    const a = Number.parseFloat(opacityPct) / 100;
    const alpha = Number.isFinite(a) ? Math.min(1, Math.max(0, a)) : 0.25;
    return `rgba(${r},${g},${b},${alpha})`;
  }, [hex, opacityPct]);
  const css = useMemo(() => {
    const ins = inset ? "inset " : "";
    return `box-shadow: ${ins}${x}px ${y}px ${blur}px ${spread}px ${rgba};`;
  }, [x, y, blur, spread, rgba, inset]);
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-3">
        {(
          [
            ["X", x, setX],
            ["Y", y, setY],
            ["Blur", blur, setBlur],
            ["Spread", spread, setSpread]
          ] as const
        ).map(([label, val, set]) => (
          <label key={label} className="flex flex-col gap-1 text-sm">
            <span className="text-[var(--text-secondary)]">{label}</span>
            <input
              type="number"
              className="w-20 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1.5"
              value={val}
              onChange={(e) => set(e.target.value)}
            />
          </label>
        ))}
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-[var(--text-secondary)]">Color</span>
          <input type="color" value={hex} onChange={(e) => setHex(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-[var(--text-secondary)]">Opacity %</span>
          <input
            type="number"
            className="w-20 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1.5"
            value={opacityPct}
            onChange={(e) => setOpacityPct(e.target.value)}
            min={0}
            max={100}
          />
        </label>
        <label className="flex items-end gap-2 pb-1 text-sm">
          <input type="checkbox" checked={inset} onChange={(e) => setInset(e.target.checked)} />
          Inset
        </label>
      </div>
      <div
        className="h-28 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)]"
        style={{ boxShadow: `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${rgba}` }}
      />
      <ToolOutput value={css} />
    </div>
  );
}

function BezierPreview({ bezier }: { bezier: string }) {
  const [end, setEnd] = useState(false);
  useEffect(() => {
    setEnd(false);
    const t = window.requestAnimationFrame(() => setEnd(true));
    return () => window.cancelAnimationFrame(t);
  }, [bezier]);
  const ease = bezier === "linear" ? "linear" : bezier;
  return (
    <div className="flex h-14 w-full max-w-md items-center pl-1">
      <div
        className="h-10 w-10 shrink-0 rounded-lg bg-[var(--blue-primary)] shadow-md will-change-transform"
        style={{
          transform: end ? "translateX(220px)" : "translateX(0)",
          transition: `transform 1s ${ease}`
        }}
      />
    </div>
  );
}

export function CubicBezierEditor() {
  const [x1, setX1] = useState("0.42");
  const [y1, setY1] = useState("0");
  const [x2, setX2] = useState("1");
  const [y2, setY2] = useState("1");
  const [run, setRun] = useState(0);
  const bezier = useMemo(() => {
    const nums = [x1, y1, x2, y2].map((s) => Number.parseFloat(s));
    if (nums.some((n) => Number.isNaN(n))) {
      return "linear";
    }
    const [a, b, c, d] = nums;
    if (a < 0 || a > 1 || c < 0 || c > 1) {
      return "linear";
    }
    return `cubic-bezier(${a}, ${b}, ${c}, ${d})`;
  }, [x1, y1, x2, y2]);

  const css = useMemo(
    () =>
      [
        `transition-timing-function: ${bezier};`,
        `/* shorthand example */`,
        `transition: transform 1s ${bezier};`
      ].join("\n"),
    [bezier]
  );

  const replay = useCallback(() => {
    setRun((k) => k + 1);
  }, []);

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(
          [
            ["x1", x1, setX1],
            ["y1", y1, setY1],
            ["x2", x2, setX2],
            ["y2", y2, setY2]
          ] as const
        ).map(([name, val, set]) => (
          <label key={name} className="flex flex-col gap-1 text-sm">
            <span className="text-[var(--text-secondary)]">{name}</span>
            <input
              type="number"
              step="0.01"
              className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-2"
              value={val}
              onChange={(e) => set(e.target.value)}
            />
          </label>
        ))}
      </div>
      <p className="text-xs text-[var(--text-tertiary)]">x1 and x2 must stay between 0 and 1 for valid CSS easing.</p>
      <div className="relative overflow-hidden rounded-lg border border-[var(--border-color)] bg-[var(--bg-tertiary)] py-6 pl-4">
        <BezierPreview key={run} bezier={bezier} />
        <button
          type="button"
          onClick={replay}
          className="absolute right-3 top-3 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1 text-xs text-[var(--text-primary)] hover:border-[var(--blue-primary)]"
        >
          Replay
        </button>
      </div>
      <ToolOutput value={css} />
    </div>
  );
}

export function LineHeightCalculator() {
  const [fontPx, setFontPx] = useState("16");
  const [unitless, setUnitless] = useState("1.5");
  const out = useMemo(() => {
    const fs = Number.parseFloat(fontPx);
    const lh = Number.parseFloat(unitless);
    if (!Number.isFinite(fs) || fs <= 0 || !Number.isFinite(lh) || lh <= 0) {
      return "";
    }
    const px = fs * lh;
    return [
      `line-height (unitless): ${lh}`,
      `line-height (px): ${px.toFixed(2)}px`,
      `font-size: ${fs}px`
    ].join("\n");
  }, [fontPx, unitless]);
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-[var(--text-secondary)]">Font size (px)</span>
          <input
            type="number"
            className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-2"
            value={fontPx}
            onChange={(e) => setFontPx(e.target.value)}
            min={1}
            step="any"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-[var(--text-secondary)]">Line height (unitless)</span>
          <input
            type="number"
            className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-2"
            value={unitless}
            onChange={(e) => setUnitless(e.target.value)}
            min={0.5}
            step="any"
          />
        </label>
      </div>
      <ToolOutput value={out} />
    </div>
  );
}
