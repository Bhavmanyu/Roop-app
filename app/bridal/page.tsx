import type { Metadata } from "next";
import BridalPageClient from "./BridalPageClient";

export const metadata: Metadata = {
  title: "Ultra-Premium Bridal & Wedding Makeup Packages in Indore",
  description:
    "Indore's most premium bridal makeup packages. Airbrush, HD, and multi-day wedding coverage featuring certified bridal artists using luxury products (MAC, NARS, Charlotte Tilbury).",
  keywords: [
    "bridal makeup Indore",
    "wedding makeup packages Indore",
    "airbrush bridal makeup Indore",
    "HD bridal makeup Indore",
    "best bridal artist Indore",
    "luxury wedding glam Indore",
    "family makeup packages Indore"
  ],
  alternates: {
    canonical: "/bridal",
  },
  openGraph: {
    title: "Ultra-Premium Bridal & Wedding Makeup Packages in Indore — Roopé",
    description:
      "Indore's most premium bridal makeup packages. Airbrush, HD, and multi-day wedding coverage featuring certified bridal artists using luxury products.",
    url: "https://roope.in/bridal",
    images: [
      {
        url: "/images/hero_bridal.png",
        width: 1200,
        height: 630,
        alt: "Roopé Luxury Bridal Services",
      },
    ],
  },
};

export default function BridalPage() {
  return <BridalPageClient />;
}
