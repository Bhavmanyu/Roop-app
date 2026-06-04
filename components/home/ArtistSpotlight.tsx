"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Star, MapPin, BadgeCheck, ArrowRight } from "lucide-react";
import { artists } from "@/lib/data";

export default function ArtistSpotlight() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      id="artist-spotlight"
      className="py-12 md:py-24 px-4 md:px-6"
      style={{ background: "#1A1612" }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 md:mb-14 flex items-end justify-between flex-wrap gap-6"
        >
          <div>
            <p className="section-label text-champagne-DEFAULT mb-3">Artist Network</p>
            <h2 className="font-display text-2xl md:text-5xl lg:text-6xl font-light text-white leading-tight" style={{ letterSpacing: "-0.02em" }}>
              Meet the artists
              <span className="block italic" style={{ color: "#C9A84C" }}>behind the magic.</span>
            </h2>
          </div>
          <Link href="/artists" className="flex items-center gap-2 text-sm font-medium transition-colors duration-200" style={{ color: "#C9A84C" }}>
            View All Artists <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {artists.map((artist, i) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href="/artists" className="group block">
                <div className="relative rounded-3xl overflow-hidden transition-all duration-500 group-hover:-translate-y-2"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {/* Image */}
                  <div className="relative h-72 overflow-hidden">
                    <Image
                      src={artist.image}
                      alt={`${artist.name} — ${artist.title}`}
                      fill
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      sizes="300px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* Available badge */}
                    <div className="absolute top-3 right-3">
                      {artist.available ? (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white"
                          style={{ background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.3)" }}>
                          <div className="badge-live" /> Available
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium text-white/60"
                          style={{ background: "rgba(255,255,255,0.1)" }}>
                          Booked
                        </span>
                      )}
                    </div>

                    {/* Tier badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: artist.tier === "Elite" ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.1)",
                          color: artist.tier === "Elite" ? "#C9A84C" : "rgba(255,255,255,0.7)",
                          border: artist.tier === "Elite" ? "1px solid rgba(201,168,76,0.3)" : "1px solid rgba(255,255,255,0.15)",
                        }}>
                        {artist.tier}
                      </span>
                    </div>

                    {/* Bottom info */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className="w-3 h-3 fill-current" style={{ color: "#C9A84C" }} />
                        ))}
                        <span className="text-white/70 text-xs ml-1">{artist.rating} ({artist.reviews})</span>
                      </div>
                    </div>
                  </div>

                  {/* Artist info */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-white text-base leading-tight">{artist.name}</h3>
                        <p className="text-white/50 text-xs mt-0.5">{artist.title}</p>
                      </div>
                      <BadgeCheck className="w-5 h-5 flex-shrink-0" style={{ color: "#C9A84C" }} />
                    </div>

                    <div className="flex items-center gap-1 text-xs text-white/40 mb-3">
                      <MapPin className="w-3 h-3" />
                      {artist.city} • {artist.experience} exp
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1.5">
                      {artist.specialties.slice(0, 2).map((spec) => (
                        <span key={spec} className="px-2 py-0.5 rounded-full text-xs text-white/50"
                          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
