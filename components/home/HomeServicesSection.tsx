"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Users, LayoutGrid, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const mobileSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800",
    title: "Bridal Glamour Lead",
    sub: "Certified lead artists at your doorstep",
    link: "/bridal"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
    title: "Salon & Spa for Women",
    sub: "Flat 20% OFF on your first booking",
    link: "/services?gender=women"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800",
    title: "Men's Grooming",
    sub: "Precision haircuts & styling outlines",
    link: "/services?gender=men"
  }
];

const heroGridServices = [
  {
    label: "Women's Salon",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=150",
    href: "/services?gender=women",
    badge: "20% OFF"
  },
  {
    label: "Men's Grooming",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=150",
    href: "/services?gender=men",
    badge: "Men"
  },
  {
    label: "Spa & Massage",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=150",
    href: "/services?category=spa-massage"
  },
  {
    label: "Bridal Glam",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=150",
    href: "/bridal",
    badge: "Elite"
  },
  {
    label: "Event Glam",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=150",
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
        image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=150",
        href: "/services?gender=women",
        badge: "20% OFF"
      },
      {
        label: "Korean Facials",
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=150",
        href: "/services?category=facials",
        badge: "Glow"
      },
      {
        label: "Spa & Massage",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=150",
        href: "/services?category=spa-massage"
      },
      {
        label: "Waxing & Thread",
        image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=150",
        href: "/services?category=waxing",
        badge: "Deal"
      },
      {
        label: "Manicure",
        image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=150",
        href: "/services?search=Manicure",
        badge: "New"
      },
      {
        label: "Pedicure",
        image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=150",
        href: "/services?search=Pedicure"
      },
      {
        label: "Hair & Styling",
        image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=150",
        href: "/services?search=hair"
      }
    ]
  },
  {
    title: "Men's Grooming",
    items: [
      {
        label: "Men's Grooming",
        image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=150",
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
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=150",
        href: "/bridal",
        badge: "Elite"
      },
      {
        label: "Event Glam",
        image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=150",
        href: "/events",
        badge: "Luxury"
      },
      {
        label: "Free Consult",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=150",
        href: "/bridal#packages",
        badge: "Free"
      }
    ]
  }
];

