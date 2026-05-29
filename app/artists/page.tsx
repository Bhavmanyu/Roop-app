"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, MapPin, BadgeCheck, Check, ArrowRight } from "lucide-react";
import { artists } from "@/lib/data";

export default function ArtistsPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-16 px-6" style={{ background: "#1A1612" }}>
        <div className="max-w-7xl mx-auto">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="section-label text-champagne-DEFAULT mb-3">
            Artist Network
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-6xl font-light text-white leading-tight mb-4" style={{ letterSpacing: "-0.025em" }}>
            Certified. Brilliant.
            <span className="block italic" style={{ color: "#C9A84C" }}>Yours.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/60 text-lg font-light max-w-lg">
            Browse and book from 1,200+ verified makeup artists across India. Every artist handpicked, trained, and background-checked.
          </motion.p>
        </div>
      </section>

      {/* Artist grid */}
      <section className="py-16 px-6" style={{ background: "linear-gradient(180deg, #F8F6F2 0%, #FAF6EC 100%)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {artists.map((artist, i) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div className="card-luxury group overflow-hidden">
                  {/* Portrait */}
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      src={artist.image}
                      alt={`${artist.name} - ${artist.title}`}
                      fill
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      sizes="300px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{
                          background: artist.tier === "Elite" ? "rgba(201,168,76,0.8)" : "rgba(26,22,18,0.7)",
                        }}>
                        {artist.tier}
                      </span>
                    </div>

                    {artist.available && (
                      <div className="absolute top-4 right-4">
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white"
                          style={{ background: "rgba(34,197,94,0.25)", border: "1px solid rgba(34,197,94,0.4)" }}>
                          <div className="badge-live" /> Available
                        </span>
                      </div>
                    )}

                    {/* Hover CTA */}
                    <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                      <Link href="/book" className="btn-primary w-full justify-center text-sm py-3">
                        Book {artist.name.split(" ")[0]}
                      </Link>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-roope-primary">{artist.name}</h3>
                        <p className="text-xs text-stone-warm mt-0.5">{artist.title}</p>
                      </div>
                      <BadgeCheck className="w-5 h-5" style={{ color: "#C9A84C" }} />
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-3 h-3 fill-current" style={{ color: "#C9A84C" }} />
                      ))}
                      <span className="text-xs text-stone-warm ml-1">{artist.rating} ({artist.reviews} reviews)</span>
                    </div>

                    {/* Location + experience */}
                    <div className="flex items-center gap-1 text-xs text-stone-warm mb-4">
                      <MapPin className="w-3 h-3" />
                      {artist.city} • {artist.experience} • {artist.events}+ events
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {artist.specialties.slice(0, 3).map((spec) => (
                        <span key={spec} className="px-2 py-0.5 rounded-full text-xs text-stone-warm border border-pearl-300">
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* Certifications */}
                    <div className="pt-4 border-t border-pearl-200">
                      <p className="text-xs text-stone-warm mb-2">Certifications:</p>
                      {artist.certifications.slice(0, 2).map((cert) => (
                        <div key={cert} className="flex items-center gap-1.5 mb-1">
                          <Check className="w-3 h-3 flex-shrink-0" style={{ color: "#C9A84C" }} />
                          <span className="text-xs text-stone-warm">{cert}</span>
                        </div>
                      ))}
                    </div>

                    <Link href="/book"
                      className="mt-4 flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 hover:opacity-70"
                      style={{ color: "#C9A84C" }}>
                      View Profile <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load more placeholder */}
          <div className="text-center mt-12">
            <p className="text-stone-warm text-sm mb-4">Showing 4 of 1,200+ artists</p>
            <button className="btn-secondary px-8 py-3.5 text-sm">Load More Artists</button>
          </div>
        </div>
      </section>

      {/* Apply CTA */}
      <section className="py-16 px-6" style={{ background: "linear-gradient(135deg, #FAF6EC 0%, #F3E8C8 100%)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl font-light text-roope-primary mb-4">
            Are you a makeup artist?
          </h2>
          <p className="text-stone-warm mb-8">
            Join Roopé&apos;s verified artist network and get access to premium clients across India.
          </p>
          <Link href="/contact#partner" className="btn-primary px-10 py-4">
            Apply to Join Roopé
          </Link>
        </div>
      </section>
    </>
  );
}
