"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, BadgeCheck, Quote, ArrowRight } from "lucide-react";
import { testimonials } from "@/lib/data";

export default function ReviewsPage() {
  return (
    <>
      <section className="pt-28 pb-16 px-6" style={{ background: "linear-gradient(160deg, #F8F6F2 0%, #FAF6EC 100%)" }}>
        <div className="max-w-7xl mx-auto text-center">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="section-label mb-3">Reviews</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="section-title mx-auto max-w-lg mb-4">
            50,000+ women who <span className="italic text-gradient-gold">trusted Roopé.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="section-subtitle max-w-md mx-auto">
            Real bookings. Real people. Real transformations.
          </motion.p>
        </div>
      </section>

      {/* Stats row */}
      <section className="py-12 px-6" style={{ background: "linear-gradient(135deg, #FAF6EC, #F3E8C8)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { value: "4.9/5.0", label: "Average Rating", sub: "From 50,000+ reviews" },
            { value: "98%", label: "Would Recommend", sub: "To friends & family" },
            { value: "96%", label: "Repeat Clients", sub: "Book again within 6 months" },
            { value: "99%", label: "On-time Arrival", sub: "Across all bookings" },
          ].map((s) => (
            <motion.div key={s.label} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} viewport={{ once: true }}>
              <p className="stat-number text-roope-primary">{s.value}</p>
              <p className="font-semibold text-sm text-roope-primary mt-1">{s.label}</p>
              <p className="text-xs text-stone-warm mt-0.5">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Reviews masonry */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {[...testimonials, ...testimonials].map((review, i) => (
              <motion.div
                key={`${review.id}-${i}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.3) }}
                className="break-inside-avoid card-luxury p-6 mb-5"
              >
                <Quote className="w-5 h-5 mb-3 opacity-25" style={{ color: "#C9A84C" }} />
                <div className="flex gap-0.5 mb-3">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-current" style={{ color: "#C9A84C" }} />
                  ))}
                </div>
                <p className="text-sm text-stone-warm leading-relaxed mb-5">&ldquo;{review.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                    <Image src={review.image} alt={review.name} fill className="object-cover object-top" sizes="36px" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-semibold text-roope-primary">{review.name}</p>
                      {review.verified && <BadgeCheck className="w-3.5 h-3.5" style={{ color: "#C9A84C" }} />}
                    </div>
                    <p className="text-xs text-stone-warm">{review.service} • {review.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 text-center" style={{ background: "linear-gradient(135deg, #FAF6EC, #F8F6F2)" }}>
        <p className="section-label mb-3">Your Turn</p>
        <h2 className="font-display text-3xl font-light text-roope-primary mb-6 max-w-md mx-auto">
          Ready to write your own <span className="italic text-gradient-gold">story?</span>
        </h2>
        <Link href="/book" className="btn-primary px-10 py-4 inline-flex items-center gap-2">
          Book Now <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </>
  );
}
