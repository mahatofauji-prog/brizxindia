import React, { useState } from 'react';
import { 
  Check, Sparkles, ShieldCheck, ArrowRight, 
  X, Zap, Award, Star 
} from 'lucide-react';
import { SUBSCRIPTION_PLANS, calculateGstBreakdown } from '../../utils/gstInvoiceEngine';
import { BrandBillingDetails, PaymentInvoice } from '../../types';
import PaymentGatewayDialog from './PaymentGatewayDialog';

interface ManagePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  brandBilling?: BrandBillingDetails;
  onProcessPayment: (planName: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE', paymentMode: 'UPI' | 'CREDIT_CARD' | 'NET_BANKING' | 'DEBIT_CARD', paymentRef?: string) => Promise<PaymentInvoice>;
  onSuccess: (invoice: PaymentInvoice) => void;
}

export default function ManagePlanModal({
  isOpen,
  onClose,
  currentPlan,
  brandBilling,
  onProcessPayment,
  onSuccess
}: ManagePlanModalProps) {
  const safeCurrentPlan = currentPlan || 'STARTER';
  const [selectedPlan, setSelectedPlan] = useState<'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE'>(
    safeCurrentPlan === 'STARTER' ? 'PROFESSIONAL' : safeCurrentPlan
  );
  const [isGatewayOpen, setIsGatewayOpen] = useState<boolean>(false);

  if (!isOpen) return null;

  const planConfig = SUBSCRIPTION_PLANS[selectedPlan] || SUBSCRIPTION_PLANS.STARTER;
  const gstBreakdown = calculateGstBreakdown(planConfig.pricePerMonth, brandBilling?.state);

  const handleOpenGateway = () => {
    setIsGatewayOpen(true);
  };

  const handleGatewaySuccess = async (mode: 'UPI' | 'CREDIT_CARD' | 'NET_BANKING' | 'DEBIT_CARD', ref: string) => {
    const inv = await onProcessPayment(selectedPlan, mode, ref);
    setIsGatewayOpen(false);
    onSuccess(inv);
    onClose();
  };

  const planKeys: ('STARTER' | 'PROFESSIONAL' | 'ENTERPRISE')[] = ['STARTER', 'PROFESSIONAL', 'ENTERPRISE'];

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Award size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Manage BrizX Subscription Tier</h3>
                <p className="text-xs text-slate-500 font-medium">Upgrade or renew your brand plan to scale your franchise expansion network across India.</p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {planKeys.map(key => {
                const plan = SUBSCRIPTION_PLANS[key];
                const isCurrent = currentPlan === key;
                const isSelected = selectedPlan === key;

                return (
                  <div
                    key={key}
                    onClick={() => setSelectedPlan(key)}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/30 shadow-md ring-2 ring-blue-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {key === 'PROFESSIONAL' && (
                      <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                        <Sparkles size={10} /> Recommended
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-black text-sm text-slate-900 uppercase tracking-wider">{plan.name}</span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                            Current
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline gap-1 my-3">
                        <span className="text-3xl font-black text-slate-900 font-heading">
                          ₹{plan.pricePerMonth.toLocaleString()}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">/mo + GST</span>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 mb-4 text-center">
                        <span className="font-black text-blue-700 text-sm block">{plan.unlocksPerMonth} Lead Unlocks</span>
                        <span className="text-[10px] text-slate-500 font-semibold">Refreshed monthly</span>
                      </div>

                      <div className="space-y-2 text-slate-700">
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-[11px]">
                            <Check size={14} className="text-blue-600 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlan(key);
                        }}
                        className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Select Plan'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* GST Breakdown Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-[11px]">
              <div className="flex justify-between font-bold text-slate-800 text-xs">
                <span>Selected Plan: {planConfig.name}</span>
                <span className="text-blue-700 font-mono">₹{gstBreakdown.totalAmount.toLocaleString()} Total</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Base Rate: ₹{gstBreakdown.baseAmount.toLocaleString()}</span>
                <span>GST (18% {gstBreakdown.gstType === 'INTRA_STATE' ? 'CGST+SGST' : 'IGST'}): ₹{gstBreakdown.gstAmount.toLocaleString()}</span>
                <span>Place of Supply: {gstBreakdown.placeOfSupply}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Amount Payable Now</span>
              <span className="text-xl font-black text-slate-900">₹{gstBreakdown.totalAmount.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleOpenGateway}
                className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
              >
                <span>{currentPlan === selectedPlan ? 'Renew This Plan' : `Upgrade to ${planConfig.name}`}</span>
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
        orderTitle={`BrizX India — ${planConfig.name}`}
        orderSubtitle={`${planConfig.unlocksPerMonth} Lead Unlocks/Month`}
        baseAmount={planConfig.pricePerMonth}
        billingDetails={brandBilling}
        onSuccess={handleGatewaySuccess}
      />
    </>
  );
}
