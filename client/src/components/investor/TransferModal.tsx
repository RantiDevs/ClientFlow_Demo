import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { ArrowUpRight, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "../ui/alert";

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (amount: number, recipient: string) => void;
  currentBalance: number;
}

export function TransferModal({ isOpen, onClose, onTransfer, currentBalance }: TransferModalProps) {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const numAmount = parseFloat(amount);
    
    // Validation
    if (!recipient.trim()) {
      setError("Please enter a recipient.");
      return;
    }
    
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }
    
    if (numAmount > currentBalance) {
      setError("Insufficient funds for this transfer.");
      return;
    }

    setIsLoading(true);
    
    // Simulate API network delay
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      onTransfer(numAmount, recipient);
      setAmount("");
      setRecipient("");
      onClose();
    } catch (err) {
      toast.error("Transfer failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      onClose();
      // Reset form on close
      setTimeout(() => {
        setAmount("");
        setRecipient("");
        setError(null);
      }, 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-[24px] border-none shadow-2xl p-0 overflow-hidden">
        <div className="bg-slate-900 p-6 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-[#DDA04E] rounded-full blur-2xl opacity-30"></div>
           <DialogHeader className="relative z-10">
             <DialogTitle className="text-xl font-bold">Transfer Funds</DialogTitle>
             <DialogDescription className="text-slate-400">
               Send money securely to other accounts.
             </DialogDescription>
           </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-4 grid gap-6">
          {error && (
            <Alert variant="destructive" className="bg-red-50 text-red-600 border-red-100">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-2">
            <Label htmlFor="recipient" className="font-semibold text-slate-700">Recipient</Label>
            <Input 
                id="recipient" 
                placeholder="Enter name, email, or wallet ID" 
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="rounded-xl border-slate-200 focus:border-[#DDA04E] focus:ring-[#DDA04E]"
                disabled={isLoading}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex justify-between">
                <Label htmlFor="amount" className="font-semibold text-slate-700">Amount (USD)</Label>
                <span className="text-xs font-medium text-slate-500">
                    Balance: <span className="text-slate-900">${currentBalance.toLocaleString()}</span>
                </span>
            </div>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <Input 
                    id="amount" 
                    type="number" 
                    placeholder="0.00" 
                    className="pl-8 rounded-xl border-slate-200 focus:border-[#DDA04E] focus:ring-[#DDA04E] text-lg font-bold"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    max={currentBalance}
                    step="0.01"
                    disabled={isLoading}
                />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                className="flex-1 rounded-xl py-6 border-slate-200 hover:bg-slate-50"
                disabled={isLoading}
            >
                Cancel
            </Button>
            <Button 
                type="submit" 
                className="flex-1 rounded-xl py-6 bg-[#DDA04E] hover:bg-[#c48b3d] text-white shadow-lg shadow-[#DDA04E]/20" 
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing
                    </>
                ) : (
                    <>
                        <ArrowUpRight className="mr-2 h-4 w-4" /> Transfer Now
                    </>
                )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
