import { diffLines } from "diff";

export type LineDiffRow = { type: "same" | "add" | "remove"; text: string };

export function computeLineDiff(a: string, b: string): LineDiffRow[] {
  const parts = diffLines(a, b);
  const rows: LineDiffRow[] = [];
  for (const part of parts) {
    const lines = part.value.replace(/\n$/, "").split("\n");
    const type = part.added ? "add" : part.removed ? "remove" : "same";
    for (const line of lines) {
      if (line === "" && lines.length === 1 && part.value === "\n") {
        continue;
      }
      rows.push({ type, text: line });
    }
  }
  return rows;
}

export function lineDiffSummary(rows: LineDiffRow[]) {
  const added = rows.filter((r) => r.type === "add").length;
  const removed = rows.filter((r) => r.type === "remove").length;
  return { added, removed };
}
