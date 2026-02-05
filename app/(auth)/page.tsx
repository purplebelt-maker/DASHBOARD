// app/page.tsx
import LandingNavbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import ProblemSection from "@/components/landing/ProblemSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import EmailAlertsSection from "@/components/landing/EmailAlertsSection";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <>
      <LandingNavbar />
      <main className="relative bg-gradient-to-b from-slate-900 via-blue-900 via-30% to-slate-950">
        <Hero />
        <ProblemSection />
        <FeaturesSection />
        <EmailAlertsSection />
        <PricingSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}