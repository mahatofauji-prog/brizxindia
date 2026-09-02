import React, { useState } from 'react';
import { useCMS, StatItem, TrustedBrandItem, TestimonialItem, FAQItem } from '../../context/CMSContext';
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs';
import { 
  Layout, Sparkles, Save, Eye, History, Plus, Edit3, Trash2, CheckCircle, 
  ArrowUp, ArrowDown, Image as ImageIcon, Check, X, Layers, Sliders, Globe,
  HelpCircle, Star, MessageSquare, ExternalLink, RefreshCw, Smartphone, Monitor
} from 'lucide-react';

export default function AdminHomePageManagement() {
  const {
    hero, setHero,
    stats, setStats,
    trustedBrands, setTrustedBrands,
    homepageSections, setHomepageSections,
    testimonials, setTestimonials,
    faqs, setFaqs,
    revisions, addRevisionLog,
    saveStatus, markUnsaved, saveChanges
  } = useCMS();

  const [activeTab, setActiveTab] = useState<'HERO' | 'SECTIONS' | 'STATS' | 'BRANDS' | 'PROCESS' | 'TESTIMONIALS' | 'FAQS'>('HERO');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'DESKTOP' | 'MOBILE'>('DESKTOP');
  const [showRevisionHistory, setShowRevisionHistory] = useState(false);

  // Editing modals state
  const [newHeroImage, setNewHeroImage] = useState('');
  
  // Stat modal
  const [editingStat, setEditingStat] = useState<Partial<StatItem> | null>(null);
  const [showStatModal, setShowStatModal] = useState(false);

  // Brand logo modal
  const [editingBrand, setEditingBrand] = useState<Partial<TrustedBrandItem> | null>(null);
  const [showBrandModal, setShowBrandModal] = useState(false);

  // Testimonial modal
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<TestimonialItem> | null>(null);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);

  // FAQ modal
  const [editingFaq, setEditingFaq] = useState<Partial<FAQItem> | null>(null);
  const [showFaqModal, setShowFaqModal] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSave = () => {
    saveChanges();
    addRevisionLog('Homepage', 'Updated homepage layout and content sections');
    showToast('Homepage changes published successfully!');
  };

  const moveSection = (index: number, direction: 'UP' | 'DOWN') => {
    const newSections = [...homepageSections];
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;
    setHomepageSections(newSections);
    markUnsaved();
  };

  const toggleSection = (id: string) => {
    setHomepageSections(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
    markUnsaved();
  };

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto space-y-6 pb-20 font-sans text-[#172033]">
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-blue-700 text-white px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-blue-600 animate-fadeIn">
          <CheckCircle size={18} className="text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider">{toastMessage}</span>
        </div>
      )}

      <AdminBreadcrumbs items={[{ label: 'Owner Console', path: '/admin' }, { label: 'Homepage Management' }]} />

      {/* Header Bar */}
      <div className="bg-white border border-[#E2EAF4] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-[#EAF2FF] border border-[#BFDBFE] text-blue-700 font-extrabold text-[10px] uppercase rounded-full flex items-center gap-1">
              <Sparkles size={12} className="text-amber-500" /> BrizX Public Website Editor
            </span>
            <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full border ${
              saveStatus === 'SAVED' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : saveStatus === 'SAVING'
                ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              {saveStatus === 'SAVED' ? '✓ Published & Live' : saveStatus === 'SAVING' ? 'Publishing...' : '● Unsaved Changes'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#172033] font-heading">Home Page Management</h1>
          <p className="text-slate-500 text-xs md:text-sm mt-0.5">Control hero banners, key counters, trusted brand logos, section ordering, and testimonials on the public homepage.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setShowRevisionHistory(true)}
            className="px-3.5 py-2 bg-[#F8FAFC] hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-[#E2EAF4]"
          >
            <History size={14} /> History ({revisions.length})
          </button>

          <button 
            onClick={() => setShowLivePreview(true)}
            className="px-3.5 py-2 bg-[#EAF2FF] hover:bg-[#DBEAFE] text-blue-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-[#BFDBFE]"
          >
            <Eye size={14} /> Live Preview
          </button>

          <button 
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Save size={14} /> Save Homepage
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-[#E2EAF4] rounded-2xl p-2 shadow-xs overflow-x-auto flex items-center gap-1">
        {[
          { key: 'HERO', label: 'Hero Banner', icon: Layout },
          { key: 'SECTIONS', label: 'Section Ordering', icon: Layers },
          { key: 'STATS', label: 'Key Statistics', icon: Sliders },
          { key: 'BRANDS', label: 'Featured Logos', icon: Globe },
          { key: 'TESTIMONIALS', label: 'Testimonials', icon: Star },
          { key: 'FAQS', label: 'Homepage FAQs', icon: HelpCircle },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-[#F8FAFC] hover:text-[#172033]'
              }`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content: HERO */}
      {activeTab === 'HERO' && (
        <div className="bg-white border border-[#E2EAF4] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="border-b border-[#E2EAF4] pb-4">
            <h2 className="text-lg font-bold text-[#172033]">Hero Banner Configuration</h2>
            <p className="text-xs text-slate-500">Edit main headline, value proposition subhead, CTA buttons, and background slideshow images.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Main Hero Headline</label>
                <textarea 
                  value={hero.headline}
                  onChange={(e) => { setHero({ ...hero, headline: e.target.value }); markUnsaved(); }}
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subheading / Description</label>
                <textarea 
                  value={hero.subheading}
                  onChange={(e) => { setHero({ ...hero, subheading: e.target.value }); markUnsaved(); }}
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Primary CTA Label</label>
                  <input 
                    type="text" 
                    value={hero.primaryCtaText}
                    onChange={(e) => { setHero({ ...hero, primaryCtaText: e.target.value }); markUnsaved(); }}
                    className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Primary CTA Link</label>
                  <input 
                    type="text" 
                    value={hero.primaryCtaLink}
                    onChange={(e) => { setHero({ ...hero, primaryCtaLink: e.target.value }); markUnsaved(); }}
                    className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Secondary CTA Label</label>
                  <input 
                    type="text" 
                    value={hero.secondaryCtaText}
                    onChange={(e) => { setHero({ ...hero, secondaryCtaText: e.target.value }); markUnsaved(); }}
                    className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Secondary CTA Link</label>
                  <input 
                    type="text" 
                    value={hero.secondaryCtaLink}
                    onChange={(e) => { setHero({ ...hero, secondaryCtaLink: e.target.value }); markUnsaved(); }}
                    className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Slideshow Images */}
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-700 uppercase">Background Carousel Images</label>
              <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                {hero.heroImages.map((img, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl">
                    <img src={img} alt={`Banner ${idx+1}`} className="w-16 h-10 object-cover rounded-lg border border-[#E2EAF4]" />
                    <input 
                      type="text" 
                      value={img}
                      onChange={(e) => {
                        const updated = [...hero.heroImages];
                        updated[idx] = e.target.value;
                        setHero({ ...hero, heroImages: updated });
                        markUnsaved();
                      }}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#E2EAF4] rounded-lg text-xs font-mono"
                    />
                    <button 
                      onClick={() => {
                        const updated = hero.heroImages.filter((_, i) => i !== idx);
                        setHero({ ...hero, heroImages: updated });
                        markUnsaved();
                      }}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                      title="Remove Image"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Paste image URL (https://...)" 
                  value={newHeroImage}
                  onChange={(e) => setNewHeroImage(e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl text-xs"
                />
                <button 
                  onClick={() => {
                    if (newHeroImage.trim()) {
                      setHero({ ...hero, heroImages: [...hero.heroImages, newHeroImage.trim()] });
                      setNewHeroImage('');
                      markUnsaved();
                    }
                  }}
                  className="px-4 py-2 bg-[#EAF2FF] hover:bg-[#DBEAFE] text-blue-700 font-bold text-xs rounded-xl border border-[#BFDBFE] cursor-pointer flex items-center gap-1"
                >
                  <Plus size={14} /> Add Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: SECTIONS */}
      {activeTab === 'SECTIONS' && (
        <div className="bg-white border border-[#E2EAF4] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="border-b border-[#E2EAF4] pb-4">
            <h2 className="text-lg font-bold text-[#172033]">Homepage Section Order & Visibility</h2>
            <p className="text-xs text-slate-500">Enable, disable, or drag & reorder main content blocks on the homepage.</p>
          </div>

          <div className="space-y-3">
            {homepageSections.map((sec, idx) => (
              <div key={sec.id} className="flex items-center justify-between p-4 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-white border border-[#E2EAF4] text-xs font-bold flex items-center justify-center text-slate-500">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-xs text-[#172033]">{sec.name}</div>
                    <div className="text-[10px] text-slate-400">Section ID: {sec.id}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => moveSection(idx, 'UP')}
                      disabled={idx === 0}
                      className="p-1.5 text-slate-500 hover:text-blue-600 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button 
                      onClick={() => moveSection(idx, 'DOWN')}
                      disabled={idx === homepageSections.length - 1}
                      className="p-1.5 text-slate-500 hover:text-blue-600 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>

                  <button 
                    onClick={() => toggleSection(sec.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                      sec.enabled 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-slate-200 text-slate-600 border border-slate-300'
                    }`}
                  >
                    {sec.enabled ? 'Visible' : 'Hidden'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: STATS */}
      {activeTab === 'STATS' && (
        <div className="bg-white border border-[#E2EAF4] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex justify-between items-center border-b border-[#E2EAF4] pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#172033]">Homepage Key Metric Counters</h2>
              <p className="text-xs text-slate-500">Highlighted statistics displayed below the hero section.</p>
            </div>
            <button 
              onClick={() => { setEditingStat({}); setShowStatModal(true); }}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} /> Add Metric
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(st => (
              <div key={st.id} className="p-4 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase">{st.label}</div>
                  <div className="text-2xl font-black text-[#172033] mt-1">{st.value}</div>
                  <div className="text-[10px] font-bold text-blue-600 mt-1">{st.trend}</div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-[#E2EAF4]">
                  <button 
                    onClick={() => { setEditingStat(st); setShowStatModal(true); }}
                    className="p-1.5 text-slate-500 hover:text-blue-600 cursor-pointer"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button 
                    onClick={() => {
                      setStats(stats.filter(item => item.id !== st.id));
                      markUnsaved();
                    }}
                    className="p-1.5 text-slate-500 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: BRANDS */}
      {activeTab === 'BRANDS' && (
        <div className="bg-white border border-[#E2EAF4] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex justify-between items-center border-b border-[#E2EAF4] pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#172033]">Featured & Trusted Brand Logos</h2>
              <p className="text-xs text-slate-500">Partner logos displayed on the homepage scroll bar.</p>
            </div>
            <button 
              onClick={() => { setEditingBrand({}); setShowBrandModal(true); }}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} /> Add Brand Logo
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {trustedBrands.map(b => (
              <div key={b.id} className="p-3 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl flex flex-col items-center space-y-2 text-center">
                <img src={b.logo} alt={b.name} className="w-16 h-12 object-contain rounded-lg border border-[#E2EAF4] bg-white p-1" />
                <div className="text-xs font-bold text-[#172033] truncate w-full">{b.name}</div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingBrand(b); setShowBrandModal(true); }} className="p-1 text-slate-500 hover:text-blue-600"><Edit3 size={14} /></button>
                  <button onClick={() => { setTrustedBrands(trustedBrands.filter(i => i.id !== b.id)); markUnsaved(); }} className="p-1 text-slate-500 hover:text-rose-600"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: TESTIMONIALS */}
      {activeTab === 'TESTIMONIALS' && (
        <div className="bg-white border border-[#E2EAF4] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex justify-between items-center border-b border-[#E2EAF4] pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#172033]">Homepage Testimonials & Success Stories</h2>
              <p className="text-xs text-slate-500">Client quotes and investor ratings.</p>
            </div>
            <button 
              onClick={() => { setEditingTestimonial({ rating: 5, enabled: true, featured: true }); setShowTestimonialModal(true); }}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} /> Add Testimonial
            </button>
          </div>

          <div className="space-y-4">
            {testimonials.map(t => (
              <div key={t.id} className="p-4 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <img src={t.customerImage} alt={t.customerName} className="w-10 h-10 rounded-full object-cover border border-[#E2EAF4]" />
                  <div>
                    <div className="font-bold text-xs text-[#172033]">{t.customerName} <span className="text-slate-400 font-normal">({t.businessName})</span></div>
                    <div className="text-[10px] text-blue-600 font-semibold">{t.role}</div>
                    <p className="text-xs text-slate-600 italic mt-1">"{t.quote}"</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditingTestimonial(t); setShowTestimonialModal(true); }} className="p-1.5 text-slate-500 hover:text-blue-600"><Edit3 size={16} /></button>
                  <button onClick={() => { setTestimonials(testimonials.filter(item => item.id !== t.id)); markUnsaved(); }} className="p-1.5 text-slate-500 hover:text-rose-600"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: FAQS */}
      {activeTab === 'FAQS' && (
        <div className="bg-white border border-[#E2EAF4] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex justify-between items-center border-b border-[#E2EAF4] pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#172033]">Homepage FAQ Section</h2>
              <p className="text-xs text-slate-500">Frequently Asked Questions featured on the homepage.</p>
            </div>
            <button 
              onClick={() => { setEditingFaq({ category: 'GENERAL', enabled: true }); setShowFaqModal(true); }}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} /> Add FAQ
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map(f => (
              <div key={f.id} className="p-4 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl space-y-1">
                <div className="flex justify-between items-start">
                  <div className="font-bold text-xs text-[#172033]">{f.question}</div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[9px] font-bold rounded border border-blue-200">{f.category}</span>
                    <button onClick={() => { setEditingFaq(f); setShowFaqModal(true); }} className="p-1 text-slate-500 hover:text-blue-600"><Edit3 size={14} /></button>
                    <button onClick={() => { setFaqs(faqs.filter(item => item.id !== f.id)); markUnsaved(); }} className="p-1 text-slate-500 hover:text-rose-600"><Trash2 size={14} /></button>
                  </div>
                </div>
                <p className="text-xs text-slate-500">{f.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stat Modal */}
      {showStatModal && editingStat && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E2EAF4] p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#172033]">{editingStat.id ? 'Edit Metric' : 'Add Metric'}</h3>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Label</label>
              <input type="text" value={editingStat.label || ''} onChange={(e) => setEditingStat({ ...editingStat, label: e.target.value })} className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Value (e.g. 1,250+)</label>
              <input type="text" value={editingStat.value || ''} onChange={(e) => setEditingStat({ ...editingStat, value: e.target.value })} className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Trend / Subtitle</label>
              <input type="text" value={editingStat.trend || ''} onChange={(e) => setEditingStat({ ...editingStat, trend: e.target.value })} className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl text-xs" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowStatModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">Cancel</button>
              <button 
                onClick={() => {
                  if (editingStat.id) {
                    setStats(stats.map(s => s.id === editingStat.id ? editingStat as StatItem : s));
                  } else {
                    setStats([...stats, { ...editingStat, id: `st_${Date.now()}` } as StatItem]);
                  }
                  markUnsaved();
                  setShowStatModal(false);
                }} 
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Brand Modal */}
      {showBrandModal && editingBrand && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E2EAF4] p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#172033]">{editingBrand.id ? 'Edit Brand Logo' : 'Add Brand Logo'}</h3>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Brand Name</label>
              <input type="text" value={editingBrand.name || ''} onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })} className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Logo Image URL</label>
              <input type="text" value={editingBrand.logo || ''} onChange={(e) => setEditingBrand({ ...editingBrand, logo: e.target.value })} className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl text-xs" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowBrandModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">Cancel</button>
              <button 
                onClick={() => {
                  if (editingBrand.id) {
                    setTrustedBrands(trustedBrands.map(b => b.id === editingBrand.id ? editingBrand as TrustedBrandItem : b));
                  } else {
                    setTrustedBrands([...trustedBrands, { ...editingBrand, id: `tb_${Date.now()}` } as TrustedBrandItem]);
                  }
                  markUnsaved();
                  setShowBrandModal(false);
                }} 
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {showLivePreview && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex flex-col p-4 md:p-8">
          <div className="bg-white rounded-2xl border border-[#E2EAF4] flex-1 flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 bg-[#F8FAFC] border-b border-[#E2EAF4] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-bold text-xs text-[#172033]">Homepage Live Preview</span>
                <div className="flex bg-slate-200 p-0.5 rounded-lg">
                  <button onClick={() => setPreviewDevice('DESKTOP')} className={`p-1 rounded ${previewDevice === 'DESKTOP' ? 'bg-white text-blue-600' : 'text-slate-600'}`}><Monitor size={14} /></button>
                  <button onClick={() => setPreviewDevice('MOBILE')} className={`p-1 rounded ${previewDevice === 'MOBILE' ? 'bg-white text-blue-600' : 'text-slate-600'}`}><Smartphone size={14} /></button>
                </div>
              </div>
              <button onClick={() => setShowLivePreview(false)} className="p-1 text-slate-500 hover:text-slate-800"><X size={20} /></button>
            </div>
            <div className="flex-1 bg-slate-100 p-4 overflow-y-auto flex justify-center">
              <div className={`bg-white shadow-xl transition-all ${previewDevice === 'MOBILE' ? 'w-[375px] h-[667px] rounded-3xl overflow-hidden border-8 border-slate-800' : 'w-full h-full rounded-xl'}`}>
                <iframe src="/" title="Homepage Live Preview" className="w-full h-full border-none" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
