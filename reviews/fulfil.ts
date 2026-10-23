import type Stripe from 'stripe';
import { prisma } from './prisma';
import { generateLicenseKey } from './stripe';
import { isPlan } from './pricing';

/** Idempotently creates the licence for a completed Checkout Session. */
export async function fulfilSession(session: Stripe.Checkout.Session) {
  if (session.status !== 'complete' && session.payment_status !== 'paid') return null;
  const existing = await prisma.license.findUnique({ where: { stripeSessionId: session.id } });
  if (existing) return existing;

  const plan = isPlan(session.metadata?.bizzi_plan) ? session.metadata!.bizzi_plan : 'pro';
  const id = (v: unknown) => (typeof v === 'string' ? v : (v as { id?: string } | null)?.id ?? '');

  try {
    return await prisma.license.create({
      data: {
        licenseKey: generateLicenseKey(plan as 'pro' | 'agency'),
        plan,
        email: session.customer_details?.email ?? '',
        country: session.metadata?.country ?? '',
        currency: session.currency ?? '',
        amount: session.amount_total ?? 0,
        status: 'active',
        expiresAt: new Date(Date.now() + 368 * 24 * 60 * 60 * 1000),
        stripeSessionId: session.id,
        stripeCustomerId: id(session.customer),
        stripeSubscriptionId: id(session.subscription),
      },
    });
  } catch {
    // Concurrent webhook + success-page fulfilment: return the row the other request created.
    return prisma.license.findUnique({ where: { stripeSessionId: session.id } });
  }
}
