import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE = 'bizzi_admin';

export function adminConfigured(): boolean {
  return (process.env.ADMIN_PASSWORD ?? '').length >= 8;
}

/** Session token derived from the password, so changing ADMIN_PASSWORD signs everyone out. */
export function adminToken(): string {
  return createHmac('sha256', process.env.ADMIN_PASSWORD ?? '').update('bizzi-admin-session-v2-2fa').digest('hex');
}

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function passwordMatches(input: string): boolean {
  return adminConfigured() && safeEqual(input, process.env.ADMIN_PASSWORD ?? '');
}

export async function isAdmin(): Promise<boolean> {
  if (!adminConfigured()) return false;
  const value = (await cookies()).get(ADMIN_COOKIE)?.value ?? '';
  return safeEqual(value, adminToken());
}
