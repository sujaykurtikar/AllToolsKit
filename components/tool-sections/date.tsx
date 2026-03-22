"use client";

import zxcvbn from "zxcvbn";
import { useEffect, useMemo, useState } from "react";

import { ActionBar } from "@/components/tool/ActionBar";
import { ToolInput } from "@/components/tool/ToolInput";
import { ToolOutput } from "@/components/tool/ToolOutput";
import { formatTimestampFromDate, formatTimestampFromUnix } from "@/lib/tool-utils";

export function DateSection({ slug }: { slug: string }) {
  switch (slug) {
    case "timestamp":
      return <TsTool />;
    case "timezone":
      return <TzTool />;
    case "date-diff":
      return <DateDiff />;
    case "password-gen":
      return <PwdGen />;
    case "password-strength":
      return <PwdStr />;
    default:
      return null;
  }
}

function TsTool() {
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const fromUnix = () => {
    try {
      setErr("");
      setOut(formatTimestampFromUnix(input));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "");
    }
  };
  const fromDate = () => {
    try {
      setErr("");
      setOut(formatTimestampFromDate(input));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "");
    }
  };
  const now = () => {
    setInput(String(Math.floor(Date.now() / 1000)));
  };
  return (
    <div className="grid gap-4">
      <ToolInput value={input} onChange={setInput} placeholder="Unix or ISO date" />
      <div className="flex flex-wrap gap-2">
        <button type="button" className="rounded border px-3 py-2" onClick={fromUnix}>
          Unix → Date
        </button>
        <button type="button" className="rounded border px-3 py-2" onClick={fromDate}>
          Date → Unix
        </button>
        <button type="button" className="rounded border px-3 py-2" onClick={now}>
          Now
        </button>
      </div>
      <ToolOutput value={out} error={err} />
    </div>
  );
}

function TzTool() {
  const [dt, setDt] = useState("2026-01-01T12:00:00");
  const [to, setTo] = useState("America/New_York");
  const out = useMemo(() => {
    try {
      const d = new Date(dt);
      const fmt = new Intl.DateTimeFormat("en-US", { timeZone: to, dateStyle: "medium", timeStyle: "medium" });
      return fmt.format(d);
    } catch {
      return "Invalid";
    }
  }, [dt, to]);
  return (
    <div className="grid gap-4">
      <ToolInput value={dt} onChange={setDt} />
      <label className="text-sm">
        Target TZ
        <input className="ml-2 w-full rounded border" value={to} onChange={(e) => setTo(e.target.value)} />
      </label>
      <ToolOutput value={out} />
    </div>
  );
}

function DateDiff() {
  const [a, setA] = useState("2026-01-01");
  const [b, setB] = useState("2026-03-22");
  const out = useMemo(() => {
    const d1 = new Date(a);
    const d2 = new Date(b);
    const ms = Math.abs(d2.getTime() - d1.getTime());
    const sec = Math.floor(ms / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);
    return [`Days: ${day}`, `Hours: ${hr}`, `Minutes: ${min}`, `Seconds: ${sec}`].join("\n");
  }, [a, b]);
  return (
    <div className="grid gap-4">
      <label className="text-sm">
        Start
        <input type="date" className="ml-2 rounded border" value={a} onChange={(e) => setA(e.target.value)} />
      </label>
      <label className="text-sm">
        End
        <input type="date" className="ml-2 rounded border" value={b} onChange={(e) => setB(e.target.value)} />
      </label>
      <button
        type="button"
        className="w-fit rounded border px-3 py-2"
        onClick={() => {
          const t = new Date();
          setA(t.toISOString().slice(0, 10));
        }}
      >
        From today
      </button>
      <ToolOutput value={out} />
    </div>
  );
}

const sets = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  num: "0123456789",
  sym: "!@#$%^&*()_+-=[]{}|;:,.<>?"
};

function PwdGen() {
  const [len, setLen] = useState(16);
  const [u, setU] = useState(true);
  const [l, setL] = useState(true);
  const [n, setN] = useState(true);
  const [s, setS] = useState(true);
  const [out, setOut] = useState("");
  const gen = () => {
    let pool = "";
    if (u) {
      pool += sets.upper;
    }
    if (l) {
      pool += sets.lower;
    }
    if (n) {
      pool += sets.num;
    }
    if (s) {
      pool += sets.sym;
    }
    if (!pool) {
      return;
    }
    const arr = new Uint8Array(len);
    crypto.getRandomValues(arr);
    let pwd = "";
    for (let i = 0; i < len; i++) {
      pwd += pool[arr[i] % pool.length];
    }
    setOut(pwd);
  };
  useEffect(() => {
    gen();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- regenerate when settings change
  }, [len, u, l, n, s]);
  return (
    <div className="grid gap-4">
      <label className="text-sm">
        Length
        <input type="range" min={8} max={64} value={len} onChange={(e) => setLen(Number(e.target.value))} />
        {len}
      </label>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex gap-2">
          <input type="checkbox" checked={u} onChange={(e) => setU(e.target.checked)} />
          Upper
        </label>
        <label className="flex gap-2">
          <input type="checkbox" checked={l} onChange={(e) => setL(e.target.checked)} />
          Lower
        </label>
        <label className="flex gap-2">
          <input type="checkbox" checked={n} onChange={(e) => setN(e.target.checked)} />
          Numbers
        </label>
        <label className="flex gap-2">
          <input type="checkbox" checked={s} onChange={(e) => setS(e.target.checked)} />
          Symbols
        </label>
      </div>
      <ActionBar primaryLabel="Generate" onPrimary={gen} />
      <ToolOutput value={out} />
    </div>
  );
}

function PwdStr() {
  const [pwd, setPwd] = useState("hunter2");
  const result = useMemo(() => zxcvbn(pwd), [pwd]);
  return (
    <div className="grid gap-4">
      <ToolInput value={pwd} onChange={setPwd} />
      <p className="text-sm">
        Score: {result.score} — {result.feedback.warning || "OK"}
      </p>
      <p className="text-xs text-[var(--text-tertiary)]">{result.feedback.suggestions.join(" ")}</p>
    </div>
  );
}
