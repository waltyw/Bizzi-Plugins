'use client';
import { useEffect, useMemo, useState } from 'react';
import { GalleryHorizontal, LayoutGrid, List, Quote, Award, Columns3, BarChart3, Copy, Check } from 'lucide-react';
import { REVIEWS, SOURCE_META, type Source } from '@/components/widgets/demo-data';
import {
  ALL_FIELDS, CarouselWidget, GridWidget, ListWidget, SingleWidget, WallWidget, BadgeCard, FloatingBadge, CombinedRatingWidget,
  type ShowFields,
} from '@/components/widgets/review-widgets';

type Layout = 'carousel' | 'grid' | 'list' | 'single' | 'badge' | 'wall' | 'combined';

const LAYOUTS: { id: Layout; label: string; icon: typeof List }[] = [
  { id: 'carousel', label: 'Carousel', icon: GalleryHorizontal },
  { id: 'grid', label: 'Grid', icon: LayoutGrid },
  { id: 'list', label: 'List', icon: List },
  { id: 'single', label: 'Single Review', icon: Quote },
  { id: 'wall', label: 'Review Wall', icon: Columns3 },
  { id: 'badge', label: 'Floating Badge', icon: Award },
  { id: 'combined', label: 'Combined Rating', icon: BarChart3 },
];

const DATE_RANGES = [
  { id: 'all', label: 'Any time', days: 0 },
  { id: 'last_90', label: 'Last 90 days', days: 90 },
  { id: 'last_12m', label: 'Last 12 months', days: 365 },
];

const FIELD_LABELS: Record<keyof ShowFields, string> = { name: 'Name', avatar: 'Image', date: 'Date', source: 'Source', rating: 'Stars', text: 'Text' };

