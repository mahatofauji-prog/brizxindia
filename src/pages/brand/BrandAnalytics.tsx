import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  Users, Target, Clock, Sparkles, MapPin, 
  CheckCircle2, ArrowUpRight, ArrowDownRight, BarChart3, 
  PieChart as PieIcon, Calendar, Download, RefreshCw, 
  TrendingUp, ShieldCheck, Phone, Mail, ExternalLink, 
  AlertCircle, ChevronRight, Zap, Check, Eye
} from 'lucide-react';
import { 
  computeBrandAnalytics, 
  AnalyticsDateFilter, 
  BrandAnalyticsData 
} from '../../utils/analyticsEngine';

export default function BrandAnalytics() {
  const { user } = useAuth();
  const { seekers, brands, meetings, leadStages, analyticsEvents } = useData();

  // Current authenticated brand
  const currentBrand = brands.find(b => b.id === user?.id || (user?.email && b.email === user?.email));
  if (!currentBrand) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Complete your Brand Profile</h2>
        <p className="text-slate-500">Please set up your brand profile to access this page.</p>
      </div>
    );
  }

  // Date Filter State
  const [filterType, setFilterType] = useState<'7D' | '30D' | '90D' | 'ALL' | 'CUSTOM'>('30D');
  const [customStartDate, setCustomStartDate] = useState<string>(
    new Date(Date.now() - 86400000 * 30).toISOString().split('T')[0]
  );
  const [customEndDate, setCustomEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Active Tab for Analytics Views
  const [activeView, setActiveView] = useState<'OVERVIEW' | 'FUNNEL' | 'GEOGRAPHY' | 'LEADS_LOG'>('OVERVIEW');

  // Compute date filter object
  const activeDateFilter = useMemo<AnalyticsDateFilter>(() => {
    const now = new Date();
    let startDate = new Date();

    if (filterType === '7D') {
      startDate = new Date(now.getTime() - 86400000 * 7);
    } else if (filterType === '30D') {
      startDate = new Date(now.getTime() - 86400000 * 30);
    } else if (filterType === '90D') {
      startDate = new Date(now.getTime() - 86400000 * 90);
    } else if (filterType === 'ALL') {
      startDate = new Date(now.getTime() - 86400000 * 365); // Past 1 year
    } else if (filterType === 'CUSTOM') {
      startDate = new Date(customStartDate);
      now.setTime(new Date(customEndDate).getTime());
    }

    return {
      type: filterType,
      startDate,
      endDate: now
    };
  }, [filterType, customStartDate, customEndDate]);

  // Compute analytics dynamically from real data
  const data: BrandAnalyticsData = useMemo(() => {
    return computeBrandAnalytics(
      analyticsEvents,
      currentBrand,
      seekers,
      meetings,
      leadStages,
      activeDateFilter
    );
  }, [analyticsEvents, currentBrand, seekers, meetings, leadStages, activeDateFilter]);

  // Export Analytics CSV
  const handleExportCSV = () => {
    const headers = ['Metric', 'Value', 'Context'];
    const rows = [
      ['Brand Name', currentBrand.brandName, 'Active Brand'],
      ['Date Range', `${activeDateFilter.startDate.toLocaleDateString()} to ${activeDateFilter.endDate.toLocaleDateString()}`, filterType],
      ['Total Leads Unlocked', String(data.totalLeadsUnlocked), `${data.unlocksGrowthPct}% vs prior period`],
      ['Meeting Conversion Rate', `${data.meetingConversionRate}%`, `${data.totalMeetingsScheduled} meetings scheduled`],
      ['Average Smart Match Score', `${data.avgSmartMatchScore}%`, '100-point algorithm fit'],
      ['Avg Time to First Contact', data.avgTimeToFirstContactText, data.timeToContactStatus],
      ['Profile Views', String(data.totalProfileViews), 'Candidate views'],
      ['Deals Closed / Converted', String(data.totalDealsClosed), 'Franchise contracts signed']
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `brizx_brand_analytics_${currentBrand.id}_${filterType.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* HEADER & FILTER BAR */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          {/* Title & Brand Info */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase mb-2 border border-blue-100">
              <Sparkles size={14} className="text-blue-600" /> BrizX Intelligence Engine • Live
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-indigo-950 font-heading">
              Brand Analytics & Intelligence
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl">
              Real-time performance metrics, candidate conversion funnel, territory demand heatmap, and algorithmic match analytics for <span className="font-bold text-slate-900">{currentBrand.brandName}</span>.
            </p>
          </div>

          {/* Export & Actions */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-2xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
              title="Download real analytics report as CSV"
            >
              <Download size={15} className="text-blue-600" /> Export CSV
            </button>
            <Link
              to="/brand/seekers"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
            >
              Find Seekers <ChevronRight size={15} />
            </Link>
          </div>
        </div>

        {/* Global Date Filter Controls */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
            {(['7D', '30D', '90D', 'ALL', 'CUSTOM'] as const).map(pill => (
              <button
                key={pill}
                onClick={() => setFilterType(pill)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterType === pill
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {pill === '7D' && 'Last 7 Days'}
                {pill === '30D' && 'Last 30 Days'}
                {pill === '90D' && 'Last 90 Days'}
                {pill === 'ALL' && 'All Time'}
                {pill === 'CUSTOM' && 'Custom Range'}
              </button>
            ))}
          </div>

          {/* Active Period Label / Custom Date Pickers */}
          {filterType === 'CUSTOM' ? (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <input
                type="date"
                value={customStartDate}
                onChange={e => setCustomStartDate(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-blue-500"
              />
              <span className="text-slate-400 font-bold">to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={e => setCustomEndDate(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-blue-500"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Calendar size={14} className="text-blue-600" />
              <span>
                {activeDateFilter.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} – {activeDateFilter.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 4 PRIMARY PERFORMANCE KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1: Total Leads Unlocked */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:border-blue-200 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
              <Users size={20} />
            </div>
            <span className={`text-xs font-bold flex items-center gap-1 px-2 py-0.5 rounded-full ${
              data.unlocksGrowthPct >= 0 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {data.unlocksGrowthPct >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {data.unlocksGrowthPct >= 0 ? `+${data.unlocksGrowthPct}%` : `${data.unlocksGrowthPct}%`}
            </span>
          </div>
          <div className="text-3xl font-black text-indigo-950 font-heading">
            {data.totalLeadsUnlocked}
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
            Total Leads Unlocked
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-3 pt-3 border-t border-slate-100 flex justify-between">
            <span>Prior Period: <b className="text-slate-700">{data.previousLeadsUnlocked}</b></span>
            <span>Credits Used: <b className="text-blue-600">{data.totalLeadsUnlocked}</b></span>
          </div>
        </div>

        {/* KPI 2: Meeting Conversion Rate */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:border-blue-200 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
              <Target size={20} />
            </div>
            <span className={`text-xs font-bold flex items-center gap-1 px-2 py-0.5 rounded-full ${
              data.meetingConversionRate >= 50
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {data.meetingConversionRate >= 50 ? 'Strong Fit' : 'Active Pipeline'}
            </span>
          </div>
          <div className="text-3xl font-black text-indigo-950 font-heading">
            {data.meetingConversionRate}%
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
            Meeting Conversion Rate
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-3 pt-3 border-t border-slate-100 flex justify-between">
            <span>Scheduled: <b className="text-slate-700">{data.totalMeetingsScheduled}</b></span>
            <span>Completed: <b className="text-emerald-700">{data.totalMeetingsCompleted}</b></span>
          </div>
        </div>

        {/* KPI 3: Avg Smart Match Score */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:border-blue-200 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck size={13} /> High Accuracy
            </span>
          </div>
          <div className="text-3xl font-black text-indigo-950 font-heading">
            {data.avgSmartMatchScore}%
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
            Avg Smart Match Score
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-3 pt-3 border-t border-slate-100 flex justify-between">
            <span>Benchmark: <b className="text-slate-700">85%+</b></span>
            <span>Quality Tier: <b className="text-emerald-700">Tier-1 Fit</b></span>
          </div>
        </div>

        {/* KPI 4: Avg Time to First Contact */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:border-blue-200 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
              <Clock size={20} />
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              data.timeToContactStatus === 'EXCELLENT'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : data.timeToContactStatus === 'GOOD'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {data.timeToContactStatus === 'EXCELLENT' && '⚡ Top 10% Speed'}
              {data.timeToContactStatus === 'GOOD' && 'Optimal Response'}
              {data.timeToContactStatus === 'NEEDS_ATTENTION' && 'Follow-up Needed'}
              {data.timeToContactStatus === 'NO_DATA' && 'Awaiting Contact'}
            </span>
          </div>
          <div className="text-3xl font-black text-indigo-950 font-heading">
            {data.avgTimeToFirstContactText}
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
            Avg Time to First Contact
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-3 pt-3 border-t border-slate-100 flex justify-between">
            <span>Target: <b className="text-slate-700">&lt; 4 Hours</b></span>
            <span>Channel: <b className="text-blue-600">WhatsApp / Call</b></span>
          </div>
        </div>
      </div>

      {/* VIEW NAVIGATION TABS */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveView('OVERVIEW')}
          className={`px-5 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeView === 'OVERVIEW'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BarChart3 size={16} /> Performance Overview
        </button>
        <button
          onClick={() => setActiveView('FUNNEL')}
          className={`px-5 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeView === 'FUNNEL'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Target size={16} /> Conversion Funnel ({data.funnel.length} Stages)
        </button>
        <button
          onClick={() => setActiveView('GEOGRAPHY')}
          className={`px-5 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeView === 'GEOGRAPHY'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <MapPin size={16} /> Territory Demand Heatmap
        </button>
        <button
          onClick={() => setActiveView('LEADS_LOG')}
          className={`px-5 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeView === 'LEADS_LOG'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users size={16} /> Unlocked Leads Performance ({data.leadsPerformance.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeView === 'OVERVIEW' && (
        <div className="space-y-8">
          {/* Charts Row: Trend Area Chart & Precision Donut */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Trend Chart (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-7 border border-slate-200/90 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-black text-indigo-950 font-heading flex items-center gap-2">
                    <TrendingUp className="text-blue-600" size={18} /> Lead Unlocks & Activity Trend
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Real-time timeline of leads unlocked, initial contacts, and discovery meetings.
                  </p>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorUnlocks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorContacts" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorMeetings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: '10px' }} />
                    <Area type="monotone" dataKey="unlocks" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorUnlocks)" name="Leads Unlocked" />
                    <Area type="monotone" dataKey="firstContacts" stroke="#4F46E5" strokeWidth={2} fillOpacity={1} fill="url(#colorContacts)" name="Contacts Initiated" />
                    <Area type="monotone" dataKey="meetings" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorMeetings)" name="Meetings Booked" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Smart Match Donut & Dimension Scores (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-black text-indigo-950 font-heading flex items-center gap-2">
                      <PieIcon className="text-blue-600" size={18} /> Smart Match Precision
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      100-point compatibility distribution across seeker pool.
                    </p>
                  </div>
                </div>

                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.matchDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="count"
                      >
                        {data.matchDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 5 Algorithm Dimension Scores */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  Algorithm Dimension Averages
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-500 block font-semibold">City Fit (25 pts)</span>
                    <span className="font-black text-slate-900">{data.dimensionAverages.cityScore}/25 pts</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-500 block font-semibold">Investment (25 pts)</span>
                    <span className="font-black text-emerald-700">{data.dimensionAverages.investmentScore}/25 pts</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-500 block font-semibold">Industry (25 pts)</span>
                    <span className="font-black text-blue-700">{data.dimensionAverages.industryScore}/25 pts</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-500 block font-semibold">Background (15 pts)</span>
                    <span className="font-black text-indigo-700">{data.dimensionAverages.backgroundScore}/15 pts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONABLE BUSINESS INSIGHTS PANEL */}
          <div className="bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 rounded-3xl p-6 md:p-8 border border-blue-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs">
                <Zap size={18} />
              </div>
              <div>
                <h3 className="text-lg font-black text-indigo-950 font-heading">
                  Actionable Business Insights & Growth Directives
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  Automated intelligence computed from your actual unlock velocities, contact response times, and city demand.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.insights.map(ins => (
                <div 
                  key={ins.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md ${
                        ins.type === 'SUCCESS' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : ins.type === 'ACTION_REQUIRED'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {ins.type.replace('_', ' ')}
                      </span>
                      {ins.metricHighlight && (
                        <span className="text-xs font-black text-indigo-950">
                          {ins.metricHighlight}
                        </span>
                      )}
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900">{ins.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium mt-1">
                      {ins.description}
                    </p>
                  </div>

                  {ins.actionText && ins.actionUrl && (
                    <Link
                      to={ins.actionUrl}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors pt-2 border-t border-slate-100"
                    >
                      {ins.actionText} <ChevronRight size={13} />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONVERSION FUNNEL */}
      {activeView === 'FUNNEL' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-sm">
            <div className="mb-6">
              <h3 className="text-xl font-black text-indigo-950 font-heading flex items-center gap-2">
                <Target className="text-blue-600" size={20} /> End-to-End Candidate Conversion Funnel
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Visual progression from candidate discovery to executed franchise agreements in {currentBrand.brandName}'s pipeline.
              </p>
            </div>

            {/* Funnel Stage Rows */}
            <div className="space-y-4">
              {data.funnel.map((stage, index) => (
                <div 
                  key={stage.stageKey}
                  className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <div>
                        <div className="font-extrabold text-sm text-slate-900">{stage.stageName}</div>
                        <div className="text-[11px] text-slate-500">{stage.description}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <div className="text-lg font-black text-slate-900 font-heading">{stage.count}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Candidates</div>
                      </div>
                      <div className="border-l border-slate-200 pl-4">
                        <div className="text-sm font-black text-blue-700">{stage.conversionFromPrev}%</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Step Rate</div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mt-3">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${Math.max(5, stage.conversionFromTop)}%`,
                        backgroundColor: stage.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TERRITORY DEMAND HEATMAP */}
      {activeView === 'GEOGRAPHY' && (
        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-sm">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-black text-indigo-950 font-heading flex items-center gap-2">
                  <MapPin className="text-blue-600" size={20} /> Territory Seeker Demand
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Active franchise seeker concentration across Indian metropolitan hubs matching {currentBrand.industry} capex tier.
                </p>
              </div>
            </div>

            {/* City Bar Chart */}
            <div className="h-72 w-full mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.cityDemand} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="city" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Bar dataKey="seekersCount" fill="#2563eb" radius={[8, 8, 0, 0]} name="Active Seekers" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* City Breakdown Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 uppercase font-black tracking-wider border-b border-slate-200">
                    <th className="p-3.5">City / Territory</th>
                    <th className="p-3.5">Active Candidates</th>
                    <th className="p-3.5">Avg Capital Readiness</th>
                    <th className="p-3.5">Avg Match Fit</th>
                    <th className="p-3.5">Brand Expansion Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {data.cityDemand.map(item => (
                    <tr key={item.city} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                        <MapPin size={13} className="text-blue-600" /> {item.city}
                      </td>
                      <td className="p-3.5 text-slate-700 font-bold">{item.seekersCount} verified seekers</td>
                      <td className="p-3.5 text-emerald-700 font-black">₹{item.avgInvestment} Lakhs</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded-md">
                          {item.avgMatchScore}% Match
                        </span>
                      </td>
                      <td className="p-3.5">
                        {item.isBrandTarget ? (
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-black uppercase">
                            Target City
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase">
                            Emerging Hub
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <Link
                          to="/brand/seekers"
                          className="text-blue-600 hover:text-blue-800 font-bold hover:underline"
                        >
                          Explore &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: UNLOCKED LEADS PERFORMANCE LOG */}
      {activeView === 'LEADS_LOG' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-sm">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-black text-indigo-950 font-heading flex items-center gap-2">
                  <Users className="text-blue-600" size={20} /> Unlocked Leads Performance & Contact Log
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Granular tracking of response speed, channel interactions, and CRM pipeline progression for each unlocked contact.
                </p>
              </div>
            </div>

            {data.leadsPerformance.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
                <Users size={36} className="mx-auto text-slate-400 mb-3" />
                <h4 className="font-bold text-slate-800 text-sm">No Unlocked Leads in this Period</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Unlock contact information of verified seekers to begin tracking first-contact times and meeting conversions.
                </p>
                <Link
                  to="/brand/seekers"
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Discover Matching Seekers
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 uppercase font-black tracking-wider border-b border-slate-200">
                      <th className="p-3.5">Candidate</th>
                      <th className="p-3.5">Location & Inv.</th>
                      <th className="p-3.5">Match Score</th>
                      <th className="p-3.5">Unlocked Date</th>
                      <th className="p-3.5">Time to Contact</th>
                      <th className="p-3.5">CRM Stage</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {data.leadsPerformance.map(lead => (
                      <tr key={lead.seeker.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-black flex items-center justify-center text-xs shrink-0 overflow-hidden">
                              {lead.seeker.avatar ? (
                                <img src={lead.seeker.avatar} alt={lead.seeker.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                lead.seeker.name.charAt(0)
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{lead.seeker.name}</div>
                              <div className="text-[11px] text-slate-500">{lead.seeker.phone || '+91 98765 •••••'}</div>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <div className="text-slate-900 font-semibold">{lead.seeker.city}</div>
                          <div className="text-[11px] text-emerald-700 font-bold">₹{lead.seeker.investment} Lakhs</div>
                        </td>

                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                            lead.matchScore >= 90 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {lead.matchScore}% • {lead.fitLabel}
                          </span>
                        </td>

                        <td className="p-3.5 text-slate-600">
                          {new Date(lead.unlockedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </td>

                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                            lead.hoursToFirstContact !== undefined && lead.hoursToFirstContact <= 4
                              ? 'bg-emerald-50 text-emerald-700'
                              : lead.hoursToFirstContact !== undefined
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}>
                            {lead.timeToFirstContactText}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded-lg text-[10px] uppercase">
                            {lead.crmStage.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/seekers/${lead.seeker.id}`}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                              title="View Full Profile"
                            >
                              <Eye size={14} />
                            </Link>
                            <Link
                              to="/brand/crm"
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] uppercase rounded-lg transition-colors"
                            >
                              CRM &rarr;
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
