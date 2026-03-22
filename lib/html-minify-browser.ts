/**
 * Browser-safe HTML compaction (no Node-only deps). Removes HTML comments and
 * collapses whitespace between tags — suitable for typical snippets.
 */
export function minifyHtmlBrowser(input: string): string {
  let s = input.replace(/<!--([\s\S]*?)-->/g, "");
  s = s.replace(/>\s+</g, "><");
  s = s.replace(/\s{2,}/g, " ");
  return s.trim();
}
