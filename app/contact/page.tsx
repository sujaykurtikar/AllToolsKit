import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact details for DevToolsKit.",
  alternates: {
    canonical: "/contact"
  }
};

export default function ContactPage() {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="text-3xl font-semibold text-gray-900">Contact</h1>
      <p className="mt-4 text-base leading-7 text-gray-600">
        For feedback, feature requests, or deployment updates, contact the AllToolsKit
        team through your preferred project support channel.
      </p>
    </section>
  );
}
