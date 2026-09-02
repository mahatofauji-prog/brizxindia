import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, Filter, Bookmark, Star, Calendar, ArrowRight, ShieldCheck, 
  MapPin, CheckCircle2, DollarSign, Building2, Sparkles, X, ChevronRight, Eye, Send
} from 'lucide-react';
import { calculateMatchScore } from '../../data/mockDb';
import { Brand } from '../../types';
import InvestmentRangeFilter from '../../components/InvestmentRangeFilter';
import { BrandConnectionModal } from '../../components/BrandConnectionModal';
import { BrandLogo } from '../../components/BrandLogo';
import { SeekerHero } from '../../components/seeker/SeekerHero';
import { seekerTheme } from '../../theme/seekerTheme';
import { SmartMatchForm } from '../../components/SmartMatchForm';
import { SmartMatchResults } from '../../components/SmartMatchResults';
import { SmartMatchInput, getSmartMatchScore } from '../../utils/SmartMatchEngine';

export default function SeekerBrowseBrands() {
  const { user } = useAuth();
  const { seekers, brands, toggleSaveBrand, scheduleMeeting } = useData();
  const navigate = useNavigate();

  const currentSeeker = seekers.find(s => s.id === user?.id) || seekers[0];
  const savedBrandIds = currentSeeker.savedBrandIds || [];

  const [searchTerm, setSearchTerm] = useState(() => sessionStorage.getItem('seeker_search_term') || '');
  const [selectedIndustry, setSelectedIndustry] = useState(() => sessionStorage.getItem('seeker_selected_industry') || 'ALL');
  const [selectedCity, setSelectedCity] = useState(() => sessionStorage.getItem('seeker_selected_city') || 'ALL');
  const [maxInvestment, setMaxInvestment] = useState<number | null>(() => {
    const val = sessionStorage.getItem('seeker_max_investment');
    return val ? Number(val) : null;
  });
  const [sortBy, setSortBy] = useState<'MATCH' | 'INVESTMENT_LOW' | 'INVESTMENT_HIGH' | 'OUTLETS'>(() => {
    return (sessionStorage.getItem('seeker_sort_by') as any) || 'MATCH';
  });

  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [connectModalBrand, setConnectModalBrand] = useState<Brand | null>(null);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetingBrand, setMeetingBrand] = useState<Brand | null>(null);
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('11:00 AM');
  const [meetingNotes, setMeetingNotes] = useState('');
  const [meetingSuccess, setMeetingSuccess] = useState(false);

  const [isSmartMatchOpen, setIsSmartMatchOpen] = useState(false);
  const [smartMatchResults, setSmartMatchResults] = useState<any[] | null>(null);

  const handleSmartMatchSearch = (input: SmartMatchInput) => {
    const scoredBrands = brands.map(brand => {
      const breakdown = getSmartMatchScore(brand, input);
      return {
        ...brand,
        matchBreakdown: breakdown,
        smartMatchScore: breakdown.totalScore
      };
    });
    
    scoredBrands.sort((a, b) => b.smartMatchScore - a.smartMatchScore);
    setSmartMatchResults(scoredBrands);
  };

  // Sync state to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('seeker_search_term', searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    sessionStorage.setItem('seeker_selected_industry', selectedIndustry);
  }, [selectedIndustry]);

  useEffect(() => {
    sessionStorage.setItem('seeker_selected_city', selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    if (maxInvestment === null) {
      sessionStorage.removeItem('seeker_max_investment');
    } else {
      sessionStorage.setItem('seeker_max_investment', String(maxInvestment));
    }
  }, [maxInvestment]);

  useEffect(() => {
    sessionStorage.setItem('seeker_sort_by', sortBy);
  }, [sortBy]);

  // Handle scroll position saving and restoring
  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem('seeker_browse_scroll', String(window.scrollY));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedScroll = sessionStorage.getItem('seeker_browse_scroll');
    if (savedScroll) {
      const timer = setTimeout(() => {
        window.scrollTo(0, Number(savedScroll));
      }, 150);
      return () => clearTimeout(timer);
    }
  }, []);

  const industries = ['ALL', 'Food & Beverages', 'Healthcare', 'Fitness & Wellness', 'Automobile & EV', 'Education', 'Retail'];
  const cities = ['ALL', 'Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Hyderabad', 'Chennai'];

  // Filter & calculate match scores
  const processedBrands = brands.map(b => ({
    ...b,
    matchScore: calculateMatchScore(currentSeeker, b)
  })).filter(b => {
    const matchesSearch = (b.brandName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (b.tagline && b.tagline.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (b.industry || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'ALL' || b.industry === selectedIndustry;
    const matchesCity = selectedCity === 'ALL' || (b.cityTargets && b.cityTargets.includes(selectedCity));
    const matchesInvestment = maxInvestment === null || b.investmentRequired.min <= maxInvestment;

    return matchesSearch && matchesIndustry && matchesCity && matchesInvestment;
  });

  // Sort brands
  processedBrands.sort((a, b) => {
    // Featured listings appear before standard listings
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    
    if (sortBy === 'MATCH') return (b.matchScore || 0) - (a.matchScore || 0);
    if (sortBy === 'INVESTMENT_LOW') return a.investmentRequired.min - b.investmentRequired.min;
    if (sortBy === 'INVESTMENT_HIGH') return b.investmentRequired.min - a.investmentRequired.min;
    if (sortBy === 'OUTLETS') return (b.totalOutlets || 0) - (a.totalOutlets || 0);
    return 0;
  });

  const handleRequestMeetingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingBrand) return;

    scheduleMeeting({
      brandId: meetingBrand.id,
      seekerId: currentSeeker.id,
      date: meetingDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      time: meetingTime,
      status: 'PENDING',
      brandName: meetingBrand.brandName,
      location: 'Google Meet / BrizX Hub',
      notes: meetingNotes || 'Franchise inquiry & initial unit economics discussion.'
    });

    setMeetingSuccess(true);
    setTimeout(() => {
      setMeetingSuccess(false);
      setShowMeetingModal(false);
      setMeetingBrand(null);
    }, 1800);
  };

  return (
    <div className="w-full p-4 sm:p-6 md:p-8 space-y-8 bg-[#F4F7FB] min-h-screen text-slate-900">
      {/* Unified Seeker Page Banner */}
      <SeekerHero
        pageKey="browseBrands"
        badgeText="AI Smart Match Directory"
        title="Explore Verified Franchise Brands"
        description="Discover audited business opportunities across India. Filter by capital requirement, industry vertical, and verified ROI payback periods."
        actions={
          <button
            onClick={() => {
              setIsSmartMatchOpen(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            START SMART MATCH →
          </button>
        }
      />

      {/* Smart Match Form */}
      <SmartMatchForm 
        onSearch={handleSmartMatchSearch} 
        isOpen={isSmartMatchOpen} 
        onOpenChange={setIsSmartMatchOpen} 
      />

      {smartMatchResults ? (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-blue-100/80 shadow-xs flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">AI Smart Match Rankings</h2>
              <p className="text-xs text-slate-500 font-bold">Top matched franchise brands matching your custom criteria</p>
            </div>
            <button 
              onClick={() => {
                setSmartMatchResults(null);
                setIsSmartMatchOpen(false);
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
            >
              Clear Results
            </button>
          </div>
          <SmartMatchResults results={smartMatchResults} />
        </div>
      ) : (
        <>
          {/* Smart Match Quick Access Banner */}
          <div className="bg-white rounded-3xl p-5 border border-blue-100/80 shadow-[0_4px_20px_rgba(59,130,246,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0 border border-blue-100">
                <Sparkles size={18} className="animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight font-heading flex items-center gap-2">
                  Find Your Perfect Match Instantly
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Let our AI evaluate capital compatibility, location targets, and payback criteria to find the absolute best franchise for you.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsSmartMatchOpen(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full md:w-auto px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              START SMART MATCH →
            </button>
          </div>

          {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-blue-100/80 shadow-xs space-y-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search */}
          <div className="md:col-span-5 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by brand name, industry or keyword..."
              className="w-full bg-slate-50/70 border border-blue-100 rounded-2xl pl-11 pr-4 py-3 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Industry Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full bg-slate-50/70 border border-blue-100 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white cursor-pointer transition-all"
            >
              {industries.map(ind => (
                <option key={ind} value={ind}>{ind === 'ALL' ? 'All Industries' : ind}</option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-slate-50/70 border border-blue-100 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white cursor-pointer transition-all"
            >
              {cities.map(c => (
                <option key={c} value={c}>{c === 'ALL' ? 'All Target Cities' : c}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-50/70 border border-blue-100 rounded-2xl px-4 py-3 text-xs font-bold text-blue-700 outline-none focus:border-blue-500 focus:bg-white cursor-pointer transition-all"
            >
              <option value="MATCH">Sort: Smart Match %</option>
              <option value="INVESTMENT_LOW">Sort: Capital (Low to High)</option>
              <option value="INVESTMENT_HIGH">Sort: Capital (High to Low)</option>
              <option value="OUTLETS">Sort: Total Outlets</option>
            </select>
          </div>
        </div>

        {/* Investment Range Slider */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-blue-50">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">Capital Limit:</span>
            <InvestmentRangeFilter
              selectedMaxLakhs={maxInvestment}
              onChange={setMaxInvestment}
            />
          </div>

          <div className="text-xs font-bold text-slate-500">
            Showing <span className="text-blue-700 font-black">{processedBrands.length}</span> verified brand opportunities
          </div>
        </div>
      </div>

      {/* Brand Grid */}
      {processedBrands.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-blue-100/80 shadow-xs">
          <Building2 size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-black text-slate-900 mb-2">No Matching Brands Found</h3>
          <p className="text-xs text-slate-500 mb-6 max-w-md mx-auto">
            Try adjusting your search query, increasing your investment limit, or selecting "All Industries".
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedIndustry('ALL');
              setSelectedCity('ALL');
              setMaxInvestment(null);
            }}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase cursor-pointer transition-colors shadow-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedBrands.map((brand) => {
            const isSaved = savedBrandIds.includes(brand.id);
            const cover = brand.coverImage || 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80';
            return (
              <div
                key={brand.id}
                className="bg-white rounded-3xl border border-blue-100/80 shadow-xs hover:shadow-md hover:border-blue-200 transition-all duration-300 flex flex-col justify-between relative group overflow-hidden"
              >
                <div>
                  {/* Brand Image Banner */}
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={cover}
                      alt={brand.brandName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent" />

                    {/* Top Badges & Save */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <Sparkles size={11} /> {brand.badge || 'VERIFIED'}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <span className="bg-slate-900/90 backdrop-blur-md text-blue-300 text-[11px] font-black px-2.5 py-1 rounded-xl shadow-md border border-white/10">
                          {brand.matchScore}% Match
                        </span>
                        <button
                          onClick={() => toggleSaveBrand(currentSeeker.id, brand.id)}
                          className={`p-2 rounded-xl transition-colors cursor-pointer backdrop-blur-md shadow-md ${
                            isSaved ? 'bg-blue-600 text-white' : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-900'
                          }`}
                          title={isSaved ? 'Remove from Saved' : 'Save Brand'}
                        >
                          <Bookmark size={14} fill={isSaved ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>

                    {/* Overlay Logo & Name */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-end gap-2.5 z-10">
                      <BrandLogo
                        logo={brand.logo}
                        brandName={brand.brandName}
                        industry={brand.industry}
                        verified={brand.verified}
                        size="md"
                        className="shadow-lg ring-2 ring-white shrink-0"
                      />
                      <div className="text-white drop-shadow-md min-w-0">
                        <h3 
                          onClick={() => navigate(`/brands/${brand.id}`, { state: { from: '/seeker/browse-brands' } })}
                          className="font-extrabold text-white text-base leading-snug group-hover:text-blue-200 transition-colors line-clamp-1 cursor-pointer"
                        >
                          {brand.brandName}
                        </h3>
                        <p className="text-[10px] font-bold text-blue-200 uppercase tracking-wider mt-0.5">
                          {brand.industry}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                      {brand.tagline || brand.description}
                    </p>

                    {/* Financial Metrics Box */}
                    <div className="bg-slate-50/70 rounded-2xl p-4 border border-blue-50 grid grid-cols-2 gap-3 mb-2">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Capital Required</div>
                        <div className="text-xs font-black text-slate-900">₹{brand.investmentRequired.min} - {brand.investmentRequired.max}L</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Est. Payback</div>
                        <div className="text-xs font-black text-emerald-600">{brand.roiPayback || '12-18 Mos'}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Franchise Fee</div>
                        <div className="text-xs font-bold text-slate-700">₹{brand.franchiseFee || 4} Lakhs</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Outlets</div>
                        <div className="text-xs font-bold text-slate-700">{brand.totalOutlets || 50}+ Active</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-5 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/brands/${brand.id}`, { state: { from: '/seeker/browse-brands' } })}
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    title="View Details"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setConnectModalBrand(brand)}
                    className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1"
                  >
                    <Sparkles size={13} /> Connect
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
        </>
      )}

      {/* Brand Detail Modal */}
      {selectedBrand && (
        <div className="fixed inset-0 z-50 bg-indigo-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedBrand(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-full bg-slate-100 cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <BrandLogo
                logo={selectedBrand.logo}
                brandName={selectedBrand.brandName}
                industry={selectedBrand.industry}
                verified={selectedBrand.verified}
                size="lg"
                className="shadow-md ring-2 ring-slate-100 shrink-0"
              />
              <div>
                <span className="bg-blue-100 text-blue-700 text-[10px] font-black uppercase px-3 py-1 rounded-full mb-1 inline-block">
                  {selectedBrand.badge || 'VERIFIED OPPORTUNITY'}
                </span>
                <h2 className="text-2xl font-black text-indigo-950">{selectedBrand.brandName}</h2>
                <p className="text-xs font-bold text-slate-500">{selectedBrand.industry} • Established {selectedBrand.establishedYear || 2018}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {selectedBrand.description || selectedBrand.tagline}
            </p>

            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Unit Economics & Investment Parameters</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Capital Required</div>
                <div className="text-sm font-black text-indigo-950">₹{selectedBrand.investmentRequired.min} - {selectedBrand.investmentRequired.max}L</div>
              </div>
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Estimated ROI</div>
                <div className="text-sm font-black text-emerald-700">{selectedBrand.roiPayback || '12-18 Months'}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Franchise Fee</div>
                <div className="text-sm font-black text-slate-800">₹{selectedBrand.franchiseFee || 4} Lakhs</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Royalty Structure</div>
                <div className="text-xs font-bold text-slate-800">{selectedBrand.royaltyFee || '5% Gross'}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Space Required</div>
                <div className="text-xs font-bold text-slate-800">{selectedBrand.spaceRequired || '300-600 sq ft'}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Total Outlets</div>
                <div className="text-sm font-black text-slate-800">{selectedBrand.totalOutlets || 45}+ Outlets</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedBrand(null);
                  setMeetingBrand(selectedBrand);
                  setShowMeetingModal(true);
                }}
                className="flex-1 py-3.5 bg-blue-700 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow flex items-center justify-center gap-2"
              >
                <Calendar size={16} /> Schedule 1-on-1 Consultation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meeting Request Modal */}
      {showMeetingModal && meetingBrand && (
        <div className="fixed inset-0 z-50 bg-indigo-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setShowMeetingModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-2 rounded-full bg-slate-100 cursor-pointer"
            >
              <X size={18} />
            </button>

            {meetingSuccess ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 size={48} className="mx-auto text-green-600" />
                <h3 className="text-xl font-black text-indigo-950">Meeting Request Sent!</h3>
                <p className="text-xs text-slate-500">
                  The brand owner for <strong className="text-blue-700">{meetingBrand.brandName}</strong> has received your calendar request.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRequestMeetingSubmit} className="space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 bg-blue-700 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                    {meetingBrand.brandName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-indigo-950 text-base">{meetingBrand.brandName}</h3>
                    <p className="text-[11px] text-slate-500 font-bold">Request 1-on-1 Strategy Session</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Time Slot</label>
                  <select
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="10:00 AM">10:00 AM IST</option>
                    <option value="11:30 AM">11:30 AM IST</option>
                    <option value="03:00 PM">03:00 PM IST</option>
                    <option value="05:30 PM">05:30 PM IST</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Inquiry / Note for Franchisor</label>
                  <textarea
                    rows={3}
                    value={meetingNotes}
                    onChange={(e) => setMeetingNotes(e.target.value)}
                    placeholder="e.g. Interested in multi-unit franchise rights for Bangalore East..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-blue-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-blue-700 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow flex items-center justify-center gap-2"
                >
                  <Send size={14} /> Confirm Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <BrandConnectionModal
        isOpen={!!connectModalBrand}
        onClose={() => setConnectModalBrand(null)}
        brand={connectModalBrand}
      />
    </div>
  );
}
