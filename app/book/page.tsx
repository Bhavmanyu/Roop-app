"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  ArrowRight, 
  X, 
  Calendar, 
  MapPin, 
  User, 
  CreditCard, 
  Sparkles, 
  Clock, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Tag, 
  AlertCircle,
  ShieldCheck
} from "lucide-react";
import { services } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import AuthModal from "@/components/auth/AuthModal";

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
  { id: "standard", name: "Standard Artist", price: 0, desc: "Professional certified artists", rating: "4.5+", stars: 4 },
  { id: "premium", name: "Premium Artist", price: 1500, desc: "Senior artists with 5+ years experience", rating: "4.7+", stars: 5 },
  { id: "elite", name: "Elite Artist", price: 3000, desc: "Master artists — top 5% network", rating: "4.9+", stars: 5 },
];

const extras = [
  { id: "lashes", label: "Premium Lashes", price: 999, desc: "High-volume mink lashes" },
  { id: "hairstyle", label: "Bridal Hairstyle", price: 999, desc: "Intricate curls or custom updos" },
  { id: "draping", label: "Saree/Dupatta Draping", price: 999, desc: "Perfect pleating & secure styling" },
  { id: "touchup", label: "1-hr Touch-up Artist", price: 999, desc: "On-standby artist support" },
];

const timeSlots = [
  { id: "09:00 AM", label: "09:00 AM", period: "Morning" },
  { id: "10:00 AM", label: "10:00 AM", period: "Morning" },
  { id: "11:00 AM", label: "11:00 AM", period: "Morning" },
  { id: "12:00 PM", label: "12:00 PM", period: "Afternoon" },
  { id: "01:00 PM", label: "01:00 PM", period: "Afternoon" },
  { id: "02:00 PM", label: "02:00 PM", period: "Afternoon" },
  { id: "03:00 PM", label: "03:00 PM", period: "Afternoon" },
  { id: "04:00 PM", label: "04:00 PM", period: "Evening" },
  { id: "05:00 PM", label: "05:00 PM", period: "Evening" },
  { id: "06:00 PM", label: "06:00 PM", period: "Evening" }
];

