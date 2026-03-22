"use client";

import { useMemo, useState } from "react";

import { ToolInput } from "@/components/tool/ToolInput";
import { ToolOutput } from "@/components/tool/ToolOutput";

export function CssGridGenerator() {
  const [cols, setCols] = useState("3");
  const [rows, setRows] = useState("auto");
  const [gap, setGap] = useState("1rem");
  const colN = Math.max(1, Math.min(12, Number.parseInt(cols, 10) || 1));
  const out = useMemo(() => {
    return [
      "display: grid;",
      `grid-template-columns: repeat(${cols}, minmax(0, 1fr));`,
      `grid-template-rows: ${rows};`,
      `gap: ${gap};`
    ].join("\n");
  }, [cols, rows, gap]);
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-4">
        <label className="text-sm">
          Columns
          <input className="ml-2 w-20 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={cols} onChange={(e) => setCols(e.target.value)} />
        </label>
        <label className="text-sm">
          Rows (CSS)
          <input className="ml-2 w-32 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={rows} onChange={(e) => setRows(e.target.value)} />
        </label>
        <label className="text-sm">
          Gap
          <input className="ml-2 w-24 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={gap} onChange={(e) => setGap(e.target.value)} />
        </label>
      </div>
      <div className="grid gap-2 rounded-lg border border-[var(--border-color)] p-2" style={{ gridTemplateColumns: `repeat(${colN}, minmax(0, 1fr))`, gap }}>
        {Array.from({ length: Math.min(9, colN * 2) }).map((_, i) => (
          <div key={i} className="h-12 rounded bg-[var(--blue-light)]" />
        ))}
      </div>
      <ToolOutput value={out} />
    </div>
  );
}

export function FlexboxPlayground() {
  const [dir, setDir] = useState("row");
  const [justify, setJustify] = useState("flex-start");
  const [align, setAlign] = useState("stretch");
  const [gap, setGap] = useState("8px");
  const out = useMemo(
    () =>
      [
        "display: flex;",
        `flex-direction: ${dir};`,
        `justify-content: ${justify};`,
        `align-items: ${align};`,
        `gap: ${gap};`
      ].join("\n"),
    [dir, justify, align, gap]
  );
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-3 text-sm">
        <label>
          direction
          <select className="ml-1 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-1" value={dir} onChange={(e) => setDir(e.target.value)}>
            <option value="row">row</option>
            <option value="row-reverse">row-reverse</option>
            <option value="column">column</option>
            <option value="column-reverse">column-reverse</option>
          </select>
        </label>
        <label>
          justify
          <select className="ml-1 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-1" value={justify} onChange={(e) => setJustify(e.target.value)}>
            <option value="flex-start">flex-start</option>
            <option value="center">center</option>
            <option value="flex-end">flex-end</option>
            <option value="space-between">space-between</option>
            <option value="space-around">space-around</option>
          </select>
        </label>
        <label>
          align
          <select className="ml-1 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-1" value={align} onChange={(e) => setAlign(e.target.value)}>
            <option value="stretch">stretch</option>
            <option value="flex-start">flex-start</option>
            <option value="center">center</option>
            <option value="flex-end">flex-end</option>
          </select>
        </label>
        <label>
          gap
          <input className="ml-1 w-16 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-1" value={gap} onChange={(e) => setGap(e.target.value)} />
        </label>
      </div>
      <div
        className="min-h-[140px] rounded-lg border border-[var(--border-color)] bg-[var(--bg-tertiary)] p-2"
        style={{
          display: "flex",
          flexDirection: dir as "row" | "row-reverse" | "column" | "column-reverse",
          justifyContent: justify,
          alignItems: align,
          gap
        }}
      >
        {[1, 2, 3].map((i) => (
          <div key={i} className="min-h-10 min-w-10 rounded bg-[var(--blue-primary)] p-2 text-center text-xs text-white">
            {i}
          </div>
        ))}
      </div>
      <ToolOutput value={out} />
    </div>
  );
}

export function BorderRadiusGenerator() {
  const [tl, setTl] = useState("8");
  const [tr, setTr] = useState("8");
  const [br, setBr] = useState("8");
  const [bl, setBl] = useState("8");
  const unit = "px";
  const out = useMemo(() => `border-radius: ${tl}${unit} ${tr}${unit} ${br}${unit} ${bl}${unit};`, [tl, tr, br, bl]);
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(
          [
            ["TL", tl, setTl],
            ["TR", tr, setTr],
            ["BR", br, setBr],
            ["BL", bl, setBl]
          ] as const
        ).map(([lab, v, set]) => (
          <label key={lab} className="text-sm">
            {lab}
            <input type="number" className="ml-1 w-full rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={v} onChange={(e) => set(e.target.value)} />
          </label>
        ))}
      </div>
      <div className="mx-auto h-32 w-48 border-2 border-[var(--border-color)] bg-[var(--card-bg)]" style={{ borderRadius: `${tl}px ${tr}px ${br}px ${bl}px` }} />
      <ToolOutput value={out} />
    </div>
  );
}

