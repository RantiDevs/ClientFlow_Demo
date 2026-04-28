import { REFERRALS, NGN } from "../../lib/data";
import { Sparkles, Gift, Users, CheckCircle2, Clock } from "lucide-react";

export function Referrals() {
  const totalPaid = REFERRALS.filter((r) => r.status === "Paid").reduce((s, r) => s + r.reward, 0);
  const totalPending = REFERRALS.filter((r) => r.status === "Pending").reduce((s, r) => s + r.reward, 0);
  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">Referral Program</h1>
        <p className="text-[#6B5E7A] mt-1">Turn happy clients and staff into your top sales channel — automatic reward tracking.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-coral text-white rounded-3xl p-6">
          <Gift className="h-8 w-8 text-white/80 mb-3" />
          <p className="text-3xl font-bold">{NGN(totalPaid)}</p>
          <p className="text-sm text-white/80 mt-1">Rewards paid out</p>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-[#2A1A4A]/8">
          <Clock className="h-8 w-8 text-gold-deep mb-3" />
          <p className="text-3xl font-bold text-ink">{NGN(totalPending)}</p>
          <p className="text-sm text-[#6B5E7A] mt-1">Pending payout</p>
        </div>
        <div className="bg-naija text-white rounded-3xl p-6">
          <Users className="h-8 w-8 text-white/80 mb-3" />
          <p className="text-3xl font-bold">{REFERRALS.length}</p>
          <p className="text-sm text-white/80 mt-1">Successful referrals</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-brand text-white rounded-3xl p-6 lg:col-span-1">
          <Sparkles className="h-8 w-8 text-gold mb-4" />
          <h3 className="font-bold text-lg mb-2">How it works</h3>
          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex gap-2"><span className="h-5 w-5 rounded-full bg-coral text-white text-xs font-bold flex items-center justify-center shrink-0">1</span> Client gets a unique invite link in their portal.</li>
            <li className="flex gap-2"><span className="h-5 w-5 rounded-full bg-coral text-white text-xs font-bold flex items-center justify-center shrink-0">2</span> New investor / tenant signs up via the link.</li>
            <li className="flex gap-2"><span className="h-5 w-5 rounded-full bg-coral text-white text-xs font-bold flex items-center justify-center shrink-0">3</span> Reward auto-credits when the new account closes a deal.</li>
            <li className="flex gap-2"><span className="h-5 w-5 rounded-full bg-coral text-white text-xs font-bold flex items-center justify-center shrink-0">4</span> Pay out via Paystack with one click.</li>
          </ul>
        </div>

        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#2A1A4A]/8 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#2A1A4A]/8">
            <h3 className="font-bold text-ink">Referral history</h3>
          </div>
          <div className="divide-y divide-[#2A1A4A]/5">
            {REFERRALS.map((r) => (
              <div key={r.id} className="px-6 py-4 flex items-center gap-4 hover:bg-cream/50 transition-colors">
                <div className="h-10 w-10 rounded-2xl bg-cream flex items-center justify-center text-coral shrink-0">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-ink text-sm">
                    <span className="text-brand">{r.referrer}</span>
                    <span className="mx-2 text-[#998BB0]">→</span>
                    {r.newClient}
                  </p>
                  <p className="text-xs text-[#6B5E7A]">{r.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-base font-bold text-coral">{NGN(r.reward)}</p>
                  <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    r.status === "Paid" ? "bg-naija/15 text-naija" : "bg-coral-soft text-coral"
                  }`}>
                    {r.status === "Paid" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
