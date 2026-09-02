import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Info, 
  Clock, 
  Percent, 
  IndianRupee,
  Activity,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Save,
  CheckCircle,
  HelpCircle,
  TrendingDown,
  PieChart,
  BarChart2,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router';

interface ROICalculatorCardProps {
  initialInvestment?: number;       // In Lakhs
  expectedMonthlyRevenue?: number;  // In Lakhs
  expectedMonthlyOperatingCost?: number; // In Lakhs
  titleContext?: string;
  mode?: 'basic' | 'advanced'; // Added mode
}

export function ROICalculatorCard({
  initialInvestment = 30,
  expectedMonthlyRevenue = 4,
  expectedMonthlyOperatingCost = 2.8,
  titleContext = "",
  mode = 'basic' // Default to basic
}: ROICalculatorCardProps) {
  // Input states
  const [investment, setInvestment] = useState(initialInvestment);
  const [revenue, setRevenue] = useState(expectedMonthlyRevenue);
  const [operatingCost, setOperatingCost] = useState(expectedMonthlyOperatingCost);
  const [growthRate, setGrowthRate] = useState(10); // % optional growth rate
  
  // Advanced panel toggle (only for basic mode to show the CTA, for advanced mode it's always true)
  const [showAdvanced, setShowAdvanced] = useState(mode === 'advanced');
  const [saveStatus, setSaveStatus] = useState<'IDLE' | 'SAVED'>('IDLE');

  // Synchronize with external changes to props (such as switching profiles/brands)
  useEffect(() => {
    setInvestment(initialInvestment);
  }, [initialInvestment]);

  useEffect(() => {
    setRevenue(expectedMonthlyRevenue);
  }, [expectedMonthlyRevenue]);

  useEffect(() => {
    setOperatingCost(expectedMonthlyOperatingCost);
  }, [expectedMonthlyOperatingCost]);

  // Derived Calculations
  const calculations = useMemo(() => {
    // Expected Monthly Profit = Revenue - Operating Cost
    const monthlyProfitLakhs = Math.max(0, revenue - operatingCost);
    const monthlyProfitRupees = Math.round(monthlyProfitLakhs * 100000);

    // Compound Annual Profit over 3 Years factoring in Growth Rate
    const y1Revenue = revenue * 12;
    const y1Expense = operatingCost * 12;
    const y1Profit = Math.max(0, y1Revenue - y1Expense);

    const y2Revenue = y1Revenue * (1 + growthRate / 100);
    const y2Expense = y1Expense * 1.05; // 5% slight inflation in cost
    const y2Profit = Math.max(0, y2Revenue - y2Expense);

    const y3Revenue = y2Revenue * (1 + growthRate / 100);
    const y3Expense = y2Expense * 1.05; // another 5% expense cost rise
    const y3Profit = Math.max(0, y3Revenue - y3Expense);

    const cumulative3YearProfit = y1Profit + y2Profit + y3Profit;
    const return3YearPercent = investment > 0 ? (cumulative3YearProfit / investment) * 100 : 0;

    // Break-even period in months = Initial Investment / Monthly Profit
    const breakEvenMonths = monthlyProfitLakhs > 0 ? (investment / monthlyProfitLakhs) : 0;

    // Annual ROI % = (Y1 Profit / Initial Investment) * 100
    const annualROI = investment > 0 ? (y1Profit / investment) * 100 : 0;

    // Financial detail breakdown
    const capexBreakdown = {
      franchiseFee: Math.round(investment * 0.2), // 20% franchise fee
      setupInterior: Math.round(investment * 0.5), // 50% setup and machinery
      workingCapital: Math.round(investment * 0.3) // 30% working capital reserve
    };

    const monthlyExpenseBreakdown = {
      rentUtilities: Math.round(operatingCost * 100000 * 0.35), // 35% Rent/power
      staffSalaries: Math.round(operatingCost * 100000 * 0.4),  // 40% staff payroll
      royaltyMarketing: Math.round(operatingCost * 100000 * 0.15), // 15% brand royalties
      miscellaneous: Math.round(operatingCost * 100000 * 0.1)     // 10% inventory & buffer
    };

    const netProfitMargin = revenue > 0 ? (monthlyProfitLakhs / revenue) * 100 : 0;

    return {
      monthlyProfitLakhs,
      monthlyProfitRupees,
      y1Revenue,
      y1Profit,
      y2Revenue,
      y2Profit,
      y3Revenue,
      y3Profit,
      cumulative3YearProfit,
      return3YearPercent,
      breakEvenMonths,
      annualROI,
      capexBreakdown,
      monthlyExpenseBreakdown,
      netProfitMargin
    };
  }, [investment, revenue, operatingCost, growthRate]);

  // Format helper for Indian Rupee/Lakhs display
  const formatLakhs = (val: number) => {
    if (val >= 100) {
      return `₹${(val / 100).toFixed(2)} Cr`;
    }
    return `₹${val.toFixed(2)} Lakhs`;
  };

  const handleReset = () => {
    setInvestment(initialInvestment);
    setRevenue(expectedMonthlyRevenue);
    setOperatingCost(expectedMonthlyOperatingCost);
    setGrowthRate(10);
    setSaveStatus('IDLE');
  };

  const handleSave = () => {
    // Save to LocalStorage associated with titleContext
    const payload = {
      investment,
      revenue,
      operatingCost,
      growthRate,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(`brizx_saved_roi_${titleContext || 'profile'}`, JSON.stringify(payload));
    setSaveStatus('SAVED');
    setTimeout(() => setSaveStatus('IDLE'), 3500);
  };

  // Generate responsive interactive chart data coordinates
  // Hand-drawn beautiful SVG line chart for Year 1, Year 2, and Year 3 cumulative cash flow
  const chartPoints = useMemo(() => {
    const startX = 50;
    const endX = 450;
    const startY = 160; // Starting negative cash flow (minus initial investment)
    const endY = 40;  // High cumulative gain

    // Normalize coordinates over 3 years
    // Month 0: -Investment
    // Month 12: -Investment + Y1Profit
    // Month 24: -Investment + Y1Profit + Y2Profit
    // Month 36: -Investment + Y1Profit + Y2Profit + Y3Profit
    const m0Val = -investment;
    const m12Val = -investment + calculations.y1Profit;
    const m24Val = m12Val + calculations.y2Profit;
    const m36Val = m24Val + calculations.y3Profit;

    const minVal = m0Val;
    const maxVal = Math.max(m36Val, 5); // Ensure scale has some headroom
    const range = maxVal - minVal;

    const getCoordinateY = (val: number) => {
      const pct = (val - minVal) / range;
      return 180 - pct * 140; // map between 40 and 180
    };

    const p0 = { x: 50, y: getCoordinateY(m0Val), val: m0Val };
    const p1 = { x: 180, y: getCoordinateY(m12Val), val: m12Val };
    const p2 = { x: 310, y: getCoordinateY(m24Val), val: m24Val };
    const p3 = { x: 440, y: getCoordinateY(m36Val), val: m36Val };

    const breakEvenY = getCoordinateY(0);

    return { p0, p1, p2, p3, breakEvenY };
  }, [investment, calculations]);

  return (
    <div id="roi_calculator_card" className="bg-white rounded-3xl border border-slate-200 shadow-sm text-left font-sans transition-all duration-300 w-full aspect-auto sm:aspect-[16/9] flex flex-col p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 lg:mb-12">
      {/* Top Header Panel */}
      <div className="flex-none flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Calculator size={24} className="stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-[#0F172A] uppercase tracking-tight">ROI Calculator</h3>
            <span className="text-xs font-medium text-slate-500">Homepage Estimator</span>
          </div>
        </div>

        <button 
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 text-xs font-black text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all uppercase tracking-wider"
        >
          <RefreshCw size={14} className="stroke-[2.5]" />
          Reset
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 lg:gap-10 min-h-0">
        
        {/* Left Column: Inputs */}
        <div className="flex-1 space-y-6 flex flex-col justify-center">
          
          {/* Slider 1 */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-600">Initial Investment</span>
              <div className="flex items-center gap-2">
                <input 
                  type="number"
                  value={Math.round(investment)}
                  onChange={(e) => setInvestment(Math.max(1, Number(e.target.value)))}
                  className="w-16 text-right text-sm font-black text-blue-600 bg-slate-50 border border-slate-200 rounded-lg p-1"
                />
                <span className="text-sm font-bold text-slate-400">Lakhs</span>
              </div>
            </div>
            <input 
              type="range" 
              min="1" max="200" step="1"
              value={investment} 
              onChange={(e) => setInvestment(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Slider 2 */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-600">Monthly Revenue</span>
              <div className="flex items-center gap-2">
                <input 
                  type="number"
                  value={revenue}
                  onChange={(e) => setRevenue(Math.max(0.1, Number(e.target.value)))}
                  className="w-16 text-right text-sm font-black text-emerald-600 bg-slate-50 border border-slate-200 rounded-lg p-1"
                />
                <span className="text-sm font-bold text-slate-400">Lakhs</span>
              </div>
            </div>
            <input 
              type="range" 
              min="0.5" max="30" step="0.1"
              value={revenue} 
              onChange={(e) => setRevenue(Number(e.target.value))}
              className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="lg:w-2/5 grid grid-cols-1 gap-4 lg:gap-3">
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex flex-col justify-center lg:col-span-1">
            <span className="text-xs font-black uppercase text-blue-700 tracking-wider mb-1">Est. Profit</span>
            <div className="text-2xl font-black text-emerald-600 tracking-tight">
              ₹{calculations.monthlyProfitRupees.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider mb-1">Break-even</span>
            <div className="text-lg font-black text-blue-600">
              {calculations.breakEvenMonths > 0 ? `${calculations.breakEvenMonths.toFixed(1)} Mo` : 'N/A'}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider mb-1">ROI</span>
            <div className="text-lg font-black text-blue-600">
              {calculations.annualROI.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
