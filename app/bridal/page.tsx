import type { Metadata } from "next";
import BridalPageClient from "./BridalPageClient";

export const metadata: Metadata = {
  title: "Bridal Packages — Roopé",
  description: "Ultra-premium bridal makeup packages in Indore. Airbrush, HD, and full-day coverage with certified bridal makeup artists.",
};

export default function BridalPage() {
  return <BridalPageClient />;
}
