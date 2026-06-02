import type { Metadata } from "next";
import ArtistsClient from "./ArtistsClient";

export const metadata: Metadata = {
  title: "Verified Professional Makeup Artists & Beauty Crews in Indore",
  description:
    "Browse Indore's elite network of certified makeup artists and hair stylists. View portfolios, ratings, and experience. Every Roopé beauty lead is MAC and Charlotte Tilbury certified.",
  keywords: [
    "bridal makeup artist Indore",
    "professional makeup artist Indore",
    "top makeup artists Indore",
    "certified beauty experts Indore",
    "wedding hair stylist Indore",
    "home makeup service Indore",
    "party makeup artist Indore"
  ],
  alternates: {
    canonical: "/artists",
  },
};

export default function ArtistsPage() {
  return <ArtistsClient />;
}
