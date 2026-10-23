import Link from 'next/link';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { getStripe } from '@/lib/stripe';
import { fulfilSession } from '@/lib/fulfil';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { CopyKey } from '@/components/copy-key';

export const dynamic = 'force-dynamic';

async function loadLicence(sessionId?: string) {
  const stripe = getStripe();
  if (!stripe || !sessionId) return null;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return await fulfilSession(session);
  } catch {
    return null;
  }
}

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  const licence = await loadLicence(session_id);

  return (
    <main className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="flex-1 pt-32 pb-24 bg-gradient-to-b from-primary/25 to-white">
        <div className="max-w-xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
            {licence ? (
              <>
                <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4" />
                <h1 className="font-display text-3xl font-extrabold mb-2">
                  Thank you for <span className="text-primary">your order</span>
                </h1>
                <p className="text-muted-foreground mb-8">
                  Your <strong className="capitalize text-black">{licence.plan}</strong> licence is active. Install the free
                  Bizzi Reviews plugin, upload the Pro add-on below, then paste this key into
                  <em> Bizzi Reviews → Pro Licence</em> inside WordPress.
                </p>
                <CopyKey value={licence.licenseKey} />
                <a
                  href={`/api/plugin/download?license=${encodeURIComponent(licence.licenseKey)}`}
                  download="bizzi-reviews-pro.zip"
                  className="btn-brand mt-6 inline-flex"
                >
                  Download Bizzi Reviews Pro
                </a>
                {licence.email && <p className="text-xs text-muted-foreground mt-4">Receipt sent to {licence.email}</p>}
              </>
            ) : (
              <>
                <AlertCircle className="w-14 h-14 text-primary mx-auto mb-4" />
                <h1 className="font-display text-3xl font-extrabold mb-2">
                  Payment <span className="text-primary">processing</span>
                </h1>
                <p className="text-muted-foreground mb-8">
                  We couldn&apos;t confirm this payment yet. Refresh in a moment — your licence key will appear once Stripe confirms.
                </p>
              </>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <Link href="/#download" className="btn-brand-outline">Download the free plugin</Link>
              <Link href="/" className="btn-brand-outline">Back to home</Link>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
