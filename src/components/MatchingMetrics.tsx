import React from 'react';
import { motion } from 'motion/react';

export function MatchingMetrics() {
  return (
    <section className="w-full bg-white text-[#1e293b] relative z-20 border-b border-slate-100 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-blue-600 text-[10px] sm:text-xs font-bold uppercase tracking-widest block mb-2 sm:mb-3">
            Direct Matchmaking Engine
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#0f172a] uppercase leading-tight mb-4 sm:mb-6">
            India's Smartest<br />
            Matching Metrics
          </h2>
          <p className="text-slate-600 font-medium text-sm sm:text-base leading-relaxed mb-8 sm:mb-12">
            Skip manual brokers. BrizX utilizes advanced matching matrices to instantly align capital profiles with brand requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pt-6 border-t border-slate-100">
          {[
            { label: 'Vetted Brands', value: '1,200+', className: 'text-emerald-600' },
            { label: 'Verified Seekers', value: '18,000+', className: 'text-blue-500' },
            { label: 'Avg Match-to-LOI', value: '18 Days', className: 'text-[#0f172a]' },
          ].map((metric, i) => (
            <div key={i} className="flex flex-row sm:flex-col items-center sm:items-start gap-4 sm:gap-2">
              <div className={`text-2xl sm:text-3xl font-bold leading-none ${metric.className}`}>{metric.value}</div>
              <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
