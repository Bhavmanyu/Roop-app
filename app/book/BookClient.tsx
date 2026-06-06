"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Clock,
  MapPin,
  User,
  Sparkles,
  ShoppingBag,
  Tag,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { services, extras } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import AuthModal from "@/components/auth/AuthModal";
import VisualSchedulingCalendar from "@/components/book/VisualSchedulingCalendar";

export default function BookPage() {
  // ── View state: "services" | "checkout" | "confirmed" ─────────────────────
  const [view, setView] = useState<"services" | "checkout" | "confirmed">("services");

  // ── Services selection ─────────────────────────────────────────────────────
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<{ [id: string]: number }>({});

  // ── Auth ───────────────────────────────────────────────────────────────────
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // ── Checkout form ──────────────────────────────────────────────────────────
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

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponError, setCouponError] = useState("");

  const [bookingId, setBookingId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // ── Derived pricing ────────────────────────────────────────────────────────
  const selectedService = services.find((s) => s.id === selectedServiceId);

  const basePrice =
    Object.keys(cartItems).length > 0
      ? Object.entries(cartItems).reduce((sum, [id, qty]) => {
          const svc = services.find((s) => s.id === id);
          return sum + (svc ? svc.price * qty : 0);
        }, 0)
      : selectedService?.price || 0;

  const extrasTotal = selections.extras.reduce((sum, extraId) => {
    const extra = extras.find((e) => e.id === extraId);
    return sum + (extra?.price || 0);
  }, 0);

  const subtotal = basePrice + extrasTotal;
  let discount = 0;
  if (appliedCoupon === "ROOPE25") discount = Math.round(subtotal * 0.25);
  else if (appliedCoupon === "WELCOME") discount = Math.min(500, subtotal);
  const total = Math.max(0, subtotal - discount);

  const categories = [
    { id: "all", label: "All Services" },
    { id: "Bridal", label: "Bridal Makeup" },
    { id: "Event", label: "Event Glam" },
  ];

  const filteredServices =
    activeCategory === "all"
      ? services
      : services.filter((s) => s.category === activeCategory);

  // ── Bootstrap ──────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setSelections((prev) => ({
          ...prev,
          email: session.user.email || "",
          name: session.user.user_metadata?.full_name || prev.name || "",
          phone: session.user.user_metadata?.phone || prev.phone || "",
        }));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setSelections((prev) => ({
          ...prev,
          email: session.user.email || "",
          name: session.user.user_metadata?.full_name || prev.name || "",
          phone: session.user.user_metadata?.phone || prev.phone || "",
        }));
      } else {
        setUser(null);
        setSelections((prev) => ({ ...prev, name: "", email: "", phone: "" }));
      }
    });

    // Restore cart from localStorage
    const savedCart = localStorage.getItem("roope-cart");
    const query = new URLSearchParams(window.location.search);
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Object.keys(parsed).length > 0) {
          setCartItems(parsed);
          setSelectedServiceId(Object.keys(parsed)[0]);
          // Jump straight to checkout if coming from cart
          if (query.get("checkout") === "direct") setView("checkout");
        }
      } catch {}
    }

    const savedLoc = localStorage.getItem("roope-location");
    if (savedLoc) setSelections((prev) => ({ ...prev, address: savedLoc }));

    // Razorpay SDK
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      subscription.unsubscribe();
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const toggleService = (id: string) => {
    setSelectedServiceId((prev) => (prev === id ? null : id));
  };

  const handleProceedToCheckout = () => {
    if (!selectedServiceId) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    setView("checkout");
  };

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (code === "ROOPE25") { setAppliedCoupon("ROOPE25"); setCouponError(""); }
    else if (code === "WELCOME") { setAppliedCoupon("WELCOME"); setCouponError(""); }
    else { setCouponError("Invalid coupon. Try WELCOME or ROOPE25"); setAppliedCoupon(""); }
  };

  const canSubmit = () =>
    (!!selectedServiceId || Object.keys(cartItems).length > 0) &&
    !!selections.date &&
    !!selections.time &&
    selections.address.trim().length >= 5 &&
    selections.name.trim().length >= 2 &&
    selections.phone.trim().length >= 8 &&
    selections.email.trim().includes("@");

  const submitBooking = async (paymentMethod: string) => {
    if (!canSubmit()) {
      setSubmitError("Please fill out all required details (Name, Phone, Email, and Address).");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    const finalServiceId = Object.keys(cartItems).length > 0 ? "cart" : (selectedServiceId || "");
    const finalServiceName =
      Object.keys(cartItems).length > 0
        ? Object.entries(cartItems)
            .map(([id, qty]) => { const svc = services.find((s) => s.id === id); return svc ? `${svc.name} (x${qty})` : ""; })
            .filter(Boolean).join(", ").slice(0, 148)
        : selectedService?.name || "";

    if (paymentMethod === "online") {
      try {
        const res = await fetch("/api/payment/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: selections.name, phone: selections.phone, email: selections.email, occasion: selections.occasion, service_id: finalServiceId, service_name: finalServiceName, date: selections.date, time: selections.time, city: selections.city, address: selections.address, artist_tier: selections.artistTier, extras: selections.extras, coupon: appliedCoupon, cartItems }),
        });
        const json = await res.json();
        if (!res.ok) { setSubmitError(json.error || "Failed to initialize payment."); setSubmitting(false); return; }

        const rzp = new (window as any).Razorpay({
          key: json.keyId, amount: json.amount, currency: json.currency,
          name: "Roopé Luxury Beauty", description: finalServiceName.slice(0, 240),
          image: "/images/favicon.ico", order_id: json.razorpayOrderId,
          handler: async (response: any) => {
            try {
              setSubmitting(true);
              const verifyRes = await fetch("/api/payment/verify", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ booking_id: json.bookingId, razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature }),
              });
              const verifyJson = await verifyRes.json();
              if (verifyRes.ok) {
                localStorage.removeItem("roope-cart");
                setCartItems({});
                setBookingId(json.bookingId);
                setView("confirmed");
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                setSubmitError(verifyJson.error || "Payment verification failed.");
              }
            } catch { setSubmitError("Verification error. Please contact support."); }
            finally { setSubmitting(false); }
          },
          prefill: { name: selections.name, email: selections.email, contact: selections.phone },
          notes: { address: selections.address },
          theme: { color: "#B8922E" },
        });
        rzp.on("payment.failed", (r: any) => { setSubmitError(r.error.description || "Payment failed."); setSubmitting(false); });
        rzp.open();
      } catch { setSubmitError("Network error. Unable to load payment."); setSubmitting(false); }
    } else {
      try {
        const res = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: selections.name, phone: selections.phone, email: selections.email, occasion: selections.occasion, service_id: finalServiceId, service_name: finalServiceName, service_price: basePrice, date: selections.date, time: selections.time, city: selections.city, address: selections.address, artist_tier: selections.artistTier, extras: selections.extras, coupon: appliedCoupon, total_amount: total, payment_method: paymentMethod }),
        });
        const json = await res.json();
        if (res.ok) {
          localStorage.removeItem("roope-cart");
          setCartItems({});
          setBookingId(json.bookingId);
          setView("confirmed");
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          setSubmitError(json.error || "Failed to submit booking.");
        }
      } catch { setSubmitError("Network error. Please try again."); }
      finally { setSubmitting(false); }
    }
  };

  // ── VIEW: CONFIRMED ────────────────────────────────────────────────────────
  if (view === "confirmed") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16"
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
          <h1 className="font-display text-2xl md:text-4xl font-semibold md:font-light text-roope-primary mb-3">Booking Confirmed!</h1>
          <p className="text-stone-warm mb-1">Your premium artist in Indore is reserved.</p>
          <p className="text-stone-warm text-sm mb-8">A confirmation email has been sent successfully.</p>

          <div className="glass rounded-3xl p-6 text-left mb-8 border border-pearl-200 shadow-sm">
            <div className="flex justify-between items-center pb-4 border-b border-pearl-200/60 mb-4">
              <span className="text-xs font-semibold text-stone-warm/70 uppercase tracking-widest">Order ID</span>
              <span className="text-sm font-medium text-roope-primary bg-champagne-300/30 px-3 py-1 rounded-full">
                RP-{bookingId.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-stone-warm/50">Service(s)</p>
                {Object.keys(cartItems).length > 0 ? (
                  <div className="space-y-0.5 mt-1">
                    {Object.entries(cartItems).map(([id, qty]) => {
                      const svc = services.find((s) => s.id === id);
                      return svc ? <p key={id} className="font-medium text-roope-primary">{svc.name} <span className="text-gold font-bold">x{qty}</span></p> : null;
                    })}
                  </div>
                ) : <p className="font-medium text-roope-primary">{selectedService?.name}</p>}
              </div>
              <div>
                <p className="text-xs text-stone-warm/50">Date &amp; Time</p>
                <p className="font-medium text-roope-primary">{selections.date} at {selections.time}</p>
              </div>
              <div>
                <p className="text-xs text-stone-warm/50">Location</p>
                <p className="font-medium text-roope-primary">{selections.address}, Indore</p>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-pearl-200 flex justify-between items-center">
              <span className="text-sm font-medium text-stone-warm">Grand Total</span>
              <span className="font-display text-lg font-semibold md:text-2xl md:font-light text-roope-primary">{formatPrice(total)}</span>
            </div>
          </div>


          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary py-2.5 px-5 text-xs md:py-4 md:px-8 md:text-sm justify-center shadow-md">Return to Home</Link>
            <Link href="/contact" className="btn-secondary py-2.5 px-5 text-xs md:py-4 md:px-8 md:text-sm justify-center border border-pearl-300">Need Help? Support</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── VIEW: CHECKOUT ─────────────────────────────────────────────────────────
  if (view === "checkout") {
    return (
      <motion.div
        key="checkout"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="min-h-screen"
        style={{ background: "linear-gradient(160deg, #F8F6F2 0%, #FAF6EC 100%)" }}
      >
        {/* Checkout Page Header */}
        <div className="pt-20 pb-3 px-4 md:pt-24 md:pb-6 md:px-6 border-b border-pearl-200/60 bg-white/70 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-stone-warm/50 mb-3 md:mb-4">
              <button onClick={() => { setView("services"); window.scrollTo({ top: 0 }); }} className="hover:text-roope-primary transition-colors">
                Services
              </button>
              <ChevronRight className="w-3 h-3" />
              <span className="text-roope-primary">Complete Booking</span>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <button
                onClick={() => { setView("services"); window.scrollTo({ top: 0 }); }}
                className="w-7 h-7 md:w-9 md:h-9 rounded-full border border-pearl-200 flex items-center justify-center text-stone-warm hover:text-roope-primary hover:border-stone-warm/30 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>
              <div>
                <h1 className="font-display text-lg font-semibold md:text-3xl md:font-light text-roope-primary">Complete Booking</h1>
                <div className="flex items-center gap-1 text-[9px] md:text-[10px] text-stone-warm/60 uppercase font-bold tracking-wider mt-0.5">
                  <MapPin className="w-3 h-3 text-gold" />
                  <span>Indore Premium Service</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="max-w-6xl mx-auto px-4 py-4 lg:px-6 lg:py-10 grid lg:grid-cols-[380px_1fr] gap-4 lg:gap-8 items-start">

          {/* ── Left: Order Summary (sticky on desktop) ───────────────────── */}
          <div className="space-y-5 lg:sticky lg:top-24">
            {/* Auth banner */}
            {!user && (
              <div className="p-3 md:p-4 bg-champagne-300/10 border border-champagne-DEFAULT/20 rounded-2xl flex items-center justify-between gap-3 shadow-sm">
                <div className="flex gap-2.5 items-start">
                  <Sparkles className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-roope-primary uppercase tracking-wide">Sign in for faster checkout</p>
                    <p className="text-[8.5px] md:text-[9px] text-stone-warm/75 mt-0.5">Auto-fill details &amp; track your scheduled artist arrival.</p>
                  </div>
                </div>
                <button onClick={() => setIsAuthModalOpen(true)} className="text-[10px] font-bold uppercase tracking-wider text-gold hover:underline cursor-pointer flex-shrink-0">
                  Sign In
                </button>
              </div>
            )}

            {/* Selected Services */}
            <div className="bg-white rounded-3xl p-3.5 md:p-5 border border-pearl-200 shadow-sm">
              <span className="text-[9px] font-bold text-stone-warm/60 uppercase tracking-widest bg-pearl-200/60 px-2 py-0.5 rounded block mb-3 w-max">
                Selected Service(s)
              </span>
              {Object.keys(cartItems).length > 0 ? (
                <div className="space-y-3 divide-y divide-pearl-100">
                  {Object.entries(cartItems).map(([id, qty]) => {
                    const svc = services.find((s) => s.id === id);
                    if (!svc) return null;
                    return (
                      <div key={id} className="flex justify-between items-start pt-3 first:pt-0">
                        <div className="min-w-0 pr-3">
                          <h4 className="font-semibold text-roope-primary text-xs md:text-sm leading-snug">{svc.name} <span className="text-gold font-bold ml-1 text-xs">x{qty}</span></h4>
                          <p className="text-[10px] md:text-xs text-stone-warm/60 mt-1">{svc.duration}</p>
                        </div>
                        <span className="font-display text-sm md:text-base font-semibold md:font-light text-roope-primary flex-shrink-0">{formatPrice(svc.price * qty)}</span>
                      </div>
                    );
                  })}
                </div>
              ) : selectedService ? (
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-roope-primary text-xs md:text-sm leading-snug">{selectedService.name}</h4>
                    <p className="text-[10px] md:text-xs text-stone-warm/60 mt-1">{selectedService.duration}</p>
                  </div>
                  <span className="font-display text-sm md:text-base font-semibold md:font-light text-roope-primary">{formatPrice(selectedService.price)}</span>
                </div>
              ) : null}
            </div>

            {/* Add-ons */}
            <div>
              <h3 className="text-[10.5px] md:text-xs font-bold uppercase tracking-wider text-stone-warm/70 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold" /> Frequently Added Together
              </h3>
              <div className="space-y-2">
                {extras.map((extra) => {
                  const isSelected = selections.extras.includes(extra.id);
                  return (
                    <div key={extra.id} className={`p-2.5 md:p-4 rounded-2xl flex items-center justify-between border transition-all duration-200 ${isSelected ? "bg-champagne-300/5 border-champagne-DEFAULT" : "bg-white border-pearl-200 hover:border-champagne-300/50"}`}>
                      <div>
                        <p className="text-[11px] md:text-xs font-semibold text-roope-primary">{extra.label}</p>
                        <p className="text-[9.5px] md:text-[10px] text-stone-warm/60 mt-0.5">{extra.desc}</p>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] md:text-xs font-medium text-stone-warm">+{formatPrice(extra.price)}</span>
                        <button
                          onClick={() => {
                            const next = isSelected ? selections.extras.filter((e) => e !== extra.id) : [...selections.extras, extra.id];
                            setSelections({ ...selections, extras: next });
                          }}
                          className={`w-5.5 h-5.5 md:w-7 md:h-7 rounded-full flex items-center justify-center border transition-all text-xs font-bold ${isSelected ? "bg-stone-warm border-stone-warm text-white" : "border-champagne-DEFAULT text-roope-primary hover:bg-champagne-DEFAULT hover:text-white"}`}
                        >
                          {isSelected ? "✓" : "+"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Invoice */}
            <div className="bg-white rounded-3xl p-3.5 md:p-5 border border-pearl-200 shadow-sm space-y-3">
              <h4 className="text-[10.5px] md:text-xs font-bold uppercase tracking-wider text-roope-primary border-b border-pearl-200/60 pb-2">Invoice Summary</h4>
              <div className="space-y-2 text-[11px] md:text-xs">
                <div className="flex justify-between text-stone-warm">
                  <span>Service Base Price</span>
                  <span className="font-semibold text-roope-primary">{formatPrice(basePrice)}</span>
                </div>
                {selections.extras.length > 0 && (
                  <div className="space-y-1">
                    {selections.extras.map((extraId) => {
                      const ex = extras.find((e) => e.id === extraId);
                      return ex ? (
                        <div key={extraId} className="flex justify-between pl-3 text-stone-warm/70">
                          <span>• {ex.label}</span>
                          <span>+{formatPrice(ex.price)}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-stone-warm bg-champagne-300/10 px-2 py-1 rounded">
                    <span className="font-medium">Coupon ({appliedCoupon})</span>
                    <span className="font-semibold text-[#B8922E]">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-warm pt-3 border-t border-pearl-200/80 text-[11px] md:text-sm font-semibold">
                  <span className="text-roope-primary">Grand Total</span>
                  <span className="text-gradient-gold text-sm md:text-lg">{formatPrice(total)}</span>
                </div>
              </div>
              <div className="p-2.5 md:p-3 bg-champagne-300/10 rounded-2xl flex gap-2.5 items-start">
                <ShieldCheck className="w-3.5 h-3.5 text-gold flex-shrink-0 mt-0.5" />
                <p className="text-[9px] md:text-[10px] text-stone-warm/80 leading-relaxed">
                  <strong>Roopé Guarantee</strong>: Sanitized kits, genuine international brands, 100% on-time arrival. Free cancellation.
                </p>
              </div>
            </div>
          </div>

          {/* ── Right: Form ────────────────────────────────────────────────── */}
          <div className="space-y-8">
            {/* Schedule */}
            <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border border-pearl-200 shadow-sm">
              <VisualSchedulingCalendar
                selectedDate={selections.date}
                selectedTime={selections.time}
                selectedOccasion={selections.occasion}
                onSelectDate={(d) => setSelections((prev) => ({ ...prev, date: d }))}
                onSelectTime={(t) => setSelections((prev) => ({ ...prev, time: t }))}
                onSelectOccasion={(o) => setSelections((prev) => ({ ...prev, occasion: o }))}
              />
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border border-pearl-200 shadow-sm space-y-3.5 md:space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-warm/70 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-gold" /> Service Address (Indore)
              </h3>
              <div className="bg-pearl-100/50 rounded-2xl p-3 md:p-4 border border-pearl-200 flex items-center gap-3">
                <MapPin className="w-4 h-4 text-stone-warm/60" />
                <div className="text-xs font-semibold text-roope-primary">
                  Indore, Madhya Pradesh
                  <span className="text-[10px] text-stone-warm font-normal bg-pearl-200/50 px-2 py-0.5 rounded-full ml-2">Locked</span>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1.5">Full Address (Including Landmarks)</label>
                <textarea
                  value={selections.address}
                  onChange={(e) => setSelections({ ...selections, address: e.target.value })}
                  placeholder="House No, Apartment Name, Street Name, landmark..."
                  rows={3}
                  className="w-full bg-white rounded-2xl border border-pearl-200 p-3 md:p-4 text-[11px] md:text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT transition-colors resize-none"
                />
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border border-pearl-200 shadow-sm space-y-3.5 md:space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-warm/70 flex items-center gap-1.5">
                <User className="w-4 h-4 text-gold" /> Your Contact Information
              </h3>
              <div>
                <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1.5">Full Name</label>
                <input type="text" value={selections.name} onChange={(e) => setSelections({ ...selections, name: e.target.value })} placeholder="Enter your name"
                  className="w-full bg-white rounded-2xl border border-pearl-200 px-3 py-2.5 md:px-4 md:py-3.5 text-[11px] md:text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1.5">Phone Number</label>
                  <input type="tel" value={selections.phone} onChange={(e) => setSelections({ ...selections, phone: e.target.value })} placeholder="Phone number"
                    className="w-full bg-white rounded-2xl border border-pearl-200 px-3 py-2.5 md:px-4 md:py-3.5 text-[11px] md:text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1.5">Email Address</label>
                  <input type="email" value={selections.email} onChange={(e) => setSelections({ ...selections, email: e.target.value })} placeholder="Email"
                    className="w-full bg-white rounded-2xl border border-pearl-200 px-3 py-2.5 md:px-4 md:py-3.5 text-[11px] md:text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT transition-colors" />
                </div>
              </div>
            </div>

            {/* Coupon */}
            <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border border-pearl-200 shadow-sm space-y-2.5 md:space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-warm/70 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-gold" /> Coupon Offers
              </h3>
              {appliedCoupon ? (
                <div className="bg-champagne-300/10 border border-champagne-DEFAULT rounded-2xl px-3 py-2.5 md:px-4 md:py-3.5 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gold" />
                    <div>
                      <p className="text-xs font-bold text-roope-primary uppercase tracking-wide">{appliedCoupon} APPLIED</p>
                      <p className="text-[10px] text-stone-warm/70">{appliedCoupon === "ROOPE25" ? "25% discount off total bill" : "₹500 flat discount applied"}</p>
                    </div>
                  </div>
                  <button onClick={() => { setAppliedCoupon(""); setCouponInput(""); setCouponError(""); }}
                    className="text-stone-warm hover:text-red-500 font-semibold text-xs tracking-wider uppercase pl-2">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input type="text" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="Try WELCOME or ROOPE25"
                    className="flex-1 bg-white rounded-2xl border border-pearl-200 px-3 py-2.5 md:px-4 md:py-3.5 text-[11px] md:text-xs text-roope-primary uppercase outline-none focus:border-champagne-DEFAULT transition-colors" />
                  <button onClick={handleApplyCoupon} className="btn-secondary px-3.5 py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl text-[11px] md:text-xs uppercase tracking-wider">Apply</button>
                </div>
              )}
              {couponError && <p className="text-red-500 text-[10px] font-medium">{couponError}</p>}
            </div>

            {/* Submit */}
            <div className="space-y-3 pb-16">
              {submitError && (
                <div className="p-4 bg-red-500/5 border border-red-500/15 rounded-2xl flex gap-2 items-center text-red-600 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}
              <button
                disabled={submitting || !canSubmit()}
                onClick={() => submitBooking("cod")}
                className="py-2.5 px-4 md:py-4 md:px-6 w-full rounded-xl md:rounded-2xl text-[10px] md:text-xs font-bold uppercase tracking-widest text-white shadow disabled:opacity-50 disabled:cursor-not-allowed transition-all text-center flex items-center justify-center cursor-pointer"
                style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}
              >
                {submitting ? "Booking…" : "Confirm & Pay After Service In Person"}
              </button>
              {submitting && (
                <p className="text-center text-[10px] text-gold font-bold uppercase tracking-widest">
                  Scheduling artist in Indore…
                </p>
              )}
            </div>
          </div>
        </div>

        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </motion.div>
    );
  }

  // ── VIEW: SERVICES ─────────────────────────────────────────────────────────
  return (
    <motion.div
      key="services"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen pb-28"
      style={{ background: "linear-gradient(160deg, #F8F6F2 0%, #FAF6EC 100%)" }}
    >
      {/* Header */}
      <div className="pt-20 pb-4 px-4 md:pt-28 md:pb-8 md:px-6">
        <div className="max-w-5xl mx-auto text-center md:text-left">
          <p className="section-label mb-1.5 md:mb-2 tracking-widest uppercase">Luxury Salon at Home</p>
          <h1 className="font-display text-xl md:text-5xl font-light text-roope-primary mb-2 md:mb-3">
            Select Your <span className="text-gradient-gold">Glamour Experience</span>
          </h1>
          <p className="text-stone-warm max-w-2xl text-[11px] md:text-base leading-relaxed">
            Delivering high-end international makeup artistry directly to your doorstep. Currently servicing premium homes in <strong>Indore</strong>.
          </p>

          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-1.5 border-b border-pearl-200/80 pb-2.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-[10px] md:px-6 md:py-2.5 md:text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${activeCategory === cat.id ? "text-white shadow-sm" : "text-stone-warm/75 hover:text-roope-primary hover:bg-champagne-300/10"}`}
                style={{ background: activeCategory === cat.id ? "linear-gradient(135deg, #C9A84C, #B8922E)" : "transparent" }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="px-4 md:px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-3 md:gap-6">
          {filteredServices.map((service) => {
            const isSelected = selectedServiceId === service.id;
            return (
              <motion.div
                key={service.id}
                layoutId={`service-card-${service.id}`}
                className={`card-luxury overflow-hidden flex flex-row gap-3 md:gap-5 p-3 pb-4 md:p-5 items-start justify-between transition-all duration-300 hover:shadow-md ${
                  isSelected ? "border-champagne-DEFAULT ring-1 ring-champagne-300/10" : "border-pearl-200/80"
                }`}
                style={{ background: isSelected ? "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(201,168,76,0.03) 100%)" : "rgba(255,255,255,0.8)" }}
              >
                {/* Info Column */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest bg-champagne-300/30 text-roope-primary px-2.5 py-0.5 rounded-full">
                      {service.tag || "Exclusive"}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] md:text-xs font-medium text-stone-warm">
                      <span className="text-gold">★</span>
                      <span>{service.rating}</span>
                      <span className="text-stone-warm/50">({service.reviews})</span>
                    </div>
                  </div>
                  <h3 className="font-display text-xs sm:text-sm md:text-xl md:font-light text-roope-primary leading-snug">
                    {service.name}
                  </h3>

                  {/* Mobile-only Pricing & Duration */}
                  <div className="flex items-center gap-2 mt-1 sm:hidden">
                    <span className="font-display text-xs font-bold text-roope-primary">
                      {formatPrice(service.price)}
                    </span>
                    {service.originalPrice && (
                      <span className="text-[9px] text-stone-warm/40 line-through">
                        {formatPrice(service.originalPrice)}
                      </span>
                    )}
                    <span className="text-[9px] text-stone-warm/50 flex items-center gap-0.5 ml-1">
                      <Clock className="w-2.5 h-2.5 text-stone-warm/30" />
                      <span>{service.duration}</span>
                    </span>
                  </div>

                  <p className="text-stone-warm/80 text-[10px] md:text-xs leading-relaxed mt-2.5 mb-2.5 line-clamp-2 md:line-clamp-none">
                    {service.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {service.includes?.slice(0, 4).map((inc, i) => (
                      <span key={i} className="text-[9px] md:text-[10px] bg-pearl-200/50 text-stone-warm px-1.5 py-0.5 rounded-md border border-pearl-300/30">✓ {inc}</span>
                    ))}
                  </div>
                </div>

                {/* Image & Action Button Column */}
                <div className="flex flex-col items-center flex-shrink-0 w-20 sm:w-28 relative">
                  {/* Service Image Preview */}
                  <div className="relative w-20 sm:w-28 h-20 sm:h-20 rounded-xl overflow-hidden border border-pearl-200/80 bg-pearl-200 flex-shrink-0">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 80px, 112px"
                      unoptimized
                    />
                  </div>

                  {/* Prices and Duration - Desktop Only */}
                  <div className="hidden sm:block text-center mt-2.5">
                    <div className="flex items-baseline gap-1.5 justify-center">
                      <span className="font-display text-sm font-semibold md:text-lg md:font-light text-roope-primary">
                        {formatPrice(service.price)}
                      </span>
                      {service.originalPrice && (
                        <span className="text-[10px] text-stone-warm/40 line-through">
                          {formatPrice(service.originalPrice)}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-stone-warm/50 flex items-center gap-1 justify-center mt-0.5">
                      <Clock className="w-3 h-3 text-stone-warm/30" />
                      <span>{service.duration}</span>
                    </p>
                  </div>

                  {/* Add or Selected Button */}
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 sm:static sm:bottom-auto sm:left-auto sm:translate-x-0 sm:mt-3 z-10 shadow-md sm:shadow-none">
                    <button
                      onClick={() => toggleService(service.id)}
                      className={`w-16 sm:w-28 py-1 sm:py-2 border rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-semibold uppercase tracking-widest transition-all bg-white ${
                        isSelected 
                          ? "bg-stone-warm border-stone-warm text-white hover:bg-stone-warm/95" 
                          : "border-champagne-DEFAULT text-roope-primary hover:bg-champagne-DEFAULT hover:text-white"
                      }`}
                    >
                      {isSelected ? "Selected" : "Add"}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Floating Proceed Bar */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-pearl-200 shadow-xl px-3.5 py-2.5"
          >
            <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-champagne-300/20 text-roope-primary flex-shrink-0">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[8px] font-bold text-stone-warm/60 uppercase tracking-widest leading-none">Your Package</p>
                  <p className="text-xs font-semibold text-roope-primary truncate max-w-[150px] sm:max-w-md mt-0.5">{selectedService.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-[9px] text-stone-warm/50 uppercase tracking-wider">Total</p>
                  <p className="font-display text-base font-semibold text-roope-primary">{formatPrice(selectedService.price)}</p>
                </div>
                <button
                  onClick={handleProceedToCheckout}
                  className="btn-primary py-2 px-3 text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1.5 shadow-md"
                >
                  Proceed to Book <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
