/**
 * Browser-safe CSS minification (no Node fs). Strips comments and collapses whitespace.
 * Not a full CSS parser; suitable for typical snippets and stylesheets.
 */
export function minifyCssBrowser(input: string): string {
  let s = input.replace(/\/\*[\s\S]*?\*\//g, "");
  s = s.replace(/\s+/g, " ");
  s = s.replace(/\s*([{}:;,>+~])\s*/g, "$1");
  s = s.replace(/;\s*}/g, "}");
  return s.trim();
}
