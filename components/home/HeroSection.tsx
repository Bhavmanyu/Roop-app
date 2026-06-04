"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, Shield, Clock, Sparkles, Search, MapPin, ChevronDown, ShieldCheck, Users, X, ChevronRight } from "lucide-react";

const floatingCards = [
  {
    id: 1,
    title: "Bridal HD Makeup",
    price: "₹8,999",
    rating: "4.9",
    tag: "Most Booked",
    position: { top: "18%", right: "6%" },
    delay: 0,
  },
  {
    id: 2,
    title: "Artist Arriving",
    subtitle: "Professional • 4 min away",
    live: true,
    position: { bottom: "32%", left: "4%" },
    delay: 0.3,
  },
  {
    id: 3,
    title: "100+ Customers Served",
    subtitle: "In Indore",
    position: { bottom: "18%", right: "8%" },
    delay: 0.6,
  },
];

const INDORE_AREAS = [
  "63, Maharani Road, Siyaganj, Indore",
  "Vijay Nagar, Indore",
  "Nipania, Indore",
  "Bypass Road, Indore",
  "Old Palasia, Indore",
  "Saket Colony, Indore",
  "Anand Bazar, Indore",
  "New Palasia, Indore",
  "Race Course Road, Indore"
];

export default function HeroSection() {
  const router = useRouter();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 30, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 30, damping: 20 });

  const rotateX = useTransform(springY, [-300, 300], [3, -3]);
  const rotateY = useTransform(springX, [-300, 300], [-3, 3]);

  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Mobile-specific States
  const [activeSlide, setActiveSlide] = useState(0);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [activeLocation, setActiveLocation] = useState("63, Maharani Road, Siyaganj, Indore");
  const [locationSearch, setLocationSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const mobileSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600",
      title: "Bridal Glamour Lead",
      sub: "Certified lead artists at your doorstep",
      link: "/bridal"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600",
      title: "Salon & Spa for Women",
      sub: "Flat 20% OFF on your first booking",
      link: "/services?gender=women"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600",
      title: "Men's Grooming & Spa",
      sub: "Relaxing massages & precision cuts",
      link: "/services?gender=men"
    }
  ];

  const mobileServices = [
    {
      label: "Women's Salon",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=150",
      href: "/services?gender=women",
      badge: "20% OFF"
    },
    {
      label: "Massage for Men",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=150",
      href: "/services?gender=men",
      badge: "Relax"
    },
    {
      label: "Korean Facials",
      image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=150",
      href: "/services?category=facials",
      badge: "Glow"
    },
    {
      label: "Pedi & Mani",
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=150",
      href: "/services?category=pedi-mani"
    },
    {
      label: "Spa & Massage",
      image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=150",
      href: "/services?category=spa-massage"
    },
    {
      label: "Bridal Glam",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=150",
      href: "/bridal",
      badge: "Elite"
    }
  ];

  useEffect(() => {
    setMounted(true);
    const savedLoc = localStorage.getItem("roope-location");
    if (savedLoc) {
      setActiveLocation(savedLoc);
    }
  }, []);

  // Slide Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % mobileSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [mobileSlides.length]);

  // Lock body scroll on location modal (iOS Safari compatible)
  useEffect(() => {
    if (isLocationModalOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY, 10) * -1);
      }
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isLocationModalOpen]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSelectLocation = (loc: string) => {
    setActiveLocation(loc);
    localStorage.setItem("roope-location", loc);
    setIsLocationModalOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const filteredAreas = INDORE_AREAS.filter((area) =>
    area.toLowerCase().includes(locationSearch.toLowerCase())
  );

  return (
    <>
      {/* ─── DESKTOP/LAPTOP HERO LAYOUT ─── */}
      <section
        ref={heroRef}
        id="hero"
        className="relative min-h-screen hidden lg:flex items-center overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ background: "linear-gradient(160deg, #FFFFFF 0%, #F8F6F2 35%, #FAF6EC 65%, #F3E8C8 100%)" }}
      >
        {/* Background Image Layer */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/images/hero_bg_abstract.png"
            alt=""
            fill
            priority
            className="object-cover opacity-30"
            sizes="100vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to right, rgba(248,246,242,0.95) 40%, rgba(248,246,242,0.4) 100%)" }} />
        </div>

        {/* Ambient orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)" }} />
        <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)" }} />

        <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-16 grid grid-cols-2 gap-12 items-center w-full">
          {/* Left: Text content */}
          <div className="relative z-10">
            {/* Pre-label */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2 mb-6"
            >
              <span className="section-label">India&apos;s Premier Beauty Platform</span>
              <div className="w-6 h-px bg-champagne-DEFAULT" />
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" style={{ color: "#C9A84C" }} />
                ))}
                <span className="text-xs text-stone-warm ml-1">4.9 / 5.0</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-light leading-tight mb-6"
              style={{ letterSpacing: "-0.025em", color: "#1A1612" }}
            >
              Luxury Beauty
              <span className="block text-gradient-gold italic font-light">
                Reimagined.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg text-stone-warm font-light leading-relaxed mb-10 max-w-lg"
            >
              Professional bridal glam, event styling, and beauty crews — at transparent,
              accessible pricing. Certified artists at your doorstep.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Link href="/book" id="hero-book-now" className="btn-primary px-10 py-4 text-base gap-2.5">
                Book Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/bridal" id="hero-explore" className="btn-secondary px-10 py-4 text-base">
                Explore Packages
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center gap-6"
            >
              {[
                { icon: Shield, text: "Verified Artists" },
                { icon: Clock, text: "On-time Guarantee" },
                { icon: Sparkles, text: "Premium Products" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(201,168,76,0.12)" }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: "#C9A84C" }} />
                  </div>
                  <span className="text-sm text-stone-warm font-medium">{text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: 3D image composition */}
          <motion.div
            className="relative flex items-center justify-center"
            style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1200 }}
          >
            {/* Main hero image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-[420px] h-[560px] rounded-4xl overflow-hidden shadow-luxury-xl"
            >
              <Image
                src="/images/hero_bridal.png"
                alt="Luxury bridal transformation by Roopé"
                fill
                priority
                className="object-cover"
                sizes="420px"
              />
              {/* Bottom gradient */}
              <div className="absolute inset-x-0 bottom-0 h-32"
                style={{ background: "linear-gradient(to top, rgba(26,22,18,0.4), transparent)" }} />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-white text-sm font-light opacity-80">Bridal Transformation</p>
              </div>
            </motion.div>

            {/* Floating glass cards */}
            {mounted && floatingCards.map((card) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 + card.delay, ease: [0.16, 1, 0.3, 1] }}
                className="absolute glass rounded-2xl p-4 shadow-float"
                style={{
                  ...card.position,
                  animation: `float ${5 + card.delay}s ease-in-out ${card.delay}s infinite`,
                }}
              >
                {card.live && (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="badge-live" />
                    <span className="text-xs font-medium text-green-600">Live</span>
                  </div>
                )}
                {card.tag && (
                  <span className="tag-gold text-xs mb-2 block w-fit">{card.tag}</span>
                )}
                <p className="text-sm font-semibold text-roope-primary leading-tight">{card.title}</p>
                {card.price && (
                  <p className="text-lg font-display font-light text-gradient-gold mt-1">{card.price}</p>
                )}
                {card.rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 fill-current" style={{ color: "#C9A84C" }} />
                    <span className="text-xs text-stone-warm">{card.rating} rating</span>
                  </div>
                )}
                {card.subtitle && (
                  <p className="text-xs text-stone-warm mt-1">{card.subtitle}</p>
                )}
              </motion.div>
            ))}

            {/* Secondary image stack */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -left-16 top-12 w-28 h-36 rounded-2xl overflow-hidden shadow-luxury-lg ring-2 ring-white"
            >
              <Image
                src="/images/bridal_glam_1.png"
                alt="Bridal makeup close-up"
                fill
                className="object-cover"
                sizes="112px"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-stone-warm tracking-[0.1em] uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-8"
            style={{ background: "linear-gradient(to bottom, #C9A84C, transparent)" }}
          />
        </motion.div>
      </section>

      {/* ─── MOBILE HERO LAYOUT (Urban Company Style) ─── */}
      <section
        id="hero-mobile"
        className="relative lg:hidden pt-24 pb-6 px-4 bg-white flex flex-col gap-5 border-b border-pearl-200/50"
      >
        {/* Mobile Header location + search */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-1.5 text-[11px] font-extrabold text-roope-primary bg-[#FAF9F6] border border-pearl-300 rounded-full px-4 py-2 max-w-[240px] truncate transition-all shadow-sm"
            >
              <MapPin className="w-3.5 h-3.5 text-[#B8922E] flex-shrink-0" />
              <span className="truncate">{activeLocation.split(",")[0]}</span>
              <ChevronDown className="w-3 h-3 text-stone-warm/50 flex-shrink-0" />
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-warm/40" />
            <input
              type="text"
              placeholder="Search for beauty services at home..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF9F6] border border-pearl-300 pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold text-roope-primary outline-none focus:border-champagne-DEFAULT transition-all shadow-inner"
            />
          </form>
        </div>

        {/* Banner Carousel */}
        <div className="relative w-full h-36 rounded-2xl overflow-hidden shadow-md">
          {mobileSlides.map((slide, idx) => {
            const isActive = idx === activeSlide;
            return (
              <Link
                key={slide.id}
                href={slide.link}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-transparent" />
                <div className="absolute inset-y-0 left-0 p-5 flex flex-col justify-center text-white space-y-1 max-w-[70%]">
                  <span className="text-[8px] tracking-widest font-bold text-champagne uppercase">Roopé Premium</span>
                  <h4 className="text-sm font-bold leading-tight">{slide.title}</h4>
                  <p className="text-[10px] text-pearl/80 leading-normal font-light">{slide.sub}</p>
                </div>
              </Link>
            );
          })}
          
          <div className="absolute bottom-2.5 right-4 flex gap-1.5 z-10">
            {mobileSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeSlide ? "bg-white w-3" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Compact Grid of Services */}
        <div className="bg-[#FAF9F6] border border-pearl-200/80 rounded-2xl p-4 shadow-sm">
          <div className="grid grid-cols-3 gap-y-4 gap-x-2">
            {mobileServices.map((service, idx) => (
              <Link
                key={idx}
                href={service.href}
                className="flex flex-col items-center text-center group relative"
              >
                <div className="relative w-14 h-14 bg-white border border-pearl-200 shadow-sm rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <Image
                    src={service.image}
                    alt={service.label}
                    fill
                    className="object-cover"
                    sizes="56px"
                    unoptimized
                  />
                  {service.badge && (
                    <span className="absolute top-0 right-0 bg-[#B8922E] text-white text-[7px] font-extrabold px-1 rounded-bl leading-tight uppercase tracking-wide">
                      {service.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold text-stone-warm mt-2 leading-tight min-h-[24px] flex items-center justify-center">
                  {service.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-2 border-t border-pearl-200/50 pt-4 text-center mt-1">
          <div className="flex flex-col items-center">
            <span className="text-xs text-[#B8922E] font-bold">★ 4.9 Rating</span>
            <span className="text-[8px] uppercase tracking-wider text-stone-warm/50 font-bold mt-0.5">Average Rating</span>
          </div>
          <div className="flex flex-col items-center border-x border-pearl-200">
            <span className="text-xs text-[#B8922E] font-bold">🛡️ Sanitized</span>
            <span className="text-[8px] uppercase tracking-wider text-stone-warm/50 font-bold mt-0.5">100% Safe Kits</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-[#B8922E] font-bold">⏱️ Guaranteed</span>
            <span className="text-[8px] uppercase tracking-wider text-stone-warm/50 font-bold mt-0.5">On-Time Arrival</span>
          </div>
        </div>
      </section>

      {/* MOBILE LOCATION SELECT MODAL */}
      <AnimatePresence>
        {isLocationModalOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed inset-0 z-[9999] bg-[#FAF9F6] flex flex-col pt-12 pb-6 px-5"
          >
            <div className="flex items-center justify-between border-b border-pearl-200/60 pb-4 mb-4">
              <h3 className="text-sm font-bold text-roope-primary uppercase tracking-wider">Select Doorstep Location</h3>
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="w-8 h-8 rounded-full border border-pearl-200 flex items-center justify-center text-stone-warm hover:text-roope-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative mb-5">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-warm/40" />
              <input
                type="text"
                placeholder="Search colony or building in Indore..."
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                className="w-full bg-[#FAF9F6] border border-pearl-300 pl-10 pr-4 py-3 rounded-xl text-xs font-semibold text-roope-primary outline-none focus:border-champagne-DEFAULT transition-all"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-1">
              <p className="text-[9px] font-bold text-stone-warm/40 uppercase tracking-widest pl-2 mb-2 select-none">
                Available Areas (Indore)
              </p>
              {filteredAreas.map((area) => (
                <button
                  key={area}
                  onClick={() => handleSelectLocation(area)}
                  className="flex items-center gap-3 w-full text-left p-3 rounded-xl border border-transparent hover:border-pearl-200 hover:bg-pearl-100/40 transition-all group"
                >
                  <MapPin className="w-4 h-4 text-champagne-DEFAULT flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="flex-1 min-w-0">
                    <span className="block text-xs font-bold text-roope-primary">{area.split(",")[0]}</span>
                    <span className="block text-[9px] text-stone-warm/50 truncate mt-0.5">{area}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-warm/30 group-hover:text-roope-primary transition-colors" />
                </button>
              ))}
              {filteredAreas.length === 0 && (
                <p className="text-xs text-stone-warm/50 italic text-center py-6">No matching locations found in Indore.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
