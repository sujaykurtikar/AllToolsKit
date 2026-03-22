"use client";

import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";

import { ActionBar } from "@/components/tool/ActionBar";
import { ToolInput } from "@/components/tool/ToolInput";
import { ToolOutput } from "@/components/tool/ToolOutput";
import {
  ExifViewer,
  ImageColorPicker,
  ImageCompressor,
  ImageFormatConverter,
  ImageResizer
} from "@/components/tool-sections/audit/media-tools";

export function ImageSection({ slug }: { slug: string }) {
  switch (slug) {
    case "image-to-base64":
      return <ImgB64 />;
    case "svg-optimizer":
      return <SvgOpt />;
    case "favicon-generator":
      return <FavGen />;
    case "qr-generator":
      return <QrGen />;
    case "placeholder-image":
      return <Placeholder />;
    case "image-compressor":
      return <ImageCompressor />;
    case "image-resizer":
      return <ImageResizer />;
    case "image-format-converter":
      return <ImageFormatConverter />;
    case "image-color-picker":
      return <ImageColorPicker />;
    case "exif-viewer":
      return <ExifViewer />;
    default:
      return null;
  }
}

function ImgB64() {
  const [dataUrl, setDataUrl] = useState("");
  const [meta, setMeta] = useState("");
  const onFile = (f: FileList | null) => {
    const file = f?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const s = String(reader.result ?? "");
      setDataUrl(s);
      setMeta(`${file.name} — ${file.size} bytes`);
    };
    reader.readAsDataURL(file);
  };
  return (
    <div className="grid gap-4">
      <input type="file" onChange={(e) => onFile(e.target.files)} />
      {dataUrl ? <img src={dataUrl} alt="preview" className="max-h-48 w-auto rounded border" /> : null}
      <p className="text-sm text-[var(--text-secondary)]">{meta}</p>
      <ToolOutput value={dataUrl} />
    </div>
  );
}

function SvgOpt() {
  const [input, setInput] = useState("<svg xmlns='http://www.w3.org/2000/svg'><circle r='10'/></svg>");
  const [out, setOut] = useState("");
  const [stats, setStats] = useState("");
  const run = () => {
    try {
      const o = input
        .replace(/<!--([\s\S]*?)-->/g, "")
        .replace(/>\s+</g, "><")
        .replace(/\s{2,}/g, " ")
        .trim();
      setOut(o);
      const pct = Math.round((1 - o.length / input.length) * 100);
      setStats(`${input.length} → ${o.length} bytes (${pct}% reduction)`);
    } catch (e) {
      setOut(e instanceof Error ? e.message : "Error");
    }
  };
  return (
    <div className="grid gap-4">
      <ToolInput value={input} onChange={setInput} />
      <ActionBar primaryLabel="Optimize" onPrimary={run} />
      <p className="text-sm">{stats}</p>
      <ToolOutput value={out} />
    </div>
  );
}

function FavGen() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [url, setUrl] = useState("");
  const onFile = (f: FileList | null) => {
    const file = f?.[0];
    if (!file) {
      return;
    }
    const img = new Image();
    img.onload = () => {
      const c = ref.current;
      if (!c) {
        return;
      }
      const ctx = c.getContext("2d");
      if (!ctx) {
        return;
      }
      const size = 32;
      c.width = size;
      c.height = size;
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      setUrl(c.toDataURL("image/png"));
    };
    img.src = URL.createObjectURL(file);
  };
  return (
    <div className="grid gap-4">
      <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files)} />
      <canvas ref={ref} className="hidden" />
      {url ? (
        <a href={url} download="favicon-32.png" className="text-[var(--blue-primary)]">
          Download 32×32 PNG
        </a>
      ) : null}
    </div>
  );
}

function QrGen() {
  const [text, setText] = useState("https://pandapath.in");
  const [dataUrl, setDataUrl] = useState("");
  const [size, setSize] = useState(256);
  useEffect(() => {
    void QRCode.toDataURL(text, { width: size, margin: 1 }).then(setDataUrl);
  }, [text, size]);
  return (
    <div className="grid gap-4">
      <ToolInput value={text} onChange={setText} />
      <label className="text-sm">
        Size
        <input type="range" min={128} max={512} value={size} onChange={(e) => setSize(Number(e.target.value))} />
      </label>
      {dataUrl ? <img src={dataUrl} alt="QR" className="h-48 w-48 rounded border" /> : null}
      {dataUrl ? (
        <a href={dataUrl} download="qr.png" className="text-[var(--blue-primary)]">
          Download PNG
        </a>
      ) : null}
    </div>
  );
}

function Placeholder() {
  const [w, setW] = useState(400);
  const [h, setH] = useState(200);
  const [bg, setBg] = useState("#cccccc");
  const [fg, setFg] = useState("#333333");
  const [label, setLabel] = useState("400×200");
  const ref = useRef<HTMLCanvasElement>(null);
  const [url, setUrl] = useState("");
  useEffect(() => {
    const c = ref.current;
    if (!c) {
      return;
    }
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = fg;
    ctx.font = "24px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, w / 2, h / 2);
    setUrl(c.toDataURL("image/png"));
  }, [w, h, bg, fg, label]);
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-4">
        <label className="text-sm">
          W
          <input type="number" className="ml-2 w-20 rounded border" value={w} onChange={(e) => setW(Number(e.target.value))} />
        </label>
        <label className="text-sm">
          H
          <input type="number" className="ml-2 w-20 rounded border" value={h} onChange={(e) => setH(Number(e.target.value))} />
        </label>
        <label className="text-sm">
          BG
          <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} />
        </label>
        <label className="text-sm">
          Text
          <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} />
        </label>
        <label className="text-sm">
          Label
          <input className="ml-2 rounded border px-2" value={label} onChange={(e) => setLabel(e.target.value)} />
        </label>
      </div>
      <canvas ref={ref} className="max-w-full rounded border" />
      <ToolOutput value={`<img src="${url}" width="${w}" height="${h}" alt="" />`} />
    </div>
  );
}
