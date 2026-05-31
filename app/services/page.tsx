"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, 
  Clock, 
  Search, 
  X, 
  ShoppingBag, 
  Plus, 
  Minus, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  ChevronRight,
  Info,
  MapPin,
  Check
} from "lucide-react";
import { services } from "@/lib/data";
import { formatPrice, getDiscount } from "@/lib/utils";

// Category Definitions with Unsplash High-Fidelity Thumbnails & Dynamic Badges
const CATEGORY_MAP = [
  {
    id: "super-saver",
    label: "Super savers",
    badge: "Upto 20% OFF",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=150",
    description: "Make your own package & monthly care"
  },
  {
    id: "waxing",
    label: "Waxing & threading",
    badge: "Price drop",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=150",
    description: "Hygienic cartridge & spatula peel-off"
  },
  {
    id: "facials",
    label: "Korean facials",
    badge: "Glow special",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=150",
    description: "Deep cleanse & collagen hydration"
  },
  {
    id: "pedi-mani",
    label: "Pedicure & manicure",
    badge: "Luxury spa",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=150",
    description: "Candle spa & structural nail therapy"
  },
  {
    id: "grooming",
    label: "Men's grooming",
    badge: "Styling lead",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=150",
    description: "Precision haircuts & hot towel shaves"
  },
  {
    id: "spa-massage",
    label: "Spa & massage",
    badge: "Stress relief",
    image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=150",
    description: "Full body Swedish & deep tissue"
  }
];

// Special promo and brand promise listings
const PROMOS = [
  { code: "WELCOME", desc: "Get flat ₹500 discount on your first booking" },
  { code: "ROOPE25", desc: "Get 25% off up to ₹1,500 for ultimate luxury sessions" }
];

