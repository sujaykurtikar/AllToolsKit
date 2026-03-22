"use client";

import CryptoJS from "crypto-js";
import cronstrue from "cronstrue";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import yaml from "js-yaml";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";
import { useEffect, useMemo, useState } from "react";
import { format } from "sql-formatter";
import { v4 as uuidv4, v7 as uuidv7 } from "uuid";

import { ActionBar } from "@/components/tool/ActionBar";
import { ToolInput } from "@/components/tool/ToolInput";
import { ToolOutput } from "@/components/tool/ToolOutput";
import { ToolShortcuts } from "@/components/tool/ToolShortcuts";
import {
  jsonToJavaClass,
  jsonToPythonDataclass,
  jsonToTsInterface,
  jsonToTsType
} from "@/lib/json-codegen";
import { objectsToCsv, parseCsv, rowsToObjects } from "@/lib/csv-helpers";
import { computeLineDiff, lineDiffSummary } from "@/lib/line-diff";
import {
  decodeBase64,
  encodeBase64,
  formatJson,
  generateCSharp,
  generateGuids
} from "@/lib/tool-utils";
import {
  BcryptHashTool,
  CreditCardValidator,
  CronValidator,
  CssBeautifier,
  CssMinifier,
  CssToTailwind,
  EmailValidator,
  HmacGenerator,
  HtmlMinifier,
  HttpStatusCodes,
  IbanValidator,
  IpValidator,
  JsMinifier,
  JsonPathTester,
  JsonSchemaValidator,
  JwtGenerator,
  PublicKeyInspector
} from "@/components/tool-sections/audit/dev-tools";

function paste(set: (s: string) => void) {
  void navigator.clipboard.readText().then(set).catch(() => {});
}

export function DeveloperSection({ slug }: { slug: string }) {
  switch (slug) {
    case "json-formatter":
      return <JsonFormatter />;
    case "json-to-csharp":
      return <JsonToCSharp />;
    case "json-to-typescript":
      return <JsonToTs />;
    case "json-to-python":
      return <JsonToPython />;
    case "json-to-java":
      return <JsonToJava />;
    case "json-yaml":
      return <JsonYaml />;
    case "json-csv":
      return <JsonCsv />;
    case "json-xml":
      return <JsonXml />;
    case "xml-formatter":
      return <XmlFormatter />;
    case "yaml-validator":
      return <YamlValidator />;
    case "guid-generator":
      return <GuidGen />;
    case "jwt-decoder":
      return <JwtDecode />;
    case "regex-tester":
      return <RegexTester />;
    case "url-encoder":
      return <UrlEnc />;
    case "base64":
      return <Base64Tool />;
    case "html-entities":
      return <HtmlEnt />;
    case "hash-generator":
      return <HashGen />;
    case "cron-parser":
      return <CronP />;
    case "sql-formatter":
      return <SqlFmt />;
    case "markdown-preview":
      return <MdPrev />;
    case "diff-checker":
      return <DiffChk />;
    case "lorem-ipsum":
      return <Lorem />;
    case "css-minifier":
      return <CssMinifier />;
    case "js-minifier":
      return <JsMinifier />;
    case "html-minifier":
      return <HtmlMinifier />;
    case "css-beautifier":
      return <CssBeautifier />;
    case "http-status-codes":
      return <HttpStatusCodes />;
    case "json-path":
      return <JsonPathTester />;
    case "jwt-generator":
      return <JwtGenerator />;
    case "css-to-tailwind":
      return <CssToTailwind />;
    case "hmac-generator":
      return <HmacGenerator />;
    case "bcrypt-hash":
      return <BcryptHashTool />;
    case "public-key-inspector":
      return <PublicKeyInspector />;
    case "email-validator":
      return <EmailValidator />;
    case "credit-card-validator":
      return <CreditCardValidator />;
    case "iban-validator":
      return <IbanValidator />;
    case "ip-validator":
      return <IpValidator />;
    case "json-schema-validator":
      return <JsonSchemaValidator />;
    case "cron-validator":
      return <CronValidator />;
    default:
      return null;
  }
}

