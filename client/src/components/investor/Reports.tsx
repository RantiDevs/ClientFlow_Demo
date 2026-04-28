import { useState } from "react";
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  MoreHorizontal, 
  FileSpreadsheet, 
  FileIcon, 
  Calendar,
  Building2,
  ArrowUpRight,
  Eye,
  X,
  Printer,
  Share2,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Grid,
  Info,
  Clock,
  CheckCircle2
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

// Extended Mock Data
const ALL_DOCUMENTS = [
  { id: 1, name: "Q1 2024 Performance Report", type: "PDF", size: "4.2 MB", date: "2024-04-15", category: "Financial", property: "The Pavilion Hostel", status: "Verified" },
  { id: 2, name: "March 2024 P&L Statement", type: "Excel", size: "1.8 MB", date: "2024-04-05", category: "Financial", property: "All Properties", status: "Draft" },
  { id: 3, name: "2023 K-1 Tax Form", type: "PDF", size: "2.1 MB", date: "2024-03-20", category: "Tax", property: "Green Valley Estate", status: "Final" },
  { id: 4, name: "Property Inspection - Pavilion", type: "PDF", size: "12.5 MB", date: "2024-03-10", category: "Property", property: "The Pavilion Hostel", status: "Verified" },
  { id: 5, name: "Lease Agreement - Unit 304", type: "PDF", size: "3.5 MB", date: "2024-02-28", category: "Legal", property: "The Pavilion Hostel", status: "Signed" },
  { id: 6, name: "February 2024 P&L Statement", type: "Excel", size: "1.8 MB", date: "2024-03-05", category: "Financial", property: "All Properties", status: "Verified" },
  { id: 7, name: "Insurance Policy Renewal", type: "PDF", size: "5.6 MB", date: "2024-01-15", category: "Legal", property: "Green Valley Estate", status: "Active" },
  { id: 8, name: "Q4 2023 Performance Report", type: "PDF", size: "4.1 MB", date: "2024-01-15", category: "Financial", property: "The Pavilion Hostel", status: "Verified" },
  { id: 9, name: "Construction Update Photos", type: "ZIP", size: "45 MB", date: "2024-05-20", category: "Property", property: "Sunrise Apartments", status: "Uploaded" },
  { id: 10, name: "Operating Agreement", type: "PDF", size: "8.2 MB", date: "2023-11-01", category: "Legal", property: "Sunrise Apartments", status: "Final" },
];

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  date: string;
  category: string;
  property: string;
  status: string;
}

