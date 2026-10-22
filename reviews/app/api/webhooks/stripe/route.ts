import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { fulfilSession } from '@/lib/fulfil';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });

  const raw = await request.text();
  const sig = request.headers.get('stripe-signature') ?? '';
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await fulfilSession(event.data.object as Stripe.Checkout.Session);
        break;
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription & { current_period_end?: number };
        const periodEnd = sub.items?.data?.[0]?.current_period_end ?? sub.current_period_end;
        await prisma.license.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: {
            status: event.type === 'customer.subscription.deleted' ? 'cancelled' : sub.status,
            // 3-day buffer so renewals processed slightly late don't lock sites out.
            ...(periodEnd ? { expiresAt: new Date((periodEnd + 3 * 86400) * 1000) } : {}),
          },
        });
        break;
      }
      case 'invoice.payment_failed': {
        const inv = event.data.object as Stripe.Invoice & { parent?: { subscription_details?: { subscription?: string } } };
        const subId = inv.parent?.subscription_details?.subscription;
        if (subId) await prisma.license.updateMany({ where: { stripeSubscriptionId: subId }, data: { status: 'past_due' } });
        break;
      }
    }
    console.log('Stripe webhook processed:', event.type);
  } catch (err) {
    console.error('Stripe webhook handling error:', event.type, err instanceof Error ? err.message : 'unknown');
    return NextResponse.json({ error: 'Handler error' }, { status: 500 });
  }
  return NextResponse.json({ received: true });
}
