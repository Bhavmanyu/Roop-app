"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Star, ArrowRight, Sparkles } from "lucide-react";
import { bridalPackages } from "@/lib/data";
import { formatPrice, getDiscount } from "@/lib/utils";

const bridalLooks = [
  { label: "Classic Red Bridal", image: "/images/bridal_glam_1.png" },
  { label: "Ivory Elegance", image: "/images/hero_bridal.png" },
  { label: "Soft Dewy Bride", image: "/images/gallery_natural_glam.png" },
];

export default function BridalPageClient() {
  const [activeLook, setActiveLook] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState<string | null>("luxury-bride");

  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 pb-20 px-6 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #FEFEFE 0%, #F8F6F2 40%, #FAF6EC 100%)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 60% at 70% 50%, rgba(201,168,76,0.08), transparent)" }} />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="section-label mb-4">
              Bridal Collection
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="font-display text-5xl md:text-6xl font-light text-roope-primary leading-tight mb-6" style={{ letterSpacing: "-0.025em" }}>
              Your bridal story,
              <span className="block italic text-gradient-gold">beautifully told.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-lg text-stone-warm font-light leading-relaxed mb-8 max-w-md">
              From your Mehendi morning to your Reception night — Roopé&apos;s elite bridal artists craft timeless looks that last all day, every memory.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex gap-4">
              <Link href="/book" className="btn-primary px-8 py-4">Book Consultation</Link>
              <Link href="#packages" className="btn-secondary px-8 py-4">View Packages</Link>
            </motion.div>
          </div>

          {/* Gallery switcher */}
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
            className="relative">
            <div className="relative h-[480px] w-full rounded-4xl overflow-hidden shadow-luxury-xl">
              <Image
                src={bridalLooks[activeLook].image}
                alt={bridalLooks[activeLook].label}
                fill
                className="object-cover transition-all duration-700"
                sizes="500px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-white text-sm font-medium">{bridalLooks[activeLook].label}</p>
              </div>
            </div>
            {/* Thumbnails */}
            <div className="flex gap-3 mt-4">
              {bridalLooks.map((look, i) => (
                <button key={i} onClick={() => setActiveLook(i)}
                  className={`relative flex-1 h-16 rounded-2xl overflow-hidden transition-all duration-300 ${activeLook === i ? "ring-2 ring-champagne-DEFAULT shadow-gold" : "opacity-60 hover:opacity-100"}`}>
                  <Image src={look.image} alt={look.label} fill className="object-cover" sizes="120px" />
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="py-20 px-6" style={{ background: "linear-gradient(180deg, #F8F6F2 0%, #FAF6EC 100%)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-label mb-3">Bridal Packages</p>
            <h2 className="section-title mx-auto max-w-lg">
              Choose your <span className="italic text-gradient-gold">perfect package.</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {bridalPackages.map((pkg, i) => {
              const isSelected = selectedPackage === pkg.id;
              const discount = getDiscount(pkg.originalPrice, pkg.price);
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`relative rounded-4xl p-8 cursor-pointer transition-all duration-400 ${
                    isSelected ? "shadow-luxury-xl -translate-y-2" : "shadow-luxury hover:-translate-y-1"
                  }`}
                  style={{
                    background: pkg.color === "gold"
                      ? "linear-gradient(145deg, #1A1612 0%, #3D352D 100%)"
                      : "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,246,242,0.9) 100%)",
                    border: isSelected
                      ? "2px solid #C9A84C"
                      : pkg.color === "gold"
                      ? "2px solid rgba(201,168,76,0.3)"
                      : "1px solid rgba(255,255,255,0.8)",
                  }}
                >
                  {pkg.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1.5 rounded-full text-xs font-semibold text-white flex items-center gap-1.5"
                        style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
                        <Sparkles className="w-3 h-3" /> {pkg.badge}
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <span className={`text-xs font-medium tracking-wide uppercase ${pkg.color === "gold" ? "text-champagne-DEFAULT" : "text-stone-warm"}`}>
                      {pkg.tier}
                    </span>
                    <h3 className={`font-display text-2xl font-light mt-1 ${pkg.color === "gold" ? "text-white" : "text-roope-primary"}`}>
                      {pkg.name}
                    </h3>
                    <p className={`text-sm mt-1 ${pkg.color === "gold" ? "text-white/50" : "text-stone-warm"}`}>
                      {pkg.tagline}
                    </p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className={`font-display text-3xl font-light ${pkg.color === "gold" ? "text-white" : "text-roope-primary"}`}>
                        {formatPrice(pkg.price)}
                      </span>
                      <span className={`text-sm line-through ${pkg.color === "gold" ? "text-white/30" : "text-stone-warm/40"}`}>
                        {formatPrice(pkg.originalPrice)}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                        style={{ background: "#C9A84C" }}>
                        -{discount}%
                      </span>
                    </div>
                    <p className={`text-xs mt-1 ${pkg.color === "gold" ? "text-white/40" : "text-stone-warm/60"}`}>
                      {pkg.highlights} • Best for {pkg.idealFor}
                    </p>
                  </div>

                  <ul className="space-y-2.5 mb-8">
                    {pkg.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: "rgba(201,168,76,0.15)" }}>
                          <Check className="w-2.5 h-2.5" style={{ color: "#C9A84C" }} />
                        </div>
                        <span className={`text-sm ${pkg.color === "gold" ? "text-white/70" : "text-stone-warm"}`}>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/book" className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 ${
                    pkg.color === "gold" ? "btn-primary" : "btn-secondary"
                  }`}>
                    Select Package <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Comparison note */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 glass rounded-3xl p-6 text-center"
          >
            <p className="text-sm text-stone-warm">
              All packages include a free pre-bridal consultation, hygiene-certified tools, and premium international products only.{" "}
              <Link href="/contact" className="underline" style={{ color: "#C9A84C" }}>Talk to a specialist</Link> for custom packages.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trust row */}
      <section className="py-16 px-6" style={{ background: "#1A1612" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { icon: "💍", title: "1,200+ Brides", desc: "Served with love and expertise" },
              { icon: "⭐", title: "4.9/5.0 Rating", desc: "From verified bridal clients" },
              { icon: "🛡️", title: "Elite Artists Only", desc: "Handpicked bridal specialists" },
              { icon: "📸", title: "Camera-Ready", desc: "HD & airbrush certified techniques" },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-3xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="text-3xl mb-3">{item.icon}</div>
                <p className="font-medium text-white mb-1">{item.title}</p>
                <p className="text-xs text-white/40">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
