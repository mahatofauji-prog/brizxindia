import { FranchiseSeeker, Brand } from '../types';

export interface SmartMatchInput {
  pinCode?: string;
  budgetMin?: number | null;
  budgetMax?: number | null;
  industries?: string[];
  background?: string;
  timeline?: string;
  city?: string;
  state?: string;
  [key: string]: any;
}

export interface MatchScoreBreakdown {
  cityScore: number;         // Max 25
  investmentScore: number;   // Max 25
  industryScore: number;     // Max 25
  backgroundScore: number;   // Max 15
  timelineScore: number;     // Max 10
  totalScore: number;        // Max 100
  cityMatchReason: string;
  investmentMatchReason: string;
  industryMatchReason: string;
  backgroundMatchReason: string;
  timelineMatchReason: string;
  reasons: string[];
  fitLabel: 'EXCEPTIONAL FIT' | 'HIGH COMPATIBILITY' | 'GOOD POTENTIAL' | 'MODERATE FIT';
}

/**
 * Standard 100-Point Scoring Engine
 * Weights:
 * - City Match: 25%
 * - Investment Match: 25%
 * - Industry Match: 25%
 * - Background Match: 15%
 * - Timeline Match: 10%
 */

export const calculateSeekerBrandMatch = (
  seeker: Partial<FranchiseSeeker>,
  brand: Partial<Brand>
): MatchScoreBreakdown => {
  let cityScore = 0;
  let investmentScore = 0;
  let industryScore = 0;
  let backgroundScore = 0;
  let timelineScore = 0;

  const reasons: string[] = [];
  let cityMatchReason = '';
  let investmentMatchReason = '';
  let industryMatchReason = '';
  let backgroundMatchReason = '';
  let timelineMatchReason = '';

  // ----------------------------------------------------
  // 1. City Match (25 Points Max)
  // ----------------------------------------------------
  const seekerCity = (seeker.city || '').trim().toLowerCase();
  const seekerPrefCities = (seeker.preferredCities || []).map(c => c.trim().toLowerCase());
  const brandCityTargets = (brand.cityTargets || []).map(c => c.trim().toLowerCase());
  const brandCity = (brand.city || '').trim().toLowerCase();

  const isPanIndiaBrand = brandCityTargets.some(c => 
    c.includes('pan-india') || c.includes('pan india') || c.includes('all') || c.includes('tier 1')
  ) || (brandCityTargets.length === 0);

  if (seekerCity && (brandCityTargets.includes(seekerCity) || seekerCity === brandCity)) {
    cityScore = 25;
    cityMatchReason = `Direct location match for ${seeker.city}`;
    reasons.push(`✓ Brand has active expansion target in ${seeker.city}`);
  } else if (seekerPrefCities.some(pc => brandCityTargets.includes(pc) || pc === brandCity)) {
    cityScore = 25;
    cityMatchReason = `Preferred location matched target city`;
    reasons.push(`✓ Seeker preferred cities align with brand expansion markets`);
  } else if (isPanIndiaBrand) {
    cityScore = 22;
    cityMatchReason = 'Brand supports nationwide / multi-city expansion';
    reasons.push('✓ Brand accepts applications pan-India');
  } else {
    cityScore = 8;
    cityMatchReason = 'Regional expansion subject to territory review';
    reasons.push('~ Territory availability to be evaluated on inquiry');
  }

  // ----------------------------------------------------
  // 2. Investment Match (25 Points Max)
  // ----------------------------------------------------
  const bMin = brand.investmentRequired?.min ?? brand.minInvestment ?? 10;
  const bMax = brand.investmentRequired?.max ?? brand.maxInvestment ?? (bMin * 2);
  const sInvestment = seeker.investment ?? seeker.availableCapital ?? 0;

  if (sInvestment >= bMin && sInvestment <= bMax) {
    investmentScore = 25;
    investmentMatchReason = `Capital capacity (₹${sInvestment}L) perfectly fits requirement (₹${bMin}-${bMax}L)`;
    reasons.push(`✓ Available budget of ₹${sInvestment}L fits brand requirement (₹${bMin}-${bMax}L)`);
  } else if (sInvestment > bMax) {
    investmentScore = 22;
    investmentMatchReason = `Capital capacity (₹${sInvestment}L) comfortably exceeds minimum (₹${bMin}L)`;
    reasons.push(`✓ Strong financial bandwidth (₹${sInvestment}L) for multi-unit or flagship rollout`);
  } else if (sInvestment >= bMin * 0.75) {
    investmentScore = 16;
    investmentMatchReason = `Budget (₹${sInvestment}L) close to brand minimum (₹${bMin}L) - financing viable`;
    reasons.push(`~ Budget (₹${sInvestment}L) within reachable margin of required ₹${bMin}L`);
  } else if (sInvestment >= bMin * 0.5) {
    investmentScore = 10;
    investmentMatchReason = `Moderate capital gap (Seeker: ₹${sInvestment}L vs Required: ₹${bMin}L)`;
    reasons.push(`~ Requires co-investor or franchise loan support`);
  } else {
    investmentScore = 5;
    investmentMatchReason = `Substantial capital gap (Seeker: ₹${sInvestment}L vs Required: ₹${bMin}L)`;
    reasons.push(`~ Significant investment mismatch`);
  }

  // ----------------------------------------------------
  // 3. Industry Match (25 Points Max)
  // ----------------------------------------------------
  const sIndustry = (seeker.industry || '').trim().toLowerCase();
  const sPrefIndustries = (seeker.preferredIndustries || []).map(i => i.trim().toLowerCase());
  const bIndustry = (brand.industry || '').trim().toLowerCase();

  const isDirectIndustryMatch = (sIndustry && sIndustry === bIndustry) ||
    sPrefIndustries.includes(bIndustry);

  const checkRelatedIndustries = (ind1: string, ind2: string) => {
    if (!ind1 || !ind2) return false;
    if ((ind1.includes('food') || ind1.includes('qsr') || ind1.includes('beverage')) && 
        (ind2.includes('food') || ind2.includes('qsr') || ind2.includes('beverage') || ind2.includes('cafe'))) return true;
    if ((ind1.includes('fitness') || ind1.includes('health') || ind1.includes('wellness')) && 
        (ind2.includes('fitness') || ind2.includes('health') || ind2.includes('wellness') || ind2.includes('gym'))) return true;
    if ((ind1.includes('tech') || ind1.includes('automation') || ind1.includes('iot') || ind1.includes('ev') || ind1.includes('automobile')) && 
        (ind2.includes('tech') || ind2.includes('automation') || ind2.includes('iot') || ind2.includes('ev') || ind2.includes('automobile'))) return true;
    if ((ind1.includes('education') || ind1.includes('training') || ind1.includes('preschool')) && 
        (ind2.includes('education') || ind2.includes('training') || ind2.includes('preschool'))) return true;
    if ((ind1.includes('retail') || ind1.includes('fmcg')) && 
        (ind2.includes('retail') || ind2.includes('fmcg') || ind2.includes('convenience'))) return true;
    return false;
  };

  if (isDirectIndustryMatch) {
    industryScore = 25;
    industryMatchReason = `Exact match in ${brand.industry || 'targeted sector'}`;
    reasons.push(`✓ High mutual interest in ${brand.industry}`);
  } else if (checkRelatedIndustries(sIndustry, bIndustry) || sPrefIndustries.some(pi => checkRelatedIndustries(pi, bIndustry))) {
    industryScore = 18;
    industryMatchReason = `Related sector alignment (${seeker.industry || 'Seeker'} ↔ ${brand.industry || 'Brand'})`;
    reasons.push(`✓ Complementary industry operational synergy`);
  } else {
    industryScore = 6;
    industryMatchReason = `Cross-industry candidate (${seeker.industry} applying to ${brand.industry})`;
    reasons.push(`~ Different sector experience; brand training will be key`);
  }

  // ----------------------------------------------------
  // 4. Background & Operational Experience Match (15 Points Max)
  // ----------------------------------------------------
  const bgText = `${seeker.experience || ''} ${seeker.businessBackground || ''} ${seeker.bio || ''}`.toLowerCase();
  
  if (
    bgText.includes('director') || 
    bgText.includes('manager') || 
    bgText.includes('founder') || 
    bgText.includes('owner') || 
    bgText.includes('operator') ||
    bgText.includes('executive') ||
    bgText.includes('operations') ||
    bgText.includes('sales')
  ) {
    backgroundScore = 15;
    backgroundMatchReason = 'Proven managerial, leadership or operational track record';
    reasons.push('✓ Strong managerial experience suitable for unit leadership');
  } else if (bgText.length > 10) {
    backgroundScore = 12;
    backgroundMatchReason = 'Professional career background with transferable business skills';
    reasons.push('✓ Experienced professional ready for franchise entrepreneurship');
  } else {
    backgroundScore = 8;
    backgroundMatchReason = 'First-time entrepreneur / private investor profile';
    reasons.push('~ Aspiring franchisee with basic profile details');
  }

  // ----------------------------------------------------
  // 5. Timeline Match (10 Points Max)
  // ----------------------------------------------------
  const timeline = (seeker.timeline || '').toLowerCase();
  if (timeline.includes('immediate') || timeline.includes('0-1') || timeline.includes('1 month')) {
    timelineScore = 10;
    timelineMatchReason = 'Immediate readiness to launch';
    reasons.push('✓ Seeker is ready to move immediately');
  } else if (timeline.includes('1-3') || timeline.includes('3 months')) {
    timelineScore = 9;
    timelineMatchReason = 'Near-term readiness (1-3 Months)';
    reasons.push('✓ 1-3 Month timeline aligns with site selection & fit-out cycle');
  } else if (timeline.includes('3-6') || timeline.includes('6 months')) {
    timelineScore = 7;
    timelineMatchReason = 'Medium-term launch horizon (3-6 Months)';
    reasons.push('~ Medium-term planning stage');
  } else {
    timelineScore = 5;
    timelineMatchReason = 'Exploratory timeline (6+ Months)';
    reasons.push('~ Exploratory or long-term evaluation phase');
  }

  const rawTotal = cityScore + investmentScore + industryScore + backgroundScore + timelineScore;
  const totalScore = Math.min(Math.max(rawTotal, 15), 99); // realistic 15-99%

  let fitLabel: MatchScoreBreakdown['fitLabel'] = 'MODERATE FIT';
  if (totalScore >= 88) fitLabel = 'EXCEPTIONAL FIT';
  else if (totalScore >= 75) fitLabel = 'HIGH COMPATIBILITY';
  else if (totalScore >= 60) fitLabel = 'GOOD POTENTIAL';

  return {
    cityScore,
    investmentScore,
    industryScore,
    backgroundScore,
    timelineScore,
    totalScore,
    cityMatchReason,
    investmentMatchReason,
    industryMatchReason,
    backgroundMatchReason,
    timelineMatchReason,
    reasons,
    fitLabel
  };
};

