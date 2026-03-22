export function parseCsv(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let i = 0;
  let inQuotes = false;
  const len = text.length;
  const d = delimiter;

  while (i < len) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cur += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      cur += c;
      i++;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (c === "\n" || (c === "\r" && text[i + 1] === "\n")) {
      row.push(cur);
      rows.push(row);
      row = [];
      cur = "";
      if (c === "\r") {
        i += 2;
      } else {
        i++;
      }
      continue;
    }
    if (c === "\r") {
      row.push(cur);
      rows.push(row);
      row = [];
      cur = "";
      i++;
      continue;
    }
    if (c === d[0] && (d.length === 1 || text.slice(i, i + d.length) === d)) {
      row.push(cur);
      cur = "";
      i += d.length;
      continue;
    }
    cur += c;
    i++;
  }
  row.push(cur);
  if (row.some((cell) => cell.length > 0) || rows.length > 0) {
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.length > 0));
}

export function rowsToObjects(rows: string[][], hasHeader: boolean): Record<string, string>[] {
  if (rows.length === 0) {
    return [];
  }
  const header = hasHeader ? rows[0] : rows[0].map((_, i) => `col${i + 1}`);
  const data = hasHeader ? rows.slice(1) : rows;
  return data.map((r) => {
    const o: Record<string, string> = {};
    header.forEach((h, idx) => {
      o[h] = r[idx] ?? "";
    });
    return o;
  });
}

export function objectsToCsv(objs: Record<string, string>[], headers?: string[]): string {
  if (objs.length === 0) {
    return "";
  }
  const cols = headers ?? Object.keys(objs[0]);
  const esc = (v: string) => {
    if (/[",\n]/.test(v)) {
      return `"${v.replace(/"/g, '""')}"`;
    }
    return v;
  };
  const lines = [cols.join(",")];
  for (const o of objs) {
    lines.push(cols.map((c) => esc(o[c] ?? "")).join(","));
  }
  return lines.join("\n");
}
