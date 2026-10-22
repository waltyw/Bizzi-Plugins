import Stripe from 'stripe';
import { randomInt } from 'crypto';
import { PRICES, type CurrencyCode, type PlanId } from './pricing';

let client: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!client) client = new Stripe(key);
  return client;
}

const PLAN_NAMES: Record<PlanId, string> = {
  pro: 'Bizzi Reviews Pro – Pro Licence',
  agency: 'Bizzi Reviews Pro – Agency Licence',
};

/** Finds (or creates once) the yearly recurring Price for a plan + currency, keyed by lookup_key. */
export async function getOrCreatePrice(stripe: Stripe, plan: PlanId, currency: CurrencyCode): Promise<string> {
  const lookupKey = `bizzi_reviews_${plan}_${currency}_yearly_v2`;
  const existing = await stripe.prices.list({ lookup_keys: [lookupKey], active: true, limit: 1 });
  if (existing.data[0]) return existing.data[0].id;

  const products = await stripe.products.search({ query: `metadata['bizzi_plan']:'${plan}'`, limit: 1 });
  const product =
    products.data[0] ??
    (await stripe.products.create({ name: PLAN_NAMES[plan], metadata: { bizzi_plan: plan, bizzi_product: 'reviews-pro' } }));

  const price = await stripe.prices.create({
    product: product.id,
    currency,
    unit_amount: PRICES[currency][plan],
    recurring: { interval: 'year' },
    lookup_key: lookupKey,
    metadata: { bizzi_plan: plan },
  });
  return price.id;
}

export function generateLicenseKey(plan: PlanId): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const block = () => Array.from({ length: 4 }, () => chars[randomInt(chars.length)]).join('');
  return `BIZZI-${plan.toUpperCase()}-${block()}-${block()}-${block()}-${block()}`;
}