function JsonFormatter() {
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const run = (mode: "fmt" | "min" | "val") => {
    try {
      setErr("");
      if (mode === "val") {
        JSON.parse(input);
        setOut("Valid JSON ✓");
        return;
      }
      setOut(formatJson(input, mode === "fmt" ? 2 : 0));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Invalid JSON");
      setOut("");
    }
  };
  return (
    <div className="grid gap-4">
      <ToolInput
        value={input}
        onChange={setInput}
        onPaste={() => paste(setInput)}
        onClear={() => setInput("")}
        onSample={() =>
          setInput(JSON.stringify({ id: 1, name: "Tool", tags: ["json", "dev"] }, null, 2))
        }
        placeholder="Paste JSON"
      />
      <ActionBar
        primaryLabel="Format"
        onPrimary={() => run("fmt")}
        secondary={[
          { label: "Minify", onClick: () => run("min") },
          { label: "Validate", onClick: () => run("val") }
        ]}
      />
      <ToolShortcuts />
      <ToolOutput value={out} error={err} />
    </div>
  );
}

function JsonToCSharp() {
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const run = () => {
    try {
      setErr("");
      setOut(generateCSharp(input));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
      setOut("");
    }
  };
  return (
    <div className="grid gap-4">
      <ToolInput value={input} onChange={setInput} onPaste={() => paste(setInput)} onClear={() => setInput("")} />
      <ActionBar primaryLabel="Generate Class" onPrimary={run} />
      <ToolShortcuts />
      <ToolOutput value={out} error={err} />
    </div>
  );
}

function JsonToTs() {
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const [mode, setMode] = useState<"iface" | "type">("iface");
  const run = () => {
    try {
      setErr("");
      setOut(mode === "iface" ? jsonToTsInterface(input) : jsonToTsType(input));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
      setOut("");
    }
  };
  return (
    <div className="grid gap-4">
      <ToolInput value={input} onChange={setInput} onPaste={() => paste(setInput)} onClear={() => setInput("")} />
      <div className="flex gap-2">
        <button
          type="button"
          className={`rounded-lg px-3 py-2 text-sm ${mode === "iface" ? "bg-[var(--blue-primary)] text-white" : "border"}`}
          onClick={() => setMode("iface")}
        >
          Interface
        </button>
        <button
          type="button"
          className={`rounded-lg px-3 py-2 text-sm ${mode === "type" ? "bg-[var(--blue-primary)] text-white" : "border"}`}
          onClick={() => setMode("type")}
        >
          Type
        </button>
      </div>
      <ActionBar primaryLabel="Generate" onPrimary={run} />
      <ToolShortcuts />
      <ToolOutput value={out} error={err} />
    </div>
  );
}

function JsonToPython() {
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const run = () => {
    try {
      setErr("");
      setOut(jsonToPythonDataclass(input));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
      setOut("");
    }
  };
  return (
    <div className="grid gap-4">
      <ToolInput value={input} onChange={setInput} onPaste={() => paste(setInput)} onClear={() => setInput("")} />
      <ActionBar primaryLabel="Generate Dataclass" onPrimary={run} />
      <ToolShortcuts />
      <ToolOutput value={out} error={err} />
    </div>
  );
}

function JsonToJava() {
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const run = () => {
    try {
      setErr("");
      setOut(jsonToJavaClass(input));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
      setOut("");
    }
  };
  return (
    <div className="grid gap-4">
      <ToolInput value={input} onChange={setInput} onPaste={() => paste(setInput)} onClear={() => setInput("")} />
      <ActionBar primaryLabel="Generate Class" onPrimary={run} />
      <ToolShortcuts />
      <ToolOutput value={out} error={err} />
    </div>
  );
}

function JsonYaml() {
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const toYaml = () => {
    try {
      setErr("");
      const j = JSON.parse(input);
      setOut(yaml.dump(j));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
      setOut("");
    }
  };
  const toJson = () => {
    try {
      setErr("");
      const y = yaml.load(input);
      setOut(JSON.stringify(y, null, 2));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
      setOut("");
    }
  };
  return (
    <div className="grid gap-4">
      <ToolInput value={input} onChange={setInput} onPaste={() => paste(setInput)} onClear={() => setInput("")} />
      <ActionBar primaryLabel="JSON → YAML" onPrimary={toYaml} secondary={[{ label: "YAML → JSON", onClick: toJson }]} />
      <ToolShortcuts />
      <ToolOutput value={out} error={err} />
    </div>
  );
}

