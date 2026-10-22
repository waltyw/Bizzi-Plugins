'use server';

import { randomUUID } from 'crypto';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { generateLicenseKey } from '@/lib/stripe';
import { isPlan } from '@/lib/pricing';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { ADMIN_COOKIE, adminToken, isAdmin, passwordMatches } from '@/lib/admin-auth';

const DURATIONS: Record<string, number | null> = { '1m': 31, '3m': 92, '1y': 368, '2y': 733, lifetime: null };

export async function login(formData: FormData) {
  const ip = clientIp(await headers());
  if (!rateLimit(`admin-login:${ip}`, 5, 15 * 60_000)) redirect('/admin?error=locked');
  const password = String(formData.get('password') ?? '');
  if (!passwordMatches(password)) redirect('/admin?error=wrong');
  (await cookies()).set(ADMIN_COOKIE, adminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/admin',
    maxAge: 60 * 60 * 12,
  });
  redirect('/admin');
}

export async function logout() {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: '/admin' });
  redirect('/admin');
}

export async function issueLicence(formData: FormData) {
  if (!(await isAdmin())) redirect('/admin');
  const plan = String(formData.get('plan') ?? 'pro');
  const duration = String(formData.get('duration') ?? '1y');
  const email = String(formData.get('email') ?? '').trim().slice(0, 200);
  const note = String(formData.get('note') ?? '').trim().slice(0, 120);
  if (!isPlan(plan) || !(duration in DURATIONS)) redirect('/admin?error=invalid');

  const days = DURATIONS[duration];
  const licence = await prisma.license.create({
    data: {
      licenseKey: generateLicenseKey(plan),
      plan,
      email,
      note,
      amount: 0,
      status: 'active',
      expiresAt: days === null ? null : new Date(Date.now() + days * 86_400_000),
      stripeSessionId: `free_${randomUUID()}`,
    },
  });
  console.log('Admin issued free licence', licence.id, plan, duration);
  revalidatePath('/admin');
  redirect(`/admin?issued=${encodeURIComponent(licence.licenseKey)}`);
}

export async function setLicenceStatus(formData: FormData) {
  if (!(await isAdmin())) redirect('/admin');
  const id = Number(formData.get('id'));
  const status = String(formData.get('status'));
  if (!Number.isInteger(id) || !['active', 'revoked'].includes(status)) redirect('/admin?error=invalid');
  await prisma.license.update({ where: { id }, data: { status } });
  revalidatePath('/admin');
  redirect('/admin');
}
