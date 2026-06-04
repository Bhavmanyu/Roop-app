"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function BookingCTA() {
  return (
    <section
      id="booking-cta"
      className="py-12 md:py-24 px-4 md:px-6 overflow-hidden relative"
      style={{ background: "#1A1612" }}
    >
      {/* Background subtle image */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <Image
          src="/images/hero_bridal.png"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to right, rgba(26,22,18,0.9), rgba(26,22,18,0.7), rgba(26,22,18,0.9))" }} />

      <div className="relative max-w-3xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-label text-champagne-DEFAULT mb-4"
        >
          Ready to Begin?
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-2xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-4 md:mb-6"
          style={{ letterSpacing: "-0.025em" }}
        >
          Your most beautiful moment
          <span className="block italic" style={{ color: "#C9A84C" }}>starts here.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/60 text-xs md:text-lg font-light mb-6 md:mb-10 max-w-xl mx-auto"
        >
          Book a certified Roopé artist for your bridal day, event, or next occasion.
          Transparent pricing, guaranteed results.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center"
        >
          <Link href="/book" className="btn-primary px-6 py-3 text-xs md:px-10 md:py-4 md:text-base gap-2.5">
            Book Now — It&apos;s Free to Start
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/bridal"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs md:px-10 md:py-4 md:text-base font-medium transition-all duration-300 hover:bg-white/10"
            style={{ border: "1px solid rgba(255,255,255,0.2)", color: "white" }}>
            View Bridal Packages
          </Link>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-white/30 text-xs mt-8"
        >
          No payment required to book a consultation • Cancel anytime
        </motion.p>
      </div>
    </section>
  );
}
