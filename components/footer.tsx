import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border-color)] bg-[var(--bg-primary)]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-4 py-4 text-[13px] text-[var(--text-tertiary)] sm:flex-row sm:items-center sm:justify-between md:px-6">
        <p>PandaPath Tools — 100% free, no sign-up required</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/about" className="hover:text-[var(--blue-primary)]">
            About
          </Link>
          <Link href="/privacy" className="hover:text-[var(--blue-primary)]">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
