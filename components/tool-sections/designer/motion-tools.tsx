"use client";

import { useMemo, useState } from "react";

import { ToolOutput } from "@/components/tool/ToolOutput";

export function CssTransitionBuilder() {
  const [prop, setProp] = useState("opacity");
  const [dur, setDur] = useState("0.3");
  const [ease, setEase] = useState("ease");
  const [delay, setDelay] = useState("0");
  const out = useMemo(
    () => `transition: ${prop} ${dur}s ${ease} ${delay}s;`,
    [prop, dur, ease, delay]
  );
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <label className="text-sm">
          property
          <input className="mt-1 w-full rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={prop} onChange={(e) => setProp(e.target.value)} />
        </label>
        <label className="text-sm">
          duration (s)
          <input className="mt-1 w-full rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={dur} onChange={(e) => setDur(e.target.value)} />
        </label>
        <label className="text-sm">
          timing
          <select className="mt-1 w-full rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={ease} onChange={(e) => setEase(e.target.value)}>
            <option value="ease">ease</option>
            <option value="linear">linear</option>
            <option value="ease-in">ease-in</option>
            <option value="ease-out">ease-out</option>
            <option value="ease-in-out">ease-in-out</option>
            <option value="cubic-bezier(0.4, 0, 0.2, 1)">cubic-bezier</option>
          </select>
        </label>
        <label className="text-sm">
          delay (s)
          <input className="mt-1 w-full rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={delay} onChange={(e) => setDelay(e.target.value)} />
        </label>
      </div>
      <ToolOutput value={out} />
    </div>
  );
}

export function SpringAnimationCalculator() {
  const [stiffness, setStiffness] = useState("300");
  const [damping, setDamping] = useState("24");
  const out = useMemo(() => {
    const k = Number.parseFloat(stiffness);
    const c = Number.parseFloat(damping);
    if (!Number.isFinite(k) || !Number.isFinite(c) || k <= 0) {
      return "";
    }
    const approxDur = (2 * Math.PI) / Math.sqrt(k / 100) / 10 + c / 200;
    return [
      `Stiffness k=${k}, damping c=${c} (arbitrary units)`,
      `Rough duration hint: ~${approxDur.toFixed(2)}s (informal; tune visually)`,
      `Try: transition: transform ${approxDur.toFixed(2)}s cubic-bezier(0.34, 1.56, 0.64, 1); /* spring-ish */`
    ].join("\n");
  }, [stiffness, damping]);
  return (
    <div className="grid gap-4">
      <p className="text-sm text-[var(--text-secondary)]">Heuristic only — real springs use mass; this maps sliders to a duration + bouncy easing hint.</p>
      <div className="flex flex-wrap gap-4">
        <label className="text-sm">
          stiffness
          <input className="ml-2 w-24 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={stiffness} onChange={(e) => setStiffness(e.target.value)} />
        </label>
        <label className="text-sm">
          damping
          <input className="ml-2 w-24 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={damping} onChange={(e) => setDamping(e.target.value)} />
        </label>
      </div>
      <ToolOutput value={out} />
    </div>
  );
}

const DURATIONS = [100, 150, 200, 250, 300, 400, 500, 750, 1000];

export function AnimationDurationGuide() {
  const [ms, setMs] = useState(300);
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        {DURATIONS.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setMs(d)}
            className={`rounded-full border px-3 py-1 text-sm ${ms === d ? "border-[var(--blue-primary)] bg-[var(--blue-light)]" : "border-[var(--border-color)]"}`}
          >
            {d}ms
          </button>
        ))}
      </div>
      <p className="text-sm text-[var(--text-secondary)]">The dot animates with the selected duration so you can compare micro-interaction timings.</p>
      <div className="flex items-center gap-4 rounded-lg border border-[var(--border-color)] p-8">
        <div className="h-10 w-10 rounded-full bg-[var(--blue-primary)]" style={{ animation: `duration-pulse ${ms}ms ease-in-out infinite` }} />
        <span className="text-sm tabular-nums">{ms} ms</span>
      </div>
      <style>{`@keyframes duration-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.85); } }`}</style>
      <ToolOutput value={`animation-duration: ${ms}ms; /* ${(ms / 1000).toFixed(3)}s */`} />
    </div>
  );
}

export function LottieToCssConverter() {
  const [json, setJson] = useState("");
  const out = useMemo(() => {
    if (!json.trim()) {
      return "";
    }
    try {
      const o = JSON.parse(json) as { fr?: number; op?: number; ip?: number };
      const fr = o.fr ?? 60;
      const dur = o.op != null && o.ip != null ? (o.op - o.ip) / fr : 1;
      return [
        "Parsed header only (full layer → CSS is experimental).",
        `Approx. composition duration: ~${dur.toFixed(2)}s at ${fr} fps`,
        "Use the Lottie Viewer tool for playback; export keyframes from After Effects / Rive for production."
      ].join("\n");
    } catch {
      return "Invalid JSON.";
    }
  }, [json]);
  return (
    <div className="grid gap-4">
      <textarea
        value={json}
        onChange={(e) => setJson(e.target.value)}
        className="min-h-[120px] w-full rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-3 font-mono text-xs"
        placeholder="Paste Lottie JSON…"
      />
      <ToolOutput value={out} />
    </div>
  );
}
