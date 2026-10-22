import { NextResponse } from 'next/server';
import { prisma } from './prisma';
import { clientIp, rateLimit } from './rate-limit';

const KEY_RE = /^BIZZI-(PRO|AGENCY)(-[A-Z0-9]{4}){4}$/;
const ACTIVE = new Set(['active', 'trialing']);
export const SITE_LIMITS: Record<string, number> = { pro: 1, agency: Number.POSITIVE_INFINITY };

export type LicenseRequest = { key: string; site: string };

export function fail(error: string, status = 200) {
  return NextResponse.json({ valid: false, error }, { status });
}

/** Normalises a site URL to its lowercase host (+ path for multisite subfolders), without www. */
export function normaliseSite(input: unknown): string | null {
  if (typeof input !== 'string' || input.length > 300) return null;
  try {
    const u = new URL(input.includes('://') ? input : `https://${input}`);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    const host = u.hostname.toLowerCase().replace(/^www\./, '');
    const path = u.pathname.replace(/\/+$/, '').toLowerCase();
    return (host + path).slice(0, 255);
  } catch {
    return null;
  }
}

/** Parses + rate-limits a licence API request. Returns a response on failure. */
export async function parseRequest(request: Request, bucket: string): Promise<LicenseRequest | NextResponse> {
  if (!rateLimit(`${bucket}:${clientIp(request.headers)}`, 30, 60_000)) {
    return fail('Too many requests. Please try again in a minute.', 429);
  }
  const body = await request.json().catch(() => null);
  const key = typeof body?.license_key === 'string' ? body.license_key.trim().toUpperCase().slice(0, 64) : '';
  const site = normaliseSite(body?.site_url);
  if (!KEY_RE.test(key)) return fail('Invalid licence key format.', 400);
  if (!site) return fail('Invalid site URL.', 400);
  return { key, site };
}

export async function findUsableLicense(key: string) {
  const license = await prisma.license.findUnique({ where: { licenseKey: key } });
  if (!license) return { license: null, error: 'Licence key not found.' } as const;
  if (!ACTIVE.has(license.status)) return { license, error: `Licence is ${license.status.replace('_', ' ')}.` } as const;
  if (license.expiresAt && license.expiresAt.getTime() < Date.now()) return { license, error: 'Licence has expired.' } as const;
  return { license, error: null } as const;
}

export function ok(license: { plan: string; expiresAt: Date | null }) {
  return NextResponse.json({ valid: true, plan: license.plan, expires: license.expiresAt ? license.expiresAt.toISOString() : null });
}
