"use client";

import { motion } from "framer-motion";
import { Monitor, Smartphone, Sparkles } from "lucide-react";
import { useViewport } from "../providers/ViewportProvider";

export default function ViewportSwitcher() {
  const { viewMode, setViewMode } = useViewport();

  const options = [
    { id: "auto", label: "Auto", icon: Sparkles, tooltip: "Device Match (Responsive)" },
    { id: "mobile", label: "Mobile", icon: Smartphone, tooltip: "Force Mobile Layout" },
    { id: "desktop", label: "Desktop", icon: Monitor, tooltip: "Force Desktop Layout" },
  ] as const;

  // Render inline if we are inside the iPhone Simulator screen (handled in ViewportProvider)
  const isSimulated = typeof window !== "undefined" && window.innerWidth >= 768 && viewMode === "mobile";

  const containerClasses = isSimulated
    ? "relative glass bg-white/5 border-white/10 p-1 rounded-full shadow-luxury flex items-center gap-1"
    : "fixed bottom-6 right-6 z-[999] glass p-1 rounded-full shadow-luxury-lg flex items-center gap-1 border-stone-warm/15 hover:border-champagne-300/30 transition-all duration-300";

  const activeBgColor = isSimulated
    ? "linear-gradient(135deg, #C9A84C 0%, #B8922E 100%)"
    : "linear-gradient(135deg, #1A1612 0%, #3D352D 100%)";

  return (
    <div className={containerClasses}>
      {options.map((opt) => {
        const isActive = viewMode === opt.id;
        const Icon = opt.icon;

        return (
          <button
            key={opt.id}
            onClick={() => setViewMode(opt.id)}
            title={opt.tooltip}
            className={`relative px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer outline-none select-none group ${
              isActive
                ? "text-white"
                : isSimulated
                ? "text-white/60 hover:text-white hover:bg-white/5"
                : "text-stone-warm/75 hover:text-roope-primary hover:bg-pearl-200/50"
            }`}
          >
            {/* Slide active backing highlight */}
            {isActive && (
              <motion.div
                layoutId="active-view-tab"
                className="absolute inset-0 rounded-full -z-10 shadow-sm"
                style={{ background: activeBgColor }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            
            <Icon className={`w-3.5 h-3.5 ${isActive ? "scale-110" : "group-hover:scale-105"} transition-transform duration-200`} />
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
