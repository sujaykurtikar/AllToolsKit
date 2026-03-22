import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border-color)]/80 bg-[var(--bg-primary)]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-4 py-6 text-[13px] text-[var(--text-tertiary)] sm:flex-row sm:items-center sm:justify-between md:px-6">
        <p className="font-display font-medium text-[var(--text-secondary)]">
          PandaPath Tools — <span className="text-[var(--text-tertiary)]">100% free, no sign-up</span>
        </p>
        <div className="flex flex-wrap gap-6">
          <Link
            href="/about"
            className="font-display font-medium transition hover:text-[var(--blue-primary)]"
          >
            About
          </Link>
          <Link
            href="/privacy"
            className="font-display font-medium transition hover:text-[var(--blue-primary)]"
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
