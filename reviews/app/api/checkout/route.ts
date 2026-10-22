import { NextResponse } from 'next/server';
import { getStripe, getOrCreatePrice } from '@/lib/stripe';
import { isPlan, regionForCountry } from '@/lib/pricing';
import { siteOrigin } from '@/lib/site-origin';
import { clientIp, rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!rateLimit(`checkout:${clientIp(request.headers)}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 });
  }
  try {
    const body = await request.json().catch(() => ({}));
    const plan = body?.plan;
    const country = typeof body?.country === 'string' ? body.country.slice(0, 4).toUpperCase() : '';
    if (!isPlan(plan)) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: 'Payments are not configured yet. Please add your Stripe keys to enable checkout.' },
        { status: 503 },
      );
    }

    // Currency is resolved server-side from the country so clients cannot pick arbitrary prices.
    const region = regionForCountry(country);
    const priceId = await getOrCreatePrice(stripe, plan, region.currency);
    const origin = siteOrigin(request);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#pricing`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      metadata: { bizzi_plan: plan, country: region.code, currency: region.currency },
      subscription_data: { metadata: { bizzi_plan: plan, country: region.code } },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Checkout session error:', err instanceof Error ? err.message : 'unknown');
    return NextResponse.json({ error: 'Unable to start checkout. Please try again.' }, { status: 500 });
  }
}
