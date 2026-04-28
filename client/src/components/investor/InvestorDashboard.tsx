import { Button } from "../ui/button";
import { ArrowUpRight, ArrowDownLeft, Building2, Wallet, ArrowRight, MoreHorizontal, FileText, PieChart, CreditCard } from "lucide-react";
import { FINANCIALS, NGN, NGN_SHORT } from "../../lib/data";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from "react";
import { TransferModal } from "./TransferModal";

interface Transaction {
  id: string;
  title: string;
  type: string;
  amount: string;
  status: string;
  date: string;
}

interface InvestorDashboardProps {
  onNavigate: (page: string) => void;
  balance: number;
  activities: Transaction[];
  onTransfer: (amount: number, recipient: string) => void;
}

export function InvestorDashboard({ onNavigate: _onNavigate, balance, activities, onTransfer }: InvestorDashboardProps) {
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

      {/* Left Main Column */}
      <div className="lg:col-span-8 space-y-8">

        {/* Hero / Wallet Section */}
        <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-[#2A1A4A]/8 relative overflow-hidden">
           <div className="flex flex-wrap justify-between items-end gap-6 relative z-10">
              <div className="min-w-fit">
                 <p className="text-[#6B5E7A] font-medium mb-1">Total Balance</p>
                 <h2 className="text-4xl sm:text-5xl font-bold text-ink tracking-tight">
                    {NGN(balance)}
                 </h2>
                 <div className="flex items-center mt-3 bg-naija/10 w-fit px-3 py-1 rounded-full text-naija font-bold text-sm">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    +5.2% vs. last month
                 </div>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                 <Button
                    onClick={() => setIsTransferModalOpen(true)}
                    className="h-12 px-6 sm:px-8 rounded-full bg-brand text-white hover:bg-brand-soft shadow-brand"
                 >
                    <ArrowUpRight className="mr-2 h-4 w-4" /> Transfer
                 </Button>
                 <Button variant="outline" className="h-12 px-6 sm:px-8 rounded-full border-[#2A1A4A]/15 text-ink hover:bg-cream">
                    <ArrowDownLeft className="mr-2 h-4 w-4" /> Request
                 </Button>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
              {[
                { label: "NGN", amount: NGN(balance),       icon: "₦", active: true },
                { label: "USD", amount: "$31,250.00",       icon: "$", active: false },
                { label: "GBP", amount: "£24,180.00",       icon: "£", active: false },
              ].map((wallet) => (
                <div key={wallet.label} className={`p-5 rounded-[24px] border transition-all cursor-pointer ${wallet.active ? 'bg-brand text-white border-brand shadow-brand' : 'bg-white text-[#6B5E7A] border-[#2A1A4A]/8 hover:border-coral'}`}>
                   <div className="flex justify-between items-start mb-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg ${wallet.active ? 'bg-coral text-white' : 'bg-cream text-brand'}`}>
                         {wallet.icon}
                      </div>
                      <MoreHorizontal className="h-5 w-5 opacity-50" />
                   </div>
                   <div className="space-y-1">
                      <p className={`text-xs font-semibold uppercase tracking-wider ${wallet.active ? 'text-gold' : 'text-[#998BB0]'}`}>{wallet.label} Wallet</p>
                      <p className={`text-lg font-bold ${wallet.active ? 'text-white' : 'text-ink'}`}>{wallet.amount}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           <div className="bg-coral rounded-[28px] p-6 text-white shadow-coral relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4">
                 <Wallet className="h-5 w-5 text-white" />
              </div>
              <p className="text-white/80 font-medium text-sm">Monthly Earnings</p>
              <h3 className="text-2xl font-bold mt-1">{NGN_SHORT(15_200_000)}</h3>
              <p className="text-xs mt-2 bg-white/20 w-fit px-2 py-0.5 rounded-lg">+7.2% this month</p>
           </div>

           <div className="bg-white rounded-[28px] p-6 text-ink shadow-sm border border-[#2A1A4A]/8 group hover:border-coral/40 transition-colors">
              <div className="h-10 w-10 bg-cream rounded-xl flex items-center justify-center mb-4 text-brand group-hover:bg-coral-soft group-hover:text-coral transition-colors">
                 <CreditCard className="h-5 w-5" />
              </div>
              <p className="text-[#6B5E7A] font-medium text-sm">Monthly Spending</p>
              <h3 className="text-2xl font-bold mt-1">{NGN_SHORT(4_300_000)}</h3>
              <p className="text-xs mt-2 text-coral bg-coral-soft w-fit px-2 py-0.5 rounded-lg flex items-center"><ArrowUpRight className="h-3 w-3 mr-1 rotate-180" /> 5%</p>
           </div>

           <div className="bg-white rounded-[28px] p-6 text-ink shadow-sm border border-[#2A1A4A]/8 group hover:border-coral/40 transition-colors">
              <div className="h-10 w-10 bg-cream rounded-xl flex items-center justify-center mb-4 text-brand group-hover:bg-coral-soft group-hover:text-coral transition-colors">
                 <Building2 className="h-5 w-5" />
              </div>
              <p className="text-[#6B5E7A] font-medium text-sm">Properties</p>
              <h3 className="text-2xl font-bold mt-1">4</h3>
              <p className="text-xs mt-2 text-naija bg-naija/10 w-fit px-2 py-0.5 rounded-lg flex items-center"><ArrowUpRight className="h-3 w-3 mr-1" /> 8%</p>
           </div>

           <div className="bg-white rounded-[28px] p-6 text-ink shadow-sm border border-[#2A1A4A]/8 group hover:border-coral/40 transition-colors">
              <div className="h-10 w-10 bg-cream rounded-xl flex items-center justify-center mb-4 text-brand group-hover:bg-coral-soft group-hover:text-coral transition-colors">
                 <FileText className="h-5 w-5" />
              </div>
              <p className="text-[#6B5E7A] font-medium text-sm">Documents</p>
              <h3 className="text-2xl font-bold mt-1">12</h3>
              <p className="text-xs mt-2 text-[#998BB0] bg-cream w-fit px-2 py-0.5 rounded-lg">All up to date</p>
           </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-[#2A1A4A]/8">
           <div className="flex justify-between items-center mb-8">
              <div>
                 <h3 className="text-xl font-bold text-ink">Profit and Loss</h3>
                 <p className="text-[#6B5E7A] text-sm">Income vs. expenses across your portfolio (NGN)</p>
              </div>
              <div className="flex items-center space-x-4">
                 <div className="flex items-center text-sm font-medium text-[#6B5E7A]">
                    <span className="h-3 w-3 rounded-full bg-coral mr-2"></span> Income
                 </div>
                 <div className="flex items-center text-sm font-medium text-[#6B5E7A]">
                    <span className="h-3 w-3 rounded-full bg-brand mr-2"></span> Expense
                 </div>
              </div>
           </div>

           <div className="h-[300px] w-full min-w-0 relative">
              <ResponsiveContainer width="100%" height={300} minWidth={0}>
                <BarChart data={FINANCIALS} barSize={20}>
                  <XAxis
                    dataKey="month"
                    stroke="#998BB0"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ backgroundColor: '#2A1A4A', borderRadius: '12px', border: 'none', color: 'white' }}
                    formatter={(value: number) => NGN(value)}
                  />
                  <Bar dataKey="income" stackId="a" fill="#FF5C7A" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="expense" stackId="a" fill="#2A1A4A" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Recent Activities List */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-[#2A1A4A]/8">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-ink">Recent Activities</h3>
              <Button variant="ghost" className="text-[#6B5E7A]">Filter</Button>
           </div>

           <div className="space-y-1">
              {activities.map((item) => (
                 <div key={item.id} className="grid grid-cols-12 items-center p-4 hover:bg-cream rounded-2xl transition-colors cursor-pointer group">
                    <div className="col-span-1">
                       <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${item.type === 'Income' ? 'bg-naija/10 text-naija' : 'bg-coral-soft text-coral'}`}>
                          {item.type === 'Income' ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
                       </div>
                    </div>
                    <div className="col-span-4 pl-4">
                       <p className="font-bold text-ink">{item.title}</p>
                       <p className="text-xs text-[#998BB0]">{item.id}</p>
                    </div>
                    <div className="col-span-2 text-sm font-semibold text-ink">{item.amount}</div>
                    <div className="col-span-2">
                       <span className={`flex items-center text-xs font-bold ${item.status === 'Completed' ? 'text-naija' : 'text-coral'}`}>
                          <span className={`h-2 w-2 rounded-full mr-2 ${item.status === 'Completed' ? 'bg-naija' : 'bg-coral'}`}></span>
                          {item.status}
                       </span>
                    </div>
                    <div className="col-span-3 text-right text-sm text-[#998BB0] group-hover:text-[#6B5E7A]">
                       {item.date}
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>

      {/* Right Sidebar Column */}
      <div className="lg:col-span-4 space-y-8">

        {/* Statistics Card */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-[#2A1A4A]/8 h-fit">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-ink">Statistics</h3>
              <select className="bg-cream border-none text-xs font-bold text-[#6B5E7A] rounded-lg py-1 px-2 outline-none">
                 <option>This Month</option>
              </select>
           </div>

           <div className="relative h-64 w-full flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="h-48 w-48 transform -rotate-90">
                 <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F1ECE3" strokeWidth="12" />
                 <circle cx="50" cy="50" r="40" fill="transparent" stroke="#2A1A4A" strokeWidth="12" strokeDasharray="180 251" strokeLinecap="round" />
                 <circle cx="50" cy="50" r="40" fill="transparent" stroke="#FF5C7A" strokeWidth="12" strokeDasharray="70 251" strokeDashoffset="-180" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-[#998BB0] text-xs font-medium uppercase tracking-wider">Total</span>
                 <span className="text-2xl font-bold text-ink">{NGN_SHORT(14_810_000)}</span>
              </div>
           </div>

           <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-cream hover:bg-white hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-[#2A1A4A]/8">
                 <div className="flex items-center">
                    <div className="h-10 w-10 bg-brand/10 rounded-full flex items-center justify-center text-brand">
                       <Building2 className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                       <p className="text-sm font-bold text-ink">Rental Income</p>
                       <p className="text-xs text-[#6B5E7A]">65% of total</p>
                    </div>
                 </div>
                 <span className="font-bold text-ink">{NGN_SHORT(9_560_000)}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-cream hover:bg-white hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-[#2A1A4A]/8">
                 <div className="flex items-center">
                    <div className="h-10 w-10 bg-coral/15 rounded-full flex items-center justify-center text-coral">
                       <PieChart className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                       <p className="text-sm font-bold text-ink">Investments</p>
                       <p className="text-xs text-[#6B5E7A]">35% of total</p>
                    </div>
                 </div>
                 <span className="font-bold text-ink">{NGN_SHORT(5_250_000)}</span>
              </div>
           </div>
        </div>

        {/* Quick Transfer / Contacts */}
        <div className="bg-brand-deep rounded-[32px] p-8 shadow-brand text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-coral rounded-full blur-3xl opacity-30"></div>

           <h3 className="text-lg font-bold mb-6 relative z-10">Quick Transfer</h3>
           <div className="flex space-x-2 overflow-x-auto pb-4 relative z-10">
              {[1,2,3,4,5].map((i) => (
                 <div key={i} className="flex-shrink-0 flex flex-col items-center space-y-2">
                    <div className="h-14 w-14 rounded-full border-2 border-white/15 p-1 hover:border-coral cursor-pointer transition-colors">
                       <img src={`https://i.pravatar.cc/150?u=ng${i}`} className="h-full w-full rounded-full object-cover" alt="" />
                    </div>
                    <span className="text-xs text-white/60">{["Tunde","Adaeze","Ngozi","Bayo","Halima"][i-1]}</span>
                 </div>
              ))}
              <div className="flex-shrink-0 flex flex-col items-center space-y-2">
                 <div className="h-14 w-14 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center hover:bg-white/5 cursor-pointer">
                    <ArrowRight className="h-6 w-6 text-white/60" />
                 </div>
                 <span className="text-xs text-white/60">Add</span>
              </div>
           </div>

           <div className="mt-4 relative z-10">
              <div className="flex items-center bg-white/10 rounded-2xl p-2 mb-4">
                 <span className="text-gold px-3 font-bold">₦</span>
                 <input type="text" defaultValue="1,250,000" className="bg-transparent border-none text-white font-bold w-full outline-none" />
              </div>
              <Button className="w-full bg-coral hover:bg-coral/90 text-white font-bold h-12 rounded-xl shadow-coral">
                 Send Money
              </Button>
           </div>
        </div>

      </div>

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onTransfer={onTransfer}
        currentBalance={balance}
      />
    </div>
  );
}
