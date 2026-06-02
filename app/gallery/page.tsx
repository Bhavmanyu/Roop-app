import type { Metadata } from "next";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "Luxury Bridal & Event Glam Portfolio — Roopé Gallery",
  description:
    "Explore Roopé's real-client transformations, bridal lookbooks, and event styling portfolio in Indore. High-definition real-bride makeovers, dewy party glam, and contemporary hairstyles by our elite network.",
  keywords: [
    "bridal makeup portfolio Indore",
    "real brides Indore",
    "wedding lookbook Indore",
    "makeup transformations Indore",
    "party glam portfolio",
    "hairstyles gallery Indore"
  ],
  alternates: {
    canonical: "/gallery",
  },
};

export default function GalleryPage() {
  return <GalleryClient />;
}
