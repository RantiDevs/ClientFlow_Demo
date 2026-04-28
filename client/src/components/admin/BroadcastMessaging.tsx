import { useState } from "react";
import { BROADCASTS } from "../../lib/data";
import { Megaphone, Send, MessageCircle, Mail, Users } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

export function BroadcastMessaging() {
  const [channel, setChannel] = useState<"WhatsApp" | "Email" | "In-app">("WhatsApp");
  const [audience, setAudience] = useState<"Tenants" | "Investors" | "Hot Leads" | "Everyone">("Tenants");
  const [message, setMessage] = useState("");

  const send = () => {
    if (!message.trim()) return toast.error("Type a message first");
    toast.success(`Broadcast queued to ${audience} via ${channel}`);
    setMessage("");
  };

  const channels = [
    { key: "WhatsApp" as const, icon: MessageCircle, color: "bg-naija" },
    { key: "Email" as const, icon: Mail, color: "bg-brand" },
    { key: "In-app" as const, icon: Megaphone, color: "bg-coral" },
  ];

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">Broadcast Messaging</h1>
        <p className="text-[#6B5E7A] mt-1">Reach 132 tenants and 48 investors in seconds — WhatsApp, email or in-app.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Compose */}
        <div className="bg-white rounded-3xl p-6 border border-[#2A1A4A]/8">
          <h3 className="font-bold text-ink mb-4">Compose new broadcast</h3>

          <p className="text-xs uppercase tracking-wider font-bold text-[#6B5E7A] mb-2">Channel</p>
          <div className="grid grid-cols-3 gap-2 mb-5">
            {channels.map((c) => (
              <button
                key={c.key}
                onClick={() => setChannel(c.key)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all ${
                  channel === c.key ? `${c.color} text-white border-transparent shadow-md` : "bg-cream border-transparent text-[#6B5E7A] hover:border-brand"
                }`}
              >
                <c.icon className="h-5 w-5" />
                <span className="text-xs font-bold">{c.key}</span>
              </button>
            ))}
          </div>

          <p className="text-xs uppercase tracking-wider font-bold text-[#6B5E7A] mb-2">Audience</p>
          <div className="grid grid-cols-2 gap-2 mb-5">
            {(["Tenants", "Investors", "Hot Leads", "Everyone"] as const).map((a) => (
              <button
                key={a}
                onClick={() => setAudience(a)}
                className={`p-3 rounded-2xl border-2 transition-all text-sm font-semibold ${
                  audience === a ? "bg-brand text-white border-transparent" : "bg-cream border-transparent text-[#6B5E7A] hover:border-brand"
                }`}
              >
                {a}
              </button>
            ))}
          </div>

          <p className="text-xs uppercase tracking-wider font-bold text-[#6B5E7A] mb-2">Message</p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Hi {{name}}, your service charge for May 2026 is now due. Pay easily via Paystack inside your portal. — Rantidevs"
            className="w-full min-h-[140px] p-4 rounded-2xl border-2 border-[#2A1A4A]/10 focus:border-coral focus:outline-none text-sm resize-none bg-cream"
          />
          <p className="text-[11px] text-[#998BB0] mt-1.5">Supports {`{{name}}`}, {`{{property}}`}, {`{{amount}}`} merge tags</p>

          <Button onClick={send} className="w-full mt-5 bg-coral text-white hover:bg-coral/90 rounded-xl shadow-coral h-11">
            <Send className="h-4 w-4 mr-2" /> Send broadcast to {audience}
          </Button>
        </div>

        {/* History */}
        <div className="space-y-3">
          <h3 className="font-bold text-ink">Recent broadcasts</h3>
          {BROADCASTS.map((b) => (
            <div key={b.id} className="bg-white rounded-3xl p-5 border border-[#2A1A4A]/8 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <p className="font-bold text-ink text-sm">{b.title}</p>
                <span className="text-[10px] px-2 py-1 rounded-full bg-cream text-[#6B5E7A] font-bold whitespace-nowrap">{b.channel}</span>
              </div>
              <p className="text-xs text-[#6B5E7A] mb-3 flex items-center gap-1.5"><Users className="h-3 w-3" /> {b.recipients}</p>
              <div className="flex items-center justify-between pt-3 border-t border-[#2A1A4A]/5">
                <p className="text-[11px] text-[#998BB0]">Sent {b.sent}</p>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-20 bg-cream rounded-full overflow-hidden">
                    <div className="h-full bg-naija rounded-full" style={{ width: `${b.openRate}%` }} />
                  </div>
                  <span className="text-xs font-bold text-naija">{b.openRate}% open</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
