import type { Metadata } from "next";
import { Inter, Instrument_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/providers/SmoothScroll";

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
  title: "Roopé — Luxury Beauty Services, Reimagined",
  description:
    "Professional bridal glam, event styling, and beauty crews at transparent, accessible pricing. India's most trusted luxury beauty-tech platform.",
  keywords:
    "bridal makeup, luxury beauty, makeup artist, event styling, HD makeup, airbrush makeup, beauty services India",
  openGraph: {
    title: "Roopé — Luxury Beauty Services, Reimagined",
    description:
      "Professional bridal glam, event styling, and beauty crews at transparent, accessible pricing.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSans.variable}`}>
      <body className="bg-pearl font-sans antialiased">
        <SmoothScroll>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
