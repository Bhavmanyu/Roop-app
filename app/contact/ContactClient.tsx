"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, Mail, Phone, ChevronDown, Send } from "lucide-react";

const faqs = [
  { q: "How does Roopé work?", a: "Browse our services, select your preferred artist tier and package, pick a date and time, and we'll send a verified artist to your location. It's that simple." },
  { q: "Are all artists background-verified?", a: "Yes. Every Roopé artist undergoes a 3-step verification process including government ID verification, portfolio review, and an in-person assessment by our quality team." },
  { q: "What products do your artists use?", a: "Only premium international brands: MAC, Charlotte Tilbury, NARS, Huda Beauty, KIKO Milano, and L'Oréal Pro. We never use low-quality or expired products." },
  { q: "What if I'm not satisfied with the service?", a: "We have a 100% satisfaction guarantee. If you're unhappy for any reason, we'll either send a replacement artist or issue a full refund — no questions asked." },
  { q: "How far in advance should I book bridal makeup?", a: "We recommend booking at least 4-8 weeks in advance for bridal services, especially during peak wedding seasons (Oct-Feb and May-June). Consultations are available immediately." },
  { q: "Is there a cancellation policy?", a: "Free cancellation up to 24 hours before your appointment. Cancellations within 24 hours may incur a 25% convenience fee. Emergency situations are handled case-by-case." },
  { q: "Do you offer makeup for men?", a: "Yes! We offer grooming, beard styling, and camera-ready makeup for grooms, groomsmen, and corporate photoshoots for men." },
  { q: "Can I request a specific artist?", a: "Absolutely. When booking, you can browse artist profiles and select your preferred artist directly. Availability is shown in real-time." },
];

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const phone = process.env.NEXT_PUBLIC_BUSINESS_PHONE || "+91 98765 43210";
  const whatsapp = process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP || "919876543210";
  const email = process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "hello@roope.beauty";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSent(true);
      } else {
        const json = await res.json();
        setError(json.error || "Failed to send message. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="pt-28 pb-16 px-6" style={{ background: "linear-gradient(160deg, #F8F6F2 0%, #FAF6EC 100%)" }}>
        <div className="max-w-7xl mx-auto">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="section-label mb-3">Support</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="section-title mb-4 max-w-xl">
            We&apos;re here to
            <span className="italic text-gradient-gold"> help.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="section-subtitle max-w-md">
            Questions about your booking, artist selection, or anything else — our team responds within 30 minutes.
          </motion.p>
        </div>
      </section>

      {/* Quick contact cards */}
      <section className="py-6 md:py-10 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-2 md:gap-5">
          {[
            {
              icon: MessageCircle,
              title: "WhatsApp",
              desc: "Chat with us instantly",
              action: "Chat",
              href: `https://wa.me/${whatsapp}`,
              accent: true,
            },
            {
              icon: Phone,
              title: "Call Us",
              desc: phone,
              action: "Call",
              href: `tel:${phone.replace(/\s/g, "")}`,
              accent: false,
            },
            {
              icon: Mail,
              title: "Email",
              desc: email,
              action: "Email",
              href: `mailto:${email}`,
              accent: false,
            },
          ].map(({ icon: Icon, title, desc, action, href, accent }) => (
            <a
              key={title}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group card-luxury p-3 md:p-7 flex flex-col gap-2 md:gap-4 hover:shadow-luxury-xl text-center items-center justify-center"
            >
              <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110`}
                style={{ background: accent ? "linear-gradient(135deg, #C9A84C, #B8922E)" : "rgba(201,168,76,0.1)" }}>
                <Icon className={`w-4 h-4 md:w-6 md:h-6 ${accent ? "text-white" : ""}`} style={{ color: accent ? undefined : "#C9A84C" }} />
              </div>
              <div className="min-w-0">
                <h3 className="text-[12px] md:text-base font-bold text-roope-primary truncate">{title}</h3>
                <p className="hidden md:block text-xs text-stone-warm mt-1 truncate">{desc}</p>
              </div>
              <span className="text-[11.5px] md:text-sm font-semibold mt-1 md:mt-auto" style={{ color: "#C9A84C" }}>{action} →</span>
            </a>
          ))}
        </div>
      </section>

      {/* Contact form */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
          <div>
            <p className="section-label mb-3">Send a Message</p>
            <h2 className="font-display text-xl md:text-3xl font-semibold md:font-light text-roope-primary mb-8">
              Tell us what you need.
            </h2>
            {sent ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-3xl p-8 text-center">
                <div className="text-5xl mb-4">✨</div>
                <h3 className="font-display text-lg md:text-2xl font-semibold md:font-light text-roope-primary mb-2">Message Received!</h3>
                <p className="text-stone-warm text-sm">We&apos;ll get back to you within 30 minutes.</p>
              </motion.div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                {[
                  { key: "name", label: "Full Name", type: "text", placeholder: "Your name" },
                  { key: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
                  { key: "subject", label: "Subject", type: "text", placeholder: "How can we help?" },
                ].map(({ key, label, type, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-stone-warm mb-2">{label}</label>
                    <input type={type} placeholder={placeholder}
                      value={formData[key as keyof typeof formData]}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none"
                      style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(107,94,82,0.15)", color: "#1A1612" }}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-stone-warm mb-2">Message</label>
                  <textarea rows={4} placeholder="Tell us more..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none resize-none"
                    style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(107,94,82,0.15)", color: "#1A1612" }}
                  />
                </div>
                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4 gap-2 disabled:opacity-60">
                  {loading ? "Sending..." : "Send Message"} <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* FAQ */}
          <div id="faq">
            <p className="section-label mb-3">FAQs</p>
            <h2 className="font-display text-xl md:text-3xl font-semibold md:font-light text-roope-primary mb-8">
              Common questions.
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(107,94,82,0.1)" }}
                >
                  <button
                    className="w-full px-5 py-4 flex items-center justify-between text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-medium text-roope-primary text-sm pr-4">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-stone-warm flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4">
                      <p className="text-sm text-stone-warm leading-relaxed">{faq.a}</p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
