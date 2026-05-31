"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, X } from "lucide-react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Delay check slightly to simulate realistic professional consent triggers
    const accepted = localStorage.getItem("roope-cookies-accepted");
    if (accepted !== "true") {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("roope-cookies-accepted", "true");
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className="fixed bottom-6 left-6 right-6 md:right-auto md:max-w-sm z-50 pointer-events-auto"
        >
          <div className="glass rounded-[28px] border border-champagne-DEFAULT/25 shadow-luxury-xl p-5 bg-[#1A1612]/95 backdrop-blur-md text-white">
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-champagne-300/15 flex items-center justify-center flex-shrink-0 text-gold mt-0.5">
                <ShieldAlert className="w-4.5 h-4.5" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gradient-gold">
                  Premium Cookie Settings
                </h4>
                <p className="text-[10px] text-pearl-300/80 leading-relaxed mt-1">
                  Roopé utilizes cookies to personalize scheduling algorithms, dynamic location pre-fills, and ensure a highly secure doorstep styling experience.
                </p>
                
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={handleAccept}
                    className="px-4 py-2 bg-gradient-gold text-white hover:shadow-gold rounded-full text-[10px] font-bold uppercase tracking-widest transition-all"
                  >
                    Accept Cookies
                  </button>
                  <button
                    onClick={() => setShowBanner(false)}
                    className="text-[10px] font-bold uppercase tracking-wider text-pearl-300 hover:text-white transition-colors"
                  >
                    Manage Settings
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => setShowBanner(false)}
                className="text-pearl-300/50 hover:text-white transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
