"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Star, Clock, Check, Plus, Minus, ArrowRight, HelpCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

// Normalised package schema matching data/index.ts datasets
interface NormalizedPackage {
  id: string;
  name: string;
  categoryName: string;
  price: number;
  originalPrice?: number;
  duration?: string;
  rating?: number;
  reviews?: number;
  includes: string[];
  description: string;
  image: string;
  type: "saver" | "bridal" | "event";
}

// Full normalized database of Roopé packages
const ALL_PACKAGES: NormalizedPackage[] = [
  // ─── SUPER SAVER PACKAGES ───────────────────────────────────
  {
    id: "make-your-own",
    name: "Make your own package",
    categoryName: "Super Savers (Women)",
    price: 2989,
    originalPrice: 3736,
    duration: "3 hrs 35 mins",
    rating: 4.85,
    reviews: 8300,
    type: "saver",
    image: "https://www.urbancompany.com/img?bucket=urbanclap-prod&quality=90&format=auto/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1777289098166-78b28b.jpeg",
    includes: [
      "Waxing: Full arms (incl. underarms) - Roll-on & Full legs - Roll-on",
      "Facial & cleanup: Glass skin hydration facial",
      "Pedicure: Candle Spa pedicure & nail paint",
      "Threading: Eyebrows & Upper lip"
    ],
    description: "Customize your own salon package at home with maximum savings. Pick any 3+ services and get flat 20% off."
  },
  {
    id: "monthly-maintenance",
    name: "Monthly maintenance package",
    categoryName: "Super Savers (Women)",
    price: 1912,
    originalPrice: 2124,
    duration: "2 hrs 10 mins",
    rating: 4.85,
    reviews: 6500,
    type: "saver",
    image: "https://www.urbancompany.com/img?bucket=urbanclap-prod&quality=90&format=auto/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1775030335442-db5de4.jpeg",
    includes: [
      "Waxing: Full arms (incl. underarms) - Honey",
      "Cleanup: Sara fruit cleanup & detan pack",
      "Manicure - Pedicure: Cut, file & polish - feet",
      "Facial hair removal: Eyebrow + Upper lip threading"
    ],
    description: "The standard monthly care package for complete waxing, cleanup, and basic nail filing."
  },
  {
    id: "mens-classic-grooming",
    name: "Classic Grooming Package (Men)",
    categoryName: "Super Savers (Men)",
    price: 999,
    originalPrice: 1399,
    duration: "1 hr 30 mins",
    rating: 4.82,
    reviews: 4200,
    type: "saver",
    image: "https://www.urbancompany.com/img?bucket=urbanclap-prod&quality=90&format=auto/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1776843862206-4d4247.jpeg",
    includes: [
      "Haircut: Trendy cut matching your face shape",
      "Beard Styling: Precision trim & straight razor outlines",
      "Head Massage: 15-min therapeutic oil head massage"
    ],
    description: "The ultimate classic care routine for men, leaving you fully styled and completely relaxed."
  },
  // ─── BRIDAL PACKAGES ─────────────────────────────────────────
  {
    id: "essential-bride",
    name: "Essential Bride",
    categoryName: "Bridal Collection",
    price: 22999,
    originalPrice: 30000,
    duration: "3 Days Coverage",
    rating: 4.90,
    reviews: 312,
    type: "bridal",
    image: "https://www.urbancompany.com/img?bucket=urbanclap-prod&quality=90&format=auto/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1776682279120-0ec7a1.jpeg",
    includes: [
      "Bridal HD Makeup",
      "Bridal Hair Styling",
      "Mehendi Day Makeup",
      "1 Pre-Bridal Consultation",
      "Touch-up Kit"
    ],
    description: "Your perfect wedding makeup beginning. Designed for elegant intimate wedding schedules."
  },
  {
    id: "signature-bride",
    name: "Signature Bride",
    categoryName: "Bridal Collection",
    price: 34999,
    originalPrice: 46000,
    duration: "4 Days Coverage",
    rating: 4.90,
    reviews: 450,
    type: "bridal",
    image: "https://www.urbancompany.com/img?bucket=urbanclap-prod&quality=90&format=auto/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1759154953718-3302bb.jpeg",
    includes: [
      "HD Bridal Makeup",
      "Hair Styling + Draping",
      "Engagement Look",
      "Mehendi Day Look",
      "Reception Makeup",
      "1 Pre-Bridal Session",
      "Touch-up Kit + Artist (2 hrs)",
      "Family Makeup (2 Members)"
    ],
    description: "Crafted for the modern bride. Extensive coverage for pre-wedding rituals and reception."
  },
  {
    id: "luxury-bride",
    name: "The Luxury Bride",
    categoryName: "Bridal Collection",
    price: 49999,
    originalPrice: 68000,
    duration: "5 Days Coverage",
    rating: 4.95,
    reviews: 580,
    type: "bridal",
    image: "/images/bridal_glam_1.png",
    includes: [
      "Airbrush Bridal Makeup",
      "Luxury Hair Styling + Draping",
      "Mehendi Day Look",
      "Haldi Day Look",
      "Engagement Glam",
      "Reception Full Package",
      "2 Artist Crew on Wedding Day",
      "2 Pre-Bridal Sessions",
      "Touch-up Artist for 4 Hours",
      "Family Makeup (3 Members)"
    ],
    description: "The absolute pinnacle of luxury bridal artistry. Multi-day airbrush application by senior stylists."
  },
  // ─── EVENT PACKAGES ──────────────────────────────────────────
  {
    id: "glow-party",
    name: "Glow & Go",
    categoryName: "Event Glamour",
    price: 2999,
    originalPrice: 3999,
    duration: "1 hr 30 mins",
    rating: 4.80,
    reviews: 198,
    type: "event",
    image: "/images/gallery_party_glam.png",
    includes: [
      "Party Glam Base",
      "Detailed Eye Look",
      "Blush & Golden Glow Highlights",
      "Nourishing Lip Color"
    ],
    description: "Quick glamour and instant confidence. Designed for dinner parties, dynamic nights out, and social gatherings."
  },
  {
    id: "event-full",
    name: "Event Full Glam",
    categoryName: "Event Glamour",
    price: 5499,
    originalPrice: 7499,
    duration: "2 hrs 30 mins",
    rating: 4.85,
    reviews: 240,
    type: "event",
    image: "/images/hero_bridal.png",
    includes: [
      "Full Glam High Definition Makeup",
      "Premium Hair Styling",
      "Sanitized Lash Application",
      "Roopé Touch-up Kit"
    ],
    description: "Head-to-toe premium glamour for cocktails, galas, red carpet events, and special celebrations."
  },
  {
    id: "group-glam",
    name: "Group Glamour",
    categoryName: "Event Glamour",
    price: 3499,
    originalPrice: 4999,
    duration: "1 hr 30 mins / guest",
    rating: 4.82,
    reviews: 180,
    type: "event",
    image: "/images/gallery_natural_glam.png",
    includes: [
      "Full Makeup per Person",
      "Dedicated Group Artist Crew",
      "Bulk Discount Pricing Included",
      "Complete Group Scheduling Coordination"
    ],
    description: "Ideal for bridesmaids, family groups, and girls' nights. Price is calculated per person (minimum 4 guests)."
  },
  {
    id: "fashion-editorial",
    name: "Editorial Fashion",
    categoryName: "Event Glamour",
    price: 8999,
    originalPrice: 12000,
    duration: "3 hours",
    rating: 4.90,
    reviews: 110,
    type: "event",
    image: "/images/makeup_application.png",
    includes: [
      "Avant-garde Fashion Runway Makeup",
      "Couture Hair Styling",
      "Detailed Wardrobe & Styling Consultation",
      "On-set Touch-ups (up to 2 hours)"
    ],
    description: "Magazine-worthy couture transformations. Designed specifically for professional campaigns, model tests, and editorial shoots."
  }
];

