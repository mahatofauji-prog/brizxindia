import React, { useState } from 'react';
import { useCMS, MenuItem, FooterConfig } from '../../context/CMSContext';
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs';
import { 
  Sliders, Save, History, Plus, Edit3, Trash2, CheckCircle, 
  ArrowUp, ArrowDown, Eye, RefreshCw, Navigation as NavIcon,
  Globe, Link as LinkIcon, ShieldCheck, ExternalLink, Settings,
  Check, X, FileText, Image as ImageIcon
} from 'lucide-react';

export default function AdminNavigationManagement() {
  const {
    headerMenu, setHeaderMenu,
    footer, setFooter,
    appearance, setAppearance,
    contact, setContact,
    revisions, addRevisionLog,
    saveStatus, markUnsaved, saveChanges
  } = useCMS();

  const [activeTab, setActiveTab] = useState<'HEADER' | 'FOOTER' | 'ADMIN_DRAWER' | 'BRANDING'>('HEADER');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Header menu item modal state
  const [editingMenuItem, setEditingMenuItem] = useState<Partial<MenuItem> | null>(null);
  const [showMenuModal, setShowMenuModal] = useState(false);

  // Footer column selection & link modal
  const [activeFooterCol, setActiveFooterCol] = useState<'quickLinks' | 'serviceLinks' | 'policyLinks'>('quickLinks');
  const [editingFooterLink, setEditingFooterLink] = useState<{ label: string; url: string } | null>(null);
  const [footerLinkIndex, setFooterLinkIndex] = useState<number | null>(null);
  const [showFooterLinkModal, setShowFooterLinkModal] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSave = () => {
    saveChanges();
    addRevisionLog('Navigation', 'Updated header menu items, footer columns, and branding links');
    showToast('Navigation settings updated successfully!');
  };

  // Header reordering
  const moveHeaderItem = (index: number, direction: 'UP' | 'DOWN') => {
    const newItems = [...headerMenu];
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setHeaderMenu(newItems.map((item, i) => ({ ...item, order: i + 1 })));
    markUnsaved();
  };

  // Footer reordering
  const moveFooterLink = (col: 'quickLinks' | 'serviceLinks' | 'policyLinks', index: number, direction: 'UP' | 'DOWN') => {
    const links = [...footer[col]];
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;
    const temp = links[index];
    links[index] = links[targetIndex];
    links[targetIndex] = temp;
    setFooter({ ...footer, [col]: links });
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

      <AdminBreadcrumbs items={[{ label: 'Owner Console', path: '/admin' }, { label: 'Navigation / Menu Management' }]} />

      {/* Header Bar */}
      <div className="bg-white border border-[#E2EAF4] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-[#EAF2FF] border border-[#BFDBFE] text-blue-700 font-extrabold text-[10px] uppercase rounded-full flex items-center gap-1">
              <NavIcon size={12} className="text-blue-600" /> Website & Console Navigation Engine
            </span>
            <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full border ${
              saveStatus === 'SAVED' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : saveStatus === 'SAVING'
                ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              {saveStatus === 'SAVED' ? '✓ Synced & Live' : saveStatus === 'SAVING' ? 'Syncing...' : '● Unsaved Changes'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#172033] font-heading">Navigation & Menu Management</h1>
          <p className="text-slate-500 text-xs md:text-sm mt-0.5">Manage public header links, footer columns, social links, logo parameters, and Owner Console navigation rules.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Save size={14} /> Save Navigation Settings
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white border border-[#E2EAF4] rounded-2xl p-2 shadow-xs overflow-x-auto flex items-center gap-1">
        {[
          { key: 'HEADER', label: 'Header Navigation Menu', icon: NavIcon },
          { key: 'FOOTER', label: 'Footer Links & Columns', icon: Sliders },
          { key: 'BRANDING', label: 'Logo & Favicon Links', icon: ImageIcon },
          { key: 'ADMIN_DRAWER', label: 'Owner Console Navigation', icon: Settings },
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

      {/* TAB 1: HEADER NAVIGATION */}
      {activeTab === 'HEADER' && (
        <div className="bg-white border border-[#E2EAF4] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex justify-between items-center border-b border-[#E2EAF4] pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#172033]">Header Navigation Menu Items</h2>
              <p className="text-xs text-slate-500">Configure public header navbar items, routes, links, and display order.</p>
            </div>
            <button 
              onClick={() => { setEditingMenuItem({ order: headerMenu.length + 1 }); setShowMenuModal(true); }}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} /> Add Menu Item
            </button>
          </div>

          <div className="space-y-3">
            {headerMenu.map((item, idx) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-white border border-[#E2EAF4] text-xs font-bold flex items-center justify-center text-slate-500">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-xs text-[#172033] flex items-center gap-2">
                      {item.label}
                      {item.target === '_blank' && (
                        <span className="px-1.5 py-0.5 bg-slate-200 text-slate-700 text-[9px] font-bold rounded flex items-center gap-0.5">
                          External <ExternalLink size={10} />
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-blue-600 font-mono mt-0.5">{item.url}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => moveHeaderItem(idx, 'UP')} 
                      disabled={idx === 0}
                      className="p-1.5 text-slate-500 hover:text-blue-600 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button 
                      onClick={() => moveHeaderItem(idx, 'DOWN')} 
                      disabled={idx === headerMenu.length - 1}
                      className="p-1.5 text-slate-500 hover:text-blue-600 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                  <button 
                    onClick={() => { setEditingMenuItem(item); setShowMenuModal(true); }}
                    className="p-1.5 text-slate-500 hover:text-blue-600 cursor-pointer"
                    title="Edit Item"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => {
                      setHeaderMenu(headerMenu.filter(m => m.id !== item.id));
                      markUnsaved();
                    }}
                    className="p-1.5 text-slate-500 hover:text-rose-600 cursor-pointer"
                    title="Delete Item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: FOOTER NAVIGATION */}
      {activeTab === 'FOOTER' && (
        <div className="bg-white border border-[#E2EAF4] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="border-b border-[#E2EAF4] pb-4">
            <h2 className="text-lg font-bold text-[#172033]">Footer Navigation & Columns</h2>
            <p className="text-xs text-slate-500">Manage links in Quick Links, Services, and Legal policy columns, copyright, and newsletter subtext.</p>
          </div>

          <div className="flex border-b border-[#E2EAF4] gap-4">
            {[
              { key: 'quickLinks', label: 'Quick Links Column' },
              { key: 'serviceLinks', label: 'Services Column' },
              { key: 'policyLinks', label: 'Legal & Policy Column' },
            ].map(col => (
              <button
                key={col.key}
                onClick={() => setActiveFooterCol(col.key as any)}
                className={`pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeFooterCol === col.key 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {col.label} ({footer[col.key as keyof typeof footer] ? (footer[col.key as keyof typeof footer] as any[]).length : 0})
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-600 uppercase">Column Links List</span>
              <button 
                onClick={() => { setEditingFooterLink({ label: '', url: '' }); setFooterLinkIndex(null); setShowFooterLinkModal(true); }}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1"
              >
                <Plus size={14} /> Add Link to Column
              </button>
            </div>

            <div className="space-y-2">
              {(footer[activeFooterCol] || []).map((lnk, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl">
                  <div>
                    <div className="font-bold text-xs text-[#172033]">{lnk.label}</div>
                    <div className="text-[10px] text-blue-600 font-mono">{lnk.url}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => moveFooterLink(activeFooterCol, idx, 'UP')} disabled={idx === 0} className="p-1 text-slate-500 hover:text-blue-600 disabled:opacity-30"><ArrowUp size={14} /></button>
                    <button onClick={() => moveFooterLink(activeFooterCol, idx, 'DOWN')} disabled={idx === footer[activeFooterCol].length - 1} className="p-1 text-slate-500 hover:text-blue-600 disabled:opacity-30"><ArrowDown size={14} /></button>
                    <button onClick={() => { setEditingFooterLink(lnk); setFooterLinkIndex(idx); setShowFooterLinkModal(true); }} className="p-1 text-slate-500 hover:text-blue-600"><Edit3 size={14} /></button>
                    <button onClick={() => {
                      const updated = footer[activeFooterCol].filter((_, i) => i !== idx);
                      setFooter({ ...footer, [activeFooterCol]: updated });
                      markUnsaved();
                    }} className="p-1 text-slate-500 hover:text-rose-600"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Subtext & Social Settings */}
          <div className="pt-6 border-t border-[#E2EAF4] space-y-4">
            <h3 className="text-sm font-bold text-[#172033]">Footer Statement & Social Media Links</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Copyright Line</label>
                <input 
                  type="text" 
                  value={footer.copyrightText}
                  onChange={(e) => { setFooter({ ...footer, copyrightText: e.target.value }); markUnsaved(); }}
                  className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Newsletter Headline</label>
                <input 
                  type="text" 
                  value={footer.newsletterHeadline}
                  onChange={(e) => { setFooter({ ...footer, newsletterHeadline: e.target.value }); markUnsaved(); }}
                  className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">LinkedIn URL</label>
                <input 
                  type="text" 
                  value={contact.socialLinks.linkedin}
                  onChange={(e) => { setContact({ ...contact, socialLinks: { ...contact.socialLinks, linkedin: e.target.value } }); markUnsaved(); }}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Twitter / X URL</label>
                <input 
                  type="text" 
                  value={contact.socialLinks.twitter}
                  onChange={(e) => { setContact({ ...contact, socialLinks: { ...contact.socialLinks, twitter: e.target.value } }); markUnsaved(); }}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Instagram URL</label>
                <input 
                  type="text" 
                  value={contact.socialLinks.instagram}
                  onChange={(e) => { setContact({ ...contact, socialLinks: { ...contact.socialLinks, instagram: e.target.value } }); markUnsaved(); }}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BRANDING & LOGO LINKS */}
      {activeTab === 'BRANDING' && (
        <div className="bg-white border border-[#E2EAF4] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="border-b border-[#E2EAF4] pb-4">
            <h2 className="text-lg font-bold text-[#172033]">Logo & Favicon Asset Links</h2>
            <p className="text-xs text-slate-500">Configure public site logo, favicon, and primary theme appearance parameters.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Site Logo URL</label>
                <input 
                  type="text" 
                  value={appearance.logoUrl}
                  onChange={(e) => { setAppearance({ ...appearance, logoUrl: e.target.value }); markUnsaved(); }}
                  className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Favicon Image URL</label>
                <input 
                  type="text" 
                  value={appearance.faviconUrl}
                  onChange={(e) => { setAppearance({ ...appearance, faviconUrl: e.target.value }); markUnsaved(); }}
                  className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="p-4 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl flex items-center gap-4">
              <img src={appearance.logoUrl || '/logo.jpg'} alt="Logo Preview" className="w-16 h-16 rounded-xl object-cover border border-[#E2EAF4]" />
              <div>
                <div className="font-bold text-xs text-[#172033]">Logo Asset Preview</div>
                <p className="text-[10px] text-slate-500 mt-0.5">Appears in header navbar and footer branding block across desktop and mobile screens.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: OWNER CONSOLE NAVIGATION */}
      {activeTab === 'ADMIN_DRAWER' && (
        <div className="bg-white border border-[#E2EAF4] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="border-b border-[#E2EAF4] pb-4">
            <h2 className="text-lg font-bold text-[#172033]">Owner Console Navigation Controls</h2>
            <p className="text-xs text-slate-500">Configuration and guidelines for the Super Admin Owner Console slide-out navigation menu.</p>
          </div>

          <div className="p-4 bg-[#EAF2FF] border border-[#BFDBFE] rounded-xl space-y-2">
            <div className="font-bold text-xs text-blue-700 flex items-center gap-2">
              <ShieldCheck size={16} /> Owner Console Architectural Guarantee
            </div>
            <p className="text-xs text-slate-600">
              The Owner Console Slide-Out Drawer is organized into dedicated operational domains (Overview, User Management, Brand Management, Matchmaking, Monetization, Content & Website, Communication, Operations, System, Account).
            </p>
            <p className="text-xs text-slate-600">
              Every menu option maps strictly to its own unique page route and component to prevent navigation collisions.
            </p>
          </div>
        </div>
      )}

      {/* Header Menu Item Modal */}
      {showMenuModal && editingMenuItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E2EAF4] p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#172033]">{editingMenuItem.id ? 'Edit Header Menu Item' : 'Add Header Menu Item'}</h3>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Menu Label</label>
              <input type="text" value={editingMenuItem.label || ''} onChange={(e) => setEditingMenuItem({ ...editingMenuItem, label: e.target.value })} className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">URL / Destination</label>
              <input type="text" value={editingMenuItem.url || ''} onChange={(e) => setEditingMenuItem({ ...editingMenuItem, url: e.target.value })} className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Open Target</label>
              <select value={editingMenuItem.target || '_self'} onChange={(e) => setEditingMenuItem({ ...editingMenuItem, target: e.target.value as any })} className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl text-xs">
                <option value="_self">Same Tab (_self)</option>
                <option value="_blank">New Tab (_blank)</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowMenuModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">Cancel</button>
              <button 
                onClick={() => {
                  if (editingMenuItem.id) {
                    setHeaderMenu(headerMenu.map(m => m.id === editingMenuItem.id ? editingMenuItem as MenuItem : m));
                  } else {
                    setHeaderMenu([...headerMenu, { ...editingMenuItem, id: `m_${Date.now()}` } as MenuItem]);
                  }
                  markUnsaved();
                  setShowMenuModal(false);
                }} 
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
              >
                Save Menu Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Link Modal */}
      {showFooterLinkModal && editingFooterLink && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E2EAF4] p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#172033]">{footerLinkIndex !== null ? 'Edit Footer Link' : 'Add Footer Link'}</h3>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Link Label</label>
              <input type="text" value={editingFooterLink.label} onChange={(e) => setEditingFooterLink({ ...editingFooterLink, label: e.target.value })} className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">URL / Destination</label>
              <input type="text" value={editingFooterLink.url} onChange={(e) => setEditingFooterLink({ ...editingFooterLink, url: e.target.value })} className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl text-xs" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowFooterLinkModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">Cancel</button>
              <button 
                onClick={() => {
                  const currentLinks = [...(footer[activeFooterCol] || [])];
                  if (footerLinkIndex !== null) {
                    currentLinks[footerLinkIndex] = editingFooterLink;
                  } else {
                    currentLinks.push(editingFooterLink);
                  }
                  setFooter({ ...footer, [activeFooterCol]: currentLinks });
                  markUnsaved();
                  setShowFooterLinkModal(false);
                }} 
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
              >
                Save Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