export default function BookPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Checkout selections
  const [selections, setSelections] = useState({
    occasion: "party",
    date: "",
    time: "",
    address: "",
    city: "Indore",
    artistTier: "standard",
    extras: [] as string[],
    name: "",
    phone: "",
    email: "",
  });

  // Coupons
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponError, setCouponError] = useState("");

  // Booking states
  const [confirmed, setConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const selectedService = services.find((s) => s.id === selectedServiceId);
  const selectedTier = artistTiers.find((t) => t.id === selections.artistTier);
  
  const basePrice = selectedService?.price || 0;
  const tierUpcharge = selectedTier?.price || 0;
  const extrasTotal = selections.extras.reduce((sum, extraId) => {
    const extra = extras.find(e => e.id === extraId);
    return sum + (extra?.price || 0);
  }, 0);

  const subtotal = basePrice + tierUpcharge + extrasTotal;

  // Coupon logic
  let discount = 0;
  if (appliedCoupon === "ROOPE25") {
    discount = Math.round(subtotal * 0.25);
  } else if (appliedCoupon === "WELCOME") {
    discount = Math.min(500, subtotal);
  }
  const total = Math.max(0, subtotal - discount);

  // Dynamic next 7 days list
  const [availableDays, setAvailableDays] = useState<any[]>([]);
  
  useEffect(() => {
    // Get active user session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setSelections(prev => ({
          ...prev,
          email: session.user.email || "",
          name: session.user.user_metadata?.full_name || prev.name || "",
          phone: session.user.user_metadata?.phone || prev.phone || "",
        }));
      }
    });

    // Listen for real-time auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setSelections(prev => ({
          ...prev,
          email: session.user.email || "",
          name: session.user.user_metadata?.full_name || prev.name || "",
          phone: session.user.user_metadata?.phone || prev.phone || "",
        }));
      } else {
        setUser(null);
        setSelections(prev => ({ ...prev, name: "", email: "", phone: "" }));
      }
    });

    const days = [];
    const msInDay = 24 * 60 * 60 * 1000;
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(today.getTime() + i * msInDay);
      const dayName = nextDate.toLocaleDateString("en-US", { weekday: "short" });
      const monthName = nextDate.toLocaleDateString("en-US", { month: "short" });
      const dateNum = nextDate.getDate();
      const year = nextDate.getFullYear();
      const month = String(nextDate.getMonth() + 1).padStart(2, '0');
      const dateStr = String(dateNum).padStart(2, '0');
      const fullDate = `${year}-${month}-${dateStr}`;

      days.push({
        id: fullDate,
        day: dayName,
        date: dateNum,
        month: monthName,
        label: `${dayName}, ${monthName} ${dateNum}`
      });
    }
    setAvailableDays(days);
    if (days[0]) {
      setSelections(prev => ({ ...prev, date: days[0].id }));
    }

    return () => subscription.unsubscribe();
  }, []);

  // Lock body scroll when drawer is open to prevent background scrolling
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDrawerOpen]);

  const categories = [
    { id: "all", label: "All Services" },
    { id: "Bridal", label: "Bridal Makeup" },
    { id: "Event", label: "Event Glam" }
  ];

  const filteredServices = activeCategory === "all" 
    ? services 
    : services.filter(s => s.category === activeCategory);

  const toggleService = (id: string) => {
    if (selectedServiceId === id) {
      setSelectedServiceId(null);
    } else {
      setSelectedServiceId(id);
      // Pre-fill time slot and default selections if empty
      if (!selections.time) {
        setSelections(prev => ({ ...prev, time: "11:00 AM" }));
      }
    }
  };

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (code === "ROOPE25") {
      setAppliedCoupon("ROOPE25");
      setCouponError("");
    } else if (code === "WELCOME") {
      setAppliedCoupon("WELCOME");
      setCouponError("");
    } else {
      setCouponError("Invalid coupon. Try WELCOME or ROOPE25");
      setAppliedCoupon("");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon("");
    setCouponInput("");
    setCouponError("");
  };

  const canSubmit = () => {
    return (
      !!selectedServiceId &&
      !!selections.date &&
      !!selections.time &&
      selections.address.trim().length >= 5 &&
      selections.name.trim().length >= 2 &&
      selections.phone.trim().length >= 8 &&
      selections.email.trim().includes("@")
    );
  };

  const submitBooking = async (paymentMethod: string) => {
    if (!canSubmit()) {
      setSubmitError("Please fill out all required details (Name, Phone, Email, and Address).");
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selections.name,
          phone: selections.phone,
          email: selections.email,
          occasion: selections.occasion,
          service_id: selectedServiceId,
          service_name: selectedService?.name || "",
          service_price: selectedService?.price || 0,
          date: selections.date,
          time: selections.time,
          city: selections.city,
          address: selections.address,
          artist_tier: selections.artistTier,
          extras: selections.extras,
          coupon: appliedCoupon,
          total_amount: total,
          payment_method: paymentMethod,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        setBookingId(json.bookingId);
        setConfirmed(true);
        setIsDrawerOpen(false);
      } else {
        setSubmitError(json.error || "Failed to submit booking. Please try again.");
      }
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-12"
        style={{ background: "linear-gradient(160deg, #F8F6F2 0%, #FAF6EC 100%)" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-lg w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15, type: "spring" }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md"
            style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}
          >
            <Check className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="font-display text-4xl font-light text-roope-primary mb-3">Booking Confirmed!</h1>
          <p className="text-stone-warm mb-1">Your premium artist in Indore is reserved.</p>
          <p className="text-stone-warm text-sm mb-6">A confirmation email has been sent successfully.</p>
          
          <div className="glass rounded-3xl p-6 text-left mb-8 border border-pearl-200 shadow-sm">
            <div className="flex justify-between items-center pb-4 border-b border-pearl-200/60 mb-4">
              <span className="text-xs font-semibold text-stone-warm/70 uppercase tracking-widest">Order ID</span>
              <span className="text-sm font-medium text-roope-primary bg-champagne-300/30 px-3 py-1 rounded-full">
                RP-{bookingId.slice(0, 8).toUpperCase()}
              </span>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs text-stone-warm/50">Service Selected</p>
                {selectedService && <p className="font-medium text-roope-primary text-base">{selectedService.name}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-xs text-stone-warm/50">Date & Time</p>
                  <p className="text-sm font-medium text-roope-primary">{selections.date} at {selections.time}</p>
                </div>
                <div>
                  <p className="text-xs text-stone-warm/50">Artist Tier</p>
                  <p className="text-sm font-medium text-roope-primary uppercase">{selections.artistTier}</p>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-xs text-stone-warm/50">Service Location</p>
                <p className="text-sm font-medium text-roope-primary leading-tight">{selections.address}, Indore</p>
              </div>
            </div>
            
            <div className="mt-5 pt-4 border-t border-pearl-200 flex justify-between items-center">
              <span className="text-sm font-medium text-stone-warm">Grand Total</span>
              <span className="font-display text-2xl font-light text-roope-primary">{formatPrice(total)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary py-4 px-8 justify-center shadow-md">
              Return to Home
            </Link>
            <Link href="/contact" className="btn-secondary py-4 px-8 justify-center border border-pearl-300">
              Need Help? Support
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: "linear-gradient(160deg, #F8F6F2 0%, #FAF6EC 100%)" }}>
      {/* Header */}
      <div className="pt-28 pb-8 px-6">
        <div className="max-w-5xl mx-auto text-center md:text-left">
          <p className="section-label mb-2 tracking-widest uppercase">Luxury Salon at Home</p>
          <h1 className="font-display text-4xl md:text-5xl font-light text-roope-primary mb-3">
            Select Your <span className="text-gradient-gold">Glamour Experience</span>
          </h1>
          <p className="text-stone-warm max-w-2xl text-sm md:text-base leading-relaxed">
            Delivering high-end international makeup artistry directly to your doorstep. Currently servicing premium homes in **Indore**.
          </p>

          {/* Categories Tab Bar */}
          <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-2 border-b border-pearl-200/80 pb-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "text-white shadow-sm"
                    : "text-stone-warm/75 hover:text-roope-primary hover:bg-champagne-300/10"
                }`}
                style={{
                  background: activeCategory === cat.id ? "linear-gradient(135deg, #C9A84C, #B8922E)" : "transparent"
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services List Catalog */}
      <div className="px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {filteredServices.map((service) => {
            const isSelected = selectedServiceId === service.id;
            return (
              <motion.div
                key={service.id}
                layoutId={`service-card-${service.id}`}
                className={`card-luxury overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                  isSelected ? "shadow-gold border-champagne-DEFAULT animate-pulse-subtle" : "border border-pearl-300 hover:border-champagne-300"
                }`}
                style={{
                  background: isSelected 
                    ? "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(201,168,76,0.03) 100%)" 
                    : "rgba(255,255,255,0.8)"
                }}
              >
                <div className="p-6">
                  {/* Tag & Rating */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-champagne-300/30 text-roope-primary px-2.5 py-1 rounded-full">
                      {service.tag || "Exclusive"}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-medium text-stone-warm">
                      <span className="text-gold">★</span>
                      <span>{service.rating}</span>
                      <span className="text-stone-warm/50">({service.reviews})</span>
                    </div>
                  </div>

                  <h3 className="font-display text-xl font-light text-roope-primary mb-1.5">{service.name}</h3>
                  <p className="text-xs text-stone-warm/80 leading-relaxed mb-4">{service.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {service.includes?.slice(0, 4).map((inc, i) => (
                      <span key={i} className="text-[10px] bg-pearl-200/50 text-stone-warm px-2 py-0.5 rounded-md border border-pearl-300/30">
                        ✓ {inc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="px-6 pb-6 pt-4 border-t border-pearl-200/50 flex justify-between items-center bg-pearl-100/10">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-xl font-light text-roope-primary">{formatPrice(service.price)}</span>
                      {service.originalPrice && (
                        <span className="text-xs text-stone-warm/50 line-through">{formatPrice(service.originalPrice)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-stone-warm/60 mt-0.5">
                      <Clock className="w-3 h-3 text-stone-warm/40" />
                      <span>{service.duration}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleService(service.id)}
                    className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                      isSelected 
                        ? "bg-stone-warm text-white" 
                        : "border border-champagne-DEFAULT text-roope-primary hover:bg-champagne-DEFAULT hover:text-white"
                    }`}
                  >
                    {isSelected ? "Selected" : "Add"}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Cart Bar */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-pearl-200 shadow-xl px-6 py-4"
          >
            <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-champagne-300/20 text-roope-primary">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-stone-warm/60 uppercase tracking-widest">Your Package</p>
                  <p className="text-sm font-semibold text-roope-primary truncate max-w-[200px] md:max-w-md">
                    {selectedService.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] text-stone-warm/50 uppercase tracking-wider">Subtotal</p>
                  <p className="font-display text-xl font-light text-roope-primary">{formatPrice(basePrice)}</p>
                </div>

                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="btn-primary py-3 px-6 text-xs uppercase tracking-widest font-semibold flex items-center gap-2 shadow-md"
                >
                  Proceed to Book <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sliding Checkout Drawer Panel */}
      <AnimatePresence>
        {isDrawerOpen && selectedService && (
          <>
            {/* Dark Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black z-50 pointer-events-auto"
            />

            {/* Sliding Drawer Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 w-full sm:max-w-lg h-screen max-h-screen bg-[#FAF9F6] shadow-2xl z-50 flex flex-col pointer-events-auto overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-pearl-200 bg-white flex justify-between items-center">
                <div>
                  <h2 className="font-display text-2xl font-light text-roope-primary">Complete Booking</h2>
                  <div className="flex items-center gap-1 text-[10px] text-stone-warm/60 uppercase font-bold tracking-wider mt-0.5">
                    <MapPin className="w-3 h-3 text-gold" />
                    <span>Indore Premium Service</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-8 h-8 rounded-full border border-pearl-200 flex items-center justify-center text-stone-warm hover:text-roope-primary hover:border-stone-warm/30 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body Scroll */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 min-h-0 max-h-[calc(100vh-190px)]">
                {/* Auth Pre-fill Promotion Banner */}
                {!user && (
                  <div className="p-3.5 bg-champagne-300/10 border border-champagne-DEFAULT/20 rounded-2xl flex items-center justify-between gap-3 shadow-sm">
                    <div className="flex gap-2.5 items-start">
                      <Sparkles className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-roope-primary uppercase tracking-wide">Sign in for faster checkout</p>
                        <p className="text-[9px] text-stone-warm/75 mt-0.5">Auto-fill details & track your scheduled artist arrival.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="text-[10px] font-bold uppercase tracking-wider text-gold hover:underline cursor-pointer flex-shrink-0"
                    >
                      Sign In
                    </button>
                  </div>
                )}

                {/* 1. Selected Primary Service Summary */}
                <div className="bg-white rounded-3xl p-5 border border-pearl-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-bold text-stone-warm/60 uppercase tracking-widest bg-pearl-200/60 px-2 py-0.5 rounded">
                        Selected Package
                      </span>
                      <h4 className="font-semibold text-roope-primary mt-1 text-base leading-snug">{selectedService.name}</h4>
                      <p className="text-xs text-stone-warm/60 mt-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-stone-warm/40" /> {selectedService.duration}
                      </p>
                    </div>
                    <span className="font-display text-lg font-light text-roope-primary">
                      {formatPrice(selectedService.price)}
                    </span>
                  </div>
                </div>

                {/* 2. Add-on Recommendations (Extras) */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-warm/70 mb-3.5 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-gold" /> Frequently Added Together
                  </h3>
                  <div className="space-y-2.5">
                    {extras.map((extra) => {
                      const isExtraSelected = selections.extras.includes(extra.id);
                      return (
                        <div
                          key={extra.id}
                          className={`p-4 rounded-2xl flex items-center justify-between border transition-all duration-200 ${
                            isExtraSelected 
                              ? "bg-champagne-300/5 border-champagne-DEFAULT" 
                              : "bg-white border-pearl-200 hover:border-champagne-300/50"
                          }`}
                        >
                          <div>
                            <p className="text-xs font-semibold text-roope-primary">{extra.label}</p>
                            <p className="text-[10px] text-stone-warm/60 mt-0.5">{extra.desc}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-medium text-stone-warm">+{formatPrice(extra.price)}</span>
                            <button
                              onClick={() => {
                                const next = isExtraSelected
                                  ? selections.extras.filter((e) => e !== extra.id)
                                  : [...selections.extras, extra.id];
                                setSelections({ ...selections, extras: next });
                              }}
                              className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                                isExtraSelected 
                                  ? "bg-stone-warm border-stone-warm text-white" 
                                  : "border-champagne-DEFAULT text-roope-primary hover:bg-champagne-DEFAULT hover:text-white"
                              }`}
                            >
                              {isExtraSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Interactive Artist Tier Choice (Defaulting to Standard) */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-warm/70 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-gold" /> Select Artist Tier
                    </h3>
                    <span className="text-[10px] text-gold font-semibold uppercase tracking-wider bg-gold/10 px-2 py-0.5 rounded">
                      Standard Included
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {artistTiers.map((tier) => {
                      const isTierActive = selections.artistTier === tier.id;
                      return (
                        <button
                          key={tier.id}
                          onClick={() => setSelections({ ...selections, artistTier: tier.id })}
                          className={`p-3.5 rounded-2xl flex flex-col justify-between border text-left transition-all duration-200 ${
                            isTierActive 
                              ? "bg-white shadow-sm shadow-gold/20 border-champagne-DEFAULT animate-pulse-subtle" 
                              : "bg-white border-pearl-200 hover:border-champagne-300/30"
                          }`}
                        >
                          <div>
                            <p className="text-[10px] font-bold text-roope-primary truncate">{tier.name}</p>
                            <p className="text-[9px] text-stone-warm/50 mt-0.5 line-clamp-2 leading-snug">{tier.desc}</p>
                          </div>
                          
                          <div className="mt-4 pt-2 border-t border-pearl-200/50 w-full flex flex-col">
                            <span className="text-[9px] font-semibold text-stone-warm mb-1">
                              {tier.rating} Rated
                            </span>
                            <span className="text-[10px] font-bold text-roope-primary">
                              {tier.price === 0 ? "Included" : `+${formatPrice(tier.price)}`}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Schedule Picker (Dynamic Horizontal scroll for next 7 days) */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-warm/70 mb-3 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gold" /> Pick Schedule Date
                  </h3>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
                    {availableDays.map((d) => {
                      const isDateActive = selections.date === d.id;
                      return (
                        <button
                          key={d.id}
                          onClick={() => setSelections({ ...selections, date: d.id })}
                          className={`flex-shrink-0 w-16 p-3 rounded-2xl border text-center transition-all duration-200 snap-start ${
                            isDateActive 
                              ? "bg-stone-warm border-stone-warm text-white shadow" 
                              : "bg-white border-pearl-200 text-stone-warm hover:border-champagne-300"
                          }`}
                        >
                          <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">{d.day}</p>
                          <p className="text-lg font-display font-light my-0.5 leading-none">{d.date}</p>
                          <p className="text-[9px] uppercase tracking-wider font-semibold opacity-60">{d.month}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Horizontal Time Slots (Grouped by morning, afternoon, evening) */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-warm/70 mb-3 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gold" /> Choose Time Slot
                  </h3>
                  <div className="space-y-4">
                    {["Morning", "Afternoon", "Evening"].map((group) => {
                      const groupSlots = timeSlots.filter(t => t.period === group);
                      return (
                        <div key={group}>
                          <p className="text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1.5">{group}</p>
                          <div className="grid grid-cols-4 gap-1.5">
                            {groupSlots.map((slot) => {
                              const isTimeActive = selections.time === slot.id;
                              return (
                                <button
                                  key={slot.id}
                                  onClick={() => setSelections({ ...selections, time: slot.id })}
                                  className={`py-2 rounded-xl text-center text-xs font-medium border transition-all duration-200 ${
                                    isTimeActive 
                                      ? "bg-white shadow border-champagne-DEFAULT text-roope-primary" 
                                      : "bg-white border-pearl-200 text-stone-warm hover:border-champagne-300/50"
                                  }`}
                                >
                                  {slot.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 6. Occasion Select Dropdown */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-warm/70 mb-3">
                    Select the Occasion
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {occasions.slice(0, 6).map((occ) => {
                      const isOccActive = selections.occasion === occ.id;
                      return (
                        <button
                          key={occ.id}
                          onClick={() => setSelections({ ...selections, occasion: occ.id })}
                          className={`p-3 rounded-2xl flex items-center gap-2.5 text-xs font-semibold border transition-all duration-200 ${
                            isOccActive 
                              ? "bg-champagne-300/10 border-champagne-DEFAULT text-roope-primary" 
                              : "bg-white border-pearl-200 text-stone-warm/80 hover:border-champagne-300"
                          }`}
                        >
                          <span className="text-lg">{occ.icon}</span>
                          <span>{occ.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 7. Address Details (Locked to Indore) */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-warm/70 mb-3 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gold" /> Service Address (Indore)
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-white rounded-2xl p-4 border border-pearl-200 flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-stone-warm/60" />
                      <div className="text-xs font-semibold text-roope-primary">
                        Indore, Madhya Pradesh <span className="text-[10px] text-stone-warm font-normal bg-pearl-200/50 px-2 py-0.5 rounded-full ml-2">Locked</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1.5">Full Address (Including Landmarks)</label>
                      <textarea
                        value={selections.address}
                        onChange={(e) => setSelections({ ...selections, address: e.target.value })}
                        placeholder="House No, Apartment Name, Street Name, landmark..."
                        rows={2}
                        className="w-full bg-white rounded-2xl border border-pearl-200 p-4 text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT transition-colors resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 8. Personal Details */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-warm/70 mb-3 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-gold" /> Your Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={selections.name}
                        onChange={(e) => setSelections({ ...selections, name: e.target.value })}
                        placeholder="Enter your name"
                        className="w-full bg-white rounded-2xl border border-pearl-200 px-4 py-3.5 text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1.5">Phone Number</label>
                        <input
                          type="tel"
                          value={selections.phone}
                          onChange={(e) => setSelections({ ...selections, phone: e.target.value })}
                          placeholder="Phone number"
                          className="w-full bg-white rounded-2xl border border-pearl-200 px-4 py-3.5 text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1.5">Email Address</label>
                        <input
                          type="email"
                          value={selections.email}
                          onChange={(e) => setSelections({ ...selections, email: e.target.value })}
                          placeholder="Email"
                          className="w-full bg-white rounded-2xl border border-pearl-200 px-4 py-3.5 text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 9. Coupon Codes Section */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-warm/70 mb-3 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-gold" /> Coupon Offers
                  </h3>
                  
                  {appliedCoupon ? (
                    <div className="bg-champagne-300/10 border border-champagne-DEFAULT rounded-2xl px-4 py-3.5 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-gold" />
                        <div>
                          <p className="text-xs font-bold text-roope-primary uppercase tracking-wide">
                            {appliedCoupon} APPLIED
                          </p>
                          <p className="text-[10px] text-stone-warm/70">
                            {appliedCoupon === "ROOPE25" ? "25% discount off total bill" : "₹500 flat discount applied"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-stone-warm hover:text-red-500 font-semibold text-xs tracking-wider uppercase pl-2"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          placeholder="Try WELCOME or ROOPE25"
                          className="w-full bg-white rounded-2xl border border-pearl-200 px-4 py-3.5 text-xs text-roope-primary uppercase outline-none focus:border-champagne-DEFAULT transition-colors"
                        />
                      </div>
                      <button
                        onClick={handleApplyCoupon}
                        className="btn-secondary px-5 py-3 rounded-2xl border border-pearl-300 text-xs uppercase tracking-wider"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  {couponError && <p className="text-red-500 text-[10px] mt-1.5 font-medium">{couponError}</p>}
                </div>

                {/* 10. Detailed invoice breakdown & bill summary */}
                <div className="bg-white rounded-3xl p-5 border border-pearl-200 shadow-sm space-y-3.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-roope-primary border-b border-pearl-200/60 pb-2">
                    Payment Invoice Details
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-stone-warm">
                      <span>Service Base price</span>
                      <span className="font-semibold text-roope-primary">{formatPrice(basePrice)}</span>
                    </div>

                    {selections.artistTier !== "standard" && tierUpcharge > 0 && (
                      <div className="flex justify-between text-stone-warm">
                        <span>Artist upgrade ({selectedTier?.name})</span>
                        <span className="font-semibold text-roope-primary">+{formatPrice(tierUpcharge)}</span>
                      </div>
                    )}

                    {selections.extras.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-stone-warm font-medium">Add-ons (Extras)</p>
                        {selections.extras.map((extraId) => {
                          const ex = extras.find(e => e.id === extraId);
                          return ex ? (
                            <div key={extraId} className="flex justify-between pl-3 text-stone-warm/70 text-[11px]">
                              <span>• {ex.label}</span>
                              <span>+{formatPrice(ex.price)}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    )}

                    {discount > 0 && (
                      <div className="flex justify-between text-stone-warm bg-champagne-300/10 px-2 py-1 rounded">
                        <span className="font-medium">Coupon discount ({appliedCoupon})</span>
                        <span className="font-semibold text-[#B8922E]">-{formatPrice(discount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-stone-warm pt-3 border-t border-pearl-200/80 text-sm font-semibold">
                      <span className="text-roope-primary">Grand Total</span>
                      <span className="text-gradient-gold text-lg">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-champagne-300/10 rounded-2xl flex gap-2.5 items-start mt-4">
                    <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-stone-warm/80 leading-relaxed">
                      **Roopé Guarantee**: Sanitized makeup kits, genuine international brand products, and 100% on-time arrival. Free cancellation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Drawer Sticky Footer with payment method trigger buttons */}
              <div className="p-6 border-t border-pearl-200 bg-white shadow-inner flex flex-col gap-3">
                {submitError && (
                  <div className="p-3 bg-red-500/5 border border-red-500/15 rounded-xl flex gap-2 items-center text-red-600 text-xs">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <p className="text-[10px] font-bold text-stone-warm/50 text-center uppercase tracking-widest">
                  Select payment method to book
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    disabled={submitting || !canSubmit()}
                    onClick={() => submitBooking("cod")}
                    className="py-3 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider text-roope-primary border border-pearl-300 hover:border-champagne-DEFAULT bg-pearl-200/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Pay at Service
                  </button>
                  <button
                    disabled={submitting || !canSubmit()}
                    onClick={() => submitBooking("online")}
                    className="py-3 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider text-white shadow disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}
                  >
                    Online UPI / Card
                  </button>
                </div>

                {submitting && (
                  <p className="text-center text-[10px] text-gold font-bold uppercase tracking-widest mt-1">
                    Scheduling artist in Indore...
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Auth Modal Trigger for Sign In Banner */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
