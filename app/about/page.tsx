import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about the DevToolsKit project.",
  alternates: {
    canonical: "/about"
  }
};

export default function AboutPage() {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-gray-900">About</h1>
        <p className="mt-4 text-base leading-7 text-gray-600">
        AllToolsKit is a static website focused on simple developer utilities with a
        consistent interface, fast load times, and client-side processing. It is built
        with Next.js, Tailwind CSS, and TypeScript for deployment on Vercel.
      </p>
    </section>
  );
}
