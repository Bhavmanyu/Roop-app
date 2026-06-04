"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import ViewportSwitcher from "../layout/ViewportSwitcher";

type ViewMode = "auto" | "mobile" | "desktop";

interface ViewportContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isMobileView: boolean;
  isDesktopView: boolean;
}

const ViewportContext = createContext<ViewportContextType | undefined>(undefined);

export const useViewport = () => {
  const context = useContext(ViewportContext);
  if (!context) {
    throw new Error("useViewport must be used within a ViewportProvider");
  }
  return context;
};

export default function ViewportProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>("auto");
  const [isDesktopScreen, setIsDesktopScreen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isIframe, setIsIframe] = useState(false);
  const [iframeSrc, setIframeSrc] = useState("");

  useEffect(() => {
    setIsMounted(true);
    
    // Detect if we are inside an iframe
    const inIframe = window.self !== window.top;
    setIsIframe(inIframe);

    if (!inIframe) {
      setIframeSrc(window.location.pathname + window.location.search);
    }

    // Retrieve stored preference or default to "auto"
    const savedMode = localStorage.getItem("roope-view-mode") as ViewMode;
    if (savedMode && ["auto", "mobile", "desktop"].includes(savedMode)) {
      setViewMode(savedMode);
    }

    // Screen size and robust device detection
    const checkScreen = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobileUA = /android|avantgo|bada|blackberry|iemobile|ip(hone|od|ad)|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(userAgent);
      const isSmallScreen = window.innerWidth < 1024;
      const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

      // A device is mobile/tablet if it matches mobile User Agent, or has touch on <1024px screen, or width < 768px
      const isMobile = isMobileUA || (isSmallScreen && hasTouch) || window.innerWidth < 768;

      setIsDesktopScreen(!isMobile);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Update viewport tag and document classes based on viewMode
  useEffect(() => {
    if (!isMounted) return;

    const updateViewport = () => {
      let meta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "viewport";
        document.head.appendChild(meta);
      }

      if (viewMode === "desktop") {
        const screenWidth = window.innerWidth || window.screen.width;
        const desktopWidth = 1200;
        const initialScale = screenWidth < desktopWidth ? (screenWidth / desktopWidth) : 1.0;
        
        meta.content = `width=${desktopWidth}, initial-scale=${initialScale.toFixed(3)}, maximum-scale=3.0, user-scalable=yes`;
        document.documentElement.classList.add("forced-desktop");
        document.documentElement.classList.remove("forced-mobile");
      } else if (viewMode === "mobile") {
        meta.content = "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes";
        document.documentElement.classList.add("forced-mobile");
        document.documentElement.classList.remove("forced-desktop");
      } else {
        meta.content = "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes";
        document.documentElement.classList.remove("forced-desktop", "forced-mobile");
      }
    };

    updateViewport();

    if (viewMode === "desktop") {
      window.addEventListener("resize", updateViewport);
      return () => window.removeEventListener("resize", updateViewport);
    }
  }, [viewMode, isMounted]);

  const handleSetViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem("roope-view-mode", mode);
  };

  const isMobileView = viewMode === "mobile" || (viewMode === "auto" && !isDesktopScreen);
  const isDesktopView = viewMode === "desktop" || (viewMode === "auto" && isDesktopScreen);

  // Sync iframe navigation to the outer window address bar
  const handleIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    try {
      const iframeWindow = e.currentTarget.contentWindow;
      if (iframeWindow) {
        const newPath = iframeWindow.location.pathname + iframeWindow.location.search;
        if (window.location.pathname + window.location.search !== newPath) {
          window.history.replaceState(null, "", newPath);
        }
      }
    } catch (err) {
      // Ignore cross-origin issues if any, though same-origin shouldn't trigger this
      console.warn("Iframe URL sync warning:", err);
    }
  };

  // If in forced Mobile mode on desktop screen, and NOT already inside the iframe, render mockup simulator
  if (isMounted && isDesktopScreen && viewMode === "mobile" && !isIframe) {
    return (
      <ViewportContext.Provider value={{ viewMode, setViewMode: handleSetViewMode, isMobileView: true, isDesktopView: false }}>
        <div className="fixed inset-0 bg-roope-primary flex flex-col items-center justify-center p-4 overflow-hidden z-[9999] select-none noise-overlay">
          {/* Ambient Glow background */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none filter blur-[120px] opacity-15"
            style={{ background: "radial-gradient(circle, #C9A84C 0%, transparent 70%)" }} 
          />

          {/* Simulator Metadata */}
          <div className="mb-4 text-center z-10">
            <span className="text-[10px] font-bold tracking-[0.2em] text-champagne uppercase">Roopé iOS Simulator</span>
            <h2 className="text-pearl/60 font-display text-xs font-light mt-1">Live Mobile Preview</h2>
          </div>

          {/* iPhone 15 Pro Max Mockup Frame */}
          <div 
            className="relative border-[#2D2824] rounded-[52px] shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden bg-pearl flex flex-col z-10"
            style={{ width: "412px", height: "820px", borderWidth: "12px" }}
          >
            {/* Dynamic Island Notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#1A1612] rounded-full z-[100] flex items-center justify-between px-4 border border-white/5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#0E0B0A]"></div>
              <div className="w-2 h-2 rounded-full bg-blue-950/20"></div>
            </div>

            {/* Screen Content via iframe */}
            <div className="flex-1 w-full h-full overflow-hidden bg-[#FAF9F6] relative">
              {iframeSrc && (
                <iframe 
                  src={iframeSrc} 
                  onLoad={handleIframeLoad}
                  className="w-full h-full border-0 pointer-events-auto select-text"
                />
              )}
            </div>

            {/* Home Indicator bar */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#2D2824]/60 rounded-full z-[100]"></div>
          </div>

          {/* Viewport Switcher panel rendered underneath the phone */}
          <div className="mt-5 pointer-events-auto z-10">
            <ViewportSwitcher />
          </div>
        </div>
      </ViewportContext.Provider>
    );
  }

  return (
    <ViewportContext.Provider value={{ viewMode, setViewMode: handleSetViewMode, isMobileView, isDesktopView }}>
      {children}
      {isMounted && !isIframe && <ViewportSwitcher />}
    </ViewportContext.Provider>
  );
}
