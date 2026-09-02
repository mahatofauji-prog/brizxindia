import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Search, Filter, Lock, ShieldCheck, MapPin, Briefcase, IndianRupee, ArrowRight, UserCheck, Sparkles, Clock } from 'lucide-react';
import { Link } from 'react-router';

export default function SeekerListing() {
  const { seekers } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [selectedIndustry, setSelectedIndustry] = useState('ALL');

  const filteredSeekers = seekers.filter((seeker) => {
    const name = seeker.name || (seeker as any).fullName || '';
    const city = seeker.city || (seeker.preferredCities && seeker.preferredCities[0]) || (seeker as any).preferredCity || '';
    const industry = seeker.industry || (seeker.preferredIndustries && seeker.preferredIndustries[0]) || (seeker as any).preferredIndustry || '';

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      industry.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCity = selectedCity === 'ALL' || city.toUpperCase().includes(selectedCity.toUpperCase());
    const matchesIndustry = selectedIndustry === 'ALL' || industry.toUpperCase() === selectedIndustry.toUpperCase();

    return matchesSearch && matchesCity && matchesIndustry && seeker.verified;
  }).sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Hero Banner */}
        <div className="mb-10 relative w-full rounded-3xl overflow-hidden shadow-xl border border-blue-100 bg-gradient-to-r from-blue-900 to-indigo-950 p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 text-white font-black text-xs uppercase tracking-widest mb-3 rounded-full shadow-md">
              <Sparkles size={14} /> Verified Investor Directory
            </span>
            <h1 className="text-3xl sm:text-5xl font-black mb-3 tracking-tight">Find Active Franchise Investors in India</h1>
            <p className="text-slate-200 font-medium text-sm md:text-base leading-relaxed">
              Explore professional profiles of pre-verified franchise seekers looking for high-growth brand partnerships across top metros and tier-2 cities.
            </p>
          </div>
          <div className="shrink-0 bg-white text-slate-900 p-6 rounded-2xl shadow-xl text-center min-w-[160px] border border-blue-100">
            <div className="text-4xl font-black text-blue-600">{seekers.length}+</div>
            <div className="text-xs font-black uppercase tracking-wider mt-1 text-slate-600">Verified Seekers</div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-blue-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by seeker name, city, or industry..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm focus:border-blue-500 outline-none transition-colors text-slate-800 font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-600">
              <MapPin size={14} className="text-blue-600" />
              <span>City:</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent text-blue-700 font-extrabold outline-none cursor-pointer"
              >
                <option value="ALL">All Cities</option>
                <option value="BANGALORE">Bangalore</option>
                <option value="MUMBAI">Mumbai</option>
                <option value="DELHI">Delhi NCR</option>
                <option value="PUNE">Pune</option>
                <option value="HYDERABAD">Hyderabad</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-600">
              <Filter size={14} className="text-blue-600" />
              <span>Industry:</span>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="bg-transparent text-blue-700 font-extrabold outline-none cursor-pointer"
              >
                <option value="ALL">All Industries</option>
                <option value="FOOD & BEVERAGES">Food & Beverage</option>
                <option value="HEALTHCARE">Healthcare</option>
                <option value="EDUCATION">Education</option>
                <option value="RETAIL">Retail</option>
                <option value="FITNESS">Fitness</option>
              </select>
            </div>
          </div>
        </div>

        {/* Seeker Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSeekers.map((seeker) => {
            const matchScore = seeker.matchScore || 92;
            const isBestMatch = matchScore >= 90;

            return (
              <div
                key={seeker.id}
                className="bg-white rounded-3xl p-6 shadow-sm border border-blue-100 hover:shadow-xl transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-start justify-between mb-4 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-blue-50 text-blue-600 font-black rounded-2xl flex items-center justify-center text-xl border border-blue-200 shrink-0 shadow-xs overflow-hidden">
                        {seeker.avatar ? (
                          <img src={seeker.avatar} alt={seeker.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          (seeker.name || 'S').charAt(0)
                        )}
                      </div>
                      <div>
                        <Link to={`/seekers/${seeker.id}`}>
                          <h3 className="font-black text-slate-900 hover:text-blue-600 text-lg transition-colors">{seeker.name}</h3>
                        </Link>
                        <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold mt-0.5">
                          <MapPin size={13} className="text-blue-600" /> {seeker.city || 'India'}
                        </div>
                      </div>
                    </div>

                    {/* Circular Match Score Indicator */}
                    <div className="flex flex-col items-center justify-center w-14 h-14 shrink-0 rounded-2xl bg-blue-50 border-2 border-blue-500 shadow-2xs">
                      <span className="text-base font-black text-blue-700 leading-none">{matchScore}%</span>
                      <span className="text-[8px] font-extrabold text-slate-500 uppercase tracking-tighter mt-0.5">Match</span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-5">
                    {seeker.verified && (
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                        <ShieldCheck size={12} /> VERIFIED SEEKER
                      </span>
                    )}
                    {isBestMatch && (
                      <span className="bg-blue-50 text-blue-700 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-blue-200 flex items-center gap-1">
                        <Sparkles size={12} /> BEST MATCH
                      </span>
                    )}
                  </div>

                  {/* Key Metrics */}
                  <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                    <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                      <span className="text-slate-500 font-semibold flex items-center gap-1.5"><IndianRupee size={13} className="text-blue-600"/> Investment Capacity:</span>
                      <span className="font-black text-blue-700">₹{seeker.investment} Lakhs</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                      <span className="text-slate-500 font-semibold flex items-center gap-1.5"><Briefcase size={13} className="text-blue-600"/> Target Industry:</span>
                      <span className="font-bold text-slate-800">{seeker.industry || 'Multi-Sector'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-semibold flex items-center gap-1.5"><Clock size={13} className="text-blue-600"/> Target Timeline:</span>
                      <span className="font-bold text-slate-800">{seeker.timeline || '1 - 3 Months'}</span>
                    </div>
                  </div>

                  {/* Professional Background Summary */}
                  <div className="mb-6">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Professional Background</span>
                    <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed">
                      {seeker.experience || 'Experienced business professional with active capital and strong execution capability across urban markets.'}
                    </p>
                  </div>

                  {/* Locked contact notice */}
                  <div className="bg-slate-100 p-3.5 rounded-2xl border border-dashed border-slate-300 text-center mb-6">
                    <div className="flex items-center justify-center gap-1.5 text-slate-500 font-bold text-xs mb-0.5">
                      <Lock size={13} className="text-blue-600" /> Direct Contact Locked
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Log in as Brand Owner to unlock direct phone, email & CRM tools.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to={`/seekers/${seeker.id}`}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-extrabold uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2 shadow-md shadow-blue-100 hover:shadow-lg cursor-pointer"
                  >
                    VIEW PROFILE <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

