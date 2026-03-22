"use client";

import CryptoJS from "crypto-js";
import { diffChars, diffWords } from "diff";
import { useMemo, useState } from "react";

import { ActionBar } from "@/components/tool/ActionBar";
import { ToolInput } from "@/components/tool/ToolInput";
import { ToolOutput } from "@/components/tool/ToolOutput";

function paste(set: (s: string) => void) {
  void navigator.clipboard.readText().then(set).catch(() => {});
}

export function TextSection({ slug }: { slug: string }) {
  switch (slug) {
    case "word-counter":
      return <WordCount />;
    case "case-converter":
      return <CaseConv />;
    case "slug-generator":
      return <SlugGen />;
    case "text-diff":
      return <TextDiff />;
    case "duplicate-remover":
      return <DupRem />;
    case "sort-lines":
      return <SortLines />;
    case "reverse-text":
      return <RevText />;
    case "find-replace":
      return <FindRep />;
    case "text-to-binary":
      return <TextBin />;
    case "rot13":
      return <Rot13 />;
    case "whitespace-cleaner":
      return <WsClean />;
    case "text-encrypt":
      return <TextEnc />;
    default:
      return null;
  }
}

function WordCount() {
  const [text, setText] = useState("");
  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const noSpace = text.replace(/\s/g, "").length;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
    const paras = text.trim() ? text.split(/\n\s*\n/).length : 0;
    const minutes = Math.ceil(words / 200);
    return { words, chars, noSpace, sentences, paras, minutes };
  }, [text]);
  return (
    <div className="grid gap-4">
      <div className="grid gap-2 sm:grid-cols-3">
        {[
          ["Words", stats.words],
          ["Characters", stats.chars],
          ["No spaces", stats.noSpace],
          ["Sentences", stats.sentences],
          ["Paragraphs", stats.paras],
          ["Reading (min)", stats.minutes]
        ].map(([k, v]) => (
          <div key={String(k)} className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-3 text-center">
            <div className="text-sm text-[var(--text-tertiary)]">{k}</div>
            <div className="text-xl font-semibold">{v as number}</div>
          </div>
        ))}
      </div>
      <ToolInput label="Text" value={text} onChange={setText} minHeight={240} />
    </div>
  );
}

