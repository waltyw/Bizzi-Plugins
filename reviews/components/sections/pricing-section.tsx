'use client';
import { useState } from 'react';
import { Check, Globe2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { PRICES, REGIONS, DEFAULT_REGION, regionForCountry, formatPrice, type PlanId } from '@/lib/pricing';

const plans: { id: 'free' | PlanId; name: string; tagline: string; popular?: boolean; features: string[] }[] = [
  { id: 'free', name: 'Free', tagline: 'Free forever on WordPress.org', features: ['Google & manual reviews', 'No review limits', 'Carousel, single & combined rating', 'Review SEO schema', 'Community support'] },
  { id: 'pro', name: 'Pro', tagline: 'For growing businesses', popular: true, features: ['Adds Facebook & WooCommerce reviews', 'Grid, list, wall & badge layouts', '1 website', 'Full Review & Product schema', 'Gutenberg blocks & Elementor', 'Priority support'] },
  { id: 'agency', name: 'Agency', tagline: 'Unlimited client sites', features: ['Everything in Pro', 'Unlimited websites', 'White label – remove Bizzi branding', 'Replace logo', 'Client mode', 'Premium support'] },
];

export function PricingSection({ initialCountry }: { initialCountry: string }) {
  const [country, setCountry] = useState(regionForCountry(initialCountry).code);
  const [loading, setLoading] = useState<PlanId | null>(null);
  const region = regionForCountry(country);

  const checkout = async (plan: PlanId) => {
    setLoading(plan);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, country: region.code }),
      });
      const data = await res.json();
      if (res.ok && data?.url) {
        window.location.href = data.url;
        return;
      }
      toast.error(data?.error ?? 'Unable to start checkout');
    } catch (e) {
      console.error('Checkout failed', e);
      toast.error('Unable to start checkout');
    }
    setLoading(null);
  };

  return (
    <section id="pricing" className="py-24 bg-brand-fade-soft">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">Pricing</span>
          <h2 className="font-display text-4xl font-extrabold tracking-tight mt-3">
            Simple pricing in <span className="text-primary">your currency</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">One yearly licence. No widget limits, no per-view fees, no SaaS lock-in.</p>
        </div>

        <div className="flex items-center justify-center gap-3 mb-14">
          <Globe2 className="w-5 h-5 text-primary" />
          <label htmlFor="country" className="text-sm font-medium">Prices for</label>
          <select
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="bg-white border-2 border-primary rounded-full px-4 py-2 text-sm font-medium focus:outline-none focus:border-black"
          >
            {!REGIONS.some((r) => r.code === region.code) && region.code !== DEFAULT_REGION.code && (
              <option value={region.code}>{region.code} ({region.currency.toUpperCase()})</option>
            )}
            {REGIONS.map((r) => (
              <option key={r.code} value={r.code}>{r.label} ({r.currency.toUpperCase()})</option>
            ))}
            <option value={DEFAULT_REGION.code}>{DEFAULT_REGION.label} (USD)</option>
          </select>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {plans.map((p) => (
            <div key={p.id} className={`bg-white rounded-3xl overflow-hidden flex flex-col ${p.popular ? 'shadow-2xl ring-2 ring-primary md:-translate-y-3' : 'shadow-lg'}`}>
              {p.popular && <div className="bg-primary text-white text-xs font-bold text-center py-2 uppercase tracking-wider">Most popular</div>}
              <div className="p-8 flex flex-col flex-1">
                <h3 className="font-display text-xl font-bold">{p.name}</h3>
                <p className="text-sm text-muted-foreground mb-5">{p.tagline}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold">{p.id === 'free' ? formatPrice(0, region) : formatPrice(PRICES[region.currency][p.id], region)}</span>
                  <span className="text-muted-foreground text-sm">{p.id === 'free' ? 'forever' : '/year'}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm"><Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />{f}</li>
                  ))}
                </ul>
                {p.id === 'free' ? (
                  <a href="#download" className="btn-brand-outline w-full">Download free</a>
                ) : (
                  <button onClick={() => checkout(p.id as PlanId)} disabled={loading !== null} className={`${p.popular ? 'btn-brand' : 'btn-brand-outline'} w-full`}>
                    {loading === p.id && <Loader2 className="w-4 h-4 animate-spin" />}
                    Buy {p.name}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-8">Secure payment by Stripe. Prices exclude any applicable local taxes. Cancel renewal anytime.</p>
      </div>
    </section>
  );
}
