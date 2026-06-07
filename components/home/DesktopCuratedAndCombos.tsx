"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const curatedExperiences = [
  {
    id: "bridal-signature",
    name: "Signature Bridal Glam",
    category: "Bridal",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300",
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
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=300",
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
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300",
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
    image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=300",
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
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300",
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
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=300",
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
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300",
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
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300",
    rating: "4.86",
    reviews: "48K",
    price: 399,
    originalPrice: 449,
    tag: "Trending",
    link: "/services?gender=men"
  }
];

export default function DesktopCuratedAndCombos() {
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

  return (
    <section className="hidden lg:block py-20 bg-white dark:bg-[#0C0A09] border-b border-pearl-200">
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
                  className="bg-[#FAF9F6] dark:bg-[#141210] border border-pearl-200 rounded-[24px] p-4 flex flex-col justify-between hover:shadow-luxury hover:-translate-y-1 transition-all duration-300 group animate-fade-in"
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
                        <span className="absolute top-2.5 right-2.5 bg-[#1A1612] text-white dark:bg-champagne dark:text-[#0C0A09] text-[9px] font-extrabold px-2 py-0.5 rounded-md">
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
                        className="border border-[#B8922E] text-roope-primary text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider hover:bg-[#B8922E] hover:text-white transition-all cursor-pointer bg-white"
                      >
                        Add
                      </Link>
                    ) : (
                      <div>
                        {qty === 0 ? (
                          <button
                            onClick={() => handleAddToCart(item.id)}
                            className="border border-[#B8922E] text-roope-primary text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider hover:bg-[#B8922E] hover:text-white transition-all cursor-pointer bg-white"
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
                  className="bg-[#FAF9F6] dark:bg-[#141210] border border-pearl-200 rounded-[24px] p-4 flex flex-col justify-between hover:shadow-luxury hover:-translate-y-1 transition-all duration-300 group animate-fade-in"
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
                        <span className="absolute top-2.5 right-2.5 bg-[#1A1612] text-white dark:bg-champagne dark:text-[#0C0A09] text-[9px] font-extrabold px-2 py-0.5 rounded-md">
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
                          className="border border-[#B8922E] text-roope-primary text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider hover:bg-[#B8922E] hover:text-white transition-all cursor-pointer bg-white"
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
  );
}