export function AspectRatioCalculator() {
  const [w, setW] = useState("16");
  const [h, setH] = useState("9");
  const [known, setKnown] = useState<"width" | "height">("width");
  const [val, setVal] = useState("1920");
  const out = useMemo(() => {
    const rw = Number.parseFloat(w);
    const rh = Number.parseFloat(h);
    const v = Number.parseFloat(val);
    if (!Number.isFinite(rw) || !Number.isFinite(rh) || rw <= 0 || rh <= 0 || !Number.isFinite(v) || v <= 0) {
      return "";
    }
    const ratio = rw / rh;
    if (known === "width") {
      const other = v / ratio;
      return [`Width: ${v}px`, `Height: ${other.toFixed(2)}px`, `aspect-ratio: ${rw} / ${rh};`].join("\n");
    }
    const other = v * ratio;
    return [`Height: ${v}px`, `Width: ${other.toFixed(2)}px`, `aspect-ratio: ${rw} / ${rh};`].join("\n");
  }, [w, h, known, val]);
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-4">
        <label className="text-sm">
          Ratio W
          <input className="ml-2 w-16 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={w} onChange={(e) => setW(e.target.value)} />
        </label>
        <label className="text-sm">
          Ratio H
          <input className="ml-2 w-16 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={h} onChange={(e) => setH(e.target.value)} />
        </label>
        <label className="text-sm">
          Known
          <select className="ml-2 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={known} onChange={(e) => setKnown(e.target.value as "width" | "height")}>
            <option value="width">width (px)</option>
            <option value="height">height (px)</option>
          </select>
        </label>
        <label className="text-sm">
          Value (px)
          <input className="ml-2 w-24 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={val} onChange={(e) => setVal(e.target.value)} />
        </label>
      </div>
      <ToolOutput value={out} />
    </div>
  );
}

export function PxToViewport() {
  const [px, setPx] = useState("16");
  const [vp, setVp] = useState("375");
  const out = useMemo(() => {
    const p = Number.parseFloat(px);
    const v = Number.parseFloat(vp);
    if (!Number.isFinite(p) || !Number.isFinite(v) || v <= 0) {
      return "";
    }
    const vw = (p / v) * 100;
    const vh = (p / v) * 100;
    return [`${vw.toFixed(4)}vw (if viewport width = ${v}px)`, `${vh.toFixed(4)}vh (if viewport height = ${v}px)`, `/* vmin/vmax depend on orientation */`].join("\n");
  }, [px, vp]);
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-4">
        <label className="text-sm">
          px
          <input className="ml-2 w-24 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={px} onChange={(e) => setPx(e.target.value)} />
        </label>
        <label className="text-sm">
          reference viewport (px)
          <input className="ml-2 w-24 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={vp} onChange={(e) => setVp(e.target.value)} />
        </label>
      </div>
      <ToolOutput value={out} />
    </div>
  );
}

export function ContainerQueryHelper() {
  const [min, setMin] = useState("320px");
  const [sel, setSel] = useState(".card");
  const out = useMemo(
    () =>
      [
        `${sel} {`,
        `  container-type: inline-size;`,
        `}`,
        `@container (min-width: ${min}) {`,
        `  ${sel} {`,
        `    /* styles when container ≥ ${min} */`,
        `  }`,
        `}`
      ].join("\n"),
    [min, sel]
  );
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-4">
        <label className="text-sm">
          Selector
          <input className="ml-2 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={sel} onChange={(e) => setSel(e.target.value)} />
        </label>
        <label className="text-sm">
          min-width
          <input className="ml-2 w-28 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={min} onChange={(e) => setMin(e.target.value)} />
        </label>
      </div>
      <ToolOutput value={out} />
    </div>
  );
}

const BP = [
  { name: "Mobile", w: 375 },
  { name: "Tablet", w: 768 },
  { name: "Laptop", w: 1024 },
  { name: "Desktop", w: 1440 }
];

export function BreakpointVisualizer() {
  const [url, setUrl] = useState("https://example.com");
  const [active, setActive] = useState(1);
  const w = BP[active]?.w ?? 768;
  return (
    <div className="grid gap-4">
      <p className="text-sm text-[var(--text-secondary)]">Many sites block iframe embedding (X-Frame-Options). If the preview is blank, that is expected for those URLs.</p>
      <ToolInput label="URL" value={url} onChange={setUrl} minHeight={48} />
      <div className="flex flex-wrap gap-2">
        {BP.map((b, i) => (
          <button
            key={b.name}
            type="button"
            onClick={() => setActive(i)}
            className={`rounded-full border px-3 py-1 text-sm ${active === i ? "border-[var(--blue-primary)] bg-[var(--blue-light)]" : "border-[var(--border-color)]"}`}
          >
            {b.name} ({b.w}px)
          </button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-lg border border-[var(--border-color)] bg-[var(--bg-tertiary)] p-2">
        <iframe title="preview" src={url} className="mx-auto block min-h-[400px] rounded border-0 bg-white" style={{ width: w, maxWidth: "100%" }} sandbox="allow-scripts allow-same-origin" />
      </div>
    </div>
  );
}
