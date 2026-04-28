import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { 
    Users, 
    Building, 
    Wallet, 
    ArrowUpRight, 
    Search, 
    LandPlot, 
    Hammer, 
    Home, 
    MoreHorizontal,
    CheckCircle2,
    Clock
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Progress } from "../ui/progress";
import { PROJECTS } from "../../lib/data";
import { AddPropertyDialog } from "./AddPropertyDialog";

interface AdminDashboardProps {
  onNavigate?: (tab: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  // Mock Data Calculations
  const availableProperties = PROJECTS.filter(p => p.status === 'Active' || p.status === 'Completed');
  const landProperties = PROJECTS.filter(p => p.type === 'Land');
  const hostelProperties = PROJECTS.filter(p => p.type === 'Hostel');
  const constructionProperties = PROJECTS.filter(p => p.type === 'Construction');

  const totalInvestors = 142;
  const totalTenants = 850;
  
  return (
    <div className="space-y-8">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Portfolio Overview</h2>
          <p className="text-slate-500 mt-1">Comprehensive view of assets, investors, and operations.</p>
        </div>
        <div className="flex items-center space-x-3">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search portfolio..." className="pl-10 h-10 w-64 rounded-full bg-white border-none shadow-sm" />
           </div>
           <AddPropertyDialog trigger={<Button className="rounded-full bg-slate-900 text-white h-10 px-6">Add Asset</Button>} />
        </div>
      </div>

      {/* High-Level Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white border-none shadow-sm rounded-3xl p-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#DDA04E]/5 rounded-bl-full transition-transform group-hover:scale-110"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Total Investors</CardTitle>
                <div className="h-8 w-8 rounded-full bg-[#DDA04E]/10 flex items-center justify-center">
                    <Users className="h-4 w-4 text-[#DDA04E]" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-slate-900">{totalInvestors}</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span className="font-medium">+12 this month</span>
                </div>
                <div className="mt-3 text-xs text-slate-400 flex justify-between">
                    <span>Active: 128</span>
                    <span>Pending: 14</span>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm rounded-3xl p-2 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full transition-transform group-hover:scale-110"></div>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Total Tenants</CardTitle>
                <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <Home className="h-4 w-4 text-blue-600" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-slate-900">{totalTenants}</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span className="font-medium">94% Occupancy</span>
                </div>
                <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '94%' }}></div>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm rounded-3xl p-2 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full transition-transform group-hover:scale-110"></div>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Properties Available</CardTitle>
                <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center">
                    <Building className="h-4 w-4 text-purple-600" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-slate-900">{availableProperties.length}</div>
                <p className="text-xs text-slate-400 mt-1">Ready for lease/sale</p>
                <div className="mt-3 flex gap-2">
                    <Badge variant="secondary" className="text-[10px] h-5 bg-purple-50 text-purple-700">{hostelProperties.length} Hostels</Badge>
                    <Badge variant="secondary" className="text-[10px] h-5 bg-green-50 text-green-700">{landProperties.length} Land</Badge>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm rounded-3xl p-2 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full transition-transform group-hover:scale-110"></div>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Under Construction</CardTitle>
                <div className="h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center">
                    <Hammer className="h-4 w-4 text-orange-600" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-slate-900">{constructionProperties.length}</div>
                <p className="text-xs text-slate-400 mt-1">Active sites</p>
                <div className="mt-3 text-xs text-orange-600 font-medium flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Avg. Completion: 8 mo
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Property Category Details */}
      <div className="grid gap-6 md:grid-cols-3">
          {/* Landing Properties Card */}
          <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-slate-50 bg-slate-50/50 pb-4">
                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                          <LandPlot className="h-5 w-5 text-green-600" />
                          <CardTitle className="text-base">Landing Properties</CardTitle>
                      </div>
                      <Badge variant="outline" className="bg-white">{landProperties.length} Total</Badge>
                  </div>
              </CardHeader>
              <CardContent className="pt-4">
                  <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500">Total Area</span>
                          <span className="font-semibold text-slate-900">45,200 sq.ft</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500">Valuation</span>
                          <span className="font-semibold text-slate-900">₦2,000.4B</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500">Appreciation (YTD)</span>
                          <span className="font-semibold text-green-600">+12.5%</span>
                      </div>
                  </div>
              </CardContent>
          </Card>

          {/* Hostel Properties Card */}
          <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-slate-50 bg-slate-50/50 pb-4">
                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                          <Building className="h-5 w-5 text-purple-600" />
                          <CardTitle className="text-base">Hostel Properties</CardTitle>
                      </div>
                      <Badge variant="outline" className="bg-white">{hostelProperties.length} Total</Badge>
                  </div>
              </CardHeader>
              <CardContent className="pt-4">
                  <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500">Total Beds</span>
                          <span className="font-semibold text-slate-900">320</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500">Current Occupancy</span>
                          <span className="font-semibold text-slate-900">92%</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500">Monthly Revenue</span>
                          <span className="font-semibold text-green-600">₦45,000.2M</span>
                      </div>
                  </div>
              </CardContent>
          </Card>

          {/* Construction Properties Card */}
           <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-slate-50 bg-slate-50/50 pb-4">
                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                          <Hammer className="h-5 w-5 text-orange-600" />
                          <CardTitle className="text-base">Construction</CardTitle>
                      </div>
                      <Badge variant="outline" className="bg-white">{constructionProperties.length} Active</Badge>
                  </div>
              </CardHeader>
              <CardContent className="pt-4">
                  <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500">Budget Deployed</span>
                          <span className="font-semibold text-slate-900">₦1,000.2B / ₦3,000.5B</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500">Contractors</span>
                          <span className="font-semibold text-slate-900">5 Teams</span>
                      </div>
                      <div className="space-y-1">
                          <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-500">Overall Progress</span>
                              <span className="font-semibold text-orange-600">65%</span>
                          </div>
                          <Progress value={65} className="h-1.5" />
                      </div>
                  </div>
              </CardContent>
          </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-7">
        
        {/* Available Properties List */}
        <Card className="md:col-span-4 bg-white border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Available Properties</CardTitle>
                    <CardDescription>Properties currently listed for lease or sale</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onNavigate?.('properties')}>View All</Button>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow className="border-slate-100 hover:bg-slate-50">
                            <TableHead className="pl-6 font-semibold">Property Name</TableHead>
                            <TableHead className="font-semibold">Type</TableHead>
                            <TableHead className="font-semibold">Location</TableHead>
                            <TableHead className="font-semibold text-right pr-6">Units/ROI</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {availableProperties.length > 0 ? availableProperties.map((property) => (
                            <TableRow key={property.id} className="border-slate-50 hover:bg-slate-50/50">
                                <TableCell className="pl-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                                            <img src={property.image} alt="" className="h-full w-full object-cover" />
                                        </div>
                                        <span className="font-medium text-slate-900">{property.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="border-slate-200 bg-white text-slate-600 font-normal">
                                        {property.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-slate-500">{property.location}</TableCell>
                                <TableCell className="text-right pr-6">
                                    <div className="flex flex-col items-end">
                                        <span className="font-medium text-slate-900">{property.totalUnits} Units</span>
                                        <span className="text-xs text-green-600 font-medium">{property.roi}% ROI</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                                    No available properties found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        {/* Construction Status */}
        <Card className="md:col-span-3 bg-white border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Construction Status</CardTitle>
                    <CardDescription>Live project tracking</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                 <div className="divide-y divide-slate-50">
                    {constructionProperties.length > 0 ? constructionProperties.map((property) => (
                        <div key={property.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                                        <Hammer className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900 text-sm">{property.name}</h4>
                                        <p className="text-xs text-slate-500">{property.location}</p>
                                    </div>
                                </div>
                                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none">
                                    {property.progress}%
                                </Badge>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-slate-500 mb-1">
                                    <span>Milestones</span>
                                    <span>{property.milestones?.filter(m => m.completed).length}/{property.milestones?.length} Completed</span>
                                </div>
                                <div className="flex gap-1 h-1.5">
                                    {property.milestones?.map((m, idx) => (
                                        <div 
                                            key={idx} 
                                            className={`flex-1 rounded-full ${m.completed ? 'bg-green-500' : 'bg-slate-100'}`}
                                            title={m.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-8 text-slate-500">No active construction projects.</div>
                    )}
                 </div>
                 
                 {constructionProperties.length > 0 && (
                     <div className="p-4 bg-slate-50 border-t border-slate-100">
                         <Button variant="outline" className="w-full border-slate-200 bg-white text-slate-700">
                             View Project Details
                         </Button>
                     </div>
                 )}
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
