import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs';
import { uploadFile } from '../../lib/firebaseUpload';
import { Brand } from '../../types';
import { 
  Building2, Plus, Trash2, Copy, Upload, Image as ImageIcon,
  CheckCircle2, AlertCircle, XCircle, AlertTriangle, Save,
  RefreshCw, ArrowLeft, Search, Filter, Eye, ExternalLink,
  ShieldCheck, Layers, IndianRupee, Sparkles, HelpCircle,
  FileSpreadsheet, Check, X, ChevronRight, Loader2
} from 'lucide-react';

export interface BulkBrandRow {
  _rowId: string;
  _rowNumber: number;
  // Brand Information
  brandName: string;
  industry: string;
  category: string;
  tagline: string;
  description: string;
  fullAbout: string;
  founder: string;
  establishedYear: string;
  headquarters: string;
  
  // Investment Information
  minInvestment: string;
  maxInvestment: string;
  franchiseFee: string;
  royaltyFee: string;
  roiPayback: string;
  spaceRequired: string;
  totalOutlets: string;

  // Business Information
  targetCustomer: string;
  expansionOpportunity: string;
  businessModel: string;
  keyAdvantages: string;

  // Contact Information
  contactPhone: string;
  contactEmail: string;
  website: string;

  // Images (files or urls)
  logoFile?: File | null;
  logoPreview?: string;
  coverImageFile?: File | null;
  coverImagePreview?: string;
  heroImage2File?: File | null;
  heroImage2Preview?: string;
  heroImage3File?: File | null;
  heroImage3Preview?: string;
  heroImage4File?: File | null;
  heroImage4Preview?: string;

  // Status flags
  saveStatus?: 'PENDING' | 'SAVING' | 'SAVED' | 'SKIPPED' | 'FAILED';
  saveMessage?: string;
  savedBrandId?: string;
}

const INDUSTRY_OPTIONS = [
  'Food & Beverages',
  'Retail',
  'Healthcare & Wellness',
  'Education & EdTech',
  'Fitness & Sports',
  'Automotive & EV',
  'Services & Logistics',
  'Beauty & Personal Care',
  'Fashion & Apparel',
  'Entertainment & Gaming',
  'Hospitality & Travel'
];

const createEmptyRow = (rowNumber: number): BulkBrandRow => ({
  _rowId: 'row_' + Math.random().toString(36).substring(2, 9),
  _rowNumber: rowNumber,
  brandName: '',
  industry: 'Food & Beverages',
  category: '',
  tagline: '',
  description: '',
  fullAbout: '',
  founder: '',
  establishedYear: String(new Date().getFullYear() - 2),
  headquarters: 'Mumbai, Maharashtra',
  minInvestment: '15',
  maxInvestment: '30',
  franchiseFee: '5',
  royaltyFee: '5% Gross Sales',
  roiPayback: '12-18 Months',
  spaceRequired: '300-600 sq ft',
  totalOutlets: '10',
  targetCustomer: 'Urban professionals, students, and families',
  expansionOpportunity: 'Tier 1 & Tier 2 Cities Across India',
  businessModel: 'FOFO / Turnkey Model',
  keyAdvantages: 'Proven unit economics, Central supply chain, Turnkey store setup',
  contactPhone: '+91 98765 43210',
  contactEmail: '',
  website: '',
  logoPreview: '',
  coverImagePreview: '',
  heroImage2Preview: '',
  heroImage3Preview: '',
  heroImage4Preview: '',
  saveStatus: 'PENDING'
});

