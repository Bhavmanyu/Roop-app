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
  ArrowLeft,
  ChevronRight,
  MapPin,
  ChevronDown
} from "lucide-react";
import { services } from "@/lib/data";
import { formatPrice, getDiscount } from "@/lib/utils";
import ComparePackages from "@/components/services/ComparePackages";

// Category Definitions with Unsplash High-Fidelity Thumbnails & Dynamic Badges
const CATEGORY_MAP = [
  {
    id: "super-saver",
    label: "Super savers",
    badge: "Upto 20% OFF",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=150",
    description: "Curated combos & monthly care",
    gender: "women"
  },
  {
    id: "waxing",
    label: "Waxing & threading",
    badge: "Price drop",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=150",
    description: "Hygienic cartridge & spatula peel-off",
    gender: "women"
  },
  {
    id: "facials",
    label: "Korean facials",
    badge: "Glow special",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=150",
    description: "Deep cleanse & collagen hydration",
    gender: "women"
  },
  {
    id: "pedi-mani",
    label: "Pedicure & manicure",
    badge: "Luxury spa",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=150",
    description: "Candle spa & structural nail therapy",
    gender: "women"
  },
  {
    id: "grooming",
    label: "Men's grooming",
    badge: "Styling lead",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=150",
    description: "Precision haircuts & hot towel shaves",
    gender: "men"
  },
  {
    id: "spa-massage",
    label: "Spa & massage",
    badge: "Stress relief",
    image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=150",
    description: "Full body Swedish & deep tissue",
    gender: "unisex"
  }
];

// Google powered search suggestions locked to Indore
const INDORE_SUGGESTIONS = [
  "63, Maharani Road, Siyaganj, Indore",
  "Shalimar Palms, Bypass Road, Indore",
  "Apollo DB City, Nipania, Indore",
  "Silver Spring, Bypass Road, Indore",
  "Scheme No 54, Vijay Nagar, Indore",
  "Saket Colony, Old Palasia, Indore",
  "New Palasia, Indore",
  "Anand Bazar, Indore",
  "Race Course Road, Indore",
  "Manorama Ganj, Indore"
];