function JsonCsv() {
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const toCsv = () => {
    try {
      setErr("");
      const arr = JSON.parse(input) as Record<string, string>[];
      if (!Array.isArray(arr) || !arr.length) {
        throw new Error("JSON must be a non-empty array of objects.");
      }
      setOut(objectsToCsv(arr));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
      setOut("");
    }
  };
  const toJson = () => {
    try {
      setErr("");
      const rows = parseCsv(input, ",");
      const objs = rowsToObjects(rows, true);
      setOut(JSON.stringify(objs, null, 2));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
      setOut("");
    }
  };
  return (
    <div className="grid gap-4">
      <ToolInput value={input} onChange={setInput} onPaste={() => paste(setInput)} onClear={() => setInput("")} />
      <ActionBar primaryLabel="JSON → CSV" onPrimary={toCsv} secondary={[{ label: "CSV → JSON", onClick: toJson }]} />
      <ToolShortcuts />
      <ToolOutput value={out} error={err} />
    </div>
  );
}

function JsonXml() {
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const parser = new XMLParser({ ignoreAttributes: false });
  const builder = new XMLBuilder({ format: true, ignoreAttributes: false });
  const toXml = () => {
    try {
      setErr("");
      const j = JSON.parse(input);
      setOut(builder.build(j));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
      setOut("");
    }
  };
  const toJson = () => {
    try {
      setErr("");
      const j = parser.parse(input);
      setOut(JSON.stringify(j, null, 2));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
      setOut("");
    }
  };
  return (
    <div className="grid gap-4">
      <ToolInput value={input} onChange={setInput} onPaste={() => paste(setInput)} onClear={() => setInput("")} />
      <ActionBar primaryLabel="JSON → XML" onPrimary={toXml} secondary={[{ label: "XML → JSON", onClick: toJson }]} />
      <ToolShortcuts />
      <ToolOutput value={out} error={err} />
    </div>
  );
}

function XmlFormatter() {
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const parser = new XMLParser({ ignoreAttributes: false });
  const builder = new XMLBuilder({ format: true, ignoreAttributes: false });
  const fmt = () => {
    try {
      setErr("");
      const j = parser.parse(input);
      setOut(builder.build(j));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
      setOut("");
    }
  };
  const min = () => {
    try {
      setErr("");
      const j = parser.parse(input);
      const b = new XMLBuilder({ format: false });
      setOut(b.build(j));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
      setOut("");
    }
  };
  const val = () => {
    try {
      setErr("");
      parser.parse(input);
      setOut("Valid XML ✓");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Invalid");
      setOut("");
    }
  };
  return (
    <div className="grid gap-4">
      <ToolInput value={input} onChange={setInput} onPaste={() => paste(setInput)} onClear={() => setInput("")} />
      <ActionBar
        primaryLabel="Format"
        onPrimary={fmt}
        secondary={[
          { label: "Minify", onClick: min },
          { label: "Validate", onClick: val }
        ]}
      />
      <ToolShortcuts />
      <ToolOutput value={out} error={err} />
    </div>
  );
}

