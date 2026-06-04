"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { staggerChildren } from "@/lib/utils";

const transformations = [
  {
    id: 1,
    label: "Bridal HD",
    image: "/images/hero_bridal.png",
    span: "row-span-2",
  },
  {
    id: 2,
    label: "Bollywood Glam",
    image: "/images/bridal_glam_1.png",
    span: "",
  },
  {
    id: 3,
    label: "Party Glam",
    image: "/images/gallery_party_glam.png",
    span: "",
  },
  {
    id: 4,
    label: "Natural Dewy",
    image: "/images/gallery_natural_glam.png",
    span: "col-span-2",
  },
];

const variants = staggerChildren(100);

export default function FeaturedTransformations() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="transformations" className="py-12 md:py-24 px-4 md:px-6 max-w-7xl mx-auto">
      <motion.div
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        variants={variants.container}
        className="mb-8 md:mb-14"
      >
        <motion.p variants={variants.item} className="section-label mb-3">
          Real Transformations
        </motion.p>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <motion.h2 variants={variants.item} className="section-title max-w-lg">
            Beauty that speaks
            <span className="italic text-gradient-gold"> for itself.</span>
          </motion.h2>
          <motion.div variants={variants.item}>
            <Link href="/gallery" className="btn-secondary text-sm px-6 py-3 flex items-center gap-2">
              View Full Gallery <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Masonry-style grid */}
      <motion.div
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        variants={variants.container}
        className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 h-[380px] md:h-[640px]"
      >
        {transformations.map((item, i) => (
          <motion.div
            key={item.id}
            variants={variants.item}
            className={`relative group rounded-3xl overflow-hidden cursor-pointer ${item.span}`}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={item.image}
              alt={`${item.label} transformation by Roopé`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes={i === 0 ? "400px" : "250px"}
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-roope-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
            <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
              <span className="tag-gold inline-block">{item.label}</span>
            </div>
            {/* Always-visible label for first card */}
            {i === 0 && (
              <div className="absolute top-4 left-4">
                <span className="glass rounded-full px-3 py-1 text-xs font-medium text-roope-primary">
                  ⭐ Top Pick
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
