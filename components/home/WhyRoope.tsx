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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustPoints.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group"
            >
              <div className="card-luxury p-7 h-full group-hover:shadow-luxury-lg">
                <div className="text-3xl mb-5">{point.icon}</div>
                <h3 className="font-display text-xl font-light text-roope-primary mb-3 leading-tight">
                  {point.title}
                </h3>
                <p className="text-sm text-stone-warm/80 leading-relaxed">{point.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