export default function AdminBulkBrandListing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { brands, saveBulkBrands } = useData();

  // Initial spreadsheet rows (start with 3 editable clean rows)
  const [rows, setRows] = useState<BulkBrandRow[]>(() => [
    createEmptyRow(1),
    createEmptyRow(2),
    createEmptyRow(3)
  ]);

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [saveProgress, setSaveProgress] = useState<{ current: number; total: number; stage: string }>({ current: 0, total: 0, stage: '' });
  
  // Results summary modal
  const [resultsSummary, setResultsSummary] = useState<{
    show: boolean;
    total: number;
    saved: number;
    skipped: number;
    failed: number;
    details: Array<{ rowNumber: number; brandName: string; status: 'SAVED' | 'SKIPPED' | 'FAILED'; message: string; brandId?: string }>;
  } | null>(null);

  // Hidden file inputs for image upload cells
  const fileInputRef = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Normalize brand name for duplicate matching
  const normalizeName = (name: string) => name.trim().toLowerCase();

  // Existing database brand names map
  const existingNamesSet = useMemo(() => {
    return new Set(brands.map(b => normalizeName(b.brandName || '')));
  }, [brands]);

  // Validation function per row
  const evaluateRowStatus = (row: BulkBrandRow, allRows: BulkBrandRow[]) => {
    const rawName = (row.brandName || '').trim();
    if (!rawName && !row.category && !row.tagline && (!row.minInvestment || row.minInvestment === '15')) {
      return { status: 'EMPTY', text: 'Empty Row', color: 'slate' };
    }

    if (!rawName) {
      return { status: 'INVALID', text: '⚠ Missing Brand Name', color: 'amber' };
    }

    const norm = normalizeName(rawName);

    // Duplicate in existing database
    if (existingNamesSet.has(norm)) {
      return { status: 'DUPLICATE_DB', text: 'ALREADY LISTED — SKIPPED', color: 'rose' };
    }

    // Duplicate in current table
    const dupesInTable = allRows.filter(r => r._rowId !== row._rowId && normalizeName(r.brandName || '') === norm);
    if (dupesInTable.length > 0) {
      return { status: 'DUPLICATE_TABLE', text: '❌ Duplicate in Sheet', color: 'rose' };
    }

    if (!row.industry) {
      return { status: 'INVALID', text: '⚠ Missing Industry', color: 'amber' };
    }

    const min = Number(row.minInvestment);
    const max = Number(row.maxInvestment);
    if (isNaN(min) || min <= 0 || isNaN(max) || max <= 0) {
      return { status: 'INVALID', text: '⚠ Invalid Investment', color: 'amber' };
    }

    if (max < min) {
      return { status: 'INVALID', text: '⚠ Max Inv < Min Inv', color: 'amber' };
    }

    if (!row.logoPreview && !row.logoFile) {
      return { status: 'WARNING', text: '⚠ Default Logo (Logo Missing)', color: 'blue' };
    }

    return { status: 'READY', text: '✓ READY TO SAVE', color: 'emerald' };
  };

  // Row manipulation methods
  const handleAddRow = () => {
    setRows(prev => [...prev, createEmptyRow(prev.length + 1)]);
  };

  const handleAddMultipleRows = (count: number = 5) => {
    setRows(prev => {
      const newBatch: BulkBrandRow[] = [];
      for (let i = 0; i < count; i++) {
        newBatch.push(createEmptyRow(prev.length + i + 1));
      }
      return [...prev, ...newBatch];
    });
  };

  const handleDeleteRow = (rowId: string) => {
    if (rows.length <= 1) {
      setRows([createEmptyRow(1)]);
      return;
    }
    setRows(prev => prev.filter(r => r._rowId !== rowId).map((r, idx) => ({ ...r, _rowNumber: idx + 1 })));
  };

  const handleDuplicateRow = (rowId: string) => {
    const target = rows.find(r => r._rowId === rowId);
    if (!target) return;
    const duplicated: BulkBrandRow = {
      ...target,
      _rowId: 'row_' + Math.random().toString(36).substring(2, 9),
      brandName: target.brandName ? `${target.brandName} Copy` : '',
      _rowNumber: rows.length + 1,
      saveStatus: 'PENDING',
      saveMessage: undefined
    };
    setRows(prev => [...prev, duplicated]);
  };

  const handleClearEmptyRows = () => {
    setRows(prev => {
      const filtered = prev.filter(r => r.brandName.trim().length > 0);
      if (filtered.length === 0) return [createEmptyRow(1)];
      return filtered.map((r, idx) => ({ ...r, _rowNumber: idx + 1 }));
    });
  };

  const handleCellChange = (rowId: string, field: keyof BulkBrandRow, value: any) => {
    setRows(prev => prev.map(r => {
      if (r._rowId === rowId) {
        return { ...r, [field]: value };
      }
      return r;
    }));
  };

  // Image Selection Handler (native device gallery / file picker)
  const handleImageSelect = (
    rowId: string, 
    fieldPrefix: 'logo' | 'coverImage' | 'heroImage2' | 'heroImage3' | 'heroImage4', 
    file: File | null
  ) => {
    if (!file) return;

    // Create object URL for instant live preview
    const previewUrl = URL.createObjectURL(file);

    setRows(prev => prev.map(r => {
      if (r._rowId === rowId) {
        return {
          ...r,
          [`${fieldPrefix}File`]: file,
          [`${fieldPrefix}Preview`]: previewUrl
        };
      }
      return r;
    }));
  };

  const handleRemoveImage = (
    rowId: string, 
    fieldPrefix: 'logo' | 'coverImage' | 'heroImage2' | 'heroImage3' | 'heroImage4'
  ) => {
    setRows(prev => prev.map(r => {
      if (r._rowId === rowId) {
        return {
          ...r,
          [`${fieldPrefix}File`]: null,
          [`${fieldPrefix}Preview`]: ''
        };
      }
      return r;
    }));
  };

  // SAVE & PUBLISH ALL PIPELINE
  const handleSaveAndPublishAll = async () => {
    // 1. Filter out non-empty rows
    const activeRows = rows.filter(r => r.brandName.trim().length > 0);
    
    if (activeRows.length === 0) {
      alert('Please enter at least one brand name in the spreadsheet before saving.');
      return;
    }

    setIsSubmitting(true);
    setSaveProgress({ current: 0, total: activeRows.length, stage: 'Validating spreadsheet rows...' });

    const existingNamesList = brands.map(b => b.brandName);
    const preparedBrandsToUpload: any[] = [];
    const executionResults: Array<{ rowNumber: number; brandName: string; status: 'SAVED' | 'SKIPPED' | 'FAILED'; message: string; brandId?: string }> = [];

    // 2. Upload images for each row
    for (let i = 0; i < activeRows.length; i++) {
      const row = activeRows[i];
      const rawName = row.brandName.trim();
      const norm = normalizeName(rawName);

      setSaveProgress({ 
        current: i + 1, 
        total: activeRows.length, 
        stage: `Processing Row ${row._rowNumber}: "${rawName}" (Uploading images & verifying)...` 
      });

      // Duplicate check against DB
      if (existingNamesSet.has(norm)) {
        executionResults.push({
          rowNumber: row._rowNumber,
          brandName: rawName,
          status: 'SKIPPED',
          message: `ALREADY LISTED — SKIPPED: "${rawName}" already exists in the Brand Directory.`
        });
        continue;
      }

      // Upload Images
      let uploadedLogoUrl = row.logoPreview || '';
      let uploadedCoverUrl = row.coverImagePreview || '';
      let uploadedHero2Url = row.heroImage2Preview || '';
      let uploadedHero3Url = row.heroImage3Preview || '';
      let uploadedHero4Url = row.heroImage4Preview || '';

      const uId = user?.id || 'admin1';

      try {
        if (row.logoFile) {
          uploadedLogoUrl = await uploadFile(uId, row.logoFile, 'brands/logos');
        }
        if (row.coverImageFile) {
          uploadedCoverUrl = await uploadFile(uId, row.coverImageFile, 'brands/covers');
        }
        if (row.heroImage2File) {
          uploadedHero2Url = await uploadFile(uId, row.heroImage2File, 'brands/heroes');
        }
        if (row.heroImage3File) {
          uploadedHero3Url = await uploadFile(uId, row.heroImage3File, 'brands/heroes');
        }
        if (row.heroImage4File) {
          uploadedHero4Url = await uploadFile(uId, row.heroImage4File, 'brands/heroes');
        }
      } catch (uploadErr: any) {
        console.warn('Image upload fallback notice:', uploadErr);
      }

      const galleryList: string[] = [
        uploadedCoverUrl,
        uploadedHero2Url,
        uploadedHero3Url,
        uploadedHero4Url
      ].filter(Boolean);

      preparedBrandsToUpload.push({
        _rowNumber: row._rowNumber,
        brandName: rawName,
        industry: row.industry,
        category: row.category,
        tagline: row.tagline,
        description: row.description,
        fullAbout: row.fullAbout || row.description,
        companyName: row.founder || rawName,
        contactPerson: row.founder || rawName,
        establishedYear: Number(row.establishedYear) || (new Date().getFullYear() - 2),
        headquarters: row.headquarters || 'Mumbai, Maharashtra',
        city: row.headquarters || 'Mumbai, Maharashtra',
        minInvestment: Number(row.minInvestment) || 15,
        maxInvestment: Number(row.maxInvestment) || 30,
        franchiseFee: Number(row.franchiseFee) || 5,
        royaltyFee: row.royaltyFee || '5% Gross Sales',
        roiPayback: row.roiPayback || '12-18 Months',
        spaceRequired: row.spaceRequired || '300-600 sq ft',
        totalOutlets: Number(row.totalOutlets) || 10,
        targetCustomer: row.targetCustomer,
        expansionOpportunity: row.expansionOpportunity,
        businessModel: row.businessModel,
        keyAdvantages: row.keyAdvantages ? row.keyAdvantages.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        contactPhone: row.contactPhone || '+91 98765 43210',
        contactEmail: row.contactEmail || `franchise@${rawName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        website: row.website || '',
        logo: uploadedLogoUrl || '/file_00000000f5988211884f7bce5b4acfc8~2.jpg',
        coverImage: uploadedCoverUrl || (galleryList[0] || 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80'),
        heroImage2: uploadedHero2Url,
        heroImage3: uploadedHero3Url,
        heroImage4: uploadedHero4Url,
        galleryImages: galleryList.length > 0 ? galleryList : [
          'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80'
        ]
      });
    }

    // 3. Dispatch to Backend API
    try {
      setSaveProgress({ 
        current: activeRows.length, 
        total: activeRows.length, 
        stage: 'Saving records to database and synchronizing Brand Directory...' 
      });

      const authHeader = localStorage.getItem('brizx_auth_token') || 'Bearer admin_token';
      const res = await fetch('/api/admin/brands/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
          'x-user-role': 'SUPER_ADMIN'
        },
        body: JSON.stringify({
          brands: preparedBrandsToUpload,
          existingBrandNames: existingNamesList
        })
      });

      const responseData = await res.json();

      if (!res.ok || !responseData.success) {
        throw new Error(responseData.message || 'Server returned error saving bulk brands.');
      }

      // 4. Save to Client Context & Firestore
      const savedList: Brand[] = responseData.savedBrands || [];
      if (savedList.length > 0) {
        await saveBulkBrands(savedList);
      }

      // Combine server results with early skipped results
      const allCombinedResults = [
        ...executionResults,
        ...(responseData.results || [])
      ];

      const finalSavedCount = allCombinedResults.filter(r => r.status === 'SAVED').length;
      const finalSkippedCount = allCombinedResults.filter(r => r.status === 'SKIPPED').length;
      const finalFailedCount = allCombinedResults.filter(r => r.status === 'FAILED').length;

      // Update row statuses in spreadsheet
      setRows(prev => prev.map(r => {
        const match = allCombinedResults.find(res => res.rowNumber === r._rowNumber);
        if (match) {
          return {
            ...r,
            saveStatus: match.status,
            saveMessage: match.message,
            savedBrandId: match.brandId
          };
        }
        return r;
      }));

      setResultsSummary({
        show: true,
        total: activeRows.length,
        saved: finalSavedCount,
        skipped: finalSkippedCount,
        failed: finalFailedCount,
        details: allCombinedResults
      });

    } catch (err: any) {
      console.error('Save Bulk Brands Error:', err);
      alert(`Error saving brands: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered rows for viewing
  const filteredRows = useMemo(() => {
    return rows.filter(r => {
      const evalStatus = evaluateRowStatus(r, rows);
      if (filterStatus === 'READY' && evalStatus.status !== 'READY') return false;
      if (filterStatus === 'WARNING' && evalStatus.status !== 'WARNING' && evalStatus.status !== 'INVALID') return false;
      if (filterStatus === 'DUPLICATE' && !evalStatus.status.startsWith('DUPLICATE')) return false;
      if (filterStatus === 'SAVED' && r.saveStatus !== 'SAVED') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (r.brandName || '').toLowerCase().includes(q);
        const matchesInd = (r.industry || '').toLowerCase().includes(q);
        const matchesCity = (r.headquarters || '').toLowerCase().includes(q);
        if (!matchesName && !matchesInd && !matchesCity) return false;
      }

      return true;
    });
  }, [rows, filterStatus, searchQuery, existingNamesSet]);

  const summaryStats = useMemo(() => {
    let ready = 0;
    let duplicate = 0;
    let invalid = 0;
    let populated = 0;

    rows.forEach(r => {
      const evalRes = evaluateRowStatus(r, rows);
      if (r.brandName.trim().length > 0) populated++;
      if (evalRes.status === 'READY') ready++;
      else if (evalRes.status.startsWith('DUPLICATE')) duplicate++;
      else if (evalRes.status === 'INVALID' || evalRes.status === 'WARNING') invalid++;
    });

    return { total: rows.length, populated, ready, duplicate, invalid };
  }, [rows, existingNamesSet]);

  return (
    <div className="space-y-6 pb-20">
      {/* Breadcrumbs */}
      <AdminBreadcrumbs 
        items={[
          { label: 'Brand Management', path: '/admin/brands' },
          { label: 'Bulk Brand Listing' }
        ]} 
      />

      {/* HEADER BAR */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                Bulk Brand Listing Spreadsheet
                <span className="bg-blue-50 text-blue-700 text-xs font-black uppercase px-2.5 py-0.5 rounded-full border border-blue-200">
                  Direct Entry Mode
                </span>
              </h1>
              <p className="text-slate-500 text-xs font-medium">
                Enter multiple franchise brands in real-time, upload gallery images directly from your device, and publish to the live Brand Directory.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions & Publish Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => handleAddRow()}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            title="Add 1 new brand row"
          >
            <Plus size={16} /> Add Row
          </button>
          
          <button
            onClick={() => handleAddMultipleRows(5)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            title="Add 5 new brand rows"
          >
            <Plus size={16} /> +5 Rows
          </button>

          <button
            onClick={handleClearEmptyRows}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            title="Remove blank rows"
          >
            <Trash2 size={16} /> Clear Empty
          </button>

          <button
            onClick={handleSaveAndPublishAll}
            disabled={isSubmitting || summaryStats.populated === 0}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer ${
              isSubmitting || summaryStats.populated === 0
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25 active:scale-98'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving & Publishing...
              </>
            ) : (
              <>
                <Save size={16} /> Save & Publish All ({summaryStats.populated})
              </>
            )}
          </button>
        </div>
      </div>

      {/* METRIC STRIP & SPREADSHEET FILTERS */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Total Rows</span>
          <span className="text-xl font-black text-slate-800 mt-1 block">{summaryStats.total}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Populated Brands</span>
          <span className="text-xl font-black text-blue-600 mt-1 block">{summaryStats.populated}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Ready to Save</span>
          <span className="text-xl font-black text-emerald-600 mt-1 block">{summaryStats.ready}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Duplicates Detected</span>
          <span className="text-xl font-black text-rose-600 mt-1 block">{summaryStats.duplicate}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Needs Review</span>
          <span className="text-xl font-black text-amber-600 mt-1 block">{summaryStats.invalid}</span>
        </div>
      </div>

      {/* SPREADSHEET SEARCH & FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[260px]">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by brand name, industry, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Filter size={14} /> Filter Status:
          </span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="ALL">Show All Rows ({rows.length})</option>
            <option value="READY">Ready to Save</option>
            <option value="DUPLICATE">Duplicates</option>
            <option value="WARNING">Needs Review / Incomplete</option>
            <option value="SAVED">Saved Successfully</option>
          </select>
        </div>
      </div>

      {/* SPREADSHEET DATA GRID CONTAINER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Horizontal scroll helper notice */}
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-[11px] font-bold text-slate-500">
          <span className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-blue-600" />
            Excel-Style Multi-Column Grid. Scroll horizontally to edit business terms & upload images.
          </span>
          <span className="text-slate-400">
            Showing {filteredRows.length} of {rows.length} rows
          </span>
        </div>

        <div className="overflow-x-auto max-h-[650px] relative">
          <table className="w-full text-left border-collapse min-w-[2800px]">
            
            {/* STICKY TABLE HEADER */}
            <thead className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider sticky top-0 z-30 shadow-md">
              <tr>
                {/* Sticky Left Actions Header */}
                <th className="p-3 w-12 text-center sticky left-0 z-40 bg-slate-950 border-r border-slate-800">
                  #
                </th>
                <th className="p-3 w-36 text-center sticky left-12 z-40 bg-slate-950 border-r border-slate-800">
                  Row Status
                </th>
                <th className="p-3 w-28 text-center sticky left-48 z-40 bg-slate-950 border-r border-slate-800">
                  Actions
                </th>

                {/* BRAND INFO GROUP */}
                <th className="p-3 bg-blue-950/80 border-r border-slate-800 w-52">
                  Brand Name <span className="text-rose-400">*</span>
                </th>
                <th className="p-3 bg-blue-950/80 border-r border-slate-800 w-44">
                  Industry / Sector <span className="text-rose-400">*</span>
                </th>
                <th className="p-3 bg-blue-950/80 border-r border-slate-800 w-40">
                  Sub-Category
                </th>
                <th className="p-3 bg-blue-950/80 border-r border-slate-800 w-56">
                  Tagline
                </th>
                <th className="p-3 bg-blue-950/80 border-r border-slate-800 w-64">
                  Short Description
                </th>
                <th className="p-3 bg-blue-950/80 border-r border-slate-800 w-72">
                  Full About / Overview
                </th>
                <th className="p-3 bg-blue-950/80 border-r border-slate-800 w-44">
                  Founder / Owner
                </th>
                <th className="p-3 bg-blue-950/80 border-r border-slate-800 w-32">
                  Founded Year
                </th>
                <th className="p-3 bg-blue-950/80 border-r border-slate-800 w-48">
                  Headquarters / City
                </th>

                {/* INVESTMENT GROUP */}
                <th className="p-3 bg-emerald-950/80 border-r border-slate-800 w-36">
                  Min Inv (₹L) <span className="text-rose-400">*</span>
                </th>
                <th className="p-3 bg-emerald-950/80 border-r border-slate-800 w-36">
                  Max Inv (₹L) <span className="text-rose-400">*</span>
                </th>
                <th className="p-3 bg-emerald-950/80 border-r border-slate-800 w-36">
                  Franchise Fee (₹L)
                </th>
                <th className="p-3 bg-emerald-950/80 border-r border-slate-800 w-40">
                  Royalty Fee
                </th>
                <th className="p-3 bg-emerald-950/80 border-r border-slate-800 w-40">
                  Est. Payback
                </th>
                <th className="p-3 bg-emerald-950/80 border-r border-slate-800 w-40">
                  Space Required
                </th>
                <th className="p-3 bg-emerald-950/80 border-r border-slate-800 w-32">
                  Active Outlets
                </th>

                {/* BUSINESS INFO GROUP */}
                <th className="p-3 bg-amber-950/80 border-r border-slate-800 w-52">
                  Target Customer
                </th>
                <th className="p-3 bg-amber-950/80 border-r border-slate-800 w-52">
                  Expansion Locations
                </th>
                <th className="p-3 bg-amber-950/80 border-r border-slate-800 w-48">
                  Business Model
                </th>
                <th className="p-3 bg-amber-950/80 border-r border-slate-800 w-64">
                  Key Advantages
                </th>

                {/* CONTACT INFO GROUP */}
                <th className="p-3 bg-purple-950/80 border-r border-slate-800 w-44">
                  Contact Phone
                </th>
                <th className="p-3 bg-purple-950/80 border-r border-slate-800 w-52">
                  Contact Email
                </th>
                <th className="p-3 bg-purple-950/80 border-r border-slate-800 w-48">
                  Website
                </th>

                {/* IMAGE UPLOAD GROUP */}
                <th className="p-3 bg-indigo-950 border-r border-slate-800 w-44 text-center">
                  Brand Logo (1:1)
                </th>
                <th className="p-3 bg-indigo-950 border-r border-slate-800 w-48 text-center">
                  Hero Image (Cover)
                </th>
                <th className="p-3 bg-indigo-950 border-r border-slate-800 w-48 text-center">
                  Hero 2 (Interior)
                </th>
                <th className="p-3 bg-indigo-950 border-r border-slate-800 w-48 text-center">
                  Hero 3 (Products)
                </th>
                <th className="p-3 bg-indigo-950 w-48 text-center">
                  Hero 4 (Storefront)
                </th>
              </tr>
            </thead>

            {/* SPREADSHEET ROWS */}
            <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
              {filteredRows.map((row) => {
                const evalResult = evaluateRowStatus(row, rows);
                const isAlreadyListed = evalResult.status === 'DUPLICATE_DB';
                const isDuplicateSheet = evalResult.status === 'DUPLICATE_TABLE';
                const isSaved = row.saveStatus === 'SAVED';

                return (
                  <tr 
                    key={row._rowId} 
                    className={`hover:bg-blue-50/40 transition-colors group ${
                      isSaved ? 'bg-emerald-50/30' : (isAlreadyListed || isDuplicateSheet) ? 'bg-rose-50/40' : ''
                    }`}
                  >
                    
                    {/* Sticky Left: Row Number */}
                    <td className="p-2 text-center font-black text-slate-500 sticky left-0 z-20 bg-white group-hover:bg-blue-50/90 border-r border-slate-200">
                      {row._rowNumber}
                    </td>

                    {/* Sticky Left: Status Badge */}
                    <td className="p-2 text-center sticky left-12 z-20 bg-white group-hover:bg-blue-50/90 border-r border-slate-200">
                      {isSaved ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 size={12} /> SAVED
                        </span>
                      ) : isAlreadyListed ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300">
                          <AlertTriangle size={12} /> ALREADY LISTED
                        </span>
                      ) : isDuplicateSheet ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300">
                          <XCircle size={12} /> DUPLICATE
                        </span>
                      ) : evalResult.status === 'READY' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Check size={12} /> READY
                        </span>
                      ) : evalResult.status === 'WARNING' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertCircle size={12} /> REVIEW
                        </span>
                      ) : evalResult.status === 'INVALID' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300">
                          <AlertCircle size={12} /> INCOMPLETE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-500">
                          EMPTY
                        </span>
                      )}
                    </td>

                    {/* Sticky Left: Actions (Duplicate / Delete) */}
                    <td className="p-2 text-center sticky left-48 z-20 bg-white group-hover:bg-blue-50/90 border-r border-slate-200">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleDuplicateRow(row._rowId)}
                          title="Duplicate Row"
                          className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded transition-colors cursor-pointer"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteRow(row._rowId)}
                          title="Delete Row"
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-100 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                        {row.savedBrandId && (
                          <Link
                            to={`/brands/${row.savedBrandId}`}
                            target="_blank"
                            title="View Public Profile"
                            className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-100 rounded transition-colors"
                          >
                            <ExternalLink size={14} />
                          </Link>
                        )}
                      </div>
                    </td>

                    {/* BRAND INFO CELLS */}
                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="text"
                        placeholder="e.g. Burger Kingsway"
                        value={row.brandName}
                        onChange={(e) => handleCellChange(row._rowId, 'brandName', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </td>

                    <td className="p-2 border-r border-slate-200">
                      <select
                        value={row.industry}
                        onChange={(e) => handleCellChange(row._rowId, 'industry', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        {INDUSTRY_OPTIONS.map((ind) => (
                          <option key={ind} value={ind}>{ind}</option>
                        ))}
                      </select>
                    </td>

                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="text"
                        placeholder="e.g. Fast Food / QSR"
                        value={row.category}
                        onChange={(e) => handleCellChange(row._rowId, 'category', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </td>

                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="text"
                        placeholder="e.g. Flame Grilled Craft Burgers"
                        value={row.tagline}
                        onChange={(e) => handleCellChange(row._rowId, 'tagline', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </td>

                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="text"
                        placeholder="Brief 1-line overview"
                        value={row.description}
                        onChange={(e) => handleCellChange(row._rowId, 'description', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </td>

                    <td className="p-2 border-r border-slate-200">
                      <textarea
                        rows={1}
                        placeholder="Full company and brand background"
                        value={row.fullAbout}
                        onChange={(e) => handleCellChange(row._rowId, 'fullAbout', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                      />
                    </td>

                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="text"
                        placeholder="Founder / Legal Entity"
                        value={row.founder}
                        onChange={(e) => handleCellChange(row._rowId, 'founder', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </td>

                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="number"
                        placeholder="2020"
                        value={row.establishedYear}
                        onChange={(e) => handleCellChange(row._rowId, 'establishedYear', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </td>

                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="text"
                        placeholder="e.g. Mumbai, Maharashtra"
                        value={row.headquarters}
                        onChange={(e) => handleCellChange(row._rowId, 'headquarters', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </td>

                    {/* INVESTMENT INFORMATION CELLS */}
                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="number"
                        placeholder="15"
                        value={row.minInvestment}
                        onChange={(e) => handleCellChange(row._rowId, 'minInvestment', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-blue-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </td>

                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="number"
                        placeholder="30"
                        value={row.maxInvestment}
                        onChange={(e) => handleCellChange(row._rowId, 'maxInvestment', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-blue-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </td>

                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="number"
                        placeholder="5"
                        value={row.franchiseFee}
                        onChange={(e) => handleCellChange(row._rowId, 'franchiseFee', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </td>

                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="text"
                        placeholder="e.g. 5% Gross Sales"
                        value={row.royaltyFee}
                        onChange={(e) => handleCellChange(row._rowId, 'royaltyFee', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </td>

                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="text"
                        placeholder="e.g. 12-18 Months"
                        value={row.roiPayback}
                        onChange={(e) => handleCellChange(row._rowId, 'roiPayback', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-emerald-700 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </td>

                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="text"
                        placeholder="e.g. 300 - 600 sq ft"
                        value={row.spaceRequired}
                        onChange={(e) => handleCellChange(row._rowId, 'spaceRequired', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </td>

                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="number"
                        placeholder="10"
                        value={row.totalOutlets}
                        onChange={(e) => handleCellChange(row._rowId, 'totalOutlets', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </td>

                    {/* BUSINESS INFORMATION CELLS */}
                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="text"
                        placeholder="Target demographic"
                        value={row.targetCustomer}
                        onChange={(e) => handleCellChange(row._rowId, 'targetCustomer', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </td>

                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="text"
                        placeholder="Target cities/states"
                        value={row.expansionOpportunity}
                        onChange={(e) => handleCellChange(row._rowId, 'expansionOpportunity', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </td>

                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="text"
                        placeholder="FOFO / FOCO / Turnkey"
                        value={row.businessModel}
                        onChange={(e) => handleCellChange(row._rowId, 'businessModel', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </td>

                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="text"
                        placeholder="Advantages (comma separated)"
                        value={row.keyAdvantages}
                        onChange={(e) => handleCellChange(row._rowId, 'keyAdvantages', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </td>

                    {/* CONTACT INFORMATION CELLS */}
                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="text"
                        placeholder="+91 98765 43210"
                        value={row.contactPhone}
                        onChange={(e) => handleCellChange(row._rowId, 'contactPhone', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </td>

                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="email"
                        placeholder="franchise@brand.com"
                        value={row.contactEmail}
                        onChange={(e) => handleCellChange(row._rowId, 'contactEmail', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </td>

                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="text"
                        placeholder="https://brand.com"
                        value={row.website}
                        onChange={(e) => handleCellChange(row._rowId, 'website', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </td>

                    {/* IMAGE CELL 1: BRAND LOGO */}
                    <td className="p-2 border-r border-slate-200 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {row.logoPreview ? (
                          <div className="relative group/img w-10 h-10 rounded-lg overflow-hidden border border-slate-300 shadow-2xs shrink-0">
                            <img 
                              src={row.logoPreview} 
                              alt="Logo" 
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer"
                            />
                            <button
                              onClick={() => handleRemoveImage(row._rowId, 'logo')}
                              className="absolute inset-0 bg-slate-900/80 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer"
                              title="Remove Logo"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400 shrink-0 text-[10px] font-bold">
                            Logo
                          </div>
                        )}
                        
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          className="hidden"
                          ref={el => { fileInputRef.current[`logo_${row._rowId}`] = el; }}
                          onChange={(e) => handleImageSelect(row._rowId, 'logo', e.target.files?.[0] || null)}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current[`logo_${row._rowId}`]?.click()}
                          className="px-2 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 border border-slate-200 rounded text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          {row.logoPreview ? 'Replace' : 'Upload'}
                        </button>
                      </div>
                    </td>

                    {/* IMAGE CELL 2: HERO IMAGE (COVER) */}
                    <td className="p-2 border-r border-slate-200 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {row.coverImagePreview ? (
                          <div className="relative group/img w-12 h-9 rounded overflow-hidden border border-slate-300 shadow-2xs shrink-0">
                            <img 
                              src={row.coverImagePreview} 
                              alt="Cover" 
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer"
                            />
                            <button
                              onClick={() => handleRemoveImage(row._rowId, 'coverImage')}
                              className="absolute inset-0 bg-slate-900/80 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer"
                              title="Remove Cover"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <div className="w-12 h-9 rounded bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400 shrink-0 text-[9px] font-bold">
                            Hero 1
                          </div>
                        )}

                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          className="hidden"
                          ref={el => { fileInputRef.current[`cover_${row._rowId}`] = el; }}
                          onChange={(e) => handleImageSelect(row._rowId, 'coverImage', e.target.files?.[0] || null)}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current[`cover_${row._rowId}`]?.click()}
                          className="px-2 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 border border-slate-200 rounded text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          {row.coverImagePreview ? 'Replace' : 'Upload'}
                        </button>
                      </div>
                    </td>

                    {/* IMAGE CELL 3: HERO 2 (INTERIOR) */}
                    <td className="p-2 border-r border-slate-200 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {row.heroImage2Preview ? (
                          <div className="relative group/img w-12 h-9 rounded overflow-hidden border border-slate-300 shadow-2xs shrink-0">
                            <img 
                              src={row.heroImage2Preview} 
                              alt="Hero 2" 
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer"
                            />
                            <button
                              onClick={() => handleRemoveImage(row._rowId, 'heroImage2')}
                              className="absolute inset-0 bg-slate-900/80 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer"
                              title="Remove Hero 2"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <div className="w-12 h-9 rounded bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400 shrink-0 text-[9px] font-bold">
                            Hero 2
                          </div>
                        )}

                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          className="hidden"
                          ref={el => { fileInputRef.current[`hero2_${row._rowId}`] = el; }}
                          onChange={(e) => handleImageSelect(row._rowId, 'heroImage2', e.target.files?.[0] || null)}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current[`hero2_${row._rowId}`]?.click()}
                          className="px-2 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 border border-slate-200 rounded text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          {row.heroImage2Preview ? 'Replace' : 'Upload'}
                        </button>
                      </div>
                    </td>

                    {/* IMAGE CELL 4: HERO 3 (PRODUCTS) */}
                    <td className="p-2 border-r border-slate-200 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {row.heroImage3Preview ? (
                          <div className="relative group/img w-12 h-9 rounded overflow-hidden border border-slate-300 shadow-2xs shrink-0">
                            <img 
                              src={row.heroImage3Preview} 
                              alt="Hero 3" 
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer"
                            />
                            <button
                              onClick={() => handleRemoveImage(row._rowId, 'heroImage3')}
                              className="absolute inset-0 bg-slate-900/80 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer"
                              title="Remove Hero 3"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <div className="w-12 h-9 rounded bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400 shrink-0 text-[9px] font-bold">
                            Hero 3
                          </div>
                        )}

                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          className="hidden"
                          ref={el => { fileInputRef.current[`hero3_${row._rowId}`] = el; }}
                          onChange={(e) => handleImageSelect(row._rowId, 'heroImage3', e.target.files?.[0] || null)}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current[`hero3_${row._rowId}`]?.click()}
                          className="px-2 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 border border-slate-200 rounded text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          {row.heroImage3Preview ? 'Replace' : 'Upload'}
                        </button>
                      </div>
                    </td>

                    {/* IMAGE CELL 5: HERO 4 (STOREFRONT) */}
                    <td className="p-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {row.heroImage4Preview ? (
                          <div className="relative group/img w-12 h-9 rounded overflow-hidden border border-slate-300 shadow-2xs shrink-0">
                            <img 
                              src={row.heroImage4Preview} 
                              alt="Hero 4" 
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer"
                            />
                            <button
                              onClick={() => handleRemoveImage(row._rowId, 'heroImage4')}
                              className="absolute inset-0 bg-slate-900/80 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer"
                              title="Remove Hero 4"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <div className="w-12 h-9 rounded bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400 shrink-0 text-[9px] font-bold">
                            Hero 4
                          </div>
                        )}

                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          className="hidden"
                          ref={el => { fileInputRef.current[`hero4_${row._rowId}`] = el; }}
                          onChange={(e) => handleImageSelect(row._rowId, 'heroImage4', e.target.files?.[0] || null)}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current[`hero4_${row._rowId}`]?.click()}
                          className="px-2 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 border border-slate-200 rounded text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          {row.heroImage4Preview ? 'Replace' : 'Upload'}
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* BOTTOM SPREADSHEET FOOTER */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleAddRow()}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition-colors shadow-2xs cursor-pointer"
            >
              <Plus size={14} /> Add Row
            </button>
            <button
              onClick={() => handleAddMultipleRows(10)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition-colors shadow-2xs cursor-pointer"
            >
              <Plus size={14} /> Add +10 Rows
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/brands"
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold transition-colors"
            >
              Back to Brand Directory
            </Link>
            <button
              onClick={handleSaveAndPublishAll}
              disabled={isSubmitting || summaryStats.populated === 0}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer ${
                isSubmitting || summaryStats.populated === 0
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25 active:scale-98'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Publishing...
                </>
              ) : (
                <>
                  <Save size={16} /> Save & Publish All
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: SUBMISSION PROGRESS OVERLAY */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Loader2 size={24} className="animate-spin" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">Publishing Brands...</h3>
                <p className="text-slate-500 text-xs font-medium">{saveProgress.stage}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>Progress</span>
                <span>{saveProgress.current} / {saveProgress.total}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300 rounded-full" 
                  style={{ width: `${saveProgress.total > 0 ? (saveProgress.current / saveProgress.total) * 100 : 10}%` }}
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 font-medium text-center">
              Please keep this tab open while device images are uploaded and database records are committed.
            </p>
          </div>
        </div>
      )}

      {/* MODAL: FINAL RESULTS BREAKDOWN SUMMARY */}
      {resultsSummary?.show && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl border border-slate-200 space-y-5 max-h-[85vh] flex flex-col">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">Bulk Publishing Results</h3>
                  <p className="text-slate-500 text-xs">Real-time status breakdown from backend database engine</p>
                </div>
              </div>
              <button
                onClick={() => setResultsSummary(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Metric Overview */}
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] font-black text-slate-400 uppercase">Total Rows</span>
                <span className="text-lg font-black text-slate-800 block">{resultsSummary.total}</span>
              </div>
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-center">
                <span className="text-[10px] font-black text-emerald-700 uppercase">Saved & Live</span>
                <span className="text-lg font-black text-emerald-700 block">{resultsSummary.saved}</span>
              </div>
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center">
                <span className="text-[10px] font-black text-amber-700 uppercase">Skipped / Dupes</span>
                <span className="text-lg font-black text-amber-700 block">{resultsSummary.skipped}</span>
              </div>
              <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 text-center">
                <span className="text-[10px] font-black text-rose-700 uppercase">Failed</span>
                <span className="text-lg font-black text-rose-700 block">{resultsSummary.failed}</span>
              </div>
            </div>

            {/* Row by row log */}
            <div className="flex-1 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-64 p-1 bg-slate-50">
              {resultsSummary.details.map((item, idx) => (
                <div key={idx} className="p-3 flex items-start justify-between gap-3 text-xs bg-white rounded-lg my-1 shadow-2xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-400">Row {item.rowNumber}:</span>
                      <span className="font-black text-slate-900">{item.brandName}</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{item.message}</p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {item.status === 'SAVED' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <Check size={10} /> SAVED
                      </span>
                    ) : item.status === 'SKIPPED' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                        <AlertTriangle size={10} /> SKIPPED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                        <XCircle size={10} /> FAILED
                      </span>
                    )}

                    {item.brandId && (
                      <Link
                        to={`/brands/${item.brandId}`}
                        target="_blank"
                        className="p-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition-colors text-[10px] font-bold flex items-center gap-1"
                        title="Open brand profile"
                      >
                        <ExternalLink size={12} /> View
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <Link
                to="/brands"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors"
              >
                <ExternalLink size={14} /> Open Public Brand Directory
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setResultsSummary(null)}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Close & Continue Editing
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
