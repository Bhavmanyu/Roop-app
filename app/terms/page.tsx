import type { Metadata } from "next";
import TermsOfServiceClient from "./TermsOfServiceClient";

export const metadata: Metadata = {
  title: "Terms of Service — Roopé Beauty",
  description:
    "Review Roopé's platform terms and conditions for booking luxury doorstep salon, spa, and beauty-tech services in Indore, India.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsOfServicePage() {
  return <TermsOfServiceClient />;
}