interface ComparePackagesProps {
  cart: { [id: string]: number };
  onAddToCart: (id: string) => void;
  onRemoveFromCart: (id: string) => void;
}

export default function ComparePackages({
  cart,
  onAddToCart,
  onRemoveFromCart
}: ComparePackagesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [slotA, setSlotA] = useState<NormalizedPackage>(ALL_PACKAGES[0]);
  const [slotB, setSlotB] = useState<NormalizedPackage>(ALL_PACKAGES[1]);

  // Lock body scroll when comparison module is open to prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Sync selection event dispatched from catalog service cards
  useEffect(() => {
    const handleTriggerCompare = (e: Event) => {
      const customEvent = e as CustomEvent<{ packageId: string }>;
      const pkg = ALL_PACKAGES.find((p) => p.id === customEvent.detail.packageId);
      if (pkg) {
        // Set as Slot A, and open the comparison module
        setSlotA(pkg);
        
        // Find a matching category package for Slot B if possible to make comparison highly relevant
        const sibling = ALL_PACKAGES.find(
          (p) => p.id !== pkg.id && p.type === pkg.type
        );
        if (sibling) {
          setSlotB(sibling);
        }
        
        setIsOpen(true);
      }
    };

    window.addEventListener("roope-trigger-compare", handleTriggerCompare);
    return () => window.removeEventListener("roope-trigger-compare", handleTriggerCompare);
  }, []);

  const getQty = (id: string) => cart[id] || 0;

  return (
    <>
      {/* ─── FLOATING ACTION TRIGGERS ─── */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 pointer-events-auto">
        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-gradient-gold text-white px-5 py-3 rounded-full shadow-luxury hover:shadow-gold text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span>Compare Packages</span>
        </motion.button>
      </div>

      {/* ─── COMPARISON MODAL OVERLAY ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md pt-12 pb-12 px-4 flex justify-center items-start min-h-screen overscroll-contain"
          >
            <motion.div
              initial={{ scale: 0.96, y: 25, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 25, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="bg-white rounded-[32px] w-full max-w-4xl border border-pearl-200/80 shadow-2xl relative overflow-hidden text-roope-primary flex flex-col my-auto"
            >
              {/* Modal Header */}
              <div className="px-6 md:px-8 py-5 border-b border-pearl-200/80 flex items-center justify-between bg-gradient-to-r from-[#FAF9F6] to-[#F5F2EA]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-champagne-DEFAULT/15 flex items-center justify-center text-[#B8922E]">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-light text-roope-primary">
                      Side-by-Side <span className="italic text-gradient-gold font-normal">Package Comparator</span>
                    </h2>
                    <p className="text-[10px] text-stone-warm/50 font-semibold tracking-wide uppercase mt-0.5">
                      Verify specifications, coverage, and details
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full border border-pearl-300 flex items-center justify-center text-stone-warm/75 hover:text-roope-primary hover:bg-pearl-100 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body & Comparison Table */}
              <div className="overflow-x-auto p-6 md:p-8">
                <table className="w-full min-w-[680px] border-collapse">
                  <thead>
                    <tr>
                      {/* Left Column Label spacer */}
                      <th className="w-[200px] pb-6 pr-4 text-left font-display text-sm font-light text-stone-warm/50 uppercase tracking-widest border-b border-pearl-200">
                        Package Details
                      </th>
                      
                      {/* Package A Select Column */}
                      <th className="pb-6 px-4 text-left border-b border-pearl-200 w-[240px]">
                        <div className="flex flex-col gap-2">
                          <span className="text-[9px] uppercase tracking-wider text-[#B8922E] font-bold">Slot A</span>
                          <div className="relative">
                            <select
                              value={slotA.id}
                              onChange={(e) => {
                                const found = ALL_PACKAGES.find((p) => p.id === e.target.value);
                                if (found) setSlotA(found);
                              }}
                              className="w-full bg-pearl-100 border border-pearl-300 rounded-xl px-3 py-2 text-xs font-bold text-roope-primary outline-none focus:border-champagne-DEFAULT transition-all cursor-pointer"
                            >
                              {ALL_PACKAGES.map((pkg) => (
                                <option key={pkg.id} value={pkg.id}>
                                  {pkg.name} ({pkg.price >= 10000 ? "Free Consultation" : formatPrice(pkg.price)})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </th>

                      {/* Package B Select Column */}
                      <th className="pb-6 pl-4 text-left border-b border-pearl-200 w-[240px]">
                        <div className="flex flex-col gap-2">
                          <span className="text-[9px] uppercase tracking-wider text-[#B8922E] font-bold">Slot B</span>
                          <div className="relative">
                            <select
                              value={slotB.id}
                              onChange={(e) => {
                                const found = ALL_PACKAGES.find((p) => p.id === e.target.value);
                                if (found) setSlotB(found);
                              }}
                              className="w-full bg-pearl-100 border border-pearl-300 rounded-xl px-3 py-2 text-xs font-bold text-roope-primary outline-none focus:border-champagne-DEFAULT transition-all cursor-pointer"
                            >
                              {ALL_PACKAGES.map((pkg) => (
                                <option key={pkg.id} value={pkg.id}>
                                  {pkg.name} ({pkg.price >= 10000 ? "Free Consultation" : formatPrice(pkg.price)})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  
                  <tbody>
                    {/* 1. Category Tier Row */}
                    <tr className="border-b border-pearl-100">
                      <td className="py-4 pr-4 font-semibold text-xs text-stone-warm">Tier / Category</td>
                      <td className="py-4 px-4">
                        <span className="text-[10px] bg-champagne-300/40 text-roope-primary px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                          {slotA.categoryName}
                        </span>
                      </td>
                      <td className="py-4 pl-4">
                        <span className="text-[10px] bg-champagne-300/40 text-roope-primary px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                          {slotB.categoryName}
                        </span>
                      </td>
                    </tr>

                    {/* 2. Visual Cover Preview */}
                    <tr className="border-b border-pearl-100">
                      <td className="py-4 pr-4 font-semibold text-xs text-stone-warm">Appearance</td>
                      <td className="py-4 px-4">
                        <div className="relative w-full h-24 rounded-2xl overflow-hidden border border-pearl-200 bg-pearl-200">
                          <Image
                            src={slotA.image}
                            alt={slotA.name}
                            fill
                            className="object-cover"
                            sizes="240px"
                            unoptimized
                          />
                        </div>
                      </td>
                      <td className="py-4 pl-4">
                        <div className="relative w-full h-24 rounded-2xl overflow-hidden border border-pearl-200 bg-pearl-200">
                          <Image
                            src={slotB.image}
                            alt={slotB.name}
                            fill
                            className="object-cover"
                            sizes="240px"
                            unoptimized
                          />
                        </div>
                      </td>
                    </tr>

                    {/* 3. Pricing Comparative */}
                    <tr className="border-b border-pearl-100">
                      <td className="py-4 pr-4 font-semibold text-xs text-stone-warm">Pricing & Savings</td>
                      <td className="py-4 px-4">
                        {slotA.price >= 10000 ? (
                          <div className="flex flex-col">
                            <span className="font-display text-sm font-semibold text-[#B8922E]">
                              Free Consultation
                            </span>
                            <span className="text-[9px] text-stone-warm/50 font-normal">
                              Pricing customized post-consultation
                            </span>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-display text-lg font-light text-roope-primary">
                                {formatPrice(slotA.price)}
                              </span>
                              {slotA.originalPrice && (
                                <span className="text-xs text-stone-warm/40 line-through">
                                  {formatPrice(slotA.originalPrice)}
                                </span>
                              )}
                            </div>
                            {slotA.originalPrice && (
                              <p className="text-[9px] font-bold text-emerald-600 mt-0.5">
                                SAVE {Math.round(((slotA.originalPrice - slotA.price) / slotA.originalPrice) * 100)}%
                              </p>
                            )}
                          </>
                        )}
                      </td>
                      <td className="py-4 pl-4">
                        {slotB.price >= 10000 ? (
                          <div className="flex flex-col">
                            <span className="font-display text-sm font-semibold text-[#B8922E]">
                              Free Consultation
                            </span>
                            <span className="text-[9px] text-stone-warm/50 font-normal">
                              Pricing customized post-consultation
                            </span>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-display text-lg font-light text-roope-primary">
                                {formatPrice(slotB.price)}
                              </span>
                              {slotB.originalPrice && (
                                <span className="text-xs text-stone-warm/40 line-through">
                                  {formatPrice(slotB.originalPrice)}
                                </span>
                              )}
                            </div>
                            {slotB.originalPrice && (
                              <p className="text-[9px] font-bold text-emerald-600 mt-0.5">
                                SAVE {Math.round(((slotB.originalPrice - slotB.price) / slotB.originalPrice) * 100)}%
                              </p>
                            )}
                          </>
                        )}
                      </td>
                    </tr>

                    {/* 4. Service Rating */}
                    <tr className="border-b border-pearl-100">
                      <td className="py-4 pr-4 font-semibold text-xs text-stone-warm">Customer Rating</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                          <span className="text-xs font-bold text-roope-primary">{slotA.rating}</span>
                          <span className="text-[10px] text-stone-warm/50">({slotA.reviews?.toLocaleString()} reviews)</span>
                        </div>
                      </td>
                      <td className="py-4 pl-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                          <span className="text-xs font-bold text-roope-primary">{slotB.rating}</span>
                          <span className="text-[10px] text-stone-warm/50">({slotB.reviews?.toLocaleString()} reviews)</span>
                        </div>
                      </td>
                    </tr>

                    {/* 5. Duration Specification */}
                    <tr className="border-b border-pearl-100">
                      <td className="py-4 pr-4 font-semibold text-xs text-stone-warm">Time Commitment</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-xs text-stone-warm">
                          <Clock className="w-3.5 h-3.5 text-stone-warm/40" />
                          <span>{slotA.duration || "N/A"}</span>
                        </div>
                      </td>
                      <td className="py-4 pl-4">
                        <div className="flex items-center gap-1.5 text-xs text-stone-warm">
                          <Clock className="w-3.5 h-3.5 text-stone-warm/40" />
                          <span>{slotB.duration || "N/A"}</span>
                        </div>
                      </td>
                    </tr>

                    {/* 6. Overview Description */}
                    <tr className="border-b border-pearl-100">
                      <td className="py-4 pr-4 font-semibold text-xs text-stone-warm">Description</td>
                      <td className="py-4 px-4 text-xs text-stone-warm/70 leading-relaxed">
                        {slotA.description}
                      </td>
                      <td className="py-4 pl-4 text-xs text-stone-warm/70 leading-relaxed">
                        {slotB.description}
                      </td>
                    </tr>

                    {/* 7. Included Services Features Checklist */}
                    <tr>
                      <td className="py-4 pr-4 font-semibold text-xs text-stone-warm align-top pt-5">Inclusions</td>
                      <td className="py-4 px-4 align-top pt-5">
                        <ul className="space-y-2.5">
                          {slotA.includes.map((inc, index) => (
                            <li key={index} className="flex gap-2 items-start text-[11px] text-stone-warm/80">
                              <Check className="w-3.5 h-3.5 text-champagne-DEFAULT flex-shrink-0 mt-0.5" />
                              <span className="leading-snug">{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-4 pl-4 align-top pt-5">
                        <ul className="space-y-2.5">
                          {slotB.includes.map((inc, index) => (
                            <li key={index} className="flex gap-2 items-start text-[11px] text-stone-warm/80">
                              <Check className="w-3.5 h-3.5 text-champagne-DEFAULT flex-shrink-0 mt-0.5" />
                              <span className="leading-snug">{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>

                    {/* 8. Bottom Action Rows */}
                    <tr>
                      <td className="pt-6 pr-4 border-t border-pearl-200"></td>
                      
                      {/* Slot A Actions */}
                      <td className="pt-6 px-4 border-t border-pearl-200">
                        {slotA.type === "bridal" ? (
                          <Link
                            href="/bridal"
                            onClick={() => setIsOpen(false)}
                            className="btn-primary w-full py-2.5 text-xs text-center justify-center shadow-xs"
                          >
                            Explore Bridal
                          </Link>
                        ) : (
                          <div>
                            {getQty(slotA.id) === 0 ? (
                              <button
                                onClick={() => onAddToCart(slotA.id)}
                                className="w-full py-2.5 border border-champagne-DEFAULT text-[#B8922E] bg-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-champagne-DEFAULT hover:text-white transition-all cursor-pointer"
                              >
                                Add to Cart
                              </button>
                            ) : (
                              <div className="w-full py-2 px-3 bg-stone-warm rounded-xl flex items-center justify-between text-white text-xs font-bold shadow-xs">
                                <button 
                                  onClick={() => onRemoveFromCart(slotA.id)}
                                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/10 active:scale-90"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span>{getQty(slotA.id)} in Cart</span>
                                <button 
                                  onClick={() => onAddToCart(slotA.id)}
                                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/10 active:scale-90"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Slot B Actions */}
                      <td className="pt-6 pl-4 border-t border-pearl-200">
                        {slotB.type === "bridal" ? (
                          <Link
                            href="/bridal"
                            onClick={() => setIsOpen(false)}
                            className="btn-primary w-full py-2.5 text-xs text-center justify-center shadow-xs"
                          >
                            Explore Bridal
                          </Link>
                        ) : (
                          <div>
                            {getQty(slotB.id) === 0 ? (
                              <button
                                onClick={() => onAddToCart(slotB.id)}
                                className="w-full py-2.5 border border-champagne-DEFAULT text-[#B8922E] bg-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-champagne-DEFAULT hover:text-white transition-all cursor-pointer"
                              >
                                Add to Cart
                              </button>
                            ) : (
                              <div className="w-full py-2 px-3 bg-stone-warm rounded-xl flex items-center justify-between text-white text-xs font-bold shadow-xs">
                                <button 
                                  onClick={() => onRemoveFromCart(slotB.id)}
                                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/10 active:scale-90"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span>{getQty(slotB.id)} in Cart</span>
                                <button 
                                  onClick={() => onAddToCart(slotB.id)}
                                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/10 active:scale-90"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>

              {/* Mobile Columns Helpful Info Badge */}
              <div className="px-6 md:px-8 py-4 border-t border-pearl-200/80 bg-pearl-100 flex items-center gap-2 text-[10px] text-stone-warm/50 font-semibold justify-center">
                <HelpCircle className="w-4 h-4 text-stone-warm/30 flex-shrink-0" />
                <span>Swipe table horizontally to inspect all side-by-side specifications.</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
