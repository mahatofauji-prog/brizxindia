import React from 'react';
import { 
  X, ShieldCheck, MapPin, IndianRupee, Briefcase, Clock, 
  Sparkles, CheckCircle2, ChevronRight, Unlock, Calendar, Bookmark, Building2, User
} from 'lucide-react';
import { FranchiseSeeker, Brand } from '../../types';
import { MatchScoreBreakdown, getMatchScoreColor } from '../../utils/SmartMatchEngine';

interface SeekerMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  seeker: FranchiseSeeker | null;
  brand: Brand;
  breakdown: MatchScoreBreakdown;
  isUnlocked: boolean;
  isSaved: boolean;
  onUnlock: () => void;
  onToggleSave: () => void;
  onScheduleMeeting?: () => void;
}

export default function SeekerMatchModal({
  isOpen,
  onClose,
  seeker,
  brand,
  breakdown,
  isUnlocked,
  isSaved,
  onUnlock,
  onToggleSave,
  onScheduleMeeting
}: SeekerMatchModalProps) {
  if (!isOpen || !seeker) return null;

  const scoreTheme = getMatchScoreColor(breakdown.totalScore);
  const brandMin = brand.investmentRequired?.min ?? brand.minInvestment ?? 10;
  const brandMax = brand.investmentRequired?.max ?? brand.maxInvestment ?? 30;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8 border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Header with Match Gradient */}
        <div className="bg-gradient-to-r from-[#F0F6FF] via-[#EBF3FF] to-[#F5F9FF] text-slate-900 p-6 sm:p-7 relative border-b border-blue-100">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-full transition-all cursor-pointer shadow-2xs"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 border border-blue-200 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={12} className="text-blue-600" /> BrizX Smart Match Engine
            </span>
            <span className="px-2.5 py-0.5 bg-white text-slate-600 border border-slate-200 rounded-full text-[10px] font-bold">
              100-Point Algorithmic Breakdown
            </span>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-3">
            <div>
              <h2 className="text-2xl font-black font-heading text-slate-900 flex items-center gap-2">
                {seeker.name}
                {seeker.verified && (
                  <span className="text-emerald-600" title="Verified Seeker">
                    <ShieldCheck size={20} />
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-2">
                <span className="font-semibold">{seeker.city}</span>
                <span>•</span>
                <span className="font-semibold">{seeker.industry}</span>
                <span>•</span>
                <span>Target: <strong className="text-blue-700">{brand.brandName}</strong></span>
              </p>
            </div>

            {/* Total Match Badge */}
            <div className="flex items-center gap-3 bg-white border border-blue-200 px-4 py-2.5 rounded-2xl shrink-0 shadow-xs">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Overall Match</div>
                <div className="text-[11px] font-black text-blue-700 uppercase">{breakdown.fitLabel}</div>
              </div>
              <div className="w-14 h-14 rounded-xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-sm font-heading">
                {breakdown.totalScore}%
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Comparison Matrix */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 bg-[#F8FBFF] p-4 rounded-2xl border border-blue-100">
            <div className="space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <User size={12} /> Seeker Profile
              </div>
              <div className="font-bold text-xs text-slate-800">{seeker.city}</div>
              <div className="text-xs font-semibold text-slate-600">Budget: ₹{seeker.investment} Lakhs</div>
              <div className="text-[11px] text-slate-500">{seeker.industry}</div>
            </div>
            <div className="space-y-1 border-l border-blue-100 pl-3 sm:pl-4">
              <div className="text-[10px] font-black uppercase tracking-wider text-blue-600 flex items-center gap-1">
                <Building2 size={12} /> {brand.brandName}
              </div>
              <div className="font-bold text-xs text-slate-800">
                {brand.cityTargets?.slice(0, 3).join(', ') || 'Pan-India'}
              </div>
              <div className="text-xs font-semibold text-slate-600">Req: ₹{brandMin} - ₹{brandMax} Lakhs</div>
              <div className="text-[11px] text-slate-500">{brand.industry}</div>
            </div>
          </div>

          {/* 5-Dimensional Breakdown */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <span>Detailed Dimension Scores</span>
              <span className="h-px bg-slate-200 flex-1"></span>
            </h3>

            {/* 1. City Match (25 pts) */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <MapPin size={15} className="text-blue-600" />
                  <span>1. City & Geographic Territory Match</span>
                </div>
                <span className="font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md text-xs">
                  {breakdown.cityScore} / 25 pts
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(breakdown.cityScore / 25) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-600 font-medium">
                {breakdown.cityMatchReason}
              </p>
            </div>

            {/* 2. Investment Match (25 pts) */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <IndianRupee size={15} className="text-emerald-600" />
                  <span>2. Capital & Investment Capacity Match</span>
                </div>
                <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-xs">
                  {breakdown.investmentScore} / 25 pts
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(breakdown.investmentScore / 25) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-600 font-medium">
                {breakdown.investmentMatchReason}
              </p>
            </div>

            {/* 3. Industry Match (25 pts) */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <Building2 size={15} className="text-indigo-600" />
                  <span>3. Industry & Sector Preference Match</span>
                </div>
                <span className="font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md text-xs">
                  {breakdown.industryScore} / 25 pts
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(breakdown.industryScore / 25) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-600 font-medium">
                {breakdown.industryMatchReason}
              </p>
            </div>

            {/* 4. Background Match (15 pts) */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <Briefcase size={15} className="text-amber-600" />
                  <span>4. Professional Background & Operational Fit</span>
                </div>
                <span className="font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md text-xs">
                  {breakdown.backgroundScore} / 15 pts
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-amber-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(breakdown.backgroundScore / 15) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-600 font-medium">
                {breakdown.backgroundMatchReason}
              </p>
            </div>

            {/* 5. Timeline Match (10 pts) */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <Clock size={15} className="text-purple-600" />
                  <span>5. Starting Timeline & Readiness</span>
                </div>
                <span className="font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md text-xs">
                  {breakdown.timelineScore} / 10 pts
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(breakdown.timelineScore / 10) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-600 font-medium">
                {breakdown.timelineMatchReason}
              </p>
            </div>
          </div>

          {/* Key Match Highlights */}
          {breakdown.reasons.length > 0 && (
            <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-100 space-y-2">
              <h4 className="text-[11px] font-black text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={13} className="text-blue-600" /> AI Match Reasons & Highlights
              </h4>
              <div className="space-y-1.5">
                {breakdown.reasons.map((r, i) => (
                  <div key={i} className="text-xs font-semibold text-slate-700 flex items-start gap-2">
                    <span className="text-blue-600 shrink-0 font-bold">•</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Seeker Experience Details */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              Entrepreneur Background
            </h4>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              {seeker.businessBackground || seeker.experience || 'No detailed background provided.'}
            </p>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onToggleSave}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 w-full sm:w-auto ${
                isSaved 
                  ? 'bg-blue-50 border-blue-300 text-blue-700' 
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Bookmark size={14} className={isSaved ? 'fill-blue-600 text-blue-600' : ''} />
              <span>{isSaved ? 'Saved Seeker' : 'Save to Shortlist'}</span>
            </button>

            {onScheduleMeeting && isUnlocked && (
              <button
                onClick={onScheduleMeeting}
                className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 w-full sm:w-auto"
              >
                <Calendar size={14} className="text-indigo-600" />
                <span>Schedule Meeting</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer w-full sm:w-auto"
            >
              Close
            </button>

            {!isUnlocked ? (
              <button
                onClick={onUnlock}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-blue-200 cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Unlock size={14} />
                <span>Unlock Contact (1 Credit)</span>
              </button>
            ) : (
              <span className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-600" /> Contact Unlocked
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
