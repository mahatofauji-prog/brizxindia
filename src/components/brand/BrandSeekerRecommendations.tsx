import React, { useState } from 'react';
import { Link } from 'react-router';
import { Sparkles, ArrowRight, ShieldCheck, IndianRupee, MapPin, ChevronRight, Unlock } from 'lucide-react';
import { FranchiseSeeker, Brand } from '../../types';
import { calculateBrandSeekerMatch, MatchScoreBreakdown } from '../../utils/SmartMatchEngine';
import SeekerMatchModal from './SeekerMatchModal';

interface BrandSeekerRecommendationsProps {
  brand: Brand;
  seekers: FranchiseSeeker[];
  unlockedSeekerIds: string[];
  savedSeekerIds: string[];
  onUnlockSeeker: (seekerId: string) => void;
  onToggleSave: (seekerId: string) => void;
}

export default function BrandSeekerRecommendations({
  brand,
  seekers,
  unlockedSeekerIds,
  savedSeekerIds,
  onUnlockSeeker,
  onToggleSave
}: BrandSeekerRecommendationsProps) {
  const [selectedSeeker, setSelectedSeeker] = useState<{ seeker: FranchiseSeeker; breakdown: MatchScoreBreakdown } | null>(null);

  // Score all verified seekers against the brand and sort descending
  const scoredSeekers = seekers
    .filter(s => s.verified)
    .map(seeker => {
      const breakdown = calculateBrandSeekerMatch(brand, seeker);
      return {
        seeker,
        breakdown,
        totalScore: breakdown.totalScore
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 4); // Top 4 high matches

  if (scoredSeekers.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-[#F3F8FF] via-white to-[#EBF3FF] rounded-3xl p-6 sm:p-8 border border-blue-200/80 shadow-xs relative overflow-hidden">
      {/* Background subtle soft accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10 mb-6 pb-5 border-b border-blue-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100/80 text-blue-700 border border-blue-200 rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles size={13} className="text-blue-600" /> AI-Curated Seeker Matches
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-slate-900">
            Top Franchise Seekers for {brand.brandName}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Ranked using BrizX Smart Match 100-Point Scoring (City, Investment, Industry, Background & Timeline).
          </p>
        </div>

        <Link
          to="/search"
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm shadow-blue-200 shrink-0"
        >
          <span>View All Seekers</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {scoredSeekers.map(({ seeker, breakdown, totalScore }) => {
          const isUnlocked = unlockedSeekerIds.includes(seeker.id);
          const isSaved = savedSeekerIds.includes(seeker.id);

          return (
            <div
              key={seeker.id}
              className="bg-white hover:bg-[#F8FBFF] rounded-2xl p-4 sm:p-5 border border-blue-100 hover:border-blue-300 transition-all duration-200 flex flex-col justify-between group shadow-xs hover:shadow-md"
            >
              <div>
                {/* Score and verification header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-black uppercase flex items-center gap-1 font-bold">
                    <ShieldCheck size={11} /> Verified
                  </span>
                  <div className="text-right">
                    <span className="text-lg font-black text-blue-700 font-heading">{totalScore}%</span>
                    <span className="text-[8px] text-blue-600 font-bold uppercase ml-1 block">Match</span>
                  </div>
                </div>

                {/* Seeker Name & Location */}
                <h3 className="font-black text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {seeker.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1 font-medium">
                  <MapPin size={12} className="text-blue-600 shrink-0" />
                  <span className="truncate">{seeker.city}</span>
                </div>

                {/* Capital and timeline */}
                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-left">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Capital</span>
                    <span className="text-xs font-bold text-slate-900 flex items-center font-heading">
                      <IndianRupee size={11} className="text-emerald-600" />₹{seeker.investment}L
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Timeline</span>
                    <span className="text-xs font-bold text-slate-700 truncate block">
                      {seeker.timeline || '1-3 Mo'}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 mt-2.5 line-clamp-2 leading-relaxed font-normal">
                  {seeker.businessBackground || seeker.experience}
                </p>
              </div>

              {/* Card Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => setSelectedSeeker({ seeker, breakdown })}
                  className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/60 rounded-xl text-[11px] font-bold transition-all text-center cursor-pointer"
                >
                  Breakdown
                </button>

                {!isUnlocked ? (
                  <button
                    onClick={() => onUnlockSeeker(seeker.id)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-bold transition-all shadow-sm cursor-pointer"
                    title="Unlock Contact"
                  >
                    <Unlock size={14} />
                  </button>
                ) : (
                  <Link
                    to="/brand/crm"
                    className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold transition-all shadow-sm flex items-center justify-center"
                    title="Open in CRM"
                  >
                    <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Match Breakdown Modal */}
      {selectedSeeker && (
        <SeekerMatchModal
          isOpen={!!selectedSeeker}
          onClose={() => setSelectedSeeker(null)}
          seeker={selectedSeeker.seeker}
          brand={brand}
          breakdown={selectedSeeker.breakdown}
          isUnlocked={unlockedSeekerIds.includes(selectedSeeker.seeker.id)}
          isSaved={savedSeekerIds.includes(selectedSeeker.seeker.id)}
          onUnlock={() => {
            onUnlockSeeker(selectedSeeker.seeker.id);
            setSelectedSeeker(null);
          }}
          onToggleSave={() => onToggleSave(selectedSeeker.seeker.id)}
        />
      )}
    </div>
  );
}
