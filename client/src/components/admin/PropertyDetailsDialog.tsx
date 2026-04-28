import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { 
  MapPin, 
  Building2, 
  Users, 
  TrendingUp, 
  Calendar,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";

interface PropertyDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: any; // Using any for now based on the project data structure
}

export function PropertyDetailsDialog({ open, onOpenChange, property }: PropertyDetailsDialogProps) {
  if (!property) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
        {/* Header Image */}
        <div className="relative h-48 w-full shrink-0">
          <img 
            src={property.image} 
            alt={property.name} 
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-4 left-6 text-white">
            <Badge 
              className={`mb-2 border-none backdrop-blur-md ${
                property.status === "Active" ? "bg-green-500/90 text-white" : 
                property.status === "Completed" ? "bg-blue-500/90 text-white" :
                "bg-[#DDA04E]/90 text-white"
              }`}
            >
              {property.status}
            </Badge>
            <DialogTitle className="text-2xl font-bold tracking-tight text-white">{property.name}</DialogTitle>
            <DialogDescription className="sr-only">
              Detailed information about {property.name}, including stats, progress, and description.
            </DialogDescription>
            <div className="flex items-center text-white/90 text-sm mt-1">
              <MapPin className="h-4 w-4 mr-1.5" />
              {property.location}
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-8">
            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Building2 className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Type</span>
                </div>
                <p className="font-bold text-slate-900">{property.type}</p>
              </div>
              
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Users className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Units</span>
                </div>
                <p className="font-bold text-slate-900">{property.totalUnits}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">ROI</span>
                </div>
                <p className="font-bold text-[#DDA04E]">{property.roi}%</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Occupancy</span>
                </div>
                <p className="font-bold text-slate-900">{property.occupancy}%</p>
              </div>
            </div>

            {/* Progress Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-900">Project Progress</h3>
                <span className="text-sm font-medium text-slate-600">{property.progress}% Complete</span>
              </div>
              <Progress value={property.progress} className="h-3 bg-slate-100" />
              
              {property.milestones && (
                <div className="mt-6 space-y-3">
                  {property.milestones.map((milestone: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-white">
                      <div className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${milestone.completed ? 'bg-green-500' : 'bg-slate-300'}`} />
                        <span className={`text-sm ${milestone.completed ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                          {milestone.name}
                        </span>
                      </div>
                      {milestone.completed ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200">Pending</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Additional Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Property Description</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {property.description || "No description available for this property. Please edit the property details to add a description about the amenities, location benefits, and investment potential."}
              </p>
            </div>
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-2 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button className="bg-[#DDA04E] hover:bg-[#c48b3d] text-white">Edit Property</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
