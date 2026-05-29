"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Star, Clock, ArrowRight, BadgeCheck } from "lucide-react";
import { services } from "@/lib/data";
import { formatPrice, getDiscount } from "@/lib/utils";

export default function SignaturePackages() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      id="signature-packages"
      className="py-24 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #F8F6F2 0%, #FAF6EC 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 flex items-end justify-between flex-wrap gap-6"
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

        {/* Cards horizontal scroll on mobile, grid on desktop */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.slice(0, 4).map((service, i) => {
            const discount = getDiscount(service.originalPrice, service.price);
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href="/services" className="group block h-full">
                  <div className="card-luxury h-full flex flex-col overflow-hidden">
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="300px"
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
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="tag-stone text-xs">{service.category}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" style={{ color: "#C9A84C" }} />
                          <span className="text-xs font-medium text-stone-warm">{service.rating}</span>
                          <span className="text-xs text-stone-warm/60">({service.reviews})</span>
                        </div>
                      </div>

                      <h3 className="font-display text-lg font-light text-roope-primary leading-tight mb-2 group-hover:text-gradient-gold transition-all duration-300">
                        {service.name}
                      </h3>

                      <p className="text-xs text-stone-warm/80 leading-relaxed mb-4 flex-1 line-clamp-2">
                        {service.description}
                      </p>

                      {/* Duration + tier */}
                      <div className="flex items-center gap-3 mb-4 text-xs text-stone-warm">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {service.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <BadgeCheck className="w-3 h-3" style={{ color: "#C9A84C" }} /> {service.artistTier}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-display text-xl font-light text-roope-primary">
                            {formatPrice(service.price)}
                          </span>
                          <span className="text-xs text-stone-warm/50 line-through ml-2">
                            {formatPrice(service.originalPrice)}
                          </span>
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                          style={{ background: "linear-gradient(135deg, #C9A84C 0%, #B8922E 100%)" }}>
                          <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
