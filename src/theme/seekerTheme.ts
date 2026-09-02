/**
 * Shared Global Seeker Portal Design System & Theme Tokens
 * Unified Soft White + Soft Blue Design System across all Seeker Pages
 */

export const seekerTheme = {
  // Page container & backgrounds
  pageContainer: 'w-full p-4 sm:p-6 md:p-8 space-y-8 bg-[#F4F7FB] min-h-screen text-slate-900',
  innerContainer: 'w-full space-y-8',

  // Top Section Banner (Unified Soft Blue + Soft White)
  banner: 'bg-gradient-to-r from-blue-50/90 via-indigo-50/40 to-blue-50/70 border border-blue-100/90 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xs relative overflow-hidden w-full text-slate-900',
  bannerBadge: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-blue-700 text-xs font-bold uppercase tracking-widest mb-3 border border-blue-200/80',
  bannerTitle: 'text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight font-heading mb-2',
  bannerDesc: 'text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed max-w-3xl font-medium',

  // Cards
  card: 'bg-white rounded-3xl p-6 sm:p-8 border border-blue-100/80 shadow-xs',
  cardSm: 'bg-white rounded-3xl p-5 border border-blue-100/80 shadow-xs',
  cardInteractive: 'bg-white rounded-3xl border border-blue-100/80 shadow-xs hover:shadow-md hover:border-blue-200 transition-all duration-300',
  cardHeader: 'flex items-center justify-between border-b border-blue-50 pb-4 mb-4',

  // Form elements & inputs
  input: 'w-full bg-slate-50/70 border border-blue-100 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all',
  select: 'w-full bg-slate-50/70 border border-blue-100 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all cursor-pointer',
  textarea: 'w-full bg-slate-50/70 border border-blue-100 rounded-2xl p-4 text-xs font-bold text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all resize-none',

  // Buttons
  buttonPrimary: 'px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
  buttonSecondary: 'px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95',
  buttonOutline: 'px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer',
  buttonDanger: 'px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5',

  // Badges & Status Pills
  badgeBlue: 'bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black uppercase px-2.5 py-1 rounded-full inline-flex items-center gap-1',
  badgeEmerald: 'bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase px-2.5 py-1 rounded-full inline-flex items-center gap-1',
  badgeAmber: 'bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black uppercase px-2.5 py-1 rounded-full inline-flex items-center gap-1',
  badgeSlate: 'bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-black uppercase px-2.5 py-1 rounded-full inline-flex items-center gap-1',

  // Section Headers & Titles
  sectionTitle: 'text-lg font-black text-slate-900 font-heading tracking-tight',
  sectionSubtitle: 'text-xs text-slate-500 font-medium',
  
  // Navigation Tabs
  tabActive: 'pb-3 text-xs sm:text-sm font-black text-blue-700 border-b-2 border-blue-600 transition-all cursor-pointer',
  tabInactive: 'pb-3 text-xs sm:text-sm font-bold text-slate-400 hover:text-slate-700 transition-all cursor-pointer',

  // Table styling
  tableHeader: 'bg-blue-50/50 text-slate-700 text-[11px] font-black uppercase tracking-wider border-b border-blue-100',
  tableRow: 'border-b border-blue-50 hover:bg-blue-50/30 transition-colors text-xs',
};
