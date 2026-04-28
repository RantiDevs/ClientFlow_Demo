import { useState } from "react";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Mail, 
  Smartphone, 
  Lock, 
  Camera,
  Check
} from "lucide-react";
import { useTheme } from "../../lib/theme";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface SettingsUser {
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  role?: string;
}

interface SettingsProps {
  currentUser?: SettingsUser | null;
  role?: string;
}

function getRoleLabel(role?: string) {
  switch (role) {
    case "investor": return "Real Estate Investor";
    case "tenant": return "Tenant";
    case "admin": return "Administrator";
    case "verdafarms": return "Verda Farms Member";
    default: return "Account Holder";
  }
}

function getInitials(name?: string) {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0][0].toUpperCase();
}

export function Settings({ currentUser, role }: SettingsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { theme, setTheme } = useTheme();

  const nameParts = (currentUser?.name || "").trim().split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="bg-white p-1 rounded-full border border-slate-100 shadow-sm h-auto inline-flex">
          {[
            { id: "profile", label: "Profile", icon: User },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "security", label: "Security", icon: Shield },
            { id: "appearance", label: "Appearance", icon: Palette },
          ].map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className="rounded-full px-6 py-3 text-sm font-medium data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-lg hover:text-slate-900 text-slate-500 gap-2 transition-all"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="md:col-span-1">
              <Card className="rounded-[24px] border-slate-100 shadow-sm overflow-hidden">
                <div className="h-32 bg-slate-900 relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#DDA04E] rounded-full blur-3xl opacity-20 -mt-8 -mr-8"></div>
                </div>
                <div className="px-6 pb-6 text-center -mt-12 relative">
                  <div className="relative inline-block">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-lg mx-auto">
                      <AvatarImage src={currentUser?.avatar} />
                      <AvatarFallback>{getInitials(currentUser?.name)}</AvatarFallback>
                    </Avatar>
                    <Button size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-[#DDA04E] hover:bg-[#c48b3d] border-2 border-white text-white">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-4">{currentUser?.name || "—"}</h3>
                  <p className="text-slate-500 text-sm">{getRoleLabel(role)}</p>
                  <div className="mt-6 flex justify-center gap-2">
                    <Button variant="outline" className="rounded-full border-slate-200">Remove</Button>
                    <Button className="rounded-full bg-slate-900 text-white hover:bg-slate-800">Change Photo</Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Profile Form */}
            <div className="md:col-span-2">
              <Card className="rounded-[24px] border-slate-100 shadow-sm">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and public profile.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue={firstName} className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue={lastName} className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input id="email" defaultValue={currentUser?.email || ""} className="pl-10 rounded-xl border-slate-200 bg-slate-50 focus:bg-white" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input id="phone" defaultValue={currentUser?.phone || ""} placeholder="Add phone number" className="pl-10 rounded-xl border-slate-200 bg-slate-50 focus:bg-white" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea 
                      id="bio" 
                      className="flex min-h-[120px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DDA04E] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus:bg-white transition-all"
                      placeholder="Tell us a little about yourself"
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button className="bg-slate-900 text-white rounded-xl hover:bg-slate-800">Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="rounded-[24px] border-slate-100 shadow-sm">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified about activity.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Email Notifications</h3>
                <div className="space-y-4">
                  {[
                    { title: "Monthly Reports", desc: "Receive monthly financial performance reports.", default: true },
                    { title: "New Documents", desc: "Get notified when new documents are uploaded.", default: true },
                    { title: "Maintenance Updates", desc: "Alerts about maintenance request status changes.", default: true },
                    { title: "Marketing News", desc: "Receive news about ClientFlow features and updates.", default: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                      <div className="space-y-0.5">
                        <Label className="text-base font-semibold text-slate-900">{item.title}</Label>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                      </div>
                      <Switch defaultChecked={item.default} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Push Notifications</h3>
                <div className="space-y-4">
                  {[
                    { title: "Direct Messages", desc: "Receive messages from tenants or property managers.", default: true },
                    { title: "Payment Alerts", desc: "Get notified when rent payments are received.", default: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                      <div className="space-y-0.5">
                        <Label className="text-base font-semibold text-slate-900">{item.title}</Label>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                      </div>
                      <Switch defaultChecked={item.default} />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="rounded-[24px] border-slate-100 shadow-sm">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and security preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current">Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input id="current" type={showPassword ? "text" : "password"} className="pl-10 rounded-xl border-slate-200 bg-slate-50 focus:bg-white" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input id="new" type={showPassword ? "text" : "password"} className="pl-10 rounded-xl border-slate-200 bg-slate-50 focus:bg-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input id="confirm" type={showPassword ? "text" : "password"} className="pl-10 rounded-xl border-slate-200 bg-slate-50 focus:bg-white" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="show-password" onCheckedChange={setShowPassword} />
                  <Label htmlFor="show-password">Show Password</Label>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                 <Button className="bg-slate-900 text-white rounded-xl hover:bg-slate-800">Update Password</Button>
              </div>

              <div className="border-t border-slate-100 pt-6 mt-6">
                <h3 className="text-base font-bold text-red-600 mb-2">Danger Zone</h3>
                <p className="text-sm text-slate-500 mb-4">Permanently delete your account and all of your content.</p>
                <Button variant="destructive" className="rounded-xl">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="rounded-[24px] border-slate-100 shadow-sm">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-3 gap-6">
                {/* Light */}
                <button
                  onClick={() => setTheme("light")}
                  className={`space-y-3 text-left group transition-all`}
                >
                  <div className={`h-32 rounded-xl border-2 relative overflow-hidden shadow-sm transition-all ${theme === "light" ? "border-[#DDA04E] shadow-lg" : "border-slate-200 hover:border-slate-300"}`}>
                    <div className="absolute inset-0 bg-[#F2F4F7]">
                      <div className="absolute inset-2 bg-white rounded-lg flex flex-col overflow-hidden">
                        <div className="h-3 bg-slate-200"></div>
                        <div className="flex-1 flex gap-1.5 p-1.5">
                          <div className="w-7 bg-slate-100 rounded"></div>
                          <div className="flex-1 bg-slate-50 rounded"></div>
                        </div>
                      </div>
                    </div>
                    {theme === "light" && (
                      <div className="absolute bottom-2 right-2 h-5 w-5 bg-[#DDA04E] rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <p className={`text-sm font-semibold text-center ${theme === "light" ? "text-slate-900" : "text-slate-500"}`}>Light</p>
                </button>

                {/* Dark */}
                <button
                  onClick={() => setTheme("dark")}
                  className={`space-y-3 text-left group transition-all`}
                >
                  <div className={`h-32 rounded-xl border-2 relative overflow-hidden shadow-sm transition-all ${theme === "dark" ? "border-[#DDA04E] shadow-lg" : "border-slate-700 hover:border-slate-500"}`}>
                    <div className="absolute inset-0 bg-[#0d1117]">
                      <div className="absolute inset-2 bg-[#161b27] rounded-lg flex flex-col overflow-hidden">
                        <div className="h-3 bg-[#21283b]"></div>
                        <div className="flex-1 flex gap-1.5 p-1.5">
                          <div className="w-7 bg-[#1c2333] rounded"></div>
                          <div className="flex-1 bg-[#1c2333]/50 rounded"></div>
                        </div>
                      </div>
                    </div>
                    {theme === "dark" && (
                      <div className="absolute bottom-2 right-2 h-5 w-5 bg-[#DDA04E] rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <p className={`text-sm font-semibold text-center ${theme === "dark" ? "text-slate-900" : "text-slate-500"}`}>Dark</p>
                </button>

                {/* System */}
                <button
                  onClick={() => setTheme("system")}
                  className={`space-y-3 text-left group transition-all`}
                >
                  <div className={`h-32 rounded-xl border-2 relative overflow-hidden shadow-sm transition-all ${theme === "system" ? "border-[#DDA04E] shadow-lg" : "border-slate-200 hover:border-slate-300"}`}>
                    <div className="absolute inset-0 flex">
                      <div className="flex-1 bg-white"></div>
                      <div className="flex-1 bg-[#0d1117]"></div>
                    </div>
                    <div className="absolute inset-2 rounded-lg overflow-hidden flex">
                      <div className="flex-1 bg-slate-50 flex flex-col">
                        <div className="h-3 bg-slate-200"></div>
                      </div>
                      <div className="flex-1 bg-[#161b27] flex flex-col">
                        <div className="h-3 bg-[#21283b]"></div>
                      </div>
                    </div>
                    {theme === "system" && (
                      <div className="absolute bottom-2 right-2 h-5 w-5 bg-[#DDA04E] rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <p className={`text-sm font-semibold text-center ${theme === "system" ? "text-slate-900" : "text-slate-500"}`}>System</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
