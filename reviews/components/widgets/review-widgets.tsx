'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, X } from 'lucide-react';
import { SOURCE_META, SOURCE_STATS, COMBINED, type Review } from './demo-data';

export interface ShowFields {
  name: boolean;
  avatar: boolean;
  date: boolean;
  source: boolean;
  rating: boolean;
  text: boolean;
}

export const ALL_FIELDS: ShowFields = { name: true, avatar: true, date: true, source: true, rating: true, text: true };

export function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 20 20" fill={i <= Math.round(value) ? '#ffb000' : '#e5e5e5'} aria-hidden>
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
        </svg>
      ))}
    </span>
  );
}

function SourceIcon({ source }: { source: Review['source'] }) {
  const m = SOURCE_META[source];
  return (
    <span title={m.label} className="inline-flex w-6 h-6 rounded-full items-center justify-center text-[11px] font-bold text-white flex-shrink-0" style={{ background: m.color }}>
      {m.letter}
    </span>
  );
}

const fmtDate = (iso: string) => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

export function ReviewCard({ r, show, clamp = 160, className = '' }: { r: Review; show: ShowFields; clamp?: number; className?: string }) {
  const [open, setOpen] = useState(false);
  const long = r.text.length > clamp;
  return (
    <article className={`bg-white rounded-2xl p-5 shadow-[0_6px_24px_-8px_rgba(0,0,0,0.15)] flex flex-col gap-3 h-full ${className}`}>
      <div className="flex items-center gap-3">
        {show.avatar && (
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
            {r.name.charAt(0)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          {show.name && <p className="font-semibold text-sm truncate text-black">{r.name}</p>}
          {show.date && <p className="text-xs text-neutral-500">{fmtDate(r.date)}</p>}
        </div>
        {show.source && <SourceIcon source={r.source} />}
      </div>
      {show.rating && <Stars value={r.rating} />}
      {show.text && (
        <p className="text-sm text-neutral-700 leading-relaxed">
          {open || !long ? r.text : r.text.slice(0, clamp).trimEnd() + '…'}
          {long && (
            <button onClick={() => setOpen(!open)} className="ml-1 text-primary font-semibold hover:text-black">
              {open ? 'Less' : 'Read more'}
            </button>
          )}
        </p>
      )}
    </article>
  );
}

export function CarouselWidget({ reviews, show, perView, autoplay, speed, arrows }: { reviews: Review[]; show: ShowFields; perView: number; autoplay: boolean; speed: number; arrows: boolean }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [vw, setVw] = useState(perView);
  const touchX = useRef<number | null>(null);
  const count = reviews.length;

  useEffect(() => {
    const calc = () => setVw(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? Math.min(2, perView) : perView);
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [perView]);

  const go = useCallback((d: number) => setIndex((i) => (count ? (i + d + count) % count : 0)), [count]);

  useEffect(() => {
    if (!autoplay || paused || count <= vw) return;
    const t = setInterval(() => go(1), speed * 1000);
    return () => clearInterval(t);
  }, [autoplay, paused, speed, go, count, vw]);

  useEffect(() => setIndex(0), [count]);

  if (!count) return <Empty />;
  // Infinite loop: render a rotated copy so the track always starts at the active slide.
  const visible = Array.from({ length: Math.min(vw, count) }, (_, k) => reviews[(index + k) % count]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="grid gap-5" style={{ gridTemplateColumns: `repeat(${visible.length}, minmax(0, 1fr))` }}>
        {visible.map((r) => (
          <div key={`${r.id}-${index}`} className="animate-fade-in"><ReviewCard r={r} show={show} clamp={130} /></div>
        ))}
      </div>
      {arrows && count > vw && (
        <>
          <button onClick={() => go(-1)} aria-label="Previous review" className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-black transition-colors"><ChevronLeft className="w-5 h-5" /></button>
          <button onClick={() => go(1)} aria-label="Next review" className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-black transition-colors"><ChevronRight className="w-5 h-5" /></button>
        </>
      )}
      <div className="flex justify-center gap-2 mt-6">
        {reviews.map((r, i) => (
          <button key={r.id} onClick={() => setIndex(i)} aria-label={`Go to review ${i + 1}`} className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-primary' : 'w-2 bg-neutral-300 hover:bg-black'}`} />
        ))}
      </div>
    </div>
  );
}

export function GridWidget({ reviews, show, columns, masonry }: { reviews: Review[]; show: ShowFields; columns: number; masonry: boolean }) {
  if (!reviews.length) return <Empty />;
  const colClass = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }[columns] ?? 'sm:grid-cols-3';
  const mClass = { 2: 'sm:columns-2', 3: 'sm:columns-2 lg:columns-3', 4: 'sm:columns-2 lg:columns-4' }[columns] ?? 'sm:columns-3';
  if (masonry) {
    return (
      <div className={`columns-1 ${mClass} gap-5`}>
        {reviews.map((r) => <div key={r.id} className="break-inside-avoid mb-5"><ReviewCard r={r} show={show} clamp={400} /></div>)}
      </div>
    );
  }
  return (
    <div className={`grid grid-cols-1 ${colClass} gap-5`}>
      {reviews.map((r) => <ReviewCard key={r.id} r={r} show={show} />)}
    </div>
  );
}

export function ListWidget({ reviews, show }: { reviews: Review[]; show: ShowFields }) {
  const [limit, setLimit] = useState(4);
  if (!reviews.length) return <Empty />;
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {reviews.slice(0, limit).map((r) => <ReviewCard key={r.id} r={r} show={show} clamp={300} />)}
      {limit < reviews.length && (
        <div className="text-center pt-2"><button onClick={() => setLimit(limit + 4)} className="btn-brand-outline">Load more reviews</button></div>
      )}
    </div>
  );
}

export function SingleWidget({ review, show }: { review?: Review; show: ShowFields }) {
  if (!review) return <Empty />;
  return (
    <figure className="max-w-2xl mx-auto bg-white rounded-3xl p-10 text-center shadow-[0_12px_40px_-12px_rgba(0,0,0,0.2)] relative">
      <Quote className="w-10 h-10 text-primary mx-auto mb-4" />
      {show.text && <blockquote className="text-xl leading-relaxed text-black font-medium mb-6">“{review.text}”</blockquote>}
      {show.rating && <div className="mb-4"><Stars value={review.rating} size={22} /></div>}
      <figcaption className="flex items-center justify-center gap-3">
        {show.avatar && <span className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">{review.name.charAt(0)}</span>}
        <span className="text-left">
          {show.name && <span className="block font-semibold text-black">{review.name}</span>}
          {(show.source || show.date) && (
            <span className="block text-xs text-neutral-500">
              {show.source && SOURCE_META[review.source].label}{show.source && show.date && ' · '}{show.date && fmtDate(review.date)}
            </span>
          )}
        </span>
      </figcaption>
    </figure>
  );
}

export function WallWidget({ reviews, show }: { reviews: Review[]; show: ShowFields }) {
  if (!reviews.length) return <Empty />;
  return (
    <div className="columns-1 sm:columns-2 lg:columns-4 gap-4">
      {reviews.map((r, i) => (
        <div key={r.id} className="break-inside-avoid mb-4 animate-fade-in" style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}>
          <ReviewCard r={r} show={show} clamp={1000} className={i % 3 === 0 ? 'bg-[#fff6e0]' : ''} />
        </div>
      ))}
    </div>
  );
}

export function BadgeCard({ onClick }: { onClick?: () => void }) {
  return (
    <button onClick={onClick} className="bg-white rounded-2xl shadow-[0_10px_30px_-8px_rgba(0,0,0,0.3)] px-5 py-3 flex items-center gap-3 text-left hover:-translate-y-0.5 transition-transform">
      <span className="w-10 h-10 rounded-xl bg-primary text-white font-extrabold flex items-center justify-center">{COMBINED.rating.toFixed(1)}</span>
      <span>
        <Stars value={COMBINED.rating} size={14} />
        <span className="block text-xs text-neutral-600">Based on <strong className="text-black">{COMBINED.count}</strong> reviews</span>
      </span>
    </button>
  );
}

export function FloatingBadge({ position, onClose }: { position: 'left' | 'right'; onClose: () => void }) {
  return (
    <div className={`fixed bottom-5 z-40 ${position === 'left' ? 'left-5' : 'right-5'} animate-fade-in`}>
      <div className="relative">
        <BadgeCard onClick={() => document.getElementById('widgets')?.scrollIntoView({ behavior: 'smooth' })} />
        <button onClick={onClose} aria-label="Dismiss badge" className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black text-white flex items-center justify-center hover:bg-primary"><X className="w-3 h-3" /></button>
      </div>
    </div>
  );
}

export function CombinedRatingWidget() {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.2)] grid md:grid-cols-[1fr_1.4fr] gap-8 items-center">
      <div className="text-center">
        <p className="text-6xl font-extrabold text-black">{COMBINED.rating.toFixed(2)}</p>
        <div className="my-2"><Stars value={COMBINED.rating} size={24} /></div>
        <p className="text-sm text-neutral-600">Combined from <strong className="text-black">{COMBINED.count}</strong> reviews</p>
      </div>
      <ul className="space-y-4">
        {SOURCE_STATS.map((s) => (
          <li key={s.source} className="flex items-center gap-3">
            <SourceIcon source={s.source} />
            <span className="w-28 text-sm font-semibold text-black">{SOURCE_META[s.source].label}</span>
            <span className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden"><span className="block h-full bg-primary" style={{ width: `${(s.rating / 5) * 100}%` }} /></span>
            <span className="text-sm text-neutral-700 w-24 text-right">{s.rating.toFixed(1)} ({s.count})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Empty() {
  return <p className="text-center text-neutral-500 py-12">No reviews match these filters.</p>;
}
