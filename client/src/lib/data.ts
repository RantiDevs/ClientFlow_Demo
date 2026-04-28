import {
  Building2,
  Home,
  LandPlot,
  CreditCard,
  Wrench,
  FileText,
  MessageSquare,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

export type UserRole = "investor" | "tenant" | "admin" | "verdafarms";

/* ─── Currency helper (Nigerian Naira) ─── */
export const NGN = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);

export const NGN_SHORT = (n: number) => {
  if (n >= 1_000_000_000) return `₦${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}K`;
  return `₦${n.toLocaleString()}`;
};

export const MOCK_USER = {
  name: "Adaeze Okonkwo",
  email: "adaeze@rantidevs.ng",
  avatar: "https://i.pravatar.cc/256?u=adaeze",
};

/* ─── Nigerian property portfolio ─── */
export const PROJECTS = [
  {
    id: "p1",
    name: "Lekki Pearl Residences",
    type: "Luxury Apartments",
    location: "Lekki Phase 1, Lagos",
    status: "Active",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800",
    progress: 100,
    occupancy: 94,
    totalUnits: 48,
    roi: 18.5,
    valueNGN: 1_850_000_000,
    monthlyRentNGN: 2_500_000,
  },
  {
    id: "p2",
    name: "Maitama Heights Estate",
    type: "Land Development",
    location: "Maitama, Abuja FCT",
    status: "Completed",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
    progress: 100,
    occupancy: 0,
    totalUnits: 24,
    roi: 24.2,
    valueNGN: 980_000_000,
    monthlyRentNGN: 0,
  },
  {
    id: "p3",
    name: "Ikeja GRA Towers",
    type: "Construction",
    location: "Ikeja GRA, Lagos",
    status: "Under Construction",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80&w=800",
    progress: 65,
    milestones: [
      { name: "Foundation", completed: true },
      { name: "Structure", completed: true },
      { name: "Roofing", completed: true },
      { name: "Plumbing/Electrical", completed: false },
      { name: "Finishing", completed: false },
    ],
    occupancy: 0,
    totalUnits: 16,
    roi: 0,
    valueNGN: 1_200_000_000,
    monthlyRentNGN: 0,
  },
  {
    id: "p4",
    name: "Banana Island Villas",
    type: "Ultra-Luxury",
    location: "Banana Island, Lagos",
    status: "Active",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800",
    progress: 100,
    occupancy: 100,
    totalUnits: 8,
    roi: 16.8,
    valueNGN: 4_500_000_000,
    monthlyRentNGN: 8_000_000,
  },
];

export const FINANCIALS = [
  { month: "Jan", income: 18_500_000, expense: 4_200_000 },
  { month: "Feb", income: 19_800_000, expense: 3_900_000 },
  { month: "Mar", income: 21_200_000, expense: 5_400_000 },
  { month: "Apr", income: 22_500_000, expense: 4_100_000 },
  { month: "May", income: 24_100_000, expense: 4_700_000 },
  { month: "Jun", income: 25_400_000, expense: 4_300_000 },
];

export const TRANSACTIONS = [
  { id: 1, date: "2026-04-18", description: "Monthly Rent — Lekki Pearl Unit B-12", amount: 2_500_000, type: "income", status: "completed" },
  { id: 2, date: "2026-04-15", description: "Plumbing repair — Ikeja GRA", amount: -185_000, type: "expense", status: "completed" },
  { id: 3, date: "2026-04-12", description: "Management Fee (10%)", amount: -250_000, type: "expense", status: "completed" },
  { id: 4, date: "2026-04-10", description: "Service charge — Banana Island", amount: -680_000, type: "expense", status: "completed" },
  { id: 5, date: "2026-04-05", description: "Monthly Rent — Banana Island Villa #3", amount: 8_000_000, type: "income", status: "completed" },
  { id: 6, date: "2026-04-01", description: "Quarterly dividend payout", amount: 4_200_000, type: "income", status: "completed" },
];

