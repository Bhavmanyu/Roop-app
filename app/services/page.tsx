import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Luxury Doorstep Salon, Grooming & Spa Services in Indore",
  description:
    "Experience Indore's premium home salon, spa, and grooming services. Painless roll-on waxing, Korean glass skin facials, organic candle pedicures, and therapeutic body massage treatments by certified Roopé experts.",
  keywords: [
    "doorstep salon Indore",
    "home salon services Indore",
    "Korean facial Indore",
    "home massage Indore",
    "men grooming Indore",
    "home spa Indore",
    "RICA waxing Indore",
    "professional nail spa at home"
  ],
  alternates: {
    canonical: "/services",
  },
};

export default function ServicesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Luxury Salon, Grooming & Spa Doorstep Services",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Roopé",
      "image": "https://roope.beauty/images/hero_bridal.png",
      "telephone": "+919876543210",
      "priceRange": "₹₹",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "63, Maharani Road, Siyaganj",
        "addressLocality": "Indore",
        "addressRegion": "MP",
        "postalCode": "452007",
        "addressCountry": "IN"
      }
    },
    "areaServed": {
      "@type": "City",
      "name": "Indore"
    },
    "hasOfferCatalog": {
      "@context": "https://schema.org",
      "@type": "OfferCatalog",
      "name": "Roopé Premium Services Catalog",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Super Savers",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Make Your Own Package",
                "description": "Customize your own salon package at home with maximum savings. Pick any 3+ services and get flat 20% off."
              },
              "price": "2989",
              "priceCurrency": "INR"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Classic Grooming Package (Men)",
                "description": "Custom haircut, beard styling, and therapeutic head massage."
              },
              "price": "999",
              "priceCurrency": "INR"
            }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Korean Facials & Cleanups",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Korean Glass Skin Facial",
                "description": "Translucent hydration facial that delivers the highly sought-after glass skin glow."
              },
              "price": "1499",
              "priceCurrency": "INR"
            }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Pedicure & Manicure",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Candle Spa Pedicure",
                "description": "Luxury pedicure using warm candle wax oils to deeply nourish and soften dry, cracked heels."
              },
              "price": "899",
              "priceCurrency": "INR"
            }
          ]
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServicesClient />
    </>
  );
}
