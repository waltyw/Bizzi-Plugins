import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, Lightbulb } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { GUIDES, getGuide, type Block } from '@/lib/help-guides';

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  return g ? { title: `${g.title} | Bizzi Reviews Help`, description: g.summary } : { title: 'Guide not found' };
}

function Render({ b }: { b: Block }) {
  switch (b.type) {
    case 'h':
      return <h2 className="font-display text-2xl font-bold mt-10 mb-3 text-black">{b.text}</h2>;
    case 'p':
      return <p className="text-[15px] leading-7 text-neutral-700 mb-4">{b.text}</p>;
    case 'steps':
      return (
        <ol className="space-y-3 mb-6">
          {b.items.map((t, i) => (
            <li key={i} className="flex gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-primary text-black font-bold text-sm flex items-center justify-center">{i + 1}</span>
              <span className="text-[15px] leading-7 text-neutral-700">{t}</span>
            </li>
          ))}
        </ol>
      );
    case 'list':
      return <ul className="list-disc pl-6 space-y-2 mb-6 text-[15px] leading-7 text-neutral-700">{b.items.map((t, i) => <li key={i}>{t}</li>)}</ul>;
    case 'code':
      return <pre className="bg-black text-primary rounded-xl p-4 text-sm overflow-x-auto mb-6 whitespace-pre">{b.text}</pre>;
    case 'tip':
      return (
        <div className="flex gap-3 bg-primary/10 border-l-4 border-primary rounded-r-xl p-4 mb-6">
          <Lightbulb className="w-5 h-5 shrink-0 text-black mt-0.5" />
          <p className="text-sm leading-6 text-black">{b.text}</p>
        </div>
      );
    case 'table':
      return (
        <div className="overflow-x-auto mb-6 rounded-xl shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-black text-white"><tr>{b.head.map((h) => <th key={h} className="text-left px-4 py-2 font-semibold">{h}</th>)}</tr></thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i} className="odd:bg-white even:bg-neutral-50">
                  {r.map((c, j) => <td key={j} className={`px-4 py-2 align-top ${j === 0 ? 'font-mono text-black' : 'text-neutral-700'}`}>{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();
  const idx = GUIDES.findIndex((g) => g.slug === slug);
  const next = GUIDES[idx + 1];

  return (
    <main className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="pt-32 pb-10 bg-gradient-to-b from-primary/25 to-white">
        <div className="max-w-3xl mx-auto px-6">
          <Link href="/help" className="inline-flex items-center gap-1 text-sm font-medium text-black hover:text-primary mb-4">
            <ArrowLeft className="w-4 h-4" /> All guides
          </Link>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-black">{guide.title}</h1>
          <p className="text-muted-foreground mt-2">{guide.summary}</p>
        </div>
      </section>
      <article className="flex-1 pb-24">
        <div className="max-w-3xl mx-auto px-6">
          {guide.body.map((b, i) => <Render key={i} b={b} />)}
          <div className="flex flex-col sm:flex-row gap-3 mt-12">
            <Link href="/help" className="btn-brand-outline">Back to all guides</Link>
            {next && <Link href={`/help/${next.slug}`} className="btn-brand">Next: {next.title}</Link>}
          </div>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
