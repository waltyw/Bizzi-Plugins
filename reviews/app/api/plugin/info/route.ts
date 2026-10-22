import { NextResponse } from 'next/server';
import release from '@/data/plugin-release.json';
import { siteOrigin } from '@/lib/site-origin';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { canDownloadPro } from '@/lib/plugin-access';

export const dynamic = 'force-dynamic';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function GET(request: Request) {
  if (!rateLimit(`plugin-info:${clientIp(request.headers)}`, 60, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  const origin = siteOrigin(request);
  const params = new URL(request.url).searchParams;
  const license = params.get('license');
  const site = params.get('site');
  // The package link is only given to licensed, activated sites.
  const downloadUrl =
    license && site && (await canDownloadPro(license, site))
      ? `${origin}/api/plugin/download?${new URLSearchParams({ license, site }).toString()}`
      : '';
  const changelog = release.changelog
    .map((c) => `<h4>${esc(c.version)} – ${esc(c.date)}</h4><ul>${c.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>`)
    .join('');

  return NextResponse.json(
    {
      name: release.name,
      slug: release.slug,
      version: release.version,
      download_url: downloadUrl,
      homepage: origin,
      requires: release.requires,
      tested: release.tested,
      requires_php: release.requires_php,
      last_updated: release.last_updated,
      sections: {
        description: `<p>${esc(release.description)}</p><p>Guides: <a href="${origin}/help">${origin}/help</a></p>`,
        changelog,
      },
    },
    { headers: { 'Cache-Control': 'private, no-store' } },
  );
}
