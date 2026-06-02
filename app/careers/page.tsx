import type { Metadata } from "next";
import CareersClient from "./CareersClient";

export const metadata: Metadata = {
  title: "Join Indore's Elite Beauty Network — Careers at Roopé",
  description:
    "Apply to join Roopé's certified premium beauty artist and therapist network in Indore. Earn top-tier compensation, set your own flexible hours, and serve premium addresses.",
  keywords: [
    "makeup artist jobs Indore",
    "beautician careers Indore",
    "spa therapist vacancies Indore",
    "salon jobs Indore",
    "join Roopé beauty network"
  ],
  alternates: {
    canonical: "/careers",
  },
};

export default function CareersPage() {
  return <CareersClient />;
}