function YamlValidator() {
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const val = () => {
    try {
      setErr("");
      const doc = yaml.load(input);
      const keys = doc && typeof doc === "object" ? Object.keys(doc as object).length : 0;
      setOut(`Valid YAML ✓ (top-level keys: ${keys})`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Invalid");
      setOut("");
    }
  };
  const fmt = () => {
    try {
      setErr("");
      const doc = yaml.load(input);
      setOut(yaml.dump(doc));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
      setOut("");
    }
  };
  return (
    <div className="grid gap-4">
      <ToolInput value={input} onChange={setInput} onPaste={() => paste(setInput)} onClear={() => setInput("")} />
      <ActionBar primaryLabel="Validate" onPrimary={val} secondary={[{ label: "Format", onClick: fmt }]} />
      <ToolShortcuts />
      <ToolOutput value={out} error={err} />
    </div>
  );
}

function GuidGen() {
  const [count, setCount] = useState(5);
  const [version, setVersion] = useState<"v4" | "v7">("v4");
  const [upper, setUpper] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [out, setOut] = useState("");
  const gen = () => {
    const n = Math.min(100, Math.max(1, count));
    const lines: string[] = [];
    for (let i = 0; i < n; i++) {
      let id = version === "v4" ? uuidv4() : uuidv7();
      if (!hyphens) {
        id = id.replace(/-/g, "");
      }
      if (upper) {
        id = id.toUpperCase();
      }
      lines.push(id);
    }
    setOut(lines.join("\n"));
  };
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-4">
        <label className="text-sm text-[var(--text-primary)]">
          Count
          <input
            type="number"
            min={1}
            max={100}
            className="ml-2 min-w-[4.5rem] rounded border border-[var(--border-color)] bg-[var(--input-bg)] px-2 py-1.5 text-[var(--text-primary)]"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
        </label>
        <label className="text-sm text-[var(--text-primary)]">
          Version
          <select
            className="ml-2 rounded border border-[var(--border-color)] bg-[var(--input-bg)] px-2 py-1.5 text-[var(--text-primary)]"
            value={version}
            onChange={(e) => setVersion(e.target.value as "v4" | "v7")}
          >
            <option value="v4">v4</option>
            <option value="v7">v7</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} />
          Uppercase
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={hyphens} onChange={(e) => setHyphens(e.target.checked)} />
          Hyphens
        </label>
      </div>
      <ActionBar primaryLabel="Generate" onPrimary={gen} />
      <ToolOutput value={out} />
      <button
        type="button"
        className="rounded-lg border px-3 py-2 text-sm"
        onClick={() => navigator.clipboard.writeText(out)}
      >
        Copy all
      </button>
    </div>
  );
}

function JwtDecode() {
  const [input, setInput] = useState("");
  const parts = useMemo(() => {
    const s = input.trim();
    const seg = s.split(".");
    if (seg.length < 2) {
      return null;
    }
    try {
      const decode = (b: string) =>
        JSON.stringify(JSON.parse(atob(b.replace(/-/g, "+").replace(/_/g, "/").padEnd(4 * Math.ceil(b.length / 4), "="))), null, 2);
      const header = decode(seg[0]);
      const payload = decode(seg[1]);
      const sig = seg.slice(2).join(".") || "";
      let expInfo = "";
      try {
        const p = JSON.parse(
          atob(seg[1].replace(/-/g, "+").replace(/_/g, "/").padEnd(4 * Math.ceil(seg[1].length / 4), "="))
        ) as { exp?: number };
        if (p.exp) {
          const d = new Date(p.exp * 1000);
          const expired = d.getTime() < Date.now();
          expInfo = `${d.toISOString()} — ${expired ? "Expired" : "Valid"}`;
        }
      } catch {
        /* ignore */
      }
      return { header, payload, sig, expInfo };
    } catch {
      return null;
    }
  }, [input]);

  return (
    <div className="grid gap-4">
      <ToolInput value={input} onChange={setInput} placeholder="Paste JWT" />
      {parts ? (
        <div className="grid gap-3 md:grid-cols-3">
          <ToolOutput label="Header" value={parts.header} />
          <ToolOutput label="Payload" value={parts.payload} />
          <div>
            <p className="text-[11px] uppercase text-[var(--text-tertiary)]">Signature</p>
            <pre className="mt-1 max-h-48 overflow-auto rounded border bg-[var(--bg-tertiary)] p-2 text-xs">{parts.sig}</pre>
            {parts.expInfo ? <p className="mt-2 text-sm text-[var(--green)]">{parts.expInfo}</p> : null}
          </div>
        </div>
      ) : (
        <p className="text-sm text-[var(--text-tertiary)]">Enter a JWT to decode.</p>
      )}
    </div>
  );
}

