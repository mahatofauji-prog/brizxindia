import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs';
import { ConfirmationModal } from '../../components/admin/ConfirmationModal';
import { 
  Star, Crown, Building2, Users, Calendar, ArrowUp, ArrowDown, 
  CheckCircle, Plus, Search, Filter, Clock, AlertCircle, X, Download
} from 'lucide-react';
import UniversalExportModal from '../../components/admin/UniversalExportModal';
import { ExportField } from '../../lib/exportService';

const featuredBrandFields: ExportField[] = [
  { label: 'Brand Name', key: 'brandName' },
  { label: 'Category', key: 'category' },
  { label: 'Priority Rank', key: 'priority', transform: (val) => `#${val}` },
  { label: 'Campaign Start Date', key: 'startDate' },
  { label: 'Campaign End Date', key: 'endDate' },
  { label: 'Impressions / Clicks', key: 'clicks' },
  { label: 'Status', key: 'status' }
];

const featuredSeekerFields: ExportField[] = [
  { label: 'Buyer Name', key: 'seekerName' },
  { label: 'Priority Rank', key: 'priority', transform: (val) => `#${val}` },
  { label: 'CapEx Budget', key: 'budget' },
  { label: 'Target City', key: 'targetCity' },
  { label: 'Campaign Start Date', key: 'startDate' },
  { label: 'Campaign End Date', key: 'endDate' },
];

