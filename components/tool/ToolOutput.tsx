"use client";

import { useState } from "react";

type Props = {
  value: string;
  label?: string;
  minHeight?: number;
  error?: string;
  fileName?: string;
  onDownload?: () => void;
};

export function ToolOutput({
  value,
  label = "Output",
  minHeight = 160,
  error,
  fileName = "output.txt",
  onDownload
}: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!value) {
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* silent */
    }
  };

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] font-medium uppercase tracking-[0.8px] text-[var(--text-tertiary)]">
          {label}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={copy}
            className="rounded-md border border-[var(--border-color)] px-2 py-1 text-xs text-[var(--text-secondary)] hover:border-[var(--blue-primary)]"
          >
            {copied ? "✓ Copied!" : "Copy"}
          </button>
          {onDownload ? (
            <button
              type="button"
              onClick={onDownload}
              className="rounded-md border border-[var(--border-color)] px-2 py-1 text-xs text-[var(--text-secondary)] hover:border-[var(--blue-primary)]"
            >
              Download
            </button>
          ) : null}
        </div>
      </div>
      <div
        className={`overflow-hidden rounded-lg border bg-[var(--bg-tertiary)] ${
          error ? "border-[var(--red)]" : "border-[var(--border-color)]"
        }`}
      >
        <textarea
          readOnly
          value={value}
          className="font-mono-tool w-full resize-y border-0 bg-transparent px-4 py-4 text-sm text-[var(--text-primary)] outline-none"
          style={{ minHeight }}
          aria-live="polite"
        />
        {error ? (
          <p className="border-t border-[var(--red)] bg-[var(--red-light)] px-4 py-2 text-sm text-[var(--red)]">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
