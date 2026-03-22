export type ToolCategory =
  | "developer"
  | "text"
  | "network"
  | "image"
  | "math"
  | "color"
  | "file"
  | "date";

const CATEGORY_VALUES = new Set<ToolCategory | "all">([
  "all",
  "developer",
  "text",
  "color",
  "network",
  "math",
  "image",
  "file",
  "date"
]);

/** Parses `?category=` query values for the home page filter. */
export function parseCategoryQuery(value: string | undefined | null): ToolCategory | "all" | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const v = String(value).toLowerCase().trim();
  if (!CATEGORY_VALUES.has(v as ToolCategory | "all")) {
    return null;
  }
  return v as ToolCategory | "all";
}

export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  tags: string[];
  related: string[];
}

export const siteUrl = "https://pandapath.com";

export const tools: Tool[] = [
  // Developer (22)
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    description: "Format, minify, and validate JSON in your browser.",
    category: "developer",
    icon: "{}",
    tags: ["json", "format", "validate", "minify"],
    related: ["json-yaml", "xml-formatter", "json-to-typescript"]
  },
  {
    slug: "json-to-csharp",
    name: "JSON to C# Class",
    description: "Generate C# classes from JSON objects.",
    category: "developer",
    icon: "C#",
    tags: ["json", "csharp", "codegen"],
    related: ["json-to-typescript", "json-to-java", "json-to-python"]
  },
  {
    slug: "json-to-typescript",
    name: "JSON to TypeScript",
    description: "Infer TypeScript interfaces or types from JSON.",
    category: "developer",
    icon: "TS",
    tags: ["json", "typescript", "interface"],
    related: ["json-to-csharp", "json-to-python", "json-formatter"]
  },
  {
    slug: "json-to-python",
    name: "JSON to Python Class",
    description: "Generate Python dataclasses with type hints from JSON.",
    category: "developer",
    icon: "PY",
    tags: ["json", "python", "dataclass"],
    related: ["json-to-typescript", "json-to-java", "json-formatter"]
  },
  {
    slug: "json-to-java",
    name: "JSON to Java Class",
    description: "Generate Java POJOs from JSON objects.",
    category: "developer",
    icon: "JV",
    tags: ["json", "java", "pojo"],
    related: ["json-to-csharp", "json-to-python", "json-formatter"]
  },
  {
    slug: "json-yaml",
    name: "JSON ↔ YAML",
    description: "Convert between JSON and YAML.",
    category: "developer",
    icon: "YM",
    tags: ["json", "yaml", "convert"],
    related: ["json-formatter", "yaml-validator", "json-xml"]
  },
  {
    slug: "json-csv",
    name: "JSON ↔ CSV",
    description: "Convert JSON arrays to CSV and CSV to JSON.",
    category: "developer",
    icon: "CV",
    tags: ["json", "csv", "spreadsheet"],
    related: ["csv-to-json", "csv-to-table", "json-formatter"]
  },
  {
    slug: "json-xml",
    name: "JSON ↔ XML",
    description: "Convert between JSON and XML.",
    category: "developer",
    icon: "XM",
    tags: ["json", "xml", "convert"],
    related: ["xml-formatter", "json-formatter", "json-yaml"]
  },
  {
    slug: "xml-formatter",
    name: "XML Formatter",
    description: "Format, minify, and validate XML.",
    category: "developer",
    icon: "XML",
    tags: ["xml", "format", "validate"],
    related: ["json-xml", "json-formatter", "yaml-validator"]
  },
  {
    slug: "yaml-validator",
    name: "YAML Validator",
    description: "Validate and format YAML documents.",
    category: "developer",
    icon: "YL",
    tags: ["yaml", "validate", "format"],
    related: ["json-yaml", "json-formatter", "xml-formatter"]
  },
  {
    slug: "guid-generator",
    name: "GUID / UUID Generator",
    description: "Generate UUIDs (v4, v7) with options.",
    category: "developer",
    icon: "ID",
    tags: ["uuid", "guid", "random"],
    related: ["hash-generator", "password-gen"]
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    description: "Decode JWT header, payload, and signature (client-side).",
    category: "developer",
    icon: "JW",
    tags: ["jwt", "token", "decode"],
    related: ["base64", "json-formatter", "hash-generator"]
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    description: "Test regular expressions with live highlighting.",
    category: "developer",
    icon: "RX",
    tags: ["regex", "pattern", "test"],
    related: ["diff-checker", "find-replace"]
  },
  {
    slug: "url-encoder",
    name: "URL Encoder / Decoder",
    description: "Encode and decode URL components.",
    category: "developer",
    icon: "UR",
    tags: ["url", "encode", "uri"],
    related: ["base64", "html-entities"]
  },
  {
    slug: "base64",
    name: "Base64 Encoder / Decoder",
    description: "Encode and decode Base64 text and files.",
    category: "developer",
    icon: "64",
    tags: ["base64", "encode", "decode"],
    related: ["url-encoder", "image-to-base64", "html-entities"]
  },
  {
    slug: "html-entities",
    name: "HTML Entity Encoder",
    description: "Encode and decode HTML entities.",
    category: "developer",
    icon: "HE",
    tags: ["html", "entities", "escape"],
    related: ["url-encoder", "base64"]
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    description: "Compute MD5, SHA-1, SHA-256, SHA-512 hashes.",
    category: "developer",
    icon: "##",
    tags: ["hash", "md5", "sha"],
    related: ["file-hash", "guid-generator", "password-gen"]
  },
  {
    slug: "cron-parser",
    name: "Cron Expression Parser",
    description: "Describe cron expressions in plain English.",
    category: "developer",
    icon: "CR",
    tags: ["cron", "schedule", "scheduler"],
    related: ["timestamp", "timezone"]
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    description: "Format SQL with dialects for MySQL, Postgres, and more.",
    category: "developer",
    icon: "SQ",
    tags: ["sql", "format", "database"],
    related: ["json-formatter", "xml-formatter"]
  },
  {
    slug: "markdown-preview",
    name: "Markdown Previewer",
    description: "Render Markdown with live preview.",
    category: "developer",
    icon: "MD",
    tags: ["markdown", "md", "preview"],
    related: ["diff-checker", "word-counter"]
  },
  {
    slug: "diff-checker",
    name: "Diff Checker",
    description: "Compare two texts line-by-line.",
    category: "developer",
    icon: "DF",
    tags: ["diff", "compare", "git"],
    related: ["text-diff", "markdown-preview"]
  },
  {
    slug: "lorem-ipsum",
    name: "Lorem Ipsum Generator",
    description: "Generate placeholder Lorem Ipsum text.",
    category: "developer",
    icon: "LI",
    tags: ["lorem", "placeholder", "text"],
    related: ["word-counter", "slug-generator"]
  },
  // Text (12)
  {
    slug: "word-counter",
    name: "Word & Character Counter",
    description: "Count words, characters, sentences, and reading time.",
    category: "text",
    icon: "WC",
    tags: ["words", "count", "stats"],
    related: ["case-converter", "whitespace-cleaner", "lorem-ipsum"]
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    description: "Convert text between camelCase, snake_case, UPPER, and more.",
    category: "text",
    icon: "CC",
    tags: ["case", "camel", "title"],
    related: ["slug-generator", "word-counter"]
  },
  {
    slug: "slug-generator",
    name: "Slug Generator",
    description: "Create URL-friendly slugs from titles.",
    category: "text",
    icon: "SG",
    tags: ["slug", "url", "seo"],
    related: ["case-converter", "url-encoder"]
  },
  {
    slug: "text-diff",
    name: "Text Diff",
    description: "Inline word or character diff between two texts.",
    category: "text",
    icon: "TD",
    tags: ["diff", "compare", "inline"],
    related: ["diff-checker", "duplicate-remover"]
  },
  {
    slug: "duplicate-remover",
    name: "Duplicate Line Remover",
    description: "Remove duplicate lines from text.",
    category: "text",
    icon: "DL",
    tags: ["duplicate", "lines", "dedupe"],
    related: ["sort-lines", "whitespace-cleaner"]
  },
  {
    slug: "sort-lines",
    name: "Sort Lines",
    description: "Sort lines alphabetically, by length, or numerically.",
    category: "text",
    icon: "SL",
    tags: ["sort", "lines", "order"],
    related: ["duplicate-remover", "word-counter"]
  },
  {
    slug: "reverse-text",
    name: "Reverse Text",
    description: "Reverse strings, lines, or line order.",
    category: "text",
    icon: "RT",
    tags: ["reverse", "text", "flip"],
    related: ["case-converter", "sort-lines"]
  },
  {
    slug: "find-replace",
    name: "Find & Replace",
    description: "Find and replace with regex and case options.",
    category: "text",
    icon: "FR",
    tags: ["find", "replace", "regex"],
    related: ["regex-tester", "diff-checker"]
  },
  {
    slug: "text-to-binary",
    name: "Text ↔ Binary",
    description: "Convert text to binary and back.",
    category: "text",
    icon: "TB",
    tags: ["binary", "bits", "ascii"],
    related: ["base64", "rot13"]
  },
  {
    slug: "rot13",
    name: "ROT13 Cipher",
    description: "Apply ROT13 encoding/decoding.",
    category: "text",
    icon: "13",
    tags: ["rot13", "cipher", "encode"],
    related: ["text-encrypt", "base64"]
  },
  {
    slug: "whitespace-cleaner",
    name: "Whitespace Cleaner",
    description: "Trim, normalize, and remove extra whitespace.",
    category: "text",
    icon: "WS",
    tags: ["whitespace", "trim", "clean"],
    related: ["duplicate-remover", "word-counter"]
  },
  {
    slug: "text-encrypt",
    name: "Text Encryptor (AES)",
    description: "Encrypt and decrypt text with AES (passphrase).",
    category: "text",
    icon: "AE",
    tags: ["aes", "encrypt", "crypto"],
    related: ["hash-generator", "base64", "password-gen"]
  },
  // Network (8)
  {
    slug: "ip-lookup",
    name: "IP Lookup",
    description: "Look up IP address geolocation and network info.",
    category: "network",
    icon: "IP",
    tags: ["ip", "geo", "network"],
    related: ["dns-lookup", "whois-lookup"]
  },
  {
    slug: "dns-lookup",
    name: "DNS Lookup",
    description: "Query DNS records via DNS-over-HTTPS.",
    category: "network",
    icon: "DN",
    tags: ["dns", "a", "mx", "txt"],
    related: ["ip-lookup", "whois-lookup", "ssl-checker"]
  },
  {
    slug: "http-headers",
    name: "HTTP Headers Viewer",
    description: "Fetch and inspect HTTP response headers.",
    category: "network",
    icon: "HH",
    tags: ["http", "headers", "fetch"],
    related: ["ssl-checker", "og-preview"]
  },
  {
    slug: "ssl-checker",
    name: "SSL Certificate Checker",
    description: "Inspect TLS certificate details for a domain.",
    category: "network",
    icon: "SS",
    tags: ["ssl", "tls", "certificate"],
    related: ["http-headers", "dns-lookup", "whois-lookup"]
  },
  {
    slug: "whois-lookup",
    name: "Whois Lookup",
    description: "Look up domain registration and expiry info.",
    category: "network",
    icon: "WH",
    tags: ["whois", "domain", "registrar"],
    related: ["dns-lookup", "ip-lookup"]
  },
  {
    slug: "og-preview",
    name: "Open Graph Previewer",
    description: "Preview Open Graph tags for any URL.",
    category: "network",
    icon: "OG",
    tags: ["open graph", "meta", "social"],
    related: ["http-headers", "robots-tester"]
  },
  {
    slug: "robots-tester",
    name: "Robots.txt Tester",
    description: "Test if a path is allowed by robots.txt.",
    category: "network",
    icon: "RB",
    tags: ["robots", "crawler", "seo"],
    related: ["og-preview", "http-headers"]
  },
  {
    slug: "url-expander",
    name: "URL Expander",
    description: "Follow redirects to the final destination URL.",
    category: "network",
    icon: "UX",
    tags: ["url", "redirect", "shortlink"],
    related: ["url-encoder", "http-headers"]
  },
  // Image (5)
  {
    slug: "image-to-base64",
    name: "Image to Base64",
    description: "Convert images and files to Base64 data URLs.",
    category: "image",
    icon: "I6",
    tags: ["image", "base64", "data url"],
    related: ["base64", "favicon-generator"]
  },
  {
    slug: "svg-optimizer",
    name: "SVG Optimizer",
    description: "Optimize SVG markup for smaller file size.",
    category: "image",
    icon: "SV",
    tags: ["svg", "optimize", "vector"],
    related: ["image-to-base64", "placeholder-image"]
  },
  {
    slug: "favicon-generator",
    name: "Favicon Generator",
    description: "Generate favicon sizes from an image.",
    category: "image",
    icon: "FV",
    tags: ["favicon", "icon", "png"],
    related: ["image-to-base64", "svg-optimizer"]
  },
  {
    slug: "qr-generator",
    name: "QR Code Generator",
    description: "Create QR codes with options and download PNG.",
    category: "image",
    icon: "QR",
    tags: ["qr", "barcode", "scan"],
    related: ["placeholder-image", "url-encoder"]
  },
  {
    slug: "placeholder-image",
    name: "Placeholder Image",
    description: "Generate placeholder images with dimensions and colors.",
    category: "image",
    icon: "PH",
    tags: ["placeholder", "dummy", "canvas"],
    related: ["image-to-base64", "qr-generator"]
  },
  // Color (5)
  {
    slug: "color-converter",
    name: "Color Converter",
    description: "Convert colors between HEX, RGB, HSL, HSV, and CMYK.",
    category: "color",
    icon: "CL",
    tags: ["color", "hex", "rgb"],
    related: ["color-palette", "contrast-checker", "gradient-generator"]
  },
  {
    slug: "color-palette",
    name: "Color Palette Generator",
    description: "Generate harmonious palettes from a base color.",
    category: "color",
    icon: "CP",
    tags: ["palette", "harmony", "design"],
    related: ["color-converter", "gradient-generator", "contrast-checker"]
  },
  {
    slug: "gradient-generator",
    name: "CSS Gradient Generator",
    description: "Build linear and radial gradients with CSS output.",
    category: "color",
    icon: "GR",
    tags: ["gradient", "css", "linear"],
    related: ["color-converter", "color-palette"]
  },
  {
    slug: "contrast-checker",
    name: "Contrast Checker (WCAG)",
    description: "Check color contrast ratios for accessibility.",
    category: "color",
    icon: "AA",
    tags: ["wcag", "contrast", "a11y"],
    related: ["color-converter", "color-palette"]
  },
  {
    slug: "tailwind-colors",
    name: "Tailwind Color Picker",
    description: "Browse Tailwind CSS v3 colors and copy classes or hex.",
    category: "color",
    icon: "TW",
    tags: ["tailwind", "colors", "design"],
    related: ["color-converter", "gradient-generator"]
  },
  // Math (5)
  {
    slug: "base-converter",
    name: "Number Base Converter",
    description: "Convert numbers between binary, octal, decimal, and hex.",
    category: "math",
    icon: "NB",
    tags: ["binary", "hex", "radix"],
    related: ["roman-numerals", "percentage-calc"]
  },
  {
    slug: "percentage-calc",
    name: "Percentage Calculator",
    description: "Compute percentages, ratios, and percent change.",
    category: "math",
    icon: "PC",
    tags: ["percent", "ratio", "math"],
    related: ["scientific-calc", "base-converter"]
  },
  {
    slug: "scientific-calc",
    name: "Scientific Calculator",
    description: "Scientific calculator with history.",
    category: "math",
    icon: "SC",
    tags: ["calculator", "math", "science"],
    related: ["percentage-calc", "random-number"]
  },
  {
    slug: "roman-numerals",
    name: "Roman Numeral Converter",
    description: "Convert between Arabic numerals and Roman numerals.",
    category: "math",
    icon: "RN",
    tags: ["roman", "numerals", "convert"],
    related: ["base-converter", "percentage-calc"]
  },
  {
    slug: "random-number",
    name: "Random Number Generator",
    description: "Generate cryptographically secure random numbers.",
    category: "math",
    icon: "RNG",
    tags: ["random", "crypto", "numbers"],
    related: ["guid-generator", "password-gen"]
  },
  // File (4)
  {
    slug: "csv-to-json",
    name: "CSV to JSON",
    description: "Convert CSV to JSON arrays with delimiter options.",
    category: "file",
    icon: "CJ",
    tags: ["csv", "json", "import"],
    related: ["json-csv", "csv-to-table", "json-formatter"]
  },
  {
    slug: "csv-to-table",
    name: "CSV Table Viewer",
    description: "View CSV as a sortable HTML table.",
    category: "file",
    icon: "CT",
    tags: ["csv", "table", "sort"],
    related: ["csv-to-json", "json-csv"]
  },
  {
    slug: "file-hash",
    name: "File Hash Calculator",
    description: "Compute hashes for files on the client.",
    category: "file",
    icon: "FH",
    tags: ["hash", "file", "sha"],
    related: ["hash-generator", "image-to-base64"]
  },
  {
    slug: "file-size",
    name: "File Size Converter",
    description: "Convert between bytes, KB, MB, and binary units.",
    category: "file",
    icon: "FS",
    tags: ["bytes", "kb", "mb"],
    related: ["file-hash", "base-converter"]
  },
  // Date / misc (5)
  {
    slug: "timestamp",
    name: "Unix Timestamp Converter",
    description: "Convert Unix timestamps and ISO dates both ways.",
    category: "date",
    icon: "TS",
    tags: ["unix", "epoch", "time"],
    related: ["timezone", "date-diff"]
  },
  {
    slug: "timezone",
    name: "Timezone Converter",
    description: "Convert times between IANA timezones and world clocks.",
    category: "date",
    icon: "TZ",
    tags: ["timezone", "utc", "iana"],
    related: ["timestamp", "date-diff"]
  },
  {
    slug: "date-diff",
    name: "Date Difference Calculator",
    description: "Compute differences between two dates.",
    category: "date",
    icon: "DD",
    tags: ["date", "difference", "duration"],
    related: ["timestamp", "timezone"]
  },
  {
    slug: "password-gen",
    name: "Password Generator",
    description: "Generate strong passwords with custom character sets.",
    category: "date",
    icon: "PG",
    tags: ["password", "generator", "secure"],
    related: ["password-strength", "random-number", "hash-generator"]
  },
  {
    slug: "password-strength",
    name: "Password Strength Checker",
    description: "Estimate password strength with zxcvbn.",
    category: "date",
    icon: "PS",
    tags: ["password", "strength", "security"],
    related: ["password-gen", "hash-generator"]
  }
];

const slugSet = new Set(tools.map((t) => t.slug));

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return tools.filter((t) => t.category === category);
}

export function getAllSlugs(): string[] {
  return tools.map((t) => t.slug);
}

export function searchTools(query: string): Tool[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return tools;
  }
  return tools.filter((t) => {
    if (t.name.toLowerCase().includes(q)) {
      return true;
    }
    if (t.description.toLowerCase().includes(q)) {
      return true;
    }
    if (t.slug.includes(q)) {
      return true;
    }
    return t.tags.some((tag) => tag.toLowerCase().includes(q));
  });
}

export function isValidToolSlug(slug: string): boolean {
  return slugSet.has(slug);
}

export const categoryLabels: Record<ToolCategory, string> = {
  developer: "Developer",
  text: "Text",
  network: "Network",
  image: "Image",
  math: "Math",
  color: "Colors",
  file: "File",
  date: "Date"
};
