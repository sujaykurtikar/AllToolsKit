import tls from "node:tls";

import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const host = searchParams.get("host")?.trim();
  if (!host) {
    return NextResponse.json({ error: "Missing host" }, { status: 400 });
  }
  const clean = host.replace(/^https?:\/\//, "").split("/")[0];

  return new Promise<NextResponse>((resolve) => {
    const socket = tls.connect(
      { host: clean, port: 443, servername: clean, rejectUnauthorized: false },
      () => {
        const cert = socket.getPeerCertificate(true);
        socket.end();
        if (!cert || Object.keys(cert).length === 0) {
          resolve(NextResponse.json({ error: "No certificate" }, { status: 502 }));
          return;
        }
        const validTo = cert.valid_to ? new Date(cert.valid_to) : null;
        const validFrom = cert.valid_from ? new Date(cert.valid_from) : null;
        const now = Date.now();
        const daysLeft =
          validTo && !Number.isNaN(validTo.getTime())
            ? Math.floor((validTo.getTime() - now) / 86400000)
            : null;
        resolve(
          NextResponse.json({
            subject: cert.subject,
            issuer: cert.issuer,
            validFrom: cert.valid_from,
            validTo: cert.valid_to,
            daysRemaining: daysLeft,
            subjectAltNames: cert.subjectaltname,
            fingerprint: cert.fingerprint256 ?? cert.fingerprint
          })
        );
      }
    );
    socket.on("error", (err) => {
      resolve(
        NextResponse.json({ error: err instanceof Error ? err.message : "TLS error" }, { status: 502 })
      );
    });
  });
}
