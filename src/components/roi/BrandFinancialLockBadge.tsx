import React from 'react';
import { Lock, AlertCircle, ShieldCheck } from 'lucide-react';

interface BrandFinancialLockBadgeProps {
  isMissing?: boolean;
  brandName?: string;
  className?: string;
}

export const BrandFinancialLockBadge: React.FC<BrandFinancialLockBadgeProps> = ({
  isMissing = false,
  brandName,
  className = ''
}) => {
  if (isMissing) {
    return (
      <span
        title={brandName ? `Not provided by ${brandName}. This metric is excluded from projections.` : 'Not provided by brand'}
        className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md shrink-0 ${className}`}
      >
        <AlertCircle size={10} className="text-amber-600" />
        Not provided by brand
      </span>
    );
  }

  return (
    <span
      title={brandName ? `Official metric configured by ${brandName} franchisor. Locked and read-only for seekers.` : 'Official verified brand data. Read-only for seekers.'}
      className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-md shrink-0 ${className}`}
    >
      <Lock size={10} className="text-blue-600" />
      Brand Provided
    </span>
  );
};
