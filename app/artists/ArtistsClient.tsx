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
            className="font-display text-2xl md:text-6xl font-semibold md:font-light text-white leading-tight mb-4" style={{ letterSpacing: "-0.025em" }}>
            Certified. Brilliant.
            <span className="block italic" style={{ color: "#C9A84C" }}>Yours.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/60 text-xs md:text-lg font-light max-w-lg">
            Browse and book from verified makeup artists in Indore. Every artist handpicked, trained, and background-checked.
          </motion.p>
        </div>
      </section>

      {/* Artist grid */}
      <section className="py-12 md:py-16 px-4 md:px-6" style={{ background: "linear-gradient(180deg, var(--pearl) 0%, var(--ivory) 100%)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-6">
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
                  <div className="relative h-48 md:h-80 overflow-hidden">
                    <Image
                      src={artist.image}
                      alt={`${artist.name} - ${artist.title}`}
                      fill
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      sizes="300px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                    {/* Badges */}
                    <div className="absolute top-2 left-2 md:top-4 md:left-4 flex flex-col gap-2">
                      <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[11px] md:text-xs font-semibold text-white"
                        style={{
                          background: artist.tier === "Elite" ? "rgba(201,168,76,0.8)" : "rgba(26,22,18,0.7)",
                        }}>
                        {artist.tier}
                      </span>
                    </div>

                    {artist.available && (
                      <div className="absolute top-2 right-2 md:top-4 md:right-4">
                        <span className="flex items-center gap-1 px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-full text-[11px] md:text-xs font-medium text-white"
                          style={{ background: "rgba(34,197,94,0.25)", border: "1px solid rgba(34,197,94,0.4)" }}>
                          <div className="badge-live" /> Available
                        </span>
                      </div>
                    )}

                    {/* Hover CTA */}
                    <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 hidden md:block">
                      <Link href="/book" className="btn-primary w-full justify-center text-sm py-3">
                        Book {artist.name.split(" ")[0]}
                      </Link>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3 md:p-5">
                    <div className="flex items-start justify-between mb-2 md:mb-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-roope-primary text-xs md:text-base truncate">{artist.name}</h3>
                        <p className="text-[11.5px] md:text-xs text-stone-warm mt-0.5 truncate">{artist.title}</p>
                      </div>
                      <BadgeCheck className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" style={{ color: "#C9A84C" }} />
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-0.5 md:gap-1 mb-2 md:mb-3">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-2.5 h-2.5 md:w-3 h-3 fill-current flex-shrink-0" style={{ color: "#C9A84C" }} />
                      ))}
                      <span className="text-[11.5px] md:text-xs text-stone-warm ml-0.5 md:ml-1 truncate">{artist.rating} ({artist.reviews})</span>
                    </div>

                    {/* Location + experience */}
                    <div className="flex items-center gap-1 text-[11.5px] md:text-xs text-stone-warm mb-3 md:mb-4">
                      <MapPin className="w-2.5 h-2.5 md:w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{artist.city} • {artist.experience}</span>
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1 mb-3 md:mb-4">
                      {artist.specialties.slice(0, 2).map((spec) => (
                        <span key={spec} className="px-1.5 py-0.5 rounded-full text-[11px] md:text-xs text-stone-warm border border-pearl-300 truncate">
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* Certifications */}
                    <div className="hidden md:block pt-4 border-t border-pearl-200">
                      <p className="text-xs text-stone-warm mb-2">Certifications:</p>
                      {artist.certifications.slice(0, 2).map((cert) => (
                        <div key={cert} className="flex items-center gap-1.5 mb-1">
                          <Check className="w-3 h-3 flex-shrink-0" style={{ color: "#C9A84C" }} />
                          <span className="text-xs text-stone-warm">{cert}</span>
                        </div>
                      ))}
                    </div>

                    <Link href="/book"
                      className="mt-3 md:mt-4 flex items-center gap-1 text-xs md:text-sm font-medium transition-colors duration-200 hover:opacity-70"
                      style={{ color: "#C9A84C" }}>
                      Book Artist <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load more placeholder */}
          <div className="text-center mt-12">
            <p className="text-stone-warm text-sm mb-4">Showing all verified experts in Indore</p>
          </div>
        </div>
      </section>

      {/* Apply CTA */}
      <section className="py-16 px-6" style={{ background: "linear-gradient(135deg, var(--ivory) 0%, var(--ivory-300) 100%)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-xl md:text-3xl font-semibold md:font-light text-roope-primary mb-4">
            Are you a makeup artist?
          </h2>
          <p className="text-stone-warm mb-8">
            Join Roopé&apos;s verified artist network and get access to premium clients in Indore.
          </p>
          <Link href="/contact#partner" className="btn-primary px-10 py-4">
            Apply to Join Roopé
          </Link>
        </div>
      </section>
    </>
  );
}