export function WidgetsSection() {
  const [layout, setLayout] = useState<Layout>('carousel');
  const [source, setSource] = useState<'all' | Source>('all');
  const [minRating, setMinRating] = useState(1);
  const [range, setRange] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [show, setShow] = useState<ShowFields>(ALL_FIELDS);
  const [columns, setColumns] = useState(3);
  const [masonry, setMasonry] = useState(false);
  const [speed, setSpeed] = useState(4);
  const [autoplay, setAutoplay] = useState(true);
  const [badgePos, setBadgePos] = useState<'left' | 'right'>('right');
  const [badgeOn, setBadgeOn] = useState(false);
  const [now, setNow] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => setNow(Date.now()), []);
  useEffect(() => { if (layout === 'badge') setBadgeOn(true); }, [layout]);

  const filtered = useMemo(() => {
    const days = DATE_RANGES.find((d) => d.id === range)?.days ?? 0;
    const kw = keyword.trim().toLowerCase();
    return REVIEWS.filter((r) =>
      (source === 'all' || r.source === source) &&
      r.rating >= minRating &&
      (!days || !now || now - new Date(r.date).getTime() <= days * 86400000) &&
      (!kw || r.text.toLowerCase().includes(kw) || r.name.toLowerCase().includes(kw)),
    );
  }, [source, minRating, range, keyword, now]);

  const shortcode = useMemo(() => {
    if (layout === 'badge') return `[bizzi_rating_badge position="bottom-${badgePos}"]`;
    if (layout === 'combined') return '[bizzi_combined_rating]';
    if (layout === 'single') return `[bizzi_single_review id="${filtered[0]?.id ?? 1}"]`;
    const a: string[] = [`layout="${layout}"`];
    if (source !== 'all') a.push(`source="${source}"`);
    if (minRating > 1) a.push(minRating === 5 ? 'rating="5"' : `min_rating="${minRating}"`);
    if (range !== 'all') a.push(`date_range="${range}"`);
    if (keyword.trim()) a.push(`keyword="${keyword.trim().replace(/"/g, '')}"`);
    if (layout === 'grid') { a.push(`columns="${columns}"`); if (masonry) a.push('masonry="true"'); }
    if (layout === 'carousel') { a.push(`autoplay="${autoplay}"`, `speed="${speed}"`); }
    (Object.keys(show) as (keyof ShowFields)[]).forEach((k) => { if (!show[k]) a.push(`show_${k}="false"`); });
    return `[bizzi_reviews ${a.join(' ')}]`;
  }, [layout, source, minRating, range, keyword, columns, masonry, autoplay, speed, show, badgePos, filtered]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(shortcode); setCopied(true); setTimeout(() => setCopied(false), 1500); }
    catch (e) { console.error('Copy failed', e); }
  };

  const usesFilters = !['badge', 'combined'].includes(layout);
  const chip = (active: boolean) => `px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-colors ${active ? 'bg-primary border-primary text-white' : 'bg-white border-neutral-200 text-black hover:border-black'}`;

  return (
    <section id="widgets" className="py-24 bg-brand-fade-continue">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">Live widget demo</span>
          <h2 className="font-display text-4xl font-extrabold tracking-tight mt-3">
            See every widget <span className="text-primary">rendered live</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">These are the real layouts the plugin outputs. Change the filters and options — the shortcode updates so you can paste it straight into WordPress.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8" role="tablist">
          {LAYOUTS.map((l) => (
            <button key={l.id} role="tab" aria-selected={layout === l.id} onClick={() => setLayout(l.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold border-2 transition-colors ${layout === l.id ? 'bg-primary border-primary text-white hover:bg-black hover:border-black' : 'bg-white border-primary text-primary hover:text-black hover:border-black'}`}>
              <l.icon className="w-4 h-4" />{l.label}
            </button>
          ))}
        </div>

        {usesFilters && (
          <div className="bg-white rounded-2xl shadow-sm p-5 mb-10 grid gap-5 lg:grid-cols-2">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wide w-16">Source</span>
                <button className={chip(source === 'all')} onClick={() => setSource('all')}>All</button>
                {(Object.keys(SOURCE_META) as Source[]).map((s) => (
                  <button key={s} className={chip(source === s)} onClick={() => setSource(s)}>{SOURCE_META[s].label}</button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wide w-16">Rating</span>
                {[1, 3, 4, 5].map((n) => (
                  <button key={n} className={chip(minRating === n)} onClick={() => setMinRating(n)}>{n === 1 ? 'All' : n === 5 ? '5★ only' : `${n}★+`}</button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wide w-16">Date</span>
                {DATE_RANGES.map((d) => <button key={d.id} className={chip(range === d.id)} onClick={() => setRange(d.id)}>{d.label}</button>)}
              </div>
            </div>
            <div className="space-y-3">
              <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Keyword filter, e.g. service" className="w-full border-2 border-neutral-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary" />
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wide w-16">Show</span>
                {(Object.keys(FIELD_LABELS) as (keyof ShowFields)[]).map((k) => (
                  <button key={k} className={chip(show[k])} onClick={() => setShow({ ...show, [k]: !show[k] })}>{FIELD_LABELS[k]}</button>
                ))}
              </div>
              {layout === 'grid' && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wide w-16">Columns</span>
                  {[2, 3, 4].map((c) => <button key={c} className={chip(columns === c)} onClick={() => setColumns(c)}>{c}</button>)}
                  <button className={chip(masonry)} onClick={() => setMasonry(!masonry)}>Masonry</button>
                </div>
              )}
              {layout === 'carousel' && (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wide w-16">Autoplay</span>
                  <button className={chip(autoplay)} onClick={() => setAutoplay(!autoplay)}>{autoplay ? 'On' : 'Off'}</button>
                  <label className="text-xs flex items-center gap-2">Speed {speed}s
                    <input type="range" min={1} max={10} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="accent-[#ffb000]" />
                  </label>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="min-h-[280px]">
          {layout === 'carousel' && <CarouselWidget reviews={filtered} show={show} perView={3} autoplay={autoplay} speed={speed} arrows />}
          {layout === 'grid' && <GridWidget reviews={filtered} show={show} columns={columns} masonry={masonry} />}
          {layout === 'list' && <ListWidget reviews={filtered} show={show} />}
          {layout === 'single' && <SingleWidget review={filtered[0]} show={show} />}
          {layout === 'wall' && <WallWidget reviews={filtered} show={show} />}
          {layout === 'combined' && <CombinedRatingWidget />}
          {layout === 'badge' && (
            <div className="text-center space-y-6">
              <div className="flex justify-center"><BadgeCard /></div>
              <p className="text-sm text-muted-foreground">The badge is now floating in the {badgePos === 'left' ? 'bottom-left' : 'bottom-right'} corner of this page.</p>
              <div className="flex flex-wrap justify-center gap-3">
                <button onClick={() => { setBadgePos('left'); setBadgeOn(true); }} className={badgePos === 'left' ? 'btn-brand' : 'btn-brand-outline'}>Bottom left</button>
                <button onClick={() => { setBadgePos('right'); setBadgeOn(true); }} className={badgePos === 'right' ? 'btn-brand' : 'btn-brand-outline'}>Bottom right</button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 flex items-center gap-3 bg-black text-white rounded-2xl p-4 max-w-3xl mx-auto">
          <code className="flex-1 text-sm font-mono break-all"><span className="text-primary">{shortcode}</span></code>
          <button onClick={copy} aria-label="Copy shortcode" className="p-2 rounded-lg hover:bg-white/10 flex-shrink-0">{copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}</button>
        </div>
      </div>
      {badgeOn && <FloatingBadge position={badgePos} onClose={() => setBadgeOn(false)} />}
    </section>
  );
}
