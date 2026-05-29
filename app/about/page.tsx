"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

const timeline = [
  { year: "2021", event: "Roopé Founded", desc: "Started in Mumbai with 12 artists and a vision to make luxury beauty accessible." },
  { year: "2022", event: "1,000 Bookings", desc: "Crossed 1,000 bookings within 8 months. Expanded to Delhi and Bangalore." },
  { year: "2023", event: "500+ Artists", desc: "Onboarded 500 verified artists. Launched our proprietary training program." },
  { year: "2024", event: "12 Cities", desc: "Now operating in 12 cities with 1,200+ artists and 50,000+ happy clients." },
  { year: "2025", event: "The Gold Standard", desc: "Ranked #1 beauty platform by Forbes India. Series A funding secured." },
];

const hygieneStandards = [
  "Single-use sponge applicators for every client",
  "Sanitized brushes cleaned with hospital-grade isopropyl",
  "Products from MAC, Charlotte Tilbury, NARS, Huda Beauty only",
  "Allergy screening form completed before every appointment",
  "Artist health check required before every service",
  "Full hygienic kit sealed and verified before dispatch",
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 pb-24 px-6 overflow-hidden" style={{ background: "linear-gradient(160deg, #F8F6F2 0%, #FAF6EC 100%)" }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="section-label mb-4">Our Story</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="font-display text-5xl md:text-6xl font-light text-roope-primary leading-tight mb-6" style={{ letterSpacing: "-0.025em" }}>
              Beauty is a right,
              <span className="block italic text-gradient-gold">not a privilege.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-lg text-stone-warm font-light leading-relaxed mb-6 max-w-lg">
              Roopé was founded with a single belief: every woman in India deserves access to world-class beauty services — at transparent, honest pricing, with no compromises on quality.
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
              className="text-base text-stone-warm/80 font-light leading-relaxed max-w-lg">
              We built India&apos;s most rigorous artist verification process, partnered with the world&apos;s most trusted beauty brands, and created a platform that truly puts the client first.
            </motion.p>
          </div>
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="relative h-[400px] rounded-4xl overflow-hidden shadow-luxury-xl">
            <Image src="/images/makeup_application.png" alt="Roopé artist at work" fill className="object-cover" sizes="600px" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(26,22,18,0.3), transparent)" }} />
            <div className="absolute bottom-6 left-6">
              <span className="glass px-4 py-2 rounded-full text-sm font-medium text-roope-primary">
                Since 2021 • Mumbai, India
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6" style={{ background: "#1A1612" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-label text-champagne-DEFAULT mb-3">Our Journey</p>
            <h2 className="font-display text-4xl font-light text-white">4 years of{" "}
              <span className="italic" style={{ color: "#C9A84C" }}>raising the bar.</span>
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px" style={{ background: "rgba(201,168,76,0.2)" }} />
            <div className="space-y-10">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex gap-8 pl-16 relative"
                >
                  <div className="absolute left-0 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", color: "#C9A84C" }}>
                    {item.year.slice(2)}
                  </div>
                  <div>
                    <p className="text-xs text-white/30 mb-1">{item.year}</p>
                    <h3 className="font-semibold text-white mb-2">{item.event}</h3>
                    <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hygiene section */}
      <section id="hygiene" className="py-20 px-6" style={{ background: "linear-gradient(180deg, #FAF6EC 0%, #F8F6F2 100%)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-label mb-3">Hygiene & Safety</p>
            <h2 className="section-title mx-auto max-w-lg">
              Our standard is
              <span className="italic text-gradient-gold"> medical-grade.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {hygieneStandards.map((standard, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="flex items-start gap-4 p-5 card-luxury"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(201,168,76,0.12)" }}>
                  <Check className="w-4 h-4" style={{ color: "#C9A84C" }} />
                </div>
                <p className="text-sm text-stone-warm leading-relaxed">{standard}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6" style={{ background: "linear-gradient(135deg, #FAF6EC, #F3E8C8)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { n: "50,000+", l: "Happy Clients" },
            { n: "1,200+", l: "Verified Artists" },
            { n: "12", l: "Cities" },
            { n: "4.9★", l: "Avg Rating" },
          ].map((s) => (
            <div key={s.l}>
              <p className="stat-number">{s.n}</p>
              <p className="text-sm text-stone-warm mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center">
        <h2 className="font-display text-3xl font-light text-roope-primary mb-6 max-w-md mx-auto">
          Be part of the <span className="italic text-gradient-gold">Roopé story.</span>
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/book" className="btn-primary px-10 py-4 inline-flex items-center gap-2">
            Book a Service <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/contact#partner" className="btn-secondary px-10 py-4">Join as Artist</Link>
        </div>
      </section>
    </>
  );
}
