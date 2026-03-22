"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { ToolInput } from "@/components/tool/ToolInput";
import { ToolOutput } from "@/components/tool/ToolOutput";
import { convertUnit, UNIT_OPTIONS, type UnitKind } from "@/lib/unit-conversions";

export function UnitConverter() {
  const [kind, setKind] = useState<UnitKind>("length");
  const [val, setVal] = useState("1");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("ft");
  const opts = UNIT_OPTIONS.find((o) => o.kind === kind)!;
  useEffect(() => {
    setFrom(opts.units[0]);
    setTo(opts.units[Math.min(2, opts.units.length - 1)]);
  }, [kind, opts.units]);
  const out = useMemo(() => {
    const n = Number.parseFloat(val);
    if (!Number.isFinite(n)) {
      return "";
    }
    const r = convertUnit(kind, n, from, to);
    return r === null ? "" : String(r);
  }, [kind, val, from, to]);
  return (
    <div className="grid gap-4">
      <label className="text-sm">
        Category
        <select className="ml-2 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={kind} onChange={(e) => setKind(e.target.value as UnitKind)}>
          {UNIT_OPTIONS.map((o) => (
            <option key={o.kind} value={o.kind}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <div className="flex flex-wrap gap-4">
        <label className="text-sm">
          Value
          <input className="ml-2 w-28 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={val} onChange={(e) => setVal(e.target.value)} />
        </label>
        <label className="text-sm">
          From
          <select className="ml-2 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={from} onChange={(e) => setFrom(e.target.value)}>
            {opts.units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          To
          <select className="ml-2 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={to} onChange={(e) => setTo(e.target.value)}>
            {opts.units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </label>
      </div>
      <ToolOutput value={out ? `${val} ${from} = ${out} ${to}` : ""} />
    </div>
  );
}

type Rates = Record<string, number>;

export function CurrencyConverter() {
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [rates, setRates] = useState<Rates | null>(null);
  const [err, setErr] = useState("");
  const load = useCallback(async () => {
    setErr("");
    try {
      const r = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=${to}`);
      if (!r.ok) {
        throw new Error(`HTTP ${r.status}`);
      }
      const d = (await r.json()) as { rates: Rates };
      setRates(d.rates);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load rates");
      setRates(null);
    }
  }, [from, to]);
  useEffect(() => {
    void fetch("https://api.frankfurter.app/currencies")
      .then((r) => r.json() as Promise<Record<string, string>>)
      .then((o) => setCurrencies(Object.keys(o).sort()))
      .catch(() => setCurrencies(["USD", "EUR", "GBP", "INR", "JPY"]));
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  const converted = useMemo(() => {
    const n = Number.parseFloat(amount);
    if (!Number.isFinite(n) || !rates?.[to]) {
      return "";
    }
    return (n * rates[to]).toFixed(4);
  }, [amount, rates, to]);
  return (
    <div className="grid gap-4">
      <p className="text-sm text-[var(--text-secondary)]">
        Rates from{" "}
        <a href="https://www.frankfurter.app/" className="text-[var(--blue-primary)] underline" target="_blank" rel="noreferrer">
          Frankfurter
        </a>{" "}
        (free, no API key).
      </p>
      <div className="flex flex-wrap gap-4">
        <label className="text-sm">
          Amount
          <input className="ml-2 w-24 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
        <label className="text-sm">
          From
          <select className="ml-2 max-w-[8rem] rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={from} onChange={(e) => setFrom(e.target.value)}>
            {(currencies.length ? currencies : ["USD", "EUR"]).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          To
          <select className="ml-2 max-w-[8rem] rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={to} onChange={(e) => setTo(e.target.value)}>
            {(currencies.length ? currencies : ["USD", "EUR"]).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="rounded-lg border px-3 py-1 text-sm" onClick={() => void load()}>
          Refresh
        </button>
      </div>
      {err ? <p className="text-sm text-amber-600">{err}</p> : null}
      <ToolOutput value={converted ? `${amount} ${from} = ${converted} ${to}` : ""} />
    </div>
  );
}

export function BitwiseCalculator() {
  const [a, setA] = useState("255");
  const [b, setB] = useState("15");
  const [base, setBase] = useState<10 | 16>(10);
  const out = useMemo(() => {
    const parseN = (s: string) => (base === 16 ? Number.parseInt(s.replace(/^0x/i, ""), 16) : Number.parseInt(s, 10));
    const x = parseN(a);
    const y = parseN(b);
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      return "";
    }
    return [
      `AND:  ${x & y}`,
      `OR:   ${x | y}`,
      `XOR:  ${x ^ y}`,
      `NOT:  ${~x} (unsigned 32-bit: ${(~x) >>> 0})`,
      `<<:   ${x << (y & 31)}`,
      `>>:   ${x >> (y & 31)}`,
      `>>>:  ${x >>> (y & 31)}`
    ].join("\n");
  }, [a, b, base]);
  return (
    <div className="grid gap-4">
      <label className="text-sm">
        Base
        <select className="ml-2 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={base} onChange={(e) => setBase(Number(e.target.value) as 10 | 16)}>
          <option value={10}>Decimal</option>
          <option value={16}>Hex</option>
        </select>
      </label>
      <div className="flex flex-wrap gap-4">
        <label className="text-sm">
          A
          <input className="ml-2 w-32 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1 font-mono" value={a} onChange={(e) => setA(e.target.value)} />
        </label>
        <label className="text-sm">
          B
          <input className="ml-2 w-32 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1 font-mono" value={b} onChange={(e) => setB(e.target.value)} />
        </label>
      </div>
      <ToolOutput value={out} />
    </div>
  );
}
