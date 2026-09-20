import React, { useState } from 'react';
import { Link } from 'react-router';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useRecommendationEngine } from '../../hooks/useRecommendationEngine';
import { FranchiseSeeker, Brand } from '../../types';
import MatchBreakdown from './MatchBreakdown';

interface Props {
  seeker: FranchiseSeeker;
  brands: Brand[];
}

export default function BrizxRecommendationSection({ seeker, brands }: Props) {
  const recommendations = useRecommendationEngine(seeker, brands);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);

  if (!seeker.city || !seeker.investment || !seeker.industry) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-amber-200 shadow-sm space-y-4">
        <h3 className="text-lg font-black text-slate-900">BRIZX INDIA RECOMMENDATION</h3>
        <p className="text-sm text-slate-600">Complete your profile to improve recommendations.</p>
        <Link to="/seeker/profile" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase">Complete Profile</Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-lg font-black text-slate-900 mb-1">BRIZX INDIA RECOMMENDATION</h3>
        <p className="text-xs text-slate-500">AI-powered franchise recommendations based on your profile</p>
      </div>

      <div className="space-y-4">
        {recommendations.slice(0, 3).map(({ brand, totalScore, breakdown }) => (
          <div key={brand.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
            <div>
              <h4 className="font-black text-sm">{brand.brandName}</h4>
              <p className="text-xs font-bold text-blue-700">{totalScore}% Match</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setSelectedBrand({ brand, breakdown })} className="text-xs font-bold text-slate-600 underline cursor-pointer">View Breakdown</button>
              <Link to={`/brands/${brand.id}`} className="px-3 py-1 bg-blue-600 text-white text-xs font-black rounded-lg">Connect</Link>
            </div>
          </div>
        ))}
      </div>

      {selectedBrand && (
        <MatchBreakdown
          isOpen={!!selectedBrand}
          onClose={() => setSelectedBrand(null)}
          brand={selectedBrand.brand}
          seeker={seeker}
          breakdown={selectedBrand.breakdown}
        />
      )}
    </div>
  );
}
