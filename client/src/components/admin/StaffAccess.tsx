import { STAFF } from "../../lib/data";
import { Shield, Lock, UserCog, Plus, Building } from "lucide-react";
import { Button } from "../ui/button";

const roleStyle: Record<string, string> = {
  "CEO / Admin":    "bg-brand text-gold",
  "Branch Manager": "bg-coral text-white",
  "Senior Agent":   "bg-gold text-brand",
  "Agent":          "bg-naija/15 text-naija",
};

export function StaffAccess() {
  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-ink">Staff & Role-Based Access</h1>
          <p className="text-[#6B5E7A] mt-1">Lagos agents see Lagos data. Branch managers see their branch. CEO sees everything.</p>
        </div>
        <Button className="bg-brand text-white hover:bg-brand-soft rounded-xl"><Plus className="h-4 w-4 mr-1" /> Invite Staff</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-[#2A1A4A]/8">
          <UserCog className="h-7 w-7 text-coral mb-3" />
          <p className="text-3xl font-bold text-ink">{STAFF.length}</p>
          <p className="text-xs text-[#6B5E7A] uppercase tracking-wider font-semibold mt-1">Active staff</p>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-[#2A1A4A]/8">
          <Shield className="h-7 w-7 text-naija mb-3" />
          <p className="text-3xl font-bold text-ink">4</p>
          <p className="text-xs text-[#6B5E7A] uppercase tracking-wider font-semibold mt-1">Permission levels</p>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-[#2A1A4A]/8">
          <Building className="h-7 w-7 text-gold-deep mb-3" />
          <p className="text-3xl font-bold text-ink">3</p>
          <p className="text-xs text-[#6B5E7A] uppercase tracking-wider font-semibold mt-1">Branches connected</p>
        </div>
        <div className="bg-coral text-white rounded-3xl p-5">
          <Lock className="h-7 w-7 text-white/80 mb-3" />
          <p className="text-3xl font-bold">100%</p>
          <p className="text-xs text-white/80 uppercase tracking-wider font-semibold mt-1">Audit-logged actions</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#2A1A4A]/8 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#2A1A4A]/8">
          <h3 className="font-bold text-ink">All staff & permissions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr className="text-left text-xs uppercase tracking-wider font-bold text-[#6B5E7A]">
                <th className="px-6 py-3">Staff member</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Branch</th>
                <th className="px-6 py-3">Access scope</th>
                <th className="px-6 py-3 text-right">Properties</th>
                <th className="px-6 py-3 text-right">Deals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A1A4A]/5">
              {STAFF.map((s) => (
                <tr key={s.id} className="hover:bg-cream/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-brand-gradient text-white flex items-center justify-center text-xs font-bold">
                        {s.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-ink">{s.name}</p>
                        <p className="text-[11px] text-[#998BB0]">{s.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${roleStyle[s.role] || "bg-cream text-ink"}`}>{s.role}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-ink">{s.branch}</td>
                  <td className="px-6 py-4 text-xs text-[#6B5E7A]">{s.access}</td>
                  <td className="px-6 py-4 text-sm font-bold text-brand text-right">{s.assigned}</td>
                  <td className="px-6 py-4 text-sm font-bold text-coral text-right">{s.deals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
