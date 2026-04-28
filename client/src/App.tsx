import { useState, useEffect } from "react";
import { AppLayout } from "./components/layout/AppLayout";
import { LandingPage } from "./components/landing/LandingPage";
import { Login } from "./components/auth/Login";
import { InvestorDashboard } from "./components/investor/InvestorDashboard";
import { Portfolio } from "./components/investor/Portfolio";
import { InvestorMessages } from "./components/investor/InvestorMessages";
import { Wallet } from "./components/investor/Wallet";
import { Reports } from "./components/investor/Reports";
import { TenantDashboard } from "./components/tenant/TenantDashboard";
import { MaintenanceRequest } from "./components/tenant/MaintenanceRequest";
import { TenantMessages } from "./components/tenant/TenantMessages";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AdminProperties } from "./components/admin/AdminProperties";
import { AdminTransactions } from "./components/admin/AdminTransactions";
import { AdminTenants } from "./components/admin/AdminTenants";
import { AdminInvestors } from "./components/admin/AdminInvestors";
import { AdminRequests } from "./components/admin/AdminRequests";
import { Settings } from "./components/settings/Settings";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { VerdaDashboard } from "./components/verdafarms/VerdaDashboard";
import { VerdaCropPortfolio } from "./components/verdafarms/VerdaCropPortfolio";
import { VerdaReports } from "./components/verdafarms/VerdaReports";
import { VerdaDocuments } from "./components/verdafarms/VerdaDocuments";
import { VerdaFeedback } from "./components/verdafarms/VerdaFeedback";

import { CRMPipeline } from "./components/admin/CRMPipeline";
import { Inspections } from "./components/admin/Inspections";
import { ESignContracts } from "./components/admin/ESignContracts";
import { CommissionTracker } from "./components/admin/CommissionTracker";
import { BroadcastMessaging } from "./components/admin/BroadcastMessaging";
import { ActivityIntel } from "./components/admin/ActivityIntel";
import { Branches } from "./components/admin/Branches";
import { StaffAccess } from "./components/admin/StaffAccess";
import { Referrals } from "./components/admin/Referrals";
import { DocumentVault } from "./components/admin/DocumentVault";
import { PaymentCheckout } from "./components/tenant/PaymentCheckout";

import type { UserRole, AuthUser } from "./lib/api";

// Demo personas — instant access, no password required
const DEMO_USERS: Record<UserRole, AuthUser> = {
  investor:   { id: 1, name: "Adaeze Okonkwo",  email: "adaeze@rantidevs.ng",  role: "investor",   avatar: "https://i.pravatar.cc/256?u=adaeze" },
  tenant:     { id: 2, name: "Tunde Bakare",    email: "tunde@rantidevs.ng",   role: "tenant",     avatar: "https://i.pravatar.cc/256?u=tunde" },
  admin:      { id: 3, name: "Funke Adeyemi",   email: "funke@rantidevs.ng",   role: "admin",      avatar: "https://i.pravatar.cc/256?u=funke" },
  verdafarms: { id: 4, name: "Adebayo Ogunleye", email: "bayo@verdafarms.ng",  role: "verdafarms", avatar: "https://i.pravatar.cc/256?u=adebayo" },
};

