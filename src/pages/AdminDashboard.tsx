import React, { useState } from 'react';
import { Link } from 'react-router';
import { useData } from '../context/DataContext';
import { AdminBreadcrumbs } from '../components/admin/AdminBreadcrumbs';
import { 
  Users, Building2, IndianRupee, Clock, CheckCircle, Download, 
  Activity, TrendingUp, TrendingDown, ArrowUpRight, ShieldCheck, 
  CreditCard, Plus, ArrowRight, UserPlus, FileText, Bell, Sparkles
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import ExportReportModal from '../components/admin/ExportReportModal';

const revenueData = [
  { name: 'Jan', revenue: 45000, expenses: 12000 },
  { name: 'Feb', revenue: 55000, expenses: 15000 },
  { name: 'Mar', revenue: 68000, expenses: 18000 },
  { name: 'Apr', revenue: 85000, expenses: 22000 },
  { name: 'May', revenue: 95000, expenses: 25000 },
  { name: 'Jun', revenue: 110000, expenses: 28000 },
  { name: 'Jul', revenue: 135000, expenses: 32000 },
];

const subscriptionStats = [
  { name: 'Starter', users: 45, fill: '#3b82f6' },
  { name: 'Professional', users: 120, fill: '#8b5cf6' },
  { name: 'Enterprise', users: 35, fill: '#10b981' },
];

export default function AdminDashboard() {
  const { seekers, brands, subscriptions, verifySeeker, connectionRequests } = useData();
  const [timeRange, setTimeRange] = useState('7D');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  
  const pendingSeekers = seekers.filter(s => s.applicationStatus === 'PENDING_REVIEW' || s.applicationStatus === 'UNDER_REVIEW' || s.applicationStatus === 'pending' || (!s.verified && s.applicationStatus !== 'APPROVED' && s.applicationStatus !== 'approved' && s.applicationStatus !== 'REJECTED' && s.applicationStatus !== 'rejected'));
  const approvedSeekers = seekers.filter(s => s.applicationStatus === 'APPROVED' || s.applicationStatus === 'approved' || (s.verified && s.applicationStatus !== 'REJECTED' && s.applicationStatus !== 'rejected'));
  const rejectedSeekers = seekers.filter(s => s.applicationStatus === 'REJECTED' || s.applicationStatus === 'rejected');

  const pendingBrands = brands.filter(b => b.applicationStatus === 'PENDING_REVIEW' || b.applicationStatus === 'UNDER_REVIEW' || b.applicationStatus === 'pending' || (!b.verified && b.applicationStatus !== 'APPROVED' && b.applicationStatus !== 'approved' && b.applicationStatus !== 'REJECTED' && b.applicationStatus !== 'rejected'));
  const approvedBrands = brands.filter(b => b.applicationStatus === 'APPROVED' || b.applicationStatus === 'approved' || (b.verified && b.applicationStatus !== 'REJECTED' && b.applicationStatus !== 'rejected'));
  const rejectedBrands = brands.filter(b => b.applicationStatus === 'REJECTED' || b.applicationStatus === 'rejected');

  const totalRevenue = subscriptions.reduce((acc, sub) => acc + (sub.plan === 'PROFESSIONAL' ? 149999 : sub.plan === 'STARTER' ? 49999 : 249999), 0);
  const newRegistrations = seekers.length + brands.length;
  
  const stats = [
    { label: 'Total Revenue', value: `₹${(totalRevenue / 100000).toFixed(2)}L`, trend: '+18.5%', trendUp: true, icon: IndianRupee, color: 'emerald' },
    { label: 'Active Platform Users', value: (seekers.length + brands.length).toString(), trend: '+12.3%', trendUp: true, icon: Users, color: 'blue' },
    { label: 'Pending Verifications', value: (pendingSeekers.length + pendingBrands.length).toString(), trend: '-4.2%', trendUp: false, icon: Clock, color: 'amber' },
    { label: 'Total Registrations', value: newRegistrations.toString(), trend: '+24.5%', trendUp: true, icon: UserPlus, color: 'indigo' },
  ];

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0 relative z-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#172033] mb-2 font-heading tracking-tight">Enterprise Overview</h1>
          <p className="text-slate-500 font-medium">System performance, revenue, and platform management center.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white border border-[#E2EAF4] rounded-xl p-1 flex shadow-xs">
            {['1D', '7D', '30D', '1Y'].map(range => (
              <button 
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  timeRange === range 
                    ? 'bg-[#EAF2FF] text-blue-700' 
                    : 'text-slate-500 hover:text-[#172033]'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm cursor-pointer flex items-center gap-2 transition-all"
          >
            <Download size={14} /> Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-[#E2EAF4] shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex justify-between items-start relative z-10 mb-4">
              <div className="p-3 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl">
                <stat.icon size={20} className="text-blue-600" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.trendUp ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                {stat.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.trend}
              </div>
            </div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</h3>
            <p className="text-3xl font-black text-[#172033]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Brand & Seeker Verification Matrix Summary (Requirement 9) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Brand Applications Summary */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2EAF4] shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
                <Building2 size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-[#172033] text-base">Brand Applications System</h3>
                <p className="text-xs text-slate-500">Live status of brand registration & approval pipeline</p>
              </div>
            </div>
            <Link to="/admin/brands" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
              Manage Brands <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Total Brands</span>
              <span className="text-xl font-black text-slate-900">{brands.length}</span>
            </div>
            <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
              <span className="text-[10px] font-extrabold text-amber-800 uppercase block">Pending</span>
              <span className="text-xl font-black text-amber-700">{pendingBrands.length}</span>
            </div>
            <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200">
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase block">Approved</span>
              <span className="text-xl font-black text-emerald-700">{approvedBrands.length}</span>
            </div>
            <div className="bg-rose-50/70 p-3.5 rounded-xl border border-rose-200">
              <span className="text-[10px] font-extrabold text-rose-800 uppercase block">Rejected</span>
              <span className="text-xl font-black text-rose-700">{rejectedBrands.length}</span>
            </div>
          </div>
        </div>

        {/* Seeker Applications Summary */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2EAF4] shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100">
                <Users size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-[#172033] text-base">Seeker Applications System</h3>
                <p className="text-xs text-slate-500">Live status of investor registration & verification pipeline</p>
              </div>
            </div>
            <Link to="/admin/seekers" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
              Manage Seekers <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Total Seekers</span>
              <span className="text-xl font-black text-slate-900">{seekers.length}</span>
            </div>
            <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
              <span className="text-[10px] font-extrabold text-amber-800 uppercase block">Pending</span>
              <span className="text-xl font-black text-amber-700">{pendingSeekers.length}</span>
            </div>
            <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200">
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase block">Approved</span>
              <span className="text-xl font-black text-emerald-700">{approvedSeekers.length}</span>
            </div>
            <div className="bg-rose-50/70 p-3.5 rounded-xl border border-rose-200">
              <span className="text-[10px] font-extrabold text-rose-800 uppercase block">Rejected</span>
              <span className="text-xl font-black text-rose-700">{rejectedSeekers.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Graph */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2EAF4] shadow-xs lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-[#172033]">Revenue & Growth</h3>
              <p className="text-xs text-slate-500">Monthly recurring revenue (MRR) tracking</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-xs font-bold flex items-center gap-1">
              View Details <ArrowRight size={14} />
            </button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2EAF4" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `₹${value / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E2EAF4', color: '#172033', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  itemStyle={{ color: '#2563eb', fontSize: '12px', fontWeight: 'bold' }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2EAF4] shadow-xs flex flex-col">
          <h3 className="text-xl font-bold text-[#172033] mb-1">Quick Actions</h3>
          <p className="text-xs text-slate-500 mb-6">Frequently used management tools.</p>
          
          <div className="space-y-3 flex-1">
            <Link to="/admin/brands" className="flex items-center justify-between p-3.5 bg-[#F8FAFC] hover:bg-[#EAF2FF] border border-[#E2EAF4] rounded-xl transition-all group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white text-blue-600 rounded-lg shadow-xs group-hover:scale-105 transition-transform"><Plus size={16} /></div>
                <span className="font-bold text-[#172033] text-xs">Add New Brand</span>
              </div>
              <ArrowUpRight size={16} className="text-slate-400 group-hover:text-blue-600" />
            </Link>
            <Link to="/admin/seekers" className="flex items-center justify-between p-3.5 bg-[#F8FAFC] hover:bg-[#EAF2FF] border border-[#E2EAF4] rounded-xl transition-all group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white text-blue-600 rounded-lg shadow-xs group-hover:scale-105 transition-transform"><ShieldCheck size={16} /></div>
                <span className="font-bold text-[#172033] text-xs">Review Approvals</span>
              </div>
              <div className="flex items-center gap-2">
                {(pendingSeekers.length + pendingBrands.length) > 0 && (
                  <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full">{pendingSeekers.length + pendingBrands.length}</span>
                )}
                <ArrowUpRight size={16} className="text-slate-400 group-hover:text-blue-600" />
              </div>
            </Link>
            <Link to="/admin/communications" className="flex items-center justify-between p-3.5 bg-[#F8FAFC] hover:bg-[#EAF2FF] border border-[#E2EAF4] rounded-xl transition-all group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white text-blue-600 rounded-lg shadow-xs group-hover:scale-105 transition-transform"><Bell size={16} /></div>
                <span className="font-bold text-[#172033] text-xs">Broadcast Message</span>
              </div>
              <ArrowUpRight size={16} className="text-slate-400 group-hover:text-blue-600" />
            </Link>
            <Link to="/admin/cms" className="flex items-center justify-between p-3.5 bg-[#F8FAFC] hover:bg-[#EAF2FF] border border-[#E2EAF4] rounded-xl transition-all group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white text-blue-600 rounded-lg shadow-xs group-hover:scale-105 transition-transform"><FileText size={16} /></div>
                <span className="font-bold text-[#172033] text-xs">Edit Homepage</span>
              </div>
              <ArrowUpRight size={16} className="text-slate-400 group-hover:text-blue-600" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Connections Section */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2EAF4] shadow-xs flex flex-col h-[350px]">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <div>
              <h3 className="text-lg font-bold text-[#172033]">New Connections</h3>
              <p className="text-[11px] text-slate-500">Seeker ↔ Brand active matches</p>
            </div>
            <Link to="/admin/connections" className="text-blue-600 text-xs font-bold hover:underline">View All</Link>
          </div>
          
          <div className="space-y-2 flex-1 overflow-y-auto pr-1">
            {connectionRequests && connectionRequests.length > 0 ? (
              connectionRequests.slice(0, 3).map(conn => (
                <Link 
                  key={conn.id} 
                  to={`/admin/connections?id=${conn.id}`} 
                  className={`block p-3 rounded-xl border transition-all ${
                    !conn.readByOwner 
                      ? 'bg-[#F3F7FF] border-[#BFDBFE] hover:bg-[#EAF2FF]' 
                      : 'bg-[#F8FAFC] border-[#E2EAF4] hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-black text-blue-700 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-full">{conn.matchScore}% Match</span>
                    {!conn.readByOwner && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
                    )}
                  </div>
                  <h4 className="text-xs font-black text-[#172033] line-clamp-1">
                    {conn.brandName} ↔ {conn.seekerName}
                  </h4>
                  <div className="mt-1 flex justify-between items-center text-[9px] text-slate-400 font-bold">
                    <span>By: {conn.initiatorType === 'SEEKER' ? 'Seeker' : 'Brand'}</span>
                    <span>{conn.connectionDate || 'Today'}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-16 text-slate-400 text-xs font-semibold">
                No connections matching yet.
              </div>
            )}
          </div>
        </div>

        {/* Subscription Statistics */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2EAF4] shadow-xs flex flex-col h-[350px]">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <h3 className="text-lg font-bold text-[#172033]">Active Subscriptions</h3>
            <Link to="/admin/subscriptions" className="text-blue-600 text-xs font-bold hover:underline">Manage</Link>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subscriptionStats} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2EAF4" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E2EAF4', color: '#172033', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Bar dataKey="users" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2EAF4] shadow-xs flex flex-col h-[350px]">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <h3 className="text-lg font-bold text-[#172033]">Recent Transactions</h3>
            <Link to="/admin/payments" className="text-blue-600 text-xs font-bold hover:underline">View All</Link>
          </div>
          
          <div className="space-y-2 flex-1 overflow-y-auto pr-1">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2EAF4] hover:bg-[#EAF2FF] transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                    <CheckCircle size={14} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-[#172033]">Professional Plan</h4>
                    <p className="text-[9px] text-slate-500">Brand Name {i + 1}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-[#172033]">₹1,49,999</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <ExportReportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
      />
    </div>
  );
}
