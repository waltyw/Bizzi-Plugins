'use client';

import { useState } from 'react';
import { Star, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const links = [
    { href: '#features', label: 'Features' },
    { href: '#widgets', label: 'Widgets' },
    { href: '#shortcodes', label: 'Shortcodes' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#download', label: 'Download' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-black/5"
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-black font-display font-bold text-xl">
          <Star className="w-6 h-6 fill-primary text-primary" />
          Bizzi <span className="text-primary">Reviews Pro</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l: any) => (
            <a key={l.href} href={l.href} className="px-4 py-2 text-sm font-medium text-black hover:text-primary transition-colors rounded-lg">
              {l.label}
            </a>
          ))}
        </nav>
        <a href="#download" className="hidden md:inline-flex btn-brand !py-2.5 !px-5">
          Download Free
        </a>
        <button className="md:hidden" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-background border-t border-border p-4 space-y-2">
          {links.map((l: any) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block px-4 py-2 text-sm hover:bg-primary/5 rounded-lg">
              {l.label}
            </a>
          ))}
        </div>
      )}
    </motion.header>
  );
}
