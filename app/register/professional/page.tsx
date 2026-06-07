"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  MapPin, 
  Briefcase, 
  Link as LinkIcon, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

const skillOptions = [
  { id: "bridal", label: "Bridal Makeup Artistry" },
  { id: "hairstyle", label: "Luxury Hair Styling" },
  { id: "draping", label: "Saree & Dupatta Draping" },
  { id: "airbrush", label: "Airbrush Artistry" },
  { id: "event", label: "Event Glam & Styling" },
  { id: "editorial", label: "Editorial & Fashion Glam" }
];

export default function ProfessionalRegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    experience_years: "",
    city: "Indore",
    skills: [] as string[],
    portfolio_link: "",
    certificate_url: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSkillToggle = (skillLabel: string) => {
    setForm(prev => {
      const active = prev.skills.includes(skillLabel)
        ? prev.skills.filter(s => s !== skillLabel)
        : [...prev.skills, skillLabel];
      return { ...prev, skills: active };
    });
  };

  const canSubmit = () => {
    return (
      form.name.trim().length >= 2 &&
      form.email.trim().includes("@") &&
      form.phone.trim().length >= 8 &&
      form.experience_years.trim() !== "" &&
      form.skills.length > 0 &&
      form.certificate_url.trim().startsWith("http")
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit()) {
      setError("Please fill out all required fields, select at least one skill, and provide a valid certificate link.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/register/professional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          experience_years: parseInt(form.experience_years, 10)
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const json = await res.json();
        setError(json.error || "Failed to submit application. Please try again.");
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
        style={{ background: "linear-gradient(160deg, var(--pearl) 0%, var(--ivory) 100%)" }}
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
          
          <h1 className="font-display text-xl md:text-3xl font-semibold md:font-light text-roope-primary mb-3">Application Received</h1>
          <p className="text-stone-warm mb-1">Your professional artist profile has been logged successfully.</p>
          <p className="text-stone-warm text-sm mb-8 leading-relaxed">
            Our partnerships team will review your qualifications and certificates. You will receive an onboarding status email within the next 48 hours.
          </p>
          
          <div className="flex flex-col gap-3 justify-center">
            <Link href="/" className="btn-primary py-4 px-8 justify-center shadow-md">
              Return to Home
            </Link>
            <Link href="/contact" className="btn-secondary py-4 px-8 justify-center border border-pearl-300">
              Contact Support
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen pt-28 pb-24 px-6 flex items-center justify-center" 
      style={{ background: "linear-gradient(160deg, var(--pearl) 0%, var(--ivory) 100%)" }}
    >
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="section-label mb-2 tracking-widest uppercase">Join Our Network</p>
          <h1 className="font-display text-2xl md:text-5xl font-semibold md:font-light text-roope-primary mb-3">
            Register as a <span className="text-gradient-gold">Professional</span>
          </h1>
          <p className="text-stone-warm max-w-lg mx-auto text-sm leading-relaxed">
            Partner with Indore's premier luxury beauty network. Access premium clients, manage your own schedule, and earn high-tier payouts.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="card-luxury p-8 md:p-10 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-warm/60 border-b border-pearl-200/80 pb-3">
            Personal & Contact Information
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1.5">Full Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter your name"
                className="w-full bg-white rounded-2xl border border-pearl-200 px-4 py-3.5 text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1.5">Phone Number *</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="e.g. +91 98765 43210"
                className="w-full bg-white rounded-2xl border border-pearl-200 px-4 py-3.5 text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT transition-colors"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1.5">Email Address *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@example.com"
                className="w-full bg-white rounded-2xl border border-pearl-200 px-4 py-3.5 text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1.5">Service Location (Locked) *</label>
              <div className="bg-pearl-100/50 rounded-2xl p-3.5 border border-pearl-200 flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
                <span className="text-xs font-semibold text-roope-primary">
                  Indore, Madhya Pradesh <span className="text-[9px] text-stone-warm font-normal bg-pearl-200/50 px-2 py-0.5 rounded ml-2">Locked</span>
                </span>
              </div>
            </div>
          </div>

          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-warm/60 border-b border-pearl-200/80 pt-4 pb-3">
            Experience & Specialties
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1.5">Years of Experience *</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-warm/40" />
                <select
                  required
                  value={form.experience_years}
                  onChange={(e) => setForm({ ...form, experience_years: e.target.value })}
                  className="w-full bg-white rounded-2xl border border-pearl-200 pl-11 pr-4 py-3.5 text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Select experience</option>
                  <option value="1">1 - 2 Years</option>
                  <option value="3">3 - 5 Years</option>
                  <option value="6">6 - 8 Years</option>
                  <option value="9">9+ Years</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1.5">Portfolio/Social Link *</label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-warm/40" />
                <input
                  type="url"
                  required
                  value={form.portfolio_link}
                  onChange={(e) => setForm({ ...form, portfolio_link: e.target.value })}
                  placeholder="e.g. instagram.com/profile"
                  className="w-full bg-white rounded-2xl border border-pearl-200 pl-11 pr-4 py-3.5 text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT transition-colors"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-2.5">Specialty Skills (Select all that apply) *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {skillOptions.map((opt) => {
                const isActive = form.skills.includes(opt.label);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSkillToggle(opt.label)}
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

          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-warm/60 border-b border-pearl-200/80 pt-4 pb-3">
            Certifications & Verification
          </h3>

          <div>
            <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1.5">Certificate URL (Google Drive / Dropbox) *</label>
            <p className="text-[10px] text-stone-warm/60 mb-2 leading-tight">
              Please upload your certificate (PDF/Image) to Google Drive or Dropbox and paste the shareable link below.
            </p>
            <div className="relative">
              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-warm/40" />
              <input
                type="url"
                required
                value={form.certificate_url}
                onChange={(e) => setForm({ ...form, certificate_url: e.target.value })}
                placeholder="https://drive.google.com/..."
                className="w-full bg-white rounded-2xl border border-pearl-200 pl-11 pr-4 py-3.5 text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT transition-colors"
              />
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
              {submitting ? "Submitting Application..." : "Submit Application"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
