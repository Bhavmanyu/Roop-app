"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashLoader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Lock body overflow during initial loading phase to keep interface stable
    document.body.style.overflow = "hidden";

    // Progress bar animation simulation (decelerates, then speeds up to 100% on complete)
    let interval: ReturnType<typeof setInterval>;
    
    const startProgress = () => {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          
          // Realistic load behavior: fast start, slows down near 80%, then finishes
          if (prev < 30) {
            return prev + Math.floor(Math.random() * 15) + 5;
          } else if (prev < 80) {
            return prev + Math.floor(Math.random() * 4) + 1;
          } else {
            return prev + Math.floor(Math.random() * 8) + 2;
          }
        });
      }, 80);
    };

    startProgress();

    return () => {
      clearInterval(interval);
    };
  }, []);

  // When progress reaches 100%, trigger the exit fade-out
  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        setVisible(false);
        // Restore standard scroll behavior
        document.body.style.overflow = "";
      }, 400); // Small aesthetic hold at 100% before transition
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 0.98,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
          }}
          className="fixed inset-0 z-[99999] bg-[#FAF9F6] flex flex-col items-center justify-center select-none pointer-events-auto noise-overlay"
        >
          {/* Ambient Glow background */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none filter blur-[120px] opacity-[0.07]"
            style={{ background: "radial-gradient(circle, #C9A84C 0%, transparent 70%)" }} 
          />

          <div className="text-center z-10 flex flex-col items-center">
            {/* Elegant Serif Logo */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl md:text-5xl font-bold tracking-wide text-roope-primary"
            >
              Roopé
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-[9px] font-bold uppercase tracking-[0.25em] text-champagne mt-2.5 mb-10"
            >
              Luxury Beauty, Reimagined
            </motion.p>

            {/* Progress Bar Component */}
            <div className="w-[200px] h-[2.5px] bg-[#C9A84C]/10 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full rounded-full"
                style={{ 
                  background: "linear-gradient(90deg, #C9A84C 0%, #B8922E 100%)",
                  width: `${progress}%`
                }}
                transition={{ ease: "easeOut", duration: 0.1 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
