import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, ShieldAlert, CheckCircle2, Clock, FileText, AlertCircle, Building, 
  Search, Sparkles, Download, FileCheck, HelpCircle, ArrowRight, Upload, 
  Trash2, Calendar, User, Check, X, File, AlertTriangle, Activity, Edit3, MessageSquare
} from 'lucide-react';

export default function AdminBrandVerification() {
  const { user } = useAuth();
  const { 
    verificationRequests, 
    verificationDocuments, 
    verificationChecks, 
    verificationAuditLogs, 
    legalAdvisorQuestions,
    updateVerificationRequest,
    reviewVerificationDocument,
    updateVerificationCheck,
    answerLegalAdvisor
  } = useData();

  // Active Selected Request
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    verificationRequests.length > 0 ? verificationRequests[0].id : null
  );

  const selectedRequest = verificationRequests.find(r => r.id === selectedRequestId);
  const selectedChecks = selectedRequest ? verificationChecks.filter(c => c.requestId === selectedRequest.id) : [];
  const selectedDocs = selectedRequest ? verificationDocuments.filter(d => d.requestId === selectedRequest.id) : [];
  const selectedLogs = selectedRequest ? verificationAuditLogs.filter(l => l.requestId === selectedRequest.id) : [];

  // Active Admin Page Tab
  const [adminTab, setAdminTab] = useState<'DUE_DILIGENCE' | 'LEGAL_QUESTIONS'>('DUE_DILIGENCE');

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Interactive Action States for selected request
  const [newStatus, setNewStatus] = useState<string>('');
  const [statusSuccess, setStatusSuccess] = useState(false);

  // Document review form states
  const [reviewingDocId, setReviewingDocId] = useState<string | null>(null);
  const [reviewerNote, setReviewerNote] = useState('');
  const [docReviewSuccess, setDocReviewSuccess] = useState(false);

  // Check item review states
  const [editingCheckId, setEditingCheckId] = useState<string | null>(null);
  const [checkStatus, setCheckStatus] = useState<'PASSED' | 'FAILED' | 'PENDING' | 'NOT_APPLICABLE'>('PENDING');
  const [checkNotes, setCheckNotes] = useState('');
  const [checkEvidence, setCheckEvidence] = useState('');
  const [checkSuccess, setCheckSuccess] = useState(false);

  // Legal Answer States
  const [answeringQuestionId, setAnsweringQuestionId] = useState<string | null>(null);
  const [legalAnswerText, setLegalAnswerText] = useState('');
  const [attorneySignature, setAttorneySignature] = useState('Advocate Ramesh Sen (BrizX Legal Desk)');
  const [legalSuccess, setLegalSuccess] = useState(false);

  // Filtered requests
  const filteredRequests = verificationRequests.filter(req => {
    const matchesSearch = req.brandName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (req.gstin || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !newStatus || !user) return;

    updateVerificationRequest(selectedRequest.id, { status: newStatus as any }, user.id, user.name || 'System Auditor', user.role);
    setStatusSuccess(true);
    setTimeout(() => setStatusSuccess(false), 2000);
  };

  const submitDocumentReview = (docId: string, status: 'ACCEPTED' | 'REJECTED') => {
    if (!selectedRequest || !user) return;

    reviewVerificationDocument(
      docId,
      status,
      reviewerNote.trim() || `Document ${status.toLowerCase()} after statutory criteria verification.`,
      user.id,
      user.name || 'System Auditor'
    );

    setReviewingDocId(null);
    setReviewerNote('');
    setDocReviewSuccess(true);
    setTimeout(() => setDocReviewSuccess(false), 2000);
  };

  const handleEditCheckClick = (chk: any) => {
    setEditingCheckId(chk.checkId);
    setCheckStatus(chk.status as any);
    setCheckNotes(chk.notes || '');
    setCheckEvidence(chk.evidenceReferences || '');
  };

  const saveCheckUpdate = () => {
    if (!selectedRequest || !editingCheckId || !user) return;

    updateVerificationCheck(
      editingCheckId,
      checkStatus,
      checkNotes.trim(),
      checkEvidence.trim(),
      user.id,
      user.name || 'System Auditor'
    );

    setEditingCheckId(null);
    setCheckNotes('');
    setCheckEvidence('');
    setCheckSuccess(true);
    setTimeout(() => setCheckSuccess(false), 2000);
  };

  const handleAnswerLegalQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answeringQuestionId || !legalAnswerText.trim() || !user) return;

    answerLegalAdvisor(
      answeringQuestionId,
      legalAnswerText.trim(),
      attorneySignature.trim() || 'Advocate Ramesh Sen (BrizX Legal Desk)'
    );

    setAnsweringQuestionId(null);
    setLegalAnswerText('');
    setLegalSuccess(true);
    setTimeout(() => setLegalSuccess(false), 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'UNDER_REVIEW': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'DOCUMENTS_REQUIRED': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'VERIFICATION_IN_PROGRESS': return 'bg-blue-50/50 text-blue-800 border-blue-200';
      case 'VERIFIED': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'REJECTED': return 'bg-red-50 text-red-800 border-red-200';
      case 'VERIFICATION_EXPIRED': return 'bg-slate-100 text-slate-700 border-slate-300';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 bg-slate-50/50 dark:bg-slate-950/30 min-h-screen">
      
      {/* Top Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <span className="text-[10px] font-black tracking-widest text-blue-600 dark:text-blue-400 uppercase">
            Administrative Registry Operations
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight font-heading mt-0.5">
            BrizX India Verification Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Perform FDD legal audits, verify MCA filing records, manage checklist registries, and vet legal help questions.
          </p>
        </div>

        {/* View Switchers */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800">
          <button
            onClick={() => setAdminTab('DUE_DILIGENCE')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              adminTab === 'DUE_DILIGENCE' 
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-xs' 
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Due Diligence Board
          </button>
          <button
            onClick={() => setAdminTab('LEGAL_QUESTIONS')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              adminTab === 'LEGAL_QUESTIONS' 
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-xs' 
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Advisor Counsel ({legalAdvisorQuestions.filter(q => q.status === 'OPEN').length} Pending)
          </button>
        </div>
      </div>

      {/* TAB 1: BRAND VERIFICATION BOARD */}
      {adminTab === 'DUE_DILIGENCE' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Requests List */}
          <div className="xl:col-span-4 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
              
              {/* Search & Filter Header */}
              <div className="space-y-2">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Inquiry Pipeline ({filteredRequests.length})</h3>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search brand, ID, GSTIN..."
                    className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <Search size={12} className="absolute left-2.5 top-3 text-slate-400" />
                </div>

                <div className="grid grid-cols-1 gap-1 pt-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Pipeline Stage Filter</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="ALL">All Stages</option>
                    <option value="SUBMITTED">Submitted</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="DOCUMENTS_REQUIRED">Documents Required</option>
                    <option value="VERIFICATION_IN_PROGRESS">Verification In Progress</option>
                    <option value="VERIFIED">Verified</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="VERIFICATION_EXPIRED">Verification Expired</option>
                  </select>
                </div>
              </div>

              {/* List Entries */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pt-2 border-t border-slate-100 dark:border-slate-800">
                {filteredRequests.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs font-normal">
                    No registry requests match filters.
                  </div>
                ) : (
                  filteredRequests.map((req) => {
                    const active = req.id === selectedRequestId;
                    const cStyle = getStatusColor(req.status);
                    return (
                      <div
                        key={req.id}
                        onClick={() => {
                          setSelectedRequestId(req.id);
                          setNewStatus(req.status);
                          setEditingCheckId(null);
                          setReviewingDocId(null);
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                          active 
                            ? 'bg-blue-50/50 dark:bg-slate-800/60 border-blue-500' 
                            : 'bg-slate-50/60 dark:bg-slate-900/40 hover:bg-slate-50 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <div>
                            <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-xs">
                              {req.brandName}
                            </h4>
                            <span className="text-[9px] text-slate-400 block font-mono mt-0.5">ID: {req.id}</span>
                          </div>
                          <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-lg border ${cStyle}`}>
                            {req.status}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold border-t border-slate-200/40 dark:border-slate-800/40 pt-2 mt-2">
                          <span>Cat: {req.category}</span>
                          <span>{new Date(req.submittedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          </div>

          {/* Right Column: Desk Console Workspace */}
          <div className="xl:col-span-8">
            {!selectedRequest ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-xs shadow-xs">
                Select a corporate due diligence file from the left to load the auditor desk.
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* File Header & Pipeline State Modification */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
                        <span>Registry File: {selectedRequest.id}</span>
                        <span>•</span>
                        <span className="text-blue-600">Owner ID: {selectedRequest.seekerId}</span>
                      </div>
                      <h2 className="font-black text-slate-900 dark:text-slate-100 text-lg font-heading">
                        {selectedRequest.brandName} Audit Desk
                      </h2>
                    </div>

                    {/* Current Stage Indicator */}
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 text-xs font-black border rounded-xl ${getStatusColor(selectedRequest.status)}`}>
                        {selectedRequest.status}
                      </span>
                    </div>
                  </div>

                  {/* Metadata Fields */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-normal border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest block">MCA Company Name</span>
                      <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block mt-0.5">
                        {selectedRequest.mcaCin ? 'India Registered Entity' : 'Unregistered (Sole Proprietorship)'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest block">GSTIN Register Number</span>
                      <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 font-mono block mt-0.5">
                        {selectedRequest.gstin || 'AWAITING'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest block">MCA Corporate CIN</span>
                      <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 font-mono block mt-0.5">
                        {selectedRequest.mcaCin || 'AWAITING'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest block">Trademark Registration</span>
                      <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 font-mono block mt-0.5">
                        {selectedRequest.trademarkNumber || 'AWAITING'}
                      </span>
                    </div>
                  </div>

                  {/* Pipeline Action Panel */}
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                    <form onSubmit={handleStatusUpdate} className="flex flex-col sm:flex-row items-end gap-3">
                      <div className="flex-1 min-w-0 space-y-1">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Adjust File Pipeline Status
                        </label>
                        <select
                          value={newStatus || selectedRequest.status}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="SUBMITTED">Submitted</option>
                          <option value="UNDER_REVIEW">Under Review</option>
                          <option value="DOCUMENTS_REQUIRED">Documents Required</option>
                          <option value="VERIFICATION_IN_PROGRESS">Verification In Progress</option>
                          <option value="VERIFIED">Verified (Audit Certified)</option>
                          <option value="REJECTED">Rejected (Audit FAILED)</option>
                          <option value="VERIFICATION_EXPIRED">Verification Expired</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 shrink-0 cursor-pointer shadow-xs"
                      >
                        <Check size={13} /> Update Pipeline Stage
                      </button>
                    </form>

                    {statusSuccess && (
                      <div className="mt-2 text-emerald-600 text-[10px] font-extrabold flex items-center gap-1">
                        <CheckCircle2 size={12} /> Status changed. Audit log trail populated.
                      </div>
                    )}
                  </div>
                </div>

                {/* Checklist Audit Matrix */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
                  <div className="flex justify-between items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm font-heading">Registry Compliance Audits</h3>
                      <p className="text-xs text-slate-400">Validate statutory records, GST files, FDD clauses, and financial sheets.</p>
                    </div>

                    {checkSuccess && (
                      <div className="text-emerald-600 text-[10px] font-extrabold flex items-center gap-1 animate-bounce">
                        <CheckCircle2 size={12} /> Checkpoint updated!
                      </div>
                    )}
                  </div>

                  {editingCheckId ? (
                    /* Checkpoint Editor Interface */
                    <div className="p-4 bg-blue-50/50 dark:bg-slate-950/40 border border-blue-200 dark:border-slate-800 rounded-2xl space-y-4 text-left">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-black text-blue-800 dark:text-blue-400">
                          Editing Check: {selectedChecks.find(c => c.checkId === editingCheckId)?.checkName}
                        </h4>
                        <button 
                          onClick={() => setEditingCheckId(null)}
                          className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Audit Check Status</label>
                          <select
                            value={checkStatus}
                            onChange={(e: any) => setCheckStatus(e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 focus:outline-none"
                          >
                            <option value="PASSED">PASSED</option>
                            <option value="FAILED">FAILED</option>
                            <option value="PENDING">PENDING</option>
                            <option value="NOT_APPLICABLE">NOT APPLICABLE</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Evidence Reference / Registry ID</label>
                          <input
                            type="text"
                            value={checkEvidence}
                            onChange={(e) => setCheckEvidence(e.target.value)}
                            placeholder="e.g. GST-REG-29AABCU, MCA-CIN-2021"
                            className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Auditor Findings / Compliance Notes</label>
                        <textarea
                          rows={2}
                          value={checkNotes}
                          onChange={(e) => setCheckNotes(e.target.value)}
                          placeholder="Write technical findings, public archive lookups, or validation summaries..."
                          className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 focus:outline-none"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={saveCheckUpdate}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs"
                      >
                        Save Checkpoint Results
                      </button>
                    </div>
                  ) : (
                    /* Checkpoints Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedChecks.map((chk) => {
                        return (
                          <div 
                            key={chk.checkId} 
                            className="bg-slate-50/70 dark:bg-slate-950/40 p-4 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex flex-col justify-between space-y-3 text-left"
                          >
                            <div className="space-y-1">
                              <div className="flex justify-between items-start gap-2">
                                <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                                  {chk.checkName}
                                </h4>
                                <span className={`px-2 py-0.5 text-[8px] font-black rounded-md border ${
                                  chk.status === 'PASSED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                  chk.status === 'FAILED' ? 'bg-red-50 text-red-700 border-red-200 animate-pulse' :
                                  'bg-slate-100 text-slate-500 border-slate-300'
                                }`}>
                                  {chk.status}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 leading-normal font-normal">
                                {chk.description}
                              </p>
                            </div>

                            <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/80 flex justify-between items-end gap-2 text-[10px]">
                              <div className="min-w-0 text-slate-500">
                                {chk.notes ? (
                                  <span className="truncate block max-w-[170px]">
                                    <strong className="text-slate-700 dark:text-slate-300">Auditor findings:</strong> {chk.notes}
                                  </span>
                                ) : (
                                  <span className="text-slate-400 italic">No notes entered yet.</span>
                                )}
                              </div>
                              <button
                                onClick={() => handleEditCheckClick(chk)}
                                className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white rounded-lg flex items-center gap-1 shrink-0 font-bold"
                              >
                                <Edit3 size={10} /> Edit
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Submitted Documents & Audit Review Portal */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm font-heading">Document Review Queue ({selectedDocs.length})</h3>
                      <p className="text-xs text-slate-400">Inspect corporate filings and compliance certifications uploaded by user.</p>
                    </div>

                    {docReviewSuccess && (
                      <div className="text-emerald-600 text-[10px] font-extrabold flex items-center gap-1">
                        <CheckCircle2 size={12} /> Document status reviewed!
                      </div>
                    )}
                  </div>

                  {selectedDocs.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-xs font-normal">
                      No document deeds have been uploaded for review yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedDocs.map((doc) => {
                        const inReview = reviewingDocId === doc.documentId;
                        return (
                          <div 
                            key={doc.documentId} 
                            className="p-4 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex flex-col space-y-3 text-left"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                  <File size={16} />
                                </div>
                                <div>
                                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                                    {doc.fileName}
                                  </h4>
                                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                                    {doc.documentTypeName} • Size: {doc.fileSize}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-lg border ${
                                  doc.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                  doc.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                                  'bg-blue-50 text-blue-700 border-blue-200'
                                }`}>
                                  {doc.status}
                                </span>

                                {!inReview && doc.status === 'UPLOADED' && (
                                  <button
                                    onClick={() => {
                                      setReviewingDocId(doc.documentId);
                                      setReviewerNote(doc.reviewerNote || '');
                                    }}
                                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider"
                                  >
                                    Review
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Review Box overlay inline */}
                            {inReview && (
                              <div className="p-3.5 bg-blue-50/40 dark:bg-slate-950/60 border border-blue-200 dark:border-slate-800 rounded-xl space-y-3">
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Review Feedback Note</label>
                                  <textarea
                                    rows={2}
                                    value={reviewerNote}
                                    onChange={(e) => setReviewerNote(e.target.value)}
                                    placeholder="Write feedback for the user (e.g., 'GSTIN registration certificate accepted' or 'FDD agreement missing signature on pages 4 and 10')."
                                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 focus:outline-none"
                                  />
                                </div>

                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => submitDocumentReview(doc.documentId, 'ACCEPTED')}
                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                                  >
                                    <Check size={11} /> Accept Doc
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => submitDocumentReview(doc.documentId, 'REJECTED')}
                                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                                  >
                                    <X size={11} /> Reject Doc
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setReviewingDocId(null)}
                                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}

                            {doc.reviewerNote && !inReview && (
                              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/40 dark:border-slate-800/80 text-[10px] leading-relaxed text-slate-600 dark:text-slate-300">
                                <strong className="text-slate-800 dark:text-slate-200">Auditor Feedback:</strong> {doc.reviewerNote}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Audit Trail Timeline */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm font-heading">Registry Filing & Auditing Log Trail</h3>
                    <p className="text-xs text-slate-400">Sequenced logs documenting status shifts and check adjustments.</p>
                  </div>

                  <div className="relative border-l border-slate-200 dark:border-slate-800 pl-4 py-1 space-y-5 ml-2">
                    {selectedLogs.length === 0 ? (
                      <div className="text-slate-400 text-xs py-2 font-normal">No logs generated.</div>
                    ) : (
                      selectedLogs.map((log) => (
                        <div key={log.logId} className="relative text-xs">
                          {/* Timeline dot */}
                          <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 border border-white"></div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                            <span className="font-black text-slate-800 dark:text-slate-200">
                              {log.note}
                            </span>
                            <span className="text-[9px] text-slate-400 font-bold shrink-0">
                              {new Date(log.timestamp).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold">
                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded-md">
                              {log.actorRole.replace(/_/g, ' ')}
                            </span>
                            <span>•</span>
                            <span>By: {log.actorName}</span>
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

      {/* TAB 2: ADVISOR QUESTIONS VETTING PANEL */}
      {adminTab === 'LEGAL_QUESTIONS' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex justify-between items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-slate-100 font-heading">
                Corporate Attorney counsel desk
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Provide certified corporate replies for franchise seekers querying exit fees, Territorial clauses or statutory licensing regulations.
              </p>
            </div>

            {legalSuccess && (
              <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 size={13} /> Vetted answer posted successfully!
              </div>
            )}
          </div>

          {legalAdvisorQuestions.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs font-normal">
              No legal advisor questions submitted on the platform.
            </div>
          ) : (
            <div className="space-y-4">
              {legalAdvisorQuestions.map((q) => {
                const isAnswering = answeringQuestionId === q.id;
                return (
                  <div 
                    key={q.id} 
                    className="p-5 bg-slate-50/70 dark:bg-slate-950/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4 text-left"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/40 dark:border-slate-800/40 pb-3">
                      <div>
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">
                          Category: {q.category || 'Royalty & Finance'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">
                          Query Posted by seeker: {q.seekerName || 'Anonymous Seeker'}
                        </span>
                      </div>
                      <span className={`px-2.5 py-0.5 text-[9px] font-extrabold rounded-lg border ${
                        q.status === 'ANSWERED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                      }`}>
                        {q.status}
                      </span>
                    </div>

                    <div className="text-xs leading-relaxed font-extrabold text-slate-900 dark:text-slate-100">
                      Q: {q.question}
                    </div>

                    {isAnswering ? (
                      /* Reply Box form */
                      <form onSubmit={handleAnswerLegalQuery} className="bg-white dark:bg-slate-900 p-4 border border-blue-200 dark:border-slate-800 rounded-xl space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Attorney / Signatory Name</label>
                            <input
                              type="text"
                              required
                              value={attorneySignature}
                              onChange={(e) => setAttorneySignature(e.target.value)}
                              placeholder="Advocate Ramesh Sen (BrizX Legal Desk)"
                              className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Response Date</label>
                            <span className="text-xs font-bold text-slate-700 block py-2">{new Date().toLocaleDateString('en-IN')}</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Verified Corporate attorney Answer</label>
                          <textarea
                            rows={4}
                            required
                            value={legalAnswerText}
                            onChange={(e) => setLegalAnswerText(e.target.value)}
                            placeholder="Write in detail referencing Indian statutory codes, the Indian Contract Act 1872, FDD parameters or territorial regulations..."
                            className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs"
                          >
                            Post Verified Answer
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setAnsweringQuestionId(null);
                              setLegalAnswerText('');
                            }}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold uppercase tracking-wider"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/40 dark:border-slate-800/80 text-xs">
                        {q.status === 'ANSWERED' ? (
                          <div className="space-y-3">
                            <p className="text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                              {q.answer}
                            </p>
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                              <span className="font-extrabold text-slate-700 dark:text-slate-300">
                                Vetted by: {q.advisorName}
                              </span>
                              <span>Answered on {q.answeredAt ? new Date(q.answeredAt).toLocaleDateString() : 'N/A'}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 italic">This query is awaiting legal counsel response.</span>
                            <button
                              onClick={() => {
                                setAnsweringQuestionId(q.id);
                                setLegalAnswerText('');
                              }}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider"
                            >
                              Write attorney Reply
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
