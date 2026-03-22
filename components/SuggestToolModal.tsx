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
        style={{
          background: "#1E1E2E",
          color: "#FFFFFF",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "10px",
          padding: "8px 18px",
          fontSize: "13px",
          fontWeight: 500,
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#2A2A3E";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#1E1E2E";
        }}
      >
        + Suggest a tool
      </button>

      {isOpen ? (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Suggest a tool"
        >
          <div
            style={{
              background: "var(--card-bg, #ffffff)",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "520px",
              border: "1px solid var(--border-color, #E5E7EB)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              maxHeight: "90vh",
            }}
          >
            <div
              style={{
                padding: "16px 20px 14px",
                borderBottom: "1px solid var(--border-color, #E5E7EB)",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "var(--text-primary, #111827)",
                    margin: 0,
                  }}
                >
                  Suggest a tool
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--text-secondary, #6B7280)",
                    margin: "3px 0 0",
                  }}
                >
                  Tell us what you need — we read every suggestion.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close suggestion form"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  color: "var(--text-secondary, #6B7280)",
                  fontSize: "18px",
                  lineHeight: 1,
                  marginLeft: "12px",
                  flexShrink: 0,
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ flex: 1, overflow: "hidden" }}>
              <iframe
                src={GOOGLE_FORM_EMBED_URL}
                width="100%"
                height={480}
                frameBorder={0}
                marginHeight={0}
                marginWidth={0}
                title="Suggest a tool form"
                style={{ display: "block" }}
              >
                Loading form...
              </iframe>
            </div>

            <div
              style={{
                padding: "10px 20px",
                borderTop: "1px solid var(--border-color, #E5E7EB)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <p
                style={{
                  fontSize: "11px",
                  color: "var(--text-tertiary, #9CA3AF)",
                  margin: 0,
                }}
              >
                Responses go to contactpandapath@gmail.com
              </p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  fontSize: "12px",
                  padding: "6px 14px",
                  borderRadius: "7px",
                  border: "1px solid var(--border-color, #E5E7EB)",
                  background: "transparent",
                  cursor: "pointer",
                  color: "var(--text-secondary, #6B7280)",
                  fontWeight: 500,
                }}
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
