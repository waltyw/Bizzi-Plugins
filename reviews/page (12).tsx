import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { GUIDES } from '@/lib/help-guides';

export const metadata: Metadata = {
  title: 'Help & Documentation | Bizzi Reviews',
  description: 'Step-by-step guides for setting up Bizzi Reviews and Bizzi Reviews Pro.',
};

export default function HelpIndex() {
  return (
    <main className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="pt-32 pb-12 bg-gradient-to-b from-primary/25 to-white">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-4">
            Help &amp; <span className="text-primary">Documentation</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Everything you need to set up Bizzi Reviews, step by step.</p>
        </div>
      </section>
      <section className="flex-1 pb-24">
        <div className="max-w-[1200px] mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GUIDES.map((g) => (
            <Link key={g.slug} href={`/help/${g.slug}`} className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-6 border-t-4 border-primary flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="font-display text-lg font-bold text-black">{g.title}</h2>
                {g.pro && <span className="text-[10px] font-bold uppercase bg-black text-primary rounded px-1.5 py-0.5">Pro</span>}
              </div>
              <p className="text-sm text-muted-foreground flex-1">{g.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-black group-hover:text-primary">
                Read guide <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
