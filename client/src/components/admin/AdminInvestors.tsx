import { useState } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  Mail, 
  Building2,
  FileText,
  CheckCircle2,
  AlertCircle,
  Eye
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AddInvestorDialog } from "./AddInvestorDialog";
import { InvestorDetailsSheet } from "./InvestorDetailsSheet";
import { AssignPropertiesDialog } from "./AssignPropertiesDialog";
import { ManageDocumentsDialog } from "./ManageDocumentsDialog";

// Mock Investor Data
const MOCK_INVESTORS = [
  { 
    id: "INV-001", 
    name: "Robert Fox", 
    email: "robert.fox@example.com", 
    phone: "+1 (555) 101-2020",
    propertiesCount: 3,
    totalInvestment: "₦450,000,000",
    status: "Active",
    lastLogin: "2 hours ago",
    avatar: "RF"
  },
  { 
    id: "INV-002", 
    name: "Eleanor Pena", 
    email: "eleanor.p@example.com", 
    phone: "+1 (555) 202-3030",
    propertiesCount: 1,
    totalInvestment: "₦120,000,000",
    status: "Active",
    lastLogin: "1 day ago",
    avatar: "EP"
  },
  { 
    id: "INV-003", 
    name: "Wade Warren", 
    email: "wade.w@example.com", 
    phone: "+1 (555) 303-4040",
    propertiesCount: 5,
    totalInvestment: "₦1,200,000",
    status: "Pending",
    lastLogin: "Never",
    avatar: "WW"
  },
  { 
    id: "INV-004", 
    name: "Jane Cooper", 
    email: "jane.c@example.com", 
    phone: "+1 (555) 404-5050",
    propertiesCount: 2,
    totalInvestment: "₦300,000,000",
    status: "Active",
    lastLogin: "3 days ago",
    avatar: "JC"
  }
];

export function AdminInvestors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Sheet/Dialog State
  const [selectedInvestor, setSelectedInvestor] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAssignPropertiesOpen, setIsAssignPropertiesOpen] = useState(false);
  const [isManageDocumentsOpen, setIsManageDocumentsOpen] = useState(false);

  const handleViewDetails = (investor: any) => {
    setSelectedInvestor(investor);
    setIsDetailsOpen(true);
  };

  const handleAssignProperties = (investor: any) => {
    setSelectedInvestor(investor);
    setIsAssignPropertiesOpen(true);
  };

  const handleManageDocuments = (investor: any) => {
    setSelectedInvestor(investor);
    setIsManageDocumentsOpen(true);
  };

  const filteredInvestors = MOCK_INVESTORS.filter(investor => {
    const matchesSearch = investor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          investor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === "All" || investor.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const totalInvestors = MOCK_INVESTORS.length;
  const activeInvestors = MOCK_INVESTORS.filter(i => i.status === "Active").length;
  const pendingInvites = MOCK_INVESTORS.filter(i => i.status === "Pending").length;
  const totalAUM = "₦2,000.07B"; // Sum of mocked investments

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Investors</h1>
          <p className="text-slate-500 mt-1">Manage investor profiles, assigned properties, and documents.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="gap-2 bg-white hover:bg-slate-50 border-slate-200 text-slate-700">
                <Download className="h-4 w-4" /> Export List
            </Button>
            <AddInvestorDialog />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white border-slate-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Total Investors</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
                        <Users className="h-4 w-4" />
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{totalInvestors}</span>
                </div>
            </CardContent>
        </Card>
        
        <Card className="bg-white border-slate-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Assets Under Management</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-[#DDA04E]/10 flex items-center justify-center text-[#DDA04E]">
                        <Building2 className="h-4 w-4" />
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{totalAUM}</span>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-white border-slate-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Pending Invites</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <Mail className="h-4 w-4" />
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{pendingInvites}</span>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-50">
            <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                    placeholder="Search investors..." 
                    className="pl-10 border-slate-200 rounded-xl focus-visible:ring-[#DDA04E]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="rounded-xl border-slate-200 gap-2">
                            <Filter className="h-4 w-4" /> 
                            Status: {statusFilter}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setStatusFilter("All")}>All Status</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("Active")}>Active</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("Pending")}>Pending</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>

        <Table>
            <TableHeader className="bg-slate-50">
                <TableRow className="border-slate-100 hover:bg-slate-50">
                    <TableHead className="w-[300px] font-semibold text-slate-600">Investor</TableHead>
                    <TableHead className="font-semibold text-slate-600">Properties Owned</TableHead>
                    <TableHead className="font-semibold text-slate-600">Total Investment</TableHead>
                    <TableHead className="font-semibold text-slate-600 text-center">Status</TableHead>
                    <TableHead className="font-semibold text-slate-600">Last Login</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredInvestors.map((investor) => (
                    <TableRow key={investor.id} className="border-slate-50 hover:bg-slate-50/50">
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border border-slate-200 bg-white">
                                    <AvatarFallback className="bg-slate-100 text-[#DDA04E] font-bold text-xs">{investor.avatar}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-slate-900">{investor.name}</p>
                                    <p className="text-xs text-slate-500">{investor.email}</p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-slate-400" />
                                <span className="font-medium text-slate-900">{investor.propertiesCount} Properties</span>
                            </div>
                        </TableCell>
                        <TableCell className="font-medium text-slate-900">
                            {investor.totalInvestment}
                        </TableCell>
                        <TableCell className="text-center">
                            <Badge 
                                variant="outline" 
                                className={`
                                    border-none
                                    ${investor.status === 'Active' ? 'bg-green-50 text-green-700' : 
                                      'bg-amber-50 text-amber-700'}
                                `}
                            >
                                {investor.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-slate-500 text-sm">
                            {investor.lastLogin}
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleViewDetails(investor)}>
                                        <Eye className="mr-2 h-4 w-4" /> View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleAssignProperties(investor)}>
                                        <Building2 className="mr-2 h-4 w-4" /> Assign Properties
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleManageDocuments(investor)}>
                                        <FileText className="mr-2 h-4 w-4" /> Manage Documents
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Mail className="mr-2 h-4 w-4" /> Resend Credentials
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                        Deactivate Account
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </div>

      <InvestorDetailsSheet 
        open={isDetailsOpen} 
        onOpenChange={setIsDetailsOpen} 
        investor={selectedInvestor} 
      />

      <AssignPropertiesDialog 
        open={isAssignPropertiesOpen} 
        onOpenChange={setIsAssignPropertiesOpen} 
        investor={selectedInvestor} 
      />

      <ManageDocumentsDialog 
        open={isManageDocumentsOpen} 
        onOpenChange={setIsManageDocumentsOpen} 
        investor={selectedInvestor} 
      />
    </div>
  );
}
