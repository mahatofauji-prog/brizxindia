import React from 'react';
import { Link } from 'react-router';
import { 
  MapPin, Briefcase, IndianRupee, Clock, Lock, Unlock, Phone, Mail, 
  Sparkles, CheckCircle2, Bookmark, ArrowRight, ShieldCheck, ChevronRight, Eye, Calendar
} from 'lucide-react';
import { FranchiseSeeker, Brand } from '../../types';
import { MatchScoreBreakdown, getMatchScoreColor } from '../../utils/SmartMatchEngine';

interface SeekerMatchCardProps {
  seeker: FranchiseSeeker;
  brand: Brand;
  breakdown: MatchScoreBreakdown;
  isUnlocked: boolean;
  isSaved: boolean;
  onOpenBreakdown: () => void;
  onOpenUnlockModal: () => void;
  onToggleSave: () => void;
  onOpenMeetingModal?: () => void;
}

export default function SeekerMatchCard({
  seeker,
  brand,
  breakdown,
  isUnlocked,
  isSaved,
  onOpenBreakdown,
  onOpenUnlockModal,
  onToggleSave,
  onOpenMeetingModal
}: SeekerMatchCardProps) {
  const scoreTheme = getMatchScoreColor(breakdown.totalScore);

  // Masked phone & email if not unlocked
  const maskedPhone = seeker.phone 
    ? `${seeker.phone.slice(0, 6)} •••• ${seeker.phone.slice(-2)}` 
    : '+91 98•••• ••10';
  const maskedEmail = seeker.email 
    ? `${seeker.email.slice(0, 3)}••••@••••.com` 
    : 'pri••••@example.com';

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md border border-slate-200/90 transition-all duration-200 group relative">
      {/* Top Banner / Tags */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap items-center gap-2">
          {/* Verification Badge */}
          {seeker.verified ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-black uppercase tracking-wider">
              <ShieldCheck size={14} className="text-emerald-600" /> BrizX Verified Seeker
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-full text-[11px] font-bold uppercase">
              Registered Candidate
            </span>
          )}

          {seeker.featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-[10px] font-black uppercase">
              ★ Featured Profile
            </span>
          )}

          {breakdown.totalScore >= 90 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[10px] font-black uppercase">
              <Sparkles size={11} className="text-blue-600" /> Top Match for {brand.brandName}
            </span>
          )}
        </div>

        {/* Save Bookmark button */}
        <button
          onClick={onToggleSave}
          className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
            isSaved 
              ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-2xs' 
              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-400 hover:text-blue-600'
          }`}
          title={isSaved ? 'Remove from saved' : 'Save Seeker'}
        >
          <Bookmark size={16} className={isSaved ? 'fill-blue-600' : ''} />
        </button>
      </div>

      {/* Main Seeker Header & Score Gauge */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        {/* Left Side: Avatar + Seeker Info */}
        <div className="flex items-start sm:items-center gap-4 sm:gap-5 min-w-0 flex-1">
          {/* Circular Smart Match Score */}
          <button
            onClick={onOpenBreakdown}
            className={`w-20 h-20 shrink-0 rounded-2xl border-2 p-1.5 flex flex-col items-center justify-center transition-transform hover:scale-105 cursor-pointer shadow-sm ${scoreTheme.bg}`}
            title="Click to view 100-point match breakdown"
          >
            <span className="text-2xl font-black font-heading leading-none">
              {breakdown.totalScore}%
            </span>
            <span className="text-[9px] font-black uppercase tracking-wider mt-1">
              Match
            </span>
          </button>

          {/* Name & Basic Details */}
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-black text-indigo-950 font-heading truncate">
                {seeker.name}
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${scoreTheme.bg}`}>
                {breakdown.fitLabel}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-semibold">
              <span className="flex items-center gap-1 text-slate-700">
                <MapPin size={13} className="text-blue-600 shrink-0" /> {seeker.city}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-700">
                <Briefcase size={13} className="text-indigo-600 shrink-0" /> {seeker.industry}
              </span>
            </div>

            <p className="text-xs text-slate-600 font-medium line-clamp-1">
              {seeker.experience || seeker.businessBackground || 'Entrepreneur seeking franchise opportunity.'}
            </p>
          </div>
        </div>

        {/* Right Side: Key Metrics Grid */}
        <div className="flex items-center gap-4 sm:gap-6 bg-slate-50/80 px-4 py-3 rounded-2xl border border-slate-200/80 w-full md:w-auto justify-between sm:justify-start">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Inv. Capacity
            </span>
            <span className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-0.5 font-heading">
              <IndianRupee size={14} className="text-emerald-600" />₹{seeker.investment} Lakhs
            </span>
          </div>

          <div className="border-l border-slate-200 pl-4 sm:pl-6">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Timeline
            </span>
            <span className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-1 font-heading">
              <Clock size={13} className="text-blue-600" /> {seeker.timeline || '1-3 Months'}
            </span>
          </div>
        </div>
      </div>

      {/* Match Breakdown Summary Bar */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
            <Sparkles size={12} className="text-blue-600" /> Match Dimensions:
          </span>
          <button
            onClick={onOpenBreakdown}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
          >
            View Full 100-Point Audit
          </button>
        </div>

        {/* 5 mini score pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[10px] font-bold">
          <div className="bg-blue-50/60 p-2 rounded-xl border border-blue-100">
            <span className="text-slate-400 block text-[9px] uppercase font-extrabold">City Match</span>
            <span className="text-blue-700 font-black">{breakdown.cityScore}/25 pts</span>
          </div>
          <div className="bg-emerald-50/60 p-2 rounded-xl border border-emerald-100">
            <span className="text-slate-400 block text-[9px] uppercase font-extrabold">Investment</span>
            <span className="text-emerald-700 font-black">{breakdown.investmentScore}/25 pts</span>
          </div>
          <div className="bg-indigo-50/60 p-2 rounded-xl border border-indigo-100">
            <span className="text-slate-400 block text-[9px] uppercase font-extrabold">Industry</span>
            <span className="text-indigo-700 font-black">{breakdown.industryScore}/25 pts</span>
          </div>
          <div className="bg-amber-50/60 p-2 rounded-xl border border-amber-100">
            <span className="text-slate-400 block text-[9px] uppercase font-extrabold">Background</span>
            <span className="text-amber-700 font-black">{breakdown.backgroundScore}/15 pts</span>
          </div>
          <div className="bg-purple-50/60 p-2 rounded-xl border border-purple-100 col-span-2 sm:col-span-1">
            <span className="text-slate-400 block text-[9px] uppercase font-extrabold">Timeline</span>
            <span className="text-purple-700 font-black">{breakdown.timelineScore}/10 pts</span>
          </div>
        </div>
      </div>

      {/* Contact Access & Action Buttons */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Contact Info: Unlocked vs Masked */}
        <div className="flex-1">
          {isUnlocked ? (
            <div className="flex flex-wrap items-center gap-4 bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200/80 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Phone size={14} className="text-emerald-600 shrink-0" />
                <a href={`tel:${seeker.phone}`} className="hover:underline">{seeker.phone}</a>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Mail size={14} className="text-emerald-600 shrink-0" />
                <a href={`mailto:${seeker.email}`} className="hover:underline">{seeker.email}</a>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs text-slate-500">
              <Lock size={15} className="text-slate-400 shrink-0" />
              <div className="flex flex-wrap items-center gap-3 font-mono">
                <span>{maskedPhone}</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">{maskedEmail}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to={`/seekers/${seeker.id}`}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1"
          >
            Profile <Eye size={13} />
          </Link>

          {isUnlocked ? (
            <>
              {onOpenMeetingModal && (
                <button
                  onClick={onOpenMeetingModal}
                  className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Calendar size={14} /> Schedule
                </button>
              )}
              <Link
                to="/brand/crm"
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
              >
                In CRM <ArrowRight size={14} />
              </Link>
            </>
          ) : (
            <button
              onClick={onOpenUnlockModal}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-blue-200 cursor-pointer"
            >
              <Unlock size={14} />
              <span>Unlock Contact</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
