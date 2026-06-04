"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Users } from "lucide-react";

interface VisualSchedulingCalendarProps {
  selectedDate: string;
  selectedTime: string;
  selectedOccasion: string;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
  onSelectOccasion: (occasion: string) => void;
}

const occasions = [
  { id: "bridal", label: "Wedding / Bridal", icon: "💍" },
  { id: "reception", label: "Reception", icon: "🥂" },
  { id: "engagement", label: "Engagement", icon: "💎" },
  { id: "mehendi", label: "Mehendi", icon: "🌿" },
  { id: "haldi", label: "Haldi", icon: "🌼" },
  { id: "party", label: "Party / Event", icon: "✨" },
];

const timeSlots = [
  { id: "09:00 AM", label: "09:00 AM", period: "Morning" },
  { id: "10:00 AM", label: "10:00 AM", period: "Morning" },
  { id: "11:00 AM", label: "11:00 AM", period: "Morning" },
  { id: "12:00 PM", label: "12:00 PM", period: "Afternoon" },
  { id: "01:00 PM", label: "01:00 PM", period: "Afternoon" },
  { id: "02:00 PM", label: "02:00 PM", period: "Afternoon" },
  { id: "03:00 PM", label: "03:00 PM", period: "Afternoon" },
  { id: "04:00 PM", label: "04:00 PM", period: "Evening" },
  { id: "05:00 PM", label: "05:00 PM", period: "Evening" },
  { id: "06:00 PM", label: "06:00 PM", period: "Evening" },
];

