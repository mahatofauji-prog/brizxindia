import React, { useState } from 'react';
import { BarChart as BarChartIcon, Users, Building2, MapPin, Download, Filter, TrendingUp } from 'lucide-react';
import { useData } from '../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ExportField, exportPDF, exportExcel, exportCSV } from '../lib/exportService';
import UniversalExportModal from '../components/admin/UniversalExportModal';

const invoiceFields: ExportField[] = [
  { label: 'Invoice ID', key: 'id' },
  { label: 'Brand ID', key: 'brandId' },
  { label: 'Plan Name', key: 'planName' },
  { label: 'Amount (INR)', key: 'amount', transform: (val) => `₹${val.toLocaleString()}` },
  { label: 'GST (18%)', key: 'gstAmount', transform: (val) => `₹${val.toLocaleString()}` },
  { label: 'Total Paid', key: 'totalAmount', transform: (val) => `₹${val.toLocaleString()}` },
  { label: 'Payment Mode', key: 'paymentMode' },
  { label: 'Status', key: 'status' },
  { label: 'Payment Date', key: 'date' },
];

const seekerFields: ExportField[] = [
  { label: 'Name', key: 'name' },
  { label: 'Email', key: 'email' },
  { label: 'Phone', key: 'phone' },
  { label: 'City', key: 'city' },
  { label: 'Industry Sector', key: 'industry' },
  { label: 'Investment Limit', key: 'investment', transform: (val) => `₹${val} Lakhs` },
  { label: 'Verification Status', key: 'verified', transform: (val) => val ? 'Verified' : 'Pending' },
  { label: 'Registration Date', key: 'createdAt', transform: (val) => val ? String(val).split('T')[0] : 'N/A' },
];

const brandFields: ExportField[] = [
  { label: 'Brand Name', key: 'brandName' },
  { label: 'Industry Sector', key: 'industry' },
  { label: 'Investment Range (Lakhs)', key: 'investmentRequired', transform: (val: any) => val ? `₹${val.min}-${val.max}L` : 'N/A' },
  { label: 'Total Outlets', key: 'totalOutlets' },
  { label: 'Subscription Plan', key: 'subscriptionTier' },
  { label: 'Verification Status', key: 'verified', transform: (val: any) => val ? 'Verified' : 'Pending' },
];

export default function AdminReports() {
  const { seekers, brands, subscriptions, invoices } = useData();
  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleExportCard = (reportType: string, format: 'PDF' | 'Excel' | 'CSV') => {
    let dataset: any[] = [];
    let fields: ExportField[] = [];
    let title = '';
    let prefix = '';

    if (reportType === 'Revenue Report') {
      dataset = invoices || [];
      fields = invoiceFields;
      title = 'Revenue & Invoices Report';
      prefix = 'Revenue-Report';
    } else if (reportType === 'User Growth') {
      dataset = seekers || [];
      fields = seekerFields;
      title = 'User Growth (Franchise Seekers)';
      prefix = 'User-Growth';
    } else if (reportType === 'Brand Engagement') {
      dataset = brands || [];
      fields = brandFields;
      title = 'Brand Engagement & Directory';
      prefix = 'Brand-Engagement';
    } else if (reportType === 'City Demographics') {
      const cityGroups: { [city: string]: number } = {};
      seekers.forEach(s => {
        const city = s.city || 'Other';
        cityGroups[city] = (cityGroups[city] || 0) + 1;
      });
      dataset = Object.entries(cityGroups).map(([city, count]) => ({ city, seekerCount: count, status: 'Active' }));
      fields = [
        { label: 'City', key: 'city' },
        { label: 'Franchise Seeker Count', key: 'seekerCount' },
        { label: 'Market Status', key: 'status' }
      ];
      title = 'City Demographics Market Report';
      prefix = 'City-Demographics';
    }

    const timestamp = new Date("2026-08-29T16:52:19-07:00").toISOString().split('T')[0];
    const fileExt = format === 'PDF' ? '.pdf' : format === 'Excel' ? '.xlsx' : '.csv';
    const filename = `BRIX-India-${prefix}-${timestamp}${fileExt}`;

    if (format === 'CSV') {
      exportCSV(title, fields, dataset, filename);
    } else if (format === 'Excel') {
      exportExcel(title, fields, dataset, filename);
    } else {
      exportPDF(title, fields, dataset, filename);
    }
  };

  const totalRevenue = subscriptions.reduce((acc, sub) => acc + (sub.plan === 'PROFESSIONAL' ? 149999 : sub.plan === 'STARTER' ? 49999 : 249999), 0);

  const reportCards = [
    { title: 'Revenue Report', desc: 'Financial overview and transaction history', icon: BarChartIcon, color: 'indigo', val: `₹${(totalRevenue / 100000).toFixed(2)}L` },
    { title: 'User Growth', desc: 'Registration trends over time', icon: Users, color: 'blue', val: `${seekers.length} Seekers` },
    { title: 'Brand Engagement', desc: 'Brand activity and subscription rates', icon: Building2, color: 'blue', val: `${brands.length} Brands` },
    { title: 'City Demographics', desc: 'Geographical distribution of users', icon: MapPin, color: 'green', val: '5 Active Cities' }
  ];

  const chartData = [
    { name: 'Jan', revenue: 240000 },
    { name: 'Feb', revenue: 450000 },
    { name: 'Mar', revenue: 480000 },
    { name: 'Apr', revenue: 750000 },
    { name: 'May', revenue: 900000 },
    { name: 'Jun', revenue: 1200000 },
  ];

  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-indigo-950 mb-2 font-heading">Reports & Analytics</h1>
          <p className="text-slate-600">Exportable data insights and system metrics.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer">
            <Filter size={14} /> Filter Range
          </button>
          <button 
            onClick={() => setIsExportOpen(true)}
            className="px-6 py-2.5 bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-800 transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download size={14} /> Export All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 shrink-0">
         {reportCards.map((card, i) => (
           <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 relative group overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
              <div className={`absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity text-${card.color}-600`}>
                <card.icon size={80} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className={`w-10 h-10 rounded-xl bg-${card.color}-50 text-${card.color}-600 flex items-center justify-center shrink-0`}>
                    <card.icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-700">{card.title}</h3>
                    <p className="text-xs text-slate-500">{card.desc}</p>
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-800 mb-6">{card.val}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 relative z-10">
                 <button 
                   onClick={() => handleExportCard(card.title, 'PDF')}
                   className="py-2 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors cursor-pointer border border-slate-100"
                 >
                   PDF
                 </button>
                 <button 
                   onClick={() => handleExportCard(card.title, 'CSV')}
                   className="py-2 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors cursor-pointer border border-slate-100"
                 >
                   CSV
                 </button>
                 <button 
                   onClick={() => handleExportCard(card.title, 'Excel')}
                   className="py-2 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors cursor-pointer border border-slate-100"
                 >
                   XLSX
                 </button>
              </div>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex-1 flex flex-col min-h-0">
        <h3 className="text-lg font-black text-blue-700 mb-6 shrink-0 flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-600" /> Platform Growth
        </h3>
        <div className="flex-1 flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 p-4">
           <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
           </ResponsiveContainer>
        </div>
      </div>

      <UniversalExportModal 
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title="Comprehensive Revenue & Performance Report"
        filenamePrefix="All-Platform-Performance-Report"
        currentData={invoices || []}
        allData={invoices || []}
        fields={invoiceFields}
      />
    </div>
  );
}
