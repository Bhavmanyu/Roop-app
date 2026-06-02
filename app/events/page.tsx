import type { Metadata } from "next";
import EventsClient from "./EventsClient";

export const metadata: Metadata = {
  title: "Premium Event & Party Styling Services in Indore — Roopé",
  description:
    "Tailored hair and makeup styling packages for cocktail parties, high-profile corporate events, fashion campaigns, and group bridesmaid makeovers in Indore. Elite cosmetic artistry at transparent pricing.",
  keywords: [
    "party makeup Indore",
    "event styling Indore",
    "bridesmaids makeover Indore",
    "cocktail makeup artist Indore",
    "corporate event grooming Indore",
    "fashion shoot makeup Indore"
  ],
  alternates: {
    canonical: "/events",
  },
};

export default function EventsPage() {
  return <EventsClient />;
}
