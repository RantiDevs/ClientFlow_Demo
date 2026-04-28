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
import { Hash, DollarSign, Ruler, Bed, Bath } from "lucide-react";

export interface UnitData {
  unitNumber: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  rent: number;
  status: "Vacant" | "Occupied" | "Maintenance";
}

interface AddUnitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddUnit: (unit: UnitData) => void;
  propertyId: string;
}

export function AddUnitDialog({ open, onOpenChange, onAddUnit, propertyId }: AddUnitDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UnitData>({
    unitNumber: "",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 750,
    rent: 1200,
    status: "Vacant"
  });

  const handleChange = (field: keyof UnitData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onAddUnit(formData);
      onOpenChange(false);
      
      // Reset form
      setFormData({
        unitNumber: "",
        bedrooms: 1,
        bathrooms: 1,
        sqft: 750,
        rent: 1200,
        status: "Vacant"
      });

      toast.success("Unit created successfully", {
        description: `Unit ${formData.unitNumber} has been added.`
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">Add New Unit</DialogTitle>
          <DialogDescription>
            Enter the details for the new unit.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="unitNumber">Unit Number</Label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
              <Input 
                id="unitNumber" 
                placeholder="e.g. 101, 2B, PH" 
                className="pl-10" 
                required 
                value={formData.unitNumber}
                onChange={(e) => handleChange("unitNumber", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <div className="relative">
                <Bed className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                <Input 
                  id="bedrooms" 
                  type="number" 
                  min="0"
                  className="pl-10" 
                  required 
                  value={formData.bedrooms}
                  onChange={(e) => handleChange("bedrooms", parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <div className="relative">
                <Bath className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                <Input 
                  id="bathrooms" 
                  type="number" 
                  min="0"
                  step="0.5"
                  className="pl-10" 
                  required 
                  value={formData.bathrooms}
                  onChange={(e) => handleChange("bathrooms", parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sqft">Size (Sq Ft)</Label>
              <div className="relative">
                <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                <Input 
                  id="sqft" 
                  type="number" 
                  min="0"
                  className="pl-10" 
                  required 
                  value={formData.sqft}
                  onChange={(e) => handleChange("sqft", parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Initial Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(val: any) => handleChange("status", val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Vacant">Vacant</SelectItem>
                <SelectItem value="Occupied">Occupied</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#DDA04E] hover:bg-[#c48b3d] text-white" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Unit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
