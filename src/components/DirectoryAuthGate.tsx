import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Lock, LogIn, UserPlus, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

interface DirectoryAuthGateProps {
  children: React.ReactNode;
  action: 'browse_brands' | 'browse_seekers' | 'smart_matching';
  redirectUrl?: string;
}

export default function DirectoryAuthGate({ children, action, redirectUrl }: DirectoryAuthGateProps) {
  const { isAuthenticated, user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  if (isAuthenticated && user) {
    return <>{children}</>;
  }

  const effectiveRedirect = redirectUrl || (location.pathname + location.search);

  let title = 'Authentication Required';
  let description = 'Please sign in or create an account to explore this section.';
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
  }

  const handleQuickLogin = async (roleToUse: Role) => {
    setIsLoggingIn(true);
    try {
      if (roleToUse === 'FRANCHISE_SEEKER') {
        await login('rajesh.kumar@example.com', 'FRANCHISE_SEEKER');
      } else {
        await login('contact@chai-point.com', 'BRAND_OWNER');
      }
    } catch (err) {
      console.error('Quick login error:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoToLogin = () => {
    navigate(`/login?redirect=${encodeURIComponent(effectiveRedirect)}&role=${recommendedRole}`);
  };

  const handleGoToRegister = () => {
    navigate(`/register?role=${recommendedRole === 'BRAND_OWNER' ? 'brand' : 'seeker'}&redirect=${encodeURIComponent(effectiveRedirect)}`);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 sm:px-6 bg-slate-50/70">
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200/90 text-center relative overflow-hidden">
        {/* Top Accent Icon */}
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Lock size={30} className="text-blue-600" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 font-black text-xs uppercase tracking-wider rounded-full border border-blue-100 mb-3">
          <Sparkles size={13} /> Authentication Required
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading mb-3">
          {title}
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md mx-auto mb-8">
          {description}
        </p>

        {/* Main Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto mb-5">
          <button
            onClick={handleGoToRegister}
            className="flex-1 py-3.5 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus size={16} /> Sign Up
          </button>

          <button
            onClick={handleGoToLogin}
            className="flex-1 py-3.5 px-6 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <LogIn size={16} /> Login
          </button>
        </div>

        {/* Already have an account link */}
        <div className="text-center mb-8">
          <p className="text-xs sm:text-sm text-slate-500">
            Already have an account?{' '}
            <button
              onClick={handleGoToLogin}
              className="text-blue-600 font-extrabold hover:underline cursor-pointer"
            >
              Login
            </button>
          </p>
        </div>

        {/* Instant Demo Sign-In for testing and convenience */}
        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center justify-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-3">
            <Sparkles size={12} className="text-amber-500" /> Instant Demo Sign-In
          </div>
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            <button
              onClick={() => handleQuickLogin('FRANCHISE_SEEKER')}
              disabled={isLoggingIn}
              className="py-2.5 px-3 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-transparent rounded-xl text-xs font-bold text-slate-700 transition-colors text-center cursor-pointer"
            >
              Sign in as Seeker
            </button>
            <button
              onClick={() => handleQuickLogin('BRAND_OWNER')}
              disabled={isLoggingIn}
              className="py-2.5 px-3 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-transparent rounded-xl text-xs font-bold text-slate-700 transition-colors text-center cursor-pointer"
            >
              Sign in as Brand
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
