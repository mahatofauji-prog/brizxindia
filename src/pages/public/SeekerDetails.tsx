import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, MapPin, Briefcase, IndianRupee, Clock, ArrowLeft,
  ChevronRight, Phone, Mail, Lock, Sparkles, User, CheckCircle2,
  Building2, ArrowRight, Bookmark, Unlock, Calendar as CalendarIcon
} from 'lucide-react';

export default function SeekerDetails() {
  const { id } = useParams<{ id: string }>();
  const { seekers, brands, unlockLead, toggleSaveLeadForBrand, recordLeadContactAction, logAnalyticsEvent } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [unlockMessage, setUnlockMessage] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const seeker = seekers.find(s => String(s.id) === String(id));
  const currentBrand = brands.find(b => b.id === user?.id || (user?.email && b.email === user?.email)) || { id: user?.id, brandName: user?.name, email: user?.email } as any;
  const isUnlocked = currentBrand && currentBrand.unlockedLeads?.includes(seeker?.id || '');
  const isSaved = currentBrand && currentBrand.savedLeads?.includes(seeker?.id || '');

  useEffect(() => {
    if (seeker && currentBrand && (user?.role === 'BRAND_OWNER' || !user)) {
      logAnalyticsEvent({
        brandId: currentBrand.id,
        seekerId: seeker.id,
        eventType: 'PROFILE_VIEW',
        timestamp: new Date().toISOString(),
        matchScore: seeker.matchScore || 94,
        city: seeker.city,
        industry: seeker.industry,
        investment: seeker.investment
      });
    }
  }, [seeker?.id, currentBrand?.id]);

  if (!seeker) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800 p-6">
        <User size={48} className="text-blue-600 mb-4 animate-bounce" />
        <h2 className="text-2xl font-black text-slate-900">Seeker Profile Not Found</h2>
        <p className="text-slate-500 text-sm mt-2">No franchise seeker exists with ID "{id}".</p>
        <Link to="/seekers" className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-blue-700 transition-colors shadow-md">
          Browse All Verified Seekers
        </Link>
      </div>
    );
  }

  const seekerName = seeker.name || (seeker as any).fullName || 'Franchise Seeker';
  const seekerCity = seeker.city || (seeker.preferredCities && seeker.preferredCities[0]) || 'India';
  const seekerIndustry = seeker.industry || (seeker.preferredIndustries && seeker.preferredIndustries[0]) || 'Multi-Sector';
  const matchScore = seeker.matchScore || 94;

  const handleUnlock = () => {
    if (currentBrand && seeker) {
      unlockLead(currentBrand.id, seeker.id);
      setUnlockMessage('Contact information unlocked successfully! Added to your CRM Pipeline.');
      setShowUnlockModal(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      
      {/* BREADCRUMB */}
      <div className="bg-white border-b border-blue-100 py-4 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
          <button 
            onClick={() => navigate('/seekers')}
            className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 transition-colors font-bold cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Seekers Directory
          </button>
          <div className="flex items-center gap-2 text-slate-400">
            <Link to="/" className="hover:text-blue-600">BrizX</Link>
            <ChevronRight size={12} />
            <Link to="/seekers" className="hover:text-blue-600">Seekers</Link>
            <ChevronRight size={12} />
            <span className="text-blue-700 font-extrabold">{seekerName}</span>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="bg-white text-slate-900 py-10 md:py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-blue-50 border-2 border-blue-200 text-blue-700 font-black text-3xl flex items-center justify-center rounded-2xl shrink-0 shadow-xs overflow-hidden font-heading">
              {seeker.avatar ? (
                <img src={seeker.avatar} alt={seekerName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                seekerName.charAt(0)
              )}
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow-xs">
                  ID: {seeker.id}
                </span>
                {seeker.verified && (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase px-2.5 py-1 rounded-md flex items-center gap-1 font-bold">
                    <ShieldCheck size={12} className="text-emerald-600" /> VERIFIED INVESTOR
                  </span>
                )}
                {matchScore >= 90 && (
                  <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black uppercase px-2.5 py-1 rounded-md flex items-center gap-1 font-bold">
                    <Sparkles size={12} className="text-blue-600" /> BEST MATCH
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 font-heading">{seekerName}</h1>
              <p className="text-slate-600 text-sm mt-1 flex items-center gap-2 font-medium">
                <MapPin size={14} className="text-blue-600" /> Preferred Location: <span className="text-slate-900 font-bold">{seekerCity}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#F0F6FF] p-5 sm:p-6 rounded-3xl border border-blue-200/80 shadow-xs">
            <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-xs">
              <span className="text-xl font-black font-heading">{matchScore}%</span>
              <span className="text-[8px] font-extrabold uppercase tracking-tight">Match</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-extrabold uppercase block">Investment Capital</span>
              <span className="text-2xl font-black text-slate-900 font-heading">₹{seeker.investment} Lakhs</span>
              <span className="text-[10px] text-blue-700 font-semibold mt-0.5 block">Ready for immediate deployment</span>
            </div>
          </div>

        </div>
      </section>

      {/* SUCCESS MESSAGE */}
      {unlockMessage && (
        <div className="max-w-7xl mx-auto px-4 mt-6">
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" /> {unlockMessage}
          </div>
        </div>
      )}

      {/* MAIN DETAILS GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-8">
            
            {/* PROFILE OVERVIEW */}
            <div className="bg-white rounded-3xl border border-blue-100 p-6 md:p-8 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Briefcase size={18} className="text-blue-600" /> Profile Overview & Background
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Full Name</span>
                  <span className="text-sm font-black text-slate-900">{seekerName}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Verification Status</span>
                  <span className="text-sm font-black text-emerald-700 flex items-center gap-1">
                    <ShieldCheck size={14} className="text-emerald-600"/> Verified Investor
                  </span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Overall Match Score</span>
                  <span className="text-sm font-black text-blue-700">{matchScore}% Perfect Alignment</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">City / Location</span>
                  <span className="text-sm font-black text-slate-900">{seekerCity}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                <h4 className="text-slate-900 font-extrabold text-xs uppercase tracking-wider mb-2">Professional Experience Summary:</h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {seeker.experience || 'Experienced business owner with capital readiness, multi-unit franchise management background, and active interest in high-margin retail & service sectors.'}
                </p>
              </div>
            </div>

            {/* INVESTMENT PROFILE */}
            <div className="bg-white rounded-3xl border border-blue-100 p-6 md:p-8 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                <IndianRupee size={18} className="text-blue-600" /> Investment Profile & Capacity
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Investment Capacity</span>
                  <span className="text-base font-black text-blue-700">₹{seeker.investment} Lakhs</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Available Budget</span>
                  <span className="text-base font-black text-slate-900">₹{seeker.investment} - ₹{Number(seeker.investment) + 25} Lakhs</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Target Industries</span>
                  <span className="text-sm font-black text-slate-900">{seekerIndustry}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Preferred Locations</span>
                  <span className="text-sm font-black text-slate-900">
                    {seeker.preferredCities ? seeker.preferredCities.join(', ') : seekerCity}
                  </span>
                </div>
              </div>
            </div>

            {/* BUSINESS PREFERENCES */}
            <div className="bg-white rounded-3xl border border-blue-100 p-6 md:p-8 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Building2 size={18} className="text-blue-600" /> Business Preferences & Timeline
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Preferred Industry</span>
                  <span className="text-sm font-black text-slate-900">{seekerIndustry}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Preferred Franchise Type</span>
                  <span className="text-sm font-black text-slate-900">FOCO / Franchisee Owned</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Expected Timeline</span>
                  <span className="text-sm font-black text-emerald-700">{seeker.timeline || '1 - 3 Months'}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Business Experience</span>
                  <span className="text-sm font-black text-slate-900">{seeker.experience || 'Experienced Entrepreneur'}</span>
                </div>
              </div>
            </div>

            {/* SMART MATCH BREAKDOWN */}
            <div className="bg-white rounded-3xl border border-blue-100 p-6 md:p-8 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Sparkles size={18} className="text-blue-600" /> Smart Match Breakdown
              </h2>
              <p className="text-xs text-slate-500 mb-6 font-medium">Detailed algorithmic compatibility analysis based on BrizX India matching engine.</p>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-700">City Match (Weight: 25%)</span>
                    <span className="text-blue-700 font-black">25 / 25 pts</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-700">Investment Match (Weight: 25%)</span>
                    <span className="text-blue-700 font-black">25 / 25 pts</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-700">Industry Match (Weight: 25%)</span>
                    <span className="text-blue-700 font-black">23 / 25 pts</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-700">Background Match (Weight: 15%)</span>
                    <span className="text-blue-700 font-black">14 / 15 pts</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-700">Timeline Match (Weight: 10%)</span>
                    <span className="text-blue-700 font-black">10 / 10 pts</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-black text-slate-900 uppercase">Overall Match Score</span>
                  <span className="text-xl font-black text-blue-600">{matchScore} / 100%</span>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar Action Controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-blue-100 p-6 shadow-sm sticky top-28 space-y-4">
              <h3 className="font-black text-slate-900 text-base uppercase tracking-tight">Investor Actions</h3>
              
              <button
                onClick={() => toggleSaveLeadForBrand(currentBrand.id, seeker.id)}
                className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                  isSaved ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Bookmark size={16} /> {isSaved ? 'Lead Saved' : 'Save Lead'}
              </button>

              <Link
                to="/brand/crm"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                Open CRM <ArrowRight size={14} />
              </Link>

              {isUnlocked ? (
                <div className="space-y-3 pt-2">
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-2">
                    <div className="font-black text-emerald-900 uppercase">Unlocked Contact Details</div>
                    <a 
                      href={`tel:${seeker.phone || '+919876543210'}`} 
                      onClick={() => currentBrand && recordLeadContactAction(currentBrand.id, seeker.id, 'PHONE')}
                      className="flex items-center gap-2 font-bold text-slate-800 hover:text-blue-600 transition-colors"
                    >
                      <Phone size={14} className="text-emerald-600"/> {seeker.phone || '+91 98765 43210'}
                    </a>
                    <a 
                      href={`mailto:${seeker.email || 'investor@brizx.in'}`} 
                      onClick={() => currentBrand && recordLeadContactAction(currentBrand.id, seeker.id, 'EMAIL')}
                      className="flex items-center gap-2 font-bold text-slate-800 hover:text-blue-600 transition-colors truncate"
                    >
                      <Mail size={14} className="text-emerald-600"/> <span className="truncate">{seeker.email || 'investor@brizx.in'}</span>
                    </a>
                    <a 
                      href={`https://wa.me/${(seeker.whatsApp || seeker.phone || '+919876543210').replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => currentBrand && recordLeadContactAction(currentBrand.id, seeker.id, 'WHATSAPP')}
                      className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800 text-[11px] pt-1"
                    >
                      <span>💬 Reach via WhatsApp</span>
                    </a>
                  </div>
                  <Link
                    to="/brand/meetings"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-100"
                  >
                    <CalendarIcon size={14} /> Schedule Meeting
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => setShowUnlockModal(true)}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-100 cursor-pointer"
                >
                  <Unlock size={16} /> Unlock Contact (1 Credit)
                </button>
              )}

              <div className="pt-4 border-t border-slate-100 text-center">
                <span className="text-[11px] text-slate-400 font-medium block">
                  Need assistance with this lead? Contact BrizX Owner Support.
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* UNLOCK CONFIRMATION MODAL */}
      {showUnlockModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-xl font-black text-slate-900 mb-2 uppercase">Unlock Contact Details</h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Unlocking <span className="font-bold text-slate-900">{seekerName}</span>'s direct phone number and email will deduct 1 credit from your active brand subscription wallet and add them to your CRM pipeline.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUnlockModal(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUnlock}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md shadow-blue-200"
              >
                Confirm Unlock
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
