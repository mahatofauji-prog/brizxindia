import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Mail, MapPin, Phone, ArrowRight, CheckCircle2, Globe, MessageCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { OwnerAuthModal } from './OwnerAuthModal';

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showOwnerAuthModal, setShowOwnerAuthModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAdminPortalAccess = () => {
    if (user?.role === 'SUPER_ADMIN') {
      navigate('/admin');
    } else {
      setShowOwnerAuthModal(true);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#F5F9FF] text-[#64748B] border-t border-[#DCE7F5] mt-auto py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Branding & Newsletter Block - Styled as a floating Claymorphic glass card */}
        <div className="bg-white border border-[#DCE7F5] rounded-[24px] p-6 md:p-8 shadow-[0_16px_36px_-10px_rgba(37,99,235,0.04),inset_0_1px_2px_rgba(255,255,255,1)] flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          {/* Brand & Description */}
          <div className="max-w-xl">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <img 
                src="/logo.jpg" 
                alt="BrizX India Logo" 
                className="w-8 h-8 rounded-full object-cover shadow-sm ring-1 ring-blue-50 shrink-0"
                referrerPolicy="no-referrer"
              />
              <span className="text-lg font-black tracking-tight text-[#0F172A]">
                BRIZX <span className="text-blue-600">INDIA</span>
              </span>
            </Link>
            <p className="text-xs text-[#64748B] leading-relaxed mb-4 max-w-md">
              Connecting franchise brands with verified seekers through intelligent matching, verified databases, and secure consulting.
            </p>
            
            {/* Social Links (Single Row) */}
            <div className="flex items-center gap-2">
              <a 
                href="https://wa.me/919979510361" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="WhatsApp" 
                className="w-8 h-8 bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white rounded-xl flex items-center justify-center transition-all border border-emerald-100"
              >
                <MessageCircle size={15} />
              </a>
              <a 
                href="mailto:info@brizxindia.com" 
                aria-label="Email" 
                className="w-8 h-8 bg-blue-50/50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-xl flex items-center justify-center transition-all border border-blue-100/50"
              >
                <Mail size={15} />
              </a>
              <a 
                href="tel:+919979510361" 
                aria-label="Phone" 
                className="w-8 h-8 bg-blue-50/50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-xl flex items-center justify-center transition-all border border-blue-100/50"
              >
                <Phone size={15} />
              </a>
              <a 
                href="#" 
                aria-label="Website" 
                className="w-8 h-8 bg-blue-50/50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-xl flex items-center justify-center transition-all border border-blue-100/50"
              >
                <Globe size={15} />
              </a>
            </div>
          </div>

          {/* Newsletter (Compact Banner) */}
          <div className="w-full lg:w-auto min-w-[280px] md:min-w-[360px]">
            <div className="mb-3">
              <span className="text-[10px] uppercase font-black text-blue-600 tracking-wider">Join BrizX Intelligence</span>
              <p className="text-[11px] text-[#64748B]">Receive verified weekly franchise alerts & CAGR updates.</p>
            </div>
            {subscribed ? (
              <div className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-4 py-2.5 rounded-xl text-xs font-bold">
                <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                <span>Successfully subscribed to BrizX Insights.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-1.5 bg-[#F5F9FF] p-1.5 rounded-full border border-[#DCE7F5]">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter work email address"
                  className="bg-transparent px-3.5 py-1.5 text-xs text-[#0F172A] placeholder-[#64748B] outline-none flex-1 min-w-0"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-full text-[10px] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 shrink-0 shadow-sm"
                >
                  <span>Subscribe</span>
                  <ArrowRight size={12} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Middle Grid Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 py-6 mb-6">
          {/* Column 1: Quick Links */}
          <div>
            <h4 className="text-[#0F172A] font-black text-xs uppercase tracking-wider mb-3">Quick Links</h4>
            <ul className="space-y-2 text-xs font-semibold text-[#64748B]">
              <li><Link to="/" className="hover:text-blue-600 transition-colors">Home Dashboard</Link></li>
              <li><Link to="/brands" className="hover:text-blue-600 transition-colors">Brands Hub</Link></li>
              <li><Link to="/seekers" className="hover:text-blue-600 transition-colors">Seekers Directory</Link></li>
              <li><Link to="/pricing" className="hover:text-blue-600 transition-colors">Pricing & Plans</Link></li>
              <li><Link to="/blog" className="hover:text-blue-600 transition-colors">Franchise Blog</Link></li>
            </ul>
          </div>

          {/* Column 2: Contact Info */}
          <div>
            <h4 className="text-[#0F172A] font-black text-xs uppercase tracking-wider mb-3">Head Office</h4>
            <ul className="space-y-2 text-xs font-semibold text-[#64748B]">
              <li className="flex items-center gap-2">
                <MapPin size={13} className="text-blue-500 shrink-0" />
                <span className="text-[#0F172A] font-bold text-[11px]">Ahmedabad, Gujarat</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={13} className="text-blue-500 shrink-0" />
                <a href="tel:+919979510361" className="hover:text-blue-600 transition-colors">+91 99795 10361</a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle size={13} className="text-emerald-500 shrink-0" />
                <a href="https://wa.me/919979510361" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors font-bold">+91 99795 10361</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={13} className="text-blue-500 shrink-0" />
                <a href="mailto:info@brizxindia.com" className="hover:text-blue-600 transition-colors">info@brizxindia.com</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 className="text-[#0F172A] font-black text-xs uppercase tracking-wider mb-3">Core Services</h4>
            <ul className="space-y-2 text-xs font-semibold text-[#64748B]">
              <li><Link to="/services" className="hover:text-blue-600 transition-colors">Brand Discovery</Link></li>
              <li><Link to="/services" className="hover:text-blue-600 transition-colors">Seeker Verification</Link></li>
              <li><Link to="/services" className="hover:text-blue-600 transition-colors">Smart Matching Engine</Link></li>
              <li><Link to="/services" className="hover:text-blue-600 transition-colors">Investment Guidance</Link></li>
              <li><Link to="/services" className="hover:text-blue-600 transition-colors">Marketing & Consulting</Link></li>
            </ul>
          </div>

          {/* Column 4: Support & Legal */}
          <div>
            <h4 className="text-[#0F172A] font-black text-xs uppercase tracking-wider mb-3">Support & Trust</h4>
            <ul className="space-y-2 text-xs font-semibold text-[#64748B]">
              <li><Link to="/contact" className="hover:text-blue-600 transition-colors">Help & Support Desk</Link></li>
              <li><Link to="/contact" className="hover:text-blue-600 transition-colors">Frequently Asked Queries</Link></li>
              <li><Link to="/contact" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/contact" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
              <li className="pt-1.5">
                <button 
                  onClick={handleAdminPortalAccess}
                  className="inline-flex items-center gap-1 text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-full border border-blue-200 transition-all cursor-pointer shadow-xs"
                >
                  <ShieldCheck size={11} className="text-blue-600" />
                  <span>Owner Console</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 border-t border-[#DCE7F5] flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <p>&copy; {new Date().getFullYear()} BrizX India. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400/80">Search. Match. Grow.</span>
          </div>
        </div>

      </div>

      <OwnerAuthModal
        isOpen={showOwnerAuthModal}
        onClose={() => setShowOwnerAuthModal(false)}
      />
    </footer>
  );
}
