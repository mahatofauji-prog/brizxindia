import React, { useState } from 'react';
import { Link } from 'react-router';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs';
import { ConfirmationModal } from '../../components/admin/ConfirmationModal';
import BrandApplicationReviewModal from '../../components/admin/BrandApplicationReviewModal';
import { RegistrationStatus, RejectionCategory } from '../../types';
import { 
  Building2, Search, Filter, ShieldCheck, Star, Edit3, Trash2, Eye, 
  CheckCircle, XCircle, AlertTriangle, ArrowUpDown, ChevronLeft, ChevronRight, 
  X, Download, Plus, MapPin, IndianRupee, Layers, FileText, Ban, Loader2, FileSpreadsheet
} from 'lucide-react';
import UniversalExportModal from '../../components/admin/UniversalExportModal';
import { ExportField } from '../../lib/exportService';

const brandDirectoryFields: ExportField[] = [
  { label: 'Brand Name', key: 'brandName' },
  { label: 'Company Name', key: 'companyName', transform: (val, r) => val || r.name || 'N/A' },
  { label: 'Industry Sector', key: 'industry' },
  { label: 'Investment Range (Lakhs)', key: 'investmentRequired', transform: (val: any) => val ? `₹${val.min}-${val.max}L` : 'N/A' },
  { label: 'Total Outlets', key: 'totalOutlets' },
  { label: 'Subscription Plan', key: 'subscriptionTier' },
  { label: 'Verification Status', key: 'verified', transform: (val: any) => val ? 'Verified' : 'Pending' },
  { label: 'Featured', key: 'featured', transform: (val: any) => val ? 'Featured' : 'Standard' },
];

const brandApprovalFields: ExportField[] = [
  { label: 'Brand Name', key: 'brandName' },
  { label: 'Submitted Date', key: 'submittedAt', transform: (val) => val ? String(val).split('T')[0] : 'N/A' },
  { label: 'Verification Status', key: 'status' },
  { label: 'Approval Status', key: 'status', transform: (val) => val === 'APPROVED' ? 'Approved' : val === 'REJECTED' ? 'Rejected' : 'Pending Review' },
  { label: 'Reviewer', key: 'reviewer', transform: () => 'Super Admin' },
  { label: 'Review Date', key: 'updatedAt', transform: (val) => val ? String(val).split('T')[0] : 'N/A' },
];

const brandCategoryFields: ExportField[] = [
  { label: 'Category Name', key: 'categoryName' },
  { label: 'Sectors Covered', key: 'sectors' },
  { label: 'Associated Brands Count', key: 'associatedBrandsCount' },
  { label: 'Status', key: 'status' },
];

const brandLocationFields: ExportField[] = [
  { label: 'Brand Name', key: 'brandName' },
  { label: 'City', key: 'city' },
  { label: 'State', key: 'state' },
  { label: 'Territory', key: 'territory' },
  { label: 'Availability', key: 'availability' },
  { label: 'Status', key: 'status' },
];