export default function AdminFeaturedListings() {
  const { brands, seekers } = useData();

  const [activeTab, setActiveTab] = useState<'BRANDS' | 'SEEKERS'>('BRANDS');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const [featuredBrands, setFeaturedBrands] = useState([
    { id: 'fb1', brandName: 'Burger Kingsway', category: 'Food & Beverage', priority: 1, startDate: '2026-08-01', endDate: '2026-08-31', status: 'ACTIVE', clicks: 1420 },
    { id: 'fb2', brandName: 'Chai Point Express', category: 'Beverages', priority: 2, startDate: '2026-08-01', endDate: '2026-08-31', status: 'ACTIVE', clicks: 980 },
    { id: 'fb3', brandName: 'Fitness One Gym', category: 'Fitness & Health', priority: 3, startDate: '2026-08-05', endDate: '2026-09-05', status: 'SCHEDULED', clicks: 0 },
  ]);

  const [featuredSeekers, setFeaturedSeekers] = useState([
    { id: 'fs1', seekerName: 'Rahul Verma', budget: '₹50 Lakhs', targetCity: 'Bangalore', priority: 1, startDate: '2026-08-01', endDate: '2026-08-31', status: 'ACTIVE' },
    { id: 'fs2', seekerName: 'Priya Sundaram', budget: '₹1.2 Crore', targetCity: 'Mumbai', priority: 2, startDate: '2026-08-01', endDate: '2026-08-31', status: 'ACTIVE' }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto">
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-blue-700 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-indigo-700 animate-in fade-in">
          <CheckCircle size={18} className="text-blue-500" />
          <span className="text-xs font-bold uppercase tracking-wider">{toastMessage}</span>
        </div>
      )}

      <AdminBreadcrumbs items={[{ label: 'Super Admin', path: '/admin' }, { label: 'Featured Listings' }]} />

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-indigo-950 mb-2 font-heading flex items-center gap-3">
            <Crown size={32} className="text-blue-500" /> Featured Listings & Schedules
          </h1>
          <p className="text-slate-600">Promote brands and high-net-worth franchise buyers to homepage hero slots.</p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setIsExportOpen(true)}
            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Download size={14} className="text-slate-500" /> Export List
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-200 flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} /> Add Featured Campaign
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 shrink-0 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('BRANDS')}
          className={`pb-4 px-4 text-xs font-bold uppercase tracking-wider transition-colors relative cursor-pointer flex items-center gap-2 ${activeTab === 'BRANDS' ? 'text-indigo-950 font-black' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Building2 size={16} /> Featured Brands ({featuredBrands.length})
          {activeTab === 'BRANDS' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-t-full"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('SEEKERS')}
          className={`pb-4 px-4 text-xs font-bold uppercase tracking-wider transition-colors relative cursor-pointer flex items-center gap-2 ${activeTab === 'SEEKERS' ? 'text-indigo-950 font-black' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Users size={16} /> Featured Franchise Buyers ({featuredSeekers.length})
          {activeTab === 'SEEKERS' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-t-full"></div>}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col overflow-hidden min-h-0">
        {activeTab === 'BRANDS' ? (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase">Priority Rank</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase">Brand Name</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase">Category</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase">Campaign Dates</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase">Total Impressions / Clicks</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {featuredBrands.map((fb, idx) => (
                  <tr key={fb.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-6">
                      <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center">
                        #{fb.priority}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-black text-sm text-indigo-950">{fb.brandName}</td>
                    <td className="py-4 px-6 text-xs font-semibold text-slate-600">{fb.category}</td>
                    <td className="py-4 px-6 text-xs font-semibold text-slate-500">
                      {fb.startDate} → {fb.endDate}
                    </td>
                    <td className="py-4 px-6 text-xs font-bold text-blue-700">{fb.clicks} clicks</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase ${fb.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {fb.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => {
                            showToast(`Updated priority rank for ${fb.brandName}`);
                          }}
                          className="p-1.5 text-slate-400 hover:text-blue-700 cursor-pointer"
                          title="Move Priority Up"
                        >
                          <ArrowUp size={16} />
                        </button>
                        <button 
                          onClick={() => setDeleteId(fb.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer"
                          title="Remove Featured Campaign"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase">Priority Rank</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase">Buyer Name</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase">CapEx Budget</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase">Target City</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase">Campaign Dates</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {featuredSeekers.map((fs) => (
                  <tr key={fs.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-6">
                      <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center">
                        #{fs.priority}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-black text-sm text-indigo-950">{fs.seekerName}</td>
                    <td className="py-4 px-6 text-xs font-bold text-green-700">{fs.budget}</td>
                    <td className="py-4 px-6 text-xs font-semibold text-slate-600">{fs.targetCity}</td>
                    <td className="py-4 px-6 text-xs font-semibold text-slate-500">{fs.startDate} → {fs.endDate}</td>
                    <td className="py-4 px-6 text-right">
                      <button onClick={() => setDeleteId(fs.id)} className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer">
                        <X size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-5 right-5 text-slate-400 cursor-pointer"><X size={18} /></button>
            <h3 className="text-xl font-black text-indigo-950 mb-4 font-heading">Schedule Featured Campaign</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Select Entity</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none">
                  {brands.map(b => (
                    <option key={b.id} value={b.id}>{b.brandName} ({(b as any).companyName || b.name || 'Brand Owner'})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Start Date</label>
                  <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">End Date</label>
                  <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Priority Order</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold">
                  <option value="1">Priority #1 (Top Banner)</option>
                  <option value="2">Priority #2</option>
                  <option value="3">Priority #3</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-100 rounded-lg text-xs font-bold cursor-pointer">Cancel</button>
              <button onClick={() => { setShowAddModal(false); showToast('Featured campaign scheduled!'); }} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-blue-600">Activate Campaign</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteId}
        title="Remove Featured Spot"
        message="Are you sure you want to remove this entity from featured listings?"
        confirmText="Remove Spot"
        onConfirm={() => {
          showToast('Featured campaign removed.');
          setDeleteId(null);
        }}
        onCancel={() => setDeleteId(null)}
      />

      <UniversalExportModal 
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title={activeTab === 'BRANDS' ? 'Featured Brands Campaign Schedule' : 'Featured Franchise Buyers Campaign Schedule'}
        filenamePrefix={activeTab === 'BRANDS' ? 'Featured-Brands' : 'Featured-Buyers'}
        currentData={activeTab === 'BRANDS' ? featuredBrands : featuredSeekers}
        allData={activeTab === 'BRANDS' ? featuredBrands : featuredSeekers}
        fields={activeTab === 'BRANDS' ? featuredBrandFields : featuredSeekerFields}
      />
    </div>
  );
}
