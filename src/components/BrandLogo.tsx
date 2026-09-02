import React, { useState } from 'react';
import { 
  Utensils, Activity, Dumbbell, Zap, GraduationCap, Cpu, 
  Building2, ShieldCheck, ShoppingBag, Coffee, Sparkles 
} from 'lucide-react';

interface BrandLogoProps {
  logo?: string;
  brandName: string;
  industry?: string;
  verified?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showVerifiedBadge?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  logo,
  brandName,
  industry = '',
  verified = false,
  size = 'md',
  className = '',
  showVerifiedBadge = false,
}) => {
  const [imageError, setImageError] = useState(false);

  // Size mappings
  const sizeClasses = {
    sm: 'w-10 h-10 text-xs text-[10px]',
    md: 'w-14 h-14 text-sm text-xs',
    lg: 'w-16 h-16 text-base text-xs',
    xl: 'w-20 h-20 text-xl text-sm',
    '2xl': 'w-24 h-24 text-2xl text-base',
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
    xl: 28,
    '2xl': 32,
  };

  const badgeSizes = {
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    '2xl': 20,
  };

  // Extract initials (e.g., Burger Kingsway -> BK, Chai Point Express -> CP, AIT World -> AI)
  const getInitials = (name: string) => {
    if (!name) return 'B';
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Determine icon & color palette based on industry / brand name
  const getIndustryStyle = (ind: string = '', name: string = '') => {
    const text = ((ind || '') + ' ' + (name || '')).toUpperCase();
    if (text.includes('BURGER') || text.includes('QSR') || text.includes('FOOD')) {
      return {
        bg: 'bg-gradient-to-br from-amber-500 to-red-600',
        textColor: 'text-white',
        border: 'border-amber-400/30',
        Icon: Utensils,
      };
    }
    if (text.includes('TEA') || text.includes('CHAI') || text.includes('BEVERAGE')) {
      return {
        bg: 'bg-gradient-to-br from-emerald-600 to-teal-800',
        textColor: 'text-white',
        border: 'border-emerald-400/30',
        Icon: Coffee,
      };
    }
    if (text.includes('HEALTH') || text.includes('DIAGNOSTIC') || text.includes('MEDIC')) {
      return {
        bg: 'bg-gradient-to-br from-blue-600 to-cyan-700',
        textColor: 'text-white',
        border: 'border-blue-400/30',
        Icon: Activity,
      };
    }
    if (text.includes('FITNESS') || text.includes('GYM') || text.includes('WELLNESS')) {
      return {
        bg: 'bg-gradient-to-br from-violet-600 to-indigo-900',
        textColor: 'text-white',
        border: 'border-indigo-400/30',
        Icon: Dumbbell,
      };
    }
    if (text.includes('EV') || text.includes('CHARGE') || text.includes('AUTO')) {
      return {
        bg: 'bg-gradient-to-br from-emerald-500 to-lime-600',
        textColor: 'text-white',
        border: 'border-lime-400/30',
        Icon: Zap,
      };
    }
    if (text.includes('KID') || text.includes('SCHOOL') || text.includes('EDU')) {
      return {
        bg: 'bg-gradient-to-br from-rose-500 to-amber-500',
        textColor: 'text-white',
        border: 'border-rose-300/30',
        Icon: GraduationCap,
      };
    }
    if (text.includes('AUTOMATION') || text.includes('IOT') || text.includes('TECH')) {
      return {
        bg: 'bg-gradient-to-br from-cyan-600 to-blue-900',
        textColor: 'text-white',
        border: 'border-cyan-400/30',
        Icon: Cpu,
      };
    }
    return {
      bg: 'bg-gradient-to-br from-slate-800 to-slate-950',
      textColor: 'text-white',
      border: 'border-slate-700',
      Icon: Building2,
    };
  };

  const style = getIndustryStyle(industry, brandName);
  const IconComponent = style.Icon;

  const renderLogoContent = () => {
    if (logo && !imageError) {
      return (
        <img
          src={logo}
          alt={`${brandName} logo`}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-full h-full object-contain p-1.5 rounded-2xl bg-white"
        />
      );
    }

    // Dynamic professional emblem placeholder
    return (
      <div className={`w-full h-full rounded-2xl ${style.bg} ${style.textColor} flex flex-col items-center justify-center relative p-1 shadow-md border ${style.border}`}>
        <IconComponent size={iconSizes[size]} className="opacity-90 mb-0.5" />
        <span className="font-black tracking-wider leading-none drop-shadow-sm font-sans">
          {getInitials(brandName)}
        </span>
      </div>
    );
  };

  return (
    <div className={`relative shrink-0 ${sizeClasses[size]} ${className}`}>
      <div className="w-full h-full rounded-2xl shadow-sm overflow-hidden flex items-center justify-center border border-slate-200 bg-white">
        {renderLogoContent()}
      </div>

      {showVerifiedBadge && verified && (
        <div 
          className="absolute -bottom-1 -right-1 bg-green-500 text-white p-0.5 rounded-full ring-2 ring-white shadow-sm flex items-center justify-center z-10"
          title="Verified Brand"
        >
          <ShieldCheck size={badgeSizes[size]} />
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
