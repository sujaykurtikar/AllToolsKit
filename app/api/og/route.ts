import { NextResponse } from "next/server";

export const runtime = "nodejs";

function parseMeta(html: string) {
  const og: Record<string, string> = {};
  const tw: Record<string, string> = {};
  const re =
    /<meta\s+[^>]*(?:property|name)=["']([^"']+)["'][^>]*content=["']([^"']*)["'][^>]*>|<meta\s+[^>]*content=["']([^"']*)["'][^>]*(?:property|name)=["']([^"']+)["'][^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const key = (m[1] || m[4] || "").toLowerCase();
    const val = m[2] || m[3] || "";
    if (key.startsWith("og:")) {
      og[key] = val;
    }
    if (key.startsWith("twitter:")) {
      tw[key] = val;
    }
    if (key === "description" && !og["og:description"]) {
      og["og:description"] = val;
    }
    if (key === "title" && !og["og:title"]) {
      og["og:title"] = val;
    }
  }
  return { og, tw };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get("url");
  if (!target) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }
  let url: URL;
  try {
    url = new URL(target);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }
  if (!["http:", "https:"].includes(url.protocol)) {
    return NextResponse.json({ error: "Only HTTP(S)" }, { status: 400 });
  }
  try {
    const res = await fetch(url.toString(), {
      headers: { "User-Agent": "PandaPathTools/1.0" },
      redirect: "follow"
    });
    const html = await res.text();
    const { og, tw } = parseMeta(html);
    return NextResponse.json({ finalUrl: res.url, og, twitter: tw });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Fetch failed" },
      { status: 502 }
    );
  }
}
