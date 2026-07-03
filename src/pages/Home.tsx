import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import gsap from "gsap";
import LiquidEther from "@/components/LiquidEther";
import { useAuth } from "../context/AuthContext";
import { AuthModals } from "../components/AuthModals";
import { Logo } from "@/components/Logo";
import Globe from "@/components/ui/globe";
import { COUNTRIES, validatePhoneNumber, formatFullPhoneNumber, getCountry } from "../utils/phoneValidation";
import { CountrySelect } from "@/components/CountrySelect";
import { Coins, ShieldCheck, BrainCircuit } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<"login" | "signup">("login");

  const handleLaunchApp = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      setAuthView("login");
      setAuthModalOpen(true);
    }
  };

  const handleLaunchPortfolio = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      setAuthView("signup");
      setAuthModalOpen(true);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Fixed Background Canvas Animation */}
      <div className="pointer-events-auto fixed inset-0 z-0">
        <LiquidEther
          colors={["#00C6FF", "#6A5CFF", "#14F195"]}
          mouseForce={22}
          cursorSize={120}
          resolution={0.5}
          autoDemo
          autoSpeed={0.55}
          autoIntensity={2.4}
        />
      </div>
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#03040A_85%)]" />
      <div className="pointer-events-none fixed inset-0 z-0 grid-overlay opacity-30" />

      {/* Page Content */}
      <div className="relative z-10">
        <Nav onLaunchApp={handleLaunchApp} isLoggedIn={!!user} />
        <Hero
          onLaunchApp={handleLaunchApp}
          onLaunchPortfolio={handleLaunchPortfolio}
          isLoggedIn={!!user}
        />
        <DashboardShowcase />
        <Services />
        <Experience />
        <ContactHome />
        <Footer />
        <ScrollProgress />
      </div>

      <AuthModals
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialView={authView}
        onSuccess={() => navigate("/dashboard")}
      />
    </div>
  );
}

/* ---------------- NAV ---------------- */
interface NavProps {
  onLaunchApp: () => void;
  isLoggedIn: boolean;
}

function Nav({ onLaunchApp, isLoggedIn }: NavProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-4">
      <div className="mx-auto mt-2 sm:mt-4 flex max-w-7xl items-center justify-between rounded-full glass px-4 sm:px-6 py-2 sm:py-3">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Logo className="h-6 w-6 sm:h-8 sm:w-8" />
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <a href="#services" className="hover:text-white transition">
            Services
          </a>
          <a href="#experience" className="hover:text-white transition">
            Experience
          </a>
          <a href="#contact" className="hover:text-white transition">
            Contact
          </a>
        </nav>
        <div className="hidden lg:flex items-center gap-3 text-xs">
          <Ticker />
        </div>
        <button
          onClick={onLaunchApp}
          className="shine-btn rounded-full bg-gradient-brand px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-[#03040A] cursor-pointer shrink-0"
        >
          {isLoggedIn ? "Open Platform" : "Launch Platform"}
        </button>
      </div>
    </header>
  );
}

