import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, Send, CheckCircle2, Clock, FileText, AlertCircle, Building, 
  Search, Sparkles, ExternalLink, Download, FileCheck, HelpCircle, ArrowRight,
  Upload, Trash2, Calendar, User, Check, X, File, AlertTriangle, ShieldAlert, Activity
} from 'lucide-react';
import { SeekerHero } from '../../components/seeker/SeekerHero';
import { seekerTheme } from '../../theme/seekerTheme';

export default function SeekerBrandVerification() {
  const { user } = useAuth();
  const { 
    verificationRequests, 
    verificationDocuments, 
    verificationChecks, 
    verificationAuditLogs, 
    legalAdvisorQuestions,
    addVerificationRequest,
    uploadVerificationDocument,
    askLegalAdvisor
  } = useData();

  const userRequests = verificationRequests.filter(r => r.seekerId === user?.id);
  const userQueries = legalAdvisorQuestions.filter(q => q.seekerId === user?.id);

  // Active Selected Request for Desk Details
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    userRequests.length > 0 ? userRequests[0].id : null
  );

  const selectedRequest = userRequests.find(r => r.id === selectedRequestId);
  const selectedChecks = selectedRequest ? verificationChecks.filter(c => c.requestId === selectedRequest.id) : [];
  const selectedDocs = selectedRequest ? verificationDocuments.filter(d => d.requestId === selectedRequest.id) : [];
  const selectedLogs = selectedRequest ? verificationAuditLogs.filter(l => l.requestId === selectedRequest.id) : [];

  // Form states for NEW audit submission
  const [brandName, setBrandName] = useState('');
  const [website, setWebsite] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [category, setCategory] = useState('Food & Beverages');
  
  // Compliance identifiers
  const [gstin, setGstin] = useState('');
  const [mcaCin, setMcaCin] = useState('');
  const [trademarkNumber, setTrademarkNumber] = useState('');
  
  // Consent
  const [consentAccepted, setConsentAccepted] = useState(false);
  
  // UI states
  const [activeTab, setActiveTab] = useState<'AUDITS' | 'NEW_AUDIT' | 'COUNSEL'>('AUDITS');
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [advisorSuccess, setAdvisorSuccess] = useState(false);

  // Legal Query Form State
  const [userQuery, setUserQuery] = useState('');
  const [queryCategory, setQueryCategory] = useState('Royalty & Finance');

  // Document Upload Sim State
  const [uploadDocType, setUploadDocType] = useState<'GST_CERTIFICATE' | 'INCORPORATION_CERTIFICATE' | 'TRADEMARK_CERT' | 'FDD_AGREEMENT' | 'AUDITED_FINANCIALS' | 'OTHER'>('GST_CERTIFICATE');
  const [customDocTypeName, setCustomDocTypeName] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [simUploadName, setSimUploadName] = useState('');
  const [simUploadSize, setSimUploadSize] = useState('1.5 MB');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation Patterns for India
  const validateGSTIN = (val: string) => {
    const pattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return pattern.test(val.trim().toUpperCase());
  };

  const validateMCA_CIN = (val: string) => {
    const pattern = /^[LU]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;
    return pattern.test(val.trim().toUpperCase());
  };

  const handleAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!brandName.trim()) {
      setErrorMessage('Brand Name is required.');
      return;
    }

    if (gstin && !validateGSTIN(gstin)) {
      setErrorMessage('Invalid Indian GSTIN pattern (e.g., 29AABCU1234F1Z5). Must be a valid 15-character alphanumeric.');
      return;
    }

    if (mcaCin && !validateMCA_CIN(mcaCin)) {
      setErrorMessage('Invalid MCA Company Identification Number (CIN) pattern (e.g., U55101KA2021PTC145678). Must be 21 characters.');
      return;
    }

    if (!consentAccepted) {
      setErrorMessage('You must accept the terms of audit and authority disclosures to proceed.');
      return;
    }

    if (!user) return;

    addVerificationRequest({
      seekerId: user.id,
      brandName: brandName.trim(),
      website: website.trim(),
      contactPhone: contactPhone.trim(),
      contactEmail: contactEmail.trim(),
      category,
      notes: 'Initial validation request registered. BrizX verification Desk is analyzing registrar history.',
      gstin: gstin.trim().toUpperCase(),
      mcaCin: mcaCin.trim().toUpperCase(),
      trademarkNumber: trademarkNumber.trim().toUpperCase()
    });

    setSubmittedSuccess(true);
    setBrandName('');
    setWebsite('');
    setContactPhone('');
    setContactEmail('');
    setGstin('');
    setMcaCin('');
    setTrademarkNumber('');
    setConsentAccepted(false);

    // Auto switch to Audits tab and select the newly created request
    setTimeout(() => {
      setSubmittedSuccess(false);
      // Retrieve requests from local storage or context (will be the first request in list)
      setActiveTab('AUDITS');
    }, 1500);
  };

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim() || !user) return;

    askLegalAdvisor(user.id, userQuery.trim(), user.name || 'Anonymous Seeker');
    
    setUserQuery('');
    setAdvisorSuccess(true);
    setTimeout(() => setAdvisorSuccess(false), 3000);
  };

  // Simulated PDF Drag & Drop Upload
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type !== 'application/pdf') {
        alert('Due to corporate security guidelines, only PDF compliance documents are accepted.');
        return;
      }
      setSimUploadName(file.name);
      setSimUploadSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        alert('Due to corporate security guidelines, only PDF compliance documents are accepted.');
        return;
      }
      setSimUploadName(file.name);
      setSimUploadSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    }
  };

  const executeSimulatedUpload = () => {
    if (!selectedRequest || !user) return;
    if (!simUploadName) {
      alert('Please choose or drag a PDF document first.');
      return;
    }

    let docTypeName = '';
    switch (uploadDocType) {
      case 'GST_CERTIFICATE': docTypeName = 'GST Registration Certificate'; break;
      case 'INCORPORATION_CERTIFICATE': docTypeName = 'Certificate of Incorporation'; break;
      case 'TRADEMARK_CERT': docTypeName = 'Trademark Registration Certificate'; break;
      case 'FDD_AGREEMENT': docTypeName = 'Franchise Disclosure Document (FDD)'; break;
      case 'AUDITED_FINANCIALS': docTypeName = 'Last 2 Years Audited Financial Sheets'; break;
      case 'OTHER': docTypeName = customDocTypeName || 'Other Compliance Sheet'; break;
    }

    uploadVerificationDocument(
      selectedRequest.id,
      uploadDocType,
      docTypeName,
      simUploadName,
      simUploadSize,
      'dummy_base64_data_uri_link',
      user.id
    );

    setSimUploadName('');
    setCustomDocTypeName('');
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'SUBMITTED': 
        return { bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: <Clock size={12} />, label: 'Inquiry Submitted' };
      case 'UNDER_REVIEW': 
        return { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: <Clock size={12} />, label: 'Under Review' };
      case 'DOCUMENTS_REQUIRED': 
        return { bg: 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse', icon: <AlertTriangle size={12} />, label: 'Action Required: Upload Docs' };
      case 'VERIFICATION_IN_PROGRESS': 
        return { bg: 'bg-blue-50/50 text-blue-800 border-blue-200', icon: <Activity size={12} />, label: 'Verification In Progress' };
      case 'VERIFIED': 
        return { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: <CheckCircle2 size={12} />, label: 'Vetted & Verified' };
      case 'REJECTED': 
        return { bg: 'bg-red-50 text-red-800 border-red-200', icon: <ShieldAlert size={12} />, label: 'Verification Rejected' };
      case 'VERIFICATION_EXPIRED': 
        return { bg: 'bg-slate-100 text-slate-700 border-slate-300', icon: <Clock size={12} />, label: 'Verification Expired' };
      default: 
        return { bg: 'bg-slate-50 text-slate-700 border-slate-200', icon: <Clock size={12} />, label: status };
    }
  };

  const getCheckStatusBadge = (status: string) => {
    switch (status) {
      case 'PASSED': return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg flex items-center gap-1"><CheckCircle2 size={11} className="text-emerald-600" /> PASSED</span>;
      case 'FAILED': return <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg flex items-center gap-1"><X size={11} className="text-red-600" /> FAILED</span>;
      case 'NOT_APPLICABLE': return <span className="bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-bold px-2.5 py-0.5 rounded-lg">N/A</span>;
      default: return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-lg animate-pulse flex items-center gap-1"><Clock size={11} className="text-amber-600" /> AUDITING</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAFF] p-4 sm:p-8">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-blue-100 p-6 shadow-sm mb-6">
        <SeekerHero
          pageKey="brandVerification"
          badgeText="BrizX India Compliance Bureau"
          badgeIcon={<ShieldCheck size={14} className="text-blue-600" />}
          title="Brand Verification & Due Diligence"
          description="Verify trademark registration, GST filing history, legal litigation registries, and audited outlet unit economics. Protect your capital with vetted legal diligence before committing to franchise contracts."
        />
      </div>

      {/* Tab Controls */}
      <div className="flex border-b border-blue-100 mb-6 gap-2">
        <button
          onClick={() => {
            setActiveTab('AUDITS');
            if (userRequests.length > 0 && !selectedRequestId) {
              setSelectedRequestId(userRequests[0].id);
            }
          }}
          className={`px-5 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'AUDITS' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Due Diligence Desks ({userRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('NEW_AUDIT')}
          className={`px-5 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'NEW_AUDIT' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Initiate New Audit
        </button>
        <button
          onClick={() => setActiveTab('COUNSEL')}
          className={`px-5 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'COUNSEL' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Corporate Legal Counsel ({userQueries.length})
        </button>
      </div>

      {/* TAB 1: ACTIVE AUDITS */}
      {activeTab === 'AUDITS' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Requests Sidebar */}
          <div className="xl:col-span-4 space-y-4">
            <div className="bg-white border border-blue-100 rounded-3xl p-5 shadow-sm">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Audit List</h3>
              {userRequests.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No active audits. Click "Initiate New Audit" to register a brand lookup.
                </div>
              ) : (
                <div className="space-y-2 max-h-[480px] overflow-y-auto">
                  {userRequests.map((req) => {
                    const active = req.id === selectedRequestId;
                    const statusConfig = getStatusStyle(req.status);
                    return (
                      <div
                        key={req.id}
                        onClick={() => setSelectedRequestId(req.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                          active 
                            ? 'bg-blue-50 border-blue-500 shadow-sm' 
                            : 'bg-white hover:bg-slate-50 border-blue-100'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-1.5 mb-2">
                          <h4 className="font-extrabold text-slate-900 text-xs truncate max-w-[140px]">
                            {req.brandName}
                          </h4>
                          <span className="text-[9px] text-slate-500 shrink-0 font-bold">
                            {req.id}
                          </span>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-lg border ${statusConfig.bg}`}>
                            {statusConfig.label}
                          </span>
                          <span className="text-[9px] text-slate-500 font-bold">
                            {new Date(req.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Informational Note */}
            <div className="bg-[#EEF6FF] border border-blue-100 rounded-3xl p-5 text-xs text-slate-700 leading-relaxed font-normal">
              <div className="flex items-center gap-2 text-blue-700 font-extrabold mb-2">
                <ShieldCheck size={16} />
                <span>Verification Authority Disclosures</span>
              </div>
              BrizX India performs independent corporate intelligence lookups on national business registries. These records do not constitute automated brand approval or real-time legal advice. Seekers should independently vet franchisee disclosures.
            </div>
          </div>

          {/* Detailed Audit Desk Panel */}
          <div className="xl:col-span-8">
            {!selectedRequest ? (
              <div className="bg-white border border-blue-100 rounded-3xl p-12 text-center text-slate-500 text-xs shadow-sm">
                Select an active audit request on the left to open the compliance desk.
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Header Information */}
                <div className="bg-white border border-blue-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-50 pb-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 rounded-lg">
                          {selectedRequest.category}
                        </span>
                        <span className="text-[10px] text-slate-500 font-black tracking-widest uppercase">
                          DILIGENCE DESK: {selectedRequest.id}
                        </span>
                      </div>
                      <h2 className="font-extrabold text-slate-900 text-xl font-heading">
                        {selectedRequest.brandName}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 text-xs font-black border rounded-xl flex items-center gap-1.5 ${getStatusStyle(selectedRequest.status).bg}`}>
                        {getStatusStyle(selectedRequest.status).icon}
                        {getStatusStyle(selectedRequest.status).label}
                      </span>
                    </div>
                  </div>

                  {/* Standard Metadata Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
                    <div>
                      <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest block">Website URL</span>
                      <a 
                        href={selectedRequest.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                      >
                        Visit Website <ExternalLink size={11} />
                      </a>
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest block">Founder Phone</span>
                      <span className="text-xs font-bold text-slate-800 block mt-0.5">
                        {selectedRequest.contactPhone || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest block">Diligence Initiated</span>
                      <span className="text-xs font-bold text-slate-800 block mt-0.5">
                        {new Date(selectedRequest.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest block">Assigned Bureau Team</span>
                      <span className="text-xs font-bold text-slate-800 block mt-0.5">
                        {selectedRequest.assignedVerifierName || 'Registry Auditing Team'}
                      </span>
                    </div>
                  </div>

                  {/* Registries Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#F7FAFF] p-4 rounded-2xl border border-blue-50">
                    <div>
                      <span className="text-[9px] font-black uppercase text-slate-500 block">MCA Registration (CIN)</span>
                      <span className="text-xs font-black text-slate-900 block font-mono mt-0.5">
                        {selectedRequest.mcaCin || 'NOT_SUBMITTED'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase text-slate-500 block">Indian GSTIN Number</span>
                      <span className="text-xs font-black text-slate-900 block font-mono mt-0.5">
                        {selectedRequest.gstin || 'NOT_SUBMITTED'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase text-slate-500 block">Trademark Registration App</span>
                      <span className="text-xs font-black text-slate-900 block font-mono mt-0.5">
                        {selectedRequest.trademarkNumber || 'NOT_SUBMITTED'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Compliance Checklist Grid */}
                <div className="bg-white border border-blue-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm font-heading">Independent Audit & Diligence Checks</h3>
                    <p className="text-xs text-slate-500">Registry analysis checkpoints conducted by BrizX Corporate Auditors.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedChecks.map((chk) => (
                      <div 
                        key={chk.checkId} 
                        className="bg-white p-4 border border-blue-50 rounded-2xl flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-1">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-xs font-extrabold text-slate-900">
                              {chk.checkName}
                            </h4>
                            {getCheckStatusBadge(chk.status)}
                          </div>
                          <p className="text-[10px] text-slate-600 leading-relaxed font-normal">
                            {chk.description}
                          </p>
                        </div>

                        {chk.notes && (
                          <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-700">
                            <span className="font-extrabold text-slate-900 block mb-0.5">Verifier Note:</span>
                            {chk.notes}
                            {chk.evidenceReferences && (
                              <span className="block mt-1 text-[9px] font-bold text-blue-600 font-mono">
                                Evidence Ref: {chk.evidenceReferences}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Document Portal & Secure Sim Upload */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  
                  {/* Upload Form */}
                  <div className="bg-white border border-blue-100 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm font-heading">Secure Document Portal</h3>
                      <p className="text-xs text-slate-400 mt-1">Upload compliance deeds or audit documents to proceed with reviews.</p>
                    </div>

                    {uploadSuccess && (
                      <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 p-3 rounded-xl text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-emerald-600" />
                        Document submitted to legal verifier desk.
                      </div>
                    )}

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Compliance Doc Type</label>
                        <select
                          value={uploadDocType}
                          onChange={(e) => setUploadDocType(e.target.value as any)}
                          className={seekerTheme.select}
                        >
                          <option value="GST_CERTIFICATE">GST-3B / GSTIN Registration Deed</option>
                          <option value="INCORPORATION_CERTIFICATE">Certificate of Incorporation (MCA)</option>
                          <option value="TRADEMARK_CERT">Trademark Registry Certificate</option>
                          <option value="FDD_AGREEMENT">Franchise Disclosure Document (FDD)</option>
                          <option value="AUDITED_FINANCIALS">Last 2 Years Audited Profit Sheets</option>
                          <option value="OTHER">Other Supplementary Deed</option>
                        </select>
                      </div>

                      {uploadDocType === 'OTHER' && (
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Custom Document Label</label>
                          <input
                            type="text"
                            required
                            value={customDocTypeName}
                            onChange={(e) => setCustomDocTypeName(e.target.value)}
                            placeholder="e.g. Regional Exclusive Addendum"
                            className={seekerTheme.input}
                          />
                        </div>
                      )}

                      {/* Drag Area */}
                      <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                          dragActive 
                            ? 'border-blue-500 bg-blue-50/40' 
                            : 'border-blue-100 hover:bg-slate-50/50'
                        }`}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload size={24} className="text-slate-400 mb-2" />
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileSelect}
                          accept="application/pdf"
                          className="hidden"
                        />
                        {simUploadName ? (
                          <div className="space-y-1">
                            <span className="text-xs font-black text-blue-600 block truncate max-w-[200px]">
                              {simUploadName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold block">{simUploadSize} (PDF)</span>
                          </div>
                        ) : (
                          <div>
                            <span className="text-xs font-bold text-slate-700 block">
                              Click or Drag PDF Document
                            </span>
                            <span className="text-[9px] text-slate-400 block mt-0.5">
                              Authorized PDF files only (Max 15MB)
                            </span>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={executeSimulatedUpload}
                        disabled={!simUploadName}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Upload size={13} /> Upload Compliance PDF
                      </button>
                    </div>
                  </div>

                  {/* Document Status List */}
                  <div className="bg-white border border-blue-100 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm font-heading">Submitted Verification Documents ({selectedDocs.length})</h3>
                      <p className="text-xs text-slate-400 mt-1">Audit statuses for your uploaded certificates.</p>
                    </div>

                    {selectedDocs.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 text-xs font-normal">
                        Awaiting compliance uploads. Use the panel on the left to submit certificates for independent analysis.
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[280px] overflow-y-auto">
                        {selectedDocs.map((doc) => (
                          <div 
                            key={doc.documentId} 
                            className="p-3.5 bg-white rounded-xl border border-blue-100 flex flex-col space-y-2 text-left"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex items-center gap-2">
                                <File size={16} className="text-blue-500 shrink-0" />
                                <div className="min-w-0">
                                  <h4 className="text-[11px] font-extrabold text-slate-900 truncate max-w-[130px]">
                                    {doc.fileName}
                                  </h4>
                                  <span className="text-[8px] text-slate-400 font-bold uppercase block">
                                    {doc.documentTypeName}
                                  </span>
                                </div>
                              </div>
                              <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-lg border ${
                                doc.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                doc.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200 animate-pulse' :
                                'bg-blue-50 text-blue-700 border-blue-200'
                              }`}>
                                {doc.status}
                              </span>
                            </div>

                            {doc.reviewerNote && (
                              <div className="text-[9px] text-slate-700 bg-[#F7FAFF] p-2 rounded-lg border border-blue-50 leading-relaxed">
                                <strong className="text-slate-800">Verifier Note:</strong> {doc.reviewerNote}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* Audit Logs / Activity History */}
                <div className="bg-white border border-blue-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm font-heading">Audit Desk Logs & Diligence Trail</h3>
                    <p className="text-xs text-slate-400">Detailed timeline of regulatory steps, updates and verifier adjustments.</p>
                  </div>

                  <div className="relative border-l border-blue-100 pl-4 py-1 space-y-5 ml-2">
                    {selectedLogs.length === 0 ? (
                      <div className="text-slate-400 text-xs py-2 font-normal">Awaiting trail updates.</div>
                    ) : (
                      selectedLogs.map((log) => (
                        <div key={log.logId} className="relative text-xs">
                          {/* Timeline dot */}
                          <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 border border-white"></div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                            <span className="font-black text-slate-800">
                              {log.note}
                            </span>
                            <span className="text-[9px] text-slate-400 font-bold shrink-0">
                              {new Date(log.timestamp).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold">
                            <span className="bg-slate-50 text-slate-700 px-1.5 py-0.5 rounded-md">
                              {log.actorRole.replace(/_/g, ' ')}
                            </span>
                            <span>•</span>
                            <span>By: {log.actorName}</span>
                            {log.action === 'STATUS_CHANGE' && (
                              <>
                                <span>•</span>
                                <span className="text-blue-600">Status Adv: {log.newStatus}</span>
                              </>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: INITIATE NEW AUDIT FORM */}
      {activeTab === 'NEW_AUDIT' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm space-y-6">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base font-heading">Initiate Bureau Brand Diligence</h3>
            <p className="text-xs text-slate-400 mt-1">Register trademark, corporate, and fiscal audits for India listed opportunities.</p>
          </div>

          {submittedSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              Audit request generated successfully. Desk initialized with 6 checkpoints. Redirecting...
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
              <AlertCircle size={16} className="text-red-600 shrink-0" />
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleAuditSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. Urban Slice Pizza"
                  className={seekerTheme.input}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Industry Vertical</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={seekerTheme.select}
                >
                  <option value="Food & Beverages">Food & Beverages</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Retail & Services">Retail & Services</option>
                  <option value="Education">Education</option>
                  <option value="Automobile & EV">Automobile & EV</option>
                  <option value="Fitness & Wellness">Fitness & Wellness</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Company Website URL</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://brandwebsite.com"
                  className={seekerTheme.input}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Contact Email Address</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="franchise@brand.in"
                  className={seekerTheme.input}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-blue-100 pt-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Indian GSTIN Number</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  placeholder="e.g. 29AABCU1234F1Z5"
                  className={seekerTheme.input}
                />
                <span className="text-[8px] text-slate-400 mt-0.5 block">15-digit alphanumeric</span>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">MCA Corporate (CIN)</label>
                <input
                  type="text"
                  value={mcaCin}
                  onChange={(e) => setMcaCin(e.target.value)}
                  placeholder="e.g. U55101KA2021PTC145678"
                  className={seekerTheme.input}
                />
                <span className="text-[8px] text-slate-400 mt-0.5 block">21-digit MCA code</span>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Trademark Number</label>
                <input
                  type="text"
                  value={trademarkNumber}
                  onChange={(e) => setTrademarkNumber(e.target.value)}
                  placeholder="e.g. TM-1234567"
                  className={seekerTheme.input}
                />
                <span className="text-[8px] text-slate-400 mt-0.5 block">Optional, if known</span>
              </div>
            </div>

            <div className="border-t border-blue-100 pt-4 space-y-3">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="consent_checkbox"
                  checked={consentAccepted}
                  onChange={(e) => setConsentAccepted(e.target.checked)}
                  className="mt-1 shrink-0 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="consent_checkbox" className="text-[11px] text-slate-500 leading-normal select-none font-normal">
                  <strong>Declaration of Authorization & Diligence:</strong> I hereby authorize BrizX India Bureau and its legal audit desk to query corporate registries, trademark archives, and litigation indexes for public records on the brand listed above. I understand this constitutes an independent diligence service, not automated final franchise verification.
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
            >
              <Send size={13} /> Submit Bureau Dilligence Request
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: LEGAL COUNSEL DESK */}
      {activeTab === 'COUNSEL' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Ask Advisor Form */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm space-y-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base font-heading">Consult Legal Advisors</h3>
              <p className="text-xs text-slate-500 mt-1">Submit agreement questions, exit clause terms, or royalty disputes to our panel of franchise attorneys.</p>
            </div>

            {advisorSuccess && (
              <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 p-3 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-600" />
                Diligence query posted. Panel response will appear inside 2 hours.
              </div>
            )}

            <form onSubmit={handleQuerySubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Inquiry Category</label>
                <select
                  value={queryCategory}
                  onChange={(e) => setQueryCategory(e.target.value)}
                  className={seekerTheme.select}
                >
                  <option value="Royalty & Finance">Royalty & Finance</option>
                  <option value="Agreement & FDD">Franchise Agreement Clauses</option>
                  <option value="Exclusivity & Territory">Territorial Boundaries & Exclusivity</option>
                  <option value="Exit & Dispute">Exit Deeds, Fees & Liabilities</option>
                  <option value="Other Legal">Other Intellectual Property / Legal</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">State your agreement query *</label>
                <textarea
                  rows={4}
                  required
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="State the terms or question in detail (e.g. 'Is the 10% lock-in period penalty legally binding under Karnataka municipal regulations?')"
                  className={seekerTheme.input}
                />
              </div>

              <div className="bg-[#F7FAFF] p-3 rounded-xl border border-blue-50 text-[9px] text-slate-600 font-normal leading-relaxed">
                <strong>Disclosures & Liability Limitations:</strong> Queries are vetted by panel corporate attorneys registered under the Bar Council of India. General regulatory guidance is provided; formal corporate agreements require bespoke legal retainers.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Send size={11} /> Submit Legal Query
              </button>
            </form>
          </div>

          {/* Past Vetted Counsel Answers */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm space-y-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base font-heading">Vetted Legal Feed ({userQueries.length})</h3>
              <p className="text-xs text-slate-500 mt-1">Vetted responses from our panel of corporate franchise attorneys.</p>
            </div>

            {userQueries.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs font-normal">
                No compliance legal queries posted. Ask a question using the panel on the left.
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {userQueries.map((q) => (
                  <div key={q.id} className="p-4 bg-white rounded-2xl border border-blue-50 space-y-3 text-left">
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-black uppercase text-slate-500 block tracking-wider">
                          CATEGORY: {q.category || 'Royalty & Finance'}
                        </span>
                        <h4 className="text-xs font-extrabold text-slate-900">
                          Q: {q.question}
                        </h4>
                      </div>
                      <span className={`px-2.5 py-0.5 text-[9px] font-extrabold rounded-lg border shrink-0 ${
                        q.status === 'ANSWERED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                      }`}>
                        {q.status}
                      </span>
                    </div>

                    <div className="bg-[#F7FAFF] p-3.5 rounded-xl border border-blue-50 space-y-2">
                      <p className="text-xs text-slate-700 leading-relaxed font-normal">
                        {q.answer || 'Analyzing corporate statutory codes. Our panel will post a vetted legal analysis within 2 hours.'}
                      </p>
                      
                      {q.status === 'ANSWERED' && (
                        <div className="pt-2 border-t border-blue-50 flex items-center justify-between text-[9px] text-slate-500">
                          <div className="flex items-center gap-1 font-bold">
                            <User size={10} />
                            <span>Vetted by: {q.advisorName || 'BrizX Corporate Attorney'}</span>
                          </div>
                          <span>Answered on {q.answeredAt ? new Date(q.answeredAt).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
