"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShieldAlert, Calendar, RefreshCw, HelpCircle } from "lucide-react";

export default function CancellationPolicyPage() {
  const sections = [
    {
      icon: <Calendar className="w-5 h-5 text-gold" />,
      title: "Free Cancellation (4+ Hours Notice)",
      desc: "Any doorstep service booking can be cancelled or rescheduled free of charge up to 4 hours before the scheduled time slot. A full refund will be processed to your original payment method immediately."
    },
    {
      icon: <ShieldAlert className="w-5 h-5 text-gold" />,
      title: "Late Cancellation Charge (Less than 4 Hours)",
      desc: "If you cancel or reschedule a service with less than 4 hours notice before the appointment, a late cancellation charge of 50% of the service total will be applied. This covers our background-verified professional's reserved slot and travel coordination."
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-gold" />,
      title: "No-Show & Specialist Arrival Policies",
      desc: "If our specialist arrives at your designated address in Indore and is unable to reach you or access the premises after 15 minutes of scheduled arrival, the booking will be treated as a no-show. A 100% cancellation charge will apply."
    },
    {
      icon: <HelpCircle className="w-5 h-5 text-gold" />,
      title: "Rescheduling Terms",
      desc: "Rescheduling is treated the same as cancellation. You can reschedule slots free of charge up to 4 hours in advance. Subject to verified artist availability across Indore regions."
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
            Cancellation & <span className="italic text-gradient-gold">Rescheduling.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="section-subtitle max-w-lg mx-auto text-stone-warm/80 text-sm mt-3"
          >
            Roopé guarantees transparent terms. Please read our cancellation timelines and rescheduling rules to ensure a smooth luxury booking flow.
          </motion.p>
        </div>
      </section>

      {/* Main Content Sections */}
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
            <h4 className="text-xs font-bold text-roope-primary uppercase tracking-wider mb-2">Roopé Punctuality Guarantee</h4>
            <p className="text-[11px] text-stone-warm/70 leading-relaxed max-w-lg mx-auto">
              If our verified artist is more than 15 minutes late to your appointment slot, your scheduled service is **completely free**, or a ₹200 wallet credit is instantly applied. Punctuality is our core promise.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Link */}
      <section className="py-16 px-6 text-center bg-[#FAF9F6] border-t border-pearl-200">
        <p className="section-label mb-3">Questions?</p>
        <h2 className="font-display text-xl md:text-3xl font-semibold md:font-light text-roope-primary mb-3 max-w-md mx-auto">
          Need immediate <span className="italic text-gradient-gold">assistance?</span>
        </h2>
        <p className="text-stone-warm text-xs max-w-xs mx-auto mb-6">
          Reach out to our customer concierge team for prompt resolution of booking cancellations or changes.
        </p>
        <Link href="/contact" className="btn-primary px-8 py-3 text-xs inline-flex items-center gap-2 font-semibold uppercase tracking-widest shadow-md">
          Contact Concierge <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>
    </>
  );
}
