import { useState, useEffect } from "react";
import { Plus, Upload, Building, MapPin, DollarSign, Users, Home, Layout } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

export interface PropertyData {
  id?: string;
  name: string;
  type: string;
  location: string;
  status: string;
  image?: string;
  totalUnits?: number;
  roi?: number;
  description?: string;
}

interface AddPropertyDialogProps {
  trigger?: React.ReactNode;
  mode?: "add" | "edit";
  initialData?: PropertyData;
}

export function AddPropertyDialog({ trigger, mode = "add", initialData }: AddPropertyDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState<PropertyData>({
    name: "",
    type: "hostel",
    location: "",
    status: "active",
    totalUnits: 0,
    roi: 0,
    description: ""
  });

  // Load initial data when dialog opens or data changes
  useEffect(() => {
    if (initialData && open) {
      setFormData({
        ...initialData,
        type: initialData.type.toLowerCase(), // Ensure lowercase for select matching
        status: initialData.status.toLowerCase() === "under management" ? "management" : initialData.status.toLowerCase(),
      });
    } else if (!initialData && open) {
       // Reset if adding new
       setFormData({
        name: "",
        type: "hostel",
        location: "",
        status: "active",
        totalUnits: 0,
        roi: 0,
        description: ""
      });
    }
  }, [initialData, open]);

  const handleChange = (field: keyof PropertyData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setOpen(false);
      
      if (mode === "edit") {
        toast.success("Property updated successfully", {
          description: `${formData.name} has been updated.`
        });
      } else {
        toast.success("Property added successfully", {
          description: "The new property has been added to your portfolio."
        });
      }
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-[#DDA04E] text-white hover:bg-[#c48b3d] shadow-lg shadow-[#DDA04E]/20 rounded-full px-6">
            <Plus className="mr-2 h-4 w-4" /> Add Property
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            {mode === "edit" ? "Edit Property" : "Add New Property"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit" 
              ? "Update the details of your existing real estate asset." 
              : "Enter the details of the new real estate asset to add to your portfolio."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            {/* Image Upload Area */}
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer group relative overflow-hidden">
               {initialData?.image ? (
                  <>
                    <img src={initialData.image} alt="Property" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="h-12 w-12 bg-white/80 rounded-full flex items-center justify-center mb-3">
                            <Upload className="h-6 w-6 text-slate-700" />
                        </div>
                        <p className="text-sm font-medium text-slate-900 bg-white/80 px-2 py-1 rounded">Change image</p>
                    </div>
                  </>
               ) : (
                <>
                  <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-[#DDA04E]/10 transition-colors">
                    <Upload className="h-6 w-6 text-slate-400 group-hover:text-[#DDA04E] transition-colors" />
                  </div>
                  <p className="text-sm font-medium text-slate-900">Click to upload property image</p>
                  <p className="text-xs text-slate-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                </>
               )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="name">Property Name</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    id="name" 
                    placeholder="e.g. The Pavilion Hostel" 
                    className="pl-10" 
                    required 
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    id="location" 
                    placeholder="e.g. University District, Zone A" 
                    className="pl-10" 
                    required 
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Property Type</Label>
                <Select 
                    value={formData.type} 
                    onValueChange={(val) => handleChange("type", val)}
                >
                  <SelectTrigger className="pl-10 relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hostel">Hostel</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
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
                    <Layout className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="management">Under Management</SelectItem>
                    <SelectItem value="construction">Under Construction</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="units">Total Units</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    id="units" 
                    type="number" 
                    placeholder="0" 
                    className="pl-10" 
                    required 
                    value={formData.totalUnits}
                    onChange={(e) => handleChange("totalUnits", parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roi">Expected ROI (%)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    id="roi" 
                    type="number" 
                    step="0.1" 
                    placeholder="0.0" 
                    className="pl-10" 
                    required 
                    value={formData.roi}
                    onChange={(e) => handleChange("roi", parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                    id="description" 
                    placeholder="Enter property description..." 
                    className="min-h-[100px]"
                    value={formData.description || ""}
                    onChange={(e) => handleChange("description", e.target.value)} 
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#DDA04E] hover:bg-[#c48b3d] text-white min-w-[120px]" disabled={isLoading}>
              {isLoading ? (mode === "edit" ? "Saving..." : "Adding...") : (mode === "edit" ? "Save Changes" : "Add Property")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
