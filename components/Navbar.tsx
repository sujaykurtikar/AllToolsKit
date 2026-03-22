"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import SuggestToolModal from "@/components/SuggestToolModal";
import { useTheme } from "@/components/theme-provider";

const links = [
  { href: "/", label: "Tools" },
  { href: "/favorites", label: "Favorites" },
  { href: "/about", label: "About" }
];

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const normalizedPath = pathname?.replace(/\/$/, "") || "";
  const isActive = (href: string) => {
    if (href === "/") {
      return normalizedPath === "" || normalizedPath === "/tools";
    }
    return normalizedPath.endsWith(href);
  };

  return (
    <header className="sticky top-0 z-[100] border-b border-[var(--border-color)]/80 bg-[var(--bg-primary)]/75 backdrop-blur-xl backdrop-saturate-150 dark:bg-[var(--bg-primary)]/80">
      <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href="/"
          className="font-display shrink-0 text-base font-bold tracking-tight"
        >
          <span className="text-gradient-brand">PandaPath</span>
          <span className="text-[var(--text-primary)]"> Tools</span>
        </Link>

        <nav className="hidden items-center gap-0.5 sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 font-display text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "border-b-2 border-[var(--blue-primary)] text-[var(--blue-primary)]"
                  : "border-b-2 border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <SuggestToolModal />
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)]/80 p-2 text-[var(--text-secondary)] shadow-sm transition hover:border-[var(--blue-primary)]/40 hover:text-[var(--blue-primary)] dark:bg-[var(--bg-tertiary)]/50"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          <button
            type="button"
            className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)]/80 p-2 text-[var(--text-secondary)] shadow-sm sm:hidden dark:bg-[var(--bg-tertiary)]/50"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="absolute left-0 right-0 top-14 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/95 px-4 py-4 shadow-lg backdrop-blur-xl sm:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 font-display text-sm font-medium ${
                  isActive(link.href)
                    ? "bg-[var(--blue-light)] text-[var(--blue-primary)] dark:bg-[var(--blue-primary)]/15"
                    : "text-[var(--text-secondary)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
