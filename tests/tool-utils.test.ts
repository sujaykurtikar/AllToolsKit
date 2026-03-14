import assert from "node:assert/strict";
import test from "node:test";

import {
  decodeBase64,
  encodeBase64,
  formatJson,
  formatTimestampFromDate,
  formatTimestampFromUnix,
  generateCSharp,
  generateGuids
} from "../lib/tool-utils.ts";

test("JSON formatter pretty prints valid JSON", () => {
  const result = formatJson('{"name":"AllToolsKit","enabled":true}', 2);
  assert.equal(result, '{\n  "name": "AllToolsKit",\n  "enabled": true\n}');
});

test("JSON formatter minifies JSON", () => {
  const result = formatJson('{"name":"AllToolsKit","enabled":true}', 0);
  assert.equal(result, '{"name":"AllToolsKit","enabled":true}');
});

test("JSON formatter rejects empty input", () => {
  assert.throws(() => formatJson("   ", 2), /Paste JSON to continue/);
});

test("JSON to C# class handles nested objects arrays and reserved words", () => {
  const result = generateCSharp(
    JSON.stringify({
      class: "tool",
      meta: { isEnabled: true },
      tags: ["json", "csharp"],
      items: [{ id: 1 }]
    })
  );

  assert.match(result, /public class RootObject/);
  assert.match(result, /public string ClassValue { get; set; }/);
  assert.match(result, /public Meta Meta { get; set; }/);
  assert.match(result, /public List<string> Tags { get; set; }/);
  assert.match(result, /public List<ItemsItem> Items { get; set; }/);
  assert.match(result, /public class Meta/);
  assert.match(result, /public class ItemsItem/);
});

test("JSON to C# class rejects non object root values", () => {
  assert.throws(() => generateCSharp('"hello"'), /Provide a JSON object or array/);
});

test("GUID generator returns the requested count and uppercase format", () => {
  let index = 0;
  const values = ["aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"];
  const result = generateGuids(2, true, () => values[index++]);

  assert.equal(
    result,
    "AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA\nBBBBBBBB-BBBB-BBBB-BBBB-BBBBBBBBBBBB"
  );
});

test("GUID generator clamps invalid counts", () => {
  const result = generateGuids(0, false, () => "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
  assert.equal(result, "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
});

test("timestamp converter formats unix timestamps", () => {
  const result = formatTimestampFromUnix("1710000000");
  assert.match(result, /UTC ISO: 2024-03-09T16:00:00.000Z/);
  assert.match(result, /Unix Seconds: 1710000000/);
});

test("timestamp converter formats date strings", () => {
  const result = formatTimestampFromDate("2026-03-14T12:00:00Z");
  assert.match(result, /UTC ISO: 2026-03-14T12:00:00.000Z/);
  assert.match(result, /Unix Milliseconds: 1773489600000/);
});

test("timestamp converter rejects invalid unix input", () => {
  assert.throws(() => formatTimestampFromUnix("abc"), /must be numeric/);
});

test("Base64 encoder and decoder round trip UTF-8 text", () => {
  const encoded = encodeBase64("Hello नमस्ते");
  assert.equal(encoded, "SGVsbG8g4KSo4KSu4KS44KWN4KSk4KWH");
  assert.equal(decodeBase64(encoded), "Hello नमस्ते");
});

test("Base64 decoder rejects invalid input", () => {
  assert.throws(() => decodeBase64("%%%"), /valid Base64 string/);
});
