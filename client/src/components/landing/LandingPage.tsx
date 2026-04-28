import { motion } from "motion/react";
import {
  Building2, Leaf, Shield, ArrowRight, TrendingUp, MessageCircle, FileSignature,
  CalendarCheck, Wrench, FolderLock, Wallet, Network, Users, Activity, GitBranch,
  Sparkles, MapPin,
} from "lucide-react";
import logoUrl from "../../assets/logo.png";

interface LandingPageProps {
  onLoginClick: () => void;
}

export function LandingPage({ onLoginClick }: LandingPageProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 110, damping: 22 } },
  };

  const headlineFeatures = [
    { icon: Network,        title: "CRM & Lead Pipeline",      desc: "Capture Instagram and WhatsApp enquiries straight into a Kanban funnel. Know exactly where every lead sits." },
    { icon: FileSignature,  title: "Digital E-Signature",      desc: "Tenants and investors sign tenancy agreements, sale deeds and C of O acceptances inside the portal." },
    { icon: CalendarCheck,  title: "Inspection Scheduling",    desc: "Clients book viewings online. Your agents see one shared calendar across Lagos, Abuja and Kano." },
    { icon: Wrench,         title: "Maintenance Tracker",      desc: "Tenants log issues, vendors are auto-notified, status closes the loop. No more WhatsApp chaos." },
    { icon: FolderLock,     title: "Document Vault",           desc: "Every C of O, survey, deed and lease — encrypted and tagged per property and per client." },
    { icon: Wallet,         title: "Paystack & Flutterwave",   desc: "Tenants pay rent and investors fund plots in-portal. Bank-grade, CBN-compliant, automatic receipts." },
    { icon: TrendingUp,     title: "Commission & Revenue",     desc: "See which agent closed which deal and what they're owed. Built for agencies with sales teams." },
    { icon: MessageCircle,  title: "Broadcast Messaging",      desc: "One message to every tenant, every investor, or a filtered list — via WhatsApp or in-app." },
    { icon: Users,          title: "Role-Based Staff Access",  desc: "Agents see only their assigned properties. Branch managers see their branch. No data leaks." },
    { icon: Activity,       title: "Client Activity Intel",    desc: "Know which investor opened your brochure, which tenant viewed their lease, which lead clicked a listing." },
    { icon: GitBranch,      title: "Multi-Branch Support",     desc: "Run Lagos, Abuja and Kano from one admin login. Separate P&L, shared intelligence." },
    { icon: Sparkles,       title: "Referral Tracking",        desc: "Track who referred whom and auto-calculate referral payouts. Turn happy clients into your sales force." },
  ];

  return (
    <div className="min-h-screen bg-cream font-sans selection:bg-coral/30 text-ink">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/85 backdrop-blur-lg border-b border-[#2A1A4A]/10">
        <div className="max-w-7xl mx-auto px-5 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="Rantidevs ClientFlow" className="h-11 w-11 object-contain" />
            <div className="leading-tight hidden sm:block">
              <p className="text-[10px] uppercase tracking-[0.22em] text-gold-deep font-semibold">Rantidevs</p>
              <p className="text-lg font-bold text-ink">ClientFlow</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#6B5E7A]">
            <a href="#features" className="hover:text-brand transition-colors">Features</a>
            <a href="#portfolio" className="hover:text-brand transition-colors">Portfolio</a>
            <a href="#why-naija" className="hover:text-brand transition-colors">Why Nigeria</a>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onLoginClick}
            className="px-5 md:px-6 py-2.5 bg-brand text-white font-semibold rounded-full shadow-brand hover:shadow-coral transition-all flex items-center gap-2 text-sm"
          >
            Try Demo <ArrowRight className="h-4 w-4" />
          </motion.button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-coral/15 rounded-[100%] blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute top-32 -right-20 w-[500px] h-[500px] bg-gold/20 rounded-full blur-[100px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 -left-32 w-[500px] h-[500px] bg-brand-soft/15 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-5 md:px-6 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={containerVariants} className="text-center max-w-4xl mx-auto">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#2A1A4A]/10 shadow-sm mb-8">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-coral" />
              </span>
              <span className="text-sm font-medium text-ink">🇳🇬 Built in Nigeria, for Nigerian agencies</span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold tracking-tight text-ink mb-7 leading-[1.05]">
              Run your <span className="text-brand-gradient">property empire</span> like a <span className="text-gold-gradient">global SaaS.</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-[#6B5E7A] mb-10 max-w-2xl mx-auto leading-relaxed">
              Rantidevs ClientFlow is the all-in-one command center for Nigerian real estate and farm-investment agencies. CRM, e-signatures, Paystack, inspections, commissions — one login.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onLoginClick}
                className="w-full sm:w-auto px-8 py-4 bg-brand-gradient text-white font-semibold rounded-full shadow-coral transition-all flex items-center justify-center gap-2 group"
              >
                Enter Live Demo
                <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#features"
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-white/80 text-ink font-semibold rounded-full border-2 border-[#2A1A4A]/10 shadow-sm transition-all text-center"
              >
                See 12 Features
              </a>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-xs text-[#6B5E7A] uppercase tracking-wider font-semibold">
              <span>✓ No password needed</span>
              <span>✓ Lagos · Abuja · Kano</span>
              <span>✓ Paystack & Flutterwave ready</span>
              <span>✓ WhatsApp broadcasts</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats / portfolio teaser */}
      <section id="portfolio" className="relative py-20 bg-white border-y border-[#2A1A4A]/8">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "₦8.5B+", label: "Properties under management" },
              { value: "94%",    label: "Average occupancy rate" },
              { value: "3",      label: "Branches: Lagos · Abuja · Kano" },
              { value: "132",    label: "Tenants & investors served" },
            ].map((s) => (
              <div key={s.label} className="text-center p-6 rounded-3xl bg-cream border border-[#2A1A4A]/8 hover:shadow-md transition-shadow">
                <p className="text-3xl md:text-4xl font-bold text-brand-gradient">{s.value}</p>
                <p className="text-xs md:text-sm text-[#6B5E7A] mt-2 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Headline 12 features */}
      <section id="features" className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <p className="inline-block text-xs uppercase tracking-[0.22em] text-coral font-bold mb-3">12 reasons agencies switch</p>
            <h2 className="text-3xl md:text-5xl font-bold text-ink mb-4 leading-tight">Everything you wish your old spreadsheet did.</h2>
            <p className="text-[#6B5E7A]">Stop juggling WhatsApp threads, Excel sheets and a notebook. ClientFlow is the operating system for a modern Nigerian agency.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {headlineFeatures.map((f, i) => {
              const palette = [
                { bg: "bg-coral", text: "text-white" },
                { bg: "bg-gold", text: "text-brand" },
                { bg: "bg-brand", text: "text-gold" },
                { bg: "bg-naija", text: "text-white" },
              ][i % 4];
              return (
                <motion.div
                  key={f.title}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-3xl p-6 border border-[#2A1A4A]/8 hover:shadow-xl hover:border-coral/40 transition-all group"
                >
                  <div className={`h-12 w-12 ${palette.bg} rounded-2xl flex items-center justify-center mb-5 ${palette.text} group-hover:scale-110 transition-transform shadow-md`}>
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-2">{f.title}</h3>
                  <p className="text-sm text-[#6B5E7A] leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Naija */}
      <section id="why-naija" className="py-24 bg-white border-y border-[#2A1A4A]/8">
        <div className="max-w-6xl mx-auto px-5 md:px-6 grid md:grid-cols-2 gap-14 items-center">
          <div>
            <p className="inline-block text-xs uppercase tracking-[0.22em] text-naija font-bold mb-3">🇳🇬 Built for Nigerian reality</p>
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-5 leading-tight">Naira-first. Lagos-tested. Diaspora-ready.</h2>
            <p className="text-[#6B5E7A] mb-7 leading-relaxed">
              Rantidevs ClientFlow speaks the Nigerian property market natively. Service charges, C of O attachments, generator-maintenance vendors, Paystack receipts and diaspora investor onboarding from London or Toronto — all baked in.
            </p>
            <ul className="space-y-3">
              {[
                "Naira values everywhere — no exchange-rate guessing",
                "WhatsApp-first communication for tenants and leads",
                "Multi-branch P&L for Lagos, Abuja, Port Harcourt and Kano",
                "Automatic e-receipts that survive any audit",
                "Investor portal in English, with NGN-denominated dividends",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3 text-sm text-ink">
                  <span className="h-5 w-5 rounded-full bg-naija/15 text-naija flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { city: "Lagos",  area: "Lekki · Ikeja · VI · Banana Island", count: "18 properties" },
              { city: "Abuja",  area: "Maitama · Wuse · Asokoro",           count: "9 properties" },
              { city: "Kano",   area: "Nasarawa GRA · Bompai",              count: "5 properties" },
              { city: "Verda",  area: "Ogun · Oyo · Kaduna · Benue",        count: "4 farm plots" },
            ].map((b, i) => (
              <div
                key={b.city}
                className={`rounded-3xl p-5 ${i % 2 === 0 ? "bg-brand text-white" : "bg-cream text-ink border border-[#2A1A4A]/10"}`}
              >
                <MapPin className={`h-5 w-5 mb-3 ${i % 2 === 0 ? "text-coral" : "text-coral"}`} />
                <p className="font-bold text-lg">{b.city}</p>
                <p className={`text-xs leading-relaxed mb-3 ${i % 2 === 0 ? "text-white/70" : "text-[#6B5E7A]"}`}>{b.area}</p>
                <p className={`text-xs font-semibold ${i % 2 === 0 ? "text-gold" : "text-coral"}`}>{b.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Persona portals */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-3">One platform. Four purpose-built portals.</h2>
            <p className="text-[#6B5E7A] max-w-xl mx-auto">Each role gets exactly what they need — no clutter, no surprises.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Building2, name: "Investor",   color: "bg-coral",   text: "text-white", desc: "ROI dashboards, dividend wallet, portfolio statements." },
              { icon: Users,     name: "Tenant",     color: "bg-gold",    text: "text-brand", desc: "Pay rent via Paystack, log services, sign agreements." },
              { icon: Shield,    name: "Admin",      color: "bg-brand",   text: "text-gold",  desc: "Run the agency: CRM, commissions, broadcasts, branches." },
              { icon: Leaf,      name: "Verda Farms", color: "bg-naija",   text: "text-white", desc: "Cashew & cassava plots, harvest reports, crop ROI." },
            ].map((p) => (
              <motion.button
                key={p.name}
                whileHover={{ y: -6 }}
                onClick={onLoginClick}
                className="text-left bg-white rounded-3xl p-6 border border-[#2A1A4A]/8 hover:shadow-xl hover:border-coral/40 transition-all group"
              >
                <div className={`h-14 w-14 ${p.color} ${p.text} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-md`}>
                  <p.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-ink mb-2">{p.name}</h3>
                <p className="text-sm text-[#6B5E7A] leading-relaxed mb-4">{p.desc}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-coral">
                  Try this portal <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 overflow-hidden bg-brand-deep">
        <div className="absolute inset-0 bg-hex-pattern opacity-50" />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-coral rounded-full blur-[150px] opacity-30" />
        <div className="absolute -bottom-40 -left-32 w-[500px] h-[500px] bg-gold rounded-full blur-[150px] opacity-20" />

        <div className="max-w-4xl mx-auto px-5 md:px-6 text-center relative z-10">
          <img src={logoUrl} alt="Rantidevs ClientFlow" className="h-20 w-20 object-contain mx-auto mb-8" />
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to run your agency like a <span className="text-gold-gradient">unicorn?</span>
          </h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            This is a live, no-password demo. Walk through every feature with one click — and imagine your agency on it.
          </p>
          <button
            onClick={onLoginClick}
            className="px-9 py-4 bg-coral hover:bg-coral/90 text-white font-bold rounded-full shadow-coral transition-all text-lg flex items-center gap-2 mx-auto group"
          >
            Open the Demo
            <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-deep py-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="Rantidevs ClientFlow" className="h-10 w-10 object-contain" />
            <div className="leading-tight">
              <p className="text-[10px] uppercase tracking-[0.22em] text-gold font-semibold">Rantidevs</p>
              <p className="text-base font-bold text-white">ClientFlow</p>
            </div>
          </div>
          <p className="text-white/50 text-xs text-center">
            © {new Date().getFullYear()} <span className="text-gold font-semibold">Rantidevs</span>. ClientFlow is a Rantidevs product. We Build. We Automate. We Scale.
          </p>
          <div className="flex gap-5 text-xs">
            <a href="#" className="text-white/50 hover:text-coral transition-colors">Terms</a>
            <a href="#" className="text-white/50 hover:text-coral transition-colors">Privacy</a>
            <a href="#" className="text-white/50 hover:text-coral transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