export const MAINTENANCE_TICKETS = [
  { id: "t1", title: "AC Not Cooling", property: "Lekki Pearl — Unit B-12", status: "In Progress", date: "2026-04-22", priority: "High" },
  { id: "t2", title: "Generator Servicing Needed", property: "Lekki Pearl — Common Area", status: "Pending", date: "2026-04-25", priority: "Medium" },
  { id: "t3", title: "Borehole Pump Replacement", property: "Ikeja GRA Towers", status: "Resolved", date: "2026-04-15", priority: "High" },
  { id: "t4", title: "Gate Motor Repair", property: "Banana Island Villas", status: "In Progress", date: "2026-04-20", priority: "Low" },
];

export const MESSAGES = [
  { id: 1, from: "Rantidevs Support", content: "Your maintenance request has been scheduled for tomorrow at 10 AM. Vendor: Bayo's Tech.", time: "2h ago", unread: true },
  { id: 2, from: "System", content: "Rent payment of ₦2,500,000 received via Paystack. Receipt #PS-001294 sent.", time: "1d ago", unread: false },
  { id: 3, from: "Chinedu (Property Manager)", content: "Inspection scheduled for Banana Island unit on Friday at 2 PM.", time: "3d ago", unread: false },
];

export const DOCUMENTS = [
  { id: 1, name: "Tenancy Agreement.pdf", type: "PDF", size: "2.4 MB", date: "2026-01-01" },
  { id: 2, name: "March 2026 Statement.xlsx", type: "Excel", size: "1.1 MB", date: "2026-04-01" },
  { id: 3, name: "Certificate of Occupancy (C of O).pdf", type: "PDF", size: "3.2 MB", date: "2025-11-15" },
  { id: 4, name: "Property Survey — Lekki.pdf", type: "PDF", size: "8.1 MB", date: "2025-09-20" },
];

/* ─── CRM / Lead Pipeline ─── */
export type LeadStage = "New" | "Contacted" | "Viewing Booked" | "Negotiating" | "Closed Won" | "Lost";
export const LEAD_STAGES: LeadStage[] = ["New", "Contacted", "Viewing Booked", "Negotiating", "Closed Won", "Lost"];

export const LEADS = [
  { id: "L001", name: "Tunde Bakare", source: "Instagram", interest: "Lekki Pearl Residences", phone: "+234 803 412 8821", stage: "New" as LeadStage, budget: 250_000_000, addedDays: 0, agent: "Funke Adeyemi" },
  { id: "L002", name: "Mrs. Halima Yusuf", source: "WhatsApp", interest: "Maitama Heights — 2 plots", phone: "+234 802 991 4412", stage: "Contacted" as LeadStage, budget: 180_000_000, addedDays: 1, agent: "Funke Adeyemi" },
  { id: "L003", name: "Emeka Nwosu", source: "Referral", interest: "Banana Island Villa", phone: "+234 818 220 7733", stage: "Viewing Booked" as LeadStage, budget: 950_000_000, addedDays: 2, agent: "David Okafor" },
  { id: "L004", name: "Aisha Mohammed", source: "Website", interest: "Ikeja GRA Tower (off-plan)", phone: "+234 706 558 1102", stage: "Viewing Booked" as LeadStage, budget: 120_000_000, addedDays: 3, agent: "David Okafor" },
  { id: "L005", name: "Chuka Anyanwu", source: "Facebook", interest: "Verda Cashew plots", phone: "+234 909 122 8845", stage: "Negotiating" as LeadStage, budget: 22_000_000, addedDays: 5, agent: "Funke Adeyemi" },
  { id: "L006", name: "Mr. & Mrs. Olamide", source: "WhatsApp", interest: "Lekki Pearl 3-bed", phone: "+234 805 110 9933", stage: "Negotiating" as LeadStage, budget: 195_000_000, addedDays: 6, agent: "David Okafor" },
  { id: "L007", name: "Senator R. Akpabio", source: "Referral", interest: "Banana Island Villa", phone: "+234 803 887 1100", stage: "Closed Won" as LeadStage, budget: 1_400_000_000, addedDays: 12, agent: "Funke Adeyemi" },
  { id: "L008", name: "Kemi Adekoya", source: "Instagram", interest: "Verda Cassava farm", phone: "+234 807 552 4421", stage: "Lost" as LeadStage, budget: 6_500_000, addedDays: 20, agent: "David Okafor" },
];

