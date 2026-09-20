import React from 'react';
import { Link } from 'react-router';

export interface IndustryData {
  name: string;
  count: string;
  icon: string;
  desc: string;
  growth: string;
  image: string;
}

interface IndustryCardProps {
  industry: IndustryData;
}

export const IndustryCard: React.FC<IndustryCardProps> = ({ industry }) => {
  return (
    <Link
      to={`/brands?industry=${encodeURIComponent(industry.name)}`}
      className="bg-white rounded-[16px] sm:rounded-[24px] border border-[#DCE7F5] shadow-[0_12px_24px_-8px_rgba(15,23,42,0.03),inset_0_1px_2px_rgba(255,255,255,1)] hover:shadow-[0_20px_40px_-10px_rgba(37,99,235,0.12),inset_0_1px_2px_rgba(255,255,255,1)] hover:-translate-y-1.5 transition-all duration-300 group text-left flex flex-col overflow-hidden"
    >
      {/* 16:9 Industry Image Banner */}
      <div className="relative w-full aspect-video bg-slate-100 overflow-hidden">
        <img
          src={industry.image}
          alt={industry.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Card Body */}
      <div className="p-3.5 sm:p-6 flex-1 flex flex-col">
        {/* Industry Icon + Industry Name */}
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <span className="text-xl sm:text-2xl shrink-0 leading-none">{industry.icon}</span>
          <h3 className="font-extrabold text-[#0F172A] text-xs sm:text-base lg:text-lg uppercase tracking-tight line-clamp-1">
            {industry.name}
          </h3>
        </div>

        {/* Brand Count + Growth Badge */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3">
          <span className="inline-block text-[9px] sm:text-[10px] font-black text-blue-700 bg-blue-50 border border-blue-100 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full uppercase tracking-wider">
            {industry.count}
          </span>
          <span className="inline-block text-[9px] sm:text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full uppercase tracking-wider">
            {industry.growth}
          </span>
        </div>

        {/* Existing Description */}
        <p className="text-[11px] sm:text-xs font-semibold text-slate-500 leading-relaxed mt-auto pt-2.5 sm:pt-3 border-t border-slate-100">
          {industry.desc}
        </p>
      </div>
    </Link>
  );
};
