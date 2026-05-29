import HeroSection from "@/components/home/HeroSection";
import FeaturedTransformations from "@/components/home/FeaturedTransformations";
import SignaturePackages from "@/components/home/SignaturePackages";
import ArtistSpotlight from "@/components/home/ArtistSpotlight";
import WhyRoope from "@/components/home/WhyRoope";
import TrustSection from "@/components/home/TrustSection";
import ReviewsSection from "@/components/home/ReviewsSection";
import OffersSection from "@/components/home/OffersSection";
import BookingCTA from "@/components/home/BookingCTA";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedTransformations />
      <SignaturePackages />
      <WhyRoope />
      <ArtistSpotlight />
      <TrustSection />
      <OffersSection />
      <ReviewsSection />
      <BookingCTA />
    </>
  );
}
