import { prisma } from './prisma';
import { findUsableLicense, normaliseSite } from './license-api';

const KEY_RE = /^BIZZI-(PRO|AGENCY)(-[A-Z0-9]{4}){4}$/;

/**
 * Checks whether a request may receive the Pro package.
 * A valid, active licence is always required. When a site URL is given (the in-plugin updater),
 * the licence must also be activated on that site.
 */
export async function canDownloadPro(rawKey: string | null, rawSite: string | null): Promise<boolean> {
  const key = (rawKey ?? '').trim().toUpperCase().slice(0, 64);
  if (!KEY_RE.test(key)) return false;
  const { license, error } = await findUsableLicense(key);
  if (!license || error) return false;
  if (!rawSite) return true;
  const site = normaliseSite(rawSite);
  if (!site) return false;
  const activation = await prisma.licenseActivation.findUnique({
    where: { licenseId_siteUrl: { licenseId: license.id, siteUrl: site } },
  });
  return !!activation;
}
