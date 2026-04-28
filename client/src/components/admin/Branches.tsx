import { BRANCHES, NGN, NGN_SHORT } from "../../lib/data";
import { GitBranch, Users, Building, TrendingUp, MapPin } from "lucide-react";

export function Branches() {
  const totalRevenue = BRANCHES.reduce((s, b) => s + b.revenueMTD, 0);
  const totalStaff = BRANCHES.reduce((s, b) => s + b.staff, 0);
  const totalProps = BRANCHES.reduce((s, b) => s + b.properties, 0);

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">Multi-Branch Operations</h1>
        <p className="text-[#6B5E7A] mt-1">One login. Lagos, Abuja and Kano — separate P&L, shared intelligence.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-brand text-white rounded-3xl p-6">
          <TrendingUp className="h-8 w-8 text-coral mb-3" />
          <p className="text-3xl font-bold">{NGN_SHORT(totalRevenue)}</p>
          <p className="text-sm text-white/70 mt-1">Combined revenue MTD</p>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-[#2A1A4A]/8">
          <Users className="h-8 w-8 text-coral mb-3" />
          <p className="text-3xl font-bold text-ink">{totalStaff}</p>
          <p className="text-sm text-[#6B5E7A] mt-1">Staff across all branches</p>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-[#2A1A4A]/8">
          <Building className="h-8 w-8 text-naija mb-3" />
          <p className="text-3xl font-bold text-ink">{totalProps}</p>
          <p className="text-sm text-[#6B5E7A] mt-1">Total properties managed</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {BRANCHES.map((b, i) => {
          const accent = ["bg-coral", "bg-gold", "bg-naija"][i];
          const accentText = ["text-white", "text-brand", "text-white"][i];
          const share = (b.revenueMTD / totalRevenue) * 100;
          return (
            <div key={b.id} className="bg-white rounded-3xl border border-[#2A1A4A]/8 overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`${accent} ${accentText} p-6`}>
                <div className="flex items-center gap-3 mb-2">
                  <GitBranch className="h-6 w-6" />
                  <h3 className="font-bold text-xl">{b.name}</h3>
                </div>
                <p className={`text-sm flex items-center gap-1.5 ${i === 1 ? "opacity-80" : "text-white/80"}`}>
                  <MapPin className="h-3.5 w-3.5" />{b.city}
                </p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider font-bold text-[#6B5E7A] mb-1">Revenue MTD</p>
                  <p className="text-2xl font-bold text-coral">{NGN(b.revenueMTD)}</p>
                  <div className="h-2 bg-cream rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-brand-gradient rounded-full" style={{ width: `${share}%` }} />
                  </div>
                  <p className="text-[11px] text-[#998BB0] mt-1">{share.toFixed(1)}% of total agency revenue</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#2A1A4A]/5">
                  <div>
                    <p className="text-xs text-[#6B5E7A]">Staff</p>
                    <p className="text-lg font-bold text-ink">{b.staff}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B5E7A]">Properties</p>
                    <p className="text-lg font-bold text-ink">{b.properties}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