/* ─── Inspections ─── */
export const INSPECTIONS = [
  { id: "INS001", property: "Lekki Pearl Residences — Unit B-12", visitor: "Tunde Bakare", date: "2026-05-02", time: "10:00 AM", agent: "Funke Adeyemi", status: "Confirmed" },
  { id: "INS002", property: "Maitama Heights Estate", visitor: "Mrs. Halima Yusuf", date: "2026-05-03", time: "2:00 PM", agent: "David Okafor", status: "Confirmed" },
  { id: "INS003", property: "Banana Island Villas", visitor: "Emeka Nwosu", date: "2026-05-05", time: "11:30 AM", agent: "Funke Adeyemi", status: "Pending" },
  { id: "INS004", property: "Ikeja GRA Towers (site visit)", visitor: "Aisha Mohammed", date: "2026-05-06", time: "3:00 PM", agent: "David Okafor", status: "Confirmed" },
];

/* ─── E-Signature contracts ─── */
export const CONTRACTS = [
  { id: "CON001", title: "Tenancy Agreement — Lekki Pearl Unit B-12", parties: ["Tunde Bakare", "Rantidevs ClientFlow Ltd."], status: "Signed", date: "2026-04-18", value: 30_000_000 },
  { id: "CON002", title: "Sale of Plot — Maitama Heights", parties: ["Mrs. Halima Yusuf", "Rantidevs ClientFlow Ltd."], status: "Awaiting Signature", date: "2026-04-22", value: 180_000_000 },
  { id: "CON003", title: "Service Agreement — Banana Island", parties: ["Senator R. Akpabio", "Rantidevs ClientFlow Ltd."], status: "Draft", date: "2026-04-24", value: 1_400_000_000 },
  { id: "CON004", title: "Investor Agreement — Verda Cashew", parties: ["Chuka Anyanwu", "Verda Farms"], status: "Signed", date: "2026-04-10", value: 22_000_000 },
];

/* ─── Commission tracker ─── */
export const COMMISSIONS = [
  { id: "C001", agent: "Funke Adeyemi", deal: "Banana Island Villa — Senator Akpabio", amount: 70_000_000, rate: "5%", status: "Paid", date: "2026-04-15", branch: "Lagos" },
  { id: "C002", agent: "David Okafor", deal: "Lekki Pearl B-12 — Tunde Bakare", amount: 1_500_000, rate: "5%", status: "Paid", date: "2026-04-18", branch: "Lagos" },
  { id: "C003", agent: "Funke Adeyemi", deal: "Verda Cashew — Chuka Anyanwu", amount: 1_100_000, rate: "5%", status: "Paid", date: "2026-04-10", branch: "Lagos" },
  { id: "C004", agent: "David Okafor", deal: "Maitama Plot — Halima Yusuf", amount: 9_000_000, rate: "5%", status: "Pending", date: "2026-04-25", branch: "Abuja" },
  { id: "C005", agent: "Ifeoma Eze", deal: "Kano Estate Plot 14", amount: 2_400_000, rate: "6%", status: "Pending", date: "2026-04-20", branch: "Kano" },
];

/* ─── Branches ─── */
export const BRANCHES = [
  { id: "B-LAG", name: "Lagos HQ", city: "Victoria Island, Lagos", staff: 12, properties: 18, revenueMTD: 84_500_000 },
  { id: "B-ABV", name: "Abuja Branch", city: "Wuse 2, Abuja", staff: 7, properties: 9, revenueMTD: 41_200_000 },
  { id: "B-KAN", name: "Kano Branch", city: "Nasarawa GRA, Kano", staff: 4, properties: 5, revenueMTD: 14_800_000 },
];

