import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Users, Search, Filter, Shield, Briefcase, IndianRupee, CheckCircle, Clock, XCircle, MoreVertical } from 'lucide-react';

export default function AdminUsers() {
  const { seekers, brands, verifySeeker } = useData();
  const [activeTab, setActiveTab] = useState<'SEEKERS' | 'BRANDS' | 'ADMINS'>('SEEKERS');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSeekers = seekers.filter(s => 
    (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (s.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.city || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBrands = brands.filter(b => 
    (b.brandName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    ((b as any).companyName || b.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.industry || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const admins = [
    { id: 'a1', name: 'Super Admin', email: 'admin@brizx.in', role: 'SUPER_ADMIN', status: 'Active' },
    { id: 'a2', name: 'Operations Admin', email: 'ops@brizx.in', role: 'OPERATIONS_ADMIN', status: 'Active' },
    { id: 'a3', name: 'Finance Admin', email: 'finance@brizx.in', role: 'FINANCE_ADMIN', status: 'Active' },
  ];

  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-indigo-950 mb-2 font-heading">User Management</h1>
          <p className="text-slate-600">Manage seekers, brands, and verifications.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6 shrink-0 border-b border-slate-200">
         <div className="flex gap-4 w-full md:w-auto">
           <button 
             onClick={() => setActiveTab('SEEKERS')}
             className={`pb-4 px-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${activeTab === 'SEEKERS' ? 'text-blue-700' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Franchise Seekers ({seekers.length})
             {activeTab === 'SEEKERS' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
           </button>
           <button 
             onClick={() => setActiveTab('BRANDS')}
             className={`pb-4 px-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${activeTab === 'BRANDS' ? 'text-blue-700' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Registered Brands ({brands.length})
             {activeTab === 'BRANDS' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
           </button>
           <button 
             onClick={() => setActiveTab('ADMINS')}
             className={`pb-4 px-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${activeTab === 'ADMINS' ? 'text-blue-700' : 'text-slate-400 hover:text-slate-600'}`}
           >
             System Admins ({admins.length})
             {activeTab === 'ADMINS' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
           </button>
         </div>

         <div className="flex gap-2 w-full md:w-auto pb-2">
            <div className="relative flex-1 md:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder={`Search ${activeTab.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm font-semibold outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-blue-700 transition-colors cursor-pointer shadow-sm">
               <Filter size={18} />
            </button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 bg-white rounded-3xl border border-slate-200 shadow-sm relative">
        <div className="overflow-x-auto min-w-[800px]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200">
              <tr>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">{activeTab === 'SEEKERS' ? 'Seeker Details' : activeTab === 'BRANDS' ? 'Brand Details' : 'Admin Details'}</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">{activeTab === 'SEEKERS' ? 'Industry & Exp.' : activeTab === 'BRANDS' ? 'Industry' : 'Role'}</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">{activeTab === 'SEEKERS' ? 'Investment' : activeTab === 'BRANDS' ? 'Required Inv.' : 'Last Login'}</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeTab === 'SEEKERS' ? (
                filteredSeekers.length === 0 ? (
                  <tr><td colSpan={5} className="py-12 text-center text-slate-500">No seekers found matching your search.</td></tr>
                ) : (
                  filteredSeekers.map(seeker => (
                    <tr key={seeker.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-6">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center shrink-0 overflow-hidden">
                               {seeker.avatar ? (
                                 <img src={seeker.avatar} alt={seeker.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                               ) : (
                                 seeker.name.charAt(0)
                               )}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-blue-700">{seeker.name}</div>
                              <div className="text-xs text-slate-500">{seeker.email} • {seeker.phone}</div>
                            </div>
                         </div>
                      </td>
                      <td className="py-4 px-6">
                         <div className="text-sm font-bold text-slate-700">{seeker.industry}</div>
                         <div className="text-xs text-slate-500 truncate max-w-[200px]" title={seeker.experience}>{seeker.experience}</div>
                      </td>
                      <td className="py-4 px-6">
                         <div className="text-sm font-bold text-slate-800 bg-slate-50 px-2 py-1 rounded-md inline-block">
                           ₹{seeker.investment}L
                         </div>
                      </td>
                      <td className="py-4 px-6">
                         {seeker.verified ? (
                           <span className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-md w-fit">
                             <CheckCircle size={14} /> Verified
                           </span>
                         ) : (
                           <span className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md w-fit">
                             <Clock size={14} /> Pending
                           </span>
                         )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                           {!seeker.verified && (
                             <button 
                               onClick={() => verifySeeker(seeker.id)}
                               className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-green-200 transition-colors cursor-pointer"
                             >
                               Verify
                             </button>
                           )}
                           <button className="p-2 text-slate-400 hover:text-blue-700 transition-colors cursor-pointer">
                              <MoreVertical size={18} />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )
              ) : activeTab === 'BRANDS' ? (
                filteredBrands.length === 0 ? (
                  <tr><td colSpan={5} className="py-12 text-center text-slate-500">No brands found matching your search.</td></tr>
                ) : (
                  filteredBrands.map(brand => (
                    <tr key={brand.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-6">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center shrink-0">
                               {brand.brandName.charAt(0)}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-blue-700">{brand.brandName}</div>
                              <div className="text-xs text-slate-500">{(brand as any).companyName || brand.name || 'Brand Owner'}</div>
                            </div>
                         </div>
                      </td>
                      <td className="py-4 px-6">
                         <div className="text-sm font-bold text-slate-700">{brand.industry}</div>
                      </td>
                      <td className="py-4 px-6">
                         <div className="text-sm font-bold text-slate-800 bg-slate-50 px-2 py-1 rounded-md inline-block">
                           ₹{brand.investmentRequired.min}-{brand.investmentRequired.max}L
                         </div>
                      </td>
                      <td className="py-4 px-6">
                         <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-blue-50 px-2.5 py-1 rounded-md w-fit">
                           <Shield size={14} /> Active
                         </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors cursor-pointer">
                             Manage
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )
              ) : (
                admins.map(admin => (
                  <tr key={admin.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0">
                             {admin.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-blue-700">{admin.name}</div>
                            <div className="text-xs text-slate-500">{admin.email}</div>
                          </div>
                       </div>
                    </td>
                    <td className="py-4 px-6">
                       <div className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded inline-block uppercase tracking-wider">{admin.role.replace('_', ' ')}</div>
                    </td>
                    <td className="py-4 px-6">
                       <div className="text-sm font-semibold text-slate-500">2 hours ago</div>
                    </td>
                    <td className="py-4 px-6">
                       <span className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-md w-fit">
                         <CheckCircle size={14} /> Active
                       </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <button className="p-2 text-slate-400 hover:text-blue-700 transition-colors cursor-pointer">
                            <MoreVertical size={18} />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
