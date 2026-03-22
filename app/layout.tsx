import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { siteUrl, tools } from "@/data/tools";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"]
});

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/tools`),
  title: {
    default: "PandaPath Tools — Free Browser Tools for Developers",
    template: "%s — PandaPath Tools"
  },
  description: `${tools.length}+ free developer tools that run entirely in your browser. JSON formatter, regex tester, base64, UUID generator and more. No sign-up.`,
  robots: { index: true, follow: true },
  openGraph: {
    title: "PandaPath Tools — Free Browser Tools for Developers",
    description: `${tools.length}+ free developer tools that run entirely in your browser.`,
    url: `${siteUrl}/tools`,
    siteName: "PandaPath Tools",
    type: "website"
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
    <html lang="en" className={`${inter.variable} ${display.variable}`} suppressHydrationWarning>
      <body className={`${inter.className} app-body flex min-h-screen flex-col`}>
        <Script id="pp-theme" strategy="beforeInteractive">
          {`(function(){try{var k='pp_theme';var raw=localStorage.getItem(k);var theme=raw?JSON.parse(raw):null;if(theme!=='light'&&theme!=='dark'){theme=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.classList.toggle('dark',theme==='dark');}catch(e){}})();`}
        </Script>
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
