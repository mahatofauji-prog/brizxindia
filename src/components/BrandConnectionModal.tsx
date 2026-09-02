import React, { useState, useEffect } from 'react';
import { X, Sparkles, ShieldCheck, CheckCircle2, ArrowRight, Building2, MapPin, IndianRupee, Clock, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import { Brand } from '../types';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { BrandLogo } from './BrandLogo';

interface BrandConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: Brand | null;
  matchScore?: number;
}

export function BrandConnectionModal({ isOpen, onClose, brand, matchScore: overrideMatchScore }: BrandConnectionModalProps) {
  const { user, login } = useAuth();
  const { seekers, addConnectionRequest, hasConnectionRequest } = useData();
  const navigate = useNavigate();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authName, setAuthName] = useState('');
  const [authCity, setAuthCity] = useState('Bengaluru');
  const [authCapital, setAuthCapital] = useState('25');

  const currentSeeker = seekers.find(s => s.id === user?.id) || seekers[0];
  const isSeekerLoggedIn = user?.role === 'FRANCHISE_SEEKER';

  // Calculate default match score if not provided
  const matchScore = overrideMatchScore || (brand ? Math.min(98, Math.max(75, Math.round(85 + (brand.brandName.length * 2) % 12))) : 93);

  // Check if existing connection request exists
  const existingRequest = user && brand ? hasConnectionRequest(user.id, brand.id) : undefined;

  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setShowAuthForm(!isSeekerLoggedIn);
    }
  }, [isOpen, isSeekerLoggedIn]);

  if (!isOpen || !brand) return null;

  // Format brand investment text
  const getInvestmentText = () => {
    if (typeof brand.investmentRequired === 'object' && brand.investmentRequired !== null) {
      return `₹${brand.investmentRequired.min}–${brand.investmentRequired.max} Lakhs`;
    }
    const val = (brand as any).minInvestment || 15;
    return `₹${val}–${val * 2} Lakhs`;
  };

  const formattedInvestment = getInvestmentText();

  // User profile display values
  const seekerTargetSector = currentSeeker?.industry || brand.industry || 'Food & Beverages';
  const seekerCapital = currentSeeker?.investment ? `₹${currentSeeker.investment} Lakhs` : '₹25 Lakhs';
  const seekerLocation = currentSeeker?.city ? `${currentSeeker.city} / Tier-1 Cities` : 'Bengaluru / Outer Ring Road';

  // Dynamic why matched reasons
  const whyMatchedReasons = [
    `Your investment capacity (${seekerCapital}) fits the required capital range (${formattedInvestment}).`,
    `Your selected target industry (${seekerTargetSector}) directly matches ${brand.brandName}.`,
    `Territory availability confirmed in your preferred region (${seekerLocation}).`,
    `High alignment with ${brand.brandName}'s benchmark payback period (${brand.roiPayback || '12–18 Months'}).`
  ];

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) return;
    login(authEmail, 'FRANCHISE_SEEKER');
    setShowAuthForm(false);
  };

  const handleRequestConnection = () => {
    if (!isSeekerLoggedIn) {
      setShowAuthForm(true);
      return;
    }

    const seekerId = user?.id || currentSeeker.id;
    const seekerName = user?.name || currentSeeker.name || 'Franchise Seeker';
    const seekerEmail = user?.email || currentSeeker.email || 'seeker@brizx.in';

    addConnectionRequest({
      seekerId,
      seekerName,
      seekerEmail,
      seekerPhone: currentSeeker.phone || '+91 98765 43210',
      brandId: brand.id,
      brandName: brand.brandName,
      brandLogo: (brand as any).logo || '/file_00000000f5988211884f7bce5b4acfc8~2.jpg',
      industry: brand.industry,
      investmentRequired: formattedInvestment,
      expectedPayback: brand.roiPayback || '12–18 Months',
      activeOutlets: brand.totalOutlets || (brand as any).outletsCount || 50,
      matchScore,
      targetSector: seekerTargetSector,
      availableInvestment: seekerCapital,
      preferredLocation: seekerLocation,
      whyMatched: whyMatchedReasons,
      notes: `Requested via Brand Connection Portal for ${brand.brandName}.`
    });

    setIsSubmitted(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8"
        >
          {/* Top Header Banner */}
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white p-6 md:p-8 relative overflow-hidden">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 text-indigo-200 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer z-10"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-400/30 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5">
                <Sparkles size={12} /> BrizX AI Matching Engine
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-1 font-heading">
              {isSubmitted ? 'CONNECTION REQUEST SENT ✓' : `CONNECT WITH ${brand.brandName.toUpperCase()}`}
            </h2>
            <p className="text-indigo-200 text-xs md:text-sm font-medium">
              {isSubmitted
                ? `Your request has been successfully submitted to ${brand.brandName}.`
                : `You're a ${matchScore}% match for this high-yield franchise opportunity.`}
            </p>
          </div>

          {/* Modal Content */}
          <div className="p-6 md:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* SUCCESS STATE */}
            {isSubmitted ? (
              <div className="space-y-6 text-center py-2">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner border-4 border-emerald-200 dark:border-emerald-800 animate-bounce">
                  <CheckCircle2 size={44} />
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-left space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Selected Opportunity</span>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">{brand.brandName}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">AI Match Score</span>
                      <span className="px-3 py-1 bg-indigo-950 text-blue-400 text-xs font-black rounded-lg border border-blue-500/30">
                        {matchScore}% MATCH
                      </span>
                    </div>
                  </div>

                  {/* Connection Journey Visual Tracker */}
                  <div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-3">
                      Connection Journey Status
                    </span>
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-black uppercase">
                      <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs flex flex-col items-center justify-center gap-1">
                        <Check size={14} /> <span>1. Request Sent</span>
                      </div>
                      <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-xl border border-blue-300 dark:border-blue-700 flex flex-col items-center justify-center gap-1 animate-pulse">
                        <Clock size={14} /> <span>2. Under Review</span>
                      </div>
                      <div className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl flex flex-col items-center justify-center gap-1">
                        <span>3. Brand Responds</span>
                      </div>
                      <div className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl flex flex-col items-center justify-center gap-1">
                        <span>4. Connected</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      if (!user || user.role !== 'FRANCHISE_SEEKER') {
                        login(user?.email || authEmail || 'seeker@brizx.in', 'FRANCHISE_SEEKER');
                      }
                      onClose();
                      navigate('/seeker/connections');
                    }}
                    className="flex-1 py-3.5 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                  >
                    VIEW CONNECTION STATUS <ArrowRight size={16} />
                  </button>
                  <button
                    onClick={onClose}
                    className="py-3.5 px-6 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    BACK TO DISCOVER
                  </button>
                </div>
              </div>
            ) : showAuthForm ? (
              /* QUICK AUTHENTICATION STEP FOR GUESTS */
              <div className="space-y-6">
                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl flex items-start gap-3 text-amber-900 dark:text-amber-200 text-xs">
                  <AlertCircle size={18} className="shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div>
                    <strong className="font-bold block mb-0.5">Franchise Seeker Account Required</strong>
                    To connect directly with {brand.brandName}, please log in or create your Franchise Seeker profile below.
                  </div>
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="e.g. Rahul Verma"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="e.g. rahul@example.com"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target City</label>
                      <input
                        type="text"
                        value={authCity}
                        onChange={(e) => setAuthCity(e.target.value)}
                        placeholder="e.g. Bengaluru"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Investment Limit (Lakhs)</label>
                      <input
                        type="number"
                        value={authCapital}
                        onChange={(e) => setAuthCapital(e.target.value)}
                        placeholder="25"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md"
                    >
                      CONTINUE TO BRAND CONNECTION
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAuthForm(false)}
                      className="px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* MAIN BRAND CONNECTION PROMPT */
              <>
                {/* Brand Overview Card */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <BrandLogo
                      logo={brand.logo}
                      brandName={brand.brandName}
                      industry={brand.industry}
                      verified={brand.verified}
                      size="md"
                      className="shadow-sm ring-2 ring-white dark:ring-slate-700 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white leading-snug">{brand.brandName}</h3>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[9px] font-black uppercase rounded-md border border-emerald-300 dark:border-emerald-700 flex items-center gap-0.5">
                          <ShieldCheck size={10} /> VETTED
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{brand.industry}</span>
                    </div>
                  </div>

                  {/* AI Compatibility Circle/Badge */}
                  <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs shrink-0">
                    <div className="text-right">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Compatibility</span>
                      <span className="text-base font-black text-blue-600 dark:text-blue-400">{matchScore}% MATCH</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-md">
                      {matchScore}%
                    </div>
                  </div>
                </div>

                {/* Financial Metrics Bar */}
                <div className="grid grid-cols-3 gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Investment Required</span>
                    <span className="text-sm font-black text-blue-700 dark:text-blue-400">{formattedInvestment}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Expected Payback</span>
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{brand.roiPayback || '12–18 Mos'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Active Outlets</span>
                    <span className="text-sm font-black text-slate-800 dark:text-slate-200">{brand.totalOutlets || (brand as any).outletsCount || 50}+ Outlets</span>
                  </div>
                </div>

                {/* YOUR FRANCHISE PROFILE SECTION */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      Your Franchise Profile
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400">Auto-Matched from Profile</span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Target Sector</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200">{seekerTargetSector}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Available Capital</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200">{seekerCapital}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Preferred Location</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200">{seekerLocation}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Match Quality</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Excellent Match
                      </span>
                    </div>
                  </div>
                </div>

                {/* WHY THIS IS A MATCH SECTION */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Why You're Matched
                  </h4>
                  <div className="bg-blue-50/60 dark:bg-blue-950/30 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/50 space-y-2 text-xs">
                    {whyMatchedReasons.map((reason, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300 font-medium">
                        <CheckCircle2 size={14} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* EXISTING REQUEST STATE OR CONSENT + ACTION */}
                {existingRequest ? (
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
                      <Clock size={16} className="text-amber-600 shrink-0" />
                      <div>
                        <strong className="font-bold block">Connection Already Requested</strong>
                        <span>Status: {existingRequest.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (!user || user.role !== 'FRANCHISE_SEEKER') {
                          login(user?.email || authEmail || 'seeker@brizx.in', 'FRANCHISE_SEEKER');
                        }
                        onClose();
                        navigate('/seeker/connections');
                      }}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold uppercase rounded-xl transition-colors cursor-pointer shrink-0"
                    >
                      VIEW CONNECTION STATUS
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 space-y-4">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center italic">
                      By requesting a connection, you agree to share your franchise profile and contact details with {brand.brandName} for franchise discussion.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleRequestConnection}
                        className="flex-1 py-3.5 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                      >
                        REQUEST BRAND CONNECTION <ArrowRight size={16} />
                      </button>
                      <button
                        onClick={onClose}
                        className="py-3.5 px-6 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        GO BACK
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
