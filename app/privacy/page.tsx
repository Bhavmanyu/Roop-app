import type { Metadata } from "next";
import PrivacyPolicyClient from "./PrivacyPolicyClient";

export const metadata: Metadata = {
  title: "Privacy Policy — Roopé Beauty",
  description:
    "Review Roopé's privacy statement to understand how we secure your personal details and location data during home beauty service visits.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