export function Reports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filteredDocs = ALL_DOCUMENTS.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.property.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case "PDF": return <FileText className="h-5 w-5 text-red-500" />;
      case "Excel": return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
      case "ZIP": return <FileIcon className="h-5 w-5 text-amber-500" />;
      default: return <FileText className="h-5 w-5 text-slate-400" />;
    }
  };

  const handlePreview = (doc: Document) => {
    setPreviewDoc(doc);
    setZoomLevel(100);
  };

  const renderDocumentContent = (doc: Document) => {
    if (doc.type === "Excel") {
      return (
        <div 
          className="bg-white shadow-xl w-full max-w-4xl min-h-[800px] overflow-hidden rounded-sm border border-slate-200"
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center', transition: 'transform 0.2s ease-out' }}
        >
          {/* Excel Header */}
          <div className="bg-[#107c41] text-white px-4 py-2 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              <span className="font-medium">Spreadsheet View</span>
            </div>
            <div className="opacity-80 text-xs">Read Only</div>
          </div>
          {/* Formula Bar */}
          <div className="bg-slate-50 border-b border-slate-200 px-2 py-1 flex items-center gap-2 text-sm text-slate-600">
            <div className="font-mono bg-white border border-slate-200 px-2 rounded w-16 text-center">A1</div>
            <div className="flex-1 bg-white border border-slate-200 px-2 rounded font-mono h-6 flex items-center">
              Property Name
            </div>
          </div>
          {/* Grid */}
          <div className="overflow-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500">
                  <th className="border border-slate-200 w-10 text-center bg-slate-100"></th>
                  <th className="border border-slate-200 px-4 py-1 font-normal">A</th>
                  <th className="border border-slate-200 px-4 py-1 font-normal">B</th>
                  <th className="border border-slate-200 px-4 py-1 font-normal">C</th>
                  <th className="border border-slate-200 px-4 py-1 font-normal">D</th>
                  <th className="border border-slate-200 px-4 py-1 font-normal">E</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(20)].map((_, r) => (
                  <tr key={r} className="hover:bg-slate-50">
                    <td className="border border-slate-200 text-center bg-slate-50 text-slate-400 text-xs">{r + 1}</td>
                    {[...Array(5)].map((_, c) => (
                      <td key={c} className="border border-slate-200 px-4 py-1 text-slate-700">
                        {r === 0 ? ["Property", "Unit", "Tenant", "Rent", "Status"][c] : 
                         r === 1 ? ["The Pavilion", "101", "John Doe", "₦1,200,000", "Paid"][c] :
                         r === 2 ? ["The Pavilion", "102", "Jane Smith", "₦1,450,000", "Paid"][c] :
                         ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Default PDF / Doc View
    return (
      <div 
        className="bg-white shadow-xl w-full max-w-[800px] min-h-[800px] md:min-h-[1100px] p-6 md:p-16 relative transition-transform duration-200 ease-out origin-top"
        style={{ transform: `scale(${zoomLevel / 100})` }}
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 md:mb-12 border-b-2 border-slate-900 pb-8">
          <div className="mb-6 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 font-serif">{doc.name}</h1>
            <p className="text-slate-500 font-medium text-sm md:text-base">Prepared for: {doc.property}</p>
          </div>
          <div className="text-left md:text-right w-full md:w-auto flex md:block items-center justify-between">
            <div className="h-10 w-10 md:h-12 md:w-12 bg-slate-900 rounded-lg flex items-center justify-center text-[#DDA04E] mb-2 md:ml-auto">
              <Building2 className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div className="md:block text-right">
              <p className="text-sm font-bold text-slate-900">CLIENTFLOW REAL ESTATE</p>
              <p className="text-xs text-slate-500">{doc.date}</p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-8 font-serif text-slate-800 leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-3 border-b border-slate-200 pb-1">1. Executive Summary</h2>
            <p className="text-justify text-sm">
              This document serves as a comprehensive overview of the property performance and related financial activities for the period ending {doc.date}. 
              The property has shown consistent growth with occupancy rates maintaining a strong 98% average. 
              Maintenance costs have been kept within the projected budget, and capital improvements are proceeding as scheduled.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-3 border-b border-slate-200 pb-1">2. Financial Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 my-6">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wide">Gross Revenue</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">₦142,500,000</p>
                <p className="text-xs text-green-600 mt-1 flex items-center"><ArrowUpRight className="h-3 w-3 mr-1" /> +12% vs last period</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wide">Net Operating Income</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">₦89,200,000</p>
                <p className="text-xs text-green-600 mt-1 flex items-center"><ArrowUpRight className="h-3 w-3 mr-1" /> +8% vs last period</p>
              </div>
            </div>
            <p className="text-justify text-sm">
              Revenue collection remains robust with minimal delinquency. The slight increase in operational expenses is attributed to seasonal utility adjustments and scheduled preventative maintenance for the HVAC systems.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-3 border-b border-slate-200 pb-1">3. Property Status</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li><strong>Occupancy:</strong> Currently at 98% (49/50 units leased).</li>
              <li><strong>Maintenance:</strong> 3 active work orders, all non-critical.</li>
              <li><strong>Inspections:</strong> Annual fire safety inspection passed with no violations.</li>
            </ul>
          </div>
          
          <div className="mt-8 md:mt-12 p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300">
             <div className="flex items-center justify-center h-32 md:h-40">
                <div className="text-center">
                   <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FileText className="h-5 w-5 text-slate-400" />
                   </div>
                   <p className="text-sm font-medium text-slate-500">Charts and Detailed Figures</p>
                   <p className="text-xs text-slate-400">Refer to Appendix A for full breakdown</p>
                </div>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 md:bottom-16 left-8 md:left-16 right-8 md:right-16 border-t border-slate-200 pt-4 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 gap-2 md:gap-0">
          <span>Confidential - For Investor Use Only</span>
          <span>Page 1 of 4</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reports & Documents</h1>
          <p className="text-slate-500 mt-1">Access detailed financial statements and property reports.</p>
        </div>
        <Button className="bg-slate-900 text-white rounded-full hover:bg-slate-800 shadow-xl shadow-slate-200">
          <Download className="mr-2 h-4 w-4" /> Download All New
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 rounded-[28px] p-6 text-white relative overflow-hidden shadow-xl shadow-slate-200">
           <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-[#DDA04E] rounded-full blur-3xl opacity-20"></div>
           <div className="relative z-10">
             <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center mb-4 text-[#DDA04E]">
               <FileText className="h-5 w-5" />
             </div>
             <p className="text-slate-400 text-sm font-medium">Total Documents</p>
             <h3 className="text-3xl font-bold mt-1">{ALL_DOCUMENTS.length}</h3>
             <p className="text-xs text-slate-400 mt-2">Across 3 properties</p>
           </div>
        </div>

        <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
           <div className="h-10 w-10 bg-green-50 rounded-xl flex items-center justify-center mb-4 text-green-600">
             <ArrowUpRight className="h-5 w-5" />
           </div>
           <p className="text-slate-500 text-sm font-medium">New This Month</p>
           <h3 className="text-3xl font-bold text-slate-900 mt-1">3</h3>
           <p className="text-xs text-green-600 font-bold bg-green-50 w-fit px-2 py-1 rounded-lg mt-2">
             All downloaded
           </p>
        </div>

        <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
           <div className="h-10 w-10 bg-[#DDA04E]/10 rounded-xl flex items-center justify-center mb-4 text-[#DDA04E]">
             <Eye className="h-5 w-5" />
           </div>
           <p className="text-slate-500 text-sm font-medium">Recently Viewed</p>
           <h3 className="text-lg font-bold text-slate-900 mt-1 truncate">Q1 2024 Performance...</h3>
           <p className="text-xs text-slate-400 mt-2">Just now</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 min-h-[500px]">
        
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <Tabs defaultValue="All" className="w-full md:w-auto" onValueChange={setSelectedCategory}>
            <TabsList className="bg-slate-50 p-1 rounded-full border border-slate-100">
              {["All", "Financial", "Legal", "Tax", "Property"].map((tab) => (
                <TabsTrigger 
                  key={tab} 
                  value={tab}
                  className="rounded-full px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-500 hover:text-slate-700"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="flex gap-2 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                   placeholder="Search documents..." 
                   className="pl-10 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-all focus:border-[#DDA04E]"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <Button variant="outline" className="rounded-xl px-3 border-slate-200 hover:bg-slate-50">
                <Filter className="h-4 w-4 text-slate-500" />
             </Button>
          </div>
        </div>

        {/* Documents Grid/List */}
        <div className="space-y-4">
          {filteredDocs.length > 0 ? (
            filteredDocs.map((doc) => (
              <div 
                key={doc.id} 
                className="group relative flex flex-row items-start p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer"
                onClick={() => handlePreview(doc)}
              >
                {/* Icon Box */}
                <div className="flex-shrink-0 h-10 w-10 md:h-12 md:w-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  {getFileIcon(doc.type)}
                </div>

                {/* Info */}
                <div className="ml-3 md:ml-6 flex-1 min-w-0 flex flex-col justify-center min-h-[40px] md:min-h-[48px]">
                  <div className="flex items-center gap-2 mb-1 pr-8 md:pr-0">
                    <h4 className="text-sm md:text-base font-bold text-slate-900 truncate">{doc.name}</h4>
                    {doc.id <= 2 && (
                      <Badge className="bg-[#DDA04E] text-white hover:bg-[#DDA04E] text-[10px] h-5">New</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center text-xs text-slate-500 gap-x-3 gap-y-1">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" /> {doc.date}
                    </span>
                    <span className="hidden md:inline w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="flex items-center">
                      <Building2 className="h-3 w-3 mr-1" /> {doc.property}
                    </span>
                    <span className="hidden md:inline w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>{doc.size}</span>
                  </div>
                </div>

                {/* Mobile Menu (Absolute) */}
                <div className="md:hidden absolute top-3 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handlePreview(doc); }}>
                        <Eye className="mr-2 h-4 w-4" /> Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <Download className="mr-2 h-4 w-4" /> Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <Share2 className="mr-2 h-4 w-4" /> Share
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-slate-500 hover:text-[#DDA04E] hover:bg-slate-100 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreview(doc);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" /> Preview
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-slate-900 text-white hover:bg-slate-800 rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download className="h-4 w-4 mr-2" /> Download
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Share</DropdownMenuItem>
                      <DropdownMenuItem>Print</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Archive</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
               <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-10 w-10 text-slate-300" />
               </div>
               <h3 className="text-lg font-bold text-slate-900">No documents found</h3>
               <p className="text-slate-500 max-w-xs mx-auto mt-1">
                 We couldn't find any documents matching your search or filter.
               </p>
               <Button 
                 variant="link" 
                 className="text-[#DDA04E] mt-2"
                 onClick={() => {
                   setSearchTerm("");
                   setSelectedCategory("All");
                 }}
               >
                 Clear all filters
               </Button>
            </div>
          )}
        </div>
      </div>

      {/* High-Fidelity Preview Dialog */}
      <Dialog open={!!previewDoc} onOpenChange={(open) => !open && setPreviewDoc(null)}>
        <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0 gap-0 overflow-hidden flex flex-col rounded-[24px] bg-[#f8fafc]">
          <DialogTitle className="sr-only">Document Preview</DialogTitle>
          <DialogDescription className="sr-only">
             Preview of document {previewDoc?.name}
          </DialogDescription>
          {previewDoc && (
            <div className="flex h-full">
              {/* Left Sidebar (Info) */}
              {sidebarOpen && (
                <div className="w-80 bg-white border-r border-slate-200 flex flex-col h-full shrink-0 animate-in slide-in-from-left duration-300">
                  <div className="p-6 border-b border-slate-100">
                     <div className="flex items-start gap-4 mb-4">
                       <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                         {getFileIcon(previewDoc.type)}
                       </div>
                       <div>
                         <h3 className="font-bold text-slate-900 leading-tight">{previewDoc.name}</h3>
                         <Badge variant="outline" className="mt-2 bg-slate-50 text-slate-500 border-slate-200">
                           {previewDoc.type}
                         </Badge>
                       </div>
                     </div>
                  </div>
                  
                  <ScrollArea className="flex-1">
                    <div className="p-6 space-y-6">
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Details</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500 flex items-center gap-2"><Calendar className="h-3 w-3" /> Date</span>
                            <span className="font-medium text-slate-900">{previewDoc.date}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500 flex items-center gap-2"><FileIcon className="h-3 w-3" /> Size</span>
                            <span className="font-medium text-slate-900">{previewDoc.size}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500 flex items-center gap-2"><CheckCircle2 className="h-3 w-3" /> Status</span>
                            <span className="font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs">{previewDoc.status}</span>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Property</h4>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                           <div className="flex items-center gap-3 mb-2">
                             <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-slate-700">
                               <Building2 className="h-4 w-4" />
                             </div>
                             <span className="font-bold text-slate-900 text-sm">{previewDoc.property}</span>
                           </div>
                           <p className="text-xs text-slate-500 pl-11">
                             123 Investment Blvd, Suite 100<br/>
                             New York, NY 10001
                           </p>
                        </div>
                      </div>

                      <Separator />
                      
                      <div>
                         <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">History</h4>
                         <div className="space-y-4">
                            <div className="flex gap-3 relative pb-4">
                               <div className="absolute top-2 left-[5px] bottom-0 w-0.5 bg-slate-100"></div>
                               <div className="h-2.5 w-2.5 rounded-full bg-[#DDA04E] mt-1.5 relative z-10 ring-4 ring-white"></div>
                               <div>
                                  <p className="text-xs font-bold text-slate-900">Document Viewed</p>
                                  <p className="text-[10px] text-slate-400">Just now • You</p>
                               </div>
                            </div>
                            <div className="flex gap-3 relative pb-4">
                               <div className="absolute top-2 left-[5px] bottom-0 w-0.5 bg-slate-100"></div>
                               <div className="h-2.5 w-2.5 rounded-full bg-slate-300 mt-1.5 relative z-10 ring-4 ring-white"></div>
                               <div>
                                  <p className="text-xs font-bold text-slate-900">Status Updated</p>
                                  <p className="text-[10px] text-slate-400">2 days ago • System</p>
                               </div>
                            </div>
                            <div className="flex gap-3">
                               <div className="h-2.5 w-2.5 rounded-full bg-slate-300 mt-1.5 relative z-10 ring-4 ring-white"></div>
                               <div>
                                  <p className="text-xs font-bold text-slate-900">Uploaded</p>
                                  <p className="text-[10px] text-slate-400">{previewDoc.date} • Admin</p>
                               </div>
                            </div>
                         </div>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              )}

              {/* Main Preview Area */}
              <div className="flex-1 flex flex-col min-w-0 bg-[#334155]">
                {/* Toolbar */}
                <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-20">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className={sidebarOpen ? "bg-slate-100" : ""}>
                       <Info className="h-5 w-5 text-slate-600" />
                    </Button>
                    <Separator orientation="vertical" className="h-6 mx-2" />
                    <Button variant="ghost" size="icon" disabled>
                      <ChevronLeft className="h-5 w-5 text-slate-400" />
                    </Button>
                    <div className="bg-slate-100 px-3 py-1 rounded-md text-sm font-medium text-slate-600">
                      1 / 4
                    </div>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-5 w-5 text-slate-600" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}>
                      <ZoomOut className="h-5 w-5 text-slate-600" />
                    </Button>
                    <span className="text-sm font-medium text-slate-600 w-12 text-center">{zoomLevel}%</span>
                    <Button variant="ghost" size="icon" onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}>
                      <ZoomIn className="h-5 w-5 text-slate-600" />
                    </Button>
                    <Separator orientation="vertical" className="h-6 mx-2" />
                    <Button className="bg-[#DDA04E] hover:bg-[#c48b3d] text-white gap-2">
                      <Download className="h-4 w-4" /> Download
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setPreviewDoc(null)}>
                      <X className="h-6 w-6 text-slate-400 hover:text-red-500" />
                    </Button>
                  </div>
                </div>

                {/* Canvas */}
                <DialogDescription className="sr-only">
                  Preview of {previewDoc.name}
                </DialogDescription>
                
                <DialogTitle className="sr-only">{previewDoc.name} Preview</DialogTitle>

                <div className="flex-1 overflow-auto flex items-start justify-center p-8 bg-slate-100/50 relative">
                  {/* Dotted Pattern Background */}
                  <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                  
                  {renderDocumentContent(previewDoc)}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
