"use client";

import Ajv from "ajv";
import bcrypt from "bcryptjs";
import { CronExpressionParser } from "cron-parser";
import { exportJWK, importSPKI, SignJWT } from "jose";
import { JSONPath } from "jsonpath-plus";
import beautify from "js-beautify";
import { useCallback, useMemo, useState } from "react";
import { minify as minifyJs } from "terser";

import { ToolInput } from "@/components/tool/ToolInput";
import { ToolOutput } from "@/components/tool/ToolOutput";
import { minifyCssBrowser } from "@/lib/css-minify-browser";
import { minifyHtmlBrowser } from "@/lib/html-minify-browser";
import { cssBlockToTailwindHints } from "@/lib/css-to-tailwind-simple";
import { HTTP_STATUS_CODES } from "@/lib/http-status-codes";
import { isValidIBAN } from "ibantools";

function bufToHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function CssMinifier() {
  const [input, setInput] = useState(".foo { color: red; }");
  const out = useMemo(() => {
    try {
      return minifyCssBrowser(input);
    } catch (e) {
      return e instanceof Error ? e.message : "Error";
    }
  }, [input]);
  return (
    <div className="grid gap-4">
      <ToolInput label="CSS" value={input} onChange={setInput} minHeight={160} />
      <ToolOutput value={out} />
    </div>
  );
}

export function JsMinifier() {
  const [input, setInput] = useState("function hello() { console.log('hi'); }");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const run = useCallback(async () => {
    setErr("");
    try {
      const r = await minifyJs(input, { format: { comments: false } });
      setOut(r.code ?? "");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
      setOut("");
    }
  }, [input]);
  return (
    <div className="grid gap-4">
      <ToolInput label="JavaScript" value={input} onChange={setInput} minHeight={160} />
      <button type="button" className="w-fit rounded-lg border border-[var(--blue-primary)] px-4 py-2 text-sm text-[var(--blue-primary)]" onClick={() => void run()}>
        Minify
      </button>
      <ToolOutput value={out} error={err} />
    </div>
  );
}

export function HtmlMinifier() {
  const [input, setInput] = useState("<div>  <p> Hello </p>  </div>");
  const out = useMemo(() => {
    try {
      return minifyHtmlBrowser(input);
    } catch (e) {
      return e instanceof Error ? e.message : "Error";
    }
  }, [input]);
  return (
    <div className="grid gap-4">
      <ToolInput label="HTML" value={input} onChange={setInput} minHeight={160} />
      <ToolOutput value={out} />
    </div>
  );
}

export function CssBeautifier() {
  const [input, setInput] = useState(".a{color:red}.b{margin:0}");
  const out = useMemo(() => {
    try {
      return beautify.css(input, { indent_size: 2 });
    } catch (e) {
      return e instanceof Error ? e.message : "Error";
    }
  }, [input]);
  return (
    <div className="grid gap-4">
      <ToolInput label="CSS" value={input} onChange={setInput} minHeight={160} />
      <ToolOutput value={out} />
    </div>
  );
}

