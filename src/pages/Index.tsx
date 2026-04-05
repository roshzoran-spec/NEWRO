import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import MilestoneTrackerPreview from "@/components/landing/MilestoneTrackerPreview";
import FeaturesSection from "@/components/landing/FeaturesSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

import { PageTransition } from "@/components/PageTransition";

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background selection:bg-primary/20">
        <Navbar />
        <HeroSection />
        <MilestoneTrackerPreview />
        <FeaturesSection />
        <CTASection />
        <Footer />
      </div>
    </PageTransition>
  );
};


export default Index;
