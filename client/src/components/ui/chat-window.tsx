import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, MoreVertical, Phone, Video, X, Search, Bell, Trash2, ShieldAlert, UserX, Flag } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { ScrollArea } from "./scroll-area";
import { FileUploader, FilePreview } from "./file-uploader";
import { cn } from "./utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export interface Message {
  id: string;
  sender: "me" | "other";
  content: string;
  timestamp: string;
  attachment?: {
    type: "image" | "file";
    url: string;
    name: string;
  };
}

interface ChatWindowProps {
  recipientName: string;
  recipientAvatar?: string;
  recipientRole?: string;
  initialMessages?: Message[];
  onSendMessage?: (content: string, attachment?: { file: File, url: string }) => void;
  className?: string;
}

export function ChatWindow({ 
  recipientName, 
  recipientAvatar, 
  recipientRole = "Support", 
  initialMessages = [],
  onSendMessage,
  className 
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState<{ file: File, url: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isUploading]);

  const handleSend = () => {
    if ((!inputValue.trim() && !pendingAttachment)) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "me",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment: pendingAttachment ? {
        type: pendingAttachment.file.type.startsWith("image/") ? "image" : "file",
        url: pendingAttachment.url,
        name: pendingAttachment.file.name
      } : undefined
    };

    setMessages(prev => [...prev, newMessage]);
    onSendMessage?.(inputValue, pendingAttachment || undefined);
    
    setInputValue("");
    setPendingAttachment(null);
    setIsUploading(false);

    // Simulate Reply
    setTimeout(() => {
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "other",
        content: "Thanks for your message. An agent will review this shortly.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, replyMessage]);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn("flex flex-col h-[600px] border rounded-xl bg-white shadow-sm overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white z-10">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={recipientAvatar} />
            <AvatarFallback>{recipientName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm text-slate-900">{recipientName}</p>
            <p className="text-xs text-slate-500">{recipientRole}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="text-slate-400">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-400">
            <Video className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-400">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Chat Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Search className="mr-2 h-4 w-4" />
                <span>Search in conversation</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                <span>Mute notifications</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Clear chat history</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                <Flag className="mr-2 h-4 w-4" />
                <span>Report user</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                <UserX className="mr-2 h-4 w-4" />
                <span>Block user</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 bg-slate-50/50">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex w-full",
                msg.sender === "me" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-3 shadow-sm",
                  msg.sender === "me"
                    ? "bg-slate-900 text-white rounded-br-none"
                    : "bg-white text-slate-800 border border-slate-100 rounded-bl-none"
                )}
              >
                {msg.attachment && (
                  <div className="mb-3 rounded-lg overflow-hidden">
                    {msg.attachment.type === "image" ? (
                      <img src={msg.attachment.url} alt="attachment" className="max-w-full h-auto rounded-lg border border-white/20" />
                    ) : (
                      <div className="flex items-center p-3 bg-white/10 rounded border border-white/20">
                         <Paperclip className="h-4 w-4 mr-2" />
                         <span className="text-sm underline truncate">{msg.attachment.name}</span>
                      </div>
                    )}
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <p className={cn(
                  "text-[10px] mt-1 text-right opacity-70",
                  msg.sender === "me" ? "text-slate-300" : "text-slate-400"
                )}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 bg-white border-t space-y-3">
        {isUploading && (
          <div className="animate-in slide-in-from-bottom-2 fade-in">
             <div className="flex justify-between items-center mb-2">
               <span className="text-xs font-semibold text-slate-500">Upload Attachment</span>
               <Button variant="ghost" size="sm" onClick={() => setIsUploading(false)} className="h-6 w-6 p-0"><X className="h-4 w-4" /></Button>
             </div>
             <FileUploader 
               onFileSelect={(file, url) => {
                 setPendingAttachment({ file, url });
                 setIsUploading(false);
               }}
               className="mb-2"
             />
          </div>
        )}

        {pendingAttachment && (
          <FilePreview 
            file={pendingAttachment.file} 
            previewUrl={pendingAttachment.url} 
            onRemove={() => setPendingAttachment(null)} 
          />
        )}

        <div className="flex items-end space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("flex-shrink-0", isUploading ? "text-teal-600 bg-teal-50" : "text-slate-400")}
            onClick={() => setIsUploading(!isUploading)}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="pr-10 py-6"
            />
          </div>
          <Button 
            onClick={handleSend} 
            disabled={!inputValue.trim() && !pendingAttachment}
            size="icon"
            className="flex-shrink-0 bg-slate-900 hover:bg-slate-800"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
