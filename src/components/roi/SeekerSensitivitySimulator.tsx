import React, { useState, useMemo } from 'react';
import { 
  Sliders, TrendingUp, Wallet, Landmark, AlertTriangle, 
  CheckCircle2, ArrowRight, RefreshCw, BarChart2 
} from 'lucide-react';
import { BrandFinancialProfile } from '../../types';

interface SeekerSensitivitySimulatorProps {
  financialProfile?: BrandFinancialProfile;
  brandName: string;
  totalCapexLakhs: number;
  baselineRevenueRupees: number;
  baselineOpexRupees: number;
  baselineProfitRupees: number;
  cogsPercentage: number;
  royaltyPercentage: number;
}

export const SeekerSensitivitySimulator: React.FC<SeekerSensitivitySimulatorProps> = ({
  financialProfile,
  brandName,
  totalCapexLakhs,
  baselineRevenueRupees,
  baselineOpexRupees,
  baselineProfitRupees,
  cogsPercentage,
  royaltyPercentage
}) => {
  // Volume sensitivity multiplier (default 100%)
  const [volumePercent, setVolumePercent] = useState<number>(100);

  // Seeker Capital
  const [seekerCapitalLakhs, setSeekerCapitalLakhs] = useState<number>(25);

  // Bank Loan & Debt Parameters
  const [loanPercentage, setLoanPercentage] = useState<number>(40);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(3);
  const [loanInterestRate, setLoanInterestRate] = useState<number>(10.5);

  const totalCapexRupees = totalCapexLakhs * 100000;

  // Compute fixed vs variable opex from baseline
  // Variable opex = COGS + Royalty
  // Fixed opex = Rent + Salaries + Utilities + Marketing + Maintenance + Other
  const baselineVariableOpexRupees = useMemo(() => {
    return Math.round(baselineRevenueRupees * ((cogsPercentage + royaltyPercentage) / 100));
  }, [baselineRevenueRupees, cogsPercentage, royaltyPercentage]);

  const fixedOpexRupees = useMemo(() => {
    const fixed = baselineOpexRupees - baselineVariableOpexRupees;
    return fixed > 0 ? fixed : Math.round(baselineOpexRupees * 0.5);
  }, [baselineOpexRupees, baselineVariableOpexRupees]);

  // Dynamic scenario calculator for a given volume percentage
  const calculateScenario = (pct: number) => {
    const simulatedRevenue = Math.round(baselineRevenueRupees * (pct / 100));
    const simulatedVariableOpex = Math.round(simulatedRevenue * ((cogsPercentage + royaltyPercentage) / 100));
    const simulatedTotalOpex = fixedOpexRupees + simulatedVariableOpex;
    const simulatedNetProfit = simulatedRevenue - simulatedTotalOpex;
    const simulatedAnnualProfit = simulatedNetProfit * 12;
    const simulatedRoi = totalCapexRupees > 0 ? (simulatedAnnualProfit / totalCapexRupees) * 100 : 0;
    const simulatedPaybackMonths = simulatedNetProfit > 0 && totalCapexRupees > 0 
      ? Math.round(totalCapexRupees / simulatedNetProfit) 
      : 0;

    const baseOrders = financialProfile?.estimatedMonthlyOrders || Math.round(baselineRevenueRupees / (financialProfile?.avgCustomerTicket || 375));
    const simulatedOrders = Math.round(baseOrders * (pct / 100));

    return {
      volumePercent: pct,
      revenueLakhs: (simulatedRevenue / 100000),
      revenueRupees: simulatedRevenue,
      netProfitRupees: simulatedNetProfit,
      annualProfitRupees: simulatedAnnualProfit,
      roiPercent: simulatedRoi,
      paybackMonths: simulatedPaybackMonths,
      orders: simulatedOrders
    };
  };

  const conservativeScenario = useMemo(() => calculateScenario(70), [baselineRevenueRupees, fixedOpexRupees, cogsPercentage, royaltyPercentage, totalCapexRupees]);
  const baselineScenario = useMemo(() => calculateScenario(100), [baselineRevenueRupees, fixedOpexRupees, cogsPercentage, royaltyPercentage, totalCapexRupees]);
  const optimisticScenario = useMemo(() => calculateScenario(130), [baselineRevenueRupees, fixedOpexRupees, cogsPercentage, royaltyPercentage, totalCapexRupees]);
  const activeScenario = useMemo(() => calculateScenario(volumePercent), [volumePercent, baselineRevenueRupees, fixedOpexRupees, cogsPercentage, royaltyPercentage, totalCapexRupees]);

  // Capital Gap Calculation
  const seekerCapitalRupees = seekerCapitalLakhs * 100000;
  const capitalDifferenceLakhs = seekerCapitalLakhs - totalCapexLakhs;
  const fundingRatio = totalCapexLakhs > 0 ? (seekerCapitalLakhs / totalCapexLakhs) * 100 : 100;

  // Loan EMI Calculation
  const loanPrincipalRupees = useMemo(() => {
    return Math.round(totalCapexRupees * (loanPercentage / 100));
  }, [totalCapexRupees, loanPercentage]);

  const equityRupees = totalCapexRupees - loanPrincipalRupees;

  const monthlyEmi = useMemo(() => {
    if (loanPrincipalRupees <= 0) return 0;
    const monthlyRate = (loanInterestRate / 100) / 12;
    const totalMonths = loanTenureYears * 12;
    const emi = (loanPrincipalRupees * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                (Math.pow(1 + monthlyRate, totalMonths) - 1);
    return isNaN(emi) ? 0 : Math.round(emi);
  }, [loanPrincipalRupees, loanInterestRate, loanTenureYears]);

  const postEmiNetCashflow = activeScenario.netProfitRupees - monthlyEmi;
  const dscr = monthlyEmi > 0 ? (activeScenario.netProfitRupees / monthlyEmi) : 999;

  return (
    <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-2xl border border-blue-500/30">
            <Sliders size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-wider mb-1">
              Interactive Seeker Sandbox
            </div>
            <h3 className="text-xl font-black text-white font-heading">
              Sensitivity & Seeker Financing Simulator
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              The brand baseline numbers above are locked. Use this interactive section to simulate how your footfall assumptions, available capital, and bank financing would impact your personal returns.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setVolumePercent(100);
            setSeekerCapitalLakhs(25);
            setLoanPercentage(40);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors shrink-0"
        >
          <RefreshCw size={13} /> Reset Simulator
        </button>
      </div>

      {/* Part 1: What-If Volume & Footfall Stress Testing */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase text-blue-400 tracking-wider flex items-center gap-2">
            <TrendingUp size={15} /> 1. What-If Footfall & Sales Sensitivity
          </h4>
          <span className="text-xs font-bold text-slate-400">
            Current Slider: <strong className="text-white">{volumePercent}%</strong> Volume
          </span>
        </div>

        {/* 3 Preset Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Conservative */}
          <div 
            onClick={() => setVolumePercent(70)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              volumePercent === 70 
                ? 'bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/30' 
                : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                Conservative (70% Vol)
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                {conservativeScenario.orders.toLocaleString()} orders
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Monthly Revenue:</span>
                <span className="font-bold text-white">₹{conservativeScenario.revenueLakhs.toFixed(2)}L</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Net Profit / mo:</span>
                <span className="font-bold text-amber-300">₹{conservativeScenario.netProfitRupees.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Projected ROI:</span>
                <span className="font-bold text-white">{conservativeScenario.roiPercent.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Payback Horizon:</span>
                <span className="font-bold text-slate-300">
                  {conservativeScenario.paybackMonths > 0 ? `${conservativeScenario.paybackMonths} Months` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Baseline */}
          <div 
            onClick={() => setVolumePercent(100)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              volumePercent === 100 
                ? 'bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/30' 
                : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-blue-400 uppercase tracking-wider">
                Brand Baseline (100% Vol)
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                {baselineScenario.orders.toLocaleString()} orders
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Monthly Revenue:</span>
                <span className="font-bold text-white">₹{baselineScenario.revenueLakhs.toFixed(2)}L</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Net Profit / mo:</span>
                <span className="font-bold text-emerald-400">₹{baselineScenario.netProfitRupees.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Projected ROI:</span>
                <span className="font-bold text-white">{baselineScenario.roiPercent.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Payback Horizon:</span>
                <span className="font-bold text-slate-300">
                  {baselineScenario.paybackMonths > 0 ? `${baselineScenario.paybackMonths} Months` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Optimistic */}
          <div 
            onClick={() => setVolumePercent(130)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              volumePercent === 130 
                ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30' 
                : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                Optimistic (130% Vol)
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                {optimisticScenario.orders.toLocaleString()} orders
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Monthly Revenue:</span>
                <span className="font-bold text-white">₹{optimisticScenario.revenueLakhs.toFixed(2)}L</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Net Profit / mo:</span>
                <span className="font-bold text-emerald-300">₹{optimisticScenario.netProfitRupees.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Projected ROI:</span>
                <span className="font-bold text-white">{optimisticScenario.roiPercent.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Payback Horizon:</span>
                <span className="font-bold text-slate-300">
                  {optimisticScenario.paybackMonths > 0 ? `${optimisticScenario.paybackMonths} Months` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Continuous Volume Slider */}
        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/60 space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-300">
            <span>50% (High Stress)</span>
            <span className="text-blue-400">Simulate Custom Footfall Volume: {volumePercent}%</span>
            <span>150% (Peak Season)</span>
          </div>
          <input
            type="range"
            min="50"
            max="150"
            step="5"
            value={volumePercent}
            onChange={(e) => setVolumePercent(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-[11px] text-slate-400 pt-1">
            <span>Simulated Orders: <strong className="text-white">{activeScenario.orders.toLocaleString()}</strong> / mo</span>
            <span>Net Monthly Profit: <strong className={activeScenario.netProfitRupees >= 0 ? 'text-emerald-400' : 'text-rose-400'}>₹{activeScenario.netProfitRupees.toLocaleString('en-IN')}</strong></span>
            <span>Payback: <strong className="text-amber-400">{activeScenario.paybackMonths > 0 ? `${activeScenario.paybackMonths} Mos` : 'N/A'}</strong></span>
          </div>
        </div>
      </div>

      {/* Part 2: Investor Capital Matching */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase text-blue-400 tracking-wider flex items-center gap-2">
            <Wallet size={15} /> 2. Personal Capital Matching & Feasibility Check
          </h4>
          <span className="text-xs font-bold text-slate-400">
            Required Capex: <strong className="text-white">₹{totalCapexLakhs.toFixed(2)} Lakhs</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 bg-slate-800/60 p-4 rounded-2xl border border-slate-700 space-y-3">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-300">My Available Liquid Capital:</span>
              <span className="text-lg text-white font-black font-heading">₹{seekerCapitalLakhs} Lakhs</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="1"
              value={seekerCapitalLakhs}
              onChange={(e) => setSeekerCapitalLakhs(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹5 Lakhs</span>
              <span>₹25 Lakhs (Typical)</span>
              <span>₹60 Lakhs</span>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
            capitalDifferenceLakhs >= 0 
              ? 'bg-emerald-950/30 border-emerald-500/50' 
              : 'bg-amber-950/30 border-amber-500/50'
          }`}>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider block mb-1 text-slate-400">
                Capital Coverage Status
              </span>
              <div className="flex items-center gap-1.5">
                {capitalDifferenceLakhs >= 0 ? (
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle size={18} className="text-amber-400 shrink-0" />
                )}
                <span className={`text-base font-black font-heading ${capitalDifferenceLakhs >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {capitalDifferenceLakhs >= 0 ? `+₹${capitalDifferenceLakhs.toFixed(1)}L Surplus` : `-₹${Math.abs(capitalDifferenceLakhs).toFixed(1)}L Funding Gap`}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-300 font-medium mt-2">
              {capitalDifferenceLakhs >= 0 
                ? `You have ${fundingRatio.toFixed(0)}% capital readiness. Sufficient liquidity to self-fund.`
                : `You have ${fundingRatio.toFixed(0)}% capital readiness. ₹${Math.abs(capitalDifferenceLakhs).toFixed(1)}L debt or co-investor needed.`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Part 3: Bank Loan & Debt Service Estimator */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase text-blue-400 tracking-wider flex items-center gap-2">
            <Landmark size={15} /> 3. Bank Loan & Debt Service Coverage (EMI Model)
          </h4>
          <span className="text-xs font-bold text-slate-400">
            Loan Portion: <strong className="text-white">{loanPercentage}%</strong> (₹{(loanPrincipalRupees / 100000).toFixed(2)} Lakhs)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700">
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Loan Percentage of Capex</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="75"
                step="5"
                value={loanPercentage}
                onChange={(e) => setLoanPercentage(Number(e.target.value))}
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <span className="text-sm font-black text-white w-12 text-right">{loanPercentage}%</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Equity: {100 - loanPercentage}% (₹{(equityRupees / 100000).toFixed(2)}L)</span>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700">
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Loan Tenure (Years)</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="7"
                step="1"
                value={loanTenureYears}
                onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <span className="text-sm font-black text-white w-12 text-right">{loanTenureYears} Yrs</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">{loanTenureYears * 12} Monthly installments</span>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700">
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Interest Rate (P.A. %)</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="8"
                max="14"
                step="0.25"
                value={loanInterestRate}
                onChange={(e) => setLoanInterestRate(Number(e.target.value))}
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <span className="text-sm font-black text-white w-12 text-right">{loanInterestRate}%</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Standard SME commercial loan rate</span>
          </div>
        </div>

        {/* Debt Service KPI Result Card */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Monthly Bank EMI</span>
            <span className="text-lg font-black text-amber-400 mt-1 block font-heading">
              ₹{monthlyEmi.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-500">For {loanTenureYears * 12} months</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Post-EMI Net Cashflow</span>
            <span className={`text-lg font-black mt-1 block font-heading ${postEmiNetCashflow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ₹{postEmiNetCashflow.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-500">Monthly in-pocket cash</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">DSCR Coverage Ratio</span>
            <span className={`text-lg font-black mt-1 block font-heading ${
              dscr >= 1.5 ? 'text-emerald-400' : dscr >= 1.2 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {monthlyEmi > 0 ? `${dscr.toFixed(2)}x` : 'Zero Debt'}
            </span>
            <span className="text-[10px] text-slate-500">
              {dscr >= 1.5 ? 'Healthy coverage' : dscr >= 1.2 ? 'Moderate' : 'Tight debt stress'}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Effective Equity Payback</span>
            <span className="text-lg font-black text-blue-400 mt-1 block font-heading">
              {postEmiNetCashflow > 0 && equityRupees > 0 
                ? `${Math.round(equityRupees / postEmiNetCashflow)} Months` 
                : 'N/A'
              }
            </span>
            <span className="text-[10px] text-slate-500">Payback on invested equity</span>
          </div>
        </div>
      </div>
    </div>
  );
};
