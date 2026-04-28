import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";
import { Plus, Upload, X, FileText, CheckCircle2, Loader2, Building2 } from "lucide-react";
import { toast } from "sonner";
import { PROJECTS } from "../../lib/data";

export function AddInvestorDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Details, 2: Properties, 3: Documents
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Active"
  });

  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handlePropertyToggle = (id: string) => {
    setSelectedProperties(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} document(s) added`);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      toast.error("Please fill in the required fields");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Investor portal created for ${formData.name}`, {
        description: `Login credentials sent to ${formData.email}`
      });
      
      setOpen(false);
      // Reset form
      setFormData({ name: "", email: "", phone: "", status: "Active" });
      setSelectedProperties([]);
      setUploadedFiles([]);
      setStep(1);
    } catch (error) {
      toast.error("Failed to create investor profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#DDA04E] hover:bg-[#c48b3d] text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Investor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white rounded-2xl">
        <div className="bg-slate-900 p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-[#DDA04E] rounded-full blur-2xl opacity-20"></div>
            <DialogHeader className="relative z-10">
            <DialogTitle className="text-xl font-bold">Setup Investor Portal</DialogTitle>
            <DialogDescription className="text-slate-400">
                Create a new investor account, assign properties, and upload legal documents.
            </DialogDescription>
            </DialogHeader>
        </div>

        <div className="p-6">
            {/* Steps Indicator */}
            <div className="flex items-center justify-between mb-8 px-2">
                {[
                    { s: 1, label: "Details" }, 
                    { s: 2, label: "Properties" }, 
                    { s: 3, label: "Documents" }
                ].map((item) => (
                    <div key={item.s} className="flex flex-col items-center relative z-10 group cursor-pointer" onClick={() => setStep(item.s)}>
                        <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                            ${step >= item.s ? 'bg-[#DDA04E] text-white shadow-lg shadow-[#DDA04E]/20' : 'bg-slate-100 text-slate-400'}
                        `}>
                            {step > item.s ? <CheckCircle2 className="h-5 w-5" /> : item.s}
                        </div>
                        <span className={`text-xs mt-2 font-medium ${step >= item.s ? 'text-slate-900' : 'text-slate-400'}`}>
                            {item.label}
                        </span>
                    </div>
                ))}
                {/* Progress Bar Background */}
                <div className="absolute top-[100px] left-0 w-full h-[1px] bg-slate-100 -z-0 hidden sm:block"></div> 
            </div>

            <div className="min-h-[300px]">
                {step === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                                <Input id="name" placeholder="e.g. Robert Fox" value={formData.name} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2 col-span-2 sm:col-span-1">
                                <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                                <Input id="email" type="email" placeholder="robert@example.com" value={formData.email} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2 col-span-2 sm:col-span-1">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-700">
                            <p className="font-semibold mb-1">Note:</p>
                            Login credentials will be automatically generated and sent to the provided email address.
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex justify-between items-center mb-2">
                            <Label>Assign Properties</Label>
                            <span className="text-xs text-slate-500">{selectedProperties.length} selected</span>
                        </div>
                        <ScrollArea className="h-[250px] pr-4">
                            <div className="space-y-3">
                                {PROJECTS.map((project) => (
                                    <div 
                                        key={project.id} 
                                        className={`
                                            flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all
                                            ${selectedProperties.includes(project.id) 
                                                ? 'border-[#DDA04E] bg-[#DDA04E]/5' 
                                                : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}
                                        `}
                                        onClick={() => handlePropertyToggle(project.id)}
                                    >
                                        <Checkbox 
                                            checked={selectedProperties.includes(project.id)}
                                            onCheckedChange={() => handlePropertyToggle(project.id)}
                                            className="data-[state=checked]:bg-[#DDA04E] data-[state=checked]:border-[#DDA04E]"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-900 text-sm">{project.name}</p>
                                            <p className="text-xs text-slate-500">{project.location}</p>
                                        </div>
                                        <Building2 className={`h-4 w-4 ${selectedProperties.includes(project.id) ? 'text-[#DDA04E]' : 'text-slate-300'}`} />
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                         <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-[#DDA04E]/50 hover:bg-slate-50 transition-all cursor-pointer relative">
                            <input 
                                type="file" 
                                multiple 
                                className="absolute inset-0 opacity-0 cursor-pointer" 
                                onChange={handleFileUpload}
                            />
                            <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-3">
                                <Upload className="h-6 w-6" />
                            </div>
                            <p className="text-sm font-medium text-slate-900">Click to upload documents</p>
                            <p className="text-xs text-slate-500 mt-1">Legal agreements, deeds, contracts, etc.</p>
                        </div>

                        {uploadedFiles.length > 0 && (
                            <div className="space-y-2">
                                <Label className="text-xs uppercase text-slate-500 font-bold">Uploaded Files</Label>
                                <div className="space-y-2">
                                    {uploadedFiles.map((file, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="h-8 w-8 bg-white rounded border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                                                    <FileText className="h-4 w-4" />
                                                </div>
                                                <div className="truncate">
                                                    <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                                                    <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => removeFile(idx)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>

        <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 flex-row gap-2 justify-between">
            {step > 1 ? (
                 <Button variant="outline" onClick={() => setStep(step - 1)} className="border-slate-200">
                    Back
                 </Button>
            ) : (
                <div /> // Spacer
            )}
            
            {step < 3 ? (
                <Button onClick={() => setStep(step + 1)} className="bg-slate-900 text-white hover:bg-slate-800">
                    Next Step
                </Button>
            ) : (
                <Button 
                    onClick={handleSubmit} 
                    className="bg-[#DDA04E] hover:bg-[#c48b3d] text-white shadow-lg shadow-[#DDA04E]/20"
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                    Create & Send Login
                </Button>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
