import type { Metadata } from "next";
import BridalPageClient from "./BridalPageClient";

export const metadata: Metadata = {
  title: "Bridal Packages — Roopé",
  description: "Ultra-premium bridal makeup packages. Airbrush, HD, full-day coverage with India's top certified bridal artists.",
};

export default function BridalPage() {
  return <BridalPageClient />;
}
