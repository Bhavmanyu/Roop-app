import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Book Premium Salon Services & Makeup Artists — Contact Roopé",
  description:
    "Get in touch with Roopé to book doorstep beauty treatments, salon sessions, and bridal consultations in Indore. Support, partner applications, and custom packages available.",
  keywords: [
    "book home salon Indore",
    "contact makeup artist Indore",
    "bridal consultation Indore",
    "Roopé customer care",
    "Indore beauty desk"
  ],
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
