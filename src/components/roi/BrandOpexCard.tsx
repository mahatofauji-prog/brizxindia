import React from 'react';
import { IndianRupee, ShieldCheck, PieChart } from 'lucide-react';
import { BrandFinancialLockBadge } from './BrandFinancialLockBadge';
import { BrandFinancialProfile } from '../../types';

interface BrandOpexCardProps {
  financialProfile?: BrandFinancialProfile;
  brandName: string;
  grossMonthlyRevenueRupees: number;
  totalMonthlyOpexRupees: number;
  cogsRupees: number;
  royaltyRupees: number;
  isComplete: boolean;
}

export const BrandOpexCard: React.FC<BrandOpexCardProps> = ({
  financialProfile,
  brandName,
  grossMonthlyRevenueRupees,
  totalMonthlyOpexRupees,
  cogsRupees,
  royaltyRupees,
  isComplete
}) => {
  const fp = financialProfile;

  const opexItems = [
    {
      key: 'rent',
      label: 'Store Rent',
      desc: 'Prime commercial location lease',
      value: fp?.rent,
      type: 'fixed',
      isProvided: fp?.rent !== undefined && fp?.rent > 0
    },
    {
      key: 'employeeSalaries',
      label: 'Staff Salaries / Payroll',
      desc: 'Store manager, cashiers & kitchen crew',
      value: fp?.employeeSalaries,
      type: 'fixed',
      isProvided: fp?.employeeSalaries !== undefined && fp?.employeeSalaries > 0
    },
    {
      key: 'electricityUtilities',
      label: 'Electricity & Utilities',
      desc: 'Power backup, commercial tariff, water & gas',
      value: fp?.electricityUtilities,
      type: 'fixed',
      isProvided: fp?.electricityUtilities !== undefined && fp?.electricityUtilities > 0
    },
    {
      key: 'marketingCost',
      label: 'Marketing & Local Promotions',
      desc: 'Local digital ads, flyering & local marketing',
      value: fp?.marketingCost,
      type: 'fixed',
      isProvided: fp?.marketingCost !== undefined && fp?.marketingCost > 0
    },
    {
      key: 'royaltyFee',
      label: `Royalty Fee (${fp?.royaltyPercentage || 0}%)`,
      desc: 'Brand support, audit, software & marketing levy',
      value: royaltyRupees,
      type: 'variable',
      percentage: fp?.royaltyPercentage,
      isProvided: fp?.royaltyPercentage !== undefined && fp?.royaltyPercentage > 0
    },
    {
      key: 'maintenanceCost',
      label: 'Maintenance & Tech Support',
      desc: 'Annual equipment maintenance & software AMC',
      value: fp?.maintenanceCost,
      type: 'fixed',
      isProvided: fp?.maintenanceCost !== undefined && fp?.maintenanceCost > 0
    },
    {
      key: 'otherOperatingExpenses',
      label: 'Other Operating Expenses',
      desc: 'Stationery, cleaning consumables & sundry',
      value: fp?.otherOperatingExpenses,
      type: 'fixed',
      isProvided: fp?.otherOperatingExpenses !== undefined && fp?.otherOperatingExpenses > 0
    },
    {
      key: 'cogsPercentage',
      label: `COGS / Material Cost (${fp?.cogsPercentage || 0}%)`,
      desc: 'Raw materials, ingredients, cups & packaging',
      value: cogsRupees,
      type: 'variable',
      percentage: fp?.cogsPercentage,
      isProvided: fp?.cogsPercentage !== undefined && fp?.cogsPercentage > 0
    }
  ];

  return (
    <div className="bg-white border border-blue-100/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-50 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
            <IndianRupee size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight font-heading">
                Monthly Operating Expenses (OPEX)
              </h3>
              <BrandFinancialLockBadge brandName={brandName} />
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Certified recurring operational expenditure structure provided by {brandName}.
            </p>
          </div>
        </div>

        <div className="text-right bg-blue-50/70 border border-blue-100 rounded-2xl px-4 py-2 shrink-0">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Monthly Expenses</span>
          <span className="text-xl font-black text-rose-600 font-heading">
            {totalMonthlyOpexRupees > 0 ? `₹${totalMonthlyOpexRupees.toLocaleString('en-IN')}` : 'Pending Data'}
          </span>
          <span className="text-[10px] text-slate-500 font-medium block">
            {totalMonthlyOpexRupees > 0 ? `(₹${(totalMonthlyOpexRupees / 100000).toFixed(2)} Lakhs/mo)` : ''}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {opexItems.map((item) => {
          const isMissing = !item.isProvided;
          const sharePct = totalMonthlyOpexRupees > 0 && !isMissing 
            ? (((item.value || 0) / totalMonthlyOpexRupees) * 100).toFixed(1) 
            : null;

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
                      ₹{item.value?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-bold text-slate-500">/ mo</span>
                    {sharePct && (
                      <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                        {sharePct}% of OPEX
                      </span>
                    )}
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-400 mt-1 font-medium leading-relaxed">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center justify-between text-xs font-medium text-slate-600">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-blue-600 shrink-0" />
          <span>
            Calculated Monthly Expenses: <strong className="text-slate-900">₹{totalMonthlyOpexRupees.toLocaleString('en-IN')}</strong> ({((totalMonthlyOpexRupees / (grossMonthlyRevenueRupees || 1)) * 100).toFixed(1)}% of revenue)
          </span>
        </div>
        <span className="text-[11px] font-bold text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-blue-200">
          Locked by Franchisor
        </span>
      </div>
    </div>
  );
};
