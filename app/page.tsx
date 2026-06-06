import HeroSection from "@/components/home/HeroSection";
import HomeServicesSection from "@/components/home/HomeServicesSection";
import FeaturedTransformations from "@/components/home/FeaturedTransformations";
import SignaturePackages from "@/components/home/SignaturePackages";
import WhyRoope from "@/components/home/WhyRoope";
import TrustSection from "@/components/home/TrustSection";
import ReviewsSection from "@/components/home/ReviewsSection";
import OffersSection from "@/components/home/OffersSection";
import BookingCTA from "@/components/home/BookingCTA";

export default function Home() {
  return (
    <>
      {/* ─── MOBILE VIEWPORTS ONLY ─── */}
      <div className="lg:hidden">
        <HeroSection />
        <WhyRoope />
        <ReviewsSection />
      </div>

      {/* ─── DESKTOP VIEWPORTS ONLY ─── */}
      <div className="hidden lg:block">
        <HeroSection />
        <HomeServicesSection />
        <WhyRoope />
        <TrustSection />
        <SignaturePackages />
        <FeaturedTransformations />
        <OffersSection />
        <ReviewsSection />
        <BookingCTA />
      </div>
    </>
  );
}
