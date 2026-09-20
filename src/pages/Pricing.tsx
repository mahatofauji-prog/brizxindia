import React, { useState } from 'react';
import { Link } from 'react-router';
import { CheckCircle2, HelpCircle, ShieldCheck, Zap, Sparkles, ArrowRight } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export default function Pricing() {
  const { pricingPlans } = useCMS();
  const [billingCycle, setBillingCycle] = useState<'ANNUAL' | 'MONTHLY'>('ANNUAL');

  const plans = pricingPlans.map(p => ({
    name: p.name,
    monthlyPrice: `₹${p.monthlyPrice.toLocaleString()}`,
    annualPrice: `₹${Math.round(p.annualPrice / 12).toLocaleString()}`,
    period: '/month',
    billedText: billingCycle === 'ANNUAL' ? `Billed annually (₹${p.annualPrice.toLocaleString()}/yr)` : 'Billed monthly',
    description: `${p.unlockCredits} Verified Seeker Lead Unlocks per month + ${p.badge || 'Enterprise Features'}`,
    features: p.features,
    buttonText: `Get ${p.name}`,
    highlighted: p.highlighted
  }));

  return (
    <div className="flex-1 flex flex-col items-center py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
      {/* Header */}
      <div className="text-center max-w-3xl mb-12">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-widest mb-4">
          <Sparkles size={14} /> Transparent & Predictable
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-indigo-950 mb-4 tracking-tight">
          Flexible Plans to Scale Your Franchise Footprint
        </h1>
        <p className="text-slate-600 text-base md:text-lg font-medium leading-relaxed">
          Franchise Seekers connect <strong className="text-blue-700">100% FREE</strong>. Brand owners choose simple transparent pricing to list and unlock verified leads across India.
        </p>

        {/* Billing Toggle */}
        <div className="mt-8 inline-flex items-center bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm gap-2">
          <button
            onClick={() => setBillingCycle('MONTHLY')}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              billingCycle === 'MONTHLY' ? 'bg-blue-700 text-white shadow' : 'text-slate-600 hover:text-blue-700'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('ANNUAL')}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              billingCycle === 'ANNUAL' ? 'bg-blue-500 text-white shadow' : 'text-slate-600 hover:text-blue-700'
            }`}
          >
            Annual Billing
            <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-black">SAVE 20%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl w-full mb-16">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`rounded-3xl p-8 border flex flex-col justify-between relative transition-all duration-300 ${
              plan.highlighted
                ? 'bg-indigo-950 border-blue-500 text-white shadow-2xl lg:-translate-y-2'
                : 'bg-white border-slate-200 text-slate-900 shadow-sm hover:shadow-xl'
            }`}
          >
            {plan.highlighted && (
              <span className="absolute -top-3.5 right-8 bg-blue-500 text-white text-[10px] font-black uppercase px-3.5 py-1 rounded-full shadow">
                Most Popular
              </span>
            )}

            <div>
              <h3 className={`text-2xl font-black mb-2 ${plan.highlighted ? 'text-white' : 'text-indigo-950'}`}>
                {plan.name}
              </h3>
              <p className={`text-xs mb-6 leading-relaxed ${plan.highlighted ? 'text-indigo-200' : 'text-slate-500'}`}>
                {plan.description}
              </p>

              <div className="mb-2">
                <span className={`text-4xl font-black tracking-tight ${plan.highlighted ? 'text-white' : 'text-indigo-950'}`}>
                  {billingCycle === 'ANNUAL' ? plan.annualPrice : plan.monthlyPrice}
                </span>
                <span className={`text-xs font-bold ${plan.highlighted ? 'text-indigo-300' : 'text-slate-500'}`}>
                  {plan.period}
                </span>
              </div>
              <div className={`text-[11px] font-semibold mb-6 ${plan.highlighted ? 'text-blue-400' : 'text-slate-400'}`}>
                {plan.billedText}
              </div>

              <div className={`border-t pt-6 mb-6 ${plan.highlighted ? 'border-indigo-800' : 'border-slate-100'}`}>
                <span className={`text-[10px] font-extrabold uppercase tracking-wider block mb-4 ${plan.highlighted ? 'text-blue-400' : 'text-slate-400'}`}>
                  What's Included:
                </span>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs font-semibold">
                      <CheckCircle2
                        size={16}
                        className={`shrink-0 mt-0.5 ${plan.highlighted ? 'text-blue-400' : 'text-green-600'}`}
                      />
                      <span className={plan.highlighted ? 'text-blue-100' : 'text-slate-700'}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Link
              to="/register"
              className={`w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-center block ${
                plan.highlighted
                  ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-blue-700 hover:bg-blue-500 text-white shadow-sm'
              }`}
            >
              {plan.buttonText}
            </Link>
          </div>
        ))}
      </div>

      {/* Seeker Guarantee Banner */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm max-w-4xl w-full flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-bold shrink-0">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h4 className="font-black text-indigo-950 text-base">Are you a Franchise Seeker or Individual Investor?</h4>
            <p className="text-xs text-slate-500">Creating a profile and searching verified brand listings on BrizX is 100% Free forever.</p>
          </div>
        </div>
        <Link
          to="/register"
          className="px-6 py-3 bg-blue-700 hover:bg-indigo-950 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shrink-0 transition-colors"
        >
          Create Free Seeker Profile
        </Link>
      </div>
    </div>
  );
}
