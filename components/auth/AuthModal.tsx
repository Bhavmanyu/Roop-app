"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Phone, Eye, EyeOff, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup" | "email_otp" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Email OTP States
  const [otpVerifyMode, setOtpVerifyMode] = useState<"input" | "verify">("input");
  const [otpCode, setOtpCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Handle Google / Facebook SSO OAuth
  const handleOAuth = async (provider: "google" | "facebook") => {
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/book`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || `Failed to log in with ${provider}`);
      setLoading(false);
    }
  };

  // Standard Email/Password Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      onClose();
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  // Standard Email/Password Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setError("Please fill in Name, Email, and Password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone: phone,
          },
        },
      });
      if (error) throw error;
      setSuccessMsg("Account created! Please check your email for the confirmation link.");
      setEmail("");
      setPassword("");
      setName("");
      setPhone("");
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  // Send Email OTP
  const handleSendEmailOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true, // Auto-signs up new user!
        }
      });
      if (error) throw error;
      
      setOtpVerifyMode("verify");
      setSuccessMsg("Verification OTP code sent successfully to your email address.");
    } catch (err: any) {
      setError(err.message || "Failed to dispatch verification code.");
    } finally {
      setLoading(false);
    }
  };

  // Verify Email OTP
  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setError("Please enter the 6-digit OTP code.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otpCode,
        type: "email",
      });
      if (error) throw error;
      onClose();
    } catch (err: any) {
      setError(err.message || "Invalid or expired OTP code.");
    } finally {
      setLoading(false);
    }
  };

  // Reset Password for Email Account
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSuccessMsg("Password reset link sent! Check your inbox.");
    } catch (err: any) {
      setError(err.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  const resetOtpStates = () => {
    setOtpVerifyMode("input");
    setOtpCode("");
    setSuccessMsg("");
    setError("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 pointer-events-auto"
          />

          {/* Modal Card */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#FAF9F6] border border-pearl-200 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 pointer-events-auto flex flex-col relative"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full border border-pearl-200 flex items-center justify-center text-stone-warm hover:text-roope-primary hover:border-stone-warm/30 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Logo & Subtitle */}
              <div className="text-center mb-6">
                <span className="font-display text-2xl font-light text-roope-primary tracking-widest block uppercase">
                  Roopé
                </span>
                <p className="text-[10px] text-stone-warm/60 uppercase tracking-widest mt-1 flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-gold" /> Luxury Beauty Platform
                </p>
              </div>

              {/* Success Screen */}
              {successMsg && mode !== "email_otp" ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-12 h-12 text-[#B8922E] mx-auto mb-4" />
                  <h3 className="font-display text-lg font-light text-roope-primary mb-2">Check Your Email</h3>
                  <p className="text-xs text-stone-warm/80 leading-relaxed mb-6">{successMsg}</p>
                  <button
                    onClick={() => {
                      setSuccessMsg("");
                      setMode("signin");
                    }}
                    className="btn-primary w-full py-3 px-6 text-xs uppercase tracking-widest justify-center shadow-md animate-pulse"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <>
                  {/* Mode Toggles */}
                  {mode !== "forgot" && (
                    <div className="flex border-b border-pearl-200 mb-6 bg-pearl-200/20 p-1.5 rounded-full gap-1">
                      <button
                        onClick={() => { setMode("signin"); setError(""); setSuccessMsg(""); }}
                        className={`flex-1 py-2 text-center text-[10px] font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                          mode === "signin" 
                            ? "bg-white text-roope-primary shadow-sm" 
                            : "text-stone-warm/70 hover:text-roope-primary"
                        }`}
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => { setMode("signup"); setError(""); setSuccessMsg(""); }}
                        className={`flex-1 py-2 text-center text-[10px] font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                          mode === "signup" 
                            ? "bg-white text-roope-primary shadow-sm" 
                            : "text-stone-warm/70 hover:text-roope-primary"
                        }`}
                      >
                        Sign Up
                      </button>
                      <button
                        onClick={() => { setMode("email_otp"); setError(""); resetOtpStates(); }}
                        className={`flex-1 py-2 text-center text-[10px] font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                          mode === "email_otp" 
                            ? "bg-white text-roope-primary shadow-sm" 
                            : "text-stone-warm/70 hover:text-roope-primary"
                        }`}
                      >
                        Email OTP
                      </button>
                    </div>
                  )}

                  {/* ─── EMAIL / PASSWORD SIGN IN FORM ─── */}
                  {mode === "signin" && (
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-warm/40" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full bg-white rounded-2xl border border-pearl-200 pl-10 pr-4 py-3 text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest">Password</label>
                          <button
                            type="button"
                            onClick={() => { setMode("forgot"); setError(""); }}
                            className="text-[10px] text-gold hover:underline font-semibold tracking-wide uppercase cursor-pointer"
                          >
                            Forgot?
                          </button>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-warm/40" />
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••"
                            className="w-full bg-white rounded-2xl border border-pearl-200 pl-10 pr-10 py-3 text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-warm/40 hover:text-roope-primary transition-colors cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {error && (
                        <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl flex gap-2 items-center text-red-600 text-xs">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-3.5 px-6 text-xs uppercase tracking-widest justify-center shadow-md disabled:opacity-50"
                      >
                        {loading ? "Verifying..." : "Sign In"}
                      </button>
                    </form>
                  )}

                  {/* ─── EMAIL / PASSWORD SIGN UP FORM ─── */}
                  {mode === "signup" && (
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-warm/40" />
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your full name"
                            className="w-full bg-white rounded-2xl border border-pearl-200 pl-10 pr-4 py-3 text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-warm/40" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full bg-white rounded-2xl border border-pearl-200 pl-10 pr-4 py-3 text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1">Phone Number (Optional)</label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-warm/40" />
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full bg-white rounded-2xl border border-pearl-200 pl-10 pr-4 py-3 text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-warm/40" />
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••"
                            className="w-full bg-white rounded-2xl border border-pearl-200 pl-10 pr-10 py-3 text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-warm/40 hover:text-roope-primary transition-colors cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {error && (
                        <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl flex gap-2 items-center text-red-600 text-xs">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-3.5 px-6 text-xs uppercase tracking-widest justify-center shadow-md disabled:opacity-50"
                      >
                        {loading ? "Creating..." : "Create Account"}
                      </button>
                    </form>
                  )}

                  {/* ─── EMAIL OTP LOGIN FORM ─── */}
                  {mode === "email_otp" && (
                    <div className="space-y-4">
                      {otpVerifyMode === "input" ? (
                        /* Step 1: Input Email */
                        <form onSubmit={handleSendEmailOtp} className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1">Email Address</label>
                            <div className="relative">
                              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-warm/40" />
                              <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full bg-white rounded-2xl border border-pearl-200 pl-10 pr-4 py-3 text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT transition-colors"
                              />
                            </div>
                            <p className="text-[9px] text-stone-warm/40 mt-1 leading-normal">
                              We will send you a 6-digit OTP verification code to verify your email address.
                            </p>
                          </div>

                          {error && (
                            <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl flex gap-2 items-center text-red-600 text-xs">
                              <AlertCircle className="w-4 h-4 flex-shrink-0" />
                              <span>{error}</span>
                            </div>
                          )}

                          <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3.5 px-6 text-xs uppercase tracking-widest justify-center shadow-md disabled:opacity-50"
                          >
                            {loading ? "Sending..." : "Send OTP"}
                          </button>
                        </form>
                      ) : (
                        /* Step 2: Verify OTP Code */
                        <form onSubmit={handleVerifyEmailOtp} className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest">Verification Code</label>
                              <div className="flex gap-2.5 items-center">
                                <button
                                  type="button"
                                  disabled={loading}
                                  onClick={() => handleSendEmailOtp()}
                                  className="text-[10px] text-gold hover:underline font-semibold tracking-wide uppercase cursor-pointer disabled:opacity-50"
                                >
                                  {loading ? "Resending..." : "Resend OTP"}
                                </button>
                                <span className="text-[10px] text-stone-warm/30 select-none">|</span>
                                <button
                                  type="button"
                                  onClick={resetOtpStates}
                                  className="text-[10px] text-gold hover:underline font-semibold tracking-wide uppercase cursor-pointer"
                                >
                                  Change Email
                                </button>
                              </div>
                            </div>
                            <div className="relative">
                              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-warm/40" />
                              <input
                                type="text"
                                required
                                maxLength={6}
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                                placeholder="Enter 6-digit OTP"
                                className="w-full bg-white rounded-2xl border border-pearl-200 pl-10 pr-4 py-3 text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT transition-colors tracking-[0.4em] font-mono text-center font-bold"
                              />
                            </div>
                            {successMsg && (
                              <p className="text-[9px] text-[#B8922E] mt-1 leading-normal font-semibold">
                                {successMsg}
                              </p>
                            )}
                          </div>

                          {error && (
                            <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl flex gap-2 items-center text-red-600 text-xs">
                              <AlertCircle className="w-4 h-4 flex-shrink-0" />
                              <span>{error}</span>
                            </div>
                          )}

                          <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3.5 px-6 text-xs uppercase tracking-widest justify-center shadow-md disabled:opacity-50"
                          >
                            {loading ? "Verifying..." : "Verify & Log In"}
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  {/* ─── FORGOT PASSWORD FORM ─── */}
                  {mode === "forgot" && (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-warm/50 uppercase tracking-widest mb-1">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-warm/40" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full bg-white rounded-2xl border border-pearl-200 pl-10 pr-4 py-3 text-xs text-roope-primary outline-none focus:border-champagne-DEFAULT transition-colors"
                          />
                        </div>
                      </div>

                      {error && (
                        <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl flex gap-2 items-center text-red-600 text-xs">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-3.5 px-6 text-xs uppercase tracking-widest justify-center shadow-md disabled:opacity-50"
                      >
                        {loading ? "Sending..." : "Send Reset Link"}
                      </button>

                      <button
                        type="button"
                        onClick={() => { setMode("signin"); setError(""); }}
                        className="text-stone-warm/60 hover:text-roope-primary text-[10px] font-bold uppercase tracking-wider w-full text-center mt-4 block cursor-pointer"
                      >
                        Back to Login
                      </button>
                    </form>
                  )}

                  {/* Divider */}
                  <div className="relative my-6 text-center">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-pearl-200" /></div>
                    <span className="relative bg-[#FAF9F6] px-4 text-[9px] font-bold text-stone-warm/50 uppercase tracking-widest select-none">
                      Or login using
                    </span>
                  </div>

                  {/* Social SSO Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Google (Gmail) Button */}
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => handleOAuth("google")}
                      className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-pearl-200 hover:border-champagne-300 bg-white text-xs font-semibold text-roope-primary transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" width="24" height="24">
                        <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.555 0-6.437-2.882-6.437-6.437 0-3.555 2.882-6.437 6.437-6.437 1.543 0 2.955.545 4.062 1.458l3.028-3.028C19.26 2.378 15.932 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.48 0 10.748-4.526 10.748-10.954 0-.64-.057-1.25-.164-1.841h-10.58z"/>
                      </svg>
                      <span>Google</span>
                    </button>

                    {/* Facebook Button */}
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => handleOAuth("facebook")}
                      className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-pearl-200 hover:border-champagne-300 bg-white text-xs font-semibold text-roope-primary transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" width="24" height="24">
                        <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span>Facebook</span>
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
