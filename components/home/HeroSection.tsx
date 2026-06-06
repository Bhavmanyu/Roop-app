"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, Shield, Clock, Sparkles, Search, MapPin, ChevronDown, ShieldCheck, Users, X, ChevronRight, LayoutGrid } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const curatedExperiences = [
  {
    id: "bridal-signature",
    name: "Signature Bridal Glam",
    category: "Bridal",
    image: "https://www.urbancompany.com/img?bucket=urbanclap-prod&quality=90&format=auto/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1776682279120-0ec7a1.jpeg",
    rating: "4.9",
    reviews: "1.2K",
    price: 14999,
    originalPrice: 18999,
    tag: "Popular",
    link: "/bridal"
  },
  {
    id: "korean-glass-skin",
    name: "Korean Glass Skin Facial",
    category: "Korean Facials",
    image: "https://www.urbancompany.com/img?bucket=urbanclap-prod&quality=90&format=auto/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1777289404699-a6b57d.jpeg",
    rating: "4.9",
    reviews: "28K",
    price: 1499,
    originalPrice: 1999,
    tag: "Trending",
    link: "/services?category=facials"
  },
  {
    id: "airbrush-glam",
    name: "HD Airbrush Makeup",
    category: "Event Glam",
    image: "/images/gallery_party_glam.png",
    rating: "4.9",
    reviews: "540",
    price: 4999,
    originalPrice: 6500,
    tag: "Luxury",
    link: "/services?search=Airbrush"
  },
  {
    id: "stress-relief-massage-women",
    name: "Stress Relief Full Body Massage",
    category: "Spa & Massage",
    image: "https://www.urbancompany.com/img?bucket=urbanclap-prod&quality=90&format=auto/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1770656427240-a4da39.jpeg",
    rating: "4.91",
    reviews: "24K",
    price: 1899,
    originalPrice: 2499,
    tag: "Relaxing",
    link: "/services?category=spa-massage"
  }
];

