export type Tool = {
  slug: string;
  name: string;
  badge: string;
  description: string;
  inputLabel: string;
  outputLabel: string;
  seoDescription: string;
};

export const siteUrl = "https://alltoolskit.vercel.app";

export const tools: Tool[] = [
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    badge: "{}",
    description: "Format or minify JSON instantly in your browser.",
    inputLabel: "Paste JSON",
    outputLabel: "Formatted JSON",
    seoDescription:
      "Format and validate JSON with a fast client-side formatter built for developers."
  },
  {
    slug: "json-to-csharp-class",
    name: "JSON to C# Class",
    badge: "C#",
    description: "Convert JSON objects into basic C# model classes.",
    inputLabel: "Paste JSON object",
    outputLabel: "Generated C#",
    seoDescription:
      "Generate C# classes from JSON with a lightweight static developer tool."
  },
  {
    slug: "guid-generator",
    name: "GUID Generator",
    badge: "ID",
    description: "Generate one or more GUIDs without leaving the page.",
    inputLabel: "Generation settings",
    outputLabel: "Generated GUIDs",
    seoDescription:
      "Create GUIDs in bulk with a simple browser-based generator."
  },
  {
    slug: "timestamp-converter",
    name: "Timestamp Converter",
    badge: "TS",
    description: "Convert Unix timestamps to readable dates and back.",
    inputLabel: "Timestamp or date",
    outputLabel: "Conversion result",
    seoDescription:
      "Convert Unix timestamps and ISO dates instantly with a static web tool."
  },
  {
    slug: "base64-encoder",
    name: "Base64 Encoder",
    badge: "64",
    description: "Encode and decode Base64 text using your browser only.",
    inputLabel: "Paste text",
    outputLabel: "Base64 result",
    seoDescription:
      "Encode or decode Base64 strings with a responsive client-side tool."
  }
];

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "Tools" },
  { href: "/about", label: "About" }
];
