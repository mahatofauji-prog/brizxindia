import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  Calculator, TrendingUp, PieChart, Info, ShieldCheck, ArrowRight, RefreshCw, CheckCircle2, DollarSign, Percent, Calendar, ShieldAlert, Sparkles, Lock, BarChart2 
} from 'lucide-react';
import UnlockROIModal from '../../components/UnlockROIModal';
import { SeekerHero } from '../../components/seeker/SeekerHero';
import { seekerTheme } from '../../theme/seekerTheme';

export default function SeekerROICalculator() {
  const navigate = useNavigate();
  const [activeSubTab, setActiveSubTab] = useState<'roi' | 'investment' | 'profit' | 'emi' | 'breakeven'>('roi');
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);

  const handleUnlockClick = () => {
    const isAlreadyUnlocked = localStorage.getItem('brizx_advanced_roi_unlocked') === 'true';
    if (isAlreadyUnlocked) {
      navigate('/roi-calculator/advanced');
    } else {
      setIsUnlockModalOpen(true);
    }
  };

  const handleUnlockConfirm = () => {
    localStorage.setItem('brizx_advanced_roi_unlocked', 'true');
    setIsUnlockModalOpen(false);
    navigate('/roi-calculator/advanced');
  };

  // ==========================================
  // 1. ROI CALCULATOR STATES & LOGIC
  // ==========================================
  const [totalInvestment, setTotalInvestment] = useState<number>(25); // Lakhs
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(6.5); // Lakhs
  const [grossMarginPct, setGrossMarginPct] = useState<number>(40); // %
  const [monthlyRent, setMonthlyRent] = useState<number>(0.6); // Lakhs
  const [monthlyStaffing, setMonthlyStaffing] = useState<number>(0.8); // Lakhs
  const [monthlyUtilities, setMonthlyUtilities] = useState<number>(0.3); // Lakhs
  const [royaltyPct, setRoyaltyPct] = useState<number>(4); // %

  const grossProfit = (monthlyRevenue * grossMarginPct) / 100; // Lakhs
  const royaltyExpense = (monthlyRevenue * royaltyPct) / 100; // Lakhs
  const totalMonthlyOpEx = monthlyRent + monthlyStaffing + monthlyUtilities + royaltyExpense; // Lakhs
  const monthlyNetProfit = Math.max(0, grossProfit - totalMonthlyOpEx); // Lakhs
  const annualNetProfit = monthlyNetProfit * 12; // Lakhs
  const annualROI = totalInvestment > 0 ? (annualNetProfit / totalInvestment) * 100 : 0;
  const paybackMonths = monthlyNetProfit > 0 ? (totalInvestment / monthlyNetProfit) : 0;

  // ==========================================
  // 2. INVESTMENT CONSOLE STATES & LOGIC
  // ==========================================
  const [franchiseFee, setFranchiseFee] = useState<number>(5); // Lakhs
  const [fitoutCostSqFt, setFitoutCostSqFt] = useState<number>(1800); // ₹ per sq ft
  const [carpetArea, setCarpetArea] = useState<number>(500); // sq ft
  const [equipmentCost, setEquipmentCost] = useState<number>(8); // Lakhs
  const [openingStock, setOpeningStock] = useState<number>(3); // Lakhs
  const [workingCapital, setWorkingCapital] = useState<number>(2.5); // Lakhs
  const [rentalDeposit, setRentalDeposit] = useState<number>(3.5); // Lakhs

  const calculatedFitoutTotal = (fitoutCostSqFt * carpetArea) / 100000; // Lakhs
  const calculatedTotalCapital = franchiseFee + calculatedFitoutTotal + equipmentCost + openingStock + workingCapital + rentalDeposit;

  // ==========================================
  // 3. PROFIT ESTIMATOR STATES & LOGIC
  // ==========================================
  const [estMonthlyRevenue, setEstMonthlyRevenue] = useState<number>(8.0); // Lakhs
  const [foodCostPct, setFoodCostPct] = useState<number>(32); // % (COGS)
  const [operatingOpex, setOperatingOpex] = useState<number>(1.8); // Lakhs

  const cogsExpense = (estMonthlyRevenue * foodCostPct) / 100;
  const netEarningsRealistic = Math.max(0, estMonthlyRevenue - cogsExpense - operatingOpex);
  const netEarningsOptimistic = Math.max(0, (estMonthlyRevenue * 1.25) - (estMonthlyRevenue * 1.25 * (foodCostPct - 2) / 100) - operatingOpex);
  const netEarningsConservative = Math.max(0, (estMonthlyRevenue * 0.75) - (estMonthlyRevenue * 0.75 * (foodCostPct + 3) / 100) - operatingOpex);

  // ==========================================
  // 4. BUSINESS LOAN EMI CALCULATOR STATES
  // ==========================================
  const [loanPrincipal, setLoanPrincipal] = useState<number>(15); // Lakhs
  const [interestRate, setInterestRate] = useState<number>(11.5); // %
  const [tenureYears, setTenureYears] = useState<number>(5); // Years

  const P = loanPrincipal * 100000;
  const r = (interestRate / 12) / 100;
  const n = tenureYears * 12;
  const emiVal = n > 0 && r > 0 ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : P / (n || 1);
  const totalRepayment = emiVal * n;
  const totalInterestPayable = totalRepayment - P;

  // ==========================================
  // 5. BREAK-EVEN ANALYZER STATES & LOGIC
  // ==========================================
  const [fixedMonthlyRent, setFixedMonthlyRent] = useState<number>(75000); // ₹
  const [fixedMonthlySalaries, setFixedMonthlySalaries] = useState<number>(90000); // ₹
  const [fixedMonthlyBills, setFixedMonthlyBills] = useState<number>(35000); // ₹
  const [contributionMarginPct, setContributionMarginPct] = useState<number>(45); // %

  const totalFixedCosts = fixedMonthlyRent + fixedMonthlySalaries + fixedMonthlyBills;
  const breakEvenRevenueNeeded = contributionMarginPct > 0 ? (totalFixedCosts / (contributionMarginPct / 100)) : 0;

  return (
    <div className={seekerTheme.pageContainer}>
      
      {/* Standardized Top Banner */}
      <SeekerHero
        pageKey="advancedRoi"
        badgeText="BrizX ROI Suite"
        badgeIcon={<Calculator size={14} className="text-blue-700" />}
        title="Franchise Financial Intelligence Hub"
        description="Audit capex, simulate break-even, estimate tiered profits, and calculate payback tables with bank interest before deploying capital."
        actions={
          <button
            onClick={handleUnlockClick}
            className="px-5 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles size={16} />
            <span>Unlock Advanced ROI Calculator →</span>
          </button>
        }
      />

      {/* Sub Tabs Navigation */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-white border border-blue-100 rounded-2xl w-full max-w-4xl shadow-xs">
        <button
          onClick={() => setActiveSubTab('roi')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'roi' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-blue-50/60 hover:text-blue-700'
          }`}
        >
          ROI Simulator
        </button>
        <button
          onClick={() => setActiveSubTab('investment')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'investment' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-blue-50/60 hover:text-blue-700'
          }`}
        >
          Capex Architect
        </button>
        <button
          onClick={() => setActiveSubTab('profit')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'profit' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-blue-50/60 hover:text-blue-700'
          }`}
        >
          Profit Estimator
        </button>
        <button
          onClick={() => setActiveSubTab('emi')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'emi' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-blue-50/60 hover:text-blue-700'
          }`}
        >
          EMI Calculator
        </button>
        <button
          onClick={() => setActiveSubTab('breakeven')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'breakeven' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-blue-50/60 hover:text-blue-700'
          }`}
        >
          Break-even Analyzer
        </button>
      </div>

      {/* 1. ROI SIMULATOR VIEW */}
      {activeSubTab === 'roi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-blue-100/80 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-blue-50 pb-4">
              <h3 className="font-extrabold text-slate-900 text-base font-heading">ROI Operating Variables</h3>
              <button
                onClick={() => {
                  setTotalInvestment(25);
                  setMonthlyRevenue(6.5);
                  setGrossMarginPct(40);
                  setMonthlyRent(0.6);
                  setMonthlyStaffing(0.8);
                  setMonthlyUtilities(0.3);
                  setRoyaltyPct(4);
                }}
                className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RefreshCw size={12} /> Reset Parameters
              </button>
            </div>

            {/* Capex Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>Initial Franchise Capital (₹ Lakhs)</span>
                <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-xl font-black">₹{totalInvestment} L</span>
              </div>
              <input
                type="range"
                min="5"
                max="150"
                step="1"
                value={totalInvestment}
                onChange={(e) => setTotalInvestment(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Revenue Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>Estimated Monthly Revenue (₹ Lakhs)</span>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-xl font-black">₹{monthlyRevenue} L</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="0.5"
                value={monthlyRevenue}
                onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Margin Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>Gross Margin Percentage (%)</span>
                <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-xl font-black">{grossMarginPct}%</span>
              </div>
              <input
                type="range"
                min="15"
                max="85"
                step="1"
                value={grossMarginPct}
                onChange={(e) => setGrossMarginPct(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Expenses Breakdown */}
            <div className="pt-4 border-t border-blue-50 space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Operating Expenditures (₹ Lakhs)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Rent Cost</label>
                  <input
                    type="number"
                    step="0.1"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
                    className={seekerTheme.input}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Staff Salaries</label>
                  <input
                    type="number"
                    step="0.1"
                    value={monthlyStaffing}
                    onChange={(e) => setMonthlyStaffing(Number(e.target.value))}
                    className={seekerTheme.input}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Utilities & Marketing</label>
                  <input
                    type="number"
                    step="0.1"
                    value={monthlyUtilities}
                    onChange={(e) => setMonthlyUtilities(Number(e.target.value))}
                    className={seekerTheme.input}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Royalty Share (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={royaltyPct}
                    onChange={(e) => setRoyaltyPct(Number(e.target.value))}
                    className={seekerTheme.input}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-blue-50/90 via-indigo-50/40 to-blue-50/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs border border-blue-100">
              <h3 className="font-extrabold text-base font-heading text-blue-900">Yield Projections</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-blue-100/80 pb-3">
                  <span className="text-xs text-slate-600 font-medium">Monthly Net Earnings</span>
                  <span className="text-xl font-black text-emerald-600">₹{monthlyNetProfit.toFixed(2)} Lakhs</span>
                </div>
                <div className="flex justify-between items-center border-b border-blue-100/80 pb-3">
                  <span className="text-xs text-slate-600 font-medium">Annual Recurrent Earnings</span>
                  <span className="text-xl font-black text-slate-900">₹{annualNetProfit.toFixed(2)} Lakhs</span>
                </div>
                <div className="flex justify-between items-center border-b border-blue-100/80 pb-3">
                  <span className="text-xs text-slate-600 font-medium">Projected Annual ROI</span>
                  <span className="text-xl font-black text-emerald-700">{annualROI.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600 font-medium">Estimated Capex Payback</span>
                  <span className="text-xl font-black text-blue-600">{paybackMonths > 0 ? `${paybackMonths.toFixed(1)} Months` : 'N/A'}</span>
                </div>
              </div>

              <div className="w-full bg-blue-100 rounded-full h-2.5 mt-4">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.min(100, Math.max(5, annualROI))}%` }}></div>
              </div>
            </div>

            <div className="p-4 bg-white border border-blue-100 rounded-2xl flex items-start gap-2.5 shadow-xs">
              <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                Payback period includes average fit-out depreciation and royalty cycles. Tax offsets and GST returns are omitted from these approximations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. CAPEX ARCHITECT VIEW */}
      {activeSubTab === 'investment' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-blue-100/80 space-y-6 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-base font-heading border-b border-blue-50 pb-3">Capex Setup Architect</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Franchise Fee (₹ Lakhs)</label>
                <input
                  type="number"
                  value={franchiseFee}
                  onChange={(e) => setFranchiseFee(Number(e.target.value))}
                  className={seekerTheme.input}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Store Outlet Area (Sq Ft)</label>
                <input
                  type="number"
                  value={carpetArea}
                  onChange={(e) => setCarpetArea(Number(e.target.value))}
                  className={seekerTheme.input}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Interior Fit-out (₹ per Sq Ft)</label>
                <input
                  type="number"
                  value={fitoutCostSqFt}
                  onChange={(e) => setFitoutCostSqFt(Number(e.target.value))}
                  className={seekerTheme.input}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Kitchen & IT Equipment (₹ Lakhs)</label>
                <input
                  type="number"
                  value={equipmentCost}
                  onChange={(e) => setEquipmentCost(Number(e.target.value))}
                  className={seekerTheme.input}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Initial Opening Stock (₹ Lakhs)</label>
                <input
                  type="number"
                  value={openingStock}
                  onChange={(e) => setOpeningStock(Number(e.target.value))}
                  className={seekerTheme.input}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Landlord Rental Security (₹ Lakhs)</label>
                <input
                  type="number"
                  value={rentalDeposit}
                  onChange={(e) => setRentalDeposit(Number(e.target.value))}
                  className={seekerTheme.input}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-gradient-to-br from-blue-50/90 via-indigo-50/40 to-blue-50/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs border border-blue-100 self-start">
            <h3 className="font-extrabold text-base font-heading text-blue-900">Setup Budget Outline</h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-blue-100 pb-2">
                <span className="text-slate-600">One-Time Franchise Fee</span>
                <span className="font-bold text-slate-900">₹{franchiseFee.toFixed(2)} Lakhs</span>
              </div>
              <div className="flex justify-between border-b border-blue-100 pb-2">
                <span className="text-slate-600">Total Interior Fit-outs</span>
                <span className="font-bold text-slate-900">₹{calculatedFitoutTotal.toFixed(2)} Lakhs</span>
              </div>
              <div className="flex justify-between border-b border-blue-100 pb-2">
                <span className="text-slate-600">Equipment & Systems</span>
                <span className="font-bold text-slate-900">₹{equipmentCost.toFixed(2)} Lakhs</span>
              </div>
              <div className="flex justify-between border-b border-blue-100 pb-2">
                <span className="text-slate-600">Opening Stock & Supplies</span>
                <span className="font-bold text-slate-900">₹{openingStock.toFixed(2)} Lakhs</span>
              </div>
              <div className="flex justify-between border-b border-blue-100 pb-2">
                <span className="text-slate-600">Rental Security Advance</span>
                <span className="font-bold text-slate-900">₹{rentalDeposit.toFixed(2)} Lakhs</span>
              </div>
              <div className="flex justify-between pt-2 text-sm font-black text-blue-700">
                <span>Estimated Startup Capex</span>
                <span>₹{calculatedTotalCapital.toFixed(2)} Lakhs</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. PROFIT ESTIMATOR VIEW */}
      {activeSubTab === 'profit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-blue-100/80 space-y-6 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-base font-heading border-b border-blue-50 pb-3">Operational Profit Estimator</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Monthly Gross Turnover (₹ Lakhs)</label>
                <input
                  type="range"
                  min="2"
                  max="40"
                  step="0.5"
                  value={estMonthlyRevenue}
                  onChange={(e) => setEstMonthlyRevenue(Number(e.target.value))}
                  className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <span className="text-xs text-emerald-600 font-extrabold block mt-1">₹{estMonthlyRevenue} Lakhs</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cost of Goods Sold (COGS) %</label>
                <input
                  type="range"
                  min="15"
                  max="60"
                  step="1"
                  value={foodCostPct}
                  onChange={(e) => setFoodCostPct(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <span className="text-xs text-blue-600 font-extrabold block mt-1">{foodCostPct}% (Gross margin {100 - foodCostPct}%)</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fixed Operating Costs (Rent, Salaries, utilities in ₹ Lakhs)</label>
                <input
                  type="number"
                  step="0.1"
                  value={operatingOpex}
                  onChange={(e) => setOperatingOpex(Number(e.target.value))}
                  className={seekerTheme.input}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            {/* Tier Card 1 */}
            <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 shadow-xs">
              <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded tracking-widest">Optimistic Scenario (125% sales)</span>
              <h4 className="text-xl font-black text-slate-900 mt-2">₹{netEarningsOptimistic.toFixed(2)} Lakhs / mo</h4>
              <p className="text-[11px] text-slate-600 mt-1">Simulates peak weekends and high organic footfall spikes.</p>
            </div>

            {/* Tier Card 2 */}
            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200 shadow-xs">
              <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-100 px-2 py-0.5 rounded tracking-widest">Realistic Scenario (Target)</span>
              <h4 className="text-xl font-black text-slate-900 mt-2">₹{netEarningsRealistic.toFixed(2)} Lakhs / mo</h4>
              <p className="text-[11px] text-slate-600 mt-1">Simulates normal commercial cycles with standard opex structures.</p>
            </div>

            {/* Tier Card 3 */}
            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 shadow-xs">
              <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded tracking-widest">Conservative Scenario (75% sales)</span>
              <h4 className="text-xl font-black text-slate-900 mt-2">₹{netEarningsConservative.toFixed(2)} Lakhs / mo</h4>
              <p className="text-[11px] text-slate-600 mt-1">Models low market periods or highly competitive localized conditions.</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. EMI CALCULATOR VIEW */}
      {activeSubTab === 'emi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-blue-100/80 space-y-6 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-base font-heading border-b border-blue-50 pb-3">Business Loan EMI Calculator</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Loan Principal Amount (₹ Lakhs)</label>
                <input
                  type="range"
                  min="2"
                  max="100"
                  step="1"
                  value={loanPrincipal}
                  onChange={(e) => setLoanPrincipal(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <span className="text-xs text-blue-600 font-extrabold block mt-1">₹{loanPrincipal} Lakhs</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Annual Interest Rate (%)</label>
                <input
                  type="range"
                  min="7"
                  max="18"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <span className="text-xs text-blue-600 font-extrabold block mt-1">{interestRate}%</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Loan Tenure (Years)</label>
                <input
                  type="range"
                  min="1"
                  max="7"
                  step="1"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <span className="text-xs text-blue-600 font-extrabold block mt-1">{tenureYears} Years ({tenureYears * 12} Mos)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-gradient-to-br from-blue-50/90 via-indigo-50/40 to-blue-50/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs border border-blue-100 self-start">
            <h3 className="font-extrabold text-base font-heading text-blue-900">Repayment Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-blue-100 pb-3">
                <span className="text-xs text-slate-600">Monthly EMI Payable</span>
                <span className="text-xl font-black text-slate-900">₹{Math.round(emiVal).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center border-b border-blue-100 pb-3">
                <span className="text-xs text-slate-600">Principal Amount</span>
                <span className="text-base font-bold text-slate-900">₹{(loanPrincipal * 100000).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center border-b border-blue-100 pb-3">
                <span className="text-xs text-slate-600">Total Interest Payable</span>
                <span className="text-base font-bold text-blue-700">₹{Math.round(totalInterestPayable).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Total Repayment Amount</span>
                <span className="text-xl font-black text-emerald-700">₹{Math.round(totalRepayment).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. BREAK-EVEN ANALYZER VIEW */}
      {activeSubTab === 'breakeven' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-blue-100/80 space-y-6 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-base font-heading border-b border-blue-50 pb-3">Break-even Analyzer</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Monthly Shop Rent (₹)</label>
                  <input
                    type="number"
                    value={fixedMonthlyRent}
                    onChange={(e) => setFixedMonthlyRent(Number(e.target.value))}
                    className={seekerTheme.input}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Monthly Payroll (₹)</label>
                  <input
                    type="number"
                    value={fixedMonthlySalaries}
                    onChange={(e) => setFixedMonthlySalaries(Number(e.target.value))}
                    className={seekerTheme.input}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Admin Bills & Ins (₹)</label>
                  <input
                    type="number"
                    value={fixedMonthlyBills}
                    onChange={(e) => setFixedMonthlyBills(Number(e.target.value))}
                    className={seekerTheme.input}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contribution Margin Percentage (%)</label>
                <input
                  type="range"
                  min="20"
                  max="90"
                  step="1"
                  value={contributionMarginPct}
                  onChange={(e) => setContributionMarginPct(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <span className="text-xs text-blue-600 font-extrabold block mt-1">{contributionMarginPct}% Contribution Margin</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-gradient-to-br from-blue-50/90 via-indigo-50/40 to-blue-50/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs border border-blue-100 self-start">
            <h3 className="font-extrabold text-base font-heading text-blue-900">Break-even Threshold</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-blue-100 pb-3">
                <span className="text-xs text-slate-600">Total Fixed Overhead Costs</span>
                <span className="text-base font-bold text-slate-900">₹{totalFixedCosts.toLocaleString('en-IN')} / mo</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Required Monthly Sales to Break even</span>
                <span className="text-xl font-black text-emerald-700">₹{Math.round(breakEvenRevenueNeeded).toLocaleString('en-IN')} / mo</span>
              </div>
            </div>

            <div className="p-3.5 bg-white border border-blue-100 rounded-xl text-[11px] text-slate-600 flex items-start gap-2 shadow-xs">
              <ShieldAlert size={16} className="text-blue-600 shrink-0 mt-0.5" />
              <span>Any turnover under this threshold results in operational loss. Retain a working capital buffer of 3-6 months.</span>
            </div>
          </div>
        </div>
      )}

      <UnlockROIModal
        isOpen={isUnlockModalOpen}
        onClose={() => setIsUnlockModalOpen(false)}
        onUnlock={handleUnlockConfirm}
      />

    </div>
  );
}
