import { createHmac, randomInt, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import nodemailer from 'nodemailer';

export const PENDING_COOKIE = 'bizzi_admin_2fa';
export const CODE_TTL_SECONDS = 10 * 60;

export function twoFactorEmail(): string {
  return (process.env.ADMIN_2FA_EMAIL || 'ian@bizziplugins.co.uk').trim();
}

export function maskedEmail(): string {
  const [user, domain] = twoFactorEmail().split('@');
  return `${user.slice(0, 1)}${'•'.repeat(Math.max(2, user.length - 1))}@${domain ?? ''}`;
}

export function mailConfigured(): boolean {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function sign(value: string): string {
  return createHmac('sha256', process.env.ADMIN_PASSWORD ?? '').update(`bizzi-admin-2fa-v1:${value}`).digest('hex');
}

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Creates a 6-digit code, emails it, and stores only its signed hash (with expiry) in a short-lived cookie. */
export async function startTwoFactor(): Promise<void> {
  const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
  const exp = Math.floor(Date.now() / 1000) + CODE_TTL_SECONDS;
  const port = Number(process.env.SMTP_PORT || 465);
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await transport.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: twoFactorEmail(),
    subject: `Bizzi Reviews admin sign-in code: ${code}`,
    text: `Your Bizzi Reviews admin sign-in code is ${code}\n\nIt expires in 10 minutes. If you did not try to sign in, change your ADMIN_PASSWORD now.`,
    html: `<div style="font-family:Arial,sans-serif;max-width:420px"><p>Your Bizzi Reviews admin sign-in code is:</p><p style="font-size:32px;font-weight:bold;letter-spacing:6px;background:#000;color:#ffb000;padding:16px;text-align:center;border-radius:12px">${code}</p><p style="color:#555;font-size:13px">It expires in 10 minutes. If you did not try to sign in, change your ADMIN_PASSWORD now.</p></div>`,
  });
  (await cookies()).set(PENDING_COOKIE, `${exp}.${sign(`${code}.${exp}`)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/admin',
    maxAge: CODE_TTL_SECONDS,
  });
}

async function pendingExpiry(): Promise<number | null> {
  const raw = (await cookies()).get(PENDING_COOKIE)?.value ?? '';
  const exp = Number(raw.split('.')[0]);
  return Number.isInteger(exp) && exp > Date.now() / 1000 ? exp : null;
}

export async function hasPendingTwoFactor(): Promise<boolean> {
  return (await pendingExpiry()) !== null;
}

export async function codeMatches(input: string): Promise<boolean> {
  const code = input.replace(/\D/g, '');
  const exp = await pendingExpiry();
  if (exp === null || code.length !== 6) return false;
  const raw = (await cookies()).get(PENDING_COOKIE)?.value ?? '';
  return safeEqual(raw.slice(raw.indexOf('.') + 1), sign(`${code}.${exp}`));
}

export async function clearPendingTwoFactor(): Promise<void> {
  (await cookies()).delete({ name: PENDING_COOKIE, path: '/admin' });
}
