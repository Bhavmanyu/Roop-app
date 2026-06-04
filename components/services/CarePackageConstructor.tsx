"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Trash2, 
  Plus, 
  ArrowRight, 
  Gift, 
  HelpCircle,
  CheckCircle,
  Activity,
  Heart
} from "lucide-react";
import { services } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

// Filter out already bundled saver packages, leaving individual care treatments
const INDIVIDUAL_TREATMENTS = services.filter(
  (s) => s.category !== "super-saver"
);

// Grouping by client-friendly categories
const GROUPS = [
  { id: "facials", label: "Skin & Facials", emoji: "🧴" },
  { id: "pedi-mani", label: "Mani & Pedi", emoji: "💅" },
  { id: "spa-massage", label: "Spa & Massage", emoji: "💆‍♀️" },
  { id: "waxing", label: "Waxing & Threading", emoji: "✨" },
  { id: "grooming", label: "Men's Grooming", emoji: "🧔" },
];

interface CarePackageConstructorProps {
  onAddPackageToCart: (items: { [id: string]: number }) => void;
}

export default function CarePackageConstructor({ onAddPackageToCart }: CarePackageConstructorProps) {
  const [activeGroup, setActiveGroup] = useState("facials");
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [rewardMessage, setRewardMessage] = useState("Add treatments to build your package & unlock rewards!");
  const [showGuide, setShowGuide] = useState(false);

  // Calculate prices, discounts, and unlocked rewards based on package size
  const itemCount = selectedServices.length;
  const rawSubtotal = selectedServices.reduce((sum, item) => sum + item.price, 0);
  
  let discountPercentage = 0;
  let unlockedRewards: string[] = [];

  if (itemCount === 2) {
    discountPercentage = 10;
    unlockedRewards = ["10% Bundle Discount"];
  } else if (itemCount === 3) {
    discountPercentage = 20;
    unlockedRewards = ["20% Bundle Discount", "Free Eye Threading (worth ₹120)"];
  } else if (itemCount >= 4) {
    discountPercentage = 25;
    unlockedRewards = ["25% Bundle Discount", "Free Eye Threading", "Free Premium Silk Eyelash Extension (worth ₹999)"];
  }

  const discountAmount = Math.round((rawSubtotal * discountPercentage) / 100);
  const finalTotal = rawSubtotal - discountAmount;

  // Set progressive progress percentage for the progress bar
  let progress = 0;
  if (itemCount === 1) progress = 25;
  else if (itemCount === 2) progress = 50;
  else if (itemCount === 3) progress = 75;
  else if (itemCount >= 4) progress = 100;

  useEffect(() => {
    if (itemCount === 0) {
      setRewardMessage("Add treatments to build your package & unlock rewards!");
    } else if (itemCount === 1) {
      setRewardMessage("Add 1 more treatment to unlock 10% OFF your entire package!");
    } else if (itemCount === 2) {
      setRewardMessage("Awesome! You've unlocked 10% OFF. Add 1 more for 20% OFF + Free Threading!");
    } else if (itemCount === 3) {
      setRewardMessage("Brilliant! Unlocked 20% OFF + Free Threading. Add 1 more for maximum 25% OFF + Free Premium Silk Lashes!");
    } else {
      setRewardMessage("🎉 Maximum Tier Unlocked! You've secured 25% OFF and all free luxury upgrades!");
    }
  }, [itemCount]);

  const handleAddToPackage = (item: any) => {
    if (selectedServices.some((t) => t.id === item.id)) return; // Prevent duplicate additions
    setSelectedServices([...selectedServices, item]);
  };

  const handleRemoveFromPackage = (id: string) => {
    setSelectedServices(selectedServices.filter((t) => t.id !== id));
  };

  const handleBookPackage = () => {
    if (selectedServices.length === 0) return;
    
    // Convert package items to cart dictionary structure
    const cartDict: { [id: string]: number } = {};
    selectedServices.forEach((item) => {
      cartDict[item.id] = 1;
    });

    // If rewards are unlocked, we can implicitly inject bonus items if needed, 
    // or pass the coupon discount dynamically during checkout booking.
    onAddPackageToCart(cartDict);
  };

  return (
    <div className="w-full bg-[#FAF6EC] rounded-[40px] border border-pearl-300 p-6 md:p-8 shadow-luxury-xl relative overflow-hidden my-8">
      {/* Background radial gold glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_70%_10%,rgba(201,168,76,0.06),transparent_60%)]" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-pearl-200/80 relative z-10">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#B8922E] flex items-center gap-1">
              Interactive Atelier <Sparkles className="w-3 h-3 text-gold" />
            </span>
          </div>
          <h2 className="font-display text-3xl font-light text-roope-primary leading-none">
            Build Your Own <span className="italic text-gradient-gold">Luxury Package</span>
          </h2>
          <p className="text-stone-warm text-xs mt-2 max-w-xl leading-relaxed">
            Drag, tap, and curate your personal wellness treatments. Combine services into your custom package to unlock custom discounts and luxury bonus treatments.
          </p>
        </div>

        <button 
          onClick={() => setShowGuide(!showGuide)}
          className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-full border border-pearl-300 text-xs font-semibold text-stone-warm hover:text-roope-primary transition-all self-start md:self-center"
        >
          <HelpCircle className="w-4 h-4 text-gold" /> How it works
        </button>
      </div>

      {/* Guide Overlay Panel */}
      <AnimatePresence>
        {showGuide && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-3xl p-5 border border-[#C9A84C]/20 mb-6 shadow-xs text-xs text-stone-warm relative z-10"
          >
            <h4 className="font-bold text-roope-primary uppercase tracking-wider mb-2">How to build your custom package:</h4>
            <ol className="list-decimal list-inside space-y-2 leading-relaxed">
              <li>Browse individual treatments using the skin, nails, massage, and grooming category tabs.</li>
              <li>Click <strong>"Add to Package"</strong> to place a treatment into your custom package.</li>
              <li>Watch the animated progress bar advance. Add multiple treatments to claim custom discounts and luxury gifts automatically.</li>
              <li>Once satisfied, click <strong>"Confirm & Checkout"</strong> to load your custom package and schedule your visit.</li>
            </ol>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-12 gap-8 relative z-10">
        
        {/* ─── LEFT COLUMN: Selection Pool (7 Cols) ─── */}
        <div className="lg:col-span-7 flex flex-col justify-between min-h-[500px]">
          
          {/* Category Selector Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-5 border-b border-pearl-200/50 scrollbar-none">
            {GROUPS.map((g) => (
              <button
                key={g.id}
                onClick={() => setActiveGroup(g.id)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-2 border ${
                  activeGroup === g.id
                    ? "bg-stone-warm border-stone-warm text-white shadow-sm"
                    : "bg-white border-pearl-200 text-stone-warm hover:border-champagne-300"
                }`}
              >
                <span>{g.emoji}</span>
                <span>{g.label}</span>
              </button>
            ))}
          </div>

          {/* Treatment Cards Grid */}
          <div className="grid sm:grid-cols-2 gap-4 flex-1 content-start max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
            {INDIVIDUAL_TREATMENTS.filter((t) => t.category === activeGroup).map((treatment) => {
              const isAdded = selectedServices.some((item) => item.id === treatment.id);
              return (
                <motion.div
                  key={treatment.id}
                  whileHover={{ y: -2 }}
                  className={`bg-white rounded-3xl p-4 border transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                    isAdded 
                      ? "border-champagne-DEFAULT ring-1 ring-champagne-DEFAULT/10" 
                      : "border-pearl-200/60 hover:border-champagne-300/40 shadow-xs"
                  }`}
                >
                  <div>
                    {/* Image Thumbnail */}
                    <div className="relative w-full h-28 rounded-2xl overflow-hidden mb-3 border border-pearl-100 bg-pearl-100">
                      <Image
                        src={treatment.image}
                        alt={treatment.name}
                        fill
                        className="object-cover"
                        sizes="200px"
                        unoptimized
                      />
                    </div>

                    <div className="flex justify-between items-start gap-1">
                      <h3 className="font-display text-sm font-semibold text-roope-primary leading-tight line-clamp-2">
                        {treatment.name}
                      </h3>
                    </div>
                    
                    <p className="text-[10px] text-stone-warm/60 line-clamp-2 mt-1 leading-snug">
                      {treatment.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-pearl-100 flex items-center justify-between">
                    <div>
                      <span className="font-display text-sm font-medium text-roope-primary">
                        {formatPrice(treatment.price)}
                      </span>
                      <span className="block text-[9px] text-stone-warm/50">{treatment.duration}</span>
                    </div>

                    <button
                      disabled={isAdded}
                      onClick={() => handleAddToPackage(treatment)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                        isAdded
                          ? "bg-pearl-200 text-stone-warm/55 border border-pearl-300"
                          : "border border-champagne-DEFAULT text-roope-primary hover:bg-champagne-DEFAULT hover:text-white"
                      }`}
                    >
                      {isAdded ? "Added" : "Add to Package"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ─── RIGHT COLUMN: Package Summary & Rewards Progress (5 Cols) ─── */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Visual Package Container */}
          <div className="bg-white/80 backdrop-blur-md rounded-[32px] border border-pearl-300/80 p-5 shadow-luxury flex flex-col justify-between min-h-[280px]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-pearl-200/60 mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-roope-primary flex items-center gap-1.5">
                  ✨ Your Custom Package
                </h3>
                <span className="text-[10px] font-bold text-[#B8922E] bg-champagne-300/30 px-2.5 py-0.5 rounded-full">
                  {itemCount} {itemCount === 1 ? "Treatment" : "Treatments"}
                </span>
              </div>

              {/* Added Items list */}
              <div className="min-h-[140px] max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                <AnimatePresence initial={false}>
                  {selectedServices.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-32 flex flex-col items-center justify-center text-center border-2 border-dashed border-pearl-300 rounded-2xl p-4"
                    >
                      <span className="text-2xl mb-1 filter grayscale opacity-45">🧖‍♀️</span>
                      <p className="text-[11px] font-semibold text-stone-warm">Your package is empty</p>
                      <p className="text-[9px] text-stone-warm/50 max-w-[200px] mt-0.5 leading-snug">Add individual skin, massage, or nail treatments from the left pool.</p>
                    </motion.div>
                  ) : (
                    <div className="space-y-2">
                      {selectedServices.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex items-center justify-between p-3 rounded-2xl bg-white border border-pearl-200/80 shadow-xs"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-pearl-100 flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                                sizes="36px"
                                unoptimized
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-roope-primary truncate max-w-[150px]">{item.name}</p>
                              <p className="text-[9px] text-stone-warm/50">{formatPrice(item.price)}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleRemoveFromPackage(item.id)}
                            className="w-7 h-7 rounded-full flex items-center justify-center bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Micro calculations inside package */}
            {selectedServices.length > 0 && (
              <div className="pt-4 border-t border-pearl-200/60 mt-4 space-y-2 text-xs">
                <div className="flex justify-between text-stone-warm">
                  <span>Package Subtotal</span>
                  <span className="font-semibold text-roope-primary">{formatPrice(rawSubtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Bundle Discount (-{discountPercentage}%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-bold text-roope-primary pt-2.5 border-t border-pearl-100">
                  <span>Estimated Total</span>
                  <span className="text-gradient-gold text-sm">{formatPrice(finalTotal)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Luxury Milestones Progress Bar card */}
          <div className="bg-white rounded-3xl border border-pearl-200 p-5 shadow-sm space-y-4">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-warm/60 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-gold" /> Rewards Progress
              </h4>
              <p className="text-[10px] text-stone-warm/75 mt-1 leading-snug">
                {rewardMessage}
              </p>
            </div>

            {/* Custom Milestone Progress Bar */}
            <div className="relative pt-2 pb-6">
              {/* Slider Track */}
              <div className="h-1.5 w-full bg-pearl-200 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-champagne-300 via-champagne-DEFAULT to-[#B8922E] rounded-full"
                />
              </div>

              {/* Milestone Dots */}
              {[
                { count: 2, label: "10% OFF", progressVal: 50 },
                { count: 3, label: "20% OFF + Threading", progressVal: 75 },
                { count: 4, label: "25% OFF + Eyelashes!", progressVal: 100 },
              ].map((ms) => {
                const isReached = itemCount >= ms.count;
                return (
                  <div 
                    key={ms.count}
                    className="absolute top-0.5 -translate-y-0.5 flex flex-col items-center"
                    style={{ left: `${ms.progressVal}%`, transform: "translateX(-50%)" }}
                  >
                    <div 
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all duration-300 ${
                        isReached 
                          ? "bg-[#B8922E] border-[#B8922E] text-white shadow-gold" 
                          : "bg-white border-pearl-300 text-stone-warm/30"
                      }`}
                    >
                      <CheckCircle className={`w-2.5 h-2.5 ${isReached ? "block" : "hidden"}`} />
                    </div>
                    <span 
                      className={`text-[8px] font-extrabold tracking-tight mt-2.5 whitespace-nowrap text-center uppercase ${
                        isReached ? "text-roope-primary" : "text-stone-warm/40"
                      }`}
                    >
                      {ms.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Unlocked Upgrades Checkbox List */}
            {unlockedRewards.length > 0 && (
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-3 space-y-1.5">
                <p className="text-[9px] font-extrabold text-emerald-800 uppercase tracking-widest flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5" /> Luxury Gifts Unlocked
                </p>
                {unlockedRewards.map((reward, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[10px] text-emerald-700 font-semibold">
                    <Heart className="w-3 h-3 text-[#B8922E] fill-current" />
                    <span>{reward}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Action Book Button */}
            <button
              disabled={selectedServices.length === 0}
              onClick={handleBookPackage}
              className="w-full btn-primary py-3.5 justify-center gap-1.5 uppercase tracking-widest text-xs font-semibold shadow-md disabled:opacity-40 disabled:cursor-not-allowed active:scale-98 transition-all"
            >
              Confirm & Book Package <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
