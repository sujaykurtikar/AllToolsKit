import type { Metadata } from "next";

import { ToolBrowser } from "@/components/tool-browser";
import { tools } from "@/data/tools";

export const metadata: Metadata = {
  title: "Tools",
  description: "Browse all developer tools available in DevToolsKit.",
  alternates: {
    canonical: "/tools"
  }
};

export default function ToolsPage() {
  return (
    <ToolBrowser
      title="Free Developer Tools"
      description="A collection of fast, browser-based tools for formatting, conversion, encoding, and ID generation."
      tools={tools}
    />
  );
}
