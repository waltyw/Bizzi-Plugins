import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fail, parseRequest } from '@/lib/license-api';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const parsed = await parseRequest(request, 'lic-deactivate');
    if (parsed instanceof NextResponse) return parsed;
    const license = await prisma.license.findUnique({ where: { licenseKey: parsed.key }, select: { id: true } });
    if (license) {
      await prisma.licenseActivation.deleteMany({ where: { licenseId: license.id, siteUrl: parsed.site } });
    }
    return NextResponse.json({ valid: false, deactivated: true });
  } catch (err) {
    console.error('Licence deactivate error:', err instanceof Error ? err.message : 'unknown');
    return fail('Licence server error. Please try again.', 500);
  }
}
