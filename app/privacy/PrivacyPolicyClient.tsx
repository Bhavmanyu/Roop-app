"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Lock, Eye, Database, ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: <Lock className="w-5 h-5 text-gold" />,
      title: "Data Security First",
      desc: "We employ industry-standard encryption, SSL protocols, and Row Level Security (RLS) configurations to secure your personal coordinates, billing information, and booking schedules. We do not sell your personal data under any circumstances."
    },
    {
      icon: <Eye className="w-5 h-5 text-gold" />,
      title: "Information We Collect",
      desc: "To process premium doorstep beauty requests in Indore, we collect necessary user credentials: full name, active phone number, email address, localized home address (or GPS location selected via Google maps), and billing transaction records."
    },
    {
      icon: <Database className="w-5 h-5 text-gold" />,
      title: "How We Use Data",
      desc: "Collected coordinates are synchronized securely with the Supabase OAuth database. These are used only to manage service bookings, communicate artist arrival notifications, securely handle payments, and provide direct PR support."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-gold" />,
      title: "Supabase & Stripe Integrations",
      desc: "Authentication is managed via Supabase auth, keeping passwords hashed and protected. Financial details are routed directly to Stripe or equivalent payment gateways under PCI-DSS compliance regulations, leaving zero card numbers stored in our backend."
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
            Security
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="section-title mx-auto max-w-2xl mb-4 font-display text-2xl md:text-5xl font-semibold md:font-light text-roope-primary"
          >
            Privacy & Data <span className="italic text-gradient-gold">Protection.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="section-subtitle max-w-lg mx-auto text-stone-warm/80 text-sm mt-3"
          >
            Roopé is designed to protect your coordinates and personal transactions. Read our security guidelines and privacy policies.
          </motion.p>
        </div>
      </section>

      {/* Policy Details */}
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
            <h4 className="text-xs font-bold text-roope-primary uppercase tracking-wider mb-2">GDPR & DPCO Compliance</h4>
            <p className="text-[11px] text-stone-warm/70 leading-relaxed max-w-lg mx-auto">
              Under global data regulations, Roopé clients hold the right to inspect, edit, or permanently erase their authentication records and doorstep location coordinates. To request complete data purge, reach our security desk.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Concierge */}
      <section className="py-16 px-6 text-center bg-[#FAF9F6] border-t border-pearl-200">
        <p className="section-label mb-3">Concierge</p>
        <h2 className="font-display text-xl md:text-3xl font-semibold md:font-light text-roope-primary mb-3 max-w-md mx-auto">
          Have security <span className="italic text-gradient-gold">concerns?</span>
        </h2>
        <p className="text-stone-warm text-xs max-w-xs mx-auto mb-6">
          Concierge PR handles technical inquiries, credential access, or security audits in real-time.
        </p>
        <Link href="/contact" className="btn-primary px-8 py-3 text-xs inline-flex items-center gap-2 font-semibold uppercase tracking-widest shadow-md">
          Contact Security Concierge <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>
    </>
  );
}
