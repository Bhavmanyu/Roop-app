"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Plus, Minus, Send, X } from "lucide-react";
import { eventPackages } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

const addons = [
  { id: "lashes", label: "Lash Extension Application", price: 999 },
  { id: "hair", label: "Hair Styling", price: 999 },
  { id: "draping", label: "Saree Draping", price: 999 },
  { id: "touch", label: "Touch-up Artist (1 hr)", price: 1499 },
  { id: "hairstyle2", label: "Blowout / Blowdry", price: 799 },
];

const cities = ["Indore"];

export default function EventsPage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>("event-full");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [groupSize, setGroupSize] = useState(1);

  const [showInquiry, setShowInquiry] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", event_date: "", city: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const base = eventPackages.find((p) => p.id === selectedPackage);
  const basePrice = (base?.price || 0) * groupSize;
  const addonTotal = selectedAddons.reduce((acc, id) => {
    const a = addons.find((ad) => ad.id === id);
    return acc + (a?.price || 0);
  }, 0);
  const total = basePrice + addonTotal;
  const discount = groupSize >= 4 ? Math.round(total * 0.15) : 0;
  const finalTotal = total - discount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          package_id: selectedPackage,
          package_name: base?.name || "",
          group_size: groupSize,
          add_ons: selectedAddons.map((id) => addons.find((a) => a.id === id)?.label || id),
        }),
      });
      if (res.ok) { setSubmitted(true); }
      else {
        const json = await res.json();
        setError(json.error || "Failed to submit. Please try again.");
      }
    } catch { setError("Network error. Please try again."); }
    finally { setSubmitting(false); }
  };

  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-16 px-6" style={{ background: "linear-gradient(160deg, #F8F6F2 0%, #FAF6EC 100%)" }}>
        <div className="max-w-7xl mx-auto">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="section-label mb-3">Event Services</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="section-title mb-4 max-w-xl">
            Glamour for every
            <span className="italic text-gradient-gold"> occasion.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="section-subtitle max-w-lg">
            Party looks, group styling, fashion events, corporate shoots — Roopé delivers premium makeup for every kind of event.
          </motion.p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">
          {/* Packages */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-light text-roope-primary mb-6">Choose a Package</h2>
            <div className="grid sm:grid-cols-2 gap-5 mb-10">
              {eventPackages.map((pkg, i) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className="cursor-pointer rounded-3xl p-6 transition-all duration-300"
                  style={{
                    background: selectedPackage === pkg.id ? "rgba(201,168,76,0.06)" : "rgba(255,255,255,0.9)",
                    border: selectedPackage === pkg.id ? "2px solid #C9A84C" : "1px solid rgba(107,94,82,0.12)",
                    boxShadow: selectedPackage === pkg.id ? "0 8px 48px rgba(201,168,76,0.2)" : "0 4px 24px rgba(26,22,18,0.06)",
                  }}
                >
                  <span className="tag-gold mb-3 inline-block">{pkg.tag}</span>
                  <h3 className="font-display text-xl font-light text-roope-primary mb-1">{pkg.name}</h3>
                  <p className="text-xs text-stone-warm mb-4">{pkg.tagline}</p>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-display text-2xl font-light text-roope-primary">{formatPrice(pkg.price)}</span>
                    <span className="text-xs text-stone-warm line-through">{formatPrice(pkg.originalPrice)}</span>
                    {pkg.priceNote && <span className="text-xs text-stone-warm">{pkg.priceNote}</span>}
                  </div>
                  <p className="text-xs text-stone-warm mb-3">{pkg.duration} • Ideal for: {pkg.idealFor}</p>
                  <ul className="space-y-2">
                    {pkg.includes.map((inc) => (
                      <li key={inc} className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(201,168,76,0.15)" }}>
                          <Check className="w-2 h-2" style={{ color: "#C9A84C" }} />
                        </div>
                        <span className="text-xs text-stone-warm">{inc}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Group size */}
            <div className="card-luxury p-6 mb-8">
              <h3 className="font-display text-xl font-light text-roope-primary mb-2">Group Size</h3>
              <p className="text-sm text-stone-warm mb-4">4+ people get 15% off automatically.</p>
              <div className="flex items-center gap-4">
                <button onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
                  className="w-10 h-10 rounded-full border border-pearl-300 flex items-center justify-center hover:border-champagne-DEFAULT transition-colors">
                  <Minus className="w-4 h-4 text-stone-warm" />
                </button>
                <span className="font-display text-3xl font-light text-roope-primary w-12 text-center">{groupSize}</span>
                <button onClick={() => setGroupSize(groupSize + 1)}
                  className="w-10 h-10 rounded-full border border-pearl-300 flex items-center justify-center hover:border-champagne-DEFAULT transition-colors">
                  <Plus className="w-4 h-4 text-stone-warm" />
                </button>
                <span className="text-sm text-stone-warm">{groupSize === 1 ? "person" : "people"}</span>
                {groupSize >= 4 && (
                  <span className="tag-gold ml-auto">15% Group Discount!</span>
                )}
              </div>
            </div>

            {/* Add-ons */}
            <div className="card-luxury p-6">
              <h3 className="font-display text-xl font-light text-roope-primary mb-4">Add-Ons (Optional)</h3>
              <div className="space-y-3">
                {addons.map((addon) => {
                  const selected = selectedAddons.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      onClick={() => setSelectedAddons(selected ? selectedAddons.filter((a) => a !== addon.id) : [...selectedAddons, addon.id])}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl text-left transition-all duration-200 ${selected ? "shadow-gold" : "border border-pearl-300"}`}
                      style={{
                        background: selected ? "rgba(201,168,76,0.06)" : "rgba(255,255,255,0.8)",
                        borderColor: selected ? "#C9A84C" : undefined,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected ? "border-champagne-DEFAULT" : "border-stone-warm/30"}`}
                          style={{ background: selected ? "#C9A84C" : "transparent" }}>
                          {selected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm font-medium text-roope-primary">{addon.label}</span>
                      </div>
                      <span className="text-sm text-stone-warm">+{formatPrice(addon.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Price summary */}
          <div>
            <div className="card-luxury p-7 sticky top-24">
              <p className="section-label mb-5">Live Pricing</p>
              <div className="space-y-3 text-sm mb-5">
                {base && (
                  <div className="flex justify-between">
                    <span className="text-stone-warm">{base.name} × {groupSize}</span>
                    <span className="font-medium text-roope-primary">{formatPrice(base.price * groupSize)}</span>
                  </div>
                )}
                {selectedAddons.map((id) => {
                  const a = addons.find((ad) => ad.id === id);
                  return a ? (
                    <div key={id} className="flex justify-between">
                      <span className="text-stone-warm">{a.label}</span>
                      <span className="font-medium text-roope-primary">+{formatPrice(a.price)}</span>
                    </div>
                  ) : null;
                })}
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Group Discount (15%)</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
              </div>
              <div className="pt-4 border-t border-pearl-200 flex justify-between items-center mb-6">
                <span className="font-semibold text-roope-primary">Total</span>
                <span className="font-display text-2xl font-light text-roope-primary">{formatPrice(finalTotal)}</span>
              </div>
              <button
                onClick={() => { setShowInquiry(true); setSubmitted(false); setError(""); }}
                className="btn-primary w-full justify-center gap-2 py-4"
              >
                Book Now <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-xs text-stone-warm text-center mt-4">Free cancellation • 24hr support</p>
            </div>
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
              className="w-full max-w-lg rounded-4xl p-8 max-h-[90vh] overflow-y-auto"
              style={{ background: "#FAF6EC" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="section-label mb-1">Event Inquiry</p>
                  <h2 className="font-display text-2xl font-light text-roope-primary">{base?.name}</h2>
                  <p className="text-sm text-stone-warm">{groupSize} {groupSize === 1 ? "person" : "people"} • {formatPrice(finalTotal)}</p>
                </div>
                <button onClick={() => setShowInquiry(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-100 transition-colors">
                  <X className="w-4 h-4 text-stone-warm" />
                </button>
              </div>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">✨</div>
                  <h3 className="font-display text-2xl font-light text-roope-primary mb-2">Inquiry Received!</h3>
                  <p className="text-stone-warm text-sm">We&apos;ll confirm your event booking within 2 hours.</p>
                  <button onClick={() => setShowInquiry(false)} className="btn-primary px-8 py-3 mt-6">Close</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { key: "name", label: "Full Name", type: "text", placeholder: "Your name" },
                    { key: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98765 43210" },
                    { key: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
                  ].map(({ key, label, type, placeholder }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-stone-warm mb-2">{label} *</label>
                      <input type={type} required placeholder={placeholder}
                        value={form[key as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none"
                        style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(107,94,82,0.15)", color: "#1A1612" }}
                      />
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-warm mb-2">Event Date</label>
                      <input type="date" value={form.event_date}
                        onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none"
                        style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(107,94,82,0.15)", color: "#1A1612" }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-warm mb-2">City *</label>
                      <select required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none appearance-none"
                        style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(107,94,82,0.15)", color: form.city ? "#1A1612" : "#8B7D6B" }}
                      >
                        <option value="">Select city</option>
                        {cities.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-warm mb-2">Message (optional)</label>
                    <textarea rows={3} placeholder="Any special requests or requirements..."
                      value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none resize-none"
                      style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(107,94,82,0.15)", color: "#1A1612" }}
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-4 gap-2 disabled:opacity-60">
                    {submitting ? "Submitting..." : "Confirm Inquiry"} <Send className="w-4 h-4" />
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
