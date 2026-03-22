import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url).searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url query parameter." }, { status: 400 });
  }
  let target: URL;
  try {
    target = new URL(url.startsWith("http") ? url : `https://${url}`);
  } catch {
    return NextResponse.json({ error: "Invalid URL." }, { status: 400 });
  }

  try {
    const res = await fetch(target.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PandaPathTools/1.0; +https://pandapath.com)",
        Accept: "text/html,application/xhtml+xml"
      },
      redirect: "follow",
      signal: AbortSignal.timeout(12000)
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Fetch failed with status ${res.status}.`, links: [] },
        { status: 502 }
      );
    }
    const html = await res.text();
    const links: { rel: string; href: string; type?: string }[] = [];
    const re = /<link\s+([^>]+)>/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html)) !== null) {
      const attrs = m[1];
      const relM = attrs.match(/\brel\s*=\s*["']([^"']+)["']/i);
      const hrefM = attrs.match(/\bhref\s*=\s*["']([^"']+)["']/i);
      if (!relM || !hrefM) {
        continue;
      }
      const rel = relM[1].toLowerCase();
      if (!/(icon|apple-touch-icon|mask-icon|shortcut)/i.test(rel)) {
        continue;
      }
      let href = hrefM[1];
      if (href.startsWith("//")) {
        href = `${target.protocol}${href}`;
      } else if (href.startsWith("/")) {
        href = `${target.origin}${href}`;
      } else if (!/^https?:/i.test(href)) {
        href = new URL(href, target).toString();
      }
      const typeM = attrs.match(/\btype\s*=\s*["']([^"']+)["']/i);
      links.push({ rel, href, type: typeM?.[1] });
    }
    return NextResponse.json({ origin: target.origin, links });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg, links: [] }, { status: 502 });
  }
}
