import { NextResponse } from "next/server";

export const runtime = "nodejs";

function matchPath(rulePath: string, testPath: string): boolean {
  const r = rulePath.trim();
  if (!r || r === "/") {
    return true;
  }
  if (r.endsWith("*")) {
    const prefix = r.slice(0, -1);
    return testPath.startsWith(prefix);
  }
  return testPath === r || testPath.startsWith(r.endsWith("/") ? r : `${r}/`);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain")?.trim();
  const path = searchParams.get("path")?.trim() || "/";
  if (!domain) {
    return NextResponse.json({ error: "Missing domain" }, { status: 400 });
  }
  const base = domain.startsWith("http") ? domain : `https://${domain}`;
  let robotsUrl: URL;
  try {
    robotsUrl = new URL("/robots.txt", base);
  } catch {
    return NextResponse.json({ error: "Invalid domain" }, { status: 400 });
  }
  try {
    const res = await fetch(robotsUrl.toString(), {
      headers: { "User-Agent": "PandaPathTools/1.0" }
    });
    const text = await res.text();
    const lines = text.split(/\r?\n/);
    let active = true;
    const disallowRules: string[] = [];
    const allowRules: string[] = [];
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }
      const lower = trimmed.toLowerCase();
      if (lower.startsWith("user-agent:")) {
        const ua = trimmed.slice(11).trim();
        active = ua === "*" || ua.toLowerCase().includes("pandapath");
        continue;
      }
      if (!active) {
        continue;
      }
      if (lower.startsWith("disallow:")) {
        disallowRules.push(trimmed.slice(9).trim());
      }
      if (lower.startsWith("allow:")) {
        allowRules.push(trimmed.slice(6).trim());
      }
    }
    let blocked = false;
    let matched: string | null = null;
    for (const rule of disallowRules) {
      if (rule && matchPath(rule, path)) {
        blocked = true;
        matched = `Disallow: ${rule}`;
        break;
      }
    }
    for (const rule of allowRules) {
      if (rule && matchPath(rule, path) && blocked) {
        blocked = false;
        matched = `Allow: ${rule}`;
        break;
      }
    }
    return NextResponse.json({
      robotsUrl: robotsUrl.toString(),
      allowed: !blocked,
      matched,
      raw: text.slice(0, 8000)
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Fetch failed" },
      { status: 502 }
    );
  }
}
