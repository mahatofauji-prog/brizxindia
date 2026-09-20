import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  Star, FileText, CheckCircle2 
} from 'lucide-react';
import CurrentSubscriptionCard from '../../components/billing/CurrentSubscriptionCard';
import BillingDetailsCard from '../../components/billing/BillingDetailsCard';
import EditBillingDetailsModal from '../../components/billing/EditBillingDetailsModal';
import BuyCreditsModal from '../../components/billing/BuyCreditsModal';
import ManagePlanModal from '../../components/billing/ManagePlanModal';
import { BrandBillingDetails, PaymentInvoice } from '../../types';

export default function BrandSubscription() {
  const { user } = useAuth();
  const { brands, subscriptions, updateBrandBillingDetails, processSubscriptionPayment, buyCreditPackPayment } = useData();

  const currentBrand = brands.find(b => b.id === user?.id || (user?.email && b.email === user?.email));
  if (!currentBrand) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Complete your Brand Profile</h2>
        <p className="text-slate-500">Please set up your brand profile to access this page.</p>
      </div>
    );
  }
  const currentSub = subscriptions.find(s => s.brandId === currentBrand.id);

  const [showEditBilling, setShowEditBilling] = useState(false);
  const [showBuyCredits, setShowBuyCredits] = useState(false);
  const [showManagePlan, setShowManagePlan] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSaveBilling = (details: BrandBillingDetails) => {
    updateBrandBillingDetails(currentBrand.id, details);
    setSuccessMessage('Billing details updated successfully.');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handlePlanSuccess = (invoice: PaymentInvoice) => {
    setSuccessMessage(`Successfully processed ${invoice.planName}!`);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleCreditsSuccess = (invoice: PaymentInvoice) => {
    setSuccessMessage(`Successfully added lead credits!`);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleProcessPlanPayment = async (planName: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE', paymentMode: 'UPI' | 'CREDIT_CARD' | 'NET_BANKING' | 'DEBIT_CARD', paymentRef?: string) => {
    return processSubscriptionPayment(currentBrand.id, planName, paymentMode, paymentRef);
  };

  const handleProcessCreditsPayment = async (packId: string, paymentMode: 'UPI' | 'CREDIT_CARD' | 'NET_BANKING' | 'DEBIT_CARD', paymentRef?: string) => {
    return buyCreditPackPayment(currentBrand.id, packId, paymentMode, paymentRef);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-bold uppercase mb-3">
            <Star size={14} className="text-blue-500" /> Brand Membership & Billing
          </div>
          <h1 className="text-3xl md:text-4xl font-black font-heading text-slate-900 tracking-tight mb-2">
            Subscription & Credits
          </h1>
          <p className="text-slate-600 text-sm max-w-xl font-medium">
            Manage your active plan, lead unlock balance, and legal GST billing profiles for tax compliance.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600" /> {successMessage}
        </div>
      )}

      {/* Subscription Card */}
      <CurrentSubscriptionCard
        subscription={currentSub}
        brand={currentBrand}
        onRenew={() => setShowManagePlan(true)}
        onManagePlan={() => setShowManagePlan(true)}
        onBuyCredits={() => setShowBuyCredits(true)}
      />

      {/* Billing Details Card */}
      <BillingDetailsCard
        billingDetails={currentBrand.billingDetails}
        brandName={currentBrand.brandName}
        onEdit={() => setShowEditBilling(true)}
      />

      {/* Modals */}
      <EditBillingDetailsModal
        isOpen={showEditBilling}
        onClose={() => setShowEditBilling(false)}
        initialDetails={currentBrand.billingDetails}
        onSave={handleSaveBilling}
      />

      <ManagePlanModal
        isOpen={showManagePlan}
        onClose={() => setShowManagePlan(false)}
        currentPlan={currentBrand.subscriptionTier as any}
        brandBilling={currentBrand.billingDetails}
        onProcessPayment={handleProcessPlanPayment}
        onSuccess={handlePlanSuccess}
      />

      <BuyCreditsModal
        isOpen={showBuyCredits}
        onClose={() => setShowBuyCredits(false)}
        brandBilling={currentBrand.billingDetails}
        onProcessPayment={handleProcessCreditsPayment}
        onSuccess={handleCreditsSuccess}
      />
    </div>
  );
}
