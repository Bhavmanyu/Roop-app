"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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
  const [isDesktopScreen, setIsDesktopScreen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const checkScreen = () => {
      const userAgent = typeof navigator !== "undefined" ? (navigator.userAgent || navigator.vendor || (window as any).opera) : "";
      
      // Mobile and tablet user agent regex
      const isMobileUA = /android|avantgo|bada|blackberry|iemobile|ip(hone|od|ad)|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(userAgent);
      
      const isSmallScreen = window.innerWidth < 1024;
      const hasTouch = typeof window !== "undefined" && (('ontouchstart' in window) || (navigator.maxTouchPoints > 0));

      // A device is mobile if it matches mobile User Agent, or has touch on <1024px screen, or screen width is less than 768px
      const isMobile = isMobileUA || (isSmallScreen && hasTouch) || window.innerWidth < 768;

      setIsDesktopScreen(!isMobile);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const handleSetViewMode = (mode: ViewMode) => {
    // Override selector is removed; autoselect matches layout naturally.
  };

  const isMobileView = isMounted ? !isDesktopScreen : false;
  const isDesktopView = isMounted ? isDesktopScreen : true;

  return (
    <ViewportContext.Provider 
      value={{ 
        viewMode: "auto", 
        setViewMode: handleSetViewMode, 
        isMobileView, 
        isDesktopView 
      }}
    >
      {children}
    </ViewportContext.Provider>
  );
}
