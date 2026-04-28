import { useEffect, useState } from "react";
import { 
  Calendar, 
  CreditCard, 
  DollarSign, 
  FileText, 
  Tag, 
  User,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { Badge } from "../ui/badge";

export interface TransactionData {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
  status: string;
  tenant?: string;
  vendor?: string;
}

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "view" | "edit";
  transaction?: TransactionData | null;
}

export function TransactionDialog({ open, onOpenChange, mode, transaction }: TransactionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TransactionData>({
    id: "",
    date: "",
    description: "",
    amount: 0,
    type: "income",
    status: "pending",
  });

  useEffect(() => {
    if (transaction && open) {
      setFormData(transaction);
    }
  }, [transaction, open]);

  const handleChange = (field: keyof TransactionData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onOpenChange(false);
      toast.success("Transaction updated successfully", {
        description: `Transaction ${formData.id} has been updated.`
      });
    }, 1000);
  };

  if (!transaction && mode !== "edit") return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            {mode === "view" ? "Transaction Details" : "Edit Transaction"}
          </DialogTitle>
          <DialogDescription>
            {mode === "view" 
              ? `View details for transaction ${transaction?.id}` 
              : `Update details for transaction ${transaction?.id}`}
          </DialogDescription>
        </DialogHeader>

        {mode === "view" ? (
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500">Amount</p>
                <p className={`text-2xl font-bold ${formData.type === 'income' ? 'text-green-600' : 'text-slate-900'}`}>
                  {formData.type === 'income' ? '+' : '-'}₦{Math.abs(formData.amount).toLocaleString()}
                </p>
              </div>
              <Badge 
                variant="outline" 
                className={`
                  px-3 py-1 text-sm border-none
                  ${formData.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}
                `}
              >
                {formData.status === 'completed' ? (
                  <CheckCircle2 className="w-3 h-3 mr-1 inline" />
                ) : (
                  <AlertCircle className="w-3 h-3 mr-1 inline" />
                )}
                <span className="capitalize">{formData.status}</span>
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-slate-400 uppercase">Date</Label>
                <div className="flex items-center text-slate-700">
                  <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                  {formData.date}
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-400 uppercase">Type</Label>
                <div className="flex items-center text-slate-700">
                  <Tag className="w-4 h-4 mr-2 text-slate-400" />
                  <span className="capitalize">{formData.type}</span>
                </div>
              </div>
              <div className="col-span-2 space-y-1">
                <Label className="text-xs text-slate-400 uppercase">Description</Label>
                <div className="flex items-center text-slate-700">
                  <FileText className="w-4 h-4 mr-2 text-slate-400" />
                  {formData.description}
                </div>
              </div>
              <div className="col-span-2 space-y-1">
                <Label className="text-xs text-slate-400 uppercase">
                  {formData.type === 'income' ? 'Payer (Tenant)' : 'Payee (Vendor)'}
                </Label>
                <div className="flex items-center text-slate-700">
                  <User className="w-4 h-4 mr-2 text-slate-400" />
                  {formData.tenant || formData.vendor || "N/A"}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    id="date" 
                    type="date"
                    className="pl-10" 
                    value={formData.date}
                    onChange={(e) => handleChange("date", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    id="amount" 
                    type="number"
                    className="pl-10" 
                    value={Math.abs(formData.amount)}
                    onChange={(e) => handleChange("amount", parseFloat(e.target.value) * (formData.type === 'expense' ? -1 : 1))}
                  />
                </div>
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Description</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    id="description" 
                    className="pl-10" 
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select 
                  value={formData.type}
                  onValueChange={(val) => handleChange("type", val)}
                >
                  <SelectTrigger className="pl-10 relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status}
                  onValueChange={(val) => handleChange("status", val)}
                >
                  <SelectTrigger className="pl-10 relative">
                    <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="entity">
                  {formData.type === 'income' ? 'Tenant Name' : 'Vendor Name'}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    id="entity" 
                    className="pl-10" 
                    value={formData.tenant || formData.vendor || ""}
                    onChange={(e) => {
                      if (formData.type === 'income') {
                        handleChange("tenant", e.target.value);
                      } else {
                        handleChange("vendor", e.target.value);
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#DDA04E] hover:bg-[#c48b3d] text-white" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        )}

        {mode === "view" && (
          <DialogFooter>
             <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
                Close
              </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
