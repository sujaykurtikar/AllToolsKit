const FAVORITES_KEY = "pp_favorites";
const RECENT_KEY = "pp_recent_tools";
const THEME_KEY = "pp_theme";

function canUseStorage(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    const k = "__pp_test__";
    window.localStorage.setItem(k, "1");
    window.localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

export function getStorage<T>(key: string, fallback: T): T {
  if (!canUseStorage()) {
    return fallback;
  }
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setStorage<T>(key: string, value: T): void {
  if (!canUseStorage()) {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* silent */
  }
}

export function getFavorites(): string[] {
  return getStorage<string[]>(FAVORITES_KEY, []);
}

export function isFavorite(slug: string): boolean {
  return getFavorites().includes(slug);
}

/** Adds or removes slug; returns true if now favorited */
export function toggleFavorite(slug: string): boolean {
  const current = getFavorites();
  const next = current.includes(slug)
    ? current.filter((s) => s !== slug)
    : [...current, slug];
  setStorage(FAVORITES_KEY, next);
  return !current.includes(slug);
}

export function getRecentTools(): string[] {
  return getStorage<string[]>(RECENT_KEY, []);
}

export function addRecentTool(slug: string): void {
  const current = getRecentTools().filter((s) => s !== slug);
  const next = [slug, ...current].slice(0, 10);
  setStorage(RECENT_KEY, next);
}

export function getTheme(): "light" | "dark" {
  if (typeof window === "undefined") {
    return "light";
  }
  const stored = getStorage<string | null>(THEME_KEY, null);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

export function setTheme(theme: "light" | "dark"): void {
  setStorage(THEME_KEY, theme);
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }
}