function Ticker() {
  const items = [
    { s: "BTC", p: "$71,240", c: "+2.4%", pos: true },
    { s: "ETH", p: "$3,812", c: "+1.9%", pos: true },
    { s: "SOL", p: "$182.10", c: "-0.6%", pos: false },
  ];
  return (
    <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
      {items.map((i) => (
        <div key={i.s} className="flex items-center gap-1.5">
          <span className="font-semibold text-white/90">{i.s}</span>
          <span className="text-white/60">{i.p}</span>
          <span className={i.pos ? "text-[#14F195]" : "text-[#ff6b81]"}>{i.c}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------------- HERO ---------------- */
interface HeroProps {
  onLaunchApp: () => void;
  onLaunchPortfolio: () => void;
  isLoggedIn: boolean;
}

function Hero({ onLaunchApp, onLaunchPortfolio, isLoggedIn }: HeroProps) {
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const gradientTextRef = useRef<HTMLSpanElement | null>(null);
  const subRef = useRef<HTMLParagraphElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const spans = el.querySelectorAll<HTMLElement>("[data-letter]");
    gsap.set(spans, { yPercent: 120, opacity: 0, filter: "blur(20px)" });
    gsap.to(spans, {
      yPercent: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 1.1,
      ease: "power4.out",
      stagger: 0.025,
      delay: 0.2,
    });
    if (gradientTextRef.current) {
      gsap.fromTo(
        gradientTextRef.current,
        { yPercent: 120, opacity: 0, filter: "blur(10px)" },
        { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 1.1, delay: 0.4, ease: "power4.out" }
      );
    }
    if (subRef.current) {
      gsap.fromTo(
        subRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.9, ease: "power3.out" },
      );
    }
  }, []);

  const renderLetters = (text: string) => {
    const spaceIndex = text.indexOf(" ");
    return text.split("").map((ch, i) => {
      const isFirstWord = spaceIndex !== -1 && i < spaceIndex;
      return (
        <span
          key={i}
          data-letter
          className="inline-block will-change-transform py-2 -my-2"
          style={{ 
            whiteSpace: "pre",
            marginRight: isFirstWord ? "0.08em" : undefined
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      );
    });
  };

  return (
    <section ref={heroRef} className="relative min-h-screen w-full overflow-hidden pt-20 flex items-center justify-center">
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 pt-16 pb-24 text-center flex flex-col items-center justify-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold tracking-wider text-white/80 transition-all hover:border-white/20 hover:bg-white/10 max-w-[90%] text-center">
          <span className="h-1.5 w-1.5 rounded-full bg-[#14F195] animate-pulse shrink-0" />
          <span className="truncate">Start Investing. Start Earning. &middot; v4.2 &rsaquo;</span>
        </div>
        
        <h1
          ref={headingRef}
          className="font-display text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.0] text-white max-w-4xl"
        >
          <div className="overflow-hidden py-3 -my-3 px-3">{renderLetters("Zyvora Finance")}</div>
          <div className="overflow-hidden py-3 -my-3 px-3">
            <span ref={gradientTextRef} className="text-gradient inline-block will-change-transform py-2 -my-2 leading-tight">Multiply your yield</span>
          </div>
        </h1>

        <p
          ref={subRef}
          className="mt-6 max-w-xl text-white/70 leading-relaxed mx-auto text-sm sm:text-base md:text-lg"
        >
          Redefining wealth creation. Invest in high-performance digital portfolios, deploy intelligent trading bots, and let our secure algorithms maximize your passive income.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 w-full sm:w-auto px-4">
          <button
            onClick={onLaunchPortfolio}
            className="w-full sm:w-auto text-center shine-btn rounded-full bg-gradient-brand px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-[#03040A] shadow-[0_0_40px_rgba(0,198,255,0.35)] hover:shadow-[0_0_60px_rgba(106,92,255,0.5)] transition-shadow cursor-pointer"
          >
            {isLoggedIn ? "Open Portfolio →" : "Launch Portfolio →"}
          </button>
          <button
            onClick={onLaunchApp}
            className="w-full sm:w-auto text-center glass rounded-full px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-white hover:bg-white/10 transition cursor-pointer"
          >
            ▶ Watch Platform
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------------- DASHBOARD SHOWCASE ---------------- */
function DashboardShowcase() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dashRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !visible) {
          setVisible(true);
          if (dashRef.current) {
            gsap.fromTo(
              dashRef.current,
              { scale: 0.85, opacity: 0, y: 50 },
              { scale: 1, opacity: 1, y: 0, duration: 1.4, ease: "power3.out" }
            );
          }
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [visible]);

  useEffect(() => {
    const container = containerRef.current,
      dash = dashRef.current;
    if (!container || !dash) return;
    const onMove = (e: MouseEvent) => {
      const r = container.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(dash, {
        rotationY: x * 12,
        rotationX: -y * 10,
        x: x * 20,
        y: y * 20,
        duration: 0.6,
        ease: "power2.out",
      });
    };
    const onLeave = () => {
      gsap.to(dash, {
        rotationY: 0,
        rotationX: 0,
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    };
    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);
    return () => {
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,198,255,0.05),transparent_60%)]" />
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-white/70">
          <span className="h-1.5 w-1.5 rounded-full bg-[#14F195] animate-pulse" />
          01 &middot; Command Center
        </div>
        <h2 className="font-display text-3xl md:text-5xl font-bold leading-[1.1] text-white mb-6">
          One system for all <br />
          <span className="text-gradient">digital wealth</span>
        </h2>
        <p className="mx-auto max-w-xl text-base text-white/60 mb-16">
          Track balances, analyze real-time performance, and allocate assets dynamically across major institutional venues.
        </p>
        <div className="flex justify-center" style={{ perspective: 1200 }}>
          <div
            ref={dashRef}
            style={{ transformStyle: "preserve-3d" }}
            className="animate-float-tilt w-full max-w-md"
          >
            <FloatingDashboard />
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatingDashboard() {
  return (
    <div className="glass-strong noise relative overflow-hidden rounded-3xl p-5 shadow-[0_30px_120px_-20px_rgba(0,198,255,0.35)]">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-white/50">Total Balance</div>
          <div className="mt-1 text-3xl font-bold text-white">$4,281,904.22</div>
          <div className="mt-1 text-sm text-[#14F195]">+ $128,401 · +3.09% today</div>
        </div>
        <div className="h-9 w-9 rounded-full bg-gradient-brand shadow-[0_0_25px_rgba(106,92,255,0.6)]" />
      </div>
      <div className="mt-5 h-28 w-full">
        <MiniChart />
      </div>
      <div className="mt-4 space-y-2">
        {[
          { s: "BTC", n: "Bitcoin", p: "$71,240", c: "+2.4%", pos: true, w: "62%" },
          { s: "ETH", n: "Ethereum", p: "$3,812", c: "+1.9%", pos: true, w: "48%" },
          { s: "SOL", n: "Solana", p: "$182.10", c: "-0.6%", pos: false, w: "34%" },
        ].map((c) => (
          <div
            key={c.s}
            className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 border border-white/5"
          >
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-brand text-[10px] font-bold text-[#03040A]">
                {c.s}
              </span>
              <div className="text-left">
                <div className="text-sm font-semibold text-white">{c.n}</div>
                <div className="text-[10px] text-white/50">{c.p}</div>
              </div>
            </div>
            <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-brand" style={{ width: c.w }} />
            </div>
            <div
              className={"text-xs font-semibold " + (c.pos ? "text-[#14F195]" : "text-[#ff6b81]")}
            >
              {c.c}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniChart() {
  const pts = [
    4, 10, 7, 15, 12, 20, 18, 14, 22, 28, 25, 34, 30, 40, 36, 48, 42, 55, 48, 50, 55, 64, 60, 72,
    68, 68, 74, 82, 80, 90,
  ];
  const w = 320,
    h = 100;
  const max = Math.max(...pts);
  const step = w / (pts.length - 1);
  const path = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step},${h - (p / max) * h}`)
    .join(" ");
  const area = `${path} L ${w},${h} L 0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full">
      <defs>
        <linearGradient id="lg" x1="0" x2="1">
          <stop offset="0%" stopColor="#00C6FF" />
          <stop offset="50%" stopColor="#6A5CFF" />
          <stop offset="100%" stopColor="#14F195" />
        </linearGradient>
        <linearGradient id="fg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#6A5CFF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#6A5CFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#fg)" />
      <path
        d={path}
        fill="none"
        stroke="url(#lg)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------------- SERVICES ---------------- */
function Services() {
  const services = [
    {
      t: "High-Yield Staking",
      d: "Put your capital to work. Generate industry-leading APYs by allocating into secure institutional staking pools and yield loops.",
      icon: Coins,
    },
    {
      t: "Automated Trading Bots",
      d: "Automate your income. Deploy adaptive AI models that execute volatility strategies and capture trend profits 24/7.",
      icon: BrainCircuit,
    },
    {
      t: "Insured Custody",
      d: "Protect your capital. All asset allocations are held in multi-party computation (MPC) vaults insured up to $250M.",
      icon: ShieldCheck,
    },
  ];
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated) {
          setAnimated(true);
          const cards = grid.querySelectorAll(".svc-card");
          gsap.fromTo(
            cards,
            { y: 80, opacity: 0, rotateX: -15 },
            { y: 0, opacity: 1, rotateX: 0, duration: 1.2, ease: "power3.out", stagger: 0.15 },
          );
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(grid);
    return () => observer.disconnect();
  }, [animated]);

  return (
    <section id="services" className="relative py-32">
      <LineWaves />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex rounded-full glass px-3 py-1 text-xs text-white/70">
            02 · What we build
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold leading-[1.1] text-white">
            Powering the next generation
            <br />
            <span className="text-gradient">of investors</span>
          </h2>
        </div>
        <div ref={gridRef} className="mt-16 grid gap-6 md:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.t} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ t, d, icon: Icon }: { t: string; d: string; icon: React.ComponentType<{ className?: string }> }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current,
      g = glowRef.current;
    if (!el || !g) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      g.style.background = `radial-gradient(400px circle at ${e.clientX - r.left}px ${e.clientY - r.top}px, rgba(0,198,255,0.25), transparent 40%)`;
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <div
      ref={ref}
      className="svc-card group gradient-border noise relative overflow-hidden rounded-3xl glass p-8 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.01] hover:shadow-[0_30px_70px_rgba(0,198,255,0.12)] hover:border-white/20"
    >
      <div ref={glowRef} className="pointer-events-none absolute inset-0" />
      <div className="relative text-left">
        <div className="mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-brand text-[#03040A] shadow-[0_0_40px_rgba(0,198,255,0.4)] group-hover:shadow-[0_0_60px_rgba(0,198,255,0.7)] group-hover:scale-110 transition-all duration-300">
          <Icon className="h-7 w-7 text-[#03040A] stroke-[1.8]" />
        </div>
        <h3 className="font-display text-2xl font-bold text-white">{t}</h3>
        <p className="mt-3 text-white/60 leading-relaxed">{d}</p>
      </div>
    </div>
  );
}

function LineWaves() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.15]">
      <svg
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 1000 600"
      >
        <defs>
          <linearGradient id="wg" x1="0" x2="1">
            <stop offset="0%" stopColor="#00C6FF" />
            <stop offset="100%" stopColor="#6A5CFF" />
          </linearGradient>
        </defs>
        {Array.from({ length: 14 }).map((_, i) => (
          <path
            key={i}
            d={`M0 ${100 + i * 30} Q 250 ${60 + i * 30} 500 ${100 + i * 30} T 1000 ${100 + i * 30}`}
            fill="none"
            stroke="url(#wg)"
            strokeWidth="1"
          >
            <animate
              attributeName="d"
              dur={`${8 + i * 0.3}s`}
              repeatCount="indefinite"
              values={`M0 ${100 + i * 30} Q 250 ${60 + i * 30} 500 ${100 + i * 30} T 1000 ${100 + i * 30};M0 ${100 + i * 30} Q 250 ${140 + i * 30} 500 ${100 + i * 30} T 1000 ${100 + i * 30};M0 ${100 + i * 30} Q 250 ${60 + i * 30} 500 ${100 + i * 30} T 1000 ${100 + i * 30}`}
            />
          </path>
        ))}
      </svg>
    </div>
  );
}



/* ---------------- EXPERIENCE ---------------- */
function Experience() {
  const lineRef = useRef<HTMLDivElement | null>(null);
  const sphereRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const stepsContainerRef = useRef<HTMLDivElement | null>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const s = sectionRef.current,
        l = lineRef.current,
        sp = sphereRef.current;
      if (!s || !l || !sp) return;
      const r = s.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(1, Math.max(0, 1 - r.top / vh));
      l.style.height = `${progress * 100}%`;
      sp.style.transform = `rotate(${progress * 360}deg)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const s = sectionRef.current;
    if (!s) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated) {
          setAnimated(true);
          const steps = stepsContainerRef.current?.querySelectorAll(".experience-step");
          const sphere = sphereRef.current;

          if (steps) {
            gsap.fromTo(
              steps,
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.2 }
            );
          }
          if (sphere) {
            gsap.fromTo(
              sphere,
              { scale: 0.8, opacity: 0 },
              { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out" }
            );
          }
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(s);
    return () => observer.disconnect();
  }, [animated]);

  const steps = [
    { n: "01", t: "Deploy Capital", d: "Onboard securely and deposit funds directly into MPC-insured cold storage." },
    { n: "02", t: "Select Engine", d: "Choose between automated grid trading, AI signals, or leverage pools." },
    { n: "03", t: "Earn Daily", d: "Sit back as algorithms trade swings and staking loops accumulate yield." },
    { n: "04", t: "Compound & Scale", d: "Reinvest earnings automatically or withdraw profits on demand." },
  ];

  return (
    <section id="experience" ref={sectionRef} className="relative overflow-hidden py-40">
      <div className="pointer-events-none absolute inset-0 opacity-40 noise" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,198,255,0.08),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(20,241,149,0.08),transparent_50%)]" />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center mb-20">
          <div className="mb-4 inline-flex rounded-full glass px-3 py-1 text-xs text-white/70">
            04 · Experience
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold leading-[1.1] text-white">
            Experience the future
            <br />
            <span className="text-gradient">before everyone else</span>
          </h2>
        </div>
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          <div className="relative pl-10 text-left">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-white/10">
              <div ref={lineRef} className="w-px bg-gradient-brand" style={{ height: "0%" }} />
            </div>
            <div ref={stepsContainerRef} className="space-y-10">
              {steps.map((s) => (
                <div key={s.n} className="experience-step relative">
                  <div className="absolute -left-[38px] top-1 grid h-8 w-8 place-items-center rounded-full glass text-[10px] font-bold shadow-[0_0_20px_rgba(0,198,255,0.4)]">
                    <span className="text-gradient">{s.n}</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white">{s.t}</h3>
                  <p className="mt-2 text-white/60 max-w-md">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative flex justify-center items-center">
            <div className="absolute h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(106,92,255,0.35),transparent_65%)] blur-3xl" />
            <div ref={sphereRef} className="relative z-10">
              <Globe className="h-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- CONTACT ---------------- */
function ContactHome() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [selectedCountry, setSelectedCountry] = useState("CH");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const validatePhone = (val: string, countryCode: string = selectedCountry) => {
    return validatePhoneNumber(val, countryCode);
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
    const phoneErr = validatePhone(form.phone, selectedCountry);

    if (nameErr || emailErr || phoneErr) {
      setValidationErrors({ name: nameErr, email: emailErr, phone: phoneErr });
      return;
    }

    setLoading(true);

    try {
      const fullPhone = formatFullPhoneNumber(form.phone, selectedCountry);
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, phone: fullPhone, countryCode: selectedCountry }),
      });
      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setStatus({
          type: "success",
          msg: "Thank you! Your enquiry has been received successfully.",
        });
        setForm({ name: "", email: "", phone: "", message: "" });
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

  const contactContainerRef = useRef<HTMLDivElement | null>(null);
  const [contactAnimated, setContactAnimated] = useState(false);

  useEffect(() => {
    const container = contactContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !contactAnimated) {
          setContactAnimated(true);
          const leftSide = container.querySelector(".contact-left");
          const rightSide = container.querySelector(".contact-right");

          if (leftSide) {
            gsap.fromTo(
              leftSide,
              { x: -40, opacity: 0 },
              { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
            );
          }
          if (rightSide) {
            gsap.fromTo(
              rightSide,
              { x: 40, opacity: 0 },
              { x: 0, opacity: 1, duration: 1.2, delay: 0.15, ease: "power3.out" }
            );
          }
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [contactAnimated]);

  return (
    <section ref={contactContainerRef} id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 items-center">
        <div className="contact-left text-left">
          <div className="mb-4 inline-flex rounded-full glass px-3 py-1 text-xs text-white/70">
            05 · Access
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold leading-[1.1] text-white">
            Ready to build
            <br />
            your <span className="text-gradient">crypto empire?</span>
          </h2>
          <p className="mt-6 max-w-md text-white/60 text-sm sm:text-base">
            Zyvora Finance offers custom staking vaults, automated trading grid setups, and tailored yield locks built to multiply your crypto income. Request access to start growing your wealth today.
          </p>
        </div>
        <form
          className="contact-right glass-strong gradient-border noise relative rounded-3xl p-5 sm:p-8 space-y-4 text-left w-full"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-white/50">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                setValidationErrors((prev) => ({ ...prev, name: validateName(e.target.value) }));
              }}
              className={`w-full rounded-xl bg-white/5 border ${validationErrors.name ? "border-destructive" : "border-white/10"} px-4 py-3 outline-none focus:border-[#00C6FF] transition text-white`}
            />
            {validationErrors.name && (
              <p className="text-xs text-destructive mt-1">{validationErrors.name}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-white/50">
              Email
            </label>
            <input
              type="email"
              placeholder="you@fund.com"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                setValidationErrors((prev) => ({ ...prev, email: validateEmail(e.target.value) }));
              }}
              className={`w-full rounded-xl bg-white/5 border ${validationErrors.email ? "border-destructive" : "border-white/10"} px-4 py-3 outline-none focus:border-[#00C6FF] transition text-white`}
            />
            {validationErrors.email && (
              <p className="text-xs text-destructive mt-1">{validationErrors.email}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-white/50">
              Phone Number
            </label>
            <div className="flex gap-2">
              <CountrySelect
                value={selectedCountry}
                onChange={(newCountry) => {
                  setSelectedCountry(newCountry);
                  setValidationErrors((prev) => ({ ...prev, phone: validatePhone(form.phone, newCountry) }));
                }}
              />
              <input
                type="text"
                placeholder={getCountry(selectedCountry).placeholder}
                value={form.phone}
                onChange={(e) => {
                  setForm({ ...form, phone: e.target.value });
                  setValidationErrors((prev) => ({ ...prev, phone: validatePhone(e.target.value, selectedCountry) }));
                }}
                className={`flex-1 rounded-xl bg-white/5 border ${validationErrors.phone ? "border-destructive" : "border-white/10"} px-4 py-3 outline-none focus:border-[#00C6FF] transition text-white`}
              />
            </div>
            {validationErrors.phone && (
              <p className="text-xs text-destructive mt-1">{validationErrors.phone}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-white/50">
              Message (Optional)
            </label>
            <textarea
              rows={4}
              placeholder="Tell us about your strategy…"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full resize-none rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-[#00C6FF] transition text-white"
            />
          </div>

          {status && (
            <div
              className={`rounded-xl border p-3 text-xs leading-relaxed ${status.type === "success" ? "border-accent/20 bg-accent/10 text-[#14F195]" : "border-destructive/20 bg-destructive/10 text-destructive"}`}
            >
              {status.msg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="shine-btn mt-2 w-full rounded-full bg-gradient-brand px-8 py-4 text-base font-semibold text-[#03040A] shadow-[0_0_40px_rgba(0,198,255,0.4)] disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Requesting Access..." : "Request Access"}
          </button>
        </form>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-20">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-2">
          <Logo className="h-6 w-6" glow={false} />
          <span className="font-bold text-white">Zyvora Finance</span>
          <span className="text-xs text-white/40 ml-2">&copy; 2026 &middot; The Future of Digital Wealth</span>
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
  );
}

/* ---------------- SCROLL PROGRESS ---------------- */
function ScrollProgress() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const h = document.documentElement;
      const p = h.scrollTop / (h.scrollHeight - h.clientHeight);
      ref.current.style.transform = `scaleX(${p})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-white/5">
      <div
        ref={ref}
        className="h-full origin-left bg-gradient-brand"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
