import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { CreditCard, Wrench, MessageSquare, AlertCircle, CheckCircle2, Clock, CalendarDays, Building2, Copy, Upload, Loader2, Wifi, Zap, Dumbbell, Flame } from "lucide-react";
import { MAINTENANCE_TICKETS } from "../../lib/data";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";

const UTILITIES = [
  { id: 'wifi', label: 'Wi-Fi Package', price: 30, icon: Wifi },
  { id: 'electricity', label: 'Electricity Bill', price: 50, icon: Zap },
  { id: 'gym', label: 'Gym Membership', price: 20, icon: Dumbbell },
  { id: 'gas', label: 'Cooking Gas', price: 15, icon: Flame },
];

export function TenantDashboard() {
  const nextRentDate = "July 1, 2024";
  const baseRentAmount = 850;
  const rentStatus = "Pending";

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [selectedUtilities, setSelectedUtilities] = useState<string[]>([]);

  const calculateTotal = () => {
    const utilitiesTotal = selectedUtilities.reduce((sum, id) => {
        const utility = UTILITIES.find(u => u.id === id);
        return sum + (utility ? utility.price : 0);
    }, 0);
    return baseRentAmount + utilitiesTotal;
  };

  const handleToggleUtility = (id: string) => {
    setSelectedUtilities(prev => 
      prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]
    );
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptFile) {
        toast.error("Please upload a payment receipt.");
        return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Rent payment submitted`, {
        description: `Receipt received for $${calculateTotal().toLocaleString()}. verification in progress.`
      });
      setIsPaymentModalOpen(false);
      setReceiptFile(null);
      setSelectedUtilities([]);
    } catch (error) {
      toast.error("Submission failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
         <div>
           <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome Home</h2>
           <p className="text-slate-500 mt-1">Unit 304 - The Pavilion Hostel</p>
         </div>
         <div className="flex space-x-2">
            <div className="bg-white rounded-full px-4 py-2 text-sm font-medium shadow-sm border border-slate-100 flex items-center">
               <CalendarDays className="mr-2 h-4 w-4 text-[#DDA04E]" />
               Today: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
         </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Rent Status Card - Dark Theme */}
        <Card className="md:col-span-2 bg-[#1e1e1e] text-white border-none shadow-xl shadow-slate-200/50 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#DDA04E] rounded-full blur-3xl opacity-10"></div>
          
          <CardHeader className="relative z-10 pb-2">
            <div className="flex justify-between items-start">
               <div>
                 <CardTitle className="text-slate-400 font-medium text-sm">Next Payment Due</CardTitle>
                 <div className="text-4xl font-bold mt-2 text-white">{nextRentDate}</div>
               </div>
               <div className={`px-4 py-1.5 rounded-full text-xs font-bold ${rentStatus === 'Paid' ? 'bg-green-500/20 text-green-400' : 'bg-[#DDA04E]/20 text-[#DDA04E]'}`}>
                 {rentStatus}
               </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 mt-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Total Amount</p>
                <span className="text-2xl font-bold text-white">${baseRentAmount.toFixed(2)}</span>
              </div>
              <Button 
                onClick={() => setIsPaymentModalOpen(true)}
                className="bg-[#DDA04E] hover:bg-[#c48b3d] text-slate-900 font-bold px-8 rounded-xl h-12"
              >
                Pay Rent Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Grid */}
        <div className="grid grid-rows-2 gap-4">
           <Button variant="outline" className="h-full bg-white border-none shadow-sm rounded-3xl hover:bg-gray-50 flex flex-col items-center justify-center space-y-2 group">
              <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Wrench className="h-5 w-5" />
              </div>
              <span className="font-semibold text-slate-700">Report Issue</span>
           </Button>
           <Button variant="outline" className="h-full bg-white border-none shadow-sm rounded-3xl hover:bg-gray-50 flex flex-col items-center justify-center space-y-2 group">
              <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="h-5 w-5" />
              </div>
              <span className="font-semibold text-slate-700">Chat Admin</span>
           </Button>
        </div>
      </div>

      {/* Maintenance Tickets */}
      <Card className="border-none shadow-sm rounded-3xl bg-white">
        <CardHeader>
          <CardTitle>Maintenance Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {MAINTENANCE_TICKETS.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#DDA04E]/30 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className={`mt-1 p-2 rounded-xl ${
                    ticket.status === 'Resolved' ? 'bg-green-100 text-green-600' :
                    ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    {ticket.status === 'Resolved' ? <CheckCircle2 className="h-5 w-5" /> :
                     ticket.status === 'In Progress' ? <Clock className="h-5 w-5" /> :
                     <AlertCircle className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{ticket.title}</p>
                    <p className="text-xs text-slate-500 mt-1">Reported on {ticket.date} • {ticket.property}</p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-bold bg-white border border-slate-200">
                  {ticket.status}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white rounded-[24px] border-none shadow-2xl p-0 overflow-hidden max-h-[90vh] flex flex-col">
          <div className="bg-slate-900 p-6 text-white relative overflow-hidden shrink-0">
             <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-[#DDA04E] rounded-full blur-2xl opacity-30"></div>
             <DialogHeader className="relative z-10">
               <DialogTitle className="text-xl font-bold">Pay Rent</DialogTitle>
               <DialogDescription className="text-slate-400">
                 Transfer funds and upload your receipt below.
               </DialogDescription>
             </DialogHeader>
          </div>

          <form onSubmit={handlePaymentSubmit} className="p-6 pt-4 grid gap-6 overflow-y-auto">
            
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
                </div>

                <div className="pt-2 text-center">
                    <p className="text-xs text-slate-500">
                        Total Amount Due: <span className="font-bold text-slate-900 text-lg ml-1">${calculateTotal().toLocaleString()}</span>
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

            {/* Utilities Section */}
            <div className="space-y-3">
                <Label className="font-semibold text-slate-700">Add-on Utilities (Optional)</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {UTILITIES.map((utility) => (
                        <div 
                            key={utility.id}
                            className={`
                                flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer
                                ${selectedUtilities.includes(utility.id) 
                                    ? 'border-[#DDA04E] bg-[#DDA04E]/5' 
                                    : 'border-slate-200 hover:border-slate-300'}
                            `}
                            onClick={() => handleToggleUtility(utility.id)}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${selectedUtilities.includes(utility.id) ? 'bg-[#DDA04E]/20 text-[#DDA04E]' : 'bg-slate-100 text-slate-500'}`}>
                                    <utility.icon className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{utility.label}</p>
                                    <p className="text-xs text-slate-500">+${utility.price}/mo</p>
                                </div>
                            </div>
                            <Checkbox 
                                checked={selectedUtilities.includes(utility.id)}
                                onCheckedChange={() => handleToggleUtility(utility.id)}
                                className="data-[state=checked]:bg-[#DDA04E] data-[state=checked]:border-[#DDA04E]"
                            />
                        </div>
                    ))}
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
    </div>
  );
}
