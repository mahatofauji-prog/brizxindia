import React, { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { calculateMatchScore } from '../../data/mockDb';
import { 
  Bookmark, Search, Trash2, Download, Unlock, Phone, Mail, MapPin, 
  Briefcase, IndianRupee, Tag, Sparkles, Filter, ChevronRight, CheckCircle2 
} from 'lucide-react';

export default function BrandSavedLeads() {
  const { user } = useAuth();
  const { seekers, brands, toggleSaveLeadForBrand, unlockLead } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [exportMessage, setExportMessage] = useState('');

  const currentBrand = brands.find(b => b.id === user?.id || (user?.email && b.email === user?.email));
  if (!currentBrand) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Complete your Brand Profile</h2>
        <p className="text-slate-500">Please set up your brand profile to access this page.</p>
      </div>
    );
  }
  const savedSeekerIds = currentBrand.savedLeads || [];

  const savedSeekers = seekers
    .filter(s => savedSeekerIds.includes(s.id))
    .map(s => ({
      ...s,
      matchScore: calculateMatchScore(s, currentBrand),
      isUnlocked: (currentBrand.unlockedLeads || []).includes(s.id)
    }))
    .filter(s => {
      const name = s.name || '';
      const city = s.city || '';
      const experience = s.experience || '';
      const matchText = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        city.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        experience.toLowerCase().includes(searchTerm.toLowerCase());
      return matchText;
    });

  const handleExportCSV = () => {
    if (savedSeekers.length === 0) return;
    const headers = "Name,City,Investment(Lakhs),Experience,Unlocked,Phone,Email\n";
    const rows = savedSeekers.map(s => 
      `"${s.name}","${s.city}",${s.investment},"${s.experience}",${s.isUnlocked},"${s.isUnlocked ? s.phone : 'LOCKED'}","${s.isUnlocked ? s.email : 'LOCKED'}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BrizX_Saved_Leads_${currentBrand.brandName}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    setExportMessage('CSV file generated and downloaded successfully!');
    setTimeout(() => setExportMessage(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase mb-2 border border-blue-100">
            <Bookmark size={14} className="text-blue-500" /> Bookmarks & Pipeline Previews
          </div>
          <h1 className="text-3xl font-black text-indigo-950 font-heading">Saved Franchise Leads</h1>
          <p className="text-slate-600 text-sm mt-1">Review, tag, export, and unlock bookmarked franchise seeker profiles.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={handleExportCSV}
            disabled={savedSeekers.length === 0}
            className="flex-1 md:flex-none px-6 py-3 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download size={16} /> Export CSV
          </button>
          <Link 
            to="/search" 
            className="flex-1 md:flex-none px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2"
          >
            <Search size={16} /> Find More
          </Link>
        </div>
      </div>

      {exportMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600" /> {exportMessage}
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saved leads by name, city, or background..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Filter Tag:</span>
          {['All', 'High Capital', 'South India', 'Multi-Unit', 'Food Priority'].map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === 'All' ? '' : tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                (selectedTag === tag || (tag === 'All' && !selectedTag))
                  ? 'bg-blue-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Saved Leads List */}
      {savedSeekers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <Bookmark size={32} />
          </div>
          <h3 className="text-xl font-black text-indigo-950 mb-2 font-heading">No saved leads found</h3>
          <p className="text-slate-500 max-w-md mx-auto text-sm mb-6">
            Bookmark promising franchise seekers while exploring the Smart Match Engine to manage them here.
          </p>
          <Link 
            to="/search" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-blue-200"
          >
            Explore Seekers
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedSeekers.map(seeker => (
            <div key={seeker.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 font-black text-lg flex items-center justify-center shrink-0 border border-blue-200 overflow-hidden">
                      {seeker.avatar ? (
                        <img src={seeker.avatar} alt={seeker.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        seeker.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-indigo-950 text-base group-hover:text-blue-600 transition-colors">{seeker.name}</h3>
                      <div className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <MapPin size={12} className="text-slate-400" /> {seeker.city}
                      </div>
                    </div>
                  </div>

                  {/* Match Score Badge */}
                  <div className="px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-xl text-center">
                    <div className="text-xs font-black text-blue-600">{seeker.matchScore}%</div>
                    <div className="text-[8px] font-bold text-blue-500 uppercase">Match</div>
                  </div>
                </div>

                <div className="space-y-2 mb-6 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Investment:</span>
                    <strong className="text-slate-800 font-bold">₹{seeker.investment} Lakhs</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Background:</span>
                    <strong className="text-slate-800 font-bold truncate max-w-[150px]">{seeker.experience}</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Timeline:</span>
                    <strong className="text-slate-800 font-bold">{seeker.timeline}</strong>
                  </div>
                </div>

                {seeker.isUnlocked ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-1 mb-6">
                    <div className="font-bold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 size={14} /> Unlocked Lead
                    </div>
                    <div className="text-slate-700 font-semibold flex items-center gap-2">
                      <Phone size={12} className="text-slate-400" /> {seeker.phone}
                    </div>
                    <div className="text-slate-700 font-semibold flex items-center gap-2">
                      <Mail size={12} className="text-slate-400" /> {seeker.email}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-100 border border-slate-200 rounded-2xl text-xs text-slate-500 text-center mb-6">
                    🔒 Contact Info Masked
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => toggleSaveLeadForBrand(currentBrand.id, seeker.id)}
                  className="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                  title="Remove from saved"
                >
                  <Trash2 size={16} />
                </button>

                {seeker.isUnlocked ? (
                  <Link 
                    to="/brand/crm" 
                    className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-1"
                  >
                    Open CRM <ChevronRight size={14} />
                  </Link>
                ) : (
                  <button 
                    onClick={() => unlockLead(currentBrand.id, seeker.id)}
                    className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-blue-200 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Unlock size={14} /> Unlock Lead
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
