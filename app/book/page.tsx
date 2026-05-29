"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, Calendar, MapPin, User, CreditCard, Sparkles, Clock } from "lucide-react";
import { services } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

const occasions = [
  { id: "bridal", label: "Wedding / Bridal", icon: "💍" },
  { id: "reception", label: "Reception", icon: "🥂" },
  { id: "engagement", label: "Engagement", icon: "💎" },
  { id: "mehendi", label: "Mehendi", icon: "🌿" },
  { id: "haldi", label: "Haldi", icon: "🌼" },
  { id: "party", label: "Party / Event", icon: "✨" },
  { id: "photoshoot", label: "Photoshoot", icon: "📸" },
  { id: "corporate", label: "Corporate", icon: "💼" },
];

const artistTiers = [
  { id: "standard", name: "Standard", price: 0, desc: "Professional certified artists", rating: "4.5+" },
  { id: "premium", name: "Premium", price: 1500, desc: "Senior artists with 5+ years", rating: "4.7+" },
  { id: "elite", name: "Elite", price: 3000, desc: "Master artists — top 5% network", rating: "4.9+" },
];

const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];

const steps = ["Occasion", "Service", "Date & Time", "Location", "Artist Tier", "Extras", "Review", "Payment"];

export default function BookPage() {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({
    occasion: "",
    service: "",
    date: "",
    time: "",
    address: "",
    city: "Mumbai",
    artistTier: "premium",
    extras: [] as string[],
    coupon: "",
    name: "",
    phone: "",
    email: "",
  });
  const [confirmed, setConfirmed] = useState(false);

  const selectedService = services.find((s) => s.id === selections.service);
  const selectedTier = artistTiers.find((t) => t.id === selections.artistTier);
  const basePrice = selectedService?.price || 0;
  const tierUpcharge = selectedTier?.price || 0;
  const extrasTotal = selections.extras.length * 999;
  const total = basePrice + tierUpcharge + extrasTotal;

  const extras = [
    { id: "lashes", label: "Lash Application", price: 999 },
    { id: "hairstyle", label: "Hair Styling", price: 999 },
    { id: "draping", label: "Saree Draping", price: 999 },
    { id: "touchup", label: "1-hr Touch-up Artist", price: 999 },
  ];

  const canProceed = () => {
    if (step === 0) return !!selections.occasion;
    if (step === 1) return !!selections.service;
    if (step === 2) return !!selections.date && !!selections.time;
    if (step === 3) return !!selections.address;
    if (step === 6) return !!selections.name && !!selections.phone && !!selections.email;
    return true;
  };

  if (confirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 pt-24"
        style={{ background: "linear-gradient(160deg, #F8F6F2 0%, #FAF6EC 100%)" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
            style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}
          >
            <Check className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="font-display text-4xl font-light text-roope-primary mb-4">Booking Confirmed!</h1>
          <p className="text-stone-warm mb-2">Your Roopé artist has been reserved.</p>
          <p className="text-stone-warm text-sm mb-8">Booking #RP-{Math.floor(Math.random() * 90000) + 10000}</p>
          <div className="glass rounded-3xl p-6 text-left mb-8">
            <p className="text-xs text-stone-warm mb-3 uppercase tracking-wider">Booking Summary</p>
            {selectedService && <p className="font-medium text-roope-primary">{selectedService.name}</p>}
            <p className="text-sm text-stone-warm mt-1">{selections.date} at {selections.time}</p>
            <p className="text-sm text-stone-warm">{selections.city}</p>
            <div className="mt-4 pt-4 border-t border-pearl-200 flex justify-between">
              <span className="text-sm text-stone-warm">Total Paid</span>
              <span className="font-display font-light text-roope-primary">{formatPrice(total)}</span>
            </div>
          </div>
          <Link href="/" className="btn-primary px-8 py-4 w-full justify-center">
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #F8F6F2 0%, #FAF6EC 100%)" }}>
      {/* Header */}
      <div className="pt-24 pb-8 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="section-label mb-2">Book a Service</p>
          <h1 className="font-display text-3xl font-light text-roope-primary">
            Step {step + 1} of {steps.length}: <span className="text-gradient-gold">{steps[step]}</span>
          </h1>

          {/* Progress bar */}
          <div className="mt-6 flex gap-1.5">
            {steps.map((_, i) => (
              <div key={i} className="flex-1 h-1 rounded-full transition-all duration-400"
                style={{
                  background: i <= step ? "linear-gradient(90deg, #C9A84C, #B8922E)" : "rgba(107,94,82,0.15)",
                }} />
            ))}
          </div>

          {/* Step labels */}
          <div className="hidden sm:flex gap-1.5 mt-2">
            {steps.map((label, i) => (
              <div key={i} className={`flex-1 text-center text-xs transition-colors ${i === step ? "font-medium" : "text-stone-warm/50"}`} style={{ color: i === step ? "#C9A84C" : undefined }}>
                {i < step ? <Check className="w-3 h-3 mx-auto" style={{ color: "#C9A84C" }} /> : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="card-luxury p-8"
                >
                  {/* Step 0: Occasion */}
                  {step === 0 && (
                    <div>
                      <h2 className="font-display text-2xl font-light text-roope-primary mb-6">What&apos;s the occasion?</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {occasions.map((occ) => (
                          <button
                            key={occ.id}
                            onClick={() => setSelections({ ...selections, occasion: occ.id })}
                            className={`p-4 rounded-2xl flex flex-col items-center gap-2 text-sm transition-all duration-200 ${
                              selections.occasion === occ.id
                                ? "shadow-gold"
                                : "border border-pearl-300 hover:border-champagne-300"
                            }`}
                            style={{
                              background: selections.occasion === occ.id
                                ? "linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.06))"
                                : "rgba(255,255,255,0.8)",
                              borderColor: selections.occasion === occ.id ? "#C9A84C" : undefined,
                            }}
                          >
                            <span className="text-2xl">{occ.icon}</span>
                            <span className={`font-medium text-center leading-tight text-xs ${selections.occasion === occ.id ? "text-roope-primary" : "text-stone-warm"}`}>
                              {occ.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 1: Service */}
                  {step === 1 && (
                    <div>
                      <h2 className="font-display text-2xl font-light text-roope-primary mb-6">Choose your service</h2>
                      <div className="space-y-3">
                        {services.slice(0, 6).map((service) => (
                          <button
                            key={service.id}
                            onClick={() => setSelections({ ...selections, service: service.id })}
                            className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all duration-200 text-left ${
                              selections.service === service.id ? "shadow-gold" : "border border-pearl-300 hover:border-champagne-300"
                            }`}
                            style={{
                              background: selections.service === service.id ? "rgba(201,168,76,0.06)" : "rgba(255,255,255,0.8)",
                              borderColor: selections.service === service.id ? "#C9A84C" : undefined,
                            }}
                          >
                            <div>
                              <p className="font-medium text-roope-primary">{service.name}</p>
                              <p className="text-xs text-stone-warm mt-0.5">{service.duration} • {service.artistTier} artist</p>
                            </div>
                            <div className="text-right">
                              <p className="font-display text-lg font-light text-roope-primary">{formatPrice(service.price)}</p>
                              {selections.service === service.id && (
                                <Check className="w-4 h-4 ml-auto" style={{ color: "#C9A84C" }} />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Date & Time */}
                  {step === 2 && (
                    <div>
                      <h2 className="font-display text-2xl font-light text-roope-primary mb-6">Pick a date & time</h2>
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-stone-warm mb-2">Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-warm" />
                          <input
                            type="date"
                            value={selections.date}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) => setSelections({ ...selections, date: e.target.value })}
                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm outline-none"
                            style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(107,94,82,0.15)", color: "#1A1612" }}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-warm mb-3">Available Time Slots</label>
                        <div className="grid grid-cols-5 gap-2">
                          {timeSlots.map((slot) => (
                            <button
                              key={slot}
                              onClick={() => setSelections({ ...selections, time: slot })}
                              className={`py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                                selections.time === slot ? "text-white shadow-gold" : "text-stone-warm hover:text-roope-primary border border-pearl-300"
                              }`}
                              style={{ background: selections.time === slot ? "linear-gradient(135deg, #C9A84C, #B8922E)" : "rgba(255,255,255,0.8)" }}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Location */}
                  {step === 3 && (
                    <div>
                      <h2 className="font-display text-2xl font-light text-roope-primary mb-6">Where should we come?</h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-stone-warm mb-2">City</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-warm" />
                            <select
                              value={selections.city}
                              onChange={(e) => setSelections({ ...selections, city: e.target.value })}
                              className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm outline-none appearance-none"
                              style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(107,94,82,0.15)", color: "#1A1612" }}
                            >
                              {["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Pune", "Chennai", "Kolkata", "Jaipur"].map((c) => (
                                <option key={c}>{c}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-stone-warm mb-2">Full Address</label>
                          <textarea
                            value={selections.address}
                            onChange={(e) => setSelections({ ...selections, address: e.target.value })}
                            placeholder="Flat/House No., Building Name, Area, City..."
                            rows={3}
                            className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none resize-none"
                            style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(107,94,82,0.15)", color: "#1A1612" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Artist Tier */}
                  {step === 4 && (
                    <div>
                      <h2 className="font-display text-2xl font-light text-roope-primary mb-6">Select artist tier</h2>
                      <div className="space-y-4">
                        {artistTiers.map((tier) => (
                          <button
                            key={tier.id}
                            onClick={() => setSelections({ ...selections, artistTier: tier.id })}
                            className={`w-full p-5 rounded-2xl flex items-center justify-between transition-all duration-200 text-left ${
                              selections.artistTier === tier.id ? "shadow-gold" : "border border-pearl-300"
                            }`}
                            style={{
                              background: selections.artistTier === tier.id ? "rgba(201,168,76,0.06)" : "rgba(255,255,255,0.8)",
                              borderColor: selections.artistTier === tier.id ? "#C9A84C" : undefined,
                            }}
                          >
                            <div>
                              <p className="font-semibold text-roope-primary">{tier.name}</p>
                              <p className="text-xs text-stone-warm mt-0.5">{tier.desc} • {tier.rating} rated</p>
                            </div>
                            <div className="text-right">
                              <p className="font-display text-lg text-roope-primary">
                                {tier.price === 0 ? "Included" : `+${formatPrice(tier.price)}`}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 5: Extras */}
                  {step === 5 && (
                    <div>
                      <h2 className="font-display text-2xl font-light text-roope-primary mb-6">Add extras (optional)</h2>
                      <div className="space-y-3">
                        {extras.map((extra) => {
                          const isSelected = selections.extras.includes(extra.id);
                          return (
                            <button
                              key={extra.id}
                              onClick={() => {
                                const next = isSelected
                                  ? selections.extras.filter((e) => e !== extra.id)
                                  : [...selections.extras, extra.id];
                                setSelections({ ...selections, extras: next });
                              }}
                              className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all duration-200 text-left ${
                                isSelected ? "shadow-gold" : "border border-pearl-300"
                              }`}
                              style={{
                                background: isSelected ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.8)",
                                borderColor: isSelected ? "#C9A84C" : undefined,
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? "border-champagne-DEFAULT" : "border-stone-warm/30"}`}
                                  style={{ background: isSelected ? "#C9A84C" : "transparent" }}>
                                  {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <span className="font-medium text-roope-primary">{extra.label}</span>
                              </div>
                              <span className="text-sm text-stone-warm">+{formatPrice(extra.price)}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Step 6: Review */}
                  {step === 6 && (
                    <div>
                      <h2 className="font-display text-2xl font-light text-roope-primary mb-6">Your details</h2>
                      <div className="space-y-4">
                        {[
                          { key: "name", label: "Full Name", icon: User, type: "text", placeholder: "Your full name" },
                          { key: "phone", label: "Phone Number", icon: User, type: "tel", placeholder: "+91 98765 43210" },
                          { key: "email", label: "Email Address", icon: User, type: "email", placeholder: "you@example.com" },
                        ].map(({ key, label, icon: Icon, type, placeholder }) => (
                          <div key={key}>
                            <label className="block text-sm font-medium text-stone-warm mb-2">{label}</label>
                            <div className="relative">
                              <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-warm" />
                              <input
                                type={type}
                                value={selections[key as keyof typeof selections] as string}
                                onChange={(e) => setSelections({ ...selections, [key]: e.target.value })}
                                placeholder={placeholder}
                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm outline-none"
                                style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(107,94,82,0.15)", color: "#1A1612" }}
                              />
                            </div>
                          </div>
                        ))}
                        <div>
                          <label className="block text-sm font-medium text-stone-warm mb-2">Coupon Code</label>
                          <div className="flex gap-3">
                            <input
                              type="text"
                              value={selections.coupon}
                              onChange={(e) => setSelections({ ...selections, coupon: e.target.value.toUpperCase() })}
                              placeholder="ROOPE25"
                              className="flex-1 px-4 py-3.5 rounded-2xl text-sm outline-none"
                              style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(107,94,82,0.15)", color: "#1A1612" }}
                            />
                            <button className="btn-secondary px-5 py-3.5 text-sm">Apply</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 7: Payment */}
                  {step === 7 && (
                    <div>
                      <h2 className="font-display text-2xl font-light text-roope-primary mb-6">Payment</h2>
                      <div className="space-y-4">
                        {[
                          { id: "upi", label: "UPI / Google Pay / PhonePe", icon: "⚡" },
                          { id: "card", label: "Debit / Credit Card", icon: "💳" },
                          { id: "netbanking", label: "Net Banking", icon: "🏦" },
                          { id: "cod", label: "Pay at Service", icon: "💵" },
                        ].map((method) => (
                          <button key={method.id}
                            className="w-full p-4 rounded-2xl flex items-center gap-4 border border-pearl-300 hover:border-champagne-DEFAULT transition-all duration-200 text-left"
                            style={{ background: "rgba(255,255,255,0.8)" }}
                            onClick={() => setConfirmed(true)}
                          >
                            <span className="text-2xl">{method.icon}</span>
                            <span className="font-medium text-roope-primary">{method.label}</span>
                            <ArrowRight className="w-4 h-4 text-stone-warm ml-auto" />
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-stone-warm text-center mt-6 flex items-center justify-center gap-1">
                        <CreditCard className="w-3 h-3" /> 256-bit SSL encrypted • 100% secure payment
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex gap-4 mt-6">
                {step > 0 && (
                  <button onClick={() => setStep(step - 1)}
                    className="btn-secondary flex items-center gap-2 px-6 py-3.5">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                )}
                {step < steps.length - 1 && (
                  <button
                    onClick={() => setStep(step + 1)}
                    disabled={!canProceed()}
                    className="btn-primary flex items-center gap-2 px-8 py-3.5 ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Sidebar: Price summary */}
            <div className="hidden lg:block">
              <div className="card-luxury p-6 sticky top-24">
                <p className="section-label mb-4">Your Booking</p>
                <div className="space-y-3 text-sm mb-6">
                  {selectedService && (
                    <div className="flex justify-between">
                      <span className="text-stone-warm">{selectedService.name}</span>
                      <span className="font-medium text-roope-primary">{formatPrice(selectedService.price)}</span>
                    </div>
                  )}
                  {selections.artistTier !== "standard" && tierUpcharge > 0 && (
                    <div className="flex justify-between">
                      <span className="text-stone-warm">{selectedTier?.name} Tier</span>
                      <span className="font-medium text-roope-primary">+{formatPrice(tierUpcharge)}</span>
                    </div>
                  )}
                  {selections.extras.map((eId) => {
                    const extra = extras.find((e) => e.id === eId);
                    return extra ? (
                      <div key={eId} className="flex justify-between">
                        <span className="text-stone-warm">{extra.label}</span>
                        <span className="font-medium text-roope-primary">+{formatPrice(extra.price)}</span>
                      </div>
                    ) : null;
                  })}
                  {selections.date && (
                    <div className="flex items-center gap-2 text-stone-warm pt-3 border-t border-pearl-200">
                      <Calendar className="w-3 h-3" /> {selections.date} {selections.time}
                    </div>
                  )}
                  {selections.city && (
                    <div className="flex items-center gap-2 text-stone-warm">
                      <MapPin className="w-3 h-3" /> {selections.city}
                    </div>
                  )}
                </div>
                {total > 0 && (
                  <div className="flex justify-between items-center pt-4 border-t border-pearl-200">
                    <span className="font-semibold text-roope-primary">Total</span>
                    <span className="font-display text-2xl font-light text-roope-primary">{formatPrice(total)}</span>
                  </div>
                )}
                <div className="mt-6 p-3 rounded-2xl flex items-start gap-2"
                  style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)" }}>
                  <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#C9A84C" }} />
                  <p className="text-xs text-stone-warm">
                    Free cancellation up to 24 hours before your appointment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
