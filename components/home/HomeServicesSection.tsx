"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Users } from "lucide-react";

export default function HomeServicesSection() {
  const serviceCategories = [
    {
      label: "Women's Salon & Spa",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=150",
      href: "/services?gender=women",
      badge: "Upto 20% OFF",
    },
    {
      label: "Massage for Men",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=150",
      href: "/services?gender=men",
      badge: "Stress relief",
    },
    {
      label: "Korean Facials",
      image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=150",
      href: "/services?category=facials",
      badge: "Glow special",
    },
    {
      label: "Pedicure & Manicure",
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=150",
      href: "/services?category=pedi-mani",
      badge: "Luxury spa",
    },
    {
      label: "Spa & Massage",
      image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=150",
      href: "/services?category=spa-massage",
      badge: "Certified",
    },
    {
      label: "Bridal Glam",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=150",
      href: "/bridal",
      badge: "Lead Artists",
    },
  ];

  return (
    <section className="hidden lg:block py-24 bg-white border-t border-b border-pearl-200">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-12 gap-12 items-center">
        {/* Left Column: Title, Grid card, Trust metrics */}
        <div className="col-span-7 space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-champagne-DEFAULT" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#B8922E]">
                doorstep premium services
              </span>
            </div>
            <h2 className="font-display text-4xl font-light text-roope-primary leading-tight">
              Home services at <span className="italic text-gradient-gold">your doorstep</span>
            </h2>
          </div>

          {/* Grid card */}
          <div className="bg-[#FAF9F6] border border-pearl-200/80 rounded-[32px] p-8 shadow-luxury">
            <div className="grid grid-cols-3 gap-6">
              {serviceCategories.map((cat, idx) => (
                <Link
                  key={idx}
                  href={cat.href}
                  className="bg-white rounded-2xl border border-pearl-200/60 p-4 flex flex-col items-center text-center hover:border-champagne-DEFAULT hover:shadow-luxury transition-all duration-300 group"
                >
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-pearl-200 border border-pearl-200 flex-shrink-0 mb-3">
                    <Image
                      src={cat.image}
                      alt={cat.label}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="64px"
                      unoptimized
                    />
                  </div>
                  <span className="text-xs font-bold text-roope-primary group-hover:text-[#B8922E] transition-colors leading-tight min-h-[32px] flex items-center justify-center">
                    {cat.label}
                  </span>
                  {cat.badge && (
                    <span className="text-[8px] bg-champagne-300/30 text-[#B8922E] px-2 py-0.5 rounded font-extrabold uppercase mt-2 tracking-wider">
                      {cat.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Trust ratings */}
          <div className="flex items-center gap-12 pl-4 border-t border-pearl-200/50 pt-6">
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

        {/* Right Column: 4-Photo Collage */}
        <div className="col-span-5 grid grid-cols-2 gap-4">
          <div className="relative h-64 rounded-3xl overflow-hidden shadow-luxury border border-pearl-200">
            <Image
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400"
              alt="Women's Salon"
              fill
              className="object-cover"
              sizes="200px"
              unoptimized
            />
          </div>
          <div className="relative h-64 rounded-3xl overflow-hidden shadow-luxury border border-pearl-200 mt-8">
            <Image
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400"
              alt="Massage for Men"
              fill
              className="object-cover"
              sizes="200px"
              unoptimized
            />
          </div>
          <div className="relative h-64 rounded-3xl overflow-hidden shadow-luxury border border-pearl-200 -mt-8">
            <Image
              src="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400"
              alt="Pedicure & Manicure"
              fill
              className="object-cover"
              sizes="200px"
              unoptimized
            />
          </div>
          <div className="relative h-64 rounded-3xl overflow-hidden shadow-luxury border border-pearl-200">
            <Image
              src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400"
              alt="Bridal Glam"
              fill
              className="object-cover"
              sizes="200px"
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  );
}
