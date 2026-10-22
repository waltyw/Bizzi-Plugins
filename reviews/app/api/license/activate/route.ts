import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fail, findUsableLicense, ok, parseRequest, SITE_LIMITS } from '@/lib/license-api';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const parsed = await parseRequest(request, 'lic-activate');
    if (parsed instanceof NextResponse) return parsed;
    const { license, error } = await findUsableLicense(parsed.key);
    if (!license || error) return fail(error ?? 'Invalid licence.');

    const existing = await prisma.licenseActivation.findUnique({
      where: { licenseId_siteUrl: { licenseId: license.id, siteUrl: parsed.site } },
    });
    if (!existing) {
      const used = await prisma.licenseActivation.count({ where: { licenseId: license.id } });
      const limit = SITE_LIMITS[license.plan] ?? 1;
      if (used >= limit) {
        return fail(`This licence is already active on ${used} site${used === 1 ? '' : 's'}. Deactivate it there first or upgrade to Agency.`);
      }
      await prisma.licenseActivation.create({ data: { licenseId: license.id, siteUrl: parsed.site } });
    } else {
      await prisma.licenseActivation.update({ where: { id: existing.id }, data: { lastCheckedAt: new Date() } });
    }
    return ok(license);
  } catch (err) {
    console.error('Licence activate error:', err instanceof Error ? err.message : 'unknown');
    return fail('Licence server error. Please try again.', 500);
  }
}
