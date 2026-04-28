import { useState } from "react";
import { LEADS, LEAD_STAGES, type LeadStage, NGN_SHORT } from "../../lib/data";
import { Phone, MessageCircle, Plus, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const stageColors: Record<LeadStage, { bg: string; text: string; dot: string }> = {
  "New":            { bg: "bg-coral-soft",            text: "text-coral",   dot: "bg-coral" },
  "Contacted":      { bg: "bg-[#FBE9C8]",             text: "text-gold-deep", dot: "bg-gold" },
  "Viewing Booked": { bg: "bg-[#E2DCFF]",             text: "text-brand-soft", dot: "bg-brand-soft" },
  "Negotiating":    { bg: "bg-[#FFD4DD]",             text: "text-coral",   dot: "bg-coral" },
  "Closed Won":     { bg: "bg-[#C9F0DC]",             text: "text-naija",   dot: "bg-naija" },
  "Lost":           { bg: "bg-[#F1ECE3]",             text: "text-[#6B5E7A]", dot: "bg-[#998BB0]" },
};

export function CRMPipeline() {
  const [search, setSearch] = useState("");
  const filtered = LEADS.filter(
    (l) => !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.interest.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-ink">CRM & Lead Pipeline</h1>
          <p className="text-[#6B5E7A] mt-1">Every Instagram, WhatsApp and referral lead — tracked from first message to closed deal.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#998BB0]" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leads..." className="pl-10 w-64 rounded-xl bg-white" />
          </div>
          <Button className="bg-brand text-white hover:bg-brand-soft rounded-xl"><Plus className="h-4 w-4 mr-1" /> New Lead</Button>
        </div>
      </div>

      {/* Pipeline summary */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {LEAD_STAGES.map((stage) => {
          const items = filtered.filter((l) => l.stage === stage);
          const value = items.reduce((sum, l) => sum + l.budget, 0);
          return (
            <div key={stage} className="bg-white rounded-2xl p-4 border border-[#2A1A4A]/8">
              <div className="flex items-center gap-2 mb-2">
                <span className={`h-2 w-2 rounded-full ${stageColors[stage].dot}`} />
                <p className="text-[11px] font-bold text-ink uppercase tracking-wider truncate">{stage}</p>
              </div>
              <p className="text-2xl font-bold text-brand">{items.length}</p>
              <p className="text-[11px] text-[#6B5E7A] mt-1">{NGN_SHORT(value)} potential</p>
            </div>
          );
        })}
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto">
        {LEAD_STAGES.map((stage) => {
          const items = filtered.filter((l) => l.stage === stage);
          return (
            <div key={stage} className="bg-cream rounded-2xl p-3 min-h-[420px] border border-[#2A1A4A]/8">
              <div className="flex items-center justify-between mb-3 px-1">
                <p className="text-xs font-bold text-ink">{stage}</p>
                <span className="text-[10px] bg-white text-[#6B5E7A] px-2 py-0.5 rounded-full font-bold">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((lead) => (
                  <div key={lead.id} className="bg-white rounded-xl p-3 border border-[#2A1A4A]/5 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-bold text-ink leading-tight">{lead.name}</p>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${stageColors[stage].bg} ${stageColors[stage].text}`}>{lead.source}</span>
                    </div>
                    <p className="text-[11px] text-[#6B5E7A] mb-2 leading-snug">{lead.interest}</p>
                    <p className="text-sm font-bold text-coral mb-2">{NGN_SHORT(lead.budget)}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-[#2A1A4A]/5">
                      <p className="text-[10px] text-[#6B5E7A] truncate">👤 {lead.agent}</p>
                      <div className="flex gap-1">
                        <button className="h-7 w-7 rounded-full bg-naija/10 text-naija flex items-center justify-center hover:bg-naija hover:text-white transition-colors">
                          <Phone className="h-3 w-3" />
                        </button>
                        <button className="h-7 w-7 rounded-full bg-naija/10 text-naija flex items-center justify-center hover:bg-naija hover:text-white transition-colors">
                          <MessageCircle className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {items.length === 0 && <p className="text-[11px] text-[#998BB0] text-center py-6">No leads</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
