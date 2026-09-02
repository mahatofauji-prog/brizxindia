import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { 
  BarChart, Users, Search, Briefcase, Calendar, Star, 
  LogOut, Settings, Bell, LayoutDashboard, UserCircle,
  Bookmark, Calculator, ShieldCheck, Crown, Sparkles, Building2,
  Sliders, ShieldAlert, FileText, Lock, Database, FileSpreadsheet,
  ChevronLeft, ChevronRight, Moon, Sun, Plus, CheckCircle, X,
  Activity, ArrowUpRight, Filter, PieChart as PieIcon, HelpCircle,
  MessageSquare, Folder, Code, Menu, Target, MapPin } from 'lucide-react';

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const { subscriptions, notifications, seekers, brands, markNotificationAsRead, connectionRequests } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const currentSeeker = user?.role === 'FRANCHISE_SEEKER'
    ? (seekers.find(s => s.id === user?.id) || seekers.find(s => s.email === user?.email))
    : null;

  const currentBrand = user?.role === 'BRAND_OWNER'
    ? (brands.find(b => b.id === user?.brandId || b.id === user?.id || b.email === user?.email) || { id: user?.id, brandName: user?.name, email: user?.email } as any)
    : null;

  const userAvatar = user?.avatar || (user as any)?.avatar || (user as any)?.seekerData?.avatar || currentSeeker?.avatar || currentBrand?.logo;

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAdminDrawerOpen, setIsAdminDrawerOpen] = useState(false);
  const [isSeekerDrawerOpen, setIsSeekerDrawerOpen] = useState(false);
  const [isBrandDrawerOpen, setIsBrandDrawerOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('brizx_theme') === 'dark';
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('brizx_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('brizx_theme', 'light');
    }
  }, [isDarkMode]);

  // Keyboard shortcut Cmd/Ctrl + K for global search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Keyboard Escape to close Navigation Drawers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isAdminDrawerOpen) setIsAdminDrawerOpen(false);
        if (isSeekerDrawerOpen) setIsSeekerDrawerOpen(false);
        if (isBrandDrawerOpen) setIsBrandDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminDrawerOpen, isSeekerDrawerOpen, isBrandDrawerOpen]);

  // Lock body scroll when any Navigation Drawer is open
  useEffect(() => {
    if (isAdminDrawerOpen || isSeekerDrawerOpen || isBrandDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAdminDrawerOpen, isSeekerDrawerOpen, isBrandDrawerOpen]);

  const unreadNotifications = notifications ? notifications.filter(n => {
    if (n.read) return false;
    if (user?.role === 'SUPER_ADMIN') return n.userId === 'admin1' || n.userId === user?.id;
    if (user?.role === 'BRAND_OWNER') return n.userId === user?.brandId || n.userId === user?.id;
    return n.userId === user?.id;
  }) : [];
  const unreadConnections = connectionRequests ? connectionRequests.filter(cr => !cr.readByOwner) : [];
  const hasUnreadBadge = unreadNotifications.length > 0 || (user?.role === 'SUPER_ADMIN' && unreadConnections.length > 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemClass = (path: string) => {
    const isActive = location.pathname === path;
    if (user?.role === 'BRAND_OWNER') {
      return `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
        isActive 
          ? 'bg-blue-50/90 text-blue-700 font-extrabold border-l-4 border-blue-600 shadow-2xs' 
          : 'text-slate-600 hover:bg-blue-50/60 hover:text-blue-700 font-medium border-l-4 border-transparent'
      }`;
    }
    return `flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
      isActive 
        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25' 
        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
    }`;
  };

  // Filtered search results for global search modal
  const searchResults = {
    seekers: seekers.filter(s => (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (s.industry || '').toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3),
    brands: brands.filter(b => (b.brandName || '').toLowerCase().includes(searchQuery.toLowerCase()) || (b.industry || '').toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3),
    pages: [
      { name: 'Dashboard', path: '/admin' },
      { name: 'Analytics', path: '/admin/analytics' },
      { name: 'Seekers Directory', path: '/admin/seekers' },
      { name: 'Brands Directory', path: '/admin/brands' },
      { name: 'User & Staff Roles', path: '/admin/users' },
      { name: 'Subscriptions', path: '/admin/subscriptions' },
      { name: 'Payments & Revenue', path: '/admin/payments' },
      { name: 'CMS & Page Builder', path: '/admin/cms' },
      { name: 'Homepage Management', path: '/admin/homepage-management' },
      { name: 'Navigation & Menu Management', path: '/admin/navigation-management' },
      { name: 'Featured Listings', path: '/admin/featured' },
      { name: 'Smart Match Engine', path: '/admin/smart-match' },
      { name: 'Reports', path: '/admin/reports' },
      { name: 'Broadcast Communications', path: '/admin/communications' },
      { name: 'Audit Logs', path: '/admin/audit-logs' },
      { name: 'Roles & Matrix', path: '/admin/roles' },
      { name: 'System Settings', path: '/admin/settings' },
      { name: 'Backup & Restore', path: '/admin/backup' },
      { name: 'Import / Export Data', path: '/admin/import-export' },
    ].filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
  };

  const renderAdminNav = () => (
    <div className="space-y-6">
      {/* Overview Group */}
      <div>
        {!isSidebarCollapsed && (
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2">
            Overview
          </div>
        )}
        <div className="space-y-1">
          <Link to="/admin" className={navItemClass('/admin')} title="Dashboard">
            <LayoutDashboard size={18} className="shrink-0" />
            {!isSidebarCollapsed && <span>Dashboard</span>}
          </Link>
          <Link to="/admin/analytics" className={navItemClass('/admin/analytics')} title="Analytics">
            <Sparkles size={18} className="shrink-0 text-amber-500" />
            {!isSidebarCollapsed && <span>Analytics</span>}
          </Link>
          <Link to="/admin/reports" className={navItemClass('/admin/reports')} title="Reports">
            <BarChart size={18} className="shrink-0" />
            {!isSidebarCollapsed && <span>Reports</span>}
          </Link>
        </div>
      </div>

      {/* Directory & Users */}
      <div>
        {!isSidebarCollapsed && (
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2">
            User Directory
          </div>
        )}
        <div className="space-y-1">
          <Link to="/admin/seekers" className={navItemClass('/admin/seekers')} title="Franchise Seekers">
            <Users size={18} className="shrink-0" />
            {!isSidebarCollapsed && <span>Franchise Seekers</span>}
          </Link>
          <Link to="/admin/brands" className={navItemClass('/admin/brands')} title="Brand Approvals">
            <Building2 size={18} className="shrink-0 text-blue-500" />
            {!isSidebarCollapsed && <span>Brand Directory</span>}
          </Link>
          <Link to="/admin/bulk-brands" className={navItemClass('/admin/bulk-brands')} title="Bulk Brand Listing">
            <FileSpreadsheet size={18} className="shrink-0 text-emerald-500" />
            {!isSidebarCollapsed && (
              <span className="flex items-center justify-between flex-1 min-w-0">
                <span>Bulk Listing</span>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded">SPREADSHEET</span>
              </span>
            )}
          </Link>
          <Link to="/admin/applications" className={navItemClass('/admin/applications')} title="Franchise Applications">
            <FileText size={18} className="shrink-0 text-indigo-500" />
            {!isSidebarCollapsed && <span>Applications</span>}
          </Link>
          <Link to="/admin/brand-verification" className={navItemClass('/admin/brand-verification')} title="Due Diligence Desk">
            <ShieldCheck size={18} className="shrink-0 text-emerald-500" />
            {!isSidebarCollapsed && <span>Due Diligence Desk</span>}
          </Link>
          <Link to="/admin/users" className={navItemClass('/admin/users')} title="User & Staff Roles">
            <UserCircle size={18} className="shrink-0" />
            {!isSidebarCollapsed && <span>Users & Staff</span>}
          </Link>
        </div>
      </div>

      {/* Monetization */}
      <div>
        {!isSidebarCollapsed && (
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2">
            Monetization
          </div>
        )}
        <div className="space-y-1">
          <Link to="/admin/subscriptions" className={navItemClass('/admin/subscriptions')} title="Subscriptions">
            <Star size={18} className="shrink-0 text-amber-500" />
            {!isSidebarCollapsed && <span>Subscriptions</span>}
          </Link>
          <Link to="/admin/payments" className={navItemClass('/admin/payments')} title="Payments">
            <BarChart size={18} className="shrink-0 text-emerald-500" />
            {!isSidebarCollapsed && <span>Payments & Revenue</span>}
          </Link>
        </div>
      </div>

      {/* Growth & CMS */}
      <div>
        {!isSidebarCollapsed && (
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2">
            Growth & CMS
          </div>
        )}
        <div className="space-y-1">
          <Link to="/admin/featured" className={navItemClass('/admin/featured')} title="Featured Listings">
            <Crown size={18} className="shrink-0 text-blue-500" />
            {!isSidebarCollapsed && <span>Featured Listings</span>}
          </Link>
          <Link to="/admin/smart-match" className={navItemClass('/admin/smart-match')} title="Smart Match Config">
            <Sliders size={18} className="shrink-0" />
            {!isSidebarCollapsed && <span>Smart Match Config</span>}
          </Link>
          <Link to="/admin/connections" className={navItemClass('/admin/connections')} title="Connections & Matches">
            <Sparkles size={18} className="shrink-0 text-blue-500" />
            {!isSidebarCollapsed && (
              <div className="flex items-center justify-between flex-1 min-w-0">
                <span>Connections</span>
                {unreadConnections.length > 0 && (
                  <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0">
                    {unreadConnections.length}
                  </span>
                )}
              </div>
            )}
          </Link>
          <Link to="/admin/cms" className={navItemClass('/admin/cms')} title="CMS & Pages">
            <FileText size={18} className="shrink-0" />
            {!isSidebarCollapsed && <span>CMS & Pages</span>}
          </Link>
        </div>
      </div>

      {/* Operations */}
      <div>
        {!isSidebarCollapsed && (
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2">
            Operations
          </div>
        )}
        <div className="space-y-1">
          <Link to="/admin/communications" className={navItemClass('/admin/communications')} title="Broadcast Center">
            <Bell size={18} className="shrink-0" />
            {!isSidebarCollapsed && <span>Broadcast Center</span>}
          </Link>
          <Link to="/admin/audit-logs" className={navItemClass('/admin/audit-logs')} title="Audit Logs">
            <ShieldAlert size={18} className="shrink-0" />
            {!isSidebarCollapsed && <span>Audit Logs</span>}
          </Link>
        </div>
      </div>

      {/* Administration */}
      <div>
        {!isSidebarCollapsed && (
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2">
            System Admin
          </div>
        )}
        <div className="space-y-1">
          <Link to="/admin/roles" className={navItemClass('/admin/roles')} title="Roles & Permissions">
            <Lock size={18} className="shrink-0" />
            {!isSidebarCollapsed && <span>Roles & Matrix</span>}
          </Link>
          <Link to="/admin/backup" className={navItemClass('/admin/backup')} title="Backup & Restore">
            <Database size={18} className="shrink-0" />
            {!isSidebarCollapsed && <span>Backup & Restore</span>}
          </Link>
          <Link to="/admin/import-export" className={navItemClass('/admin/import-export')} title="Import / Export">
            <FileSpreadsheet size={18} className="shrink-0" />
            {!isSidebarCollapsed && <span>Import / Export</span>}
          </Link>
          <Link to="/admin/media" className={navItemClass("/admin/media")} title="Media Library"> 
            <Folder size={18} className="shrink-0" /> 
            {!isSidebarCollapsed && <span>Media Library</span>} 
          </Link> 
          <Link to="/admin/notifications" className={navItemClass("/admin/notifications")} title="Notifications"> 
            <Bell size={18} className="shrink-0" /> 
            {!isSidebarCollapsed && <span>Notifications</span>} 
          </Link> 
          <Link to="/admin/developer" className={navItemClass("/admin/developer")} title="Developer Config"> 
            <Code size={18} className="shrink-0" /> 
            {!isSidebarCollapsed && <span>Developer Config</span>} 
          </Link>
          <Link to="/admin/settings" className={navItemClass('/admin/settings')} title="System Settings">
            <Settings size={18} className="shrink-0" />
            {!isSidebarCollapsed && <span>System Settings</span>}
          </Link>
        </div>
      </div>
    </div>
  );

  const adminNavGroups = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, desc: 'Main control panel & platform metrics' },
        { label: 'Analytics', path: '/admin/analytics', icon: Sparkles, desc: 'Growth analytics & visitor insights' },
        { label: 'Reports', path: '/admin/reports', icon: BarChart, desc: 'Performance reports & data export' },
      ],
    },
    {
      title: 'USER MANAGEMENT',
      items: [
        { label: 'Franchise Seekers', path: '/admin/seekers', icon: Users, desc: 'Investor leads & verification' },
        { label: 'Brand Directory', path: '/admin/brands', icon: Building2, desc: 'Verified brand partners directory' },
        { label: 'Users & Staff', path: '/admin/users', icon: UserCircle, desc: 'Platform users & administrative staff' },
      ],
    },
    {
      title: 'BRAND MANAGEMENT',
      items: [
        { label: 'Brand Directory', path: '/admin/brands', icon: Building2, desc: 'Verified brand partners directory' },
        { label: 'Bulk Brand Listing', path: '/admin/bulk-brands', icon: FileSpreadsheet, desc: 'Excel-style spreadsheet bulk brand creator' },
        { label: 'Brand Approvals', path: '/admin/brands', icon: ShieldCheck, desc: 'Pending listing verification queue' },
        { label: 'Verification Queue', path: '/admin/brands', icon: CheckCircle, desc: 'FDD & legal compliance auditing' },
        { label: 'Featured Brands', path: '/admin/featured', icon: Crown, desc: 'Promoted & sponsored brand listings' },
        { label: 'Brand Categories', path: '/admin/brands', icon: Folder, desc: 'Industry taxonomy & sector tags' },
        { label: 'Brand Locations', path: '/admin/brands', icon: MapPin, desc: 'Geographic franchise coverage' },
      ],
    },
    {
      title: 'MATCHMAKING',
      items: [
        { label: 'Match Overview', path: '/admin/smart-match', icon: Target, desc: 'AI Match Engine operational status' },
        { label: 'Match Configuration', path: '/admin/smart-match', icon: Sliders, desc: 'Configure matching rules & scoring' },
        { label: 'Match Rules', path: '/admin/smart-match', icon: Code, desc: 'Algorithm weights & criteria matrix' },
        { label: 'Match Performance', path: '/admin/smart-match', icon: Activity, desc: 'Match conversion & success rates' },
        { label: 'Connections', path: '/admin/connections', icon: Sparkles, desc: 'All Seeker ↔ Brand matches & statuses' },
      ],
    },
    {
      title: 'MONETIZATION',
      items: [
        { label: 'Subscription Plans', path: '/admin/subscriptions', icon: Star, desc: 'Membership tiers & pricing plans' },
        { label: 'Payments & Revenue', path: '/admin/payments', icon: BarChart, desc: 'Financial ledger & revenue metrics' },
        { label: 'Transactions', path: '/admin/payments', icon: FileSpreadsheet, desc: 'Payment gateways & transaction logs' },
        { label: 'Invoices', path: '/admin/payments', icon: FileText, desc: 'Billing history & tax invoices' },
      ],
    },
    {
      title: 'CONTENT & WEBSITE',
      items: [
        { label: 'CMS & Pages', path: '/admin/cms', icon: FileText, desc: 'Page editor & dynamic content CMS' },
        { label: 'Homepage Management', path: '/admin/homepage-management', icon: LayoutDashboard, desc: 'Hero banners & landing section layout' },
        { label: 'Navigation/Menu Management', path: '/admin/navigation-management', icon: Sliders, desc: 'Header navigation & footer links' },
        { label: 'Media Library', path: '/admin/media', icon: Folder, desc: 'Images & document asset library' },
        { label: 'Featured Content', path: '/admin/featured', icon: Star, desc: 'Spotlights & success stories' },
      ],
    },
    {
      title: 'NOTIFICATIONS',
      items: [
        { label: 'Notifications', path: '/admin/notifications', icon: MessageSquare, desc: 'In-app alerts & push message logs' },
        { label: 'Connection Alerts', path: '/admin/connections', icon: Bell, desc: 'Track new Seeker ↔ Brand matches' },
        { label: 'Broadcast Center', path: '/admin/communications', icon: Bell, desc: 'Send platform push & email alerts' },
        { label: 'Announcements', path: '/admin/communications', icon: Sparkles, desc: 'System banner announcements' },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        { label: 'Activity / Audit Logs', path: '/admin/audit-logs', icon: ShieldAlert, desc: 'Track system changes & audit trails' },
        { label: 'Platform Health', path: '/admin/developer', icon: Activity, desc: 'Server health & API uptime' },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { label: 'Roles & Permissions', path: '/admin/roles', icon: Lock, desc: 'Role-based access control matrix' },
        { label: 'Backup & Restore', path: '/admin/backup', icon: Database, desc: 'Database snapshots & recovery' },
        { label: 'Import / Export', path: '/admin/import-export', icon: FileSpreadsheet, desc: 'Bulk CSV/JSON data tools' },
        { label: 'Developer Configuration', path: '/admin/developer', icon: Code, desc: 'API keys & system environment' },
        { label: 'System Settings', path: '/admin/settings', icon: Settings, desc: 'Global platform configuration' },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { label: 'My Profile', path: '/admin/settings', icon: UserCircle, desc: 'Super Admin profile details' },
        { label: 'Security', path: '/admin/roles', icon: Lock, desc: '2FA & authentication security' },
        { label: 'Logout', path: 'LOGOUT', icon: LogOut, desc: 'Sign out of Owner Control Center' },
      ],
    },
  ];

  const brandNavGroups = [
    {
      title: 'BRAND PORTAL',
      items: [
        { label: 'Dashboard', path: '/brand', icon: LayoutDashboard, desc: 'Overview & pipeline metrics' },
        { label: 'Find Franchise Seekers', path: '/search', icon: Search, desc: '100-point AI match for verified investors' },
        { label: 'Saved Leads', path: '/brand/saved-leads', icon: Bookmark, desc: 'Your saved seeker list' },
        { label: 'CRM Pipeline', path: '/brand/crm', icon: Briefcase, desc: 'Manage lead statuses & deals' },
        { label: 'Applications', path: '/brand/applications', icon: FileText, desc: 'Inbound seeker applications' },
        { label: 'Meetings', path: '/brand/meetings', icon: Calendar, desc: 'Scheduled calls & sessions' },
      ],
    },
    {
      title: 'MONETIZATION',
      items: [
        { label: 'Subscription', path: '/brand/subscription', icon: Star, desc: 'Membership tiers & credits' },
        { label: 'Payments & Invoices', path: '/brand/payments', icon: BarChart, desc: 'Billing history & GST receipts' },
        { label: 'Analytics', path: '/brand/analytics', icon: Sparkles, desc: 'Lead demand & ROI insights' },
      ],
    },
    {
      title: 'BRAND ACCOUNT',
      items: [
        { label: 'Brand Profile', path: '/brand/profile', icon: UserCircle, desc: 'Company details & media' },
        { label: 'Notifications', path: '/brand/notifications', icon: Bell, desc: 'System alerts & inquiries' },
        { label: 'Logout', path: 'LOGOUT', icon: LogOut, desc: 'Sign out of Brand Portal' },
      ],
    },
  ];

  const renderSeekerNav = () => (
    <div className="space-y-6">
      <div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2">
          Seeker Portal
        </div>
        <div className="space-y-1">
          <Link to="/seeker" className={navItemClass('/seeker')}>
            <LayoutDashboard size={18} />
            {!isSidebarCollapsed && <span>Dashboard</span>}
          </Link>
          <Link to="/seeker/browse-brands" className={navItemClass('/seeker/browse-brands')}>
            <Building2 size={18} />
            {!isSidebarCollapsed && <span>Browse Brands</span>}
          </Link>
          <Link to="/seeker/saved-brands" className={navItemClass('/seeker/saved-brands')}>
            <Bookmark size={18} />
            {!isSidebarCollapsed && <span>Saved Brands</span>}
          </Link>
          <Link to="/seeker/connections" className={navItemClass('/seeker/connections')}>
            <Users size={18} />
            {!isSidebarCollapsed && <span>My Connections</span>}
          </Link>
          <Link to="/seeker/meetings" className={navItemClass('/seeker/meetings')}>
            <Calendar size={18} />
            {!isSidebarCollapsed && <span>Meetings</span>}
          </Link>
        </div>
      </div>

      <div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2">
          Intelligence Tools
        </div>
        <div className="space-y-1">
          <Link to="/seeker" className={navItemClass('/seeker#smart-match')}>
            <Sparkles size={18} className="text-amber-500" />
            {!isSidebarCollapsed && <span>Smart Match</span>}
          </Link>
          <Link to="/seeker/roi-calculator/advanced" className={navItemClass('/seeker/roi-calculator/advanced')}>
            <Calculator size={18} />
            {!isSidebarCollapsed && <span>Advanced ROI Calculator</span>}
          </Link>
          <Link to="/seeker/brand-verification" className={navItemClass('/seeker/brand-verification')}>
            <ShieldCheck size={18} className="text-emerald-500" />
            {!isSidebarCollapsed && <span>Brand Verification</span>}
          </Link>
        </div>
      </div>

      <div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2">
          Account
        </div>
        <div className="space-y-1">
          <Link to="/seeker/profile" className={navItemClass('/seeker/profile')}>
            <UserCircle size={18} />
            {!isSidebarCollapsed && <span>My Profile</span>}
          </Link>
          <Link to="/seeker/premium" className={navItemClass('/seeker/premium')}>
            <Crown size={18} className="text-amber-600" />
            {!isSidebarCollapsed && <span>Membership</span>}
          </Link>
          <Link to="/seeker/notifications" className={navItemClass('/seeker/notifications')}>
            <Bell size={18} />
            {!isSidebarCollapsed && <span>Notifications</span>}
          </Link>
          <Link to="/seeker/settings" className={navItemClass('/seeker/settings')}>
            <Settings size={18} />
            {!isSidebarCollapsed && <span>Settings</span>}
          </Link>
        </div>
      </div>
    </div>
  );

  const seekerNavGroups = [
    {
      title: 'SEEKER PORTAL',
      items: [
        { label: 'Dashboard', path: '/seeker', icon: LayoutDashboard, desc: 'Overview & Smart Matches' },
        { label: 'Find Franchise Brands', path: '/seeker/browse-brands', icon: Building2, desc: 'Explore franchise network with 100-point matching' },
        { label: 'Saved Brands', path: '/seeker/saved-brands', icon: Bookmark, desc: 'Your saved wishlist' },
        { label: 'My Connections', path: '/seeker/connections', icon: Users, desc: 'Active brand conversations' },
        { label: 'Meetings', path: '/seeker/meetings', icon: Calendar, desc: 'Strategy sessions & calls' },
      ]
    },
    {
      title: 'INTELLIGENCE TOOLS',
      items: [
        { label: 'Advanced ROI Calculator', path: '/seeker/roi-calculator/advanced', icon: Calculator, desc: 'Financial payback modeling' },
        { label: 'Smart Match', path: '/seeker', icon: Sparkles, desc: 'AI compatibility breakdown' },
        { label: 'Brand Verification', path: '/seeker/brand-verification', icon: ShieldCheck, desc: 'FDD & KYC verification' },
      ]
    },
    {
      title: 'ACCOUNT',
      items: [
        { label: 'My Profile', path: '/seeker/profile', icon: UserCircle, desc: 'Investor profile settings' },
        { label: 'Membership', path: '/seeker/premium', icon: Crown, desc: 'VIP Elite subscription' },
        { label: 'Notifications', path: '/seeker/notifications', icon: Bell, desc: 'Alerts & updates' },
        { label: 'Settings', path: '/seeker/settings', icon: Settings, desc: 'Preferences & security' },
        { label: 'Logout', path: 'LOGOUT', icon: LogOut, desc: 'Sign out of account' },
      ]
    }
  ];

  return (
    <div className="min-h-screen flex font-sans overflow-hidden bg-[#F6F9FC] text-[#172033]">
      {/* Premium Owner Console Slide-Out Navigation Drawer */}
      {isAdminDrawerOpen && user?.role === 'SUPER_ADMIN' && (
        <div className="fixed inset-0 z-50 flex animate-fadeIn">
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsAdminDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-[88vw] sm:w-[380px] md:w-[400px] bg-white text-[#172033] h-full shadow-2xl flex flex-col z-10 border-r border-[#E2EAF4]">
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#E2EAF4] flex items-center justify-between shrink-0 bg-[#F8FAFC] sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <img 
                  src="/logo.jpg" 
                  alt="BrizX India Logo" 
                  className="w-10 h-10 rounded-xl object-cover border border-[#E2EAF4] shadow-xs shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-base font-black tracking-tight text-[#172033] flex items-center gap-2 font-heading">
                    BRIZX <span className="text-blue-600">INDIA</span>
                  </div>
                  <div className="text-[9px] font-black text-blue-700 uppercase tracking-widest bg-[#EAF2FF] px-2 py-0.5 rounded border border-[#BFDBFE] inline-block">
                    OWNER CONSOLE
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setIsAdminDrawerOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer border border-slate-200"
                title="Close Navigation Menu (Esc)"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Grouped Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
              {adminNavGroups.map((group, groupIdx) => (
                <div key={groupIdx} className="space-y-2">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-3">
                    {group.title}
                  </div>
                  <div className="space-y-1">
                    {group.items.map((item, itemIdx) => {
                      if (item.path === 'LOGOUT') {
                        return (
                          <button
                            key={itemIdx}
                            onClick={() => {
                              setIsAdminDrawerOpen(false);
                              handleLogout();
                            }}
                            className="w-full text-left flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all cursor-pointer border border-red-200 mt-2"
                          >
                            <div className="flex items-center gap-3">
                              <item.icon size={18} className="text-red-500 shrink-0" />
                              <div>
                                <div className="font-bold text-xs">{item.label}</div>
                                <div className="text-[10px] text-red-400 font-normal">{item.desc}</div>
                              </div>
                            </div>
                            <ChevronRight size={14} className="text-red-400" />
                          </button>
                        );
                      }

                      const isActive = location.pathname === item.path;
                      const IconComponent = item.icon;

                      return (
                        <Link
                          key={itemIdx}
                          to={item.path}
                          onClick={() => setIsAdminDrawerOpen(false)}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#EAF2FF] text-blue-700 font-bold border-l-4 border-blue-600 shadow-xs'
                              : 'text-slate-700 hover:bg-[#F3F7FF] hover:text-blue-600 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <IconComponent size={18} className={isActive ? 'text-blue-600 shrink-0' : 'text-slate-400 shrink-0'} />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className={isActive ? 'font-black text-blue-700' : 'font-semibold text-slate-800'}>{item.label}</span>
                                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>}
                              </div>
                              {item.desc && (
                                <div className={`text-[10px] font-normal ${isActive ? 'text-blue-600/70' : 'text-slate-400'}`}>
                                  {item.desc}
                                </div>
                              )}
                            </div>
                          </div>
                          <ChevronRight size={14} className={isActive ? 'text-blue-600' : 'text-slate-300'} />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Sticky Account Footer */}
            <div className="p-4 border-t border-[#E2EAF4] bg-[#F8FAFC] shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-xs shadow-xs border border-blue-500/40 shrink-0">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-[#172033] truncate max-w-[140px]">{user?.name || 'Super Admin'}</div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase">Super Admin Role</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsAdminDrawerOpen(false);
                    handleLogout();
                  }}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1"
                >
                  <LogOut size={12} /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Seeker Navigation Drawer */}
      {isSeekerDrawerOpen && user?.role === 'FRANCHISE_SEEKER' && (
        <div className="fixed inset-0 z-50 flex animate-fadeIn">
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsSeekerDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-[88vw] sm:w-[380px] md:w-[400px] bg-white text-[#172033] h-full shadow-2xl flex flex-col z-10 border-r border-[#E2EAF4]">
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#E2EAF4] flex items-center justify-between shrink-0 bg-[#F8FAFC] sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <img 
                  src="/logo.jpg" 
                  alt="BrizX India Logo" 
                  className="w-10 h-10 rounded-xl object-cover border border-[#E2EAF4] shadow-xs shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-base font-black tracking-tight text-[#172033] flex items-center gap-2 font-heading">
                    BRIZX <span className="text-blue-600">INDIA</span>
                  </div>
                  <div className="text-[9px] font-black text-blue-700 uppercase tracking-widest bg-[#EAF2FF] px-2 py-0.5 rounded border border-[#BFDBFE] inline-block">
                    SEEKER PORTAL
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setIsSeekerDrawerOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer border border-slate-200"
                title="Close Navigation Menu (Esc)"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Grouped Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
              {seekerNavGroups.map((group, groupIdx) => (
                <div key={groupIdx} className="space-y-2">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-3">
                    {group.title}
                  </div>
                  <div className="space-y-1">
                    {group.items.map((item, itemIdx) => {
                      if (item.path === 'LOGOUT') {
                        return (
                          <button
                            key={itemIdx}
                            onClick={() => {
                              setIsSeekerDrawerOpen(false);
                              handleLogout();
                            }}
                            className="w-full text-left flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all cursor-pointer border border-red-200 mt-2"
                          >
                            <div className="flex items-center gap-3">
                              <item.icon size={18} className="text-red-500 shrink-0" />
                              <div>
                                <div className="font-bold text-xs">{item.label}</div>
                                <div className="text-[10px] text-red-400 font-normal">{item.desc}</div>
                              </div>
                            </div>
                            <ChevronRight size={14} className="text-red-400" />
                          </button>
                        );
                      }

                      const isActive = location.pathname === item.path;
                      const IconComponent = item.icon;

                      return (
                        <Link
                          key={itemIdx}
                          to={item.path}
                          onClick={() => setIsSeekerDrawerOpen(false)}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#EAF2FF] text-blue-700 font-bold border-l-4 border-blue-600 shadow-xs'
                              : 'text-slate-700 hover:bg-[#F3F7FF] hover:text-blue-600 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <IconComponent size={18} className={isActive ? 'text-blue-600 shrink-0' : 'text-slate-400 shrink-0'} />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className={isActive ? 'font-black text-blue-700' : 'font-semibold text-slate-800'}>{item.label}</span>
                                {item.label === 'Notifications' && unreadNotifications.length > 0 && (
                                  <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0">
                                    {unreadNotifications.length}
                                  </span>
                                )}
                                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>}
                              </div>
                              {item.desc && (
                                <div className={`text-[10px] font-normal ${isActive ? 'text-blue-600/70' : 'text-slate-400'}`}>
                                  {item.desc}
                                </div>
                              )}
                            </div>
                          </div>
                          <ChevronRight size={14} className={isActive ? 'text-blue-600' : 'text-slate-300'} />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Sticky Account Footer */}
            <div className="p-4 border-t border-[#E2EAF4] bg-[#F8FAFC] shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-xs shadow-xs border border-blue-500/40 shrink-0 overflow-hidden">
                    {userAvatar ? (
                      <img src={userAvatar} alt={user?.name || currentSeeker?.name || 'User Avatar'} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      user?.name?.charAt(0) || currentSeeker?.name?.charAt(0) || 'S'
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-[#172033] truncate max-w-[140px]">{user?.name || currentSeeker?.name || 'Seeker'}</div>
                    <div className="text-[9px] font-black text-emerald-600 uppercase flex items-center gap-1">
                      <ShieldCheck size={10} /> Verified Seeker
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsSeekerDrawerOpen(false);
                    handleLogout();
                  }}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1"
                >
                  <LogOut size={12} /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Brand Navigation Drawer (Unified Drawer for Desktop & Mobile) */}
      {isBrandDrawerOpen && user?.role === 'BRAND_OWNER' && (
        <div className="fixed inset-0 z-50 flex animate-fadeIn" role="dialog" aria-modal="true" aria-label="Brand Portal Menu">
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 cursor-pointer"
            onClick={() => setIsBrandDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-[88vw] sm:w-[380px] md:w-[410px] bg-white text-slate-900 h-full shadow-2xl flex flex-col z-10 border-r border-[#E2EAF4]">
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-[#E2EAF4] flex items-center justify-between shrink-0 bg-[#FAFCFF] sticky top-0 z-10">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-1 bg-white rounded-xl border border-[#BFDBFE] shadow-2xs shrink-0">
                  <img 
                    src="/logo.jpg" 
                    alt="BrizX India Logo" 
                    className="w-9 h-9 rounded-lg object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-base font-black tracking-tight text-indigo-950 flex items-center gap-2 font-heading truncate">
                    BRIZX <span className="text-blue-600">INDIA</span>
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0 mt-0.5">
                    <span className="text-[9px] font-black text-blue-700 uppercase tracking-widest bg-[#EAF2FF] px-2 py-0.5 rounded border border-[#BFDBFE] shrink-0">
                      BRAND PORTAL
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 truncate">
                      {currentBrand?.brandName || user?.name || 'Verified Brand'}
                    </span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setIsBrandDrawerOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer border border-slate-200 shrink-0 ml-2"
                title="Close Navigation Menu (Esc)"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Grouped Items & Drawer Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
              {/* Quick Actions Panel */}
              <div className="bg-[#F4F8FF] border border-[#BFDBFE]/80 rounded-2xl p-3.5 space-y-2.5">
                <div className="text-[10px] font-extrabold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={12} className="text-blue-600" /> Quick Actions
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/search"
                    onClick={() => setIsBrandDrawerOpen(false)}
                    className="flex items-center gap-2 p-2 bg-white rounded-xl border border-blue-100 hover:border-blue-300 hover:shadow-2xs text-xs font-bold text-slate-700 hover:text-blue-700 transition-all"
                  >
                    <Search size={14} className="text-blue-600 shrink-0" />
                    <span className="truncate">Search Seekers</span>
                  </Link>
                  <Link
                    to="/brand/crm"
                    onClick={() => setIsBrandDrawerOpen(false)}
                    className="flex items-center gap-2 p-2 bg-white rounded-xl border border-blue-100 hover:border-blue-300 hover:shadow-2xs text-xs font-bold text-slate-700 hover:text-blue-700 transition-all"
                  >
                    <Briefcase size={14} className="text-blue-600 shrink-0" />
                    <span className="truncate">CRM Pipeline</span>
                  </Link>
                  <Link
                    to="/brand/applications"
                    onClick={() => setIsBrandDrawerOpen(false)}
                    className="flex items-center gap-2 p-2 bg-white rounded-xl border border-blue-100 hover:border-blue-300 hover:shadow-2xs text-xs font-bold text-slate-700 hover:text-blue-700 transition-all"
                  >
                    <FileText size={14} className="text-blue-600 shrink-0" />
                    <span className="truncate">Applications</span>
                  </Link>
                  <Link
                    to="/brand/subscription"
                    onClick={() => setIsBrandDrawerOpen(false)}
                    className="flex items-center gap-2 p-2 bg-white rounded-xl border border-blue-100 hover:border-blue-300 hover:shadow-2xs text-xs font-bold text-slate-700 hover:text-blue-700 transition-all"
                  >
                    <Crown size={14} className="text-blue-600 shrink-0" />
                    <span className="truncate">Subscription</span>
                  </Link>
                </div>
              </div>

              {/* Navigation Categories */}
              {brandNavGroups.map((group, groupIdx) => (
                <div key={groupIdx} className="space-y-2">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-3">
                    {group.title}
                  </div>
                  <div className="space-y-1">
                    {group.items.map((item, itemIdx) => {
                      if (item.path === 'LOGOUT') {
                        return (
                          <button
                            key={itemIdx}
                            onClick={() => {
                              setIsBrandDrawerOpen(false);
                              handleLogout();
                            }}
                            className="w-full text-left flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all cursor-pointer border border-rose-200 mt-2"
                          >
                            <div className="flex items-center gap-3">
                              <item.icon size={18} className="text-rose-500 shrink-0" />
                              <div>
                                <div className="font-bold text-xs">{item.label}</div>
                                <div className="text-[10px] text-rose-400 font-normal">{item.desc}</div>
                              </div>
                            </div>
                            <ChevronRight size={14} className="text-rose-400" />
                          </button>
                        );
                      }

                      const isActive = location.pathname === item.path;
                      const IconComponent = item.icon;

                      return (
                        <Link
                          key={itemIdx}
                          to={item.path}
                          onClick={() => setIsBrandDrawerOpen(false)}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#EAF2FF] text-blue-700 font-bold border-l-4 border-blue-600 shadow-xs'
                              : 'text-slate-700 hover:bg-[#F3F7FF] hover:text-blue-600 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <IconComponent size={18} className={isActive ? 'text-blue-600 shrink-0' : 'text-slate-400 shrink-0'} />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className={isActive ? 'font-black text-blue-700' : 'font-semibold text-slate-800'}>{item.label}</span>
                                {item.label === 'Notifications' && unreadNotifications.length > 0 && (
                                  <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0">
                                    {unreadNotifications.length}
                                  </span>
                                )}
                                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>}
                              </div>
                              {item.desc && (
                                <div className={`text-[10px] font-normal ${isActive ? 'text-blue-600/70' : 'text-slate-400'}`}>
                                  {item.desc}
                                </div>
                              )}
                            </div>
                          </div>
                          <ChevronRight size={14} className={isActive ? 'text-blue-600' : 'text-slate-300'} />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Sticky Account Footer */}
            <div className="p-4 border-t border-[#E2EAF4] bg-[#FAFCFF] shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-xs shadow-xs border border-blue-500/40 shrink-0 overflow-hidden">
                    {userAvatar ? (
                      <img src={userAvatar} alt="Brand Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      currentBrand?.brandName?.charAt(0) || user?.name?.charAt(0) || 'B'
                    )}
                  </div>
                  <div className="overflow-hidden min-w-0">
                    <div className="text-xs font-bold text-indigo-950 truncate max-w-[130px] sm:max-w-[150px]">
                      {currentBrand?.brandName || user?.name || 'Brand Owner'}
                    </div>
                    <div className="text-[9px] font-black text-blue-600 uppercase flex items-center gap-1">
                      <ShieldCheck size={10} /> Verified Brand
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsBrandDrawerOpen(false);
                    handleLogout();
                  }}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shrink-0 ml-2"
                >
                  <LogOut size={12} /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto relative min-w-0">
        {/* Top Navigation Bar */}
        <header className="h-20 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-6 md:px-8 shrink-0 sticky top-0 z-20 shadow-2xs">
          {user?.role === 'SUPER_ADMIN' ? (
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <button
                onClick={() => setIsAdminDrawerOpen(true)}
                className="px-3.5 sm:px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-xs transition-all cursor-pointer border border-blue-200 active:scale-95 group shrink-0"
                title="Open Owner Console Menu"
              >
                <Menu size={18} className="group-hover:rotate-90 transition-transform duration-200 text-blue-600" />
                <span className="font-bold text-xs tracking-wide hidden sm:inline">MENU</span>
              </button>

              <div className="flex items-center gap-3 min-w-0">
                <Link to="/admin" className="flex items-center gap-2.5 sm:gap-3 group min-w-0">
                  <div className="bg-white p-1.5 sm:p-2 rounded-2xl border border-slate-200 shadow-sm group-hover:border-blue-400 group-hover:shadow-md transition-all flex items-center justify-center shrink-0">
                    <img 
                      src="/logo.jpg" 
                      alt="BrizX India Logo" 
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm sm:text-base font-black tracking-tight text-slate-900 font-heading truncate">
                        BRIZX <span className="text-blue-600">INDIA</span>
                      </span>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-200 shadow-2xs shrink-0">
                        OWNER CONSOLE
                      </span>
                    </div>
                  </div>
                </Link>
              </div>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex px-4 py-2 bg-slate-50 text-slate-500 hover:text-slate-900 rounded-xl text-xs font-semibold items-center gap-3 border border-slate-200 w-44 lg:w-60 justify-between transition-all cursor-pointer shadow-2xs ml-1"
              >
                <div className="flex items-center gap-2">
                  <Search size={14} className="text-slate-400" />
                  <span>Search...</span>
                </div>
                <span className="bg-white text-slate-400 text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-200">
                  ⌘K
                </span>
              </button>
            </div>
          ) : user?.role === 'FRANCHISE_SEEKER' ? (
            <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
              <button
                onClick={() => setIsSeekerDrawerOpen(true)}
                className="px-2.5 sm:px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer border border-blue-200 active:scale-95 group shrink-0"
                title="Open Seeker Portal Menu"
              >
                <Menu size={16} className="group-hover:rotate-90 transition-transform duration-200 text-blue-600 shrink-0" />
                <span className="font-bold text-xs tracking-wide">MENU</span>
              </button>

              <div className="flex items-center gap-2 min-w-0">
                <Link to="/seeker" className="flex items-center gap-2 group min-w-0">
                  <div className="bg-white p-1 rounded-xl sm:rounded-2xl border border-blue-100 shadow-xs group-hover:border-blue-400 transition-all flex items-center justify-center shrink-0">
                    <img 
                      src="/logo.jpg" 
                      alt="BrizX India Logo" 
                      className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-col min-w-0 ml-2 sm:ml-3">
                    <div className="flex items-center min-w-0">
                      <span className="text-sm sm:text-base md:text-lg font-black tracking-tight text-slate-900 font-heading truncate">
                        BRIZX <span className="text-blue-500">INDIA</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </div>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden lg:flex px-4 py-2 bg-slate-50 text-slate-500 hover:text-slate-900 rounded-xl text-xs font-semibold items-center gap-3 border border-slate-200 w-44 lg:w-60 justify-between transition-all cursor-pointer shadow-2xs ml-1"
              >
                <div className="flex items-center gap-2">
                  <Search size={14} className="text-slate-400" />
                  <span>Search brands...</span>
                </div>
                <span className="bg-white text-slate-400 text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-200">
                  ⌘K
                </span>
              </button>
            </div>
          ) : user?.role === 'BRAND_OWNER' ? (
            <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
              <button
                onClick={() => setIsBrandDrawerOpen(true)}
                className="px-2.5 sm:px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 sm:gap-2 shadow-2xs transition-all cursor-pointer border border-blue-200 active:scale-95 group shrink-0"
                title="Open Brand Portal Menu"
              >
                <Menu size={16} className="group-hover:rotate-90 transition-transform duration-200 text-blue-600 shrink-0" />
                <span className="font-bold text-xs tracking-wide">MENU</span>
              </button>

              <div className="flex items-center gap-2 min-w-0">
                <Link to="/brand" className="flex items-center gap-2 group min-w-0">
                  <div className="bg-white p-1 rounded-xl sm:rounded-2xl border border-blue-100 shadow-2xs group-hover:border-blue-400 transition-all flex items-center justify-center shrink-0">
                    <img 
                      src="/logo.jpg" 
                      alt="BrizX India Logo" 
                      className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-col min-w-0 ml-2 sm:ml-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm sm:text-base md:text-lg font-black tracking-tight text-indigo-950 font-heading truncate">
                        BRIZX <span className="text-blue-600">INDIA</span>
                      </span>
                      <span className="hidden sm:inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-[9px] font-black uppercase tracking-widest rounded-lg border border-blue-200 shadow-2xs shrink-0">
                        BRAND PORTAL
                      </span>
                    </div>
                    <div className="hidden sm:block text-[11px] font-bold text-slate-500 truncate max-w-[200px] md:max-w-[280px]">
                      {currentBrand?.brandName || user?.name || 'Verified Brand'}
                    </div>
                  </div>
                </Link>
              </div>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden lg:flex px-4 py-2 bg-slate-50 text-slate-500 hover:text-slate-900 rounded-xl text-xs font-semibold items-center gap-3 border border-slate-200 w-44 lg:w-60 justify-between transition-all cursor-pointer shadow-2xs ml-1"
              >
                <div className="flex items-center gap-2">
                  <Search size={14} className="text-slate-400" />
                  <span>Search seekers...</span>
                </div>
                <span className="bg-white text-slate-400 text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-200">
                  ⌘K
                </span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 min-w-0">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="px-4 py-2 bg-slate-100 text-slate-500 hover:text-indigo-950 rounded-xl text-xs font-semibold flex items-center gap-3 border border-slate-200 w-64 md:w-80 justify-between transition-all cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <Search size={14} className="text-slate-400" />
                  <span>Search everything...</span>
                </div>
                <span className="bg-white text-slate-400 text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-200">
                  ⌘K
                </span>
              </button>
            </div>
          )}

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(prev => !prev)}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-700 text-white font-black text-xs flex items-center justify-center overflow-hidden shrink-0">
                  {userAvatar ? (
                    <img src={userAvatar} alt={user?.name || currentSeeker?.name || 'User Avatar'} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    user?.name?.charAt(0) || currentSeeker?.name?.charAt(0) || 'A'
                  )}
                </div>
                <div className="hidden md:block text-left text-xs pr-2">
                  <div className="font-bold text-indigo-950 dark:text-white truncate max-w-[100px]">
                    {user?.name || currentSeeker?.name || 'User'}
                  </div>
                  <div className="text-[9px] font-extrabold text-blue-500 uppercase tracking-widest">
                    {user?.role === 'SUPER_ADMIN' ? 'Super Admin' : user?.role === 'BRAND_OWNER' ? 'Brand Owner' : 'Franchise Seeker'}
                  </div>
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 text-xs font-semibold">
                  <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-xs overflow-hidden shrink-0">
                      {userAvatar ? (
                        <img src={userAvatar} alt={user?.name || currentSeeker?.name || 'User Avatar'} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        user?.name?.charAt(0) || currentSeeker?.name?.charAt(0) || 'A'
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-indigo-950 dark:text-white truncate">{user?.name || currentSeeker?.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user?.email || currentSeeker?.email}</p>
                    </div>
                  </div>
                  {user?.role === 'SUPER_ADMIN' ? (
                    <Link 
                      to="/admin/settings" 
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 mt-1"
                    >
                      <Settings size={14} /> System Settings
                    </Link>
                  ) : user?.role === 'BRAND_OWNER' ? (
                    <Link 
                      to="/brand/profile" 
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 mt-1"
                    >
                      <UserCircle size={14} /> Brand Profile
                    </Link>
                  ) : (
                    <Link 
                      to="/seeker/profile" 
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 mt-1"
                    >
                      <Settings size={14} /> My Profile
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 transition-colors cursor-pointer mt-1 font-bold"
                  >
                    <LogOut size={14} /> Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Global Search Modal */}
        {isSearchOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-start justify-center pt-20 p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <Search size={18} className="text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Type a command or search seekers, brands, pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm font-semibold bg-transparent outline-none text-slate-900 dark:text-white"
                />
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 max-h-96 overflow-y-auto space-y-4">
                {searchQuery === '' ? (
                  <div className="text-center py-8 text-slate-400 text-xs font-medium">
                    Start typing to search across all BrizX modules and directories.
                  </div>
                ) : (
                  <>
                    {searchResults.pages.length > 0 && (
                      <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">
                          System Modules
                        </div>
                        <div className="space-y-1">
                          {searchResults.pages.map((p, i) => (
                            <Link
                              key={i}
                              to={p.path}
                              onClick={() => setIsSearchOpen(false)}
                              className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-indigo-950 dark:text-white"
                            >
                              <span>{p.name}</span>
                              <ArrowUpRight size={14} className="text-slate-400" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchResults.seekers.length > 0 && (
                      <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">
                          Franchise Seekers
                        </div>
                        <div className="space-y-1">
                          {searchResults.seekers.map((s, i) => (
                            <Link
                              key={i}
                              to="/admin/seekers"
                              onClick={() => setIsSearchOpen(false)}
                              className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
                            >
                              <div>
                                <div className="font-bold text-blue-700 dark:text-indigo-200">{s.name}</div>
                                <div className="text-[10px] text-slate-400">{s.city} • {s.industry}</div>
                              </div>
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">₹{s.investment}L</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchResults.brands.length > 0 && (
                      <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">
                          Brands
                        </div>
                        <div className="space-y-1">
                          {searchResults.brands.map((b, i) => (
                            <Link
                              key={i}
                              to="/admin/brands"
                              onClick={() => setIsSearchOpen(false)}
                              className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
                            >
                              <div>
                                <div className="font-bold text-blue-700 dark:text-indigo-200">{b.brandName}</div>
                                <div className="text-[10px] text-slate-400">{b.industry}</div>
                              </div>
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Verified</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Page Content Wrapped in Error Boundary */}
        <div className={`flex-1 relative ${user?.role === 'FRANCHISE_SEEKER' || location.pathname === '/brand' || location.pathname === '/brand/' ? 'p-0' : 'p-6 md:p-8'}`}>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}
