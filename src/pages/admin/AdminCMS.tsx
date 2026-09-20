import React, { useState } from 'react';
import { useCMS, ServiceItem, BlogItem, FAQItem, TestimonialItem, PricingPlanItem, MediaFile, WebsiteLead, MenuItem } from '../../context/CMSContext';
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs';
import { 
  Layout, Image as ImageIcon, MessageSquare, FileText, HelpCircle, Star, 
  Plus, Edit3, Trash2, CheckCircle, Eye, Upload, Save, Sparkles, Globe, X,
  Sliders, ShieldCheck, ArrowUp, ArrowDown, RefreshCw, Folder, Search,
  Phone, Mail, MapPin, Share2, Palette, Navigation as NavIcon, Bell,
  FileSpreadsheet, Lock, AlertCircle, History, Check, Copy, ExternalLink,
  Layers, ChevronRight, Zap, Users, Building2, IndianRupee, PieChart
} from 'lucide-react';

export default function AdminCMS() {
  const {
    hero, setHero,
    stats, setStats,
    trustedBrands, setTrustedBrands,
    homepageSections, setHomepageSections,
    about, setAbout,
    services, setServices,
    blogs, setBlogs,
    faqs, setFaqs,
    testimonials, setTestimonials,
    pricingPlans, setPricingPlans,
    mediaFiles, setMediaFiles,
    seo, setSeo,
    contact, setContact,
    leads, setLeads,
    appearance, setAppearance,
    headerMenu, setHeaderMenu,
    footer, setFooter,
    revisions, addRevisionLog,
    resetAllToDefault,
    saveStatus, markUnsaved, saveChanges
  } = useCMS();

  const [activeTab, setActiveTab] = useState<
    'HERO' | 'ABOUT' | 'SERVICES' | 'BRANDS' | 'SEEKERS' | 'BLOG' | 'FAQ' | 'TESTIMONIALS' | 
    'PRICING' | 'MEDIA' | 'SEO' | 'CONTACT' | 'LEADS' | 'TEMPLATES' | 'APPEARANCE' | 'MENU' | 'SECURITY'
  >('HERO');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [showRevisionHistory, setShowRevisionHistory] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleManualSave = () => {
    saveChanges();
    addRevisionLog(activeTab, `Updated ${activeTab} content and configurations`);
    showToast('All CMS changes successfully saved!');
  };

  // Reordering helper for homepage sections
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

  // State for Service modal
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<Partial<ServiceItem> | null>(null);

  // State for Blog modal
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Partial<BlogItem> | null>(null);

  // State for FAQ modal
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Partial<FAQItem> | null>(null);

  // State for Testimonial modal
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<TestimonialItem> | null>(null);

  // State for Media upload modal
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaFilter, setMediaFilter] = useState('ALL');
  const [mediaSearch, setMediaSearch] = useState('');

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto space-y-6 pb-20">
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-blue-700 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-indigo-700 animate-in fade-in">
          <CheckCircle size={18} className="text-blue-500" />
          <span className="text-xs font-bold uppercase tracking-wider">{toastMessage}</span>
        </div>
      )}

      <AdminBreadcrumbs items={[{ label: 'Super Admin', path: '/admin' }, { label: 'Website CMS & Control Studio' }]} />

      {/* Top Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-indigo-950/50 border border-blue-100 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 font-extrabold text-[10px] uppercase rounded-full flex items-center gap-1">
              <Sparkles size={12} className="text-amber-500" /> Enterprise CMS Control Center
            </span>
            <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase rounded-full border ${
              saveStatus === 'SAVED' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : saveStatus === 'SAVING'
                ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              {saveStatus === 'SAVED' ? '✓ Synced & Live' : saveStatus === 'SAVING' ? 'Syncing...' : '● Unsaved Changes'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-indigo-950 dark:text-white font-heading">Global Content & Page Builder</h1>
          <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm mt-0.5">Control 100% of text, banners, hero, FAQs, pricing, blogs, services, SEO & layout across BrizX India.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setShowRevisionHistory(true)}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <History size={14} /> Revision Log ({revisions.length})
          </button>

          <button 
            onClick={() => setShowLivePreview(true)}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-blue-700 dark:text-indigo-300 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <Eye size={14} /> Live Preview Mode
          </button>

          <button 
            onClick={handleManualSave}
            className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Save size={14} /> Save All Changes
          </button>
        </div>
      </div>

      {/* Main CMS Domains Sub-Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-xs overflow-x-auto custom-scrollbar flex items-center gap-1">
        {[
          { key: 'HERO', label: 'Homepage', icon: Layout },
          { key: 'ABOUT', label: 'About Us', icon: Globe },
          { key: 'SERVICES', label: 'Services', icon: Layers },
          { key: 'BRANDS', label: 'Brand Directory', icon: Building2 },
          { key: 'SEEKERS', label: 'Seekers DB', icon: Users },
          { key: 'BLOG', label: 'Blog Engine', icon: FileText },
          { key: 'FAQ', label: 'FAQs', icon: HelpCircle },
          { key: 'TESTIMONIALS', label: 'Testimonials', icon: MessageSquare },
          { key: 'PRICING', label: 'Pricing Plans', icon: IndianRupee },
          { key: 'MEDIA', label: 'Media Library', icon: ImageIcon },
          { key: 'SEO', label: 'SEO & Analytics', icon: Search },
          { key: 'CONTACT', label: 'Contact & Map', icon: MapPin },
          { key: 'LEADS', label: 'Inbound Leads', icon: Zap },
          { key: 'TEMPLATES', label: 'Broadcasts', icon: Bell },
          { key: 'APPEARANCE', label: 'Appearance', icon: Palette },
          { key: 'MENU', label: 'Menu & Footer', icon: NavIcon },
          { key: 'SECURITY', label: 'Security & Logs', icon: Lock },
        ].map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key as any)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                isActive 
                  ? 'bg-blue-700 text-white shadow-md' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-white'
              }`}
            >
              <Icon size={14} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Domain Content Sections */}

      {/* 1. HOMEPAGE MANAGEMENT */}
      {activeTab === 'HERO' && (
        <div className="space-y-6">
          {/* Hero Content Editor */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-black text-indigo-950 dark:text-white font-heading mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" /> Hero Section & Headlines
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase">Main Hero Headline</label>
                <input 
                  type="text" 
                  value={hero.headline}
                  onChange={(e) => { setHero({ ...hero, headline: e.target.value }); markUnsaved(); }}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-indigo-950 dark:text-white outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-4 md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase">Hero Sub-Heading Description</label>
                <textarea 
                  rows={2}
                  value={hero.subheading}
                  onChange={(e) => { setHero({ ...hero, subheading: e.target.value }); markUnsaved(); }}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase">Primary CTA Text</label>
                <input 
                  type="text" 
                  value={hero.primaryCtaText}
                  onChange={(e) => { setHero({ ...hero, primaryCtaText: e.target.value }); markUnsaved(); }}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase">Primary CTA Link</label>
                <input 
                  type="text" 
                  value={hero.primaryCtaLink}
                  onChange={(e) => { setHero({ ...hero, primaryCtaLink: e.target.value }); markUnsaved(); }}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase">Secondary CTA Text</label>
                <input 
                  type="text" 
                  value={hero.secondaryCtaText}
                  onChange={(e) => { setHero({ ...hero, secondaryCtaText: e.target.value }); markUnsaved(); }}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase">Secondary CTA Link</label>
                <input 
                  type="text" 
                  value={hero.secondaryCtaLink}
                  onChange={(e) => { setHero({ ...hero, secondaryCtaLink: e.target.value }); markUnsaved(); }}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            {/* Slider Images */}
            <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Hero Carousel Images (URLs)</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {hero.heroImages.map((img, idx) => (
                  <div key={idx} className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img src={img} alt="Hero slide" className="w-full h-32 object-cover" />
                    <div className="p-2 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
                      <input 
                        type="text" 
                        value={img}
                        onChange={(e) => {
                          const newImgs = [...hero.heroImages];
                          newImgs[idx] = e.target.value;
                          setHero({ ...hero, heroImages: newImgs });
                          markUnsaved();
                        }}
                        className="w-full text-[10px] font-mono bg-transparent outline-none truncate text-slate-600 dark:text-slate-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Statistics Counter Management */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-black text-indigo-950 dark:text-white font-heading mb-4">Homepage Key Statistics Counter</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((st, idx) => (
                <div key={st.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <input 
                    type="text" 
                    value={st.label} 
                    onChange={(e) => {
                      const newStats = [...stats];
                      newStats[idx].label = e.target.value;
                      setStats(newStats);
                      markUnsaved();
                    }}
                    className="w-full text-[10px] font-bold uppercase text-slate-400 bg-transparent outline-none"
                  />
                  <input 
                    type="text" 
                    value={st.value} 
                    onChange={(e) => {
                      const newStats = [...stats];
                      newStats[idx].value = e.target.value;
                      setStats(newStats);
                      markUnsaved();
                    }}
                    className="w-full text-2xl font-black text-indigo-950 dark:text-white bg-transparent outline-none"
                  />
                  <input 
                    type="text" 
                    value={st.trend} 
                    onChange={(e) => {
                      const newStats = [...stats];
                      newStats[idx].trend = e.target.value;
                      setStats(newStats);
                      markUnsaved();
                    }}
                    className="w-full text-xs font-bold text-emerald-600 bg-transparent outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section Visibility & Drag/Drop Reordering */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-indigo-950 dark:text-white font-heading">Homepage Sections Visibility & Ordering</h3>
                <p className="text-xs text-slate-500">Enable/disable homepage modules and reorder them.</p>
              </div>
            </div>

            <div className="space-y-2">
              {homepageSections.map((sec, idx) => (
                <div key={sec.id} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-700 text-indigo-800 dark:text-indigo-200 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-indigo-950 dark:text-white">{sec.name}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => moveSection(idx, 'UP')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => moveSection(idx, 'DOWN')}
                      disabled={idx === homepageSections.length - 1}
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600"
                    >
                      <ArrowDown size={14} />
                    </button>

                    <button
                      onClick={() => {
                        const newSecs = [...homepageSections];
                        newSecs[idx].enabled = !newSecs[idx].enabled;
                        setHomepageSections(newSecs);
                        markUnsaved();
                      }}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        sec.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {sec.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. ABOUT PAGE MANAGEMENT */}
      {activeTab === 'ABOUT' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-indigo-950 dark:text-white font-heading mb-4">About Us Page Content</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase">Company Name</label>
              <input 
                type="text" 
                value={about.companyName}
                onChange={(e) => { setAbout({ ...about, companyName: e.target.value }); markUnsaved(); }}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase">Tagline</label>
              <input 
                type="text" 
                value={about.tagline}
                onChange={(e) => { setAbout({ ...about, tagline: e.target.value }); markUnsaved(); }}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase">Vision Statement</label>
              <textarea 
                rows={2}
                value={about.vision}
                onChange={(e) => { setAbout({ ...about, vision: e.target.value }); markUnsaved(); }}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase">Mission Statement</label>
              <textarea 
                rows={2}
                value={about.mission}
                onChange={(e) => { setAbout({ ...about, mission: e.target.value }); markUnsaved(); }}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase">Company Story Narrative</label>
              <textarea 
                rows={4}
                value={about.companyStory}
                onChange={(e) => { setAbout({ ...about, companyStory: e.target.value }); markUnsaved(); }}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. SERVICES MANAGEMENT */}
      {activeTab === 'SERVICES' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-black text-indigo-950 dark:text-white font-heading">BrizX Advisory Services</h3>
            <button 
              onClick={() => { setEditingService({}); setShowServiceModal(true); }}
              className="px-4 py-2 bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <Plus size={14} /> Add New Service
            </button>
          </div>

          <div className="space-y-4">
            {services.map((srv, idx) => (
              <div key={srv.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-indigo-950 dark:text-white">{srv.title}</span>
                    <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">/{srv.slug}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{srv.shortDescription}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { setEditingService(srv); setShowServiceModal(true); }}
                    className="p-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-blue-600 dark:text-indigo-300 hover:bg-blue-50"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button 
                    onClick={() => { setServices(services.filter(s => s.id !== srv.id)); markUnsaved(); }}
                    className="p-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. BLOG MANAGEMENT */}
      {activeTab === 'BLOG' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-black text-indigo-950 dark:text-white font-heading">Marketplace Blog Publications</h3>
            <button 
              onClick={() => { setEditingBlog({}); setShowBlogModal(true); }}
              className="px-4 py-2 bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <Plus size={14} /> Write Blog Post
            </button>
          </div>

          <div className="space-y-4">
            {blogs.map(bl => (
              <div key={bl.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{bl.category}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${bl.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {bl.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-indigo-950 dark:text-white mt-1">{bl.title}</h4>
                  <div className="text-[10px] text-slate-400 mt-0.5">By {bl.author} • {bl.publishDate}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { setEditingBlog(bl); setShowBlogModal(true); }}
                    className="p-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-blue-600 dark:text-indigo-300"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button 
                    onClick={() => { setBlogs(blogs.filter(b => b.id !== bl.id)); markUnsaved(); }}
                    className="p-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. PRICING MANAGEMENT */}
      {activeTab === 'PRICING' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-indigo-950 dark:text-white font-heading mb-4">Subscription Plans & Coupon Discounts</h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {pricingPlans.map((plan, idx) => (
              <div key={plan.id} className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex justify-between items-center">
                  <input 
                    type="text" 
                    value={plan.name}
                    onChange={(e) => {
                      const newP = [...pricingPlans];
                      newP[idx].name = e.target.value;
                      setPricingPlans(newP);
                      markUnsaved();
                    }}
                    className="font-extrabold text-base text-indigo-950 dark:text-white bg-transparent outline-none"
                  />
                  <input 
                    type="text" 
                    value={plan.badge || ''}
                    onChange={(e) => {
                      const newP = [...pricingPlans];
                      newP[idx].badge = e.target.value;
                      setPricingPlans(newP);
                      markUnsaved();
                    }}
                    className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Monthly Price (₹)</label>
                  <input 
                    type="number" 
                    value={plan.monthlyPrice}
                    onChange={(e) => {
                      const newP = [...pricingPlans];
                      newP[idx].monthlyPrice = Number(e.target.value);
                      setPricingPlans(newP);
                      markUnsaved();
                    }}
                    className="w-full text-2xl font-black text-indigo-950 dark:text-white bg-white dark:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-600 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Unlock Credits / Month</label>
                  <input 
                    type="number" 
                    value={plan.unlockCredits}
                    onChange={(e) => {
                      const newP = [...pricingPlans];
                      newP[idx].unlockCredits = Number(e.target.value);
                      setPricingPlans(newP);
                      markUnsaved();
                    }}
                    className="w-full text-sm font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-600 outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. MEDIA LIBRARY */}
      {activeTab === 'MEDIA' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-lg font-black text-indigo-950 dark:text-white font-heading">Digital Asset Media Library</h3>
            <button 
              onClick={() => showToast('Media Asset Upload Dialog Simulated')}
              className="px-4 py-2 bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <Upload size={14} /> Upload Media File
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mediaFiles.map(med => (
              <div key={med.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
                {med.fileType === 'IMAGE' || med.fileType === 'LOGO' || med.fileType === 'BANNER' ? (
                  <img src={med.url} alt={med.fileName} className="w-full h-28 object-cover rounded-xl mb-2" />
                ) : (
                  <div className="w-full h-28 bg-blue-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200 rounded-xl flex items-center justify-center font-bold text-xs mb-2">
                    {med.fileType}
                  </div>
                )}
                <div className="font-bold text-indigo-950 dark:text-white truncate">{med.fileName}</div>
                <div className="text-[10px] text-slate-400">{med.sizeKb} KB • {med.folder}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. SEO STUDIO */}
      {activeTab === 'SEO' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-indigo-950 dark:text-white font-heading mb-4">Global SEO & Webmaster Configuration</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase">Default Meta Title</label>
              <input 
                type="text" 
                value={seo.metaTitle}
                onChange={(e) => { setSeo({ ...seo, metaTitle: e.target.value }); markUnsaved(); }}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase">Default Meta Description</label>
              <textarea 
                rows={2}
                value={seo.metaDescription}
                onChange={(e) => { setSeo({ ...seo, metaDescription: e.target.value }); markUnsaved(); }}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase">Google Analytics Tracking ID</label>
              <input 
                type="text" 
                value={seo.googleAnalyticsId}
                onChange={(e) => { setSeo({ ...seo, googleAnalyticsId: e.target.value }); markUnsaved(); }}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase">Facebook Pixel ID</label>
              <input 
                type="text" 
                value={seo.facebookPixelId}
                onChange={(e) => { setSeo({ ...seo, facebookPixelId: e.target.value }); markUnsaved(); }}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {showLivePreview && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[85vh] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
            <div className="p-4 bg-indigo-950 text-white flex items-center justify-between border-b border-indigo-900">
              <div className="flex items-center gap-2">
                <Eye size={18} className="text-amber-400" />
                <span className="font-extrabold text-xs uppercase tracking-wider">Live Homepage CMS Sandbox Preview</span>
              </div>
              <button onClick={() => setShowLivePreview(false)} className="p-1 hover:bg-blue-700 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50 dark:bg-slate-950">
              {/* Simulated Hero */}
              <div className="p-8 bg-indigo-950 text-white rounded-3xl text-center space-y-4">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 font-bold text-[10px] uppercase rounded-full">
                  Live Preview
                </span>
                <h1 className="text-3xl font-black font-heading">{hero.headline}</h1>
                <p className="text-slate-300 text-sm max-w-2xl mx-auto">{hero.subheading}</p>
                <div className="flex justify-center gap-3 pt-2">
                  <span className="px-5 py-2.5 bg-blue-500 text-white font-bold text-xs rounded-xl">{hero.primaryCtaText}</span>
                  <span className="px-5 py-2.5 border border-slate-700 text-white font-bold text-xs rounded-xl">{hero.secondaryCtaText}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revision History Modal */}
      {showRevisionHistory && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <h3 className="font-black text-indigo-950 dark:text-white text-base font-heading flex items-center gap-2">
                <History size={18} className="text-blue-600" /> CMS Revision History Log
              </h3>
              <button onClick={() => setShowRevisionHistory(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {revisions.map(rev => (
                <div key={rev.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 text-xs">
                  <div className="flex justify-between font-bold text-indigo-950 dark:text-white">
                    <span>{rev.section}</span>
                    <span className="text-[10px] text-slate-400">{rev.timestamp}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">{rev.summary}</p>
                  <div className="text-[10px] text-blue-600 dark:text-indigo-400 font-bold mt-1">Modified by {rev.modifiedBy}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
