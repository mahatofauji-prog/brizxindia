import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs';
import { ConfirmationModal } from '../../components/admin/ConfirmationModal';
import SeekerApplicationReviewModal from '../../components/admin/SeekerApplicationReviewModal';
import { RegistrationStatus, RejectionCategory } from '../../types';
import { 
  Users, Search, Filter, CheckCircle, Clock, MoreVertical, Download, 
  Upload, Trash2, Eye, Edit3, ShieldAlert, ArrowUpDown, ChevronLeft, 
  ChevronRight, X, UserPlus, MapPin, Briefcase, IndianRupee, Phone, Mail, FileText
} from 'lucide-react';
import UniversalExportModal from '../../components/admin/UniversalExportModal';
import { ExportField } from '../../lib/exportService';

const seekerFields: ExportField[] = [
  { label: 'Name', key: 'name' },
  { label: 'Email', key: 'email' },
  { label: 'Phone', key: 'phone' },
  { label: 'City', key: 'city' },
  { label: 'Industry Sector', key: 'industry' },
  { label: 'Investment Limit', key: 'investment', transform: (val) => `₹${val} Lakhs` },
  { label: 'Experience', key: 'experience' },
  { label: 'Verification Status', key: 'verified', transform: (val) => val ? 'Verified' : 'Pending' },
  { label: 'Registration Date', key: 'createdAt', transform: (val) => val ? String(val).split('T')[0] : 'N/A' },
];

