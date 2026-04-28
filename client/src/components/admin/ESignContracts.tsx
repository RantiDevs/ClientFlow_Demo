import { CONTRACTS, NGN } from "../../lib/data";
import { FileSignature, CheckCircle2, Clock, FileEdit, Plus, Eye, Send } from "lucide-react";
import { Button } from "../ui/button";

const statusStyle: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  "Signed":              { bg: "bg-naija/15",  text: "text-naija",     icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  "Awaiting Signature":  { bg: "bg-coral-soft", text: "text-coral",     icon: <Clock className="h-3.5 w-3.5" /> },
  "Draft":               { bg: "bg-[#F1ECE3]", text: "text-[#6B5E7A]", icon: <FileEdit className="h-3.5 w-3.5" /> },
};

export function ESignContracts() {
  const totalValue = CONTRACTS.filter((c) => c.status === "Signed").reduce((s, c) => s + c.value, 0);
  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-ink">Digital E-Signatures</h1>
          <p className="text-[#6B5E7A] mt-1">Tenancies, sale deeds and investor agreements — signed legally inside the portal.</p>
        </div>
        <Button className="bg-brand text-white hover:bg-brand-soft rounded-xl"><Plus className="h-4 w-4 mr-1" /> New Contract</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-naija text-white rounded-3xl p-6">
          <FileSignature className="h-8 w-8 text-white/80 mb-3" />
          <p className="text-3xl font-bold">{CONTRACTS.filter((c) => c.status === "Signed").length}</p>
          <p className="text-sm text-white/80 mt-1">Fully signed contracts</p>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-[#2A1A4A]/8">
          <Clock className="h-8 w-8 text-coral mb-3" />
          <p className="text-3xl font-bold text-ink">{CONTRACTS.filter((c) => c.status === "Awaiting Signature").length}</p>
          <p className="text-sm text-[#6B5E7A] mt-1">Awaiting signature</p>
        </div>
        <div className="bg-gold-gradient rounded-3xl p-6 text-brand">
          <p className="text-xs uppercase tracking-wider font-bold opacity-80">Closed Value</p>
          <p className="text-3xl font-bold mt-2">{NGN(totalValue)}</p>
          <p className="text-xs opacity-80 mt-1">Across signed contracts</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#2A1A4A]/8 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#2A1A4A]/8 flex items-center justify-between">
          <h3 className="font-bold text-ink">Recent contracts</h3>
        </div>
        <div className="divide-y divide-[#2A1A4A]/5">
          {CONTRACTS.map((c) => {
            const style = statusStyle[c.status] || statusStyle["Draft"];
            return (
              <div key={c.id} className="px-6 py-4 flex flex-col lg:flex-row lg:items-center gap-4 hover:bg-cream/50 transition-colors">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="h-11 w-11 rounded-2xl bg-cream flex items-center justify-center text-brand shrink-0">
                    <FileSignature className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-ink">{c.title}</p>
                    <p className="text-xs text-[#6B5E7A] mt-0.5">{c.parties.join("  ↔  ")}</p>
                    <p className="text-[11px] text-[#998BB0] mt-1">Last update: {c.date} · ID {c.id}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between lg:justify-end gap-3 lg:gap-6 lg:shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-bold text-coral">{NGN(c.value)}</p>
                    <span className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full font-bold ${style.bg} ${style.text} mt-1`}>
                      {style.icon}{c.status}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-[#6B5E7A] hover:text-brand"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-[#6B5E7A] hover:text-coral"><Send className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
