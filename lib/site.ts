/** Must match `basePath` in next.config.mjs */
export const basePath = "/tools";

export function withBasePath(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${p}`;
}
