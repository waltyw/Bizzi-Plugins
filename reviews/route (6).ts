import { NextResponse } from 'next/server';
import { canDownloadPro } from '@/lib/plugin-access';
import { PRO_PACKAGE_BASE64 } from '@/lib/pro-package';
import { clientIp, rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/** Pro package download. Requires a valid licence (and an activation when a site URL is given). */
export async function GET(request: Request) {
  if (!rateLimit(`plugin-download:${clientIp(request.headers)}`, 20, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  const url = new URL(request.url);
  const allowed = await canDownloadPro(url.searchParams.get('license'), url.searchParams.get('site'));
  if (!allowed) {
    return NextResponse.json({ error: 'A valid, active Bizzi Reviews Pro licence is required.' }, { status: 403 });
  }
  return new NextResponse(new Uint8Array(Buffer.from(PRO_PACKAGE_BASE64, 'base64')), {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="bizzi-reviews-pro.zip"',
      'Cache-Control': 'private, no-store',
    },
  });
}
