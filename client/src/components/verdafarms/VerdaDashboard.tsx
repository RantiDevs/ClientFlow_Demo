import { useState } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Sprout,
  TrendingUp,
  MapPin,
  Calendar,
  ArrowUpRight,
  Leaf,
  MoreHorizontal,
  ChevronRight,
  Sun,
  Droplets,
  Clock,
} from "lucide-react";
import { FARM_PLOTS, FARM_YIELD_DATA } from "../../lib/data";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface VerdaDashboardProps {
  onNavigate: (page: string) => void;
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; dot: string }> = {
  Preparing: { color: "text-slate-600", bg: "bg-slate-100", dot: "bg-slate-400" },
  Planted: { color: "text-blue-600", bg: "bg-blue-50", dot: "bg-blue-500" },
  Growing: { color: "text-green-600", bg: "bg-green-50", dot: "bg-green-500" },
  Harvesting: { color: "text-[#DDA04E]", bg: "bg-[#DDA04E]/10", dot: "bg-[#DDA04E]" },
  Sold: { color: "text-emerald-700", bg: "bg-emerald-50", dot: "bg-emerald-600" },
};

export function VerdaDashboard({ onNavigate }: VerdaDashboardProps) {
  const totalSqm = FARM_PLOTS.reduce((sum, p) => sum + p.sizeSqm, 0);
  const avgRoi =
    FARM_PLOTS.reduce((sum, p) => sum + p.roiProjection, 0) / FARM_PLOTS.length;
  const activePlots = FARM_PLOTS.filter(
    (p) => p.status !== "Sold" && p.status !== "Preparing"
  ).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Main Column */}
      <div className="lg:col-span-8 space-y-8">
        {/* Hero Card */}
        <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-green-500 rounded-full blur-3xl opacity-[0.07]"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-[#DDA04E] rounded-full blur-3xl opacity-[0.08]"></div>

          <div className="flex flex-wrap justify-between items-end gap-6 relative z-10">
            <div className="min-w-fit">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Leaf className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-bold text-green-600 uppercase tracking-wider">
                  Verda Farms
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                {totalSqm.toLocaleString()} sqm
              </h2>
              <p className="text-slate-500 mt-1">Total farmland under management</p>
              <div className="flex items-center mt-3 bg-green-50 w-fit px-3 py-1 rounded-full text-green-700 font-bold text-sm">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                {avgRoi.toFixed(1)}% avg ROI projection
              </div>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Button
                onClick={() => onNavigate("crops")}
                className="h-12 px-6 sm:px-8 rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200"
              >
                <Sprout className="mr-2 h-4 w-4" /> View Crops
              </Button>
              <Button
                variant="outline"
                onClick={() => onNavigate("farm-reports")}
                className="h-12 px-6 sm:px-8 rounded-full border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <TrendingUp className="mr-2 h-4 w-4" /> Reports
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-green-600 rounded-[28px] p-6 text-white shadow-lg shadow-green-600/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <p className="text-white/80 font-medium text-sm">Total Plots</p>
            <h3 className="text-2xl font-bold mt-1">{FARM_PLOTS.length}</h3>
            <p className="text-xs mt-2 bg-white/20 w-fit px-2 py-0.5 rounded-lg">
              {activePlots} active
            </p>
          </div>

          <div className="bg-white rounded-[28px] p-6 text-slate-900 shadow-sm border border-slate-100 group hover:border-green-500/50 transition-colors">
            <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center mb-4 text-slate-500 group-hover:bg-green-50 group-hover:text-green-600 transition-colors">
              <Sprout className="h-5 w-5" />
            </div>
            <p className="text-slate-500 font-medium text-sm">Crops Planted</p>
            <h3 className="text-2xl font-bold mt-1">3</h3>
            <p className="text-xs mt-2 text-green-600 bg-green-50 w-fit px-2 py-0.5 rounded-lg flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" /> 2 new
            </p>
          </div>

          <div className="bg-white rounded-[28px] p-6 text-slate-900 shadow-sm border border-slate-100 group hover:border-[#DDA04E]/50 transition-colors">
            <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center mb-4 text-slate-500 group-hover:bg-[#DDA04E]/10 group-hover:text-[#DDA04E] transition-colors">
              <TrendingUp className="h-5 w-5" />
            </div>
            <p className="text-slate-500 font-medium text-sm">Avg ROI</p>
            <h3 className="text-2xl font-bold mt-1">{avgRoi.toFixed(1)}%</h3>
            <p className="text-xs mt-2 text-green-600 bg-green-50 w-fit px-2 py-0.5 rounded-lg flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" /> Healthy
            </p>
          </div>

          <div className="bg-white rounded-[28px] p-6 text-slate-900 shadow-sm border border-slate-100 group hover:border-[#DDA04E]/50 transition-colors">
            <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center mb-4 text-slate-500 group-hover:bg-[#DDA04E]/10 group-hover:text-[#DDA04E] transition-colors">
              <Calendar className="h-5 w-5" />
            </div>
            <p className="text-slate-500 font-medium text-sm">Next Harvest</p>
            <h3 className="text-2xl font-bold mt-1">Feb '26</h3>
            <p className="text-xs mt-2 text-slate-400 bg-slate-50 w-fit px-2 py-0.5 rounded-lg">
              Plot B
            </p>
          </div>
        </div>

        {/* Yield Projection Chart */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Yield Projection</h3>
              <p className="text-slate-500 text-sm">
                Projected vs actual yield (kg)
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm font-medium text-slate-600">
                <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>{" "}
                Projected
              </div>
              <div className="flex items-center text-sm font-medium text-slate-600">
                <span className="h-3 w-3 rounded-full bg-[#DDA04E] mr-2"></span>{" "}
                Actual
              </div>
            </div>
          </div>

          <div className="h-[280px] w-full min-w-0 relative">
            <ResponsiveContainer width="100%" height={280} minWidth={0}>
              <AreaChart data={FARM_YIELD_DATA}>
                <defs>
                  <linearGradient id="gradProjected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DDA04E" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#DDA04E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderRadius: "12px",
                    border: "none",
                    color: "white",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="projected"
                  stroke="#22c55e"
                  strokeWidth={2.5}
                  fill="url(#gradProjected)"
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#DDA04E"
                  strokeWidth={2.5}
                  fill="url(#gradActual)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plot Cards */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-900">Your Farm Plots</h3>
            <Button
              variant="ghost"
              className="text-slate-500"
              onClick={() => onNavigate("crops")}
            >
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FARM_PLOTS.map((plot) => {
              const statusCfg = STATUS_CONFIG[plot.status];
              return (
                <div
                  key={plot.id}
                  className="rounded-[24px] border border-slate-100 overflow-hidden hover:shadow-lg hover:border-slate-200 transition-all cursor-pointer group"
                >
                  <div className="h-36 relative overflow-hidden">
                    <ImageWithFallback
                      src={plot.image}
                      alt={plot.plotName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusCfg.bg} ${statusCfg.color}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full mr-1.5 ${statusCfg.dot}`}
                        ></span>
                        {plot.status}
                      </span>
                    </div>
                    <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <p className="absolute bottom-3 left-4 text-white font-bold text-sm">
                      {plot.crop}
                    </p>
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-slate-900 mb-1">{plot.plotName}</h4>
                    <div className="flex items-center text-xs text-slate-400 mb-4">
                      <MapPin className="h-3 w-3 mr-1" />
                      {plot.sizeSqm.toLocaleString()} sqm
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-50 rounded-xl p-3">
                        <p className="text-slate-400 mb-1">Planted</p>
                        <p className="text-slate-900 font-bold">
                          {new Date(plot.plantingDate).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3">
                        <p className="text-slate-400 mb-1">ROI</p>
                        <p className="text-green-600 font-bold">
                          {plot.roiProjection}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Sidebar Column */}
      <div className="lg:col-span-4 space-y-8">
        {/* Farm Manager Card */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Farm Managers</h3>
          <div className="space-y-4">
            {[
              {
                name: "Adebayo Ogunleye",
                avatar: "https://i.pravatar.cc/150?u=adebayo",
                plots: 2,
                role: "Senior Manager",
              },
              {
                name: "Ngozi Eze",
                avatar: "https://i.pravatar.cc/150?u=ngozi",
                plots: 2,
                role: "Plot Supervisor",
              },
            ].map((mgr) => (
              <div
                key={mgr.name}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-slate-100"
              >
                <div className="flex items-center min-w-0">
                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm shrink-0">
                    <AvatarImage src={mgr.avatar} />
                    <AvatarFallback>{mgr.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{mgr.name}</p>
                    <p className="text-xs text-slate-500">{mgr.role}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg shrink-0 ml-2">
                  {mgr.plots} plots
                </span>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full mt-4 rounded-xl border-slate-200 text-slate-600"
            onClick={() => onNavigate("feedback")}
          >
            Chat with Manager
          </Button>
        </div>

        {/* Weather & Conditions */}
        <div className="bg-slate-900 rounded-[32px] p-8 shadow-xl shadow-slate-300 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-green-500 rounded-full blur-3xl opacity-20"></div>

          <h3 className="text-lg font-bold mb-6 relative z-10">Farm Conditions</h3>

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-2xl">
              <div className="flex items-center">
                <Sun className="h-5 w-5 text-[#DDA04E] mr-3" />
                <span className="text-sm text-slate-300">Temperature</span>
              </div>
              <span className="font-bold">32°C</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-2xl">
              <div className="flex items-center">
                <Droplets className="h-5 w-5 text-blue-400 mr-3" />
                <span className="text-sm text-slate-300">Humidity</span>
              </div>
              <span className="font-bold">68%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-2xl">
              <div className="flex items-center">
                <Leaf className="h-5 w-5 text-green-400 mr-3" />
                <span className="text-sm text-slate-300">Soil Moisture</span>
              </div>
              <span className="font-bold">Optimal</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-2xl">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-slate-400 mr-3" />
                <span className="text-sm text-slate-300">Last Updated</span>
              </div>
              <span className="font-bold text-sm">2h ago</span>
            </div>
          </div>
        </div>

        {/* Upcoming Milestones */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Upcoming Milestones</h3>
          <div className="space-y-4">
            {[
              { event: "Plot B — Expected Harvest", date: "Feb 15, 2026", status: "upcoming" },
              { event: "Plot A — Flowering Complete", date: "Apr 2026", status: "upcoming" },
              { event: "Q1 Report Available", date: "Mar 31, 2026", status: "upcoming" },
            ].map((milestone, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 h-8 w-8 bg-[#DDA04E]/10 rounded-lg flex items-center justify-center shrink-0">
                  <Calendar className="h-4 w-4 text-[#DDA04E]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {milestone.event}
                  </p>
                  <p className="text-xs text-slate-400">{milestone.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}