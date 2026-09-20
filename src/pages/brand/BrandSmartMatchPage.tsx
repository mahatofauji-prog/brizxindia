import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router';
import { 
  Sparkles, Filter, Search, ShieldCheck, MapPin, IndianRupee, Briefcase, 
  Clock, ArrowUpDown, ChevronRight, SlidersHorizontal, RotateCcw, 
  Building2, CheckCircle2, Lock, Unlock, Calendar, Eye, Bookmark, X, AlertCircle
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { FranchiseSeeker, Brand } from '../../types';
import { 
  BrandSmartMatchRequirements, 
  calculateBrandToSeekerMatch, 
  MatchScoreBreakdown, 
  getMatchScoreColor 
} from '../../utils/SmartMatchEngine';
import BrandSmartMatchForm from '../../components/brand/BrandSmartMatchForm';
import SeekerMatchCard from '../../components/brand/SeekerMatchCard';
import SeekerMatchModal from '../../components/brand/SeekerMatchModal';
import { isValidIndianPinCode, getLocationFromPinCode } from '../../utils/indiaPinCodes';

export default function BrandSmartMatchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { 
    seekers, 
    brands, 
    subscriptions, 
    unlockLead, 
    toggleSaveLeadForBrand,
    scheduleMeeting
  } = useData();

  // Active brand
  const currentBrand: Brand = useMemo(() => {
    if (user?.role === 'BRAND_OWNER') {
      const found = brands.find(b => b.id === user.id || (user.email && b.email === user.email));
      if (found) return found;
    }
    return brands[0] || ({} as Brand);
  }, [user, brands]);

  // Brand subscription & credits
  const brandSubscription = useMemo(() => {
    return subscriptions.find(s => s.brandId === currentBrand?.id);
  }, [subscriptions, currentBrand]);

  const remainingCredits = brandSubscription?.unlocksRemaining ?? 10;

  // Requirements State
  const [requirements, setRequirements] = useState<BrandSmartMatchRequirements | null>(() => {
    // Check if initial parameters exist in URL
    const cityParam = searchParams.get('city');
    const pinParam = searchParams.get('pin');
    const minInvParam = searchParams.get('minInv');
    const maxInvParam = searchParams.get('maxInv');
    const indParam = searchParams.get('industry');

    if (cityParam || pinParam || indParam) {
      return {
        targetCity: cityParam || currentBrand.city || 'Bangalore',
        pinCode: pinParam || currentBrand.pincode || '560038',
        minInvestment: minInvParam ? Number(minInvParam) : (currentBrand.minInvestment || 15),
        maxInvestment: maxInvParam ? Number(maxInvParam) : (currentBrand.maxInvestment || 35),
        industry: indParam || currentBrand.industry || 'Food & Beverages',
        preferredBackground: 'No Specific Experience',
        targetTimeline: '1-3 Months'
      };
    }

    // Default prefill from current brand
    return {
      targetCity: currentBrand.city || 'Bangalore',
      pinCode: currentBrand.pincode || '560038',
      minInvestment: currentBrand.minInvestment || 15,
      maxInvestment: currentBrand.maxInvestment || 35,
      industry: currentBrand.industry || 'Food & Beverages',
      preferredBackground: 'No Specific Experience',
      targetTimeline: '1-3 Months'
    };
  });

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Post-Match Filters State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [cityFilter, setCityFilter] = useState<string>('ALL');
  const [pinFilter, setPinFilter] = useState<string>('');
  const [industryFilter, setIndustryFilter] = useState<string>('ALL');
  const [timelineFilter, setTimelineFilter] = useState<string>('ALL');
  const [minScoreFilter, setMinScoreFilter] = useState<number>(0);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<'SCORE_DESC' | 'INVESTMENT_DESC' | 'INVESTMENT_ASC' | 'TIMELINE' | 'NAME'>('SCORE_DESC');

  // Modals State
  const [selectedSeekerForModal, setSelectedSeekerForModal] = useState<{
    seeker: FranchiseSeeker;
    breakdown: MatchScoreBreakdown;
  } | null>(null);

  const [unlockModalSeeker, setUnlockModalSeeker] = useState<FranchiseSeeker | null>(null);
  const [unlockNotification, setUnlockNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [meetingModalSeeker, setMeetingModalSeeker] = useState<FranchiseSeeker | null>(null);
  const [meetingDate, setMeetingDate] = useState<string>('');
  const [meetingNotes, setMeetingNotes] = useState<string>('');

  // Handle Form Submission
  const handleRequirementsSubmit = (newReq: BrandSmartMatchRequirements) => {
    setIsCalculating(true);
    setRequirements(newReq);

    // Update URL query parameters for bookmarking/sharing
    setSearchParams({
      city: newReq.targetCity,
      pin: newReq.pinCode,
      minInv: newReq.minInvestment.toString(),
      maxInv: newReq.maxInvestment.toString(),
      industry: newReq.industry
    });

    setTimeout(() => {
      setIsCalculating(false);
      setIsFormOpen(false);
      // Scroll to results
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }, 400);
  };

  // Calculate Match Scores for all seekers
  const allScoredSeekers = useMemo(() => {
    if (!requirements) return [];

    return seekers.map((seeker) => {
      const breakdown = calculateBrandToSeekerMatch(requirements, seeker);
      return {
        seeker,
        breakdown,
        isUnlocked: Boolean(currentBrand.unlockedLeads?.includes(seeker.id)),
        isSaved: Boolean(currentBrand.savedLeads?.includes(seeker.id))
      };
    });
  }, [seekers, requirements, currentBrand.unlockedLeads, currentBrand.savedLeads]);

  // Apply Post-Match Search and Filters
  const filteredAndSortedSeekers = useMemo(() => {
    let result = allScoredSeekers.filter(({ seeker, breakdown }) => {
      // Verification check
      if (verifiedOnly && !seeker.verified) return false;

      // Minimum score threshold
      if (breakdown.totalScore < minScoreFilter) return false;

      // City filter
      if (cityFilter !== 'ALL' && seeker.city.toLowerCase() !== cityFilter.toLowerCase()) {
        const inPreferred = seeker.preferredCities?.some(c => c.toLowerCase() === cityFilter.toLowerCase());
        if (!inPreferred) return false;
      }

      // PIN filter
      if (pinFilter.trim()) {
        const cleanPin = pinFilter.trim();
        const seekerPin = (seeker.pincode || '').trim();
        if (!seekerPin.startsWith(cleanPin)) return false;
      }

      // Industry filter
      if (industryFilter !== 'ALL') {
        const matchesInd = seeker.industry.toLowerCase() === industryFilter.toLowerCase() ||
          seeker.preferredIndustries?.some(i => i.toLowerCase() === industryFilter.toLowerCase());
        if (!matchesInd) return false;
      }

      // Timeline filter
      if (timelineFilter !== 'ALL') {
        if ((seeker.timeline || '').toLowerCase() !== timelineFilter.toLowerCase()) {
          return false;
        }
      }

      // Free text search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = seeker.name.toLowerCase().includes(q);
        const matchCity = seeker.city.toLowerCase().includes(q);
        const matchInd = seeker.industry.toLowerCase().includes(q);
        const matchBg = (seeker.experience || '').toLowerCase().includes(q) || (seeker.businessBackground || '').toLowerCase().includes(q);
        if (!matchName && !matchCity && !matchInd && !matchBg) return false;
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'SCORE_DESC') {
        return b.breakdown.totalScore - a.breakdown.totalScore;
      }
      if (sortBy === 'INVESTMENT_DESC') {
        return (b.seeker.investment || 0) - (a.seeker.investment || 0);
      }
      if (sortBy === 'INVESTMENT_ASC') {
        return (a.seeker.investment || 0) - (b.seeker.investment || 0);
      }
      if (sortBy === 'TIMELINE') {
        return (a.seeker.timeline || '').localeCompare(b.seeker.timeline || '');
      }
      if (sortBy === 'NAME') {
        return a.seeker.name.localeCompare(b.seeker.name);
      }
      return 0;
    });

    return result;
  }, [
    allScoredSeekers, 
    verifiedOnly, 
    minScoreFilter, 
    cityFilter, 
    pinFilter, 
    industryFilter, 
    timelineFilter, 
    searchTerm, 
    sortBy
  ]);

  // Summary Metrics
  const stats = useMemo(() => {
    const total = filteredAndSortedSeekers.length;
    const exceptional = filteredAndSortedSeekers.filter(s => s.breakdown.totalScore >= 90).length;
    const high = filteredAndSortedSeekers.filter(s => s.breakdown.totalScore >= 75 && s.breakdown.totalScore < 90).length;
    const avgScore = total > 0 
      ? Math.round(filteredAndSortedSeekers.reduce((acc, curr) => acc + curr.breakdown.totalScore, 0) / total)
      : 0;

    return { total, exceptional, high, avgScore };
  }, [filteredAndSortedSeekers]);

  // Unique cities in current dataset for filter dropdown
  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    seekers.forEach(s => {
      if (s.city) cities.add(s.city);
    });
    return Array.from(cities).sort();
  }, [seekers]);

  // Unique industries
  const availableIndustries = useMemo(() => {
    const inds = new Set<string>();
    seekers.forEach(s => {
      if (s.industry) inds.add(s.industry);
    });
    return Array.from(inds).sort();
  }, [seekers]);

  // Handle Confirm Unlock
  const handleConfirmUnlock = (seekerId: string) => {
    if (remainingCredits <= 0) {
      setUnlockNotification({
        type: 'error',
        message: 'Insufficient lead credits in your brand wallet. Please upgrade your plan to unlock full contact details.'
      });
      setUnlockModalSeeker(null);
      return;
    }

    unlockLead(currentBrand.id, seekerId);
    const seeker = seekers.find(s => s.id === seekerId);
    setUnlockNotification({
      type: 'success',
      message: `Verified contact unlocked for ${seeker?.name || 'Investor'}! Lead automatically synced to your Brand CRM Pipeline.`
    });
    setUnlockModalSeeker(null);
    setTimeout(() => setUnlockNotification(null), 6000);
  };

  // Handle Meeting Scheduling
  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingModalSeeker || !meetingDate) return;

    scheduleMeeting({
      brandId: currentBrand?.id || 'b1',
      brandName: currentBrand?.brandName || 'Verified Brand',
      seekerId: meetingModalSeeker.id,
      date: meetingDate,
      time: '11:00 AM IST',
      status: 'CONFIRMED',
      location: 'Google Meet / BrizX Virtual Discovery Room',
      notes: meetingNotes || `Brand expansion discovery call with ${meetingModalSeeker.name}`
    });

    setUnlockNotification({
      type: 'success',
      message: `Discovery meeting scheduled with ${meetingModalSeeker.name} on ${new Date(meetingDate).toLocaleDateString()}!`
    });
    setMeetingModalSeeker(null);
    setMeetingDate('');
    setMeetingNotes('');
    setTimeout(() => setUnlockNotification(null), 6000);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setCityFilter('ALL');
    setPinFilter('');
    setIndustryFilter('ALL');
    setTimelineFilter('ALL');
    setMinScoreFilter(0);
    setVerifiedOnly(true);
    setSortBy('SCORE_DESC');
  };

  return (
    <div className="min-h-screen bg-[#F6F9FC] pb-24 text-slate-900">
      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden border-b border-blue-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black uppercase tracking-wider border border-blue-400/30">
                <Sparkles size={14} className="text-blue-400" />
                Brand → Seeker Smart Match Engine
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-heading text-white">
                Find the Right Franchise Seekers for Your Brand
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Enter your expansion requirements below. Our 100-point algorithm audits verified investors across City (25%), Budget (25%), Industry (25%), Background (15%), and Timeline (10%).
              </p>
            </div>

            {/* Quick Wallet / Status Badge */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 shrink-0 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
                <Unlock size={24} />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">
                  Lead Unlock Credits
                </div>
                <div className="text-2xl font-black text-white font-heading">
                  {remainingCredits} <span className="text-xs font-bold text-slate-300">Credits</span>
                </div>
                <Link to="/brand/subscription" className="text-[11px] text-blue-300 hover:text-white underline font-semibold">
                  Manage Wallet
                </Link>
              </div>
            </div>
          </div>

          {/* Active Requirements Bar */}
          {requirements && !isFormOpen && (
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] mr-1">
                  Active Requirements:
                </span>
                <span className="px-3 py-1 rounded-xl bg-white/15 text-white font-bold flex items-center gap-1.5 border border-white/10">
                  <MapPin size={13} className="text-blue-300" /> {requirements.targetCity} ({requirements.pinCode})
                </span>
                <span className="px-3 py-1 rounded-xl bg-white/15 text-white font-bold flex items-center gap-1.5 border border-white/10">
                  <IndianRupee size={13} className="text-emerald-300" /> ₹{requirements.minInvestment}L – ₹{requirements.maxInvestment}L
                </span>
                <span className="px-3 py-1 rounded-xl bg-white/15 text-white font-bold flex items-center gap-1.5 border border-white/10">
                  <Briefcase size={13} className="text-purple-300" /> {requirements.industry}
                </span>
                <span className="px-3 py-1 rounded-xl bg-white/15 text-white font-bold flex items-center gap-1.5 border border-white/10">
                  <Clock size={13} className="text-blue-300" /> {requirements.targetTimeline}
                </span>
              </div>

              <button
                onClick={() => setIsFormOpen(true)}
                className="px-4 py-2 bg-white text-slate-900 hover:bg-blue-50 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <SlidersHorizontal size={14} className="text-blue-600" />
                <span>Edit Requirements</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-8">
        {/* Notification Toast */}
        {unlockNotification && (
          <div className={`p-4 rounded-2xl border shadow-md flex items-center justify-between gap-3 animate-fadeIn ${
            unlockNotification.type === 'success' 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
              : 'bg-red-50 border-red-300 text-red-900'
          }`}>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
              {unlockNotification.type === 'success' ? (
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle size={18} className="text-red-600 shrink-0" />
              )}
              <span>{unlockNotification.message}</span>
            </div>
            <button
              onClick={() => setUnlockNotification(null)}
              className="p-1 hover:bg-black/5 rounded-lg cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Brand Requirement Form Card (Toggleable) */}
        {isFormOpen ? (
          <BrandSmartMatchForm
            initialRequirements={requirements || undefined}
            currentBrand={currentBrand}
            onSubmit={handleRequirementsSubmit}
            onCancel={() => setIsFormOpen(false)}
            isLoading={isCalculating}
          />
        ) : null}

        {/* Results Overview Bar & Filter Controls */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          {/* Top Row: Metrics and Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                  Ranked Verified Franchise Seekers
                </h2>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-black">
                  {stats.total} Matched
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Calculated in real-time based on your target city, PIN code, investment budget, industry, and background requirements.
              </p>
            </div>

            {/* Metric Pills */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="px-3.5 py-2 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-emerald-800 font-bold">
                  {stats.exceptional} Exceptional Fits (90%+)
                </span>
              </div>
              <div className="px-3.5 py-2 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span className="text-blue-800 font-bold">
                  {stats.high} High Fits (75%–89%)
                </span>
              </div>
              <div className="px-3.5 py-2 bg-slate-100 rounded-2xl border border-slate-200 flex items-center gap-2 font-bold text-slate-700">
                <span>Avg. Compatibility:</span>
                <span className="text-blue-700 font-black">{stats.avgScore}%</span>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="space-y-4">
            {/* Search Input + City + Industry + Sort */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Keyword Search */}
              <div className="lg:col-span-2 relative">
                <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search seeker name, skills, bio..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all"
                />
              </div>

              {/* City Filter */}
              <div>
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:bg-white focus:border-blue-600 outline-hidden transition-all cursor-pointer"
                >
                  <option value="ALL">All Cities ({availableCities.length})</option>
                  {availableCities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Industry Filter */}
              <div>
                <select
                  value={industryFilter}
                  onChange={(e) => setIndustryFilter(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:bg-white focus:border-blue-600 outline-hidden transition-all cursor-pointer"
                >
                  <option value="ALL">All Industries</option>
                  {availableIndustries.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:bg-white focus:border-blue-600 outline-hidden transition-all cursor-pointer"
                >
                  <option value="SCORE_DESC">Score: Highest First</option>
                  <option value="INVESTMENT_DESC">Investment: High to Low</option>
                  <option value="INVESTMENT_ASC">Investment: Low to High</option>
                  <option value="TIMELINE">Timeline (Readiness)</option>
                  <option value="NAME">Name (A–Z)</option>
                </select>
              </div>
            </div>

            {/* Sub-Filters: Min Score, Verified Only, PIN filter */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                {/* Score Filter Pills */}
                <span className="text-slate-400 font-bold uppercase text-[10px]">Min Match:</span>
                <div className="flex items-center gap-1">
                  {[0, 60, 75, 90].map((score) => (
                    <button
                      key={score}
                      onClick={() => setMinScoreFilter(score)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                        minScoreFilter === score
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {score === 0 ? 'All' : `${score}%+`}
                    </button>
                  ))}
                </div>

                <span className="text-slate-300">|</span>

                {/* Verified Only Toggle */}
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 select-none">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>Verified Seekers Only</span>
                </label>

                <span className="text-slate-300">|</span>

                {/* PIN Code Search */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">PIN Filter:</span>
                  <input
                    type="text"
                    maxLength={6}
                    value={pinFilter}
                    onChange={(e) => setPinFilter(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 560"
                    className="w-24 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
                  />
                </div>
              </div>

              {/* Clear Filters Button */}
              {(searchTerm || cityFilter !== 'ALL' || industryFilter !== 'ALL' || timelineFilter !== 'ALL' || minScoreFilter > 0 || pinFilter || !verifiedOnly) && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={13} /> Reset Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results List */}
        {filteredAndSortedSeekers.length > 0 ? (
          <div className="space-y-4">
            {filteredAndSortedSeekers.map(({ seeker, breakdown, isUnlocked, isSaved }) => (
              <SeekerMatchCard
                key={seeker.id}
                seeker={seeker}
                brand={currentBrand}
                breakdown={breakdown}
                isUnlocked={isUnlocked}
                isSaved={isSaved}
                onOpenBreakdown={() => setSelectedSeekerForModal({ seeker, breakdown })}
                onOpenUnlockModal={() => setUnlockModalSeeker(seeker)}
                onToggleSave={() => toggleSaveLeadForBrand(currentBrand.id, seeker.id)}
                onOpenMeetingModal={() => setMeetingModalSeeker(seeker)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 font-heading">
              No franchise seekers found matching your current filter criteria
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Try adjusting your city filter, expanding your investment range, or relaxing the minimum match score to view more potential franchisee candidates.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-blue-700 transition-all cursor-pointer"
              >
                Reset Search Filters
              </button>
              <button
                onClick={() => setIsFormOpen(true)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
              >
                Edit Brand Requirements
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 100-Point Audit Breakdown Modal */}
      {selectedSeekerForModal && (
        <SeekerMatchModal
          isOpen={Boolean(selectedSeekerForModal)}
          onClose={() => setSelectedSeekerForModal(null)}
          seeker={selectedSeekerForModal.seeker}
          brand={currentBrand}
          breakdown={selectedSeekerForModal.breakdown}
          isUnlocked={Boolean(currentBrand.unlockedLeads?.includes(selectedSeekerForModal.seeker.id))}
          isSaved={Boolean(currentBrand.savedLeads?.includes(selectedSeekerForModal.seeker.id))}
          onUnlock={() => {
            setUnlockModalSeeker(selectedSeekerForModal.seeker);
            setSelectedSeekerForModal(null);
          }}
          onToggleSave={() => toggleSaveLeadForBrand(currentBrand.id, selectedSeekerForModal.seeker.id)}
          onScheduleMeeting={() => {
            setMeetingModalSeeker(selectedSeekerForModal.seeker);
            setSelectedSeekerForModal(null);
          }}
        />
      )}

      {/* Unlock Confirmation Modal */}
      {unlockModalSeeker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-200 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Unlock size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 font-heading">
                    Unlock Contact Details
                  </h3>
                  <p className="text-xs text-slate-500">Contact-lock compliance protection</p>
                </div>
              </div>
              <button 
                onClick={() => setUnlockModalSeeker(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs text-slate-700">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-500">Candidate:</span>
                <span className="font-black text-slate-900">{unlockModalSeeker.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-500">Location:</span>
                <span className="font-semibold text-slate-800">{unlockModalSeeker.city}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-500">Investment Budget:</span>
                <span className="font-semibold text-emerald-700">₹{unlockModalSeeker.investment} Lakhs</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-500">Credit Cost:</span>
                <span className="font-black text-blue-600">1 Lead Credit</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-500">Your Remaining Balance:</span>
                <span className="font-bold text-slate-900">{remainingCredits} Credits</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Unlocking will instantly reveal verified phone, email, and direct WhatsApp channel, and automatically add this candidate to your CRM Pipeline.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setUnlockModalSeeker(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmUnlock(unlockModalSeeker.id)}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Unlock size={14} />
                <span>Confirm Unlock (1 Credit)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Discovery Meeting Modal */}
      {meetingModalSeeker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-fadeIn">
          <form onSubmit={handleScheduleSubmit} className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Calendar size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 font-heading">
                    Schedule Discovery Session
                  </h3>
                  <p className="text-xs text-slate-500">With {meetingModalSeeker.name}</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setMeetingModalSeeker(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Select Meeting Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-blue-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Discussion Agenda / Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={meetingNotes}
                  onChange={(e) => setMeetingNotes(e.target.value)}
                  placeholder="e.g. Discuss territory availability in Bangalore, unit economics, and site fit-out schedule..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-blue-600 outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setMeetingModalSeeker(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Calendar size={14} />
                <span>Confirm Meeting</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
