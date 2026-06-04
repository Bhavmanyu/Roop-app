"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { X, ArrowRight } from "lucide-react";

const galleryItems = [
  { id: 1, src: "/images/hero_bridal.png", label: "Ivory Bridal", category: "Bridal", span: "col-span-1 row-span-2" },
  { id: 2, src: "/images/bridal_glam_1.png", label: "Red Glamour", category: "Bridal", span: "" },
  { id: 3, src: "/images/gallery_party_glam.png", label: "Party Glam", category: "Event", span: "" },
  { id: 4, src: "/images/makeup_application.png", label: "The Process", category: "Behind the Scenes", span: "col-span-2" },
  { id: 5, src: "/images/gallery_natural_glam.png", label: "Natural Dewy", category: "Natural", span: "" },
  { id: 6, src: "/images/artist_1.png", label: "Artist Portrait", category: "Artists", span: "" },
  { id: 7, src: "/images/hero_bridal.png", label: "Bridal Elegance", category: "Bridal", span: "" },
  { id: 8, src: "/images/bridal_glam_1.png", label: "Bold Glam", category: "Event", span: "" },
];

const cats = ["All", "Bridal", "Event", "Natural", "Artists", "Behind the Scenes"];

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = activeFilter === "All" ? galleryItems : galleryItems.filter((g) => g.category === activeFilter);
  const lightboxItem = galleryItems.find((g) => g.id === lightbox);

  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-16 px-6 text-center" style={{ background: "linear-gradient(160deg, #1A1612 0%, #3D352D 100%)" }}>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="section-label text-champagne-DEFAULT mb-3">Gallery</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="font-display text-2xl md:text-6xl font-semibold md:font-light text-white leading-tight mb-4" style={{ letterSpacing: "-0.025em" }}>
          Every look tells a
          <span className="italic" style={{ color: "#C9A84C" }}> story.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-white/50 text-xs md:text-lg font-light max-w-md mx-auto">
          A curated showcase of transformations, artistry, and beauty — crafted by the Roopé network.
        </motion.p>
      </section>

      {/* Filters */}
      <section className="py-8 px-6 sticky top-16 z-30 glass border-b border-pearl-200">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2 justify-center">
          {cats.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === cat ? "text-white shadow-gold" : "text-stone-warm border border-pearl-300 hover:border-champagne-300"
              }`}
              style={{ background: activeFilter === cat ? "linear-gradient(135deg, #C9A84C, #B8922E)" : "rgba(255,255,255,0.9)" }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[240px]">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.25) }}
                className={`relative group cursor-pointer rounded-3xl overflow-hidden ${item.span}`}
                onClick={() => setLightbox(item.id)}
              >
                <Image
                  src={item.src}
                  alt={item.label}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-108"
                  sizes="300px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                  <p className="text-white font-medium text-sm">{item.label}</p>
                  <p className="text-white/60 text-xs">{item.category}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && lightboxItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center p-6"
          style={{ background: "rgba(26,22,18,0.92)" }}
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-6 right-6 w-10 h-10 rounded-full glass flex items-center justify-center"
            onClick={() => setLightbox(null)}>
            <X className="w-5 h-5 text-roope-primary" />
          </button>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="relative max-w-2xl w-full max-h-[80vh] rounded-4xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxItem.src}
              alt={lightboxItem.label}
              width={800}
              height={600}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6" style={{ background: "linear-gradient(to top, rgba(26,22,18,0.8), transparent)" }}>
              <p className="text-white font-medium">{lightboxItem.label}</p>
              <p className="text-white/60 text-sm">{lightboxItem.category}</p>
            </div>
          </motion.div>
        </motion.div>
      )}

      <section className="py-16 px-6 text-center" style={{ background: "linear-gradient(135deg, #FAF6EC, #F8F6F2)" }}>
        <h2 className="font-display text-xl md:text-3xl font-semibold md:font-light text-roope-primary mb-6">
          Want a look like this?
        </h2>
        <Link href="/book" className="btn-primary px-10 py-4 inline-flex items-center gap-2">
          Book Your Artist <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </>
  );
}
