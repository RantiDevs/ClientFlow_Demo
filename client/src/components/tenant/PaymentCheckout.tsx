import { useState } from "react";
import { CreditCard, Building2, Smartphone, CheckCircle2, ShieldCheck, Calendar, Receipt } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { NGN } from "../../lib/data";
import { toast } from "sonner";

const RECENT_PAYMENTS = [
  { id: "PS-001294", purpose: "April 2026 Rent",      method: "Paystack — Card",       amount: 2_500_000, date: "2026-04-01", status: "Successful" },
  { id: "FW-998871", purpose: "March 2026 Rent",      method: "Flutterwave — Transfer", amount: 2_500_000, date: "2026-03-01", status: "Successful" },
  { id: "PS-001188", purpose: "Service charge Q1",    method: "Paystack — USSD",       amount: 240_000,   date: "2026-01-15", status: "Successful" },
];

export function PaymentCheckout() {
  const [method, setMethod] = useState<"Paystack" | "Flutterwave" | "Bank Transfer">("Paystack");
  const [amount] = useState(2_500_000);

  const handlePay = () => {
    toast.success(`(Demo) Redirecting to ${method} secure checkout for ${NGN(amount)}…`);
  };

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">Pay Rent</h1>
        <p className="text-[#6B5E7A] mt-1">CBN-licensed gateways. Receipts auto-filed in your portal.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Checkout */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-[#2A1A4A]/8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-coral">Outstanding</p>
              <p className="text-4xl font-bold text-brand mt-1">{NGN(amount)}</p>
              <p className="text-sm text-[#6B5E7A] mt-1">May 2026 — Lekki Pearl Residences, Unit B-12</p>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-xs text-naija font-semibold bg-naija/10 px-3 py-1.5 rounded-full">
              <ShieldCheck className="h-3.5 w-3.5" /> Secured by 256-bit TLS
            </div>
          </div>

          <p className="text-xs uppercase tracking-wider font-bold text-[#6B5E7A] mb-2">Choose payment method</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            {([
              { key: "Paystack" as const,      logo: "Paystack",     color: "bg-[#0BA4DB]" },
              { key: "Flutterwave" as const,   logo: "Flutterwave",  color: "bg-[#F08000]" },
              { key: "Bank Transfer" as const, logo: "Direct Bank",  color: "bg-naija" },
            ]).map((m) => (
              <button
                key={m.key}
                onClick={() => setMethod(m.key)}
                className={`p-4 rounded-2xl border-2 transition-all text-left ${
                  method === m.key ? "border-coral bg-coral-soft" : "border-[#2A1A4A]/10 hover:border-brand bg-cream"
                }`}
              >
                <div className={`h-9 w-9 ${m.color} rounded-xl flex items-center justify-center text-white mb-2 shadow-sm`}>
                  {m.key === "Bank Transfer" ? <Building2 className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />}
                </div>
                <p className="font-bold text-sm text-ink">{m.logo}</p>
                <p className="text-[11px] text-[#6B5E7A] mt-0.5">
                  {m.key === "Paystack" ? "Card · Bank · USSD" : m.key === "Flutterwave" ? "Card · Transfer · QR" : "GTBank · Zenith · UBA"}
                </p>
              </button>
            ))}
          </div>

          {/* Card form (demo, non-functional) */}
          {method !== "Bank Transfer" && (
            <div className="space-y-3 mb-6">
              <p className="text-xs uppercase tracking-wider font-bold text-[#6B5E7A]">Card details (demo)</p>
              <Input placeholder="Card number — 1234 5678 9012 3456" className="rounded-xl bg-cream h-12" />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="MM / YY" className="rounded-xl bg-cream h-12" />
                <div className="relative">
                  <Input placeholder="CVV" className="rounded-xl bg-cream h-12 pr-10" />
                  <Smartphone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#998BB0]" />
                </div>
              </div>
              <p className="text-[11px] text-[#998BB0] flex items-center gap-1.5">
                <ShieldCheck className="h-3 w-3 text-naija" />
                This is a demo — no real cards are charged.
              </p>
            </div>
          )}

          {method === "Bank Transfer" && (
            <div className="space-y-2 mb-6 p-4 bg-cream rounded-2xl border border-[#2A1A4A]/10">
              <p className="text-xs uppercase tracking-wider font-bold text-[#6B5E7A]">Pay into</p>
              <p className="font-bold text-ink">Rantidevs ClientFlow Ltd. (Wema Bank)</p>
              <p className="text-2xl font-bold text-coral font-mono tracking-wider">0123 456 789</p>
              <p className="text-xs text-[#6B5E7A]">Use reference: <span className="font-mono font-bold text-brand">RNT-LKB12-MAY26</span></p>
            </div>
          )}

          <Button onClick={handlePay} className="w-full bg-brand-gradient text-white hover:opacity-90 rounded-2xl h-14 shadow-coral text-base font-bold">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            Pay {NGN(amount)} now
          </Button>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <div className="bg-brand text-white rounded-3xl p-6">
            <Calendar className="h-7 w-7 text-coral mb-3" />
            <p className="text-xs uppercase tracking-wider font-bold text-white/60">Next due</p>
            <p className="text-2xl font-bold mt-1">June 1, 2026</p>
            <p className="text-sm text-white/70 mt-1">{NGN(2_500_000)} · 33 days away</p>
            <Button variant="ghost" className="mt-4 w-full text-coral hover:bg-white/10 hover:text-coral border border-white/20 rounded-xl">
              Set up auto-pay
            </Button>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#2A1A4A]/8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-ink flex items-center gap-2"><Receipt className="h-4 w-4 text-coral" /> Recent receipts</h3>
            </div>
            <div className="space-y-3">
              {RECENT_PAYMENTS.map((p) => (
                <div key={p.id} className="flex items-center gap-3 pb-3 border-b border-[#2A1A4A]/5 last:border-0 last:pb-0">
                  <div className="h-9 w-9 rounded-xl bg-naija/10 text-naija flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">{p.purpose}</p>
                    <p className="text-[11px] text-[#6B5E7A]">{p.method} · {p.date}</p>
                  </div>
                  <p className="text-sm font-bold text-coral whitespace-nowrap">{NGN(p.amount)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
