"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { tools } from "@/data/tools";
import {
  decodeBase64,
  encodeBase64,
  formatJson,
  formatTimestampFromDate,
  formatTimestampFromUnix,
  generateCSharp,
  generateGuids
} from "@/lib/tool-utils";

async function copyToClipboard(value: string) {
  if (!value) {
    throw new Error("Nothing to copy yet.");
  }

  if (!navigator.clipboard?.writeText) {
    throw new Error("Clipboard is not available in this browser.");
  }

  await navigator.clipboard.writeText(value);
}

export function ToolClient({ slug }: { slug: string }) {
  const tool = tools.find((item) => item.slug === slug);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [guidCount, setGuidCount] = useState(3);
  const [uppercase, setUppercase] = useState(false);
  const [copied, setCopied] = useState(false);

  const placeholder = useMemo(() => {
    switch (slug) {
      case "json-formatter":
        return '{\n  "name": "AllToolsKit",\n  "tools": ["JSON Formatter", "GUID Generator"]\n}';
      case "json-to-csharp-class":
        return '{\n  "id": 1,\n  "name": "Tool",\n  "tags": ["json", "csharp"],\n  "meta": { "active": true }\n}';
      case "timestamp-converter":
        return "1710000000 or 2026-03-14T12:00:00Z";
      case "base64-encoder":
        return "Encode or decode this text";
      default:
        return "";
    }
  }, [slug]);

  if (!tool) {
    return null;
  }

  const setResult = (nextOutput: string) => {
    setOutput(nextOutput);
    setCopied(false);
  };

  const clearState = () => {
    setInput("");
    setOutput("");
    setError("");
    setCopied(false);
  };

  const runPrimaryAction = () => {
    try {
      setError("");

      switch (slug) {
        case "json-formatter":
          setResult(formatJson(input, 2));
          return;
        case "json-to-csharp-class":
          setResult(generateCSharp(input));
          return;
        case "guid-generator":
          setResult(generateGuids(guidCount, uppercase));
          return;
        case "timestamp-converter":
          setResult(formatTimestampFromUnix(input));
          return;
        case "base64-encoder":
          setResult(encodeBase64(input));
          return;
        default:
          setResult("");
      }
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Something went wrong.");
    }
  };

  const runSecondaryAction = () => {
    try {
      setError("");

      switch (slug) {
        case "json-formatter":
          setResult(formatJson(input, 0));
          return;
        case "timestamp-converter":
          setResult(formatTimestampFromDate(input));
          return;
        case "base64-encoder":
          setResult(decodeBase64(input));
          return;
        default:
          setResult("");
      }
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Something went wrong.");
    }
  };

  const handleCopy = async () => {
    try {
      setError("");
      await copyToClipboard(output);
      setCopied(true);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Something went wrong.");
    }
  };

  const primaryLabel =
    slug === "json-formatter"
      ? "Format JSON"
      : slug === "json-to-csharp-class"
        ? "Generate Class"
        : slug === "guid-generator"
          ? "Generate GUIDs"
          : slug === "timestamp-converter"
            ? "Unix to Date"
            : "Encode";

  const secondaryLabel =
    slug === "json-formatter"
      ? "Minify JSON"
      : slug === "timestamp-converter"
        ? "Date to Unix"
        : "Decode";

  return (
    <div className="rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">{tool.name}</h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">{tool.description}</p>
        </div>
        <Link
          href="/tools"
          className="inline-flex shrink-0 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-600 hover:text-blue-600"
        >
          Close
        </Link>
      </div>

      <div className="mt-6 grid gap-6">
        {slug === "guid-generator" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-gray-700">
              GUID count
              <input
                type="number"
                min={1}
                max={50}
                value={guidCount}
                onChange={(event) => setGuidCount(Number(event.target.value))}
                className="rounded-lg border border-gray-200 px-3 py-3 text-gray-800 outline-none transition focus:border-blue-600"
              />
            </label>
            <label className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(event) => setUppercase(event.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              Uppercase output
            </label>
          </div>
        ) : (
          <label className="grid gap-2 text-sm font-medium text-gray-700">
            {tool.inputLabel}
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={placeholder}
              className="min-h-48 rounded-lg border border-gray-200 px-3 py-3 font-mono text-sm text-gray-800 outline-none transition focus:border-blue-600"
            />
          </label>
        )}

        {slug === "timestamp-converter" ? (
          <p className="text-sm text-gray-500">
            Use a Unix timestamp for the first button, or an ISO/local date string for
            the second.
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={runPrimaryAction}
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {primaryLabel}
          </button>
          {(slug === "json-formatter" ||
            slug === "timestamp-converter" ||
            slug === "base64-encoder") && (
            <button
              type="button"
              onClick={runSecondaryAction}
              className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-800 transition hover:border-blue-600 hover:text-blue-600"
            >
              {secondaryLabel}
            </button>
          )}
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-800 transition hover:border-blue-600 hover:text-blue-600"
          >
            {copied ? "Copied" : "Copy Output"}
          </button>
          <button
            type="button"
            onClick={clearState}
            className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-800 transition hover:border-blue-600 hover:text-blue-600"
          >
            Clear
          </button>
        </div>

        <label className="grid gap-2 text-sm font-medium text-gray-700">
          {tool.outputLabel}
          <textarea
            value={output}
            readOnly
            className="min-h-48 rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 font-mono text-sm text-gray-800 outline-none"
          />
        </label>

        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
