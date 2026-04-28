import { useState } from "react";
import {
  FileText,
  Calendar,
  Leaf,
  CloudRain,
  TrendingUp,
  DollarSign,
  ChevronDown,
  ChevronUp,
  MapPin,
} from "lucide-react";
import { FARM_REPORTS } from "../../lib/data";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export function VerdaReports() {
  const [expandedReport, setExpandedReport] = useState<string | null>(FARM_REPORTS[0]?.id || null);

  const totalExpenses = (expenses: { label: string; amount: number }[]) =>
    expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Monthly Reports</h2>
        <p className="text-slate-500 text-sm">
          Detailed farm updates with growth stages, expenses, and yield projections
        </p>
      </div>

      {/* Report Timeline */}
      <div className="space-y-6">
        {FARM_REPORTS.map((report) => {
          const isExpanded = expandedReport === report.id;
          const total = totalExpenses(report.expenses);

          return (
            <div
              key={report.id}
              className="bg-white rounded-[28px] border border-slate-100 overflow-hidden transition-all hover:shadow-md"
            >
              {/* Report Header */}
              <button
                onClick={() => setExpandedReport(isExpanded ? null : report.id)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="h-12 w-12 bg-green-50 rounded-2xl flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900">{report.month}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-400">
                      <span className="flex items-center">
                        <Leaf className="h-3 w-3 mr-1" />
                        {report.growthStage}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="h-3 w-3 mr-1" />
                        ₦{total.toLocaleString()} total expenses
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600">
                    {report.growthStage}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-6 pb-6 space-y-6 animate-in fade-in duration-300">
                  <div className="h-[1px] bg-slate-100"></div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Farm Photo */}
                    <div className="rounded-2xl overflow-hidden h-56 relative">
                      <ImageWithFallback
                        src={report.photoUrl}
                        alt={`Farm photo - ${report.month}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-3 left-3 flex items-center bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                        <MapPin className="h-3 w-3 mr-1.5" />
                        Geo-tagged &middot; {report.date}
                      </div>
                    </div>

                    {/* Expense Breakdown */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-900 flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-[#DDA04E]" />
                        Expense Breakdown
                      </h4>
                      <div className="space-y-3">
                        {report.expenses.map((expense, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="h-2 w-2 rounded-full bg-[#DDA04E] shrink-0"></div>
                              <span className="text-sm text-slate-600 truncate">
                                {expense.label}
                              </span>
                            </div>
                            <span className="font-bold text-slate-900 text-sm shrink-0 ml-4">
                              ₦{expense.amount.toLocaleString()}
                            </span>
                          </div>
                        ))}
                        <div className="h-[1px] bg-slate-100 mt-2"></div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-900">Total</span>
                          <span className="font-bold text-[#DDA04E]">
                            ₦{total.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Expense Bar Visual */}
                      <div className="flex h-3 rounded-full overflow-hidden bg-slate-100">
                        {report.expenses.map((expense, i) => {
                          const colors = ["bg-[#DDA04E]", "bg-green-500", "bg-blue-400", "bg-slate-400"];
                          return (
                            <div
                              key={i}
                              className={`${colors[i % colors.length]} transition-all`}
                              style={{ width: `${(expense.amount / total) * 100}%` }}
                            ></div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Weather & Yield Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <CloudRain className="h-4 w-4 text-blue-500" />
                        <h4 className="text-sm font-bold text-blue-800">Weather Impact</h4>
                      </div>
                      <p className="text-sm text-blue-700/80">{report.weatherNotes}</p>
                    </div>
                    <div className="bg-green-50 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <h4 className="text-sm font-bold text-green-800">Yield Projection</h4>
                      </div>
                      <p className="text-sm text-green-700/80">{report.yieldProjection}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
