import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { FranchiseApplication, ApplicationStatus } from '../../types';
import { 
  FileText, Search, Filter, Phone, Mail, MapPin, 
  Building2, Calendar, CheckCircle2, Clock, UserCheck, 
  XCircle, ChevronRight, MessageSquare, AlertCircle, Eye, IndianRupee
} from 'lucide-react';

export default function BrandApplications() {
  const { user } = useAuth();
  const { applications, brands, updateApplicationStatus } = useData();
  const [searchParams] = useSearchParams();
  const appIdParam = searchParams.get('appId') || searchParams.get('id');

  // Find current user's brand ID
  const userBrandId = user?.brandId || user?.id || 'b1';
  const userBrand = brands.find(b => b.id === userBrandId || b.id === user?.brandId || b.id === user?.id || (user?.email && b.email === user?.email)) || { id: user?.id, brandName: user?.name, email: user?.email } as any;

  // Brand Owner can ONLY see applications for THEIR brand
  const brandApplications = applications.filter(a => 
    a.brandId === userBrandId || 
    a.brandId === userBrand.id ||
    (a.assignedBrandOwnerId && (a.assignedBrandOwnerId === userBrandId || a.assignedBrandOwnerId === userBrand.id)) ||
    a.brandName.toLowerCase() === (userBrand?.brandName || '').toLowerCase()
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedApp, setSelectedApp] = useState<FranchiseApplication | null>(null);

  useEffect(() => {
    if (appIdParam && brandApplications.length > 0) {
      const target = brandApplications.find(a => a.id === appIdParam);
      if (target) {
        setSelectedApp(target);
      }
    }
  }, [appIdParam, brandApplications]);

  const filteredApps = brandApplications.filter(app => {
    const matchesSearch = 
      (app.applicantName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.mobile || "").includes(searchTerm) ||
      (app.city || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.preferredLocation || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'NEW':
        return <span className="bg-blue-100 text-blue-800 border border-blue-200 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">New</span>;
      case 'CONTACTED':
        return <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">Contacted</span>;
      case 'UNDER_REVIEW':
        return <span className="bg-purple-100 text-purple-800 border border-purple-200 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">Under Review</span>;
      case 'APPROVED':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">Approved</span>;
      case 'REJECTED':
        return <span className="bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase text-blue-700 bg-blue-50 px-3 py-1 rounded-full w-fit mb-3">
            <Building2 size={14} /> Brand Owner Application Portal
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Franchise Applications for {userBrand?.brandName || 'Your Brand'}
          </h1>
          <p className="text-slate-500 text-xs md:text-sm mt-1">
            Review and manage inbound investor applications submitted directly to {userBrand?.brandName || 'your brand profile'}.
          </p>
        </div>

        <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-100 flex items-center gap-4 shrink-0">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase block">Total Received</span>
            <span className="text-2xl font-black text-blue-700">{brandApplications.length}</span>
          </div>
          <div className="h-8 w-px bg-blue-200" />
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase block">New Inquiries</span>
            <span className="text-2xl font-black text-emerald-600">
              {brandApplications.filter(a => a.status === 'NEW').length}
            </span>
          </div>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search applicant name, email, city..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:border-blue-600 outline-none transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {['ALL', 'NEW', 'CONTACTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Status' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Grid / Table */}
      {filteredApps.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
          <FileText size={48} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Applications Found</h3>
          <p className="text-slate-500 text-xs mt-1">
            No applicant records match your current filter criteria for {userBrand?.brandName}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => (
            <div 
              key={app.id} 
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-black text-slate-900 text-base">{app.applicantName}</h3>
                    <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                      <MapPin size={12} className="text-blue-600" /> {app.city}, {app.state}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {getStatusBadge(app.status)}
                    {app.smartMatchScore && (
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 border border-amber-200">
                        {app.smartMatchScore}% Match
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone size={14} className="text-slate-400 shrink-0" />
                    <span className="font-bold">{app.mobile}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail size={14} className="text-slate-400 shrink-0" />
                    <span className="truncate">{app.email}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Budget</span>
                      <span className="font-black text-blue-700">{app.investmentBudget}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Preferred Zone</span>
                      <span className="font-bold text-slate-800 truncate max-w-[150px]">{app.preferredLocation}</span>
                    </div>
                  </div>
                  {app.message && (
                    <p className="text-slate-500 text-[11px] line-clamp-2 italic bg-slate-50 p-2 rounded-lg">
                      "{app.message}"
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400">
                  Submitted: {new Date(app.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
                <button
                  onClick={() => setSelectedApp(app)}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Eye size={13} /> View Full
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl border border-slate-200 space-y-6 animate-fadeIn">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">Application Reference ID: {selectedApp.id}</span>
                <h2 className="text-xl font-black text-slate-900">{selectedApp.applicantName}</h2>
              </div>
              <button 
                onClick={() => setSelectedApp(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">Applicant Name</span>
                <p className="font-black text-slate-800 text-sm">{selectedApp.applicantName}</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">Target Brand</span>
                <p className="font-black text-blue-700 text-sm">{selectedApp.brandName}</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">Mobile Phone</span>
                <p className="font-bold text-slate-800">{selectedApp.mobile}</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">Email Address</span>
                <p className="font-bold text-slate-800">{selectedApp.email}</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">City & State</span>
                <p className="font-bold text-slate-800">{selectedApp.city}, {selectedApp.state}</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">Investment Budget</span>
                <p className="font-black text-emerald-700">{selectedApp.investmentBudget}</p>
              </div>

              <div className="md:col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">Preferred Location / Catchment</span>
                <p className="font-bold text-slate-800">{selectedApp.preferredLocation}</p>
              </div>

              {selectedApp.occupation && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase">Occupation</span>
                  <p className="font-medium text-slate-800">{selectedApp.occupation}</p>
                </div>
              )}

              {selectedApp.businessExperience && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase">Prior Business Experience</span>
                  <p className="font-medium text-slate-800">{selectedApp.businessExperience}</p>
                </div>
              )}

              {selectedApp.message && (
                <div className="md:col-span-2 bg-blue-50/60 p-4 rounded-xl border border-blue-100 space-y-1">
                  <span className="text-[10px] font-extrabold text-blue-800 uppercase block">Message / Property Note</span>
                  <p className="text-slate-700 leading-relaxed font-normal">{selectedApp.message}</p>
                </div>
              )}
              
              {selectedApp.smartMatchScore && selectedApp.matchBreakdown && (
                <div className="md:col-span-2 bg-amber-50/80 p-4 rounded-xl border border-amber-200 mt-2">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-black uppercase text-amber-800 tracking-widest bg-amber-200/50 px-2 py-1 rounded-md">Smart Match Score: {selectedApp.smartMatchScore}%</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] font-bold text-amber-900 uppercase">
                    <div>City Match: <span className="font-black">{selectedApp.matchBreakdown.cityScore}/25</span></div>
                    <div>Investment: <span className="font-black">{selectedApp.matchBreakdown.investmentScore}/25</span></div>
                    <div>Industry: <span className="font-black">{selectedApp.matchBreakdown.industryScore}/25</span></div>
                    <div>Background: <span className="font-black">{selectedApp.matchBreakdown.backgroundScore}/15</span></div>
                    <div>Timeline: <span className="font-black">{selectedApp.matchBreakdown.timelineScore}/10</span></div>
                  </div>
                  {selectedApp.matchBreakdown.reasons?.length > 0 && (
                    <ul className="mt-3 space-y-1 text-xs text-amber-800 font-medium list-disc list-inside">
                      {selectedApp.matchBreakdown.reasons.map((r: string, i: number) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Status Update Controls */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <span className="text-xs font-black uppercase text-slate-700 block">Update Application Status</span>
              <div className="flex flex-wrap gap-2">
                {(['NEW', 'CONTACTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'] as ApplicationStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      updateApplicationStatus(selectedApp.id, st);
                      setSelectedApp({ ...selectedApp, status: st });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedApp.status === st
                        ? 'bg-blue-700 text-white shadow-sm ring-2 ring-blue-300'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase cursor-pointer hover:bg-slate-800"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
