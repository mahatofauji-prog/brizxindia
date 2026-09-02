import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Bookmark, Calendar, Trash2, ArrowRight, Building2, Sparkles, X, Check, Layers, FileText, Save, Edit, Award, Info 
} from 'lucide-react';
import { Brand } from '../../types';
import { Link } from 'react-router';
import { BrandLogo } from '../../components/BrandLogo';
import { SeekerHero } from '../../components/seeker/SeekerHero';
import { seekerTheme } from '../../theme/seekerTheme';

export default function SeekerSavedBrands() {
  const { user } = useAuth();
  const { seekers, brands, toggleSaveBrand, scheduleMeeting } = useData();

  const currentSeeker = seekers.find(s => s.id === user?.id) || seekers[0];
  const savedBrandIds = currentSeeker.savedBrandIds || [];
  const savedBrands = brands.filter(b => savedBrandIds.includes(b.id));

  // Comparison State
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Personal Notes State (Persisted in localStorage)
  const [personalNotes, setPersonalNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(`brizx_notes_${user?.id || 'guest'}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [activeNoteEditingId, setActiveNoteEditingId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    localStorage.setItem(`brizx_notes_${user?.id || 'guest'}`, JSON.stringify(personalNotes));
  }, [personalNotes, user?.id]);

  const toggleCompareSelection = (id: string) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(prev => prev.filter(item => item !== id));
    } else {
      if (selectedForCompare.length >= 3) {
        triggerAlert('You can select and compare up to 3 franchise models concurrently.');
        return;
      }
      setSelectedForCompare(prev => [...prev, id]);
    }
  };

  const triggerAlert = (msg: string) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(''), 4000);
  };

  const handleEditNote = (brandId: string) => {
    setActiveNoteEditingId(brandId);
    setNoteDraft(personalNotes[brandId] || '');
  };

  const handleSaveNote = (brandId: string) => {
    setPersonalNotes(prev => ({
      ...prev,
      [brandId]: noteDraft
    }));
    setActiveNoteEditingId(null);
    triggerAlert('Personal evaluation note saved securely.');
  };

  const comparedBrands = brands.filter(b => selectedForCompare.includes(b.id));

  return (
    <div className="w-full p-4 sm:p-6 md:p-8 space-y-8 bg-[#F4F7FB] min-h-screen text-slate-900">
      
      {/* Alert Banner */}
      {alertMsg && (
        <div className="fixed top-24 right-6 bg-slate-900 text-white border border-blue-100 rounded-2xl px-4 py-3 text-xs font-bold flex items-center gap-2 shadow-xl z-50 animate-fadeIn">
          <Sparkles className="text-blue-400" size={14} />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* Top Unified Page Banner */}
      <SeekerHero
        pageKey="savedBrands"
        badgeText="Saved Portfolio"
        title="My Saved Franchise Wishlist"
        description="Securely compare margins, capex requirements, and add custom due-diligence logs on saved brands."
        actions={
          savedBrands.length > 0 ? (
            <button
              onClick={() => setShowCompareModal(true)}
              disabled={selectedForCompare.length < 2}
              className={`px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                selectedForCompare.length >= 2
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/80'
              }`}
            >
              <Layers size={14} /> Compare Selected ({selectedForCompare.length}/3)
            </button>
          ) : undefined
        }
      />

      {/* Saved Brands List */}
      {savedBrands.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-blue-100/80 shadow-xs">
          <Bookmark size={48} className="mx-auto text-blue-300 mb-4" />
          <h3 className="text-lg font-black text-slate-900 font-heading mb-1">Your Wishlist is Empty</h3>
          <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto">
            Browse our AI Smart Match directory and click the bookmark icon on any brand profile to track them here.
          </p>
          <Link
            to="/seeker/browse-brands"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors shadow-xs"
          >
            Explore Verified Brands <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedBrands.map(brand => {
            const isSelected = selectedForCompare.includes(brand.id);
            const savedNote = personalNotes[brand.id] || '';
            const isEditingNote = activeNoteEditingId === brand.id;
            const cover = brand.coverImage || 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={brand.id}
                className={`bg-white rounded-3xl border transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                  isSelected 
                    ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md' 
                    : 'border-blue-100/80 shadow-xs hover:shadow-md hover:border-blue-200'
                }`}
              >
                <div>
                  {/* Brand Cover Banner */}
                  <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={cover}
                      alt={brand.brandName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent" />

                    {/* Top compare & remove buttons */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      <button
                        onClick={() => toggleCompareSelection(brand.id)}
                        className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all backdrop-blur-md shadow-md ${
                          isSelected 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-900/80 text-white hover:bg-slate-900'
                        }`}
                      >
                        {isSelected ? <Check size={11} /> : null} {isSelected ? 'Selected' : '+ Compare'}
                      </button>

                      <button
                        onClick={() => {
                          toggleSaveBrand(currentSeeker.id, brand.id);
                          triggerAlert(`${brand.brandName} removed from wishlist.`);
                        }}
                        className="text-white hover:text-rose-400 p-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md hover:bg-rose-950/80 cursor-pointer transition-colors shadow-md"
                        title="Remove from Saved"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Brand Logo & Name overlay */}
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
                        <Link to={`/brands/${brand.id}`} state={{ from: '/seeker/saved-brands' }}>
                          <h3 className="font-extrabold text-white text-base leading-tight hover:text-blue-200 transition-colors line-clamp-1">
                            {brand.brandName}
                          </h3>
                        </Link>
                        <p className="text-[10px] font-bold text-blue-200 uppercase tracking-wider mt-0.5">
                          {brand.industry}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2 font-normal">
                      {brand.tagline || brand.description}
                    </p>

                    {/* Financial Grid */}
                    <div className="bg-slate-50/70 rounded-2xl p-4 border border-blue-50 grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Required Capex</div>
                        <div className="text-xs font-black text-slate-800 mt-0.5">₹{brand.investmentRequired.min} - {brand.investmentRequired.max}L</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Est. Payback</div>
                        <div className="text-xs font-black text-emerald-600 mt-0.5">{brand.roiPayback || '12-18 Mos'}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Franchise Fee</div>
                        <div className="text-xs font-semibold text-slate-700 mt-0.5">₹{brand.franchiseFee || 4} Lakhs</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Outlets in India</div>
                        <div className="text-xs font-semibold text-slate-700 mt-0.5">{brand.totalOutlets || 50}+ Units</div>
                      </div>
                    </div>

                    {/* Personal Notes Section */}
                    <div className="border-t border-blue-50 pt-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <FileText size={10} className="text-blue-500" /> Evaluation Logs
                        </span>
                        {!isEditingNote && (
                          <button 
                            onClick={() => handleEditNote(brand.id)}
                            className="text-[10px] text-blue-600 hover:text-blue-700 font-bold flex items-center gap-0.5 cursor-pointer"
                          >
                            <Edit size={10} /> {savedNote ? 'Edit Notes' : '+ Add Note'}
                          </button>
                        )}
                      </div>

                      {isEditingNote ? (
                        <div className="space-y-2">
                          <textarea
                            value={noteDraft}
                            onChange={(e) => setNoteDraft(e.target.value)}
                            placeholder="Add your due diligence or revenue projection notes..."
                            className="w-full text-xs p-3 rounded-xl border border-blue-100 bg-slate-50/70 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none h-20"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setActiveNoteEditingId(null)}
                              className="px-2.5 py-1 text-[10px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveNote(brand.id)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Save size={10} /> Save Note
                            </button>
                          </div>
                        </div>
                      ) : savedNote ? (
                        <p className="text-[11px] text-slate-600 italic bg-blue-50/50 p-2.5 rounded-xl border border-blue-100 line-clamp-2">
                          "{savedNote}"
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to={`/brands/${brand.id}`}
                    state={{ from: '/seeker/saved-brands' }}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider text-center cursor-pointer transition-colors block shadow-xs"
                  >
                    View Comprehensive Dossier
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Side-by-Side Compare Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 border border-blue-100 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-fadeIn">
            <button
              onClick={() => setShowCompareModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-full bg-slate-100 hover:bg-slate-200 cursor-pointer"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-black text-slate-900 mb-1 font-heading">Side-by-Side Comparative Matrix</h2>
            <p className="text-xs text-slate-500 mb-6">Evaluating {comparedBrands.length} selected franchise models across key commercial indices.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 border-collapse">
                <thead>
                  <tr className="border-b border-blue-100 bg-blue-50/40">
                    <th className="py-4 px-4 font-bold uppercase tracking-wider text-[10px] text-slate-500">Franchise Metric</th>
                    {comparedBrands.map(b => (
                      <th key={b.id} className="py-4 px-4 font-black text-slate-900 text-center">
                        <div className="flex justify-center mb-1.5">
                          <BrandLogo
                            logo={b.logo}
                            brandName={b.brandName}
                            industry={b.industry}
                            verified={b.verified}
                            size="sm"
                            className="shadow-sm"
                          />
                        </div>
                        <div className="truncate max-w-[140px] font-heading">{b.brandName}</div>
                        <div className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">{b.industry}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50">
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Investment Range</td>
                    {comparedBrands.map(b => (
                      <td key={b.id} className="py-3 px-4 font-black text-slate-900 text-center">
                        ₹{b.investmentRequired.min}L - {b.investmentRequired.max} Lakhs
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">One-Time franchise Fee</td>
                    {comparedBrands.map(b => (
                      <td key={b.id} className="py-3 px-4 font-semibold text-slate-800 text-center">
                        ₹{b.franchiseFee || 4} Lakhs
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Ongoing Royalty Fee</td>
                    {comparedBrands.map(b => (
                      <td key={b.id} className="py-3 px-4 font-semibold text-slate-800 text-center">
                        {b.royaltyFee || '5% Gross'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Est. Payback Timeline</td>
                    {comparedBrands.map(b => (
                      <td key={b.id} className="py-3 px-4 font-black text-emerald-600 text-center">
                        {b.roiPayback || '12-18 Months'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Space Requirement</td>
                    {comparedBrands.map(b => (
                      <td key={b.id} className="py-3 px-4 font-medium text-slate-700 text-center">
                        {b.spaceRequired || '300-600 sq ft'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Active Outlets</td>
                    {comparedBrands.map(b => (
                      <td key={b.id} className="py-3 px-4 font-semibold text-slate-700 text-center">
                        {b.totalOutlets || 50}+ Units
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">AI Smart Match Match</td>
                    {comparedBrands.map(b => (
                      <td key={b.id} className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-xl font-bold uppercase text-[10px] border border-blue-100">
                          <Sparkles size={11} className="fill-current" /> 98% Score
                        </span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-2.5">
              <Info size={14} className="text-blue-600 mt-0.5 shrink-0" />
              <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                BrizX comparison models are simulated using average store yield profiles and regional tier-1 rent indicators. Connect with BrizX staff for site-specific micro-market studies.
              </p>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-blue-100">
              <button 
                onClick={() => setShowCompareModal(false)}
                className="px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs uppercase cursor-pointer"
              >
                Close Matrix
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
