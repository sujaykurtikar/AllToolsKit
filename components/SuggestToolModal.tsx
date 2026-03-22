"use client";

import { useEffect, useState } from "react";

/** Override with NEXT_PUBLIC_GOOGLE_FORM_EMBED_URL in .env.local if needed */
const GOOGLE_FORM_EMBED_URL =
  process.env.NEXT_PUBLIC_GOOGLE_FORM_EMBED_URL ??
  "https://docs.google.com/forms/d/e/1FAIpQLSdXp5kUOrVnVKtXP0KwZsCtBelVkGIWFn3HB19d0LIGlC61sQ/viewform?embedded=true";

export default function SuggestToolModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="font-display whitespace-nowrap rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-3.5 py-2 text-[13px] font-semibold text-[var(--text-primary)] shadow-sm transition hover:border-[var(--blue-primary)]/40 hover:bg-[var(--bg-tertiary)] dark:bg-[var(--bg-tertiary)]/80"
      >
        + Suggest a tool
      </button>

      {isOpen ? (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-sm dark:bg-black/55"
          role="dialog"
          aria-modal="true"
          aria-label="Suggest a tool"
        >
          <div className="flex max-h-[90vh] w-full max-w-[520px] flex-col overflow-hidden rounded-2xl border border-[var(--border-color)]/90 bg-[var(--card-bg)] shadow-[var(--shadow-lg)] ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
            <div className="flex items-start justify-between border-b border-[var(--border-color)]/90 px-5 py-4">
              <div>
                <p className="font-display text-[15px] font-semibold text-[var(--text-primary)]">Suggest a tool</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                  Tell us what you need — we read every suggestion.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close suggestion form"
                className="ml-3 shrink-0 rounded-lg p-1.5 text-lg leading-none text-[var(--text-tertiary)] transition hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
              >
                ✕
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden">
              <iframe
                src={GOOGLE_FORM_EMBED_URL}
                width="100%"
                height={480}
                frameBorder={0}
                marginHeight={0}
                marginWidth={0}
                title="Suggest a tool form"
                className="block"
              >
                Loading form...
              </iframe>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-[var(--border-color)]/90 px-5 py-3">
              <p className="text-[11px] text-[var(--text-tertiary)]">
                Responses go to contactpandapath@gmail.com
              </p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="font-display shrink-0 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)]/80 px-3.5 py-2 text-xs font-semibold text-[var(--text-secondary)] transition hover:border-[var(--blue-primary)]/35 hover:text-[var(--blue-primary)]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
