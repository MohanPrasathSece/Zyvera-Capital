import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import gsap from "gsap";

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

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Real-time validation states
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
    setEmail("");
    setName("");
    setPhone("");
    setValidationErrors({});
  }, [initialView, isOpen]);

  // Modal Animation using GSAP
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (overlayRef.current && modalRef.current) {
        gsap.killTweensOf([overlayRef.current, modalRef.current]);

        // Setup initial states
        gsap.set(overlayRef.current, { opacity: 0 });
        gsap.set(modalRef.current, { scale: 0.9, opacity: 0, y: 20 });

        // Animate in
        gsap.to(overlayRef.current, { opacity: 1, duration: 0.35, ease: "power2.out" });
        gsap.to(modalRef.current, {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.45,
          delay: 0.05,
          ease: "back.out(1.5)",
        });
      }
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    if (overlayRef.current && modalRef.current) {
      gsap.to(modalRef.current, {
        scale: 0.95,
        opacity: 0,
        y: 15,
        duration: 0.25,
        ease: "power2.in",
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.25,
        delay: 0.05,
        ease: "power2.in",
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Real-time frontend validations
  const validateEmail = (val: string) => {
    if (!val) return "Please enter an email address";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) return "Please enter a valid email address";
    return undefined;
  };

  const validateName = (val: string) => {
    if (!val.trim()) return "Please enter your full name";
    return undefined;
  };

  const validatePhone = (val: string) => {
    const cleanPhone = val.replace(/\s+/g, "");
    if (!cleanPhone) return "Please enter a phone number";
    const phoneRegex = /^(\+41|0041|41|0)?[1-9]\d{8}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return "Please enter a valid phone number (e.g. 0791234567)";
    }
    return undefined;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    const emailErr = validateEmail(email);
    if (emailErr) {
      setValidationErrors({ email: emailErr });
      return;
    }

    setLoading(true);
    const res = await login(email);
    setLoading(false);

    if (res.success) {
      setSuccess("Login successful!");
      setTimeout(() => {
        handleClose();
        if (onSuccess) onSuccess();
      }, 1000);
    } else {
      setError(res.error || "Login failed");
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate all fields
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const phoneErr = validatePhone(phone);

    if (nameErr || emailErr || phoneErr) {
      setValidationErrors({
        name: nameErr,
        email: emailErr,
        phone: phoneErr,
      });
      return;
    }

    setLoading(true);
    const res = await signup(name, email, phone);
    setLoading(false);

    if (res.success) {
      setSuccess("Registration successful!");
      setTimeout(() => {
        handleClose();
        if (onSuccess) onSuccess();
      }, 1000);
    } else {
      setError(res.error || "Signup failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-[#03040A]/85 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div
        ref={modalRef}
        className="glass-strong noise relative w-full max-w-md rounded-3xl p-8 shadow-[0_0_80px_rgba(0,198,255,0.25)] border border-white/10"
        style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-6 top-6 text-white/50 hover:text-white transition duration-200 text-xl font-bold"
        >
          ✕
        </button>

        {view === "login" ? (
          <div>
            <h3 className="font-display text-2xl font-bold text-white mb-2">
              Sign In
            </h3>
            <p className="text-base text-white/60 mb-6">
              Enter your email address to access your Zyvora Finance space.
            </p>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs uppercase tracking-widest text-white/50">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setValidationErrors((prev) => ({
                      ...prev,
                      email: validateEmail(e.target.value),
                    }));
                  }}
                  placeholder="you@domain.com"
                  className={`w-full rounded-xl bg-white/5 border ${validationErrors.email ? "border-destructive" : "border-white/10"} px-4 py-3 outline-none focus:border-[#00C6FF] transition text-white text-base`}
                />
                {validationErrors.email && (
                  <p className="text-sm text-destructive mt-1">{validationErrors.email}</p>
                )}
              </div>

              {error && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive leading-relaxed">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-xl border border-accent/20 bg-accent/10 p-3 text-sm text-[#14F195] leading-relaxed">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="shine-btn w-full rounded-full bg-gradient-brand px-6 py-3.5 text-sm font-semibold text-[#03040A] shadow-[0_0_20px_rgba(0,198,255,0.3)] disabled:opacity-50 transition"
              >
                {loading ? "Loading..." : "Continue"}
              </button>

              <div className="text-center mt-4 text-sm text-white/40">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setView("signup");
                    setError(null);
                    setValidationErrors({});
                  }}
                  className="text-gradient font-bold hover:underline"
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <h3 className="font-display text-2xl font-bold text-white mb-2">
              Create Account
            </h3>
            <p className="text-base text-white/60 mb-6">
              Create your institutional account and access the platform.
            </p>

            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs uppercase tracking-widest text-white/50">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setValidationErrors((prev) => ({
                      ...prev,
                      name: validateName(e.target.value),
                    }));
                  }}
                  placeholder="John Doe"
                  className={`w-full rounded-xl bg-white/5 border ${validationErrors.name ? "border-destructive" : "border-white/10"} px-4 py-3 outline-none focus:border-[#00C6FF] transition text-white text-base`}
                />
                {validationErrors.name && (
                  <p className="text-sm text-destructive mt-1">{validationErrors.name}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-widest text-white/50">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setValidationErrors((prev) => ({
                      ...prev,
                      email: validateEmail(e.target.value),
                    }));
                  }}
                  placeholder="you@domain.com"
                  className={`w-full rounded-xl bg-white/5 border ${validationErrors.email ? "border-destructive" : "border-white/10"} px-4 py-3 outline-none focus:border-[#00C6FF] transition text-white text-base`}
                />
                {validationErrors.email && (
                  <p className="text-sm text-destructive mt-1">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-widest text-white/50">
                  Phone number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setValidationErrors((prev) => ({
                      ...prev,
                      phone: validatePhone(e.target.value),
                    }));
                  }}
                  placeholder="079 123 45 67"
                  className={`w-full rounded-xl bg-white/5 border ${validationErrors.phone ? "border-destructive" : "border-white/10"} px-4 py-3 outline-none focus:border-[#00C6FF] transition text-white text-base`}
                />
                {validationErrors.phone && (
                  <p className="text-sm text-destructive mt-1">{validationErrors.phone}</p>
                )}
              </div>

              {error && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive leading-relaxed">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-xl border border-accent/20 bg-accent/10 p-3 text-sm text-[#14F195] leading-relaxed">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="shine-btn w-full rounded-full bg-gradient-brand px-6 py-3.5 text-sm font-semibold text-[#03040A] shadow-[0_0_20px_rgba(0,198,255,0.3)] disabled:opacity-50 transition"
              >
                {loading ? "Loading..." : "Sign Up"}
              </button>

              <div className="text-center mt-4 text-sm text-white/40">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setView("login");
                    setError(null);
                    setValidationErrors({});
                  }}
                  className="text-gradient font-bold hover:underline"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
