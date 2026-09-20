import React from 'react';
import { TrendingUp, ShoppingBag, Receipt, Calendar, ShieldCheck } from 'lucide-react';
import { BrandFinancialLockBadge } from './BrandFinancialLockBadge';
import { BrandFinancialProfile } from '../../types';

interface BrandRevenueCardProps {
  financialProfile?: BrandFinancialProfile;
  brandName: string;
}

export const BrandRevenueCard: React.FC<BrandRevenueCardProps> = ({
  financialProfile,
  brandName
}) => {
  const fp = financialProfile;

  const revLakhs = fp?.expectedMonthlyRevenue;
  const ticketSize = fp?.avgCustomerTicket;
  const monthlyOrders = fp?.estimatedMonthlyOrders;

  const hasRev = revLakhs !== undefined && revLakhs > 0;
  const hasTicket = ticketSize !== undefined && ticketSize > 0;
  const hasOrders = monthlyOrders !== undefined && monthlyOrders > 0;

  const revRupees = hasRev ? revLakhs * 100000 : 0;
  const dailyRev = revRupees > 0 ? Math.round(revRupees / 30) : 0;
  const dailyOrders = hasOrders ? Math.round(monthlyOrders / 30) : 0;

  return (
    <div className="bg-white border border-blue-100/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-50 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
            <TrendingUp size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight font-heading">
                Revenue Model & Customer Unit Economics
              </h3>
              <BrandFinancialLockBadge brandName={brandName} />
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Official sales projections provided by {brandName} based on proven outlet averages.
            </p>
          </div>
        </div>

        <div className="text-right bg-blue-50/70 border border-blue-100 rounded-2xl px-4 py-2 shrink-0">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Monthly Gross Turnover</span>
          <span className="text-xl font-black text-blue-700 font-heading">
            {hasRev ? `₹${revLakhs.toFixed(2)} Lakhs` : 'Pending Data'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Monthly Revenue */}
        <div className={`p-5 rounded-2xl border transition-all ${!hasRev ? 'bg-amber-50/30 border-amber-200/60' : 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:shadow-xs'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-slate-800 tracking-tight flex items-center gap-1.5">
              <Calendar size={14} className="text-blue-600" />
              Expected Monthly Revenue
            </span>
            <BrandFinancialLockBadge isMissing={!hasRev} brandName={brandName} />
          </div>
          {hasRev ? (
            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 font-heading">
                  ₹{revLakhs.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-slate-500">Lakhs / month</span>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                ≈ ₹{revRupees.toLocaleString('en-IN')} / mo (₹{dailyRev.toLocaleString('en-IN')} / day)
              </p>
            </div>
          ) : (
            <span className="text-sm font-bold text-amber-700 italic block mt-2">
              Not provided by brand
            </span>
          )}
        </div>

        {/* Avg Customer Ticket */}
        <div className={`p-5 rounded-2xl border transition-all ${!hasTicket ? 'bg-amber-50/30 border-amber-200/60' : 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:shadow-xs'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-slate-800 tracking-tight flex items-center gap-1.5">
              <Receipt size={14} className="text-blue-600" />
              Avg Customer Ticket Size
            </span>
            <BrandFinancialLockBadge isMissing={!hasTicket} brandName={brandName} />
          </div>
          {hasTicket ? (
            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 font-heading">
                  ₹{ticketSize.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-slate-500">/ bill</span>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Average transaction spend across retail visits
              </p>
            </div>
          ) : (
            <span className="text-sm font-bold text-amber-700 italic block mt-2">
              Not provided by brand
            </span>
          )}
        </div>

        {/* Estimated Monthly Orders */}
        <div className={`p-5 rounded-2xl border transition-all ${!hasOrders ? 'bg-amber-50/30 border-amber-200/60' : 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:shadow-xs'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-slate-800 tracking-tight flex items-center gap-1.5">
              <ShoppingBag size={14} className="text-blue-600" />
              Estimated Monthly Orders
            </span>
            <BrandFinancialLockBadge isMissing={!hasOrders} brandName={brandName} />
          </div>
          {hasOrders ? (
            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 font-heading">
                  {monthlyOrders.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-slate-500">orders / mo</span>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                ≈ {dailyOrders} orders / day (at 30 days/month)
              </p>
            </div>
          ) : (
            <span className="text-sm font-bold text-amber-700 italic block mt-2">
              Not provided by brand
            </span>
          )}
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center justify-between text-xs font-medium text-slate-600">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-blue-600 shrink-0" />
          <span>
            {hasOrders && hasTicket ? (
              <>Validation: {monthlyOrders.toLocaleString()} orders × ₹{ticketSize} = <strong className="text-slate-900">₹{(monthlyOrders * ticketSize).toLocaleString('en-IN')}</strong> target turnover</>
            ) : (
              <span>Values locked by franchisor profile. Read-only for seekers.</span>
            )}
          </span>
        </div>
        <span className="text-[11px] font-bold text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-blue-200">
          Locked
        </span>
      </div>
    </div>
  );
};
