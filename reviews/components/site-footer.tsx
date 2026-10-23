'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export function SiteFooter() {
  const [year, setYear] = useState('2026');
  useEffect(() => { setYear(String(new Date().getFullYear())); }, []);
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-white font-display font-bold">
          <Image src="/bizzi-logo.png" alt="Bizzi Reviews logo" width={32} height={32} className="w-8 h-8" />
          Bizzi <span className="text-primary">WP Plugins</span>
        </div>
        <p className="text-sm text-white/60">
          © {year} Bizzi WP Plugins is part of <a href="https://beebizzi.co.uk/" target="_blank" className="text-primary"> Bee Bizzi LTD</a>. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm text-white/70">
          <a href="/#features" className="hover:text-primary transition-colors">Features</a>
          <a href="/#download" className="hover:text-primary transition-colors">Download</a>
          <a href="/help" className="hover:text-primary transition-colors">Help</a>
        </div>
      </div>
    </footer>
  );
}
