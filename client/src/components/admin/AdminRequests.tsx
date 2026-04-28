import { useState } from "react";
import { 
  Wrench, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowUpRight,
  MessageSquare,
  Eye,
  Trash2
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
import { MAINTENANCE_TICKETS } from "../../lib/data";
import { CreateTicketDialog } from "./CreateTicketDialog";
import { TicketDetailsDialog, TicketData } from "./TicketDetailsDialog";

// Extended Mock Data for Admin View
const ALL_REQUESTS = [
  ...MAINTENANCE_TICKETS.map(t => ({
    ...t,
    requester: "John Doe",
    avatar: "JD",
    email: "john@example.com",
    lastUpdated: "2 hours ago"
  })),
  {
    id: "M-2045",
    title: "AC Not Cooling",
    property: "Skyline Apartments",
    unit: "12B",
    priority: "High",
    status: "In Progress",
    date: "2024-05-18",
    requester: "Michael Chen",
    avatar: "MC",
    email: "m.chen@example.com",
    lastUpdated: "1 day ago"
  },
  {
    id: "M-2044",
    title: "Broken Window Latch",
    property: "Grandview Estates",
    unit: "44",
    priority: "Low",
    status: "Open",
    date: "2024-05-17",
    requester: "Robert Wilson",
    avatar: "RW",
    email: "r.wilson@example.com",
    lastUpdated: "3 days ago"
  },
  {
    id: "M-2043",
    title: "Pest Control Request",
    property: "The Pavilion Hostel",
    unit: "Lobby",
    priority: "Medium",
    status: "Resolved",
    date: "2024-05-15",
    requester: "Staff",
    avatar: "ST",
    email: "staff@clientflow.com",
    lastUpdated: "1 week ago"
  }
];

export function AdminRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  
  // View Details State
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [isViewTicketOpen, setIsViewTicketOpen] = useState(false);

  const handleViewTicket = (ticket: any) => {
    // Map the data to match TicketData interface if necessary, 
    // though the mock data structure is close enough for this prototype
    setSelectedTicket(ticket);
    setIsViewTicketOpen(true);
  };

  const filteredRequests = ALL_REQUESTS.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === "All" || req.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const totalRequests = ALL_REQUESTS.length;
  const openRequests = ALL_REQUESTS.filter(r => r.status === "Open" || r.status === "In Progress").length;
  const highPriority = ALL_REQUESTS.filter(r => r.priority === "High" && r.status !== "Resolved").length;
  const resolvedThisMonth = 14; // Mocked

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Maintenance Requests</h1>
          <p className="text-slate-500 mt-1">Track and manage property maintenance tickets.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-white hover:bg-slate-50 border-slate-200 text-slate-700">
                <Download className="h-4 w-4" /> Export Report
            </Button>
            <Button 
                onClick={() => setIsCreateTicketOpen(true)}
                className="bg-[#DDA04E] text-white hover:bg-[#c48b3d] shadow-lg shadow-[#DDA04E]/20 rounded-full px-6"
            >
                <Wrench className="mr-2 h-4 w-4" /> Create Ticket
            </Button>
        </div>
      </div>

      <CreateTicketDialog 
        open={isCreateTicketOpen} 
        onOpenChange={setIsCreateTicketOpen}
      />

      <TicketDetailsDialog 
        open={isViewTicketOpen} 
        onOpenChange={setIsViewTicketOpen}
        ticket={selectedTicket}
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Total Tickets</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
                        <Wrench className="h-4 w-4" />
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{totalRequests}</span>
                </div>
            </CardContent>
        </Card>
        
        <Card className="bg-white border-slate-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Open Requests</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <Clock className="h-4 w-4" />
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{openRequests}</span>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-white border-slate-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">High Priority</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                        <AlertCircle className="h-4 w-4" />
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{highPriority}</span>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-white border-slate-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Resolved (30d)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{resolvedThisMonth}</span>
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
                    placeholder="Search requests..." 
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
                        <DropdownMenuItem onClick={() => setStatusFilter("Open")}>Open</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("In Progress")}>In Progress</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("Resolved")}>Resolved</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>

        <Table>
            <TableHeader className="bg-slate-50">
                <TableRow className="border-slate-100 hover:bg-slate-50">
                    <TableHead className="w-[100px] font-semibold text-slate-600">ID</TableHead>
                    <TableHead className="font-semibold text-slate-600">Issue / Requester</TableHead>
                    <TableHead className="font-semibold text-slate-600">Location</TableHead>
                    <TableHead className="font-semibold text-slate-600">Date</TableHead>
                    <TableHead className="font-semibold text-slate-600 text-center">Priority</TableHead>
                    <TableHead className="font-semibold text-slate-600 text-center">Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredRequests.map((req) => (
                    <TableRow key={req.id} className="border-slate-50 hover:bg-slate-50/50">
                        <TableCell className="font-medium text-slate-500">{req.id}</TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-900">{req.title}</span>
                                <div className="flex items-center mt-1">
                                    <span className="text-xs text-slate-500 mr-2">by {req.requester}</span>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col text-sm">
                                <span className="font-medium text-slate-900">{req.property}</span>
                                <span className="text-slate-500 text-xs">Unit {req.unit || "N/A"}</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-slate-600 text-sm">
                            {req.date}
                        </TableCell>
                        <TableCell className="text-center">
                             <Badge 
                                variant="outline" 
                                className={`
                                    border-none
                                    ${req.priority === 'High' ? 'bg-red-50 text-red-700' : 
                                      req.priority === 'Medium' ? 'bg-amber-50 text-amber-700' :
                                      'bg-green-50 text-green-700'}
                                `}
                            >
                                {req.priority}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                            <Badge 
                                variant="outline" 
                                className={`
                                    border-slate-200 font-normal
                                    ${req.status === 'Resolved' ? 'bg-slate-100 text-slate-600' : 
                                      req.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                      'bg-white text-slate-900 shadow-sm'}
                                `}
                            >
                                {req.status}
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
                                    <DropdownMenuItem onClick={() => handleViewTicket(req)}>
                                        <Eye className="mr-2 h-4 w-4" /> View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <MessageSquare className="mr-2 h-4 w-4" /> Message Tenant
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as Resolved
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete Ticket
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