/* ─── Staff / role-based access ─── */
export const STAFF = [
  { id: "S001", name: "Funke Adeyemi", role: "Senior Agent", branch: "Lagos HQ", access: "Lagos properties only", assigned: 8, deals: 14 },
  { id: "S002", name: "David Okafor", role: "Agent", branch: "Lagos HQ", access: "Lagos properties only", assigned: 6, deals: 9 },
  { id: "S003", name: "Ifeoma Eze", role: "Agent", branch: "Kano Branch", access: "Kano properties only", assigned: 5, deals: 4 },
  { id: "S004", name: "Aliyu Bello", role: "Branch Manager", branch: "Abuja Branch", access: "All Abuja properties + reports", assigned: 9, deals: 11 },
  { id: "S005", name: "Adaeze Okonkwo", role: "CEO / Admin", branch: "Lagos HQ", access: "Full system access", assigned: 32, deals: 38 },
];

/* ─── Activity / engagement intel ─── */
export const ACTIVITY_FEED = [
  { id: "A1", actor: "Tunde Bakare", action: "Viewed Lekki Pearl B-12 listing", role: "Lead", time: "8 minutes ago", important: true },
  { id: "A2", actor: "Senator R. Akpabio", action: "Signed Banana Island contract", role: "Investor", time: "1 hour ago", important: true },
  { id: "A3", actor: "Mrs. Yusuf", action: "Opened Maitama plot brochure", role: "Lead", time: "2 hours ago", important: false },
  { id: "A4", actor: "Adaeze Tenant", action: "Logged into tenant portal", role: "Tenant", time: "4 hours ago", important: false },
  { id: "A5", actor: "Chuka Anyanwu", action: "Viewed Verda Cashew investor pack 3 times", role: "Investor", time: "Today", important: true },
  { id: "A6", actor: "Aisha Mohammed", action: "Booked inspection for Ikeja GRA", role: "Lead", time: "Today", important: true },
];

/* ─── Referrals ─── */
export const REFERRALS = [
  { id: "R1", referrer: "Senator R. Akpabio", newClient: "Halima Yusuf", reward: 2_500_000, status: "Paid", date: "2026-03-15" },
  { id: "R2", referrer: "Chuka Anyanwu", newClient: "Kemi Adekoya", reward: 250_000, status: "Pending", date: "2026-04-12" },
  { id: "R3", referrer: "Funke Adeyemi (staff)", newClient: "Emeka Nwosu", reward: 1_200_000, status: "Paid", date: "2026-04-05" },
];

/* ─── Broadcasts ─── */
export const BROADCASTS = [
  { id: "BC1", title: "Service charge reminder — May 2026", channel: "WhatsApp + In-app", recipients: "All tenants (132)", sent: "2026-04-25", openRate: 88 },
  { id: "BC2", title: "Q1 Investor Returns Statement", channel: "Email + In-app", recipients: "All investors (48)", sent: "2026-04-15", openRate: 96 },
  { id: "BC3", title: "New listing — Banana Island Villa #4", channel: "WhatsApp", recipients: "Hot leads (24)", sent: "2026-04-10", openRate: 79 },
];

/* ===== VERDA FARMS MOCK DATA (Nigerianized) ===== */

export type CropStatus = "Preparing" | "Planted" | "Growing" | "Harvesting" | "Sold";

export interface FarmPlot {
  id: string;
  plotName: string;
  sizeSqm: number;
  crop: string;
  plantingDate: string;
  expectedHarvestDate: string;
  roiProjection: number;
  farmManager: string;
  farmManagerAvatar: string;
  status: CropStatus;
  image: string;
}

export interface FarmReport {
  id: string;
  month: string;
  growthStage: string;
  photoUrl: string;
  expenses: { label: string; amount: number }[];
  weatherNotes: string;
  yieldProjection: string;
  date: string;
}

export interface FarmDocument {
  id: string;
  name: string;
  type: "upload" | "download";
  category: string;
  size: string;
  date: string;
  status: "Signed" | "Pending" | "Available";
}

