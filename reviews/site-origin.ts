/** Trusted public origin: NEXTAUTH_URL at runtime, falling back to the forwarded host. */
export function siteOrigin(request: Request): string {
  const env = process.env.NEXTAUTH_URL;
  if (env) {
    try {
      return new URL(env).origin;
    } catch {
      /* fall through */
    }
  }
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (host && /^[a-z0-9.-]+(:\d+)?$/i.test(host)) {
    const proto = request.headers.get('x-forwarded-proto') === 'http' ? 'http' : 'https';
    return `${proto}://${host}`;
  }
  return new URL(request.url).origin;
}
