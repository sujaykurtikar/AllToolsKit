import assert from "node:assert/strict";
import test from "node:test";

import { getStorage } from "../lib/storage.ts";

test("getStorage returns fallback when localStorage is unavailable", () => {
  assert.equal(getStorage("k", 42), 42);
});

test("storage with mocked window supports favorites and theme", async () => {
  const store = new Map<string, string>();
  const ls = {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => {
      store.set(k, v);
    },
    removeItem: (k: string) => {
      store.delete(k);
    },
    key: (i: number) => [...store.keys()][i] ?? null
  };
  Object.defineProperty(globalThis, "window", {
    value: { localStorage: ls },
    configurable: true
  });

  const { addRecentTool, getFavorites, getRecentTools, getTheme, setTheme, toggleFavorite } =
    await import("../lib/storage.ts");

  assert.equal(toggleFavorite("a"), true);
  assert.deepEqual(getFavorites(), ["a"]);
  assert.equal(toggleFavorite("a"), false);
  assert.deepEqual(getFavorites(), []);

  addRecentTool("x");
  addRecentTool("y");
  addRecentTool("x");
  assert.deepEqual(getRecentTools(), ["x", "y"]);

  setTheme("dark");
  assert.equal(getTheme(), "dark");
  setTheme("light");
  assert.equal(getTheme(), "light");

  delete (globalThis as { window?: unknown }).window;
});
