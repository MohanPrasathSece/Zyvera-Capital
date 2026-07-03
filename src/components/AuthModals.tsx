import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import gsap from "gsap";
import { COUNTRIES, formatFullPhoneNumber, getCountry } from "../utils/phoneValidation";
import { CountrySelect } from "./CountrySelect";

interface AuthModalsProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: "login" | "signup";
  onSuccess?: () => void;
}

export const AuthModals: React.FC<AuthModalsProps> = ({
  isOpen,
  onClose,
  initialView = "login",
  onSuccess,
}) => {
  const [view, setView] = useState<"login" | "signup">(initialView);
  const { login, signup } = useAuth();

  // Form states
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("CH");

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [alreadyExists, setAlreadyExists] = useState(false);

  // Validation states
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});

  const modalRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setView(initialView);
    setError(null);
    setSuccess(null);
    setAlreadyExists(false);
    setEmail("");
    setName("");
    setPhone("");
    setSelectedCountry("CH");
    setValidationErrors({});
  }, [initialView, isOpen]);

  // Modal animation
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (overlayRef.current && modalRef.current) {
        gsap.killTweensOf([overlayRef.current, modalRef.current]);
        gsap.set(overlayRef.current, { opacity: 0 });
        gsap.set(modalRef.current, { scale: 0.93, opacity: 0, y: 24 });
        gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: "power2.out" });
        gsap.to(modalRef.current, { scale: 1, opacity: 1, y: 0, duration: 0.4, delay: 0.04, ease: "back.out(1.5)" });
      }
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const handleClose = () => {
    if (overlayRef.current && modalRef.current) {
      gsap.to(modalRef.current, { scale: 0.95, opacity: 0, y: 15, duration: 0.22, ease: "power2.in" });
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.22, delay: 0.04, ease: "power2.in", onComplete: onClose });
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Validators
  const validateEmail = (val: string) => {
    if (!val || !val.trim()) return "Email address is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) return "Please enter a valid email address";
    return undefined;
  };

  const validateName = (val: string) => {
    if (!val || !val.trim()) return "Full name is required";
    if (val.trim().length < 2) return "Name must be at least 2 characters";
    return undefined;
  };

  const validatePhone = (val: string) => {
    if (!val || !val.trim()) return "Phone number is required";
    const digits = val.replace(/\D/g, "");
    if (digits.length < 5) return "Please enter a valid phone number";
    return undefined;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const emailErr = validateEmail(email);
    if (emailErr) { setValidationErrors({ email: emailErr }); return; }
    setLoading(true);
    const res = await login(email);
    setLoading(false);
    if (res.success) {
      setSuccess("Welcome back! Redirecting...");
      setTimeout(() => { handleClose(); if (onSuccess) onSuccess(); }, 900);
    } else {
      setError(res.error || "Login failed. Please try again.");
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const phoneErr = validatePhone(phone);
    if (nameErr || emailErr || phoneErr) {
      setValidationErrors({ name: nameErr, email: emailErr, phone: phoneErr });
      return;
    }
    setLoading(true);
    setAlreadyExists(false);
    const fullPhone = formatFullPhoneNumber(phone, selectedCountry);
    const res = await signup(name, email, fullPhone, selectedCountry);
    setLoading(false);
    if (res.success) {
      setSuccess("Account created! Welcome to Zyvora.");
      setTimeout(() => { handleClose(); if (onSuccess) onSuccess(); }, 1200);
    } else if (res.code === "ALREADY_EXISTS") {
      setAlreadyExists(true);
    } else {
      setError(res.error || "Signup failed. Please try again.");
    }
  };

  const inputClass = (err?: string) =>
    `w-full rounded-xl bg-white/5 border ${err ? "border-red-400/60" : "border-white/10"} px-3 py-2.5 sm:px-4 sm:py-3 outline-none focus:border-[#00C6FF] transition text-white text-sm sm:text-base placeholder:text-white/30`;

  const labelClass = "mb-1 block text-[10px] sm:text-xs uppercase tracking-widest text-white/50 font-medium";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-[#03040A]/85 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Modal — slides up from bottom on mobile, centered on desktop */}
      <div
        ref={modalRef}
        className="glass-strong noise relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-white/10 shadow-[0_0_80px_rgba(0,198,255,0.2)] overflow-hidden"
        style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      >
        {/* Drag handle (mobile only) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-white/20" />
        </div>

        {/* Scrollable content area */}
        <div className="max-h-[90vh] overflow-y-auto px-5 pb-8 pt-4 sm:px-8 sm:pb-8 sm:pt-6">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 sm:right-6 sm:top-5 z-10 h-8 w-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition text-base font-bold"
          >
            ✕
          </button>

          {view === "login" ? (
            /* ── LOGIN VIEW ── */
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-1">Sign In</h3>
              <p className="text-sm text-white/50 mb-5">Enter your email to access your Zyvora account.</p>

              <form onSubmit={handleLoginSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className={labelClass}>Email address</label>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setValidationErrors((p) => ({ ...p, email: validateEmail(e.target.value) }));
                    }}
                    placeholder="you@domain.com"
                    className={inputClass(validationErrors.email)}
                  />
                  {validationErrors.email && <p className="text-xs text-red-400 mt-1">{validationErrors.email}</p>}
                </div>

                {error && (
                  <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-xs sm:text-sm text-red-300 leading-relaxed">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="rounded-xl border border-[#14F195]/20 bg-[#14F195]/10 px-3 py-2.5 text-xs sm:text-sm text-[#14F195] leading-relaxed">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="shine-btn w-full rounded-full bg-gradient-brand px-6 py-3 sm:py-3.5 text-sm font-semibold text-[#03040A] shadow-[0_0_20px_rgba(0,198,255,0.3)] disabled:opacity-50 transition"
                >
                  {loading ? "Signing in..." : "Continue →"}
                </button>

                <p className="text-center text-xs sm:text-sm text-white/40">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => { setView("signup"); setError(null); setValidationErrors({}); }}
                    className="text-gradient font-bold hover:underline"
                  >
                    Sign Up
                  </button>
                </p>
              </form>
            </div>
          ) : (
            /* ── SIGNUP VIEW ── */
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-1">Create Account</h3>
              <p className="text-sm text-white/50 mb-5">Join Zyvora Finance and start your journey.</p>

              <form onSubmit={handleSignupSubmit} className="space-y-3 sm:space-y-4">
                {/* Full Name */}
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setValidationErrors((p) => ({ ...p, name: validateName(e.target.value) }));
                    }}
                    placeholder="John Doe"
                    className={inputClass(validationErrors.name)}
                  />
                  {validationErrors.name && <p className="text-xs text-red-400 mt-1">{validationErrors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setAlreadyExists(false);
                      setValidationErrors((p) => ({ ...p, email: validateEmail(e.target.value) }));
                    }}
                    placeholder="you@domain.com"
                    className={inputClass(validationErrors.email)}
                  />
                  {validationErrors.email && <p className="text-xs text-red-400 mt-1">{validationErrors.email}</p>}
                </div>

                {/* Phone + Country */}
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <div className="flex gap-2 items-start">
                    {/* Country Selector — compact on mobile */}
                    <div className="flex-shrink-0">
                      <CountrySelect
                        value={selectedCountry}
                        onChange={(c) => {
                          setSelectedCountry(c);
                          setValidationErrors((p) => ({ ...p, phone: phone ? validatePhone(phone) : undefined }));
                        }}
                      />
                    </div>
                    {/* Number input */}
                    <div className="flex-1 min-w-0">
                      <input
                        type="tel"
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          setValidationErrors((p) => ({ ...p, phone: validatePhone(e.target.value) }));
                        }}
                        placeholder={getCountry(selectedCountry).placeholder}
                        className={inputClass(validationErrors.phone)}
                      />
                    </div>
                  </div>
                  {validationErrors.phone && <p className="text-xs text-red-400 mt-1">{validationErrors.phone}</p>}
                </div>

                {/* Already-exists banner */}
                {alreadyExists && (
                  <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 sm:p-4 text-xs sm:text-sm leading-relaxed">
                    <p className="font-semibold text-amber-300 mb-1">⚠️ Account already exists</p>
                    <p className="text-amber-200/80 break-all">
                      <span className="font-mono text-amber-300">{email}</span> is already registered.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setAlreadyExists(false);
                        setError(null);
                        setValidationErrors({});
                        setView("login");
                      }}
                      className="mt-2 inline-flex items-center gap-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/30 px-3 py-1.5 text-xs font-bold text-amber-300 transition"
                    >
                      → Sign In instead
                    </button>
                  </div>
                )}

                {error && (
                  <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-xs sm:text-sm text-red-300 leading-relaxed">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="rounded-xl border border-[#14F195]/20 bg-[#14F195]/10 px-3 py-2.5 text-xs sm:text-sm text-[#14F195] leading-relaxed">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="shine-btn w-full rounded-full bg-gradient-brand px-6 py-3 sm:py-3.5 text-sm font-semibold text-[#03040A] shadow-[0_0_20px_rgba(0,198,255,0.3)] disabled:opacity-50 transition"
                >
                  {loading ? "Creating account..." : "Create Account →"}
                </button>

                <p className="text-center text-xs sm:text-sm text-white/40">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => { setView("login"); setError(null); setValidationErrors({}); }}
                    className="text-gradient font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
