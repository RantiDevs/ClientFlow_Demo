import { useState } from "react";
import { Button } from "../ui/button";
import {
  FileText,
  Upload,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  File,
  FileCheck,
  FilePlus,
} from "lucide-react";
import { FARM_DOCUMENTS } from "../../lib/data";
import { toast } from "sonner";

export function VerdaDocuments() {
  const [activeFilter, setActiveFilter] = useState<"all" | "upload" | "download">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocs = FARM_DOCUMENTS.filter((doc) => {
    const matchesFilter = activeFilter === "all" || doc.type === activeFilter;
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const uploadDocs = FARM_DOCUMENTS.filter((d) => d.type === "upload");
  const downloadDocs = FARM_DOCUMENTS.filter((d) => d.type === "download");

  const handleUpload = () => {
    toast.success("Document uploaded successfully!");
  };

  const handleDownload = (name: string) => {
    toast.success(`Downloading ${name}...`);
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "Signed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-[#DDA04E]" />;
      case "Available":
        return <Download className="h-4 w-4 text-blue-500" />;
      default:
        return <File className="h-4 w-4 text-slate-400" />;
    }
  };

  const statusStyle = (status: string) => {
    switch (status) {
      case "Signed":
        return "text-green-600 bg-green-50";
      case "Pending":
        return "text-[#DDA04E] bg-[#DDA04E]/10";
      case "Available":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-slate-500 bg-slate-50";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Documents</h2>
          <p className="text-slate-500 text-sm">
            Upload your documents and download farm agreements and reports
          </p>
        </div>
        <Button
          className="h-11 px-6 rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200"
          onClick={handleUpload}
        >
          <Upload className="h-4 w-4 mr-2" /> Upload Document
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center">
              <FileText className="h-5 w-5 text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Total Documents</p>
              <p className="text-xl font-bold text-slate-900">{FARM_DOCUMENTS.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 bg-green-50 rounded-xl flex items-center justify-center">
              <FileCheck className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Available Downloads</p>
              <p className="text-xl font-bold text-slate-900">{downloadDocs.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 bg-[#DDA04E]/10 rounded-xl flex items-center justify-center">
              <FilePlus className="h-5 w-5 text-[#DDA04E]" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Pending Uploads</p>
              <p className="text-xl font-bold text-slate-900">
                {uploadDocs.filter((d) => d.status === "Pending").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex bg-slate-100 rounded-2xl p-1">
            {(["all", "download", "upload"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-2 text-sm font-bold rounded-xl transition-all capitalize ${
                  activeFilter === tab
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab === "all" ? "All" : tab === "download" ? "Downloads" : "Uploads"}
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#DDA04E]/30"
            />
          </div>
        </div>

        {/* Document List */}
        <div className="space-y-2">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-wrap items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors group gap-3"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                    doc.type === "upload" ? "bg-[#DDA04E]/10" : "bg-green-50"
                  }`}
                >
                  {doc.type === "upload" ? (
                    <Upload className="h-4 w-4 text-[#DDA04E]" />
                  ) : (
                    <Download className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-sm truncate">{doc.name}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span>{doc.category}</span>
                    {doc.size !== "—" && (
                      <>
                        <span>&middot;</span>
                        <span>{doc.size}</span>
                      </>
                    )}
                    {doc.date !== "—" && (
                      <>
                        <span>&middot;</span>
                        <span>{doc.date}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusStyle(doc.status)}`}
                >
                  {statusIcon(doc.status)}
                  {doc.status}
                </span>
                {doc.type === "download" && doc.status === "Available" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    onClick={() => handleDownload(doc.name)}
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Download
                  </Button>
                )}
                {doc.type === "upload" && doc.status === "Pending" && (
                  <Button
                    size="sm"
                    className="rounded-xl bg-[#DDA04E] hover:bg-[#c48b3d] text-slate-900 font-bold"
                    onClick={handleUpload}
                  >
                    <Upload className="h-3.5 w-3.5 mr-1.5" />
                    Upload
                  </Button>
                )}
              </div>
            </div>
          ))}

          {filteredDocs.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <FileText className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="font-bold">No documents found</p>
              <p className="text-sm">Try adjusting your filter or search query</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
