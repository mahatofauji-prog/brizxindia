import React, { useState } from 'react';
import { SmartMatchInput } from '../utils/SmartMatchEngine';
import { Search, MapPin, Briefcase, Clock, Building2, IndianRupee, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onSearch: (input: SmartMatchInput) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const INDUSTRIES = [
  'Food & Beverages',
  'Automotive & EV',
  'Healthcare & Wellness',
  'Education & EdTech',
  'Retail & Supermarkets',
  'Fitness & Sports',
  'Home & Building Automation',
  'Beauty & Personal Care',
  'Professional Services',
  'Other'
];

const BACKGROUNDS = [
  'Business Owner',
  'Entrepreneur',
  'Corporate Professional',
  'Investor',
  'First-Time Entrepreneur',
  'Retail Experience',
  'Food Business Experience',
  'Healthcare Experience',
  'Education Experience',
  'Fitness Experience',
  'Technology Experience',
  'Other'
];

const TIMELINES = [
  'Immediately',
  'Within 1 Month',
  '1–3 Months',
  '3–6 Months',
  '6–12 Months',
  'More than 12 Months'
];

const BUDGET_PRESETS = [
  { label: '₹50,000', min: 0, max: 0.5 },
  { label: '₹1 Lakh', min: 0, max: 1 },
  { label: '₹2.5 Lakhs', min: 0, max: 2.5 },
  { label: '₹5 Lakhs', min: 0, max: 5 },
  { label: '₹10 Lakhs', min: 0, max: 10 },
  { label: '₹25 Lakhs', min: 0, max: 25 },
  { label: '₹50 Lakhs', min: 0, max: 50 },
  { label: '₹1 Crore+', min: 0, max: 9999 }
];

export const SmartMatchForm: React.FC<Props> = ({ onSearch, isOpen: controlledIsOpen, onOpenChange }) => {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : uncontrolledIsOpen;

  const setIsOpen = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else {
      setUncontrolledIsOpen(open);
    }
  };

  const [pinCode, setPinCode] = useState('');
  const [budgetMin, setBudgetMin] = useState<number | null>(null);
  const [budgetMax, setBudgetMax] = useState<number | null>(null);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [background, setBackground] = useState('');
  const [timeline, setTimeline] = useState('');
  
  const [isCustomBudget, setIsCustomBudget] = useState(false);

  const handleIndustryToggle = (ind: string) => {
    setSelectedIndustries(prev => 
      prev.includes(ind) ? prev.filter(i => i !== ind) : [...prev, ind]
    );
  };

  const handleBudgetPresetClick = (min: number, max: number) => {
    setBudgetMin(min);
    setBudgetMax(max);
    setIsCustomBudget(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate city resolution from pin code (in real app, this would use an API)
    const city = pinCode.length >= 6 ? 'Bangalore' : ''; // Mock

    onSearch({
      pinCode,
      budgetMin,
      budgetMax,
      industries: selectedIndustries,
      background,
      timeline,
      city
    });
    setIsOpen(false);
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-blue-100 p-6 md:p-8 mb-12 transition-all">
      {!isOpen ? (
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-2">
          <div className="text-center md:text-left space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-1">
              <Sparkles size={14} /> AI-Powered Recommendation Engine
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">
              FIND YOUR PERFECT FRANCHISE
            </h2>
            <p className="text-slate-600 font-medium text-sm max-w-xl">
              Get personalized franchise recommendations based on your location, budget and business preferences.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center gap-2 shrink-0 text-sm md:text-base cursor-pointer"
          >
            START SMART MATCH →
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight mb-1">
                FIND YOUR PERFECT FRANCHISE
              </h2>
              <p className="text-slate-600 font-medium text-sm">
                Tell us your location, budget and preferences. Our Smart Match engine will rank the best franchise opportunities for you.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 uppercase tracking-wider shrink-0 cursor-pointer"
            >
              CLOSE SMART MATCH <X size={14} strokeWidth={3} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* PIN Code */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wide">
              <MapPin size={16} className="text-blue-600" />
              Area PIN Code
            </label>
            <input
              type="text"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value.replace(/[^0-9]/g, ''))}
              maxLength={6}
              placeholder="Enter 6-digit PIN code"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:border-blue-500 outline-none transition-colors font-medium"
              required
            />
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wide">
              <Clock size={16} className="text-blue-600" />
              When do you want to start?
            </label>
            <select
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:border-blue-500 outline-none transition-colors font-medium appearance-none"
              required
            >
              <option value="">Select Timeline</option>
              {TIMELINES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Investment Budget */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wide">
            <IndianRupee size={16} className="text-blue-600" />
            Investment Budget
          </label>
          <div className="flex flex-wrap gap-2">
            {BUDGET_PRESETS.map(preset => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleBudgetPresetClick(preset.min, preset.max)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                  !isCustomBudget && budgetMax === preset.max
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
                }`}
              >
                {preset.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setIsCustomBudget(true)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                isCustomBudget
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
              }`}
            >
              Custom Budget
            </button>
          </div>

          {isCustomBudget && (
            <div className="flex items-center gap-4 mt-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 mb-1">Min (Lakhs)</label>
                <input
                  type="number"
                  value={budgetMin || ''}
                  onChange={(e) => setBudgetMin(Number(e.target.value))}
                  placeholder="e.g. 2"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 mb-1">Max (Lakhs)</label>
                <input
                  type="number"
                  value={budgetMax || ''}
                  onChange={(e) => setBudgetMax(Number(e.target.value))}
                  placeholder="e.g. 10"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>
          )}
        </div>

        {/* Industry */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wide">
            <Building2 size={16} className="text-blue-600" />
            Preferred Industries
          </label>
          <div className="flex flex-wrap gap-2">
            {INDUSTRIES.map(ind => (
              <button
                key={ind}
                type="button"
                onClick={() => handleIndustryToggle(ind)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                  selectedIndustries.includes(ind)
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        {/* Background */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wide">
            <Briefcase size={16} className="text-blue-600" />
            Your Professional Background
          </label>
          <select
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:border-blue-500 outline-none transition-colors font-medium appearance-none"
            required
          >
            <option value="">Select Background</option>
            {BACKGROUNDS.map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-center">
          <button
            type="submit"
            disabled={!pinCode || (!budgetMax && !budgetMin) || selectedIndustries.length === 0 || !background || !timeline}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-black uppercase tracking-widest px-10 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-2"
          >
            Find My Best Match <Search size={20} />
          </button>
        </div>
      </form>
        </motion.div>
      )}
    </div>
  );
};
