"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { stats } from "@/lib/data";

function AnimatedNumber({ value, inView }: { value: string; inView: boolean }) {
  const [display, setDisplay] = useState("0");
  const numericPart = value.replace(/[^0-9.]/g, "");
  const suffix = value.replace(/[0-9.]/g, "");

  useEffect(() => {
    if (!inView || !numericPart) {
      setDisplay(value);
      return;
    }
    const target = parseFloat(numericPart);
    const duration = 1800;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      setDisplay(current + suffix);
      if (progress >= 1) {
        setDisplay(value);
        clearInterval(timer);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, numericPart, suffix, value]);

  return <span>{display}</span>;
}

export default function TrustSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="trust"
      className="py-20 px-6 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #FAF6EC 0%, #F3E8C8 100%)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <div className="stat-number mb-1">
                <AnimatedNumber value={stat.number} inView={inView} />
              </div>
              <p className="text-sm font-semibold text-roope-primary mb-1">{stat.label}</p>
              <p className="text-xs text-stone-warm">{stat.sublabel}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
