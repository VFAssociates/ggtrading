/* GG Trading — Home Page
   Design: Quantum Violet AI Trading Command Center
   Sections: Navbar → Hero → Features → Performance → Community → Pricing → Contact → Footer */

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import PerformanceSection from "@/components/PerformanceSection";
import CommunitySection from "@/components/CommunitySection";
import LeadershipSection from "@/components/LeadershipSection";
import PricingSection from "@/components/PricingSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[oklch(0.07_0.03_265)] text-white">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PerformanceSection />
        <LeadershipSection />
        <CommunitySection />
        <PricingSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