export default function ServicesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("super-saver");
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [mobileCartDrawerOpen, setMobileCartDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // References for smooth scrolling category synchronization
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const centerPaneRef = useRef<HTMLDivElement | null>(null);
  const isAutoScrolling = useRef(false);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("roope-cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        localStorage.removeItem("roope-cart");
      }
    }
  }, []);

  // Update localStorage when cart changes
  const saveCart = (newCart: { [id: string]: number }) => {
    setCart(newCart);
    localStorage.setItem("roope-cart", JSON.stringify(newCart));
  };

  // Add Item
  const handleAddToCart = (id: string) => {
    const newCart = { ...cart, [id]: (cart[id] || 0) + 1 };
    saveCart(newCart);
  };

  // Remove / Decrement Item
  const handleRemoveFromCart = (id: string) => {
    if (!cart[id]) return;
    const newCart = { ...cart };
    if (newCart[id] === 1) {
      delete newCart[id];
    } else {
      newCart[id] -= 1;
    }
    saveCart(newCart);
  };

  // Cart Metrics
  const cartItemsCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const cartSubtotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const svc = services.find((s) => s.id === id);
    return sum + (svc ? svc.price * qty : 0);
  }, 0);

  // Filter services by search query
  const filteredServices = services.filter((s) => {
    return s.name.toLowerCase().includes(search.toLowerCase()) || 
           s.description.toLowerCase().includes(search.toLowerCase()) ||
           s.category.toLowerCase().includes(search.toLowerCase());
  });

  // Scroll to targeted category section inside the center pane
  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
    const targetSection = sectionRefs.current[catId];
    if (targetSection) {
      isAutoScrolling.current = true;
      targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
      // Reset auto-scroll flag after smooth scroll completes
      setTimeout(() => {
        isAutoScrolling.current = false;
      }, 800);
    }
  };

  // Synchronize category highlight based on scroll position of center pane
  useEffect(() => {
    const handleScrollSync = () => {
      if (isAutoScrolling.current) return;
      const scrollPosition = window.scrollY + 180; // offset for nav header height

      let currentActive = activeCategory;
      for (const cat of CATEGORY_MAP) {
        const el = sectionRefs.current[cat.id];
        if (el) {
          const rect = el.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          if (scrollPosition >= top) {
            currentActive = cat.id;
          }
        }
      }

      if (currentActive !== activeCategory) {
        setActiveCategory(currentActive);
      }

      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScrollSync);
    return () => window.removeEventListener("scroll", handleScrollSync);
  }, [activeCategory]);

  // Navigate to /book and pre-fill selected items inside checkout drawer
  const handleProceedToBooking = () => {
    if (cartItemsCount === 0) return;
    
    // Save items to localStorage key 'roope-cart' for /book to read
    localStorage.setItem("roope-cart", JSON.stringify(cart));
    
    // Redirect to book
    router.push("/book?checkout=direct");
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-20">
      {/* ─── Hero Header & Banner ─── */}
      <section className="pt-24 pb-8 bg-gradient-to-b from-[#F3EFE6] to-[#FAF9F6] px-4 md:px-8 border-b border-pearl-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                <span className="text-[10px] bg-champagne-300/40 text-roope-primary px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                  Salon Prime
                </span>
                <span className="text-xs text-stone-warm font-semibold flex items-center gap-1">
                  ★ 4.85 <span className="text-stone-warm/50 font-normal">(17.6M bookings completed)</span>
                </span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-light text-roope-primary tracking-tight leading-tight text-center md:text-left">
                Luxury <span className="italic text-gradient-gold">Doorstep Services</span>
              </h1>
              <p className="text-sm text-stone-warm mt-2 text-center md:text-left max-w-xl">
                Unisex premium salon, high-end grooming, therapeutic massage, and deep relaxing spa experiences. Highly trained professionals using luxury products.
              </p>
            </div>

            {/* Dynamic Search Box */}
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-warm/60" />
              <input
                type="text"
                placeholder="Search premium services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white pl-11 pr-10 py-3.5 rounded-2xl text-xs font-semibold text-roope-primary border border-pearl-300 outline-none focus:border-champagne-DEFAULT focus:ring-2 focus:ring-champagne-300/20 shadow-sm transition-all"
              />
              {search && (
                <button 
                  onClick={() => setSearch("")} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-warm hover:text-roope-primary"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Main 3-Pane Split Layout Container ─── */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex gap-6 items-start relative">
          
          {/* ─── LEFT PANEL: Sticky Category Navigation (Desktop) ─── */}
          <aside className="hidden md:block w-64 sticky top-[100px] max-h-[calc(100vh-140px)] overflow-y-auto pr-2 scrollbar-none">
            <p className="text-[10px] font-bold text-stone-warm/60 uppercase tracking-widest mb-4 pl-2">
              Select Category
            </p>
            <nav className="space-y-2">
              {CATEGORY_MAP.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all duration-300 flex items-center gap-3 relative overflow-hidden group ${
                      isActive 
                        ? "bg-white shadow-sm border-champagne-DEFAULT" 
                        : "bg-pearl-100/10 border-pearl-200/60 hover:bg-white hover:border-champagne-300/40"
                    }`}
                  >
                    {/* Category Thumbnail */}
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 border border-pearl-200 bg-pearl-200">
                      <Image
                        src={cat.image}
                        alt={cat.label}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="44px"
                        unoptimized
                      />
                    </div>

                    {/* Labels & Dynamic Badge */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 justify-between">
                        <span className={`text-xs font-bold leading-tight ${isActive ? "text-roope-primary" : "text-stone-warm/90"}`}>
                          {cat.label}
                        </span>
                      </div>
                      <p className="text-[9px] text-stone-warm/50 truncate leading-snug mt-0.5">
                        {cat.description}
                      </p>
                      {cat.badge && (
                        <span className={`inline-block text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-md mt-1 tracking-wider leading-none ${
                          isActive ? "bg-champagne-DEFAULT text-white" : "bg-champagne-300/10 text-roope-primary"
                        }`}>
                          {cat.badge}
                        </span>
                      )}
                    </div>

                    {/* Indicator Dot */}
                    {isActive && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-champagne-DEFAULT" />
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* ─── CENTER PANEL: Scrollable Services Feed ─── */}
          <section className="flex-1 min-w-0" ref={centerPaneRef}>
            
            {/* Horizontal Category Scroll for Mobile viewports */}
            <div className="block md:hidden sticky top-[72px] z-10 bg-[#FAF9F6]/90 backdrop-blur-md -mx-4 px-4 py-3.5 border-b border-pearl-200/60 overflow-x-auto scrollbar-none snap-x mb-6">
              <div className="flex gap-2.5">
                {CATEGORY_MAP.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`flex-shrink-0 snap-start px-4 py-2.5 rounded-full text-xs font-semibold border transition-all duration-300 ${
                        isActive 
                          ? "bg-stone-warm border-stone-warm text-white shadow-sm" 
                          : "bg-white border-pearl-200 text-stone-warm hover:text-roope-primary"
                      }`}
                    >
                      <span>{cat.label}</span>
                      {cat.badge && !isActive && (
                        <span className="ml-1.5 text-[8px] font-extrabold text-[#C9A84C] uppercase">
                          • {cat.badge.split(" ")[0]}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Empty Search Results */}
            {search && filteredServices.length === 0 && (
              <div className="bg-white rounded-3xl p-12 border border-pearl-200 text-center max-w-md mx-auto mt-6">
                <span className="text-3xl block mb-2">🔍</span>
                <h3 className="font-display text-lg text-roope-primary font-light">No premium services found</h3>
                <p className="text-stone-warm text-xs mt-1">Try refining your terms, or clearing filters to view everything.</p>
                <button 
                  onClick={() => setSearch("")}
                  className="mt-4 px-5 py-2.5 bg-champagne-DEFAULT hover:bg-champagne-dark text-white rounded-full text-xs font-semibold uppercase tracking-wider"
                >
                  Clear Search
                </button>
              </div>
            )}

            {/* List Grouped by Category */}
            {CATEGORY_MAP.map((category) => {
              const catServices = search ? filteredServices.filter((s) => s.category === category.id) : services.filter((s) => s.category === category.id);
              if (catServices.length === 0) return null;

              return (
                <div
                  key={category.id}
                  id={`section-${category.id}`}
                  ref={(el) => { sectionRefs.current[category.id] = el; }}
                  className="mb-12 scroll-mt-28"
                >
                  {/* Category Section Header Card */}
                  <div className="glass rounded-3xl p-6 mb-6 border border-pearl-200/80 shadow-sm flex flex-col sm:flex-row gap-5 items-center justify-between relative overflow-hidden bg-white/70">
                    <div className="relative z-10 flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] bg-champagne-300/40 text-roope-primary px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
                          Certified Prime
                        </span>
                        {category.badge && (
                          <span className="text-[10px] text-[#B8922E] font-bold">
                            ★ {category.badge}
                          </span>
                        )}
                      </div>
                      <h2 className="font-display text-2xl font-light text-roope-primary leading-tight">
                        {category.label}
                      </h2>
                      <p className="text-stone-warm text-xs mt-1 max-w-md leading-relaxed">
                        Exquisite custom care bundles curated under Roopé luxury quality guidelines. Painless, hygienic, and highly satisfying.
                      </p>
                    </div>

                    {/* Category Hero Banner Photo */}
                    <div className="relative w-full sm:w-44 h-28 rounded-2xl overflow-hidden border border-pearl-200 flex-shrink-0 bg-pearl-200">
                      <Image
                        src={category.image}
                        alt={category.label}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 176px"
                        unoptimized
                      />
                    </div>
                  </div>

                  {/* Individual Service Cards */}
                  <div className="space-y-4">
                    {catServices.map((svc) => {
                      const qty = cart[svc.id] || 0;
                      const discount = getDiscount(svc.originalPrice, svc.price);

                      return (
                        <div
                          key={svc.id}
                          className={`bg-white rounded-3xl border p-5 flex flex-col sm:flex-row gap-5 items-start justify-between transition-all duration-300 hover:shadow-md ${
                            qty > 0 ? "border-champagne-DEFAULT ring-1 ring-champagne-300/10" : "border-pearl-200/80"
                          }`}
                        >
                          {/* Info Column */}
                          <div className="flex-1 min-w-0">
                            {/* Service Badge & Tags */}
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              {svc.tag && (
                                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                                  {svc.tag}
                                </span>
                              )}
                              <span className="text-[9px] font-bold text-stone-warm/50 uppercase tracking-widest">
                                {svc.occasion}
                              </span>
                            </div>

                            {/* Service Name */}
                            <h3 className="font-display text-lg font-light text-roope-primary leading-snug">
                              {svc.name}
                            </h3>

                            {/* Reviews, Star Rating */}
                            <div className="flex items-center gap-1.5 text-xs text-stone-warm mt-1">
                              <span className="text-[#C9A84C] font-semibold">★ {svc.rating}</span>
                              <span className="text-stone-warm/40">•</span>
                              <span className="text-stone-warm/60">({svc.reviews.toLocaleString()} reviews)</span>
                            </div>

                            {/* Bullet Point Inclusions */}
                            {svc.includes && svc.includes.length > 0 && (
                              <ul className="mt-3.5 space-y-1.5 border-t border-pearl-100/60 pt-3">
                                {svc.includes.map((inc, i) => (
                                  <li key={i} className="flex gap-2 items-start text-xs text-stone-warm/80">
                                    <span className="text-champagne-DEFAULT font-bold flex-shrink-0 mt-0.5">✓</span>
                                    <span className="leading-snug">{inc}</span>
                                  </li>
                                ))}
                              </ul>
                            )}

                            {/* In-Depth Description */}
                            <p className="text-stone-warm/60 text-[11px] mt-3 leading-relaxed">
                              {svc.description}
                            </p>
                          </div>

                          {/* Pricing & "Add" Counter Column */}
                          <div className="w-full sm:w-36 flex sm:flex-col items-center justify-between sm:justify-start gap-4 sm:gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-pearl-100 mt-2 sm:mt-0">
                            {/* Service Image Preview */}
                            <div className="relative w-20 sm:w-28 h-20 sm:h-20 rounded-xl overflow-hidden border border-pearl-200/80 bg-pearl-200 hidden xs:block flex-shrink-0">
                              <Image
                                src={svc.image}
                                alt={svc.name}
                                fill
                                className="object-cover"
                                sizes="112px"
                                unoptimized
                              />
                              {discount > 0 && (
                                <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold text-white bg-stone-warm/80 backdrop-blur-xs">
                                  -{discount}%
                                </span>
                              )}
                            </div>

                            {/* Prices and Duration */}
                            <div className="sm:text-center">
                              <div className="flex items-baseline gap-1.5 sm:justify-center">
                                <span className="font-display text-lg font-light text-roope-primary">
                                  {formatPrice(svc.price)}
                                </span>
                                {svc.originalPrice && (
                                  <span className="text-[10px] text-stone-warm/40 line-through">
                                    {formatPrice(svc.originalPrice)}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-stone-warm/50 flex items-center gap-1 sm:justify-center mt-0.5">
                                <Clock className="w-3 h-3 text-stone-warm/30" />
                                <span>{svc.duration}</span>
                              </p>
                            </div>

                            {/* "Add" or Counter Buttons */}
                            {qty === 0 ? (
                              <button
                                onClick={() => handleAddToCart(svc.id)}
                                className="w-24 sm:w-28 py-2 border border-champagne-DEFAULT rounded-xl text-xs font-semibold text-roope-primary uppercase tracking-widest hover:bg-champagne-DEFAULT hover:text-white hover:shadow-xs transition-all active:scale-95 bg-white"
                              >
                                Add
                              </button>
                            ) : (
                              <div className="w-24 sm:w-28 py-1.5 px-2 bg-stone-warm border border-stone-warm rounded-xl flex items-center justify-between text-white text-xs font-bold shadow-xs">
                                <button 
                                  onClick={() => handleRemoveFromCart(svc.id)}
                                  className="w-5 h-5 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span>{qty}</span>
                                <button 
                                  onClick={() => handleAddToCart(svc.id)}
                                  className="w-5 h-5 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </section>

          {/* ─── RIGHT PANEL: Live Cart Summary (Desktop Sticky Sidebar) ─── */}
          <aside className="hidden lg:block w-80 sticky top-[100px] max-h-[calc(100vh-140px)] overflow-y-auto pl-2 pr-1 scrollbar-none">
            
            {/* Promo Banner box */}
            <div className="glass rounded-3xl p-5 border border-champagne-DEFAULT/25 bg-champagne-300/10 mb-5 shadow-xs relative overflow-hidden">
              <div className="flex gap-2.5 items-start z-10 relative">
                <Sparkles className="w-4.5 h-4.5 text-gold flex-shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <h4 className="text-[10px] font-bold text-roope-primary uppercase tracking-wider">
                    Luxury Offers Active
                  </h4>
                  <p className="text-[10px] text-stone-warm/75 mt-1 leading-normal">
                    Enter code <strong className="text-roope-primary">ROOPE25</strong> at checkout to unlock flat 25% off up to ₹1,500 on all salon packages.
                  </p>
                </div>
              </div>
            </div>

            {/* Standard Shopping Cart Panel */}
            <div className="bg-white rounded-3xl border border-pearl-200 shadow-sm overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-pearl-200/60 bg-pearl-100/15 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-stone-warm" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-roope-primary">
                    Your Shopping Cart
                  </h3>
                </div>
                {cartItemsCount > 0 && (
                  <span className="text-[10px] bg-stone-warm text-white px-2 py-0.5 rounded-full font-bold">
                    {cartItemsCount}
                  </span>
                )}
              </div>

              {/* Cart Body */}
              <div className="p-5 flex-1 min-h-[140px] flex flex-col">
                {cartItemsCount === 0 ? (
                  /* Empty state */
                  <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
                    <span className="text-2xl mb-2 text-stone-warm/40">🛒</span>
                    <p className="text-xs font-semibold text-stone-warm">No items in your cart</p>
                    <p className="text-[10px] text-stone-warm/50 mt-0.5 leading-snug">Add services from our luxury list to get started.</p>
                  </div>
                ) : (
                  /* Items List */
                  <div className="space-y-4 flex-1">
                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                      {Object.entries(cart).map(([id, qty]) => {
                        const svc = services.find((s) => s.id === id);
                        if (!svc) return null;
                        return (
                          <div key={id} className="flex justify-between items-center text-xs pb-3 border-b border-pearl-100 last:border-b-0 last:pb-0">
                            <div className="min-w-0 pr-2">
                              <p className="font-semibold text-roope-primary truncate max-w-[140px]">
                                {svc.name}
                              </p>
                              <p className="text-[10px] text-stone-warm/50 mt-0.5">
                                {formatPrice(svc.price)} each
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button
                                onClick={() => handleRemoveFromCart(id)}
                                className="w-5 h-5 rounded-full flex items-center justify-center border border-pearl-200 text-stone-warm hover:border-stone-warm hover:text-roope-primary"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-bold text-roope-primary text-xs w-4 text-center">
                                {qty}
                              </span>
                              <button
                                onClick={() => handleAddToCart(id)}
                                className="w-5 h-5 rounded-full flex items-center justify-center border border-pearl-200 text-stone-warm hover:border-stone-warm hover:text-roope-primary"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Invoice Calculations */}
                    <div className="pt-4 border-t border-pearl-200/80 space-y-2.5">
                      <div className="flex justify-between text-xs text-stone-warm">
                        <span>Cart Subtotal</span>
                        <span className="font-semibold text-roope-primary">{formatPrice(cartSubtotal)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-stone-warm/75">
                        <span>Taxes & Fee</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Free</span>
                      </div>

                      <div className="flex justify-between items-center text-xs font-bold text-roope-primary pt-3 border-t border-pearl-100">
                        <span>Grand Total</span>
                        <span className="text-gradient-gold text-sm">{formatPrice(cartSubtotal)}</span>
                      </div>
                    </div>

                    {/* Book Button */}
                    <button
                      onClick={handleProceedToBooking}
                      className="w-full mt-4 btn-primary py-3 px-4 text-[10px] uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all"
                    >
                      Proceed to Book <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Trust Badges - Roopé Promise */}
            <div className="mt-5 bg-white rounded-3xl p-5 border border-pearl-200/80 shadow-xs space-y-4">
              <h4 className="text-[10px] font-bold text-stone-warm/60 uppercase tracking-widest border-b border-pearl-100 pb-2">
                Roopé Guarantee
              </h4>
              
              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <span className="text-base mt-0.5">🌟</span>
                  <div>
                    <h5 className="text-[11px] font-semibold text-roope-primary">Quality Assured Brands</h5>
                    <p className="text-[9px] text-stone-warm/60 mt-0.5 leading-normal">
                      Only premium verified products like MAC, Huda Beauty, & O3+ applied on your skin.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <span className="text-base mt-0.5">⏱️</span>
                  <div>
                    <h5 className="text-[11px] font-semibold text-roope-primary">On-time Scheduled Arrival</h5>
                    <p className="text-[9px] text-stone-warm/60 mt-0.5 leading-normal">
                      Punctuality guaranteed. If your specialist is over 15 mins late, gets ₹200 wallet credit.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <span className="text-base mt-0.5">🛡️</span>
                  <div>
                    <h5 className="text-[11px] font-semibold text-roope-primary">100% Sanitized & Hygienic</h5>
                    <p className="text-[9px] text-stone-warm/60 mt-0.5 leading-normal">
                      Single-use tools, sterilized brushes, disposable sheets and complete face masks.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </aside>

        </div>
      </main>

      {/* ─── MOBILE DYNAMIC FLOATING BOTTOM CART BAR ─── */}
      <AnimatePresence>
        {cartItemsCount > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-pearl-200 shadow-xl px-5 py-4 block lg:hidden"
          >
            <div className="max-w-md mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileCartDrawerOpen(true)}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-champagne-300/20 text-roope-primary relative"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-stone-warm text-white w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold">
                    {cartItemsCount}
                  </span>
                </button>
                <div onClick={() => setMobileCartDrawerOpen(true)} className="cursor-pointer">
                  <p className="text-[9px] font-bold text-stone-warm/50 uppercase tracking-widest leading-none">
                    Subtotal
                  </p>
                  <p className="font-display text-lg font-light text-roope-primary mt-1">
                    {formatPrice(cartSubtotal)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMobileCartDrawerOpen(true)}
                  className="text-xs font-semibold text-stone-warm uppercase tracking-wider px-3.5 py-3 hover:bg-pearl-100 rounded-xl"
                >
                  View Details
                </button>
                <button
                  onClick={handleProceedToBooking}
                  className="btn-primary py-3 px-5 text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1 shadow-md"
                >
                  Book <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── MOBILE BOTTOM DRAWER: Cart Breakdown Details ─── */}
      <AnimatePresence>
        {mobileCartDrawerOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileCartDrawerOpen(false)}
              className="fixed inset-0 bg-black z-50 block lg:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 bg-[#FAF9F6] rounded-t-[32px] shadow-2xl z-50 px-6 py-6 pb-8 border-t border-pearl-200 block lg:hidden max-h-[85vh] overflow-y-auto"
            >
              <div className="w-12 h-1.5 rounded-full bg-pearl-300 mx-auto mb-4" />
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-stone-warm" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-roope-primary">
                    Your Selection Details
                  </h3>
                </div>
                <button
                  onClick={() => setMobileCartDrawerOpen(false)}
                  className="w-7 h-7 rounded-full border border-pearl-200 flex items-center justify-center text-stone-warm"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Items */}
              <div className="space-y-3 mb-6">
                {Object.entries(cart).map(([id, qty]) => {
                  const svc = services.find((s) => s.id === id);
                  if (!svc) return null;
                  return (
                    <div key={id} className="flex justify-between items-center text-xs pb-3 border-b border-pearl-100 last:border-b-0 last:pb-0">
                      <div>
                        <p className="font-semibold text-roope-primary leading-tight">
                          {svc.name}
                        </p>
                        <p className="text-[10px] text-stone-warm/50 mt-0.5">
                          {formatPrice(svc.price)} each
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRemoveFromCart(id)}
                          className="w-5 h-5 rounded-full flex items-center justify-center border border-pearl-200 text-stone-warm"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-roope-primary text-xs w-4 text-center">
                          {qty}
                        </span>
                        <button
                          onClick={() => handleAddToCart(id)}
                          className="w-5 h-5 rounded-full flex items-center justify-center border border-pearl-200 text-stone-warm"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Billing Info */}
              <div className="border-t border-pearl-200 pt-4 space-y-2.5 mb-6 text-xs text-stone-warm">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span className="font-semibold text-roope-primary">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-stone-warm/75">
                  <span>Taxes & Fee</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Free</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-roope-primary pt-3 border-t border-pearl-100">
                  <span>Grand Total</span>
                  <span className="text-gradient-gold text-sm">{formatPrice(cartSubtotal)}</span>
                </div>
              </div>

              {/* Promo recommendation */}
              <div className="p-3.5 bg-champagne-300/10 border border-champagne-DEFAULT/20 rounded-2xl mb-6 flex gap-2.5 items-start">
                <Sparkles className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <p className="text-[9px] text-stone-warm/80 leading-normal">
                  Promos are available. Apply coupon <strong className="text-roope-primary">ROOPE25</strong> at checkout to get flat 25% off up to ₹1,500.
                </p>
              </div>

              {/* Checkout Trigger */}
              <button
                onClick={handleProceedToBooking}
                className="w-full btn-primary py-4 px-6 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-md"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
