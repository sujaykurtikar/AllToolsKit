"use client";

import { useState } from "react";

import { ActionBar } from "@/components/tool/ActionBar";
import { ToolInput } from "@/components/tool/ToolInput";
import { ToolOutput } from "@/components/tool/ToolOutput";
import CryptoJS from "crypto-js";

import { parseCsv, rowsToObjects } from "@/lib/csv-helpers";

export function FileSection({ slug }: { slug: string }) {
  switch (slug) {
    case "csv-to-json":
      return <CsvJson />;
    case "csv-to-table":
      return <CsvTable />;
    case "file-hash":
      return <FileHash />;
    case "file-size":
      return <FileSize />;
    default:
      return null;
  }
}

function CsvJson() {
  const [text, setText] = useState("a,b\n1,2");
  const [delim, setDelim] = useState(",");
  const [header, setHeader] = useState(true);
  const [out, setOut] = useState("");
  const run = () => {
    const d = delim === "tab" ? "\t" : delim;
    const rows = parseCsv(text, d);
    const objs = rowsToObjects(rows, header);
    setOut(JSON.stringify(objs, null, 2));
  };
  return (
    <div className="grid gap-4">
      <ToolInput value={text} onChange={setText} />
      <div className="flex gap-4 text-sm">
        <label>
          Delimiter
          <select className="ml-2 rounded border" value={delim} onChange={(e) => setDelim(e.target.value)}>
            <option value=",">,</option>
            <option value=";">;</option>
            <option value="tab">Tab</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={header} onChange={(e) => setHeader(e.target.checked)} />
          Header row
        </label>
      </div>
      <ActionBar primaryLabel="Convert" onPrimary={run} />
      <ToolOutput value={out} />
    </div>
  );
}

function CsvTable() {
  const [text, setText] = useState("a,b\n1,2");
  const rows = parseCsv(text, ",");
  return (
    <div className="grid gap-4">
      <ToolInput value={text} onChange={setText} />
      <div className="overflow-auto rounded border">
        <table className="min-w-full text-sm">
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b">
                {r.map((c, j) => (
                  <td key={j} className="px-2 py-1">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-[var(--text-secondary)]">
        {rows.length} rows × {rows[0]?.length ?? 0} cols
      </p>
    </div>
  );
}

function hex(buf: ArrayBuffer) {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function md5Buffer(buf: ArrayBuffer): string {
  const wa = CryptoJS.lib.WordArray.create(new Uint8Array(buf));
  return CryptoJS.MD5(wa).toString();
}

function FileHash() {
  const [out, setOut] = useState("");
  const [progress, setProgress] = useState(0);
  const onFile = async (f: FileList | null) => {
    const file = f?.[0];
    if (!file) {
      return;
    }
    setProgress(0);
    const buf = await file.arrayBuffer();
    setProgress(50);
    const sha1 = await crypto.subtle.digest("SHA-1", buf);
    const sha256 = await crypto.subtle.digest("SHA-256", buf);
    const sha512 = await crypto.subtle.digest("SHA-512", buf);
    const md5 = md5Buffer(buf);
    setProgress(100);
    setOut(
      [
        `MD5:    ${md5}`,
        `SHA-1:  ${hex(sha1)}`,
        `SHA-256: ${hex(sha256)}`,
        `SHA-512: ${hex(sha512)}`
      ].join("\n")
    );
  };
  return (
    <div className="grid gap-4">
      <input type="file" onChange={(e) => void onFile(e.target.files)} />
      <progress value={progress} max={100} className="w-full" />
      <ToolOutput value={out} />
    </div>
  );
}

function FileSize() {
  const [n, setN] = useState("1024");
  const [unit, setUnit] = useState("B");
  const bytes = Number(n) * (unit === "KB" ? 1000 : unit === "MB" ? 1e6 : unit === "GB" ? 1e9 : unit === "KiB" ? 1024 : unit === "MiB" ? 1024 ** 2 : unit === "GiB" ? 1024 ** 3 : 1);
  const out = [
    `${bytes} bytes`,
    `${(bytes / 1000).toFixed(3)} KB (SI)`,
    `${(bytes / 1024).toFixed(3)} KiB`
  ].join("\n");
  return (
    <div className="grid gap-4">
      <div className="flex gap-2">
        <input className="rounded border px-2" value={n} onChange={(e) => setN(e.target.value)} />
        <select className="rounded border" value={unit} onChange={(e) => setUnit(e.target.value)}>
          {["B", "KB", "MB", "GB", "KiB", "MiB", "GiB"].map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>
      <ToolOutput value={out} />
    </div>
  );
}
