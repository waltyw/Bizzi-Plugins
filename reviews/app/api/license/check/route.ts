import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fail, findUsableLicense, ok, parseRequest } from '@/lib/license-api';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const parsed = await parseRequest(request, 'lic-check');
    if (parsed instanceof NextResponse) return parsed;
    const { license, error } = await findUsableLicense(parsed.key);
    if (!license || error) return fail(error ?? 'Invalid licence.');

    const activation = await prisma.licenseActivation.findUnique({
      where: { licenseId_siteUrl: { licenseId: license.id, siteUrl: parsed.site } },
    });
    if (!activation) return fail('Licence is not activated on this site.');
    await prisma.licenseActivation.update({ where: { id: activation.id }, data: { lastCheckedAt: new Date() } });
    return ok(license);
  } catch (err) {
    console.error('Licence check error:', err instanceof Error ? err.message : 'unknown');
    return fail('Licence server error. Please try again.', 500);
  }
}
