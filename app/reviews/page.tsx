"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, BadgeCheck, Quote, ArrowRight, Send } from "lucide-react";
import { testimonials, services } from "@/lib/data";

export default function ReviewsPage() {
  const [reviewForm, setReviewForm] = useState({
    name: "", location: "", service: "", rating: 0, review_text: "",
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewForm.rating === 0) { setError("Please select a star rating."); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewForm),
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
      <section className="pt-28 pb-16 px-6" style={{ background: "linear-gradient(160deg, #F8F6F2 0%, #FAF6EC 100%)" }}>
        <div className="max-w-7xl mx-auto text-center">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="section-label mb-3">Reviews</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="section-title mx-auto max-w-lg mb-4">
            50,000+ women who <span className="italic text-gradient-gold">trusted Roopé.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="section-subtitle max-w-md mx-auto">
            Real bookings. Real people. Real transformations.
          </motion.p>
        </div>
      </section>

      {/* Stats row */}
      <section className="py-12 px-6" style={{ background: "linear-gradient(135deg, #FAF6EC, #F3E8C8)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { value: "4.9/5.0", label: "Average Rating", sub: "From 50,000+ reviews" },
            { value: "98%", label: "Would Recommend", sub: "To friends & family" },
            { value: "96%", label: "Repeat Clients", sub: "Book again within 6 months" },
            { value: "99%", label: "On-time Arrival", sub: "Across all bookings" },
          ].map((s) => (
            <motion.div key={s.label} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} viewport={{ once: true }}>
              <p className="stat-number text-roope-primary">{s.value}</p>
              <p className="font-semibold text-sm text-roope-primary mt-1">{s.label}</p>
              <p className="text-xs text-stone-warm mt-0.5">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Reviews masonry */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {[...testimonials, ...testimonials].map((review, i) => (
              <motion.div
                key={`${review.id}-${i}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.3) }}
                className="break-inside-avoid card-luxury p-6 mb-5"
              >
                <Quote className="w-5 h-5 mb-3 opacity-25" style={{ color: "#C9A84C" }} />
                <div className="flex gap-0.5 mb-3">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-current" style={{ color: "#C9A84C" }} />
                  ))}
                </div>
                <p className="text-sm text-stone-warm leading-relaxed mb-5">&ldquo;{review.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                    <Image src={review.image} alt={review.name} fill className="object-cover object-top" sizes="36px" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-semibold text-roope-primary">{review.name}</p>
                      {review.verified && <BadgeCheck className="w-3.5 h-3.5" style={{ color: "#C9A84C" }} />}
                    </div>
                    <p className="text-xs text-stone-warm">{review.service} • {review.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Write a Review */}
      <section className="py-20 px-6" style={{ background: "linear-gradient(135deg, #FAF6EC, #F8F6F2)" }}>
        <div className="max-w-xl mx-auto">
          <p className="section-label mb-3 text-center">Share Your Experience</p>
          <h2 className="font-display text-3xl font-light text-roope-primary mb-2 text-center">
            Write a <span className="italic text-gradient-gold">review.</span>
          </h2>
          <p className="text-stone-warm text-sm text-center mb-8">Your review will appear after approval. Thank you for sharing!</p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-luxury p-8 text-center"
            >
              <div className="text-4xl mb-4">💛</div>
              <h3 className="font-display text-2xl font-light text-roope-primary mb-2">Thank you!</h3>
              <p className="text-stone-warm text-sm">Your review has been submitted and will appear after approval.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="card-luxury p-8 space-y-5">
              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium text-stone-warm mb-3">Your Rating *</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className="w-8 h-8 transition-colors"
                        fill={(hoveredStar || reviewForm.rating) >= star ? "#C9A84C" : "none"}
                        style={{ color: (hoveredStar || reviewForm.rating) >= star ? "#C9A84C" : "#D4C9B8" }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {[
                { key: "name", label: "Full Name", type: "text", placeholder: "Your name" },
                { key: "location", label: "City / Location", type: "text", placeholder: "e.g. Vijay Nagar, Indore" },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-stone-warm mb-2">{label} *</label>
                  <input
                    type={type}
                    required
                    placeholder={placeholder}
                    value={reviewForm[key as keyof typeof reviewForm] as string}
                    onChange={(e) => setReviewForm({ ...reviewForm, [key]: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(107,94,82,0.15)", color: "#1A1612" }}
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-stone-warm mb-2">Service Received *</label>
                <select
                  required
                  value={reviewForm.service}
                  onChange={(e) => setReviewForm({ ...reviewForm, service: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none appearance-none"
                  style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(107,94,82,0.15)", color: "#1A1612" }}
                >
                  <option value="">Select a service</option>
                  {services.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
                  <option value="Essential Bride Package">Essential Bride Package</option>
                  <option value="Signature Bride Package">Signature Bride Package</option>
                  <option value="Luxury Bride Package">Luxury Bride Package</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-warm mb-2">Your Review *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us about your experience..."
                  value={reviewForm.review_text}
                  onChange={(e) => setReviewForm({ ...reviewForm, review_text: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none resize-none"
                  style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(107,94,82,0.15)", color: "#1A1612" }}
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-4 gap-2 disabled:opacity-60">
                {submitting ? "Submitting..." : "Submit Review"} <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="py-16 px-6 text-center" style={{ background: "linear-gradient(135deg, #FAF6EC, #F8F6F2)" }}>
        <p className="section-label mb-3">Your Turn</p>
        <h2 className="font-display text-3xl font-light text-roope-primary mb-6 max-w-md mx-auto">
          Ready to write your own <span className="italic text-gradient-gold">story?</span>
        </h2>
        <Link href="/book" className="btn-primary px-10 py-4 inline-flex items-center gap-2">
          Book Now <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </>
  );
}
