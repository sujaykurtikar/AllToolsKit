"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ToolInput } from "@/components/tool/ToolInput";
import { ToolOutput } from "@/components/tool/ToolOutput";

export function SvgToCssBackground() {
  const [svg, setSvg] = useState('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="10" fill="#3b82f6"/></svg>');
  const out = useMemo(() => {
    const enc = encodeURIComponent(svg.replace(/\s+/g, " ").trim());
    return `background-image: url("data:image/svg+xml,${enc}");\nbackground-repeat: no-repeat;\nbackground-size: contain;`;
  }, [svg]);
  const dataUrl = useMemo(() => `url("data:image/svg+xml,${encodeURIComponent(svg.replace(/\s+/g, " ").trim())}")`, [svg]);
  return (
    <div className="grid gap-4">
      <ToolInput label="SVG markup" value={svg} onChange={setSvg} minHeight={120} />
      <div
        className="h-24 rounded-lg border border-[var(--border-color)] bg-[var(--bg-tertiary)]"
        style={{ backgroundImage: dataUrl, backgroundRepeat: "no-repeat", backgroundSize: "contain", backgroundPosition: "center" }}
      />
      <ToolOutput value={out} />
    </div>
  );
}

const PATTERN_STYLES: CSSProperties[] = [
  {
    backgroundColor: "#e5e7eb",
    backgroundImage: "radial-gradient(#64748b 1px, transparent 1px)",
    backgroundSize: "12px 12px"
  },
  {
    backgroundColor: "#f8fafc",
    backgroundImage: "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)",
    backgroundSize: "24px 24px"
  },
  {
    background: "repeating-linear-gradient(45deg, #f1f5f9, #f1f5f9 10px, #e2e8f0 10px, #e2e8f0 20px)"
  }
];

const PATTERN_CSS = [
  `background-color: #e5e7eb;\nbackground-image: radial-gradient(#64748b 1px, transparent 1px);\nbackground-size: 12px 12px;`,
  `background-color: #f8fafc;\nbackground-image: linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px);\nbackground-size: 24px 24px;`,
  `background: repeating-linear-gradient(45deg, #f1f5f9, #f1f5f9 10px, #e2e8f0 10px, #e2e8f0 20px);`
];

export function CssPatternGenerator() {
  const [idx, setIdx] = useState(0);
  return (
    <div className="grid gap-4">
      <select className="w-full max-w-xs rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-2" value={idx} onChange={(e) => setIdx(Number(e.target.value))}>
        <option value={0}>Dots</option>
        <option value={1}>Grid</option>
        <option value={2}>Diagonal stripes</option>
      </select>
      <div className="h-40 rounded-lg border border-[var(--border-color)]" style={PATTERN_STYLES[idx]} />
      <ToolOutput value={PATTERN_CSS[idx]} />
    </div>
  );
}

export function IconFontGenerator() {
  const [rows, setRows] = useState("home E001\nuser E002\nsettings E003");
  const out = useMemo(() => {
    const lines = rows.split("\n").filter(Boolean);
    const css = lines
      .map((line) => {
        const parts = line.trim().split(/\s+/);
        const name = parts[0];
        const code = parts[1];
        if (!name || !code) {
          return "";
        }
        return `.icon-${name}:before { content: "\\${code}"; font-family: "MyIcons"; }`;
      })
      .filter(Boolean)
      .join("\n");
    return [`@font-face { font-family: "MyIcons"; src: url("icons.woff2") format("woff2"); font-display: block; }`, "", css].join("\n");
  }, [rows]);
  return (
    <div className="grid gap-4">
      <p className="text-sm text-[var(--text-secondary)]">One icon per line: name and hex codepoint (e.g. home E001). Build the actual font in IcoMoon or FontForge; this generates CSS hooks.</p>
      <ToolInput label="Icon map" value={rows} onChange={setRows} minHeight={120} />
      <ToolOutput value={out} />
    </div>
  );
}

const SOCIAL_SIZES = [
  ["Open Graph / Facebook", "1200 × 630"],
  ["Twitter / X large card", "1200 × 628"],
  ["Instagram square", "1080 × 1080"],
  ["Instagram story", "1080 × 1920"],
  ["LinkedIn share", "1200 × 627"],
  ["YouTube thumbnail", "1280 × 720"],
  ["Pinterest pin", "1000 × 1500"]
];

