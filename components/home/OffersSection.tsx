"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";

function Countdown() {
  const [time, setTime] = useState({ h: 5, m: 47, s: 22 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-1.5 md:gap-2 font-display text-lg md:text-3xl font-light" style={{ color: "#C9A84C" }}>
      <span>{pad(time.h)}</span>
      <span className="opacity-50 animate-pulse">:</span>
      <span>{pad(time.m)}</span>
      <span className="opacity-50 animate-pulse">:</span>
      <span>{pad(time.s)}</span>
    </div>
  );
}

const offers = [
  {
    id: "bridal-fest",
    badge: "Bridal Season",
    title: "25% Off All Bridal Packages",
    desc: "Book your bridal package this week and save up to ₹15,000. Slots filling fast.",
    color: "gold",
    urgent: true,
    slots: 3,
  },
  {
    id: "first-time",
    badge: "New Client",
    title: "₹500 Off Your First Booking",
    desc: "First-time Roopé clients get ₹500 off any service. No minimum booking required.",
    color: "stone",
    urgent: false,
    slots: null,
  },
  {
    id: "group",
    badge: "Group Offer",
    title: "Group of 4+? Get 15% Off",
    desc: "Planning a bridal party, bachelorette, or event? Book 4+ services and save.",
    color: "champagne",
    urgent: false,
    slots: null,
  },
];

export default function OffersSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      id="offers"
      className="py-12 md:py-24 px-4 md:px-6 overflow-hidden bg-gradient-to-b from-ivory to-pearl"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 md:mb-14"
        >
          <p className="section-label mb-3">Limited Offers</p>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <h2 className="section-title">
              Exceptional beauty,
              <span className="italic text-gradient-gold"> exceptional value.</span>
            </h2>
            <div className="flex items-center gap-2 md:gap-3">
              <Zap className="w-3.5 h-3.5 md:w-4 md:h-4" style={{ color: "#C9A84C" }} />
              <span className="text-xs md:text-sm text-stone-warm">Offer expires in:</span>
              <Countdown />
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-5">
          {offers.map((offer, i) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={`group relative rounded-3xl p-4 md:p-7 h-full transition-all duration-500 hover:-translate-y-1 hover:shadow-luxury-lg ${
                offer.color === "gold"
                  ? "border border-champagne-200"
                  : "border border-pearl-200"
              }`}
                style={{
                  background: offer.color === "gold"
                    ? "linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.04) 100%)"
                    : "var(--glass-bg)",
                }}>
                {offer.urgent && (
                  <div className="absolute -top-3 left-6">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1"
                      style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
                      <Zap className="w-3 h-3" /> Flash Deal
                    </span>
                  </div>
                )}

                <span className="tag-gold mb-3 md:mb-4 inline-block">{offer.badge}</span>
                <h3 className="font-display text-sm font-semibold md:text-xl md:font-light text-roope-primary leading-tight mb-1.5 md:mb-3">
                  {offer.title}
                </h3>
                <p className="text-[11px] md:text-sm text-stone-warm leading-relaxed mb-4 md:mb-6">{offer.desc}</p>

                {offer.slots && (
                  <div className="flex items-center gap-2 mb-3.5 p-2 md:p-3 rounded-xl md:rounded-2xl"
                    style={{ background: "rgba(201,168,76,0.08)" }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                    <span className="text-[10px] md:text-xs font-semibold text-orange-600">
                      Only {offer.slots} slots left this week
                    </span>
                  </div>
                )}

                <Link
                  href="/book"
                  className="flex items-center gap-2 text-sm font-medium transition-all duration-200 group-hover:gap-3"
                  style={{ color: "#C9A84C" }}
                >
                  Claim Offer <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
