"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles, 
  Check, 
  AlertCircle, 
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";

export default function BookingsHistoryPage() {
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoadingUser(false);
      if (session?.user) {
        fetchHistory(session.access_token);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoadingUser(false);
      if (session?.user) {
        fetchHistory(session.access_token);
      } else {
        setBookings([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchHistory = async (token: string) => {
    setLoadingBookings(true);
    setError("");
    try {
      const res = await fetch("/api/bookings/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setBookings(data.bookings || []);
      } else {
        setError(data.error || "Failed to retrieve your bookings.");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    } finally {
      setLoadingBookings(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-500/10 text-green-600 border border-green-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-600 border border-red-500/20";
      default:
        return "bg-champagne-300/30 text-roope-primary border border-champagne-DEFAULT/20";
    }
  };

  // Split bookings into upcoming and past
  const todayStr = new Date().toISOString().split("T")[0];
  const upcomingBookings = bookings.filter(b => b.date >= todayStr && b.status !== "cancelled");
  const pastBookings = bookings.filter(b => b.date < todayStr || b.status === "cancelled");

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] pt-24">
        <p className="text-sm font-bold uppercase tracking-widest text-gold animate-pulse">
          Loading Your Profile...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-12"
        style={{ background: "linear-gradient(160deg, #F8F6F2 0%, #FAF6EC 100%)" }}>
        <div className="max-w-md w-full text-center p-8 bg-white border border-pearl-200 rounded-3xl shadow-xl">
          <ShoppingBag className="w-12 h-12 text-gold mx-auto mb-4" />
          <h1 className="font-display text-xl md:text-2xl font-semibold md:font-light text-roope-primary mb-3">View Your Appointments</h1>
          <p className="text-xs text-stone-warm/80 leading-relaxed mb-6">
            Please sign in using your account to view your scheduled beauty sessions, history, and booking receipts.
          </p>
          {/* We advise the user to use the Navbar Sign In button */}
          <div className="p-3.5 bg-champagne-300/15 border border-champagne-DEFAULT/20 rounded-2xl text-[11px] font-semibold text-roope-primary mb-2 leading-relaxed">
            Click the **Sign In** button at the top right of the page to access your profile.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-24 px-6" style={{ background: "linear-gradient(160deg, #F8F6F2 0%, #FAF6EC 100%)" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-pearl-200/80 pb-6 mb-8">
          <div>
            <p className="section-label mb-2 tracking-widest uppercase">Client Portal</p>
            <h1 className="font-display text-2xl md:text-3xl font-semibold md:font-light text-roope-primary">
              Your <span className="text-gradient-gold">Glamour Sessions</span>
            </h1>
            <p className="text-xs text-stone-warm/80 mt-1">Logged in as {user.email}</p>
          </div>
          
          <Link href="/book" className="btn-primary py-3 px-6 text-xs uppercase tracking-widest font-semibold mt-4 md:mt-0 flex items-center gap-2 shadow-sm">
            Book New Service <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {error && (
          <div className="p-4 bg-red-500/5 border border-red-500/15 rounded-2xl flex gap-2 items-center text-red-600 text-xs mb-6">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loadingBookings ? (
          <div className="py-12 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-gold animate-pulse">
              Retrieving Booking Receipts...
            </p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-pearl-200 text-center shadow-sm max-w-lg mx-auto">
            <ShoppingBag className="w-10 h-10 text-stone-warm/30 mx-auto mb-4" />
            <h3 className="font-display text-lg md:text-xl font-semibold md:font-light text-roope-primary mb-2">No Bookings Yet</h3>
            <p className="text-xs text-stone-warm/75 mb-6">
              You haven&apos;t scheduled any Roopé luxury salon appointments yet. Create your first session now.
            </p>
            <Link href="/book" className="btn-primary py-3.5 px-8 text-xs uppercase tracking-widest justify-center shadow-md w-full">
              Schedule First Service
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Upcoming Appointments */}
            {upcomingBookings.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-stone-warm/70 mb-4 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-gold" /> Upcoming Appointments
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {upcomingBookings.map((booking) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-pearl-200 rounded-3xl p-5 shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                          <span className="text-[10px] font-bold text-stone-warm bg-pearl-200/50 px-2 py-0.5 rounded">
                            RP-{booking.id.slice(0, 8).toUpperCase()}
                          </span>
                        </div>

                        <h4 className="font-display text-base md:text-lg font-semibold md:font-light text-roope-primary leading-snug mb-2">
                          {booking.service_name}
                        </h4>

                        <div className="space-y-2 text-xs text-stone-warm mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-stone-warm/40" />
                            <span>{booking.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-stone-warm/40" />
                            <span>{booking.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-stone-warm/40" />
                            <span className="truncate">{booking.address}, Indore</span>
                          </div>
                        </div>

                        {booking.extras && booking.extras.length > 0 && (
                          <div className="border-t border-pearl-200/60 pt-3 mb-4">
                            <p className="text-[10px] uppercase font-bold text-stone-warm/50 mb-1.5">Add-ons Selected</p>
                            <div className="flex flex-wrap gap-1">
                              {booking.extras.map((ex: string, i: number) => (
                                <span key={i} className="text-[9px] bg-pearl-200 text-stone-warm px-2 py-0.5 rounded">
                                  + {ex}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-pearl-200 pt-3 flex justify-between items-center bg-pearl-100/10 -mx-5 -mb-5 px-5 py-3 rounded-b-3xl">
                        <span className="text-[10px] font-bold text-stone-warm uppercase">Total Paid</span>
                        <span className="font-display text-lg text-roope-primary">{formatPrice(booking.total_amount)}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Past & Cancelled Sessions */}
            {pastBookings.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-stone-warm/70 mb-4 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-stone-warm/50" /> Past Appointments
                </h3>
                
                <div className="space-y-3">
                  {pastBookings.map((booking) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white border border-pearl-200/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                          <span className="text-[9px] font-medium text-stone-warm/60">
                            #RP-{booking.id.slice(0, 8).toUpperCase()}
                          </span>
                        </div>
                        <h4 className="font-semibold text-roope-primary text-sm">{booking.service_name}</h4>
                        <p className="text-[10px] text-stone-warm/60 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-stone-warm/40" /> {booking.date}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-stone-warm/40" /> {booking.time}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-stone-warm/40" /> Indore</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-pearl-200/50 pt-2 sm:pt-0">
                        <div className="text-left sm:text-right">
                          <p className="text-[9px] text-stone-warm/50 uppercase">Amount</p>
                          <p className="text-sm font-semibold text-roope-primary">{formatPrice(booking.total_amount)}</p>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-pearl-200/50 flex items-center justify-center text-stone-warm/40">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