const bestSellerCombos = [
  {
    id: "mani-pedi-duo",
    name: "Classic Pedicure & Manicure Duo",
    category: "Combos",
    image: "https://www.urbancompany.com/img?bucket=urbanclap-prod&quality=90&format=auto/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1770659329192-be6242.jpeg",
    rating: "4.85",
    reviews: "58K",
    price: 1199,
    originalPrice: 1499,
    tag: "Value Pack",
    link: "/services?category=pedi-mani"
  },
  {
    id: "roll-on-waxing",
    name: "Roll-on Waxing (Full Body)",
    category: "Waxing",
    image: "https://www.urbancompany.com/img?bucket=urbanclap-prod&quality=90&format=auto/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1770654756881-fc5c4a.jpeg",
    rating: "4.89",
    reviews: "42K",
    price: 1299,
    originalPrice: 1599,
    tag: "Best Seller",
    link: "/services?category=waxing"
  },
  {
    id: "premium-haircut-beard",
    name: "Premium Haircut & Beard Styling",
    category: "Men's Grooming",
    image: "https://www.urbancompany.com/img?bucket=urbanclap-prod&quality=90&format=auto/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1776843862206-4d4247.jpeg",
    rating: "4.84",
    reviews: "112K",
    price: 499,
    originalPrice: 599,
    tag: "Trending",
    link: "/services?gender=men"
  },
  {
    id: "royal-shave",
    name: "Royal Hot Towel Shave & Styling",
    category: "Men's Grooming",
    image: "https://www.urbancompany.com/img?bucket=urbanclap-prod&quality=90&format=auto/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1770661390930-8f5b6c.jpeg",
    rating: "4.86",
    reviews: "48K",
    price: 399,
    originalPrice: 449,
    tag: "Trending",
    link: "/services?gender=men"
  }
];

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
  const [isAllServicesModalOpen, setIsAllServicesModalOpen] = useState(false);
  const [activeLocation, setActiveLocation] = useState("63, Maharani Road, Siyaganj, Indore");
  const [locationSearch, setLocationSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<{ [id: string]: number }>({});

  // Sync cart count from localStorage and listen to updates
  useEffect(() => {
    const syncCart = () => {
      const savedCart = localStorage.getItem("roope-cart");
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch {
          setCart({});
        }
      } else {
        setCart({});
      }
    };

    syncCart();

    window.addEventListener("roope-cart-updated", syncCart);
    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener("roope-cart-updated", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  const handleAddToCart = (id: string) => {
    const newCart = { ...cart, [id]: (cart[id] || 0) + 1 };
    setCart(newCart);
    localStorage.setItem("roope-cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("roope-cart-updated"));
  };

  const handleRemoveFromCart = (id: string) => {
    if (!cart[id]) return;
    const newCart = { ...cart };
    if (newCart[id] === 1) {
      delete newCart[id];
    } else {
      newCart[id] -= 1;
    }
    setCart(newCart);
    localStorage.setItem("roope-cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("roope-cart-updated"));
  };

  const mobileSlides = [
    {
      id: 1,
      image: "https://www.urbancompany.com/img?bucket=urbanclap-prod&quality=90&format=auto/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1776682279120-0ec7a1.jpeg",
      title: "Bridal Glamour Lead",
      sub: "Certified lead artists at your doorstep",
      link: "/bridal"
    },
    {
      id: 2,
      image: "https://www.urbancompany.com/img?bucket=urbanclap-prod&quality=90&format=auto/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1776843864535-72277e.jpeg",
      title: "Salon & Spa for Women",
      sub: "Flat 20% OFF on your first booking",
      link: "/services?gender=women"
    },
    {
      id: 3,
      image: "https://www.urbancompany.com/img?bucket=urbanclap-prod&quality=90&format=auto/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1776843862206-4d4247.jpeg",
      title: "Men's Grooming",
      sub: "Precision haircuts & styling outlines",
      link: "/services?gender=men"
    }
  ];

  const heroGridServices = [
    {
      label: "Women's Salon",
      image: "https://www.urbancompany.com/img?bucket=urbanclap-prod&quality=90&format=auto/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1776843864535-72277e.jpeg",
      href: "/services?gender=women",
      badge: "20% OFF"
    },
    {
      label: "Men's Grooming",
      image: "https://www.urbancompany.com/img?bucket=urbanclap-prod&quality=90&format=auto/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1776843862206-4d4247.jpeg",
      href: "/services?gender=men",
      badge: "Men"
    },
    {
      label: "Spa & Massage",
      image: "https://www.urbancompany.com/img?bucket=urbanclap-prod&quality=90&format=auto/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1776682277109-e8bece.jpeg",
      href: "/services?category=spa-massage"
    },
    {
      label: "Bridal Glam",
      image: "https://www.urbancompany.com/img?bucket=urbanclap-prod&quality=90&format=auto/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1776682279120-0ec7a1.jpeg",
      href: "/bridal",
      badge: "Elite"
    },
    {
      label: "Event Glam",
      image: "/images/gallery_party_glam.png",
      href: "/events",
      badge: "Luxury"
    },
    {
      label: "All Services",
      isAllServicesTrigger: true,
    }
  ];

  const modalCategories = [
    {
      title: "Women's Salon & Spa",
      items: [
        {
          label: "Salon for Women",
          image: "https://www.urbancompany.com/img?bucket=urbanclap-prod&quality=90&format=auto/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1776843864535-72277e.jpeg",
          href: "/services?gender=women",
          badge: "20% OFF"
        },
        {
          label: "Korean Facials",
          image: "https://www.urbancompany.com/img?bucket=urbanclap-prod&quality=90&format=auto/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1777289404699-a6b57d.jpeg",
          href: "/services?category=facials",
          badge: "Glow"
        },
        {
          label: "Spa & Massage",
          image: "https://www.urbancompany.com/img?bucket=urbanclap-prod&quality=90&format=auto/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1776682277109-e8bece.jpeg",
          href: "/services?category=spa-massage"
        },
        {
          label: "Waxing & Thread",
          image: "https://www.urbancompany.com/img?bucket=urbanclap-prod&quality=90&format=auto/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1770203489779-b131f8.jpeg",
          href: "/services?category=waxing",
          badge: "Deal"
        },
        {
          label: "Manicure",
          image: "https://www.urbancompany.com/img?bucket=urbanclap-prod&quality=90&format=auto/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1770659329192-be6242.jpeg",
          href: "/services?search=Manicure",
          badge: "New"
        },
        {
          label: "Pedicure",
          image: "https://www.urbancompany.com/img?bucket=urbanclap-prod&quality=90&format=auto/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1770659323099-b295c8.jpeg",
          href: "/services?search=Pedicure"
        },
        {
          label: "Hair & Styling",
          image: "https://www.urbancompany.com/img?bucket=urbanclap-prod&quality=90&format=auto/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1776682281496-8bf504.jpeg",
          href: "/services?search=hair"
        }
      ]
    },
    {
      title: "Men's Grooming",
      items: [
        {
          label: "Men's Grooming",
          image: "https://www.urbancompany.com/img?bucket=urbanclap-prod&quality=90&format=auto/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1776843862206-4d4247.jpeg",
          href: "/services?gender=men",
          badge: "Men"
        }
      ]
    },
    {
      title: "Bridal & Event Packages",
      items: [
        {
          label: "Bridal Glam",
          image: "https://www.urbancompany.com/img?bucket=urbanclap-prod&quality=90&format=auto/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1776682279120-0ec7a1.jpeg",
          href: "/bridal",
          badge: "Elite"
        },
        {
          label: "Event Glam",
          image: "/images/gallery_party_glam.png",
          href: "/events",
          badge: "Luxury"
        },
        {
          label: "Free Consult",
          image: "/images/hero_bridal.png",
          href: "/bridal#packages",
          badge: "Free"
        }
      ]
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

  // Lock body scroll on ALL devices. overflow:hidden on body does NOT affect position:fixed elements.
  useEffect(() => {
    if (isLocationModalOpen || isAllServicesModalOpen) {
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
  }, [isLocationModalOpen, isAllServicesModalOpen]);

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

        <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-16 grid grid-cols-[1.2fr_0.8fr] gap-12 items-center w-full">
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
              className="font-display text-5xl md:text-7xl lg:text-8xl font-light leading-tight mb-6"
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
              className="text-lg md:text-xl text-stone-warm font-light leading-relaxed mb-10 max-w-xl"
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

      {/* ─── DESKTOP CURATED & BEST SELLER SECTIONS ─── */}
      <section className="hidden lg:block py-20 bg-white border-b border-pearl-200">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          
          {/* Curated Experiences */}
          <div className="space-y-6">
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-roope-primary uppercase tracking-widest text-gradient-gold">Thoughtful Curations</h3>
              <p className="text-xs text-stone-warm/70 mt-1">Our finest luxury doorstep beauty experiences, curated under strict premium standards.</p>
            </div>
            
            <div className="grid grid-cols-4 gap-6">
              {curatedExperiences.map((item) => {
                const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
                const qty = cart[item.id] || 0;
                return (
                  <div 
                    key={item.id}
                    className="bg-[#FAF9F6] border border-pearl-200 rounded-[24px] p-4 flex flex-col justify-between hover:shadow-luxury transition-all duration-300 group"
                  >
                    <div>
                      <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-3">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="300px"
                          unoptimized
                        />
                        {item.tag && (
                          <span className="absolute top-2.5 left-2.5 bg-champagne text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                            {item.tag}
                          </span>
                        )}
                        {discount > 0 && (
                          <span className="absolute top-2.5 right-2.5 bg-roope-primary text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md">
                            -{discount}%
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-champagne font-extrabold">★ {item.rating}</span>
                          <span className="text-[10px] text-stone-warm/50 font-bold">({item.reviews} reviews)</span>
                        </div>
                        
                        <h4 className="text-sm font-bold text-roope-primary leading-snug min-h-[40px] line-clamp-2">
                          {item.name}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-pearl-200/60 mt-4">
                      <div>
                        <span className="text-base font-bold text-roope-primary">
                          {formatPrice(item.price)}
                        </span>
                        {item.originalPrice && (
                          <span className="text-xs text-stone-warm/50 line-through ml-1.5">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                      </div>
                      
                      {item.id === "bridal-signature" || item.id === "airbrush-glam" ? (
                        <Link 
                          href={item.link}
                          className="border border-[#B8922E] text-roope-primary text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider hover:bg-champagne-300/10 transition-all cursor-pointer bg-white"
                        >
                          Add
                        </Link>
                      ) : (
                        <div>
                          {qty === 0 ? (
                            <button
                              onClick={() => handleAddToCart(item.id)}
                              className="border border-[#B8922E] text-roope-primary text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider hover:bg-champagne-300/10 transition-all cursor-pointer bg-white"
                            >
                              Add
                            </button>
                          ) : (
                            <div className="flex items-center gap-2 bg-[#8B7D6B] text-white text-xs font-bold px-3 py-1 rounded-full border border-[#8B7D6B] h-8 shadow-sm">
                              <button 
                                onClick={() => handleRemoveFromCart(item.id)}
                                className="w-5 h-5 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-sm font-semibold transition-colors"
                              >
                                -
                              </button>
                              <span className="w-3 text-center">{qty}</span>
                              <button 
                                onClick={() => handleAddToCart(item.id)}
                                className="w-5 h-5 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-sm font-semibold transition-colors"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Best Sellers & Combos */}
          <div className="space-y-6 pt-4">
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-roope-primary uppercase tracking-widest text-gradient-gold">Best Sellers & Combos</h3>
              <p className="text-xs text-stone-warm/77 mt-1">Our most popular combination packages for ultimate pampering and savings.</p>
            </div>
            
            <div className="grid grid-cols-4 gap-6">
              {bestSellerCombos.map((item) => {
                const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
                const qty = cart[item.id] || 0;
                return (
                  <div 
                    key={item.id}
                    className="bg-[#FAF9F6] border border-pearl-200 rounded-[24px] p-4 flex flex-col justify-between hover:shadow-luxury transition-all duration-300 group"
                  >
                    <div>
                      <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-3">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="300px"
                          unoptimized
                        />
                        {item.tag && (
                          <span className="absolute top-2.5 left-2.5 bg-champagne text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                            {item.tag}
                          </span>
                        )}
                        {discount > 0 && (
                          <span className="absolute top-2.5 right-2.5 bg-roope-primary text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md">
                            -{discount}%
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-champagne font-extrabold">★ {item.rating}</span>
                          <span className="text-[10px] text-stone-warm/50 font-bold">({item.reviews} reviews)</span>
                        </div>
                        
                        <h4 className="text-sm font-bold text-roope-primary leading-snug min-h-[40px] line-clamp-2">
                          {item.name}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-pearl-200/60 mt-4">
                      <div>
                        <span className="text-base font-bold text-roope-primary">
                          {formatPrice(item.price)}
                        </span>
                        {item.originalPrice && (
                          <span className="text-xs text-stone-warm/50 line-through ml-1.5">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                      </div>
                      
                      <div>
                        {qty === 0 ? (
                          <button
                            onClick={() => handleAddToCart(item.id)}
                            className="border border-[#B8922E] text-roope-primary text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider hover:bg-champagne-300/10 transition-all cursor-pointer bg-white"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 bg-[#8B7D6B] text-white text-xs font-bold px-3 py-1 rounded-full border border-[#8B7D6B] h-8 shadow-sm">
                            <button 
                              onClick={() => handleRemoveFromCart(item.id)}
                              className="w-5 h-5 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-sm font-semibold transition-colors"
                            >
                              -
                            </button>
                            <span className="w-3 text-center">{qty}</span>
                            <button 
                              onClick={() => handleAddToCart(item.id)}
                              className="w-5 h-5 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-sm font-semibold transition-colors"
                            >
                              +
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
          
        </div>
      </section>

      {/* ─── MOBILE HERO LAYOUT (Urban Company Style) ─── */}
      <section
        id="hero-mobile"
        className="relative lg:hidden pt-24 pb-6 px-4 bg-white flex flex-col gap-5 border-b border-pearl-200/50"
      >
        {/* Mobile Greeting and Location Selector */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-extrabold text-stone-warm/50">Your Doorstep Salon</p>
              <h2 className="text-base font-extrabold text-roope-primary tracking-tight">Indore, India</h2>
            </div>
            
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-1.5 text-[9px] font-extrabold text-roope-primary bg-[#FAF9F6] border border-pearl-300 rounded-full px-3 py-1.5 max-w-[180px] truncate transition-all shadow-sm hover:border-[#B8922E]"
            >
              <MapPin className="w-3 h-3 text-[#B8922E] flex-shrink-0" />
              <span className="truncate">{activeLocation.split(",")[0]}</span>
              <ChevronDown className="w-2.5 h-2.5 text-stone-warm/50 flex-shrink-0" />
            </button>
          </div>
          
          <form onSubmit={handleSearchSubmit} className="relative w-full mt-1.5">
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
          <div className="grid grid-cols-3 gap-y-6 gap-x-3">
            {heroGridServices.map((service, idx) => {
              if (service.isAllServicesTrigger) {
                return (
                  <button
                    key={idx}
                    onClick={() => setIsAllServicesModalOpen(true)}
                    className="flex flex-col items-center text-center group relative cursor-pointer"
                  >
                    <div className="relative w-14 h-14 flex-shrink-0">
                      <div className="absolute inset-0 bg-[#F3E8C8]/40 border border-pearl-200 shadow-sm rounded-full flex items-center justify-center">
                        <LayoutGrid className="w-6 h-6 text-[#B8922E]" />
                      </div>
                    </div>
                    <span className="text-[9.5px] font-extrabold text-stone-warm mt-2 leading-tight min-h-[24px] flex items-center justify-center">
                      All Services
                    </span>
                  </button>
                );
              }
              return (
                <Link
                  key={idx}
                  href={service.href || "#"}
                  className="flex flex-col items-center text-center group relative animate-fade-in"
                >
                  <div className="relative w-14 h-14 flex-shrink-0">
                    <div className="absolute inset-0 bg-white border border-pearl-200 shadow-sm rounded-full overflow-hidden flex items-center justify-center">
                      <Image
                        src={service.image || ""}
                        alt={service.label || ""}
                        fill
                        className="object-cover"
                        sizes="56px"
                        unoptimized
                      />
                    </div>
                    {service.badge && (
                      <span className="absolute -top-1 -right-1.5 bg-[#B8922E] text-white text-[7.5px] font-extrabold px-1.5 py-0.5 rounded-full shadow-sm z-10 leading-none uppercase tracking-wide whitespace-nowrap">
                        {service.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[9.5px] font-extrabold text-stone-warm mt-2 leading-tight min-h-[24px] flex items-center justify-center">
                    {service.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Thoughtful Curations (Urban Company Style) */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col">
            <h3 className="text-xs font-extrabold text-roope-primary uppercase tracking-wider">Thoughtful Curations</h3>
            <p className="text-[9px] text-stone-warm/60">Of our finest luxury beauty experiences</p>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-none snap-x snap-mandatory">
            {curatedExperiences.map((item) => {
              const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
              return (
                <div 
                  key={item.id}
                  className="w-[200px] bg-white border border-pearl-200 rounded-2xl p-2.5 flex-shrink-0 snap-start shadow-sm"
                >
                  <div className="relative w-full h-28 rounded-xl overflow-hidden mb-2">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="200px"
                      unoptimized
                    />
                    {item.tag && (
                      <span className="absolute top-2 left-2 bg-champagne-300 text-roope-primary text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                        {item.tag}
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="absolute top-2 right-2 bg-black/75 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded">
                        -{discount}%
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <span className="text-[8px] text-[#B8922E] font-extrabold">★ {item.rating}</span>
                      <span className="text-[8px] text-stone-warm/50 font-bold">({item.reviews})</span>
                    </div>
                    
                    <h4 className="text-[10px] font-extrabold text-roope-primary line-clamp-1 leading-snug">
                      {item.name}
                    </h4>
                    
                    <div className="flex items-center justify-between pt-1 border-t border-pearl-100">
                      <div>
                        <span className="text-[10.5px] font-bold text-roope-primary">
                          {formatPrice(item.price)}
                        </span>
                        {item.originalPrice && (
                          <span className="text-[8.5px] text-stone-warm/50 line-through ml-1">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                      </div>
                      
                      {item.id === "bridal-signature" || item.id === "airbrush-glam" ? (
                        <Link 
                          href={item.link}
                          className="border border-[#B8922E] text-roope-primary text-[8px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider hover:bg-champagne-300/10 transition-all"
                        >
                          Add
                        </Link>
                      ) : (
                        <div>
                          {(cart[item.id] || 0) === 0 ? (
                            <button
                              onClick={() => handleAddToCart(item.id)}
                              className="border border-[#B8922E] text-roope-primary text-[8px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider hover:bg-champagne-300/10 transition-all bg-white"
                            >
                              Add
                            </button>
                          ) : (
                            <div className="flex items-center gap-1.5 bg-[#8B7D6B] text-white text-[8px] font-bold px-2 py-1 rounded-lg border border-[#8B7D6B] h-6">
                              <button 
                                onClick={() => handleRemoveFromCart(item.id)}
                                className="w-3.5 h-3.5 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold animate-scale-up"
                              >
                                -
                              </button>
                              <span className="w-2.5 text-center">{cart[item.id]}</span>
                              <button 
                                onClick={() => handleAddToCart(item.id)}
                                className="w-3.5 h-3.5 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold animate-scale-up"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Best Sellers & Combos (Urban Company Style) */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col">
            <h3 className="text-xs font-extrabold text-roope-primary uppercase tracking-wider">Best Sellers & Combos</h3>
            <p className="text-[9px] text-stone-warm/60">Popular doorstep grooming packages</p>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-none snap-x snap-mandatory">
            {bestSellerCombos.map((item) => {
              const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
              return (
                <div 
                  key={item.id}
                  className="w-[200px] bg-white border border-pearl-200 rounded-2xl p-2.5 flex-shrink-0 snap-start shadow-sm"
                >
                  <div className="relative w-full h-28 rounded-xl overflow-hidden mb-2">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="200px"
                      unoptimized
                    />
                    {item.tag && (
                      <span className="absolute top-2 left-2 bg-champagne-300 text-roope-primary text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                        {item.tag}
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="absolute top-2 right-2 bg-black/75 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded">
                        -{discount}%
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <span className="text-[8px] text-[#B8922E] font-extrabold">★ {item.rating}</span>
                      <span className="text-[8px] text-stone-warm/50 font-bold">({item.reviews})</span>
                    </div>
                    
                    <h4 className="text-[10px] font-extrabold text-roope-primary line-clamp-1 leading-snug">
                      {item.name}
                    </h4>
                    
                    <div className="flex items-center justify-between pt-1 border-t border-pearl-100">
                      <div>
                        <span className="text-[10.5px] font-bold text-roope-primary">
                          {formatPrice(item.price)}
                        </span>
                        {item.originalPrice && (
                          <span className="text-[8.5px] text-stone-warm/50 line-through ml-1">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                      </div>
                      
                      <div>
                        {(cart[item.id] || 0) === 0 ? (
                          <button
                            onClick={() => handleAddToCart(item.id)}
                            className="border border-[#B8922E] text-roope-primary text-[8px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider hover:bg-champagne-300/10 transition-all bg-white"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5 bg-[#8B7D6B] text-white text-[8px] font-bold px-2 py-1 rounded-lg border border-[#8B7D6B] h-6">
                            <button 
                              onClick={() => handleRemoveFromCart(item.id)}
                              className="w-3.5 h-3.5 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold animate-scale-up"
                            >
                              -
                            </button>
                            <span className="w-2.5 text-center">{cart[item.id]}</span>
                            <button 
                              onClick={() => handleAddToCart(item.id)}
                              className="w-3.5 h-3.5 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold animate-scale-up"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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

      {/* MOBILE ALL SERVICES DRAWER/MODAL (Urban Company Style) */}
      <AnimatePresence>
        {isAllServicesModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAllServicesModalOpen(false)}
              className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm animate-fade-in"
            />
            {/* Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 250 }}
              className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#FAF9F6] rounded-t-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
            >
              {/* Drag Indicator and Header */}
              <div className="flex flex-col items-center pt-3 pb-4 px-6 border-b border-pearl-200/60 flex-shrink-0">
                <div className="w-12 h-1.5 bg-stone-warm/20 rounded-full mb-3" />
                <div className="flex items-center justify-between w-full">
                  <h3 className="text-sm font-extrabold text-roope-primary uppercase tracking-wider">Explore All Services</h3>
                  <button
                    onClick={() => setIsAllServicesModalOpen(false)}
                    className="w-8 h-8 rounded-full border border-pearl-200 flex items-center justify-center text-stone-warm hover:text-roope-primary bg-white shadow-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable Categories List */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 overscroll-contain">
                {modalCategories.map((category, catIdx) => (
                  <div key={catIdx} className="space-y-3">
                    <h4 className="text-xs font-extrabold text-roope-primary uppercase tracking-wider border-l-2 border-[#C9A84C] pl-2">
                      {category.title}
                    </h4>
                    
                    {/* Horizontal Scroll Row of Services */}
                    <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none snap-x snap-mandatory">
                      {category.items.map((item, itemIdx) => (
                        <Link
                          key={itemIdx}
                          href={item.href}
                          onClick={() => setIsAllServicesModalOpen(false)}
                          className="flex flex-col items-center justify-between p-3.5 bg-white border border-pearl-200/80 rounded-2xl w-[96px] h-[96px] flex-shrink-0 snap-start shadow-sm active:scale-95 transition-transform relative"
                        >
                          <div className="relative w-10 h-10 flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.label}
                              fill
                              className="object-cover rounded-full border border-pearl-100"
                              sizes="40px"
                              unoptimized
                            />
                            {item.badge && (
                              <span className="absolute -top-1 -right-1 bg-[#B8922E] text-white text-[6px] font-extrabold px-1 py-0.5 rounded-full shadow-sm z-10 leading-none uppercase tracking-wide">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[8.5px] font-extrabold text-stone-warm mt-1.5 leading-tight text-center line-clamp-2 w-full">
                            {item.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
