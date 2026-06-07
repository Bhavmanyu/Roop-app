import Link from "next/link";
import { Globe, Share2, MessageCircle, ArrowUpRight, Heart } from "lucide-react";

const footerLinks = {
  services: [
    { label: "Bridal Makeup", href: "/bridal" },
    { label: "Event Styling", href: "/events" },
    { label: "Party Glam", href: "/services" },
    { label: "HD Makeup", href: "/services" },
    { label: "Mehendi", href: "/services" },
    { label: "Haldi Styling", href: "/services" },
  ],
  company: [
    { label: "Gallery", href: "/gallery" },
    { label: "Reviews", href: "/reviews" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
  ],
  support: [
    { label: "Book a Service", href: "/book" },
    { label: "Contact Us", href: "/contact" },
    { label: "FAQ", href: "/contact#faq" },
    { label: "Cancellation Policy", href: "/cancellation-policy" },
  ],
};

const socialLinks = [
  { Icon: Globe, href: "#", label: "Website" },
  { Icon: Share2, href: "#", label: "Share" },
  { Icon: MessageCircle, href: "#", label: "WhatsApp" },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#1A1612] dark:bg-[#0C0A09] overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(201,168,76,0.08) 0%, transparent 70%)" }} />

      {/* ─── MOBILE FOOTER LAYOUT (App Style) ─── */}
      <div className="md:hidden px-4 py-8 space-y-8 max-w-lg mx-auto">
        {/* Brand row: Logo + Socials + City Side-by-side */}
        <div className="flex items-center justify-between border-b border-white/8 pb-4">
          <Link href="/">
            <span className="font-display text-xl font-bold tracking-wide text-white">
              Roopé
            </span>
          </Link>
          
          <div className="flex items-center gap-2">
            {socialLinks.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10"
              >
                <Icon className="w-3.5 h-3.5 text-white/50" />
              </a>
            ))}
          </div>

          <span className="px-2.5 py-0.5 rounded-full text-[10.5px] text-white/40 bg-white/5 border border-white/10">
            Indore
          </span>
        </div>

        {/* Compact Categories of Links Side-by-side horizontally */}
        <div className="space-y-3">
          {(["services", "company", "support"] as const).map((key) => (
            <div key={key} className="flex flex-wrap items-baseline gap-2">
              <h3 className="text-[10.5px] font-extrabold tracking-[0.12em] uppercase text-white/45 min-w-[65px] flex-shrink-0">
                {key}:
              </h3>
              <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11.5px] text-white/55">
                {footerLinks[key].map((link, idx) => (
                  <span key={link.label} className="flex items-center gap-2">
                    <Link href={link.href} className="hover:text-white transition-colors">
                      {link.label}
                    </Link>
                    {idx < footerLinks[key].length - 1 && <span className="text-white/15">•</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Bar: Copyright & Legal Side-by-side */}
        <div className="border-t border-white/8 pt-6 space-y-2.5 text-[10.5px] text-white/30">
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            <Link href="/privacy" className="hover:text-white/50">Privacy</Link>
            <Link href="/terms" className="hover:text-white/50">Terms</Link>
            <Link href="/cookies" className="hover:text-white/50">Cookies</Link>
            <Link href="/admin" className="text-champagne-DEFAULT hover:underline font-bold">Admin</Link>
          </div>
          <p>© 2025 Roopé Beauty Technologies Pvt. Ltd. Made with <Heart className="w-2.5 h-2.5 inline text-champagne-DEFAULT fill-current" /> in India.</p>
        </div>
      </div>

      {/* ─── DESKTOP FOOTER LAYOUT (Unchanged) ─── */}
      <div className="hidden md:block">
        {/* Top CTA band */}
        <div className="border-b border-white/8">
          <div className="max-w-7xl mx-auto px-6 py-10 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="section-label text-champagne-DEFAULT mb-3">Ready to begin?</p>
              <h2 className="font-display text-xl md:text-4xl font-light text-white leading-tight">
                Your most beautiful day<br />starts with Roopé.
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/book" className="btn-primary px-5 py-3 text-xs md:px-8 md:py-4 md:text-sm">
                Book a Session
              </Link>
            </div>
          </div>
        </div>

        {/* Main footer grid */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
            {/* Brand col */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center mb-6">
                <span className="font-display text-2xl font-bold tracking-wide text-white hover:text-champagne-DEFAULT transition-colors duration-300">
                  Roopé
                </span>
              </Link>
              <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
                India's most trusted luxury beauty-tech platform. Professional artists, transparent pricing, extraordinary results.
              </p>
              <div className="flex items-center gap-2 mb-8">
                {socialLinks.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <Icon className="w-4 h-4 text-white/60" />
                  </a>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {["Indore"].map((city) => (
                  <span key={city} className="px-3 py-1 rounded-full text-xs text-white/40"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {city}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            {(["services", "company", "support"] as const).map((key) => (
              <div key={key}>
                <h3 className="text-xs font-medium tracking-[0.12em] uppercase text-white/30 mb-5">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </h3>
                <ul className="space-y-3">
                  {footerLinks[key].map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group flex items-center gap-1 text-sm text-white/50 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0 group-hover:opacity-100 group-hover:-translate-y-1 group-hover:translate-x-0.5 transition-all duration-200" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs flex items-center gap-1.5">
              © 2025 Roopé Beauty Technologies Pvt. Ltd. Made with{" "}
              <Heart className="w-3 h-3 text-champagne-DEFAULT fill-current" /> in India.
            </p>
            <div className="flex items-center gap-6 flex-wrap">
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Cookie Policy", href: "/cookies" },
              ].map((item) => (
                <Link key={item.label} href={item.href} className="text-white/30 text-xs hover:text-white/60 transition-colors duration-200">
                  {item.label}
                </Link>
              ))}
              <Link href="/admin" className="text-champagne-DEFAULT text-xs font-medium hover:text-white transition-all duration-300 border border-champagne-DEFAULT/20 hover:border-champagne-DEFAULT px-3 py-1.5 rounded-xl bg-champagne-DEFAULT/5">
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
