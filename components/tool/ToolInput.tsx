"use client";

type Props = {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  minHeight?: number;
  lineCount?: number;
  onPaste?: () => void;
  onClear?: () => void;
  onSample?: () => void;
  sampleLabel?: string;
};

export function ToolInput({
  label = "Input",
  value,
  onChange,
  placeholder,
  minHeight = 200,
  lineCount,
  onPaste,
  onClear,
  onSample,
  sampleLabel = "Sample"
}: Props) {
  return (
    <div className="overflow-hidden rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-color)] px-3 py-2">
        <span className="text-sm font-medium text-[var(--text-primary)]">{label}</span>
        <div className="flex flex-wrap gap-2">
          {lineCount !== undefined ? (
            <span className="rounded bg-[var(--bg-tertiary)] px-2 py-0.5 text-[11px] text-[var(--text-tertiary)]">
              {lineCount} lines
            </span>
          ) : null}
          {onPaste ? (
            <button
              type="button"
              onClick={onPaste}
              className="rounded-md border border-[var(--border-color)] px-2 py-1 text-xs text-[var(--text-secondary)] hover:border-[var(--blue-primary)]"
            >
              Paste
            </button>
          ) : null}
          {onSample ? (
            <button
              type="button"
              onClick={onSample}
              className="rounded-md border border-[var(--border-color)] px-2 py-1 text-xs text-[var(--text-secondary)] hover:border-[var(--blue-primary)]"
            >
              {sampleLabel}
            </button>
          ) : null}
          {onClear ? (
            <button
              type="button"
              onClick={onClear}
              className="rounded-md border border-[var(--border-color)] px-2 py-1 text-xs text-[var(--text-secondary)] hover:border-[var(--blue-primary)]"
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        className="font-mono-tool w-full resize-y border-0 bg-[var(--input-bg)] px-4 py-4 text-sm text-[var(--text-primary)] outline-none"
        style={{ minHeight }}
      />
    </div>
  );
}
