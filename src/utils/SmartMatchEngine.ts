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

export interface BrandSmartMatchRequirements {
  targetCity: string;
  pinCode: string;
  minInvestment: number; // in Lakhs
  maxInvestment: number; // in Lakhs
  industry: string;
  preferredBackground: string;
  targetTimeline: string;
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
 * BRAND -> SEEKER SMART MATCH ENGINE (100-Point Scoring System)
 * Weights:
 * - City Match: 25%
 * - Investment Match: 25%
 * - Industry Match: 25%
 * - Background Match: 15%
 * - Timeline Match: 10%
 * Total: 100%
 */
export const calculateBrandToSeekerMatch = (
  requirements: BrandSmartMatchRequirements,
  seeker: Partial<FranchiseSeeker>
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
  // 1. City Match (25% Weight)
  // ----------------------------------------------------
  const targetCity = (requirements.targetCity || '').trim().toLowerCase();
  const targetPin = (requirements.pinCode || '').trim();
  const seekerCity = (seeker.city || '').trim().toLowerCase();
  const seekerPrefCities = (seeker.preferredCities || []).map(c => c.trim().toLowerCase());
  const seekerPin = (seeker.pincode || '').trim();

  // Check Exact PIN code match
  const isExactPinMatch = targetPin.length === 6 && seekerPin.length === 6 && targetPin === seekerPin;
  // Check 3-digit PIN prefix (same postal circle / sorting district)
  const isPinPrefixMatch = targetPin.length >= 3 && seekerPin.length >= 3 && targetPin.slice(0, 3) === seekerPin.slice(0, 3);
  // Check direct city or preferred city
  const isDirectCityMatch = seekerCity && (seekerCity === targetCity || targetCity.includes(seekerCity) || seekerCity.includes(targetCity));
  const isPrefCityMatch = seekerPrefCities.some(c => c === targetCity || targetCity.includes(c) || c.includes(targetCity));

  // Regional NCR/MMR check
  const isNcrRegion = (targetCity.includes('delhi') || targetCity.includes('noida') || targetCity.includes('gurgaon') || targetCity.includes('faridabad')) &&
    (seekerCity.includes('delhi') || seekerCity.includes('noida') || seekerCity.includes('gurgaon') || seekerCity.includes('faridabad'));
  const isMmrRegion = (targetCity.includes('mumbai') || targetCity.includes('thane') || targetCity.includes('navi mumbai') || targetCity.includes('pune')) &&
    (seekerCity.includes('mumbai') || seekerCity.includes('thane') || seekerCity.includes('navi mumbai') || seekerCity.includes('pune'));

  if (isExactPinMatch || isDirectCityMatch || isPrefCityMatch) {
    cityScore = 25;
    cityMatchReason = isExactPinMatch 
      ? `Exact PIN code (${targetPin}) & local area match in ${seeker.city}`
      : `Direct target city match for ${seeker.city || requirements.targetCity}`;
    reasons.push(`✓ Seeker is actively based or looking for franchise rights in ${requirements.targetCity}`);
  } else if (isPinPrefixMatch) {
    cityScore = 23;
    cityMatchReason = `Same postal district / metro circle (PIN ${targetPin.slice(0, 3)}xxx)`;
    reasons.push(`✓ High geographic proximity within ${seeker.city} metropolitan district`);
  } else if (isNcrRegion || isMmrRegion) {
    cityScore = 20;
    cityMatchReason = `Adjacent metro region match (${seeker.city} ↔ ${requirements.targetCity})`;
    reasons.push(`✓ Commutable within the same metropolitan cluster`);
  } else {
    cityScore = 6;
    cityMatchReason = `Territory outside primary city; relocation or remote management required`;
    reasons.push(`~ Expansion territory differs from seeker's base (${seeker.city || 'India'})`);
  }

  // ----------------------------------------------------
  // 2. Investment Match (25% Weight)
  // ----------------------------------------------------
  const bMin = Math.max(requirements.minInvestment || 0, 1);
  const bMax = Math.max(requirements.maxInvestment || bMin * 2, bMin);
  const sInv = seeker.investment ?? seeker.availableCapital ?? 0;

  if (sInv >= bMin && sInv <= bMax) {
    investmentScore = 25;
    investmentMatchReason = `Seeker capacity (₹${sInv}L) falls squarely within requirement (₹${bMin}L - ₹${bMax}L)`;
    reasons.push(`✓ Verified investment capacity of ₹${sInv} Lakhs fits brand budget`);
  } else if (sInv > bMax) {
    investmentScore = 24;
    investmentMatchReason = `Seeker capacity (₹${sInv}L) comfortably covers and exceeds brand budget (₹${bMin}L - ₹${bMax}L)`;
    reasons.push(`✓ High capital bandwidth (₹${sInv}L) allows multi-unit expansion`);
  } else if (sInv >= bMin * 0.75) {
    investmentScore = 18;
    investmentMatchReason = `Capacity (₹${sInv}L) is near brand minimum (₹${bMin}L); viable with standard finance`;
    reasons.push(`~ Capital (₹${sInv}L) reachable with franchise financing or partner co-investment`);
  } else if (sInv >= bMin * 0.5) {
    investmentScore = 10;
    investmentMatchReason = `Moderate capital gap (Seeker ₹${sInv}L vs Min ₹${bMin}L)`;
    reasons.push(`~ Significant co-investment or loan support required`);
  } else {
    investmentScore = 4;
    investmentMatchReason = `Substantial budget gap (Seeker ₹${sInv}L vs Min ₹${bMin}L)`;
    reasons.push(`~ Capital capacity is currently below brand threshold`);
  }

  // ----------------------------------------------------
  // 3. Industry Match (25% Weight)
  // ----------------------------------------------------
  const reqInd = (requirements.industry || '').trim().toLowerCase();
  const sInd = (seeker.industry || '').trim().toLowerCase();
  const sPrefInd = (seeker.preferredIndustries || []).map(i => i.trim().toLowerCase());

  const isExactInd = sInd === reqInd || sPrefInd.includes(reqInd) || 
    (reqInd.includes('food') && sInd.includes('food')) ||
    (reqInd.includes('health') && sInd.includes('health')) ||
    (reqInd.includes('education') && sInd.includes('education')) ||
    (reqInd.includes('retail') && sInd.includes('retail')) ||
    (reqInd.includes('fitness') && sInd.includes('fitness')) ||
    (reqInd.includes('auto') && (sInd.includes('auto') || sInd.includes('ev'))) ||
    (reqInd.includes('beauty') && (sInd.includes('beauty') || sInd.includes('salon')));

  const checkRelated = (i1: string, i2: string) => {
    if (!i1 || !i2) return false;
    if ((i1.includes('food') || i1.includes('beverage') || i1.includes('qsr') || i1.includes('cafe')) &&
        (i2.includes('retail') || i2.includes('supermarket') || i2.includes('fmcg') || i2.includes('restaurant'))) return true;
    if ((i1.includes('retail') || i1.includes('fashion') || i1.includes('supermarket')) &&
        (i2.includes('food') || i2.includes('convenience') || i2.includes('fmcg'))) return true;
    if ((i1.includes('health') || i1.includes('wellness') || i1.includes('pharma') || i1.includes('clinic')) &&
        (i2.includes('fitness') || i2.includes('beauty') || i2.includes('wellness') || i2.includes('diagnostic'))) return true;
    if ((i1.includes('auto') || i1.includes('ev')) &&
        (i2.includes('tech') || i2.includes('automation') || i2.includes('logistics') || i2.includes('electrical'))) return true;
    if ((i1.includes('education') || i1.includes('edtech') || i1.includes('training')) &&
        (i2.includes('preschool') || i2.includes('services') || i2.includes('robotics'))) return true;
    return false;
  };

  if (isExactInd) {
    industryScore = 25;
    industryMatchReason = `Direct industry focus on ${requirements.industry}`;
    reasons.push(`✓ High mutual interest & prior focus in ${requirements.industry}`);
  } else if (checkRelated(reqInd, sInd) || sPrefInd.some(pi => checkRelated(reqInd, pi))) {
    industryScore = 18;
    industryMatchReason = `Synergistic industry alignment (${seeker.industry || 'Seeker'} ↔ ${requirements.industry})`;
    reasons.push(`✓ Transferable consumer operations & market understanding`);
  } else if (sPrefInd.length >= 2 || sInd === 'multi-sector' || sInd === 'other') {
    industryScore = 15;
    industryMatchReason = `Multi-sector investor with open portfolio appetite`;
    reasons.push(`✓ Agnostic investor evaluating multiple franchise opportunities`);
  } else {
    industryScore = 5;
    industryMatchReason = `Cross-industry applicant (${seeker.industry} applying to ${requirements.industry})`;
    reasons.push(`~ Different sector experience; franchisor training and SOP support recommended`);
  }

  // ----------------------------------------------------
  // 4. Background Match (15% Weight)
  // ----------------------------------------------------
  const reqBg = (requirements.preferredBackground || '').trim().toLowerCase();
  const bgText = `${seeker.experience || ''} ${seeker.businessBackground || ''} ${seeker.bio || ''} ${seeker.occupation || ''}`.toLowerCase();

  if (!reqBg || reqBg === 'no specific experience' || reqBg === 'any' || reqBg === 'no specific background') {
    backgroundScore = 15;
    backgroundMatchReason = 'Brand welcomes all professional backgrounds — full credit awarded';
    reasons.push('✓ Brand expansion open to first-time and experienced operators alike');
  } else {
    let matchedSpecific = false;
    if (reqBg.includes('food') && (bgText.includes('food') || bgText.includes('restaurant') || bgText.includes('qsr') || bgText.includes('cafe') || bgText.includes('chef') || bgText.includes('kitchen') || bgText.includes('f&b'))) {
      matchedSpecific = true;
    } else if (reqBg.includes('retail') && (bgText.includes('retail') || bgText.includes('supermarket') || bgText.includes('store') || bgText.includes('distributor') || bgText.includes('wholesale') || bgText.includes('fmcg'))) {
      matchedSpecific = true;
    } else if (reqBg.includes('health') && (bgText.includes('health') || bgText.includes('pharma') || bgText.includes('doctor') || bgText.includes('clinic') || bgText.includes('hospital') || bgText.includes('medical') || bgText.includes('radiologist'))) {
      matchedSpecific = true;
    } else if (reqBg.includes('business owner') && (bgText.includes('owner') || bgText.includes('founder') || bgText.includes('proprietor') || bgText.includes('managing director') || bgText.includes('family business') || bgText.includes('owns'))) {
      matchedSpecific = true;
    } else if (reqBg.includes('corporate') && (bgText.includes('corporate') || bgText.includes('director') || bgText.includes('executive') || bgText.includes('vp') || bgText.includes('head') || bgText.includes('tech executive'))) {
      matchedSpecific = true;
    } else if (reqBg.includes('sales') && (bgText.includes('sales') || bgText.includes('marketing') || bgText.includes('commercial') || bgText.includes('business development'))) {
      matchedSpecific = true;
    } else if (reqBg.includes('management') && (bgText.includes('manager') || bgText.includes('operations') || bgText.includes('director') || bgText.includes('lead'))) {
      matchedSpecific = true;
    } else if (reqBg.includes('entrepreneur') && (bgText.includes('entrepreneur') || bgText.includes('founder') || bgText.includes('investor') || bgText.includes('angel'))) {
      matchedSpecific = true;
    }

    if (matchedSpecific) {
      backgroundScore = 15;
      backgroundMatchReason = `Directly matches preferred background: ${requirements.preferredBackground}`;
      reasons.push(`✓ Seeker exhibits hands-on experience in ${requirements.preferredBackground}`);
    } else if (
      bgText.includes('director') || 
      bgText.includes('founder') || 
      bgText.includes('owner') || 
      bgText.includes('manager') || 
      bgText.includes('engineer') || 
      bgText.includes('executive')
    ) {
      backgroundScore = 12;
      backgroundMatchReason = 'Proven managerial & leadership background with transferable operational skills';
      reasons.push('✓ Strong business acumen and team management capability');
    } else if (bgText.length > 20) {
      backgroundScore = 9;
      backgroundMatchReason = 'Professional background ready for franchisor training';
      reasons.push('✓ General professional experience');
    } else {
      backgroundScore = 5;
      backgroundMatchReason = 'First-time entrepreneur / early-stage applicant profile';
      reasons.push('~ Will require thorough franchisor training and operational mentoring');
    }
  }

  // ----------------------------------------------------
  // 5. Timeline Match (10% Weight)
  // ----------------------------------------------------
  const reqTime = (requirements.targetTimeline || '').trim().toLowerCase();
  const sTime = (seeker.timeline || '').trim().toLowerCase();

  const isExactTime = reqTime && sTime && (
    (reqTime.includes('immediate') && sTime.includes('immediate')) ||
    (reqTime.includes('1-3') && sTime.includes('1-3')) ||
    (reqTime.includes('3-6') && sTime.includes('3-6')) ||
    (reqTime.includes('6-12') && sTime.includes('6-12')) ||
    (reqTime.includes('12+') && (sTime.includes('12') || sTime.includes('more than 12')))
  );

  if (isExactTime) {
    timelineScore = 10;
    timelineMatchReason = `Exact timeline match (${requirements.targetTimeline})`;
    reasons.push(`✓ Perfect timeline sync for target rollout in ${requirements.targetTimeline}`);
  } else if (
    (reqTime.includes('immediate') && sTime.includes('1-3')) ||
    (reqTime.includes('1-3') && (sTime.includes('immediate') || sTime.includes('1 month')))
  ) {
    timelineScore = 9;
    timelineMatchReason = 'Near-term readiness aligns with standard site acquisition & legal fit-out (0-3 Months)';
    reasons.push('✓ Readiness within 30-90 days matches franchise launch milestones');
  } else if (
    (reqTime.includes('1-3') && sTime.includes('3-6')) ||
    (reqTime.includes('3-6') && (sTime.includes('1-3') || sTime.includes('immediate')))
  ) {
    timelineScore = 7;
    timelineMatchReason = 'Moderate timeline window (3-6 Months launch horizon)';
    reasons.push('~ Feasible launch schedule with proactive site scouting');
  } else {
    timelineScore = 4;
    timelineMatchReason = 'Timeline variance; milestone alignment required during discovery call';
    reasons.push('~ Noticeable launch schedule variance');
  }

  // Total Calculation
  const rawTotal = cityScore + investmentScore + industryScore + backgroundScore + timelineScore;
  const totalScore = Math.min(Math.max(rawTotal, 10), 100);

  let fitLabel: MatchScoreBreakdown['fitLabel'] = 'MODERATE FIT';
  if (totalScore >= 90) fitLabel = 'EXCEPTIONAL FIT';
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
  brand: Partial<Brand> | BrandSmartMatchRequirements,
  seeker: Partial<FranchiseSeeker>
): MatchScoreBreakdown => {
  // If it's a BrandSmartMatchRequirements object
  if ('targetCity' in brand && 'minInvestment' in brand) {
    return calculateBrandToSeekerMatch(brand as BrandSmartMatchRequirements, seeker);
  }
  return calculateSeekerBrandMatch(seeker, brand as Partial<Brand>);
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
