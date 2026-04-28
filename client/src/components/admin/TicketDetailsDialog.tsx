import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { 
  Calendar, 
  MapPin, 
  User, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Wrench,
  Mail,
  Building2,
  Hash
} from "lucide-react";

export interface TicketData {
  id: string;
  title: string;
  property: string;
  unit: string;
  priority: string;
  status: string;
  date: string;
  requester: string;
  email?: string;
  avatar?: string;
  lastUpdated?: string;
  description?: string; // Although not in mock data explicitly, good to have for UI
}

interface TicketDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: TicketData | null;
}

export function TicketDetailsDialog({ open, onOpenChange, ticket }: TicketDetailsDialogProps) {
  if (!ticket) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-start justify-between mr-4">
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                {ticket.title}
                <Badge variant="outline" className="text-xs font-normal text-slate-500 border-slate-200">
                  {ticket.id}
                </Badge>
              </DialogTitle>
              <DialogDescription className="mt-1">
                Submitted on {ticket.date}
              </DialogDescription>
            </div>
            <Badge 
              className={`
                px-3 py-1 text-sm border-none shadow-none
                ${ticket.status === 'Resolved' ? 'bg-green-100 text-green-700' : 
                  ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                  'bg-slate-100 text-slate-700'}
              `}
            >
              {ticket.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Priority Alert */}
          {ticket.priority === 'High' && (
            <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 text-sm">High Priority Ticket</h4>
                <p className="text-red-700 text-sm mt-0.5">
                  This issue requires immediate attention. Please assign a technician as soon as possible.
                </p>
              </div>
            </div>
          )}

          {/* Location & Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Property</span>
              <div className="flex items-center gap-2 text-slate-700">
                <Building2 className="h-4 w-4 text-slate-400" />
                <span className="font-medium">{ticket.property}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Unit / Area</span>
              <div className="flex items-center gap-2 text-slate-700">
                <Hash className="h-4 w-4 text-slate-400" />
                <span>{ticket.unit || "N/A"}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Last Updated</span>
              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>{ticket.lastUpdated || "Recently"}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Priority Level</span>
              <div className="flex items-center gap-2 text-slate-700">
                <AlertCircle className={`h-4 w-4 ${
                  ticket.priority === 'High' ? 'text-red-500' : 
                  ticket.priority === 'Medium' ? 'text-amber-500' : 
                  'text-green-500'
                }`} />
                <span>{ticket.priority}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Requester Info */}
          <div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-3">Requester</span>
            <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <Avatar className="h-10 w-10 border border-slate-200">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${ticket.requester}`} />
                <AvatarFallback>{ticket.avatar || "REQ"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-slate-900">{ticket.requester}</p>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Mail className="h-3 w-3" />
                  {ticket.email || "No email provided"}
                </div>
              </div>
              <Button variant="outline" size="sm" className="bg-white">
                Contact
              </Button>
            </div>
          </div>

          {/* Description */}
          <div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-2">Description</span>
            <div className="bg-slate-50 p-4 rounded-xl text-slate-700 text-sm leading-relaxed border border-slate-100">
              {ticket.description || "No detailed description provided for this ticket. Please contact the requester for more information."}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button className="bg-[#DDA04E] hover:bg-[#c48b3d] text-white gap-2">
            <Wrench className="h-4 w-4" />
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