export function SocialMediaImageSizes() {
  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--border-color)]">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-[var(--border-color)] bg-[var(--bg-tertiary)]">
          <tr>
            <th className="px-3 py-2">Use</th>
            <th className="px-3 py-2">Typical size</th>
          </tr>
        </thead>
        <tbody>
          {SOCIAL_SIZES.map(([a, b]) => (
            <tr key={a} className="border-b border-[var(--border-color)]">
              <td className="px-3 py-2">{a}</td>
              <td className="px-3 py-2 font-mono">{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ImageSpriteGenerator() {
  const [err, setErr] = useState("");
  const [out, setOut] = useState("");
  const onFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const fs = [...(e.target.files ?? [])].filter((f) => f.type.startsWith("image/"));
    if (!fs.length) {
      setErr("Select one or more images.");
      return;
    }
    setErr("");
    void Promise.all(
      fs.map(
        (f) =>
          new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(f);
            img.onload = () => {
              URL.revokeObjectURL(url);
              resolve(img);
            };
            img.onerror = () => {
              URL.revokeObjectURL(url);
              reject(new Error("load"));
            };
            img.src = url;
          })
      )
    )
      .then((imgs) => {
        const hMax = Math.max(...imgs.map((im) => im.naturalHeight));
        const pad = 2;
        const totalW = imgs.reduce((s, im) => s + im.naturalWidth + pad, 0) - pad;
        const c = document.createElement("canvas");
        c.width = totalW;
        c.height = hMax;
        const ctx = c.getContext("2d");
        if (!ctx) {
          setErr("Canvas error.");
          return;
        }
        const css: string[] = [];
        let x = 0;
        imgs.forEach((im, j) => {
          const w = im.naturalWidth;
          ctx.drawImage(im, x, 0);
          css.push(`.sprite-${j} { width: ${w}px; height: ${im.naturalHeight}px; background-position: -${x}px 0; }`);
          x += w + pad;
        });
        const png = c.toDataURL("image/png");
        setOut(
          [
            `/* Combined PNG (data URL below). Sprite ${c.width}×${c.height}px */`,
            `.sprite { background-image: url("${png}"); background-repeat: no-repeat; display: inline-block; vertical-align: middle; }`,
            ...css
          ].join("\n")
        );
      })
      .catch(() => setErr("Failed to load an image."));
  }, []);
  return (
    <div className="grid gap-4">
      <input type="file" accept="image/*" multiple onChange={onFiles} className="text-sm" />
      {err ? <p className="text-sm text-red-500">{err}</p> : null}
      <p className="text-sm text-[var(--text-tertiary)]">Export the combined canvas from devtools or use a screenshot tool; CSS positions are listed for each slot.</p>
      <ToolOutput value={out} />
    </div>
  );
}

export function DataUriEncoder() {
  const [b64, setB64] = useState("");
  const [mime, setMime] = useState("application/octet-stream");
  const onFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) {
      return;
    }
    setMime(f.type || "application/octet-stream");
    const r = new FileReader();
    r.onload = () => {
      const s = String(r.result);
      const i = s.indexOf(",");
      setB64(i >= 0 ? s.slice(i + 1) : s);
    };
    r.readAsDataURL(f);
  }, []);
  const full = useMemo(() => (b64 ? `data:${mime};base64,${b64}` : ""), [b64, mime]);
  return (
    <div className="grid gap-4">
      <input type="file" onChange={onFile} className="text-sm" />
      <ToolOutput value={full} label="Data URI" />
    </div>
  );
}

export function FaviconChecker() {
  const [url, setUrl] = useState("https://github.com");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const run = useCallback(async () => {
    setLoading(true);
    setResult("");
    try {
      const r = await fetch(`/api/favicon-check?url=${encodeURIComponent(url)}`);
      const j = (await r.json()) as { links?: { rel: string; href: string; type?: string }[]; error?: string };
      if (j.error && !j.links?.length) {
        setResult(j.error);
        return;
      }
      const lines = (j.links ?? []).map((l) => `${l.rel}\t${l.href}${l.type ? `\t${l.type}` : ""}`);
      setResult(lines.length ? lines.join("\n") : "No icon link tags found in the first HTML response.");
    } catch (e) {
      setResult(e instanceof Error ? e.message : "Request failed.");
    } finally {
      setLoading(false);
    }
  }, [url]);
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        <input className="min-w-[200px] flex-1 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-2 text-sm" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
        <button type="button" onClick={run} disabled={loading} className="rounded-lg border border-[var(--border-color)] bg-[var(--blue-primary)] px-4 py-2 text-sm text-white disabled:opacity-50">
          {loading ? "…" : "Fetch"}
        </button>
      </div>
      <ToolOutput value={result} />
    </div>
  );
}

export function LottieViewer() {
  const [json, setJson] = useState("");
  const [err, setErr] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    animRef.current?.destroy();
    animRef.current = null;
    if (!json.trim() || !containerRef.current) {
      return;
    }
    let cancelled = false;
    setErr("");
    let data: object;
    try {
      data = JSON.parse(json) as object;
      if (!("v" in data) && !("layers" in data)) {
        setErr("Does not look like Lottie JSON (expected v or layers).");
        return;
      }
    } catch {
      setErr("Invalid JSON.");
      return;
    }
    void import("lottie-web").then(({ default: lottie }) => {
      if (cancelled || !containerRef.current) {
        return;
      }
      containerRef.current.innerHTML = "";
      animRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: data
      });
    });
    return () => {
      cancelled = true;
      animRef.current?.destroy();
      animRef.current = null;
    };
  }, [json]);

  return (
    <div className="grid gap-4">
      <ToolInput label="Lottie JSON" value={json} onChange={setJson} minHeight={160} placeholder='Paste { "v": "5.7...", "layers": [...] }' />
      {err ? <p className="text-sm text-amber-600">{err}</p> : null}
      <div ref={containerRef} className="max-h-[320px] min-h-[160px] overflow-hidden rounded-lg border border-[var(--border-color)] bg-[var(--bg-tertiary)]" />
    </div>
  );
}
