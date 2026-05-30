"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LogOut, RefreshCw, Calendar, MessageCircle, Heart,
  Sparkles, Star, CheckCircle, XCircle, Clock, ChevronDown,
} from "lucide-react";

type Booking = {
  id: string; created_at: string; name: string; phone: string; email: string;
  occasion: string; service_name: string; date: string; time: string;
  city: string; address: string; artist_tier: string; extras: string[];
  total_amount: number; status: string;
};
type Contact = {
  id: string; created_at: string; name: string; email: string;
  subject: string; message: string; status: string;
};
type BridalInquiry = {
  id: string; created_at: string; name: string; phone: string; email: string;
  package_name: string; wedding_date?: string; city: string; message: string; status: string;
};
type EventInquiry = {
  id: string; created_at: string; name: string; phone: string; email: string;
  package_name: string; group_size: number; event_date?: string; city: string;
  add_ons: string[]; message: string; status: string;
};
type Review = {
  id: string; created_at: string; name: string; location: string;
  service: string; rating: number; review_text: string; status: string;
};

type AdminData = {
  bookings: Booking[];
  contacts: Contact[];
  bridal: BridalInquiry[];
  events: EventInquiry[];
  reviews: Review[];
};

const TABS = [
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "contacts", label: "Messages", icon: MessageCircle },
  { id: "bridal", label: "Bridal", icon: Heart },
  { id: "events", label: "Events", icon: Sparkles },
  { id: "reviews", label: "Reviews", icon: Star },
];

