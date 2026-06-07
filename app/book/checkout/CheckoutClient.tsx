"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Check,
  ArrowLeft,
  MapPin,
  User,
  Sparkles,
  Tag,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  X,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";
import { services, extras } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import AuthModal from "@/components/auth/AuthModal";
import VisualSchedulingCalendar from "@/components/book/VisualSchedulingCalendar";

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

export default function CheckoutClient() {
  const router = useRouter();

  const [cartItems, setCartItems] = useState<{ [id: string]: number }>({});
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

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

  const [confirmed, setConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [tipAmount, setTipAmount] = useState<number>(0);
  const [customTip, setCustomTip] = useState("");
  const [isCustomTipActive, setIsCustomTipActive] = useState(false);
  const [isCouponOpen, setIsCouponOpen] = useState(false);

  const handleAddToCart = (id: string) => {
    const newCart = { ...cartItems, [id]: (cartItems[id] || 0) + 1 };
    setCartItems(newCart);
    localStorage.setItem("roope-cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("roope-cart-updated"));
  };

  const handleRemoveFromCart = (id: string) => {
    if (!cartItems[id]) return;
    const newCart = { ...cartItems };
    if (newCart[id] === 1) {
      delete newCart[id];
    } else {
      newCart[id] -= 1;
    }
    setCartItems(newCart);
    localStorage.setItem("roope-cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("roope-cart-updated"));
  };

  const handleDeleteFromCart = (id: string) => {
    const newCart = { ...cartItems };
    delete newCart[id];
    setCartItems(newCart);
    localStorage.setItem("roope-cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("roope-cart-updated"));
  };

  // Pricing
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
  const total = Math.max(0, subtotal - discount) + tipAmount;

  // Bootstrap data from URL params + localStorage + auth session
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const serviceParam = query.get("service");
    const checkoutDirect = query.get("checkout") === "direct";

    // Load from localStorage cart
    const savedCart = localStorage.getItem("roope-cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Object.keys(parsed).length > 0) {
          setCartItems(parsed);
          setSelectedServiceId(Object.keys(parsed)[0]);
        }
      } catch {}
    }

    // Override with URL service param (single service flow)
    if (serviceParam && !checkoutDirect) {
      setSelectedServiceId(serviceParam);
      const newCart = { [serviceParam]: 1 };
      setCartItems(newCart);
      localStorage.setItem("roope-cart", JSON.stringify(newCart));
      window.dispatchEvent(new Event("roope-cart-updated"));
    }

    // Auth
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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
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

    // Saved address
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

    const finalServiceId =
      Object.keys(cartItems).length > 0 ? "cart" : selectedServiceId || "";
    const finalServiceName =
      Object.keys(cartItems).length > 0
        ? Object.entries(cartItems)
            .map(([id, qty]) => {
              const svc = services.find((s) => s.id === id);
              return svc ? `${svc.name} (x${qty})` : "";
            })
            .filter(Boolean)
            .join(", ")
            .slice(0, 148)
        : selectedService?.name || "";

    if (paymentMethod === "online") {
      try {
        const res = await fetch("/api/payment/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: selections.name,
            phone: selections.phone,
            email: selections.email,
            occasion: selections.occasion,
            service_id: finalServiceId,
            service_name: finalServiceName,
            date: selections.date,
            time: selections.time,
            city: selections.city,
            address: selections.address,
            artist_tier: selections.artistTier,
            extras: selections.extras,
            coupon: appliedCoupon,
            cartItems,
            tip_amount: tipAmount,
          }),
        });
        const json = await res.json();
        if (!res.ok) {
          setSubmitError(json.error || "Failed to initialize payment.");
          setSubmitting(false);
          return;
        }
        const rzp = new (window as any).Razorpay({
          key: json.keyId,
          amount: json.amount,
          currency: json.currency,
          name: "Roopé Luxury Beauty",
          description: finalServiceName.slice(0, 240),
          image: "/images/favicon.ico",
          order_id: json.razorpayOrderId,
          handler: async (response: any) => {
            try {
              setSubmitting(true);
              const verifyRes = await fetch("/api/payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  booking_id: json.bookingId,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });
              const verifyJson = await verifyRes.json();
              if (verifyRes.ok) {
                localStorage.removeItem("roope-cart");
                setCartItems({});
                window.dispatchEvent(new Event("roope-cart-updated"));
                setBookingId(json.bookingId);
                setConfirmed(true);
              } else {
                setSubmitError(verifyJson.error || "Payment verification failed.");
              }
            } catch {
              setSubmitError("Verification error. Please contact support.");
            } finally {
              setSubmitting(false);
            }
          },
          prefill: { name: selections.name, email: selections.email, contact: selections.phone },
          notes: { address: selections.address },
          theme: { color: "#B8922E" },
        });
        rzp.on("payment.failed", (r: any) => {
          setSubmitError(r.error.description || "Payment failed.");
          setSubmitting(false);
        });
        rzp.open();
      } catch {
        setSubmitError("Network error. Unable to load payment.");
        setSubmitting(false);
      }
    } else {
      try {
        const res = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: selections.name,
            phone: selections.phone,
            email: selections.email,
            occasion: selections.occasion,
            service_id: finalServiceId,
            service_name: finalServiceName,
            service_price: basePrice,
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
          localStorage.removeItem("roope-cart");
          setCartItems({});
          window.dispatchEvent(new Event("roope-cart-updated"));
          setBookingId(json.bookingId);
          setConfirmed(true);
        } else {
          setSubmitError(json.error || "Failed to submit booking.");
        }
      } catch {
        setSubmitError("Network error. Please try again.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  // ─── Confirmed State ───────────────────────────────────────────────────────
  if (confirmed) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16"
        style={{ background: "linear-gradient(160deg, var(--pearl) 0%, var(--ivory) 100%)" }}
      >
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
          <h1 className="font-display text-2xl md:text-4xl font-semibold md:font-light text-roope-primary mb-3">
            Booking Confirmed!
          </h1>
          <p className="text-stone-warm mb-1">Your premium artist in Indore is reserved.</p>
          <p className="text-stone-warm text-sm mb-8">
            A confirmation email has been sent successfully.
          </p>

          <div className="glass rounded-3xl p-6 text-left mb-8 border border-pearl-200 shadow-sm">
            <div className="flex justify-between items-center pb-4 border-b border-pearl-200/60 mb-4">
              <span className="text-xs font-semibold text-stone-warm/70 uppercase tracking-widest">
                Order ID
              </span>
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
                      return svc ? (
                        <p key={id} className="font-medium text-roope-primary">
                          {svc.name} <span className="text-gold font-bold">x{qty}</span>
                        </p>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <p className="font-medium text-roope-primary">{selectedService?.name}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-stone-warm/50">Date &amp; Time</p>
                <p className="font-medium text-roope-primary">
                  {selections.date} at {selections.time}
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-warm/50">Location</p>
                <p className="font-medium text-roope-primary">{selections.address}, Indore</p>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-pearl-200 flex justify-between items-center">
              <span className="text-sm font-medium text-stone-warm">Grand Total</span>
              <span className="font-display text-lg font-semibold md:text-2xl md:font-light text-roope-primary">
                {formatPrice(total)}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary py-4 px-8 justify-center shadow-md">
              Return to Home
            </Link>
            <Link
              href="/contact"
              className="btn-secondary py-4 px-8 justify-center border border-pearl-300"
            >
              Need Help? Support
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const hasService = !!selectedServiceId || Object.keys(cartItems).length > 0;

  // ─── Main Checkout Page ────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen pb-24 lg:pb-10"
      style={{ background: "linear-gradient(160deg, var(--pearl) 0%, var(--ivory) 100%)" }}
    >
      {/* Page Header */}
      <div className="pt-24 pb-6 px-6 border-b border-pearl-200/60 bg-white/70 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-wider text-stone-warm/50 mb-4">
            <Link href="/services" className="hover:text-roope-primary transition-colors">
              Services
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-roope-primary">Complete Booking</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full border border-pearl-200 flex items-center justify-center text-stone-warm hover:text-roope-primary hover:border-stone-warm/30 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="font-display text-xl md:text-3xl font-semibold md:font-light text-roope-primary">
                Complete Booking
              </h1>
              <div className="flex items-center gap-1 text-[11.5px] text-stone-warm/60 uppercase font-bold tracking-wider mt-0.5">
                <MapPin className="w-3 h-3 text-gold" />
                <span>Indore Premium Service</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-[380px_1fr] gap-8 items-start">
        {/* ── Left: Order Summary ──────────────────────────────────────────── */}
        <div className="space-y-5 lg:sticky lg:top-24">
          {/* Auth banner */}
          {!user && (
            <div className="p-4 bg-champagne-300/10 border border-champagne-DEFAULT/20 rounded-2xl flex items-center justify-between gap-3 shadow-sm">
              <div className="flex gap-2.5 items-start">
                <Sparkles className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11.5px] font-bold text-roope-primary uppercase tracking-wide">
                    Sign in for faster checkout
                  </p>
                  <p className="text-[11px] text-stone-warm/75 mt-0.5">
                    Auto-fill details &amp; track your scheduled artist arrival.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="text-[11.5px] font-bold uppercase tracking-wider text-gold hover:underline cursor-pointer flex-shrink-0"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Selected Services */}
          <div className="bg-white rounded-3xl p-5 border border-pearl-200 shadow-sm">
            <span className="text-[10.5px] font-bold text-stone-warm/60 uppercase tracking-widest bg-pearl-200/60 px-2 py-0.5 rounded block mb-3 w-max">
              Selected Service(s)
            </span>
            {Object.keys(cartItems).length > 0 ? (
              <div className="space-y-4 divide-y divide-pearl-100">
                {Object.entries(cartItems).map(([id, qty]) => {
                  const svc = services.find((s) => s.id === id);
                  if (!svc) return null;
                  return (
                    <div key={id} className="flex justify-between items-start pt-4 first:pt-0">
                      <div className="min-w-0 pr-3 flex-1">
                        <h4 className="font-semibold text-roope-primary text-xs sm:text-sm leading-snug">
                          {svc.name}
                        </h4>
                        <p className="text-[11.5px] text-stone-warm/60 mt-0.5">{svc.duration}</p>
                        
                        {/* Interactive Quantity Selector & Trash Button */}
                        <div className="flex items-center gap-2.5 mt-2">
                          <div className="flex items-center gap-2 bg-pearl-200/50 border border-pearl-300 rounded-lg px-2 py-0.5">
                            <button
                              type="button"
                              onClick={() => handleRemoveFromCart(id)}
                              className="w-4.5 h-4.5 rounded-full flex items-center justify-center text-stone-warm hover:bg-stone-warm/15 hover:text-roope-primary transition-all cursor-pointer"
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <span className="text-xs font-extrabold text-roope-primary w-3.5 text-center select-none">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleAddToCart(id)}
                              className="w-4.5 h-4.5 rounded-full flex items-center justify-center text-stone-warm hover:bg-stone-warm/15 hover:text-roope-primary transition-all cursor-pointer"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => handleDeleteFromCart(id)}
                            className="text-stone-warm/40 hover:text-red-500 transition-colors p-1 cursor-pointer"
                            title="Remove service"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      
                      <span className="font-display text-xs sm:text-sm font-semibold text-roope-primary flex-shrink-0 pt-0.5">
                        {formatPrice(svc.price * qty)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-xs text-stone-warm/60">No service selected.</p>
                <Link
                  href="/services"
                  className="mt-3 inline-block text-xs font-bold text-[#B8922E] hover:underline uppercase tracking-wider"
                >
                  ← Browse Services
                </Link>
              </div>
            )}
          </div>

          {/* Add-ons */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-warm/70 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-gold" /> Frequently Added Together
            </h3>
            <div className="space-y-2">
              {extras.map((extra) => {
                const isSelected = selections.extras.includes(extra.id);
                return (
                  <div
                    key={extra.id}
                    className={`p-4 rounded-2xl flex items-center justify-between border transition-all duration-200 ${
                      isSelected
                        ? "bg-champagne-300/5 border-champagne-DEFAULT"
                        : "bg-white border-pearl-200 hover:border-champagne-300/50"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-semibold text-roope-primary">{extra.label}</p>
                      <p className="text-[11.5px] text-stone-warm/60 mt-0.5">{extra.desc}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-stone-warm">
                        +{formatPrice(extra.price)}
                      </span>
                      <button
                        onClick={() => {
                          const next = isSelected
                            ? selections.extras.filter((e) => e !== extra.id)
                            : [...selections.extras, extra.id];
                          setSelections({ ...selections, extras: next });
                        }}
                        className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all text-sm font-bold ${
                          isSelected
                            ? "bg-stone-warm border-stone-warm text-white"
                            : "border-champagne-DEFAULT text-roope-primary hover:bg-champagne-DEFAULT hover:text-white"
                        }`}
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
          <div className="bg-white rounded-3xl p-5 border border-pearl-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-roope-primary border-b border-pearl-200/60 pb-2">
              Invoice Summary
            </h4>
            <div className="space-y-2 text-xs">
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
              {tipAmount > 0 && (
                <div className="flex justify-between text-stone-warm">
                  <span>Professional Tip</span>
                  <span className="font-semibold text-roope-primary">+{formatPrice(tipAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-warm pt-3 border-t border-pearl-200/80 text-sm font-semibold">
                <span className="text-roope-primary">Grand Total</span>
                <span className="text-gradient-gold text-base md:text-lg font-bold md:font-semibold">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="p-3 bg-champagne-300/10 rounded-2xl flex gap-2.5 items-start mt-2">
              <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
              <p className="text-[11.5px] text-stone-warm/80 leading-relaxed">
                <strong>Roopé Guarantee</strong>: Sanitized kits, genuine international brands,
                100% on-time arrival.
              </p>
            </div>
          </div>

          {/* Tipping Card */}
          <div className="bg-white rounded-3xl p-5 border border-pearl-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-roope-primary border-b border-pearl-200/60 pb-2">
              Add a tip to thank the Professional
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {[50, 75, 100].map((amt) => {
                const isSelected = tipAmount === amt && !isCustomTipActive;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setTipAmount(amt);
                      setIsCustomTipActive(false);
                    }}
                    className={`relative px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                      isSelected
                        ? "bg-[#1A1612] border-[#1A1612] text-white"
                        : "bg-white border-pearl-200 text-stone-warm hover:border-champagne-300"
                    }`}
                  >
                    ₹{amt}
                    {amt === 75 && (
                      <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 text-[8.5px] bg-green-100 text-green-700 px-1 rounded border border-green-200 leading-none py-0.5 font-bold uppercase tracking-wide">
                        Popular
                      </span>
                    )}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  setIsCustomTipActive(true);
                  setTipAmount(0);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  isCustomTipActive
                    ? "bg-[#1A1612] border-[#1A1612] text-white"
                    : "bg-white border-pearl-200 text-stone-warm hover:border-champagne-300"
                }`}
              >
                Custom
              </button>
            </div>
            {isCustomTipActive && (
              <div className="flex gap-2 pt-2 items-center">
                <span className="text-xs font-bold text-roope-primary">₹</span>
                <input
                  type="number"
                  value={customTip}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10) || 0;
                    setCustomTip(e.target.value);
                    setTipAmount(val);
                  }}
                  placeholder="Enter amount"
                  className="w-28 bg-[#FAF9F6] dark:bg-[#141210] border border-pearl-200 rounded-xl px-3 py-1.5 text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT"
                />
              </div>
            )}
            <p className="text-[10.5px] text-stone-warm/50 leading-tight">100% of the tip goes to the beauty professional.</p>
          </div>

          {/* Coupons and Offers row */}
          <div className="bg-white rounded-3xl p-5 border border-pearl-200 shadow-sm space-y-3">
            <div 
              onClick={() => setIsCouponOpen(!isCouponOpen)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                  <Tag className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-roope-primary uppercase tracking-wide">
                  Coupons and offers
                </span>
              </div>
              <span className="text-xs font-bold text-[#B8922E] hover:underline">
                {appliedCoupon ? "Manage" : "View all >"}
              </span>
            </div>

            {(isCouponOpen || appliedCoupon) && (
              <div className="pt-3 border-t border-pearl-200/60">
                {appliedCoupon ? (
                  <div className="bg-champagne-300/10 border border-champagne-DEFAULT rounded-2xl px-4 py-3.5 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-roope-primary uppercase tracking-wide">
                        {appliedCoupon} APPLIED
                      </p>
                      <p className="text-[11.5px] text-stone-warm/70">
                        {appliedCoupon === "ROOPE25"
                          ? "25% discount off total bill"
                          : "₹500 flat discount applied"}
                      </p>
                    </div>
                    <button
                      onClick={() => { setAppliedCoupon(""); setCouponInput(""); setCouponError(""); }}
                      className="text-stone-warm hover:text-red-500 font-semibold text-xs tracking-wider uppercase pl-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Try WELCOME or ROOPE25"
                      className="flex-1 bg-white rounded-2xl border border-pearl-200 px-4 py-3.5 text-xs text-roope-primary uppercase outline-none focus:border-champagne-DEFAULT transition-colors"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="btn-secondary px-5 py-3 rounded-2xl border border-pearl-300 text-xs uppercase tracking-wider"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="text-red-500 text-[11.5px] font-medium mt-1">{couponError}</p>
                )}
              </div>
            )}
          </div>

          {/* Cancellation Policy Box */}
          <div className="bg-white rounded-3xl p-5 border border-pearl-200 shadow-sm space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-roope-primary">
              Cancellation policy
            </h4>
            <p className="text-[12px] text-stone-warm/75 leading-relaxed">
              Free cancellations or rescheduling up to 4 hours before the service. A fee will apply otherwise.
            </p>
            <Link 
              href="/cancellation-policy" 
              target="_blank"
              className="text-xs font-bold text-[#B8922E] hover:underline inline-block mt-1"
            >
              Read full policy
            </Link>
          </div>
        </div>

        {/* ── Right: Form ───────────────────────────────────────────────────── */}
        <div className="space-y-8">
          {/* Schedule */}
          <div className="bg-white rounded-3xl p-6 border border-pearl-200 shadow-sm">
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
          <div className="bg-white rounded-3xl p-6 border border-pearl-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-warm/70 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gold" /> Service Address (Indore)
            </h3>
            <div className="bg-pearl-100/50 rounded-2xl p-4 border border-pearl-200 flex items-center gap-3">
              <MapPin className="w-4 h-4 text-stone-warm/60" />
              <div className="text-xs font-semibold text-roope-primary">
                Indore, Madhya Pradesh
                <span className="text-[11.5px] text-stone-warm font-normal bg-pearl-200/50 px-2 py-0.5 rounded-full ml-2">
                  Locked
                </span>
              </div>
            </div>
            <div>
              <label className="block text-[11.5px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1.5">
                Full Address (Including Landmarks)
              </label>
              <textarea
                value={selections.address}
                onChange={(e) => setSelections({ ...selections, address: e.target.value })}
                placeholder="House No, Apartment Name, Street Name, landmark..."
                rows={3}
                className="w-full bg-white rounded-2xl border border-pearl-200 p-4 text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT transition-colors resize-none"
              />
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-3xl p-6 border border-pearl-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-warm/70 flex items-center gap-1.5">
              <User className="w-4 h-4 text-gold" /> Your Contact Information
            </h3>
            <div>
              <label className="block text-[11.5px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1.5">
                Full Name
              </label>
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
                <label className="block text-[11.5px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={selections.phone}
                  onChange={(e) => setSelections({ ...selections, phone: e.target.value })}
                  placeholder="Phone number"
                  className="w-full bg-white rounded-2xl border border-pearl-200 px-4 py-3.5 text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11.5px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1.5">
                  Email Address
                </label>
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

          {/* Submit (Desktop Only) */}
          <div className="space-y-3 hidden md:block">
            {submitError && (
              <div className="p-4 bg-red-500/5 border border-red-500/15 rounded-2xl flex gap-2 items-center text-red-600 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{submitError}</span>
              </div>
            )}
            <button
              disabled={submitting || !canSubmit()}
              onClick={() => submitBooking("cod")}
              className="py-4 px-6 w-full rounded-2xl text-xs font-bold uppercase tracking-widest text-white shadow disabled:opacity-50 disabled:cursor-not-allowed transition-all text-center flex items-center justify-center cursor-pointer"
              style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}
            >
              {submitting ? "Booking…" : "Confirm & Pay After Service In Person"}
            </button>
            {submitting && (
              <p className="text-center text-[11.5px] text-gold font-bold uppercase tracking-widest">
                Scheduling artist in Indore…
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-pearl-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:hidden">
        {submitError && (
          <div className="px-6 py-2 bg-red-500/5 border-b border-red-500/10 text-red-600 text-[11.5px] font-medium flex gap-1.5 items-center">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{submitError}</span>
          </div>
        )}
        <div className="px-6 py-4 flex items-center justify-between gap-4 max-w-lg mx-auto">
          <div className="min-w-0 flex-1">
            <p className="text-[11.5px] font-bold text-stone-warm/50 uppercase tracking-wider truncate">
              {selections.address.trim() || "Add address"}
            </p>
            <p className="text-[11px] text-stone-warm/60 mt-0.5">
              {selections.date && selections.time ? `${selections.date} @ ${selections.time}` : "Select slot"}
            </p>
            <div className="text-sm font-extrabold text-roope-primary mt-1">
              {formatPrice(total)}
            </div>
          </div>
          
          <button
            disabled={submitting || !canSubmit()}
            onClick={() => submitBooking("cod")}
            className="btn-primary py-3.5 px-6 rounded-2xl text-[12.5px] font-bold uppercase tracking-widest text-white shadow disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}
          >
            {submitting ? "Booking…" : "Confirm Booking"}
          </button>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
