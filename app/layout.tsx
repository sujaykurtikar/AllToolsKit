import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { siteUrl } from "@/data/tools";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AllToolsKit",
    template: "%s | AllToolsKit"
  },
  description:
    "AllToolsKit is a static collection of fast, client-side developer tools built with Next.js.",
  keywords: [
    "developer tools",
    "JSON formatter",
    "GUID generator",
    "timestamp converter",
    "base64 encoder"
  ],
  openGraph: {
    title: "AllToolsKit",
    description:
      "Simple browser-based developer tools with a clean UI and static export deployment.",
    url: siteUrl,
    siteName: "AllToolsKit",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "AllToolsKit",
    description:
      "Simple browser-based developer tools with a clean UI and static export deployment."
  },
  alternates: {
    canonical: "/"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-slate-50">
          <Header />
          <main className="mx-auto w-full max-w-[900px] px-4 py-8">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
