import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Plus, Edit2, Trash2, CheckCircle, Shield, Zap, Check, IndianRupee, Download } from 'lucide-react';
import UniversalExportModal from '../components/admin/UniversalExportModal';
import { ExportField } from '../lib/exportService';

const subscriptionFields: ExportField[] = [
  { label: 'Brand Name', key: 'brandName' },
  { label: 'Plan Level', key: 'plan' },
  { label: 'Total Lead Unlocks', key: 'totalUnlocks' },
  { label: 'Unlocks Remaining', key: 'unlocksRemaining' },
  { label: 'Unlocks Used', key: 'unlocksUsed' },
  { label: 'Subscription Start Date', key: 'startDate', transform: (val) => val ? String(val).split('T')[0] : 'N/A' },
  { label: 'Subscription End Date', key: 'endDate', transform: (val) => val ? String(val).split('T')[0] : 'N/A' },
  { label: 'Status', key: 'status' },
];

export default function AdminSubscriptions() {
  const { subscriptions, brands } = useData();
  const [isExportOpen, setIsExportOpen] = useState(false);

  const exportData = subscriptions.map(sub => {
    const brand = brands.find(b => b.id === sub.brandId);
    const total = sub.totalUnlocks || 200;
    const remaining = sub.unlocksRemaining;
    const used = Math.max(0, total - remaining);
    return {
      ...sub,
      brandName: brand?.brandName || 'Unknown',
      totalUnlocks: total,
      unlocksRemaining: remaining,
      unlocksUsed: used,
      status: 'Active'
    };
  });

  const plans = [
    { id: 'p1', name: 'Starter', price: '49,999', leads: 50, duration: '12 Months', active: true, icon: Shield, color: 'indigo' },
    { id: 'p2', name: 'Professional', price: '1,49,999', leads: 200, duration: '12 Months', active: true, icon: Zap, color: 'blue' },
    { id: 'p3', name: 'Enterprise', price: '2,49,999', leads: 500, duration: '12 Months', active: true, icon: Check, color: 'green' }
  ];

  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-indigo-950 mb-2 font-heading">Subscription Plans</h1>
          <p className="text-slate-600">Manage pricing tiers and features for brands.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsExportOpen(true)}
            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Download size={14} className="text-slate-500" /> Export Active Subs
          </button>
          <button className="px-6 py-2.5 bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-800 transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 cursor-pointer">
            <Plus size={16} /> Create New Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 shrink-0">
         {plans.map((plan) => (
           <div key={plan.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 relative group overflow-hidden">
              <div className={`absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity text-${plan.color}-600`}>
                <plan.icon size={80} />
              </div>
              <div className="flex justify-between items-start mb-6">
                 <div className={`w-12 h-12 rounded-xl bg-${plan.color}-50 text-${plan.color}-600 flex items-center justify-center`}>
                    <plan.icon size={24} />
                 </div>
                 <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-slate-50 hover:bg-slate-100 rounded-lg">
                       <Edit2 size={16} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600 transition-colors bg-slate-50 hover:bg-red-50 rounded-lg">
                       <Trash2 size={16} />
                    </button>
                 </div>
              </div>
              <h3 className="text-xl font-black text-blue-700 mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                 <span className="text-2xl font-black text-slate-800 flex items-center"><IndianRupee size={20} />{plan.price}</span>
                 <span className="text-xs text-slate-500 font-semibold">/ {plan.duration}</span>
              </div>
              <div className="space-y-3 mb-6">
                 <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <CheckCircle size={16} className="text-green-500" /> {plan.leads} Lead Unlocks
                 </div>
                 <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <CheckCircle size={16} className="text-green-500" /> Full CRM Access
                 </div>
                 <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <CheckCircle size={16} className="text-green-500" /> Priority Support
                 </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                 <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${plan.active ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                    {plan.active ? 'Active' : 'Inactive'}
                 </span>
                 <span className="text-xs font-bold text-slate-500">
                    {subscriptions.filter(s => s.plan === plan.name.toUpperCase()).length} Active Subs
                 </span>
              </div>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex-1 flex flex-col min-h-0">
        <h3 className="text-lg font-black text-blue-700 mb-6 shrink-0">Active Subscriptions</h3>
        
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200">
              <tr>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Brand Name</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Plan</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Usage</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">End Date</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">No active subscriptions.</td>
                </tr>
              ) : (
                subscriptions.map((sub, idx) => {
                  const brand = brands.find(b => b.id === sub.brandId);
                  return (
                    <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 text-sm font-bold text-blue-700">{brand?.brandName || 'Unknown'}</td>
                      <td className="py-4 px-6 text-sm font-semibold text-slate-600">{sub.plan}</td>
                      <td className="py-4 px-6">
                        {(() => {
                          const total = sub.totalUnlocks || 200;
                          const used = Math.max(0, total - sub.unlocksRemaining);
                          const pct = Math.min(100, Math.round((used / total) * 100));
                          return (
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-slate-100 rounded-full h-1.5">
                                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${pct}%` }}></div>
                              </div>
                              <span className="text-xs font-bold text-slate-500">{used}/{total}</span>
                            </div>
                          );
                        })()}
                      </td>
                      <td className="py-4 px-6 text-sm font-semibold text-slate-500">{new Date(sub.endDate).toLocaleDateString()}</td>
                      <td className="py-4 px-6">
                         <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-xs font-bold">Active</span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UniversalExportModal 
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title="Active Subscription Plan Statistics"
        filenamePrefix="Active-Subscriptions"
        currentData={exportData}
        allData={exportData}
        fields={subscriptionFields}
      />
    </div>
  );
}
