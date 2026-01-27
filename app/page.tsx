import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { TrustedBySection } from "@/components/sections/trusted-by-section";
import { CaseStudiesSection } from "@/components/sections/case-studies-section";
import { AboutSection } from "@/components/sections/about-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { ApproachSection } from "@/components/sections/approach-section";
import { ComparisonSection } from "@/components/sections/comparison-section";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import ScrollHandler from "@/components/ScrollHandler";
import { Suspense } from "react";

export default async function HomePage() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={null}>
        <ScrollHandler />
      </Suspense>
      <Navbar />
      <HeroSection />
      <TrustedBySection />
      <ApproachSection />
      <CaseStudiesSection />
      <TestimonialsSection />
      <ComparisonSection />
      <AboutSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
