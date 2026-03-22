import { NextResponse } from "next/server";

export const runtime = "nodejs";

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

  const chain: string[] = [url.toString()];
  let current = url.toString();
  const maxHops = 15;

  for (let i = 0; i < maxHops; i++) {
    try {
      const res = await fetch(current, {
        method: "GET",
        redirect: "manual",
        headers: { "User-Agent": "PandaPathTools/1.0" },
        signal: AbortSignal.timeout(10000)
      });
      const loc = res.headers.get("location");
      if (res.status >= 300 && res.status < 400 && loc) {
        const nextUrl = new URL(loc, current).toString();
        if (chain.includes(nextUrl)) {
          break;
        }
        chain.push(nextUrl);
        current = nextUrl;
        continue;
      }
      break;
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Failed", chain },
        { status: 502 }
      );
    }
  }

  return NextResponse.json({ chain, final: chain[chain.length - 1] });
}