export function HttpStatusCodes() {
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return HTTP_STATUS_CODES.filter((r) => !s || String(r.code).includes(s) || r.phrase.toLowerCase().includes(s) || r.description.toLowerCase().includes(s));
  }, [q]);
  return (
    <div className="grid gap-4">
      <input className="w-full max-w-md rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-2 text-sm" placeholder="Filter…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="overflow-x-auto rounded-lg border border-[var(--border-color)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--border-color)] bg-[var(--bg-tertiary)]">
            <tr>
              <th className="px-3 py-2">Code</th>
              <th className="px-3 py-2">Phrase</th>
              <th className="px-3 py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.code} className="border-b border-[var(--border-color)]">
                <td className="px-3 py-2 font-mono tabular-nums">{r.code}</td>
                <td className="px-3 py-2">{r.phrase}</td>
                <td className="px-3 py-2 text-[var(--text-secondary)]">{r.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function JsonPathTester() {
  const [doc, setDoc] = useState('{"store":{"book":[{"price":8.95}]}}');
  const [path, setPath] = useState("$.store.book[*].price");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const run = useCallback(() => {
    setErr("");
    try {
      const json = JSON.parse(doc) as object;
      const res = JSONPath({ path, json, wrap: false });
      setOut(JSON.stringify(res, null, 2));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
      setOut("");
    }
  }, [doc, path]);
  return (
    <div className="grid gap-4">
      <label className="text-sm">
        JSONPath
        <input className="ml-2 w-full max-w-lg rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1 font-mono" value={path} onChange={(e) => setPath(e.target.value)} />
      </label>
      <ToolInput label="JSON document" value={doc} onChange={setDoc} minHeight={140} />
      <button type="button" className="w-fit rounded-lg border px-4 py-2 text-sm" onClick={run}>
        Evaluate
      </button>
      <ToolOutput value={out} error={err} />
    </div>
  );
}

export function JwtGenerator() {
  const [payload, setPayload] = useState('{"sub":"user123","name":"Ada"}');
  const [secret, setSecret] = useState("dev-secret-change-me");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const run = useCallback(async () => {
    setErr("");
    try {
      const body = JSON.parse(payload) as Record<string, unknown>;
      const key = new TextEncoder().encode(secret);
      const jwt = await new SignJWT(body)
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuedAt()
        .setExpirationTime("2h")
        .sign(key);
      setOut(jwt);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
      setOut("");
    }
  }, [payload, secret]);
  return (
    <div className="grid gap-4">
      <p className="text-sm text-[var(--text-secondary)]">HS256 signing in the browser — use only for local testing.</p>
      <ToolInput label="Payload (JSON)" value={payload} onChange={setPayload} minHeight={100} />
      <label className="text-sm">
        Secret
        <input className="ml-2 w-full max-w-md rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={secret} onChange={(e) => setSecret(e.target.value)} type="password" autoComplete="off" />
      </label>
      <button type="button" className="w-fit rounded-lg border px-4 py-2 text-sm" onClick={() => void run()}>
        Sign JWT
      </button>
      <ToolOutput value={out} error={err} />
    </div>
  );
}

export function CssToTailwind() {
  const [input, setInput] = useState("display: flex;\njustify-content: center;\npadding: 1rem;");
  const out = useMemo(() => cssBlockToTailwindHints(input), [input]);
  return (
    <div className="grid gap-4">
      <p className="text-sm text-[var(--text-secondary)]">Heuristic mapping to Tailwind-style utilities; arbitrary values use [...] where needed.</p>
      <ToolInput label="CSS declarations" value={input} onChange={setInput} minHeight={120} />
      <ToolOutput value={out} />
    </div>
  );
}

export function HmacGenerator() {
  const [msg, setMsg] = useState("message");
  const [secret, setSecret] = useState("key");
  const [algo, setAlgo] = useState<"SHA-256" | "SHA-512">("SHA-256");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const run = useCallback(async () => {
    setErr("");
    try {
      const enc = new TextEncoder();
      const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: algo }, false, ["sign"]);
      const sig = await crypto.subtle.sign("HMAC", key, enc.encode(msg));
      setOut(bufToHex(sig));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
      setOut("");
    }
  }, [msg, secret, algo]);
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-4">
        <label className="text-sm">
          Algorithm
          <select className="ml-2 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={algo} onChange={(e) => setAlgo(e.target.value as typeof algo)}>
            <option value="SHA-256">HMAC-SHA256</option>
            <option value="SHA-512">HMAC-SHA512</option>
          </select>
        </label>
      </div>
      <ToolInput label="Message" value={msg} onChange={setMsg} minHeight={80} />
      <label className="text-sm">
        Secret
        <input className="ml-2 w-full max-w-md rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={secret} onChange={(e) => setSecret(e.target.value)} type="password" autoComplete="off" />
      </label>
      <button type="button" className="w-fit rounded-lg border px-4 py-2 text-sm" onClick={() => void run()}>
        Compute HMAC (hex)
      </button>
      <ToolOutput value={out} error={err} />
    </div>
  );
}

