import type { Metadata } from "next";
import PressClient from "./PressClient";

export const metadata: Metadata = {
  title: "Roopé in the News — Luxury Beauty-Tech Innovation",
  description:
    "Read the latest press releases, news updates, and media coverage about Roopé. Discover how we are scaling Indore's premier on-demand beauty-tech platform with elite verified artists.",
  keywords: [
    "Roopé news",
    "beauty startup India",
    "Indore beauty tech",
    "doorstep salon press releases"
  ],
  alternates: {
    canonical: "/press",
  },
};

export default function PressPage() {
  return <PressClient />;
}
