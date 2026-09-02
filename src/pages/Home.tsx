import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { useCMS } from '../context/CMSContext';
import { useAuth } from '../context/AuthContext';
import UnlockROIModal from '../components/UnlockROIModal';
import { BrandConnectionModal } from '../components/BrandConnectionModal';
import { Brand } from '../types';
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  Target, 
  Clock, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Star, 
  TrendingUp, 
  Lock, 
  HelpCircle,
  BarChart3,
  Award,
  Zap,
  MessageCircle,
  Percent,
  TrendingDown,
  DollarSign,
  Briefcase,
  Layers,
  CheckCircle,
  HelpCircle as HelpIcon,
  ChevronRight,
  Calculator,
  Shield,
  MapPin,
  ArrowUpRight,
  X
} from 'lucide-react';
import { MatchingMetrics } from '../components/MatchingMetrics';
import { ROICalculatorCard } from '../components/ROICalculatorCard';
import { HeroBackgroundNetwork } from '../components/HeroBackgroundNetwork';
import { BrandLogo } from '../components/BrandLogo';
import { VerificationVisual, MatchmakingVisual, CloseoutVisual } from '../components/PipelineStageVisuals';
import { IndustryCard } from '../components/IndustryCard';

import sectorFoodImg from '../assets/images/sector_food_beverage_1788089730793.jpg';
import sectorAutomotiveImg from '../assets/images/sector_automotive_ev_1788089747920.jpg';
import sectorHealthcareImg from '../assets/images/sector_healthcare_wellness_1788089763284.jpg';
import sectorEducationImg from '../assets/images/sector_education_edtech_1788089780302.jpg';
import sectorRetailImg from '../assets/images/sector_retail_supermarket_1788089797295.jpg';
import sectorFitnessImg from '../assets/images/sector_fitness_sports_1788089815869.jpg';

