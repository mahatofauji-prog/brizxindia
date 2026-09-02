import React, { useState } from 'react';
import { 
  X, ShieldCheck, ShieldAlert, CheckCircle2, Clock, FileText, ExternalLink, 
  MapPin, Phone, Mail, Building2, Eye, Download, AlertCircle, Layers, Calendar, 
  DollarSign, Check, ChevronRight, Award, UserCheck, ShieldX, Send, Loader2
} from 'lucide-react';
import { Brand, RejectionCategory, RegistrationStatus } from '../../types';
import RejectionModal from './RejectionModal';
import EmailNotificationSection from './EmailNotificationSection';
import { useData } from '../../context/DataContext';

interface BrandApplicationReviewModalProps {
  brand: Brand | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (brandId: string) => void | Promise<void>;
  onReject: (brandId: string, category: RejectionCategory, reason: string) => void | Promise<void>;
  onStatusChange: (brandId: string, status: RegistrationStatus) => void | Promise<void>;
}

export const BrandApplicationReviewModal: React.FC<BrandApplicationReviewModalProps> = ({
  brand,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onStatusChange
}) => {
  const { emailLogs, sendApplicationEmail } = useData();
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'EMAIL'>('DETAILS');
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [docPreview, setDocPreview] = useState<{ title: string; content?: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !brand) return null;

  const currentStatus: RegistrationStatus = brand.applicationStatus || (brand.verified ? 'APPROVED' : 'PENDING_REVIEW');
  const documents = brand.documents || [
    { id: 'gst', name: 'GST_Registration_Certificate.pdf', size: '1.4 MB', type: 'GST Certificate', date: brand.submittedAt || '2026-08-20', status: 'VERIFIED' },
    { id: 'pan', name: 'Company_PAN_Card.pdf', size: '850 KB', type: 'PAN Card', date: brand.submittedAt || '2026-08-20', status: 'VERIFIED' },
    { id: 'inc', name: 'Certificate_of_Incorporation.pdf', size: '2.1 MB', type: 'Certificate of Incorporation', date: brand.submittedAt || '2026-08-20', status: 'VERIFIED' },
    { id: 'fin', name: 'Audited_Financials_FY25.pdf', size: '4.5 MB', type: 'Financial Audit Report', date: brand.submittedAt || '2026-08-20', status: 'PENDING' }
  ];

  const handleConfirmReject = async (category: RejectionCategory, reason: string) => {
    if (!brand || !brand.id) return;
    setIsRejectionModalOpen(false);
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await onReject(brand.id, category, reason);
      setActiveTab('EMAIL');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to reject brand application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveClick = async () => {
    if (!brand || !brand.id) {
      setErrorMessage('Invalid brand application reference.');
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await onApprove(brand.id);
      setActiveTab('EMAIL');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to approve brand application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const applicantEmail = brand.email || brand.contactEmail || 'brand.contact@brizxindia.com';
  const brandLogs = emailLogs.filter(l => l.applicationId === brand.id || l.recipient === applicantEmail);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 md:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Top Navigation / Status Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl">
              <Building2 size={20} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-blue-300">Brand Application Management</span>
                <span className="text-[10px] text-slate-400">ID: {brand.id}</span>
              </div>
              <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
                {brand.brandName || brand.companyName || 'Brand Registration'}
                {brand.verified && <ShieldCheck size={18} className="text-emerald-400" />}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Navigation Header */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 pt-3 flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('DETAILS')}
            className={`px-5 py-2.5 rounded-t-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 border-t border-x transition-all cursor-pointer ${
              activeTab === 'DETAILS'
                ? 'bg-white border-slate-200 text-blue-700 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FileText size={15} /> Application Review & Docs
          </button>

          <button
            onClick={() => setActiveTab('EMAIL')}
            className={`px-5 py-2.5 rounded-t-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 border-t border-x transition-all cursor-pointer ${
              activeTab === 'EMAIL'
                ? 'bg-white border-slate-200 text-blue-700 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Mail size={15} /> Email Notification & Logs
            {brandLogs.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-blue-600 text-white">
                {brandLogs.length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'EMAIL' ? (
            <EmailNotificationSection
              applicationId={brand.id}
              userId={(brand as any).userId || brand.id}
              applicationType="BRAND"
              applicantName={(brand as any).applicantName || brand.contactPerson || 'Brand Owner'}
              brandName={brand.brandName}
              recipientEmail={applicantEmail}
              currentStatus={currentStatus}
              rejectionCategory={brand.rejectionCategory}
              rejectionReason={brand.rejectionReason}
              rejectionDetails={(brand as any).rejectionDetails}
              industry={brand.industry}
              investment={brand.investmentRequired?.min ? `₹${brand.investmentRequired.min}–${brand.investmentRequired.max} Lakhs` : undefined}
              city={brand.city}
              emailHistory={emailLogs}
              onSendEmail={sendApplicationEmail}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT & CENTER: Full Application Info (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* BRAND IDENTITY */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-800 flex items-center gap-2">
                <Building2 size={16} /> Brand Identity
              </h3>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.brandName} className="w-16 h-16 rounded-xl object-contain border border-slate-100 bg-white" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-2xl">
                    {brand.brandName ? brand.brandName[0] : 'B'}
                  </div>
                )}
                <div className="space-y-1">
                  <h4 className="text-lg font-black text-slate-900">{brand.brandName}</h4>
                  <p className="text-xs font-bold text-slate-500 italic">"{brand.tagline || 'Franchise Partner'}"</p>
                  <p className="text-xs text-slate-600 line-clamp-2">{brand.description || brand.fullAbout || 'No description provided.'}</p>
                </div>
              </div>

              {/* Cover Image / Gallery Preview */}
              {brand.coverImage && (
                <div className="relative rounded-xl overflow-hidden h-36 border border-slate-200">
                  <img src={brand.coverImage} alt="Cover" className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-xs">
                    Hero Banner Image
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Website</span>
                  <a href={brand.website || '#'} target="_blank" rel="noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1 mt-0.5">
                    {brand.website || 'N/A'} <ExternalLink size={12} />
                  </a>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Contact Details</span>
                  <span className="font-bold text-slate-800 block mt-0.5">{brand.contactEmail || brand.email}</span>
                  <span className="text-slate-500 text-[11px] block">{brand.contactPhone || brand.phone || brand.whatsappNumber || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* BUSINESS & FRANCHISE DETAILS */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-800 flex items-center gap-2">
                <Layers size={16} /> Business & Franchise Parameters
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Industry Sector</span>
                  <span className="font-bold text-slate-900">{brand.industry || 'Food & Beverages'}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Investment Range</span>
                  <span className="font-bold text-emerald-700">
                    ₹{brand.investmentRequired?.min || brand.minInvestment || 10} - ₹{brand.investmentRequired?.max || brand.maxInvestment || 25} Lakhs
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Franchise Fee</span>
                  <span className="font-bold text-slate-900">₹{brand.franchiseFee || 3.5} Lakhs</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Expected ROI / Payback</span>
                  <span className="font-bold text-slate-900">{brand.roiPayback || brand.paybackPeriod || '12-18 Months'}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Space Required</span>
                  <span className="font-bold text-slate-900">{brand.spaceRequired || '300 - 600 Sq.Ft'}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Royalty Fee</span>
                  <span className="font-bold text-slate-900">{brand.royaltyFee || brand.royalty || '5% Gross Sales'}</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Target Expansion Cities</span>
                  <p className="font-bold text-slate-800 mt-0.5">
                    {brand.cityTargets?.join(', ') || brand.city || 'Pan-India, Tier 1 & Tier 2 Hubs'}
                  </p>
                </div>
                {brand.expansionPlans && (
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Expansion Plans</span>
                    <p className="text-slate-700 mt-0.5">{brand.expansionPlans}</p>
                  </div>
                )}
                {brand.trainingDetails && (
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Support & Training</span>
                    <p className="text-slate-700 mt-0.5">{brand.trainingDetails}</p>
                  </div>
                )}
              </div>
            </div>

            {/* UPLOADED DOCUMENTS VAULT */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-800 flex items-center gap-2">
                <FileText size={16} /> Submitted Business Documents Vault
              </h3>

              <div className="space-y-2">
                {documents.map((doc: any) => (
                  <div key={doc.id} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <FileText size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{doc.name}</p>
                        <p className="text-[10px] text-slate-400">{doc.type} • {doc.size} • Uploaded {doc.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {doc.status || 'SUBMITTED'}
                      </span>
                      <button
                        onClick={() => setDocPreview({ title: doc.name, content: `Simulated secure document viewer for ${doc.name}. Document is verified.` })}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Eye size={12} /> Preview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT AREA: APPLICATION STATUS & ACTION CONTROLS */}
          <div className="space-y-6">
            
            <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Current Status</span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  currentStatus === 'APPROVED' ? 'bg-emerald-500 text-slate-950' :
                  currentStatus === 'REJECTED' ? 'bg-rose-500 text-white' :
                  currentStatus === 'UNDER_REVIEW' ? 'bg-purple-500 text-white' :
                  currentStatus === 'PENDING_REVIEW' ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-slate-200'
                }`}>
                  {currentStatus.replace('_', ' ')}
                </span>
              </div>

              {/* Status Transition Control */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">
                  Change Application State
                </label>
                <select
                  value={currentStatus}
                  onChange={(e) => onStatusChange(brand.id, e.target.value as RegistrationStatus)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none cursor-pointer"
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="PENDING_REVIEW">PENDING REVIEW</option>
                  <option value="UNDER_REVIEW">UNDER REVIEW</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>

              {/* Audit Trail info */}
              <div className="text-[11px] text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Submitted Date:</span>
                  <span className="font-bold">{brand.submittedAt ? new Date(brand.submittedAt).toLocaleDateString() : 'Recent'}</span>
                </div>
                {brand.reviewedBy && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reviewer:</span>
                    <span className="font-bold text-blue-300">{brand.reviewedBy}</span>
                  </div>
                )}
                {brand.verifiedAt && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Decision Date:</span>
                    <span className="font-bold">{new Date(brand.verifiedAt).toLocaleDateString()}</span>
                  </div>
                )}
                {currentStatus === 'REJECTED' && brand.rejectionReason && (
                  <div className="bg-rose-950/80 border border-rose-800/80 p-2.5 rounded-xl text-rose-200 mt-2 space-y-1">
                    <span className="text-[9px] font-black uppercase text-rose-300 block">Rejection Note ({brand.rejectionCategory || 'General'})</span>
                    <p className="text-[11px] font-semibold">{brand.rejectionReason}</p>
                  </div>
                )}
              </div>

              {errorMessage && (
                <div className="bg-rose-950/90 border border-rose-700 text-rose-200 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle size={16} className="text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Primary Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleApproveClick}
                  disabled={isSubmitting || currentStatus === 'APPROVED'}
                  className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    currentStatus === 'APPROVED' 
                      ? 'bg-emerald-950 text-emerald-500 border border-emerald-800 cursor-not-allowed'
                      : isSubmitting
                      ? 'bg-emerald-700 text-white cursor-wait opacity-80'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Approving Brand Application...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} /> Approve Brand Application
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsRejectionModalOpen(true)}
                  disabled={isSubmitting || currentStatus === 'REJECTED'}
                  className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    currentStatus === 'REJECTED'
                      ? 'bg-rose-950 text-rose-500 border border-rose-800 cursor-not-allowed'
                      : 'bg-rose-600/20 hover:bg-rose-600 border border-rose-600 text-rose-200 hover:text-white'
                  }`}
                >
                  <ShieldX size={16} /> Reject Application
                </button>
              </div>
            </div>

            {/* Email Quick Action Card */}
            <div 
              onClick={() => setActiveTab('EMAIL')}
              className="bg-blue-50 border border-blue-200 p-4 rounded-2xl text-xs space-y-2 cursor-pointer hover:bg-blue-100/70 transition-colors"
            >
              <h4 className="font-bold text-blue-900 flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Mail size={16} className="text-blue-600" /> Email Notification Center</span>
                <ChevronRight size={14} className="text-blue-600" />
              </h4>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Compose or review notification emails sent to {applicantEmail}.
              </p>
            </div>

          </div>

        </div>
      )}

      </div>
    </div>

      {/* Rejection Modal */}
      <RejectionModal
        isOpen={isRejectionModalOpen}
        applicantName={brand.brandName || brand.companyName || 'Brand'}
        onClose={() => setIsRejectionModalOpen(false)}
        onConfirm={handleConfirmReject}
      />

      {/* Document Preview Modal */}
      {docPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 relative">
            <button onClick={() => setDocPreview(null)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
              <X size={18} />
            </button>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <FileText size={18} className="text-blue-600" /> {docPreview.title}
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-700 border border-slate-200">
              {docPreview.content}
            </div>
            <div className="flex justify-end">
              <button onClick={() => setDocPreview(null)} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl">
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandApplicationReviewModal;