export default function ServicesPage() {
  const router = useRouter();
  const [step, setStep] = useState<"portal" | "catalog">("portal");
  const [gender, setGender] = useState<"men" | "women" | null>(null);
  const [showWomenOptions, setShowWomenOptions] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("super-saver");
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [mobileCartDrawerOpen, setMobileCartDrawerOpen] = useState(false);

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [activeLocation, setActiveLocation] = useState("63, Maharani Road, Siyaganj, Indore");
  const [locationSearch, setLocationSearch] = useState("");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // References for smooth scrolling category synchronization
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const centerPaneRef = useRef<HTMLDivElement | null>(null);
  const isAutoScrolling = useRef(false);
  const hasScrolledOnMount = useRef(false);

  // Handle auto-scroll to category on initial entry into catalog
  useEffect(() => {
    if (step === "portal") {
      hasScrolledOnMount.current = false;
    } else if (step === "catalog" && activeCategory && !hasScrolledOnMount.current) {
      // Small timeout to allow DOM to render and populate sectionRefs
      const timer = setTimeout(() => {
        const targetSection = sectionRefs.current[activeCategory];
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
          hasScrolledOnMount.current = true;
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [step, activeCategory]);

  // Lock body scroll on ALL devices. overflow:hidden on body does NOT affect position:fixed elements.
  useEffect(() => {
    const isLocked = isLocationModalOpen || mobileCartDrawerOpen;
    if (isLocked) {
      const isMobile = window.matchMedia("(pointer: coarse)").matches ||
                       /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        const scrollY = window.scrollY;
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = "100%";
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "hidden";
      }
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (scrollY) window.scrollTo(0, parseInt(scrollY, 10) * -1);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isLocationModalOpen, mobileCartDrawerOpen]);

  // Load cart and location from localStorage on component mount, and check URL search parameters
  useEffect(() => {
    const savedCart = localStorage.getItem("roope-cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        localStorage.removeItem("roope-cart");
      }
    }

    const savedLoc = localStorage.getItem("roope-location");
    if (savedLoc) {
      setActiveLocation(savedLoc);
    }

    // Client-side safe search parameter parser to avoid Next.js static de-optimization
    const params = new URLSearchParams(window.location.search);
    const urlSearch = params.get("search");
    const urlGender = params.get("gender") as "men" | "women" | null;
    const urlCategory = params.get("category");

    if (urlGender) {
      setGender(urlGender);
      setStep("catalog");
      if (urlGender === "men") {
        setActiveCategory("grooming");
      } else {
        setActiveCategory("super-saver");
      }
    }

    if (urlCategory) {
      setActiveCategory(urlCategory);
      setStep("catalog");
    }

    if (urlSearch) {
      setSearch(urlSearch);
      setStep("catalog");
    }
  }, []);

  // Listen for global navbar search events for real-time catalog filtering
  useEffect(() => {
    const handleGlobalSearch = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setSearch(customEvent.detail);
      if (customEvent.detail) {
        setStep("catalog");
      }
    };

    window.addEventListener("roope-global-search", handleGlobalSearch);
    return () => {
      window.removeEventListener("roope-global-search", handleGlobalSearch);
    };
  }, []);

  // Update localStorage when cart changes
  const saveCart = (newCart: { [id: string]: number }) => {
    setCart(newCart);
    localStorage.setItem("roope-cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("roope-cart-updated"));
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

  // Select location callback
  const handleSelectLocation = (loc: string) => {
    setActiveLocation(loc);
    localStorage.setItem("roope-location", loc);
    setIsLocationModalOpen(false);
  };

  // Detect location via GPS + reverse geocoding API
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`/api/location/detect?lat=${latitude}&lng=${longitude}`);
          const data = await res.json();
          if (data.address) {
            handleSelectLocation(data.address);
          } else {
            alert("Could not detect location. Please select manually.");
          }
        } catch (error) {
          console.error("Detect location error:", error);
          alert("Error detecting location. Please select manually.");
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMsg = "Unable to retrieve your location.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Location access was denied. Please check site permissions.";
        }
        alert(errorMsg);
        setIsDetectingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  // Cart Metrics
  const cartItemsCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const cartSubtotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const svc = services.find((s) => s.id === id);
    return sum + (svc ? svc.price * qty : 0);
  }, 0);

  // Categories list matching currently active gender filter
  const visibleCategories = CATEGORY_MAP.filter((cat) => {
    if (!gender) return true;
    if (gender === "men") return cat.gender === "men" || cat.gender === "unisex";
    return cat.gender === "women" || cat.gender === "unisex";
  });

  // Services list filtered by active categories, gender, and search text
  const filteredServices = services.filter((s) => {
    // 1. Search Query Match
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                        s.description.toLowerCase().includes(search.toLowerCase()) ||
                        s.category.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;

    // 2. Gender Match
    if (gender === "men") {
      return s.occasion.includes("Men") || s.occasion.includes("Unisex");
    } else if (gender === "women") {
      return s.occasion.includes("Women") || s.occasion.includes("Unisex");
    }
    return true;
  });

  // Scroll to targeted category section inside the center pane
  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
    const targetSection = sectionRefs.current[catId];
    if (targetSection) {
      isAutoScrolling.current = true;
      targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        isAutoScrolling.current = false;
      }, 800);
    }
  };

  // Synchronize category highlight based on scroll position of center pane
  useEffect(() => {
    if (step !== "catalog") return;

    const handleScrollSync = () => {
      if (isAutoScrolling.current) return;
      const scrollPosition = window.scrollY + 180; // offset for nav header height

      let currentActive = activeCategory;
      for (const cat of visibleCategories) {
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
    };

    window.addEventListener("scroll", handleScrollSync);
    return () => window.removeEventListener("scroll", handleScrollSync);
  }, [activeCategory, step, visibleCategories]);

  // Filter dynamic location suggestions
  const filteredSuggestions = INDORE_SUGGESTIONS.filter((sug) =>
    sug.toLowerCase().includes(locationSearch.toLowerCase())
  );

  // Handle entry into catalog
  const handleSelectGenderCatalog = (g: "men" | "women") => {
    setGender(g);
    setStep("catalog");
    if (g === "men") {
      setActiveCategory("grooming");
    } else {
      setActiveCategory("super-saver");
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  // Navigate to /book and pre-fill selected items inside checkout drawer
  const handleProceedToBooking = () => {
    if (cartItemsCount === 0) return;
    localStorage.setItem("roope-cart", JSON.stringify(cart));
    router.push("/book/checkout?checkout=direct");
  };



  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-pearl pb-32">
      <AnimatePresence mode="wait">
        
        {/* ─── STEP 1: DOORSTEP SERVICES PORTAL SELECTOR ─── */}
        {step === "portal" && (
          <motion.div
            key="portal-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="pt-32 pb-16 px-4 max-w-5xl mx-auto flex flex-col items-center min-h-[85vh] justify-center"
          >
            {/* Location selector at the top of portal view */}
            <div className="mb-6 flex justify-center">
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="flex items-center gap-2.5 bg-white border border-pearl-300/80 rounded-full px-5 py-3 shadow-luxury text-xs font-bold text-roope-primary hover:border-champagne-DEFAULT hover:shadow-gold transition-all"
              >
                <MapPin className="w-4 h-4 text-champagne-DEFAULT flex-shrink-0" />
                <span className="truncate max-w-[200px]">{activeLocation}</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-warm/50 flex-shrink-0" />
              </button>
            </div>

            {/* Header branding */}
            <div className="text-center mb-10 max-w-lg">
              <div className="flex items-center gap-1.5 justify-center mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-champagne-DEFAULT" />
                <span className="text-[11.5px] uppercase font-bold tracking-widest text-[#B8922E]">
                  doorstep premium services
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-champagne-DEFAULT" />
              </div>
              <h1 className="font-display text-xl md:text-5xl font-semibold md:font-light text-roope-primary leading-tight">
                Home services at <span className="italic text-gradient-gold">your doorstep</span>
              </h1>
              <p className="text-xs text-stone-warm mt-3 leading-relaxed">
                Choose premium salon, grooming, and luxury spa treatments curated specifically for your needs. Serving premium addresses in Indore.
              </p>
            </div>

            {/* Main Selection Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-8 w-full max-w-4xl px-2">
              
              {/* Card 1: Services for Women */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-[20px] md:rounded-[32px] border border-pearl-200/80 shadow-luxury overflow-hidden flex flex-col min-h-[220px] md:min-h-[380px] relative group"
              >
                {/* Background Image Header */}
                <div className="relative h-20 md:h-44 w-full bg-pearl-200 overflow-hidden flex-shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600"
                    alt="Salon for Women"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 400px"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
                </div>

                {/* Sub-selector Options inside the card (smooth fade-in) */}
                <div className="p-3 md:p-6 flex-1 flex flex-col justify-between z-10 bg-white">
                  <AnimatePresence mode="wait">
                    {!showWomenOptions ? (
                      /* Main cover view */
                      <motion.div
                        key="women-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col flex-1 justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] md:text-[11px] font-bold text-stone-warm/50 uppercase tracking-wider truncate">
                              Unisex Leads
                            </span>
                            <span className="text-[10px] md:text-[11px] bg-champagne-300/30 text-roope-primary px-1.5 py-0.5 rounded font-extrabold uppercase">
                              ★ 4.86
                            </span>
                          </div>
                          <h3 className="font-display text-xs md:text-2xl font-bold md:font-light text-roope-primary leading-tight">
                            Services for Women
                          </h3>
                          <p className="hidden md:block text-[11px] text-stone-warm/70 mt-2 leading-relaxed">
                            Treat yourself to premium spatula/cartridge waxing, Korean collagen facials, organic candle spa pedicures, and luxury full-body stress-relieving massage therapy.
                          </p>
                        </div>

                        <button
                          onClick={() => setShowWomenOptions(true)}
                          className="mt-3 md:mt-6 w-full btn-primary py-2 md:py-3.5 text-[10.5px] md:text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-1"
                        >
                          Explore <ChevronRight className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ) : (
                      /* Selection Choices (Personal vs Bridal) */
                      <motion.div
                        key="women-options"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col flex-1 justify-between h-full"
                      >
                        <div className="space-y-2 md:space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-[10.5px] md:text-xs font-extrabold uppercase text-stone-warm tracking-wider truncate">
                              Choose Type
                            </h4>
                            <button
                              onClick={() => setShowWomenOptions(false)}
                              className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-gold hover:underline"
                            >
                              ← Back
                            </button>
                          </div>

                          <div className="grid gap-2">
                            {/* Option 1: Personal Styling & Salon */}
                            <button
                              onClick={() => handleSelectGenderCatalog("women")}
                              className="w-full text-left p-2 md:p-4 rounded-xl md:rounded-2xl border border-pearl-200 hover:border-champagne-DEFAULT hover:bg-champagne-300/5 transition-all flex items-center gap-2 md:gap-4 group/opt"
                            >
                              <div className="w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-champagne-300/20 text-roope-primary flex items-center justify-center font-bold text-xs md:text-lg">
                                🧴
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="text-[11px] md:text-xs font-bold text-roope-primary group-hover/opt:text-[#B8922E] truncate">
                                  Salon & Spa
                                </h5>
                                <p className="hidden md:block text-[10px] text-stone-warm/50 truncate mt-0.5">
                                  Hygienic waxing, glow facials, spa mani-pedi & massages.
                                </p>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-stone-warm/40 group-hover/opt:text-roope-primary flex-shrink-0" />
                            </button>

                            {/* Option 2: Bridal & Wedding packages */}
                            <button
                              onClick={() => router.push("/bridal")}
                              className="w-full text-left p-2 md:p-4 rounded-xl md:rounded-2xl border border-pearl-200 hover:border-champagne-DEFAULT hover:bg-champagne-300/5 transition-all flex items-center gap-2 md:gap-4 group/opt"
                            >
                              <div className="w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-champagne-300/20 text-roope-primary flex items-center justify-center font-bold text-xs md:text-lg">
                                💍
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="text-[11px] md:text-xs font-bold text-roope-primary group-hover/opt:text-[#B8922E] truncate">
                                  Bridal Collection
                                </h5>
                                <p className="hidden md:block text-[10px] text-stone-warm/50 truncate mt-0.5">
                                  HD & Airbrush bridal packages with certified lead artists.
                                </p>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-stone-warm/40 group-hover/opt:text-roope-primary flex-shrink-0" />
                            </button>
                          </div>
                        </div>

                        <p className="hidden md:block text-[9px] text-stone-warm/50 mt-4 leading-normal">
                          All personal styling services are performed inside the privacy and comfort of your home by highly certified female beauty specialists.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Card 2: Services for Men */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-[20px] md:rounded-[32px] border border-pearl-200/80 shadow-luxury overflow-hidden flex flex-col min-h-[220px] md:min-h-[380px] relative group"
              >
                {/* Background Image Header */}
                <div className="relative h-20 md:h-44 w-full bg-pearl-200 overflow-hidden flex-shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600"
                    alt="Grooming for Men"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 400px"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
                </div>

                {/* Body Content */}
                <div className="p-3 md:p-6 flex-1 flex flex-col justify-between bg-white z-10">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] md:text-[11px] font-bold text-stone-warm/50 uppercase tracking-wider truncate">
                        Premium Men
                      </span>
                      <span className="text-[10px] md:text-[11px] bg-champagne-300/30 text-roope-primary px-1.5 py-0.5 rounded font-extrabold uppercase">
                        ★ 4.84
                      </span>
                    </div>
                    <h3 className="font-display text-xs md:text-2xl font-bold md:font-light text-roope-primary leading-tight">
                      Men&apos;s Grooming
                    </h3>
                    <p className="hidden md:block text-[11px] text-stone-warm/70 mt-2 leading-relaxed">
                      Elevate your everyday look with precision haircuts, tailored beard grooming, and charcoal skin detoxification.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={() => handleSelectGenderCatalog("men")}
                      className="w-full btn-primary py-2 md:py-3.5 text-[10.5px] md:text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-1 mt-3 md:mt-6"
                    >
                      Explore <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>

            </div>

            {/* Trust Footer */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-10 mt-14 border-t border-pearl-200/50 pt-8 w-full text-center">
              <div className="flex items-center gap-2">
                <span className="text-[#C9A84C]">🛡️</span>
                <span className="text-[10px] font-bold text-stone-warm/70 uppercase tracking-widest">
                  100% Sanitized Kits
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#C9A84C]">⏱️</span>
                <span className="text-[10px] font-bold text-stone-warm/70 uppercase tracking-widest">
                  On-Time Guarantee
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#C9A84C]">🌟</span>
                <span className="text-[10px] font-bold text-stone-warm/70 uppercase tracking-widest">
                  Certified Professionals Only
                </span>
              </div>
            </div>

          </motion.div>
        )}

        {/* ─── STEP 2: SPLIT-PANE MULTI-SERVICE CATALOG VIEW ─── */}
        {step === "catalog" && (
          <motion.div
            key="catalog-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Header & Category Banner */}
            <section className="pt-24 pb-6 bg-gradient-to-b from-[#F3EFE6] to-[#FAF9F6] px-4 md:px-8 border-b border-pearl-200/50">
              <div className="max-w-7xl mx-auto">
                
                {/* Back button to return to Doorstep Portal */}
                <button
                  onClick={() => {
                    setStep("portal");
                    setShowWomenOptions(false);
                    setGender(null);
                  }}
                  className="mb-4 text-xs font-bold text-stone-warm hover:text-roope-primary flex items-center gap-1.5 group transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                  <span>Back to Doorstep Portal</span>
                </button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3 justify-start">
                      <span className="text-[10.5px] md:text-[11px] bg-champagne-300/20 text-roope-primary px-2.5 py-1 rounded-full font-bold uppercase tracking-widest whitespace-nowrap border border-champagne-400/20">
                        Salon Prime
                      </span>
                      <span className="text-[10.5px] md:text-[11px] bg-[#B8922E]/10 text-[#B8922E] px-2.5 py-1 rounded-full font-extrabold uppercase tracking-widest whitespace-nowrap border border-[#B8922E]/20">
                        For {gender === "men" ? "Gentlemen" : "Ladies"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10.5px] md:text-[11px] bg-white text-stone-warm border border-pearl-300 px-2.5 py-1 rounded-full font-bold whitespace-nowrap shadow-sm">
                        <Star className="w-3.5 h-3.5 fill-champagne-DEFAULT text-champagne-DEFAULT" />
                        <span>4.85</span>
                        <span className="text-stone-light mx-0.5 font-normal">|</span>
                        <span className="text-stone-warm/80 font-normal hidden sm:inline">17.6M bookings</span>
                        <span className="text-stone-warm/80 font-normal sm:hidden">17M+</span>
                      </span>
                    </div>
                    <h1 className="font-display text-2xl md:text-5xl font-semibold md:font-light text-roope-primary tracking-tight leading-tight text-left">
                      Luxury <span className="italic text-gradient-gold">Doorstep Services</span>
                    </h1>
                    <p className="text-xs md:text-sm text-stone-warm mt-2 text-left max-w-xl leading-relaxed">
                      Unisex premium salon, high-end grooming, therapeutic massage, and deep relaxing spa experiences. Highly trained professionals using luxury products.
                    </p>
                  </div>

                  {/* Location selector and Search Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:max-w-xl">
                    
                    {/* Location selector trigger button */}
                    <button
                      onClick={() => setIsLocationModalOpen(true)}
                      className="flex items-center justify-between gap-2.5 bg-white border border-pearl-300 rounded-2xl px-4 py-3.5 shadow-sm text-xs font-semibold text-roope-primary hover:border-champagne-DEFAULT hover:shadow-xs transition-all flex-shrink-0 min-w-0"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <MapPin className="w-4 h-4 text-champagne-DEFAULT flex-shrink-0" />
                        <span className="truncate max-w-[130px]">{activeLocation}</span>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-stone-warm/50 flex-shrink-0" />
                    </button>

                    {/* Dynamic Search Box */}
                    <div className="relative flex-1 min-w-0">
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

                {/* Sub-Gender Switcher Tabs inside the catalog */}
                <div className="mt-6 flex justify-between border-t border-pearl-200/50 pt-4 items-center">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSelectGenderCatalog("women")}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                        gender === "women"
                          ? "bg-roope-primary text-pearl dark:bg-champagne dark:text-[#100E0D]"
                          : "bg-pearl-50 border border-pearl-200 text-stone-warm hover:text-roope-primary"
                      }`}
                    >
                      Women&apos;s Salon & Spa
                    </button>
                    <button
                      onClick={() => handleSelectGenderCatalog("men")}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                        gender === "men"
                          ? "bg-roope-primary text-pearl dark:bg-champagne dark:text-[#100E0D]"
                          : "bg-pearl-50 border border-pearl-200 text-stone-warm hover:text-roope-primary"
                      }`}
                    >
                      Men&apos;s Grooming
                    </button>
                  </div>

                  {gender === "women" && (
                    <button
                      onClick={() => router.push("/bridal")}
                      className="text-xs font-bold text-[#B8922E] hover:underline flex items-center gap-1 group"
                    >
                      <span>Explore Bridal & Wedding Collections</span>
                      <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  )}
                </div>

              </div>
            </section>

            {/* ─── 3-Pane Split Layout Container ─── */}
            <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
              <div className="flex gap-6 items-start relative">
                
                {/* ─── LEFT PANEL: Sticky Category Navigation (Desktop) ─── */}
                <aside className="hidden md:block w-64 sticky top-[100px] max-h-[calc(100vh-140px)] overflow-y-auto pr-2 scrollbar-none">
                  <p className="text-[10px] font-bold text-stone-warm/60 uppercase tracking-widest mb-4 pl-2">
                    Select Category
                  </p>
                  <nav className="space-y-2">
                    {visibleCategories.map((cat) => {
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

                          {/* Labels */}
                          <div className="flex-1 min-w-0">
                            <span className={`text-xs font-bold leading-tight ${isActive ? "text-roope-primary" : "text-stone-warm/90"}`}>
                              {cat.label}
                            </span>
                            <p className="text-[10.5px] text-stone-warm/50 truncate leading-snug mt-0.5">
                              {cat.description}
                            </p>
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
                  <div className="block md:hidden sticky top-[72px] z-10 bg-[#FAF9F6]/90 dark:bg-[#0C0A09]/90 backdrop-blur-md -mx-4 px-4 py-2 border-b border-pearl-200/60 overflow-x-auto scrollbar-none snap-x mb-4">
                    <div className="flex gap-2.5">
                      {visibleCategories.map((cat) => {
                        const isActive = activeCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.id)}
                            className={`flex-shrink-0 snap-start px-3.5 py-1.5 rounded-full text-[12px] font-semibold border transition-all duration-300 ${
                              isActive 
                                ? "bg-stone-warm border-stone-warm text-white shadow-sm" 
                                : "bg-white border-pearl-200 text-stone-warm hover:text-roope-primary"
                            }`}
                          >
                            <span>{cat.label}</span>
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
                  {visibleCategories.map((category) => {
                    const catServices = filteredServices.filter((s) => s.category === category.id);
                    if (catServices.length === 0) return null;

                    return (
                      <div
                        key={category.id}
                        id={`section-${category.id}`}
                        ref={(el) => { sectionRefs.current[category.id] = el; }}
                        className="mb-12 scroll-mt-28"
                      >
                        {/* Category Section Header Card */}
                        <div className="glass rounded-2xl p-3 md:p-6 mb-4 md:mb-6 border border-pearl-200/80 shadow-sm flex flex-row sm:flex-row gap-3 md:gap-5 items-center justify-between relative overflow-hidden bg-white/70">
                          <div className="relative z-10 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] md:text-[11px] bg-champagne-300/40 text-roope-primary px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                                Certified Prime
                              </span>
                              {category.badge && (
                                <span className="text-[10px] md:text-[11px] text-[#B8922E] font-bold">
                                  ★ {category.badge}
                                </span>
                              )}
                            </div>
                            <h2 className="font-display text-base font-semibold md:text-2xl md:font-light text-roope-primary leading-tight">
                              {category.label}
                            </h2>
                            <p className="text-stone-warm text-[11px] md:text-xs mt-0.5 md:mt-1 max-w-md leading-normal md:leading-relaxed">
                              Exquisite custom care bundles curated under Roopé luxury quality guidelines. Painless, hygienic, and highly satisfying.
                            </p>
                          </div>

                          {/* Category Hero Banner Photo */}
                          <div className="relative w-20 md:w-44 h-14 md:h-28 rounded-xl md:rounded-2xl overflow-hidden border border-pearl-200 flex-shrink-0 bg-pearl-200">
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
                                className={`bg-white rounded-2xl border p-3 pb-4 md:p-5 flex flex-row gap-3 md:gap-5 items-start justify-between transition-all duration-300 hover:shadow-md ${
                                  qty > 0 ? "border-champagne-DEFAULT ring-1 ring-champagne-300/10" : "border-pearl-200/80"
                                }`}
                              >
                                {/* Info Column */}
                                <div className="flex-1 min-w-0">
                                  {/* Service Badge & Tags */}
                                  <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                                    {svc.tag && (
                                      <span className="text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                                        {svc.tag}
                                      </span>
                                    )}
                                    {svc.category === "super-saver" && (
                                      <button
                                        onClick={() => {
                                          window.dispatchEvent(
                                            new CustomEvent("roope-trigger-compare", {
                                              detail: { packageId: svc.id }
                                            })
                                          );
                                        }}
                                        className="text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-champagne-300/20 text-[#B8922E] border border-champagne-DEFAULT/25 hover:bg-[#B8922E] hover:text-white transition-all cursor-pointer"
                                      >
                                        Compare Package
                                      </button>
                                    )}
                                    <span className="text-[10.5px] font-bold text-stone-warm/50 uppercase tracking-widest">
                                      {svc.occasion}
                                    </span>
                                  </div>

                                  {/* Service Name */}
                                  <h3 className="font-display text-xs sm:text-sm md:text-lg font-semibold md:font-light text-roope-primary leading-snug">
                                    {svc.name}
                                  </h3>

                                  {/* Reviews, Star Rating */}
                                  <div className="flex items-center gap-1.5 text-[10.5px] sm:text-xs text-stone-warm mt-0.5 md:mt-1">
                                    <span className="text-[#C9A84C] font-semibold">★ {svc.rating}</span>
                                    <span className="text-stone-warm/40">•</span>
                                    <span className="text-stone-warm/60">({svc.reviews.toLocaleString()} reviews)</span>
                                  </div>

                                  {/* Mobile-only Pricing & Duration */}
                                  <div className="flex items-center gap-2 mt-1 sm:hidden">
                                    <span className="font-display text-xs font-bold text-roope-primary">
                                      {formatPrice(svc.price)}
                                    </span>
                                    {svc.originalPrice && (
                                      <span className="text-[11px] text-stone-warm/40 line-through">
                                        {formatPrice(svc.originalPrice)}
                                      </span>
                                    )}
                                    <span className="text-[10.5px] text-stone-warm/50 flex items-center gap-0.5 ml-1">
                                      <Clock className="w-2.5 h-2.5 text-stone-warm/30" />
                                      <span>{svc.duration}</span>
                                    </span>
                                  </div>

                                  {/* Bullet Point Inclusions */}
                                  {svc.includes && svc.includes.length > 0 && (
                                    <ul className="mt-2 space-y-0.5 border-t border-pearl-100/60 pt-1.5 md:mt-3.5 md:space-y-1.5 md:pt-3">
                                      {svc.includes.map((inc, i) => (
                                        <li key={i} className="flex gap-1 items-start text-[11.5px] md:text-xs text-stone-warm/80">
                                          <span className="text-champagne-DEFAULT font-bold flex-shrink-0">✓</span>
                                          <span className="leading-snug">{inc}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}

                                  {/* In-Depth Description */}
                                  <p className="text-stone-warm/60 text-[11px] md:text-[11px] mt-1.5 md:mt-3 leading-relaxed line-clamp-2 md:line-clamp-none">
                                    {svc.description}
                                  </p>
                                </div>

                                {/* Pricing & "Add" Counter Column */}
                                <div className="flex flex-col items-center flex-shrink-0 w-20 sm:w-36 relative">
                                  {/* Service Image Preview */}
                                  <div className="relative w-20 sm:w-28 h-20 sm:h-20 rounded-xl overflow-hidden border border-pearl-200/80 bg-pearl-200 flex-shrink-0">
                                    <Image
                                      src={svc.image}
                                      alt={svc.name}
                                      fill
                                      className="object-cover"
                                      sizes="(max-width: 640px) 80px, 112px"
                                      unoptimized
                                    />
                                    {discount > 0 && (
                                      <span className="absolute top-1 right-1 px-1 py-0.5 rounded text-[9.5px] font-bold text-white bg-stone-warm/80 backdrop-blur-xs">
                                        -{discount}%
                                      </span>
                                    )}
                                  </div>

                                  {/* Prices and Duration - Desktop Only */}
                                  <div className="hidden sm:block text-center mt-2.5">
                                    <div className="flex items-baseline gap-1.5 justify-center">
                                      <span className="font-display text-sm font-semibold md:text-lg md:font-light text-roope-primary">
                                        {formatPrice(svc.price)}
                                      </span>
                                      {svc.originalPrice && (
                                        <span className="text-[10px] text-stone-warm/40 line-through">
                                          {formatPrice(svc.originalPrice)}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[10px] text-stone-warm/50 flex items-center gap-1 justify-center mt-0.5">
                                      <Clock className="w-3 h-3 text-stone-warm/30" />
                                      <span>{svc.duration}</span>
                                    </p>
                                  </div>

                                  {/* "Add" or Counter Buttons */}
                                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 sm:static sm:bottom-auto sm:left-auto sm:translate-x-0 sm:mt-3 z-10 shadow-md sm:shadow-none">
                                    {qty === 0 ? (
                                      <button
                                        onClick={() => handleAddToCart(svc.id)}
                                        className="w-16 sm:w-28 py-1 sm:py-2 border border-champagne-DEFAULT rounded-lg sm:rounded-xl text-[10.5px] sm:text-xs font-semibold text-roope-primary uppercase tracking-widest hover:bg-champagne-DEFAULT hover:text-white transition-all bg-white"
                                      >
                                        Add
                                      </button>
                                    ) : (
                                      <div className="w-16 sm:w-28 py-0.5 px-1 sm:py-1.5 sm:px-2 bg-stone-warm border border-stone-warm rounded-lg sm:rounded-xl flex items-center justify-between text-white text-[10.5px] sm:text-xs font-bold">
                                        <button 
                                          onClick={() => handleRemoveFromCart(svc.id)}
                                          className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                                        >
                                          <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                        </button>
                                        <span>{qty}</span>
                                        <button 
                                          onClick={() => handleAddToCart(svc.id)}
                                          className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                                        >
                                          <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
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
                  className="fixed bottom-14 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-pearl-200 shadow-xl px-3.5 py-2.5 block lg:hidden"
                >
                  <div className="max-w-md mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setMobileCartDrawerOpen(true)}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-champagne-300/20 text-roope-primary relative"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span className="absolute -top-1 -right-1 bg-stone-warm text-white w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9.5px] font-bold">
                          {cartItemsCount}
                        </span>
                      </button>
                      <div onClick={() => setMobileCartDrawerOpen(true)} className="cursor-pointer">
                        <p className="text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest leading-none">
                          Subtotal
                        </p>
                        <p className="font-display text-sm font-semibold text-roope-primary mt-0.5">
                          {formatPrice(cartSubtotal)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setMobileCartDrawerOpen(true)}
                        className="text-[11px] font-semibold text-stone-warm uppercase tracking-wider px-2 py-2 hover:bg-pearl-100 rounded-xl"
                      >
                        Details
                      </button>
                      <button
                        onClick={handleProceedToBooking}
                        className="btn-primary py-2 px-3.5 text-[11.5px] uppercase tracking-widest font-semibold flex items-center gap-1 shadow-md"
                      >
                        Book <ArrowRight className="w-3 h-3" />
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
                    className="fixed inset-0 bg-black z-40 block lg:hidden"
                  />
                  {/* Drawer */}
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 220 }}
                    className="fixed bottom-0 left-0 right-0 bg-[#FAF9F6] dark:bg-[#110F0E] rounded-t-[20px] shadow-2xl z-50 px-4 py-4 pb-6 border-t border-pearl-200 block lg:hidden max-h-[85vh] overflow-y-auto overscroll-contain"
                  >
                    <div className="w-10 h-1 rounded-full bg-pearl-300 mx-auto mb-3" />
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
                              <p className="text-[11.5px] text-stone-warm/50 mt-0.5">
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
                        <span className="text-[11.5px] font-bold uppercase tracking-wider text-emerald-600">Free</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-bold text-roope-primary pt-3 border-t border-pearl-100">
                        <span>Grand Total</span>
                        <span className="text-gradient-gold text-sm">{formatPrice(cartSubtotal)}</span>
                      </div>
                    </div>

                    {/* Promo recommendation */}
                    <div className="p-3.5 bg-champagne-300/10 border border-champagne-DEFAULT/25 rounded-2xl mb-6 flex gap-2.5 items-start">
                      <Sparkles className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                      <p className="text-[10.5px] text-[#B8922E] leading-normal font-bold">
                        Promos are available. Apply coupon <strong className="text-roope-primary">ROOPE25</strong> at checkout to get flat 25% off up to ₹1,500.
                      </p>
                    </div>

                    {/* Checkout Trigger */}
                    <button
                      onClick={handleProceedToBooking}
                      className="w-full btn-primary py-2.5 px-4 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-md"
                    >
                      Proceed to Checkout <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── GOOGLE LOCATION SELECTOR MODAL ─── */}
      <AnimatePresence>
        {isLocationModalOpen && (
          <>
            {/* Modal Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLocationModalOpen(false)}
              className="fixed inset-0 bg-black z-50 backdrop-blur-xs cursor-pointer"
            />

            {/* Centered Modal Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-x-4 top-[15%] sm:top-[25%] sm:left-1/2 sm:-translate-x-1/2 sm:max-w-md bg-white rounded-[32px] shadow-2xl z-50 p-6 flex flex-col border border-pearl-200"
            >
              {/* Modal Input Search Line */}
              <div className="relative flex items-center border-b border-pearl-100 pb-4 mb-4">
                <button
                  onClick={() => setIsLocationModalOpen(false)}
                  className="mr-3 text-stone-warm hover:text-roope-primary transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  placeholder="Search for your location/society/apartment"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="w-full bg-[#FAF9F6] dark:bg-[#141210] px-4 py-3 rounded-2xl text-xs font-semibold text-roope-primary border border-pearl-200 outline-none focus:border-champagne-DEFAULT focus:ring-1 focus:ring-champagne-DEFAULT/20 transition-all"
                  autoFocus
                />
                {locationSearch && (
                  <button
                    onClick={() => setLocationSearch("")}
                    className="absolute right-4 top-[35%] -translate-y-1/2 text-stone-warm/50 hover:text-roope-primary"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Use Current GPS Location Row */}
              <button
                onClick={handleDetectLocation}
                disabled={isDetectingLocation}
                className="flex items-center gap-2.5 px-3 py-3 rounded-xl hover:bg-champagne-300/5 text-xs font-bold text-roope-primary transition-all text-left w-full disabled:opacity-50"
              >
                <span className="w-5 h-5 rounded-full bg-champagne-300/20 text-[#B8922E] flex items-center justify-center font-bold text-[11.5px]">
                  {isDetectingLocation ? "⏳" : "🎯"}
                </span>
                <span>{isDetectingLocation ? "Detecting location..." : "Use current location"}</span>
              </button>

              {/* Suggestions List */}
              <div className="flex-1 max-h-56 overflow-y-auto mt-2 space-y-1 scrollbar-none pr-1">
                {filteredSuggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectLocation(sug)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-pearl-100/50 text-left transition-all group"
                  >
                    <MapPin className="w-4 h-4 text-stone-warm/40 group-hover:text-champagne-DEFAULT flex-shrink-0" />
                    <span className="text-xs text-stone-warm/80 group-hover:text-roope-primary truncate">
                      {sug}
                    </span>
                  </button>
                ))}
                {filteredSuggestions.length === 0 && (
                  <p className="text-[11.5px] text-center text-stone-warm/50 py-4 font-semibold uppercase">
                    No matching location in Indore
                  </p>
                )}
              </div>

              {/* Official Google Branding Watermark */}
              <div className="flex items-center justify-center gap-1.5 border-t border-pearl-100 pt-4 mt-4 text-[11.5px] text-stone-warm/50 font-bold uppercase tracking-wider select-none bg-white">
                <span>powered by</span>
                <span className="inline-flex font-semibold tracking-normal font-sans text-xs select-none">
                  <span className="text-[#4285F4]">G</span>
                  <span className="text-[#EA4335]">o</span>
                  <span className="text-[#FBBC05]">o</span>
                  <span className="text-[#4285F4]">g</span>
                  <span className="text-[#34A853]">l</span>
                  <span className="text-[#EA4335]">e</span>
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── COMPARE PACKAGES DRAWER MODAL ─── */}
      {step === "catalog" && (
        <ComparePackages
          cart={cart}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
        />
      )}
    </div>
  );
}

