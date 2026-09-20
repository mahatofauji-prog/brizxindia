import React, { useState, useEffect } from 'react';
import { 
  Building2, MapPin, IndianRupee, Briefcase, Clock, 
  Sparkles, CheckCircle2, AlertCircle, ArrowRight, RotateCcw, UserCheck
} from 'lucide-react';
import { BrandSmartMatchRequirements } from '../../utils/SmartMatchEngine';
import { isValidIndianPinCode, getLocationFromPinCode, getPinCodeForCity, TOP_INDIAN_CITIES } from '../../utils/indiaPinCodes';
import { Brand } from '../../types';

interface BrandSmartMatchFormProps {
  initialRequirements?: Partial<BrandSmartMatchRequirements>;
  currentBrand?: Brand | null;
  onSubmit: (requirements: BrandSmartMatchRequirements) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const INDUSTRY_OPTIONS = [
  'Food & Beverages',
  'Healthcare',
  'Education',
  'Retail',
  'Fashion',
  'Beauty & Salon',
  'Fitness & Wellness',
  'Automobile & EV',
  'Home & Building Automation',
  'Electronics',
  'Services',
  'Technology',
  'Other'
];

const BACKGROUND_OPTIONS = [
  { id: 'No Specific Experience', label: 'No Specific Experience', desc: 'All candidate backgrounds eligible (Full 15 pts score)' },
  { id: 'Business Owner', label: 'Business Owner', desc: 'Prior business ownership, founders & proprietors' },
  { id: 'Retail Experience', label: 'Retail Experience', desc: 'Store managers, distribution & showroom operators' },
  { id: 'Food & Beverage Experience', label: 'Food & Beverage Experience', desc: 'QSR, restaurant, cafe or chef background' },
  { id: 'Healthcare Experience', label: 'Healthcare Experience', desc: 'Doctors, pharma distribution, diagnostic clinics' },
  { id: 'Corporate Professional', label: 'Corporate Professional', desc: 'Senior directors, managers & corporate executives' },
  { id: 'Sales & Marketing', label: 'Sales & Marketing', desc: 'High-performing commercial & revenue leaders' },
  { id: 'Management', label: 'Management', desc: 'Operations heads & team management specialists' },
  { id: 'Entrepreneur', label: 'Entrepreneur', desc: 'Serial founders & active startup angel investors' },
];

const TIMELINE_OPTIONS = [
  { id: 'Immediate', label: 'Immediate', sub: 'Ready to launch right away' },
  { id: '1-3 Months', label: '1–3 Months', sub: 'Site selection & fit-out stage' },
  { id: '3-6 Months', label: '3–6 Months', sub: 'Medium-term launch horizon' },
  { id: '6-12 Months', label: '6–12 Months', sub: 'Strategic future expansion' },
  { id: '12+ Months', label: '12+ Months', sub: 'Long-term territory planning' },
];

const BUDGET_PRESETS = [
  { min: 5, max: 15, label: '₹5L - ₹15L' },
  { min: 15, max: 30, label: '₹15L - ₹30L' },
  { min: 30, max: 50, label: '₹30L - ₹50L' },
  { min: 50, max: 100, label: '₹50L - ₹1 Cr' },
  { min: 100, max: 250, label: '₹1 Cr - ₹2.5 Cr' }
];

export default function BrandSmartMatchForm({
  initialRequirements,
  currentBrand,
  onSubmit,
  onCancel,
  isLoading = false
}: BrandSmartMatchFormProps) {
  // Form State
  const [targetCity, setTargetCity] = useState<string>(
    initialRequirements?.targetCity || currentBrand?.city || 'Bangalore'
  );
  const [pinCode, setPinCode] = useState<string>(
    initialRequirements?.pinCode || currentBrand?.pincode || '560038'
  );
  const [minInvestment, setMinInvestment] = useState<number>(
    initialRequirements?.minInvestment ?? currentBrand?.minInvestment ?? 15
  );
  const [maxInvestment, setMaxInvestment] = useState<number>(
    initialRequirements?.maxInvestment ?? currentBrand?.maxInvestment ?? 35
  );
  const [industry, setIndustry] = useState<string>(
    initialRequirements?.industry || currentBrand?.industry || 'Food & Beverages'
  );
  const [preferredBackground, setPreferredBackground] = useState<string>(
    initialRequirements?.preferredBackground || 'No Specific Experience'
  );
  const [targetTimeline, setTargetTimeline] = useState<string>(
    initialRequirements?.targetTimeline || '1-3 Months'
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  // PIN code inspection
  const pinLocation = getLocationFromPinCode(pinCode);
  const isPinValid = isValidIndianPinCode(pinCode);

  // When city changes, auto-suggest representative PIN code if pin code is empty or mismatched
  const handleCitySelect = (city: string) => {
    setTargetCity(city);
    const suggestedPin = getPinCodeForCity(city);
    if (suggestedPin) {
      setPinCode(suggestedPin);
    }
  };

  // When PIN code reaches 6 digits, auto-suggest city if recognized
  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPinCode(raw);
    if (raw.length === 6) {
      const loc = getLocationFromPinCode(raw);
      if (loc && (!targetCity || targetCity === '')) {
        setTargetCity(loc.city);
      }
    }
  };

  // Quick preset apply
  const handleBudgetPreset = (min: number, max: number) => {
    setMinInvestment(min);
    setMaxInvestment(max);
  };

  // Pre-fill from currentBrand
  const handleAutoFillFromBrand = () => {
    if (!currentBrand) return;
    if (currentBrand.city) setTargetCity(currentBrand.city);
    if (currentBrand.pincode) setPinCode(currentBrand.pincode);
    if (currentBrand.minInvestment) setMinInvestment(currentBrand.minInvestment);
    if (currentBrand.maxInvestment) setMaxInvestment(currentBrand.maxInvestment);
    if (currentBrand.industry) setIndustry(currentBrand.industry);
  };

  // Reset to defaults
  const handleReset = () => {
    setTargetCity('Bangalore');
    setPinCode('560038');
    setMinInvestment(15);
    setMaxInvestment(35);
    setIndustry('Food & Beverages');
    setPreferredBackground('No Specific Experience');
    setTargetTimeline('1-3 Months');
    setErrors({});
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!targetCity.trim()) {
      errs.targetCity = 'Target city is required';
    }
    if (!pinCode.trim()) {
      errs.pinCode = 'PIN code is required';
    } else if (!isValidIndianPinCode(pinCode)) {
      errs.pinCode = 'Enter a valid 6-digit Indian PIN code (e.g. 560038)';
    }
    if (minInvestment <= 0) {
      errs.minInvestment = 'Minimum budget must be greater than 0';
    }
    if (maxInvestment < minInvestment) {
      errs.maxInvestment = 'Maximum budget must be greater than or equal to minimum';
    }
    if (!industry) {
      errs.industry = 'Industry selection is required';
    }
    if (!preferredBackground) {
      errs.preferredBackground = 'Required background is required';
    }
    if (!targetTimeline) {
      errs.targetTimeline = 'Target timeline is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      targetCity: targetCity.trim(),
      pinCode: pinCode.trim(),
      minInvestment: Number(minInvestment),
      maxInvestment: Number(maxInvestment),
      industry: industry.trim(),
      preferredBackground: preferredBackground.trim(),
      targetTimeline: targetTimeline.trim()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles size={14} className="text-blue-600" />
            Brand → Seeker Smart Match
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            Enter Franchise Expansion Requirements
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Our 100-point algorithm will evaluate and rank verified franchise seekers across City (25%), Investment (25%), Industry (25%), Background (15%), and Timeline (10%).
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {currentBrand && (
            <button
              type="button"
              onClick={handleAutoFillFromBrand}
              className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-blue-200 cursor-pointer"
              title="Pre-fill values from your registered Brand profile"
            >
              <Building2 size={14} /> Auto-fill from Brand
            </button>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all cursor-pointer"
            title="Reset to defaults"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Field 1: Target City */}
        <div className="space-y-2.5">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <MapPin size={14} className="text-blue-600" />
            A. Target City <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-slate-500">
            City where your brand wants to grant franchise expansion rights.
          </p>
          <input
            type="text"
            value={targetCity}
            onChange={(e) => setTargetCity(e.target.value)}
            placeholder="e.g. Bangalore, Mumbai, Pune, Delhi NCR"
            className={`w-full px-4 py-3 rounded-2xl bg-slate-50 border ${
              errors.targetCity ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
            } focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden text-sm font-semibold text-slate-900 transition-all`}
          />
          {errors.targetCity && (
            <p className="text-xs text-red-500 font-bold flex items-center gap-1">
              <AlertCircle size={12} /> {errors.targetCity}
            </p>
          )}

          {/* Quick City Pills */}
          <div className="pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Popular Expansion Cities:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {TOP_INDIAN_CITIES.slice(0, 8).map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleCitySelect(city)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    targetCity.toLowerCase() === city.toLowerCase()
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Field 2: Target PIN Code */}
        <div className="space-y-2.5">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <MapPin size={14} className="text-indigo-600" />
            B. Location PIN Code <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-slate-500">
            Target franchise location PIN (6 digits). Used for micro-market proximity matching.
          </p>
          <div className="relative">
            <input
              type="text"
              maxLength={6}
              value={pinCode}
              onChange={handlePinChange}
              placeholder="e.g. 560038, 400050, 110017"
              className={`w-full px-4 py-3 rounded-2xl bg-slate-50 border ${
                errors.pinCode ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
              } focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden text-sm font-mono font-bold text-slate-900 tracking-wider transition-all`}
            />
            {isPinValid && (
              <div className="absolute right-3.5 top-3.5 flex items-center gap-1 text-emerald-600 text-xs font-bold">
                <CheckCircle2 size={16} />
                <span className="hidden sm:inline">Valid PIN</span>
              </div>
            )}
          </div>

          {errors.pinCode && (
            <p className="text-xs text-red-500 font-bold flex items-center gap-1">
              <AlertCircle size={12} /> {errors.pinCode}
            </p>
          )}

          {/* Detected PIN Region */}
          {pinLocation && (
            <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-2.5 text-xs text-blue-900 flex items-center justify-between">
              <span className="font-semibold">
                Postal District: <strong>{pinLocation.city}, {pinLocation.state}</strong>
              </span>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 bg-blue-200/70 rounded text-blue-800">
                {pinLocation.region || 'India'}
              </span>
            </div>
          )}
        </div>

        {/* Field 3: Investment Budget */}
        <div className="md:col-span-2 space-y-3 bg-slate-50/70 p-5 sm:p-6 rounded-2xl border border-slate-200/80">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <IndianRupee size={14} className="text-emerald-600" />
                C. Investment Budget Required (in ₹ Lakhs) <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-slate-500 mt-0.5">
                Total turnkey capital expected from the franchisee (setup, franchise fee, working capital).
              </p>
            </div>

            {/* Current Range Label */}
            <div className="px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-bold text-xs">
              Selected: ₹{minInvestment}L – ₹{maxInvestment}L
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            {BUDGET_PRESETS.map((preset) => {
              const isSelected = minInvestment === preset.min && maxInvestment === preset.max;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleBudgetPreset(preset.min, preset.max)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Custom Min / Max Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Minimum Investment (₹ Lakhs)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-slate-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  min={1}
                  max={1000}
                  value={minInvestment}
                  onChange={(e) => setMinInvestment(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-hidden text-sm font-bold text-slate-900"
                />
              </div>
              {errors.minInvestment && (
                <p className="text-xs text-red-500 mt-1 font-bold">{errors.minInvestment}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Maximum Investment (₹ Lakhs)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-slate-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  min={minInvestment}
                  max={2000}
                  value={maxInvestment}
                  onChange={(e) => setMaxInvestment(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-hidden text-sm font-bold text-slate-900"
                />
              </div>
              {errors.maxInvestment && (
                <p className="text-xs text-red-500 mt-1 font-bold">{errors.maxInvestment}</p>
              )}
            </div>
          </div>
        </div>

        {/* Field 4: Industry */}
        <div className="space-y-2.5">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Briefcase size={14} className="text-purple-600" />
            D. Brand Industry / Sector <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-slate-500">
            Select the primary franchise sector to match seekers with relevant interest.
          </p>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-hidden text-sm font-bold text-slate-900 transition-all cursor-pointer"
          >
            {INDUSTRY_OPTIONS.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
          {errors.industry && (
            <p className="text-xs text-red-500 font-bold">{errors.industry}</p>
          )}
        </div>

        {/* Field 5: Target Timeline */}
        <div className="space-y-2.5">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Clock size={14} className="text-blue-600" />
            E. Desired Launch Timeline <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-slate-500">
            When does your brand plan for the franchise unit to be operational?
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TIMELINE_OPTIONS.map((t) => {
              const isSelected = targetTimeline === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTargetTimeline(t.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className="font-bold text-xs">{t.label}</div>
                  <div className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-400'} truncate`}>
                    {t.sub}
                  </div>
                </button>
              );
            })}
          </div>
          {errors.targetTimeline && (
            <p className="text-xs text-red-500 font-bold">{errors.targetTimeline}</p>
          )}
        </div>

        {/* Field 6: Preferred Candidate Background */}
        <div className="md:col-span-2 space-y-3">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <UserCheck size={14} className="text-amber-600" />
            F. Preferred Candidate Background (15% Weight) <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-slate-500">
            Specify the operational experience or profile you seek. Select "No Specific Experience" if training is provided to any qualified investor.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {BACKGROUND_OPTIONS.map((bg) => {
              const isSelected = preferredBackground === bg.id;
              return (
                <div
                  key={bg.id}
                  onClick={() => setPreferredBackground(bg.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-200 text-slate-900 shadow-2xs'
                      : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="preferredBackground"
                    checked={isSelected}
                    onChange={() => setPreferredBackground(bg.id)}
                    className="mt-1 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <div>
                    <div className="text-xs font-black">{bg.label}</div>
                    <div className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">
                      {bg.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {errors.preferredBackground && (
            <p className="text-xs text-red-500 font-bold">{errors.preferredBackground}</p>
          )}
        </div>
      </div>

      {/* Submission Footer */}
      <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-500 flex items-center gap-2">
          <Sparkles size={14} className="text-blue-600 shrink-0" />
          <span>Scores are calculated instantly against verified franchise seekers in our national network.</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 active:scale-98 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span>Running 100-Point Audit...</span>
            ) : (
              <>
                <span>START SMART MATCH</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
