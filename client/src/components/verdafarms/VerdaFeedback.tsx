import { useState } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import {
  MessageSquare,
  Send,
  Star,
  Sprout,
  ChevronRight,
  User,
  ThumbsUp,
} from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  sender: "user" | "manager";
  name: string;
  avatar: string;
  content: string;
  time: string;
}

const MOCK_MESSAGES: Message[] = [
  {
    id: "m1",
    sender: "manager",
    name: "Adebayo Ogunleye",
    avatar: "https://i.pravatar.cc/150?u=adebayo",
    content:
      "Good morning! Just wanted to update you — Plot A's cashew trees are entering the flowering stage. We'll send the full photo report this weekend.",
    time: "10:32 AM",
  },
  {
    id: "m2",
    sender: "user",
    name: "Alex Johnson",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    content:
      "That's great to hear! How does the yield look compared to last year's cycle?",
    time: "10:45 AM",
  },
  {
    id: "m3",
    sender: "manager",
    name: "Adebayo Ogunleye",
    avatar: "https://i.pravatar.cc/150?u=adebayo",
    content:
      "We're tracking 12% above last cycle's yield at this stage. The improved irrigation system is making a clear difference.",
    time: "11:02 AM",
  },
];

const CROP_PREFERENCES = ["Cashew", "Cassava", "Managed Portfolio", "No Preference"];

export function VerdaFeedback() {
  const [activeTab, setActiveTab] = useState<"chat" | "preference" | "rate">("chat");
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const [selectedPreference, setSelectedPreference] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: `m${messages.length + 1}`,
      sender: "user",
      name: "Alex Johnson",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      content: newMessage,
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    };
    setMessages([...messages, msg]);
    setNewMessage("");
  };

  const handleSubmitPreference = () => {
    if (!selectedPreference) return;
    toast.success(`Crop preference "${selectedPreference}" submitted for next cycle!`);
  };

  const handleSubmitRating = () => {
    if (rating === 0) return;
    toast.success("Thank you for your feedback!");
    setFeedback("");
    setRating(0);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Feedback & Communication</h2>
        <p className="text-slate-500 text-sm">
          Chat with your farm manager, suggest crop preferences, or rate your experience
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-slate-100 rounded-2xl p-1 w-fit">
        {[
          { id: "chat", label: "Chat", icon: MessageSquare },
          { id: "preference", label: "Crop Preference", icon: Sprout },
          { id: "rate", label: "Rate Experience", icon: Star },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all ${
              activeTab === tab.id
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Chat Tab */}
      {activeTab === "chat" && (
        <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm overflow-hidden">
          {/* Chat Header */}
          <div className="flex items-center gap-4 p-6 border-b border-slate-100">
            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
              <AvatarImage src="https://i.pravatar.cc/150?u=adebayo" />
              <AvatarFallback>AO</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-slate-900">Adebayo Ogunleye</p>
              <p className="text-xs text-green-500 flex items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></span>
                Online — Farm Manager
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[400px] overflow-y-auto p-6 space-y-6 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : ""}`}
              >
                {msg.sender === "manager" && (
                  <Avatar className="h-8 w-8 shrink-0 mt-1">
                    <AvatarImage src={msg.avatar} />
                    <AvatarFallback>{msg.name[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] ${
                    msg.sender === "user" ? "order-first" : ""
                  }`}
                >
                  <div
                    className={`p-4 rounded-2xl text-sm ${
                      msg.sender === "user"
                        ? "bg-slate-900 text-white rounded-br-md"
                        : "bg-white border border-slate-100 text-slate-700 rounded-bl-md shadow-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <p
                    className={`text-xs text-slate-400 mt-1.5 ${
                      msg.sender === "user" ? "text-right" : ""
                    }`}
                  >
                    {msg.time}
                  </p>
                </div>
                {msg.sender === "user" && (
                  <Avatar className="h-8 w-8 shrink-0 mt-1">
                    <AvatarImage src={msg.avatar} />
                    <AvatarFallback>AJ</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-slate-100 bg-white">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 px-4 py-3 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#DDA04E]/30 border-none"
              />
              <Button
                onClick={handleSendMessage}
                className="h-11 w-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white p-0"
                disabled={!newMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Crop Preference Tab */}
      {activeTab === "preference" && (
        <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-8">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-8">
              <div className="h-16 w-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sprout className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Suggest Crop for Next Cycle
              </h3>
              <p className="text-slate-500 text-sm mt-2">
                Let us know your preferred crop for the next farming cycle. Our experts will
                consider soil, weather, and market conditions.
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {CROP_PREFERENCES.map((pref) => (
                <button
                  key={pref}
                  onClick={() => setSelectedPreference(pref)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                    selectedPreference === pref
                      ? "border-green-500 bg-green-50 shadow-sm"
                      : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                        selectedPreference === pref
                          ? "bg-green-500 text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <Sprout className="h-5 w-5" />
                    </div>
                    <span
                      className={`font-bold ${
                        selectedPreference === pref
                          ? "text-green-700"
                          : "text-slate-700"
                      }`}
                    >
                      {pref}
                    </span>
                  </div>
                  {selectedPreference === pref && (
                    <ThumbsUp className="h-5 w-5 text-green-500" />
                  )}
                </button>
              ))}
            </div>

            <Button
              onClick={handleSubmitPreference}
              disabled={!selectedPreference}
              className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold disabled:opacity-50"
            >
              Submit Preference
            </Button>
          </div>
        </div>
      )}

      {/* Rate Experience Tab */}
      {activeTab === "rate" && (
        <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-8">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-8">
              <div className="h-16 w-16 bg-[#DDA04E]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-[#DDA04E]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Rate Your Harvest Experience
              </h3>
              <p className="text-slate-500 text-sm mt-2">
                Help us improve by sharing your experience from the last harvest cycle.
              </p>
            </div>

            {/* Star Rating */}
            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-10 w-10 ${
                      star <= (hoverRating || rating)
                        ? "fill-[#DDA04E] text-[#DDA04E]"
                        : "text-slate-200"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>

            {rating > 0 && (
              <p className="text-center text-sm font-bold text-slate-600 mb-6">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent!"}
              </p>
            )}

            <Textarea
              placeholder="Share your thoughts about this harvest cycle... (optional)"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[120px] rounded-2xl border-slate-200 bg-slate-50 mb-6 resize-none"
            />

            <Button
              onClick={handleSubmitRating}
              disabled={rating === 0}
              className="w-full h-12 rounded-xl bg-[#DDA04E] hover:bg-[#c48b3d] text-slate-900 font-bold disabled:opacity-50"
            >
              Submit Feedback
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
