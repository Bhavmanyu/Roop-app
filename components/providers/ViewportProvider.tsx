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
      // Screen size boundary for desktop vs mobile (1024px is standard Tailwind lg breakpoint)
      setIsDesktopScreen(window.innerWidth >= 1024);
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
