import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  CheckCircle, ShieldCheck, Eye, Calendar, ArrowRight, TrendingUp, Sparkles, 
  Bookmark, Calculator, Crown, Building2, Bell, Percent, ShieldAlert, Award, PlayCircle, Lock, PhoneCall, ChevronRight, CheckCheck, FileText, ChevronLeft, UserCheck, Briefcase
} from 'lucide-react';
import { Link } from 'react-router';
import { calculateMatchScore } from '../../data/mockDb';
import { BrandLogo } from '../../components/BrandLogo';
import BrizxRecommendationSection from '../../components/seeker/BrizxRecommendationSection';

import char1 from '../../assets/images/hero_char_f1_1788108183066.jpg';
import char2 from '../../assets/images/hero_char_m1_1788108202530.jpg';
import char3 from '../../assets/images/hero_char_f2_1788108218132.jpg';
import char4 from '../../assets/images/hero_char_m2_1788142584544.jpg';
import char5 from '../../assets/images/seeker_hero_f1_1788143155499.jpg';
import char6 from '../../assets/images/16x9/char_16x9_6.jpg';
import char7 from '../../assets/images/16x9/char_16x9_7.jpg';
import char8 from '../../assets/images/16x9/char_16x9_8.jpg';
import char9 from '../../assets/images/16x9/char_16x9_9.jpg';
import char10 from '../../assets/images/16x9/char_16x9_10.jpg';

interface ShowcaseSlide {
  id: string;
  image: string;
}

const heroSlides: ShowcaseSlide[] = [
  { id: 'slide-1', image: char1 },
  { id: 'slide-2', image: char2 },
  { id: 'slide-3', image: char3 },
  { id: 'slide-4', image: char4 },
  { id: 'slide-5', image: char5 },
  { id: 'slide-6', image: char6 },
  { id: 'slide-7', image: char7 },
  { id: 'slide-8', image: char8 },
  { id: 'slide-9', image: char9 },
  { id: 'slide-10', image: char10 },
];

