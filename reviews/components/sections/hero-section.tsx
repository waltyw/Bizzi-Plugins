'use client';

import { motion } from 'framer-motion';
import { Star, Download, ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-brand-fade" />
      <div className="relative max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white text-black rounded-full text-sm font-semibold mb-6 shadow-sm">
            <Star className="w-4 h-4 fill-primary text-primary" />
            WordPress Plugin v1.3.0 • Free
          </div>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
            Your reviews. <span className="text-primary">Your site.</span> No monthly fees.
          </h1>
          <p className="text-lg md:text-xl text-black/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            The self-hosted alternative to Elfsight. Pull in Google and manual reviews for free, with no review limits,
            and add Facebook, WooCommerce and extra layouts with the optional Pro add-on.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#download"
              className="btn-brand !px-8 !py-4 !text-base shadow-lg"
            >
              <Download className="w-5 h-5" />
              Download Free
            </a>
            <a
              href="#widgets"
              className="btn-brand-outline !px-8 !py-4 !text-base"
            >
              See Live Widgets
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-5 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-1.5"><span className="w-3 h-3 rounded-full bg-red-400" /><span className="w-3 h-3 rounded-full bg-yellow-400" /><span className="w-3 h-3 rounded-full bg-green-400" /></div>
              <span className="text-xs text-muted-foreground font-mono">WordPress Admin › Bizzi Reviews</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[{ label: 'Total Reviews', value: '253', color: 'text-primary' }, { label: 'Avg Rating', value: '4.91', color: 'text-black' }, { label: 'Pending', value: '12', color: 'text-primary' }, { label: 'Sources', value: '4', color: 'text-black' }].map((s: any, i: number) => (
                <div key={i} className="bg-muted/50 rounded-xl p-4">
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {['Sarah Mitchell', 'James Cooper', 'Emily Watson'].map((name: string, i: number) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white">{name.charAt(0)}</div>
                  <div className="flex-1"><p className="text-sm font-medium">{name}</p><p className="text-xs text-muted-foreground">Excellent service! Highly recommended...</p></div>
                  <span className="text-primary text-sm hidden sm:inline">{'★'.repeat(5)}</span>
                  <span className="text-xs px-2 py-0.5 bg-black text-white rounded-full">Approved</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
