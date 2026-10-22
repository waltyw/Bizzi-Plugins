export type Source = 'google' | 'facebook' | 'woocommerce' | 'manual';

export interface Review {
  id: number;
  name: string;
  source: Source;
  rating: number;
  date: string; // ISO
  text: string;
}

export const SOURCE_META: Record<Source, { label: string; color: string; letter: string }> = {
  google: { label: 'Google', color: '#4285F4', letter: 'G' },
  facebook: { label: 'Facebook', color: '#1877F2', letter: 'f' },
  woocommerce: { label: 'WooCommerce', color: '#7F54B3', letter: 'W' },
  manual: { label: 'Verified', color: '#000000', letter: '✓' },
};

// Example aggregate stats shown in the combined rating widget.
export const SOURCE_STATS: { source: Source; rating: number; count: number }[] = [
  { source: 'google', rating: 4.9, count: 124 },
  { source: 'facebook', rating: 4.8, count: 53 },
  { source: 'woocommerce', rating: 5.0, count: 76 },
];

export const COMBINED = (() => {
  const count = SOURCE_STATS.reduce((a, s) => a + s.count, 0);
  const sum = SOURCE_STATS.reduce((a, s) => a + s.rating * s.count, 0);
  return { count, rating: Math.round((sum / count) * 100) / 100 };
})();

export const REVIEWS: Review[] = [
  { id: 1, name: 'Sarah Mitchell', source: 'google', rating: 5, date: '2026-09-28', text: 'Absolutely brilliant service from start to finish. The team kept us updated at every step and the result exceeded expectations. Would recommend to anyone.' },
  { id: 2, name: 'James Cooper', source: 'facebook', rating: 5, date: '2026-09-14', text: 'Fast, friendly and professional. Booked on Monday, sorted by Wednesday.' },
  { id: 3, name: 'Priya Patel', source: 'woocommerce', rating: 5, date: '2026-08-30', text: 'Product arrived well packaged and works perfectly. Quality is far better than I expected for the price. Already ordered a second one as a gift for my sister.' },
  { id: 4, name: 'Tom Harrison', source: 'google', rating: 4, date: '2026-08-11', text: 'Great experience overall. Slight delay on delivery but customer service handled it really well and kept me informed.' },
  { id: 5, name: 'Emily Watson', source: 'google', rating: 5, date: '2026-07-22', text: 'Five stars isn’t enough! Genuinely the best local business we’ve dealt with.' },
  { id: 6, name: 'Daniel Okafor', source: 'manual', rating: 5, date: '2026-06-03', text: 'We switched three client sites over and the difference in page speed was immediately noticeable. Reviews load instantly and look fantastic on mobile.' },
  { id: 7, name: 'Chloe Bennett', source: 'facebook', rating: 4, date: '2026-04-19', text: 'Lovely staff and a really welcoming atmosphere. Will be back again soon.' },
  { id: 8, name: 'Marcus Lee', source: 'woocommerce', rating: 5, date: '2026-02-08', text: 'Exactly as described. Setup took five minutes and it has been flawless since.' },
  { id: 9, name: 'Hannah Clarke', source: 'google', rating: 5, date: '2025-11-15', text: 'Honest advice, fair pricing and a superb finish. I have already recommended them to friends and family and will use them again for our next project.' },
  { id: 10, name: 'Oliver Grant', source: 'google', rating: 3, date: '2025-07-02', text: 'Decent service, though communication could be a little quicker.' },
];
