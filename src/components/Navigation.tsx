import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Navigation() {
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const moreDropdownRef = useRef<HTMLDivElement>(null);

  const primaryNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'Brands', path: '/brands' },
    { name: 'Seekers', path: '/seekers' },
    { name: 'Services', path: '/services' },
    { name: 'Pricing', path: '/pricing' },
  ];

  const secondaryNavLinks = [
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const allNavLinks = [...primaryNavLinks, ...secondaryNavLinks];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isSecondaryActive = secondaryNavLinks.some(link => isActive(link.path));

  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    handleScroll(); // Check initial position
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close "More" dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreOpen(false);
  }, [location.pathname]);

  return (
    <header className={`sticky top-0 z-[9999] w-full transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 backdrop-blur-lg border-b border-slate-200 shadow-[0_4px_20px_-5px_rgba(15,23,42,0.1)]' 
        : 'bg-white border-b border-slate-100 shadow-[0_4px_30px_rgba(15,23,42,0.03)]'
    }`}>
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-5 lg:px-8">
        <nav className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-3 lg:gap-4 xl:gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="bg-white p-1.5 sm:p-2 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.06)] group-hover:border-blue-400 group-hover:shadow-[0_4px_16px_rgba(37,99,235,0.15)] transition-all flex items-center justify-center shrink-0">
              <img 
                src="/logo.jpg" 
                alt="BrizX India Logo" 
                className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-xl object-cover group-hover:scale-105 transition-transform shrink-0"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg lg:text-xl font-extrabold tracking-tight text-slate-900 leading-none whitespace-nowrap">
                BRIZX<span className="text-blue-600 font-black ml-0.5">INDIA</span>
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.12em] text-slate-400 uppercase mt-0.5 whitespace-nowrap hidden sm:block">
                Search. Match. Grow.
              </span>
            </div>
          </Link>

          {/* Desktop/Laptop Nav Links */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-4 2xl:gap-6 font-bold text-xs uppercase tracking-wider shrink-0">
            {/* Primary Nav Links */}
            {primaryNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-all py-1.5 px-1 relative whitespace-nowrap ${
                  isActive(link.path)
                    ? 'text-blue-600 font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full shadow-[0_1px_4px_rgba(37,99,235,0.4)]"></span>
                )}
              </Link>
            ))}

            {/* Secondary Nav Links (Blog, Contact) shown inline on XL screens (1280px+) */}
            {secondaryNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`hidden xl:block transition-all py-1.5 px-1 relative whitespace-nowrap ${
                  isActive(link.path)
                    ? 'text-blue-600 font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full shadow-[0_1px_4px_rgba(37,99,235,0.4)]"></span>
                )}
              </Link>
            ))}

            {/* "More" Dropdown menu for LG screens (1024px to 1279px) */}
            <div ref={moreDropdownRef} className="relative hidden lg:block xl:hidden">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className={`flex items-center gap-1 py-1.5 px-1 transition-all cursor-pointer relative whitespace-nowrap ${
                  isSecondaryActive || moreOpen
                    ? 'text-blue-600 font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>More</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} />
                {isSecondaryActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full shadow-[0_1px_4px_rgba(37,99,235,0.4)]"></span>
                )}
              </button>

              {/* Dropdown Menu */}
              {moreOpen && (
                <div className="absolute top-full right-0 mt-2 w-36 bg-white border border-slate-100 rounded-2xl shadow-[0_15px_35px_rgba(15,23,42,0.1)] py-2 z-50 animate-fadeIn">
                  {secondaryNavLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMoreOpen(false)}
                      className={`block px-4 py-2 text-xs font-bold transition-colors ${
                        isActive(link.path)
                          ? 'bg-blue-50 text-blue-600 font-black'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-2.5 lg:gap-3 shrink-0">
            {isAuthenticated ? (
              <Link
                to={user?.role === 'SUPER_ADMIN' ? '/admin' : user?.role === 'BRAND_OWNER' ? '/brand' : '/seeker'}
                className="px-4 py-2 text-xs font-black bg-blue-600 text-white rounded-full hover:bg-blue-700 hover:shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] transition-all whitespace-nowrap"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 sm:px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-50 border border-slate-200 rounded-full transition-all whitespace-nowrap"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 sm:px-4 lg:px-5 py-2 text-xs font-black bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full hover:shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 active:translate-y-0 shadow-[0_8px_20px_-6px_rgba(37,99,235,0.3)] transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  Register Free <ArrowRight size={13} strokeWidth={2.5} className="shrink-0" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile/Tablet Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-full transition-colors cursor-pointer border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </div>

      {/* Collapsible Mobile/Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 pt-4 pb-6 shadow-xl animate-fadeIn">
          <div className="flex flex-col space-y-2.5 font-bold text-sm text-slate-600">
            {allNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-xl transition-colors ${
                  isActive(link.path)
                    ? 'bg-blue-50 text-blue-600 font-black'
                    : 'hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated ? (
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:hidden gap-2">
                <Link
                  to={user?.role === 'SUPER_ADMIN' ? '/admin' : user?.role === 'BRAND_OWNER' ? '/brand' : '/seeker'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center text-xs font-black bg-blue-600 text-white rounded-full hover:shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] transition-all"
                >
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:hidden gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center text-xs font-bold text-slate-600 border border-slate-200 rounded-full hover:bg-slate-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center text-xs font-black bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full shadow-[0_8px_20px_-4px_rgba(37,99,235,0.3)] flex items-center justify-center gap-1.5"
                >
                  Register Free <ArrowRight size={13} strokeWidth={2.5} />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
