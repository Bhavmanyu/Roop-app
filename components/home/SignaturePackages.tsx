"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { Star, Clock, ArrowRight, BadgeCheck } from "lucide-react";
import { services } from "@/lib/data";
import { formatPrice, getDiscount } from "@/lib/utils";

export default function SignaturePackages() {
  const router = useRouter();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const items = services.slice(0, 6);
  const duplicatedItems = [...items, ...items];

  const handleServiceClick = (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault();
    let cart: { [id: string]: number } = {};
    const savedCart = localStorage.getItem("roope-cart");
    if (savedCart) {
      try {
        cart = JSON.parse(savedCart);
      } catch (err) {
        cart = {};
      }
    }
    cart[id] = (cart[id] || 0) + 1;
    localStorage.setItem("roope-cart", JSON.stringify(cart));
    router.push(`/services?search=${encodeURIComponent(name)}`);
  };

  return (
    <section
      ref={ref}
      id="signature-packages"
      className="py-12 md:py-24 overflow-hidden bg-gradient-to-b from-pearl to-ivory"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 md:mb-14 flex items-end justify-between flex-wrap gap-6"
        >
          <div>
            <p className="section-label mb-3">Signature Services</p>
            <h2 className="section-title max-w-md">
              Every look, <span className="italic text-gradient-gold">masterfully crafted.</span>
            </h2>
          </div>
          <Link href="/services" className="btn-secondary text-sm px-6 py-3 flex items-center gap-2">
            All Services <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes marquee-rl {
            0% { transform: translate3d(0%, 0, 0); }
            100% { transform: translate3d(-50%, 0, 0); }
          }
          .marquee-track {
            display: flex;
            width: max-content;
            animation: marquee-rl 110s linear infinite;
          }
          .marquee-track:hover {
            animation-play-state: paused;
          }
        `}} />

        {/* Slow-scrolling infinite horizontal marquee from right to left */}
        <div className="w-full overflow-hidden py-4 -mx-4 px-4 md:-mx-6 md:px-6">
          <div className="marquee-track gap-5">
            {duplicatedItems.map((service, i) => {
              const discount = getDiscount(service.originalPrice, service.price);
              return (
                <div
                  key={`${service.id}-${i}`}
                  className="w-[210px] md:w-[310px] flex-shrink-0"
                >
                  <button
                    onClick={(e) => handleServiceClick(e, service.id, service.name)}
                    className="group block h-full w-full text-left outline-none cursor-pointer"
                  >
                    <div className="card-luxury h-full flex flex-col overflow-hidden">
                      {/* Image */}
                      <div className="relative h-32 md:h-52 overflow-hidden">
                        <Image
                          src={service.image}
                          alt={service.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="300px"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          {service.tag && (
                            <span className="tag-gold text-xs">{service.tag}</span>
                          )}
                        </div>
                        {discount > 0 && (
                          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-semibold text-white"
                            style={{ background: "rgba(26,22,18,0.7)" }}>
                            -{discount}%
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-3.5 md:p-5 flex flex-col flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="tag-stone text-[9px] md:text-xs">{service.category}</span>
                          <div className="flex items-center gap-0.5 md:gap-1">
                            <Star className="w-3 h-3 fill-current" style={{ color: "#C9A84C" }} />
                            <span className="text-[10px] md:text-xs font-medium text-stone-warm">{service.rating}</span>
                            <span className="text-[9px] md:text-xs text-stone-warm/60">({service.reviews})</span>
                          </div>
                        </div>

                        <h3 className="font-display text-xs font-semibold md:text-lg md:font-light text-roope-primary leading-tight mb-1 md:mb-2 group-hover:text-gradient-gold transition-all duration-300">
                          {service.name}
                        </h3>

                        <p className="text-[10.5px] md:text-xs text-stone-warm/80 leading-relaxed mb-2.5 md:mb-4 flex-1 line-clamp-2">
                          {service.description}
                        </p>

                        {/* Duration */}
                        <div className="flex items-center gap-2 mb-2.5 md:mb-4 text-[10px] md:text-xs text-stone-warm">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {service.duration}
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-display text-sm font-semibold md:text-xl md:font-light text-roope-primary">
                              {formatPrice(service.price)}
                            </span>
                            {service.originalPrice && (
                              <span className="text-[10px] md:text-xs text-stone-warm/50 line-through ml-1.5 md:ml-2">
                                {formatPrice(service.originalPrice)}
                              </span>
                            )}
                          </div>
                          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                            style={{ background: "linear-gradient(135deg, #C9A84C 0%, #B8922E 100%)" }}>
                            <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
