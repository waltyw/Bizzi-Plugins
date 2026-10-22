'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Monitor } from 'lucide-react';

export function AdminPreview() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <section className="py-24">
      <div className="max-w-[1200px] mx-auto px-6" ref={ref}>
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">Admin Panel</span>
          <h2 className="font-display text-4xl font-extrabold tracking-tight mt-3">Beautiful <span className="text-primary">admin dashboard</span></h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Manage all reviews, sync sources, and configure widgets from one intuitive panel.</p>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 bg-muted/50 border-b border-border">
            <Monitor className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-mono">WP Admin › Bizzi Reviews › Dashboard</span>
          </div>
          <div className="p-8">
            <div className="flex gap-4">
              <div className="w-48 flex-shrink-0 space-y-2 hidden md:block bg-black rounded-xl p-3">
                {['Dashboard', 'All Reviews', 'Add Review', 'Sources & API', 'Settings', 'License'].map((item: string, i: number) => (
                  <div key={i} className={`px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition ${i === 0 ? 'bg-primary text-white' : 'text-white/70 hover:text-white'}`}>{item}</div>
                ))}
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[{ l: 'Total Reviews', v: '253', c: 'text-primary' }, { l: 'Average', v: '4.91 ★', c: 'text-black' }, { l: 'Pending', v: '12', c: 'text-primary' }, { l: 'Sources', v: '4', c: 'text-black' }].map((c: any, i: number) => (
                    <div key={i} className="bg-muted/40 rounded-xl p-4 text-center">
                      <p className={`text-xl font-bold ${c.c}`}>{c.v}</p>
                      <p className="text-xs text-muted-foreground mt-1">{c.l}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-muted/20 rounded-xl p-6 h-40 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Review Growth Chart</p>
                    <div className="flex items-end gap-2 mt-3 justify-center">
                      {[30, 45, 35, 60, 50, 70, 65, 80, 75, 90, 85, 95].map((h: number, i: number) => (
                        <div key={i} className="w-3 md:w-5 bg-primary rounded-t" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
