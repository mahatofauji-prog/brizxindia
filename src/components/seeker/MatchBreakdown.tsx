import React from 'react';
import { X, Check, ShieldCheck, Target, DollarSign, Briefcase, Calendar } from 'lucide-react';

interface MatchBreakdownProps {
  isOpen: boolean;
  onClose: () => void;
  brand: any;
  seeker: any;
  breakdown: any;
}

export default function MatchBreakdown({ isOpen, onClose, brand, seeker, breakdown }: MatchBreakdownProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-slideUp">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-black text-slate-900">Match Breakdown</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full cursor-pointer">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl">
              <p className="text-slate-500 font-bold mb-1">Your Profile</p>
              <p className="font-bold text-slate-900">{seeker.city}, ₹{seeker.investment}L</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
              <p className="text-slate-500 font-bold mb-1">Brand Requirement</p>
              <p className="font-bold text-slate-900">{brand.brandName}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 font-black text-xs text-slate-700">
                <Target size={16} className="text-blue-600" /> City
              </span>
              <span className="font-bold text-xs">{breakdown.cityScore}/25</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 font-black text-xs text-slate-700">
                <DollarSign size={16} className="text-blue-600" /> Investment
              </span>
              <span className="font-bold text-xs">{breakdown.investmentScore}/25</span>
            </div>
            {/* ... other factors */}
          </div>
          
          <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
            <span className="font-black text-sm">TOTAL MATCH</span>
            <span className="font-black text-lg text-blue-700">{breakdown.totalScore}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
