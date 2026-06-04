"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, HelpCircle, Eye, Info, Database } from "lucide-react";

export default function CookiePolicyPage() {
  const sections = [
    {
      icon: <Info className="w-5 h-5 text-gold" />,
      title: "What are Cookies?",
      desc: "Cookies are small data files deposited on your browser to capture essential state identifiers. Roopé uses both dynamic cookies and modern local storage mechanisms to memorize selected Indore locations, active booking carts, and security sessions."
    },
    {
      icon: <Database className="w-5 h-5 text-gold" />,
      title: "Essential Cookies We Use",
      desc: "These secure core operational features. We store your doorstep location in 'roope-location' and your active multi-service catalog selections in 'roope-cart' within localStorage. Authentication session tokens are persisted under Supabase rules. Disabling these interrupts checkout."
    },
    {
      icon: <Eye className="w-5 h-5 text-gold" />,
      title: "Analytical & Performance Cookies",
      desc: "These compile anonymous telemetry regarding how you navigate our categories (Portal vs Catalog) and split panels. They help us discover slow sections and optimize the largest contentful paint (LCP)."
    },
    {
      icon: <HelpCircle className="w-5 h-5 text-gold" />,
      title: "Managing Your Choices",
      desc: "Our gold-bordered Cookie Settings banner allows you to approve or decline analytical tracking. You can clean localStorage items at any time through your browser's dev tools or settings tab."
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
            Policy
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="section-title mx-auto max-w-2xl mb-4 font-display text-2xl md:text-5xl font-semibold md:font-light text-roope-primary"
          >
            Cookie Settings & <span className="italic text-gradient-gold">Preferences.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="section-subtitle max-w-lg mx-auto text-stone-warm/80 text-sm mt-3"
          >
            Find details regarding how Roopé leverages cookies, local storage sessions, and data tokens to enhance your booking flow.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
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
            <h4 className="text-xs font-bold text-roope-primary uppercase tracking-wider mb-2">LocalStorage Keys Reference</h4>
            <p className="text-[11px] text-stone-warm/70 leading-relaxed max-w-lg mx-auto">
              We securely persist: <code className="text-[#B8922E] font-mono">&#x27;roope-cart&#x27;</code> (multi-service items), <code className="text-[#B8922E] font-mono">&#x27;roope-location&#x27;</code> (designated home address), and <code className="text-[#B8922E] font-mono">&#x27;roope-cookies-accepted&#x27;</code> (your settings banner preferences).
            </p>
          </div>
        </div>
      </section>

      {/* Concierge support */}
      <section className="py-16 px-6 text-center bg-[#FAF9F6] border-t border-pearl-200">
        <p className="section-label mb-3">concierge support</p>
        <h2 className="font-display text-xl md:text-3xl font-semibold md:font-light text-roope-primary mb-3 max-w-md mx-auto">
          Need immediate <span className="italic text-gradient-gold">assistance?</span>
        </h2>
        <p className="text-stone-warm text-xs max-w-xs mx-auto mb-6">
          Concierge support is available to clarify technical caching issues or security data policies.
        </p>
        <Link href="/contact" className="btn-primary px-8 py-3 text-xs inline-flex items-center gap-2 font-semibold uppercase tracking-widest shadow-md">
          Contact Concierge <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>
    </>
  );
}
