function toPascalCase(value: string) {
  const sanitized = value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim();
  const parts = sanitized.split(/\s+/).filter(Boolean);
  if (!parts.length) {
    return "Value";
  }
  return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
}

function toCamelCase(value: string) {
  const p = toPascalCase(value);
  return p.charAt(0).toLowerCase() + p.slice(1);
}

function tsType(value: unknown, depth = 0): string {
  if (value === null) {
    return "null";
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "unknown[]";
    }
    return `${tsType(value[0], depth + 1)}[]`;
  }
  if (typeof value === "object") {
    return "object";
  }
  if (typeof value === "string") {
    return "string";
  }
  if (typeof value === "number") {
    return Number.isInteger(value) ? "number" : "number";
  }
  if (typeof value === "boolean") {
    return "boolean";
  }
  return "unknown";
}

function buildTsInterface(name: string, obj: Record<string, unknown>, asType: boolean): string {
  const lines = Object.entries(obj).map(([k, v]) => {
    const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `"${k}"`;
    let t: string;
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      t = buildTsInterface(toPascalCase(k), v as Record<string, unknown>, false).replace(
        /^export interface \w+ /,
        ""
      );
      t = `{ ${t.slice(1, -1).trim()} }`;
    } else if (Array.isArray(v) && v.length && typeof v[0] === "object" && v[0] !== null) {
      const inner = buildTsInterface(
        `${toPascalCase(k)}Item`,
        v[0] as Record<string, unknown>,
        false
      );
      t = `(${inner})[]`;
    } else {
      t = tsType(v);
    }
    return `  ${key}: ${t};`;
  });
  const kw = asType ? "type" : "interface";
  const body = lines.join("\n");
  if (asType) {
    return `export type ${name} = {\n${body}\n};\n`;
  }
  return `export interface ${name} {\n${body}\n}\n`;
}

export function jsonToTsInterface(json: string): string {
  const parsed = JSON.parse(json) as unknown;
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("Root must be a JSON object.");
  }
  return buildTsInterface("Root", parsed as Record<string, unknown>, false);
}

export function jsonToTsType(json: string): string {
  const parsed = JSON.parse(json) as unknown;
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("Root must be a JSON object.");
  }
  return buildTsInterface("Root", parsed as Record<string, unknown>, true);
}

function pyType(value: unknown): string {
  if (value === null) {
    return "None";
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "list[Any]";
    }
    return `list[${pyType(value[0])}]`;
  }
  if (typeof value === "object") {
    return "object";
  }
  if (typeof value === "string") {
    return "str";
  }
  if (typeof value === "number") {
    return Number.isInteger(value) ? "int" : "float";
  }
  if (typeof value === "boolean") {
    return "bool";
  }
  return "Any";
}

function buildDataclass(name: string, obj: Record<string, unknown>): string {
  const fields = Object.entries(obj).map(([k, v]) => {
    const field = toSnakeCase(k);
    let t: string;
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      t = toPascalCase(k);
    } else if (Array.isArray(v) && v.length && typeof v[0] === "object" && v[0] !== null) {
      t = `list[${toPascalCase(k)}Item]`;
    } else {
      t = pyType(v);
    }
    return `    ${field}: ${t}`;
  });
  return `@dataclass\nclass ${name}:\n${fields.join("\n")}\n`;
}

function toSnakeCase(s: string) {
  return s
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/\s+/g, "_")
    .toLowerCase();
}

export function jsonToPythonDataclass(json: string): string {
  const parsed = JSON.parse(json) as unknown;
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("Root must be a JSON object.");
  }
  const lines = ["from __future__ import annotations", "", "from dataclasses import dataclass", "from typing import Any, List, Optional", "", buildDataclass("Root", parsed as Record<string, unknown>)];
  return lines.join("\n");
}

function javaType(value: unknown): string {
  if (value === null) {
    return "Object";
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "java.util.List<Object>";
    }
    return `java.util.List<${javaType(value[0])}>`;
  }
  if (typeof value === "object") {
    return "Object";
  }
  if (typeof value === "string") {
    return "String";
  }
  if (typeof value === "number") {
    return Number.isInteger(value) ? "int" : "double";
  }
  if (typeof value === "boolean") {
    return "boolean";
  }
  return "Object";
}

export function jsonToJavaClass(json: string): string {
  const parsed = JSON.parse(json) as unknown;
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("Root must be a JSON object.");
  }
  const obj = parsed as Record<string, unknown>;
  const className = "RootObject";
  const fields = Object.entries(obj).map(([k, v]) => {
    const prop = toPascalCase(k);
    const field = toCamelCase(k);
    const type = javaType(v);
    return `    private ${type} ${field};`;
  });
  const getters = Object.entries(obj).map(([k, v]) => {
    const prop = toPascalCase(k);
    const field = toCamelCase(k);
    const type = javaType(v);
    return [
      `    public ${type} get${prop}() { return ${field}; }`,
      `    public void set${prop}(${type} v) { this.${field} = v; }`
    ].join("\n");
  });
  return [
    `public class ${className} {`,
    ...fields,
    "",
    ...getters,
    "}"
  ].join("\n");
}
