"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, Calendar, HelpCircle } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Hide the global bottom tab navigation on the final checkout screen
  // to avoid overlapping with the checkout action sticky bottom bar.
  if (pathname === "/book/checkout") {
    return null;
  }

  const tabs = [
    { href: "/", label: "Home", icon: Home },
    { href: "/services", label: "Services", icon: Sparkles },
    { href: "/profile/bookings", label: "Bookings", icon: Calendar },
    { href: "/contact", label: "Support", icon: HelpCircle },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-pearl-200 py-2.5 px-6 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] md:hidden flex justify-between items-center">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive =
          tab.href === "/"
            ? pathname === "/"
            : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex flex-col items-center gap-1 flex-1 py-1 text-center cursor-pointer"
          >
            <Icon
              className={`w-5 h-5 transition-colors duration-200 ${
                isActive ? "text-[#B8922E]" : "text-stone-warm/50"
              }`}
            />
            <span
              className={`text-[9px] font-extrabold tracking-wide transition-colors duration-200 ${
                isActive ? "text-[#B8922E]" : "text-stone-warm/50"
              }`}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
