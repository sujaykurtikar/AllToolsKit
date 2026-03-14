const csharpKeywords = new Set([
  "abstract",
  "as",
  "base",
  "bool",
  "break",
  "byte",
  "case",
  "catch",
  "char",
  "checked",
  "class",
  "const",
  "continue",
  "decimal",
  "default",
  "delegate",
  "do",
  "double",
  "else",
  "enum",
  "event",
  "explicit",
  "extern",
  "false",
  "finally",
  "fixed",
  "float",
  "for",
  "foreach",
  "goto",
  "if",
  "implicit",
  "in",
  "int",
  "interface",
  "internal",
  "is",
  "lock",
  "long",
  "namespace",
  "new",
  "null",
  "object",
  "operator",
  "out",
  "override",
  "params",
  "private",
  "protected",
  "public",
  "readonly",
  "ref",
  "return",
  "sbyte",
  "sealed",
  "short",
  "sizeof",
  "stackalloc",
  "static",
  "string",
  "struct",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "typeof",
  "uint",
  "ulong",
  "unchecked",
  "unsafe",
  "ushort",
  "using",
  "virtual",
  "void",
  "volatile",
  "while"
]);

function requireInput(input: string, message: string) {
  if (!input.trim()) {
    throw new Error(message);
  }
}

export function formatJson(input: string, spacing: number) {
  requireInput(input, "Paste JSON to continue.");
  return JSON.stringify(JSON.parse(input), null, spacing);
}

function toPascalCase(value: string) {
  const sanitized = value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim();

  const result = sanitized
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  return result || "Value";
}

function toCSharpIdentifier(value: string) {
  let identifier = toPascalCase(value);

  if (/^[0-9]/.test(identifier)) {
    identifier = `Value${identifier}`;
  }

  if (csharpKeywords.has(identifier.toLowerCase())) {
    identifier = `${identifier}Value`;
  }

  return identifier;
}

function parseJsonRoot(input: string) {
  requireInput(input, "Paste JSON to continue.");
  const parsed = JSON.parse(input) as unknown;

  if (parsed === null) {
    throw new Error("Top-level JSON cannot be null.");
  }

  if (typeof parsed !== "object") {
    throw new Error("Provide a JSON object or array as input.");
  }

  return parsed;
}

function inferPrimitiveType(value: unknown): string {
  if (typeof value === "string") {
    return "string";
  }

  if (typeof value === "number") {
    return Number.isInteger(value) ? "int" : "double";
  }

  if (typeof value === "boolean") {
    return "bool";
  }

  return "object";
}

type ClassRegistry = Map<string, string>;

function registerClass(
  className: string,
  source: Record<string, unknown>,
  registry: ClassRegistry
) {
  if (registry.has(className)) {
    return;
  }

  const properties = Object.entries(source).map(([key, value]) => {
    const propertyName = toCSharpIdentifier(key);
    const type = inferCSharpType(propertyName, value, registry);
    return `    public ${type} ${propertyName} { get; set; }`;
  });

  const body = properties.length
    ? properties.join("\n")
    : "    public object? Value { get; set; }";

  registry.set(className, `public class ${className}\n{\n${body}\n}`);
}

function inferArrayType(
  propertyName: string,
  value: unknown[],
  registry: ClassRegistry
): string {
  if (value.length === 0) {
    return "List<object>";
  }

  const firstNonNull = value.find((entry) => entry !== null);
  if (firstNonNull === undefined) {
    return "List<object>";
  }

  if (Array.isArray(firstNonNull)) {
    return `List<${inferArrayType(`${propertyName}Item`, firstNonNull, registry)}>`;
  }

  if (typeof firstNonNull === "object") {
    const itemName = `${propertyName}Item`;
    registerClass(itemName, firstNonNull as Record<string, unknown>, registry);
    return `List<${itemName}>`;
  }

  return `List<${inferPrimitiveType(firstNonNull)}>`;
}

function inferCSharpType(
  propertyName: string,
  value: unknown,
  registry: ClassRegistry
): string {
  if (value === null) {
    return "object?";
  }

  if (Array.isArray(value)) {
    return inferArrayType(propertyName, value, registry);
  }

  if (typeof value === "object") {
    const className = propertyName;
    registerClass(className, value as Record<string, unknown>, registry);
    return className;
  }

  return inferPrimitiveType(value);
}

export function generateCSharp(input: string) {
  const parsed = parseJsonRoot(input);
  const registry: ClassRegistry = new Map();

  if (Array.isArray(parsed)) {
    const firstObject = parsed.find(
      (entry) => entry !== null && typeof entry === "object" && !Array.isArray(entry)
    );

    if (!firstObject) {
      throw new Error("Root arrays must contain at least one object to generate classes.");
    }

    registerClass("RootItem", firstObject as Record<string, unknown>, registry);
    return [
      "using System.Collections.Generic;",
      "",
      "public class RootObject : List<RootItem>",
      "{",
      "}",
      "",
      ...registry.values()
    ].join("\n");
  }

  registerClass("RootObject", parsed as Record<string, unknown>, registry);
  return ["using System.Collections.Generic;", "", ...registry.values()].join("\n\n");
}

export function encodeBase64(input: string) {
  requireInput(input, "Enter text to encode.");
  if (typeof Buffer !== "undefined") {
    return Buffer.from(input, "utf8").toString("base64");
  }

  const bytes = new TextEncoder().encode(input);
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binary);
}

export function decodeBase64(input: string) {
  requireInput(input, "Enter Base64 text to decode.");
  const normalized = input.replace(/\s+/g, "");

  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normalized) || normalized.length % 4 !== 0) {
    throw new Error("Enter a valid Base64 string.");
  }

  if (typeof Buffer !== "undefined") {
    const buffer = Buffer.from(normalized, "base64");

    if (buffer.toString("base64") !== normalized) {
      throw new Error("Enter a valid Base64 string.");
    }

    return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  }

  const binary = atob(normalized);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

function buildTimestampSummary(date: Date) {
  return [
    `UTC ISO: ${date.toISOString()}`,
    `Local: ${date.toLocaleString()}`,
    `Unix Seconds: ${Math.floor(date.getTime() / 1000)}`,
    `Unix Milliseconds: ${date.getTime()}`
  ].join("\n");
}

export function formatTimestampFromUnix(input: string) {
  requireInput(input, "Enter a Unix timestamp.");
  const trimmed = input.trim();

  if (!/^-?\d+$/.test(trimmed)) {
    throw new Error("Unix timestamp must be numeric.");
  }

  const numeric = Number(trimmed);
  const milliseconds = trimmed.length <= 10 ? numeric * 1000 : numeric;
  const date = new Date(milliseconds);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Enter a valid Unix timestamp.");
  }

  return buildTimestampSummary(date);
}

export function formatTimestampFromDate(input: string) {
  requireInput(input, "Enter a date or time value.");
  const date = new Date(input);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Enter a valid date or ISO timestamp.");
  }

  return buildTimestampSummary(date);
}

export function generateGuids(
  count: number,
  uppercase: boolean,
  uuidFactory: () => string = () => crypto.randomUUID()
) {
  const safeCount = Math.min(Math.max(Number.isFinite(count) ? Math.floor(count) : 1, 1), 50);
  const values = Array.from({ length: safeCount }, () => uuidFactory());
  return values.map((value) => (uppercase ? value.toUpperCase() : value)).join("\n");
}
