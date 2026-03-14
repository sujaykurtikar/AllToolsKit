import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy details for DevToolsKit.",
  alternates: {
    canonical: "/privacy"
  }
};

export default function PrivacyPage() {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="text-3xl font-semibold text-gray-900">Privacy</h1>
      <p className="mt-4 text-base leading-7 text-gray-600">
        AllToolsKit runs its tools in your browser. Text you paste into the utilities is
        processed client-side and is not stored by the website.
      </p>
    </section>
  );
}
