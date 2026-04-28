import { ChatWindow } from "../ui/chat-window";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Users } from "lucide-react";

export function InvestorMessages() {
  const initialMessages = [
    {
      id: "1",
      sender: "other" as const,
      content: "Hello Alex, your monthly statement for June has been uploaded.",
      timestamp: "10:30 AM"
    },
    {
      id: "2",
      sender: "me" as const,
      content: "Thanks! I also noticed a repair charge on the Pavilion project. Can you clarify?",
      timestamp: "10:35 AM"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Messages</h2>
        <p className="text-slate-500">Communicate with your property manager.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Contact List (Mock) */}
        <Card className="md:col-span-1 shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Users className="mr-2 h-4 w-4" /> Contacts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y">
               <div className="p-4 bg-slate-50 border-l-4 border-teal-500 cursor-pointer">
                 <p className="font-semibold text-sm">Property Admin</p>
                 <p className="text-xs text-slate-500 truncate">RE: Repair charge clarification</p>
               </div>
               <div className="p-4 hover:bg-slate-50 cursor-pointer">
                 <p className="font-semibold text-sm">Legal Team</p>
                 <p className="text-xs text-slate-500">Contract updates...</p>
               </div>
             </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <div className="md:col-span-2">
          <ChatWindow 
            recipientName="Property Admin" 
            recipientRole="ClientFlow Management"
            initialMessages={initialMessages}
          />
        </div>
      </div>
    </div>
  );
}