function RegexTester() {
  const [pattern, setPattern] = useState("[a-z]+");
  const [flags, setFlags] = useState("gi");
  const [text, setText] = useState("Hello regex");
  const { result, err } = useMemo(() => {
    try {
      const re = new RegExp(pattern, flags);
      const matches = text.match(re);
      const all = Array.from(text.matchAll(re));
      return {
        result: { matches, all, count: matches ? matches.length : 0 },
        err: ""
      };
    } catch (e) {
      return {
        result: null,
        err: e instanceof Error ? e.message : "Invalid regex"
      };
    }
  }, [pattern, flags, text]);

  return (
    <div className="grid gap-4">
      <div className="grid gap-2 md:grid-cols-2">
        <label className="text-sm">
          Pattern
          <input
            className={`mt-1 w-full rounded border px-2 py-2 font-mono ${err ? "border-red-500" : ""}`}
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
          />
        </label>
        <label className="text-sm">
          Flags
          <input className="mt-1 w-full rounded border px-2 py-2" value={flags} onChange={(e) => setFlags(e.target.value)} />
        </label>
      </div>
      <ToolInput label="Test string" value={text} onChange={setText} />
      {result ? (
        <div className="text-sm">
          <p>
            Matches: {result.count} — {result.matches?.join(", ") ?? ""}
          </p>
          <ul className="mt-2 list-disc pl-5">
            {result.all.slice(0, 20).map((m, i) => (
              <li key={i}>
                {m[0]} {m.length > 1 ? `(${m.slice(1).join(", ")})` : ""}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-red-600">{err}</p>
      )}
    </div>
  );
}

function UrlEnc() {
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  const enc = () => setOut(encodeURIComponent(input));
  const dec = () => {
    try {
      setOut(decodeURIComponent(input));
    } catch {
      setOut("Invalid");
    }
  };
  const encUri = () => setOut(encodeURI(input));
  return (
    <div className="grid gap-4">
      <ToolInput value={input} onChange={setInput} />
      <ActionBar
        primaryLabel="Encode (component)"
        onPrimary={enc}
        secondary={[
          { label: "Decode", onClick: dec },
          { label: "Encode URI", onClick: encUri }
        ]}
      />
      <ToolOutput value={out} />
    </div>
  );
}

function Base64Tool() {
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const [mode, setMode] = useState<"text" | "file">("text");
  const enc = () => {
    try {
      setErr("");
      setOut(encodeBase64(input));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "");
    }
  };
  const dec = () => {
    try {
      setErr("");
      setOut(decodeBase64(input));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "");
    }
  };
  const onFile = (f: FileList | null) => {
    const file = f?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setOut(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  };
  return (
    <div className="grid gap-4">
      <div className="flex gap-2">
        <button type="button" className={mode === "text" ? "font-bold" : ""} onClick={() => setMode("text")}>
          Text
        </button>
        <button type="button" className={mode === "file" ? "font-bold" : ""} onClick={() => setMode("file")}>
          File
        </button>
      </div>
      {mode === "text" ? (
        <ToolInput value={input} onChange={setInput} />
      ) : (
        <input type="file" onChange={(e) => onFile(e.target.files)} />
      )}
      <ActionBar primaryLabel="Encode" onPrimary={enc} secondary={[{ label: "Decode", onClick: dec }]} />
      <ToolOutput value={out} error={err} />
    </div>
  );
}

function HtmlEnt() {
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  const enc = () => {
    const ta = document.createElement("textarea");
    ta.textContent = input;
    setOut(ta.innerHTML);
  };
  const dec = () => {
    const ta = document.createElement("textarea");
    ta.innerHTML = input;
    setOut(ta.value);
  };
  return (
    <div className="grid gap-4">
      <ToolInput value={input} onChange={setInput} />
      <ActionBar primaryLabel="Encode" onPrimary={enc} secondary={[{ label: "Decode", onClick: dec }]} />
      <ToolOutput value={out} />
    </div>
  );
}

function HashGen() {
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  const run = async () => {
    const enc = new TextEncoder().encode(input);
    const md5 = CryptoJS.MD5(input).toString();
    const sha1 = CryptoJS.SHA1(input).toString();
    const sha256 = await crypto.subtle.digest("SHA-256", enc);
    const sha512 = await crypto.subtle.digest("SHA-512", enc);
    const hex = (b: ArrayBuffer) =>
      Array.from(new Uint8Array(b))
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("");
    setOut(
      [`MD5:    ${md5}`, `SHA-1:  ${sha1}`, `SHA-256: ${hex(sha256)}`, `SHA-512: ${hex(sha512)}`].join("\n")
    );
  };
  return (
    <div className="grid gap-4">
      <ToolInput value={input} onChange={setInput} />
      <ActionBar primaryLabel="Generate All" onPrimary={() => void run()} />
      <ToolOutput value={out} />
    </div>
  );
}

function CronP() {
  const [input, setInput] = useState("*/5 * * * *");
  const [out, setOut] = useState("");
  useEffect(() => {
    try {
      setOut(cronstrue.toString(input));
    } catch {
      setOut("Invalid cron");
    }
  }, [input]);
  return (
    <div className="grid gap-4">
      <ToolInput value={input} onChange={setInput} />
      <ToolOutput value={out} />
    </div>
  );
}

function SqlFmt() {
  const [input, setInput] = useState("select * from users where id=1");
  const [dialect, setDialect] = useState("sql");
  const [out, setOut] = useState("");
  const run = () => {
    try {
      const lang =
        dialect === "mysql"
          ? "mysql"
          : dialect === "postgresql"
            ? "postgresql"
            : dialect === "sqlite"
              ? "sqlite"
              : dialect === "tsql"
                ? "tsql"
                : "sql";
      setOut(format(input, { language: lang }));
    } catch (e) {
      setOut(e instanceof Error ? e.message : "");
    }
  };
  return (
    <div className="grid gap-4">
      <label className="text-sm">
        Dialect
        <select className="ml-2 rounded border" value={dialect} onChange={(e) => setDialect(e.target.value)}>
          <option value="sql">Generic</option>
          <option value="mysql">MySQL</option>
          <option value="postgresql">PostgreSQL</option>
          <option value="sqlite">SQLite</option>
          <option value="tsql">MSSQL</option>
        </select>
      </label>
      <ToolInput value={input} onChange={setInput} />
      <ActionBar primaryLabel="Format" onPrimary={run} />
      <ToolOutput value={out} />
    </div>
  );
}

function MdPrev() {
  const [input, setInput] = useState("# Hello\n\n**world**");
  const html = useMemo(() => {
    const raw = marked.parse(input, { async: false }) as string;
    return DOMPurify.sanitize(raw);
  }, [input]);
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ToolInput value={input} onChange={setInput} />
      <div className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-4 prose prose-sm max-w-none dark:prose-invert">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}

function DiffChk() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const rows = useMemo(() => computeLineDiff(a, b), [a, b]);
  const sum = useMemo(() => lineDiffSummary(rows), [rows]);
  return (
    <div className="grid gap-4">
      <div className="grid gap-2 md:grid-cols-2">
        <ToolInput label="Original" value={a} onChange={setA} minHeight={160} />
        <ToolInput label="Modified" value={b} onChange={setB} minHeight={160} />
      </div>
      <ActionBar
        primaryLabel="Compare"
        onPrimary={() => {}}
      />
      <p className="text-sm">
        +{sum.added} added, -{sum.removed} removed
      </p>
      <div className="max-h-96 overflow-auto rounded border font-mono text-sm">
        {rows.map((r, i) => (
          <div
            key={i}
            className={
              r.type === "add"
                ? "bg-green-100 dark:bg-green-900/30"
                : r.type === "remove"
                  ? "bg-red-100 dark:bg-red-900/30"
                  : "bg-gray-50 dark:bg-gray-800/50"
            }
          >
            {r.text}
          </div>
        ))}
      </div>
    </div>
  );
}

function Lorem() {
  const corpus =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
  const [count, setCount] = useState(3);
  const [type, setType] = useState<"words" | "sentences" | "paragraphs">("sentences");
  const [out, setOut] = useState("");
  const gen = () => {
    if (type === "words") {
      setOut(corpus.split(" ").slice(0, count).join(" "));
    } else if (type === "sentences") {
      setOut(Array.from({ length: count }, () => corpus).join(" "));
    } else {
      setOut(Array.from({ length: count }, () => corpus + "\n\n").join(""));
    }
  };
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-4">
        <label className="text-sm">
          Count
          <input type="number" className="ml-2 rounded border px-2" min={1} value={count} onChange={(e) => setCount(Number(e.target.value))} />
        </label>
        <select className="rounded border" value={type} onChange={(e) => setType(e.target.value as typeof type)}>
          <option value="words">Words</option>
          <option value="sentences">Sentences</option>
          <option value="paragraphs">Paragraphs</option>
        </select>
      </div>
      <ActionBar primaryLabel="Generate" onPrimary={gen} />
      <ToolOutput value={out} />
    </div>
  );
}
