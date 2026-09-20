import React, { useState } from 'react';
import { 
  Zap, CheckCircle2, ShieldCheck, ArrowRight, 
  X, Sparkles, IndianRupee, CreditCard, Tag 
} from 'lucide-react';
import { CREDIT_PACKS, calculateGstBreakdown } from '../../utils/gstInvoiceEngine';
import { CreditPack, BrandBillingDetails, PaymentInvoice } from '../../types';
import PaymentGatewayDialog from './PaymentGatewayDialog';

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandBilling?: BrandBillingDetails;
  onProcessPayment: (packId: string, paymentMode: 'UPI' | 'CREDIT_CARD' | 'NET_BANKING' | 'DEBIT_CARD', paymentRef?: string) => Promise<PaymentInvoice>;
  onSuccess: (invoice: PaymentInvoice) => void;
}

export default function BuyCreditsModal({
  isOpen,
  onClose,
  brandBilling,
  onProcessPayment,
  onSuccess
}: BuyCreditsModalProps) {
  const [selectedPackId, setSelectedPackId] = useState<string>('pack_25');
  const [isGatewayOpen, setIsGatewayOpen] = useState<boolean>(false);

  if (!isOpen) return null;

  const selectedPack = CREDIT_PACKS.find(p => p.id === selectedPackId) || CREDIT_PACKS[1];
  const gstBreakdown = calculateGstBreakdown(selectedPack.price, brandBilling?.state);

  const handleOpenGateway = () => {
    setIsGatewayOpen(true);
  };

  const handleGatewaySuccess = async (mode: 'UPI' | 'CREDIT_CARD' | 'NET_BANKING' | 'DEBIT_CARD', ref: string) => {
    const inv = await onProcessPayment(selectedPack.id, mode, ref);
    setIsGatewayOpen(false);
    onSuccess(inv);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Zap size={20} className="fill-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Buy Lead Unlock Credits</h3>
                <p className="text-xs text-slate-500 font-medium">Credits never expire and allow direct access to high-intent franchise seekers.</p>
              </div>
            </div>
            <button 
              type="button" 
              onClick={onClose} 
              className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
            {/* Packs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {CREDIT_PACKS.map(pack => {
                const isSelected = pack.id === selectedPackId;
                const costPerLead = Math.round(pack.price / pack.credits);

                return (
                  <div
                    key={pack.id}
                    onClick={() => setSelectedPackId(pack.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-50/40 shadow-sm' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {pack.popular && (
                      <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                        <Sparkles size={10} /> Most Popular
                      </span>
                    )}

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{pack.name}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'}`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>

                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-black text-slate-900 font-heading">+{pack.credits}</span>
                        <span className="text-xs font-bold text-slate-600">Lead Unlocks</span>
                      </div>

                      <p className="text-[11px] text-slate-500 leading-snug">{pack.description}</p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Base Price</span>
                        <span className="text-base font-black text-blue-700">₹{pack.price.toLocaleString()}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Effective Rate</span>
                        <span className="text-xs font-bold text-slate-700">₹{costPerLead}/lead</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* GST Tax Summary Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="font-bold text-slate-700">Order Tax Breakdown (Indian GST)</span>
                <span className="text-[11px] font-bold text-slate-500">
                  Place of Supply: {gstBreakdown.placeOfSupply}
                </span>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-600">
                <div className="flex justify-between">
                  <span>Base Package ({selectedPack.name} - {selectedPack.credits} Credits):</span>
                  <span className="font-bold text-slate-800">₹{gstBreakdown.baseAmount.toLocaleString()}</span>
                </div>

                {gstBreakdown.gstType === 'INTRA_STATE' ? (
                  <>
                    <div className="flex justify-between text-slate-500">
                      <span>Central GST (CGST @ 9%):</span>
                      <span>₹{gstBreakdown.cgstAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>State GST (SGST @ 9%):</span>
                      <span>₹{gstBreakdown.sgstAmount.toLocaleString()}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-slate-500">
                    <span>Integrated GST (IGST @ 18%):</span>
                    <span>₹{gstBreakdown.igstAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs font-black text-slate-900">
                  <span>Total Amount (incl. 18% GST):</span>
                  <span className="text-lg text-blue-700">₹{gstBreakdown.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* ITC Notice */}
            <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-[11px] font-medium">
              <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
              <span>Full Input Tax Credit eligible with GSTIN: <strong>{brandBilling?.gstin || '29AABCB1234F1Z5'}</strong></span>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Total to Pay</span>
              <span className="text-xl font-black text-slate-900">₹{gstBreakdown.totalAmount.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleOpenGateway}
                className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gateway Dialog */}
      <PaymentGatewayDialog
        isOpen={isGatewayOpen}
        onClose={() => setIsGatewayOpen(false)}
        orderTitle={`BrizX India — ${selectedPack.name}`}
        orderSubtitle={`+${selectedPack.credits} Contact Unlock Credits`}
        baseAmount={selectedPack.price}
        billingDetails={brandBilling}
        onSuccess={handleGatewaySuccess}
      />
    </>
  );
}
