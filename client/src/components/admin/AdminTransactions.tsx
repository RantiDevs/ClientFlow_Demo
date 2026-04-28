import { useState } from "react";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter, 
  Download,
  MoreHorizontal,
  Eye,
  FileText,
  Pencil,
  Trash2
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
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

// Mock data based on lib/data.ts but expanded
const ALL_TRANSACTIONS = [
  { id: "TRX-9821", date: "2024-06-15", description: "Monthly Rent - Unit 304", amount: 850, type: "income", status: "completed", tenant: "John Doe" },
  { id: "TRX-9820", date: "2024-06-14", description: "Monthly Rent - Unit 201", amount: 900, type: "income", status: "completed", tenant: "Sarah Smith" },
  { id: "TRX-9819", date: "2024-06-12", description: "Plumbing Repair - Pavilion", amount: -120, type: "expense", status: "completed", vendor: "City Plumbers" },
  { id: "TRX-9818", date: "2024-06-10", description: "Management Fee (10%)", amount: -450, type: "expense", status: "completed", vendor: "ClientFlow Mgmt" },
  { id: "TRX-9817", date: "2024-06-08", description: "Security Deposit", amount: 850, type: "income", status: "pending", tenant: "Mike Ross" },
  { id: "TRX-9816", date: "2024-06-01", description: "Monthly Rent - Unit 102", amount: 850, type: "income", status: "completed", tenant: "Jane Doe" },
  { id: "TRX-9815", date: "2024-05-30", description: "Utilities - Water", amount: -85, type: "expense", status: "completed", vendor: "Water Corp" },
  { id: "TRX-9814", date: "2024-05-29", description: "Utilities - Electric", amount: -145, type: "expense", status: "completed", vendor: "Power Co" },
  { id: "TRX-9813", date: "2024-05-28", description: "Late Fee - Unit 401", amount: 50, type: "income", status: "completed", tenant: "Tom Wilson" },
  { id: "TRX-9812", date: "2024-05-25", description: "Landscaping", amount: -200, type: "expense", status: "completed", vendor: "Green Thumbs" },
];

import { TransactionDialog, TransactionData } from "./TransactionDialog";

export function AdminTransactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, income, expense
  
  // Dialog State
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionData | null>(null);
  const [dialogMode, setDialogMode] = useState<"view" | "edit">("view");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewTransaction = (trx: TransactionData) => {
    setSelectedTransaction(trx);
    setDialogMode("view");
    setIsDialogOpen(true);
  };

  const handleEditTransaction = (trx: TransactionData) => {
    setSelectedTransaction(trx);
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  const filteredTransactions = ALL_TRANSACTIONS.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (t.tenant && t.tenant.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === "all" || t.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalIncome = ALL_TRANSACTIONS.filter(t => t.type === "income").reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = ALL_TRANSACTIONS.filter(t => t.type === "expense").reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
  const netFlow = totalIncome - totalExpenses;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Transactions</h1>
          <p className="text-slate-500 mt-1">Monitor all financial activities across your portfolio.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-white hover:bg-slate-50 border-slate-200 text-slate-700">
                <Download className="h-4 w-4" /> Export CSV
            </Button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-slate-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Total Income</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                        <ArrowDownLeft className="h-4 w-4" />
                    </div>
                    <span className="text-2xl font-bold text-slate-900">₦{totalIncome.toLocaleString()}</span>
                </div>
            </CardContent>
        </Card>
        <Card className="bg-white border-slate-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                        <ArrowUpRight className="h-4 w-4" />
                    </div>
                    <span className="text-2xl font-bold text-slate-900">₦{totalExpenses.toLocaleString()}</span>
                </div>
            </CardContent>
        </Card>
        <Card className="bg-[#1e1e1e] border-none shadow-lg rounded-2xl text-white">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Net Cash Flow</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[#DDA04E]">₦{netFlow.toLocaleString()}</span>
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
                    placeholder="Search transactions..." 
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
                            {filterType === 'all' ? 'All Types' : filterType === 'income' ? 'Income' : 'Expenses'}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setFilterType("all")}>All Types</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilterType("income")}>Income</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilterType("expense")}>Expenses</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>

        <Table>
            <TableHeader className="bg-slate-50">
                <TableRow className="border-slate-100 hover:bg-slate-50">
                    <TableHead className="w-[120px] font-semibold text-slate-600">ID</TableHead>
                    <TableHead className="font-semibold text-slate-600">Date</TableHead>
                    <TableHead className="font-semibold text-slate-600">Description</TableHead>
                    <TableHead className="font-semibold text-slate-600">Entity</TableHead>
                    <TableHead className="font-semibold text-slate-600 text-right">Amount</TableHead>
                    <TableHead className="font-semibold text-slate-600 text-center">Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredTransactions.map((trx) => (
                    <TableRow key={trx.id} className="border-slate-50 hover:bg-slate-50/50">
                        <TableCell className="font-medium text-slate-500">{trx.id}</TableCell>
                        <TableCell className="text-slate-900">{trx.date}</TableCell>
                        <TableCell className="font-medium text-slate-900">{trx.description}</TableCell>
                        <TableCell className="text-slate-500">{trx.tenant || trx.vendor || "-"}</TableCell>
                        <TableCell className={`text-right font-bold ${trx.type === 'income' ? 'text-green-600' : 'text-slate-900'}`}>
                            {trx.type === 'income' ? '+' : '-'}₦{Math.abs(trx.amount).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                            <Badge 
                                variant="outline" 
                                className={`
                                    border-none
                                    ${trx.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}
                                `}
                            >
                                {trx.status}
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
                                    <DropdownMenuItem onClick={() => handleViewTransaction(trx)}>
                                        <Eye className="mr-2 h-4 w-4" /> View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <FileText className="mr-2 h-4 w-4" /> Download Invoice
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleEditTransaction(trx)}>
                                        <Pencil className="mr-2 h-4 w-4" /> Edit Transaction
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </div>

      <TransactionDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        mode={dialogMode}
        transaction={selectedTransaction}
      />
    </div>
  );
}