export default function SeekerDashboard() {
  const { user } = useAuth();
  const { seekers, brands, meetings, notifications, markNotificationRead } = useData();

  const currentSeeker = (user && user.role === 'FRANCHISE_SEEKER' ? {
    ...((user?.id && seekers.find(s => s.id === user.id)) || {}),
    ...user
  } as any : null)
    || (user?.id && seekers.find(s => s.id === user.id))
    || (user?.email && seekers.find(s => s.email?.toLowerCase() === user.email.toLowerCase()))
    || {
      id: user?.id || 'seeker_anon',
      name: user?.name || 'Franchise Seeker',
      email: user?.email || '',
      phone: (user as any)?.phone || '',
      city: (user as any)?.city || '',
      avatar: user?.avatar || (user as any)?.avatar,
      investment: 25,
      role: 'FRANCHISE_SEEKER'
    };
  const upcomingMeetings = meetings.filter(m => m.seekerId === currentSeeker.id && (m.status === 'CONFIRMED' || m.status === 'PENDING'));
  const unlockedBy = brands.filter(b => (b.unlockedLeads || []).includes(currentSeeker.id));
  const savedBrandIds = currentSeeker.savedBrandIds || [];
  const savedBrands = brands.filter(b => savedBrandIds.includes(b.id));

  const [activeTab, setActiveTab] = useState<'MATCHES' | 'SAVED'>('MATCHES');
  const [showToast, setShowToast] = useState('');

  // Character Visual Showcase State (10 unique character visuals)
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  // Smooth Auto-rotation every 4.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCharIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handlePrevChar = () => {
    setCurrentCharIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNextChar = () => {
    setCurrentCharIndex((prev) => (prev + 1) % heroSlides.length);
  };

  const handleSelectChar = (index: number) => {
    setCurrentCharIndex(index);
  };

  // Top AI Smart Matches
  const matchedBrands = brands.map(b => ({
    ...b,
    matchScore: calculateMatchScore(currentSeeker, b)
  })).sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return (b.matchScore || 0) - (a.matchScore || 0);
  });

  const top3Matches = matchedBrands.slice(0, 3);

  // Profile completion calculation
  const getProfileCompletion = () => {
    let score = 30; 
    if (currentSeeker.phone && currentSeeker.phone !== '') score += 15;
    if (currentSeeker.city && currentSeeker.city !== '') score += 15;
    if (currentSeeker.investment && currentSeeker.investment > 0) score += 20;
    if (currentSeeker.industry && currentSeeker.industry !== '') score += 20;
    return score;
  };
  const completionPct = getProfileCompletion();

  const myAlerts = notifications.filter(n => n.userId === currentSeeker.id && !n.read).slice(0, 3);

  const handleMarkRead = (id: string) => {
    markNotificationRead(id);
    setShowToast('Notification marked read.');
    setTimeout(() => setShowToast(''), 3000);
  };

  const applicationStatus = currentSeeker.applicationStatus || (currentSeeker.verified ? 'APPROVED' : 'PENDING_REVIEW');
  const rejectionReason = currentSeeker.rejectionReason;

  return (
    <div className="w-full bg-[#F4F7FB] min-h-screen text-slate-900 animate-fadeIn">
      
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-24 right-6 bg-slate-900 text-white border border-blue-100 rounded-2xl px-4 py-3 text-xs font-bold flex items-center gap-2 shadow-xl z-50 animate-fadeIn">
          <Sparkles className="text-blue-400" size={14} />
          <span>{showToast}</span>
        </div>
      )}

      {/* Profile Application Status Banner */}
      {(applicationStatus === 'PENDING_REVIEW' || applicationStatus === 'UNDER_REVIEW') && (
        <div className="bg-amber-500 text-white px-6 py-4 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-600/50 rounded-xl">
              <ShieldAlert size={20} className="text-amber-100" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-amber-100">Verification In Progress</div>
              <p className="text-sm font-bold">
                Your profile has been submitted successfully and is currently under verification by the BrizX India team.
              </p>
            </div>
          </div>
          <Link 
            to="/seeker/profile"
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
              <ShieldAlert size={20} className="text-rose-100" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-rose-200">Application Status: Action Required</div>
              <p className="text-sm font-bold">
                Your application needs updates: {rejectionReason || 'Please review your uploaded documents and details.'}
              </p>
            </div>
          </div>
          <Link 
            to="/register"
            className="px-4 py-2 bg-white text-rose-900 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-rose-100 transition-all shrink-0"
          >
            Update & Re-submit Profile
          </Link>
        </div>
      )}

      {applicationStatus === 'DRAFT' && (
        <div className="bg-blue-600 text-white px-6 py-4 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-700 rounded-xl">
              <FileText size={20} className="text-blue-100" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-blue-200">Registration Status: DRAFT ({currentSeeker.completionPercentage || 50}% Complete)</div>
              <p className="text-sm font-bold">
                Your registration application is saved as a draft. Complete remaining sections to submit for review.
              </p>
            </div>
          </div>
          <Link 
            to="/register"
            className="px-4 py-2 bg-white text-blue-900 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-blue-100 transition-all shrink-0"
          >
            Resume Registration
          </Link>
        </div>
      )}

      {/* 16:9 Full-Width Edge-to-Edge Hero Section with 10 Animated Character Visuals */}
      <div className="w-full relative aspect-[16/9] overflow-hidden bg-neutral-900 group select-none shadow-md">
        
        {/* Rotating 10 Unique AI-Generated Character Visuals (1 visible at a time) */}
        {heroSlides.map((slide, idx) => {
          const isActive = idx === currentCharIndex;
          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-all duration-1000 ease-out ${
                isActive 
                  ? 'opacity-100 scale-100 z-10 pointer-events-auto' 
                  : 'opacity-0 scale-105 pointer-events-none z-0'
              }`}
            >
              <img
                src={slide.image}
                alt="Franchise Spotlight"
                className="w-full h-full aspect-[16/9] object-cover object-center"
                referrerPolicy="no-referrer"
              />

              {/* Subtle neutral gradient overlays for text legibility with absolutely NO blue color theme. Images remain clear, sharp, and bright */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </div>
          );
        })}

        {/* Hero Interactive Content Overlay Layer */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-3.5 sm:p-6 md:p-8 lg:p-10 xl:p-12 text-white">
          
          {/* Top Row: System Tag + Active Investor Spotlight Counter */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/15 text-white text-[8px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest border border-white/20 backdrop-blur-md shadow-xs">
                <Sparkles size={11} className="fill-current text-amber-400" />
                <span>Seeker Console</span>
              </span>
              <span className="hidden xs:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-[8px] sm:text-[9px] font-black uppercase tracking-wider border border-emerald-400/30 backdrop-blur-md">
                <ShieldCheck size={11} className="text-emerald-300" /> AI Match Active
              </span>
            </div>

            {/* Slide Index Badge & Spotlight Indicator */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-neutral-200">
                Spotlight {String(currentCharIndex + 1).padStart(2, '0')}/{String(heroSlides.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Middle Content: Responsive Typography, Headings & CTAs */}
          <div className="space-y-1.5 sm:space-y-3 md:space-y-4 max-w-2xl">
            
            <div className="space-y-0.5 sm:space-y-1">
              <h1 className="text-base sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md font-heading">
                Welcome back, {currentSeeker.name.split(' ')[0]}
              </h1>
              <p className="text-neutral-200 text-[9px] sm:text-xs md:text-sm lg:text-base leading-relaxed max-w-xl font-normal line-clamp-1 sm:line-clamp-2 md:line-clamp-3">
                Matching your <strong className="text-white font-bold">₹{currentSeeker.investment} Lakhs</strong> capital budget against verified Indian retail, QSR, and service franchises with AI-driven precision.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 pt-0.5 sm:pt-1">
              <Link
                to="/seeker/browse-brands"
                className="px-3 py-1.5 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-white text-neutral-950 hover:bg-neutral-100 rounded-xl sm:rounded-2xl text-[9px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest transition-all shadow-md flex items-center gap-1 sm:gap-2 cursor-pointer active:scale-95"
              >
                Explore Brands <ArrowRight size={13} className="shrink-0" />
              </Link>
              <Link
                to="/seeker/roi-calculator/advanced"
                className="px-3 py-1.5 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-xl sm:rounded-2xl text-[9px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest transition-all border border-white/25 flex items-center gap-1 sm:gap-2 cursor-pointer active:scale-95"
              >
                ROI Tools <Calculator size={13} className="shrink-0" />
              </Link>
            </div>

            {/* Trust highlights (visible on md screens and up) */}
            <div className="hidden md:grid grid-cols-3 gap-3 pt-2 sm:pt-3 border-t border-white/15 max-w-lg">
              <div>
                <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider text-neutral-300 font-bold">Verified Brands</span>
                <span className="text-xs sm:text-sm font-black text-white">100% Vetted</span>
              </div>
              <div>
                <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider text-neutral-300 font-bold">Matching Rate</span>
                <span className="text-xs sm:text-sm font-black text-white">98% Accuracy</span>
              </div>
              <div>
                <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider text-neutral-300 font-bold">Direct Access</span>
                <span className="text-xs sm:text-sm font-black text-white">Founder Dial</span>
              </div>
            </div>

          </div>

          {/* Bottom Bar: 10 Carousel Indicators & Navigation Arrows */}
          <div className="flex items-center justify-between pt-1">
            
            {/* 10 Carousel Dots */}
            <div className="flex items-center gap-1 sm:gap-1.5 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectChar(i)}
                  className={`h-1 sm:h-1.5 rounded-full transition-all cursor-pointer ${
                    i === currentCharIndex
                      ? 'bg-white w-3 sm:w-5 shadow-xs'
                      : 'bg-white/35 hover:bg-white/70 w-1 sm:w-1.5'
                  }`}
                  aria-label={`View investor slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next Nav Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevChar}
                className="p-1 sm:p-2 rounded-lg sm:rounded-xl bg-black/30 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer active:scale-95"
                aria-label="Previous investor visual"
              >
                <ChevronLeft size={14} className="sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={handleNextChar}
                className="p-1 sm:p-2 rounded-lg sm:rounded-xl bg-black/30 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer active:scale-95"
                aria-label="Next investor visual"
              >
                <ChevronRight size={14} className="sm:w-4 sm:h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Main Body Content with Spacing and Layout */}
      <div className="w-full p-4 sm:p-6 md:p-8 space-y-8">

      {/* BENTO GRID: STATS & ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* WIDGET 1: PROFILE COMPLETION (Lg:4) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-blue-100 shadow-sm space-y-5">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Setup Metrics</span>
            <span className="text-xs font-black text-blue-600">{completionPct}% Complete</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700">Profile Authentication</span>
              <span className="text-emerald-600 flex items-center gap-1"><CheckCircle size={14} /> Active</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${completionPct}%` }}
              ></div>
            </div>

            <p className="text-[11px] text-slate-500 leading-normal font-medium">
              Your investor status is <strong className="text-slate-800">100% verified</strong>. Fill out your Document Vault to share certificates instantly with brand developers.
            </p>

            <Link 
              to="/seeker/profile"
              className="inline-flex items-center gap-1 text-[11px] font-black text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Verify KYC Documents <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* WIDGET 2: BUDGET & ALLOCATION TRACKER (Lg:4) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-blue-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Investment Summary</span>
            <span className="bg-blue-50 text-blue-700 text-[10px] px-2.5 py-1 rounded-full font-black">₹{currentSeeker.investment}L Capital</span>
          </div>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
                <span className="text-slate-500">Allocated Setup Capex (Estimated)</span>
                <span className="text-slate-900 font-bold">₹18.5 Lakhs</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-slate-800 h-2 rounded-full" style={{ width: '74%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
                <span className="text-slate-500">Working Capital Reserve</span>
                <span className="text-emerald-600 font-bold">₹6.5 Lakhs</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '26%' }}></div>
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-2xl text-[11px] text-blue-900 flex items-start gap-2 border border-blue-100">
              <ShieldAlert size={15} className="text-blue-600 shrink-0 mt-0.5" />
              <span>We advise setting aside 20-30% of total capital as reserve working capital.</span>
            </div>
          </div>
        </div>

        {/* WIDGET 3: PREMIUM MEMBERSHIP STATUS (Lg:4) */}
        <div className="lg:col-span-4 bg-gradient-to-br from-blue-50/80 via-white to-blue-50/40 text-slate-900 rounded-3xl p-6 border border-blue-200 flex flex-col justify-between space-y-4 shadow-sm">
          <div>
            <div className="flex justify-between items-center border-b border-blue-100 pb-3">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Membership Status</span>
              {currentSeeker.isPremium ? (
                <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Crown size={12} className="fill-current text-amber-300" /> VIP ELITE
                </span>
              ) : (
                <span className="bg-slate-100 text-slate-700 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-slate-200">
                  FREE TRIAL
                </span>
              )}
            </div>

            <div className="pt-3 space-y-1">
              <h4 className="font-black text-slate-900 text-base flex items-center gap-1.5">
                {currentSeeker.isPremium ? 'Seeker Elite VIP Active' : 'Basic Tier Account'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {currentSeeker.isPremium 
                  ? 'Unlocked priority matching, FDD reports, and direct founder phone dial connections.' 
                  : 'Upgrade to Elite to unlock verified founder numbers and legal draft downloads.'}
              </p>
            </div>
          </div>

          <Link 
            to="/seeker/premium"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-sm shadow-blue-200"
          >
            {currentSeeker.isPremium ? 'Manage Membership' : 'Upgrade to Elite VIP'}
          </Link>
        </div>

      </div>

      {/* LAYOUT: RECENT ALERTS & MEETINGS SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COMPONENT: RECENT NOTIFICATIONS FEED (Lg:5) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-blue-100 shadow-sm space-y-5">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <Bell size={16} className="text-blue-600" /> Recent Actionable Alerts ({myAlerts.length})
            </h3>
            <Link to="/seeker/notifications" className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-widest">
              See All
            </Link>
          </div>

          <div className="space-y-3.5">
            {myAlerts.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center font-medium">No new pending alerts. You are completely caught up!</p>
            ) : (
              myAlerts.map(alert => (
                <div key={alert.id} className="p-3.5 bg-blue-50/40 rounded-2xl border border-blue-100 flex items-start gap-3 justify-between">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-xs">{alert.title}</h4>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{alert.message}</p>
                  </div>
                  <button 
                    onClick={() => handleMarkRead(alert.id)}
                    className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg cursor-pointer shrink-0"
                    title="Mark Read"
                  >
                    <CheckCheck size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COMPONENT: UPCOMING MEETINGS WIDGET (Lg:7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm space-y-5">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <Calendar size={16} className="text-blue-600" /> Confirmed Strategy Sessions ({upcomingMeetings.length})
            </h3>
            <Link to="/seeker/meetings" className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-widest">
              Manage Slots
            </Link>
          </div>

          <div className="space-y-3.5">
            {upcomingMeetings.length === 0 ? (
              <div className="p-8 text-center space-y-2 bg-slate-50 rounded-2xl border border-slate-200">
                <Calendar size={24} className="mx-auto text-blue-500" />
                <h4 className="text-xs font-bold text-slate-900">No pending meetings schedule</h4>
                <p className="text-[11px] text-slate-500">Request a meeting slot directly from any brand profile page.</p>
              </div>
            ) : (
              upcomingMeetings.map(meeting => (
                <div key={meeting.id} className="p-4 bg-slate-50 border border-blue-100 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex flex-col items-center justify-center text-xs shrink-0 shadow-sm font-black">
                      <span className="text-[9px] uppercase text-blue-200 leading-none">{new Date(meeting.date).toLocaleString('default', { month: 'short' })}</span>
                      <span className="leading-none mt-1 text-sm font-black">{new Date(meeting.date).getDate() || '15'}</span>
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-xs">{meeting.brandName}</h4>
                      <p className="text-[11px] text-slate-500 font-semibold">{meeting.time || '11:00 AM IST'} • Google Meet Video Call</p>
                    </div>
                  </div>

                  <Link 
                    to="/seeker/meetings"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl uppercase tracking-wider flex items-center gap-1 shadow-sm"
                  >
                    View Slot <ChevronRight size={12} />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* RECOMMENDED & SAVED BRANDS TOGGLER DECK */}
      <BrizxRecommendationSection seeker={currentSeeker} brands={brands} />

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('MATCHES')}
              className={`pb-2.5 text-sm font-black uppercase tracking-wider transition-all relative cursor-pointer ${
                activeTab === 'MATCHES' ? 'text-blue-700 font-black' : 'text-slate-400 font-semibold hover:text-slate-600'
              }`}
            >
              Smart AI Recommendations ({top3Matches.length})
              {activeTab === 'MATCHES' && <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full"></span>}
            </button>
            
            <button
              onClick={() => setActiveTab('SAVED')}
              className={`pb-2.5 text-sm font-black uppercase tracking-wider transition-all relative cursor-pointer ${
                activeTab === 'SAVED' ? 'text-blue-700 font-black' : 'text-slate-400 font-semibold hover:text-slate-600'
              }`}
            >
              Saved Wishlist ({savedBrands.length})
              {activeTab === 'SAVED' && <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full"></span>}
            </button>
          </div>

          <Link
            to="/seeker/browse-brands"
            className="text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-wider flex items-center gap-1 self-start sm:self-auto"
          >
            Browse Brand Directory ({brands.length}) <ArrowRight size={14} />
          </Link>
        </div>

        {/* Display Content */}
        {activeTab === 'MATCHES' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {top3Matches.map(b => {
              const cover = b.coverImage || 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80';
              return (
                <div key={b.id} className="bg-white rounded-3xl border border-blue-100/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
                  <div>
                    {/* Brand Banner Image */}
                    <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={cover}
                        alt={b.brandName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />

                      {/* Match Score Badge */}
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                        <Sparkles size={11} className="fill-current text-blue-600" />
                        <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider">{b.matchScore}% Match</span>
                      </div>

                      {/* Overlay Brand Logo */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-end gap-2.5 z-10">
                        <BrandLogo
                          logo={b.logo}
                          brandName={b.brandName}
                          industry={b.industry}
                          verified={b.verified}
                          size="md"
                          className="shadow-lg ring-2 ring-white shrink-0"
                        />
                        <div className="text-white drop-shadow-md min-w-0">
                          <Link to={`/brands/${b.id}`} state={{ from: '/seeker' }}>
                            <h4 className="font-extrabold text-white text-base leading-tight hover:text-blue-200 transition-colors line-clamp-1">
                              {b.brandName}
                            </h4>
                          </Link>
                          <p className="text-[10px] font-bold text-blue-200 uppercase tracking-wider mt-0.5 line-clamp-1">
                            {b.industry}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[11px] font-semibold text-slate-500">Payback Period:</span>
                        <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {b.roiPayback || '12-18 Mos'}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex justify-between text-xs font-bold text-slate-700">
                        <span>Capex: ₹{b.investmentRequired.min}-{b.investmentRequired.max}L</span>
                        <span>{b.totalOutlets || 50}+ Outlets</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <Link
                      to={`/brands/${b.id}`}
                      state={{ from: '/seeker' }}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider text-center cursor-pointer transition-colors block shadow-sm shadow-blue-100"
                    >
                      Inquire & Express Interest
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            {savedBrands.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 font-medium">
                No saved wishlist brands yet. Browse the directory and click the bookmarked star icons!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {savedBrands.slice(0, 3).map(b => {
                  const cover = b.coverImage || 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80';
                  return (
                    <div key={b.id} className="bg-white rounded-3xl border border-blue-100/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
                      <div>
                        {/* Brand Banner Image */}
                        <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
                          <img
                            src={cover}
                            alt={b.brandName}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />

                          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md p-1.5 rounded-full shadow-md">
                            <Bookmark size={14} className="text-blue-600 fill-blue-600" />
                          </div>

                          <div className="absolute bottom-3 left-3 right-3 flex items-end gap-2.5 z-10">
                            <BrandLogo
                              logo={b.logo}
                              brandName={b.brandName}
                              industry={b.industry}
                              verified={b.verified}
                              size="md"
                              className="shadow-lg ring-2 ring-white shrink-0"
                            />
                            <div className="text-white drop-shadow-md min-w-0">
                              <Link to={`/brands/${b.id}`} state={{ from: '/seeker' }}>
                                <h4 className="font-extrabold text-white text-base leading-tight hover:text-blue-200 transition-colors line-clamp-1">
                                  {b.brandName}
                                </h4>
                              </Link>
                              <p className="text-[10px] font-bold text-blue-200 uppercase tracking-wider mt-0.5 line-clamp-1">
                                {b.industry}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-5 space-y-3">
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{b.tagline || b.description}</p>

                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex justify-between text-xs font-bold text-slate-700">
                            <span>Capex: ₹{b.investmentRequired.min}-{b.investmentRequired.max}L</span>
                            <span className="text-emerald-700 font-extrabold">Payback: {b.roiPayback || '12-18 Mos'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 pt-0">
                        <Link
                          to="/seeker/saved-brands"
                          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider text-center cursor-pointer transition-colors block shadow-sm shadow-blue-100"
                        >
                          Audit & Compare Wishlist
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      </div>

    </div>
  );
}