function App() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [showLanding, setShowLanding] = useState(true);

  // Investor wallet (NGN)
  const [investorBalance, setInvestorBalance] = useState(48_750_000);
  const [investorActivities, setInvestorActivities] = useState([
    { id: "TXN_00076", title: "Monthly Rent — Lekki Pearl B-12",  type: "Income",  amount: "₦2,500,000", status: "Completed", date: "18 Apr, 2026" },
    { id: "TXN_00075", title: "Plumbing repair — Ikeja GRA",      type: "Expense", amount: "₦185,000",   status: "Pending",   date: "15 Apr, 2026" },
    { id: "TXN_00074", title: "Service charge — Banana Island",   type: "Expense", amount: "₦680,000",   status: "Completed", date: "15 Apr, 2026" },
    { id: "TXN_00073", title: "Quarterly dividend payout",        type: "Income",  amount: "₦4,200,000", status: "Completed", date: "01 Apr, 2026" },
  ]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleInvestorTransfer = async (amount: number, recipient: string) => {
    setInvestorBalance(prev => prev - amount);
    const newActivity = {
      id: `TRF_${Math.floor(Math.random() * 10000)}`,
      title: `Transfer to ${recipient}`,
      type: "Expense",
      amount: `₦${amount.toLocaleString()}`,
      status: "Completed",
      date: "Just now",
    };
    setInvestorActivities(prev => [newActivity, ...prev]);
    toast.success(`Successfully transferred ₦${amount.toLocaleString()} to ${recipient}`);
  };

  // Demo: instant role-based login, no password
  const handleDemoLogin = (role: UserRole) => {
    const user = DEMO_USERS[role];
    setCurrentUser(user);
    setUserRole(role);
    setActiveTab("dashboard");
    toast.success(`Welcome, ${user.name}! You're in the ${role === "verdafarms" ? "Verda Farms" : role} demo portal.`);
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentUser(null);
    setShowLanding(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream">
        <div className="text-brand text-sm font-medium">Loading…</div>
      </div>
    );
  }

  if (!userRole) {
    if (showLanding) {
      return <LandingPage onLoginClick={() => setShowLanding(false)} />;
    }
    return <Login onDemoLogin={handleDemoLogin} onBackToHome={() => setShowLanding(true)} />;
  }

  const renderContent = () => {
    if (userRole === "investor") {
      switch (activeTab) {
        case "dashboard": return <InvestorDashboard onNavigate={setActiveTab} balance={investorBalance} activities={investorActivities} onTransfer={handleInvestorTransfer} />;
        case "portfolio": return <Portfolio />;
        case "messages":  return <InvestorMessages />;
        case "wallet":    return <Wallet balance={investorBalance} transactions={investorActivities} onTransfer={handleInvestorTransfer} />;
        case "reports":
        case "documents": return <Reports />;
        case "settings":  return <Settings currentUser={currentUser} role={userRole} />;
        default:          return <InvestorDashboard onNavigate={setActiveTab} balance={investorBalance} activities={investorActivities} onTransfer={handleInvestorTransfer} />;
      }
    }

    if (userRole === "tenant") {
      switch (activeTab) {
        case "dashboard":   return <TenantDashboard onNavigate={setActiveTab} />;
        case "payments":    return <PaymentCheckout />;
        case "maintenance": return <MaintenanceRequest />;
        case "messages":    return <TenantMessages />;
        case "settings":    return <Settings currentUser={currentUser} role={userRole} />;
        default:            return <TenantDashboard onNavigate={setActiveTab} />;
      }
    }

    if (userRole === "admin") {
      switch (activeTab) {
        case "dashboard":     return <AdminDashboard onNavigate={setActiveTab} />;
        case "crm":           return <CRMPipeline />;
        case "inspections":   return <Inspections />;
        case "contracts":     return <ESignContracts />;
        case "vault":         return <DocumentVault />;
        case "commissions":   return <CommissionTracker />;
        case "broadcasts":    return <BroadcastMessaging />;
        case "activity":      return <ActivityIntel />;
        case "branches":      return <Branches />;
        case "staff":         return <StaffAccess />;
        case "referrals":     return <Referrals />;
        case "properties":    return <AdminProperties />;
        case "tenants":       return <AdminTenants />;
        case "investors":     return <AdminInvestors />;
        case "transactions":  return <AdminTransactions />;
        case "maintenance":   return <AdminRequests />;
        case "settings":      return <Settings currentUser={currentUser} role={userRole} />;
        default:              return <AdminDashboard onNavigate={setActiveTab} />;
      }
    }

    if (userRole === "verdafarms") {
      switch (activeTab) {
        case "dashboard":      return <VerdaDashboard onNavigate={setActiveTab} />;
        case "crops":          return <VerdaCropPortfolio />;
        case "farm-reports":   return <VerdaReports />;
        case "farm-documents": return <VerdaDocuments />;
        case "feedback":       return <VerdaFeedback />;
        case "settings":       return <Settings currentUser={currentUser} role={userRole} />;
        default:               return <VerdaDashboard onNavigate={setActiveTab} />;
      }
    }

    return <div>Unknown Role</div>;
  };

  return (
    <AppLayout
      role={userRole}
      onLogout={handleLogout}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      currentUser={currentUser}
    >
      {renderContent()}
      <Toaster />
    </AppLayout>
  );
}

export default App;
