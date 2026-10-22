'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code } from 'lucide-react';

const shortcodes = [
  { code: '[bizzi_reviews]', desc: 'Display all reviews with default carousel layout' },
  { code: '[bizzi_reviews source="google"]', desc: 'Show only Google reviews' },
  { code: '[bizzi_reviews source="facebook,google"]', desc: 'Combine multiple sources' },
  { code: '[bizzi_reviews layout="grid" columns="3"]', desc: '3-column grid layout' },
  { code: '[bizzi_reviews layout="wall"]', desc: 'Pinterest-style masonry wall' },
  { code: '[bizzi_reviews layout="list"]', desc: 'Traditional list view' },
  { code: '[bizzi_reviews min_rating="4"]', desc: 'Filter by minimum rating' },
  { code: '[bizzi_reviews limit="10"]', desc: 'Limit number of reviews' },
  { code: '[bizzi_rating_badge position="bottom-right"]', desc: 'Floating rating badge' },
  { code: '[bizzi_combined_rating]', desc: 'Combined rating from all sources' },
  { code: '[bizzi_single_review id="5"]', desc: 'Display a specific review' },
];

export function ShortcodesSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <section id="shortcodes" className="py-24 bg-brand-fade-soft">
      <div className="max-w-[1200px] mx-auto px-6" ref={ref}>
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">Shortcodes</span>
          <h2 className="font-display text-4xl font-extrabold tracking-tight mt-3">Powerful <span className="text-primary">shortcode</span> system</h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Drop reviews anywhere with flexible shortcode attributes.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {shortcodes.map((s: any, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.4, delay: i * 0.06 }} className="bg-white rounded-xl p-5 shadow-sm flex items-start gap-4 hover:shadow-md transition">
              <Code className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <code className="text-sm font-mono text-black bg-[#fff1cc] px-2 py-0.5 rounded break-all">{s.code}</code>
                <p className="text-sm text-muted-foreground mt-1.5">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
