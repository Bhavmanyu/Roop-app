"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Star, BadgeCheck, Quote } from "lucide-react";
import { testimonials } from "@/lib/data";

export default function ReviewsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} id="reviews" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <p className="section-label mb-3">Client Stories</p>
          <h2 className="section-title mx-auto max-w-xl">
            50,000+ women who
            <span className="italic text-gradient-gold"> loved their look.</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`card-luxury p-6 flex flex-col ${i === 1 ? "lg:translate-y-6" : ""} ${i === 2 ? "lg:-translate-y-4" : ""}`}
            >
              {/* Quote icon */}
              <Quote className="w-6 h-6 mb-4 opacity-30" style={{ color: "#C9A84C" }} />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-current" style={{ color: "#C9A84C" }} />
                ))}
              </div>

              {/* Review text */}
              <p className="text-sm text-stone-warm leading-relaxed mb-6 flex-1 line-clamp-5">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Client info */}
              <div className="flex items-center gap-3 pt-4 border-t border-pearl-200">
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={review.image}
                    alt={review.name}
                    fill
                    className="object-cover object-top"
                    sizes="40px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-semibold text-roope-primary truncate">{review.name}</p>
                    {review.verified && (
                      <BadgeCheck className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#C9A84C" }} />
                    )}
                  </div>
                  <p className="text-xs text-stone-warm">{review.location} • {review.date}</p>
                </div>
              </div>

              <p className="text-xs text-stone-warm/60 mt-2">{review.service}</p>
            </motion.div>
          ))}
        </div>

        {/* Trust metrics bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 glass rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-center gap-8 text-center"
        >
          {[
            { value: "4.9/5.0", label: "Average Rating" },
            { value: "98%", label: "Would Recommend" },
            { value: "96%", label: "Repeat Clients" },
            { value: "50,000+", label: "Total Reviews" },
          ].map((metric) => (
            <div key={metric.label}>
              <p className="font-display text-2xl font-light text-roope-primary">{metric.value}</p>
              <p className="text-xs text-stone-warm mt-1">{metric.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
