"use client";

export function ToolShortcuts() {
  return (
    <p className="hidden text-[11px] text-[var(--text-tertiary)] sm:block">
      <span className="mr-4">⌘↵ Run</span>
      <span className="mr-4">⌘⇧C Copy</span>
      <span>Esc Clear</span>
    </p>
  );
}
