"use client";

import { useEffect, useState } from "react";

import { ActionBar } from "@/components/tool/ActionBar";
import { ToolInput } from "@/components/tool/ToolInput";
import { ToolOutput } from "@/components/tool/ToolOutput";
import { apiUrl } from "@/lib/api";

export function NetworkSection({ slug }: { slug: string }) {
  switch (slug) {
    case "ip-lookup":
      return <IpLookup />;
    case "dns-lookup":
      return <DnsLookup />;
    case "http-headers":
      return <HttpHeaders />;
    case "ssl-checker":
      return <SslChecker />;
    case "whois-lookup":
      return <WhoisLookup />;
    case "og-preview":
      return <OgPreview />;
    case "robots-tester":
      return <RobotsTester />;
    case "url-expander":
      return <UrlExpand />;
    default:
      return null;
  }
}

function IpLookup() {
  const [ip, setIp] = useState("");
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [err, setErr] = useState("");
  const load = async (target?: string) => {
    try {
      setErr("");
      const url = target
        ? `https://ipapi.co/${encodeURIComponent(target)}/json/`
        : "https://ipapi.co/json/";
      const res = await fetch(url);
      const j = (await res.json()) as Record<string, unknown>;
      setData(j);
      if (!target && typeof j.ip === "string") {
        setIp(j.ip);
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    }
  };
  useEffect(() => {
    void load();
  }, []);
  return (
    <div className="grid gap-4">
      <div className="flex gap-2">
        <input
          className="flex-1 rounded border px-3 py-2"
          placeholder="IP address"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
        />
        <button type="button" className="rounded bg-[var(--blue-primary)] px-4 py-2 text-white" onClick={() => void load(ip)}>
          Look Up
        </button>
      </div>
      {err ? <p className="text-sm text-red-600">{err}</p> : null}
      {data ? (
        <pre className="max-h-96 overflow-auto rounded border bg-[var(--card-bg)] p-3 text-xs">{JSON.stringify(data, null, 2)}</pre>
      ) : null}
    </div>
  );
}

function DnsLookup() {
  const [domain, setDomain] = useState("example.com");
  const [type, setType] = useState("A");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const run = async () => {
    try {
      setErr("");
      const url = new URL("https://cloudflare-dns.com/dns-query");
      url.searchParams.set("name", domain);
      url.searchParams.set("type", type === "ALL" ? "A" : type);
      const res = await fetch(url.toString(), {
        headers: { Accept: "application/dns-json" }
      });
      const j = await res.json();
      const lines = (j.Answer ?? []).map(
        (a: { type: number; name: string; data: string; TTL: number }) =>
          `${a.type}\t${a.name}\t${a.data}\t${a.TTL}`
      );
      setOut(lines.join("\n") || JSON.stringify(j, null, 2));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    }
  };
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        <input className="flex-1 rounded border px-3 py-2" value={domain} onChange={(e) => setDomain(e.target.value)} />
        <select className="rounded border" value={type} onChange={(e) => setType(e.target.value)}>
          {["A", "AAAA", "MX", "TXT", "CNAME", "NS"].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <button type="button" className="rounded bg-[var(--blue-primary)] px-4 py-2 text-white" onClick={() => void run()}>
          Query
        </button>
      </div>
      {err ? <p className="text-red-600">{err}</p> : null}
      <ToolOutput value={out} />
    </div>
  );
}

function HttpHeaders() {
  const [url, setUrl] = useState("https://example.com");
  const [out, setOut] = useState("");
  const run = async () => {
    const res = await fetch(apiUrl(`/api/headers?url=${encodeURIComponent(url)}`));
    const j = await res.json();
    setOut(JSON.stringify(j, null, 2));
  };
  return (
    <div className="grid gap-4">
      <ToolInput value={url} onChange={setUrl} placeholder="https://..." />
      <ActionBar primaryLabel="Fetch Headers" onPrimary={() => void run()} />
      <ToolOutput value={out} />
    </div>
  );
}

function SslChecker() {
  const [host, setHost] = useState("example.com");
  const [out, setOut] = useState("");
  const run = async () => {
    const res = await fetch(apiUrl(`/api/ssl?host=${encodeURIComponent(host)}`));
    const j = await res.json();
    setOut(JSON.stringify(j, null, 2));
  };
  return (
    <div className="grid gap-4">
      <ToolInput value={host} onChange={setHost} placeholder="domain" />
      <ActionBar primaryLabel="Check SSL" onPrimary={() => void run()} />
      <ToolOutput value={out} />
    </div>
  );
}

function WhoisLookup() {
  const [domain, setDomain] = useState("example.com");
  const [out, setOut] = useState("");
  const run = async () => {
    const res = await fetch(`https://who-dat.as93.net/${encodeURIComponent(domain)}`);
    const j = await res.json();
    setOut(JSON.stringify(j, null, 2));
  };
  return (
    <div className="grid gap-4">
      <ToolInput value={domain} onChange={setDomain} />
      <ActionBar primaryLabel="Whois" onPrimary={() => void run()} />
      <ToolOutput value={out} />
    </div>
  );
}

function OgPreview() {
  const [url, setUrl] = useState("https://example.com");
  const [data, setData] = useState<{ og?: Record<string, string>; finalUrl?: string } | null>(null);
  const run = async () => {
    const res = await fetch(apiUrl(`/api/og?url=${encodeURIComponent(url)}`));
    const j = await res.json();
    setData(j);
  };
  const og = data?.og ?? {};
  return (
    <div className="grid gap-4">
      <ToolInput value={url} onChange={setUrl} />
      <ActionBar primaryLabel="Fetch OG" onPrimary={() => void run()} />
      {data ? (
        <div className="grid gap-4 md:grid-cols-3">
          {["og:title", "og:description", "og:image"].map((k) => (
            <div key={k} className="rounded border p-3">
              <div className="text-xs text-[var(--text-tertiary)]">{k}</div>
              <div className="mt-1 text-sm">{og[k] ?? "—"}</div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function RobotsTester() {
  const [domain, setDomain] = useState("example.com");
  const [path, setPath] = useState("/admin");
  const [out, setOut] = useState("");
  const run = async () => {
    const res = await fetch(
      apiUrl(`/api/robots-check?domain=${encodeURIComponent(domain)}&path=${encodeURIComponent(path)}`)
    );
    const j = await res.json();
    setOut(JSON.stringify(j, null, 2));
  };
  return (
    <div className="grid gap-4">
      <ToolInput value={domain} onChange={setDomain} label="Domain" />
      <ToolInput value={path} onChange={setPath} label="Path" />
      <ActionBar primaryLabel="Test" onPrimary={() => void run()} />
      <ToolOutput value={out} />
    </div>
  );
}

function UrlExpand() {
  const [url, setUrl] = useState("https://bit.ly/3x");
  const [out, setOut] = useState("");
  const run = async () => {
    const res = await fetch(apiUrl(`/api/expand-url?url=${encodeURIComponent(url)}`));
    const j = await res.json();
    setOut(JSON.stringify(j, null, 2));
  };
  return (
    <div className="grid gap-4">
      <ToolInput value={url} onChange={setUrl} />
      <ActionBar primaryLabel="Expand" onPrimary={() => void run()} />
      <ToolOutput value={out} />
    </div>
  );
}
