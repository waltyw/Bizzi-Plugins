export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { clientIp, rateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request.headers);
    if (!rateLimit(`download:${ip}`, 10, 60_000)) {
      return NextResponse.json({ success: true, count: await prisma.download.count() });
    }
    const userAgent = (request.headers.get('user-agent') ?? '').slice(0, 300);
    await prisma.download.create({ data: { ip, userAgent } });
    const count = await prisma.download.count();
    return NextResponse.json({ success: true, count });
  } catch (e) {
    console.error('Download log error:', e instanceof Error ? e.message : 'unknown');
    return NextResponse.json({ success: false, error: 'Unable to record download' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const count = await prisma.download.count();
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
