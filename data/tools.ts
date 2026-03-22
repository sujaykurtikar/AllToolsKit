/**
 * Tool search copy: optional `searchText` holds extra synonyms/use-cases for lexical + semantic search.
 * Card UI still uses `description`. Also include slug-derived phrases via getSearchableText (slug words + related tools).
 */
import { designerToolsData } from "@/lib/designer-tools-data";

export type ToolCategory =
  | "developer"
  | "text"
  | "network"
  | "image"
  | "math"
  | "color"
  | "file"
  | "date"
  | "designer";

const CATEGORY_VALUES = new Set<ToolCategory | "all">([
  "all",
  "developer",
  "text",
  "color",
  "network",
  "math",
  "image",
  "file",
  "date",
  "designer"
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
  /** Optional extra phrases/synonyms for search and embeddings (not shown on cards by default). */
  searchText?: string;
  category: ToolCategory;
  icon: string;
  tags: string[];
  related: string[];
}

/** Canonical blob for lexical search and embedding text (slug words + related tools + optional searchText). */
export function getSearchableText(t: Tool): string {
  const slugPhrase = t.slug.replace(/-/g, " ");
  const relatedPhrase = t.related.map((r) => r.replace(/-/g, " ")).join(" ");
  return [
    t.name,
    t.description,
    t.tags.join(" "),
    t.searchText ?? "",
    slugPhrase,
    relatedPhrase
  ]
    .join(" ")
    .toLowerCase();
}

export const siteUrl = "https://pandapath.com";

export const tools: Tool[] = [
  // Developer (39)
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    description: "Format, minify, and validate JSON in your browser.",
    searchText:
      "pretty print beautify stringify api response debugger network tab invalid json fix indentation",
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
    searchText:
      "json web token bearer oauth inspect claims decode token debug authentication session",
    category: "developer",
    icon: "JW",
    tags: ["jwt", "token", "decode"],
    related: ["base64", "json-formatter", "hash-generator"]
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    description: "Test regular expressions with live highlighting.",
    searchText:
      "regular expression pattern matcher pcre grep capture groups test string",
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
    searchText: "b64 encode decode binary text data uri atob btoa attachment",
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
    searchText: "prettify sql query database postgres mysql dialect indent",
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
  {
    slug: "css-minifier",
    name: "CSS Minifier",
    description: "Minify CSS in the browser (comments and whitespace).",
    category: "developer",
    icon: "CM",
    tags: ["css", "minify", "optimize"],
    related: ["css-beautifier", "html-minifier", "js-minifier"]
  },
  {
    slug: "js-minifier",
    name: "JavaScript Minifier",
    description: "Minify JavaScript with Terser.",
    category: "developer",
    icon: "JM",
    tags: ["javascript", "minify", "terser"],
    related: ["html-minifier", "css-minifier"]
  },
  {
    slug: "html-minifier",
    name: "HTML Minifier",
    description: "Minify HTML markup (whitespace and comments).",
    category: "developer",
    icon: "HM",
    tags: ["html", "minify", "compress"],
    related: ["css-minifier", "js-minifier"]
  },
  {
    slug: "css-beautifier",
    name: "CSS Beautifier",
    description: "Format CSS with readable indentation.",
    category: "developer",
    icon: "CB",
    tags: ["css", "format", "prettify"],
    related: ["css-minifier", "css-to-tailwind"]
  },
  {
    slug: "http-status-codes",
    name: "HTTP Status Codes",
    description: "Quick reference for common HTTP status codes.",
    category: "developer",
    icon: "HS",
    tags: ["http", "status", "rest"],
    related: ["http-headers", "json-formatter"]
  },
  {
    slug: "json-path",
    name: "JSONPath Tester",
    description: "Query JSON with JSONPath expressions.",
    category: "developer",
    icon: "JP",
    tags: ["json", "jsonpath", "query"],
    related: ["json-formatter", "json-schema-validator"]
  },
  {
    slug: "jwt-generator",
    name: "JWT Generator (HS256)",
    description: "Sign JWTs with a shared secret using HS256.",
    category: "developer",
    icon: "JG",
    tags: ["jwt", "sign", "hs256"],
    related: ["jwt-decoder", "hmac-generator"]
  },
  {
    slug: "css-to-tailwind",
    name: "CSS → Tailwind Hints",
    description: "Heuristic mapping from CSS snippets to Tailwind-style class ideas.",
    category: "developer",
    icon: "C2",
    tags: ["tailwind", "css", "convert"],
    related: ["tailwind-colors", "css-beautifier"]
  },
  {
    slug: "hmac-generator",
    name: "HMAC Generator",
    description: "Compute HMAC-SHA256/384/512 with Web Crypto.",
    category: "developer",
    icon: "HK",
    tags: ["hmac", "sha", "crypto"],
    related: ["hash-generator", "jwt-generator"]
  },
  {
    slug: "bcrypt-hash",
    name: "Bcrypt Hash",
    description: "Hash and verify passwords with bcrypt (bcryptjs).",
    category: "developer",
    icon: "BC",
    tags: ["bcrypt", "password", "hash"],
    related: ["password-gen", "hash-generator"]
  },
  {
    slug: "public-key-inspector",
    name: "PEM Public Key → JWK",
    description: "Import an RSA/EC PEM public key and export JWK (via jose).",
    category: "developer",
    icon: "PK",
    tags: ["pem", "jwk", "rsa"],
    related: ["jwt-decoder", "jwt-generator"]
  },
  {
    slug: "email-validator",
    name: "Email Syntax Validator",
    description: "Check email address syntax (client-side rules).",
    category: "developer",
    icon: "EM",
    tags: ["email", "validation", "syntax"],
    related: ["regex-tester", "url-encoder"]
  },
  {
    slug: "credit-card-validator",
    name: "Credit Card (Luhn)",
    description: "Validate card numbers with the Luhn algorithm.",
    category: "developer",
    icon: "CC",
    tags: ["luhn", "card", "validation"],
    related: ["iban-validator"]
  },
  {
    slug: "iban-validator",
    name: "IBAN Validator",
    description: "Validate IBAN format and checksum (ibantools).",
    category: "developer",
    icon: "IB",
    tags: ["iban", "bank", "validation"],
    related: ["credit-card-validator"]
  },
  {
    slug: "ip-validator",
    name: "IP Address Validator",
    description: "Validate IPv4 and basic IPv6 address strings.",
    category: "developer",
    icon: "IV",
    tags: ["ip", "ipv4", "ipv6"],
    related: ["ip-lookup", "dns-lookup"]
  },
  {
    slug: "json-schema-validator",
    name: "JSON Schema Validator",
    description: "Validate JSON against a JSON Schema (AJV).",
    category: "developer",
    icon: "JS",
    tags: ["json", "schema", "ajv"],
    related: ["json-formatter", "json-path"]
  },
  {
    slug: "cron-validator",
    name: "Cron Expression Parser",
    description: "Parse cron expressions and list next run times (cron-parser).",
    category: "developer",
    icon: "CR",
    tags: ["cron", "schedule", "parser"],
    related: ["cron-parser"]
  },
  // Text (17)
  {
    slug: "word-counter",
    name: "Word & Character Counter",
    description: "Count words, characters, sentences, and reading time.",
    searchText: "word count characters reading time blog essay length limit twitter",
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
  {
    slug: "text-to-speech",
    name: "Text to Speech",
    description: "Speak text aloud with the browser speech synthesis API.",
    category: "text",
    icon: "TTS",
    tags: ["speech", "audio", "accessibility"],
    related: ["word-counter", "unicode-inspector"]
  },
  {
    slug: "emoji-picker",
    name: "Emoji Picker",
    description: "Browse and copy common emoji characters.",
    category: "text",
    icon: "EJ",
    tags: ["emoji", "unicode", "copy"],
    related: ["unicode-inspector", "string-escape"]
  },
  {
    slug: "string-escape",
    name: "String Escape / Unescape",
    description: "Escape or unescape strings for JSON, JS, URL, and HTML contexts.",
    category: "text",
    icon: "SE",
    tags: ["escape", "encode", "string"],
    related: ["url-encoder", "html-entities"]
  },
  {
    slug: "text-morse",
    name: "Morse Code",
    description: "Encode and decode Morse code with optional audio playback.",
    category: "text",
    icon: "MC",
    tags: ["morse", "encode", "audio"],
    related: ["text-to-binary", "rot13"]
  },
  {
    slug: "unicode-inspector",
    name: "Unicode Inspector",
    description: "Inspect code points, names, and categories for each character.",
    category: "text",
    icon: "UC",
    tags: ["unicode", "codepoint", "utf-8"],
    related: ["emoji-picker", "text-to-speech"]
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
  // Image (10)
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
  {
    slug: "image-compressor",
    name: "Image Compressor",
    description: "Re-encode images with adjustable JPEG/WebP quality in the browser.",
    searchText: "compress photo smaller file size jpeg webp quality optimize upload",
    category: "image",
    icon: "IC",
    tags: ["image", "compress", "jpeg"],
    related: ["image-resizer", "image-format-converter"]
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    description: "Resize images to new dimensions with canvas.",
    category: "image",
    icon: "IR",
    tags: ["resize", "canvas", "dimensions"],
    related: ["image-compressor", "placeholder-image"]
  },
  {
    slug: "image-format-converter",
    name: "Image Format Converter",
    description: "Convert between PNG, JPEG, and WebP in the browser.",
    category: "image",
    icon: "IF",
    tags: ["png", "jpeg", "webp"],
    related: ["image-compressor", "image-to-base64"]
  },
  {
    slug: "image-color-picker",
    name: "Image Color Picker",
    description: "Pick a pixel color from an uploaded image.",
    category: "image",
    icon: "PX",
    tags: ["color", "eyedropper", "hex"],
    related: ["color-converter", "image-compressor"]
  },
  {
    slug: "exif-viewer",
    name: "EXIF Viewer",
    description: "Read EXIF metadata from JPEG and other supported images (exifr).",
    category: "image",
    icon: "EX",
    tags: ["exif", "metadata", "photo"],
    related: ["image-compressor", "image-resizer"]
  },
  // Color (5)
  {
    slug: "color-converter",
    name: "Color Converter",
    description: "Convert colors between HEX, RGB, HSL, HSV, and CMYK.",
    searchText: "hex rgb hsl hsv cmyk pick color space css value",
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
    searchText:
      "wcag aa aaa accessibility readable text foreground background ratio a11y vision",
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
  // Math (8)
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
  {
    slug: "unit-converter",
    name: "Unit Converter",
    description: "Convert length, mass, temperature, speed, area, and volume.",
    searchText: "metric imperial miles kilometers pounds kilograms celsius fahrenheit si",
    category: "math",
    icon: "UN",
    tags: ["units", "convert", "metric"],
    related: ["currency-converter", "base-converter"]
  },
  {
    slug: "currency-converter",
    name: "Currency Converter",
    description: "Convert amounts using Frankfurter daily ECB rates (no API key).",
    category: "math",
    icon: "FX",
    tags: ["currency", "forex", "ecb"],
    related: ["unit-converter", "percentage-calc"]
  },
  {
    slug: "bitwise-calculator",
    name: "Bitwise Calculator",
    description: "AND, OR, XOR, shifts on decimal or hex integers.",
    category: "math",
    icon: "BW",
    tags: ["bitwise", "binary", "hex"],
    related: ["base-converter", "scientific-calc"]
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
  },
  ...designerToolsData
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

function tokenizeQuery(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.replace(/[^\w/+.-]/g, ""))
    .filter((w) => w.length > 0);
}

/** Max Levenshtein distance vs a word (depends on token length). */
function maxEditDistanceForToken(len: number): number {
  if (len <= 2) {
    return 0;
  }
  if (len <= 4) {
    return 1;
  }
  if (len <= 7) {
    return 2;
  }
  return 3;
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) {
    return n;
  }
  if (n === 0) {
    return m;
  }
  const prev = new Array<number>(n + 1);
  const curr = new Array<number>(n + 1);
  for (let j = 0; j <= n; j++) {
    prev[j] = j;
  }
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    const ac = a.charCodeAt(i - 1);
    for (let j = 1; j <= n; j++) {
      const cost = ac === b.charCodeAt(j - 1) ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= n; j++) {
      prev[j] = curr[j];
    }
  }
  return prev[n];
}

function wordCandidatesFromBlob(text: string, slug: string): string[] {
  const fromText = text
    .split(/[^a-z0-9+/]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0);
  const fromSlug = slug
    .replace(/-/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0);
  return [...fromText, ...fromSlug];
}

/**
 * Strict: substring match. Fuzzy: same, or Levenshtein within budget vs any word (typo tolerance).
 */
function tokenMatchesLexical(text: string, slug: string, token: string, fuzzy: boolean): boolean {
  if (text.includes(token) || slug.includes(token)) {
    return true;
  }
  if (!fuzzy) {
    return false;
  }
  const maxD = maxEditDistanceForToken(token.length);
  if (maxD === 0) {
    return false;
  }
  for (const w of wordCandidatesFromBlob(text, slug)) {
    if (Math.abs(w.length - token.length) > maxD) {
      continue;
    }
    if (levenshtein(w, token) <= maxD) {
      return true;
    }
  }
  return false;
}

/**
 * Lexical search: every query token must match (AND). First strict substrings; if no results, fuzzy words.
 * Results sorted by match quality (name/slug bonuses).
 */
export function searchToolsLexical(query: string): Tool[] {
  const raw = query.trim().toLowerCase();
  if (!raw) {
    return tools;
  }
  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) {
    return tools;
  }

  const slugBonus = (t: Tool, q: string): number => {
    const slug = t.slug.toLowerCase();
    let b = 0;
    if (slug === q.replace(/\s+/g, "-")) {
      b += 4;
    }
    if (t.name.toLowerCase().includes(raw)) {
      b += 2;
    }
    if (slug.includes(raw.replace(/\s+/g, "-"))) {
      b += 1;
    }
    return b;
  };

  const run = (fuzzy: boolean) => {
    return tools
      .map((t) => {
        const text = getSearchableText(t);
        const slug = t.slug.toLowerCase();
        let hits = 0;
        for (const tok of tokens) {
          if (tokenMatchesLexical(text, slug, tok, fuzzy)) {
            hits += 1;
          }
        }
        if (hits < tokens.length) {
          return { t, score: -1 };
        }
        const base = hits + slugBonus(t, raw);
        return { t, score: base };
      })
      .filter((x) => x.score >= 0)
      .sort((a, b) => b.score - a.score);
  };

  const strict = run(false);
  if (strict.length > 0) {
    return strict.map((x) => x.t);
  }
  return run(true).map((x) => x.t);
}

/** Lexical-only search (sync). Prefer `searchToolsAsync` for hybrid semantic ranking in the UI. */
export function searchTools(query: string): Tool[] {
  return searchToolsLexical(query);
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
  date: "Date",
  designer: "Designer"
};
