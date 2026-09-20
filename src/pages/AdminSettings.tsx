import React, { useState } from 'react';
import { Settings, Globe, Database, Shield, Layout, Sliders, HardDrive, History } from 'lucide-react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'CMS' | 'MATCH_ENGINE' | 'BACKUP' | 'AUDIT'>('GENERAL');

  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-indigo-950 mb-2 font-heading">System Settings</h1>
          <p className="text-slate-600">Configure platform rules, CMS, and system parameters.</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6 shrink-0 border-b border-slate-200 overflow-x-auto pb-2">
         <button 
           onClick={() => setActiveTab('GENERAL')}
           className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors rounded-lg flex items-center gap-2 whitespace-nowrap ${activeTab === 'GENERAL' ? 'bg-blue-700 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
         >
           <Settings size={16} /> General Settings
         </button>
         <button 
           onClick={() => setActiveTab('CMS')}
           className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors rounded-lg flex items-center gap-2 whitespace-nowrap ${activeTab === 'CMS' ? 'bg-blue-700 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
         >
           <Layout size={16} /> CMS & Pages
         </button>
         <button 
           onClick={() => setActiveTab('MATCH_ENGINE')}
           className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors rounded-lg flex items-center gap-2 whitespace-nowrap ${activeTab === 'MATCH_ENGINE' ? 'bg-blue-700 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
         >
           <Sliders size={16} /> Match Engine Config
         </button>
         <button 
           onClick={() => setActiveTab('BACKUP')}
           className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors rounded-lg flex items-center gap-2 whitespace-nowrap ${activeTab === 'BACKUP' ? 'bg-blue-700 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
         >
           <HardDrive size={16} /> Backup & Restore
         </button>
         <button 
           onClick={() => setActiveTab('AUDIT')}
           className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors rounded-lg flex items-center gap-2 whitespace-nowrap ${activeTab === 'AUDIT' ? 'bg-blue-700 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
         >
           <History size={16} /> Audit Logs
         </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
        
        {activeTab === 'GENERAL' && (
          <div className="space-y-8 max-w-3xl">
             <div>
                <h3 className="text-lg font-black text-blue-700 mb-4 border-b border-slate-100 pb-2">Global Platform Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                   <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Platform Name</label>
                     <input type="text" defaultValue="BrizX India" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 transition-colors" />
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Support Email</label>
                     <input type="email" defaultValue="support@brizx.in" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 transition-colors" />
                   </div>
                </div>
             </div>
             
             <div>
                <h3 className="text-lg font-black text-blue-700 mb-4 border-b border-slate-100 pb-2">API Credentials</h3>
                <div className="grid grid-cols-1 gap-6 mt-4">
                   <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Payment Gateway Key (Razorpay)</label>
                     <input type="password" defaultValue="rzp_test_xxxxxx" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 transition-colors" />
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">SMS Gateway API Key</label>
                     <input type="password" defaultValue="****************" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 transition-colors" />
                   </div>
                </div>
             </div>

             <button className="px-8 py-3 bg-blue-700 text-white rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-blue-800 transition-all shadow-md cursor-pointer">
                Save Settings
             </button>
          </div>
        )}

        {activeTab === 'MATCH_ENGINE' && (
          <div className="space-y-8 max-w-3xl">
             <div>
                <h3 className="text-lg font-black text-blue-700 mb-2">Smart Match Algorithm Weights</h3>
                <p className="text-slate-500 text-sm mb-6">Configure how much each parameter contributes to the final match score between a brand and a seeker.</p>
                
                <div className="space-y-6">
                   {[
                     { label: 'Investment Capacity Match', val: 40 },
                     { label: 'Industry Preference Match', val: 30 },
                     { label: 'Location / City Match', val: 20 },
                     { label: 'Timeline Readiness', val: 10 },
                   ].map((item, i) => (
                     <div key={i}>
                       <div className="flex justify-between items-end mb-2">
                         <label className="text-sm font-bold text-slate-700">{item.label}</label>
                         <span className="text-sm font-black text-blue-700">{item.val}%</span>
                       </div>
                       <input type="range" min="0" max="100" defaultValue={item.val} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                     </div>
                   ))}
                </div>
                <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between">
                   <span className="text-sm font-bold text-blue-800">Total Weight: 100%</span>
                   <button className="px-6 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-blue-700 transition-all shadow-sm cursor-pointer">
                      Save Weights
                   </button>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'AUDIT' && (
           <div>
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200">
                  <tr>
                    <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Timestamp</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Admin User</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Action</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                     { time: '10 mins ago', user: 'Super Admin', action: 'Verified Franchise Seeker (ID: SEK-102)', ip: '192.168.1.45' },
                     { time: '1 hour ago', user: 'Operations Admin', action: 'Exported User Report', ip: '10.0.0.12' },
                     { time: '3 hours ago', user: 'Super Admin', action: 'Updated Subscription Plan Pricing', ip: '192.168.1.45' },
                     { time: '1 day ago', user: 'Finance Admin', action: 'Processed Refund (INV-2023001)', ip: '10.0.0.44' },
                  ].map((log, idx) => (
                     <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6 text-sm font-semibold text-slate-500">{log.time}</td>
                        <td className="py-4 px-6 text-sm font-bold text-blue-700">{log.user}</td>
                        <td className="py-4 px-6 text-sm font-semibold text-slate-700">{log.action}</td>
                        <td className="py-4 px-6 text-xs text-slate-400 font-mono">{log.ip}</td>
                     </tr>
                  ))}
                </tbody>
              </table>
           </div>
        )}
        
        {(activeTab === 'CMS' || activeTab === 'BACKUP') && (
           <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <Settings size={48} className="mb-4 opacity-50" />
              <p className="text-sm font-bold text-slate-600">Module Configuration Ready</p>
              <p className="text-xs">This module is part of the extended enterprise suite.</p>
           </div>
        )}
      </div>
    </div>
  );
}
