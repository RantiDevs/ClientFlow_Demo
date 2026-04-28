import { INSPECTIONS } from "../../lib/data";
import { CalendarCheck, Clock, MapPin, User, Plus } from "lucide-react";
import { Button } from "../ui/button";

const statusStyle: Record<string, string> = {
  "Confirmed": "bg-naija/15 text-naija",
  "Pending":   "bg-coral-soft text-coral",
  "Completed": "bg-[#E2DCFF] text-brand",
};

export function Inspections() {
  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-ink">Inspections & Viewings</h1>
          <p className="text-[#6B5E7A] mt-1">One shared calendar across Lagos, Abuja and Kano. Clients book online; agents stay aligned.</p>
        </div>
        <Button className="bg-coral text-white hover:bg-coral/90 rounded-xl shadow-coral"><Plus className="h-4 w-4 mr-1" /> Schedule Viewing</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-[#2A1A4A]/8">
          <CalendarCheck className="h-7 w-7 text-coral mb-3" />
          <p className="text-3xl font-bold text-ink">{INSPECTIONS.length}</p>
          <p className="text-xs text-[#6B5E7A] uppercase tracking-wider font-semibold mt-1">Scheduled this week</p>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-[#2A1A4A]/8">
          <Clock className="h-7 w-7 text-gold-deep mb-3" />
          <p className="text-3xl font-bold text-ink">{INSPECTIONS.filter((i) => i.status === "Confirmed").length}</p>
          <p className="text-xs text-[#6B5E7A] uppercase tracking-wider font-semibold mt-1">Confirmed</p>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-[#2A1A4A]/8">
          <User className="h-7 w-7 text-naija mb-3" />
          <p className="text-3xl font-bold text-ink">{new Set(INSPECTIONS.map((i) => i.agent)).size}</p>
          <p className="text-xs text-[#6B5E7A] uppercase tracking-wider font-semibold mt-1">Active agents</p>
        </div>
        <div className="bg-brand text-white rounded-3xl p-5">
          <MapPin className="h-7 w-7 text-coral mb-3" />
          <p className="text-3xl font-bold">{new Set(INSPECTIONS.map((i) => i.property)).size}</p>
          <p className="text-xs text-white/70 uppercase tracking-wider font-semibold mt-1">Properties shown</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#2A1A4A]/8 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#2A1A4A]/8">
          <h3 className="font-bold text-ink">Upcoming inspections</h3>
        </div>
        <div className="divide-y divide-[#2A1A4A]/5">
          {INSPECTIONS.map((insp) => (
            <div key={insp.id} className="px-6 py-4 flex flex-col md:flex-row md:items-center gap-3 hover:bg-cream/50 transition-colors">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="h-12 w-12 rounded-2xl bg-coral-soft flex items-center justify-center text-coral shrink-0">
                  <CalendarCheck className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-ink truncate">{insp.property}</p>
                  <p className="text-xs text-[#6B5E7A]">Visitor: <span className="font-semibold text-ink">{insp.visitor}</span> · Agent: {insp.agent}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold text-brand text-sm">{insp.date}</p>
                  <p className="text-xs text-[#6B5E7A]">{insp.time}</p>
                </div>
                <span className={`text-[10px] px-3 py-1.5 rounded-full font-bold ${statusStyle[insp.status] || "bg-cream text-ink"}`}>{insp.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
