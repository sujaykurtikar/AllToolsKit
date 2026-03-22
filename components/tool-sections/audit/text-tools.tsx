"use client";

import { useCallback, useMemo, useState } from "react";

import { ToolInput } from "@/components/tool/ToolInput";
import { ToolOutput } from "@/components/tool/ToolOutput";
import { EMOJI_BY_CATEGORY } from "@/lib/emoji-list";

const MORSE: Record<string, string> = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----."
};
export function TextToSpeech() {
  const [text, setText] = useState("Hello from PandaPath tools.");
  const speak = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(u);
  }, [text]);
  return (
    <div className="grid gap-4">
      <p className="text-sm text-[var(--text-secondary)]">Uses your browser&apos;s built-in voices (Web Speech API).</p>
      <ToolInput label="Text" value={text} onChange={setText} minHeight={100} />
      <button type="button" className="w-fit rounded-lg border border-[var(--blue-primary)] px-4 py-2 text-sm" onClick={speak}>
        Speak
      </button>
    </div>
  );
}

export function EmojiPicker() {
  const [q, setQ] = useState("");
  const [copied, setCopied] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) {
      return EMOJI_BY_CATEGORY;
    }
    return EMOJI_BY_CATEGORY.map((c) => ({
      ...c,
      emojis: c.emojis.filter((e) => e.includes(s) || c.name.toLowerCase().includes(s))
    })).filter((c) => c.emojis.length > 0);
  }, [q]);
  const copy = (e: string) => {
    void navigator.clipboard.writeText(e).then(() => {
      setCopied(e);
      window.setTimeout(() => setCopied(""), 1500);
    });
  };
  return (
    <div className="grid gap-4">
      <input className="w-full max-w-md rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-2 text-sm" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
      {filtered.map((cat) => (
        <div key={cat.name}>
          <p className="mb-2 text-xs font-medium uppercase text-[var(--text-tertiary)]">{cat.name}</p>
          <div className="flex flex-wrap gap-1">
            {cat.emojis.map((em) => (
              <button
                key={em + cat.name}
                type="button"
                title={em}
                className={`rounded p-1 text-xl hover:bg-[var(--bg-tertiary)] ${copied === em ? "ring-2 ring-[var(--blue-primary)]" : ""}`}
                onClick={() => copy(em)}
              >
                {em}
              </button>
            ))}
          </div>
        </div>
      ))}
      {copied ? <p className="text-sm text-[var(--text-secondary)]">Copied {copied}</p> : null}
    </div>
  );
}

export function StringEscapeTool() {
  const [text, setText] = useState(`Line "quotes"`);
  const [mode, setMode] = useState<"json" | "js" | "sql" | "regex">("json");
  const escaped = useMemo(() => {
    if (mode === "json") {
      return JSON.stringify(text);
    }
    if (mode === "js") {
      return JSON.stringify(text).slice(1, -1);
    }
    if (mode === "sql") {
      return text.replace(/'/g, "''");
    }
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }, [text, mode]);
  const unescaped = useMemo(() => {
    if (mode === "json") {
      try {
        return JSON.parse(text) as string;
      } catch {
        return "";
      }
    }
    if (mode === "js") {
      try {
        return JSON.parse(`"${text.replace(/"/g, '\\"')}"`) as string;
      } catch {
        return "";
      }
    }
    if (mode === "sql") {
      return text.replace(/''/g, "'");
    }
    return text;
  }, [text, mode]);
  return (
    <div className="grid gap-4">
      <label className="text-sm">
        Mode
        <select className="ml-2 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}>
          <option value="json">JSON string</option>
          <option value="js">JavaScript string</option>
          <option value="sql">SQL single-quoted</option>
          <option value="regex">Regex escape</option>
        </select>
      </label>
      <ToolInput label="Input" value={text} onChange={setText} minHeight={120} />
      <ToolOutput value={`Escaped:\n${escaped}\n\nUnescape (where applicable):\n${unescaped}`} />
    </div>
  );
}

export function TextMorseTool() {
  const [text, setText] = useState("SOS");
  const toMorse = useMemo(() => {
    return text
      .toUpperCase()
      .split("")
      .map((ch) => {
        if (ch === " ") {
          return "/";
        }
        return MORSE[ch] ?? "?";
      })
      .join(" ");
  }, [text]);
  const play = useCallback(() => {
    const ctx = new AudioContext();
    const freq = 880;
    const dot = 0.07;
    const dash = 0.21;
    const symGap = 0.05;
    const letterGap = 0.18;
    const wordGap = 0.4;
    let when = ctx.currentTime + 0.05;
    const beep = (start: number, dur: number) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = freq;
      o.connect(g);
      g.connect(ctx.destination);
      g.gain.value = 0.1;
      o.start(start);
      o.stop(start + dur);
    };
    for (const ch of toMorse) {
      if (ch === ".") {
        beep(when, dot);
        when += dot + symGap;
      } else if (ch === "-") {
        beep(when, dash);
        when += dash + symGap;
      } else if (ch === " ") {
        when += letterGap;
      } else if (ch === "/") {
        when += wordGap;
      }
    }
    window.setTimeout(() => void ctx.close(), (when - ctx.currentTime) * 1000 + 500);
  }, [toMorse]);
  return (
    <div className="grid gap-4">
      <ToolInput label="Text" value={text} onChange={setText} minHeight={60} />
      <ToolOutput value={toMorse} />
      <button type="button" className="w-fit rounded-lg border px-4 py-2 text-sm" onClick={play}>
        Play (rough)
      </button>
    </div>
  );
}

export function UnicodeInspector() {
  const [text, setText] = useState("A🙂");
  const lines = useMemo(() => {
    const out: string[] = [];
    for (const ch of text) {
      const cp = ch.codePointAt(0);
      out.push(`"${ch}" → U+${cp?.toString(16).toUpperCase().padStart(4, "0")} (decimal ${cp})`);
    }
    return out.join("\n");
  }, [text]);
  return (
    <div className="grid gap-4">
      <ToolInput label="Text" value={text} onChange={setText} minHeight={80} />
      <ToolOutput value={lines} />
    </div>
  );
}
