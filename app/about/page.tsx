import type { Metadata } from "next";
import Link from "next/link";

import { tools } from "@/data/tools";

export const metadata: Metadata = {
  title: "About",
  description: "PandaPath Tools — mission, privacy, and tech stack.",
  alternates: {
    canonical: "/about"
  }
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-[720px] px-4 py-10 md:px-6">
      <h1 className="text-3xl font-bold text-[var(--text-primary)]">About PandaPath Tools</h1>
      <p className="mt-4 text-[var(--text-secondary)] leading-relaxed">
        We provide fast, free utilities that run in your browser. There is no sign-up, no server-side
        processing of your inputs (except lightweight network proxies where browsers cannot reach APIs),
        and no ads or tracking scripts.
      </p>
      <h2 className="mt-10 text-xl font-semibold text-[var(--text-primary)]">Privacy</h2>
      <p className="mt-2 text-[var(--text-secondary)] leading-relaxed">
        We collect no personal data. Tool inputs stay on your device unless you use a network lookup
        feature that calls third-party APIs or our read-only proxy routes.
      </p>
      <h2 className="mt-10 text-xl font-semibold text-[var(--text-primary)]">Tech stack</h2>
      <p className="mt-2 text-[var(--text-secondary)] leading-relaxed">
        Built with Next.js (App Router), React, TypeScript, and Tailwind CSS.
      </p>
      <p className="mt-6 text-sm text-[var(--text-tertiary)]">
        Current catalog: {tools.length} tools.{" "}
        <Link href="/" className="text-[var(--blue-primary)]">
          Back to all tools
        </Link>
      </p>
    </section>
  );
}