export default function VisualSchedulingCalendar({
  selectedDate,
  selectedTime,
  selectedOccasion,
  onSelectDate,
  onSelectTime,
  onSelectOccasion,
}: VisualSchedulingCalendarProps) {
  const [bookingMode, setBookingMode] = useState<"single" | "group">("single");
  const [guestsCount, setGuestsCount] = useState(1);
  const [days, setDays] = useState<any[]>([]);

  useEffect(() => {
    const dates = [];
    const today = new Date();
    const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
      const year = nextDate.getFullYear();
      const monthStr = String(nextDate.getMonth() + 1).padStart(2, "0");
      const dateStr = String(nextDate.getDate()).padStart(2, "0");
      const id = `${year}-${monthStr}-${dateStr}`;
      dates.push({
        id,
        dayName: weekdayNames[nextDate.getDay()],
        dateNum: nextDate.getDate(),
        monthName: monthNames[nextDate.getMonth()],
      });
    }

    setDays(dates);
    if (!selectedDate && dates[0]) {
      onSelectDate(dates[0].id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSetMode = (mode: "single" | "group") => {
    setBookingMode(mode);
    if (mode === "single") {
      setGuestsCount(1);
      const rawOccasion = selectedOccasion.split(" - ")[0] || "party";
      onSelectOccasion(rawOccasion);
    } else {
      setGuestsCount(2);
      const rawOccasion = selectedOccasion.split(" - ")[0] || "party";
      onSelectOccasion(`${rawOccasion} - Group of 2`);
    }
  };

  const handleGuestsChange = (val: number) => {
    const nextCount = Math.max(2, Math.min(8, val));
    setGuestsCount(nextCount);
    const rawOccasion = selectedOccasion.split(" - ")[0] || "party";
    onSelectOccasion(`${rawOccasion} - Group of ${nextCount}`);
  };

  const handleOccasionClick = (occId: string) => {
    if (bookingMode === "single") {
      onSelectOccasion(occId);
    } else {
      onSelectOccasion(`${occId} - Group of ${guestsCount}`);
    }
  };

  const activeOccasionId = selectedOccasion.split(" - ")[0] || "party";

  return (
    <div className="space-y-6">

      {/* STEP 1: Booking Mode */}
      <div>
        <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-2.5">
          Step 1: Experience Type
        </label>
        <div className="grid grid-cols-2 gap-3 p-1 bg-pearl-200/50 rounded-2xl border border-pearl-300/40">
          <button
            type="button"
            onClick={() => handleSetMode("single")}
            className={`py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              bookingMode === "single"
                ? "bg-white text-roope-primary shadow-sm font-bold"
                : "text-stone-warm/80 hover:text-roope-primary"
            }`}
          >
            <User className="w-4 h-4 text-gold" /> Personal Styling
          </button>
          <button
            type="button"
            onClick={() => handleSetMode("group")}
            className={`py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              bookingMode === "group"
                ? "bg-white text-roope-primary shadow-sm font-bold"
                : "text-stone-warm/80 hover:text-roope-primary"
            }`}
          >
            <Users className="w-4 h-4 text-gold" /> Group Booking
          </button>
        </div>

        <AnimatePresence>
          {bookingMode === "group" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3.5 bg-white border border-pearl-200 rounded-2xl p-4 flex items-center justify-between shadow-xs overflow-hidden"
            >
              <div>
                <p className="text-xs font-semibold text-roope-primary">Number of Guests</p>
                <p className="text-[10px] text-stone-warm/60 leading-snug mt-0.5">
                  Optimizes available slots for bridesmaids and family.
                </p>
              </div>
              <div className="flex items-center gap-3.5 bg-pearl-100 rounded-xl p-1.5 border border-pearl-200/60">
                <button
                  type="button"
                  disabled={guestsCount <= 2}
                  onClick={() => handleGuestsChange(guestsCount - 1)}
                  className="w-7 h-7 rounded-lg bg-white shadow-xs border border-pearl-300 text-stone-warm hover:text-roope-primary flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed text-sm font-bold"
                >
                  -
                </button>
                <span className="font-display text-sm font-bold text-roope-primary w-4 text-center">
                  {guestsCount}
                </span>
                <button
                  type="button"
                  disabled={guestsCount >= 8}
                  onClick={() => handleGuestsChange(guestsCount + 1)}
                  className="w-7 h-7 rounded-lg bg-white shadow-xs border border-pearl-300 text-stone-warm hover:text-roope-primary flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed text-sm font-bold"
                >
                  +
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* STEP 2: Date Selector */}
      <div>
        <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-2.5">
          Step 2: Pick a Date
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {days.map((d) => {
            const isActive = selectedDate === d.id;
            return (
              <button
                type="button"
                key={d.id}
                onClick={() => { onSelectDate(d.id); onSelectTime(""); }}
                className={`p-3 rounded-2xl border text-center transition-all duration-300 ${
                  isActive
                    ? "bg-stone-warm border-stone-warm text-white shadow shadow-gold"
                    : "bg-white border-pearl-200 text-stone-warm hover:border-champagne-300"
                }`}
              >
                <p className="text-[9px] font-bold uppercase tracking-wider opacity-60 leading-none">{d.dayName}</p>
                <p className="text-base font-display font-light my-1 leading-none">{d.dateNum}</p>
                <p className="text-[8px] uppercase tracking-wider font-extrabold opacity-60 leading-none">{d.monthName}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 3: Time Slots */}
      <div>
        <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-3">
          Step 3: Choose a Time
        </label>
        {selectedDate ? (
          <div className="space-y-4">
            {["Morning", "Afternoon", "Evening"].map((group) => {
              const groupSlots = timeSlots.filter((t) => t.period === group);
              return (
                <div key={group}>
                  <p className="text-[9px] font-extrabold text-stone-warm/40 uppercase tracking-widest mb-2 border-b border-pearl-200/50 pb-1">
                    {group}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {groupSlots.map((slot) => {
                      const isActive = selectedTime === slot.id;
                      return (
                        <button
                          type="button"
                          key={slot.id}
                          onClick={() => onSelectTime(slot.id)}
                          className={`py-3 px-3 rounded-2xl border text-xs font-semibold text-center transition-all duration-200 ${
                            isActive
                              ? "bg-white shadow border-[#B8922E] ring-1 ring-[#B8922E]/10 text-roope-primary"
                              : "bg-white border-pearl-200 text-stone-warm hover:border-champagne-300/60"
                          }`}
                        >
                          {slot.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 border border-dashed border-pearl-300 rounded-3xl text-center bg-white/40">
            <p className="text-xs text-stone-warm/60">Please select a date first.</p>
          </div>
        )}
      </div>

      {/* STEP 4: Occasion */}
      <div>
        <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-3">
          Step 4: Styling Occasion
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {occasions.map((occ) => {
            const isActive = activeOccasionId === occ.id;
            return (
              <button
                type="button"
                key={occ.id}
                onClick={() => handleOccasionClick(occ.id)}
                className={`p-3 rounded-2xl flex items-center gap-2.5 text-xs font-semibold border transition-all duration-300 ${
                  isActive
                    ? "bg-champagne-300/10 border-champagne-DEFAULT text-roope-primary"
                    : "bg-white border-pearl-200 text-stone-warm/80 hover:border-champagne-300"
                }`}
              >
                <span className="text-base leading-none">{occ.icon}</span>
                <span>{occ.label}</span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
