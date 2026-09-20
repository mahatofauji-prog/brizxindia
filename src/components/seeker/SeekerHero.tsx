import React, { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';
import { seekerTheme } from '../../theme/seekerTheme';
import { SEEKER_HERO_IMAGES } from '../../data/seekerHeroImages';

interface SeekerHeroProps {
  pageKey: keyof typeof SEEKER_HERO_IMAGES;
  badgeText?: string;
  badgeIcon?: ReactNode;
  title: string;
  description: string;
  actions?: ReactNode;
  children?: ReactNode;
}

export function SeekerHero({
  pageKey,
  badgeText,
  badgeIcon,
  title,
  description,
  actions,
  children
}: SeekerHeroProps) {
  const imageUrl = SEEKER_HERO_IMAGES[pageKey];

  return (
    <div className={`${seekerTheme.banner} relative overflow-hidden`}>
      {/* Hero Image Layer */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
      </div>

      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-300/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-3xl">
          {badgeText && (
            <span className={seekerTheme.bannerBadge}>
              {badgeIcon || <Sparkles size={13} className="text-blue-600 fill-blue-600/30" />}
              {badgeText}
            </span>
          )}
          <h1 className={`${seekerTheme.bannerTitle} text-slate-900`}>{title}</h1>
          <p className={`${seekerTheme.bannerDesc} text-slate-800`}>{description}</p>
          {children}
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