export default function Home() {
  const navigate = useNavigate();
  const [isCheckingWelcome, setIsCheckingWelcome] = useState(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('brizx_welcome_seen');
    }
    return true;
  });

  useEffect(() => {
    const seen = sessionStorage.getItem('brizx_welcome_seen');
    if (!seen) {
      navigate('/welcome', { replace: true });
    } else {
      setIsCheckingWelcome(false);
    }
  }, [navigate]);

  const { brands, seekers } = useData();
  const { hero, stats, faqs: cmsFaqs, testimonials: cmsTestimonials } = useCMS();
  const { isAuthenticated, user } = useAuth();

  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [connectionModalOpen, setConnectionModalOpen] = useState(false);
  const [selectedConnectBrand, setSelectedConnectBrand] = useState<Brand | null>(null);

  const handleUnlockClick = () => {
    if (isAuthenticated && user) {
      if (user.role === 'FRANCHISE_SEEKER') {
        navigate('/seeker/roi-calculator/advanced');
      } else if (user.role === 'BRAND_OWNER') {
        navigate('/brand/roi-calculator');
      } else if (user.role === 'SUPER_ADMIN') {
        navigate('/admin');
      }
    } else {
      setIsUnlockModalOpen(true);
    }
  };

  const handleUnlockConfirm = () => {
    setIsUnlockModalOpen(false);
    if (isAuthenticated && user) {
      if (user.role === 'FRANCHISE_SEEKER') {
        navigate('/seeker/roi-calculator/advanced');
      } else if (user.role === 'BRAND_OWNER') {
        navigate('/brand/roi-calculator');
      } else if (user.role === 'SUPER_ADMIN') {
        navigate('/admin');
      }
    } else {
      navigate('/register');
    }
  };

  // Hero Background Network State
  // Slideshow logic removed in favor of HeroBackgroundNetwork component

  // FAQ open/close state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Interactive Matchmaker simulator states
  const [selectedIndustry, setSelectedIndustry] = useState('Food & Beverages');
  const [searchBudgetVal, setSearchBudgetVal] = useState(25); // in Lakhs
  const [selectedModel, setSelectedModel] = useState<'FOFO' | 'FOCO'>('FOCO');

  // Dedicated Search Bar state (positioned below ROI Calculator)
  const [homeSearchQuery, setHomeSearchQuery] = useState('');
  const [homeSearchIndustry, setHomeSearchIndustry] = useState('All');

  const handlePerformSearch = () => {
    const params = new URLSearchParams();
    if (homeSearchQuery.trim()) params.append('search', homeSearchQuery.trim());
    if (homeSearchIndustry && homeSearchIndustry !== 'All') params.append('industry', homeSearchIndustry);
    navigate(`/brands?${params.toString()}`);
  };

  // Pricing toggle state (Monthly vs Annual)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  if (isCheckingWelcome) {
    return (
      <div className="min-h-screen bg-[#EEF4FF] flex items-center justify-center text-blue-600 font-black tracking-wider text-sm animate-pulse uppercase">
        Loading BrizX India...
      </div>
    );
  }

  // Find the closest matched brand dynamically based on user controls!
  const liveMatch = useMemo(() => {
    if (!brands || brands.length === 0) return null;

    // Filter by industry
    const industryMatched = brands.filter(b => {
      const bInd = b.industry || '';
      const selInd = selectedIndustry || '';
      return bInd.toLowerCase().includes(selInd.toLowerCase()) ||
             selInd.toLowerCase().includes(bInd.toLowerCase());
    });

    const candidates = industryMatched.length > 0 ? industryMatched : brands;

    // Find the one closest to the budget value
    let best = candidates[0];
    let minDiff = Infinity;

    for (const b of candidates) {
      const maxBudget = b.investmentRequired?.max || 30;
      const diff = Math.abs(maxBudget - searchBudgetVal);
      if (diff < minDiff) {
        minDiff = diff;
        best = b;
      }
    }

    // Calculate simulated score
    const maxBudget = best?.investmentRequired?.max || 30;
    const diffPercent = Math.min(100, (Math.abs(maxBudget - searchBudgetVal) / searchBudgetVal) * 100);
    const calculatedScore = Math.max(78, Math.round(99 - (diffPercent * 0.3)));

    return {
      brand: best,
      score: calculatedScore
    };
  }, [brands, selectedIndustry, searchBudgetVal]);

  // Pricing Plans (Real data fallback to default)
  const pricingPlansList = [
    {
      id: 'starter',
      name: 'Starter Scale',
      price: billingCycle === 'monthly' ? 49999 : 42499,
      period: 'month',
      desc: 'Perfect for emerging brands looking to establish their initial footprint.',
      badge: 'Launch Tier',
      features: [
        '25 Verified seeker lead unlocks/mo',
        'Standard Brand Directory listing',
        'CRM sales pipeline tracking',
        'In-app chat & direct scheduling',
        'FSSAI & trademark verified badge'
      ],
      ctaText: 'Start Scale',
      highlighted: false
    },
    {
      id: 'professional',
      name: 'Professional Expansion',
      price: billingCycle === 'monthly' ? 149999 : 124999,
      period: 'month',
      desc: 'Optimized for fast-growing franchise systems with national scaling ambitions.',
      badge: 'Most Popular',
      features: [
        '100 Verified seeker lead unlocks/mo',
        'Premium featured directory placement',
        'Automated AI matching recommendations',
        'Dedicated Key Account Manager',
        'Custom SMS & WhatsApp broadcast credits',
        '1-on-1 virtual discovery meetings'
      ],
      ctaText: 'Grow Professional',
      highlighted: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise Network',
      price: billingCycle === 'monthly' ? 249999 : 209999,
      period: 'month',
      desc: 'Designed for master franchises and national retail store chains.',
      badge: 'Corporate Master',
      features: [
        '250 Verified seeker lead unlocks/mo',
        'Top-tier hero homepage spot',
        'Custom geographic catchment heatmapping',
        'Unlimited staff CRM seats',
        'Legal advisor LOI templates support',
        'Exclusive event sponsorship rights'
      ],
      ctaText: 'Contact Enterprise',
      highlighted: false
    }
  ];

  // Unique industries mapping with precise metadata, icons, and 16:9 visuals
  const customIndustries = [
    { name: 'Food & Beverage', count: '180+ Brands', icon: '🍔', desc: 'QSR, Cafes, Cloud Kitchens & Fine Dining', growth: '+32% Growth', image: sectorFoodImg },
    { name: 'Automotive & EV', count: '50+ Brands', icon: '⚡', desc: 'EV Charging, Car Care & Dealerships', growth: '+45% Growth', image: sectorAutomotiveImg },
    { name: 'Healthcare & Wellness', count: '95+ Brands', icon: '🏥', desc: 'Diagnostics, Clinics, Pharmacies & Spas', growth: '+18% Growth', image: sectorHealthcareImg },
    { name: 'Education & EdTech', count: '120+ Brands', icon: '🎓', desc: 'K-12 Preschools, Coding & Skill Hubs', growth: '+25% Growth', image: sectorEducationImg },
    { name: 'Retail & Supermarkets', count: '140+ Brands', icon: '🛒', desc: 'Apparel, Convenience Stores & Minimarts', growth: '+21% Growth', image: sectorRetailImg },
    { name: 'Fitness & Sports', count: '65+ Brands', icon: '🏋️‍♂️', desc: 'Gyms, Yoga Studios & Sports Academies', growth: '+14% Growth', image: sectorFitnessImg }
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F5F9FF] text-[#0F172A] font-sans selection:bg-blue-200 selection:text-blue-900">
      
      {/* SECTION 1: HERO CONTAINER (16:9 Aspect Ratio & Full Screen Width Left-to-Right) */}
      <section className="relative w-full aspect-[16/9] overflow-hidden bg-slate-50 text-[#0F172A] flex flex-col justify-center px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Soft floating background shapes & light glow effects */}
        <HeroBackgroundNetwork />

        {/* Subtle dark ambient overlay to ensure white text readability against bright background images */}
        <div className="absolute inset-0 bg-black/30 bg-gradient-to-r from-black/60 to-transparent pointer-events-none z-[1]"></div>
        
        <div className="w-full max-w-7xl mx-auto relative z-10 flex flex-col items-start justify-center my-auto">
          {/* Hero Main Content - Written directly on the background */}
          <div className="flex flex-col items-start text-left max-w-3xl drop-shadow-2xl">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2.5 bg-blue-50/90 text-blue-700 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-2 sm:mb-5 lg:mb-8 rounded-full border border-blue-100 shadow-[0_4px_12px_rgba(37,99,235,0.06)] backdrop-blur-md">
              <span className="flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-blue-500 animate-pulse"></span>
              India's #1 Enterprise Franchise Network
            </div>
            
            <h1 className="text-lg sm:text-3xl md:text-4xl lg:text-[50px] xl:text-[56px] font-black tracking-tight text-white leading-[1.1] mb-2 sm:mb-4 lg:mb-6 uppercase drop-shadow-lg">
              Smart Franchise Discovery. <br/>
              <span className="text-white bg-blue-600/90 px-2 sm:px-3 py-0.5 sm:py-1 rounded-xl sm:rounded-2xl border border-blue-500 inline-block mt-1 sm:mt-2 shadow-xs backdrop-blur-md">Match. Connect. Expand.</span>
            </h1>
            
            <p className="text-[11px] sm:text-sm md:text-base lg:text-lg text-white font-semibold max-w-2xl mb-3 sm:mb-6 lg:mb-10 leading-tight sm:leading-relaxed line-clamp-2 sm:line-clamp-none drop-shadow-md">
              BrizX India replaces manual brokers with a secure, data-driven match engine. Connect directly with vetted brand founders and pre-screened franchise investors.
            </p>
            
            {/* Action CTAs - Rounded premium buttons */}
            <div className="flex flex-wrap sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <Link
                to="/search"
                className="px-3 sm:px-8 py-1.5 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-extrabold text-[10px] sm:text-xs md:text-sm uppercase tracking-wider rounded-full shadow-[0_12px_24px_-6px_rgba(37,99,235,0.3)] hover:shadow-[0_16px_32px_-4px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2"
              >
                <span>Find Franchise Opportunities</span>
                <ArrowRight size={14} className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
              </Link>
              <Link
                to="/register?role=BRAND_OWNER"
                className="px-3 sm:px-8 py-1.5 sm:py-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-extrabold text-[10px] sm:text-xs md:text-sm uppercase tracking-wider rounded-full shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 backdrop-blur-xs"
              >
                List Your Brand
              </Link>
              <a
                href="https://wa.me/919979510361?text=Hello%20BrizX%20India%2C%20I%20want%20to%20Contact%20on%20WhatsApp."
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 sm:px-6 py-1.5 sm:py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[10px] sm:text-xs md:text-sm uppercase tracking-wider rounded-full shadow-[0_12px_24px_-6px_rgba(16,185,129,0.3)] hover:shadow-[0_16px_32px_-4px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2"
              >
                <MessageCircle size={14} className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Animated Mouse Scroll Indicator */}
        <div className="hidden sm:flex absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1 text-slate-500 text-[10px] font-black uppercase tracking-widest pointer-events-none z-10">
          <span>Scroll</span>
          <div className="w-4 h-7 sm:w-5 sm:h-8 border border-slate-300 rounded-full flex justify-center p-1 sm:p-1.5 shadow-xs">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* SECTION 1.5: INTERACTIVE MATCHMAKING SIMULATOR & TRUST STATS */}
      <MatchingMetrics />

      {/* ROI Calculator Section */}
      <section className="py-4 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ROICalculatorCard mode="basic" titleContext="Homepage Estimator" />
        <div className="flex justify-center -mt-4 sm:-mt-6 lg:-mt-8 mb-6 sm:mb-8">
          <button
            onClick={handleUnlockClick}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700 font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-2xl border border-slate-200 hover:border-blue-200 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer group"
          >
            <span>Unlock Advanced ROI Calculator →</span>
          </button>
        </div>
      </section>

      {/* SEARCHING OPTION SECTION (Positioned directly below ROI Calculator) */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-br from-white via-blue-50/40 to-slate-50 border border-blue-100/80 rounded-[32px] p-6 sm:p-10 shadow-[0_20px_50px_rgba(15,23,42,0.04)] relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Header Badge & Title */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100/70 text-blue-700 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-full mb-3 border border-blue-200/60 shadow-xs">
                  <Search size={12} className="text-blue-600" /> Instant Franchise Search
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0F172A] uppercase tracking-tight leading-tight">
                  Search & Discover Brands
                </h2>
                <p className="text-slate-600 font-semibold text-xs sm:text-sm mt-1 max-w-2xl">
                  Find verified franchise opportunities filtered by brand name, industry sector, and investment budget.
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <span className="text-xs font-black text-slate-500 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-xs">
                  <span className="text-blue-600 font-extrabold">{brands.length}+</span> Brands Available
                </span>
              </div>
            </div>

            {/* Interactive Search Bar Controls */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-lg">
              {/* Keyword Search Input */}
              <div className="md:col-span-5 relative flex items-center">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 shrink-0" size={18} />
                <input
                  type="text"
                  placeholder="Search by brand name, tagline, or keywords..."
                  value={homeSearchQuery}
                  onChange={(e) => setHomeSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handlePerformSearch();
                    }
                  }}
                  className="w-full bg-slate-50/80 border border-slate-200 focus:border-blue-500 focus:bg-white text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 rounded-xl pl-11 pr-8 py-3 outline-none transition-all"
                />
                {homeSearchQuery && (
                  <button
                    onClick={() => setHomeSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Industry Select Dropdown */}
              <div className="md:col-span-4 relative flex items-center">
                <select
                  value={homeSearchIndustry}
                  onChange={(e) => setHomeSearchIndustry(e.target.value)}
                  className="w-full bg-slate-50/80 border border-slate-200 focus:border-blue-500 focus:bg-white text-xs sm:text-sm font-semibold text-slate-800 rounded-xl px-4 py-3 outline-none transition-all cursor-pointer appearance-none"
                >
                  <option value="All">All Industry Sectors</option>
                  <option value="Food & Beverage">Food & Beverage (Cafes, QSR, Fine Dining)</option>
                  <option value="Automotive & EV">Automotive & EV Charging</option>
                  <option value="Healthcare & Wellness">Healthcare & Wellness Clinics</option>
                  <option value="Education & EdTech">Education & Preschools</option>
                  <option value="Retail & Supermarkets">Retail & Supermarkets</option>
                  <option value="Fitness & Sports">Fitness & Gyms</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>

              {/* Search Submit Button */}
              <div className="md:col-span-3 flex items-center">
                <button
                  onClick={handlePerformSearch}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Search size={16} />
                  <span>Search Brands</span>
                </button>
              </div>
            </div>

            {/* Popular Quick Search Chips */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider mr-1">Popular Filters:</span>
              {[
                { label: '🍔 Food & Cafe', industry: 'Food & Beverage' },
                { label: '⚡ EV Charging', industry: 'Automotive & EV' },
                { label: '🏥 Healthcare', industry: 'Healthcare & Wellness' },
                { label: '🎓 Education', industry: 'Education & EdTech' },
                { label: '🛒 Minimarts', industry: 'Retail & Supermarkets' },
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setHomeSearchIndustry(chip.industry);
                    navigate(`/brands?industry=${encodeURIComponent(chip.industry)}`);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer border ${
                    homeSearchIndustry === chip.industry
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>





      {/* FEATURED BRANDS GRID WITH IMAGES */}
      <section className="pt-6 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight uppercase">Featured Franchise Opportunities</h2>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Explore verified brand proposals with active expansion targets</p>
          </div>
          <Link 
            to="/brands" 
            className="text-blue-600 hover:text-blue-700 font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-1 hover:gap-1.5"
          >
            <span>View All Brands</span>
            <ArrowUpRight size={16} strokeWidth={2.5} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {brands.slice(0, 6).map((brand) => {
            const minInv = brand.investmentRequired?.min ?? (brand as any).minInvestment ?? 15;
            const maxInv = brand.investmentRequired?.max ?? (brand as any).maxInvestment ?? 30;
            const cover = brand.coverImage || 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80';

            return (
              <div 
                key={brand.id} 
                className="bg-white border border-[#DCE7F5] rounded-[24px] shadow-[0_16px_40px_rgba(15,23,42,0.03)] hover:shadow-[0_24px_60px_-10px_rgba(37,99,235,0.15)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Top Cover Banner Image */}
                  <div className="relative h-44 sm:h-48 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={cover}
                      alt={brand.brandName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                      {brand.badge ? (
                        <span className="bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                          {brand.badge}
                        </span>
                      ) : (
                        <span className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md border border-blue-400/20">
                          {brand.industry}
                        </span>
                      )}

                      {brand.verified && (
                        <span className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                          <CheckCircle size={12} strokeWidth={2.5} /> Verified
                        </span>
                      )}
                    </div>

                    {/* Overlay Logo & Name */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-end gap-3 z-10">
                      <BrandLogo
                        logo={brand.logo}
                        brandName={brand.brandName}
                        industry={brand.industry}
                        verified={brand.verified}
                        size="md"
                        className="shadow-xl ring-2 ring-white shrink-0"
                      />
                      <div className="min-w-0 drop-shadow-md">
                        <Link to={`/brands/${brand.id}`}>
                          <h3 className="font-extrabold text-white text-base sm:text-lg uppercase leading-tight hover:text-blue-200 transition-colors line-clamp-1">
                            {brand.brandName}
                          </h3>
                        </Link>
                        <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mt-0.5">
                          Est. {brand.establishedYear || 2018} • {brand.industry}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Main Body */}
                  <div className="p-5 sm:p-6">
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed mb-5 line-clamp-2">
                      {brand.description || 'Verified franchise opportunity with proven unit economics, turnkey launch SOPs, and marketing support.'}
                    </p>

                    {/* Metric Strip */}
                    <div className="grid grid-cols-2 gap-3 bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3.5 mb-2">
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">Investment Capex</span>
                        <span className="font-black text-blue-700 text-xs sm:text-sm">
                          ₹{minInv} - ₹{maxInv} L
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">Est. Payback</span>
                        <span className="font-black text-emerald-600 text-xs sm:text-sm">
                          {brand.roiPayback || '12-18 Months'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">Space Req.</span>
                        <span className="font-bold text-slate-700 text-xs truncate block">
                          {brand.spaceRequired || '300-600 sq ft'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">Outlets</span>
                        <span className="font-bold text-slate-700 text-xs block">
                          {brand.totalOutlets || (brand as any).outlets || 25}+ Units
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Apply / Detail Action */}
                <div className="px-5 pb-5 pt-0">
                  <Link 
                    to={`/brands/${brand.id}`} 
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all text-center flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <span>View Brand Details</span>
                    <ArrowUpRight size={14} strokeWidth={2.5} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {/* SECTION 5: HOW IT WORKS - COMPACT MOBILE FRIENDLY WITH AI VISUALS */}
      <section className="py-10 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-12">
          <span className="inline-flex items-center gap-1 px-3 py-1 sm:px-3.5 sm:py-1.5 bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-wider rounded-full border border-blue-100 mb-3 sm:mb-4">Standardized Pipeline</span>
          <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-black text-[#0F172A] tracking-tight uppercase leading-tight">Seamless Deal Origination</h2>
          <p className="text-[#64748B] font-semibold text-xs sm:text-sm mt-2 sm:mt-3 max-w-2xl mx-auto">
            Three sequential stages to finalize high-ROI franchise contracts under audited guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          
          {/* Stage 1 Card */}
          <div className="bg-white border border-[#DCE7F5] rounded-2xl sm:rounded-[24px] p-4 sm:p-5 shadow-xs hover:shadow-[0_12px_32px_-8px_rgba(37,99,235,0.12)] hover:-translate-y-1 transition-all duration-300 text-left flex flex-row items-center justify-between gap-3.5 sm:gap-4 overflow-hidden group">
            <div className="min-w-0 flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-xl font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-xs border border-blue-400/10">
                  01
                </div>
                <span className="text-[10px] sm:text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">Stage 1: Verification</span>
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-extrabold text-[#0F172A] mb-1 uppercase tracking-tight leading-snug">Create Audited Portfolio</h3>
              <p className="text-xs text-[#64748B] font-semibold leading-relaxed">
                Brands list audited MCA financial indices, while seekers outline verifiable capital readiness & space capacities.
              </p>
            </div>
            <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 shrink-0">
              <VerificationVisual />
            </div>
          </div>

          {/* Stage 2 Card */}
          <div className="bg-blue-50/50 border border-blue-100/80 rounded-2xl sm:rounded-[24px] p-4 sm:p-5 shadow-xs hover:shadow-[0_12px_32px_-8px_rgba(37,99,235,0.12)] hover:-translate-y-1 transition-all duration-300 text-left flex flex-row items-center justify-between gap-3.5 sm:gap-4 overflow-hidden group">
            <div className="min-w-0 flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-900 text-white rounded-xl font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-xs">
                  02
                </div>
                <span className="text-[10px] sm:text-xs font-black text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">Stage 2: Matchmaking</span>
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-extrabold text-[#0F172A] mb-1 uppercase tracking-tight leading-snug">Smart Match Search</h3>
              <p className="text-xs text-[#64748B] font-semibold leading-relaxed">
                Algorithm processes 12+ indicators to highlight ideal, compliant partners based on exact capital & territory goals.
              </p>
            </div>
            <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 shrink-0">
              <MatchmakingVisual />
            </div>
          </div>

          {/* Stage 3 Card */}
          <div className="bg-white border border-[#DCE7F5] rounded-2xl sm:rounded-[24px] p-4 sm:p-5 shadow-xs hover:shadow-[0_12px_32px_-8px_rgba(37,99,235,0.12)] hover:-translate-y-1 transition-all duration-300 text-left flex flex-row items-center justify-between gap-3.5 sm:gap-4 overflow-hidden group">
            <div className="min-w-0 flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-xl font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-xs border border-blue-400/10">
                  03
                </div>
                <span className="text-[10px] sm:text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">Stage 3: Closeout</span>
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-extrabold text-[#0F172A] mb-1 uppercase tracking-tight leading-snug">Schedule & Execute LOI</h3>
              <p className="text-xs text-[#64748B] font-semibold leading-relaxed">
                Schedule 1-on-1 due-diligence calls, exchange legal templates, and execute final store covenants securely.
              </p>
            </div>
            <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 shrink-0">
              <CloseoutVisual />
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 6: HIGH GROWTH INDUSTRIES */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-blue-50/50 rounded-[40px] border border-blue-100/50 my-12">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-wider rounded-full border border-blue-100/50 mb-6">Industry Demographics</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] uppercase leading-tight">High-Growth Sectors in India</h2>
          <p className="text-[#64748B] font-semibold text-sm mt-3 border-t border-slate-100 pt-3">Discover verified opportunities sorted by highest trending CAGR market yield indices.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {customIndustries.map((ind, i) => (
            <IndustryCard key={i} industry={ind} />
          ))}
        </div>
      </section>

      {/* SECTION 7: PLANS AND TRANSPARENT PRICING */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8 border-y border-[#DCE7F5]">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-wider rounded-full border border-blue-100 mb-6">Subscription plans</span>
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-[#0F172A] uppercase tracking-tight leading-none mb-6">Engineered for Scalability</h2>
            <p className="text-[#64748B] font-semibold text-sm max-w-xl mx-auto">
              Franchise Seekers browse 100% Free. Brand owners pick simple, outcome-focused expansion plans.
            </p>
 
            {/* Billing cycle toggler */}
            <div className="flex items-center justify-center mt-10 bg-slate-100/80 p-1.5 rounded-full border border-[#DCE7F5] w-max mx-auto shadow-xs">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2.5 text-xs font-black uppercase transition-all rounded-full cursor-pointer ${
                  billingCycle === 'monthly' ? 'bg-blue-600 text-white shadow-[0_4px_12px_-2px_rgba(37,99,235,0.3)]' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Monthly billing
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-2.5 text-xs font-black uppercase transition-all rounded-full flex items-center gap-2 cursor-pointer ${
                  billingCycle === 'annual' ? 'bg-blue-600 text-white shadow-[0_4px_12px_-2px_rgba(37,99,235,0.3)]' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Annually</span>
                <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                  Save 15%
                </span>
              </button>
            </div>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlansList.map((plan) => (
              <div 
                key={plan.id}
                className={`bg-white p-8 sm:p-10 flex flex-col justify-between relative transition-all duration-300 rounded-[28px] border border-[#DCE7F5] shadow-[0_16px_40px_rgba(15,23,42,0.03),inset_0_1px_2px_rgba(255,255,255,1)] hover:shadow-[0_24px_60px_-10px_rgba(37,99,235,0.15),inset_0_1px_2px_rgba(255,255,255,1)] hover:-translate-y-2 ${
                  plan.highlighted 
                    ? 'ring-2 ring-blue-600/50 shadow-[0_24px_60px_-10px_rgba(37,99,235,0.15),inset_0_1px_2px_rgba(255,255,255,1)]' 
                    : ''
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3.5 right-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-full shadow-[0_8px_16px_-4px_rgba(37,99,235,0.3)] border border-blue-400/20">
                    Most Popular
                  </span>
                )}

                <div className="text-left">
                  <span className="inline-block bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-100/50 text-[10px] font-black uppercase tracking-wider mb-4">
                    {plan.badge}
                  </span>
                  <h3 className="text-xl font-black text-[#0F172A] uppercase mb-2 tracking-tight">{plan.name}</h3>
                  <p className="text-xs font-semibold text-slate-500 leading-relaxed min-h-[40px] border-b border-slate-100 pb-4">
                    {plan.desc}
                  </p>
                  
                  <div className="my-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-[#0F172A]">
                      ₹{plan.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-slate-400 font-extrabold uppercase text-xs">
                      / {plan.period}
                    </span>
                  </div>

                  <ul className="space-y-3.5 mb-8 text-xs font-semibold text-slate-600">
                    {plan.features.map((feat, index) => (
                      <li key={index} className="flex items-start gap-2.5">
                        <CheckCircle2 size={16} strokeWidth={2.5} className="text-blue-500 shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/pricing"
                  className={`w-full py-3.5 text-xs font-extrabold uppercase tracking-wider text-center rounded-full transition-all block ${
                    plan.highlighted 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-[0_8px_16px_-4px_rgba(37,99,235,0.3)]' 
                      : 'bg-slate-50 hover:bg-slate-100 text-[#0F172A] border border-[#DCE7F5]'
                  }`}
                >
                  {plan.ctaText}
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 8: CUSTOMER CASE STORIES */}
      <section className="py-4 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-blue-50/30 rounded-[20px] border border-blue-100/50 my-4 flex flex-col justify-center overflow-hidden min-h-[160px]">
        <div className="text-center max-w-3xl mx-auto mb-4">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[9px] font-black uppercase tracking-wider rounded-full border border-blue-100 mb-2">Success Covenants</span>
          <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] uppercase tracking-tight leading-none">Vetted Expansion Case Covenants</h2>
          <p className="text-[#64748B] font-semibold text-[10px] mt-1 border-t border-slate-100 pt-1">Read how brands launched sustainable outlets.</p>
        </div>

        <div className="relative flex overflow-x-hidden">
          <motion.div
            className="flex gap-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
          >
            {[
              { text: "BrizX completely bypassed the typical broker opacity. I was connected directly with the core founders of Chai Point. The legal catchment audit files gave us complete localized site validation.", name: "Vikram Sethi", role: "Multi-Unit Cafe Operator • Bangalore" },
              { text: "We launched over 45 high-intent, pre-vetted leads in western India in under 30 days. The CRM pipeline automation saves our franchise development team hours of manual email follow-up.", name: "Ananya Roy", role: "VP Corporate Franchising • Scoop Gelato" },
              { text: "The quality of leads on BrizX is unparalleled. We closed 3 master franchise agreements in 2 months with zero brokerage fees.", name: "Rajiv Menon", role: "MD • Fitness First India" },
              { text: "Finally, a platform that understands franchisee due diligence. The P&L logs and legal templates are a lifesaver.", name: "Priya Sharma", role: "Franchise Investor • TechHub" },
              { text: "Excellent support and very streamlined process. My brand visibility increased significantly after listing on BrizX.", name: "Amitabh K.", role: "Founder • FoodFlow" },
              { text: "I was able to find a partner who shared the same vision and investment capacity for our healthcare brand within just 3 weeks.", name: "Dr. Kavita Rao", role: "Founder • WellnessCare" },
              { text: "The transparency in the data room documents makes the decision-making process so much faster and more reliable.", name: "Sanjay Gupta", role: "Investment Manager • RetailGroup" },
              { text: "The platform's AI-driven matching algorithm is surprisingly accurate and saved us countless hours of manual screening.", name: "Neha Singh", role: "Franchise Development Head • Education Hub" }
            ].concat([
              { text: "BrizX completely bypassed the typical broker opacity. I was connected directly with the core founders of Chai Point. The legal catchment audit files gave us complete localized site validation.", name: "Vikram Sethi", role: "Multi-Unit Cafe Operator • Bangalore" },
              { text: "We launched over 45 high-intent, pre-vetted leads in western India in under 30 days. The CRM pipeline automation saves our franchise development team hours of manual email follow-up.", name: "Ananya Roy", role: "VP Corporate Franchising • Scoop Gelato" },
              { text: "The quality of leads on BrizX is unparalleled. We closed 3 master franchise agreements in 2 months with zero brokerage fees.", name: "Rajiv Menon", role: "MD • Fitness First India" },
              { text: "Finally, a platform that understands franchisee due diligence. The P&L logs and legal templates are a lifesaver.", name: "Priya Sharma", role: "Franchise Investor • TechHub" },
              { text: "Excellent support and very streamlined process. My brand visibility increased significantly after listing on BrizX.", name: "Amitabh K.", role: "Founder • FoodFlow" },
              { text: "I was able to find a partner who shared the same vision and investment capacity for our healthcare brand within just 3 weeks.", name: "Dr. Kavita Rao", role: "Founder • WellnessCare" },
              { text: "The transparency in the data room documents makes the decision-making process so much faster and more reliable.", name: "Sanjay Gupta", role: "Investment Manager • RetailGroup" },
              { text: "The platform's AI-driven matching algorithm is surprisingly accurate and saved us countless hours of manual screening.", name: "Neha Singh", role: "Franchise Development Head • Education Hub" }
            ]).map((testimonial, idx) => (
              <div key={idx} className="flex-shrink-0 w-[200px] bg-white p-3 rounded-[16px] border border-[#DCE7F5] shadow-[0_2px_8px_rgba(15,23,42,0.03),inset_0_1px_1px_rgba(255,255,255,1)] flex flex-col justify-between relative">
                <div className="absolute top-1 right-2 text-3xl text-blue-600 font-serif leading-none opacity-10">"</div>
                <div className="space-y-2 relative z-10">
                  <div className="flex gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, starIdx) => (
                      <Star key={starIdx} size={10} fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-600 font-semibold leading-snug border-l-2 border-blue-500 pl-2">
                    "{testimonial.text}"
                  </p>
                </div>
                <div className="border-t border-slate-100 pt-2 mt-3">
                  <div className="font-extrabold text-[#0F172A] text-[10px] uppercase tracking-tight">{testimonial.name}</div>
                  <div className="text-[7px] font-black text-[#64748B] uppercase tracking-widest mt-0.5">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 9: REFINED DISCLOSURE FAQS */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-left">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-wider rounded-full border border-blue-100 mb-6">Information Center</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] uppercase tracking-tight leading-none">Frequently Audited Queries</h2>
            <p className="text-[#64748B] font-semibold text-sm mt-4 border-t border-slate-100 pt-4 max-w-2xl mx-auto">Get comprehensive insights into legal and financial franchising frameworks.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How does the BrizX Smart Matching AI evaluate partners?",
                a: "Our algorithm matches brands and seekers across 15 core parameters, including exact capital thresholds, preferred target catchments, operational experience backgrounds, risk appetite, and proposed unit model types (FOCO vs. FOFO)."
              },
              {
                q: "Is BrizX free for Franchise Seekers and individual investors?",
                a: "Yes. Searching, filtering, and creating a validated investor profile on the BrizX marketplace is 100% free. We never charge commission or brokerage fees on closed transactions."
              },
              {
                q: "How are brands and seeker profiles authenticated?",
                a: "Brands must submit official corporate registration details (GST, MCA incorporation, trademark filings, FSSAI certificates where applicable) alongside verified unit P&L logs. Seekers must undergo identity verification and secure credit profiling."
              },
              {
                q: "What legal advisory templates are provided on BrizX?",
                a: "Enterprise subscribers gain access to standard legal resources, including standard Letter of Intent (LOI) drafts, detailed franchise disclosure documents (FDD) templates, and territorial license agreements verified by seasoned franchising lawyers."
              }
            ].map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-[#DCE7F5] rounded-[20px] overflow-hidden shadow-[0_8px_20px_rgba(15,23,42,0.02)] transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-6 font-extrabold text-[#0F172A] text-base uppercase flex items-center justify-between gap-6 cursor-pointer focus:outline-none"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <span className="p-1.5 bg-blue-50 border border-blue-100 text-blue-600 rounded-full shrink-0">
                      <ChevronUp size={16} strokeWidth={2.5} />
                    </span>
                  ) : (
                    <span className="p-1.5 bg-slate-50 border border-slate-100 text-[#0F172A] rounded-full shrink-0">
                      <ChevronDown size={16} strokeWidth={2.5} />
                    </span>
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-sm font-semibold text-slate-500 leading-relaxed border-t border-slate-50 pt-4 bg-[#F5F9FF]/30">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <UnlockROIModal
        isOpen={isUnlockModalOpen}
        onClose={() => setIsUnlockModalOpen(false)}
        onUnlock={handleUnlockConfirm}
      />

      <BrandConnectionModal
        isOpen={connectionModalOpen}
        onClose={() => setConnectionModalOpen(false)}
        brand={selectedConnectBrand}
      />

    </div>
  );
}
