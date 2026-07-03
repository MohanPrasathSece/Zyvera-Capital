import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import gsap from "gsap";
import { validatePhoneNumber, formatFullPhoneNumber, getCountry } from "../utils/phoneValidation";
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

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("CH");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [alreadyExists, setAlreadyExists] = useState(false);

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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (overlayRef.current && modalRef.current) {
        gsap.killTweensOf([overlayRef.current, modalRef.current]);
        gsap.set(overlayRef.current, { opacity: 0 });
        gsap.set(modalRef.current, { scale: 0.92, opacity: 0, y: 20 });
        gsap.to(overlayRef.current, { opacity: 1, duration: 0.28, ease: "power2.out" });
        gsap.to(modalRef.current, { scale: 1, opacity: 1, y: 0, duration: 0.38, delay: 0.04, ease: "back.out(1.4)" });
      }
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const handleClose = () => {
    if (overlayRef.current && modalRef.current) {
      gsap.to(modalRef.current, { scale: 0.94, opacity: 0, y: 10, duration: 0.2, ease: "power2.in" });
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.22, delay: 0.04, ease: "power2.in", onComplete: onClose });
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  // ── Validators ──────────────────────────────────────────────────────────────
  const validateEmail = (val: string) => {
    if (!val?.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) return "Invalid email address";
    return undefined;
  };

  const validateName = (val: string) => {
    if (!val?.trim()) return "Full name is required";
    if (val.trim().length < 2) return "At least 2 characters";
    return undefined;
  };

  const validatePhone = (val: string, country?: string) =>
    validatePhoneNumber(val, country ?? selectedCountry);

  // ── Submit handlers ──────────────────────────────────────────────────────────
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const emailErr = validateEmail(email);
    if (emailErr) { setValidationErrors({ email: emailErr }); return; }
    setLoading(true);
    const res = await login(email);
    setLoading(false);
    if (res.success) {
      setSuccess("Welcome back!");
      setTimeout(() => { handleClose(); if (onSuccess) onSuccess(); }, 800);
    } else {
      setError(res.error || "Login failed. Please try again.");
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const phoneErr = validatePhone(phone, selectedCountry);
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
      setTimeout(() => { handleClose(); if (onSuccess) onSuccess(); }, 1100);
    } else if (res.code === "ALREADY_EXISTS") {
      setAlreadyExists(true);
    } else {
      setError(res.error || "Signup failed. Please try again.");
    }
  };

  // ── Style helpers ────────────────────────────────────────────────────────────
  const input = (err?: string) =>
    `w-full rounded-lg bg-white/5 border ${
      err ? "border-red-400/60" : "border-white/10"
    } px-3 py-2 text-sm text-white outline-none focus:border-[#00C6FF] transition placeholder:text-white/25`;

  const label = "mb-0.5 block text-[10px] uppercase tracking-widest text-white/40 font-medium";

  const errText = (msg?: string) =>
    msg ? <p className="text-[10px] text-red-400 mt-0.5 leading-tight">{msg}</p> : null;

  return (
    /* ── Backdrop ── */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-[#03040A]/88 backdrop-blur-lg"
        onClick={handleClose}
      />

      {/* ── Modal card — centered on every screen size ── */}
      <div
        ref={modalRef}
        className="
          glass-strong noise relative z-10
          w-full max-w-[340px] sm:max-w-[420px]
          rounded-2xl sm:rounded-3xl
          border border-white/10
          shadow-[0_0_60px_rgba(0,198,255,0.18)]
          overflow-hidden
        "
        style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      >
        {/* Close btn */}
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-20 h-7 w-7 flex items-center justify-center rounded-full bg-white/6 hover:bg-white/12 text-white/40 hover:text-white transition text-xs font-bold"
        >
          ✕
        </button>

        {/* Scrollable body */}
        <div className="max-h-[88vh] overflow-y-auto px-5 py-6 sm:px-7 sm:py-8">

          {view === "login" ? (
            /* ════════════════ LOGIN ════════════════ */
            <div>
              <h3 className="font-display text-lg sm:text-2xl font-bold text-white mb-0.5">Sign In</h3>
              <p className="text-xs sm:text-sm text-white/45 mb-4">Enter your email to access your account.</p>

              <form onSubmit={handleLoginSubmit} className="space-y-2.5 sm:space-y-3">
                <div>
                  <label className={label}>Email address</label>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setValidationErrors((p) => ({ ...p, email: validateEmail(e.target.value) }));
                    }}
                    placeholder="you@domain.com"
                    className={input(validationErrors.email)}
                  />
                  {errText(validationErrors.email)}
                </div>

                {error && (
                  <div className="rounded-lg border border-red-400/20 bg-red-400/8 px-3 py-2 text-xs text-red-300 leading-relaxed">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="rounded-lg border border-[#14F195]/20 bg-[#14F195]/8 px-3 py-2 text-xs text-[#14F195] leading-relaxed">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="shine-btn w-full rounded-full bg-gradient-brand px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-[#03040A] shadow-[0_0_16px_rgba(0,198,255,0.28)] disabled:opacity-50 transition mt-1"
                >
                  {loading ? "Signing in…" : "Continue →"}
                </button>

                <p className="text-center text-[11px] sm:text-xs text-white/35 pt-0.5">
                  No account?{" "}
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
            /* ════════════════ SIGNUP ════════════════ */
            <div>
              <h3 className="font-display text-lg sm:text-2xl font-bold text-white mb-0.5">Create Account</h3>
              <p className="text-xs sm:text-sm text-white/45 mb-4">Join Zyvora Finance and start your journey.</p>

              <form onSubmit={handleSignupSubmit} className="space-y-2.5 sm:space-y-3">

                {/* Full Name */}
                <div>
                  <label className={label}>Full Name</label>
                  <input
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setValidationErrors((p) => ({ ...p, name: validateName(e.target.value) }));
                    }}
                    placeholder="John Doe"
                    className={input(validationErrors.name)}
                  />
                  {errText(validationErrors.name)}
                </div>

                {/* Email */}
                <div>
                  <label className={label}>Email Address</label>
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
                    className={input(validationErrors.email)}
                  />
                  {errText(validationErrors.email)}
                </div>

                {/* Phone */}
                <div>
                  <label className={label}>Phone Number</label>
                  <div className="flex gap-1.5 items-stretch">
                    <div className="flex-shrink-0">
                      <CountrySelect
                        value={selectedCountry}
                        onChange={(c) => {
                          setSelectedCountry(c);
                          setValidationErrors((p) => ({
                            ...p,
                            phone: phone ? validatePhoneNumber(phone, c) : undefined,
                          }));
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <input
                        type="tel"
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          setValidationErrors((p) => ({ ...p, phone: validatePhone(e.target.value, selectedCountry) }));
                        }}
                        placeholder={getCountry(selectedCountry).placeholder}
                        className={input(validationErrors.phone)}
                      />
                    </div>
                  </div>
                  {errText(validationErrors.phone)}
                </div>

                {/* Already-exists banner */}
                {alreadyExists && (
                  <div className="rounded-lg border border-amber-400/30 bg-amber-400/8 p-3 text-xs leading-relaxed">
                    <p className="font-semibold text-amber-300 mb-0.5">⚠️ Account already exists</p>
                    <p className="text-amber-200/75 break-all mb-1.5">
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
                      className="inline-flex items-center gap-1 rounded-md bg-amber-400/18 hover:bg-amber-400/28 border border-amber-400/28 px-2.5 py-1 text-[10px] font-bold text-amber-300 transition"
                    >
                      → Sign In instead
                    </button>
                  </div>
                )}

                {error && (
                  <div className="rounded-lg border border-red-400/20 bg-red-400/8 px-3 py-2 text-xs text-red-300 leading-relaxed">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="rounded-lg border border-[#14F195]/20 bg-[#14F195]/8 px-3 py-2 text-xs text-[#14F195] leading-relaxed">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="shine-btn w-full rounded-full bg-gradient-brand px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-[#03040A] shadow-[0_0_16px_rgba(0,198,255,0.28)] disabled:opacity-50 transition mt-1"
                >
                  {loading ? "Creating…" : "Create Account →"}
                </button>

                <p className="text-center text-[11px] sm:text-xs text-white/35 pt-0.5">
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
