import { useState } from "react";
import { FolderLock, FileText, Search, Upload, Lock, ShieldCheck, Filter, Download } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const VAULT_DOCS = [
  { id: "VD1", name: "Lekki Pearl — Certificate of Occupancy", category: "C of O",       property: "Lekki Pearl",     size: "3.2 MB", date: "2024-08-12", encrypted: true },
  { id: "VD2", name: "Maitama Heights Survey Plan",            category: "Survey",        property: "Maitama Heights", size: "8.7 MB", date: "2024-09-04", encrypted: true },
  { id: "VD3", name: "Banana Island Deed of Assignment",       category: "Deed",          property: "Banana Island",   size: "2.1 MB", date: "2025-02-18", encrypted: true },
  { id: "VD4", name: "Tunde Bakare — Tenancy Agreement",       category: "Tenancy",       property: "Lekki Pearl B-12", size: "1.4 MB", date: "2026-04-18", encrypted: true },
  { id: "VD5", name: "Senator Akpabio — Sale Agreement",       category: "Sale",          property: "Banana Island",   size: "2.9 MB", date: "2026-04-15", encrypted: true },
  { id: "VD6", name: "Ikeja GRA — Building Approval",          category: "Approval",      property: "Ikeja GRA Towers", size: "4.6 MB", date: "2024-11-22", encrypted: true },
  { id: "VD7", name: "Halima Yusuf — KYC (NIN + Utility)",     category: "KYC",           property: "—",                size: "2.0 MB", date: "2026-04-20", encrypted: true },
  { id: "VD8", name: "Lekki Pearl — Insurance Cover Note",     category: "Insurance",     property: "Lekki Pearl",     size: "0.9 MB", date: "2026-01-08", encrypted: true },
];

const categories = ["All", "C of O", "Survey", "Deed", "Tenancy", "Sale", "KYC", "Insurance", "Approval"];
const categoryColor: Record<string, string> = {
  "C of O":     "bg-coral text-white",
  "Survey":     "bg-gold text-brand",
  "Deed":       "bg-brand text-gold",
  "Tenancy":    "bg-naija text-white",
  "Sale":       "bg-coral text-white",
  "KYC":        "bg-[#E2DCFF] text-brand",
  "Insurance":  "bg-[#FFD4DD] text-coral",
  "Approval":   "bg-[#FBE9C8] text-gold-deep",
};

export function DocumentVault() {
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("All");
  const filtered = VAULT_DOCS.filter(
    (d) =>
      (active === "All" || d.category === active) &&
      (!search || d.name.toLowerCase().includes(search.toLowerCase()) || d.property.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-ink flex items-center gap-2">
            <FolderLock className="h-7 w-7 text-coral" /> Document Vault
          </h1>
          <p className="text-[#6B5E7A] mt-1">Every C of O, deed, survey and KYC — encrypted, tagged and audit-logged.</p>
        </div>
        <Button className="bg-coral text-white hover:bg-coral/90 rounded-xl shadow-coral">
          <Upload className="h-4 w-4 mr-2" /> Upload Document
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-brand text-white rounded-3xl p-5">
          <FileText className="h-7 w-7 text-coral mb-3" />
          <p className="text-3xl font-bold">{VAULT_DOCS.length}</p>
          <p className="text-xs text-white/70 uppercase tracking-wider font-semibold mt-1">Total documents</p>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-[#2A1A4A]/8">
          <ShieldCheck className="h-7 w-7 text-naija mb-3" />
          <p className="text-3xl font-bold text-ink">100%</p>
          <p className="text-xs text-[#6B5E7A] uppercase tracking-wider font-semibold mt-1">AES-256 encrypted</p>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-[#2A1A4A]/8">
          <Lock className="h-7 w-7 text-coral mb-3" />
          <p className="text-3xl font-bold text-ink">2-FA</p>
          <p className="text-xs text-[#6B5E7A] uppercase tracking-wider font-semibold mt-1">Required to download</p>
        </div>
        <div className="bg-gold-gradient rounded-3xl p-5 text-brand">
          <Filter className="h-7 w-7 mb-3" />
          <p className="text-3xl font-bold">{categories.length - 1}</p>
          <p className="text-xs uppercase tracking-wider font-semibold mt-1 opacity-80">Document types</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#998BB0]" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search documents or properties..." className="pl-10 rounded-xl bg-white" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                active === c ? "bg-brand text-white" : "bg-white text-[#6B5E7A] hover:bg-cream border border-[#2A1A4A]/8"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((d) => (
          <div key={d.id} className="bg-white rounded-3xl p-5 border border-[#2A1A4A]/8 hover:shadow-md hover:border-coral/30 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className="h-11 w-11 rounded-2xl bg-cream flex items-center justify-center text-brand">
                <FileText className="h-5 w-5" />
              </div>
              <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${categoryColor[d.category] || "bg-cream text-ink"}`}>{d.category}</span>
            </div>
            <p className="font-bold text-ink text-sm leading-snug mb-1">{d.name}</p>
            <p className="text-[11px] text-[#6B5E7A] mb-3">📍 {d.property}</p>
            <div className="flex items-center justify-between pt-3 border-t border-[#2A1A4A]/5">
              <div className="text-[10px] text-[#998BB0]">
                {d.size} · {d.date}
                {d.encrypted && <span className="ml-1.5 text-naija">🔒</span>}
              </div>
              <button className="opacity-60 group-hover:opacity-100 transition-opacity h-8 w-8 rounded-lg bg-cream hover:bg-coral hover:text-white text-brand flex items-center justify-center">
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
