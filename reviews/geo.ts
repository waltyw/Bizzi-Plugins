import { headers } from 'next/headers';

/** Best-effort visitor country detection from CDN / proxy headers, falling back to Accept-Language region. */
export async function detectCountry(): Promise<string> {
  const h = await headers();
  const direct =
    h.get('cf-ipcountry') ??
    h.get('x-vercel-ip-country') ??
    h.get('cloudfront-viewer-country') ??
    h.get('x-country-code') ??
    h.get('x-appengine-country');
  if (direct && /^[A-Za-z]{2}$/.test(direct)) return direct.toUpperCase();
  const lang = h.get('accept-language') ?? '';
  const m = lang.match(/[a-z]{2}-([A-Z]{2})/i);
  return m ? m[1].toUpperCase() : 'US';
}
