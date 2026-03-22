import { basePath } from "@/lib/site";

/** API routes live under the same origin with `basePath` prefix. */
export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${p}`;
}
