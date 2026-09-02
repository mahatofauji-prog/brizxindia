import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, CreditCard, Smartphone, Building2, CheckCircle2, 
  AlertCircle, Loader2, IndianRupee, ArrowRight, X 
} from 'lucide-react';
import { calculateGstBreakdown } from '../../utils/gstInvoiceEngine';
import { BrandBillingDetails } from '../../types';

interface PaymentGatewayDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderTitle: string;
  orderSubtitle?: string;
  baseAmount: number;
  billingDetails?: BrandBillingDetails;
  onSuccess: (paymentMode: 'UPI' | 'CREDIT_CARD' | 'NET_BANKING' | 'DEBIT_CARD', paymentRef: string) => Promise<void>;
}

export default function PaymentGatewayDialog({
  isOpen,
  onClose,
  orderTitle,
  orderSubtitle,
  baseAmount,
  billingDetails,
  onSuccess
}: PaymentGatewayDialogProps) {
  const [selectedMethod, setSelectedMethod] = useState<'UPI' | 'CREDIT_CARD' | 'NET_BANKING' | 'DEBIT_CARD'>('UPI');
  const [upiId, setUpiId] = useState('franchise.brand@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('789');
  const [cardHolder, setCardHolder] = useState(billingDetails?.legalEntityName || 'Brand Operations Account');
  const [bank, setBank] = useState('HDFC Bank Corporate');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const gstBreakdown = calculateGstBreakdown(baseAmount, billingDetails?.state);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      // Simulate realistic payment gateway authorization delay
      await new Promise(resolve => setTimeout(resolve, 1400));
      const paymentRef = `pay_rzp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      await onSuccess(selectedMethod, paymentRef);
      setIsProcessing(false);
    } catch (err: any) {
      console.error('Payment processing failed:', err);
      setError(err.message || 'Payment authorization failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button 
            type="button" 
            onClick={onClose} 
            disabled={isProcessing}
            className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-black tracking-widest text-blue-400 uppercase">BrizX India Secure Checkout</span>
            <div className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
              <Lock size={10} /> 256-Bit SSL
            </div>
          </div>

          <h3 className="text-xl font-black text-white">{orderTitle}</h3>
          {orderSubtitle && <p className="text-xs text-slate-300 mt-1">{orderSubtitle}</p>}

          <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-end">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Payable (incl. GST)</span>
              <span className="text-2xl font-black text-white">₹{gstBreakdown.totalAmount.toLocaleString()}</span>
            </div>
            <div className="text-right text-[11px] text-slate-400">
              <span>Base: ₹{gstBreakdown.baseAmount.toLocaleString()}</span>
              <span className="mx-1.5">•</span>
              <span>GST (18%): ₹{gstBreakdown.gstAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handlePay} className="p-6 space-y-6 flex-1 overflow-y-auto">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Payment Method Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
              Select Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedMethod('UPI')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  selectedMethod === 'UPI' 
                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold shadow-xs' 
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <Smartphone size={20} className={selectedMethod === 'UPI' ? 'text-blue-600' : 'text-slate-400'} />
                <span className="text-xs font-bold">UPI / QR</span>
                <span className="text-[9px] text-slate-400 font-semibold">GPay, PhonePe, Paytm</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('CREDIT_CARD')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  selectedMethod === 'CREDIT_CARD' 
                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold shadow-xs' 
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <CreditCard size={20} className={selectedMethod === 'CREDIT_CARD' ? 'text-blue-600' : 'text-slate-400'} />
                <span className="text-xs font-bold">Cards</span>
                <span className="text-[9px] text-slate-400 font-semibold">Corporate & Business</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('NET_BANKING')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  selectedMethod === 'NET_BANKING' 
                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold shadow-xs' 
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <Building2 size={20} className={selectedMethod === 'NET_BANKING' ? 'text-blue-600' : 'text-slate-400'} />
                <span className="text-xs font-bold">Net Banking</span>
                <span className="text-[9px] text-slate-400 font-semibold">All Indian Banks</span>
              </button>
            </div>
          </div>

          {/* Method Specific Fields */}
          {selectedMethod === 'UPI' && (
            <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Virtual Payment Address (VPA / UPI ID)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                    placeholder="yourname@okaxis"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                  <Smartphone size={16} className="absolute right-3 top-3 text-slate-400" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                <CheckCircle2 size={13} className="text-emerald-500" />
                <span>Instant payment authorization via UPI intent & push notifications.</span>
              </div>
            </div>
          )}

          {selectedMethod === 'CREDIT_CARD' && (
            <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold font-mono text-slate-800 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Valid Thru (MM/YY)
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold font-mono text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold font-mono text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Name on Card
                </label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>
          )}

          {selectedMethod === 'NET_BANKING' && (
            <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Select Corporate / Retail Bank
                </label>
                <select
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                >
                  <option value="HDFC Bank Corporate">HDFC Bank (Corporate & Retail)</option>
                  <option value="ICICI Bank Corporate">ICICI Bank (Corporate Net Banking)</option>
                  <option value="State Bank of India">State Bank of India (SBI)</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  <option value="Yes Bank">Yes Bank</option>
                </select>
              </div>
              <p className="text-[11px] text-slate-500">
                You will be redirected to your bank's secure payment portal to authorize this transaction.
              </p>
            </div>
          )}

          {/* GST Breakdown pill */}
          <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-blue-600" />
              <div>
                <span className="font-bold text-slate-900 block">GST Input Tax Credit (ITC) Eligible</span>
                <span className="text-[10px] text-slate-500">Billed to: {billingDetails?.legalEntityName || 'Brand Legal Entity'}</span>
              </div>
            </div>
            <span className="font-bold text-blue-700 font-mono text-[11px]">{billingDetails?.gstin || '29AABCB1234F1Z5'}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-2 py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Verifying with Server...</span>
                </>
              ) : (
                <>
                  <span>Pay ₹{gstBreakdown.totalAmount.toLocaleString()}</span>
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
