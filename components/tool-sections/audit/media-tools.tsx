"use client";

import { parse as parseExif } from "exifr";
import { useCallback, useRef, useState } from "react";

import { ToolOutput } from "@/components/tool/ToolOutput";

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("load"));
    };
    img.src = url;
  });
}

function mimeToExt(m: "image/jpeg" | "image/webp" | "image/png"): string {
  if (m === "image/jpeg") {
    return "jpg";
  }
  if (m === "image/webp") {
    return "webp";
  }
  return "png";
}

function stripExtension(name: string): string {
  const i = name.lastIndexOf(".");
  return i > 0 ? name.slice(0, i) : name;
}

export function ImageCompressor() {
  const [quality, setQuality] = useState(0.82);
  const [fmt, setFmt] = useState<"image/jpeg" | "image/webp" | "image/png">("image/jpeg");
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [outUrl, setOutUrl] = useState("");
  const outUrlRef = useRef<string | null>(null);
  const [meta, setMeta] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const revokeOutput = useCallback(() => {
    if (outUrlRef.current) {
      URL.revokeObjectURL(outUrlRef.current);
      outUrlRef.current = null;
    }
    setOutUrl("");
  }, []);

  const compress = useCallback(async () => {
    if (!sourceFile) {
      return;
    }
    setBusy(true);
    setErr("");
    revokeOutput();
    try {
      const img = await loadImage(sourceFile);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setErr("Could not use canvas.");
        return;
      }
      ctx.drawImage(img, 0, 0);
      const blob = await new Promise<Blob | null>((res) =>
        canvas.toBlob(res, fmt, fmt === "image/png" ? undefined : quality)
      );
      if (!blob) {
        setErr("Could not encode image.");
        return;
      }
      const url = URL.createObjectURL(blob);
      outUrlRef.current = url;
      setOutUrl(url);
      setMeta(`Original ~${(sourceFile.size / 1024).toFixed(1)} KB → output ~${(blob.size / 1024).toFixed(1)} KB`);
    } catch {
      setErr("Compression failed. Try another image or format.");
    } finally {
      setBusy(false);
    }
  }, [fmt, quality, revokeOutput, sourceFile]);

  const downloadName =
    sourceFile != null ? `${stripExtension(sourceFile.name)}-compressed.${mimeToExt(fmt)}` : `compressed.${mimeToExt(fmt)}`;

  return (
    <div className="grid gap-4">
      <p className="text-sm text-[var(--text-secondary)]">Runs entirely in your browser. PNG ignores quality; use JPEG or WebP for lossy compression.</p>
      <div className="flex flex-wrap gap-4">
        <label className="text-sm">
          Format
          <select className="ml-2 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={fmt} onChange={(e) => setFmt(e.target.value as typeof fmt)}>
            <option value="image/jpeg">JPEG</option>
            <option value="image/webp">WebP</option>
            <option value="image/png">PNG</option>
          </select>
        </label>
        <label className="text-sm">
          Quality {quality.toFixed(2)}
          <input type="range" min={0.3} max={1} step={0.02} className="ml-2" value={quality} onChange={(e) => setQuality(Number(e.target.value))} />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              setSourceFile(f);
              setMeta("");
              setErr("");
              revokeOutput();
            }
            e.target.value = "";
          }}
        />
        {sourceFile ? <span className="text-sm text-[var(--text-secondary)]">{sourceFile.name}</span> : null}
        <button
          type="button"
          disabled={!sourceFile || busy}
          className="rounded-lg border border-[var(--blue-primary)] bg-[var(--blue-primary)] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => void compress()}
        >
          {busy ? "Compressing…" : "Compress"}
        </button>
        {outUrl ? (
          <a
            href={outUrl}
            download={downloadName}
            className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium hover:border-[var(--blue-primary)]"
          >
            Download
          </a>
        ) : null}
      </div>
      {err ? <p className="text-sm text-amber-600">{err}</p> : null}
      {meta ? <p className="text-sm text-[var(--text-secondary)]">{meta}</p> : null}
      {outUrl ? (
        <div className="flex flex-wrap gap-4">
          <img src={outUrl} alt="Compressed preview" className="max-h-48 rounded border" />
        </div>
      ) : null}
    </div>
  );
}

