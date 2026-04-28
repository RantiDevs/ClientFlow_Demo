import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Progress } from "../ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet as WalletIcon, 
  Search, 
  Filter, 
  Download,
  CreditCard,
  MoreHorizontal,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Building2,
  ChevronRight,
  Loader2,
  FileText,
  Clock,
  Upload,
  Copy,
  ExternalLink
} from "lucide-react";
import { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { toast } from "sonner";

interface Transaction {
  id: string;
  title: string;
  type: string;
  amount: string;
  status: string;
  date: string;
  planId?: string;
}

interface InstallmentPlan {
  id: string;
  title: string;
  property: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  nextPaymentDate: string;
  nextPaymentAmount: number;
  status: 'Active' | 'Completed' | 'Overdue';
  frequency: 'Monthly' | 'Quarterly';
  documents?: { name: string; date: string }[];
}

interface WalletProps {
  balance: number;
  transactions: Transaction[];
  onTransfer: (amount: number, recipient: string) => void;
}

// Mock Data for Installment Plans
const MOCK_PLANS: InstallmentPlan[] = [
  {
    id: "IP-001",
    title: "Initial Investment Capital",
    property: "The Pavilion Hostel",
    totalAmount: 50000,
    paidAmount: 35000,
    remainingAmount: 15000,
    nextPaymentDate: "2024-05-15",
    nextPaymentAmount: 5000,
    status: 'Active',
    frequency: 'Monthly',
    documents: [
      { name: "Investment Agreement", date: "2023-11-01" },
      { name: "Payment Schedule", date: "2023-11-01" }
    ]
  },
  {
    id: "IP-002",
    title: "Renovation Fund Contribution",
    property: "Green Valley Estate",
    totalAmount: 12000,
    paidAmount: 3000,
    remainingAmount: 9000,
    nextPaymentDate: "2024-06-01",
    nextPaymentAmount: 3000,
    status: 'Active',
    frequency: 'Quarterly',
    documents: [
      { name: "Renovation Contract", date: "2024-01-15" }
    ]
  }
];

export function Wallet({ balance, transactions, onTransfer }: WalletProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"All" | "Income" | "Expense">("All");
  
  // Payment Modal State
  const [selectedPlan, setSelectedPlan] = useState<InstallmentPlan | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  // Details Sheet State
  const [viewDetailsPlan, setViewDetailsPlan] = useState<InstallmentPlan | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "All" || t.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleOpenPayment = (plan: InstallmentPlan) => {
    setSelectedPlan(plan);
    setPaymentAmount(plan.nextPaymentAmount.toString());
    setReceiptFile(null);
    setIsPaymentModalOpen(true);
  };

  const handleOpenDetails = (plan: InstallmentPlan) => {
    setViewDetailsPlan(plan);
    setIsDetailsOpen(true);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    if (!receiptFile) {
        toast.error("Please upload a payment receipt.");
        return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Payment receipt submitted for ${selectedPlan.title}`, {
        description: "We will verify the transaction and update your balance shortly."
      });
      setIsPaymentModalOpen(false);
    } catch (error) {
      toast.error("Submission failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Installment Plans</h1>
          <p className="text-slate-500 mt-1">Track and manage your scheduled investment payments.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-full border-slate-200 hover:bg-slate-50">
            <Download className="mr-2 h-4 w-4" /> Download Schedule
          </Button>
          <Button 
            className="bg-slate-900 text-white rounded-full hover:bg-slate-800 shadow-lg shadow-slate-200"
          >
            <Calendar className="mr-2 h-4 w-4" /> View Calendar
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 rounded-[28px] p-6 text-white relative overflow-hidden shadow-xl shadow-slate-200">
           <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-[#DDA04E] rounded-full blur-3xl opacity-20"></div>
           <div className="relative z-10">
             <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center mb-4 text-[#DDA04E]">
               <WalletIcon className="h-5 w-5" />
             </div>
             <p className="text-slate-400 text-sm font-medium">Total Outstanding</p>
             <h3 className="text-3xl font-bold mt-1">₦24,000,000</h3>
             <p className="text-xs text-slate-400 mt-2">Across 2 active plans</p>
           </div>
        </div>

        <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm relative overflow-hidden">
           <div className="h-10 w-10 bg-green-50 rounded-xl flex items-center justify-center mb-4 text-green-600">
             <CheckCircle2 className="h-5 w-5" />
           </div>
           <p className="text-slate-500 text-sm font-medium">Total Paid</p>
           <h3 className="text-3xl font-bold text-slate-900 mt-1">₦38,000,000</h3>
           <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full rounded-full" style={{ width: '61%' }}></div>
           </div>
           <p className="text-xs text-slate-400 mt-2">61% of total commitments</p>
        </div>

        <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm relative overflow-hidden">
           <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center mb-4 text-amber-600">
             <Calendar className="h-5 w-5" />
           </div>
           <p className="text-slate-500 text-sm font-medium">Next Payment Due</p>
           <h3 className="text-3xl font-bold text-slate-900 mt-1">₦5,000,000</h3>
           <p className="text-xs text-amber-600 font-bold bg-amber-50 w-fit px-2 py-1 rounded-lg mt-2">
             Due in 8 days (May 15)
           </p>
        </div>
      </div>

      {/* Active Plans */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6">Active Plans</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {MOCK_PLANS.map((plan) => {
            const progress = (plan.paidAmount / plan.totalAmount) * 100;
            return (
              <div key={plan.id} className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-slate-700">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{plan.title}</h3>
                      <p className="text-sm text-slate-500">{plan.property}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {plan.status}
                  </Badge>
                </div>

                <div className="space-y-6">
                  {/* Progress Section */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-500">Progress</span>
                      <span className="font-bold text-slate-900">{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-2 bg-slate-100" />
                    <div className="flex justify-between text-xs text-slate-400 mt-2">
                      <span>Paid: ₦{plan.paidAmount.toLocaleString()}</span>
                      <span>Total: ₦{plan.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Payment Info Grid */}
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Remaining</p>
                      <p className="text-lg font-bold text-slate-900">₦{plan.remainingAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Next Installment</p>
                      <div className="flex items-center gap-2">
                         <p className="text-lg font-bold text-[#DDA04E]">₦{plan.nextPaymentAmount.toLocaleString()}</p>
                         <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-500">
                           {plan.frequency}
                         </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Due {plan.nextPaymentDate}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 bg-slate-900 text-white rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-200 py-6"
                      onClick={() => handleOpenPayment(plan)}
                    >
                      Pay Installment <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="px-4 rounded-xl border-slate-200 hover:bg-slate-50"
                      onClick={() => handleOpenDetails(plan)}
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <h3 className="text-xl font-bold text-slate-900">Payment History</h3>
          
          <div className="flex gap-2 w-full sm:w-auto">
             <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                   placeholder="Search payments..." 
                   className="pl-10 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-all"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Button variant="outline" className="rounded-xl px-3 border-slate-200 bg-slate-50">
                      <Filter className="h-4 w-4" />
                   </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                   <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                   <DropdownMenuSeparator />
                   <DropdownMenuItem onClick={() => setFilterType("All")}>All</DropdownMenuItem>
                   <DropdownMenuItem onClick={() => setFilterType("Income")}>Completed</DropdownMenuItem>
                   <DropdownMenuItem onClick={() => setFilterType("Expense")}>Pending</DropdownMenuItem>
                </DropdownMenuContent>
             </DropdownMenu>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-semibold text-slate-900">Transaction ID</TableHead>
                <TableHead className="font-semibold text-slate-900">Description</TableHead>
                <TableHead className="font-semibold text-slate-900">Date</TableHead>
                <TableHead className="font-semibold text-slate-900">Status</TableHead>
                <TableHead className="text-right font-semibold text-slate-900">Amount</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => (
                  <TableRow key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium text-slate-500">{t.id}</TableCell>
                    <TableCell>
                       <div className="flex flex-col">
                          <span className="font-medium text-slate-900">{t.title}</span>
                          <span className="text-xs text-slate-400">{t.type}</span>
                       </div>
                    </TableCell>
                    <TableCell className="text-slate-500">{t.date}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={`
                          ${t.status === 'Completed' ? 'bg-green-100 text-green-700 hover:bg-green-200' : ''}
                          ${t.status === 'Pending' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : ''}
                          ${t.status === 'Failed' ? 'bg-red-100 text-red-700 hover:bg-red-200' : ''}
                        `}
                      >
                        {t.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-900">
                      {t.amount}
                    </TableCell>
                    <TableCell>
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                          <MoreHorizontal className="h-4 w-4" />
                       </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                    No payment history found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white rounded-[24px] border-none shadow-2xl p-0 overflow-hidden">
          <div className="bg-slate-900 p-6 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-[#DDA04E] rounded-full blur-2xl opacity-30"></div>
             <DialogHeader className="relative z-10">
               <DialogTitle className="text-xl font-bold">Make Payment</DialogTitle>
               <DialogDescription className="text-slate-400">
                 Transfer funds to our account and upload the receipt.
               </DialogDescription>
             </DialogHeader>
          </div>

          <form onSubmit={handlePaymentSubmit} className="p-6 pt-4 grid gap-6">
            
            {/* Bank Details Card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-200/60">
                    <div className="h-10 w-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-[#DDA04E]">
                        <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-900 text-sm">ClientFlow Management</p>
                        <p className="text-xs text-slate-500">Official Business Account</p>
                    </div>
                </div>
                
                <div className="space-y-3">
                    <div className="flex justify-between items-center group">
                        <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Bank</span>
                        <span className="text-sm font-semibold text-slate-900">ClientFlow Central Bank</span>
                    </div>
                    <div className="flex justify-between items-center group cursor-pointer" onClick={() => copyToClipboard("882939920012", "Account Number")}>
                        <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Account No.</span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-mono font-semibold text-slate-900">8829-3992-0012</span>
                            <Copy className="h-3 w-3 text-slate-400 group-hover:text-[#DDA04E]" />
                        </div>
                    </div>
                    <div className="flex justify-between items-center group cursor-pointer" onClick={() => copyToClipboard("021000021", "Routing Number")}>
                        <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Routing</span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-mono font-semibold text-slate-900">021000021</span>
                            <Copy className="h-3 w-3 text-slate-400 group-hover:text-[#DDA04E]" />
                        </div>
                    </div>
                    <div className="flex justify-between items-center group cursor-pointer" onClick={() => copyToClipboard(selectedPlan?.id || "", "Reference ID")}>
                        <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Reference</span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-mono font-semibold text-slate-900 bg-slate-200/50 px-1.5 py-0.5 rounded">{selectedPlan?.id}</span>
                            <Copy className="h-3 w-3 text-slate-400 group-hover:text-[#DDA04E]" />
                        </div>
                    </div>
                </div>

                <div className="pt-2 text-center">
                    <p className="text-xs text-slate-500">
                        Total Amount Due: <span className="font-bold text-slate-900">₦{(selectedPlan?.nextPaymentAmount || 0).toLocaleString()}</span>
                    </p>
                </div>
            </div>

            {/* Upload Section */}
            <div className="space-y-2">
                <Label htmlFor="receipt" className="font-semibold text-slate-700">Upload Receipt</Label>
                <div 
                    className={`
                        border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer
                        ${receiptFile ? 'border-[#DDA04E] bg-[#DDA04E]/5' : 'border-slate-200 hover:border-[#DDA04E]/50 hover:bg-slate-50'}
                    `}
                    onClick={() => document.getElementById('receipt-upload')?.click()}
                >
                    <input 
                        id="receipt-upload" 
                        type="file" 
                        accept="image/*,.pdf" 
                        className="hidden" 
                        onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                    />
                    
                    {receiptFile ? (
                        <div className="flex flex-col items-center">
                            <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-2">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <p className="text-sm font-medium text-slate-900">{receiptFile.name}</p>
                            <p className="text-xs text-slate-500">{(receiptFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            <Button type="button" variant="link" size="sm" className="text-red-500 h-auto p-0 mt-2" onClick={(e) => { e.stopPropagation(); setReceiptFile(null); }}>
                                Remove
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-2">
                                <Upload className="h-5 w-5" />
                            </div>
                            <p className="text-sm font-medium text-slate-900">Click to upload receipt</p>
                            <p className="text-xs text-slate-500 mt-1">JPG, PNG or PDF (Max 5MB)</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsPaymentModalOpen(false)} 
                  className="flex-1 rounded-xl py-6 border-slate-200 hover:bg-slate-50"
                  disabled={isProcessing}
              >
                  Cancel
              </Button>
              <Button 
                  type="submit" 
                  className="flex-1 rounded-xl py-6 bg-[#DDA04E] hover:bg-[#c48b3d] text-white shadow-lg shadow-[#DDA04E]/20" 
                  disabled={isProcessing || !receiptFile}
              >
                  {isProcessing ? (
                      <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
                      </>
                  ) : (
                      <>
                          <CheckCircle2 className="mr-2 h-4 w-4" /> Submit Payment
                      </>
                  )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Plan Details Sheet */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="w-full sm:max-w-md bg-white p-0 flex flex-col h-full border-l border-slate-200">
          <div className="p-6 pb-2 border-b border-slate-100 bg-slate-50/50">
             <SheetHeader>
               <div className="flex items-center gap-3 mb-2">
                 <div className="h-10 w-10 bg-[#DDA04E]/10 rounded-xl flex items-center justify-center text-[#DDA04E]">
                   <Building2 className="h-5 w-5" />
                 </div>
                 <div className="flex-1 overflow-hidden">
                   <SheetTitle className="text-lg font-bold text-slate-900 truncate">{viewDetailsPlan?.title}</SheetTitle>
                   <SheetDescription className="text-slate-500 truncate">{viewDetailsPlan?.property}</SheetDescription>
                 </div>
               </div>
             </SheetHeader>
          </div>

          <ScrollArea className="flex-1">
             <div className="p-6 space-y-8">
               {/* Financial Summary */}
               <div className="space-y-4">
                 <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Financial Overview</h4>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                       <p className="text-xs text-slate-400 mb-1">Total Committed</p>
                       <p className="text-lg font-bold text-slate-900">₦{(viewDetailsPlan?.totalAmount || 0).toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-green-50 border border-green-100">
                       <p className="text-xs text-green-600 mb-1">Paid to Date</p>
                       <p className="text-lg font-bold text-green-700">₦{(viewDetailsPlan?.paidAmount || 0).toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 col-span-2 flex justify-between items-center">
                       <div>
                         <p className="text-xs text-amber-600 mb-1">Remaining Balance</p>
                         <p className="text-lg font-bold text-amber-700">₦{(viewDetailsPlan?.remainingAmount || 0).toLocaleString()}</p>
                       </div>
                       <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg" onClick={() => { setIsDetailsOpen(false); if(viewDetailsPlan) handleOpenPayment(viewDetailsPlan); }}>
                         Pay Now
                       </Button>
                    </div>
                 </div>
               </div>

               <Separator />

               {/* Plan Details */}
               <div className="space-y-4">
                 <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Plan Details</h4>
                 <div className="space-y-3 text-sm">
                    <div className="flex justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                       <span className="text-slate-500 flex items-center gap-2"><Clock className="h-4 w-4" /> Frequency</span>
                       <span className="font-medium text-slate-900">{viewDetailsPlan?.frequency}</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                       <span className="text-slate-500 flex items-center gap-2"><Calendar className="h-4 w-4" /> Start Date</span>
                       <span className="font-medium text-slate-900">Nov 1, 2023</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                       <span className="text-slate-500 flex items-center gap-2"><AlertCircle className="h-4 w-4" /> Status</span>
                       <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{viewDetailsPlan?.status}</Badge>
                    </div>
                 </div>
               </div>

               <Separator />

               {/* Documents */}
               <div className="space-y-4">
                 <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Documents</h4>
                 <div className="space-y-2">
                    {viewDetailsPlan?.documents?.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-white hover:border-[#DDA04E]/50 transition-colors group cursor-pointer">
                         <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 group-hover:bg-[#DDA04E]/10 group-hover:text-[#DDA04E] transition-colors">
                               <FileText className="h-4 w-4" />
                            </div>
                            <div>
                               <p className="text-sm font-medium text-slate-900">{doc.name}</p>
                               <p className="text-xs text-slate-400">{doc.date}</p>
                            </div>
                         </div>
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 group-hover:text-[#DDA04E]">
                            <Download className="h-4 w-4" />
                         </Button>
                      </div>
                    ))}
                 </div>
               </div>

               <Separator />

               {/* Recent Activity for this Plan */}
               <div className="space-y-4">
                 <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Recent Activity</h4>
                 <div className="relative border-l-2 border-slate-100 ml-3 space-y-6 pb-2">
                    {/* Mock activity timeline */}
                    <div className="relative pl-6">
                       <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-white bg-green-500 box-content shadow-sm"></div>
                       <p className="text-sm font-medium text-slate-900">Payment Received</p>
                       <p className="text-xs text-slate-500 mt-0.5">May 15, 2024 • ₦5,000,000</p>
                    </div>
                    <div className="relative pl-6">
                       <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-white bg-slate-300 box-content"></div>
                       <p className="text-sm font-medium text-slate-900">Invoice Generated</p>
                       <p className="text-xs text-slate-500 mt-0.5">May 1, 2024 • #INV-2024-001</p>
                    </div>
                    <div className="relative pl-6">
                       <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-white bg-green-500 box-content shadow-sm"></div>
                       <p className="text-sm font-medium text-slate-900">Payment Received</p>
                       <p className="text-xs text-slate-500 mt-0.5">April 15, 2024 • ₦5,000,000</p>
                    </div>
                 </div>
                 <Button variant="link" className="w-full text-slate-500 hover:text-[#DDA04E] text-xs">
                    View Full History
                 </Button>
               </div>
             </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
