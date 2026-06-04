"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Building2, 
  User, 
  MapPin, 
  Users, 
  Briefcase, 
  Link as LinkIcon, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

const serviceOptions = [
  { id: "bridal", label: "Bridal & Wedding Glam" },
  { id: "styling", label: "Hair & Makeup Styling" },
  { id: "skin", label: "Luxury Skin & Facials" },
  { id: "hair", label: "Professional Hair Spa & Color" },
  { id: "nail", label: "Exclusive Nail Artistry" },
  { id: "grooming", label: "Men's Grooming & Barbering" }
];

export default function SalonRegisterPage() {
  const [form, setForm] = useState({
    salon_name: "",
    owner_name: "",
    email: "",
    phone: "",
    address: "",
    website_link: "",
    staff_count: "",
    years_in_business: "",
    services: [] as string[]
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleServiceToggle = (serviceLabel: string) => {
    setForm(prev => {
      const active = prev.services.includes(serviceLabel)
        ? prev.services.filter(s => s !== serviceLabel)
        : [...prev.services, serviceLabel];
      return { ...prev, services: active };
    });
  };

  const canSubmit = () => {
    return (
      form.salon_name.trim().length >= 2 &&
      form.owner_name.trim().length >= 2 &&
      form.email.trim().includes("@") &&
      form.phone.trim().length >= 8 &&
      form.address.trim().length >= 5 &&
      form.staff_count.trim() !== "" &&
      form.years_in_business.trim() !== "" &&
      form.services.length > 0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit()) {
      setError("Please fill out all required fields, select at least one core service, and provide your salon details.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/register/salon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          staff_count: parseInt(form.staff_count, 10),
          years_in_business: parseInt(form.years_in_business, 10)
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const json = await res.json();
        setError(json.error || "Failed to submit partnership form. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center px-6 pt-24 pb-12"
        style={{ background: "linear-gradient(160deg, #F8F6F2 0%, #FAF6EC 100%)" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15, type: "spring" }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md"
            style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}
          >
            <CheckCircle2 className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="font-display text-xl md:text-3xl font-semibold md:font-light text-roope-primary mb-3">Partnership Logged</h1>
          <p className="text-stone-warm mb-1">Onboarding application for **{form.salon_name}** received.</p>
          <p className="text-stone-warm text-sm mb-8 leading-relaxed">
            Our corporate partnership lead will review your salon profile and get in touch with you directly to schedule an in-person meeting.
          </p>
          
          <div className="flex flex-col gap-3 justify-center">
            <Link href="/" className="btn-primary py-4 px-8 justify-center shadow-md">
              Return to Home
            </Link>
            <Link href="/contact" className="btn-secondary py-4 px-8 justify-center border border-pearl-300">
              Contact Partnerships
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen pt-28 pb-24 px-6 flex items-center justify-center" 
      style={{ background: "linear-gradient(160deg, #F8F6F2 0%, #FAF6EC 100%)" }}
    >
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="section-label mb-2 tracking-widest uppercase">Establish Partnership</p>
          <h1 className="font-display text-2xl md:text-5xl font-semibold md:font-light text-roope-primary mb-3">
            Salon Onboarding <span className="text-gradient-gold">Portal</span>
          </h1>
          <p className="text-stone-warm max-w-lg mx-auto text-sm leading-relaxed">
            Take your salon or parlour onboard with Roopé. Streamline your appointments, scale your customer base, and gain instant visibility.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="card-luxury p-8 md:p-10 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-warm/60 border-b border-pearl-200/80 pb-3">
            Salon & Owner Information
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1.5">Salon / Parlour Name *</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-warm/40" />
                <input
                  type="text"
                  required
                  value={form.salon_name}
                  onChange={(e) => setForm({ ...form, salon_name: e.target.value })}
                  placeholder="e.g. Roopé Elite Salon"
                  className="w-full bg-white rounded-2xl border border-pearl-200 pl-11 pr-4 py-3.5 text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1.5">Owner's Full Name *</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-warm/40" />
                <input
                  type="text"
                  required
                  value={form.owner_name}
                  onChange={(e) => setForm({ ...form, owner_name: e.target.value })}
                  placeholder="Name of owner/manager"
                  className="w-full bg-white rounded-2xl border border-pearl-200 pl-11 pr-4 py-3.5 text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1.5">Contact Email *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="contact@salon.com"
                className="w-full bg-white rounded-2xl border border-pearl-200 px-4 py-3.5 text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1.5">Contact Phone *</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Business phone number"
                className="w-full bg-white rounded-2xl border border-pearl-200 px-4 py-3.5 text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT transition-colors"
              />
            </div>
          </div>

          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-warm/60 border-b border-pearl-200/80 pt-4 pb-3">
            Business Details & Scale
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1.5">Active Staff Members *</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-warm/40" />
                <select
                  required
                  value={form.staff_count}
                  onChange={(e) => setForm({ ...form, staff_count: e.target.value })}
                  className="w-full bg-white rounded-2xl border border-pearl-200 pl-11 pr-4 py-3.5 text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Select staff count</option>
                  <option value="3">1 - 4 Members</option>
                  <option value="7">5 - 10 Members</option>
                  <option value="15">11 - 20 Members</option>
                  <option value="30">21+ Members</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1.5">Years in Business *</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-warm/40" />
                <select
                  required
                  value={form.years_in_business}
                  onChange={(e) => setForm({ ...form, years_in_business: e.target.value })}
                  className="w-full bg-white rounded-2xl border border-pearl-200 pl-11 pr-4 py-3.5 text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Select business age</option>
                  <option value="0">Newly Opened (under 1 yr)</option>
                  <option value="2">1 - 2 Years</option>
                  <option value="4">3 - 5 Years</option>
                  <option value="8">6+ Years</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1.5">Website / Instagram URL</label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-warm/40" />
                <input
                  type="url"
                  value={form.website_link}
                  onChange={(e) => setForm({ ...form, website_link: e.target.value })}
                  placeholder="Website address or Instagram profile"
                  className="w-full bg-white rounded-2xl border border-pearl-200 pl-11 pr-4 py-3.5 text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1.5">Salon Address (Indore) *</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4.5 w-4 h-4 text-stone-warm/40" />
                <textarea
                  required
                  rows={2}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Salon address in Indore (landmarks, shop number, road name)..."
                  className="w-full bg-white rounded-2xl border border-pearl-200 pl-11 pr-4 py-3 text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-2.5">Core Services Provided *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {serviceOptions.map((opt) => {
                const isActive = form.services.includes(opt.label);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleServiceToggle(opt.label)}
                    className={`p-3 rounded-2xl border text-center text-[10px] md:text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? "bg-champagne-300/10 border-champagne-DEFAULT text-roope-primary shadow-sm" 
                        : "bg-white border-pearl-200 text-stone-warm hover:border-champagne-300/50"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="p-3.5 bg-red-500/5 border border-red-500/15 rounded-2xl flex gap-2.5 items-center text-red-600 text-xs shadow-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-4 flex items-center justify-end">
            <button
              type="submit"
              disabled={submitting || !canSubmit()}
              className="btn-primary w-full md:w-auto px-10 py-4 justify-center flex items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
            >
              {submitting ? "Submitting Partnership..." : "Request Partnership"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
