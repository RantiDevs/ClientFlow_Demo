import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Progress } from "../ui/progress";
import { Label } from "../ui/label";
import { 
  Building2, 
  MapPin, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  ArrowUpRight,
  Home,
  Users,
  X
} from "lucide-react";
import { PROJECTS } from "../../lib/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AddPropertyDialog } from "./AddPropertyDialog";
import { PropertyDetailsDialog } from "./PropertyDetailsDialog";
import { ManageUnitsDialog } from "./ManageUnitsDialog";

export function AdminProperties() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  
  // Dialog State
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isManageUnitsOpen, setIsManageUnitsOpen] = useState(false);

  const handleViewDetails = (property: any) => {
    setSelectedProperty(property);
    setIsViewDetailsOpen(true);
  };

  const handleManageUnits = (property: any) => {
    setSelectedProperty(property);
    setIsManageUnitsOpen(true);
  };
  
  // Advanced Filters
  const [filterType, setFilterType] = useState("All");
  const [minRoi, setMinRoi] = useState("");
  const [minOccupancy, setMinOccupancy] = useState("");

  const filteredProjects = PROJECTS.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "All" || project.status === filterStatus;
    const matchesType = filterType === "All" || project.type === filterType;
    const matchesRoi = minRoi === "" || (project.roi || 0) >= Number(minRoi);
    const matchesOccupancy = minOccupancy === "" || (project.occupancy || 0) >= Number(minOccupancy);

    return matchesSearch && matchesStatus && matchesType && matchesRoi && matchesOccupancy;
  });

  const resetFilters = () => {
    setFilterType("All");
    setMinRoi("");
    setMinOccupancy("");
  };

  const hasActiveFilters = filterType !== "All" || minRoi !== "" || minOccupancy !== "";

  // Calculate stats
  const totalProperties = PROJECTS.length;
  const totalUnits = PROJECTS.reduce((acc, curr) => acc + (curr.totalUnits || 0), 0);
  const avgOccupancy = Math.round(PROJECTS.reduce((acc, curr) => acc + (curr.occupancy || 0), 0) / totalProperties);
  const totalValue = "₦12,000.5B"; // Mocked for now

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Properties</h1>
          <p className="text-slate-500 mt-1">Manage your real estate portfolio and assets.</p>
        </div>
        <AddPropertyDialog />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Properties</p>
            <h3 className="text-2xl font-bold text-slate-900">{totalProperties}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900">
            <Home className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Units</p>
            <h3 className="text-2xl font-bold text-slate-900">{totalUnits}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Avg Occupancy</p>
            <h3 className="text-2xl font-bold text-slate-900">{avgOccupancy}%</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900">
            <ArrowUpRight className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Portfolio Value</p>
            <h3 className="text-2xl font-bold text-slate-900">{totalValue}</h3>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-[24px] shadow-sm border border-slate-100">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search properties..." 
            className="pl-10 border-slate-200 rounded-xl focus-visible:ring-[#DDA04E]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          
          {/* Advanced Filter Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className={`rounded-xl border-slate-200 ${hasActiveFilters ? 'bg-slate-50 border-[#DDA04E] text-[#DDA04E]' : ''}`}
              >
                <Filter className="mr-2 h-4 w-4" /> 
                Filters
                {hasActiveFilters && <span className="ml-1 rounded-full bg-[#DDA04E] w-2 h-2" />}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900">Filter Properties</h4>
                  {hasActiveFilters && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={resetFilters}
                      className="h-8 px-2 text-slate-500 hover:text-slate-900"
                    >
                      <X className="mr-1 h-3 w-3" /> Clear
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-xs font-medium text-slate-500 uppercase">Property Type</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger id="type" className="w-full">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Types</SelectItem>
                      <SelectItem value="Hostel">Hostel</SelectItem>
                      <SelectItem value="Land">Land</SelectItem>
                      <SelectItem value="Construction">Construction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minRoi" className="text-xs font-medium text-slate-500 uppercase">Min ROI %</Label>
                    <Input 
                      id="minRoi" 
                      type="number" 
                      placeholder="0" 
                      value={minRoi}
                      onChange={(e) => setMinRoi(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minOccupancy" className="text-xs font-medium text-slate-500 uppercase">Min Occupancy %</Label>
                    <Input 
                      id="minOccupancy" 
                      type="number" 
                      placeholder="0" 
                      value={minOccupancy}
                      onChange={(e) => setMinOccupancy(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl border-slate-200">
                Status: {filterStatus}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterStatus("All")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Active")}>Active</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Completed")}>Completed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Under Management")}>Under Management</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <Card key={project.id} className="group overflow-hidden border-slate-100 hover:border-[#DDA04E]/50 hover:shadow-lg transition-all duration-300 rounded-[24px]">
              <div className="h-56 w-full overflow-hidden relative">
                <img 
                  src={project.image} 
                  alt={project.name} 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                
                <div className="absolute top-4 right-4">
                  <Badge 
                    className={`border-none backdrop-blur-md px-3 py-1 ${
                      project.status === "Active" ? "bg-green-500/90 text-white" : 
                      project.status === "Completed" ? "bg-blue-500/90 text-white" :
                      "bg-[#DDA04E]/90 text-white"
                    }`}
                  >
                    {project.status}
                  </Badge>
                </div>

                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold tracking-tight">{project.name}</h3>
                  <p className="text-sm text-white/80 flex items-center mt-1">
                    <MapPin className="h-3 w-3 mr-1" /> {project.location}
                  </p>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Type</p>
                      <p className="font-bold text-slate-900">{project.type}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">ROI</p>
                      <p className="font-bold text-[#DDA04E]">{project.roi}%</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-medium">Occupancy</span>
                      <span className="font-bold text-slate-900">{project.occupancy}%</span>
                    </div>
                    <Progress value={project.occupancy} className="h-2 bg-slate-100" />
                  </div>

                  <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-100">
                    <span className="text-slate-500">{project.totalUnits} Units</span>
                    <span className="text-slate-500">Managed by ClientFlow</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0 flex gap-2">
                <AddPropertyDialog 
                  mode="edit" 
                  initialData={project}
                  trigger={
                    <Button variant="outline" className="flex-1 rounded-xl border-slate-200 hover:bg-slate-50 hover:text-[#DDA04E]">
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                  }
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-xl border-slate-200">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(project)}>
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleManageUnits(project)}>
                      <Building2 className="mr-2 h-4 w-4" /> Manage Units
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Property
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-12 text-center bg-slate-50 rounded-[24px] border border-dashed border-slate-200">
             <div className="mx-auto h-12 w-12 text-slate-300 mb-3">
               <Search className="h-full w-full" />
             </div>
             <h3 className="text-lg font-medium text-slate-900">No properties found</h3>
             <p className="text-slate-500 mt-1 max-w-sm mx-auto">
               No properties match your current search and filter criteria. Try adjusting your filters.
             </p>
             <Button 
               variant="outline" 
               className="mt-4"
               onClick={() => {
                 setSearchTerm("");
                 resetFilters();
                 setFilterStatus("All");
               }}
             >
               Clear All Filters
             </Button>
          </div>
        )}
      </div>

      <PropertyDetailsDialog 
        open={isViewDetailsOpen} 
        onOpenChange={setIsViewDetailsOpen} 
        property={selectedProperty} 
      />

      <ManageUnitsDialog 
        open={isManageUnitsOpen} 
        onOpenChange={setIsManageUnitsOpen} 
        property={selectedProperty} 
      />
    </div>
  );
}
