import React, { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { BrandHeroCarousel } from '../../components/brand/BrandHeroCarousel';
import { 
  Users, Unlock, Calendar, Star, Sparkles, TrendingUp, Search, 
  ArrowRight, CheckCircle2, Clock, MapPin, Briefcase, IndianRupee,
  ShieldCheck, BarChart2, Bell, ExternalLink, Bookmark, SlidersHorizontal
} from 'lucide-react';
import { calculateBrandSeekerMatch, MatchScoreBreakdown, getMatchScoreColor } from '../../utils/SmartMatchEngine';
import SeekerMatchModal from '../../components/brand/SeekerMatchModal';
import { FranchiseSeeker } from '../../types';

export default function BrandDashboard() {
  const { user } = useAuth();
  const { seekers, brands, subscriptions, meetings, crmNotes, toggleSaveLeadForBrand, unlockLead, updateBrand } = useData();

  const [selectedSeekerForModal, setSelectedSeekerForModal] = useState<{
    seeker: FranchiseSeeker;
    breakdown: MatchScoreBreakdown;
  } | null>(null);

  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [gstin, setGstin] = useState('');
  const [mcaCin, setMcaCin] = useState('');
  const [trademarkNumber, setTrademarkNumber] = useState('');
  const [isSubmittingVerification, setIsSubmittingVerification] = useState(false);

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

  // Unlocked seekers for this brand
  const unlockedSeekers = seekers.filter(s => currentBrand.unlockedLeads?.includes(s.id));
  
  // High match seekers not yet unlocked with 100-point engine
  const topMatches = seekers
    .filter(s => s.verified && !currentBrand.unlockedLeads?.includes(s.id))
    .map(s => {
      const breakdown = calculateBrandSeekerMatch(currentBrand, s);
      return {
        ...s,
        breakdown,
        matchScore: breakdown.totalScore
      };
    })
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (b.matchScore || 0) - (a.matchScore || 0);
    })
    .slice(0, 3);

  // Meetings for this brand
  const brandMeetings = meetings.filter(m => m.brandId === currentBrand.id);
  const upcomingMeetings = brandMeetings.filter(m => m.status === 'CONFIRMED' || m.status === 'PENDING');

  const savedCount = currentBrand.savedLeads?.length || 0;

  const applicationStatus = currentBrand.applicationStatus || (currentBrand.verified ? 'APPROVED' : 'PENDING_REVIEW');
  const rejectionReason = currentBrand.rejectionReason;

  return (
    <div className="w-full bg-[#FAFCFF] min-h-screen text-slate-900 animate-fadeIn">
      {/* Existing Brand Verification Recommendation Banner */}
      {currentBrand.brandOrigin === 'existing' && applicationStatus === 'APPROVED' && (
        <div className="bg-blue-600 text-white px-6 py-4 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-700 rounded-xl">
              <Sparkles size={20} className="text-blue-100 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-blue-100">Verification Recommended</div>
              <p className="text-sm font-bold">
                Your brand is already listed on BRIZX INDIA. To become a verified brand and unlock verified-brand benefits, please complete the verification/approval process.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsVerifyModalOpen(true)}
            className="px-4 py-2 bg-white text-blue-900 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-blue-100 transition-all shrink-0 cursor-pointer"
          >
            GET VERIFIED
          </button>
        </div>
      )}

      {/* Profile Application Status Banner */}
      {(applicationStatus === 'PENDING_REVIEW' || applicationStatus === 'UNDER_REVIEW') && (
        <div className="bg-amber-500 text-white px-6 py-4 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-600/50 rounded-xl">
              <ShieldCheck size={20} className="text-amber-100" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-amber-100">Verification In Progress</div>
              <p className="text-sm font-bold">
                Your brand profile has been submitted successfully and is currently under verification by the BrizX India team.
              </p>
            </div>
          </div>
          <Link 
            to="/brand/profile"
            className="px-4 py-2 bg-white text-amber-900 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-amber-100 transition-all shrink-0"
          >
            View Submitted Application
          </Link>
        </div>
      )}

      {applicationStatus === 'REJECTED' && (
        <div className="bg-rose-600 text-white px-6 py-4 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-700 rounded-xl">
              <ShieldCheck size={20} className="text-rose-100" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-rose-200">Application Status: Action Required</div>
              <p className="text-sm font-bold">
                Your brand profile needs updates: {rejectionReason || 'Please review your uploaded documents and details.'}
              </p>
            </div>
          </div>
          <Link 
            to="/register"
            className="px-4 py-2 bg-white text-rose-900 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-rose-100 transition-all shrink-0"
          >
            Update & Re-submit Brand Profile
          </Link>
        </div>
      )}

      {applicationStatus === 'DRAFT' && (
        <div className="bg-blue-600 text-white px-6 py-4 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-700 rounded-xl">
              <Clock size={20} className="text-blue-100" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-blue-200">Registration Status: DRAFT ({currentBrand.completionPercentage || 50}% Complete)</div>
              <p className="text-sm font-bold">
                Your brand registration application is saved as a draft. Complete remaining sections to submit for review.
              </p>
            </div>
          </div>
          <Link 
            to="/register"
            className="px-4 py-2 bg-white text-blue-900 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-blue-100 transition-all shrink-0"
          >
            Resume Brand Registration
          </Link>
        </div>
      )}

      {/* 16:9 Aspect Ratio Edge-to-Edge Hero Brand Showcase */}
      <BrandHeroCarousel
        currentBrandName={currentBrand.brandName || 'Verified Franchise Partner'}
        verifiedSeekersCount={seekers.length}
        unlocksRemaining={currentSub?.unlocksRemaining || 0}
        autoPlayInterval={5000}
      />

      {/* Main Body Content with Spacing and Layout */}
      <div className="w-full p-4 sm:p-6 md:p-8 space-y-8 max-w-7xl mx-auto">

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl text-blue-600 flex items-center justify-center">
              <Unlock size={22} />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-green-50 text-green-700 rounded-lg border border-green-100 flex items-center gap-1">
              <TrendingUp size={12} /> Active
            </span>
          </div>
          <div className="text-3xl font-black text-indigo-950 font-heading mb-1">{unlockedSeekers.length}</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Leads Unlocked</div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-medium text-slate-500 flex justify-between">
            <span>Saved Bookmarks:</span>
            <strong className="text-slate-800 font-bold">{savedCount}</strong>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl text-blue-600 flex items-center justify-center">
              <Star size={22} />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
              {currentBrand.subscriptionTier}
            </span>
          </div>
          <div className="text-3xl font-black text-indigo-950 font-heading mb-1">{currentSub?.unlocksRemaining || 0}</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unlocks Remaining</div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-medium text-slate-500 flex justify-between">
            <span>Plan Expiry:</span>
            <strong className="text-slate-800 font-bold">In 15 Days</strong>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl text-blue-600 flex items-center justify-center">
              <Calendar size={22} />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
              Scheduled
            </span>
          </div>
          <div className="text-3xl font-black text-indigo-950 font-heading mb-1">{upcomingMeetings.length}</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upcoming Meetings</div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-medium text-slate-500 flex justify-between">
            <span>Next Meeting:</span>
            <strong className="text-slate-800 font-bold">{upcomingMeetings[0]?.date || 'None'}</strong>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl text-emerald-600 flex items-center justify-center">
              <BarChart2 size={22} />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
              High ROI
            </span>
          </div>
          <div className="text-3xl font-black text-indigo-950 font-heading mb-1">94%</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Smart Match Precision</div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-medium text-slate-500 flex justify-between">
            <span>Avg Response Rate:</span>
            <strong className="text-emerald-600 font-bold">88% Contacted</strong>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Smart Match Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-indigo-950 font-heading flex items-center gap-2">
                <Sparkles className="text-blue-500" size={20} /> Highly Compatible Franchise Seekers
              </h2>
              <p className="text-xs text-slate-500 font-medium">Ranked dynamically via BrizX 100-Point Scoring (City, Investment, Industry, Background & Timeline).</p>
            </div>
            <Link to="/search" className="text-xs font-bold text-blue-700 hover:text-blue-600 flex items-center gap-1 transition-colors">
              Search All Seekers <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-4">
            {topMatches.map(seeker => {
              const scoreTheme = getMatchScoreColor(seeker.matchScore);
              return (
                <div key={seeker.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Visual Match Gauge */}
                      <button
                        onClick={() => setSelectedSeekerForModal({ seeker, breakdown: seeker.breakdown })}
                        className={`w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center shrink-0 cursor-pointer hover:scale-105 transition-transform ${scoreTheme.bg}`}
                        title="Click to view 100-point match breakdown"
                      >
                        <span className="text-lg font-black">{seeker.matchScore}%</span>
                        <span className="text-[8px] font-bold uppercase">Match</span>
                      </button>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-base text-blue-700">{seeker.name}</h3>
                          {seeker.verified && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold uppercase flex items-center gap-0.5">
                              <ShieldCheck size={11} /> Verified
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${scoreTheme.bg}`}>
                            {seeker.breakdown.fitLabel}
                          </span>
                        </div>
                        <div className="text-xs font-medium text-slate-500 flex flex-wrap items-center gap-3 mt-1">
                          <span className="flex items-center gap-1"><MapPin size={12} className="text-blue-600"/> {seeker.city}</span>
                          <span className="flex items-center gap-1"><Briefcase size={12} className="text-indigo-600"/> {seeker.industry}</span>
                          <span className="flex items-center gap-1"><IndianRupee size={12} className="text-emerald-600"/> ₹{seeker.investment} Lakhs</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">
                          {seeker.experience || seeker.businessBackground}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button 
                        onClick={() => setSelectedSeekerForModal({ seeker, breakdown: seeker.breakdown })}
                        className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Breakdown
                      </button>
                      <button 
                        onClick={() => toggleSaveLeadForBrand(currentBrand.id, seeker.id)}
                        className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${currentBrand.savedLeads?.includes(seeker.id) ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-blue-700'}`}
                        title="Save Lead"
                      >
                        <Bookmark size={16} className={currentBrand.savedLeads?.includes(seeker.id) ? 'fill-blue-600' : ''} />
                      </button>
                      <button 
                        onClick={() => unlockLead(currentBrand.id, seeker.id)}
                        className="flex-1 sm:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Unlock size={14} /> Unlock
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Unlocked Leads CRM Quick Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs mt-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-black text-indigo-950 font-heading">Recent Unlocked Leads in CRM</h3>
                <p className="text-xs text-slate-500">Access verified contact information and pipeline notes directly.</p>
              </div>
              <Link to="/brand/crm" className="text-xs font-bold text-blue-700 hover:text-blue-600 flex items-center gap-1">
                Open CRM Pipeline <ArrowRight size={14} />
              </Link>
            </div>

            {unlockedSeekers.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-500 font-medium">No leads unlocked yet. Use your credits in Smart Match Search.</p>
                <Link to="/search" className="mt-2 inline-block text-xs font-bold text-blue-600 hover:underline">
                  Find Franchise Seekers →
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-4">Seeker Name</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Investment</th>
                      <th className="py-3 px-4">Contact Info</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-800">
                    {unlockedSeekers.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-blue-700 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center overflow-hidden shrink-0">
                            {s.avatar ? (
                              <img src={s.avatar} alt={s.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              s.name.charAt(0)
                            )}
                          </div>
                          {s.name}
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-xs">{s.city}</td>
                        <td className="py-3 px-4 text-xs font-bold">₹{s.investment} Lakhs</td>
                        <td className="py-3 px-4 text-xs text-slate-600">
                          <div>{s.phone}</div>
                          <div className="text-[10px] text-slate-400">{s.email}</div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link to="/brand/crm" className="text-xs font-bold text-blue-600 hover:text-blue-800">
                            Manage in CRM →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Profile Status, Verification & Quick Tools */}
        <div className="space-y-6">
          {/* Brand Profile Quick Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 overflow-hidden flex items-center justify-center shrink-0">
                {currentBrand.logo ? (
                  <img src={currentBrand.logo} alt={currentBrand.brandName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-xl font-black text-blue-600">{currentBrand.brandName?.charAt(0)}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-black text-base text-indigo-950 truncate">{currentBrand.brandName}</h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <ShieldCheck size={13} /> Verified Brand
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl text-xs space-y-1.5 border border-slate-200/80">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Industry:</span>
                <strong className="text-slate-800">{currentBrand.industry}</strong>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Investment Req:</span>
                <strong className="text-slate-800">₹{currentBrand.investmentRequired?.min}-{currentBrand.investmentRequired?.max} Lakhs</strong>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Active Target Cities:</span>
                <strong className="text-slate-800">{currentBrand.cityTargets?.length || 0} Cities</strong>
              </div>
            </div>

            <Link
              to="/brand/profile"
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold text-center block transition-colors"
            >
              Edit Brand Profile & Targets
            </Link>
          </div>

          {/* Quick Navigation / Action Hub */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
              Brand Matching Tools
            </h4>

            <Link
              to="/search"
              className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/70 hover:bg-blue-50 border border-blue-100 text-blue-900 transition-colors group"
            >
              <div className="flex items-center gap-3 text-xs font-bold">
                <Search size={16} className="text-blue-600" />
                <span>Find Franchise Seekers</span>
              </div>
              <ArrowRight size={14} className="text-blue-600 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to="/brand/crm"
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition-colors group"
            >
              <div className="flex items-center gap-3 text-xs font-bold">
                <Users size={16} className="text-slate-600" />
                <span>Lead Pipeline & CRM</span>
              </div>
              <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to="/brand/subscription"
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition-colors group"
            >
              <div className="flex items-center gap-3 text-xs font-bold">
                <Star size={16} className="text-amber-500" />
                <span>Credits & Subscription</span>
              </div>
              <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
      </div>

      {/* 100-Point Modal */}
      {selectedSeekerForModal && (
        <SeekerMatchModal
          isOpen={!!selectedSeekerForModal}
          onClose={() => setSelectedSeekerForModal(null)}
          seeker={selectedSeekerForModal.seeker}
          brand={currentBrand}
          breakdown={selectedSeekerForModal.breakdown}
          isUnlocked={currentBrand.unlockedLeads?.includes(selectedSeekerForModal.seeker.id) || false}
          isSaved={currentBrand.savedLeads?.includes(selectedSeekerForModal.seeker.id) || false}
          onUnlock={() => {
            unlockLead(currentBrand.id, selectedSeekerForModal.seeker.id);
            setSelectedSeekerForModal(null);
          }}
          onToggleSave={() => toggleSaveLeadForBrand(currentBrand.id, selectedSeekerForModal.seeker.id)}
        />
      )}

      {/* Existing Brand Verification Modal */}
      {isVerifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button 
              type="button"
              onClick={() => setIsVerifyModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-blue-100 text-blue-700 rounded-2xl">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-indigo-950 font-heading">Submit Brand Verification</h3>
                <p className="text-xs text-slate-500 font-semibold">Verify your brand to unlock verified-brand benefits & trust badges.</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">GSTIN (Optional but Recommended)</label>
                <input 
                  type="text" 
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  placeholder="e.g. 29AABCU1234F1Z5"
                  maxLength={15}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500"
                />
                {gstin && gstin.length !== 15 && (
                  <p className="text-[10px] text-amber-600 mt-1 font-bold">GSTIN should be 15 characters long.</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">MCA Corporate Identification Number (CIN)</label>
                <input 
                  type="text" 
                  value={mcaCin}
                  onChange={(e) => setMcaCin(e.target.value.toUpperCase())}
                  placeholder="e.g. U55101KA2021PTC145678"
                  maxLength={21}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500"
                />
                {mcaCin && mcaCin.length !== 21 && (
                  <p className="text-[10px] text-amber-600 mt-1 font-bold">CIN should be 21 characters long.</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Trademark Registration Number</label>
                <input 
                  type="text" 
                  value={trademarkNumber}
                  onChange={(e) => setTrademarkNumber(e.target.value)}
                  placeholder="e.g. 4829302"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500"
                />
              </div>

              <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                <p className="text-xs font-bold text-slate-700 mb-2">Required Document Attachments</p>
                <div className="space-y-2 text-[11px] text-slate-500">
                  <p className="flex items-center gap-1.5 font-semibold text-slate-600">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    Incorporation / Business Registration Certificate
                  </p>
                  <p className="flex items-center gap-1.5 font-semibold text-slate-600">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    GST Certificate / Document
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button 
                type="button"
                onClick={() => setIsVerifyModalOpen(false)}
                className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                disabled={isSubmittingVerification}
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  if (!mcaCin || mcaCin.length !== 21) {
                    alert('Please enter a valid 21-character MCA CIN.');
                    return;
                  }
                  setIsSubmittingVerification(true);
                  try {
                    await updateBrand(currentBrand.id, {
                      brandOrigin: 'new_registration',
                      applicationStatus: 'PENDING_REVIEW',
                      gstin,
                      mcaCin,
                      trademarkNumber,
                      submittedAt: new Date().toISOString()
                    });
                    setIsVerifyModalOpen(false);
                    alert('Verification details submitted successfully! Your application is now in review.');
                  } catch (e) {
                    console.error(e);
                    alert('Failed to submit verification details. Please try again.');
                  } finally {
                    setIsSubmittingVerification(false);
                  }
                }}
                disabled={isSubmittingVerification || !mcaCin}
                className="px-6 py-2.5 bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:bg-blue-800 disabled:opacity-50"
              >
                {isSubmittingVerification ? 'Submitting...' : 'Submit Details'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
