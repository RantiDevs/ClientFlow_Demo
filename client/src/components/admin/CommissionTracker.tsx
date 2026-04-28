import { COMMISSIONS, NGN } from "../../lib/data";
import { TrendingUp, Award, Building2, Download } from "lucide-react";
import { Button } from "../ui/button";

export function CommissionTracker() {
  const totalPaid = COMMISSIONS.filter((c) => c.status === "Paid").reduce((s, c) => s + c.amount, 0);
  const totalPending = COMMISSIONS.filter((c) => c.status === "Pending").reduce((s, c) => s + c.amount, 0);
  const byAgent = COMMISSIONS.reduce<Record<string, number>>((acc, c) => {
    acc[c.agent] = (acc[c.agent] || 0) + c.amount;
    return acc;
  }, {});
  const ranking = Object.entries(byAgent).sort((a, b) => b[1] - a[1]);
  const maxAgent = Math.max(...Object.values(byAgent));

  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-ink">Commission & Revenue Tracker</h1>
          <p className="text-[#6B5E7A] mt-1">Know exactly which agent closed which deal — and what they're owed this cycle.</p>
        </div>
        <Button variant="outline" className="rounded-xl border-brand text-brand hover:bg-brand hover:text-white"><Download className="h-4 w-4 mr-1.5" /> Export CSV</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-naija text-white rounded-3xl p-6">
          <Award className="h-8 w-8 text-white/80 mb-3" />
          <p className="text-3xl font-bold">{NGN(totalPaid)}</p>
          <p className="text-sm text-white/80 mt-1">Paid this period</p>
        </div>
        <div className="bg-coral text-white rounded-3xl p-6">
          <TrendingUp className="h-8 w-8 text-white/80 mb-3" />
          <p className="text-3xl font-bold">{NGN(totalPending)}</p>
          <p className="text-sm text-white/80 mt-1">Pending payout</p>
        </div>
        <div className="bg-brand text-white rounded-3xl p-6">
          <Building2 className="h-8 w-8 text-gold mb-3" />
          <p className="text-3xl font-bold">{ranking.length}</p>
          <p className="text-sm text-white/70 mt-1">Active earning agents</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Leaderboard */}
        <div className="bg-white rounded-3xl border border-[#2A1A4A]/8 p-6">
          <h3 className="font-bold text-ink mb-4">Top agents this period</h3>
          <div className="space-y-4">
            {ranking.map(([agent, amount], i) => (
              <div key={agent}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      i === 0 ? "bg-gold text-brand" : i === 1 ? "bg-[#E2DCFF] text-brand" : "bg-cream text-[#6B5E7A]"
                    }`}>{i + 1}</span>
                    <p className="text-sm font-semibold text-ink truncate">{agent}</p>
                  </div>
                  <p className="text-sm font-bold text-coral">{NGN(amount)}</p>
                </div>
                <div className="h-2 bg-cream rounded-full overflow-hidden">
                  <div className="h-full bg-brand-gradient rounded-full" style={{ width: `${(amount / maxAgent) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent commissions */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#2A1A4A]/8 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#2A1A4A]/8">
            <h3 className="font-bold text-ink">Recent commissions</h3>
          </div>
          <div className="divide-y divide-[#2A1A4A]/5">
            {COMMISSIONS.map((c) => (
              <div key={c.id} className="px-6 py-3.5 flex items-center gap-3 hover:bg-cream/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{c.deal}</p>
                  <p className="text-xs text-[#6B5E7A]">{c.agent} · {c.branch} · {c.rate} · {c.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-coral">{NGN(c.amount)}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    c.status === "Paid" ? "bg-naija/15 text-naija" : "bg-coral-soft text-coral"
                  }`}>{c.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