export function BcryptHashTool() {
  const [pw, setPw] = useState("");
  const [rounds, setRounds] = useState(10);
  const [hash, setHash] = useState("");
  const [check, setCheck] = useState("");
  const [verify, setVerify] = useState("");
  const runHash = useCallback(() => {
    setHash(bcrypt.hashSync(pw, rounds));
  }, [pw, rounds]);
  const runVerify = useCallback(() => {
    setVerify(bcrypt.compareSync(pw, check) ? "Match ✓" : "No match");
  }, [pw, check]);
  return (
    <div className="grid gap-4">
      <p className="text-sm text-[var(--text-secondary)]">Runs bcrypt in-browser (can take a second at higher rounds).</p>
      <ToolInput label="Password" value={pw} onChange={setPw} minHeight={48} />
      <label className="text-sm">
        Rounds
        <input type="number" min={4} max={14} className="ml-2 w-20 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={rounds} onChange={(e) => setRounds(Number(e.target.value))} />
      </label>
      <button type="button" className="w-fit rounded-lg border px-4 py-2 text-sm" onClick={runHash}>
        Hash
      </button>
      <ToolOutput value={hash} />
      <label className="text-sm">
        Verify against hash
        <input className="ml-2 w-full rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1 font-mono text-xs" value={check} onChange={(e) => setCheck(e.target.value)} placeholder="$2a$..." />
      </label>
      <button type="button" className="w-fit rounded-lg border px-4 py-2 text-sm" onClick={runVerify}>
        Verify
      </button>
      {verify ? <p className="text-sm">{verify}</p> : null}
    </div>
  );
}

export function PublicKeyInspector() {
  const [pem, setPem] = useState("");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const run = useCallback(async () => {
    setErr("");
    const p = pem.trim();
    for (const alg of ["RS256", "ES256"] as const) {
      try {
        const key = await importSPKI(p, alg);
        const jwk = await exportJWK(key);
        setOut(JSON.stringify(jwk, null, 2));
        return;
      } catch {
        /* try next */
      }
    }
    setErr("Could not parse PEM as SPKI (RSA / EC / Ed25519).");
    setOut("");
  }, [pem]);
  return (
    <div className="grid gap-4">
      <p className="text-sm text-[var(--text-secondary)]">Paste a PEM-encoded SPKI public key (RSA or EC). Private keys are not accepted.</p>
      <ToolInput label="PEM" value={pem} onChange={setPem} minHeight={120} placeholder="-----BEGIN PUBLIC KEY-----..." />
      <button type="button" className="w-fit rounded-lg border px-4 py-2 text-sm" onClick={() => void run()}>
        Export JWK
      </button>
      <ToolOutput value={out} error={err} />
    </div>
  );
}

const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export function EmailValidator() {
  const [v, setV] = useState("test@example.com");
  const ok = useMemo(() => EMAIL_RE.test(v.trim()), [v]);
  return (
    <div className="grid gap-4">
      <p className="text-sm text-[var(--text-secondary)]">Syntax check only — MX lookup requires a server-side DNS API.</p>
      <input className="w-full max-w-md rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-2" value={v} onChange={(e) => setV(e.target.value)} />
      <p className="text-sm">{ok ? "Looks valid (syntax) ✓" : "Invalid email syntax"}</p>
    </div>
  );
}

