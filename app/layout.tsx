import type { Metadata } from "next";
import { Inter, Instrument_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/providers/SmoothScroll";
import ViewportProvider from "@/components/providers/ViewportProvider";
import SplashLoader from "@/components/layout/SplashLoader";
import CookieConsent from "@/components/layout/CookieConsent";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://roope.beauty"),
  title: {
    default: "Roopé — Luxury Beauty Services, Reimagined",
    template: "%s | Roopé",
  },
  description:
    "Professional bridal glam, event styling, and beauty crews at transparent, accessible pricing. India's most trusted luxury beauty-tech platform.",
  keywords: [
    "bridal makeup",
    "luxury beauty",
    "makeup artist",
    "event styling",
    "HD makeup",
    "airbrush makeup",
    "beauty services India",
    "doorstep salon Indore",
    "home makeup artist Indore",
    "home spa Indore"
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Roopé — Luxury Beauty Services, Reimagined",
    description:
      "Professional bridal glam, event styling, and beauty crews at transparent, accessible pricing. India's most trusted luxury beauty-tech platform.",
    url: "https://roope.in",
    siteName: "Roopé",
    images: [
      {
        url: "/images/hero_bridal.png",
        width: 1200,
        height: 630,
        alt: "Roopé Luxury Beauty Services",
      },
    ],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roopé — Luxury Beauty Services, Reimagined",
    description:
      "Professional bridal glam, event styling, and beauty crews at transparent, accessible pricing.",
    images: ["/images/hero_bridal.png"],
  },
};

import MobileBottomNav from "@/components/layout/MobileBottomNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 22.7196,
      "longitude": 75.8577
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "07:00",
      "closes": "22:00"
    },
    "sameAs": [
      "https://www.instagram.com/roope.beauty"
    ]
  };

  return (
    <html lang="en" className={`${inter.variable} ${instrumentSans.variable}`}>
      <body className="bg-pearl font-sans antialiased">
        <SplashLoader />
        <SmoothScroll>
          <ViewportProvider>
            <Navbar />
            <main className="pb-16 md:pb-0">{children}</main>
            <Footer />
            <CookieConsent />
            <MobileBottomNav />
          </ViewportProvider>
        </SmoothScroll>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
