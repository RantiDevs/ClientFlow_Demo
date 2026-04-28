import { ACTIVITY_FEED } from "../../lib/data";
import { Activity, Eye, Mail, FileSignature, Phone, TrendingUp, Flame } from "lucide-react";

export function ActivityIntel() {
  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">Client Activity Intelligence</h1>
        <p className="text-[#6B5E7A] mt-1">Know who looked at what — turn quiet interest into closed deals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-coral text-white rounded-3xl p-5">
          <Flame className="h-7 w-7 text-white/80 mb-3" />
          <p className="text-3xl font-bold">{ACTIVITY_FEED.filter((a) => a.important).length}</p>
          <p className="text-xs text-white/80 uppercase tracking-wider font-semibold mt-1">Hot signals today</p>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-[#2A1A4A]/8">
          <Eye className="h-7 w-7 text-brand mb-3" />
          <p className="text-3xl font-bold text-ink">2,184</p>
          <p className="text-xs text-[#6B5E7A] uppercase tracking-wider font-semibold mt-1">Listing views (7d)</p>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-[#2A1A4A]/8">
          <Mail className="h-7 w-7 text-naija mb-3" />
          <p className="text-3xl font-bold text-ink">96%</p>
          <p className="text-xs text-[#6B5E7A] uppercase tracking-wider font-semibold mt-1">Investor email open</p>
        </div>
        <div className="bg-gold-gradient rounded-3xl p-5 text-brand">
          <TrendingUp className="h-7 w-7 mb-3" />
          <p className="text-3xl font-bold">+18%</p>
          <p className="text-xs uppercase tracking-wider font-semibold mt-1 opacity-80">Engagement vs last week</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#2A1A4A]/8 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#2A1A4A]/8 flex items-center justify-between">
            <h3 className="font-bold text-ink">Live activity feed</h3>
            <span className="flex items-center gap-1.5 text-xs text-naija font-semibold">
              <span className="h-2 w-2 rounded-full bg-naija animate-pulse" /> Live
            </span>
          </div>
          <div className="divide-y divide-[#2A1A4A]/5 max-h-[480px] overflow-y-auto">
            {ACTIVITY_FEED.map((a) => (
              <div key={a.id} className="px-6 py-3.5 flex items-start gap-3 hover:bg-cream/50 transition-colors">
                <div className={`h-9 w-9 rounded-2xl flex items-center justify-center shrink-0 ${
                  a.important ? "bg-coral text-white" : "bg-cream text-brand"
                }`}>
                  <Activity className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink">
                    <span className="font-bold">{a.actor}</span>
                    <span className="text-[10px] ml-2 px-1.5 py-0.5 rounded-full bg-cream text-[#6B5E7A] font-bold">{a.role}</span>
                  </p>
                  <p className="text-xs text-[#6B5E7A] mt-0.5">{a.action}</p>
                </div>
                <span className="text-[11px] text-[#998BB0] whitespace-nowrap shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-brand text-white rounded-3xl p-6">
            <h3 className="font-bold mb-4">🔥 Highest-intent leads</h3>
            <div className="space-y-3">
              {ACTIVITY_FEED.filter((a) => a.important && (a.role === "Lead" || a.role === "Investor")).slice(0, 4).map((a) => (
                <div key={a.id} className="flex items-center gap-3 pb-3 border-b border-white/10 last:border-0 last:pb-0">
                  <div className="h-9 w-9 rounded-full bg-coral flex items-center justify-center text-xs font-bold shrink-0">
                    {a.actor.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{a.actor}</p>
                    <p className="text-[11px] text-white/60 truncate">{a.action}</p>
                  </div>
                  <button className="h-8 w-8 rounded-full bg-coral text-white flex items-center justify-center shrink-0 hover:bg-white hover:text-coral transition-colors">
                    <Phone className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#2A1A4A]/8">
            <FileSignature className="h-6 w-6 text-coral mb-3" />
            <p className="text-sm font-bold text-ink mb-1">Pro tip</p>
            <p className="text-xs text-[#6B5E7A] leading-relaxed">Investors who view a brochure 3+ times in a week are 4× more likely to close. Reach out today.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
