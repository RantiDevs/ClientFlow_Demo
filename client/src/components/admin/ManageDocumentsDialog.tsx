import { useState, useRef } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { FileText, Upload, X, CheckCircle2, Loader2, Trash2, Download } from "lucide-react";
import { toast } from "sonner";
import { Label } from "../ui/label";

interface ManageDocumentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investor: any;
}

export function ManageDocumentsDialog({ open, onOpenChange, investor }: ManageDocumentsDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock initial documents
  const [documents, setDocuments] = useState([
    { id: 1, name: "Investment Agreement.pdf", size: "2.4 MB", date: "Jan 12, 2024" },
    { id: 2, name: "KYC Documents.zip", size: "4.1 MB", date: "Jan 10, 2024" },
    { id: 3, name: "Q1 2024 Performance Report.pdf", size: "1.2 MB", date: "Apr 05, 2024" },
  ]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }));
      setDocuments(prev => [...newFiles, ...prev]);
      toast.success(`${newFiles.length} document(s) added to list`);
      
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveDocument = (id: number) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Documents updated successfully", {
        description: `Synced documents for ${investor.name}`
      });
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update documents");
    } finally {
      setIsLoading(false);
    }
  };

  if (!investor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:w-full sm:max-w-[500px] p-0 overflow-hidden bg-white rounded-2xl">
        <DialogHeader className="p-4 sm:p-6 pb-2">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#DDA04E]" />
            Manage Documents
          </DialogTitle>
          <DialogDescription>
            Add or remove legal documents for <strong>{investor.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 sm:p-6 pt-2 space-y-6">
          {/* Upload Area */}
          <div 
            className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-[#DDA04E]/50 hover:bg-slate-50 transition-all cursor-pointer relative"
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              multiple 
              className="hidden" 
              onChange={handleFileSelect}
            />
            <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-2">
              <Upload className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-slate-900">Click to upload files</p>
            <p className="text-xs text-slate-500 mt-1">PDF, DOCX, ZIP up to 50MB</p>
          </div>

          {/* Documents List */}
          <div className="space-y-2">
            <Label className="text-xs uppercase text-slate-500 font-bold">Current Documents ({documents.length})</Label>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2 pr-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 group">
                    <div className="flex items-center gap-3 overflow-hidden flex-1">
                      <div className="h-8 w-8 bg-white rounded border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 truncate">{doc.name}</p>
                        <p className="text-xs text-slate-500">{doc.date} • {doc.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity pl-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 shrink-0">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 shrink-0"
                        onClick={() => handleRemoveDocument(doc.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {documents.length === 0 && (
                   <p className="text-center text-slate-400 py-4 text-sm italic">No documents uploaded yet.</p>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100">
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
