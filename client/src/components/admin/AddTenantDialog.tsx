import { useState, useEffect } from "react";
import { 
    Plus, Upload, User, Mail, Phone, Home, Calendar, CreditCard, 
    Building2, ArrowRight, ArrowLeft, CheckCircle2, FileText, AlertCircle,
    ChevronRight, ChevronLeft, Gem
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { PROJECTS } from "../../lib/data";
import { motion, AnimatePresence } from "motion/react";
import { Progress } from "../ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export interface TenantData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  unit: string;
  leaseStart: string;
  leaseEnd: string;
  rentAmount: number;
  status: string;
  avatar?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  notes?: string;
}

interface AddTenantDialogProps {
  trigger?: React.ReactNode;
  mode?: "add" | "edit";
  initialData?: TenantData;
}

export function AddTenantDialog({ trigger, mode = "add", initialData }: AddTenantDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Form State
  const [formData, setFormData] = useState<TenantData>({
    name: "",
    email: "",
    phone: "",
    propertyId: "",
    unit: "",
    leaseStart: "",
    leaseEnd: "",
    rentAmount: 0,
    status: "Active",
    emergencyName: "",
    emergencyPhone: "",
    notes: ""
  });

  // Load initial data
  useEffect(() => {
    if (initialData && open) {
      setFormData(initialData);
    } else if (!initialData && open) {
       // Reset if adding new
       setFormData({
        name: "",
        email: "",
        phone: "",
        propertyId: "",
        unit: "",
        leaseStart: "",
        leaseEnd: "",
        rentAmount: 0,
        status: "Active",
        emergencyName: "",
        emergencyPhone: "",
        notes: ""
      });
      setCurrentStep(1);
    }
  }, [initialData, open]);

  const handleChange = (field: keyof TenantData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number) => {
    if (step === 1) {
        if (!formData.name || !formData.email || !formData.phone) {
            toast.error("Please fill in all required fields.");
            return false;
        }
    }
    if (step === 2) {
        if (!formData.propertyId || !formData.unit || !formData.leaseStart || !formData.leaseEnd || !formData.rentAmount) {
            toast.error("Please fill in all lease details.");
            return false;
        }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
        setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setOpen(false);
    setCurrentStep(1);
      
    if (mode === "edit") {
        toast.success("Tenant updated successfully", {
            description: `${formData.name}'s profile has been updated.`
        });
    } else {
        toast.success("Tenant added successfully", {
            description: "New tenant has been registered to the system."
        });
    }
  };

  const steps = [
    { id: 1, title: "Personal Profile", subtitle: "Basic Information", icon: User },
    { id: 2, title: "Lease Details", subtitle: "Property & Terms", icon: Home },
    { id: 3, title: "Finalization", subtitle: "Review & Emergency", icon: CheckCircle2 },
  ];

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-[#DDA04E] text-white hover:bg-[#c48b3d] shadow-lg shadow-[#DDA04E]/20 rounded-full px-6">
            <Plus className="mr-2 h-4 w-4" /> Add Tenant
          </Button>
        )}
      </DialogTrigger>
      
      {/* Increased max-width for the split layout */}
      <DialogContent className="sm:max-w-[1000px] p-0 overflow-hidden bg-white gap-0 border-none shadow-2xl h-[700px] flex flex-col">
        
        {/* Top Header */}
        <div className="h-20 border-b border-slate-100 flex items-center justify-between px-8 bg-white shrink-0">
            <div className="flex items-center gap-2">
                <div className="bg-[#DDA04E] p-1.5 rounded-lg">
                    <Gem className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl text-slate-900 tracking-tight">ClientFlow</span>
            </div>
            <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Current User</p>
                    <p className="text-sm font-semibold text-slate-700">Admin Portal</p>
                </div>
                <Avatar className="h-10 w-10 border-2 border-slate-100">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>AD</AvatarFallback>
                </Avatar>
            </div>
        </div>

        {/* Main Split Layout */}
        <div className="flex flex-1 overflow-hidden">
            
            {/* Left Sidebar - Vertical Stepper */}
            <div className="w-[300px] bg-slate-50 border-r border-slate-100 p-8 hidden md:flex flex-col">
                <div className="space-y-8 relative">
                    {/* Connecting Line */}
                    <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-slate-200 -z-10" />
                    
                    {steps.map((step) => {
                        const isActive = step.id === currentStep;
                        const isCompleted = step.id < currentStep;
                        
                        return (
                            <div key={step.id} className="flex items-center gap-4 relative">
                                <motion.div 
                                    className={`
                                        h-10 w-10 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-300
                                        ${isActive 
                                            ? 'bg-white border-[#DDA04E] text-[#DDA04E] shadow-[0_0_15px_rgba(221,160,78,0.3)]' 
                                            : isCompleted
                                                ? 'bg-[#DDA04E] border-[#DDA04E] text-white'
                                                : 'bg-white border-slate-200 text-slate-300'
                                        }
                                    `}
                                    initial={false}
                                    animate={{ scale: isActive ? 1.1 : 1 }}
                                >
                                    <step.icon className="h-5 w-5" />
                                </motion.div>
                                <div>
                                    <p className={`text-sm font-semibold transition-colors ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                                        {step.title}
                                    </p>
                                    <p className="text-xs text-slate-400">{step.subtitle}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Right Content Panel */}
            <div className="flex-1 flex flex-col bg-white h-full relative">
                
                {/* Content Header */}
                <div className="px-10 pt-10 pb-6 shrink-0">
                    <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">
                        Welcome to Pavillon
                    </h2>
                    <p className="text-center text-slate-500 mb-8">
                        Complete the {totalSteps} steps to onboard the tenant
                    </p>
                    
                    <div className="space-y-2">
                         <div className="flex justify-between text-xs font-medium text-slate-500 uppercase tracking-wider">
                            <span>Progress</span>
                            <span>{Math.round(progressPercentage)}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2 bg-slate-100 [&>div]:bg-[#DDA04E]" />
                    </div>
                </div>

                {/* Scrollable Form Area */}
                <div className="flex-1 overflow-y-auto px-10 pb-24"> {/* pb-24 for footer space */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-slate-800 border-l-4 border-[#DDA04E] pl-3 mb-6">
                            {currentStep === 1 ? "Section A: Personal Details" : 
                             currentStep === 2 ? "Section B: Lease Agreement" : 
                             "Section C: Review & Finalize"}
                        </h3>
                        
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                {currentStep === 1 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2 flex justify-center mb-4">
                                             <div className="h-28 w-28 rounded-full bg-slate-50 border-2 border-dashed border-slate-300 flex items-center justify-center relative group cursor-pointer hover:border-[#DDA04E] transition-colors">
                                                {formData.avatar ? (
                                                    <img src={formData.avatar} alt="Avatar" className="h-full w-full object-cover rounded-full" />
                                                ) : (
                                                    <div className="text-center">
                                                        <Upload className="h-6 w-6 text-slate-400 mx-auto mb-1" />
                                                        <span className="text-[10px] text-slate-400">Upload Photo</span>
                                                    </div>
                                                )}
                                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input 
                                                id="name" 
                                                placeholder="e.g. Sarah Williams" 
                                                className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                                value={formData.name}
                                                onChange={(e) => handleChange("name", e.target.value)}
                                            />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input 
                                                id="email" 
                                                type="email"
                                                placeholder="email@example.com" 
                                                className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                                value={formData.email}
                                                onChange={(e) => handleChange("email", e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input 
                                                id="phone" 
                                                placeholder="+1 (555) 000-0000" 
                                                className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                                value={formData.phone}
                                                onChange={(e) => handleChange("phone", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2 space-y-2">
                                            <Label>Property Selection</Label>
                                            <Select 
                                                value={formData.propertyId} 
                                                onValueChange={(val) => handleChange("propertyId", val)}
                                            >
                                                <SelectTrigger className="bg-slate-50 border-slate-200">
                                                    <SelectValue placeholder="Select a property" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {PROJECTS.map(p => (
                                                        <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Unit Number</Label>
                                            <Input 
                                                placeholder="e.g. 304" 
                                                className="bg-slate-50 border-slate-200"
                                                value={formData.unit}
                                                onChange={(e) => handleChange("unit", e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Monthly Rent ($)</Label>
                                            <Input 
                                                type="number"
                                                placeholder="0.00" 
                                                className="bg-slate-50 border-slate-200"
                                                value={formData.rentAmount}
                                                onChange={(e) => handleChange("rentAmount", parseFloat(e.target.value) || 0)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Lease Start</Label>
                                            <Input 
                                                type="date"
                                                className="bg-slate-50 border-slate-200"
                                                value={formData.leaseStart}
                                                onChange={(e) => handleChange("leaseStart", e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Lease End</Label>
                                            <Input 
                                                type="date"
                                                className="bg-slate-50 border-slate-200"
                                                value={formData.leaseEnd}
                                                onChange={(e) => handleChange("leaseEnd", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}

                                {currentStep === 3 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2 space-y-2">
                                            <Label>Emergency Contact Name</Label>
                                            <Input 
                                                placeholder="Full Name" 
                                                className="bg-slate-50 border-slate-200"
                                                value={formData.emergencyName}
                                                onChange={(e) => handleChange("emergencyName", e.target.value)}
                                            />
                                        </div>

                                        <div className="md:col-span-2 space-y-2">
                                            <Label>Emergency Contact Phone</Label>
                                            <Input 
                                                placeholder="+1 ..." 
                                                className="bg-slate-50 border-slate-200"
                                                value={formData.emergencyPhone}
                                                onChange={(e) => handleChange("emergencyPhone", e.target.value)}
                                            />
                                        </div>

                                        <div className="md:col-span-2 space-y-2">
                                            <Label>Additional Notes</Label>
                                            <Textarea 
                                                placeholder="Any special requirements..." 
                                                className="bg-slate-50 border-slate-200 min-h-[100px]"
                                                value={formData.notes}
                                                onChange={(e) => handleChange("notes", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Bottom Navigation */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-50 flex items-center justify-center gap-6 z-20">
                     <Button 
                        type="button" 
                        variant="outline"
                        size="icon"
                        onClick={currentStep === 1 ? () => setOpen(false) : handleBack}
                        className="h-12 w-12 rounded-full border-slate-200 text-slate-500 hover:text-[#DDA04E] hover:border-[#DDA04E] hover:bg-white transition-all shadow-sm"
                    >
                        {currentStep === 1 ? <ArrowLeft className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                    </Button>

                    <Button 
                        type="button" 
                        onClick={currentStep === totalSteps ? handleSubmit : handleNext}
                        className="h-12 px-10 rounded-full bg-[#DDA04E] hover:bg-[#c48b3d] text-white shadow-lg shadow-[#DDA04E]/30 text-lg font-medium min-w-[160px]"
                        disabled={isLoading}
                    >
                        {isLoading ? "Submitting..." : (currentStep === totalSteps ? "Submit" : "Next")}
                    </Button>

                    <Button 
                        type="button" 
                        variant="outline"
                        size="icon"
                        onClick={handleNext}
                        disabled={currentStep === totalSteps}
                        className={`h-12 w-12 rounded-full border-slate-200 text-slate-500 hover:text-[#DDA04E] hover:border-[#DDA04E] hover:bg-white transition-all shadow-sm ${currentStep === totalSteps ? 'opacity-0 pointer-events-none' : ''}`}
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
                
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
