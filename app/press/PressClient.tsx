"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Newspaper, FileText, Globe, Volume2 } from "lucide-react";

export default function PressPage() {
  const articles = [
    {
      source: "Vogue India",
      date: "May 2025",
      title: "How Roopé is raising the standard of doorstep beauty in Central India",
      desc: "An in-depth editorial looking at how Roopé bridges high-end premium makeup brands (MAC, Charlotte Tilbury) with background-verified professional artist access to create true five-star pampering inside residential spaces."
    },
    {
      source: "YourStory",
      date: "March 2025",
      title: "The tech behind Central India's premier beauty delivery app",
      desc: "Analyzing Roopé's real-time cart matching engine, GPS location gating selectors, and unified professional applications interface making beauty services highly reliable, secure, and completely on-time."
    },
    {
      source: "Indore Times",
      date: "January 2025",
      title: "Local beauty tech pioneer logs over 17,000 completed premium bookings",
      desc: "Covering the massive organic rise of Roopé in Indore, reporting 99% on-time specialist arrivals, and detailing active partnerships with local salons and verified professionals."
    },
    {
      source: "Elle Magazine",
      date: "October 2024",
      title: "Bridal trends: Why premium Indore brides are picking at-home HD Airbrush makeup",
      desc: "Spotlighting Roopé's Essential, Signature, and Luxury Bridal packages and highlighting the ease of pre-bridal consultations in private master suites."
    }
  ];

  return (
    <>
      {/* Hero Header */}
      <section className="pt-28 pb-16 px-6" style={{ background: "linear-gradient(160deg, #F8F6F2 0%, #FAF6EC 100%)" }}>
        <div className="max-w-7xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-label mb-3"
          >
            Press Room
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="section-title mx-auto max-w-2xl mb-4 font-display text-2xl md:text-5xl font-semibold md:font-light text-roope-primary"
          >
            Roopé in the <span className="italic text-gradient-gold">spotlight.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="section-subtitle max-w-lg mx-auto text-stone-warm/80 text-sm mt-3"
          >
            Explore our latest announcements, editorial columns, tech analyses, and local Indore success records.
          </motion.p>
        </div>
      </section>

      {/* Press Coverage */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {articles.map((art, i) => (
              <motion.div
                key={art.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card-luxury p-6 md:p-8 hover:border-champagne-DEFAULT transition-all"
              >
                <div className="flex items-center justify-between gap-4 mb-3 pb-3 border-b border-pearl-100">
                  <span className="text-[10px] bg-champagne-300/40 text-roope-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                    {art.source}
                  </span>
                  <span className="text-xs text-stone-warm/50 font-semibold">{art.date}</span>
                </div>
                <h3 className="font-display text-lg md:text-xl font-semibold md:font-light text-roope-primary mb-3 leading-snug group-hover:text-gold">
                  {art.title}
                </h3>
                <p className="text-xs text-stone-warm/75 leading-relaxed mb-4">
                  {art.desc}
                </p>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-xs font-bold text-[#B8922E] hover:underline inline-flex items-center gap-1 group"
                >
                  <span>Read Editorial</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kits */}
      <section className="py-20 px-6 bg-[#FAF9F6] border-t border-pearl-200">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="card-luxury p-6 bg-white flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-champagne-300/20 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h3 className="font-display text-base md:text-lg font-semibold md:font-light text-roope-primary mb-1">Brand Assets & Logos</h3>
              <p className="text-xs text-stone-warm/75 leading-relaxed mb-4">
                Download verified high-resolution Roopé logos, luxury brand standard sheets, and official color typography tokens.
              </p>
              <button onClick={(e) => e.preventDefault()} className="btn-secondary py-2.5 px-4 text-xs font-bold uppercase tracking-wider">
                Download Logo Kit
              </button>
            </div>
          </div>

          <div className="card-luxury p-6 bg-white flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-champagne-300/20 flex items-center justify-center flex-shrink-0">
              <Volume2 className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h3 className="font-display text-base md:text-lg font-semibold md:font-light text-roope-primary mb-1">Press Contact</h3>
              <p className="text-xs text-stone-warm/75 leading-relaxed mb-4">
                Are you a journalist or researcher working on doorstep beauty verticals? Reach out directly to our PR lead.
              </p>
              <Link href="/contact" className="btn-secondary py-2.5 px-4 text-xs font-bold uppercase tracking-wider inline-block text-center">
                Contact Media PR
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
