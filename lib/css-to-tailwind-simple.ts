/**
 * Maps a subset of common CSS declarations to Tailwind v3 utility hints.
 * Not exhaustive — for full conversion use Tailwind arbitrary values.
 */
export function cssDeclarationToTailwindHint(property: string, value: string): string | null {
  const p = property.trim().toLowerCase().replace(/^-+(webkit|moz|ms)-/, "");
  const v = value.trim().toLowerCase();
  if (p === "display") {
    if (v === "flex") {
      return "flex";
    }
    if (v === "grid") {
      return "grid";
    }
    if (v === "block") {
      return "block";
    }
    if (v === "inline-block") {
      return "inline-block";
    }
    if (v === "hidden" || v === "none") {
      return "hidden";
    }
  }
  if (p === "flex-direction") {
    if (v === "column") {
      return "flex-col";
    }
    if (v === "row") {
      return "flex-row";
    }
    if (v === "column-reverse") {
      return "flex-col-reverse";
    }
  }
  if (p === "justify-content") {
    const m: Record<string, string> = {
      "flex-start": "justify-start",
      "flex-end": "justify-end",
      center: "justify-center",
      "space-between": "justify-between",
      "space-around": "justify-around",
      "space-evenly": "justify-evenly"
    };
    return m[v] ?? null;
  }
  if (p === "align-items") {
    const m: Record<string, string> = {
      "flex-start": "items-start",
      "flex-end": "items-end",
      center: "items-center",
      stretch: "items-stretch",
      baseline: "items-baseline"
    };
    return m[v] ?? null;
  }
  if (p === "gap") {
    return `gap-[${value.trim()}]`;
  }
  if (p === "padding") {
    return `p-[${value.trim()}]`;
  }
  if (p === "margin") {
    return `m-[${value.trim()}]`;
  }
  if (p === "font-size") {
    return `text-[${value.trim()}]`;
  }
  if (p === "font-weight") {
    if (v === "700" || v === "bold") {
      return "font-bold";
    }
    if (v === "400" || v === "normal") {
      return "font-normal";
    }
    return `font-[${value.trim()}]`;
  }
  if (p === "color") {
    return `text-[${value.trim()}]`;
  }
  if (p === "background-color") {
    return `bg-[${value.trim()}]`;
  }
  if (p === "border-radius") {
    return `rounded-[${value.trim()}]`;
  }
  if (p === "width") {
    return `w-[${value.trim()}]`;
  }
  if (p === "height") {
    return `h-[${value.trim()}]`;
  }
  if (p === "max-width") {
    return `max-w-[${value.trim()}]`;
  }
  return null;
}

export function cssBlockToTailwindHints(css: string): string {
  const lines: string[] = [];
  const rules = css.split(/[;}]/).map((s) => s.trim()).filter(Boolean);
  for (const rule of rules) {
    const idx = rule.indexOf(":");
    if (idx === -1) {
      continue;
    }
    const prop = rule.slice(0, idx).trim();
    const val = rule.slice(idx + 1).trim();
    const hint = cssDeclarationToTailwindHint(prop, val);
    if (hint) {
      lines.push(`/* ${prop}: ${val} */ ${hint}`);
    } else {
      lines.push(`/* ${prop}: ${val} → use arbitrary: [${val}] or extend theme */`);
    }
  }
  return lines.join("\n");
}