function luhnValid(digits: string): boolean {
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number.parseInt(digits[i], 10);
    if (Number.isNaN(n)) {
      return false;
    }
    if (alt) {
      n *= 2;
      if (n > 9) {
        n -= 9;
      }
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export function CreditCardValidator() {
  const [v, setV] = useState("4532015112830366");
  const result = useMemo(() => {
    const d = v.replace(/\D/g, "");
    if (d.length < 13 || d.length > 19) {
      return "Wrong length";
    }
    if (!luhnValid(d)) {
      return "Fails Luhn check";
    }
    let type = "Unknown";
    if (/^4/.test(d)) {
      type = "Visa";
    } else if (/^5[1-5]/.test(d)) {
      type = "Mastercard";
    } else if (/^3[47]/.test(d)) {
      type = "Amex";
    } else if (/^6(?:011|5)/.test(d)) {
      type = "Discover";
    }
    return `Valid (Luhn) — ${type}`;
  }, [v]);
  return (
    <div className="grid gap-4">
      <input className="w-full max-w-md rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-2 font-mono" value={v} onChange={(e) => setV(e.target.value)} placeholder="Card number" />
      <p className="text-sm">{result}</p>
      <p className="text-xs text-[var(--text-tertiary)]">Do not enter real card numbers on shared machines.</p>
    </div>
  );
}

export function IbanValidator() {
  const [v, setV] = useState("GB82 WEST 1234 5698 7654 32");
  const ok = useMemo(() => {
    const compact = v.replace(/\s/g, "");
    return compact ? isValidIBAN(compact) : false;
  }, [v]);
  return (
    <div className="grid gap-4">
      <input className="w-full max-w-md rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-2 font-mono" value={v} onChange={(e) => setV(e.target.value)} />
      <p className="text-sm">{ok ? "Valid IBAN checksum ✓" : "Invalid IBAN"}</p>
    </div>
  );
}

function validIpv4(s: string): boolean {
  const p = s.split(".");
  if (p.length !== 4) {
    return false;
  }
  return p.every((part) => {
    if (!/^\d{1,3}$/.test(part)) {
      return false;
    }
    const n = Number(part);
    return n >= 0 && n <= 255;
  });
}

function validIpv6(s: string): boolean {
  if (!s.includes(":")) {
    return false;
  }
  try {
    // Normalized check via URL (not perfect but catches most)
    const u = new URL(`http://[${s}]`);
    return Boolean(u.hostname);
  } catch {
    return false;
  }
}

export function IpValidator() {
  const [v, setV] = useState("192.168.1.1");
  const result = useMemo(() => {
    const t = v.trim();
    if (validIpv4(t)) {
      return "Valid IPv4";
    }
    if (validIpv6(t)) {
      return "Valid IPv6 (basic check)";
    }
    if (t.includes("/")) {
      return "CIDR: enter a bare address; subnet validation not implemented.";
    }
    return "Invalid";
  }, [v]);
  return (
    <div className="grid gap-4">
      <input className="w-full max-w-md rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-2 font-mono" value={v} onChange={(e) => setV(e.target.value)} />
      <p className="text-sm">{result}</p>
    </div>
  );
}

export function JsonSchemaValidator() {
  const [instance, setInstance] = useState('{"name":"Ada","age":30}');
  const [schema, setSchema] = useState('{"type":"object","required":["name"],"properties":{"name":{"type":"string"},"age":{"type":"number"}}}');
  const [out, setOut] = useState("");
  const run = useCallback(() => {
    try {
      const ajv = new Ajv({ allErrors: true, strict: false });
      const validate = ajv.compile(JSON.parse(schema) as object);
      const data = JSON.parse(instance);
      const ok = validate(data);
      if (ok) {
        setOut("Valid ✓");
      } else {
        setOut(JSON.stringify(validate.errors, null, 2));
      }
    } catch (e) {
      setOut(e instanceof Error ? e.message : "Error");
    }
  }, [instance, schema]);
  return (
    <div className="grid gap-4">
      <ToolInput label="JSON instance" value={instance} onChange={setInstance} minHeight={100} />
      <ToolInput label="JSON Schema" value={schema} onChange={setSchema} minHeight={120} />
      <button type="button" className="w-fit rounded-lg border px-4 py-2 text-sm" onClick={run}>
        Validate
      </button>
      <ToolOutput value={out} />
    </div>
  );
}

export function CronValidator() {
  const [expr, setExpr] = useState("0 9 * * 1-5");
  const [out, setOut] = useState("");
  const run = useCallback(() => {
    try {
      let e = expr.trim();
      const f = e.split(/\s+/).length;
      if (f === 5) {
        e = `0 ${e}`;
      }
      const parsed = CronExpressionParser.parse(e, { tz: "UTC" });
      const dates = parsed.take(6);
      setOut(
        ["Valid cron ✓", "Next runs (UTC):", ...dates.map((d, j) => `${j + 1}. ${d.toISOString() ?? ""}`)].join("\n")
      );
    } catch (err) {
      setOut(err instanceof Error ? err.message : "Invalid");
    }
  }, [expr]);
  return (
    <div className="grid gap-4">
      <label className="text-sm">
        Expression (5-field)
        <input className="ml-2 w-full max-w-md rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1 font-mono" value={expr} onChange={(e) => setExpr(e.target.value)} />
      </label>
      <button type="button" className="w-fit rounded-lg border px-4 py-2 text-sm" onClick={run}>
        Parse & next runs
      </button>
      <ToolOutput value={out} />
    </div>
  );
}
