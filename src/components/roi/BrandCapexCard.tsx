import React from 'react';
import { Layers, ShieldCheck, HelpCircle } from 'lucide-react';
import { BrandFinancialLockBadge } from './BrandFinancialLockBadge';
import { BrandFinancialProfile } from '../../types';

interface BrandCapexCardProps {
  financialProfile?: BrandFinancialProfile;
  brandName: string;
  totalCapexLakhs: number;
  isComplete: boolean;
}

export const BrandCapexCard: React.FC<BrandCapexCardProps> = ({
  financialProfile,
  brandName,
  totalCapexLakhs,
  isComplete
}) => {
  const fp = financialProfile;

  const capexItems = [
    {
      key: 'franchiseFee',
      label: 'One-time Franchise Fee',
      scope: 'Brand rights, onboarding & curriculum access',
      value: fp?.franchiseFee,
      isProvided: fp?.franchiseFee !== undefined && fp?.franchiseFee > 0
    },
    {
      key: 'setupCost',
      label: 'Setup & Civil Construction',
      scope: 'Civil works, flooring, HVAC & electrical grid',
      value: fp?.setupCost,
      isProvided: fp?.setupCost !== undefined && fp?.setupCost > 0
    },
    {
      key: 'interiorCost',
      label: 'Interior & Fit-out Cost',
      scope: 'Aesthetic panels, lighting, service counters & signage',
      value: fp?.interiorCost,
      isProvided: fp?.interiorCost !== undefined && fp?.interiorCost > 0
    },
    {
      key: 'equipmentCost',
      label: 'Machinery & Equipment Cost',
      scope: 'Heavy appliances, kitchen machinery, espresso units',
      value: fp?.equipmentCost,
      isProvided: fp?.equipmentCost !== undefined && fp?.equipmentCost > 0
    },
    {
      key: 'technologyCost',
      label: 'Technology & POS Hardware',
      scope: 'Cloud POS terminal, thermal printers, CCTV & sound',
      value: fp?.technologyCost,
      isProvided: fp?.technologyCost !== undefined && fp?.technologyCost > 0
    },
    {
      key: 'securityDeposit',
      label: 'Commercial Security Deposit',
      scope: 'Refundable landlord rental security advance',
      value: fp?.securityDeposit,
      isProvided: fp?.securityDeposit !== undefined && fp?.securityDeposit > 0
    },
    {
      key: 'workingCapital',
      label: 'Initial Working Capital Reserve',
      scope: 'Day-1 raw material buffer & initial cash reserve',
      value: fp?.workingCapital,
      isProvided: fp?.workingCapital !== undefined && fp?.workingCapital > 0
    },
    {
      key: 'otherInitialExpenses',
      label: 'Other Initial Expenses & Licenses',
      scope: 'FSSAI, GST registration, trade license, pre-launch ads',
      value: fp?.otherInitialExpenses,
      isProvided: fp?.otherInitialExpenses !== undefined && fp?.otherInitialExpenses > 0
    }
  ];

  return (
    <div className="bg-white border border-blue-100/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-50 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
            <Layers size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight font-heading">
                Initial Investment (Capex Breakdown)
              </h3>
              <BrandFinancialLockBadge brandName={brandName} />
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Certified capital outlay provided directly by {brandName}. All values are strictly read-only.
            </p>
          </div>
        </div>

        <div className="text-right bg-blue-50/70 border border-blue-100 rounded-2xl px-4 py-2 shrink-0">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Initial Capex</span>
          <span className="text-xl font-black text-blue-700 font-heading">
            {totalCapexLakhs > 0 ? `₹${totalCapexLakhs.toFixed(2)} Lakhs` : 'Pending Data'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {capexItems.map((item) => {
          const isMissing = !item.isProvided;
          const sharePct = totalCapexLakhs > 0 && !isMissing ? (((item.value || 0) / totalCapexLakhs) * 100).toFixed(1) : null;

          return (
            <div
              key={item.key}
              className={`p-4 rounded-2xl border transition-all ${
                isMissing 
                  ? 'bg-amber-50/30 border-amber-200/60' 
                  : 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-xs font-black text-slate-800 tracking-tight">
                  {item.label}
                </span>
                <BrandFinancialLockBadge isMissing={isMissing} brandName={brandName} />
              </div>

              <div className="flex items-baseline justify-between mt-2">
                {isMissing ? (
                  <span className="text-sm font-bold text-amber-700 italic">
                    Not provided by brand
                  </span>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-slate-900 font-heading">
                      ₹{item.value?.toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-slate-500">Lakhs</span>
                    {sharePct && (
                      <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                        {sharePct}% of Capex
                      </span>
                    )}
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-400 mt-1 font-medium leading-relaxed">
                {item.scope}
              </p>
            </div>
          );
        })}
      </div>

      <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center justify-between text-xs font-medium text-slate-600">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-blue-600 shrink-0" />
          <span>
            Sum of brand Capex line items: <strong className="text-slate-900">₹{totalCapexLakhs.toFixed(2)} Lakhs</strong> (₹{(totalCapexLakhs * 100000).toLocaleString('en-IN')})
          </span>
        </div>
        <span className="text-[11px] font-bold text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-blue-200">
          Locked by Franchisor
        </span>
      </div>
    </div>
  );
};
