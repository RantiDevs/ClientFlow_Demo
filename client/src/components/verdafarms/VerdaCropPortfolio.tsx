import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Sprout,
  Clock,
  TrendingUp,
  ShieldCheck,
  MapPin,
  Calendar,
  ChevronRight,
  ArrowUpRight,
  Leaf,
  CheckCircle2,
} from "lucide-react";
import { CROP_PORTFOLIO, FARM_PLOTS, CropStatus } from "../../lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const STATUS_CONFIG: Record<string, { color: string; bg: string; dot: string }> = {
  Preparing: { color: "text-slate-600", bg: "bg-slate-100", dot: "bg-slate-400" },
  Planted: { color: "text-blue-600", bg: "bg-blue-50", dot: "bg-blue-500" },
  Growing: { color: "text-green-600", bg: "bg-green-50", dot: "bg-green-500" },
  Harvesting: { color: "text-[#DDA04E]", bg: "bg-[#DDA04E]/10", dot: "bg-[#DDA04E]" },
  Sold: { color: "text-emerald-700", bg: "bg-emerald-50", dot: "bg-emerald-600" },
};

const PROGRESS_MAP: Record<CropStatus, number> = {
  Preparing: 10,
  Planted: 30,
  Growing: 55,
  Harvesting: 85,
  Sold: 100,
};

export function VerdaCropPortfolio() {
  const [activeTab, setActiveTab] = useState<"portfolio" | "myplots">("portfolio");
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Crop Portfolio</h2>
          <p className="text-slate-500 text-sm">
            Explore available crops or view your active farm plots
          </p>
        </div>
        <div className="flex bg-slate-100 rounded-2xl p-1">
          <button
            onClick={() => setActiveTab("portfolio")}
            className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all ${
              activeTab === "portfolio"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Crop Catalog
          </button>
          <button
            onClick={() => setActiveTab("myplots")}
            className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all ${
              activeTab === "myplots"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            My Plots
          </button>
        </div>
      </div>

      {activeTab === "portfolio" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CROP_PORTFOLIO.map((crop) => (
            <div
              key={crop.id}
              className={`bg-white rounded-[28px] border overflow-hidden transition-all cursor-pointer group hover:shadow-xl ${
                selectedCrop === crop.id
                  ? "border-green-500 shadow-lg shadow-green-500/10"
                  : "border-slate-100 hover:border-slate-200"
              }`}
              onClick={() => setSelectedCrop(crop.id === selectedCrop ? null : crop.id)}
            >
              <div className="h-48 relative overflow-hidden">
                <ImageWithFallback
                  src={crop.image}
                  alt={crop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-5">
                  <h3 className="text-xl font-bold text-white">{crop.name}</h3>
                </div>
                {selectedCrop === crop.id && (
                  <div className="absolute top-3 right-3 h-8 w-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <p className="text-sm text-slate-500">{crop.description}</p>

                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-slate-50 rounded-xl">
                    <Clock className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                    <p className="text-xs text-slate-400">Cycle</p>
                    <p className="text-xs font-bold text-slate-900">{crop.cycleDuration}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-xl">
                    <TrendingUp className="h-4 w-4 text-green-600 mx-auto mb-1" />
                    <p className="text-xs text-green-600/70">ROI</p>
                    <p className="text-xs font-bold text-green-700">{crop.avgRoi}</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-xl">
                    <ShieldCheck className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                    <p className="text-xs text-slate-400">Risk</p>
                    <p className="text-xs font-bold text-slate-900">{crop.riskLevel}</p>
                  </div>
                </div>

                <Button
                  className={`w-full h-11 rounded-xl font-bold ${
                    selectedCrop === crop.id
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  {selectedCrop === crop.id ? "Selected" : "Select Crop"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "myplots" && (
        <div className="space-y-6">
          {FARM_PLOTS.map((plot) => {
            const statusCfg = STATUS_CONFIG[plot.status];
            const progress = PROGRESS_MAP[plot.status];
            return (
              <div
                key={plot.id}
                className="bg-white rounded-[28px] border border-slate-100 p-6 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Plot Image */}
                  <div className="w-full md:w-48 h-36 rounded-2xl overflow-hidden shrink-0">
                    <ImageWithFallback
                      src={plot.image}
                      alt={plot.plotName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Plot Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{plot.plotName}</h3>
                        <div className="flex items-center text-sm text-slate-400 mt-1">
                          <Sprout className="h-3.5 w-3.5 mr-1.5" />
                          {plot.crop} &middot; {plot.sizeSqm.toLocaleString()} sqm
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusCfg.bg} ${statusCfg.color}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${statusCfg.dot}`}></span>
                        {plot.status}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-[#DDA04E] rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="bg-slate-50 rounded-xl p-3">
                        <p className="text-slate-400 mb-1">Planted</p>
                        <p className="text-slate-900 font-bold">
                          {new Date(plot.plantingDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3">
                        <p className="text-slate-400 mb-1">Harvest</p>
                        <p className="text-slate-900 font-bold">
                          {new Date(plot.expectedHarvestDate).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-3">
                        <p className="text-green-600/70 mb-1">ROI</p>
                        <p className="text-green-700 font-bold">{plot.roiProjection}%</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3">
                        <p className="text-slate-400 mb-1">Manager</p>
                        <div className="flex items-center gap-1.5">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={plot.farmManagerAvatar} />
                            <AvatarFallback className="text-[8px]">{plot.farmManager[0]}</AvatarFallback>
                          </Avatar>
                          <p className="text-slate-900 font-bold truncate">{plot.farmManager.split(" ")[0]}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
