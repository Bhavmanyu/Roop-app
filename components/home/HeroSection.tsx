"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Star, Shield, Clock, Sparkles } from "lucide-react";

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

export default function HeroSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 30, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 30, damping: 20 });

  const rotateX = useTransform(springY, [-300, 300], [3, -3]);
  const rotateY = useTransform(springX, [-300, 300], [-3, 3]);

  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
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

      <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-16 grid lg:grid-cols-2 gap-12 items-center">
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
          className="relative hidden lg:flex items-center justify-center"
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
  );
}
