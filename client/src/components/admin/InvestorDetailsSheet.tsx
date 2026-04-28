import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "../ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  FileText, 
  Download, 
  Clock, 
  Wallet,
  Calendar,
  MoreHorizontal
} from "lucide-react";
import { PROJECTS } from "../../lib/data";

interface InvestorDetailsSheetProps {
  investor: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvestorDetailsSheet({ investor, open, onOpenChange }: InvestorDetailsSheetProps) {
  if (!investor) return null;

  // Mock Data Generators based on investor ID
  const assignedProperties = PROJECTS.slice(0, investor.propertiesCount || 2);
  
  const transactions = [
    { id: "TRX-9821", date: "2024-04-15", type: "Distribution", amount: "₦12,500,000", status: "Completed" },
    { id: "TRX-9803", date: "2024-03-15", type: "Distribution", amount: "₦12,500,000", status: "Completed" },
    { id: "TRX-9755", date: "2024-02-01", type: "Contribution", amount: "₦150,000,000", status: "Completed" },
    { id: "TRX-9122", date: "2024-01-15", type: "Distribution", amount: "₦8,250,000", status: "Completed" },
  ];

  const documents = [
    { name: "Investment Agreement.pdf", date: "Jan 12, 2024", size: "2.4 MB" },
    { name: "KYC Documents.zip", date: "Jan 10, 2024", size: "4.1 MB" },
    { name: "Q1 2024 Performance Report.pdf", date: "Apr 05, 2024", size: "1.2 MB" },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[540px] p-0 overflow-hidden bg-slate-50 border-l border-slate-200" side="right">
        {/* Header */}
        <div className="bg-white p-6 border-b border-slate-100">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-slate-100">
                <AvatarFallback className="bg-slate-900 text-[#DDA04E] text-xl font-bold">
                  {investor.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{investor.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={`border-none px-2 py-0.5 ${investor.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                    {investor.status}
                  </Badge>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500">ID: {investor.id}</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="h-8 border-slate-200">
              Edit Profile
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Mail className="h-4 w-4 text-slate-400" />
              <span className="truncate">{investor.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Phone className="h-4 w-4 text-slate-400" />
              <span>{investor.phone}</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="h-[calc(100vh-180px)] flex flex-col">
          <div className="px-6 bg-white border-b border-slate-100">
            <TabsList className="bg-transparent p-0 w-full justify-start h-auto gap-6">
              <TabsTrigger 
                value="overview" 
                className="rounded-none border-b-2 border-transparent px-0 py-3 data-[state=active]:border-[#DDA04E] data-[state=active]:text-[#DDA04E] data-[state=active]:bg-transparent data-[state=active]:shadow-none font-medium text-slate-500 hover:text-slate-700"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="properties" 
                className="rounded-none border-b-2 border-transparent px-0 py-3 data-[state=active]:border-[#DDA04E] data-[state=active]:text-[#DDA04E] data-[state=active]:bg-transparent data-[state=active]:shadow-none font-medium text-slate-500 hover:text-slate-700"
              >
                Properties
              </TabsTrigger>
              <TabsTrigger 
                value="financials" 
                className="rounded-none border-b-2 border-transparent px-0 py-3 data-[state=active]:border-[#DDA04E] data-[state=active]:text-[#DDA04E] data-[state=active]:bg-transparent data-[state=active]:shadow-none font-medium text-slate-500 hover:text-slate-700"
              >
                Financials
              </TabsTrigger>
              <TabsTrigger 
                value="documents" 
                className="rounded-none border-b-2 border-transparent px-0 py-3 data-[state=active]:border-[#DDA04E] data-[state=active]:text-[#DDA04E] data-[state=active]:bg-transparent data-[state=active]:shadow-none font-medium text-slate-500 hover:text-slate-700"
              >
                Documents
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              
              {/* OVERVIEW TAB */}
              <TabsContent value="overview" className="space-y-6 mt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Total Investment</p>
                    <p className="text-2xl font-bold text-slate-900">{investor.totalInvestment}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Properties Owned</p>
                    <p className="text-2xl font-bold text-slate-900">{assignedProperties.length}</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-900">Recent Activity</h3>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="p-4 flex gap-3 hover:bg-slate-50 transition-colors">
                        <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                          <Clock className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">Login detected from new device</p>
                          <p className="text-xs text-slate-500 mt-0.5">Today, 10:23 AM • San Francisco, US</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* PROPERTIES TAB */}
              <TabsContent value="properties" className="space-y-4 mt-0">
                {assignedProperties.map((property) => (
                  <div key={property.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex gap-4">
                      <div className="h-20 w-24 rounded-lg overflow-hidden shrink-0">
                        <img src={property.image} alt={property.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-slate-900 truncate">{property.name}</h4>
                            <div className="flex items-center text-xs text-slate-500 mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {property.location}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-slate-200">
                            {property.roi}% ROI
                          </Badge>
                        </div>
                        <div className="mt-3 flex items-center gap-4">
                          <div className="text-xs">
                            <span className="text-slate-500">Ownership:</span>
                            <span className="font-semibold text-slate-900 ml-1">100%</span>
                          </div>
                          <div className="text-xs">
                            <span className="text-slate-500">Occupancy:</span>
                            <span className="font-semibold text-slate-900 ml-1">{property.occupancy}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* FINANCIALS TAB */}
              <TabsContent value="financials" className="space-y-4 mt-0">
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="divide-y divide-slate-50">
                    {transactions.map((trx) => (
                      <div key={trx.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${trx.type === 'Distribution' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                            <Wallet className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{trx.type}</p>
                            <div className="flex items-center text-xs text-slate-500 mt-0.5">
                              <Calendar className="h-3 w-3 mr-1" />
                              {trx.date}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${trx.type === 'Distribution' ? 'text-green-600' : 'text-slate-900'}`}>
                            {trx.type === 'Distribution' ? '+' : ''}{trx.amount}
                          </p>
                          <Badge variant="outline" className="text-[10px] h-5 px-1.5 bg-slate-50 border-none text-slate-500 mt-1">
                            {trx.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* DOCUMENTS TAB */}
              <TabsContent value="documents" className="space-y-4 mt-0">
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="divide-y divide-slate-50">
                        {documents.map((doc, idx) => (
                            <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="h-10 w-10 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-slate-900 truncate">{doc.name}</p>
                                        <p className="text-xs text-slate-500">{doc.date} • {doc.size}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-[#DDA04E] hover:bg-[#DDA04E]/10 shrink-0 ml-2">
                                    <Download className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
                <Button className="w-full bg-slate-900 text-white hover:bg-slate-800">
                    Upload New Document
                </Button>
              </TabsContent>

            </div>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
