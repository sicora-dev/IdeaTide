import { Navigation } from '@/components/home/Navigation';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { CTASection } from '@/components/home/CTASection';
import { Footer } from '@/components/home/Footer';

export default async function HomePage() {
  return (
    <div className="max-h-full bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
}