import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";
import { Building2, Search, CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { PROJECTS } from "../../lib/data";

interface AssignPropertiesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investor: any;
}

export function AssignPropertiesDialog({ open, onOpenChange, investor }: AssignPropertiesDialogProps) {
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize selected properties when investor changes or dialog opens
  useEffect(() => {
    if (investor && open) {
      // Mock logic: randomly select some properties or use a stored field if we had one
      // For now, let's just select the first 'n' properties based on investor.propertiesCount
      const count = investor.propertiesCount || 0;
      setSelectedProperties(PROJECTS.slice(0, count).map(p => p.id));
    }
  }, [investor, open]);

  const handlePropertyToggle = (id: string) => {
    setSelectedProperties(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Properties assigned successfully", {
        description: `Updated portfolio for ${investor.name}`
      });
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update properties");
    } finally {
      setIsLoading(false);
    }
  };

  if (!investor) return null;

  const filteredProjects = PROJECTS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white rounded-2xl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#DDA04E]" />
            Assign Properties
          </DialogTitle>
          <DialogDescription>
            Manage properties for <strong>{investor.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search properties..." 
              className="pl-10 border-slate-200 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="h-[300px] px-6">
          <div className="space-y-3 py-2">
            {filteredProjects.map((project) => (
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
                {selectedProperties.includes(project.id) && (
                   <span className="text-xs font-semibold text-[#DDA04E] bg-[#DDA04E]/10 px-2 py-1 rounded-full">
                     Assigned
                   </span>
                )}
              </div>
            ))}
            {filteredProjects.length === 0 && (
              <p className="text-center text-slate-500 py-8 text-sm">No properties found matching "{searchTerm}"</p>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-slate-200">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="bg-[#DDA04E] hover:bg-[#c48b3d] text-white"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
