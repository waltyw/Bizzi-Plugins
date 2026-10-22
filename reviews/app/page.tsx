import { HeroSection } from '@/components/sections/hero-section';
import { FeaturesSection } from '@/components/sections/features-section';
import { WidgetsSection } from '@/components/sections/widgets-section';
import { ShortcodesSection } from '@/components/sections/shortcodes-section';
import { AdminPreview } from '@/components/sections/admin-preview';
import { PricingSection } from '@/components/sections/pricing-section';
import { DownloadSection } from '@/components/sections/download-section';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { detectCountry } from '@/lib/geo';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const country = await detectCountry();
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <HeroSection />
      <WidgetsSection />
      <FeaturesSection />
      <ShortcodesSection />
      <AdminPreview />
      <PricingSection initialCountry={country} />
      <DownloadSection />
      <SiteFooter />
    </main>
  );
}
