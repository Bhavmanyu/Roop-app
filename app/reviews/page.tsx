import type { Metadata } from "next";
import ReviewsClient from "./ReviewsClient";

export const metadata: Metadata = {
  title: "Client Reviews, Ratings & Testimonials — Roopé Luxury Beauty",
  description:
    "Read real client reviews and ratings of Roopé doorstep salon and bridal makeup services in Indore. See why we are rated 4.9/5 stars by verified brides and grooming clients.",
  keywords: [
    "makeup artist reviews Indore",
    "bridal makeup testimonials Indore",
    "Roopé salon review",
    "doorstep spa feedback Indore",
    "trusted beauty services Indore"
  ],
  alternates: {
    canonical: "/reviews",
  },
};

export default function ReviewsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "name": "Roopé",
    "image": "https://roope.in/images/hero_bridal.png",
    "@id": "https://roope.in/#organization",
    "url": "https://roope.in",
    "telephone": "+919876543210",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "63, Maharani Road, Siyaganj",
      "addressLocality": "Indore",
      "addressRegion": "MP",
      "postalCode": "452007",
      "addressCountry": "IN"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "785",
      "reviewCount": "512"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReviewsClient />
    </>
  );
}