export const FARM_PLOTS: FarmPlot[] = [
  {
    id: "fp1",
    plotName: "Plot A — Ogun Sector",
    sizeSqm: 2500,
    crop: "Cashew",
    plantingDate: "2025-03-15",
    expectedHarvestDate: "2026-09-20",
    roiProjection: 24.5,
    farmManager: "Adebayo Ogunleye",
    farmManagerAvatar: "https://i.pravatar.cc/150?u=adebayo",
    status: "Growing",
    image: "https://images.unsplash.com/photo-1697567464321-3c152e4ba831?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXNoZXclMjB0cmVlJTIwcGxhbnRhdGlvbiUyMHRyb3BpY2FsfGVufDF8fHx8MTc3MjYyNTQyN3ww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "fp2",
    plotName: "Plot B — Benue Riverside",
    sizeSqm: 1800,
    crop: "Cassava",
    plantingDate: "2025-06-01",
    expectedHarvestDate: "2026-02-15",
    roiProjection: 18.0,
    farmManager: "Ngozi Eze",
    farmManagerAvatar: "https://i.pravatar.cc/150?u=ngozi",
    status: "Planted",
    image: "https://images.unsplash.com/photo-1758614312118-4f7cd900ab26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXNzYXZhJTIwZmFybSUyMGhhcnZlc3QlMjBhZ3JpY3VsdHVyZXxlbnwxfHx8fDE3NzI2MjU0Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "fp3",
    plotName: "Plot C — Oyo Hilltop",
    sizeSqm: 3200,
    crop: "Mixed Tomato & Pepper",
    plantingDate: "2025-01-10",
    expectedHarvestDate: "2025-12-01",
    roiProjection: 28.3,
    farmManager: "Adebayo Ogunleye",
    farmManagerAvatar: "https://i.pravatar.cc/150?u=adebayo",
    status: "Harvesting",
    image: "https://images.unsplash.com/photo-1686008674009-876c599f1fe9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXJpYWwlMjBmYXJtJTIwcGxhbnRhdGlvbiUyMGdyZWVuJTIwY3JvcHN8ZW58MXx8fHwxNzcyNjI1NDI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "fp4",
    plotName: "Plot D — Kaduna Valley",
    sizeSqm: 1500,
    crop: "Cashew",
    plantingDate: "2025-11-01",
    expectedHarvestDate: "2027-05-15",
    roiProjection: 22.0,
    farmManager: "Ngozi Eze",
    farmManagerAvatar: "https://i.pravatar.cc/150?u=ngozi",
    status: "Preparing",
    image: "https://images.unsplash.com/photo-1697567464321-3c152e4ba831?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXNoZXclMjB0cmVlJTIwcGxhbnRhdGlvbiUyMHRyb3BpY2FsfGVufDF8fHx8MTc3MjYyNTQyN3ww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

export const FARM_REPORTS: FarmReport[] = [
  {
    id: "fr1",
    month: "February 2026",
    growthStage: "Flowering",
    photoUrl: "https://images.unsplash.com/photo-1697567464321-3c152e4ba831?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXNoZXclMjB0cmVlJTIwcGxhbnRhdGlvbiUyMHRyb3BpY2FsfGVufDF8fHx8MTc3MjYyNTQyN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    expenses: [
      { label: "Labor", amount: 480_000 },
      { label: "Fertilizer", amount: 180_000 },
      { label: "Irrigation", amount: 120_000 },
      { label: "Pest Control", amount: 72_000 },
    ],
    weatherNotes: "Harmattan extended by 2 weeks. Supplemental irrigation deployed. No crop damage reported.",
    yieldProjection: "On track — estimated 2.8 tonnes/hectare",
    date: "2026-02-28",
  },
  {
    id: "fr2",
    month: "January 2026",
    growthStage: "Vegetative Growth",
    photoUrl: "https://images.unsplash.com/photo-1686008674009-876c599f1fe9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXJpYWwlMjBmYXJtJTIwcGxhbnRhdGlvbiUyMGdyZWVuJTIwY3JvcHN8ZW58MXx8fHwxNzcyNjI1NDI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    expenses: [
      { label: "Labor", amount: 440_000 },
      { label: "Fertilizer", amount: 240_000 },
      { label: "Equipment Maintenance", amount: 100_000 },
    ],
    weatherNotes: "Good rainfall in southern plots. Soil moisture optimal. Growth above average.",
    yieldProjection: "Above average — estimated 3.0 tonnes/hectare",
    date: "2026-01-31",
  },
  {
    id: "fr3",
    month: "December 2025",
    growthStage: "Seedling Establishment",
    photoUrl: "https://images.unsplash.com/photo-1758614312118-4f7cd900ab26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXNzYXZhJTIwZmFybSUyMGhhcnZlc3QlMjBhZ3JpY3VsdHVyZXxlbnwxfHx8fDE3NzI2MjU0Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    expenses: [
      { label: "Seedlings", amount: 800_000 },
      { label: "Land Preparation", amount: 600_000 },
      { label: "Labor", amount: 360_000 },
    ],
    weatherNotes: "Transition to dry season. Mulching applied to retain moisture.",
    yieldProjection: "Early stage — projections pending",
    date: "2025-12-31",
  },
];

