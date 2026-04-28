import { ChatWindow } from "../ui/chat-window";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { MessageSquare } from "lucide-react";

export function TenantMessages() {
  const initialMessages = [
    {
      id: "1",
      sender: "me" as const,
      content: "Hi, is it possible to pay rent via bank transfer this month?",
      timestamp: "Yesterday"
    },
    {
      id: "2",
      sender: "other" as const,
      content: "Yes, absolutely. The details are in your dashboard under 'Payment Methods'.",
      timestamp: "Yesterday"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Messages</h2>
        <p className="text-slate-500">Chat with support or your landlord.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Contact List (Mock) */}
        <Card className="md:col-span-1 shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" /> Chats
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y">
               <div className="p-4 bg-slate-50 border-l-4 border-teal-500 cursor-pointer">
                 <p className="font-semibold text-sm">Support Team</p>
                 <p className="text-xs text-slate-500 truncate">Payment options...</p>
               </div>
               <div className="p-4 hover:bg-slate-50 cursor-pointer">
                 <p className="font-semibold text-sm">Landlord</p>
                 <p className="text-xs text-slate-500">Start a new conversation</p>
               </div>
             </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <div className="md:col-span-3">
          <ChatWindow 
            recipientName="Support Team" 
            recipientRole="ClientFlow Helpdesk"
            initialMessages={initialMessages}
          />
        </div>
      </div>
    </div>
  );
}
