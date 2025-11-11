import HeroSection from '@/components/landing/HeroSection';
import HowItWorks from '@/components/landing/HowItWorks';
import JurisdictionsSection from '@/components/landing/JurisdictionsSection';
import TemplateLibrary from '@/components/landing/TemplateLibrary';
import PricingSection from '@/components/landing/PricingSection';
import LawyerSection from '@/components/landing/LawyerSection';
import WaitlistSection from '@/components/landing/WaitlistSection';
import Footer from '@/components/landing/Footer';

// Disable static caching to ensure pricing is always fresh
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <HowItWorks />
      <JurisdictionsSection />
      <TemplateLibrary />
      <PricingSection />
      <LawyerSection />
      <WaitlistSection />
      <Footer />
    </div>
  );
}
