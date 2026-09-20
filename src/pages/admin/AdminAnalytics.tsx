import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs';
import { 
  TrendingUp, Users, Building2, IndianRupee, Download, Calendar, 
  Target, Zap, ArrowUpRight, Filter, PieChart as PieIcon, Activity, Sparkles
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import UniversalExportModal from '../../components/admin/UniversalExportModal';
import { ExportField } from '../../lib/exportService';

const analyticsFields: ExportField[] = [
  { label: 'Month', key: 'month' },
  { label: 'Seekers Registered', key: 'seekers' },
  { label: 'Brands Registered', key: 'brands' },
  { label: 'Revenue (₹)', key: 'revenue', transform: (val: any) => `₹${val.toLocaleString()}` },
  { label: 'Conversion Rate', key: 'conversion', transform: (val: any) => `${val}%` },
];

const monthlyGrowthData = [
  { month: 'Jan', seekers: 450, brands: 42, revenue: 125000, conversion: 14.2 },
  { month: 'Feb', seekers: 580, brands: 55, revenue: 180000, conversion: 16.5 },
  { month: 'Mar', seekers: 720, brands: 68, revenue: 240000, conversion: 18.1 },
  { month: 'Apr', seekers: 910, brands: 82, revenue: 310000, conversion: 19.8 },
  { month: 'May', seekers: 1150, brands: 95, revenue: 420000, conversion: 22.4 },
  { month: 'Jun', seekers: 1420, brands: 112, revenue: 580000, conversion: 25.1 },
  { month: 'Jul', seekers: 1890, brands: 140, revenue: 790000, conversion: 28.6 },
];

const categoryDistribution = [
  { name: 'Food & Beverage', value: 38, color: '#4f46e5' },
  { name: 'Education & EdTech', value: 24, color: '#2563eb' },
  { name: 'Retail & Fashion', value: 18, color: '#10b981' },
  { name: 'Health & Wellness', value: 12, color: '#f59e0b' },
  { name: 'Automotive & Services', value: 8, color: '#6366f1' },
];

const regionDistribution = [
  { name: 'Tier 1 Metro (Mumbai, Delhi, Blr)', value: 45 },
  { name: 'Tier 2 Emerging (Pune, Jaipur, Surat)', value: 35 },
  { name: 'Tier 3 & Regional Markets', value: 20 },
];

export default function AdminAnalytics() {
  const { seekers, brands, subscriptions } = useData();
  const [timeRange, setTimeRange] = useState<'30D' | '90D' | '1Y' | 'ALL'>('30D');
  const [isExportOpen, setIsExportOpen] = useState(false);

  const totalRev = subscriptions.reduce((acc, sub) => {
    return acc + (sub.plan === 'ENTERPRISE' ? 249999 : sub.plan === 'PROFESSIONAL' ? 149999 : 49999);
  }, 0);

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto space-y-8">
      <AdminBreadcrumbs items={[{ label: 'Super Admin', path: '/admin' }, { label: 'Platform Analytics' }]} />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-blue-50 border border-blue-100 text-indigo-700 font-bold text-[10px] uppercase rounded-full flex items-center gap-1">
              <Sparkles size={12} /> Executive Telemetry
            </span>
          </div>
          <h1 className="text-3xl font-black text-indigo-950 font-heading">Business Analytics & Metrics</h1>
          <p className="text-slate-600 text-sm mt-1">Real-time marketplace velocity, conversion metrics, and revenue attribution.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-xl p-1 flex items-center text-xs font-bold text-slate-600 shadow-xs">
            {(['30D', '90D', '1Y', 'ALL'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg transition-all ${timeRange === range ? 'bg-blue-700 text-white shadow-xs' : 'hover:bg-slate-50'}`}
              >
                {range}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setIsExportOpen(true)}
            className="px-4 py-2 bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-800 transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Download size={14} /> Export Report
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly Recurring Revenue</span>
            <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <IndianRupee size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-indigo-950">₹{(totalRev / 100000).toFixed(2)}L</div>
          <div className="flex items-center gap-2 mt-2 text-xs font-bold text-emerald-600">
            <ArrowUpRight size={14} /> +24.8% vs last month
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lead-to-Meeting Conversion</span>
            <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Target size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-indigo-950">28.6%</div>
          <div className="flex items-center gap-2 mt-2 text-xs font-bold text-emerald-600">
            <ArrowUpRight size={14} /> +4.2% optimized by AI Match
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Seekers Capacity</span>
            <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-indigo-950">{seekers.length}</div>
          <div className="flex items-center gap-2 mt-2 text-xs font-bold text-blue-600">
            <Activity size={14} /> 94% Verified Profiles
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Onboarded Franchise Brands</span>
            <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Building2 size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-indigo-950">{brands.length}</div>
          <div className="flex items-center gap-2 mt-2 text-xs font-bold text-emerald-600">
            <ArrowUpRight size={14} /> 12 Pending Review
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue & Growth Trend */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-indigo-950 font-heading">Marketplace Growth & Revenue</h3>
              <p className="text-xs text-slate-500 font-medium">Monthly trajectory of seekers vs brand acquisitions.</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <div className="flex items-center gap-1.5 text-blue-600">
                <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span> Seekers
              </div>
              <div className="flex items-center gap-1.5 text-blue-500">
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span> Brands
              </div>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSeekerG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBrandG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1e1b4b' }}
                />
                <Area type="monotone" dataKey="seekers" name="Seekers" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorSeekerG)" />
                <Area type="monotone" dataKey="brands" name="Brands" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorBrandG)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Industry Breakdown Pie Chart */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-black text-indigo-950 font-heading mb-1">Sector Share</h3>
            <p className="text-xs text-slate-500 font-medium mb-6">Distribution of registered franchise brands by industry.</p>

            <div className="h-52 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-indigo-950">{brands.length}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Brands</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 mt-4">
            {categoryDistribution.map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                  <span className="text-slate-700">{cat.name}</span>
                </div>
                <span className="font-extrabold text-indigo-950">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Row: Regional Density & Conversion Funnel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-black text-indigo-950 font-heading mb-1">Regional Market Density</h3>
          <p className="text-xs text-slate-500 font-medium mb-6">Geographic concentration of verified seekers across India.</p>

          <div className="space-y-4">
            {regionDistribution.map((reg, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">{reg.name}</span>
                  <span className="text-blue-700">{reg.value}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${reg.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-black text-indigo-950 font-heading mb-1">Conversion Funnel Velocity</h3>
            <p className="text-xs text-slate-500 font-medium mb-4">Stage transition speed for franchise inquiries.</p>

            <div className="space-y-3">
              {[
                { stage: '1. Inquiries & Registrations', count: '1,890', rate: '100%', color: 'bg-blue-600' },
                { stage: '2. Profile Verification', count: '1,720', rate: '91%', color: 'bg-blue-500' },
                { stage: '3. Brand Smart Matches', count: '1,240', rate: '65%', color: 'bg-blue-500' },
                { stage: '4. Meeting Scheduled', count: '540', rate: '28.6%', color: 'bg-emerald-600' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-8 rounded-full ${item.color}`}></span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{item.stage}</div>
                      <div className="text-[10px] text-slate-500">{item.count} Participants</div>
                    </div>
                  </div>
                  <span className="text-xs font-black text-indigo-950 bg-white px-3 py-1 rounded-xl shadow-xs border border-slate-200">
                    {item.rate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <UniversalExportModal 
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title="Business Analytics & Metrics"
        filenamePrefix="Executive-Telemetry"
        currentData={monthlyGrowthData}
        allData={monthlyGrowthData}
        fields={analyticsFields}
      />
    </div>
  );
}
