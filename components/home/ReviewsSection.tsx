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
    <section ref={ref} id="reviews" className="py-12 md:py-24 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8 md:mb-16"
        >
          <p className="section-label mb-3">Client Stories</p>
          <h2 className="section-title mx-auto max-w-xl">
            100+ people who
            <span className="italic text-gradient-gold"> loved their look.</span>
          </h2>
        </motion.div>

        {/* MOBILE VIEW: Square grid of looks + moving reviews */}
        <div className="lg:hidden space-y-6">
          {/* Visual Look Square Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {testimonials.map((review) => (
              <div
                key={review.id}
                className="relative aspect-square rounded-2xl overflow-hidden shadow-sm group border border-pearl-200"
              >
                <Image
                  src={review.image}
                  alt={review.name}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  sizes="180px"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white flex flex-col justify-end">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="text-[9px] text-[#C9A84C] font-extrabold">★ 5.0</span>
                    <span className="text-[8px] text-white/60 font-medium">({review.date})</span>
                  </div>
                  <p className="text-[10.5px] font-extrabold tracking-tight truncate leading-none mb-0.5">
                    {review.name}
                  </p>
                  <p className="text-[8.5px] text-[#C9A84C] truncate leading-none">
                    {review.service}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Moving Testimonials Slider */}
          <div className="w-full overflow-hidden py-2 -mx-4 px-4">
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes review-marquee-rl {
                0% { transform: translate3d(0%, 0, 0); }
                100% { transform: translate3d(-50%, 0, 0); }
              }
              .review-marquee-track {
                display: flex;
                width: max-content;
                animation: review-marquee-rl 35s linear infinite;
              }
            `}} />
            <div className="review-marquee-track gap-4">
              {[...testimonials, ...testimonials].map((review, i) => (
                <div
                  key={`${review.id}-${i}`}
                  className="w-[240px] bg-white border border-pearl-200 rounded-2xl p-4 flex flex-col justify-between flex-shrink-0 shadow-sm"
                >
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} className="w-2.5 h-2.5 fill-current text-[#C9A84C]" />
                    ))}
                  </div>
                  <p className="text-[9.5px] text-stone-warm leading-relaxed mb-3 flex-1 line-clamp-3">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-2 pt-2 border-t border-pearl-100">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={review.image}
                        alt={review.name}
                        fill
                        className="object-cover object-top"
                        sizes="24px"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold text-roope-primary truncate">{review.name}</p>
                      <p className="text-[7.5px] text-stone-warm/60 truncate">{review.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DESKTOP VIEW */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-5">
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
                    unoptimized
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
          className="mt-12 glass rounded-3xl p-6 hidden lg:flex items-center justify-center gap-8 text-center"
        >
          {[
            { value: "4.9/5.0", label: "Average Rating" },
            { value: "98%", label: "Would Recommend" },
            { value: "96%", label: "Repeat Clients" },
            { value: "100+", label: "Total Reviews" },
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
