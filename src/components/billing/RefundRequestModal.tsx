import React, { useState } from 'react';
import { 
  AlertCircle, ShieldAlert, CheckCircle2, 
  X, Loader2, ArrowRight, RotateCcw 
} from 'lucide-react';
import { PaymentInvoice } from '../../types';

interface RefundRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: PaymentInvoice;
  onRequestRefund: (invoiceId: string, reason: string) => Promise<boolean>;
  onSuccess: () => void;
}

export default function RefundRequestModal({
  isOpen,
  onClose,
  invoice,
  onRequestRefund,
  onSuccess
}: RefundRequestModalProps) {
  const [reasonCategory, setReasonCategory] = useState('Accidental double purchase / wrong plan');
  const [detailedNotes, setDetailedNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const fullReason = `${reasonCategory}: ${detailedNotes || 'No additional notes provided'}`;
      const success = await onRequestRefund(invoice.id, fullReason);
      if (success) {
        setIsSubmitting(false);
        onSuccess();
        onClose();
      } else {
        throw new Error('Refund processing failed.');
      }
    } catch (err: any) {
      console.error('Refund request failed:', err);
      setError(err.message || 'Refund request failed. Please contact BrizX Billing Support.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-rose-50/50 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <RotateCcw size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Request Transaction Refund</h3>
              <p className="text-xs text-slate-500 font-medium">Invoice: <strong className="font-mono text-slate-800">{invoice.id}</strong></p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            disabled={isSubmitting}
            className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg cursor-pointer disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 font-semibold rounded-2xl flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500 font-bold">Item Description:</span>
              <span className="font-bold text-slate-900">{invoice.planName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-bold">Total Amount Paid:</span>
              <span className="font-black text-rose-700">₹{invoice.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-bold">Payment Method:</span>
              <span className="font-bold text-slate-800">{invoice.paymentMode}</span>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Reason for Refund Request *
            </label>
            <select
              value={reasonCategory}
              onChange={(e) => setReasonCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600"
            >
              <option value="Accidental double purchase / wrong plan">Accidental double purchase / wrong plan</option>
              <option value="Franchise expansion project paused">Franchise expansion project paused</option>
              <option value="Switched to annual enterprise contract">Switched to annual enterprise contract</option>
              <option value="Other billing query">Other billing query</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Additional Details / Support Notes (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Describe your request to expedite resolution..."
              value={detailedNotes}
              onChange={(e) => setDetailedNotes(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600 resize-none"
            />
          </div>

          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-[11px] space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldAlert size={14} className="text-amber-700" />
              <span>GST Credit Note Notice</span>
            </div>
            <p className="leading-relaxed">
              Once verified server-side, a statutory GST Credit Note will be generated for your accounting and funds refunded to the original payment source within 3-5 business days.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2.5 px-5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Processing Refund...</span>
                </>
              ) : (
                <>
                  <span>Confirm Refund Request</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