export function ImageResizer() {
  const [w, setW] = useState("");
  const [h, setH] = useState("");
  const [pct, setPct] = useState("100");
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [outUrl, setOutUrl] = useState("");
  const outUrlRef = useRef<string | null>(null);
  const [busy, setBusy] = useState(false);

  const revokeOutput = useCallback(() => {
    if (outUrlRef.current) {
      URL.revokeObjectURL(outUrlRef.current);
      outUrlRef.current = null;
    }
    setOutUrl("");
  }, []);

  const run = useCallback(async () => {
    if (!sourceFile) {
      return;
    }
    setBusy(true);
    revokeOutput();
    try {
      const img = await loadImage(sourceFile);
      let nw = img.naturalWidth;
      let nh = img.naturalHeight;
      const wp = Number.parseInt(w, 10);
      const hp = Number.parseInt(h, 10);
      const p = Number.parseFloat(pct);
      if (Number.isFinite(p) && p > 0 && p !== 100) {
        nw = Math.round((nw * p) / 100);
        nh = Math.round((nh * p) / 100);
      } else if (Number.isFinite(wp) && wp > 0) {
        const r = wp / img.naturalWidth;
        nw = wp;
        nh = Math.round(img.naturalHeight * r);
      } else if (Number.isFinite(hp) && hp > 0) {
        const r = hp / img.naturalHeight;
        nh = hp;
        nw = Math.round(img.naturalWidth * r);
      }
      const canvas = document.createElement("canvas");
      canvas.width = nw;
      canvas.height = nh;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }
      ctx.drawImage(img, 0, 0, nw, nh);
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, sourceFile.type || "image/png"));
      if (blob) {
        const url = URL.createObjectURL(blob);
        outUrlRef.current = url;
        setOutUrl(url);
      }
    } finally {
      setBusy(false);
    }
  }, [w, h, pct, revokeOutput, sourceFile]);

  const ext =
    sourceFile?.type === "image/jpeg"
      ? "jpg"
      : sourceFile?.type === "image/webp"
        ? "webp"
        : sourceFile?.type === "image/gif"
          ? "gif"
          : "png";
  const downloadName = sourceFile != null ? `${stripExtension(sourceFile.name)}-resized.${ext}` : `resized.${ext}`;

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-4">
        <label className="text-sm">
          Width (px)
          <input className="ml-2 w-24 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={w} onChange={(e) => setW(e.target.value)} placeholder="auto" />
        </label>
        <label className="text-sm">
          Height (px)
          <input className="ml-2 w-24 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={h} onChange={(e) => setH(e.target.value)} placeholder="auto" />
        </label>
        <label className="text-sm">
          Scale %
          <input className="ml-2 w-20 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={pct} onChange={(e) => setPct(e.target.value)} />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              setSourceFile(f);
              revokeOutput();
            }
            e.target.value = "";
          }}
        />
        {sourceFile ? <span className="text-sm text-[var(--text-secondary)]">{sourceFile.name}</span> : null}
        <button
          type="button"
          disabled={!sourceFile || busy}
          className="rounded-lg border border-[var(--blue-primary)] bg-[var(--blue-primary)] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => void run()}
        >
          {busy ? "Resizing…" : "Resize"}
        </button>
        {outUrl ? (
          <a
            href={outUrl}
            download={downloadName}
            className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium hover:border-[var(--blue-primary)]"
          >
            Download
          </a>
        ) : null}
      </div>
      {outUrl ? <img src={outUrl} alt="Resized preview" className="max-h-56 w-auto rounded border" /> : null}
    </div>
  );
}

