import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { Calendar, DollarSign, User } from "lucide-react";

export interface AssignmentData {
  tenantName: string;
  leaseStart: string;
  leaseEnd: string;
  rent: number;
  deposit: number;
}

interface AssignTenantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (data: AssignmentData) => void;
  unit: any;
}

// Mock potential tenants who are looking for a place
const PROSPECTIVE_TENANTS = [
  { id: "p1", name: "Alice Cooper" },
  { id: "p2", name: "Bob Martin" },
  { id: "p3", name: "Charlie Davis" },
  { id: "p4", name: "Diana Prince" },
  { id: "p5", name: "Evan Wright" }
];

export function AssignTenantDialog({ open, onOpenChange, onAssign, unit }: AssignTenantDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AssignmentData>({
    tenantName: "",
    leaseStart: new Date().toISOString().split('T')[0],
    leaseEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    rent: unit?.rent || 0,
    deposit: unit?.rent || 0
  });

  // Update rent if unit changes
  if (unit && formData.rent === 0 && unit.rent > 0) {
      setFormData(prev => ({ ...prev, rent: unit.rent, deposit: unit.rent }));
  }

  const handleChange = (field: keyof AssignmentData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onAssign(formData);
      onOpenChange(false);
      
      toast.success("Tenant Assigned Successfully", {
        description: `${formData.tenantName} has been assigned to Unit ${unit.unitNumber}.`
      });
      
      // Reset form (optional, depending on UX preference)
    }, 1000);
  };

  if (!unit) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">Assign Tenant</DialogTitle>
          <DialogDescription>
            Assign a tenant to Unit {unit.unitNumber}. This will update the unit status to Occupied.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tenant">Select Tenant</Label>
            <Select 
              value={formData.tenantName} 
              onValueChange={(val) => handleChange("tenantName", val)}
              required
            >
              <SelectTrigger className="pl-10 relative">
                 <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <SelectValue placeholder="Select a tenant..." />
              </SelectTrigger>
              <SelectContent>
                {PROSPECTIVE_TENANTS.map((t) => (
                  <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500">Selecting from approved applicants.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="leaseStart">Lease Start</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                <Input 
                  id="leaseStart" 
                  type="date" 
                  className="pl-10" 
                  required 
                  value={formData.leaseStart}
                  onChange={(e) => handleChange("leaseStart", e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="leaseEnd">Lease End</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                <Input 
                  id="leaseEnd" 
                  type="date" 
                  className="pl-10" 
                  required 
                  value={formData.leaseEnd}
                  onChange={(e) => handleChange("leaseEnd", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rent">Monthly Rent</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                <Input 
                  id="rent" 
                  type="number" 
                  min="0"
                  className="pl-10" 
                  required 
                  value={formData.rent}
                  onChange={(e) => handleChange("rent", parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deposit">Security Deposit</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                <Input 
                  id="deposit" 
                  type="number" 
                  min="0"
                  className="pl-10" 
                  required 
                  value={formData.deposit}
                  onChange={(e) => handleChange("deposit", parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#DDA04E] hover:bg-[#c48b3d] text-white" disabled={isLoading}>
              {isLoading ? "Assigning..." : "Assign Tenant"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
