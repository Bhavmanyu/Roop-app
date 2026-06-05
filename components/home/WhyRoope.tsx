"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { trustPoints } from "@/lib/data";

export default function WhyRoope() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} id="why-roope" className="py-12 md:py-24 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8 md:mb-16"
        >
          <p className="section-label mb-3">Why Roopé</p>
          <h2 className="section-title mx-auto max-w-2xl">
            Beauty standards that match
            <span className="italic text-gradient-gold"> yours.</span>
          </h2>
        </motion.div>

        {/* MOBILE VIEW: Square Grid of Trust Points */}
        <div className="grid grid-cols-2 gap-3 lg:hidden">
          {trustPoints.map((point) => (
            <div
              key={point.title}
              className="bg-white border border-pearl-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center aspect-square shadow-sm"
            >
              <div className="text-xl mb-1.5">{point.icon}</div>
              <h4 className="text-[10px] font-extrabold text-roope-primary uppercase tracking-wider mb-1 line-clamp-1 leading-tight">
                {point.title}
              </h4>
              <p className="text-[8.5px] text-stone-warm/75 leading-relaxed line-clamp-3">
                {point.desc}
              </p>
            </div>
          ))}
        </div>

        {/* DESKTOP VIEW */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {trustPoints.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group"
            >
              <div className="card-luxury p-4 md:p-7 h-full group-hover:shadow-luxury-lg">
                <div className="text-2xl mb-2.5 md:text-3xl md:mb-5">{point.icon}</div>
                <h3 className="font-display text-sm font-semibold md:text-xl md:font-light text-roope-primary mb-1.5 md:mb-3 leading-tight">
                  {point.title}
                </h3>
                <p className="text-[11px] md:text-sm text-stone-warm/80 leading-relaxed">{point.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
