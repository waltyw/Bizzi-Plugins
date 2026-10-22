'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Globe, Facebook, ShoppingCart, PenTool, Star, Shield, Zap, Search, BarChart3, Settings } from 'lucide-react';

const features = [
  { icon: Globe, title: 'Google Reviews', desc: 'Sync reviews from Google Business Profile automatically via Places API.' },
  { icon: Facebook, title: 'Facebook Reviews', desc: 'Import Facebook Page ratings and reviews via Graph API.' },
  { icon: ShoppingCart, title: 'WooCommerce', desc: 'Auto-detect WooCommerce and pull product reviews instantly.' },
  { icon: PenTool, title: 'Manual Entry', desc: 'Add reviews manually for testimonials or imported reviews.' },
  { icon: Star, title: '6 Widget Styles', desc: 'Carousel, Grid, List, Single, Floating Badge, and Review Wall layouts.' },
  { icon: Search, title: 'SEO Schema', desc: 'Auto-generate JSON-LD structured data for Review and AggregateRating.' },
  { icon: Shield, title: 'Moderation', desc: 'Auto-approve, manual review, bulk actions, and keyword filtering.' },
  { icon: Zap, title: 'Zero API Calls', desc: 'All reviews stored locally. Lightning-fast frontend with zero external requests.' },
  { icon: BarChart3, title: 'Dashboard', desc: 'Stats, charts, sync status, and review management in one admin panel.' },
  { icon: Settings, title: 'Gutenberg Blocks', desc: '4 custom blocks with full InspectorControls for visual editing.' },
];

export function FeaturesSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-6" ref={ref}>
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">Features</span>
          <h2 className="font-display text-4xl font-extrabold tracking-tight mt-3">Everything you need for <span className="text-primary">social proof</span></h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">A complete review management system built for WordPress.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-white rounded-2xl p-6 shadow-[0_6px_24px_-10px_rgba(0,0,0,0.18)] hover:shadow-[0_12px_32px_-10px_rgba(255,176,0,0.5)] transition-shadow"
            >
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
