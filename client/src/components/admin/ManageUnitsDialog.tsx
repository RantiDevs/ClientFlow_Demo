import { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  User, 
  Home, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ScrollArea } from "../ui/scroll-area";
import { AddUnitDialog, UnitData } from "./AddUnitDialog";
import { AssignTenantDialog, AssignmentData } from "./AssignTenantDialog";

interface ManageUnitsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: any;
}

// Mock Unit Generator
const generateMockUnits = (propertyId: string, count: number) => {
  return Array.from({ length: count }).map((_, i) => {
    const isOccupied = Math.random() > 0.3;
    const unitNum = 101 + i;
    return {
      id: `${propertyId}-u${unitNum}`,
      unitNumber: `${Math.floor(unitNum / 100)}${String(unitNum % 100).padStart(2, '0')}`,
      status: isOccupied ? "Occupied" : "Vacant",
      tenant: isOccupied ? "John Doe" : null,
      rent: 1200 + Math.floor(Math.random() * 500),
      leaseEnd: isOccupied ? "2025-06-30" : null,
      bedrooms: Math.random() > 0.5 ? 2 : 1,
      bathrooms: 1,
      sqft: 750 + Math.floor(Math.random() * 500)
    };
  });
};

export function ManageUnitsDialog({ open, onOpenChange, property }: ManageUnitsDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [units, setUnits] = useState<any[]>([]);
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);
  
  // Assignment State
  const [selectedUnitForAssignment, setSelectedUnitForAssignment] = useState<any>(null);
  const [isAssignTenantOpen, setIsAssignTenantOpen] = useState(false);

  useEffect(() => {
    if (property?.id) {
      setUnits(generateMockUnits(property.id, property.totalUnits || 10));
    }
  }, [property?.id]);

  const handleAddUnit = (newUnit: UnitData) => {
    const unitWithId = {
      ...newUnit,
      id: `${property.id}-u${Date.now()}`,
      tenant: newUnit.status === 'Occupied' ? "New Tenant" : null,
      leaseEnd: null
    };
    setUnits(prev => [unitWithId, ...prev]);
  };

  const openAssignTenant = (unit: any) => {
    setSelectedUnitForAssignment(unit);
    setIsAssignTenantOpen(true);
  };

  const handleAssignTenant = (data: AssignmentData) => {
    setUnits(prev => prev.map(u => {
      if (u.id === selectedUnitForAssignment.id) {
        return {
          ...u,
          status: 'Occupied',
          tenant: data.tenantName,
          rent: data.rent,
          leaseEnd: data.leaseEnd
        };
      }
      return u;
    }));
  };
  
  if (!property) return null;

  const filteredUnits = units.filter(unit => 
    unit.unitNumber.includes(searchTerm) || 
    (unit.tenant && unit.tenant.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <AddUnitDialog 
        open={isAddUnitOpen} 
        onOpenChange={setIsAddUnitOpen}
        onAddUnit={handleAddUnit}
        propertyId={property.id}
      />
      
      <AssignTenantDialog 
        open={isAssignTenantOpen}
        onOpenChange={setIsAssignTenantOpen}
        onAssign={handleAssignTenant}
        unit={selectedUnitForAssignment}
      />

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col gap-0 p-0">
          <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex justify-between items-center">
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900">Manage Units</DialogTitle>
                <DialogDescription className="mt-1">
                  {property.name} • {property.location}
                </DialogDescription>
              </div>
              <Button 
                onClick={() => setIsAddUnitOpen(true)}
                className="bg-[#DDA04E] hover:bg-[#c48b3d] text-white gap-2"
              >
                <Plus className="h-4 w-4" /> Add Unit
              </Button>
            </div>
          </DialogHeader>

          <div className="p-4 border-b border-slate-100 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
              <Input 
                placeholder="Search by unit number or tenant..." 
                className="pl-10 border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1 bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 border-slate-100">
                  <TableHead className="w-[100px]">Unit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead className="text-right">Rent</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUnits.length > 0 ? (
                  filteredUnits.map((unit) => (
                    <TableRow key={unit.id} className="border-slate-50 hover:bg-slate-50/50">
                      <TableCell className="font-medium text-slate-900">
                        {unit.unitNumber}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`border-none ${
                            unit.status === 'Occupied' 
                              ? 'bg-green-50 text-green-700' 
                              : unit.status === 'Maintenance'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {unit.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {unit.tenant ? (
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                              <User className="h-3 w-3" />
                            </div>
                            <span className="text-sm text-slate-700">{unit.tenant}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400 italic">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium text-slate-900">
                        ${unit.rent.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm">
                        {unit.bedrooms}bd {unit.bathrooms}ba • {unit.sqft} sqft
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" /> View Lease
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openAssignTenant(unit)}>
                              <User className="mr-2 h-4 w-4" /> Assign Tenant
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete Unit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                      No units found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
          
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-xs text-slate-500">
            <span>Showing {filteredUnits.length} units</span>
            <span>Total Capacity: {Math.max(property.totalUnits, units.length)} Units</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
