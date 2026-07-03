import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import gsap from "gsap";
import { Logo } from "@/components/Logo";
import {
  TrendingUp,
  LogOut,
  Sparkles,
  Zap,
  Activity,
  ArrowUpRight,
  Shield,
  Layers,
  Cpu,
  Mail,
  Phone,
  User,
  MessageSquare
} from "lucide-react";

/* ---------------- REUSABLE SCROLL REVEAL WRAPPER ---------------- */
function ScrollSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !visible) {
          setVisible(true);
          gsap.fromTo(
            el,
            { y: 30, opacity: 0, filter: "blur(6px)" },
            { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.0, ease: "power3.out" }
          );
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div ref={ref} className={`opacity-0 ${className}`}>
      {children}
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    // Fade in dashboard initial container
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 }
      );
    }
  }, []);

  if (!user) return null;

  return (
    <div ref={containerRef} className="relative min-h-screen bg-background text-foreground overflow-x-hidden pt-24 pb-20">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,198,255,0.08),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(20,241,149,0.08),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-30" />

      {/* Nav Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4">
        <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between rounded-full glass px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs rounded-full glass px-3 py-1 text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-[#14F195]" />
              {user.email}
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white bg-white/5 border border-white/10 rounded-full px-4 py-2 transition cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-5xl px-6 space-y-32">
        {/* 1. HERO GREETING SECTION */}
        <ScrollSection className="text-center mt-10">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-xs text-white/70">
            <Sparkles className="h-3.5 w-3.5 text-[#00C6FF]" /> Premium Command Center
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
            Welcome back, <span className="text-gradient">{user.name}</span>
          </h1>
          <p className="mt-4 text-white/60 max-w-xl mx-auto">
            Your wealth command center is fully active. Deploy automated bots, audit algorithmic transactions, and lock in high-yield strategies to multiply your crypto income.
          </p>
        </ScrollSection>

        {/* 2. HOW WE GROW YOUR CAPITAL */}
        <ScrollSection>
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 text-left space-y-6">
              <div className="inline-flex rounded-full glass px-3 py-1 text-xs text-[#00C6FF]">
                01 · Smart Staking
              </div>
              <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight text-white">
                How We <span className="text-gradient">Grow Your Capital</span>
              </h2>
              <p className="text-white/60 leading-relaxed">
                We believe in simple, transparent wealth generation. Instead of speculative trading, Zyvora Finance allocates your assets into verified node networks and liquidity pools that generate consistent returns.
              </p>
              <div className="space-y-4">
                {[
                  {
                    t: "Automated Compounding",
                    d: "Earnings are automatically reinvested daily to maximize compound interest."
                  },
                  {
                    t: "Constant Optimization",
                    d: "Funds are dynamically routed 24/7 to the safest high-yield options."
                  },
                  {
                    t: "Zero Leverage Speculation",
                    d: "We do not trade directional assets; your returns come from liquidity premiums."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00C6FF]/10 text-[#00C6FF] font-bold text-[10px]">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">{item.t}</h4>
                      <p className="text-white/60 leading-relaxed mt-1">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 w-full">
              <CapitalAllocationEngine />
            </div>
          </div>
        </ScrollSection>

        {/* 3. WHY YOUR MONEY IS SAFE */}
        <ScrollSection>
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex rounded-full glass px-3 py-1 text-xs text-[#14F195]">
              02 · Risk Management
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight text-white">
              Why Your <span className="text-gradient">Money is Safe</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Our absolute priority is the defense of your capital. We implement multiple automated and architectural layers to neutralize volatility.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                t: "Multi-Signature Vaults",
                desc: "We route all deposits through multi-party computation (MPC) cold custody vaults. No single key or individual can access or withdraw your funds.",
                icon: <Shield className="h-6 w-6 text-[#14F195]" />,
                badge: "Architectural Safeguard"
              },
              {
                t: "Automated Loss Caps",
                desc: "If system parameters trigger unexpected market adjustments, automated stop-locks instantly convert assets back to secured stablecoins.",
                icon: <Cpu className="h-6 w-6 text-[#00C6FF]" />,
                badge: "Algorithmic Protection"
              },
              {
                t: "Delta-Neutral Strategies",
                desc: "By maintaining balanced directional exposure, your yield is generated from trading volumes rather than the volatile prices of crypto tokens.",
                icon: <Layers className="h-6 w-6 text-[#6A5CFF]" />,
                badge: "Hedging Model"
              }
            ].map((prod, i) => (
              <div key={i} className="glass-strong gradient-border rounded-3xl p-6 text-left flex flex-col justify-between h-full space-y-6 group hover:translate-y-[-4px] transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                      {prod.icon}
                    </div>
                    <span className="text-[11px] uppercase font-bold text-white/50 px-2.5 py-1 rounded-full bg-white/5 border border-white/5">
                      {prod.badge}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-white group-hover:text-[#00C6FF] transition-colors">{prod.t}</h3>
                  <p className="text-sm text-white/60 leading-relaxed mt-2">{prod.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollSection>

        {/* 4. CONTACT / ENQUIRY FORM SECTION */}
        <ScrollSection className="max-w-3xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex rounded-full glass px-3 py-1 text-xs text-[#6A5CFF]">
              03 · Request Custom Access
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight text-white">
              Consultation <span className="text-gradient">Desk</span>
            </h2>
            <p className="text-white/60 max-w-lg mx-auto">
              Want a customized grid setup or specialized yield lock-ins? Submit your goals and our desk will respond in 24 hours.
            </p>
          </div>

          <ContactEnquiryLoggedIn
            initialName={user.name}
            initialEmail={user.email}
            initialPhone={user.phone}
          />
        </ScrollSection>
      </div>

      {/* Footer */}
      <footer className="relative mt-32 border-t border-white/5 py-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-6" glow={false} />
            <span className="font-bold text-white">Zyvora Finance</span>
            <span className="text-xs text-white/40 ml-2">
              &copy; 2026 &middot; The Future of Digital Wealth
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/60">
            <Link to="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------------- CAPITAL ALLOCATION ENGINE ---------------- */
function CapitalAllocationEngine() {
  const [activeNode, setActiveNode] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode((prev) => (prev === null ? 0 : (prev + 1) % 3));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-strong gradient-border rounded-3xl p-6 md:p-8 space-y-6 text-left relative overflow-hidden h-[420px] flex flex-col justify-between">
      {/* Background radial soft lights */}
      <div className="absolute top-0 right-0 h-48 w-48 bg-[#00C6FF]/10 blur-3xl rounded-full animate-pulse-glow pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-48 w-48 bg-[#14F195]/5 blur-3xl rounded-full animate-pulse-glow pointer-events-none" />

      {/* Header Info */}
      <div className="flex justify-between items-start z-10">
        <div>
          <h3 className="font-display text-xl font-bold text-white tracking-tight">Yield Router Engine</h3>
          <p className="text-sm text-white/50 mt-1">
            Real-time automated capital allocation routing.
          </p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-[#14F195] font-bold">
          <span className="h-2 w-2 rounded-full bg-[#14F195] animate-ping" />
          ACTIVE
        </span>
      </div>

      {/* Visual Canvas/SVG Animation Area */}
      <div className="relative flex-1 w-full my-4 flex items-center justify-center">
        {/* Core Engine Node */}
        <div 
          className="absolute z-20 h-20 w-20 rounded-full bg-background border-2 border-white/10 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(0,198,255,0.2)] hover:scale-105 transition-all duration-300 group"
          style={{ left: "calc(50% - 40px)", top: "calc(50% - 40px)" }}
        >
          <div className="absolute inset-0 rounded-full border border-dashed border-[#00C6FF]/40 animate-spin-slow" />
          <div className="absolute -inset-1.5 rounded-full border border-dashed border-[#14F195]/30 animate-spin-slower" />
          <Logo className="h-8 w-8 animate-pulse-glow" />
          <span className="text-[8px] uppercase tracking-widest text-[#00C6FF] font-bold mt-1">ZYVORA</span>
        </div>

        {/* Satellite Node: Staking Pool (Top-Left) */}
        <div 
          className={`absolute left-2 top-2 z-10 glass rounded-2xl p-3 border transition-all duration-500 animate-float ${
            activeNode === 0 ? "border-[#00C6FF] bg-[#00C6FF]/5 shadow-[0_0_20px_rgba(0,198,255,0.15)]" : "border-white/10"
          }`}
          style={{ width: "130px" }}
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-white/50">Staking Pool</span>
            <span className="text-[9px] text-[#00C6FF] font-bold">14.2%</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-1.5">
            <div className="h-full bg-[#00C6FF] transition-all duration-1000" style={{ width: activeNode === 0 ? "80%" : "30%" }} />
          </div>
        </div>

        {/* Satellite Node: Liquidity Yield (Bottom-Right) */}
        <div 
          className={`absolute right-2 bottom-2 z-10 glass rounded-2xl p-3 border transition-all duration-500 animate-float-tilt ${
            activeNode === 1 ? "border-[#14F195] bg-[#14F195]/5 shadow-[0_0_20px_rgba(20,241,149,0.15)]" : "border-white/10"
          }`}
          style={{ width: "130px", animationDelay: "1s" }}
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-white/50">Liquidity LPs</span>
            <span className="text-[9px] text-[#14F195] font-bold">24.8%</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-1.5">
            <div className="h-full bg-[#14F195] transition-all duration-1000" style={{ width: activeNode === 1 ? "95%" : "40%" }} />
          </div>
        </div>

        {/* Satellite Node: Arbitrage Vault (Bottom-Left) */}
        <div 
          className={`absolute left-2 bottom-2 z-10 glass rounded-2xl p-3 border transition-all duration-500 animate-float ${
            activeNode === 2 ? "border-[#6A5CFF] bg-[#6A5CFF]/5 shadow-[0_0_20px_rgba(106,92,255,0.15)]" : "border-white/10"
          }`}
          style={{ width: "130px", animationDelay: "2s" }}
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-white/50">Arbitrage Vault</span>
            <span className="text-[9px] text-[#6A5CFF] font-bold">28.5%</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-1.5">
            <div className="h-full bg-[#6A5CFF] transition-all duration-1000" style={{ width: activeNode === 2 ? "90%" : "25%" }} />
          </div>
        </div>

        {/* Dynamic status/metrics panel (Top-Right) */}
        <div className="absolute right-2 top-2 z-10 glass rounded-2xl p-3 border border-white/10 text-right animate-float-tilt" style={{ width: "130px", animationDelay: "0.5s" }}>
          <span className="text-[9px] uppercase tracking-widest text-white/40 block">Est. Yield Lock</span>
          <span className="text-lg font-black text-gradient block mt-0.5">22.4% APY</span>
        </div>

        {/* Connection flow lines inside SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 300" fill="none">
          <defs>
            <linearGradient id="flow-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00C6FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00C6FF" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="flow-mint" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#14F195" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#14F195" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="flow-violet" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6A5CFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6A5CFF" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {/* Paths connecting nodes to center (200, 150) */}
          <path d="M75 55 L200 150" stroke="url(#flow-cyan)" strokeWidth="1.5" strokeDasharray="6 6" className="animate-flow-dash" />
          <path d="M325 240 L200 150" stroke="url(#flow-mint)" strokeWidth="1.5" strokeDasharray="6 6" className="animate-flow-dash" />
          <path d="M75 240 L200 150" stroke="url(#flow-violet)" strokeWidth="1.5" strokeDasharray="6 6" className="animate-flow-dash" />
        </svg>
      </div>

      {/* Footer Metrics */}
      <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-4 text-center z-10">
        <div>
          <span className="text-[10px] text-white/40 uppercase block">Daily Harvest</span>
          <span className="text-sm font-bold text-white mt-0.5 block">$3,812.44</span>
        </div>
        <div>
          <span className="text-[10px] text-white/40 uppercase block">Total Placed</span>
          <span className="text-sm font-bold text-[#00C6FF] mt-0.5 block">100% Safe</span>
        </div>
        <div>
          <span className="text-[10px] text-white/40 uppercase block">Smart Contracts</span>
          <span className="text-sm font-bold text-[#14F195] mt-0.5 block">Verified</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- DYNAMIC MINI CHART ---------------- */
function DynamicMiniChart() {
  const [points, setPoints] = useState([30, 35, 32, 40, 38, 45, 42, 50, 48, 55, 52, 60, 58, 65, 62, 70]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPoints((prev) => {
        const nextPoint = Math.max(10, Math.min(90, prev[prev.length - 1] + (Math.random() * 12 - 5)));
        return [...prev.slice(1), nextPoint];
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const w = 140, h = 30;
  const max = 100;
  const step = w / (points.length - 1);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step},${h - (p / max) * h}`)
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-8 w-28 overflow-visible">
      <defs>
        <linearGradient id="chart-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#00C6FF" />
          <stop offset="50%" stopColor="#6A5CFF" />
          <stop offset="100%" stopColor="#14F195" />
        </linearGradient>
      </defs>
      <path
        d={path}
        fill="none"
        stroke="url(#chart-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Pulse dot at the end */}
      <circle
        cx={w}
        cy={h - (points[points.length - 1] / max) * h}
        r="2.5"
        fill="#14F195"
        className="animate-ping"
      />
      <circle
        cx={w}
        cy={h - (points[points.length - 1] / max) * h}
        r="1.5"
        fill="#14F195"
      />
    </svg>
  );
}

/* ---------------- LIVE YIELD LEDGER & ARBITRAGE FEED ---------------- */
function LiveYieldLedger() {
  const [balance, setBalance] = useState(1482.41098);
  const [events, setEvents] = useState([
    { id: 1, type: "arbitrage", label: "SOL/USDC Arbitrage capture on Orca", value: "+$84.12", time: "Just now" },
    { id: 2, type: "staking", label: "Auto-compounded Aave ETH lending yield", value: "+0.0042 ETH", time: "1m ago" },
    { id: 3, type: "mint", label: "Liquidity premium swap pool yield harvested", value: "+$12.09", time: "3m ago" },
  ]);

  // Live balance ticking
  useEffect(() => {
    const interval = setInterval(() => {
      setBalance((prev) => prev + (Math.random() * 0.00035 + 0.00005));
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // Live ledger events rolling
  useEffect(() => {
    const eventPool = [
      { type: "arbitrage", label: "BTC/USDT triangular trade arbitrage captured", value: "+$144.50" },
      { type: "staking", label: "Liquid restaking rewards compounded (Eigen)", value: "+0.0091 ETH" },
      { type: "mint", label: "Lido staked ETH rewards auto-reinvested", value: "+0.0035 stETH" },
      { type: "arbitrage", label: "SOL/ETH spread arbitrage locked on Jupiter", value: "+$42.80" },
      { type: "staking", label: "Rocket Pool node yield harvested", value: "+0.0019 rETH" },
      { type: "mint", label: "Stablecoin pool rebalancing rewards unlocked", value: "+$8.44" },
    ];

    const interval = setInterval(() => {
      const randomEvent = eventPool[Math.floor(Math.random() * eventPool.length)];
      setEvents((prev) => {
        const nextId = prev[0].id + 1;
        const newEvent = { ...randomEvent, id: nextId, time: "Just now" };
        const updatedPrev = prev.map((e, idx) => ({
          ...e,
          time: idx === 0 ? "1m ago" : `${idx + 1}m ago`,
        }));
        return [newEvent, ...updatedPrev.slice(0, 2)];
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-strong noise rounded-3xl p-6 border border-white/10 relative overflow-hidden h-[300px] flex flex-col justify-between text-left">
      {/* Glow Effect */}
      <div className="absolute -top-12 -right-12 h-32 w-32 bg-[#14F195]/10 blur-2xl rounded-full animate-pulse-glow pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center z-10 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[#14F195] animate-pulse" />
          <span className="text-xs uppercase font-bold tracking-wider text-white/50">Algorithmic Yield Stream</span>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#14F195]/10 px-2 py-0.5 text-[9px] font-bold text-[#14F195]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#14F195] animate-ping" />
          LIVE LEDGER
        </div>
      </div>

      {/* Main Stats / Ticker */}
      <div className="my-3 z-10 flex justify-between items-end">
        <div>
          <span className="text-[10px] uppercase font-bold text-white/40 block">Accrued Profit (Real-Time)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-gradient tabular-nums">
              ${balance.toLocaleString(undefined, { minimumFractionDigits: 5, maximumFractionDigits: 5 })}
            </span>
            <span className="text-[10px] text-[#14F195] font-bold animate-pulse">+0.02%/min</span>
          </div>
        </div>
        <div>
          <DynamicMiniChart />
        </div>
      </div>

      {/* Live Event Stream Feed */}
      <div className="flex-1 space-y-2 z-10 overflow-hidden relative mt-2">
        {events.map((e) => (
          <div
            key={e.id}
            className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 border border-white/5 hover:bg-white/10 transition-colors animate-fade-in"
          >
            <div className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${e.type === "arbitrage" ? "bg-[#00C6FF]" : e.type === "staking" ? "bg-[#6A5CFF]" : "bg-[#14F195]"}`} />
              <div className="text-left">
                <div className="text-[11px] font-semibold text-white/80 line-clamp-1">{e.label}</div>
                <div className="text-[8px] text-white/30">{e.time}</div>
              </div>
            </div>
            <div className="text-[11px] font-black text-[#14F195] text-right shrink-0 ml-2">
              {e.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- LOGGED-IN PAGE CONTACT FORM ---------------- */
function ContactEnquiryLoggedIn({
  initialName,
  initialEmail,
  initialPhone,
}: {
  initialName: string;
  initialEmail: string;
  initialPhone: string;
}) {
  const [form, setForm] = useState({
    name: initialName,
    email: initialEmail,
    phone: initialPhone,
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const validatePhone = (val: string) => {
    const cleanPhone = val.replace(/\s+/g, "");
    if (!cleanPhone) return "Please enter a phone number";
    const phoneRegex = /^(\+41|0041|41|0)?[1-9]\d{8}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return "Please enter a valid phone number (e.g. 0791234567)";
    }
    return undefined;
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    const nameErr = validateName(form.name);
    const emailErr = validateEmail(form.email);
    const phoneErr = validatePhone(form.phone);

    if (nameErr || emailErr || phoneErr) {
      setValidationErrors({ name: nameErr, email: emailErr, phone: phoneErr });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setStatus({
          type: "success",
          msg: "Thank you! Your enquiry has been received successfully.",
        });
        setForm({ ...form, message: "" });
        setValidationErrors({});
      } else {
        setStatus({
          type: "error",
          msg: data.error || "An error occurred during submission.",
        });
      }
    } catch (err: unknown) {
      setLoading(false);
      setStatus({ type: "error", msg: "Network error. Please try again." });
    }
  };

  return (
    <div className="glass-strong noise rounded-3xl p-8 border border-white/10 relative">
      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="mb-2 block text-sm uppercase tracking-wider text-white/50 font-bold">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  setValidationErrors((prev) => ({ ...prev, name: validateName(e.target.value) }));
                }}
                className={`w-full rounded-xl bg-white/5 border ${validationErrors.name ? "border-destructive" : "border-white/10"} px-4 py-3 outline-none focus:border-[#00C6FF] transition text-white text-base`}
              />
            </div>
            {validationErrors.name && (
              <p className="text-sm text-destructive mt-1.5">{validationErrors.name}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm uppercase tracking-wider text-white/50 font-bold">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  setValidationErrors((prev) => ({ ...prev, email: validateEmail(e.target.value) }));
                }}
                className={`w-full rounded-xl bg-white/5 border ${validationErrors.email ? "border-destructive" : "border-white/10"} px-4 py-3 outline-none focus:border-[#00C6FF] transition text-white text-base`}
              />
            </div>
            {validationErrors.email && (
              <p className="text-sm text-destructive mt-1.5">{validationErrors.email}</p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm uppercase tracking-wider text-white/50 font-bold">
            Phone Number
          </label>
          <div className="relative">
            <input
              type="text"
              value={form.phone}
              onChange={(e) => {
                setForm({ ...form, phone: e.target.value });
                setValidationErrors((prev) => ({ ...prev, phone: validatePhone(e.target.value) }));
              }}
              className={`w-full rounded-xl bg-white/5 border ${validationErrors.phone ? "border-destructive" : "border-white/10"} px-4 py-3 outline-none focus:border-[#00C6FF] transition text-white text-base`}
            />
          </div>
          {validationErrors.phone && (
            <p className="text-sm text-destructive mt-1.5">{validationErrors.phone}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm uppercase tracking-wider text-white/50 font-bold">
            Message (Optional)
          </label>
          <textarea
            rows={4}
            placeholder="Outline your investment goals…"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full resize-none rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-[#00C6FF] transition text-white text-base"
          />
        </div>

        {status && (
          <div
            className={`rounded-xl border p-4 text-sm leading-relaxed ${status.type === "success" ? "border-accent/20 bg-accent/10 text-[#14F195]" : "border-destructive/20 bg-destructive/10 text-destructive"}`}
          >
            {status.msg}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="shine-btn w-full rounded-full bg-gradient-brand px-6 py-4 text-sm font-semibold text-[#03040A] shadow-[0_0_20px_rgba(0,198,255,0.3)] disabled:opacity-50 transition cursor-pointer"
        >
          {loading ? "Submitting enquiry..." : "Submit Enquiry"}
        </button>
      </form>
    </div>
  );
}
