"use client";

import { useMemo, useState } from "react";

import { ActionBar } from "@/components/tool/ActionBar";
import { ToolInput } from "@/components/tool/ToolInput";
import { ToolOutput } from "@/components/tool/ToolOutput";

export function MathSection({ slug }: { slug: string }) {
  switch (slug) {
    case "base-converter":
      return <BaseConv />;
    case "percentage-calc":
      return <PctCalc />;
    case "scientific-calc":
      return <SciCalc />;
    case "roman-numerals":
      return <Roman />;
    case "random-number":
      return <RandNum />;
    default:
      return null;
  }
}

function BaseConv() {
  const [n, setN] = useState("255");
  const [base, setBase] = useState(10);
  const out = useMemo(() => {
    const v = Number.parseInt(n, base);
    if (Number.isNaN(v)) {
      return "Invalid";
    }
    return [
      `Binary: ${v.toString(2)}`,
      `Octal: ${v.toString(8)}`,
      `Decimal: ${v.toString(10)}`,
      `Hex: ${v.toString(16).toUpperCase()}`
    ].join("\n");
  }, [n, base]);
  return (
    <div className="grid gap-4">
      <div className="flex gap-2">
        <input className="flex-1 rounded border px-2 py-2" value={n} onChange={(e) => setN(e.target.value)} />
        <select className="rounded border" value={base} onChange={(e) => setBase(Number(e.target.value))}>
          {[2, 8, 10, 16].map((b) => (
            <option key={b} value={b}>
              Base {b}
            </option>
          ))}
        </select>
      </div>
      <ToolOutput value={out} />
    </div>
  );
}

function PctCalc() {
  const [a, setA] = useState("25");
  const [b, setB] = useState("200");
  const [mode, setMode] = useState<"what" | "of" | "chg">("of");
  const out = useMemo(() => {
    const x = Number(a);
    const y = Number(b);
    if (Number.isNaN(x) || Number.isNaN(y)) {
      return "";
    }
    if (mode === "what") {
      if (y === 0) {
        return "";
      }
      return `${((x / y) * 100).toFixed(4)}%`;
    }
    if (mode === "of") {
      return `${(x / 100) * y}`;
    }
    if (mode === "chg") {
      if (x === 0) {
        return "";
      }
      return `${(((y - x) / x) * 100).toFixed(4)}% change`;
    }
    return "";
  }, [a, b, mode]);
  return (
    <div className="grid gap-4">
      <select className="rounded border" value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}>
        <option value="what">X is what % of Y?</option>
        <option value="of">What is X% of Y?</option>
        <option value="chg">% change from X to Y?</option>
      </select>
      <label className="text-sm">
        X
        <input className="ml-2 rounded border px-2" value={a} onChange={(e) => setA(e.target.value)} />
      </label>
      <label className="text-sm">
        Y
        <input className="ml-2 rounded border px-2" value={b} onChange={(e) => setB(e.target.value)} />
      </label>
      <ToolOutput value={out} />
    </div>
  );
}

function SciCalc() {
  const [expr, setExpr] = useState("");
  const [hist, setHist] = useState<string[]>([]);
  const run = () => {
    try {
      const cleaned = expr.replace(/×/g, "*").replace(/÷/g, "/");
      // eslint-disable-next-line no-new-func
      const fn = new Function("Math", `return (${cleaned})`);
      const v = String(fn(Math));
      setHist((h) => [expr + " = " + v, ...h].slice(0, 10));
    } catch {
      setHist((h) => ["Error", ...h].slice(0, 10));
    }
  };
  return (
    <div className="grid gap-4">
      <ToolInput value={expr} onChange={setExpr} placeholder="2 + 2 * sin(0)" />
      <ActionBar primaryLabel="Evaluate" onPrimary={run} />
      <ul className="text-sm text-[var(--text-secondary)]">
        {hist.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>
    </div>
  );
}

const romanMap: [number, string][] = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"]
];

function toRoman(n: number): string {
  let x = n;
  let s = "";
  for (const [v, sym] of romanMap) {
    while (x >= v) {
      s += sym;
      x -= v;
    }
  }
  return s;
}

function fromRoman(r: string): number {
  const map: Record<string, number> = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 };
  const s = r.toUpperCase();
  let sum = 0;
  for (let i = 0; i < s.length; i++) {
    const v = map[s[i]];
    const v2 = map[s[i + 1]];
    if (v2 > v) {
      sum -= v;
    } else {
      sum += v;
    }
  }
  return sum;
}

function Roman() {
  const [input, setInput] = useState("2024");
  const [mode, setMode] = useState<"ar" | "ro">("ar");
  const [out, setOut] = useState("");
  const run = () => {
    try {
      if (mode === "ar") {
        const n = Number(input);
        if (n < 1 || n > 3999) {
          throw new Error("Arabic must be 1–3999");
        }
        setOut(toRoman(n));
      } else {
        setOut(String(fromRoman(input)));
      }
    } catch (e) {
      setOut(e instanceof Error ? e.message : "Error");
    }
  };
  return (
    <div className="grid gap-4">
      <div className="flex gap-2">
        <button type="button" onClick={() => setMode("ar")}>
          Arabic → Roman
        </button>
        <button type="button" onClick={() => setMode("ro")}>
          Roman → Arabic
        </button>
      </div>
      <ToolInput value={input} onChange={setInput} />
      <ActionBar primaryLabel="Convert" onPrimary={run} />
      <ToolOutput value={out} />
    </div>
  );
}

function RandNum() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(5);
  const [decimals, setDecimals] = useState(0);
  const [unique, setUnique] = useState(false);
  const [sorted, setSorted] = useState(false);
  const [out, setOut] = useState("");
  const gen = () => {
    const arr: number[] = [];
    const crypto = window.crypto;
    for (let i = 0; i < count; i++) {
      const range = max - min;
      const buf = new Uint32Array(1);
      crypto.getRandomValues(buf);
      const frac = buf[0] / 2 ** 32;
      let v = min + frac * (range + (Number.isInteger(min) && Number.isInteger(max) ? 0 : 0));
      if (decimals === 0) {
        v = Math.floor(v);
      } else {
        v = Number(v.toFixed(decimals));
      }
      arr.push(v);
    }
    let res = arr;
    if (unique) {
      res = Array.from(new Set(res));
    }
    if (sorted) {
      res = [...res].sort((a, b) => a - b);
    }
    setOut(res.join("\n"));
  };
  return (
    <div className="grid gap-4">
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-sm">
          Min
          <input type="number" className="ml-2 w-full rounded border" value={min} onChange={(e) => setMin(Number(e.target.value))} />
        </label>
        <label className="text-sm">
          Max
          <input type="number" className="ml-2 w-full rounded border" value={max} onChange={(e) => setMax(Number(e.target.value))} />
        </label>
        <label className="text-sm">
          Count
          <input type="number" className="ml-2 w-full rounded border" value={count} onChange={(e) => setCount(Number(e.target.value))} />
        </label>
        <label className="text-sm">
          Decimals
          <input type="number" className="ml-2 w-full rounded border" value={decimals} onChange={(e) => setDecimals(Number(e.target.value))} />
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} />
        Unique
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={sorted} onChange={(e) => setSorted(e.target.checked)} />
        Sorted
      </label>
      <ActionBar primaryLabel="Generate" onPrimary={gen} />
      <ToolOutput value={out} />
    </div>
  );
}
