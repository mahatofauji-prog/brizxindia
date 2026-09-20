import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Lock, LogIn, UserPlus, ShieldCheck, ArrowRight, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

export interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: 'browse_brands' | 'browse_seekers' | 'smart_matching' | 'submit_application' | 'contact_brand' | 'unlock_seeker' | 'save_lead' | 'schedule_meeting' | 'crm_access' | 'generic';
  targetName?: string;
  redirectUrl?: string;
  hasPreservedData?: boolean;
  onAuthenticated?: () => void;
}

export default function AuthRequiredModal({
  isOpen,
  onClose,
  action,
  targetName,
  redirectUrl,
  hasPreservedData,
  onAuthenticated
}: AuthRequiredModalProps) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  if (!isOpen) return null;

  // Determine copy and recommended role based on action
  let title = 'Authentication Required';
  let description = 'Please sign in or create an account to continue.';
  let recommendedRole: Role = 'FRANCHISE_SEEKER';

  if (action === 'browse_brands') {
    title = 'Find the Right Franchise Opportunity';
    description = 'Create your Brix India account to explore verified franchise brands, compare opportunities and connect with brands.';
    recommendedRole = 'FRANCHISE_SEEKER';
  } else if (action === 'browse_seekers') {
    title = 'Connect With Verified Franchise Seekers';
    description = 'Sign in or create your Brix India account to discover verified franchise seekers and connect with relevant opportunities.';
    recommendedRole = 'BRAND_OWNER';
  } else if (action === 'smart_matching') {
    title = 'AI-Powered Smart Matching';
    description = 'Sign in to get personalized franchise recommendations based on your location, investment budget and business preferences.';
    recommendedRole = 'FRANCHISE_SEEKER';
  } else if (action === 'submit_application') {
    title = 'Sign In to Submit Application';
    description = targetName
      ? `To submit your official franchise application for ${targetName}, please sign in to your Franchise Seeker account.`
      : 'To submit your official franchise application, please sign in to your Franchise Seeker account.';
    recommendedRole = 'FRANCHISE_SEEKER';
  } else if (action === 'contact_brand') {
    title = 'Sign In to Contact Brand';
    description = targetName
      ? `To send direct inquiries or connect with ${targetName}, please sign in to your Franchise Seeker account.`
      : 'To send direct inquiries, please sign in to your Franchise Seeker account.';
    recommendedRole = 'FRANCHISE_SEEKER';
  } else if (action === 'unlock_seeker') {
    title = 'Brand Owner Authentication Required';
    description = targetName
      ? `Direct phone numbers, personal email, and CRM access for ${targetName} require a verified Brand Owner account.`
      : 'Direct investor contact details require a verified Brand Owner account.';
    recommendedRole = 'BRAND_OWNER';
  } else if (action === 'save_lead') {
    title = 'Brand Owner Sign In Required';
    description = 'Saving investor leads and managing pipelines requires a verified Brand Owner account.';
    recommendedRole = 'BRAND_OWNER';
  } else if (action === 'schedule_meeting') {
    title = 'Sign In to Schedule Discovery Meeting';
    description = 'Scheduling 1-on-1 virtual franchise meetings requires an active account.';
    recommendedRole = 'BRAND_OWNER';
  } else if (action === 'crm_access') {
    title = 'Brand Owner CRM';
    description = 'Accessing the brand lead pipeline and CRM tools requires a Brand Owner account.';
    recommendedRole = 'BRAND_OWNER';
  }

  const effectiveRedirect = redirectUrl || (window.location.pathname !== '/welcome' ? window.location.pathname + window.location.search : '/brands');

  // 1-Click Demo Login for quick testing
  const handleQuickLogin = async (roleToUse: Role) => {
    setIsLoggingIn(true);
    try {
      if (roleToUse === 'FRANCHISE_SEEKER') {
        await login('rajesh.kumar@example.com', 'FRANCHISE_SEEKER');
      } else {
        await login('contact@chai-point.com', 'BRAND_OWNER');
      }
      if (onAuthenticated) {
        onAuthenticated();
      }
      onClose();
      if (redirectUrl) {
        navigate(redirectUrl);
      }
    } catch (err) {
      console.error('Quick login error:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoToLogin = () => {
    onClose();
    navigate(`/login?redirect=${encodeURIComponent(effectiveRedirect)}&role=${recommendedRole}`);
  };

  const handleGoToRegister = () => {
    onClose();
    navigate(`/register?role=${recommendedRole === 'BRAND_OWNER' ? 'brand' : 'seeker'}&redirect=${encodeURIComponent(effectiveRedirect)}`);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-[99999] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        {/* Lock Icon Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0 shadow-xs">
            <Lock size={22} className="text-blue-600" />
          </div>
          <div>
            <span className="text-[10px] font-black tracking-widest uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              Authentication Required
            </span>
            <h3 className="text-xl font-black text-slate-900 leading-tight mt-0.5 font-heading">
              {title}
            </h3>
          </div>
        </div>

        {/* Informative Description */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
          {description}
        </p>

        {/* Data Preservation Banner */}
        {hasPreservedData && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 mb-5 flex items-start gap-2.5 text-xs text-emerald-800">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-black block">Application Data Preserved</span>
              <span className="text-emerald-700 text-[11px] leading-snug">
                Your entered details are safely saved and will remain filled when you sign in.
              </span>
            </div>
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="space-y-2.5 mb-4">
          <button
            onClick={handleGoToRegister}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus size={15} /> Sign Up
          </button>

          <button
            onClick={handleGoToLogin}
            className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <LogIn size={15} /> Login
          </button>
        </div>

        {/* Already have an account link */}
        <div className="text-center mb-5">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <button
              onClick={handleGoToLogin}
              className="text-blue-600 font-extrabold hover:underline cursor-pointer"
            >
              Login
            </button>
          </p>
        </div>

        {/* Quick 1-Click Demo Login for Preview Ease */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sparkles size={11} className="text-amber-500" /> Instant Demo Sign-In:
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('FRANCHISE_SEEKER')}
              disabled={isLoggingIn}
              className="py-2 px-2.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-transparent rounded-xl text-[11px] font-bold text-slate-700 transition-colors text-center cursor-pointer truncate"
              title="Sign in as Franchise Seeker (Rajesh Kumar)"
            >
              Sign in as Seeker
            </button>
            <button
              onClick={() => handleQuickLogin('BRAND_OWNER')}
              disabled={isLoggingIn}
              className="py-2 px-2.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-transparent rounded-xl text-[11px] font-bold text-slate-700 transition-colors text-center cursor-pointer truncate"
              title="Sign in as Brand Owner (Chai Point)"
            >
              Sign in as Brand
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
