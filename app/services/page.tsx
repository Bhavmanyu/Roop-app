"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Clock, Search, SlidersHorizontal, X, ArrowRight } from "lucide-react";
import { services } from "@/lib/data";
import { formatPrice, getDiscount } from "@/lib/utils";

const categories = ["All", "Bridal", "Reception", "Party Glam", "Engagement", "Mehendi", "Haldi", "Natural", "Corporate", "Editorial"];
const priceRanges = [
  { label: "Under ₹3,000", min: 0, max: 3000 },
  { label: "₹3,000–₹8,000", min: 3000, max: 8000 },
  { label: "₹8,000–₹15,000", min: 8000, max: 15000 },
  { label: "₹15,000+", min: 15000, max: Infinity },
];

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePriceRange, setActivePriceRange] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("popular");

  const filtered = services.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || s.occasion === activeCategory || s.category === activeCategory;
    const matchPrice = activePriceRange === null || (
      s.price >= priceRanges[activePriceRange].min && s.price <= priceRanges[activePriceRange].max
    );
    return matchSearch && matchCat && matchPrice;
  }).sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return b.reviews - a.reviews;
  });

  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-12 px-6" style={{ background: "linear-gradient(160deg, #F8F6F2 0%, #FAF6EC 100%)" }}>
        <div className="max-w-7xl mx-auto">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="section-label mb-3">All Services</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="section-title mb-4 max-w-xl">
            Browse every <span className="italic text-gradient-gold">beauty service.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="section-subtitle max-w-lg">
            Filter by occasion and price to find the perfect service for your needs.
          </motion.p>
        </div>
      </section>

      <section className="py-10 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-warm" />
              <input
                id="service-search"
                type="text"
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm outline-none transition-all duration-200 focus:ring-2"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(107,94,82,0.15)",
                  color: "#1A1612",
                  "--tw-ring-color": "rgba(201,168,76,0.3)",
                } as React.CSSProperties}
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-stone-warm" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-stone-warm" />
              <select
                id="sort-services"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3.5 rounded-2xl text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(107,94,82,0.15)", color: "#1A1612" }}
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "text-white shadow-gold"
                    : "text-stone-warm hover:text-roope-primary"
                }`}
                style={{
                  background: activeCategory === cat
                    ? "linear-gradient(135deg, #C9A84C, #B8922E)"
                    : "rgba(255,255,255,0.9)",
                  border: "1px solid",
                  borderColor: activeCategory === cat ? "transparent" : "rgba(107,94,82,0.15)",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Price filters */}
          <div className="flex flex-wrap gap-3 mb-10">
            <div className="flex gap-2">
              {priceRanges.map((range, i) => (
                <button
                  key={range.label}
                  onClick={() => setActivePriceRange(activePriceRange === i ? null : i)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                    activePriceRange === i ? "bg-champagne-DEFAULT text-white" : "text-stone-warm border border-pearl-300"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <p className="text-sm text-stone-warm mb-6">{filtered.length} service{filtered.length !== 1 ? "s" : ""} found</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((service, i) => {
              const discount = getDiscount(service.originalPrice, service.price);
              return (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.3) }}
                  className="card-luxury flex flex-col group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="280px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {service.tag && <span className="tag-gold text-xs">{service.tag}</span>}
                    </div>
                    {discount > 0 && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-semibold text-white" style={{ background: "rgba(26,22,18,0.7)" }}>
                        -{discount}%
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="tag-stone text-xs">{service.occasion}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" style={{ color: "#C9A84C" }} />
                        <span className="text-xs text-stone-warm">{service.rating} ({service.reviews})</span>
                      </div>
                    </div>
                    <h3 className="font-display text-lg font-light text-roope-primary mb-2 leading-tight">{service.name}</h3>
                    <p className="text-xs text-stone-warm/80 mb-4 flex-1 line-clamp-2">{service.description}</p>
                    <div className="flex items-center gap-3 text-xs text-stone-warm mb-4">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{service.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-display text-xl font-light text-roope-primary">{formatPrice(service.price)}</span>
                        <span className="text-xs text-stone-warm/50 line-through ml-1.5">{formatPrice(service.originalPrice)}</span>
                      </div>
                      <Link href="/book" className="btn-primary text-xs px-4 py-2.5 gap-1.5">
                        Book <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-2xl mb-3">🔍</p>
              <p className="text-stone-warm">No services match your filters.</p>
              <button onClick={() => { setSearch(""); setActiveCategory("All"); setActivePriceRange(null); }}
                className="btn-primary mt-4 text-sm px-6 py-3">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
