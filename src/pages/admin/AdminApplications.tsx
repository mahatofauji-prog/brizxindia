import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useData } from '../../context/DataContext';
import { FranchiseApplication, ApplicationStatus } from '../../types';
import { 
  FileText, Search, Filter, Phone, Mail, MapPin, 
  Building2, Calendar, CheckCircle2, Clock, UserCheck, 
  XCircle, ChevronRight, Eye, ShieldCheck, Download
} from 'lucide-react';

export default function AdminApplications() {
  const { applications, brands, updateApplicationStatus } = useData();
  const [searchParams] = useSearchParams();
  const appIdParam = searchParams.get('appId') || searchParams.get('id');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedApp, setSelectedApp] = useState<FranchiseApplication | null>(null);

  useEffect(() => {
    if (appIdParam && applications.length > 0) {
      const target = applications.find(a => a.id === appIdParam);
      if (target) {
        setSelectedApp(target);
      }
    }
  }, [appIdParam, applications]);

  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.mobile.includes(searchTerm) ||
      app.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.preferredLocation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBrand = selectedBrandFilter === 'ALL' || app.brandId === selectedBrandFilter;
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;

    return matchesSearch && matchesBrand && matchesStatus;
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

  const handleExportCSV = () => {
    const headers = ['ID', 'Brand Name', 'Applicant Name', 'Mobile', 'Email', 'City', 'State', 'Budget', 'Location', 'Status', 'Submitted At'];
    const rows = filteredApps.map(a => [
      a.id, a.brandName, a.applicantName, a.mobile, a.email, a.city, a.state, a.investmentBudget, a.preferredLocation, a.status, a.submittedAt
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.map(x => `"${x}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `brizx_franchise_applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase text-blue-700 bg-blue-50 px-3 py-1 rounded-full w-fit mb-3">
            <ShieldCheck size={14} /> Master Franchise Applications Control
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            All Inbound Franchise Applications
          </h1>
          <p className="text-slate-500 text-xs md:text-sm mt-1">
            Global repository of investor applications submitted across all registered brands on BrizX.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
        
        <div className="relative w-full lg:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search applicant, brand, email, city..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:border-blue-600 outline-none transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Brand Filter Dropdown */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-600">
            <Building2 size={14} className="text-blue-600" />
            <span>Brand:</span>
            <select
              value={selectedBrandFilter}
              onChange={(e) => setSelectedBrandFilter(e.target.value)}
              className="bg-transparent text-blue-700 font-black outline-none cursor-pointer max-w-[160px] truncate"
            >
              <option value="ALL">All Brands ({brands.length})</option>
              {brands.map(b => (
                <option key={b.id} value={b.id}>{b.brandName}</option>
              ))}
            </select>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {['ALL', 'NEW', 'CONTACTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === 'ALL' ? 'All' : st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                <th className="py-4 px-6">Applicant Details</th>
                <th className="py-4 px-6">Target Brand</th>
                <th className="py-4 px-6">Location & Budget</th>
                <th className="py-4 px-6">Submitted Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    No applications match the selected search & filter criteria.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-black text-slate-900 text-sm">{app.applicantName}</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">{app.email} • {app.mobile}</p>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex flex-col items-start gap-1">
                        <span className="font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                          {app.brandName}
                        </span>
                        {app.smartMatchScore && (
                          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 border border-amber-200">
                            {app.smartMatchScore}% Match
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-800">{app.city}, {app.state}</p>
                      <p className="text-emerald-700 font-black text-[11px] mt-0.5">{app.investmentBudget}</p>
                    </td>

                    <td className="py-4 px-6 text-slate-500">
                      {new Date(app.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>

                    <td className="py-4 px-6">
                      {getStatusBadge(app.status)}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye size={13} /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL FOR ADMIN */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl border border-slate-200 space-y-6 animate-fadeIn">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">Admin Application Record: {selectedApp.id}</span>
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
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">Applied Brand</span>
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
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">Location</span>
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
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase">Experience</span>
                  <p className="font-medium text-slate-800">{selectedApp.businessExperience}</p>
                </div>
              )}

              {selectedApp.message && (
                <div className="md:col-span-2 bg-blue-50/60 p-4 rounded-xl border border-blue-100 space-y-1">
                  <span className="text-[10px] font-extrabold text-blue-800 uppercase block">Message</span>
                  <p className="text-slate-700 leading-relaxed">{selectedApp.message}</p>
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

            {/* Admin Status Update Controls */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <span className="text-xs font-black uppercase text-slate-700 block">Change Application Status</span>
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
