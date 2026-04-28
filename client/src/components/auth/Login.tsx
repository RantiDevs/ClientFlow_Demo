import { useState, useEffect, useRef } from "react";
import { Building2, User, Shield, ArrowRight, Leaf, ArrowLeft, Sparkles } from "lucide-react";
import logoUrl from "../../assets/logo.png";
import type { UserRole } from "../../lib/api";

interface LoginProps {
  onDemoLogin: (role: UserRole) => void;
  onBackToHome?: () => void;
}

type Portal = {
  key: UserRole;
  label: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
  cardBg: string;
};

const portals: Portal[] = [
  { key: "investor",   label: "Investor Portal",  description: "Track ROI, dividends & assets", icon: <Building2 className="h-5 w-5" />, accent: "#FF5C7A", cardBg: "from-[#FF5C7A]/15 to-[#2A1A4A]/5" },
  { key: "tenant",     label: "Tenant Portal",    description: "Pay rent, log requests, sign",  icon: <User className="h-5 w-5" />,      accent: "#E8C56F", cardBg: "from-[#E8C56F]/20 to-[#2A1A4A]/5" },
  { key: "admin",      label: "Admin / Agency",   description: "Full agency control center",    icon: <Shield className="h-5 w-5" />,    accent: "#2A1A4A", cardBg: "from-[#2A1A4A]/15 to-[#FF5C7A]/5" },
  { key: "verdafarms", label: "Verda Farms",      description: "Farm investment & monitoring",  icon: <Leaf className="h-5 w-5" />,      accent: "#008751", cardBg: "from-[#008751]/15 to-[#E8C56F]/10" },
];

const slides = [
  { heading: "Manage Nigeria's finest real estate with confidence.", body: "From Lekki to Maitama, Rantidevs ClientFlow gives you a single command center for every property, tenant, and Naira." },
  { heading: "Real-time ROI in your pocket.", body: "Live dividends, occupancy intelligence and Paystack-powered payments — your portfolio works while you sleep." },
  { heading: "Verda Farms — agriculture as an asset class.", body: "Cashew, cassava and managed plots in Ogun, Oyo and Kaduna. Track every harvest from your phone." },
];

export function Login({ onDemoLogin, onBackToHome }: LoginProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [slideFading, setSlideFading] = useState(false);
  const slideTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    slideTimerRef.current = setInterval(() => {
      setSlideFading(true);
      setTimeout(() => {
        setSlideIndex((i) => (i + 1) % slides.length);
        setSlideFading(false);
      }, 400);
    }, 4500);
    return () => {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-cream p-4 bg-hex-pattern">
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-[32px] shadow-brand overflow-hidden min-h-[640px] border border-[#2A1A4A]/10">

        {/* Left — brand panel */}
        <div className="hidden md:flex bg-brand-deep p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-coral rounded-full blur-3xl opacity-25" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-gold rounded-full blur-3xl opacity-20" />
          <div className="absolute inset-0 bg-hex-pattern opacity-30 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <img src={logoUrl} alt="Rantidevs ClientFlow" className="h-14 w-14 object-contain rounded-xl" />
              <div className="leading-tight">
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold">Rantidevs</p>
                <p className="text-2xl font-bold text-white">ClientFlow</p>
              </div>
            </div>

            <div
              style={{
                transition: "opacity 0.4s ease, transform 0.4s ease",
                opacity: slideFading ? 0 : 1,
                transform: slideFading ? "translateY(10px)" : "translateY(0)",
              }}
            >
              <h1 className="text-3xl xl:text-4xl font-bold text-white mb-4 leading-tight">
                {slides[slideIndex].heading}
              </h1>
              <p className="text-white/70 text-base leading-relaxed">
                {slides[slideIndex].body}
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between mt-12">
            <div className="flex items-center space-x-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setSlideFading(true); setTimeout(() => { setSlideIndex(i); setSlideFading(false); }, 400); }}
                  className="focus:outline-none"
                  aria-label={`Go to slide ${i + 1}`}
                >
                  <div
                    style={{ transition: "all 0.3s ease" }}
                    className={i === slideIndex ? "h-2 w-8 bg-coral rounded-full" : "h-2 w-2 bg-white/20 hover:bg-white/40 rounded-full"}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs text-white/40 font-mono">🇳🇬 Made in Nigeria</span>
          </div>
        </div>

        {/* Right — demo portal selector */}
        <div className="p-8 md:p-10 flex flex-col justify-center overflow-y-auto">
          <div className="max-w-md w-full mx-auto space-y-6">
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="flex items-center gap-1.5 text-sm text-[#6B5E7A] hover:text-brand transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </button>
            )}

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-soft text-coral text-xs font-semibold mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                DEMO MODE — No password needed
              </div>
              <h2 className="text-3xl font-bold text-ink">Pick a portal to explore</h2>
              <p className="text-[#6B5E7A] mt-1.5">One click takes you straight in. This is a live demo for buyers — every portal is pre-loaded with sample Nigerian data.</p>
            </div>

            <div className="grid gap-3">
              {portals.map((portal) => (
                <button
                  key={portal.key}
                  onClick={() => onDemoLogin(portal.key)}
                  className={`group relative flex items-center p-4 rounded-2xl border-2 border-transparent bg-gradient-to-br ${portal.cardBg} hover:border-[var(--hover-color)] hover:shadow-lg transition-all text-left overflow-hidden`}
                  style={{ ['--hover-color' as string]: portal.accent }}
                >
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center text-white shadow-md shrink-0"
                    style={{ backgroundColor: portal.accent }}
                  >
                    {portal.icon}
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <span className="block font-bold text-ink">{portal.label}</span>
                    <span className="block text-sm text-[#6B5E7A]">{portal.description}</span>
                  </div>
                  <ArrowRight
                    className="h-5 w-5 transition-all transform group-hover:translate-x-1 shrink-0"
                    style={{ color: portal.accent }}
                  />
                </button>
              ))}
            </div>

            <div className="text-center text-[11px] text-[#6B5E7A] pt-4 border-t border-[#2A1A4A]/8">
              Powered by <span className="font-semibold text-brand">Rantidevs</span> — We Build. We Automate. We Scale.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