export const FARM_DOCUMENTS: FarmDocument[] = [
  { id: "fd1", name: "Investment Contract", type: "download", category: "Agreement", size: "1.8 MB", date: "2025-03-01", status: "Signed" },
  { id: "fd2", name: "Land Allocation Certificate", type: "download", category: "Certificate", size: "2.1 MB", date: "2025-03-01", status: "Available" },
  { id: "fd3", name: "Farm Management Agreement", type: "download", category: "Agreement", size: "1.5 MB", date: "2025-03-15", status: "Signed" },
  { id: "fd4", name: "Q4 2025 Harvest Report", type: "download", category: "Report", size: "3.2 MB", date: "2025-12-31", status: "Available" },
  { id: "fd5", name: "Sales Receipt — Batch #12", type: "download", category: "Receipt", size: "0.8 MB", date: "2026-01-15", status: "Available" },
  { id: "fd6", name: "NIN / Government ID", type: "upload", category: "KYC", size: "—", date: "2025-03-01", status: "Signed" },
  { id: "fd7", name: "Signed Agreement Copy", type: "upload", category: "Agreement", size: "—", date: "—", status: "Pending" },
];

export const CROP_PORTFOLIO = [
  {
    id: "crop1",
    name: "Cashew",
    description: "High-value tree crop with 18-month cycle. Excellent long-term ROI with strong export demand from India & Vietnam.",
    cycleDuration: "18 months",
    avgRoi: "22-28%",
    riskLevel: "Low",
    pricePerPlot: 2_500_000,
    image: "https://images.unsplash.com/photo-1697567464321-3c152e4ba831?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXNoZXclMjB0cmVlJTIwcGxhbnRhdGlvbiUyMHRyb3BpY2FsfGVufDF8fHx8MTc3MjYyNTQyN3ww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "crop2",
    name: "Cassava",
    description: "Staple food crop with 8-12 month cycle. Strong local demand from garri, fufu, and starch industries.",
    cycleDuration: "8-12 months",
    avgRoi: "16-22%",
    riskLevel: "Low",
    pricePerPlot: 850_000,
    image: "https://images.unsplash.com/photo-1758614312118-4f7cd900ab26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXNzYXZhJTIwZmFybSUyMGhhcnZlc3QlMjBhZ3JpY3VsdHVyZXxlbnwxfHx8fDE3NzI2MjU0Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "crop3",
    name: "Managed Mixed Portfolio",
    description: "Verda's experts choose the optimal crop mix (cashew, cassava, maize, vegetables) based on soil, market, and rainfall.",
    cycleDuration: "Variable",
    avgRoi: "24-32%",
    riskLevel: "Medium",
    pricePerPlot: 1_500_000,
    image: "https://images.unsplash.com/photo-1686008674009-876c599f1fe9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXJpYWwlMjBmYXJtJTIwcGxhbnRhdGlvbiUyMGdyZWVuJTIwY3JvcHN8ZW58MXx8fHwxNzcyNjI1NDI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

export const FARM_YIELD_DATA = [
  { month: "Sep", projected: 0, actual: 0 },
  { month: "Oct", projected: 200, actual: 180 },
  { month: "Nov", projected: 450, actual: 420 },
  { month: "Dec", projected: 800, actual: 750 },
  { month: "Jan", projected: 1200, actual: 1150 },
  { month: "Feb", projected: 1800, actual: 1720 },
];
