import React, { useState } from 'react';
import { Mail, MessageSquare, Send, Settings, UserPlus, Users } from 'lucide-react';

export default function AdminCommunications() {
  const [activeTab, setActiveTab] = useState<'BROADCAST' | 'TEMPLATES'>('BROADCAST');

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-indigo-950 mb-2 font-heading">Communication Center</h1>
          <p className="text-slate-600">Send broadcasts and manage templates for Email, SMS, and WhatsApp.</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6 shrink-0 border-b border-slate-200">
         <button 
           onClick={() => setActiveTab('BROADCAST')}
           className={`pb-4 px-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${activeTab === 'BROADCAST' ? 'text-blue-700' : 'text-slate-400 hover:text-slate-600'}`}
         >
           New Broadcast
           {activeTab === 'BROADCAST' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
         </button>
         <button 
           onClick={() => setActiveTab('TEMPLATES')}
           className={`pb-4 px-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${activeTab === 'TEMPLATES' ? 'text-blue-700' : 'text-slate-400 hover:text-slate-600'}`}
         >
           Message Templates
           {activeTab === 'TEMPLATES' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
         </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        {activeTab === 'BROADCAST' ? (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                 <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                    <h3 className="text-lg font-black text-blue-700 mb-6 font-heading">Compose Message</h3>
                    
                    <div className="space-y-4">
                       <div>
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Select Channel</label>
                         <div className="flex gap-4">
                            <label className="flex-1 cursor-pointer">
                               <input type="radio" name="channel" className="peer sr-only" defaultChecked />
                               <div className="px-4 py-3 rounded-xl border-2 border-slate-200 peer-checked:border-blue-600 peer-checked:bg-blue-50 flex items-center justify-center gap-2 transition-all">
                                  <Mail size={16} className="peer-checked:text-blue-600" /> <span className="font-bold text-sm">Email</span>
                               </div>
                            </label>
                            <label className="flex-1 cursor-pointer">
                               <input type="radio" name="channel" className="peer sr-only" />
                               <div className="px-4 py-3 rounded-xl border-2 border-slate-200 peer-checked:border-blue-600 peer-checked:bg-blue-50 flex items-center justify-center gap-2 transition-all">
                                  <MessageSquare size={16} className="peer-checked:text-blue-600" /> <span className="font-bold text-sm">SMS</span>
                               </div>
                            </label>
                            <label className="flex-1 cursor-pointer">
                               <input type="radio" name="channel" className="peer sr-only" />
                               <div className="px-4 py-3 rounded-xl border-2 border-slate-200 peer-checked:border-green-600 peer-checked:bg-green-50 flex items-center justify-center gap-2 transition-all">
                                  <MessageSquare size={16} className="peer-checked:text-green-600" /> <span className="font-bold text-sm">WhatsApp</span>
                               </div>
                            </label>
                         </div>
                       </div>
                       
                       <div>
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Select Audience</label>
                         <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 transition-colors">
                            <option>All Users</option>
                            <option>All Brands</option>
                            <option>All Franchise Seekers</option>
                            <option>Premium Subscribed Brands</option>
                            <option>Pending Verifications</option>
                         </select>
                       </div>

                       <div>
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Subject / Title</label>
                         <input type="text" placeholder="Enter message subject" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 transition-colors" />
                       </div>

                       <div>
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Message Body</label>
                         <textarea rows={6} placeholder="Type your message here. Use {{name}} for dynamic variables." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 transition-colors resize-none"></textarea>
                       </div>

                       <div className="pt-4 border-t border-slate-100 flex justify-end">
                         <button className="px-8 py-3 bg-blue-700 text-white rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-blue-800 transition-all shadow-md shadow-indigo-200 flex items-center gap-2 cursor-pointer">
                           <Send size={16} /> Send Broadcast
                         </button>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="space-y-6">
                 <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100">
                    <h4 className="font-bold text-blue-700 mb-4 flex items-center gap-2"><Users size={16} /> Audience Stats</h4>
                    <div className="space-y-3">
                       <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-indigo-50">
                          <span className="text-xs font-bold text-slate-500">Estimated Reach</span>
                          <span className="text-sm font-black text-blue-700">4,250</span>
                       </div>
                       <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-indigo-50">
                          <span className="text-xs font-bold text-slate-500">Delivery Rate</span>
                          <span className="text-sm font-black text-green-600">~98.5%</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Welcome Email', type: 'EMAIL', triggers: 'On Registration' },
                { name: 'Profile Verification', type: 'SMS', triggers: 'On Approval' },
                { name: 'Meeting Reminder', type: 'WHATSAPP', triggers: '24h before meeting' },
                { name: 'Subscription Expiry', type: 'EMAIL', triggers: '3 days before expiry' }
              ].map((template, i) => (
                <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                   <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100">
                         {template.type === 'EMAIL' ? <Mail size={18} /> : <MessageSquare size={18} />}
                      </div>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded uppercase tracking-wider">{template.type}</span>
                   </div>
                   <h4 className="font-bold text-blue-700 mb-1">{template.name}</h4>
                   <p className="text-xs text-slate-500 font-semibold mb-6">Triggers: {template.triggers}</p>
                   <button className="w-full py-2 bg-blue-50 text-indigo-700 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-blue-100 transition-colors cursor-pointer border border-blue-100 flex items-center justify-center gap-2">
                     <Settings size={14} /> Edit Template
                   </button>
                </div>
              ))}
           </div>
        )}
      </div>
    </div>
  );
}