export default function AdminBrands() {
  const { user } = useAuth();
  const { brands, updateBrand, verificationRequests } = useData();

  const [activeTab, setActiveTab] = useState<'ALL_BRANDS' | 'APPROVALS' | 'PENDING_REGISTRATIONS'>('ALL_BRANDS');
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('ALL');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Selected for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportModalProps, setExportModalProps] = useState<any>({
    title: '',
    filenamePrefix: '',
    currentData: [],
    allData: [],
    fields: []
  });

  const handleTriggerExport = (type: 'DIRECTORY' | 'CATEGORIES' | 'LOCATIONS' | 'APPROVALS') => {
    if (type === 'DIRECTORY') {
      setExportModalProps({
        title: 'Brand Directory',
        filenamePrefix: 'Brand-Directory',
        currentData: filteredBrands,
        allData: brands,
        fields: brandDirectoryFields
      });
    } else if (type === 'CATEGORIES') {
      const derivedCategories = Array.from(new Set(brands.map(b => b.industry))).map((ind, index) => {
        const count = brands.filter(b => b.industry === ind).length;
        return { categoryName: ind, sectors: ind, associatedBrandsCount: count, status: 'Active' };
      });
      setExportModalProps({
        title: 'Brand Categories',
        filenamePrefix: 'Brand-Categories',
        currentData: derivedCategories,
        allData: derivedCategories,
        fields: brandCategoryFields
      });
    } else if (type === 'LOCATIONS') {
      const derivedLocations = brands.map(brand => {
        const locStr = (brand as any).brandLocation || brand.city || 'Pan India';
        const parts = locStr.split(',');
        return {
          brandName: brand.brandName,
          city: parts[0]?.trim() || 'Pan India',
          state: parts[1]?.trim() || 'All States',
          territory: 'National',
          availability: 'Open',
          status: 'Active'
        };
      });
      setExportModalProps({
        title: 'Brand Locations',
        filenamePrefix: 'Brand-Locations',
        currentData: derivedLocations,
        allData: derivedLocations,
        fields: brandLocationFields
      });
    } else if (type === 'APPROVALS') {
      setExportModalProps({
        title: 'Brand Approvals Queue',
        filenamePrefix: 'Brand-Approvals',
        currentData: verificationRequests,
        allData: verificationRequests,
        fields: brandApprovalFields
      });
    }
    setIsExportOpen(true);
  };

  // Modals state
  const [viewingBrand, setViewingBrand] = useState<any | null>(null);
  const [editingBrand, setEditingBrand] = useState<any | null>(null);
  const [suspendConfirmId, setSuspendConfirmId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const industries = Array.from(new Set(brands.map(b => b.industry)));

  // Filter logic
  const filteredBrands = brands.filter(brand => {
    const brandName = brand.brandName || '';
    const companyName = (brand as any).companyName || brand.name || '';
    const industry = brand.industry || '';

    const matchesSearch = 
      brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      industry.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesIndustry = industryFilter === 'ALL' || brand.industry === industryFilter;
    const matchesTier = tierFilter === 'ALL' || brand.subscriptionTier === tierFilter;

    return matchesSearch && matchesIndustry && matchesTier;
  });

  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage) || 1;
  const paginatedBrands = filteredBrands.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleFeatured = (id: string, currentStatus?: boolean) => {
    updateBrand(id, { featured: !currentStatus });
    showToast(`Updated featured status for brand.`);
  };

  const handleBulkFeature = () => {
    selectedIds.forEach(id => updateBrand(id, { featured: true }));
    showToast(`Marked ${selectedIds.length} brands as Featured.`);
    setSelectedIds([]);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBrand) {
      updateBrand(editingBrand.id, editingBrand);
      showToast(`Updated brand details for ${editingBrand.brandName}`);
      setEditingBrand(null);
    }
  };

  const handleApproveBrand = async (brandId: string) => {
    if (!brandId) return;
    if (isProcessing) return;
    setIsProcessing(brandId);
    try {
      const approvalData = {
        verified: true,
        applicationStatus: 'APPROVED' as RegistrationStatus,
        verifiedAt: new Date().toISOString(),
        reviewedBy: user?.name || 'Super Admin',
        rejectionReason: '',
        rejectionCategory: undefined
      };
      await updateBrand(brandId, approvalData);
      showToast(`Approved brand application.`);
      if (viewingBrand && viewingBrand.id === brandId) {
        setViewingBrand(prev => prev ? { ...prev, ...approvalData } : null);
      }
    } catch (err: any) {
      console.error("Approve brand error:", err);
      alert(`Approval failed: ${err?.message || 'Firestore connection issue.'}`);
      throw err;
    } finally {
      setIsProcessing(null);
    }
  };

  const handleRejectBrand = async (brandId: string, category: RejectionCategory, reason: string) => {
    if (!brandId) return;
    if (isProcessing) return;
    setIsProcessing(brandId);
    try {
      const rejectionData = {
        verified: false,
        applicationStatus: 'REJECTED' as RegistrationStatus,
        rejectionCategory: category,
        rejectionReason: reason,
        verifiedAt: new Date().toISOString(),
        reviewedBy: user?.name || 'Super Admin'
      };
      await updateBrand(brandId, rejectionData);
      showToast(`Rejected brand application (${category}).`);
      if (viewingBrand && viewingBrand.id === brandId) {
        setViewingBrand(prev => prev ? { ...prev, ...rejectionData } : null);
      }
    } catch (err: any) {
      console.error("Reject brand error:", err);
      alert(`Rejection failed: ${err?.message || 'Firestore connection issue.'}`);
      throw err;
    } finally {
      setIsProcessing(null);
    }
  };

  const handleStatusChangeBrand = async (brandId: string, status: RegistrationStatus) => {
    if (!brandId) return;
    if (isProcessing) return;
    setIsProcessing(brandId);
    try {
      const isApproved = status === 'APPROVED' || status === 'approved';
      const statusData = {
        applicationStatus: status,
        verified: isApproved,
        ...(isApproved ? { verifiedAt: new Date().toISOString(), reviewedBy: user?.name || 'Super Admin' } : {})
      };
      await updateBrand(brandId, statusData);
      showToast(`Updated status to ${status.replace('_', ' ')}`);
      if (viewingBrand && viewingBrand.id === brandId) {
        setViewingBrand(prev => prev ? { ...prev, ...statusData } : null);
      }
    } catch (err: any) {
      console.error("Status change error:", err);
      alert(`Status update failed: ${err?.message || 'Firestore connection issue.'}`);
      throw err;
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-blue-700 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-indigo-700 animate-in fade-in">
          <CheckCircle size={18} className="text-blue-500" />
          <span className="text-xs font-bold uppercase tracking-wider">{toastMessage}</span>
        </div>
      )}

      <AdminBreadcrumbs items={[{ label: 'Super Admin', path: '/admin' }, { label: 'Brand Management' }]} />

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-indigo-950 mb-2 font-heading flex items-center gap-3">
            <Building2 size={32} className="text-blue-500" /> Brand Directory & Approvals
          </h1>
          <p className="text-slate-600">Review brand listings, manage featured spots, and audit subscription statuses.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link 
            to="/admin/bulk-brands"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet size={14} /> Bulk Brand Listing
          </Link>

          {activeTab === 'ALL_BRANDS' ? (
            <>
              <button 
                onClick={() => handleTriggerExport('DIRECTORY')}
                className="px-4 py-2 bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-800 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Download size={13} /> Export Directory
              </button>
              <button 
                onClick={() => handleTriggerExport('CATEGORIES')}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Layers size={13} className="text-blue-500" /> Export Categories
              </button>
              <button 
                onClick={() => handleTriggerExport('LOCATIONS')}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <MapPin size={13} className="text-emerald-500" /> Export Locations
              </button>
            </>
          ) : (
            <button 
              onClick={() => handleTriggerExport('APPROVALS')}
              className="px-4 py-2 bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-800 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={13} /> Export Approvals Queue
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 shrink-0 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('ALL_BRANDS')}
          className={`pb-4 px-4 text-xs font-bold uppercase tracking-wider transition-colors relative cursor-pointer ${activeTab === 'ALL_BRANDS' ? 'text-indigo-950 font-black' : 'text-slate-400 hover:text-slate-600'}`}
        >
          All Active Brands ({brands.length})
          {activeTab === 'ALL_BRANDS' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('PENDING_REGISTRATIONS')}
          className={`pb-4 px-4 text-xs font-bold uppercase tracking-wider transition-colors relative cursor-pointer flex items-center gap-2 ${activeTab === 'PENDING_REGISTRATIONS' ? 'text-indigo-950 font-black' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Pending Brand Applications
          <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
            {brands.filter(b => b.brandOrigin === 'new_registration' && (b.applicationStatus === 'PENDING_REVIEW' || b.applicationStatus === 'UNDER_REVIEW')).length}
          </span>
          {activeTab === 'PENDING_REGISTRATIONS' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('APPROVALS')}
          className={`pb-4 px-4 text-xs font-bold uppercase tracking-wider transition-colors relative cursor-pointer flex items-center gap-2 ${activeTab === 'APPROVALS' ? 'text-indigo-950 font-black' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Brand Compliance Audits Queue
          <span className="bg-blue-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
            {verificationRequests.length}
          </span>
          {activeTab === 'APPROVALS' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
        </button>
      </div>

      {activeTab === 'ALL_BRANDS' ? (
        <>
          {/* Filter Toolbar */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center shrink-0">
            <div className="relative flex-1 w-full md:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by brand name, company name..."
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
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tier:</span>
                <select 
                  value={tierFilter} 
                  onChange={(e) => setTierFilter(e.target.value)}
                  className="bg-transparent text-xs font-bold text-blue-700 outline-none cursor-pointer"
                >
                  <option value="ALL">All Plans</option>
                  <option value="STARTER">Starter</option>
                  <option value="PROFESSIONAL">Professional</option>
                  <option value="ENTERPRISE">Enterprise</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bulk Action Bar */}
          {selectedIds.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 px-6 mb-4 flex items-center justify-between shrink-0 animate-in fade-in">
              <span className="text-xs font-bold text-blue-700">
                {selectedIds.length} Brand(s) Selected
              </span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleBulkFeature}
                  className="px-4 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-blue-600 transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Star size={14} /> Mark Featured
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
                        checked={selectedIds.length === paginatedBrands.length && paginatedBrands.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedIds(paginatedBrands.map(b => b.id));
                          else setSelectedIds([]);
                        }}
                        className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </th>
                    <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Brand Name & Company</th>
                    <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Industry & Outlets</th>
                    <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Investment Required</th>
                    <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Subscription Tier</th>
                    <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Featured Spot</th>
                    <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBrands.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center text-slate-400">
                        <Building2 size={40} className="mx-auto mb-3 opacity-30 text-blue-700" />
                        <p className="text-sm font-bold text-slate-600">No Brands Found</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedBrands.map((brand) => {
                      const isSelected = selectedIds.includes(brand.id);
                      return (
                        <tr key={brand.id} className={`border-b border-slate-100 transition-colors group ${isSelected ? 'bg-blue-50/40' : 'hover:bg-slate-50/60'}`}>
                          <td className="py-4 px-4 text-center">
                            <input 
                              type="checkbox" 
                              checked={isSelected}
                              onChange={() => setSelectedIds(prev => prev.includes(brand.id) ? prev.filter(i => i !== brand.id) : [...prev, brand.id])}
                              className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                                {brand.brandName.charAt(0)}
                              </div>
                              <div>
                                <div className="text-sm font-bold text-indigo-950 flex items-center gap-2">
                                  {brand.brandName}
                                  {brand.verified && (
                                    <span title="Verified Brand">
                                      <ShieldCheck size={14} className="text-blue-600" />
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-slate-500">{(brand as any).companyName || brand.name || 'Brand Owner'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-xs font-bold text-slate-800">{brand.industry}</div>
                            <div className="text-xs text-slate-500 font-semibold">{brand.totalOutlets} Outlets Nationwide</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-xs font-black text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 w-fit">
                              ₹{brand.investmentRequired.min}-{brand.investmentRequired.max}L
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase ${
                              brand.subscriptionTier === 'ENTERPRISE' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                              brand.subscriptionTier === 'PROFESSIONAL' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                              'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}>
                              {brand.subscriptionTier || 'STARTER'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <button 
                              onClick={() => toggleFeatured(brand.id, (brand as any).featured)}
                              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                (brand as any).featured ? 'bg-blue-500 text-white shadow-xs' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                              }`}
                            >
                              <Star size={12} fill={(brand as any).featured ? 'currentColor' : 'none'} />
                              {(brand as any).featured ? 'Featured' : 'Standard'}
                            </button>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button 
                                onClick={() => setViewingBrand(brand)}
                                className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                title="View Brand Profile"
                              >
                                <Eye size={16} />
                              </button>
                              <button 
                                onClick={() => setEditingBrand(brand)}
                                className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                title="Edit Brand Info"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button 
                                onClick={() => setSuspendConfirmId(brand.id)}
                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                title="Suspend Brand"
                              >
                                <Ban size={16} />
                              </button>
                              <button 
                                onClick={() => setDeleteConfirmId(brand.id)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete Brand"
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

            {/* Pagination */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
              <span className="text-xs font-semibold text-slate-500">
                Showing <span className="font-bold text-blue-700">{paginatedBrands.length}</span> of <span className="font-bold text-blue-700">{filteredBrands.length}</span> Brands
              </span>

              <div className="flex items-center gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-bold text-blue-700 px-3">Page {currentPage} of {totalPages}</span>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </>
      ) : activeTab === 'APPROVALS' ? (
        /* Approvals Queue Tab */
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex-1 flex flex-col min-h-0">
          <h3 className="text-lg font-black text-indigo-950 font-heading mb-4">Pending Brand Verification Requests</h3>
          <div className="space-y-4 overflow-y-auto flex-1">
            {verificationRequests.map((req) => (
              <div key={req.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-base text-indigo-950">{req.brandName}</span>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded uppercase">
                      Status: {req.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Requested on {new Date(req.submittedAt).toLocaleDateString()} • {req.notes}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    disabled={!!isProcessing}
                    onClick={async () => {
                      const targetId = (req as any).brandId || req.id;
                      setIsProcessing(targetId);
                      try {
                        await updateBrand(targetId, {
                          verified: true,
                          applicationStatus: 'APPROVED',
                          verifiedAt: new Date().toISOString(),
                          reviewedBy: user?.name || 'Super Admin'
                        } as any);
                        showToast(`Approved brand verification for ${req.brandName}`);
                      } catch (err: any) {
                        console.error("Approve brand verification error:", err);
                        alert(`Approval failed: ${err?.message || 'Firestore connection issue.'}`);
                      } finally {
                        setIsProcessing(null);
                      }
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs cursor-pointer flex items-center gap-1.5 ${
                      isProcessing === ((req as any).brandId || req.id)
                        ? 'bg-emerald-700 text-white cursor-wait opacity-80'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-55'
                    }`}
                  >
                    {isProcessing === ((req as any).brandId || req.id) ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Approving...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={14} /> Approve Brand
                      </>
                    )}
                  </button>
                  <button 
                    disabled={!!isProcessing}
                    onClick={async () => {
                      const reason = prompt('Enter rejection reason for ' + req.brandName) || 'Registration documents incomplete.';
                      const targetId = (req as any).brandId || req.id;
                      setIsProcessing(targetId);
                      try {
                        await updateBrand(targetId, {
                          verified: false,
                          applicationStatus: 'REJECTED',
                          rejectionReason: reason,
                          verifiedAt: new Date().toISOString(),
                          reviewedBy: user?.name || 'Super Admin'
                        } as any);
                        showToast(`Rejected verification request for ${req.brandName}`);
                      } catch (err: any) {
                        console.error("Reject brand verification error:", err);
                        alert(`Rejection failed: ${err?.message || 'Firestore connection issue.'}`);
                      } finally {
                        setIsProcessing(null);
                      }
                    }}
                    className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-55 cursor-pointer flex items-center gap-1.5"
                  >
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Pending Applications Tab */
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex-1 flex flex-col min-h-0">
          <h3 className="text-lg font-black text-indigo-950 font-heading mb-4">Pending New Brand Applications</h3>
          <p className="text-xs text-slate-500 mb-4 font-semibold">These are newly registered brands waiting for Owner/Super Admin approval before they can be listed publicly on the platform.</p>
          <div className="space-y-4 overflow-y-auto flex-1">
            {brands.filter(b => b.brandOrigin === 'new_registration' && (b.applicationStatus === 'PENDING_REVIEW' || b.applicationStatus === 'UNDER_REVIEW')).length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <CheckCircle size={40} className="mx-auto mb-3 opacity-30 text-emerald-600" />
                <p className="text-sm font-bold text-slate-600">No Pending Applications</p>
                <p className="text-xs text-slate-400 mt-1">All newly registered brands have been processed.</p>
              </div>
            ) : (
              brands.filter(b => b.brandOrigin === 'new_registration' && (b.applicationStatus === 'PENDING_REVIEW' || b.applicationStatus === 'UNDER_REVIEW')).map((brand) => (
                <div key={brand.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-base text-indigo-950">{brand.brandName}</span>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded uppercase">
                        Status: {brand.applicationStatus}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium space-y-1">
                      <p>Company: <span className="font-bold text-slate-700">{brand.companyName || brand.brandName}</span> • Sector: <span className="font-bold text-slate-700">{brand.industry}</span></p>
                      <p>Owner Email: <span className="text-blue-700 font-semibold">{brand.email}</span> • Contact: <span className="text-slate-700">{brand.phone || brand.contactPhone || 'N/A'}</span></p>
                      <p>Submitted On: <span className="font-semibold text-slate-600">{brand.submittedAt ? new Date(brand.submittedAt).toLocaleDateString() : 'N/A'}</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setViewingBrand(brand)}
                      className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Eye size={14} /> Review Application
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* View & Review Brand Application Modal */}
      <BrandApplicationReviewModal
        brand={viewingBrand}
        isOpen={!!viewingBrand}
        onClose={() => setViewingBrand(null)}
        onApprove={handleApproveBrand}
        onReject={handleRejectBrand}
        onStatusChange={handleStatusChangeBrand}
      />

      {/* Edit Brand Modal */}
      {editingBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <form onSubmit={handleSaveEdit} className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border border-slate-100 relative">
            <button 
              type="button"
              onClick={() => setEditingBrand(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="text-2xl font-black text-indigo-950 font-heading mb-6">Edit Brand Listing</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Brand Name</label>
                <input 
                  type="text" 
                  value={editingBrand.brandName}
                  onChange={(e) => setEditingBrand({ ...editingBrand, brandName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Company Name</label>
                <input 
                  type="text" 
                  value={editingBrand.companyName}
                  onChange={(e) => setEditingBrand({ ...editingBrand, companyName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Industry</label>
                  <input 
                    type="text" 
                    value={editingBrand.industry}
                    onChange={(e) => setEditingBrand({ ...editingBrand, industry: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Subscription Tier</label>
                  <select 
                    value={editingBrand.subscriptionTier}
                    onChange={(e) => setEditingBrand({ ...editingBrand, subscriptionTier: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="STARTER">STARTER</option>
                    <option value="PROFESSIONAL">PROFESSIONAL</option>
                    <option value="ENTERPRISE">ENTERPRISE</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button 
                type="button"
                onClick={() => setEditingBrand(null)}
                className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-2.5 bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:bg-blue-800"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={!!suspendConfirmId}
        title="Suspend Brand Account"
        message="Are you sure you want to suspend this brand account? The brand will be temporarily hidden from franchise search results."
        confirmText="Suspend Brand"
        variant="warning"
        onConfirm={() => {
          showToast('Brand account suspended.');
          setSuspendConfirmId(null);
        }}
        onCancel={() => setSuspendConfirmId(null)}
      />

      <ConfirmationModal
        isOpen={!!deleteConfirmId}
        title="Delete Brand Listing"
        message="Are you sure you want to permanently delete this brand listing? All CRM data and lead unlocks associated with this brand will be removed."
        confirmText="Delete Brand"
        onConfirm={() => {
          showToast('Brand listing removed.');
          setDeleteConfirmId(null);
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />

      <UniversalExportModal 
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title={exportModalProps.title}
        filenamePrefix={exportModalProps.filenamePrefix}
        currentData={exportModalProps.currentData}
        allData={exportModalProps.allData}
        fields={exportModalProps.fields}
      />
    </div>
  );
}
