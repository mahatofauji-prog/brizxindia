import React, { useState } from 'react';
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs';
import { 
  Sliders, Sparkles, Save, RotateCcw, CheckCircle, Calculator, 
  Target, Zap, ShieldCheck, ArrowRight, Download
} from 'lucide-react';
import UniversalExportModal from '../../components/admin/UniversalExportModal';
import { ExportField } from '../../lib/exportService';

const matchRuleFields: ExportField[] = [
  { label: 'Parameter Name', key: 'parameterName' },
  { label: 'Current Weight', key: 'currentWeight', transform: (val) => `${val}%` },
  { label: 'Description', key: 'description' },
  { label: 'Status', key: 'status' },
];

export default function AdminSmartMatch() {
  const [weights, setWeights] = useState({
    investment: 40,
    industry: 30,
    location: 20,
    timeline: 10
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Simulator inputs
  const [simSeekerBudget, setSimSeekerBudget] = useState(25); // Lakhs
  const [simSeekerIndustry, setSimSeekerIndustry] = useState('Food & Beverage');
  const [simSeekerCity, setSimSeekerCity] = useState('Bangalore');

  const [simBrandMin, setSimBrandMin] = useState(20);
  const [simBrandMax, setSimBrandMax] = useState(30);
  const [simBrandIndustry, setSimBrandIndustry] = useState('Food & Beverage');
  const [simBrandCities, setSimBrandCities] = useState(['Bangalore', 'Hyderabad', 'Mumbai']);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSliderChange = (key: keyof typeof weights, val: number) => {
    setWeights(prev => ({ ...prev, [key]: val }));
  };

  const totalWeight = weights.investment + weights.industry + weights.location + weights.timeline;

  // Calculate simulated compatibility score
  const calculateSimScore = () => {
    let budgetScore = 0;
    if (simSeekerBudget >= simBrandMin && simSeekerBudget <= simBrandMax + 10) {
      budgetScore = 1.0;
    } else if (simSeekerBudget >= simBrandMin - 5) {
      budgetScore = 0.7;
    } else {
      budgetScore = 0.3;
    }

    let indScore = simSeekerIndustry === simBrandIndustry ? 1.0 : 0.4;
    let locScore = simBrandCities.includes(simSeekerCity) ? 1.0 : 0.5;
    let timeScore = 0.9;

    const finalPercent = Math.round(
      (budgetScore * weights.investment) +
      (indScore * weights.industry) +
      (locScore * weights.location) +
      (timeScore * weights.timeline)
    );

    return Math.min(finalPercent, 99);
  };

  const simScore = calculateSimScore();

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto">
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-blue-700 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-indigo-700 animate-in fade-in">
          <CheckCircle size={18} className="text-blue-500" />
          <span className="text-xs font-bold uppercase tracking-wider">{toastMessage}</span>
        </div>
      )}

      <AdminBreadcrumbs items={[{ label: 'Super Admin', path: '/admin' }, { label: 'Smart Match Configuration' }]} />

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-indigo-950 mb-2 font-heading flex items-center gap-3">
            <Sliders size={32} className="text-blue-600" /> Smart Match Algorithm Tuning
          </h1>
          <p className="text-slate-600">Calibrate AI weighting vectors used for automated brand-seeker compatibility scoring.</p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setIsExportOpen(true)}
            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-2"
          >
            <Download size={14} className="text-slate-500" /> Export Rules
          </button>
          <button 
            onClick={() => setWeights({ investment: 40, industry: 30, location: 20, timeline: 10 })}
            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-2"
          >
            <RotateCcw size={14} /> Reset Defaults
          </button>
          <button 
            onClick={() => showToast('Smart Match algorithm weights updated and compiled globally!')}
            className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-indigo-200 flex items-center gap-2 cursor-pointer"
          >
            <Save size={16} /> Save Configuration
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        {/* Left Column: Sliders */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-200 shadow-xs flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-indigo-950 font-heading flex items-center gap-2">
                <Target size={20} className="text-blue-600" /> Parameter Weights
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                totalWeight === 100 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                Total Weight: {totalWeight}%
              </span>
            </div>

            <div className="space-y-8">
              {/* Slider 1 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Investment Capacity Match Weight
                  </label>
                  <span className="text-base font-black text-indigo-950">{weights.investment}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={weights.investment}
                  onChange={(e) => handleSliderChange('investment', Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <p className="text-[11px] text-slate-400 mt-1 font-medium">Evaluates seeker liquid capital vs brand min/max investment requirement.</p>
              </div>

              {/* Slider 2 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Industry & Sub-Category Match Weight
                  </label>
                  <span className="text-base font-black text-indigo-950">{weights.industry}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={weights.industry}
                  onChange={(e) => handleSliderChange('industry', Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <p className="text-[11px] text-slate-400 mt-1 font-medium">Measures seeker sector interest against brand operating industry.</p>
              </div>

              {/* Slider 3 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Geographic Location / City Expansion Match Weight
                  </label>
                  <span className="text-base font-black text-indigo-950">{weights.location}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={weights.location}
                  onChange={(e) => handleSliderChange('location', Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <p className="text-[11px] text-slate-400 mt-1 font-medium">Checks if seeker's target city matches brand expansion target zones.</p>
              </div>

              {/* Slider 4 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Timeline & Site Readiness Weight
                  </label>
                  <span className="text-base font-black text-indigo-950">{weights.timeline}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={weights.timeline}
                  onChange={(e) => handleSliderChange('timeline', Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <p className="text-[11px] text-slate-400 mt-1 font-medium">Scores launch readiness (Immediate, 30 Days, 90 Days).</p>
              </div>
            </div>
          </div>

          {totalWeight !== 100 && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-700">
              Warning: Total weight should sum up to exactly 100% for balanced scoring.
            </div>
          )}
        </div>

        {/* Right Column: Live Simulator */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-950 to-indigo-900 rounded-3xl p-8 text-white shadow-xl flex flex-col justify-between overflow-y-auto relative">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Zap className="text-blue-500" size={24} />
              <h3 className="text-xl font-black font-heading tracking-tight">Live Score Simulator</h3>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 mb-6 border border-white/10 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">Test Inputs</span>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-300 font-bold block mb-1">Seeker Budget (₹L)</label>
                  <input 
                    type="number" 
                    value={simSeekerBudget}
                    onChange={(e) => setSimSeekerBudget(Number(e.target.value))}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-300 font-bold block mb-1">Seeker City</label>
                  <input 
                    type="text" 
                    value={simSeekerCity}
                    onChange={(e) => setSimSeekerCity(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-300 font-bold block mb-1">Seeker Sector</label>
                <select 
                  value={simSeekerIndustry}
                  onChange={(e) => setSimSeekerIndustry(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold text-white cursor-pointer"
                >
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Retail">Retail</option>
                  <option value="Education">Education</option>
                  <option value="Healthcare">Healthcare</option>
                </select>
              </div>
            </div>

            {/* Calculated Preview Score */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center relative overflow-hidden">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 block mb-2">Simulated Compatibility Score</span>
              <div className="text-6xl font-black text-blue-400 font-heading tracking-tight mb-2">
                {simScore}%
              </div>
              
              <div className="inline-block px-4 py-1.5 rounded-full bg-green-500/20 text-green-300 text-xs font-bold border border-green-400/30">
                {simScore > 80 ? 'Grade A+ Highly Recommended Match' : simScore > 65 ? 'Grade B Solid Match' : 'Grade C Moderate Match'}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/10 text-xs text-slate-400 flex items-center gap-2">
            <ShieldCheck size={16} className="text-green-400 shrink-0" />
            <span>Algorithm updates apply instantaneously across BrizX Smart Match Engine.</span>
          </div>
        </div>
      </div>

      <UniversalExportModal 
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title="Smart Match Algorithmic Weights & Performance Configuration"
        filenamePrefix="SmartMatch-Weights-Rules"
        currentData={[
          { parameterName: 'Investment Capacity Capacity Weight', currentWeight: weights.investment, description: 'Evaluates seeker liquid capital vs brand min/max investment range.', status: 'Active' },
          { parameterName: 'Industry & Sector Alignment Weight', currentWeight: weights.industry, description: 'Measures seeker sector interest against brand operating domain.', status: 'Active' },
          { parameterName: 'Geographic Location / City Weight', currentWeight: weights.location, description: 'Checks if seeker\'s target city matches brand expansion zones.', status: 'Active' },
          { parameterName: 'Timeline & Site Readiness Weight', currentWeight: weights.timeline, description: 'Scores launch readiness timeline metrics.', status: 'Active' },
        ]}
        allData={[
          { parameterName: 'Investment Capacity Capacity Weight', currentWeight: weights.investment, description: 'Evaluates seeker liquid capital vs brand min/max investment range.', status: 'Active' },
          { parameterName: 'Industry & Sector Alignment Weight', currentWeight: weights.industry, description: 'Measures seeker sector interest against brand operating domain.', status: 'Active' },
          { parameterName: 'Geographic Location / City Weight', currentWeight: weights.location, description: 'Checks if seeker\'s target city matches brand expansion zones.', status: 'Active' },
          { parameterName: 'Timeline & Site Readiness Weight', currentWeight: weights.timeline, description: 'Scores launch readiness timeline metrics.', status: 'Active' },
        ]}
        fields={matchRuleFields}
      />
    </div>
  );
}