export default function AdminSeekers() {
  const { user } = useAuth();
  const { seekers, verifySeeker, updateSeeker } = useData();

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortField, setSortField] = useState<'name' | 'investment' | 'createdAt'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Selected for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Modals state
  const [viewingSeeker, setViewingSeeker] = useState<any | null>(null);
  const [editingSeeker, setEditingSeeker] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApproveSeeker = (seekerId: string) => {
    updateSeeker(seekerId, {
      verified: true,
      applicationStatus: 'APPROVED',
      verifiedAt: new Date().toISOString(),
      reviewedBy: user?.name || 'Super Admin',
      rejectionReason: undefined
    });
    showToast(`Approved seeker application.`);
    setViewingSeeker(null);
  };

  const handleRejectSeeker = (seekerId: string, category: RejectionCategory, reason: string) => {
    updateSeeker(seekerId, {
      verified: false,
      applicationStatus: 'REJECTED',
      rejectionCategory: category,
      rejectionReason: reason,
      verifiedAt: new Date().toISOString(),
      reviewedBy: user?.name || 'Super Admin'
    });
    showToast(`Rejected seeker application (${category}).`);
    setViewingSeeker(null);
  };

  const handleStatusChangeSeeker = (seekerId: string, status: RegistrationStatus) => {
    updateSeeker(seekerId, {
      applicationStatus: status,
      verified: status === 'APPROVED'
    });
    showToast(`Updated seeker status to ${status.replace('_', ' ')}`);
    if (viewingSeeker && viewingSeeker.id === seekerId) {
      setViewingSeeker({ ...viewingSeeker, applicationStatus: status, verified: status === 'APPROVED' });
    }
  };

  // Industries list for filter
  const industries = Array.from(new Set(seekers.map(s => s.industry)));

  // Filter & Sort Logic
  const filteredSeekers = seekers.filter(seeker => {
    const matchesSearch = 
      (seeker.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (seeker.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (seeker.city || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (seeker.phone || '').includes(searchQuery);
    
    const matchesIndustry = industryFilter === 'ALL' || seeker.industry === industryFilter;
    const matchesStatus = 
      statusFilter === 'ALL' ||
      (statusFilter === 'VERIFIED' && seeker.verified) ||
      (statusFilter === 'PENDING' && !seeker.verified);

    return matchesSearch && matchesIndustry && matchesStatus;
  }).sort((a, b) => {
    let comparison = 0;
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'investment') {
      comparison = a.investment - b.investment;
    } else {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredSeekers.length / itemsPerPage) || 1;
  const paginatedSeekers = filteredSeekers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedSeekers.map(s => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkVerify = () => {
    selectedIds.forEach(id => verifySeeker(id));
    showToast(`Successfully verified ${selectedIds.length} franchise seekers.`);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    showToast(`Removed ${selectedIds.length} selected records.`);
    setSelectedIds([]);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSeeker) {
      updateSeeker(editingSeeker.id, editingSeeker);
      showToast(`Updated profile details for ${editingSeeker.name}`);
      setEditingSeeker(null);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-blue-700 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-indigo-700 animate-in fade-in slide-in-from-top-4">
          <CheckCircle size={18} className="text-blue-500" />
          <span className="text-xs font-bold uppercase tracking-wider">{toastMessage}</span>
        </div>
      )}

      <AdminBreadcrumbs items={[{ label: 'Super Admin', path: '/admin' }, { label: 'Franchise Seekers' }]} />

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-indigo-950 mb-2 font-heading flex items-center gap-3">
            <Users size={32} className="text-blue-600" /> Franchise Seeker Management
          </h1>
          <p className="text-slate-600">Verify, monitor, and manage high-intent franchise buyers across India.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setShowBulkUpload(true)}
            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Upload size={14} className="text-slate-500" /> Bulk Import
          </button>
          <button 
            onClick={() => setIsExportOpen(true)}
            className="px-5 py-2.5 bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-800 transition-all shadow-md shadow-indigo-200 flex items-center gap-2 cursor-pointer"
          >
            <Download size={14} /> Export Directory
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center shrink-0">
        <div className="relative flex-1 w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, email, city, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Filter size={14} className="text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Industry:</span>
            <select 
              value={industryFilter} 
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-blue-700 outline-none cursor-pointer"
            >
              <option value="ALL">All Industries</option>
              {industries.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status:</span>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-blue-700 outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED">Verified Only</option>
              <option value="PENDING">Pending Only</option>
            </select>
          </div>

          <button 
            onClick={() => {
              setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
            }}
            className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-1.5 cursor-pointer"
            title="Sort direction"
          >
            <ArrowUpDown size={14} /> {sortDirection.toUpperCase()}
          </button>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 px-6 mb-4 flex items-center justify-between shrink-0 animate-in fade-in">
          <span className="text-xs font-bold text-blue-700">
            {selectedIds.length} Franchise Seeker(s) Selected
          </span>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleBulkVerify}
              className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-green-700 transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle size={14} /> Bulk Verify
            </button>
            <button 
              onClick={handleBulkDelete}
              className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 size={14} /> Bulk Delete
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col overflow-hidden min-h-0">
        <div className="overflow-x-auto flex-1 min-w-[900px]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/90 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200">
              <tr>
                <th className="py-4 px-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.length === paginatedSeekers.length && paginatedSeekers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Seeker Name & Contact</th>
                <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Location & Industry</th>
                <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Investment Budget</th>
                <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Verification Status</th>
                <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Joined Date</th>
                <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSeekers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <Users size={40} className="mx-auto mb-3 opacity-30 text-blue-700" />
                    <p className="text-sm font-bold text-slate-600">No Franchise Seekers Found</p>
                    <p className="text-xs text-slate-400">Try refining your search query or clear active filters.</p>
                  </td>
                </tr>
              ) : (
                paginatedSeekers.map((seeker) => {
                  const isSelected = selectedIds.includes(seeker.id);
                  return (
                    <tr 
                      key={seeker.id} 
                      className={`border-b border-slate-100 transition-colors group ${isSelected ? 'bg-blue-50/40' : 'hover:bg-slate-50/60'}`}
                    >
                      <td className="py-4 px-4 text-center">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => handleSelectOne(seeker.id)}
                          className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 overflow-hidden">
                            {seeker.avatar ? (
                              <img src={seeker.avatar} alt={seeker.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              seeker.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-indigo-950 flex items-center gap-2">
                              {seeker.name}
                              {seeker.isPremium && (
                                <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase">
                                  PRO
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500">{seeker.email} • {seeker.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          <MapPin size={12} className="text-slate-400" /> {seeker.city}
                        </div>
                        <div className="text-xs text-slate-500 font-semibold">{seeker.industry}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-xs font-black text-blue-700 bg-blue-50/80 px-2.5 py-1 rounded-lg border border-blue-100 w-fit">
                          ₹{seeker.investment} Lakhs
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {seeker.verified ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold text-green-700 bg-green-50 border border-green-100">
                            <CheckCircle size={13} /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100">
                            <Clock size={13} /> Pending
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-xs font-semibold text-slate-500">
                        {new Date(seeker.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => setViewingSeeker(seeker)}
                            className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => setEditingSeeker(seeker)}
                            className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Seeker"
                          >
                            <Edit3 size={16} />
                          </button>
                          {!seeker.verified && (
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => {
                                  verifySeeker(seeker.id);
                                  updateSeeker(seeker.id, { verified: true, applicationStatus: 'APPROVED' } as any);
                                  showToast(`Verified & Approved ${seeker.name}`);
                                }}
                                className="px-2.5 py-1 bg-emerald-600 text-white rounded-md text-[10px] font-bold uppercase hover:bg-emerald-700 transition-colors cursor-pointer"
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => {
                                  const reason = prompt('Enter rejection reason for ' + seeker.name) || 'Documents incomplete.';
                                  updateSeeker(seeker.id, { verified: false, applicationStatus: 'REJECTED', rejectionReason: reason } as any);
                                  showToast(`Rejected ${seeker.name}`);
                                }}
                                className="px-2.5 py-1 bg-rose-100 text-rose-700 rounded-md text-[10px] font-bold uppercase hover:bg-rose-200 transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                          <button 
                            onClick={() => setDeleteConfirmId(seeker.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Seeker"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Pagination */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
          <span className="text-xs font-semibold text-slate-500">
            Showing <span className="font-bold text-blue-700">{paginatedSeekers.length}</span> of <span className="font-bold text-blue-700">{filteredSeekers.length}</span> Franchise Seekers
          </span>

          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold text-blue-700 px-3">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* View & Review Seeker Profile Modal */}
      <SeekerApplicationReviewModal
        seeker={viewingSeeker}
        isOpen={!!viewingSeeker}
        onClose={() => setViewingSeeker(null)}
        onApprove={handleApproveSeeker}
        onReject={handleRejectSeeker}
        onStatusChange={handleStatusChangeSeeker}
      />

      {/* Edit Profile Drawer / Modal */}
      {editingSeeker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <form onSubmit={handleSaveEdit} className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border border-slate-100 relative">
            <button 
              type="button"
              onClick={() => setEditingSeeker(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="text-2xl font-black text-indigo-950 font-heading mb-6">Edit Seeker Profile</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Full Name</label>
                <input 
                  type="text" 
                  value={editingSeeker.name}
                  onChange={(e) => setEditingSeeker({ ...editingSeeker, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Email</label>
                  <input 
                    type="email" 
                    value={editingSeeker.email}
                    onChange={(e) => setEditingSeeker({ ...editingSeeker, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Phone</label>
                  <input 
                    type="text" 
                    value={editingSeeker.phone}
                    onChange={(e) => setEditingSeeker({ ...editingSeeker, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">City</label>
                  <input 
                    type="text" 
                    value={editingSeeker.city}
                    onChange={(e) => setEditingSeeker({ ...editingSeeker, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Investment (₹ Lakhs)</label>
                  <input 
                    type="number" 
                    value={editingSeeker.investment}
                    onChange={(e) => setEditingSeeker({ ...editingSeeker, investment: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
              <button 
                type="button"
                onClick={() => setEditingSeeker(null)}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-100 relative">
            <button 
              onClick={() => setShowBulkUpload(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="text-2xl font-black text-indigo-950 font-heading mb-2">Bulk Upload Seekers</h3>
            <p className="text-xs text-slate-500 mb-6">Upload an Excel or CSV file to import multiple franchise leads at once.</p>

            <div className="border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-2xl p-8 text-center mb-6">
              <Upload size={40} className="mx-auto text-blue-600 mb-3 opacity-80" />
              <p className="text-sm font-bold text-blue-700 mb-1">Drag & Drop CSV/Excel File Here</p>
              <p className="text-xs text-slate-500 mb-4">Maximum file size: 10MB (.csv, .xlsx)</p>
              <button 
                onClick={() => {
                  setShowBulkUpload(false);
                  showToast('Bulk import processed! 12 new franchise seekers added.');
                }}
                className="px-6 py-2.5 bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer hover:bg-blue-800"
              >
                Browse Files
              </button>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 border-t border-slate-100 pt-4">
              <a href="#" className="text-blue-600 font-bold hover:underline flex items-center gap-1">
                <FileText size={14} /> Download Sample CSV Template
              </a>
              <button 
                onClick={() => setShowBulkUpload(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold uppercase tracking-wider rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteConfirmId}
        title="Delete Seeker Profile"
        message="Are you sure you want to permanently delete this franchise seeker profile? This action cannot be undone."
        confirmText="Delete Profile"
        onConfirm={() => {
          showToast('Franchise seeker profile deleted.');
          setDeleteConfirmId(null);
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />

      <UniversalExportModal 
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title="Franchise Seekers"
        filenamePrefix="Franchise-Seekers"
        currentData={filteredSeekers}
        allData={seekers}
        fields={seekerFields}
      />
    </div>
  );
}
