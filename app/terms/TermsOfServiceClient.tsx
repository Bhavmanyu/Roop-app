"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, AlertCircle, Sparkles, Scale } from "lucide-react";

export default function TermsOfServicePage() {
  const sections = [
    {
      icon: <BookOpen className="w-5 h-5 text-gold" />,
      title: "Scope of Doorstep Services",
      desc: "Roopé acts as a technology platform connecting customers with background-verified beauty professionals in Indore. The platform coordinates verified time slots, secure billing, and kit sanitization standards to guarantee luxurious quality."
    },
    {
      icon: <AlertCircle className="w-5 h-5 text-gold" />,
      title: "Right of Refusal & Safety Standards",
      desc: "Our verified specialists reserve the absolute right to refuse service inside premises that violate our basic hygiene guidelines, present safety risks, or represent an unsuitable environment. Mutual safety and absolute respect remain paramount."
    },
    {
      icon: <Sparkles className="w-5 h-5 text-gold" />,
      title: "Product Quality Guarantee",
      desc: "We guarantee that only premium, certified international cosmetics (MAC, Charlotte Tilbury, KIKO, O3+, etc.) are used for your services. Roopé professionals are prohibited from introducing lower-tier alternatives."
    },
    {
      icon: <Scale className="w-5 h-5 text-gold" />,
      title: "Limitation of Liability",
      desc: "While Roopé verifies portfolio credentials, conducts in-person skill assessments, and ensures background verification checks, services are performed by independent partners. Roopé is not liable for direct skin allergies, product reactions, or damage inside premises."
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
            Agreement
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="section-title mx-auto max-w-2xl mb-4 font-display text-2xl md:text-5xl font-semibold md:font-light text-roope-primary"
          >
            Terms of <span className="italic text-gradient-gold">Service.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="section-subtitle max-w-lg mx-auto text-stone-warm/80 text-sm mt-3"
          >
            By booking doorstep sessions or utilizing Roopé applications, you fully agree to our localized service terms and Indore operations agreements.
          </motion.p>
        </div>
      </section>

      {/* Terms list */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            {sections.map((sec, i) => (
              <motion.div
                key={sec.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex gap-4 items-start"
              >
                <div className="w-10 h-10 rounded-xl bg-champagne-300/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {sec.icon}
                </div>
                <div>
                  <h3 className="font-display text-base md:text-lg font-semibold md:font-light text-roope-primary mb-1.5">{sec.title}</h3>
                  <p className="text-xs text-stone-warm/75 leading-relaxed">
                    {sec.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-3xl bg-pearl-100/50 border border-pearl-200 text-center">
            <h4 className="text-xs font-bold text-roope-primary uppercase tracking-wider mb-2">Governing Jurisdiction</h4>
            <p className="text-[11px] text-stone-warm/70 leading-relaxed max-w-lg mx-auto">
              These terms of service and doorstep operations are governed under the laws of Madhya Pradesh, India, and coordinates fall under courts of Indore.
            </p>
          </div>
        </div>
      </section>

      {/* Support conciliator */}
      <section className="py-16 px-6 text-center bg-[#FAF9F6] border-t border-pearl-200">
        <p className="section-label mb-3">Concierge Support</p>
        <h2 className="font-display text-xl md:text-3xl font-semibold md:font-light text-roope-primary mb-3 max-w-md mx-auto">
          Have query on <span className="italic text-gradient-gold">terms?</span>
        </h2>
        <p className="text-stone-warm text-xs max-w-xs mx-auto mb-6">
          concierge support is ready to guide you regarding local service contracts and coordination rules.
        </p>
        <Link href="/contact" className="btn-primary px-8 py-3 text-xs inline-flex items-center gap-2 font-semibold uppercase tracking-widest shadow-md">
          Contact Support <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>
    </>
  );
}
