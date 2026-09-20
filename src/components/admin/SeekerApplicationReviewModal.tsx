import React, { useState } from 'react';
import { 
  X, ShieldCheck, ShieldAlert, CheckCircle2, Clock, FileText, ExternalLink, 
  MapPin, Phone, Mail, User, Eye, Download, AlertCircle, Layers, Calendar, 
  DollarSign, Check, ChevronRight, Award, UserCheck, ShieldX, Briefcase, Send
} from 'lucide-react';
import { FranchiseSeeker, RejectionCategory, RegistrationStatus } from '../../types';
import RejectionModal from './RejectionModal';
import EmailNotificationSection from './EmailNotificationSection';
import { useData } from '../../context/DataContext';

interface SeekerApplicationReviewModalProps {
  seeker: FranchiseSeeker | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (seekerId: string) => void;
  onReject: (seekerId: string, category: RejectionCategory, reason: string) => void;
  onStatusChange: (seekerId: string, status: RegistrationStatus) => void;
}

export const SeekerApplicationReviewModal: React.FC<SeekerApplicationReviewModalProps> = ({
  seeker,
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

  if (!isOpen || !seeker) return null;

  const currentStatus: RegistrationStatus = seeker.applicationStatus || (seeker.verified ? 'APPROVED' : 'PENDING_REVIEW');
  const documents = seeker.documents || [
    { id: 'aadhaar', name: 'Aadhaar_Card_Verified.pdf', size: '2.4 MB', type: 'Aadhaar Card', date: seeker.submittedAt || '2026-08-22', status: 'VERIFIED' },
    { id: 'pan', name: 'PAN_Card_Investor.pdf', size: '1.1 MB', type: 'PAN Card', date: seeker.submittedAt || '2026-08-22', status: 'VERIFIED' },
    { id: 'gst', name: 'GST_Registration_Certificate.pdf', size: '3.8 MB', type: 'GST (Optional)', date: seeker.submittedAt || '2026-08-22', status: 'VERIFIED' }
  ];

  const handleConfirmReject = (category: RejectionCategory, reason: string) => {
    setIsRejectionModalOpen(false);
    onReject(seeker.id, category, reason);
    setActiveTab('EMAIL');
  };

  const handleApproveClick = () => {
    onApprove(seeker.id);
    setActiveTab('EMAIL');
  };

  const recipientEmail = seeker.email || 'seeker.contact@brizxindia.com';
  const seekerLogs = emailLogs.filter(l => l.applicationId === seeker.id || l.recipient === recipientEmail);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 md:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Top Navigation / Status Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl">
              <User size={20} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-300">Seeker Application Management</span>
                <span className="text-[10px] text-slate-400">ID: {seeker.id}</span>
              </div>
              <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
                {seeker.name || 'Investor Application'}
                {seeker.verified && <ShieldCheck size={18} className="text-emerald-400" />}
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
                ? 'bg-white border-slate-200 text-indigo-700 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FileText size={15} /> Application Review & Docs
          </button>

          <button
            onClick={() => setActiveTab('EMAIL')}
            className={`px-5 py-2.5 rounded-t-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 border-t border-x transition-all cursor-pointer ${
              activeTab === 'EMAIL'
                ? 'bg-white border-slate-200 text-indigo-700 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Mail size={15} /> Email Notification & Logs
            {seekerLogs.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-600 text-white">
                {seekerLogs.length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'EMAIL' ? (
            <EmailNotificationSection
              applicationId={seeker.id}
              userId={seeker.id}
              applicationType="SEEKER"
              applicantName={seeker.name || 'Franchise Seeker'}
              recipientEmail={recipientEmail}
              currentStatus={currentStatus}
              rejectionCategory={seeker.rejectionCategory}
              rejectionReason={seeker.rejectionReason}
              rejectionDetails={(seeker as any).rejectionDetails}
              industry={seeker.industry}
              investment={seeker.investment ? `₹${seeker.investment} Lakhs` : undefined}
              city={seeker.city}
              emailHistory={emailLogs}
              onSendEmail={sendApplicationEmail}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT & CENTER: Full Application Info (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* PERSONAL & PROFESSIONAL DETAILS */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-indigo-900 flex items-center gap-2">
                <User size={16} /> Personal & Professional Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Full Name</span>
                  <span className="font-bold text-slate-900 text-sm">{seeker.name}</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Contact Information</span>
                  <p className="font-bold text-slate-800">{seeker.email}</p>
                  <p className="text-slate-500 text-[11px]">{seeker.phone || seeker.whatsApp || 'N/A'}</p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Location / Address</span>
                  <p className="font-bold text-slate-800">{seeker.city}, {seeker.state || 'India'}</p>
                  <p className="text-slate-500 text-[11px]">{seeker.address || 'Address on record'}</p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Occupation & Experience</span>
                  <p className="font-bold text-slate-900">{seeker.occupation || 'Investor / Business Professional'}</p>
                  <p className="text-slate-500 text-[11px]">{seeker.experience || 'Prior business background'}</p>
                </div>
              </div>

              {seeker.linkedInUrl && (
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Professional Profile</span>
                  <a href={seeker.linkedInUrl} target="_blank" rel="noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1 mt-0.5">
                    {seeker.linkedInUrl} <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>

            {/* INVESTMENT MATRIX */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-indigo-900 flex items-center gap-2">
                <DollarSign size={16} /> Investor Matrix & Preferences
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Budget Range</span>
                  <span className="font-bold text-emerald-700">
                    ₹{seeker.minInvestment || seeker.investment || 10} - ₹{seeker.maxInvestment || 30} Lakhs
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Available Liquid Capital</span>
                  <span className="font-bold text-slate-900">₹{seeker.availableCapital || seeker.investment || 20} Lakhs</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Funding Source</span>
                  <span className="font-bold text-slate-900">{seeker.fundingSource || 'Self Funded / Equity'}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Investment Timeline</span>
                  <span className="font-bold text-slate-900">{seeker.timeline || 'Immediate (0-3 Months)'}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Risk Appetite</span>
                  <span className="font-bold text-slate-900">{seeker.investmentRiskAppetite || seeker.riskAppetite || 'Moderate'}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Franchise Model</span>
                  <span className="font-bold text-slate-900">{seeker.preferredFranchiseModel || seeker.franchiseType || 'FOFO / FOCO'}</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Preferred Target Cities</span>
                  <p className="font-bold text-slate-800 mt-0.5">
                    {seeker.preferredCities?.join(', ') || seeker.city || 'Bengaluru, Hyderabad, Pune'}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Preferred Industries</span>
                  <p className="font-bold text-slate-800 mt-0.5">
                    {seeker.preferredIndustries?.join(', ') || seeker.industry || 'Food & Beverages, Retail'}
                  </p>
                </div>
                {seeker.businessBackground && (
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Business Background & Experience</span>
                    <p className="text-slate-700 mt-0.5">{seeker.businessBackground}</p>
                  </div>
                )}
                {seeker.entrepreneurshipVision && (
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Entrepreneurship Vision</span>
                    <p className="text-slate-700 mt-0.5">{seeker.entrepreneurshipVision}</p>
                  </div>
                )}
              </div>
            </div>

            {/* DOCUMENT VAULT */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-indigo-900 flex items-center gap-2">
                <FileText size={16} /> Verification Document Vault
              </h3>

              <div className="space-y-2">
                {documents.map((doc: any) => (
                  <div key={doc.id} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <FileText size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{doc.name}</p>
                        <p className="text-[10px] text-slate-400">{doc.type} • {doc.size} • Uploaded {doc.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {doc.status || 'VERIFIED'}
                      </span>
                      <button
                        onClick={() => setDocPreview({ title: doc.name, content: `Simulated secure document viewer for ${doc.name}. Document is verified and encrypted.` })}
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

              {/* Status Selector */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">
                  Change Application State
                </label>
                <select
                  value={currentStatus}
                  onChange={(e) => onStatusChange(seeker.id, e.target.value as RegistrationStatus)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none cursor-pointer"
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="PENDING_REVIEW">PENDING REVIEW</option>
                  <option value="UNDER_REVIEW">UNDER REVIEW</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>

              {/* Audit Trail Info */}
              <div className="text-[11px] text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Submitted Date:</span>
                  <span className="font-bold">{seeker.submittedAt ? new Date(seeker.submittedAt).toLocaleDateString() : 'Recent'}</span>
                </div>
                {seeker.reviewedBy && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reviewer:</span>
                    <span className="font-bold text-indigo-300">{seeker.reviewedBy}</span>
                  </div>
                )}
                {seeker.verifiedAt && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Decision Date:</span>
                    <span className="font-bold">{new Date(seeker.verifiedAt).toLocaleDateString()}</span>
                  </div>
                )}
                {currentStatus === 'REJECTED' && seeker.rejectionReason && (
                  <div className="bg-rose-950/80 border border-rose-800/80 p-2.5 rounded-xl text-rose-200 mt-2 space-y-1">
                    <span className="text-[9px] font-black uppercase text-rose-300 block">Rejection Note ({seeker.rejectionCategory || 'General'})</span>
                    <p className="text-[11px] font-semibold">{seeker.rejectionReason}</p>
                  </div>
                )}
              </div>

              {/* Primary Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleApproveClick}
                  disabled={currentStatus === 'APPROVED'}
                  className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    currentStatus === 'APPROVED' 
                      ? 'bg-emerald-950 text-emerald-500 border border-emerald-800 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md hover:shadow-lg'
                  }`}
                >
                  <CheckCircle2 size={16} /> Approve Seeker Profile
                </button>

                <button
                  onClick={() => setIsRejectionModalOpen(true)}
                  disabled={currentStatus === 'REJECTED'}
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
              className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl text-xs space-y-2 cursor-pointer hover:bg-indigo-100/70 transition-colors"
            >
              <h4 className="font-bold text-indigo-900 flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Mail size={16} className="text-indigo-600" /> Email Notification Center</span>
                <ChevronRight size={14} className="text-indigo-600" />
              </h4>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Compose or review notification emails sent to {recipientEmail}.
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
        applicantName={seeker.name || 'Seeker'}
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
              <FileText size={18} className="text-indigo-600" /> {docPreview.title}
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

export default SeekerApplicationReviewModal;
