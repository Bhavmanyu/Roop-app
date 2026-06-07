"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Star, ArrowRight, Sparkles, Send, X } from "lucide-react";
import { bridalPackages } from "@/lib/data";
import { formatPrice, getDiscount } from "@/lib/utils";

const bridalLooks = [
  { label: "Classic Red Bridal", image: "/images/bridal_glam_1.png" },
  { label: "Ivory Elegance", image: "/images/hero_bridal.png" },
  { label: "Soft Dewy Bride", image: "/images/gallery_natural_glam.png" },
];

const cities = ["Indore"];

const DUST_PARTICLES = [
  // Card 1 particles
  [
    { top: "15%", left: "20%", size: "3px", delay: "0s", duration: "12s" },
    { top: "45%", left: "80%", size: "1.5px", delay: "-2s", duration: "8s" },
    { top: "70%", left: "30%", size: "2.5px", delay: "-4s", duration: "15s" },
    { top: "30%", left: "60%", size: "2px", delay: "-1s", duration: "10s" },
    { top: "85%", left: "75%", size: "3px", delay: "-6s", duration: "14s" },
    { top: "60%", left: "15%", size: "1.8px", delay: "-3s", duration: "11s" },
  ],
  // Card 2 particles (Luxury card - has more particles!)
  [
    { top: "10%", left: "30%", size: "3.5px", delay: "0s", duration: "14s" },
    { top: "25%", left: "75%", size: "2px", delay: "-3s", duration: "9s" },
    { top: "40%", left: "15%", size: "3px", delay: "-1s", duration: "12s" },
    { top: "55%", left: "85%", size: "2px", delay: "-5s", duration: "11s" },
    { top: "70%", left: "45%", size: "4px", delay: "-7s", duration: "16s" },
    { top: "80%", left: "20%", size: "1.5px", delay: "-2s", duration: "8s" },
    { top: "90%", left: "65%", size: "2.5px", delay: "-4s", duration: "13s" },
    { top: "15%", left: "85%", size: "3px", delay: "-6s", duration: "15s" },
    { top: "65%", left: "5%", size: "2px", delay: "-8s", duration: "10s" },
    { top: "35%", left: "50%", size: "3.5px", delay: "-2.5s", duration: "12.5s" },
  ],
  // Card 3 particles
  [
    { top: "20%", left: "15%", size: "2px", delay: "-1s", duration: "11s" },
    { top: "35%", left: "70%", size: "3px", delay: "-4s", duration: "13s" },
    { top: "60%", left: "40%", size: "2.5px", delay: "0s", duration: "14s" },
    { top: "80%", left: "80%", size: "1.5px", delay: "-6s", duration: "9s" },
    { top: "50%", left: "85%", size: "3.5px", delay: "-3s", duration: "15s" },
    { top: "75%", left: "20%", size: "2px", delay: "-2s", duration: "10s" },
  ],
];

