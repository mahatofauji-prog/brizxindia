import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  Filter, MapPin, Briefcase, IndianRupee, Clock, Search, ChevronDown, 
  Lock, Unlock, Phone, Mail, Calendar as CalendarIcon, Bookmark, Sparkles, 
  CheckCircle2, AlertCircle, ArrowRight, RotateCcw, SlidersHorizontal, 
  ShieldCheck, UserCheck, HelpCircle, X
} from 'lucide-react';
import { FranchiseSeeker, Brand } from '../types';
import { 
  calculateBrandSeekerMatch, 
  MatchScoreBreakdown, 
  getMatchScoreColor 
} from '../utils/SmartMatchEngine';
import SeekerMatchCard from '../components/brand/SeekerMatchCard';
import SeekerMatchModal from '../components/brand/SeekerMatchModal';
import BrandSeekerRecommendations from '../components/brand/BrandSeekerRecommendations';

export default function SearchSeekers() {
  const { user } = useAuth();
  const { 
    seekers, 
    brands, 
    subscriptions, 
    unlockLead, 
    toggleSaveLeadForBrand,
    scheduleMeeting
  } = useData();

  // Current active brand
  const currentBrand = brands.find(b => b.id === user?.id || (user?.email && b.email === user?.email));
  if (!currentBrand) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Complete your Brand Profile</h2>
        <p className="text-slate-500">Please set up your brand profile to access this page.</p>
      </div>
    );
  }

  const currentSub = subscriptions.find(s => s.brandId === currentBrand.id);
  const remainingCredits = currentSub?.unlocksRemaining ?? 0;

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [timelineFilter, setTimelineFilter] = useState('');
  const [budgetTierFilter, setBudgetTierFilter] = useState('');
  const [backgroundFilter, setBackgroundFilter] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [minScoreFilter, setMinScoreFilter] = useState(0);
  const [sortBy, setSortBy] = useState<'MATCH' | 'INVESTMENT_DESC' | 'INVESTMENT_ASC' | 'TIMELINE' | 'NAME'>('MATCH');

  // Modals
  const [breakdownModalSeeker, setBreakdownModalSeeker] = useState<{
    seeker: FranchiseSeeker;
    breakdown: MatchScoreBreakdown;
  } | null>(null);

  const [unlockModalSeekerId, setUnlockModalSeekerId] = useState<string | null>(null);
  const [unlockFeedback, setUnlockFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Meeting Schedule Modal
  const [meetingSeeker, setMeetingSeeker] = useState<FranchiseSeeker | null>(null);
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('11:00 AM');
  const [meetingNotes, setMeetingNotes] = useState('');
  const [meetingScheduledSuccess, setMeetingScheduledSuccess] = useState(false);

  // Calculate scores for all seekers against currentBrand
  const scoredSeekers = useMemo(() => {
    return seekers.map(seeker => {
      const breakdown = calculateBrandSeekerMatch(currentBrand, seeker);
      const isUnlocked = currentBrand.unlockedLeads?.includes(seeker.id) || false;
      const isSaved = currentBrand.savedLeads?.includes(seeker.id) || false;

      return {
        ...seeker,
        breakdown,
        matchScore: breakdown.totalScore,
        isUnlocked,
        isSaved
      };
    });
  }, [seekers, currentBrand]);

  // Apply Precision Filters
  const filteredSeekers = useMemo(() => {
    return scoredSeekers.filter(seeker => {
      // 1. Verification filter
      if (verifiedOnly && !seeker.verified) return false;

      // 2. Industry filter
      if (industryFilter && seeker.industry !== industryFilter && !seeker.preferredIndustries?.includes(industryFilter)) {
        return false;
      }

      // 3. City filter
      if (cityFilter && seeker.city !== cityFilter && !seeker.preferredCities?.includes(cityFilter)) {
        return false;
      }

      // 4. Timeline filter
      if (timelineFilter) {
        const sTime = (seeker.timeline || '').toLowerCase();
        if (timelineFilter === 'Immediate' && !sTime.includes('immediate')) return false;
        if (timelineFilter === '1-3 Months' && !sTime.includes('1-3') && !sTime.includes('1 month')) return false;
        if (timelineFilter === '3-6 Months' && !sTime.includes('3-6')) return false;
      }

      // 5. Budget Tier filter
      if (budgetTierFilter) {
        const inv = seeker.investment || 0;
        if (budgetTierFilter === 'UNDER_15' && inv > 15) return false;
        if (budgetTierFilter === '15_30' && (inv < 15 || inv > 30)) return false;
        if (budgetTierFilter === '30_50' && (inv < 30 || inv > 50)) return false;
        if (budgetTierFilter === '50_PLUS' && inv < 50) return false;
      }

      // 6. Background Filter
      if (backgroundFilter) {
        const text = `${seeker.experience || ''} ${seeker.businessBackground || ''}`.toLowerCase();
        if (!text.includes(backgroundFilter.toLowerCase())) return false;
      }

      // 7. Minimum Score filter
      if ((seeker.matchScore || 0) < minScoreFilter) return false;

      // 8. Search keyword
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = seeker.name.toLowerCase().includes(q);
        const matchesCity = seeker.city.toLowerCase().includes(q);
        const matchesIndustry = seeker.industry.toLowerCase().includes(q);
        const matchesExp = (seeker.experience || '').toLowerCase().includes(q) || (seeker.businessBackground || '').toLowerCase().includes(q);
        if (!matchesName && !matchesCity && !matchesIndustry && !matchesExp) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'MATCH') {
        // Featured first then score
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (b.matchScore || 0) - (a.matchScore || 0);
      }
      if (sortBy === 'INVESTMENT_DESC') return (b.investment || 0) - (a.investment || 0);
      if (sortBy === 'INVESTMENT_ASC') return (a.investment || 0) - (b.investment || 0);
      if (sortBy === 'TIMELINE') return (a.timeline || '').localeCompare(b.timeline || '');
      if (sortBy === 'NAME') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [
    scoredSeekers, 
    verifiedOnly, 
    industryFilter, 
    cityFilter, 
    timelineFilter, 
    budgetTierFilter, 
    backgroundFilter, 
    minScoreFilter, 
    searchTerm, 
    sortBy
  ]);

  // Handle Unlocking Lead
  const handleConfirmUnlock = (seekerId: string) => {
    if (remainingCredits <= 0) {
      setUnlockFeedback({
        type: 'error',
        message: 'Insufficient unlock credits. Please upgrade your subscription wallet to unlock contact info.'
      });
      setUnlockModalSeekerId(null);
      return;
    }

    unlockLead(currentBrand.id, seekerId);
    const seeker = seekers.find(s => s.id === seekerId);
    setUnlockFeedback({
      type: 'success',
      message: `Direct contact for ${seeker?.name || 'Candidate'} unlocked! Automatically synchronized with your Brand CRM Pipeline.`
    });
    setUnlockModalSeekerId(null);
    setTimeout(() => setUnlockFeedback(null), 6000);
  };

  // Handle Scheduling Meeting
  const handleScheduleMeetingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingSeeker || !meetingDate) return;

    scheduleMeeting({
      brandId: currentBrand.id,
      brandName: currentBrand.brandName,
      seekerId: meetingSeeker.id,
      date: meetingDate,
      time: meetingTime,
      status: 'CONFIRMED',
      location: 'Google Meet / BrizX Virtual Discovery Room',
      notes: meetingNotes || `1-on-1 Franchise Discovery Call with ${meetingSeeker.name}`
    });

    setMeetingScheduledSuccess(true);
    setTimeout(() => {
      setMeetingScheduledSuccess(false);
      setMeetingSeeker(null);
      setMeetingDate('');
      setMeetingNotes('');
    }, 2500);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setIndustryFilter('');
    setCityFilter('');
    setTimelineFilter('');
    setBudgetTierFilter('');
    setBackgroundFilter('');
    setVerifiedOnly(true);
    setMinScoreFilter(0);
    setSortBy('MATCH');
  };

  return (
    <div className="flex-1 flex flex-col space-y-6">
      {/* Top Banner with Brand Context & Credit Balance */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles size={14} className="text-blue-600" /> BrizX Two-Way Matching Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-indigo-950 font-heading">
            Find Franchise Seekers
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Discover and connect with high-intent franchise entrepreneurs ranked for <strong>{currentBrand.brandName}</strong> using 100-point algorithm verification.
          </p>
        </div>

        {/* Credit Balance & Top Up Box */}
        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 w-full lg:w-auto justify-between lg:justify-start shrink-0">
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Lead Unlock Balance
            </div>
            <div className="text-xl font-black text-blue-600 font-heading">
              {remainingCredits} {remainingCredits === 1 ? 'Credit' : 'Credits'}
            </div>
          </div>
          <Link 
            to="/brand/subscription" 
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm"
          >
            Top Up Credits
          </Link>
        </div>
      </div>

      {/* AI Recommendations Section for the Brand */}
      <BrandSeekerRecommendations
        brand={currentBrand}
        seekers={seekers}
        unlockedSeekerIds={currentBrand.unlockedLeads || []}
        savedSeekerIds={currentBrand.savedLeads || []}
        onUnlockSeeker={(id) => setUnlockModalSeekerId(id)}
        onToggleSave={(id) => toggleSaveLeadForBrand(currentBrand.id, id)}
      />

      {/* Feedback Alert */}
      {unlockFeedback && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in ${
          unlockFeedback.type === 'success' 
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-2">
            {unlockFeedback.type === 'success' ? (
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-rose-600 shrink-0" />
            )}
            <span>{unlockFeedback.message}</span>
          </div>
          <button 
            onClick={() => setUnlockFeedback(null)} 
            className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Search & Results Layout */}
      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
        {/* Filter Sidebar */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs sticky top-24 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-blue-700 uppercase tracking-wider text-xs flex items-center gap-2">
                <SlidersHorizontal size={16} /> Precision Match Filters
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-slate-400 hover:text-blue-600 flex items-center gap-1 cursor-pointer transition-colors"
                title="Reset all filters"
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            <div className="space-y-4">
              {/* Search input */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                  Keyword Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search name, experience, skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 transition-colors"
                  />
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>

              {/* Industry Dropdown */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                  Target Industry
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                    value={industryFilter}
                    onChange={(e) => setIndustryFilter(e.target.value)}
                  >
                    <option value="">All Industries ({currentBrand.industry} matches prioritized)</option>
                    <option value="Food & Beverages">Food & Beverages</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Fitness & Wellness">Fitness & Wellness</option>
                    <option value="Automobile & EV">Automobile & EV</option>
                    <option value="Home & Building Automation">Home & Building Automation</option>
                    <option value="Retail">Retail</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* City Filter */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                  City / Location
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                  >
                    <option value="">All Cities</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi NCR</option>
                    <option value="Pune">Pune</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Kolkata">Kolkata</option>
                    <option value="Jaipur">Jaipur</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Budget Range Tier */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                  Investment Capacity
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                    value={budgetTierFilter}
                    onChange={(e) => setBudgetTierFilter(e.target.value)}
                  >
                    <option value="">Any Investment Capacity</option>
                    <option value="UNDER_15">Under ₹15 Lakhs</option>
                    <option value="15_30">₹15 - ₹30 Lakhs</option>
                    <option value="30_50">₹30 - ₹50 Lakhs</option>
                    <option value="50_PLUS">₹50+ Lakhs (Flagship / Master)</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Timeline Filter */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                  Starting Timeline
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                    value={timelineFilter}
                    onChange={(e) => setTimelineFilter(e.target.value)}
                  >
                    <option value="">Any Timeline</option>
                    <option value="Immediate">Immediate Launch</option>
                    <option value="1-3 Months">1 - 3 Months</option>
                    <option value="3-6 Months">3 - 6 Months</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Background Keywords */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                  Background Profile
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                    value={backgroundFilter}
                    onChange={(e) => setBackgroundFilter(e.target.value)}
                  >
                    <option value="">All Professional Backgrounds</option>
                    <option value="Director">Senior Management / Director</option>
                    <option value="Tech">Tech / Product Management</option>
                    <option value="Pharma">Healthcare / Pharma Distribution</option>
                    <option value="Retail">Retail Store Operator / Distributor</option>
                    <option value="Developer">Real Estate / Infrastructure</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Minimum Match Score Slider */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    Min Smart Match Score
                  </label>
                  <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {minScoreFilter}%+
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="5"
                  value={minScoreFilter}
                  onChange={(e) => setMinScoreFilter(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Verified Only Toggle */}
              <div className="pt-2 flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span className="text-xs font-bold text-slate-700">Verified Only</span>
                </div>
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 cursor-pointer rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Main Column */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Results Summary & Sorting Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-black text-base text-slate-900 font-heading">
                {filteredSeekers.length} {filteredSeekers.length === 1 ? 'Seeker Lead' : 'Seeker Leads'} Found
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                for {currentBrand.brandName}
              </span>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="MATCH">Highest Smart Match</option>
                <option value="INVESTMENT_DESC">Investment (High to Low)</option>
                <option value="INVESTMENT_ASC">Investment (Low to High)</option>
                <option value="TIMELINE">Timeline Readiness</option>
                <option value="NAME">Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Seeker List Cards */}
          <div className="space-y-4">
            {filteredSeekers.map(seeker => (
              <SeekerMatchCard
                key={seeker.id}
                seeker={seeker}
                brand={currentBrand}
                breakdown={seeker.breakdown}
                isUnlocked={seeker.isUnlocked}
                isSaved={seeker.isSaved}
                onOpenBreakdown={() => setBreakdownModalSeeker({ seeker, breakdown: seeker.breakdown })}
                onOpenUnlockModal={() => setUnlockModalSeekerId(seeker.id)}
                onToggleSave={() => toggleSaveLeadForBrand(currentBrand.id, seeker.id)}
                onOpenMeetingModal={() => setMeetingSeeker(seeker)}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredSeekers.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                <Search size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black text-indigo-950 font-heading">
                  No matching franchise seekers found
                </h3>
                <p className="text-slate-500 text-xs max-w-md mx-auto mt-1">
                  Try broadening your location, industry, or investment criteria to discover more registered entrepreneurs.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <RotateCcw size={14} />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 100-Point Match Breakdown Modal */}
      {breakdownModalSeeker && (
        <SeekerMatchModal
          isOpen={!!breakdownModalSeeker}
          onClose={() => setBreakdownModalSeeker(null)}
          seeker={breakdownModalSeeker.seeker}
          brand={currentBrand}
          breakdown={breakdownModalSeeker.breakdown}
          isUnlocked={currentBrand.unlockedLeads?.includes(breakdownModalSeeker.seeker.id) || false}
          isSaved={currentBrand.savedLeads?.includes(breakdownModalSeeker.seeker.id) || false}
          onUnlock={() => {
            setUnlockModalSeekerId(breakdownModalSeeker.seeker.id);
            setBreakdownModalSeeker(null);
          }}
          onToggleSave={() => toggleSaveLeadForBrand(currentBrand.id, breakdownModalSeeker.seeker.id)}
          onScheduleMeeting={() => {
            setMeetingSeeker(breakdownModalSeeker.seeker);
            setBreakdownModalSeeker(null);
          }}
        />
      )}

      {/* Unlock Confirmation Modal */}
      {unlockModalSeekerId && (
        <div className="fixed inset-0 bg-indigo-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-7 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 border border-blue-100">
              <Unlock size={24} />
            </div>

            <h3 className="text-xl font-black text-indigo-950 font-heading mb-1">
              Confirm Contact Unlock
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              You are unlocking the verified direct phone number, email address, and WhatsApp contact for{' '}
              <strong>{seekers.find(s => s.id === unlockModalSeekerId)?.name}</strong>.
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs mb-6">
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Available Credits:</span>
                <span className="font-bold text-slate-900">{remainingCredits} Credits</span>
              </div>
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Unlock Cost:</span>
                <span className="text-rose-600 font-bold">-1 Credit</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-indigo-950 text-sm">
                <span>Balance After Unlock:</span>
                <span className="text-blue-600 font-heading">{Math.max(0, remainingCredits - 1)} Credits</span>
              </div>
            </div>

            {remainingCredits <= 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold mb-4 flex items-center gap-2">
                <AlertCircle size={15} className="text-amber-600 shrink-0" />
                <span>You have 0 unlock credits remaining. Top up to continue.</span>
              </div>
            )}

            <div className="flex gap-3">
              <button 
                onClick={() => setUnlockModalSeekerId(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              {remainingCredits > 0 ? (
                <button 
                  onClick={() => handleConfirmUnlock(unlockModalSeekerId)}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-200 cursor-pointer"
                >
                  Confirm Unlock
                </button>
              ) : (
                <Link
                  to="/brand/subscription"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md text-center"
                >
                  Top Up Credits
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Schedule Meeting Modal */}
      {meetingSeeker && (
        <div className="fixed inset-0 bg-indigo-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-7 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-indigo-950 font-heading font-black text-lg">
                <CalendarIcon size={20} className="text-blue-600" />
                <span>Schedule Virtual Discovery Call</span>
              </div>
              <button
                onClick={() => setMeetingSeeker(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {meetingScheduledSuccess ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 size={40} className="text-emerald-600 mx-auto animate-bounce" />
                <h4 className="font-black text-lg text-slate-900">Discovery Call Scheduled!</h4>
                <p className="text-xs text-slate-500">
                  Virtual meeting invite and calendar link sent to {meetingSeeker.name}. Added to your Meetings calendar.
                </p>
              </div>
            ) : (
              <form onSubmit={handleScheduleMeetingSubmit} className="space-y-4">
                <p className="text-xs text-slate-600">
                  Set up a 1-on-1 franchise overview video meeting with <strong>{meetingSeeker.name}</strong>.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                      Meeting Date
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={meetingDate}
                      onChange={(e) => setMeetingDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                      Meeting Time
                    </label>
                    <select
                      value={meetingTime}
                      onChange={(e) => setMeetingTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:30 PM">03:30 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                    Agenda / Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g., Territory availability in Bangalore, unit economics review..."
                    value={meetingNotes}
                    onChange={(e) => setMeetingNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setMeetingSeeker(null)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    Send Invitation
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
