import React from "react";
import {
  LayoutDashboard,
  Building,
  Wallet,
  FileText,
  MessageSquare,
  LogOut,
  Bell,
  Menu,
  Wrench,
  CreditCard,
  Users,
  Search,
  Settings,
  Briefcase,
  Sprout,
  Leaf,
  BarChart3,
  Network,
  CalendarCheck,
  FileSignature,
  TrendingUp,
  Megaphone,
  Activity,
  GitBranch,
  Sparkles,
  FolderLock,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "../ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { MOCK_USER, UserRole } from "../../lib/data";
import logoUrl from "../../assets/logo.png";

interface AppLayoutProps {
  children: React.ReactNode;
  role: UserRole;
  onLogout: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentUser?: { name: string; email: string; avatar?: string } | null;
}

export function AppLayout({
  children,
  role,
  onLogout,
  activeTab,
  onTabChange,
  currentUser,
}: AppLayoutProps) {
  const displayUser = currentUser || MOCK_USER;
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const getNavItems = (role: UserRole) => {
    switch (role) {
      case "investor":
        return [
          { id: "dashboard", label: "Overview", icon: LayoutDashboard },
          { id: "portfolio", label: "Portfolio", icon: Building },
          { id: "wallet", label: "Wallet", icon: Wallet },
          { id: "messages", label: "Messages", icon: MessageSquare },
          { id: "documents", label: "Reports", icon: FileText },
        ];
      case "tenant":
        return [
          { id: "dashboard", label: "Overview", icon: LayoutDashboard },
          { id: "payments", label: "Pay Rent", icon: CreditCard },
          { id: "maintenance", label: "Services", icon: Wrench },
          { id: "messages", label: "Messages", icon: MessageSquare },
        ];
      case "admin":
        return [
          { id: "dashboard",    label: "Dashboard",    icon: LayoutDashboard, group: "Overview" },
          { id: "crm",          label: "CRM Pipeline", icon: Network,         group: "Sales" },
          { id: "inspections",  label: "Inspections",  icon: CalendarCheck,   group: "Sales" },
          { id: "contracts",    label: "E-Signatures", icon: FileSignature,   group: "Sales" },
          { id: "properties",   label: "Properties",   icon: Building,        group: "Operations" },
          { id: "tenants",      label: "Tenants",      icon: Users,           group: "Operations" },
          { id: "investors",    label: "Investors",    icon: Briefcase,       group: "Operations" },
          { id: "transactions", label: "Transactions", icon: Wallet,          group: "Operations" },
          { id: "maintenance",  label: "Maintenance",  icon: Wrench,          group: "Operations" },
          { id: "vault",        label: "Document Vault", icon: FolderLock,    group: "Operations" },
          { id: "commissions",  label: "Commissions",  icon: TrendingUp,      group: "Agency" },
          { id: "broadcasts",   label: "Broadcasts",   icon: Megaphone,       group: "Agency" },
          { id: "activity",     label: "Activity Intel", icon: Activity,      group: "Agency" },
          { id: "branches",     label: "Branches",     icon: GitBranch,       group: "Agency" },
          { id: "staff",        label: "Staff & Roles", icon: Users,          group: "Agency" },
          { id: "referrals",    label: "Referrals",    icon: Sparkles,        group: "Agency" },
        ];
      case "verdafarms":
        return [
          { id: "dashboard", label: "Overview", icon: LayoutDashboard },
          { id: "crops", label: "Crop Portfolio", icon: Sprout },
          { id: "farm-reports", label: "Reports", icon: BarChart3 },
          { id: "farm-documents", label: "Documents", icon: FileText },
          { id: "feedback", label: "Feedback", icon: MessageSquare },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems(role);

  // Group admin items by section
  const groupedItems: Array<{ group?: string; items: typeof navItems }> = (() => {
    if (role !== "admin") return [{ items: navItems }];
    const groups: Record<string, typeof navItems> = {};
    const order: string[] = [];
    for (const item of navItems) {
      const g = (item as any).group || "Menu";
      if (!groups[g]) { groups[g] = []; order.push(g); }
      groups[g].push(item);
    }
    return order.map((g) => ({ group: g, items: groups[g] }));
  })();

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white">
      {/* Logo Area */}
      <div className="flex h-24 items-center px-6 border-b border-[#2A1A4A]/8">
        <img src={logoUrl} alt="Rantidevs ClientFlow" className="h-11 w-11 object-contain mr-3 shrink-0" />
        <div className="leading-tight">
          <p className="text-[9px] uppercase tracking-[0.22em] text-gold-deep font-semibold">Rantidevs</p>
          <span className="text-base font-bold text-ink tracking-tight">
            ClientFlow
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
        {groupedItems.map((section, sIdx) => (
          <div key={section.group ?? sIdx} className={sIdx > 0 ? "pt-4" : ""}>
            {section.group && (
              <p className="px-4 text-[10px] font-bold text-[#998BB0] uppercase tracking-[0.18em] mb-2">
                {section.group}
              </p>
            )}
            {section.items.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setIsMobileOpen(false);
                }}
                className={`group flex w-full items-center px-3.5 py-2.5 text-sm font-medium rounded-2xl transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-brand text-white shadow-brand"
                    : "text-[#6B5E7A] hover:bg-cream hover:text-brand"
                }`}
              >
                <item.icon
                  className={`mr-3 h-[18px] w-[18px] shrink-0 transition-colors ${
                    activeTab === item.id
                      ? "text-coral"
                      : "text-[#998BB0] group-hover:text-coral"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>
        ))}

        <div className="pt-5">
          <p className="px-4 text-[10px] font-bold text-[#998BB0] uppercase tracking-[0.18em] mb-2">
            Account
          </p>
          <button
            onClick={() => {
              onTabChange("settings");
              setIsMobileOpen(false);
            }}
            className={`flex w-full items-center px-3.5 py-2.5 text-sm font-medium rounded-2xl transition-all ${
              activeTab === "settings"
                ? "bg-brand text-white shadow-brand"
                : "text-[#6B5E7A] hover:bg-cream hover:text-brand"
            }`}
          >
            <Settings
              className={`mr-3 h-[18px] w-[18px] transition-colors ${
                activeTab === "settings" ? "text-coral" : "text-[#998BB0]"
              }`}
            />
            Settings
          </button>
          <button
            onClick={onLogout}
            className="flex w-full items-center px-3.5 py-2.5 text-sm font-medium rounded-2xl text-[#6B5E7A] hover:bg-coral-soft hover:text-coral transition-all"
          >
            <LogOut className="mr-3 h-[18px] w-[18px] text-[#998BB0]" />
            Exit demo
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="p-4 border-t border-[#2A1A4A]/8">
        <div className="bg-cream rounded-2xl p-3 flex items-center border border-[#2A1A4A]/5">
          <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
            <AvatarImage src={displayUser.avatar} />
            <AvatarFallback className="bg-brand text-gold text-xs">
              {displayUser.name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3 overflow-hidden flex-1 min-w-0">
            <p className="text-sm font-bold text-ink truncate">
              {displayUser.name}
            </p>
            <p className="text-[11px] text-[#6B5E7A] truncate capitalize">
              {role === "verdafarms" ? "Verda Farms" : role} demo
            </p>
          </div>
          <div className="h-2 w-2 rounded-full bg-naija ml-1 shrink-0" title="Demo session active" />
        </div>
      </div>
    </div>
  );

  const navItemsBottom = navItems.slice(0, 4);

  return (
    <div className="flex h-screen bg-cream bg-hex-pattern">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-[260px] md:flex-col shrink-0 m-4 ml-4 rounded-[28px] overflow-hidden shadow-md border border-[#2A1A4A]/8">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Header */}
        <header className="flex h-16 md:h-24 items-center justify-between px-4 md:px-8 z-10 shrink-0">
          {/* Mobile: hamburger */}
          <div className="flex items-center md:hidden">
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-brand">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="p-0 w-[280px] border-r-0 rounded-r-[28px]"
              >
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Navigation menu
                </SheetDescription>
                <SidebarContent />
              </SheetContent>
            </Sheet>
          </div>

          {/* Mobile: centered logo */}
          <div className="flex md:hidden items-center absolute left-1/2 -translate-x-1/2">
            <img src={logoUrl} alt="Rantidevs" className="h-8 w-8 object-contain mr-2" />
            <span className="text-base font-bold text-ink tracking-tight">ClientFlow</span>
          </div>

          {/* Desktop: greeting */}
          <div className="hidden md:flex flex-col">
            <h1 className="text-2xl font-bold text-ink">
              Welcome back, {displayUser.name?.split(" ")[0] || "there"}! <span className="text-coral">👋</span>
            </h1>
            <p className="text-[#6B5E7A] text-sm">
              {role === "verdafarms"
                ? "Here's what's happening across your farm investments today."
                : role === "tenant"
                ? "Manage rent, services and your agreements in one place."
                : role === "investor"
                ? "Live ROI, dividends and portfolio performance — all in Naira."
                : "Run every branch, agent and lead from this command center."}
            </p>
          </div>

          {/* Desktop: search + bell */}
          <div className="hidden md:flex items-center space-x-3 bg-white p-2 pr-5 rounded-full shadow-sm border border-[#2A1A4A]/8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#998BB0]" />
              <Input
                placeholder="Search anything..."
                className="pl-11 border-none bg-transparent shadow-none w-56 focus-visible:ring-0 text-sm"
              />
            </div>
            <div className="h-7 w-[1px] bg-[#2A1A4A]/10"></div>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-[#6B5E7A] hover:text-coral"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-coral rounded-full border-2 border-white"></span>
            </Button>
          </div>

          {/* Mobile: bell icon only */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-brand"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-coral rounded-full border-2 border-white"></span>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto px-4 md:px-8 pb-24 md:pb-8">
          <div className="mx-auto max-w-[1600px] animate-in fade-in duration-300">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#2A1A4A]/10 shadow-lg z-50">
          <div className="flex items-center justify-around px-2 py-2">
            {navItemsBottom.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center justify-center px-2 py-2 rounded-2xl transition-all min-w-0 flex-1 ${
                  activeTab === item.id
                    ? "text-brand"
                    : "text-[#998BB0]"
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-all ${
                  activeTab === item.id ? "bg-brand" : ""
                }`}>
                  <item.icon className={`h-5 w-5 ${activeTab === item.id ? "text-coral" : "text-[#998BB0]"}`} />
                </div>
                <span className={`text-[10px] font-medium mt-0.5 truncate ${
                  activeTab === item.id ? "text-brand" : "text-[#998BB0]"
                }`}>
                  {item.label}
                </span>
              </button>
            ))}
            <button
              onClick={() => onTabChange("settings")}
              className={`flex flex-col items-center justify-center px-2 py-2 rounded-2xl transition-all min-w-0 flex-1 ${
                activeTab === "settings" ? "text-brand" : "text-[#998BB0]"
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${
                activeTab === "settings" ? "bg-brand" : ""
              }`}>
                <Settings className={`h-5 w-5 ${activeTab === "settings" ? "text-coral" : "text-[#998BB0]"}`} />
              </div>
              <span className={`text-[10px] font-medium mt-0.5 ${
                activeTab === "settings" ? "text-brand" : "text-[#998BB0]"
              }`}>
                More
              </span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