export default function HomeServicesSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAllServicesModalOpen, setIsAllServicesModalOpen] = useState(false);

  // Auto-play slide
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % mobileSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isAllServicesModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isAllServicesModalOpen]);

  return (
    <section className="hidden lg:block py-16 bg-white border-t border-b border-pearl-200">
      <div className="max-w-5xl mx-auto px-6 space-y-12">
        
        {/* 1. Autoplay Banner Carousel (Desktop Optimized) */}
        <div className="relative w-full h-64 rounded-3xl overflow-hidden shadow-luxury-md group border border-pearl-200/40">
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
                  sizes="1000px"
                  priority={idx === 0}
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                <div className="absolute inset-y-0 left-0 p-12 flex flex-col justify-center text-white space-y-3 max-w-[60%]">
                  <span className="text-xs tracking-widest font-extrabold text-champagne uppercase">
                    Roopé Premium
                  </span>
                  <h4 className="text-3xl font-display font-light leading-tight">
                    {slide.title}
                  </h4>
                  <p className="text-sm text-pearl/80 font-light leading-relaxed">
                    {slide.sub}
                  </p>
                </div>
              </Link>
            );
          })}
          
          {/* Navigation dots */}
          <div className="absolute bottom-6 right-8 flex gap-2 z-10">
            {mobileSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  idx === activeSlide ? "bg-white w-5" : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Heading Block */}
        <div className="space-y-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-champagne-DEFAULT" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#B8922E]">
              doorstep premium services
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-light text-roope-primary leading-tight">
            Home services at <span className="italic text-gradient-gold">your doorstep</span>
          </h2>
        </div>

        {/* 2. Compact Grid of Services (Matches Mobile Round Icons UX) */}
        <div className="bg-[#FAF9F6] border border-pearl-200/80 rounded-3xl p-6 shadow-sm max-w-4xl mx-auto">
          <div className="grid grid-cols-6 gap-4">
            {heroGridServices.map((service, idx) => {
              if (service.isAllServicesTrigger) {
                return (
                  <button
                    key={idx}
                    onClick={() => setIsAllServicesModalOpen(true)}
                    className="flex flex-col items-center text-center group relative cursor-pointer focus:outline-none"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <div className="absolute inset-0 bg-[#F3E8C8]/40 border border-pearl-200 shadow-sm rounded-full flex items-center justify-center group-hover:scale-105 group-hover:bg-[#F3E8C8]/60 transition-all duration-300">
                        <LayoutGrid className="w-8 h-8 text-[#B8922E]" />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-stone-warm mt-3 leading-tight min-h-[32px] flex items-center justify-center group-hover:text-roope-primary transition-colors">
                      All Services
                    </span>
                  </button>
                );
              }
              return (
                <Link
                  key={idx}
                  href={service.href || "#"}
                  className="flex flex-col items-center text-center group relative cursor-pointer"
                >
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <div className="absolute inset-0 bg-white border border-pearl-200 shadow-sm rounded-full overflow-hidden flex items-center justify-center group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                      <Image
                        src={service.image || ""}
                        alt={service.label || ""}
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized
                      />
                    </div>
                    {service.badge && (
                      <span className="absolute -top-1 -right-1 bg-[#B8922E] text-white text-[8px] font-extrabold px-2 py-0.5 rounded-full shadow-sm z-10 leading-none uppercase tracking-wide whitespace-nowrap">
                        {service.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-stone-warm mt-3 leading-tight min-h-[32px] flex items-center justify-center group-hover:text-roope-primary transition-colors">
                    {service.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 3. Trust Ratings Metrics Bar */}
        <div className="flex items-center justify-center gap-16 border-t border-pearl-200/50 pt-8 max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF9F6] flex items-center justify-center border border-pearl-200">
              <Star className="w-4 h-4 text-champagne-DEFAULT fill-current" />
            </div>
            <div>
              <p className="text-lg font-display font-light text-roope-primary">4.9 / 5.0</p>
              <p className="text-[10px] text-stone-warm/60 uppercase font-semibold tracking-wider">Average Rating</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF9F6] flex items-center justify-center border border-pearl-200">
              <Users className="w-4 h-4 text-champagne-DEFAULT" />
            </div>
            <div>
              <p className="text-lg font-display font-light text-roope-primary">100+ Served</p>
              <p className="text-[10px] text-stone-warm/60 uppercase font-semibold tracking-wider">Clients in Indore</p>
            </div>
          </div>
        </div>

      </div>

      {/* DESKTOP ALL SERVICES MODAL (Centered overlay) */}
      <AnimatePresence>
        {isAllServicesModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAllServicesModalOpen(false)}
              className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
            />
            {/* Modal */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="bg-[#FAF9F6] rounded-3xl shadow-2xl flex flex-col max-w-3xl w-full max-h-[80vh] overflow-hidden border border-pearl-200/50"
              >
                {/* Header */}
                <div className="flex items-center justify-between py-5 px-8 border-b border-pearl-200/60 flex-shrink-0">
                  <h3 className="text-base font-extrabold text-roope-primary uppercase tracking-wider">
                    Explore All Services
                  </h3>
                  <button
                    onClick={() => setIsAllServicesModalOpen(false)}
                    className="w-8 h-8 rounded-full border border-pearl-200 flex items-center justify-center text-stone-warm hover:text-roope-primary bg-white shadow-sm hover:scale-105 transition-transform"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Categories Grid list */}
                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
                  {modalCategories.map((category, catIdx) => (
                    <div key={catIdx} className="space-y-4">
                      <h4 className="text-xs font-extrabold text-roope-primary uppercase tracking-wider border-l-2 border-[#C9A84C] pl-2.5">
                        {category.title}
                      </h4>
                      
                      {/* Grid Row of Services */}
                      <div className="grid grid-cols-5 gap-4">
                        {category.items.map((item, itemIdx) => (
                          <Link
                            key={itemIdx}
                            href={item.href}
                            onClick={() => setIsAllServicesModalOpen(false)}
                            className="flex flex-col items-center justify-between p-4 bg-white border border-pearl-200/80 rounded-2xl h-28 hover:border-champagne-DEFAULT hover:shadow-luxury transition-all group"
                          >
                            <div className="relative w-12 h-12 flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.label}
                                fill
                                className="object-cover rounded-full border border-pearl-100 group-hover:scale-105 transition-transform"
                                sizes="48px"
                                unoptimized
                              />
                              {item.badge && (
                                <span className="absolute -top-1 -right-1.5 bg-[#B8922E] text-white text-[7px] font-extrabold px-1.5 py-0.5 rounded-full shadow-sm z-10 leading-none uppercase tracking-wide">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-extrabold text-stone-warm group-hover:text-roope-primary transition-colors mt-2 leading-tight text-center line-clamp-2 w-full">
                              {item.label}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
