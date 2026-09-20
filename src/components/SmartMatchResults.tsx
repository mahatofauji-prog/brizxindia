import React from 'react';
import { ShieldCheck, MapPin, IndianRupee, Building2, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { Link } from 'react-router';

interface Props {
  results: any[];
}

export const SmartMatchResults: React.FC<Props> = ({ results }) => {
  const topMatches = results.filter(r => r.smartMatchScore >= 50);
  const otherMatches = results.filter(r => r.smartMatchScore < 50);

  const displayResults = topMatches.length > 0 ? topMatches : otherMatches;

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
        {topMatches.length > 0 ? (
          <>
            <h3 className="text-2xl font-black text-blue-900 uppercase tracking-tight mb-2">
              Here are your top matches
            </h3>
            <p className="text-blue-700 font-medium">
              We found {topMatches.length} franchises that strongly match your criteria.
            </p>
          </>
        ) : (
          <>
            <h3 className="text-2xl font-black text-amber-600 uppercase tracking-tight mb-2">
              No perfect match found
            </h3>
            <p className="text-amber-700 font-medium">
              Here are the closest opportunities based on your preferences.
            </p>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {displayResults.map((brand, idx) => {
          const { min, max } = getBrandInvestmentRange(brand);
          const cover = brand.coverImage || 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80';
          const b = brand.matchBreakdown;

          return (
            <div key={brand.id} className="bg-white rounded-3xl shadow-lg border border-blue-100 overflow-hidden flex flex-col group hover:shadow-2xl transition-all">
              <div className="relative h-48 w-full bg-slate-100">
                <img
                  src={cover}
                  alt={brand.brandName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                
                {/* Match Score Badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-white/20 text-center flex flex-col items-center justify-center min-w-[80px]">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Match</span>
                  <span className={`text-2xl font-black leading-none ${brand.smartMatchScore >= 80 ? 'text-emerald-600' : brand.smartMatchScore >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                    {brand.smartMatchScore}%
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-end gap-4">
                  <BrandLogo logo={brand.logo} brandName={brand.brandName} size="lg" className="shadow-xl" />
                  <div className="flex-1 text-white">
                    {brand.verified && (
                      <span className="bg-emerald-500/90 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 w-max mb-1">
                        <ShieldCheck size={10} /> Verified
                      </span>
                    )}
                    <h4 className="text-xl font-black uppercase tracking-tight line-clamp-1">{brand.brandName}</h4>
                    <span className="text-xs font-bold text-blue-200 uppercase tracking-widest">{brand.industry}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      <IndianRupee size={12} className="text-blue-500" /> Investment
                    </span>
                    <span className="text-sm font-black text-slate-800">
                      ₹{min}{min !== max ? ` - ${max}` : ''} L
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      <Building2 size={12} className="text-blue-500" /> Space Req.
                    </span>
                    <span className="text-sm font-black text-slate-800 line-clamp-1">
                      {brand.spaceRequired || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Smart Match Breakdown */}
                <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 mb-6">
                  <h5 className="text-xs font-black text-blue-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Sparkles size={14} className="text-blue-600" /> Match Breakdown
                  </h5>
                  <div className="space-y-2 text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                    <div className="flex justify-between items-center">
                      <span>City Match</span>
                      <span className={b.cityScore >= 20 ? 'text-emerald-600' : 'text-amber-600'}>{b.cityScore}/25</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Investment Match</span>
                      <span className={b.investmentScore >= 20 ? 'text-emerald-600' : 'text-amber-600'}>{b.investmentScore}/25</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Industry Match</span>
                      <span className={b.industryScore >= 20 ? 'text-emerald-600' : 'text-amber-600'}>{b.industryScore}/25</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Background Match</span>
                      <span className={b.backgroundScore >= 10 ? 'text-emerald-600' : 'text-amber-600'}>{b.backgroundScore}/15</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Timeline Match</span>
                      <span className={b.timelineScore >= 8 ? 'text-emerald-600' : 'text-amber-600'}>{b.timelineScore}/10</span>
                    </div>
                  </div>
                  
                  {b.reasons && b.reasons.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-blue-100 space-y-1.5">
                      {b.reasons.map((reason: string, i: number) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px] font-bold text-slate-700">
                          {reason.startsWith('✓') ? (
                            <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <span className="text-amber-500 shrink-0 mt-0.5 font-black text-sm leading-none">•</span>
                          )}
                          <span>{reason.replace('✓ ', '')}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 flex gap-3">
                  <Link
                    to={`/brands/${brand.id}`}
                    className="flex-1 bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 text-xs font-black uppercase tracking-widest py-3 rounded-xl transition-colors text-center"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/brands/${brand.id}?apply=true`}
                    state={{ smartMatchScore: brand.smartMatchScore, matchBreakdown: brand.matchBreakdown }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5"
                  >
                    Apply Now <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Helper inside file for isolated usage
const getBrandInvestmentRange = (brand: any): { min: number; max: number } => {
  let min = 0;
  let max = 0;
  if (brand.investmentRequired) {
    if (typeof brand.investmentRequired === 'object' && brand.investmentRequired !== null) {
      min = Number(brand.investmentRequired.min) || 0;
      max = Number(brand.investmentRequired.max) || min;
    } else if (typeof brand.investmentRequired === 'number') {
      const val = brand.investmentRequired > 1000 ? brand.investmentRequired / 100000 : brand.investmentRequired;
      min = val;
      max = val;
    }
  } else {
    min = Number(brand.minInvestment) || 0;
    max = Number(brand.maxInvestment) || min;
  }
  if (max < min) max = min;
  return { min, max };
};