export default function BridalPageClient() {
  const [activeLook, setActiveLook] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState<string | null>("luxury-bride");
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquiryPackage, setInquiryPackage] = useState<{ id: string; name: string } | null>(null);
  const [form, setForm] = useState({ 
    name: "", 
    phone: "", 
    email: "", 
    wedding_date: "", 
    city: "", 
    message: "",
    budget: "",
    skinTone: "",
    requirements: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Lock body scroll when inquiry modal is open to prevent background scrolling
  useEffect(() => {
    if (showInquiry) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [showInquiry]);

  const openInquiry = (pkg: { id: string; name: string }) => {
    setInquiryPackage(pkg);
    setShowInquiry(true);
    setSubmitted(false);
    setError("");
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const fullMessage = `
[Estimated Budget]: ${form.budget || "Not Specified"}
[Skin Tone/Profile]: ${form.skinTone || "Not Specified"}
[Specific Requirements]: ${form.requirements || "Not Specified"}
[Additional Message]: ${form.message || "None"}
`.trim();

      const res = await fetch("/api/bridal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          wedding_date: form.wedding_date || null,
          city: form.city,
          message: fullMessage,
          package_id: inquiryPackage?.id,
          package_name: inquiryPackage?.name,
        }),
      });
      if (res.ok) { 
        setSubmitted(true); 
      } else {
        const json = await res.json();
        setError(json.error || "Failed to submit. Please try again.");
      }
    } catch { 
      setError("Network error. Please try again."); 
    } finally { 
      setSubmitting(false); 
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 pb-8 md:pt-36 md:pb-16 px-4 md:px-6 overflow-hidden"
        style={{ background: "linear-gradient(160deg, var(--pearl-50) 0%, var(--pearl) 40%, var(--ivory) 100%)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 60% at 70% 50%, rgba(201,168,76,0.08), transparent)" }} />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="section-label mb-2 md:mb-4">
              Bridal Collection
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="font-display text-2xl md:text-5xl lg:text-6xl font-light text-roope-primary leading-tight mb-3 md:mb-6" style={{ letterSpacing: "-0.025em" }}>
              Your bridal story,
              <span className="block italic text-gradient-gold">beautifully told.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-xs md:text-lg text-stone-warm font-light leading-relaxed mb-5 md:mb-8 max-w-md">
              From your Mehendi morning to your Reception night — Roopé&apos;s elite bridal artists craft timeless looks that last all day, every memory.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex gap-2.5 md:gap-4">
              <button
                onClick={() => openInquiry({ id: "consultation", name: "Free Bridal Consultation" })}
                className="btn-primary px-4 py-2.5 text-xs md:px-8 md:py-4 md:text-sm cursor-pointer"
              >
                Book Free Consultation
              </button>
              <Link href="#packages" className="btn-secondary px-4 py-2.5 text-xs md:px-8 md:py-4 md:text-sm">View Packages</Link>
            </motion.div>
          </div>

          {/* Gallery switcher */}
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
            className="relative">
            <div className="relative h-[280px] md:h-[480px] w-full rounded-3xl md:rounded-4xl overflow-hidden shadow-luxury-xl">
              <Image
                src={bridalLooks[activeLook].image}
                alt={bridalLooks[activeLook].label}
                fill
                className="object-cover transition-all duration-700"
                sizes="500px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                <p className="text-white text-xs md:text-sm font-medium">{bridalLooks[activeLook].label}</p>
              </div>
            </div>
            {/* Thumbnails */}
            <div className="flex gap-2 mt-3 md:gap-3 md:mt-4">
              {bridalLooks.map((look, i) => (
                <button key={i} onClick={() => setActiveLook(i)}
                  className={`relative flex-1 h-10 md:h-16 rounded-xl md:rounded-2xl overflow-hidden transition-all duration-300 ${activeLook === i ? "ring-2 ring-champagne-DEFAULT shadow-gold" : "opacity-60 hover:opacity-100"}`}>
                  <Image src={look.image} alt={look.label} fill className="object-cover" sizes="120px" />
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="py-10 px-4 md:py-20 md:px-6" style={{ background: "linear-gradient(180deg, var(--pearl) 0%, var(--ivory) 100%)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-14">
            <p className="section-label mb-2 md:mb-3">Bridal Packages</p>
            <h2 className="section-title mx-auto max-w-lg">
              Choose your <span className="italic text-gradient-gold">perfect package.</span>
            </h2>
          </div>

          <div className="flex overflow-x-auto gap-4 pt-6 pb-4 snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:gap-6 lg:pt-8 lg:pb-0 lg:overflow-visible scrollbar-none -mx-4 px-4">
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
                  onMouseMove={handleMouseMove}
                  className={`relative rounded-2xl md:rounded-4xl p-4.5 md:p-8 cursor-pointer transition-all duration-400 flex-shrink-0 w-[85%] snap-center lg:w-auto lg:flex-shrink group ${
                    isSelected ? "shadow-luxury-xl md:-translate-y-2" : "shadow-luxury md:hover:-translate-y-1"
                  }`}
                  style={{
                    background: pkg.color === "gold"
                      ? "linear-gradient(145deg, #1A1612 0%, #3D352D 100%)"
                      : "linear-gradient(145deg, var(--pearl-50) 0%, var(--pearl-200) 100%)",
                    border: isSelected
                      ? "2px solid #C9A84C"
                      : pkg.color === "gold"
                      ? "2px solid rgba(201,168,76,0.3)"
                      : "1px solid var(--glass-border)",
                  }}
                >
                  {/* Premium Ambient Cursor Glow Overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[inherit]"
                    style={{
                      background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${
                        pkg.color === "gold"
                          ? "rgba(201, 168, 76, 0.18)"
                          : "rgba(201, 168, 76, 0.08)"
                      }, transparent 80%)`,
                    }}
                  />

                  {/* Floating Gold Dust Particles */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 rounded-[inherit]">
                    {(DUST_PARTICLES[i] || []).map((p, idx) => (
                      <div
                        key={idx}
                        className="absolute bg-[#C9A84C] rounded-full animate-gold-dust"
                        style={{
                          top: p.top,
                          left: p.left,
                          width: p.size,
                          height: p.size,
                          animationDelay: p.delay,
                          filter: "blur(0.5px)",
                          "--dust-duration": p.duration,
                        } as React.CSSProperties}
                      />
                    ))}
                  </div>
                  {pkg.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[11.5px] md:text-xs font-semibold text-white flex items-center gap-1 md:gap-1.5"
                        style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
                        <Sparkles className="w-3 h-3" /> {pkg.badge}
                      </span>
                    </div>
                  )}

                  <div className="mb-4 md:mb-6">
                    <h3 className={`font-display text-base font-semibold md:text-2xl md:font-light mt-1 ${pkg.color === "gold" ? "text-white" : "text-roope-primary"}`}>
                      {pkg.name}
                    </h3>
                    <p className={`text-xs md:text-sm mt-1 ${pkg.color === "gold" ? "text-white/50" : "text-stone-warm"}`}>
                      {pkg.tagline}
                    </p>
                  </div>

                  <div className="mb-4 md:mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className={`font-display text-base font-semibold md:text-2xl md:font-light ${pkg.color === "gold" ? "text-white" : "text-roope-primary"}`}>
                        Free Consultation
                      </span>
                    </div>
                    <p className={`text-[11.5px] md:text-xs mt-1 ${pkg.color === "gold" ? "text-white/40" : "text-stone-warm/60"}`}>
                      Custom pricing based on requirements • {pkg.highlights}
                    </p>
                  </div>

                  <ul className="space-y-1.5 md:space-y-2.5 mb-6 md:mb-8">
                    {pkg.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 md:gap-2.5">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: "rgba(201,168,76,0.15)" }}>
                          <Check className="w-2.5 h-2.5" style={{ color: "#C9A84C" }} />
                        </div>
                        <span className={`text-xs md:text-sm ${pkg.color === "gold" ? "text-white/70" : "text-stone-warm"}`}>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={(e) => { e.stopPropagation(); openInquiry({ id: pkg.id, name: pkg.name }); }}
                    className={`w-full flex items-center justify-center gap-1.5 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl text-xs md:text-sm font-medium transition-all duration-300 ${
                      pkg.color === "gold" ? "btn-primary" : "btn-secondary"
                    }`}
                  >
                    Book Free Consultation <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Comparison note */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 md:mt-10 glass rounded-2xl md:rounded-3xl p-4 md:p-6 text-center"
          >
            <p className="text-xs md:text-sm text-stone-warm">
              All packages include a free pre-bridal consultation, hygiene-certified tools, and premium international products only.{" "}
              <Link href="/contact" className="underline" style={{ color: "#C9A84C" }}>Talk to a specialist</Link> for custom packages.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trust row */}
      <section className="py-10 px-4 md:py-16 md:px-6" style={{ background: "#1A1612" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-center">
            {[
              { icon: "💍", title: "1,200+ Brides", desc: "Served with love and expertise" },
              { icon: "⭐", title: "4.9/5.0 Rating", desc: "From verified bridal clients" },
              { icon: "🛡️", title: "Elite Artists Only", desc: "Handpicked bridal specialists" },
              { icon: "📸", title: "Camera-Ready", desc: "HD & airbrush certified techniques" },
            ].map((item) => (
              <div key={item.title} className="p-4 md:p-6 rounded-2xl md:rounded-3xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="text-xl md:text-3xl mb-2 md:mb-3">{item.icon}</div>
                <p className="text-xs md:text-sm font-medium text-white mb-0.5 md:mb-1">{item.title}</p>
                <p className="text-[11.5px] md:text-xs text-white/40">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      <AnimatePresence>
        {showInquiry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(26,22,18,0.8)", backdropFilter: "blur(8px)" }}
            onClick={() => setShowInquiry(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg rounded-2xl md:rounded-4xl p-4 md:p-8 max-h-[90vh] overflow-y-auto overscroll-contain"
              style={{ background: "var(--ivory)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div>
                  <p className="section-label mb-1">Bridal Inquiry</p>
                  <h2 className="font-display text-base md:text-2xl font-semibold md:font-light text-roope-primary">{inquiryPackage?.name}</h2>
                </div>
                <button onClick={() => setShowInquiry(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-100 transition-colors">
                  <X className="w-4 h-4 text-stone-warm" />
                </button>
              </div>

              {submitted ? (
                <div className="text-center py-6 md:py-8">
                  <div className="text-4xl md:text-5xl mb-3 md:mb-4">💍</div>
                  <h3 className="font-display text-lg md:text-2xl font-semibold md:font-light text-roope-primary mb-2">Inquiry Received!</h3>
                  <p className="text-stone-warm text-xs md:text-sm">We&apos;ll reach out to you within 2 hours to discuss your dream bridal look.</p>
                  <button onClick={() => setShowInquiry(false)} className="btn-primary px-6 py-2.5 md:px-8 md:py-3 mt-4 md:mt-6 text-xs md:text-sm">Close</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                  {[
                    { key: "name", label: "Full Name", type: "text", placeholder: "Your name" },
                    { key: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98765 43210" },
                    { key: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
                  ].map(({ key, label, type, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs md:text-sm font-medium text-stone-warm mb-1 md:mb-2">{label} *</label>
                      <input type={type} required placeholder={placeholder}
                        value={form[key as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        className="w-full px-3 py-2.5 md:px-4 md:py-3.5 rounded-xl md:rounded-2xl text-xs md:text-sm outline-none"
                        style={{ background: "var(--pearl-50)", border: "1px solid rgba(107,94,82,0.15)", color: "var(--roope-primary)" }}
                      />
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-stone-warm mb-1 md:mb-2">Wedding Date</label>
                      <input type="date" value={form.wedding_date}
                        onChange={(e) => setForm({ ...form, wedding_date: e.target.value })}
                        className="w-full px-3 py-2.5 md:px-4 md:py-3.5 rounded-xl md:rounded-2xl text-xs md:text-sm outline-none"
                        style={{ background: "var(--pearl-50)", border: "1px solid rgba(107,94,82,0.15)", color: "var(--roope-primary)" }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-stone-warm mb-1 md:mb-2">City *</label>
                      <select required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className="w-full px-3 py-2.5 md:px-4 md:py-3.5 rounded-xl md:rounded-2xl text-xs md:text-sm outline-none appearance-none"
                        style={{ background: "var(--pearl-50)", border: "1px solid rgba(107,94,82,0.15)", color: form.city ? "var(--roope-primary)" : "#8B7D6B" }}
                      >
                        <option value="">Select city</option>
                        {cities.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-stone-warm mb-1 md:mb-2">Estimated Budget *</label>
                    <select required value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      className="w-full px-3 py-2.5 md:px-4 md:py-3.5 rounded-xl md:rounded-2xl text-xs md:text-sm outline-none appearance-none"
                      style={{ background: "var(--pearl-50)", border: "1px solid rgba(107,94,82,0.15)", color: form.budget ? "var(--roope-primary)" : "#8B7D6B" }}
                    >
                      <option value="">Select budget range</option>
                      <option value="under-25k">Intimate / Under ₹25k</option>
                      <option value="25k-50k">Classic / ₹25k - ₹50k</option>
                      <option value="above-50k">Premium Luxury / Above ₹50k</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-stone-warm mb-1 md:mb-2">Skin Tone / Profile (optional)</label>
                    <input type="text" placeholder="e.g. Fair, warm undertones, combination skin"
                      value={form.skinTone}
                      onChange={(e) => setForm({ ...form, skinTone: e.target.value })}
                      className="w-full px-3 py-2.5 md:px-4 md:py-3.5 rounded-xl md:rounded-2xl text-xs md:text-sm outline-none"
                      style={{ background: "var(--pearl-50)", border: "1px solid rgba(107,94,82,0.15)", color: "var(--roope-primary)" }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-stone-warm mb-1 md:mb-2">Specific Requirements (optional)</label>
                    <textarea rows={2} placeholder="e.g. Draping style, number of family members, specific crew size..."
                      value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                      className="w-full px-3 py-2.5 md:px-4 md:py-3.5 rounded-xl md:rounded-2xl text-xs md:text-sm outline-none resize-none"
                      style={{ background: "var(--pearl-50)", border: "1px solid rgba(107,94,82,0.15)", color: "var(--roope-primary)" }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-stone-warm mb-1 md:mb-2">Additional Message (optional)</label>
                    <textarea rows={2} placeholder="Tell us about your dream bridal look..."
                      value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-3 py-2.5 md:px-4 md:py-3.5 rounded-xl md:rounded-2xl text-xs md:text-sm outline-none resize-none"
                      style={{ background: "var(--pearl-50)", border: "1px solid rgba(107,94,82,0.15)", color: "var(--roope-primary)" }}
                    />
                  </div>
                  {error && <p className="text-red-500 text-xs">{error}</p>}
                  <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-2.5 md:py-4 gap-1.5 md:gap-2 text-xs md:text-sm disabled:opacity-60">
                    {submitting ? "Submitting..." : "Send Inquiry"} <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
