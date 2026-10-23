'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Star, Package } from 'lucide-react';
import release from '@/data/plugin-release.json';

export function DownloadSection() {
  const [count, setCount] = useState(0);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetch('/api/download').then(r => r?.json?.()).then(d => setCount(d?.count ?? 0)).catch(() => {});
  }, []);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await fetch('/api/download', { method: 'POST' });
      setCount((c: number) => c + 1);
      const a = document.createElement('a');
      a.href = `/downloads/${release.free_zip}?v=2`;
      a.download = 'bizzi-reviews.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {}
    setDownloading(false);
  };

  return (
    <section id="download" className="py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-black rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_0%,rgba(255,176,0,0.35),transparent_60%)]" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Package className="w-4 h-4" />
              v{release.free_version} • Free • WordPress {release.requires}+
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight mb-4 !text-white">Download <span className="text-primary">Bizzi Reviews</span></h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">The free plugin, with no review limits. Upload to WordPress, activate, connect Google and display reviews. Bought Pro? Download the add-on from your order page after checkout.</p>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="btn-brand !px-10 !py-4 !text-lg hover:!bg-white hover:!text-black hover:!border-white"
            >
              <Download className="w-5 h-5" />
              {downloading ? 'Starting Download...' : 'Download Free Plugin'}
            </button>
            <p className="text-white/50 text-sm mt-4">{count?.toLocaleString?.('en-US') ?? '0'} downloads</p>
            <div className="flex items-center justify-center gap-1 mt-3">
              {[1, 2, 3, 4, 5].map((s: number) => <Star key={s} className="w-5 h-5 fill-primary text-primary" />)}
              <span className="ml-2 text-white/70 text-sm">4.9 average rating</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
