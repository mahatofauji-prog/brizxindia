import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Link, useParams } from 'react-router';
import { 
  Building2, Sparkles, CheckCircle2, Clock, ShieldCheck, ArrowRight, 
  MapPin, IndianRupee, MessageSquare, Calendar, Search, ChevronRight,
  XCircle, CheckCircle, Phone, Mail, Award, Target, TrendingUp, AlertCircle
} from 'lucide-react';
import { ConnectionStatus } from '../../types';
import { BrandLogo } from '../../components/BrandLogo';
import { SeekerHero } from '../../components/seeker/SeekerHero';
import { seekerTheme } from '../../theme/seekerTheme';

export default function SeekerConnections() {
  const { user } = useAuth();
  const { seekers, brands, connectionRequests } = useData();
  const { connectionId } = useParams<{ connectionId?: string }>();

  const currentSeeker = seekers.find(s => s.id === user?.id) || seekers[0];
  const myRequests = connectionRequests.filter(cr => cr.seekerId === currentSeeker.id || cr.seekerEmail === user?.email);

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredRequests = myRequests.filter(req => {
    if (connectionId && req.id === connectionId) return true;
    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
    const matchesSearch = req.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.industry.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: ConnectionStatus) => {
    switch (status) {
      case 'PENDING':
      case 'REQUEST_SENT':
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[10px] font-black uppercase rounded-full flex items-center gap-1">
            <Clock size={12} /> Pending Approval
          </span>
        );
      case 'AWAITING_RESPONSE':
      case 'BRAND_REVIEWING':
        return (
          <span className="px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-black uppercase rounded-full flex items-center gap-1">
            <Clock size={12} className="animate-pulse" /> Under Review
          </span>
        );
      case 'ACCEPTED':
      case 'CONNECTED':
        return (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-black uppercase rounded-full flex items-center gap-1">
            <CheckCircle2 size={12} /> Connected
          </span>
        );
      case 'DECLINED':
      case 'CLOSED':
        return (
          <span className="px-3 py-1 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase rounded-full flex items-center gap-1">
            <XCircle size={12} /> Request Declined
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-slate-100 text-slate-700 text-[10px] font-black uppercase rounded-full">
            {status}
          </span>
        );
    }
  };

  const getStatusDescription = (status: ConnectionStatus, brandName: string) => {
    switch (status) {
      case 'PENDING':
      case 'REQUEST_SENT':
        return {
          title: 'Pending',
          message: `Your franchise connection request has been sent successfully to ${brandName}. The brand team is currently reviewing your investor profile.`,
          step: 1
        };
      case 'AWAITING_RESPONSE':
      case 'BRAND_REVIEWING':
        return {
          title: 'Under Review',
          message: `${brandName} is currently evaluating your profile, checking territory availability, and preparing initial investment proposal details.`,
          step: 2
        };
      case 'ACCEPTED':
      case 'CONNECTED':
        return {
          title: 'Connected',
          message: `Congratulations! ${brandName} decision maker has accepted your connection request. You can now schedule a call or start a direct conversation.`,
          step: 4
        };
      case 'DECLINED':
      case 'CLOSED':
        return {
          title: 'Request Declined',
          message: `${brandName} is currently not accepting new franchise locations in your preferred region at this time.`,
          step: 0
        };
      default:
        return {
          title: 'In Progress',
          message: `Your connection request for ${brandName} is active in our system.`,
          step: 1
        };
    }
  };

  return (
    <div className="w-full p-4 sm:p-6 md:p-8 space-y-8 bg-[#F4F7FB] min-h-screen text-slate-900">
      {/* Header Banner */}
      <SeekerHero
        pageKey="myConnections"
        badgeText="Seeker Connection Hub"
        title="My Matched Brand Connections"
        description="Track all your active franchise connection requests, review AI match reports, and manage discussions with verified brand decision makers."
      />

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-6 border border-blue-100/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search connections by brand or industry..."
            className="w-full bg-slate-50/70 border border-blue-100 rounded-2xl pl-11 pr-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-500 shrink-0">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50/70 border border-blue-100 rounded-xl px-4 py-2.5 text-xs font-bold text-blue-700 outline-none focus:border-blue-500 focus:bg-white cursor-pointer transition-all"
          >
            <option value="ALL">All Requests ({myRequests.length})</option>
            <option value="REQUEST_SENT">Request Sent</option>
            <option value="BRAND_REVIEWING">Under Review</option>
            <option value="ACCEPTED">Connected</option>
            <option value="DECLINED">Declined</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-blue-100/80 shadow-xs space-y-4">
          <Building2 size={48} className="mx-auto text-blue-300" />
          <h3 className="text-xl font-black text-slate-900">No Connection Requests Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You haven't requested any brand connections yet, or no requests match your filter.
          </p>
          <Link
            to="/seeker/browse-brands"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
          >
            BROWSE VERIFIED BRANDS <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredRequests.map((req) => {
            const matchingBrand = brands.find(b => b.id === req.brandId);
            const statusInfo = getStatusDescription(req.status, req.brandName);

            return (
              <div
                key={req.id}
                className="bg-white rounded-3xl p-6 md:p-8 border border-blue-100/80 shadow-xs space-y-6"
              >
                {/* Brand Details Card Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-blue-50">
                  <div className="flex items-center gap-4">
                    <BrandLogo
                      logo={matchingBrand?.logo || req.brandLogo}
                      brandName={req.brandName}
                      industry={matchingBrand?.industry || req.industry}
                      verified={matchingBrand?.verified ?? true}
                      size="lg"
                      className="shadow-sm ring-2 ring-white shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-2xl font-black text-slate-900 leading-snug">{req.brandName}</h3>
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase rounded-md border border-emerald-200 flex items-center gap-1">
                          <ShieldCheck size={12} /> VERIFIED BRAND
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
                        <span className="font-bold text-slate-700">{req.industry}</span>
                        <span>•</span>
                        <span>Requested: {new Date(req.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-3.5 py-1.5 bg-blue-50 text-blue-700 text-xs font-black rounded-xl border border-blue-200 flex items-center gap-1.5 shadow-xs">
                      <Sparkles size={14} /> {req.matchScore}% AI MATCH
                    </span>
                    {getStatusBadge(req.status)}
                  </div>
                </div>

                {/* Connection Status Pipeline Progress Bar */}
                <div className="bg-slate-50/70 p-5 rounded-2xl border border-blue-50 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Clock size={14} className="text-blue-600" /> Connection Pipeline
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      Current Status: <strong className="text-blue-600 uppercase">{statusInfo.title}</strong>
                    </span>
                  </div>

                  {/* Visual Steps */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-[11px] font-bold">
                    <div className={`p-3 rounded-xl border ${statusInfo.step >= 1 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-white border-slate-200 text-slate-400'}`}>
                      <span className="block mb-0.5">✓ Step 1</span>
                      <span>Request Sent</span>
                    </div>

                    <div className={`p-3 rounded-xl border ${statusInfo.step >= 2 ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-white border-slate-200 text-slate-400'}`}>
                      <span className="block mb-0.5">{statusInfo.step >= 2 ? '✓ Step 2' : '○ Step 2'}</span>
                      <span>Brand Reviewing</span>
                    </div>

                    <div className={`p-3 rounded-xl border ${statusInfo.step >= 3 ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-white border-slate-200 text-slate-400'}`}>
                      <span className="block mb-0.5">{statusInfo.step >= 3 ? '✓ Step 3' : '○ Step 3'}</span>
                      <span>Brand Response</span>
                    </div>

                    <div className={`p-3 rounded-xl border ${statusInfo.step >= 4 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-white border-slate-200 text-slate-400'}`}>
                      <span className="block mb-0.5">{statusInfo.step >= 4 ? '✓ Step 4' : '○ Step 4'}</span>
                      <span>Connected</span>
                    </div>
                  </div>

                  {/* Status explanation alert */}
                  <div className="p-3.5 bg-white border border-blue-100 rounded-xl text-xs text-slate-700 font-medium leading-relaxed flex items-start gap-2.5">
                    <AlertCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
                    <div>{statusInfo.message}</div>
                  </div>
                </div>

                {/* Key Financials & Parameters Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50/70 p-4 rounded-2xl border border-blue-50 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Brand Investment</span>
                    <span className="font-black text-blue-700 text-sm">{req.investmentRequired}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Your Available Capital</span>
                    <span className="font-black text-slate-900 text-sm">{req.availableInvestment}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Preferred Location</span>
                    <span className="font-black text-slate-900 text-sm">{req.preferredLocation}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Payback Period</span>
                    <span className="font-black text-emerald-600 text-sm">{req.expectedPayback || '12–18 Months'}</span>
                  </div>
                </div>

                {/* YOUR MATCH Compatibility Section */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Target size={14} className="text-blue-600" /> YOUR MATCH COMPATIBILITY
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-blue-50/50 p-3.5 rounded-2xl border border-blue-100 space-y-1">
                      <span className="text-[10px] font-bold text-blue-600 uppercase block">Investment Compatibility</span>
                      <p className="text-xs font-bold text-slate-800">
                        {req.availableInvestment} fits required {req.investmentRequired}
                      </p>
                    </div>

                    <div className="bg-blue-50/50 p-3.5 rounded-2xl border border-blue-100 space-y-1">
                      <span className="text-[10px] font-bold text-blue-600 uppercase block">Location Compatibility</span>
                      <p className="text-xs font-bold text-slate-800">
                        Territory available in {req.preferredLocation}
                      </p>
                    </div>

                    <div className="bg-blue-50/50 p-3.5 rounded-2xl border border-blue-100 space-y-1">
                      <span className="text-[10px] font-bold text-blue-600 uppercase block">Industry Compatibility</span>
                      <p className="text-xs font-bold text-slate-800">
                        High demand for {req.industry}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-blue-50">
                  <div className="text-xs text-slate-500 font-medium">
                    Assigned BrizX Advisor is actively monitoring this connection request.
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {req.status === 'ACCEPTED' || req.status === 'CONNECTED' ? (
                      <>
                        <a
                          href={`https://wa.me/919979510361?text=Hi%20BrizX,%20I%20am%20connected%20with%20${encodeURIComponent(req.brandName)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Phone size={14} /> Contact Brand
                        </a>
                        <Link
                          to="/seeker/meetings"
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Calendar size={14} /> Schedule Meeting
                        </Link>
                      </>
                    ) : req.status === 'DECLINED' ? (
                      <Link
                        to="/seeker/browse-brands"
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        Explore Similar Brands <ChevronRight size={14} />
                      </Link>
                    ) : (
                      <>
                        {matchingBrand && (
                          <Link
                            to={`/brands/${matchingBrand.id}`}
                            state={{ from: '/seeker/connections' }}
                            className="flex-1 sm:flex-none px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-center"
                          >
                            View Brand Details
                          </Link>
                        )}
                        <Link
                          to="/seeker/browse-brands"
                          className="flex-1 sm:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs text-center flex items-center justify-center gap-1"
                        >
                          Explore More Brands <ChevronRight size={14} />
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
