import React, { useState } from 'react';
import { X, AlertTriangle, ShieldX } from 'lucide-react';
import { RejectionCategory } from '../../types';

interface RejectionModalProps {
  isOpen: boolean;
  applicantName: string;
  onClose: () => void;
  onConfirm: (category: RejectionCategory, reason: string) => void;
}

const REJECTION_CATEGORIES: RejectionCategory[] = [
  'Incomplete Information',
  'Invalid Documents',
  'Business Verification Failed',
  'Financial Verification Failed',
  'Duplicate Application',
  'Eligibility Criteria Not Met',
  'Other'
];

export const RejectionModal: React.FC<RejectionModalProps> = ({
  isOpen,
  applicantName,
  onClose,
  onConfirm
}) => {
  const [category, setCategory] = useState<RejectionCategory>('Incomplete Information');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please enter a detailed rejection reason / explanation.');
      return;
    }
    setError('');
    onConfirm(category, reason.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100">
            <ShieldX size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Reject Application</h3>
            <p className="text-xs text-slate-500 font-medium">
              Specify rejection reason for <span className="font-bold text-slate-800">{applicantName}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
              Rejection Reason Category <span className="text-rose-600">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as RejectionCategory)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:border-rose-600 outline-none transition-colors cursor-pointer"
            >
              {REJECTION_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
              Rejection Reason / Additional Explanation <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide specific feedback or missing requirements so the applicant can correct their application..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 focus:border-rose-600 outline-none transition-colors"
            />
            {error && <p className="text-xs text-rose-600 font-bold mt-1">{error}</p>}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2 text-[11px] text-amber-800 font-medium">
            <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <span>
              Rejecting will notify the applicant and keep their profile unpublished. They can re-submit after updating their details.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <ShieldX size={14} /> Confirm Rejection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RejectionModal;
