import { useState } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  Mail, 
  Phone,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
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

// Mock Tenant Data
const ALL_TENANTS = [
  { 
    id: "T-1001", 
    name: "Sarah Williams", 
    email: "sarah.w@example.com", 
    phone: "+1 (555) 123-4567",
    property: "The Pavilion Hostel", 
    unit: "304", 
    leaseStart: "2024-01-15", 
    leaseEnd: "2025-01-14", 
    status: "Active", 
    paymentStatus: "Paid",
    rent: 850, 
    avatar: "SW" 
  },
  { 
    id: "T-1002", 
    name: "Michael Chen", 
    email: "m.chen@example.com", 
    phone: "+1 (555) 234-5678",
    property: "Skyline Apartments", 
    unit: "12B", 
    leaseStart: "2023-11-01", 
    leaseEnd: "2024-10-31", 
    status: "Active", 
    paymentStatus: "Late",
    rent: 1200, 
    avatar: "MC" 
  },
  { 
    id: "T-1003", 
    name: "Jessica Davis", 
    email: "jdavis@example.com", 
    phone: "+1 (555) 345-6789",
    property: "The Pavilion Hostel", 
    unit: "205", 
    leaseStart: "2024-03-01", 
    leaseEnd: "2025-02-28", 
    status: "Active", 
    paymentStatus: "Paid",
    rent: 850, 
    avatar: "JD" 
  },
  { 
    id: "T-1004", 
    name: "Robert Wilson", 
    email: "r.wilson@example.com", 
    phone: "+1 (555) 456-7890",
    property: "Grandview Estates", 
    unit: "44", 
    leaseStart: "2022-06-01", 
    leaseEnd: "2024-05-31", 
    status: "Expiring", 
    paymentStatus: "Paid",
    rent: 2100, 
    avatar: "RW" 
  },
  { 
    id: "T-1005", 
    name: "Emily Johnson", 
    email: "emily.j@example.com", 
    phone: "+1 (555) 567-8901",
    property: "Skyline Apartments", 
    unit: "08A", 
    leaseStart: "2024-02-15", 
    leaseEnd: "2025-02-14", 
    status: "Active", 
    paymentStatus: "Pending",
    rent: 1150, 
    avatar: "EJ" 
  },
  { 
    id: "T-1006", 
    name: "David Miller", 
    email: "d.miller@example.com", 
    phone: "+1 (555) 678-9012",
    property: "The Pavilion Hostel", 
    unit: "102", 
    leaseStart: "2023-08-01", 
    leaseEnd: "2024-07-31", 
    status: "Active", 
    paymentStatus: "Paid",
    rent: 825, 
    avatar: "DM" 
  },
  { 
    id: "T-1007", 
    name: "Lisa Anderson", 
    email: "lisa.a@example.com", 
    phone: "+1 (555) 789-0123",
    property: "Grandview Estates", 
    unit: "12", 
    leaseStart: "2023-05-01", 
    leaseEnd: "2024-04-30", 
    status: "Past", 
    paymentStatus: "N/A",
    rent: 1950, 
    avatar: "LA" 
  },
];

import { AddTenantDialog } from "./AddTenantDialog";

export function AdminTenants() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredTenants = ALL_TENANTS.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tenant.property.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === "All" || tenant.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const totalTenants = ALL_TENANTS.length;
  const activeTenants = ALL_TENANTS.filter(t => t.status === "Active").length;
  const latePayments = ALL_TENANTS.filter(t => t.paymentStatus === "Late").length;
  const expiringLeases = ALL_TENANTS.filter(t => t.status === "Expiring").length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tenants</h1>
          <p className="text-slate-500 mt-1">Manage tenant profiles, leases, and communications.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="gap-2 bg-white hover:bg-slate-50 border-slate-200 text-slate-700">
                <Download className="h-4 w-4" /> Export List
            </Button>
            <AddTenantDialog />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Total Tenants</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
                        <Users className="h-4 w-4" />
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{totalTenants}</span>
                </div>
            </CardContent>
        </Card>
        
        <Card className="bg-white border-slate-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Active Leases</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{activeTenants}</span>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-white border-slate-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Late Payments</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                        <AlertCircle className="h-4 w-4" />
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{latePayments}</span>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-white border-slate-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Expiring Soon</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                        <Clock className="h-4 w-4" />
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{expiringLeases}</span>
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
                    placeholder="Search tenants..." 
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
                        <DropdownMenuItem onClick={() => setStatusFilter("Expiring")}>Expiring Soon</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("Past")}>Past Tenant</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>

        <Table>
            <TableHeader className="bg-slate-50">
                <TableRow className="border-slate-100 hover:bg-slate-50">
                    <TableHead className="w-[250px] font-semibold text-slate-600">Tenant</TableHead>
                    <TableHead className="font-semibold text-slate-600">Property / Unit</TableHead>
                    <TableHead className="font-semibold text-slate-600">Lease Period</TableHead>
                    <TableHead className="font-semibold text-slate-600">Rent</TableHead>
                    <TableHead className="font-semibold text-slate-600 text-center">Status</TableHead>
                    <TableHead className="font-semibold text-slate-600 text-center">Payment</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredTenants.map((tenant) => (
                    <TableRow key={tenant.id} className="border-slate-50 hover:bg-slate-50/50">
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border border-slate-200 bg-white">
                                    <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-xs">{tenant.avatar}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-slate-900">{tenant.name}</p>
                                    <p className="text-xs text-slate-500">{tenant.email}</p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="font-medium text-slate-900">{tenant.property}</span>
                                <span className="text-xs text-slate-500">Unit {tenant.unit}</span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col text-sm">
                                <span className="text-slate-600">{tenant.leaseStart}</span>
                                <span className="text-slate-400 text-xs">to {tenant.leaseEnd}</span>
                            </div>
                        </TableCell>
                        <TableCell className="font-medium text-slate-900">
                            ${tenant.rent.toLocaleString()}/mo
                        </TableCell>
                        <TableCell className="text-center">
                            <Badge 
                                variant="outline" 
                                className={`
                                    border-none
                                    ${tenant.status === 'Active' ? 'bg-green-50 text-green-700' : 
                                      tenant.status === 'Expiring' ? 'bg-amber-50 text-amber-700' :
                                      'bg-slate-100 text-slate-600'}
                                `}
                            >
                                {tenant.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                             <Badge 
                                variant="outline" 
                                className={`
                                    border-none
                                    ${tenant.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700' : 
                                      tenant.paymentStatus === 'Late' ? 'bg-red-50 text-red-700' :
                                      tenant.paymentStatus === 'Pending' ? 'bg-blue-50 text-blue-700' :
                                      'bg-slate-50 text-slate-400'}
                                `}
                            >
                                {tenant.paymentStatus}
                            </Badge>
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
                                    <DropdownMenuItem>
                                        <FileText className="mr-2 h-4 w-4" /> View Lease
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Mail className="mr-2 h-4 w-4" /> Send Email
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Phone className="mr-2 h-4 w-4" /> Call Tenant
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                        End Lease
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </div>
    </div>
  );
}
