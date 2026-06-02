"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star, Shield, Users, Clock, Award } from "lucide-react";

export default function CareersPage() {
  const benefits = [
    {
      icon: <Award className="w-5 h-5 text-gold" />,
      title: "Industry-Leading Compensation",
      desc: "Earn up to 70% of service revenues plus 100% of client tips, paid weekly."
    },
    {
      icon: <Clock className="w-5 h-5 text-gold" />,
      title: "Flexible Hours",
      desc: "Set your own schedule. Work full-time or pick part-time slots that match your life."
    },
    {
      icon: <Shield className="w-5 h-5 text-gold" />,
      title: "Full Premium Kits",
      desc: "Roopé provides all international products (MAC, Charlotte Tilbury, etc.) and sanitized single-use kits."
    },
    {
      icon: <Users className="w-5 h-5 text-gold" />,
      title: "Elite Clientele",
      desc: "Serve Indore's most premium residential areas and high-profile clients."
    }
  ];

  const jobs = [
    {
      title: "Senior Bridal Makeup Artist",
      type: "Full-Time / Freelance",
      exp: "5+ Years Experience",
      skills: ["Airbrush", "HD Makeup", "Draping"]
    },
    {
      title: "Luxury Spa & Massage Therapist",
      type: "Full-Time",
      exp: "3+ Years Experience",
      skills: ["Swedish Massage", "Deep Tissue", "Aromatherapy"]
    },
    {
      title: "Doorstep Hair & Styling Specialist",
      type: "Freelance / Part-Time",
      exp: "4+ Years Experience",
      skills: ["Trendy Haircuts", "Blowdry", "Keratin"]
    },
    {
      title: "Advanced Nail Art Technician",
      type: "Part-Time",
      exp: "2+ Years Experience",
      skills: ["Nail Extensions", "Gel Polish", "Candle Manicures"]
    }
  ];

  return (
    <>
      {/* Hero Header */}
      <section className="pt-28 pb-16 px-6" style={{ background: "linear-gradient(160deg, #F8F6F2 0%, #FAF6EC 100%)" }}>
        <div className="max-w-7xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-label mb-3"
          >
            Careers
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="section-title mx-auto max-w-2xl mb-4 font-display text-4xl md:text-5xl font-light text-roope-primary"
          >
            Shape the future of <span className="italic text-gradient-gold">doorstep luxury.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="section-subtitle max-w-lg mx-auto text-stone-warm/80 text-sm mt-3"
          >
            Join Indore&apos;s most exclusive network of luxury beauty and wellness professionals. Elevate your craft, work on your terms, and earn what you deserve.
          </motion.p>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-light text-roope-primary">
              Why professional artists <span className="italic text-gradient-gold">choose Roopé.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-luxury p-6 bg-[#FAF9F6] border border-pearl-200"
              >
                <div className="w-10 h-10 rounded-xl bg-champagne-300/20 flex items-center justify-center mb-4">
                  {b.icon}
                </div>
                <h3 className="text-sm font-bold text-roope-primary mb-2">{b.title}</h3>
                <p className="text-xs text-stone-warm/75 leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="py-20 px-6 bg-[#FAF9F6]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-light text-roope-primary">
              Open <span className="italic text-gradient-gold">Opportunities</span>
            </h2>
            <p className="text-stone-warm text-xs mt-2">Indore, India (Home Services Network)</p>
          </div>

          <div className="space-y-4">
            {jobs.map((job, i) => (
              <motion.div
                key={job.title}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl p-6 border border-pearl-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-champagne-DEFAULT transition-all"
              >
                <div>
                  <h3 className="font-display text-lg font-light text-roope-primary">{job.title}</h3>
                  <div className="flex flex-wrap gap-2.5 mt-2">
                    <span className="text-[10px] font-bold text-stone-warm/50 uppercase bg-pearl-100 px-2 py-0.5 rounded">
                      {job.type}
                    </span>
                    <span className="text-[10px] font-bold text-stone-warm/50 uppercase bg-pearl-100 px-2 py-0.5 rounded">
                      {job.exp}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {job.skills.map(s => (
                      <span key={s} className="text-[9px] font-semibold text-[#B8922E] bg-champagne-300/10 px-2 py-0.5 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  href="/register/professional"
                  className="btn-primary py-3 px-5 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 self-start md:self-auto"
                >
                  Apply Now <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Onboarding banner */}
      <section className="py-16 px-6 text-center bg-white border-t border-pearl-200">
        <p className="section-label mb-3">Partner Onboarding</p>
        <h2 className="font-display text-3xl font-light text-roope-primary mb-3 max-w-md mx-auto">
          Own a salon or studio? <span className="italic text-gradient-gold">Join as a partner.</span>
        </h2>
        <p className="text-stone-warm text-xs max-w-sm mx-auto mb-6 leading-relaxed">
          List your stylists, manage home bookings in Indore, and grow your revenues under the Roopé brand standard.
        </p>
        <Link href="/register/salon" className="btn-secondary px-8 py-3 text-xs inline-flex items-center gap-2 font-bold uppercase tracking-wider">
          Register Salon <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>
    </>
  );
}
