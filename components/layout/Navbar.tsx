"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, User, LogOut, Calendar, Shield, Search, ShoppingBag, Sun, Moon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import AuthModal from "@/components/auth/AuthModal";
import { services, bridalPackages, eventPackages } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/bridal", label: "Bridal" },
  { href: "/events", label: "Events" },
  {
    href: "#",
    label: "Explore",
    children: [
      { href: "/gallery", label: "Gallery" },
      { href: "/reviews", label: "Reviews" },
    ],
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Sync theme status on mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("roope-theme", "light");
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("roope-theme", "dark");
      setTheme("dark");
    }
  };

  // Sync cart count from localStorage and listen to updates
  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = localStorage.getItem("roope-cart");
      if (savedCart) {
        try {
          const cart = JSON.parse(savedCart);
          const count = Object.values(cart).reduce((sum: number, qty: any) => sum + Number(qty), 0);
          setCartCount(count);
        } catch {
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    };

    updateCartCount();

    window.addEventListener("roope-cart-updated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("roope-cart-updated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);
  
  const pathname = usePathname();
  const router = useRouter();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLFormElement>(null);

  // Sync searchVal with global search updates and URL search queries
  useEffect(() => {
    const handleGlobalSearch = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setSearchVal(customEvent.detail);
    };

    window.addEventListener("roope-global-search", handleGlobalSearch);

    // Initial check for URL query search parameter
    const query = new URLSearchParams(window.location.search);
    const urlSearch = query.get("search");
    if (urlSearch) {
      setSearchVal(urlSearch);
    }

    return () => window.removeEventListener("roope-global-search", handleGlobalSearch);
  }, []);

  // Generate suggestions based on input
  useEffect(() => {
    if (!searchVal.trim()) {
      setSuggestions([]);
      return;
    }

    const query = searchVal.toLowerCase();
    
    // Search normal services
    const matchingServices = services
      .filter(s => s.name.toLowerCase().includes(query) || s.category.toLowerCase().includes(query))
      .map(s => ({ id: s.id, name: s.name, type: "service", price: s.price, category: "Salon Service" }));

    // Search bridal packages
    const matchingBridal = bridalPackages
      .filter(b => b.name.toLowerCase().includes(query) || b.idealFor.toLowerCase().includes(query))
      .map(b => ({ id: b.id, name: b.name, type: "bridal", price: b.price, category: "Bridal Package" }));

    // Search event packages
    const matchingEvents = eventPackages
      .filter(e => e.name.toLowerCase().includes(query) || e.idealFor.toLowerCase().includes(query))
      .map(e => ({ id: e.id, name: e.name, type: "event", price: e.price, category: "Event Package" }));

    const combined = [...matchingServices, ...matchingBridal, ...matchingEvents].slice(0, 6);
    setSuggestions(combined);
  }, [searchVal]);

  // Click outside search container to close suggestions
  useEffect(() => {
    const handleClickOutsideSearch = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideSearch);
    return () => document.removeEventListener("mousedown", handleClickOutsideSearch);
  }, []);

  const handleSearchChange = (val: string) => {
    setSearchVal(val);
    setShowSuggestions(true);
    // If we are on `/services`, sync search immediately to filter current catalog in real-time
    if (pathname === "/services") {
      window.dispatchEvent(new CustomEvent("roope-global-search", { detail: val }));
    }
  };

  const handleSuggestionClick = (sug: any) => {
    setSearchVal(sug.name);
    setShowSuggestions(false);
    
    if (sug.type === "bridal") {
      router.push("/bridal");
    } else if (sug.type === "event") {
      router.push("/events");
    } else {
      let cart: { [id: string]: number } = {};
      const savedCart = localStorage.getItem("roope-cart");
      if (savedCart) {
        try {
          cart = JSON.parse(savedCart);
        } catch {}
      }
      cart[sug.id] = (cart[sug.id] || 0) + 1;
      localStorage.setItem("roope-cart", JSON.stringify(cart));
      
      router.push(`/services?search=${encodeURIComponent(sug.name)}`);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchVal.trim()) {
      router.push(`/services?search=${encodeURIComponent(searchVal)}`);
    }
  };

  useEffect(() => {
    // Get active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      subscription.unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
    setProfileDropdownOpen(false);
  }, [pathname]);

  // Lock body scroll on ALL devices. overflow:hidden on body does NOT affect position:fixed elements.
  useEffect(() => {
    if (mobileOpen) {
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
  }, [mobileOpen]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDropdownEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(label);
  };

  const handleDropdownLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setProfileDropdownOpen(false);
  };

  const getInitials = () => {
    if (!user) return "";
    const name = user.user_metadata?.full_name || user.email || "";
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
          scrolled
            ? "glass shadow-luxury py-3 border-stone-warm/15"
            : "bg-pearl/70 backdrop-blur-md py-4 border-stone-warm/10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo & Global Search Pill with generous layout spacing */}
          <div className="flex items-center gap-12 flex-1 max-w-[480px]">
            <Link href="/" className="group flex items-center flex-shrink-0 mr-4">
              <span className="font-display text-2xl font-bold tracking-wide text-roope-primary group-hover:text-champagne-500 transition-colors duration-300">
                Roopé
              </span>
            </Link>

            {/* Sleek Search Form with Auto-suggestions Dropdown */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative flex-1" ref={searchContainerRef}>
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-warm/50" />
              <input
                type="text"
                placeholder="Search premium services..."
                value={searchVal}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-full text-xs font-semibold text-roope-primary placeholder-stone-warm/40 bg-pearl-200/50 border border-stone-warm/15 outline-none focus:border-champagne-DEFAULT focus:ring-1 focus:ring-champagne-300/10 transition-all shadow-inner"
              />
              {searchVal && (
                <button type="button" onClick={() => handleSearchChange("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-warm/50 hover:text-roope-primary cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Suggestions Dropdown Overlay */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white/95 border border-pearl-200 rounded-2xl shadow-xl p-2.5 z-50 text-left max-h-72 overflow-y-auto backdrop-blur-md"
                  >
                    <p className="text-[9px] font-bold text-stone-warm/40 uppercase tracking-widest px-2.5 py-1.5 border-b border-pearl-100 mb-1 select-none">
                      Matching Services
                    </p>
                    {suggestions.map((sug) => (
                      <button
                        key={sug.id}
                        type="button"
                        onClick={() => handleSuggestionClick(sug)}
                        className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-semibold text-stone-warm hover:text-roope-primary hover:bg-pearl transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex flex-col min-w-0 text-left">
                          <span className="truncate">{sug.name}</span>
                          <span className="text-[9px] text-stone-warm/40 font-normal">{sug.category}</span>
                        </div>
                        <span className="text-[#B8922E] font-medium flex-shrink-0 ml-2">
                          {sug.price >= 10000 ? "Free Consultation" : formatPrice(sug.price)}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>


          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter(link.label)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-stone-warm hover:text-roope-primary transition-colors duration-200 group">
                    {link.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeDropdown === link.label ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-44 glass rounded-2xl p-1.5 shadow-luxury-lg"
                        onMouseEnter={() => handleDropdownEnter(link.label)}
                        onMouseLeave={handleDropdownLeave}
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2.5 rounded-xl text-sm font-medium text-stone-warm hover:text-roope-primary hover:bg-pearl transition-all duration-200"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 group ${
                    pathname === link.href
                      ? "text-roope-primary"
                      : "text-stone-warm hover:text-roope-primary"
                  }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0.5 left-4 right-4 h-px bg-champagne-DEFAULT"
                    />
                  )}
                </Link>
              )
            )}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/admin"
              className="text-sm font-medium text-stone-warm hover:text-roope-primary transition-colors duration-200 px-3 py-2"
            >
              Admin
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-stone-warm hover:text-roope-primary transition-colors duration-200 px-3 py-2 mr-1"
            >
              Support
            </Link>
            {/* Theme Toggle Button (Desktop) */}
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn mr-1"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ y: 15, opacity: 0, rotate: 40 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: -15, opacity: 0, rotate: -40 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  {theme === "light" ? (
                    <Moon className="w-4 h-4" />
                  ) : (
                    <Sun className="w-4 h-4" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>

             {/* Auth Section - Premium User Icon Avatar */}
             {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="w-9 h-9 rounded-full bg-champagne-300/30 border border-champagne-DEFAULT flex items-center justify-center text-roope-primary font-bold text-xs uppercase hover:bg-champagne-300/50 transition-colors shadow-sm cursor-pointer"
                >
                  {getInitials()}
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2.5 w-56 bg-white border border-pearl-200 rounded-2xl shadow-xl p-2.5 z-50 text-left"
                    >
                      <div className="px-3.5 py-2.5 border-b border-pearl-200 mb-2">
                        <p className="text-xs font-bold text-roope-primary truncate">
                          {user.user_metadata?.full_name || "Roopé Client"}
                        </p>
                        <p className="text-[10px] text-stone-warm/60 truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        href="/profile/bookings"
                        className="flex items-center gap-2.5 w-full px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-warm hover:text-roope-primary hover:bg-pearl transition-all duration-200"
                      >
                        <Calendar className="w-4 h-4 text-stone-warm/50" />
                        <span>My Bookings</span>
                      </Link>

                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2.5 w-full px-3.5 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-500/5 transition-all duration-200 mt-1 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red-400" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="w-9 h-9 rounded-full bg-pearl-200/60 border border-stone-warm/15 hover:border-champagne-DEFAULT flex items-center justify-center text-stone-warm hover:text-roope-primary hover:bg-white transition-all shadow-sm cursor-pointer"
                title="Sign In / Register"
              >
                <User className="w-4 h-4" />
              </button>
            )}

            {cartCount > 0 && (
              <Link
                href="/book/checkout?checkout=direct"
                className="w-9 h-9 rounded-full bg-champagne-300/20 border border-champagne-DEFAULT/30 flex items-center justify-center text-roope-primary relative hover:bg-champagne-300/40 transition-colors shadow-sm cursor-pointer mr-1"
                title="View Cart & Checkout"
              >
                <ShoppingBag className="w-4 h-4 text-[#B8922E]" />
                <span className="absolute -top-1 -right-1 bg-[#B8922E] text-white w-4 h-4 rounded-full flex items-center justify-center text-[8.5px] font-extrabold border border-white leading-none">
                  {cartCount}
                </span>
              </Link>
            )}

            <Link href="/book" className="btn-primary text-sm px-6 py-2.5 shadow-sm">
              Book Now
            </Link>
          </div>

          {/* Mobile Icons Header Row - Clean and uncluttered */}
          <div className="flex md:hidden items-center gap-2.5">
            {/* Theme Toggle Button (Mobile) */}
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn-mobile flex items-center justify-center"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-4.5 h-4.5" />
              ) : (
                <Sun className="w-4.5 h-4.5" />
              )}
            </button>

            {/* Mobile Search Button */}
            <button
              onClick={() => {
                if (pathname !== "/services") {
                  router.push("/services?search=");
                } else {
                  // Direct focus to services list search input
                  document.querySelector("input[placeholder='Search premium services...']")?.scrollIntoView({ behavior: "smooth", block: "center" });
                  (document.querySelector("input[placeholder='Search premium services...']") as HTMLInputElement)?.focus();
                }
              }}
              className="p-2 rounded-xl hover:bg-pearl text-roope-primary transition-colors"
              aria-label="Search"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* Mobile Cart Button */}
            {cartCount > 0 && (
              <Link
                href="/book/checkout?checkout=direct"
                className="w-8 h-8 rounded-full bg-champagne-300/20 border border-champagne-DEFAULT/30 flex items-center justify-center text-roope-primary relative hover:bg-champagne-300/40 transition-colors shadow-sm"
                aria-label="View Cart & Checkout"
              >
                <ShoppingBag className="w-4 h-4 text-[#B8922E]" />
                <span className="absolute -top-1 -right-1 bg-[#B8922E] text-white w-4.5 h-4.5 rounded-full flex items-center justify-center text-[8.5px] font-extrabold border border-white leading-none">
                  {cartCount}
                </span>
              </Link>
            )}

            {/* Mobile Account Profile Logo */}
            <button
              onClick={() => {
                if (user) {
                  router.push("/profile/bookings");
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              className="w-8 h-8 rounded-full bg-pearl-200/60 border border-stone-warm/15 flex items-center justify-center text-stone-warm hover:text-roope-primary transition-all"
            >
              {user ? getInitials() : <User className="w-3.5 h-3.5" />}
            </button>

            {/* Mobile menu toggle */}
            <button
              id="mobile-menu-toggle"
              className="p-2 rounded-xl hover:bg-pearl transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-4.5 h-4.5 text-roope-primary" />
              ) : (
                <Menu className="w-4.5 h-4.5 text-roope-primary" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 glass-dark md:hidden"
          >
            <div className="flex flex-col h-full pt-20 pb-6 px-6">
              <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {link.children ? (
                      <div className="mb-2">
                        <p className="section-label py-2 border-b border-white/10 uppercase tracking-widest text-[9px] text-white/50">{link.label}</p>
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block py-2 pl-3 text-xs font-semibold text-white/80 hover:text-white transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        className="block py-2.5 text-sm font-semibold text-white border-b border-white/10 hover:text-champagne-DEFAULT transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </motion.div>
                ))}

                {/* Mobile Auth Items */}
                {user ? (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="border-t border-white/10 mt-4 pt-4"
                  >
                    <p className="text-white/60 text-[10px] mb-2 truncate font-medium">Logged in as {user.email}</p>
                    <Link
                      href="/profile/bookings"
                      className="block py-2.5 text-xs font-semibold text-white hover:text-champagne-DEFAULT transition-colors flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4 text-white/50" /> My Bookings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left py-2.5 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors flex items-center gap-2 mt-0.5"
                    >
                      <LogOut className="w-4 h-4 text-red-400/50" /> Sign Out
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="border-t border-white/10 mt-4 pt-4"
                  >
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        setIsAuthModalOpen(true);
                      }}
                      className="btn-secondary w-full py-2.5 text-white hover:text-champagne-DEFAULT border border-white/20 hover:border-champagne-DEFAULT/50 justify-center text-xs font-bold tracking-wider uppercase"
                    >
                      Sign In / Register
                    </button>
                  </motion.div>
                )}
              </nav>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mt-auto pt-4"
              >
                <Link href="/book" className="btn-primary w-full justify-center text-xs py-2.5">
                  Book Now
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Embedded Auth Modal dialog */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