/**
 * Reverse alias for Brand looking up Seeker
 */
export const calculateBrandSeekerMatch = (
  brand: Partial<Brand>,
  seeker: Partial<FranchiseSeeker>
): MatchScoreBreakdown => {
  return calculateSeekerBrandMatch(seeker, brand);
};

/**
 * Backward compatibility for wizard / form inputs
 */
export const getSmartMatchScore = (brand: any, input: SmartMatchInput): MatchScoreBreakdown => {
  const simulatedSeeker: Partial<FranchiseSeeker> = {
    city: input.city,
    state: input.state,
    investment: input.budgetMax ?? input.budgetMin ?? 25,
    industry: input.industries?.[0] || '',
    preferredIndustries: input.industries || [],
    experience: input.background || '',
    businessBackground: input.background || '',
    timeline: input.timeline || '1-3 Months'
  };

  return calculateSeekerBrandMatch(simulatedSeeker, brand);
};

/**
 * Helper to get score theme badge colors
 */
export const getMatchScoreColor = (score: number) => {
  if (score >= 90) return {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    ring: 'ring-emerald-500',
    badge: 'bg-emerald-600 text-white',
    text: 'text-emerald-600',
    gradient: 'from-emerald-600 to-teal-700'
  };
  if (score >= 75) return {
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    ring: 'ring-blue-500',
    badge: 'bg-blue-600 text-white',
    text: 'text-blue-600',
    gradient: 'from-blue-600 to-indigo-700'
  };
  if (score >= 60) return {
    bg: 'bg-amber-50 text-amber-800 border-amber-200',
    ring: 'ring-amber-500',
    badge: 'bg-amber-600 text-white',
    text: 'text-amber-600',
    gradient: 'from-amber-500 to-orange-600'
  };
  return {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    ring: 'ring-slate-400',
    badge: 'bg-slate-600 text-white',
    text: 'text-slate-600',
    gradient: 'from-slate-600 to-slate-800'
  };
};