const statusColors: Record<string, string> = {
  pending: "#C9A84C", new: "#C9A84C",
  confirmed: "#22c55e", approved: "#22c55e",
  cancelled: "#ef4444", rejected: "#ef4444",
  read: "#6B5E52", replied: "#6B5E52",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
      style={{
        background: `${statusColors[status] || "#6B5E52"}20`,
        color: statusColors[status] || "#6B5E52",
      }}
    >
      {status}
    </span>
  );
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatINR(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bookings");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/data");
      if (res.status === 401) { router.push("/admin"); return; }
      const json = await res.json();
      setData(json);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  const updateBookingStatus = async (id: string, status: string) => {
    setUpdating(id);
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await fetchData();
    setUpdating(null);
  };

  const updateReviewStatus = async (id: string, status: string) => {
    setUpdating(id);
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await fetchData();
    setUpdating(null);
  };

  const stats = data ? [
    {
      label: "Total Bookings",
      value: data.bookings.length,
      sub: `${data.bookings.filter(b => b.status === "pending").length} pending`,
      color: "#C9A84C",
    },
    {
      label: "New Messages",
      value: data.contacts.filter(c => c.status === "new").length,
      sub: `${data.contacts.length} total`,
      color: "#C9A84C",
    },
    {
      label: "Bridal Inquiries",
      value: data.bridal.length,
      sub: `${data.bridal.filter(b => b.status === "new").length} new`,
      color: "#C9A84C",
    },
    {
      label: "Pending Reviews",
      value: data.reviews.filter(r => r.status === "pending").length,
      sub: `${data.reviews.filter(r => r.status === "approved").length} approved`,
      color: "#C9A84C",
    },
  ] : [];

  return (
    <div className="min-h-screen" style={{ background: "#F8F6F2" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ background: "rgba(26,22,18,0.97)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-white font-light text-lg">Roopé Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/50 hover:text-white text-sm transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading && !data ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3" style={{ color: "#C9A84C" }} />
              <p className="text-stone-500 text-sm">Loading your dashboard...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl p-5"
                  style={{ background: "white", boxShadow: "0 1px 12px rgba(26,22,18,0.06)" }}
                >
                  <p className="text-3xl font-display font-light" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                  <p className="font-semibold text-sm mt-1" style={{ color: "#1A1612" }}>{stat.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#8B7D6B" }}>{stat.sub}</p>
                </motion.div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 overflow-x-auto no-scrollbar">
              {TABS.map(tab => {
                const Icon = tab.icon;
                const count = data
                  ? tab.id === "bookings" ? data.bookings.length
                  : tab.id === "contacts" ? data.contacts.length
                  : tab.id === "bridal" ? data.bridal.length
                  : tab.id === "events" ? data.events.length
                  : data.reviews.length
                  : 0;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setExpandedRow(null); }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200"
                    style={{
                      background: activeTab === tab.id ? "#1A1612" : "white",
                      color: activeTab === tab.id ? "white" : "#6B5E52",
                      boxShadow: activeTab === tab.id ? "none" : "0 1px 8px rgba(26,22,18,0.06)",
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    <span
                      className="px-1.5 py-0.5 rounded-full text-xs"
                      style={{
                        background: activeTab === tab.id ? "rgba(255,255,255,0.15)" : "rgba(201,168,76,0.15)",
                        color: activeTab === tab.id ? "white" : "#C9A84C",
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Table */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "white", boxShadow: "0 1px 12px rgba(26,22,18,0.06)" }}>

              {/* ── Bookings ── */}
              {activeTab === "bookings" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: "#F8F6F2", borderBottom: "1px solid #F0EBE0" }}>
                        {["Customer", "Service", "Date & Time", "City", "Total", "Status", "Actions"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#8B7D6B" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data?.bookings.map((b, i) => (
                        <>
                          <tr
                            key={b.id}
                            className="cursor-pointer hover:bg-stone-50 transition-colors"
                            style={{ borderBottom: "1px solid #F0EBE0" }}
                            onClick={() => setExpandedRow(expandedRow === b.id ? null : b.id)}
                          >
                            <td className="px-4 py-3">
                              <p className="font-medium" style={{ color: "#1A1612" }}>{b.name}</p>
                              <p className="text-xs" style={{ color: "#8B7D6B" }}>{b.phone}</p>
                            </td>
                            <td className="px-4 py-3" style={{ color: "#1A1612" }}>{b.service_name}</td>
                            <td className="px-4 py-3" style={{ color: "#6B5E52" }}>
                              {b.date} <span className="text-xs">{b.time}</span>
                            </td>
                            <td className="px-4 py-3" style={{ color: "#6B5E52" }}>{b.city}</td>
                            <td className="px-4 py-3 font-semibold" style={{ color: "#C9A84C" }}>{formatINR(b.total_amount)}</td>
                            <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                            <td className="px-4 py-3">
                              <ChevronDown className={`w-4 h-4 transition-transform ${expandedRow === b.id ? "rotate-180" : ""}`} style={{ color: "#8B7D6B" }} />
                            </td>
                          </tr>
                          {expandedRow === b.id && (
                            <tr key={`${b.id}-expanded`} style={{ background: "#FAF6EC", borderBottom: "1px solid #F0EBE0" }}>
                              <td colSpan={7} className="px-4 py-4">
                                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#8B7D6B" }}>Customer Details</p>
                                    <p style={{ color: "#1A1612" }}>{b.name}</p>
                                    <p className="text-sm" style={{ color: "#6B5E52" }}>{b.email}</p>
                                    <p className="text-sm" style={{ color: "#6B5E52" }}>{b.phone}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#8B7D6B" }}>Booking Details</p>
                                    <p className="text-sm" style={{ color: "#1A1612" }}>Occasion: {b.occasion}</p>
                                    <p className="text-sm" style={{ color: "#6B5E52" }}>Artist Tier: {b.artist_tier}</p>
                                    {b.extras?.length > 0 && <p className="text-sm" style={{ color: "#6B5E52" }}>Extras: {b.extras.join(", ")}</p>}
                                    <p className="text-sm mt-1" style={{ color: "#6B5E52" }}>Address: {b.address}</p>
                                  </div>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                  {b.status !== "confirmed" && (
                                    <button
                                      onClick={() => updateBookingStatus(b.id, "confirmed")}
                                      disabled={updating === b.id}
                                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                                      style={{ background: "#22c55e", color: "white" }}
                                    >
                                      <CheckCircle className="w-3.5 h-3.5" />
                                      {updating === b.id ? "Updating..." : "Confirm"}
                                    </button>
                                  )}
                                  {b.status !== "cancelled" && (
                                    <button
                                      onClick={() => updateBookingStatus(b.id, "cancelled")}
                                      disabled={updating === b.id}
                                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                                      style={{ background: "#ef4444", color: "white" }}
                                    >
                                      <XCircle className="w-3.5 h-3.5" />
                                      Cancel
                                    </button>
                                  )}
                                  {b.status !== "pending" && (
                                    <button
                                      onClick={() => updateBookingStatus(b.id, "pending")}
                                      disabled={updating === b.id}
                                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                                      style={{ background: "#C9A84C", color: "white" }}
                                    >
                                      <Clock className="w-3.5 h-3.5" />
                                      Mark Pending
                                    </button>
                                  )}
                                  <a
                                    href={`mailto:${b.email}`}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                                    style={{ background: "#F8F6F2", color: "#1A1612", border: "1px solid #E8E0D4" }}
                                  >
                                    Email Customer
                                  </a>
                                  <a
                                    href={`https://wa.me/${b.phone.replace(/\D/g, "")}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                                    style={{ background: "#25D366", color: "white" }}
                                  >
                                    WhatsApp
                                  </a>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                      {data?.bookings.length === 0 && (
                        <tr><td colSpan={7} className="px-4 py-12 text-center text-sm" style={{ color: "#8B7D6B" }}>No bookings yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ── Messages ── */}
              {activeTab === "contacts" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: "#F8F6F2", borderBottom: "1px solid #F0EBE0" }}>
                        {["From", "Subject", "Date", "Status", "Action"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#8B7D6B" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data?.contacts.map(c => (
                        <>
                          <tr
                            key={c.id}
                            className="cursor-pointer hover:bg-stone-50 transition-colors"
                            style={{ borderBottom: "1px solid #F0EBE0" }}
                            onClick={() => setExpandedRow(expandedRow === c.id ? null : c.id)}
                          >
                            <td className="px-4 py-3">
                              <p className="font-medium" style={{ color: "#1A1612" }}>{c.name}</p>
                              <p className="text-xs" style={{ color: "#8B7D6B" }}>{c.email}</p>
                            </td>
                            <td className="px-4 py-3" style={{ color: "#1A1612" }}>{c.subject}</td>
                            <td className="px-4 py-3 text-xs" style={{ color: "#8B7D6B" }}>{formatDate(c.created_at)}</td>
                            <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                            <td className="px-4 py-3">
                              <ChevronDown className={`w-4 h-4 transition-transform ${expandedRow === c.id ? "rotate-180" : ""}`} style={{ color: "#8B7D6B" }} />
                            </td>
                          </tr>
                          {expandedRow === c.id && (
                            <tr key={`${c.id}-expanded`} style={{ background: "#FAF6EC", borderBottom: "1px solid #F0EBE0" }}>
                              <td colSpan={5} className="px-4 py-4">
                                <p className="text-sm mb-3" style={{ color: "#1A1612", lineHeight: 1.7 }}>{c.message}</p>
                                <a
                                  href={`mailto:${c.email}?subject=Re: ${c.subject}`}
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
                                  style={{ background: "#1A1612", color: "white" }}
                                >
                                  Reply via Email
                                </a>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                      {data?.contacts.length === 0 && (
                        <tr><td colSpan={5} className="px-4 py-12 text-center text-sm" style={{ color: "#8B7D6B" }}>No messages yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ── Bridal ── */}
              {activeTab === "bridal" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: "#F8F6F2", borderBottom: "1px solid #F0EBE0" }}>
                        {["Bride", "Package", "Wedding Date", "City", "Status", "Action"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#8B7D6B" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data?.bridal.map(b => (
                        <>
                          <tr
                            key={b.id}
                            className="cursor-pointer hover:bg-stone-50 transition-colors"
                            style={{ borderBottom: "1px solid #F0EBE0" }}
                            onClick={() => setExpandedRow(expandedRow === b.id ? null : b.id)}
                          >
                            <td className="px-4 py-3">
                              <p className="font-medium" style={{ color: "#1A1612" }}>{b.name}</p>
                              <p className="text-xs" style={{ color: "#8B7D6B" }}>{b.phone}</p>
                            </td>
                            <td className="px-4 py-3" style={{ color: "#C9A84C", fontWeight: 500 }}>{b.package_name}</td>
                            <td className="px-4 py-3" style={{ color: "#6B5E52" }}>{b.wedding_date || "—"}</td>
                            <td className="px-4 py-3" style={{ color: "#6B5E52" }}>{b.city}</td>
                            <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                            <td className="px-4 py-3">
                              <ChevronDown className={`w-4 h-4 transition-transform ${expandedRow === b.id ? "rotate-180" : ""}`} style={{ color: "#8B7D6B" }} />
                            </td>
                          </tr>
                          {expandedRow === b.id && (
                            <tr key={`${b.id}-expanded`} style={{ background: "#FAF6EC", borderBottom: "1px solid #F0EBE0" }}>
                              <td colSpan={6} className="px-4 py-4">
                                {b.message && <p className="text-sm mb-3" style={{ color: "#1A1612" }}>{b.message}</p>}
                                <div className="flex gap-2">
                                  <a href={`mailto:${b.email}`} className="px-4 py-2 rounded-xl text-sm font-medium" style={{ background: "#1A1612", color: "white" }}>Email</a>
                                  <a href={`https://wa.me/${b.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl text-sm font-medium" style={{ background: "#25D366", color: "white" }}>WhatsApp</a>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                      {data?.bridal.length === 0 && (
                        <tr><td colSpan={6} className="px-4 py-12 text-center text-sm" style={{ color: "#8B7D6B" }}>No bridal inquiries yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ── Events ── */}
              {activeTab === "events" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: "#F8F6F2", borderBottom: "1px solid #F0EBE0" }}>
                        {["Name", "Package", "Group Size", "Event Date", "City", "Action"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#8B7D6B" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data?.events.map(e => (
                        <>
                          <tr
                            key={e.id}
                            className="cursor-pointer hover:bg-stone-50 transition-colors"
                            style={{ borderBottom: "1px solid #F0EBE0" }}
                            onClick={() => setExpandedRow(expandedRow === e.id ? null : e.id)}
                          >
                            <td className="px-4 py-3">
                              <p className="font-medium" style={{ color: "#1A1612" }}>{e.name}</p>
                              <p className="text-xs" style={{ color: "#8B7D6B" }}>{e.phone}</p>
                            </td>
                            <td className="px-4 py-3" style={{ color: "#C9A84C", fontWeight: 500 }}>{e.package_name}</td>
                            <td className="px-4 py-3" style={{ color: "#1A1612" }}>{e.group_size} people</td>
                            <td className="px-4 py-3" style={{ color: "#6B5E52" }}>{e.event_date || "—"}</td>
                            <td className="px-4 py-3" style={{ color: "#6B5E52" }}>{e.city}</td>
                            <td className="px-4 py-3">
                              <ChevronDown className={`w-4 h-4 transition-transform ${expandedRow === e.id ? "rotate-180" : ""}`} style={{ color: "#8B7D6B" }} />
                            </td>
                          </tr>
                          {expandedRow === e.id && (
                            <tr key={`${e.id}-expanded`} style={{ background: "#FAF6EC", borderBottom: "1px solid #F0EBE0" }}>
                              <td colSpan={6} className="px-4 py-4">
                                {e.add_ons?.length > 0 && <p className="text-sm mb-2" style={{ color: "#6B5E52" }}>Add-ons: {e.add_ons.join(", ")}</p>}
                                {e.message && <p className="text-sm mb-3" style={{ color: "#1A1612" }}>{e.message}</p>}
                                <div className="flex gap-2">
                                  <a href={`mailto:${e.email}`} className="px-4 py-2 rounded-xl text-sm font-medium" style={{ background: "#1A1612", color: "white" }}>Email</a>
                                  <a href={`https://wa.me/${e.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl text-sm font-medium" style={{ background: "#25D366", color: "white" }}>WhatsApp</a>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                      {data?.events.length === 0 && (
                        <tr><td colSpan={6} className="px-4 py-12 text-center text-sm" style={{ color: "#8B7D6B" }}>No event inquiries yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ── Reviews ── */}
              {activeTab === "reviews" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: "#F8F6F2", borderBottom: "1px solid #F0EBE0" }}>
                        {["Reviewer", "Service", "Rating", "Review", "Status", "Actions"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#8B7D6B" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data?.reviews.map(r => (
                        <tr key={r.id} style={{ borderBottom: "1px solid #F0EBE0" }}>
                          <td className="px-4 py-3">
                            <p className="font-medium" style={{ color: "#1A1612" }}>{r.name}</p>
                            <p className="text-xs" style={{ color: "#8B7D6B" }}>{r.location}</p>
                          </td>
                          <td className="px-4 py-3 text-xs" style={{ color: "#6B5E52" }}>{r.service}</td>
                          <td className="px-4 py-3">
                            <span style={{ color: "#C9A84C" }}>{"★".repeat(r.rating)}</span>
                            <span style={{ color: "#F0EBE0" }}>{"★".repeat(5 - r.rating)}</span>
                          </td>
                          <td className="px-4 py-3 max-w-xs">
                            <p className="text-xs line-clamp-2" style={{ color: "#6B5E52" }}>{r.review_text}</p>
                          </td>
                          <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              {r.status !== "approved" && (
                                <button
                                  onClick={() => updateReviewStatus(r.id, "approved")}
                                  disabled={updating === r.id}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium"
                                  style={{ background: "#22c55e", color: "white" }}
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  Approve
                                </button>
                              )}
                              {r.status !== "rejected" && (
                                <button
                                  onClick={() => updateReviewStatus(r.id, "rejected")}
                                  disabled={updating === r.id}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium"
                                  style={{ background: "#ef4444", color: "white" }}
                                >
                                  <XCircle className="w-3 h-3" />
                                  Reject
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {data?.reviews.length === 0 && (
                        <tr><td colSpan={6} className="px-4 py-12 text-center text-sm" style={{ color: "#8B7D6B" }}>No reviews submitted yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
