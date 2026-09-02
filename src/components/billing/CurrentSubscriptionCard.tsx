import React from 'react';
import { 
  Sparkles, CheckCircle2, AlertCircle, Clock, 
  CreditCard, Plus, ArrowUpRight, Zap, RefreshCw 
} from 'lucide-react';
import { Subscription, Brand } from '../../types';
import { SUBSCRIPTION_PLANS } from '../../utils/gstInvoiceEngine';

interface CurrentSubscriptionCardProps {
  subscription?: Subscription;
  brand: Brand;
  onRenew: () => void;
  onManagePlan: () => void;
  onBuyCredits: () => void;
}

export default function CurrentSubscriptionCard({
  subscription,
  brand,
  onRenew,
  onManagePlan,
  onBuyCredits
}: CurrentSubscriptionCardProps) {
  const planKey = (subscription?.plan || brand.subscriptionTier || 'STARTER') as keyof typeof SUBSCRIPTION_PLANS;
  const planConfig = SUBSCRIPTION_PLANS[planKey] || SUBSCRIPTION_PLANS.STARTER;
  
  const isActive = subscription?.status === 'ACTIVE';
  const unlocksRemaining = subscription?.unlocksRemaining ?? (planKey === 'PROFESSIONAL' ? 25 : planKey === 'ENTERPRISE' ? 100 : 10);
  const totalMonthlyUnlocks = planConfig.unlocksPerMonth;
  const usagePercentage = Math.min(100, Math.round((unlocksRemaining / Math.max(totalMonthlyUnlocks, unlocksRemaining, 1)) * 100));

  const renewalDate = subscription?.endDate 
    ? new Date(subscription.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : new Date(Date.now() + 86400000 * 18).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
      {/* Top subtle gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-400" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Plan Header Info */}
        <div className="space-y-3 max-w-xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 flex items-center gap-1.5">
              <Zap size={13} className="fill-blue-600" /> Current Plan
            </span>
            {isActive ? (
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 size={13} /> Active Subscription
              </span>
            ) : (
              <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1.5">
                <AlertCircle size={13} /> Expired / Action Needed
              </span>
            )}
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Clock size={13} /> Renews on: <strong className="text-slate-800 font-bold">{renewalDate}</strong>
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              {planConfig.name}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
              Includes unlimited AI matchmaking, high-intent franchise lead pipeline, CRM synchronization, and direct contact unlocking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Billing Cycle: <strong className="text-slate-900">₹{planConfig.pricePerMonth.toLocaleString()}/month (+18% GST)</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span>Lead Credits Included: <strong className="text-slate-900">{planConfig.unlocksPerMonth}/mo</strong></span>
            </div>
          </div>
        </div>

        {/* Lead Unlocks Gauge Box */}
        <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200 lg:min-w-[280px] space-y-3">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Lead Unlock Balance</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-black text-slate-900">{unlocksRemaining}</span>
                <span className="text-xs font-bold text-slate-500">Credits Available</span>
              </div>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
              {usagePercentage}% Capacity
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${usagePercentage}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-500 font-medium">
            1 Credit unlocks 1 verified Seeker full mobile number, direct WhatsApp channel, and email contact.
          </p>

          <button
            onClick={onBuyCredits}
            className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition-colors border border-blue-200 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} /> Buy Additional Credits
          </button>
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
          <Sparkles size={15} className="text-blue-500" />
          <span>Need custom enterprise franchise expansion? Contact our dedicated account director.</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onRenew}
            className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw size={14} /> Renew Subscription
          </button>

          <button
            onClick={onManagePlan}
            className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Change / Upgrade Plan</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
