import HeroSection from "@/components/home/HeroSection";
import HomeServicesSection from "@/components/home/HomeServicesSection";
import DesktopCuratedAndCombos from "@/components/home/DesktopCuratedAndCombos";
import WhyRoope from "@/components/home/WhyRoope";
import ReviewsSection from "@/components/home/ReviewsSection";

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
        <DesktopCuratedAndCombos />
        <WhyRoope />
        <ReviewsSection />
      </div>
    </>
  );
}