export function ImageFormatConverter() {
  const [fmt, setFmt] = useState<"image/png" | "image/jpeg" | "image/webp">("image/png");
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [outUrl, setOutUrl] = useState("");
  const outUrlRef = useRef<string | null>(null);
  const [busy, setBusy] = useState(false);

  const revokeOutput = useCallback(() => {
    if (outUrlRef.current) {
      URL.revokeObjectURL(outUrlRef.current);
      outUrlRef.current = null;
    }
    setOutUrl("");
  }, []);

  const run = useCallback(async () => {
    if (!sourceFile) {
      return;
    }
    setBusy(true);
    revokeOutput();
    try {
      const img = await loadImage(sourceFile);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }
      ctx.drawImage(img, 0, 0);
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, fmt, fmt === "image/jpeg" ? 0.92 : undefined));
      if (blob) {
        const url = URL.createObjectURL(blob);
        outUrlRef.current = url;
        setOutUrl(url);
      }
    } finally {
      setBusy(false);
    }
  }, [fmt, revokeOutput, sourceFile]);

  const ext = fmt === "image/jpeg" ? "jpg" : fmt === "image/webp" ? "webp" : "png";
  const downloadName = sourceFile != null ? `${stripExtension(sourceFile.name)}.${ext}` : `converted.${ext}`;

  return (
    <div className="grid gap-4">
      <label className="text-sm">
        Output
        <select className="ml-2 rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1" value={fmt} onChange={(e) => setFmt(e.target.value as typeof fmt)}>
          <option value="image/png">PNG</option>
          <option value="image/jpeg">JPEG</option>
          <option value="image/webp">WebP</option>
        </select>
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              setSourceFile(f);
              revokeOutput();
            }
            e.target.value = "";
          }}
        />
        {sourceFile ? <span className="text-sm text-[var(--text-secondary)]">{sourceFile.name}</span> : null}
        <button
          type="button"
          disabled={!sourceFile || busy}
          className="rounded-lg border border-[var(--blue-primary)] bg-[var(--blue-primary)] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => void run()}
        >
          {busy ? "Converting…" : "Convert"}
        </button>
        {outUrl ? (
          <a
            href={outUrl}
            download={downloadName}
            className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium hover:border-[var(--blue-primary)]"
          >
            Download
          </a>
        ) : null}
      </div>
    </div>
  );
}

function rgbToHex(r: number, g: number, b: number): string {
  const h = (n: number) => n.toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`.toUpperCase();
}

export function ImageColorPicker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hex, setHex] = useState("");
  const [rgb, setRgb] = useState("");
  const onFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) {
      return;
    }
    void loadImage(f).then((img) => {
      const c = canvasRef.current;
      if (!c) {
        return;
      }
      const w = Math.min(640, img.naturalWidth);
      const h = Math.round((img.naturalHeight / img.naturalWidth) * w);
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d");
      if (!ctx) {
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
    });
  }, []);
  const pick = useCallback((ev: React.MouseEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current;
    if (!c) {
      return;
    }
    const ctx = c.getContext("2d");
    if (!ctx) {
      return;
    }
    const rect = c.getBoundingClientRect();
    const x = Math.floor(((ev.clientX - rect.left) / rect.width) * c.width);
    const y = Math.floor(((ev.clientY - rect.top) / rect.height) * c.height);
    const d = ctx.getImageData(x, y, 1, 1).data;
    setHex(rgbToHex(d[0], d[1], d[2]));
    setRgb(`rgb(${d[0]}, ${d[1]}, ${d[2]})`);
  }, []);
  return (
    <div className="grid gap-4">
      <p className="text-sm text-[var(--text-secondary)]">Upload an image, then click a pixel.</p>
      <input type="file" accept="image/*" onChange={onFile} />
      <canvas ref={canvasRef} className="max-w-full cursor-crosshair rounded border border-[var(--border-color)]" onClick={pick} />
      {hex ? (
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded border" style={{ background: hex }} />
          <ToolOutput value={`${hex}\n${rgb}`} />
        </div>
      ) : null}
    </div>
  );
}

export function ExifViewer() {
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  const onFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) {
      return;
    }
    setErr("");
    try {
      const parsed = await parseExif(f);
      setText(parsed && Object.keys(parsed).length ? JSON.stringify(parsed, null, 2) : "No EXIF metadata found (or format unsupported).");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
      setText("");
    }
  }, []);
  return (
    <div className="grid gap-4">
      <input type="file" accept="image/jpeg,image/tiff,image/heic,.heic" onChange={onFile} />
      {err ? <p className="text-sm text-red-500">{err}</p> : null}
      <ToolOutput value={text} minHeight={200} />
    </div>
  );
}
