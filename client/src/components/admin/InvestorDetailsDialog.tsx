import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign, 
  FileText, 
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  ExternalLink
} from "lucide-react";
import { PROJECTS } from "../../lib/data";

interface InvestorDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investor: any;
}

export function InvestorDetailsDialog({ open, onOpenChange, investor }: InvestorDetailsDialogProps) {
  if (!investor) return null;

  // Mock Data Generators based on investor ID
  const assignedProperties = PROJECTS.slice(0, investor.propertiesCount || 2);
  
  const transactions = [
    { id: "TRX-9821", date: "2024-04-15", type: "Distribution", amount: "₦12,500,000", status: "Completed", property: "The Pavilion Hostel" },
    { id: "TRX-9820", date: "2024-03-15", type: "Distribution", amount: "₦12,500,000", status: "Completed", property: "The Pavilion Hostel" },
    { id: "TRX-9755", date: "2024-02-28", type: "Contribution", amount: "₦50,000,000", status: "Completed", property: "Skyline Apartments" },
    { id: "TRX-9610", date: "2024-02-15", type: "Distribution", amount: "₦11,200,000", status: "Completed", property: "The Pavilion Hostel" },
  ];

  const documents = [
    { name: "Investment Agreement - Pavilion.pdf", date: "2023-11-10", size: "2.4 MB", type: "Contract" },
    { name: "KYC Documents.pdf", date: "2023-11-01", size: "1.8 MB", type: "Legal" },
    { name: "Tax Form 2023.pdf", date: "2024-01-20", size: "0.5 MB", type: "Tax" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-slate-50 gap-0">
        
        {/* Header Section */}
        <div className="bg-slate-900 pt-8 pb-6 px-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#DDA04E] rounded-full blur-3xl opacity-20"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="h-20 w-20 border-4 border-white/10 shadow-xl">
              <AvatarFallback className="bg-[#DDA04E] text-slate-900 text-2xl font-bold">{investor.avatar}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold text-white">{investor.name}</h2>
                <Badge className={`
                  border-none
                  ${investor.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}
                `}>
                  {investor.status}
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 text-slate-400 text-sm">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {investor.email}
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  {investor.phone}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Last login: {investor.lastLogin}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
               <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white">
                 Edit Profile
               </Button>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="flex-1 overflow-hidden flex flex-col h-[600px]">
            <Tabs defaultValue="overview" className="flex-1 flex flex-col">
                <div className="px-8 border-b border-slate-200 bg-white">
                    <TabsList className="bg-transparent h-12 w-full justify-start gap-8 p-0">
                        <TabsTrigger 
                            value="overview" 
                            className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-[#DDA04E] data-[state=active]:text-[#DDA04E] data-[state=active]:shadow-none px-0 font-medium"
                        >
                            Overview
                        </TabsTrigger>
                        <TabsTrigger 
                            value="properties" 
                            className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-[#DDA04E] data-[state=active]:text-[#DDA04E] data-[state=active]:shadow-none px-0 font-medium"
                        >
                            Properties
                        </TabsTrigger>
                        <TabsTrigger 
                            value="financials" 
                            className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-[#DDA04E] data-[state=active]:text-[#DDA04E] data-[state=active]:shadow-none px-0 font-medium"
                        >
                            Financials
                        </TabsTrigger>
                        <TabsTrigger 
                            value="documents" 
                            className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-[#DDA04E] data-[state=active]:text-[#DDA04E] data-[state=active]:shadow-none px-0 font-medium"
                        >
                            Documents
                        </TabsTrigger>
                    </TabsList>
                </div>

                <ScrollArea className="flex-1 bg-slate-50">
                    <div className="p-8">
                        <TabsContent value="overview" className="mt-0 space-y-6">
                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                    <p className="text-sm font-medium text-slate-500 mb-1">Total Investment</p>
                                    <h3 className="text-2xl font-bold text-slate-900">{investor.totalInvestment}</h3>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                    <p className="text-sm font-medium text-slate-500 mb-1">Total Properties</p>
                                    <h3 className="text-2xl font-bold text-slate-900">{investor.propertiesCount}</h3>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                    <p className="text-sm font-medium text-slate-500 mb-1">Lifetime Distributions</p>
                                    <h3 className="text-2xl font-bold text-green-600">+₦145,250,000</h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Recent Activity */}
                                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <ArrowUpRight className="h-4 w-4 text-[#DDA04E]" /> Recent Activity
                                    </h4>
                                    <div className="space-y-4">
                                        {[1, 2, 3].map((_, i) => (
                                            <div key={i} className="flex gap-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                                                <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                                                    <Calendar className="h-4 w-4 text-slate-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">Logged in from new device</p>
                                                    <p className="text-xs text-slate-500">2 days ago • IP 192.168.1.1</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Contact */}
                                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-[#DDA04E]" /> Contact Information
                                    </h4>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase">Primary Address</p>
                                            <p className="text-sm text-slate-700 mt-1">123 Investment Blvd, Suite 400<br/>New York, NY 10001</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase">Phone</p>
                                            <p className="text-sm text-slate-700 mt-1">{investor.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase">Email</p>
                                            <p className="text-sm text-slate-700 mt-1">{investor.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="properties" className="mt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {assignedProperties.map((property) => (
                                    <div key={property.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:border-[#DDA04E]/30 transition-all">
                                        <div className="h-32 w-full relative">
                                            <img src={property.image} alt={property.name} className="h-full w-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                            <div className="absolute bottom-3 left-3 text-white">
                                                <p className="font-bold text-lg leading-tight">{property.name}</p>
                                                <p className="text-xs opacity-90 flex items-center mt-1"><MapPin className="h-3 w-3 mr-1" /> {property.location}</p>
                                            </div>
                                        </div>
                                        <div className="p-4 flex justify-between items-center">
                                            <div className="text-sm">
                                                <span className="text-slate-500">Owned Stake:</span>
                                                <span className="font-bold text-slate-900 ml-1">25%</span>
                                            </div>
                                            <Button variant="ghost" size="sm" className="h-8 text-[#DDA04E] hover:text-[#c48b3d] hover:bg-[#DDA04E]/5">
                                                Details <ExternalLink className="ml-1 h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="financials" className="mt-0">
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                                    <h4 className="font-bold text-slate-900">Transaction History</h4>
                                    <Button variant="outline" size="sm" className="h-8 gap-2">
                                        <Download className="h-3 w-3" /> Export
                                    </Button>
                                </div>
                                <div className="divide-y divide-slate-50">
                                    {transactions.map((trx) => (
                                        <div key={trx.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50">
                                            <div className="flex items-center gap-3">
                                                <div className={`
                                                    h-10 w-10 rounded-full flex items-center justify-center shrink-0
                                                    ${trx.type === 'Distribution' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}
                                                `}>
                                                    {trx.type === 'Distribution' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900">{trx.type} - {trx.property}</p>
                                                    <p className="text-xs text-slate-500">{trx.date} • {trx.id}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-bold ${trx.type === 'Distribution' ? 'text-green-600' : 'text-slate-900'}`}>
                                                    {trx.type === 'Distribution' ? '+' : ''}{trx.amount}
                                                </p>
                                                <Badge variant="outline" className="mt-1 text-[10px] h-5 border-slate-200 text-slate-500">
                                                    {trx.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="documents" className="mt-0">
                             <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-slate-50">
                                    <h4 className="font-bold text-slate-900">Legal & Tax Documents</h4>
                                </div>
                                <div className="divide-y divide-slate-50">
                                    {documents.map((doc, idx) => (
                                        <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50/50">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900">{doc.name}</p>
                                                    <p className="text-xs text-slate-500">{doc.type} • {doc.date} • {doc.size}</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                             </div>
                        </TabsContent>
                    </div>
                </ScrollArea>
            </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
