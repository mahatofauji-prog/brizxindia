import { FranchiseSeeker, Brand } from '../types';

export const useRecommendationEngine = (seeker: FranchiseSeeker, brands: Brand[]) => {
  const calculateScore = (seeker: FranchiseSeeker, brand: Brand) => {
    let cityScore = 0;
    let investmentScore = 0;
    let industryScore = 0;
    let backgroundScore = 0;
    let timelineScore = 0;

    // A. City Match (25%)
    if (brand.cityTargets && (brand.cityTargets.includes(seeker.city) || seeker.preferredCities?.some(c => brand.cityTargets?.includes(c)))) {
      cityScore = 25;
    } else if (!brand.cityTargets || brand.cityTargets.length === 0) {
      cityScore = 25; // Nationwide
    } else {
      cityScore = 0;
    }

    // B. Investment Match (25%)
    const minInv = brand.investmentRequired?.min ?? brand.minInvestment ?? 10;
    const maxInv = brand.investmentRequired?.max ?? brand.maxInvestment ?? (minInv * 2);

    if (seeker.investment >= minInv && seeker.investment <= maxInv) {
      investmentScore = 25;
    } else if (seeker.investment > maxInv) {
      investmentScore = 20;
    } else if (seeker.investment >= minInv) {
      investmentScore = 15;
    } else {
      investmentScore = 0;
    }

    // C. Industry Match (25%)
    if (seeker.industry === brand.industry || seeker.preferredIndustries?.includes(brand.industry)) {
      industryScore = 25;
    } else {
      industryScore = 0;
    }

    // D. Background Match (15%)
    if (seeker.businessBackground && brand.description?.toLowerCase().includes(seeker.businessBackground.toLowerCase().split(' ')[0])) {
      backgroundScore = 15;
    } else if (seeker.experience && brand.description?.toLowerCase().includes(seeker.experience.toLowerCase().split(' ')[0])) {
      backgroundScore = 10;
    } else {
      backgroundScore = 5;
    }

    // E. Timeline Match (10%)
    if (seeker.timeline && brand.roiPayback?.toLowerCase().includes(seeker.timeline.toLowerCase().split(' ')[0])) {
      timelineScore = 10;
    } else {
      timelineScore = 5;
    }

    const totalScore = cityScore + investmentScore + industryScore + backgroundScore + timelineScore;

    return {
      totalScore,
      breakdown: {
        cityScore,
        investmentScore,
        industryScore,
        backgroundScore,
        timelineScore
      }
    };
  };

  const recommendations = brands.map(brand => {
    const { totalScore, breakdown } = calculateScore(seeker, brand);
    return {
      brand,
      totalScore,
      breakdown
    };
  }).sort((a, b) => b.totalScore - a.totalScore);

  return recommendations;
};