function CaseConv() {
  const [text, setText] = useState("Hello World");
  const apply = (mode: string) => {
    setText((t) => {
      switch (mode) {
        case "upper":
          return t.toUpperCase();
        case "lower":
          return t.toLowerCase();
        case "title":
          return t.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
        case "sentence":
          return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
        case "camel":
          return t
            .split(/[\s_]+/)
            .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
            .join("");
        case "pascal":
          return t
            .split(/[\s_]+/)
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join("");
        case "snake":
          return t
            .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
            .replace(/\s+/g, "_")
            .toLowerCase();
        case "kebab":
          return t
            .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
            .replace(/\s+/g, "-")
            .toLowerCase();
        default:
          return t;
      }
    });
  };
  const modes = [
    "UPPERCASE",
    "lowercase",
    "Title Case",
    "Sentence case",
    "camelCase",
    "PascalCase",
    "snake_case",
    "kebab-case"
  ];
  const keys = ["upper", "lower", "title", "sentence", "camel", "pascal", "snake", "kebab"];
  return (
    <div className="grid gap-4">
      <ToolInput value={text} onChange={setText} />
      <div className="flex flex-wrap gap-2">
        {modes.map((m, i) => (
          <button key={m} type="button" className="rounded-lg border px-3 py-2 text-sm" onClick={() => apply(keys[i])}>
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}

function SlugGen() {
  const [text, setText] = useState("My Blog Post Title!");
  const [sep, setSep] = useState("-");
  const [lower, setLower] = useState(true);
  const [noNum, setNoNum] = useState(false);
  const out = useMemo(() => {
    let s = text
      .normalize("NFKD")
      .replace(/[^\w\s-]/g, "")
      .trim();
    if (noNum) {
      s = s.replace(/[0-9]+/g, "");
    }
    s = s.replace(/\s+/g, sep);
    if (lower) {
      s = s.toLowerCase();
    }
    return s;
  }, [text, sep, lower, noNum]);
  return (
    <div className="grid gap-4">
      <ToolInput value={text} onChange={setText} />
      <div className="flex flex-wrap gap-4 text-sm">
        <label>
          Separator
          <select className="ml-2 rounded border" value={sep} onChange={(e) => setSep(e.target.value)}>
            <option value="-">-</option>
            <option value="_">_</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={lower} onChange={(e) => setLower(e.target.checked)} />
          Lowercase
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={noNum} onChange={(e) => setNoNum(e.target.checked)} />
          Remove numbers
        </label>
      </div>
      <ToolOutput value={out} />
    </div>
  );
}

function TextDiff() {
  const [a, setA] = useState("hello world");
  const [b, setB] = useState("hello there");
  const [mode, setMode] = useState<"word" | "char">("word");
  const parts = useMemo(() => {
    return mode === "word" ? diffWords(a, b) : diffChars(a, b);
  }, [a, b, mode]);
  return (
    <div className="grid gap-4">
      <div className="flex gap-2">
        <button type="button" className={mode === "word" ? "font-bold" : ""} onClick={() => setMode("word")}>
          Words
        </button>
        <button type="button" className={mode === "char" ? "font-bold" : ""} onClick={() => setMode("char")}>
          Characters
        </button>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <ToolInput label="Text A" value={a} onChange={setA} minHeight={160} />
        <ToolInput label="Text B" value={b} onChange={setB} minHeight={160} />
      </div>
      <div className="rounded border p-3 text-sm leading-relaxed">
        {parts.map((p, i) => (
          <span
            key={i}
            className={
              p.added ? "bg-green-200 dark:bg-green-800" : p.removed ? "bg-red-200 dark:bg-red-900/50" : ""
            }
          >
            {p.value}
          </span>
        ))}
      </div>
    </div>
  );
}

function DupRem() {
  const [input, setInput] = useState("");
  const [caseSens, setCaseSens] = useState(false);
  const [trim, setTrim] = useState(true);
  const [sort, setSort] = useState(false);
  const [msg, setMsg] = useState("");
  const run = () => {
    let lines = input.split(/\r?\n/);
    if (trim) {
      lines = lines.map((l) => l.trim());
    }
    const seen = new Set<string>();
    const out: string[] = [];
    let dup = 0;
    for (const line of lines) {
      const key = caseSens ? line : line.toLowerCase();
      if (seen.has(key)) {
        dup++;
        continue;
      }
      seen.add(key);
      out.push(line);
    }
    let final = out;
    if (sort) {
      final = [...out].sort((x, y) => x.localeCompare(y));
    }
    setMsg(`${dup} duplicates removed`);
    setInput(final.join("\n"));
  };
  return (
    <div className="grid gap-4">
      <ToolInput value={input} onChange={setInput} />
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={caseSens} onChange={(e) => setCaseSens(e.target.checked)} />
          Case-sensitive
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={trim} onChange={(e) => setTrim(e.target.checked)} />
          Trim lines
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={sort} onChange={(e) => setSort(e.target.checked)} />
          Sort result
        </label>
      </div>
      <ActionBar primaryLabel="Remove Duplicates" onPrimary={run} />
      <p className="text-sm text-[var(--text-secondary)]">{msg}</p>
    </div>
  );
}

function SortLines() {
  const [input, setInput] = useState("");
  const [caseSens, setCaseSens] = useState(false);
  const [trim, setTrim] = useState(true);
  const sort = (mode: string) => {
    let lines = input.split(/\r?\n/);
    if (trim) {
      lines = lines.map((l) => l.trim());
    }
    const key = (a: string, b: string) => {
      const x = caseSens ? a : a.toLowerCase();
      const y = caseSens ? b : b.toLowerCase();
      return x.localeCompare(y, undefined, { numeric: mode === "num" });
    };
    if (mode === "az") {
      lines.sort((a, b) => key(a, b));
    } else if (mode === "za") {
      lines.sort((a, b) => -key(a, b));
    } else if (mode === "short") {
      lines.sort((a, b) => a.length - b.length);
    } else if (mode === "long") {
      lines.sort((a, b) => b.length - a.length);
    } else if (mode === "num") {
      lines.sort((a, b) => key(a, b));
    }
    setInput(lines.join("\n"));
  };
  return (
    <div className="grid gap-4">
      <ToolInput value={input} onChange={setInput} />
      <div className="flex flex-wrap gap-2">
        {[
          ["A→Z", "az"],
          ["Z→A", "za"],
          ["Shortest", "short"],
          ["Longest", "long"],
          ["Numeric", "num"]
        ].map(([l, k]) => (
          <button key={k} type="button" className="rounded border px-3 py-2 text-sm" onClick={() => sort(k)}>
            {l}
          </button>
        ))}
      </div>
      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={caseSens} onChange={(e) => setCaseSens(e.target.checked)} />
          Case-sensitive
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={trim} onChange={(e) => setTrim(e.target.checked)} />
          Trim
        </label>
      </div>
    </div>
  );
}

function RevText() {
  const [text, setText] = useState("");
  const [out, setOut] = useState("");
  return (
    <div className="grid gap-4">
      <ToolInput value={text} onChange={setText} />
      <div className="flex flex-wrap gap-2">
        <button type="button" className="rounded border px-3 py-2" onClick={() => setOut(text.split("").reverse().join(""))}>
          Reverse all
        </button>
        <button
          type="button"
          className="rounded border px-3 py-2"
          onClick={() => setOut(text.split(/\r?\n/).map((l) => l.split("").reverse().join("")).join("\n"))}
        >
          Reverse lines
        </button>
        <button
          type="button"
          className="rounded border px-3 py-2"
          onClick={() => setOut(text.split(/\r?\n/).reverse().join("\n"))}
        >
          Reverse line order
        </button>
      </div>
      <ToolOutput value={out} />
    </div>
  );
}

function FindRep() {
  const [text, setText] = useState("");
  const [find, setFind] = useState("");
  const [rep, setRep] = useState("");
  const [caseSens, setCaseSens] = useState(false);
  const [regex, setRegex] = useState(false);
  const [whole, setWhole] = useState(false);
  const replaceAll = () => {
    if (regex) {
      const flags = caseSens ? "g" : "gi";
      const re = new RegExp(find, flags);
      setText(text.replace(re, rep));
    } else {
      let t = text;
      const f = caseSens ? find : find.toLowerCase();
      if (whole) {
        const re = new RegExp(`\\b${escapeRegExp(find)}\\b`, caseSens ? "g" : "gi");
        setText(t.replace(re, rep));
      } else {
        if (!caseSens) {
          const idx = t.toLowerCase().indexOf(f);
          if (idx >= 0) {
            setText(t.slice(0, idx) + rep + t.slice(idx + find.length));
          }
        } else {
          setText(t.split(find).join(rep));
        }
      }
    }
  };
  return (
    <div className="grid gap-4">
      <div className="grid gap-2 md:grid-cols-2">
        <label className="text-sm">
          Find
          <input className="mt-1 w-full rounded border px-2 py-2" value={find} onChange={(e) => setFind(e.target.value)} />
        </label>
        <label className="text-sm">
          Replace
          <input className="mt-1 w-full rounded border px-2 py-2" value={rep} onChange={(e) => setRep(e.target.value)} />
        </label>
      </div>
      <ToolInput value={text} onChange={setText} />
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={caseSens} onChange={(e) => setCaseSens(e.target.checked)} />
          Case-sensitive
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={regex} onChange={(e) => setRegex(e.target.checked)} />
          Regex
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={whole} onChange={(e) => setWhole(e.target.checked)} />
          Whole word
        </label>
      </div>
      <ActionBar primaryLabel="Replace All" onPrimary={replaceAll} />
    </div>
  );
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function TextBin() {
  const [text, setText] = useState("Hi");
  const [mode, setMode] = useState<"enc" | "dec">("enc");
  const [out, setOut] = useState("");
  const run = () => {
    if (mode === "enc") {
      setOut(
        Array.from(new TextEncoder().encode(text))
          .map((b) => b.toString(2).padStart(8, "0"))
          .join(" ")
      );
    } else {
      const bytes = text
        .trim()
        .split(/\s+/)
        .map((x) => Number.parseInt(x, 2));
      setOut(new TextDecoder().decode(new Uint8Array(bytes)));
    }
  };
  return (
    <div className="grid gap-4">
      <div className="flex gap-2">
        <button type="button" onClick={() => setMode("enc")}>
          Text → Binary
        </button>
        <button type="button" onClick={() => setMode("dec")}>
          Binary → Text
        </button>
      </div>
      <ToolInput value={text} onChange={setText} />
      <ActionBar primaryLabel="Convert" onPrimary={run} />
      <ToolOutput value={out} />
    </div>
  );
}

function Rot13() {
  const [text, setText] = useState("");
  const rot = (s: string) =>
    s.replace(/[a-zA-Z]/g, (c) => {
      const base = c <= "Z" ? 65 : 97;
      return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
    });
  const out = useMemo(() => rot(text), [text]);
  return (
    <div className="grid gap-4">
      <ToolInput value={text} onChange={setText} />
      <ToolOutput value={out} />
    </div>
  );
}

function WsClean() {
  const [text, setText] = useState("");
  const trimLines = () => setText(text.split(/\r?\n/).map((l) => l.trim()).join("\n"));
  const blank = () => setText(text.split(/\r?\n/).filter((l) => l.trim().length > 0).join("\n"));
  const norm = () => setText(text.replace(/[ \t]+/g, " "));
  const all = () => setText(text.replace(/\s+/g, ""));
  return (
    <div className="grid gap-4">
      <ToolInput value={text} onChange={setText} />
      <div className="flex flex-wrap gap-2">
        <button type="button" className="rounded border px-3 py-2" onClick={trimLines}>
          Trim lines
        </button>
        <button type="button" className="rounded border px-3 py-2" onClick={blank}>
          Remove blank lines
        </button>
        <button type="button" className="rounded border px-3 py-2" onClick={norm}>
          Normalize spaces
        </button>
        <button type="button" className="rounded border px-3 py-2" onClick={all}>
          Remove all whitespace
        </button>
      </div>
    </div>
  );
}

function TextEnc() {
  const [text, setText] = useState("");
  const [pass, setPass] = useState("");
  const [out, setOut] = useState("");
  const enc = () => {
    setOut(CryptoJS.AES.encrypt(text, pass).toString());
  };
  const dec = () => {
    try {
      const bytes = CryptoJS.AES.decrypt(out || text, pass);
      setText(bytes.toString(CryptoJS.enc.Utf8));
    } catch {
      setOut("Decrypt failed");
    }
  };
  return (
    <div className="grid gap-4">
      <p className="text-sm text-[var(--text-secondary)]">
        Encrypted output can only be decrypted with the same passphrase. We do not store your data or passphrase.
      </p>
      <label className="text-sm">
        Passphrase
        <input type="password" className="mt-1 w-full rounded border px-2 py-2" value={pass} onChange={(e) => setPass(e.target.value)} />
      </label>
      <ToolInput value={text} onChange={setText} />
      <div className="flex gap-2">
        <button type="button" className="rounded bg-[var(--blue-primary)] px-4 py-2 text-white" onClick={enc}>
          Encrypt
        </button>
        <button type="button" className="rounded border px-4 py-2" onClick={dec}>
          Decrypt
        </button>
      </div>
      <ToolOutput value={out} />
    </div>
  );
}
