import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, TrendingUp, DollarSign, Calendar, ShieldCheck, 
  ArrowRight, Download, PhoneCall, RefreshCw, Layers, CheckCircle2, 
  HelpCircle, Sparkles, Building2, PieChart as PieChartIcon, BarChart2,
  FileText, Check, AlertCircle, Clock
} from 'lucide-react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';
import { mockBrands } from '../data/mockDb';
import { SeekerPageBanner } from '../components/seeker/SeekerPageBanner';
import { seekerTheme } from '../theme/seekerTheme';
import { useAuth } from '../context/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface SavedCalculation {
  id: string;
  name: string;
  timestamp: string;
  brandId: string;
  brandName: string;
  inputs: {
    franchiseInvestment: number;
    franchiseFee: number;
    setupCost: number;
    interiorCost: number;
    equipmentCost: number;
    technologyCost: number;
    securityDeposit: number;
    workingCapital: number;
    otherInitialExpenses: number;
    avgCustomerValue: number;
    estimatedMonthlyOrders: number;
    rent: number;
    employeeSalaries: number;
    electricityUtilities: number;
    marketingCost: number;
    royaltyPct: number;
    maintenanceCost: number;
    otherExpenses: number;
  };
}

export default function AdvancedROICalculator() {
  const { user } = useAuth();

  // ==========================================
  // 1. BRAND / FRANCHISE SELECTION
  // ==========================================
  const [selectedBrandId, setSelectedBrandId] = useState<string>('custom');
  const [customBrandName, setCustomBrandName] = useState<string>('My Custom Franchise');
  const [franchiseInvestment, setFranchiseInvestment] = useState<number>(30); // Lakhs
  const [franchiseFee, setFranchiseFee] = useState<number>(5); // Lakhs

  // ==========================================
  // 2. INITIAL INVESTMENT (CAPEX BREAKDOWN) (in ₹ Lakhs)
  // ==========================================
  const [setupCost, setSetupCost] = useState<number>(6);
  const [interiorCost, setInteriorCost] = useState<number>(8);
  const [equipmentCost, setEquipmentCost] = useState<number>(5);
  const [technologyCost, setTechnologyCost] = useState<number>(2);
  const [securityDeposit, setSecurityDeposit] = useState<number>(4);
  const [workingCapital, setWorkingCapital] = useState<number>(3);
  const [otherInitialExpenses, setOtherInitialExpenses] = useState<number>(2);

  // ==========================================
  // 3. REVENUE MODEL STATE
  // ==========================================
  const [avgCustomerValue, setAvgCustomerValue] = useState<number>(350); // ₹
  const [estimatedMonthlyOrders, setEstimatedMonthlyOrders] = useState<number>(2400); // Quantity

  // ==========================================
  // 4. MONTHLY OPEX BREAKDOWN (in ₹ Rupees)
  // ==========================================
  const [rent, setRent] = useState<number>(65000);
  const [employeeSalaries, setEmployeeSalaries] = useState<number>(95000);
  const [electricityUtilities, setElectricityUtilities] = useState<number>(35000);
  const [marketingCost, setMarketingCost] = useState<number>(25000);
  const [royaltyPct, setRoyaltyPct] = useState<number>(4); // % of revenue
  const [maintenanceCost, setMaintenanceCost] = useState<number>(15000);
  const [otherExpenses, setOtherExpenses] = useState<number>(20000);

  // ==========================================
  // 5. EXPORT & PORTFOLIO PERSISTENCE STATE
  // ==========================================
  const [saveScenarioName, setSaveScenarioName] = useState<string>('');
  const [loadedCalculationId, setLoadedCalculationId] = useState<string>('');
  const [statusMsg, setStatusMsg] = useState<string>('');
  const [statusType, setStatusType] = useState<'success' | 'info' | 'error' | ''>('');
  const [exportStatus, setExportStatus] = useState<'idle' | 'generating_pdf' | 'generating_excel' | 'pdf_success' | 'excel_success' | 'error'>('idle');
  const [exportError, setExportError] = useState<string>('');

  const savedCalculationsKey = useMemo(() => `brizx_saved_roi_calcs_${user?.id || 'guest'}`, [user?.id]);

  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);

  // Load calculations from localstorage securely on mount & user change
  useEffect(() => {
    const data = localStorage.getItem(savedCalculationsKey);
    if (data) {
      try {
        setSavedCalculations(JSON.parse(data));
      } catch (e) {
        console.error("Failed to parse saved calculations", e);
      }
    } else {
      setSavedCalculations([]);
    }
  }, [savedCalculationsKey]);

  // Status message utility
  const showStatusMessage = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setStatusMsg(msg);
    setStatusType(type);
    setTimeout(() => {
      setStatusMsg('');
      setStatusType('');
    }, 3500);
  };

  // Safe number input sanitizer
  const safeNumber = (val: string, fallback = 0): number => {
    const num = parseFloat(val);
    if (isNaN(num) || num < 0) return fallback;
    return num;
  };

  // Derived Target Monthly Revenue
  const monthlyRevenueLakhs = useMemo(() => {
    return Math.round(((avgCustomerValue * estimatedMonthlyOrders) / 100000) * 100) / 100;
  }, [avgCustomerValue, estimatedMonthlyOrders]);

  // Adjust orders dynamically when the slider directly overrides Expected Revenue
  const handleRevenueSliderChange = (newLakhs: number) => {
    if (avgCustomerValue > 0) {
      const computedOrders = Math.round((newLakhs * 100000) / avgCustomerValue);
      setEstimatedMonthlyOrders(computedOrders);
    }
  };

  const totalCapexLakhs = useMemo(() => {
    return (
      franchiseFee +
      setupCost +
      interiorCost +
      equipmentCost +
      technologyCost +
      securityDeposit +
      workingCapital +
      otherInitialExpenses
    );
  }, [
    franchiseFee, setupCost, interiorCost, equipmentCost, 
    technologyCost, securityDeposit, workingCapital, otherInitialExpenses
  ]);

  // Check budget variance
  const budgetVariance = useMemo(() => {
    return franchiseInvestment - totalCapexLakhs;
  }, [franchiseInvestment, totalCapexLakhs]);

  // Handle Brand Preset Selection
  const handleBrandChange = (brandId: string) => {
    setSelectedBrandId(brandId);
    setLoadedCalculationId('');
    setSaveScenarioName('');

    if (brandId === 'custom') {
      setCustomBrandName('My Custom Franchise');
      setFranchiseInvestment(30);
      setFranchiseFee(5);
      setSetupCost(6);
      setInteriorCost(8);
      setEquipmentCost(5);
      setTechnologyCost(2);
      setSecurityDeposit(4);
      setWorkingCapital(3);
      setOtherInitialExpenses(2);
      setAvgCustomerValue(350);
      setEstimatedMonthlyOrders(2400);
      setRent(65000);
      setEmployeeSalaries(95000);
      setElectricityUtilities(35000);
      setMarketingCost(25000);
      setRoyaltyPct(4);
      setMaintenanceCost(15000);
      setOtherExpenses(20000);
    } else {
      const brand = mockBrands.find((b) => b.id === brandId);
      if (brand) {
        const minInv = brand.investmentRequired?.min || 20;
        const maxInv = brand.investmentRequired?.max || 40;
        const avgInv = Math.round((minInv + maxInv) / 2);
        
        setCustomBrandName(brand.brandName);
        setFranchiseInvestment(avgInv);
        setFranchiseFee(brand.franchiseFee || 5);

        // Populate realistic sub-components
        const remainingCapex = Math.max(5, avgInv - (brand.franchiseFee || 5));
        setSetupCost(Math.round(remainingCapex * 0.25 * 10) / 10);
        setInteriorCost(Math.round(remainingCapex * 0.35 * 10) / 10);
        setEquipmentCost(Math.round(remainingCapex * 0.20 * 10) / 10);
        setTechnologyCost(Math.round(remainingCapex * 0.05 * 10) / 10);
        setSecurityDeposit(Math.round(remainingCapex * 0.08 * 10) / 10);
        setWorkingCapital(Math.round(remainingCapex * 0.05 * 10) / 10);
        setOtherInitialExpenses(Math.round(remainingCapex * 0.02 * 10) / 10);

        // Set realistic operating parameters based on industry & investment scale
        setAvgCustomerValue(350);
        const targetRev = Math.round(avgInv * 0.28 * 10) / 10;
        setEstimatedMonthlyOrders(Math.round((targetRev * 100000) / 350));

        setRent(Math.round(avgInv * 1500 + 15000));
        setEmployeeSalaries(Math.round(avgInv * 2200 + 20000));
        setElectricityUtilities(Math.round(avgInv * 800 + 10000));
        setMarketingCost(Math.round(avgInv * 600 + 5000));
        setMaintenanceCost(Math.round(avgInv * 400 + 5000));
        setOtherExpenses(Math.round(avgInv * 500 + 5000));

        setRoyaltyPct(brand.royaltyFee?.includes('%') ? parseFloat(brand.royaltyFee) || 4 : 4);
      }
    }
  };

  const selectedBrand = useMemo(() => {
    return mockBrands.find(b => b.id === selectedBrandId);
  }, [selectedBrandId]);

  const hasVerifiedData = useMemo(() => {
    if (selectedBrandId === 'custom') return false;
    return !!selectedBrand && selectedBrand.franchiseFee !== undefined && selectedBrand.investmentRequired !== undefined;
  }, [selectedBrandId, selectedBrand]);

  // ==========================================
  // PROFIT, BREAKEVEN & ROI ENGINE CALCULATIONS
  // ==========================================
  const royaltyExpenseRupees = useMemo(() => {
    return Math.round((monthlyRevenueLakhs * 100000 * royaltyPct) / 100);
  }, [monthlyRevenueLakhs, royaltyPct]);

  // Total Monthly Expenses in ₹ Rupees
  const totalMonthlyExpensesRupees = useMemo(() => {
    return rent + employeeSalaries + electricityUtilities + marketingCost + royaltyExpenseRupees + maintenanceCost + otherExpenses;
  }, [rent, employeeSalaries, electricityUtilities, marketingCost, royaltyExpenseRupees, maintenanceCost, otherExpenses]);

  const totalMonthlyExpensesLakhs = totalMonthlyExpensesRupees / 100000;

  // Gross and Net Profit Analysis
  const grossMonthlyRevenueRupees = monthlyRevenueLakhs * 100000;
  const monthlyNetProfitRupees = grossMonthlyRevenueRupees - totalMonthlyExpensesRupees;
  const monthlyNetProfitLakhs = monthlyNetProfitRupees / 100000;

  const isLossMaking = monthlyNetProfitRupees <= 0;

  const annualRevenueLakhs = monthlyRevenueLakhs * 12;
  const annualNetProfitLakhs = monthlyNetProfitLakhs * 12;

  const netProfitMarginPct = grossMonthlyRevenueRupees > 0 ? (monthlyNetProfitRupees / grossMonthlyRevenueRupees) * 100 : 0;
  const annualRoiPct = totalCapexLakhs > 0 ? (annualNetProfitLakhs / totalCapexLakhs) * 100 : 0;
  const paybackPeriodMonths = monthlyNetProfitLakhs > 0 ? (totalCapexLakhs / monthlyNetProfitLakhs) : 0;

  // Break-even Analysis with standard COGS margin assumption
  const cogsPct = 35; // standard franchise raw food/material cost percentage
  const contributionMarginPct = Math.max(5, 100 - cogsPct - royaltyPct);
  const fixedMonthlyOverhead = rent + employeeSalaries + electricityUtilities + marketingCost + maintenanceCost + otherExpenses;
  const breakevenMonthlyRevenueRupees = contributionMarginPct > 0 ? (fixedMonthlyOverhead / (contributionMarginPct / 100)) : 0;
  const breakevenMonthlyRevenueLakhs = breakevenMonthlyRevenueRupees / 100000;

  // ==========================================
  // SCENARIO ANALYSIS (Conservative vs Expected vs Optimistic)
  // ==========================================
  const scenarios = useMemo(() => {
    const fixedOpexExpected = rent + employeeSalaries + electricityUtilities + marketingCost + maintenanceCost + otherExpenses;
    
    // Conservative: 70% Revenue, 110% Fixed Expenses
    const consRevLakhs = monthlyRevenueLakhs * 0.70;
    const consFixedRupees = fixedOpexExpected * 1.10;
    const consRoyaltyRupees = (consRevLakhs * 100000 * royaltyPct) / 100;
    const consExpensesRupees = consFixedRupees + consRoyaltyRupees;
    const consExpensesLakhs = consExpensesRupees / 100000;
    const consNetRupees = (consRevLakhs * 100000) - consExpensesRupees;
    const consNetLakhs = consNetRupees / 100000;
    const consAnnualNet = consNetLakhs * 12;
    const consRoi = totalCapexLakhs > 0 ? (consAnnualNet / totalCapexLakhs) * 100 : 0;
    const consPayback = consNetLakhs > 0 ? (totalCapexLakhs / consNetLakhs) : 0;

    // Expected: 100% Revenue, 100% Expenses
    const expRevLakhs = monthlyRevenueLakhs;
    const expExpensesLakhs = totalMonthlyExpensesRupees / 100000;
    const expNetLakhs = monthlyNetProfitLakhs;
    const expAnnualNet = annualNetProfitLakhs;
    const expRoi = annualRoiPct;
    const expPayback = paybackPeriodMonths;

    // Optimistic: 130% Revenue, 90% Fixed Expenses
    const optRevLakhs = monthlyRevenueLakhs * 1.30;
    const optFixedRupees = fixedOpexExpected * 0.90;
    const optRoyaltyRupees = (optRevLakhs * 100000 * royaltyPct) / 100;
    const optExpensesRupees = optFixedRupees + optRoyaltyRupees;
    const optExpensesLakhs = optExpensesRupees / 100000;
    const optNetRupees = (optRevLakhs * 100000) - optExpensesRupees;
    const optNetLakhs = optNetRupees / 100000;
    const optAnnualNet = optNetLakhs * 12;
    const optRoi = totalCapexLakhs > 0 ? (optAnnualNet / totalCapexLakhs) * 100 : 0;
    const optPayback = optNetLakhs > 0 ? (totalCapexLakhs / optNetLakhs) : 0;

    return {
      CONSERVATIVE: {
        label: 'Conservative Scenario',
        subtitle: '70% Footfall & 10% Higher Expenses',
        revenueLakhs: consRevLakhs,
        expensesLakhs: consExpensesLakhs,
        netProfitLakhs: consNetLakhs,
        annualNetProfitLakhs: consAnnualNet,
        netMarginPct: consRevLakhs > 0 ? (consNetLakhs / consRevLakhs) * 100 : 0,
        roiPct: consRoi,
        paybackMonths: consPayback,
        color: '#E11D48',
        badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      },
      EXPECTED: {
        label: 'Expected Scenario',
        subtitle: 'Target Baseline Operational Model',
        revenueLakhs: expRevLakhs,
        expensesLakhs: expExpensesLakhs,
        netProfitLakhs: expNetLakhs,
        annualNetProfitLakhs: expAnnualNet,
        netMarginPct: netProfitMarginPct,
        roiPct: expRoi,
        paybackMonths: expPayback,
        color: '#2563EB',
        badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      },
      OPTIMISTIC: {
        label: 'Optimistic Scenario',
        subtitle: '130% Peak Sales & 10% Lower Fixed Expenses',
        revenueLakhs: optRevLakhs,
        expensesLakhs: optExpensesLakhs,
        netProfitLakhs: optNetLakhs,
        annualNetProfitLakhs: optAnnualNet,
        netMarginPct: optRevLakhs > 0 ? (optNetLakhs / optRevLakhs) * 100 : 0,
        roiPct: optRoi,
        paybackMonths: optPayback,
        color: '#059669',
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      },
    };
  }, [
    monthlyRevenueLakhs, rent, employeeSalaries, electricityUtilities, marketingCost, maintenanceCost, otherExpenses,
    royaltyPct, totalMonthlyExpensesRupees, monthlyNetProfitLakhs, annualNetProfitLakhs, annualRoiPct, paybackPeriodMonths,
    netProfitMarginPct, totalCapexLakhs
  ]);

  // ==========================================
  // CHART DATASETS (100% Real Calculated Values)
  // ==========================================
  const capexPieData = [
    { name: 'Franchise Fee', value: franchiseFee, color: '#2563EB' },
    { name: 'Setup & Const.', value: setupCost, color: '#3B82F6' },
    { name: 'Interior Fit-out', value: interiorCost, color: '#60A5FA' },
    { name: 'Equipment', value: equipmentCost, color: '#93C5FD' },
    { name: 'Technology/POS', value: technologyCost, color: '#38BDF8' },
    { name: 'Security Deposit', value: securityDeposit, color: '#F59E0B' },
    { name: 'Working Capital', value: workingCapital, color: '#10B981' },
    { name: 'Other Capex', value: otherInitialExpenses, color: '#64748B' },
  ].filter((item) => item.value > 0);

  const scenarioBarData = [
    {
      name: 'Conservative',
      Revenue: parseFloat(scenarios.CONSERVATIVE.revenueLakhs.toFixed(2)),
      Expenses: parseFloat(scenarios.CONSERVATIVE.expensesLakhs.toFixed(2)),
      'Net Profit': parseFloat(scenarios.CONSERVATIVE.netProfitLakhs.toFixed(2)),
    },
    {
      name: 'Expected',
      Revenue: parseFloat(scenarios.EXPECTED.revenueLakhs.toFixed(2)),
      Expenses: parseFloat(scenarios.EXPECTED.expensesLakhs.toFixed(2)),
      'Net Profit': parseFloat(scenarios.EXPECTED.netProfitLakhs.toFixed(2)),
    },
    {
      name: 'Optimistic',
      Revenue: parseFloat(scenarios.OPTIMISTIC.revenueLakhs.toFixed(2)),
      Expenses: parseFloat(scenarios.OPTIMISTIC.expensesLakhs.toFixed(2)),
      'Net Profit': parseFloat(scenarios.OPTIMISTIC.netProfitLakhs.toFixed(2)),
    },
  ];

  // 36-Month Cumulative Cash Flow Trajectory
  const trajectoryData = useMemo(() => {
    const data = [];
    const monthlyNet = monthlyNetProfitLakhs;
    const capex = totalCapexLakhs;

    for (let m = 0; m <= 36; m += 3) {
      const cumulativeEarnings = m * monthlyNet;
      const netCashPosition = cumulativeEarnings - capex;
      data.push({
        Month: `M${m}`,
        'Net Cashflow (₹L)': parseFloat(netCashPosition.toFixed(2)),
        'Initial Capex': parseFloat((-capex).toFixed(2)),
      });
    }
    return data;
  }, [monthlyNetProfitLakhs, totalCapexLakhs]);

  // ==========================================
  // PORTFOLIO ACTIONS (Save, Load, Reset)
  // ==========================================
  const handleSaveCalculation = () => {
    const nameToUse = saveScenarioName.trim() || `${customBrandName} Scenario`;
    const payload: SavedCalculation = {
      id: loadedCalculationId || Math.random().toString(36).substring(2, 9),
      name: nameToUse,
      timestamp: new Date().toISOString(),
      brandId: selectedBrandId,
      brandName: customBrandName,
      inputs: {
        franchiseInvestment,
        franchiseFee,
        setupCost,
        interiorCost,
        equipmentCost,
        technologyCost,
        securityDeposit,
        workingCapital,
        otherInitialExpenses,
        avgCustomerValue,
        estimatedMonthlyOrders,
        rent,
        employeeSalaries,
        electricityUtilities,
        marketingCost,
        royaltyPct,
        maintenanceCost,
        otherExpenses
      }
    };

    const isExisting = savedCalculations.some(c => c.id === payload.id);
    let updated: SavedCalculation[];
    if (isExisting) {
      updated = savedCalculations.map(c => c.id === payload.id ? payload : c);
    } else {
      updated = [payload, ...savedCalculations];
    }

    setSavedCalculations(updated);
    localStorage.setItem(savedCalculationsKey, JSON.stringify(updated));
    setLoadedCalculationId(payload.id);
    setSaveScenarioName(payload.name);
    showStatusMessage('Scenario saved successfully!', 'success');
  };

  const handleLoadCalculation = (id: string) => {
    const calc = savedCalculations.find(c => c.id === id);
    if (calc) {
      setLoadedCalculationId(calc.id);
      setSaveScenarioName(calc.name);
      setSelectedBrandId(calc.brandId);
      setCustomBrandName(calc.brandName);
      setFranchiseInvestment(calc.inputs.franchiseInvestment);
      setFranchiseFee(calc.inputs.franchiseFee);
      setSetupCost(calc.inputs.setupCost);
      setInteriorCost(calc.inputs.interiorCost);
      setEquipmentCost(calc.inputs.equipmentCost);
      setTechnologyCost(calc.inputs.technologyCost);
      setSecurityDeposit(calc.inputs.securityDeposit);
      setWorkingCapital(calc.inputs.workingCapital);
      setOtherInitialExpenses(calc.inputs.otherInitialExpenses);
      setAvgCustomerValue(calc.inputs.avgCustomerValue || 350);
      setEstimatedMonthlyOrders(calc.inputs.estimatedMonthlyOrders || 2400);
      setRent(calc.inputs.rent);
      setEmployeeSalaries(calc.inputs.employeeSalaries);
      setElectricityUtilities(calc.inputs.electricityUtilities);
      setMarketingCost(calc.inputs.marketingCost);
      setRoyaltyPct(calc.inputs.royaltyPct);
      setMaintenanceCost(calc.inputs.maintenanceCost);
      setOtherExpenses(calc.inputs.otherExpenses);

      showStatusMessage('Scenario loaded!', 'success');
    }
  };

  const handleDeleteCalculation = () => {
    if (!loadedCalculationId) return;
    const updated = savedCalculations.filter(c => c.id !== loadedCalculationId);
    setSavedCalculations(updated);
    localStorage.setItem(savedCalculationsKey, JSON.stringify(updated));
    setLoadedCalculationId('');
    setSaveScenarioName('');
    showStatusMessage('Scenario deleted!', 'info');
  };

  // ==========================================
  // EXPORT GENERATION SERVICES (PDF & Excel)
  // ==========================================
  const handleExportPDF = async () => {
    try {
      setExportStatus('generating_pdf');
      
      // Artificial delay for UX visibility
      await new Promise(resolve => setTimeout(resolve, 850));

      const doc = new jsPDF();
      
      const primaryColor: [number, number, number] = [37, 99, 235]; // Blue 600
      const subTextColor: [number, number, number] = [71, 85, 105]; // Slate 600
      
      // ==========================================
      // PAGE 1: EXECUTIVE SUMMARY & INITIAL CAPEX
      // ==========================================
      
      // Branding Header Banner
      doc.setFillColor(30, 41, 59); // Dark slate
      doc.rect(0, 0, 210, 38, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text("BRIZX INDIA", 14, 16);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(191, 219, 254);
      doc.text("INDIA'S PREMIUM FRANCHISE MATCHING & DUE DILIGENCE PLATFORM", 14, 22);
      doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 14, 28);
      
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text("Advanced Franchise Financial Feasibility Report", 14, 48);
      
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(14, 52, 196, 52);
      
      // Metadata Details Grid
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text("INVESTOR / SEEKER:", 14, 60);
      doc.setFont('helvetica', 'normal');
      doc.text(user?.name || "Verified BrizX Seeker", 55, 60);
      
      doc.setFont('helvetica', 'bold');
      doc.text("FRANCHISE MODEL:", 14, 66);
      doc.setFont('helvetica', 'normal');
      doc.text(customBrandName, 55, 66);
      
      doc.setFont('helvetica', 'bold');
      doc.text("DATA SOURCE STATUS:", 14, 72);
      doc.setFont('helvetica', 'normal');
      doc.text(selectedBrandId === 'custom' ? "Custom Franchise Assumptions" : "Verified Brand Unit Economics", 55, 72);
      
      doc.setFont('helvetica', 'bold');
      doc.text("TARGET BUDGET:", 14, 78);
      doc.setFont('helvetica', 'normal');
      doc.text(`INR ${franchiseInvestment} Lakhs`, 55, 78);

      // Unit Economics metrics
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(37, 99, 235);
      doc.text("1. Yield Prediction Summary", 14, 90);
      
      const metricsBody = [
        ["Total Initial Investment", `INR ${totalCapexLakhs.toFixed(2)} Lakhs`, "Expected Monthly Revenue", `INR ${monthlyRevenueLakhs.toFixed(2)} Lakhs`],
        ["Monthly Operating Expenses", `INR ${(totalMonthlyExpensesRupees / 100000).toFixed(2)} Lakhs`, "Monthly Net Profit", `INR ${monthlyNetProfitLakhs.toFixed(2)} Lakhs`],
        ["Annualized ROI (%)", `${annualRoiPct.toFixed(1)}%`, "Operating Margin (%)", `${netProfitMarginPct.toFixed(1)}%`],
        ["Capex Payback Horizon", isLossMaking ? "Not achievable" : `${paybackPeriodMonths.toFixed(1)} Months`, "Breakeven Sales Level", `INR ${breakevenMonthlyRevenueLakhs.toFixed(2)} Lakhs`]
      ];
      
      autoTable(doc, {
        startY: 94,
        body: metricsBody,
        theme: 'plain',
        styles: { fontSize: 8.5, cellPadding: 3.5, font: 'helvetica' },
        columnStyles: {
          0: { fontStyle: 'bold', textColor: subTextColor, cellWidth: 45 },
          1: { fontStyle: 'bold', textColor: primaryColor, cellWidth: 45 },
          2: { fontStyle: 'bold', textColor: subTextColor, cellWidth: 45 },
          3: { fontStyle: 'bold', textColor: [5, 150, 105], cellWidth: 45 }
        }
      });
      
      // Initial Capex Breakdown
      const currentY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(37, 99, 235);
      doc.text("2. Startup Capital Expenditures (Capex breakdown)", 14, currentY);
      
      const capexTableBody = [
        ["One-time Franchise Fee", `INR ${franchiseFee.toFixed(2)} L`, `${((franchiseFee / totalCapexLakhs) * 100).toFixed(1)}%`],
        ["Setup & Construction Cost", `INR ${setupCost.toFixed(2)} L`, `${((setupCost / totalCapexLakhs) * 100).toFixed(1)}%`],
        ["Interior & Fit-out Cost", `INR ${interiorCost.toFixed(2)} L`, `${((interiorCost / totalCapexLakhs) * 100).toFixed(1)}%`],
        ["Kitchen & Machinery Equipment", `INR ${equipmentCost.toFixed(2)} L`, `${((equipmentCost / totalCapexLakhs) * 100).toFixed(1)}%`],
        ["Technology, POS & Signage", `INR ${technologyCost.toFixed(2)} L`, `${((technologyCost / totalCapexLakhs) * 100).toFixed(1)}%`],
        ["Landlord Security Deposit", `INR ${securityDeposit.toFixed(2)} L`, `${((securityDeposit / totalCapexLakhs) * 100).toFixed(1)}%`],
        ["Initial Working Capital Reserve", `INR ${workingCapital.toFixed(2)} L`, `${((workingCapital / totalCapexLakhs) * 100).toFixed(1)}%`],
        ["Other Initial Expenses & Licenses", `INR ${otherInitialExpenses.toFixed(2)} L`, `${((otherInitialExpenses / totalCapexLakhs) * 100).toFixed(1)}%`],
        ["TOTAL ACQUISITION BUDGET", `INR ${totalCapexLakhs.toFixed(2)} L`, "100.0%"]
      ];
      
      autoTable(doc, {
        startY: currentY + 4,
        head: [["Startup Capex Item", "Allocated (INR Lakhs)", "% Distribution"]],
        body: capexTableBody,
        theme: 'striped',
        styles: { fontSize: 8, cellPadding: 2.8, font: 'helvetica' },
        headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: 'bold' },
        columnStyles: {
          0: { cellWidth: 95 },
          1: { halign: 'right', fontStyle: 'bold', cellWidth: 45 },
          2: { halign: 'right', cellWidth: 40 }
        }
      });

      // DRAW CHART 1: CAPEX Allocation Distribution Map
      const capexChartY = (doc as any).lastAutoTable.finalY + 6;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      doc.text("CAPEX Allocation Distribution Map", 14, capexChartY);

      const totalCap = totalCapexLakhs || 1;
      const parts = [
        { name: 'Franchise Fee', val: franchiseFee, col: [37, 99, 235] },
        { name: 'Setup & Const.', val: setupCost, col: [59, 130, 246] },
        { name: 'Interior Fit-out', val: interiorCost, col: [96, 165, 250] },
        { name: 'Equipment', val: equipmentCost, col: [147, 197, 253] },
        { name: 'Technology/POS', val: technologyCost, col: [56, 189, 248] },
        { name: 'Security Deposit', val: securityDeposit, col: [245, 158, 11] },
        { name: 'Working Capital', val: workingCapital, col: [16, 185, 129] },
        { name: 'Other Capex', val: otherInitialExpenses, col: [100, 116, 139] },
      ].filter(p => p.val > 0);

      let currentBarX = 14;
      const totalBarW = 182; // 196 - 14
      parts.forEach(p => {
        const partW = (p.val / totalCap) * totalBarW;
        doc.setFillColor(p.col[0], p.col[1], p.col[2]);
        doc.rect(currentBarX, capexChartY + 3, partW, 6, 'F');
        currentBarX += partW;
      });

      // Legend underneath Bar
      const legendStartY = capexChartY + 13;
      parts.forEach((p, idx) => {
        const row = Math.floor(idx / 4);
        const col = idx % 4;
        const legX = 14 + col * 46;
        const legY = legendStartY + row * 6;
        
        doc.setFillColor(p.col[0], p.col[1], p.col[2]);
        doc.rect(legX, legY, 3, 3, 'F');
        
        doc.setTextColor(71, 85, 105);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.text(`${p.name} (${((p.val / totalCap) * 100).toFixed(0)}%)`, legX + 5, legY + 2.5);
      });

      // ==========================================
      // PAGE 2: OPERATIONAL SCENARIOS & CHARTS
      // ==========================================
      doc.addPage();
      
      doc.setFillColor(30, 41, 59);
      doc.rect(0, 0, 210, 15, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text("BRIZX INDIA | OPERATIONAL SCENARIO MODELING", 14, 10);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(37, 99, 235);
      doc.text("3. Market Sensitivity & Operational Scenario Modeling", 14, 25);
      
      const scenarioTableBody = [
        ["Monthly Sales Revenue", `INR ${scenarios.CONSERVATIVE.revenueLakhs.toFixed(2)} L`, `INR ${scenarios.EXPECTED.revenueLakhs.toFixed(2)} L`, `INR ${scenarios.OPTIMISTIC.revenueLakhs.toFixed(2)} L`],
        ["Monthly Operating Expenses", `INR ${scenarios.CONSERVATIVE.expensesLakhs.toFixed(2)} L`, `INR ${scenarios.EXPECTED.expensesLakhs.toFixed(2)} L`, `INR ${scenarios.OPTIMISTIC.expensesLakhs.toFixed(2)} L`],
        ["Monthly Net Profit", `INR ${scenarios.CONSERVATIVE.netProfitLakhs.toFixed(2)} L`, `INR ${scenarios.EXPECTED.netProfitLakhs.toFixed(2)} L`, `INR ${scenarios.OPTIMISTIC.netProfitLakhs.toFixed(2)} L`],
        ["Projected Annual Profit", `INR ${scenarios.CONSERVATIVE.annualNetProfitLakhs.toFixed(2)} L`, `INR ${scenarios.EXPECTED.annualNetProfitLakhs.toFixed(2)} L`, `INR ${scenarios.OPTIMISTIC.annualNetProfitLakhs.toFixed(2)} L`],
        ["Net Margin (%)", `${scenarios.CONSERVATIVE.netMarginPct.toFixed(1)}%`, `${scenarios.EXPECTED.netMarginPct.toFixed(1)}%`, `${scenarios.OPTIMISTIC.netMarginPct.toFixed(1)}%`],
        ["Annualized ROI (%)", `${scenarios.CONSERVATIVE.roiPct.toFixed(1)}%`, `${scenarios.EXPECTED.roiPct.toFixed(1)}%`, `${scenarios.OPTIMISTIC.roiPct.toFixed(1)}%`],
        ["Payback Horizon (Months)", scenarios.CONSERVATIVE.paybackMonths > 0 ? `${scenarios.CONSERVATIVE.paybackMonths.toFixed(1)} Mos` : "Not Achievable", `${scenarios.EXPECTED.paybackMonths.toFixed(1)} Mos`, `${scenarios.OPTIMISTIC.paybackMonths.toFixed(1)} Mos`]
      ];
      
      autoTable(doc, {
        startY: 29,
        head: [["KPI Dimension", "Conservative (Low)", "Expected (Target Baseline)", "Optimistic (Peak)"]],
        body: scenarioTableBody,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 3.5, font: 'helvetica' },
        headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255], fontStyle: 'bold' },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 55 },
          1: { halign: 'right', textColor: [225, 29, 72], cellWidth: 44 },
          2: { halign: 'right', textColor: [37, 99, 235], fontStyle: 'bold', cellWidth: 44 },
          3: { halign: 'right', textColor: [5, 150, 105], cellWidth: 44 }
        }
      });

      // DRAW CHART 2: SCENARIO YIELD COMPARISON BAR CHART
      const scenarioChartY = (doc as any).lastAutoTable.finalY + 12;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);
      doc.text("Scenario Yield Comparison (Monthly Lakhs)", 14, scenarioChartY);

      // Chart area
      const c2StartX = 30;
      const c2Width = 150;
      const c2BottomY = scenarioChartY + 54;
      const c2Height = 44;
      const c2TopY = c2BottomY - c2Height;

      // Find Max scenario parameter value for scaling
      const maxVal = Math.max(
        scenarios.OPTIMISTIC.revenueLakhs,
        scenarios.OPTIMISTIC.expensesLakhs,
        Math.max(0, scenarios.OPTIMISTIC.netProfitLakhs)
      ) || 10;

      // Draw horizontal grid lines
      doc.setDrawColor(241, 245, 249);
      doc.setLineWidth(0.2);
      for (let i = 0; i <= 4; i++) {
        const gridY = c2BottomY - (i / 4) * c2Height;
        doc.line(c2StartX, gridY, c2StartX + c2Width, gridY);
        
        // Print grid value labels
        const gridVal = (i / 4) * maxVal;
        doc.setTextColor(148, 163, 184);
        doc.setFontSize(7);
        doc.text(`${gridVal.toFixed(1)} L`, c2StartX - 9, gridY + 1.5);
      }

      // Draw axis borders
      doc.setDrawColor(148, 163, 184);
      doc.setLineWidth(0.4);
      doc.line(c2StartX, c2BottomY, c2StartX + c2Width, c2BottomY); // X-axis
      doc.line(c2StartX, c2TopY, c2StartX, c2BottomY); // Y-axis

      // Draw clusters
      const groupData = [
        {
          name: 'Conservative',
          centerX: c2StartX + 25,
          rev: scenarios.CONSERVATIVE.revenueLakhs,
          exp: scenarios.CONSERVATIVE.expensesLakhs,
          net: scenarios.CONSERVATIVE.netProfitLakhs,
        },
        {
          name: 'Expected',
          centerX: c2StartX + 75,
          rev: scenarios.EXPECTED.revenueLakhs,
          exp: scenarios.EXPECTED.expensesLakhs,
          net: scenarios.EXPECTED.netProfitLakhs,
        },
        {
          name: 'Optimistic',
          centerX: c2StartX + 125,
          rev: scenarios.OPTIMISTIC.revenueLakhs,
          exp: scenarios.OPTIMISTIC.expensesLakhs,
          net: scenarios.OPTIMISTIC.netProfitLakhs,
        }
      ];

      groupData.forEach(g => {
        // Draw group label underneath
        doc.setTextColor(71, 85, 105);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text(g.name, g.centerX - 10, c2BottomY + 4);

        // Bar Width
        const bW = 6;

        // 1. Revenue (Blue)
        const revH = (g.rev / maxVal) * c2Height;
        doc.setFillColor(37, 99, 235);
        doc.rect(g.centerX - 10, c2BottomY - revH, bW, revH, 'F');
        
        // 2. Expenses (Red)
        const expH = (g.exp / maxVal) * c2Height;
        doc.setFillColor(225, 29, 72);
        doc.rect(g.centerX - 3, c2BottomY - expH, bW, expH, 'F');
        
        // 3. Net Profit (Emerald/Rose)
        if (g.net >= 0) {
          const netH = (g.net / maxVal) * c2Height;
          doc.setFillColor(16, 185, 129);
          doc.rect(g.centerX + 4, c2BottomY - netH, bW, netH, 'F');
        } else {
          // Negative Net Profit drawn downwards
          const netH = (Math.abs(g.net) / maxVal) * c2Height;
          doc.setFillColor(244, 63, 94); // Dark rose
          doc.rect(g.centerX + 4, c2BottomY, bW, netH, 'F');
        }
      });

      // Chart Legend top right of chart
      const legX = c2StartX + 105;
      const legY = c2TopY + 2;
      
      doc.setFillColor(37, 99, 235);
      doc.rect(legX, legY, 3, 3, 'F');
      doc.setTextColor(71, 85, 105);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.text("Sales Revenue", legX + 5, legY + 2.5);

      doc.setFillColor(225, 29, 72);
      doc.rect(legX, legY + 5, 3, 3, 'F');
      doc.text("Operating Opex", legX + 5, legY + 7.5);

      doc.setFillColor(16, 185, 129);
      doc.rect(legX, legY + 10, 3, 3, 'F');
      doc.text("Net Profit", legX + 5, legY + 12.5);

      // ==========================================
      // PAGE 3: CAPITAL RECOVERY TRAJECTORY & SUMMARY
      // ==========================================
      doc.addPage();
      
      doc.setFillColor(30, 41, 59);
      doc.rect(0, 0, 210, 15, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text("BRIZX INDIA | 36-MONTH CAPITAL RECOVERY TRAJECTORY", 14, 10);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(37, 99, 235);
      doc.text("4. 36-Month Capital Recovery Trajectory", 14, 25);
      
      const cashFlowTableRows: any[] = [];
      trajectoryData.forEach(item => {
        cashFlowTableRows.push([
          item.Month, 
          `INR ${item['Net Cashflow (₹L)'].toFixed(2)} Lakhs`, 
          item['Net Cashflow (₹L)'] >= 0 ? "Fully Recovered" : `INR ${Math.abs(item['Net Cashflow (₹L)']).toFixed(2)} Lakhs Outstanding`
        ]);
      });
      
      autoTable(doc, {
        startY: 29,
        head: [["Milestone Month", "Cumulative Wealth Position (INR L)", "Capital Payback Status"]],
        body: cashFlowTableRows,
        theme: 'striped',
        styles: { fontSize: 7.5, cellPadding: 2.5, font: 'helvetica' },
        headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 45 },
          1: { halign: 'right', fontStyle: 'bold', cellWidth: 65 },
          2: { halign: 'center', cellWidth: 72 }
        }
      });

      // DRAW CHART 3: 3-YEAR CASH FLOW RECOVERY TRAJECTORY
      const recoveryChartY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);
      doc.text("3-Year Cumulative Cash Flow Recovery Curve", 14, recoveryChartY);

      // Chart dimensions
      const c3StartX = 30;
      const c3Width = 150;
      const c3BottomY = recoveryChartY + 48;
      const c3Height = 38;
      const c3TopY = c3BottomY - c3Height;

      const minCF = -totalCapexLakhs;
      const maxCF = trajectoryData[trajectoryData.length - 1]?.['Net Cashflow (₹L)'] || 10;
      const cfRange = maxCF - minCF || 1;

      // Draw horizontal grid lines for recovery
      doc.setDrawColor(241, 245, 249);
      doc.setLineWidth(0.2);
      for (let i = 0; i <= 4; i++) {
        const gridY = c3BottomY - (i / 4) * c3Height;
        doc.line(c3StartX, gridY, c3StartX + c3Width, gridY);
        
        const val = minCF + (i / 4) * cfRange;
        doc.setTextColor(148, 163, 184);
        doc.setFontSize(7);
        doc.text(`${val >= 0 ? '+' : ''}${val.toFixed(1)} L`, c3StartX - 9, gridY + 1.5);
      }

      // Draw zero breakeven threshold line
      if (minCF < 0 && maxCF > 0) {
        const zeroY = c3BottomY - ((0 - minCF) / cfRange) * c3Height;
        doc.setDrawColor(100, 116, 139);
        doc.setLineWidth(0.6);
        doc.line(c3StartX, zeroY, c3StartX + c3Width, zeroY);
        
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text("CAPITAL BREAKEVEN POINT (0 L)", c3StartX + 75, zeroY - 1.5);
      }

      // Draw axes
      doc.setDrawColor(148, 163, 184);
      doc.setLineWidth(0.4);
      doc.line(c3StartX, c3BottomY, c3StartX + c3Width, c3BottomY);
      doc.line(c3StartX, c3TopY, c3StartX, c3BottomY);

      // Generate curve points
      const points = trajectoryData.map((d, i) => {
        const val = d['Net Cashflow (₹L)'];
        const ptX = c3StartX + (i / (trajectoryData.length - 1)) * c3Width;
        const ptY = c3BottomY - ((val - minCF) / cfRange) * c3Height;
        return { x: ptX, y: ptY, month: d.Month, val };
      });

      // Draw connecting lines (vector path representation)
      doc.setDrawColor(37, 99, 235);
      doc.setLineWidth(1.2);
      for (let i = 0; i < points.length - 1; i++) {
        doc.line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
      }

      // Draw dot coordinates
      points.forEach((p, idx) => {
        doc.setFillColor(p.val >= 0 ? 16 : 225, p.val >= 0 ? 185 : 29, p.val >= 0 ? 129 : 72);
        doc.circle(p.x, p.y, 1.2, 'F');
        
        // Print month label underneath
        if (idx % 2 === 0 || idx === points.length - 1) {
          doc.setTextColor(100, 116, 139);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.text(p.month, p.x - 3, c3BottomY + 4);
        }
      });
      
      // Disclaimers and assumptions block
      const currentY3 = c3BottomY + 12;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text("Feasibility Assumptions & Risk Disclaimers:", 14, currentY3);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text("- Rent, Employee payroll, utility burdens are modeled as static monthly fixed expenses.", 14, currentY3 + 4);
      doc.text("- Margin model incorporates standard 35% base deduction for inventory/material COGS in addition to brand royalties.", 14, currentY3 + 8);
      doc.text("- All predictions provided in this simulation represent pre-tax metrics.", 14, currentY3 + 12);
      doc.text("- DISCLAIMER: Feasibility models are indicative. BrizX India makes no assurance regarding future profits or returns.", 14, currentY3 + 16);
      
      // Page numbers (Stamp footer on all pages)
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(`Page ${i} of ${totalPages} | BrizX India Institutional Advisors`, 14, 287);
      }
      
      const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '_');
      const formattedBrandName = customBrandName.trim().replace(/[^a-zA-Z0-9]/g, '_');
      doc.save(`BRIZX_ROI_Report_${formattedBrandName}_${dateStr}.pdf`);
      setExportStatus('pdf_success');
      showStatusMessage('PDF report generated successfully!', 'success');
      setTimeout(() => setExportStatus('idle'), 3000);
    } catch (err: any) {
      console.error("PDF EXPORT ERROR TRACE:", err);
      setExportError(err.message || String(err));
      setExportStatus('error');
      showStatusMessage('PDF generation failed. Please try again.', 'error');
    }
  };

  const handleExportExcel = async () => {
    try {
      setExportStatus('generating_excel');
      
      // UX delay
      await new Promise(resolve => setTimeout(resolve, 850));

      const wb = XLSX.utils.book_new();

      // Sheet 1: Investment Summary
      const summaryData = [
        ["BRIZX INDIA - FRANCHISE ROI SUMMARY"],
        [],
        ["Core Parameter", "Value", "Unit"],
        ["Selected Franchise Model", customBrandName, "Brand"],
        ["Total Capital Capex Required", totalCapexLakhs, "₹ Lakhs"],
        ["Expected Monthly Revenue", monthlyRevenueLakhs, "₹ Lakhs"],
        ["Estimated Monthly Operating Expenses", totalMonthlyExpensesRupees / 100000, "₹ Lakhs"],
        ["Net Monthly Operating Profit", monthlyNetProfitLakhs, "₹ Lakhs"],
        ["Annualized Operating Revenue", annualRevenueLakhs, "₹ Lakhs"],
        ["Annual Net Profit Flow", annualNetProfitLakhs, "₹ Lakhs"],
        ["Projected Annual ROI", annualRoiPct, "%"],
        ["Expected Payback Period", paybackPeriodMonths > 0 ? paybackPeriodMonths : "Not Achievable", "Months"],
        ["Breakeven Monthly Sales Required", breakevenMonthlyRevenueLakhs, "₹ Lakhs"]
      ];
      const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, wsSummary, "Investment Summary");

      // Sheet 2: Initial Capex
      const capexData = [
        ["INITIAL STARTUP CAPEX BREAKDOWN"],
        [],
        ["Capex Item", "Allocated (₹ Lakhs)"],
        ["One-time Franchise Fee", franchiseFee],
        ["Setup & Construction Cost", setupCost],
        ["Interior & Fit-out Cost", interiorCost],
        ["Kitchen & Machinery Equipment", equipmentCost],
        ["Technology, POS & Signage", technologyCost],
        ["Landlord Security Deposit", securityDeposit],
        ["Initial Working Capital Reserve", workingCapital],
        ["Other Initial Expenses & Licenses", otherInitialExpenses],
        ["TOTAL ACQUISITION BUDGET", totalCapexLakhs]
      ];
      const wsCapex = XLSX.utils.aoa_to_sheet(capexData);
      XLSX.utils.book_append_sheet(wb, wsCapex, "Initial Capex");

      // Sheet 3: Monthly Revenue
      const wsRevenue = XLSX.utils.aoa_to_sheet([
        ["MONTHLY REVENUE MODELING"],
        [],
        ["Metric Variable", "Value"],
        ["Average Customer Ticket (₹)", avgCustomerValue],
        ["Estimated Monthly Orders (Qty)", estimatedMonthlyOrders],
        ["Monthly Gross Revenue (₹)", grossMonthlyRevenueRupees],
        ["Monthly Gross Revenue (₹ Lakhs)", monthlyRevenueLakhs]
      ]);
      XLSX.utils.book_append_sheet(wb, wsRevenue, "Monthly Revenue");

      // Sheet 4: Operating Expenses
      const wsOpex = XLSX.utils.aoa_to_sheet([
        ["MONTHLY OPERATING EXPENSES (OPEX)"],
        [],
        ["Expense Bucket", "Burden (₹)"],
        ["Store / Outlet Rent", rent],
        ["Employee Payroll & Staffing", employeeSalaries],
        ["Electricity & Utilities", electricityUtilities],
        ["Marketing & Promotions", marketingCost],
        ["Brand Royalty Fee", royaltyExpenseRupees],
        ["Store Maintenance & Tech", maintenanceCost],
        ["Other Operating Expenses", otherExpenses],
        ["TOTAL MONTHLY OPEX", totalMonthlyExpensesRupees]
      ]);
      XLSX.utils.book_append_sheet(wb, wsOpex, "Operating Expenses");

      // Sheet 5: Scenario Analysis
      const wsScenarios = XLSX.utils.aoa_to_sheet([
        ["MARKET SCENARIO ANALYSIS COMPILATION"],
        [],
        ["Financial Parameter", "Conservative (70% Volume)", "Expected (Baseline)", "Optimistic (130% Volume)"],
        ["Monthly Revenue (₹ Lakhs)", scenarios.CONSERVATIVE.revenueLakhs, scenarios.EXPECTED.revenueLakhs, scenarios.OPTIMISTIC.revenueLakhs],
        ["Monthly Expenses (₹ Lakhs)", scenarios.CONSERVATIVE.expensesLakhs, scenarios.EXPECTED.expensesLakhs, scenarios.OPTIMISTIC.expensesLakhs],
        ["Monthly Net Profit (₹ Lakhs)", scenarios.CONSERVATIVE.netProfitLakhs, scenarios.EXPECTED.netProfitLakhs, scenarios.OPTIMISTIC.netProfitLakhs],
        ["Annual Net Profit (₹ Lakhs)", scenarios.CONSERVATIVE.annualNetProfitLakhs, scenarios.EXPECTED.annualNetProfitLakhs, scenarios.OPTIMISTIC.annualNetProfitLakhs],
        ["Operating Profit Margin (%)", scenarios.CONSERVATIVE.netMarginPct, scenarios.EXPECTED.netMarginPct, scenarios.OPTIMISTIC.netMarginPct],
        ["Projected Annualized ROI (%)", scenarios.CONSERVATIVE.roiPct, scenarios.EXPECTED.roiPct, scenarios.OPTIMISTIC.roiPct],
        ["Capex Payback Horizon (Mos)", scenarios.CONSERVATIVE.paybackMonths > 0 ? scenarios.CONSERVATIVE.paybackMonths : "N/A", scenarios.EXPECTED.paybackMonths > 0 ? scenarios.EXPECTED.paybackMonths : "N/A", scenarios.OPTIMISTIC.paybackMonths > 0 ? scenarios.OPTIMISTIC.paybackMonths : "N/A"]
      ]);
      XLSX.utils.book_append_sheet(wb, wsScenarios, "Scenario Analysis");

      // Sheet 6: 3-Year Cash Flow
      const cashFlowRows = [
        ["3-YEAR CUMULATIVE CASH FLOW TRAJECTORY"],
        [],
        ["Month", "Cumulative Position (₹ Lakhs)", "Payback Recovery Status"]
      ];
      trajectoryData.forEach(item => {
        cashFlowRows.push([
          item.Month, 
          item['Net Cashflow (₹L)'], 
          item['Net Cashflow (₹L)'] >= 0 ? "Fully Recovered" : `₹${Math.abs(item['Net Cashflow (₹L)']).toFixed(2)}L Outstanding`
        ]);
      });
      const wsCashflow = XLSX.utils.aoa_to_sheet(cashFlowRows);
      XLSX.utils.book_append_sheet(wb, wsCashflow, "3-Year Cash Flow");

      // Write Workbook
      XLSX.writeFile(wb, `BrizX_Feasibility_Model_${customBrandName.replace(/\s+/g, '_')}.xlsx`);
      setExportStatus('excel_success');
      showStatusMessage('Excel report generated successfully!', 'success');
      setTimeout(() => setExportStatus('idle'), 3000);
    } catch (err: any) {
      console.error(err);
      setExportError(err.message || String(err));
      setExportStatus('error');
      showStatusMessage('Excel generation failed', 'error');
    }
  };

  // Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [consultSuccess, setConsultSuccess] = useState(false);

  return (
    <div className={seekerTheme.pageContainer}>
      <div className="w-full space-y-8">
        
        {/* Top Header Banner */}
        <SeekerPageBanner
          badgeText="Advanced Financial Suite • BrizX Pro"
          badgeIcon={<Sparkles size={14} className="text-blue-700" />}
          title="Advanced Franchise ROI & Profitability Engine"
          description="Execute multi-variable financial simulations, evaluate itemized startup capex, test 3-tier operational scenarios, and model long-term capital recovery timelines with institutional precision."
          actions={
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="px-4 py-2.5 bg-white text-blue-700 border border-blue-200 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <FileText size={14} /> Report Drawer
              </button>
              <button
                onClick={() => setIsConsultModalOpen(true)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <PhoneCall size={14} /> Consult
              </button>
            </div>
          }
        />

        {/* Global Action / Status Notification Header */}
        {statusMsg && (
          <div className={`p-4 rounded-2xl border text-xs font-extrabold text-left transition-all ${
            statusType === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
            statusType === 'info' ? 'bg-blue-50 text-blue-800 border-blue-200' :
            'bg-rose-50 text-rose-800 border-rose-200'
          }`}>
            {statusMsg}
          </div>
        )}

        {/* SECTION 1: BRAND / FRANCHISE SELECTOR */}
        <div className="bg-white border border-blue-100/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-50 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
                <Building2 size={20} className="stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 uppercase tracking-tight font-heading">
                  1. Brand / Franchise Selection
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Select a verified brand to auto-populate default unit economics or configure custom franchise parameters.
                </p>
              </div>
            </div>

            <button
              onClick={() => handleBrandChange('custom')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 border border-blue-100"
            >
              <RefreshCw size={14} /> Reset Defaults
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                Select Franchise Brand
              </label>
              <select
                value={selectedBrandId}
                onChange={(e) => handleBrandChange(e.target.value)}
                className={seekerTheme.select}
              >
                <option value="custom">⚡ Custom Franchise Model</option>
                {mockBrands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.brandName} ({b.industry} • ₹{b.investmentRequired.min}-{b.investmentRequired.max}L)
                  </option>
                ))}
              </select>

              {/* Verified Badge / Warning text */}
              {selectedBrandId !== 'custom' && (
                <div className="mt-2">
                  {hasVerifiedData ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      <ShieldCheck size={11} /> Verified Brand Data Loaded
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                      <AlertCircle size={11} /> Verified financial data unavailable
                    </span>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                Franchise Brand Name
              </label>
              <input
                type="text"
                value={customBrandName}
                onChange={(e) => setCustomBrandName(e.target.value)}
                className={seekerTheme.input}
                placeholder="e.g. Chai Point, Lenskart"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                Target Franchise Investment (₹ Lakhs)
              </label>
              <input
                type="number"
                value={franchiseInvestment}
                onChange={(e) => setFranchiseInvestment(safeNumber(e.target.value))}
                className={seekerTheme.input}
              />
            </div>
          </div>

          {/* Integrated Scenario Save & Load Drawer */}
          <div className="bg-slate-50/70 border border-blue-100/50 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <input
                type="text"
                placeholder="Name Scenario (e.g. Noida Mall Launch)"
                value={saveScenarioName}
                onChange={(e) => setSaveScenarioName(e.target.value)}
                className={`${seekerTheme.input} text-xs bg-white py-2 px-3 w-full sm:w-64`}
              />
              <button
                onClick={handleSaveCalculation}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
              >
                {loadedCalculationId ? 'Overwrite Saved' : 'Save Current Scenario'}
              </button>
            </div>

            {savedCalculations.length > 0 && (
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Load Saved Scenario:</span>
                <select
                  value={loadedCalculationId}
                  onChange={(e) => {
                    if (e.target.value) handleLoadCalculation(e.target.value);
                  }}
                  className={`${seekerTheme.select} text-xs bg-white py-1.5 px-2.5 max-w-[200px] cursor-pointer`}
                >
                  <option value="" disabled>-- Select scenario --</option>
                  {savedCalculations.map((calc) => (
                    <option key={calc.id} value={calc.id}>
                      {calc.name} ({new Date(calc.timestamp).toLocaleDateString('en-IN')})
                    </option>
                  ))}
                </select>
                {loadedCalculationId && (
                  <button
                    onClick={handleDeleteCalculation}
                    className="px-3 py-1.5 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer text-xs font-bold"
                    title="Delete scenario"
                  >
                    Delete Scenario
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2 & 3: CAPEX BREAKDOWN & MONTHLY REVENUE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          
          {/* SECTION 2: INITIAL INVESTMENT (CAPEX BREAKDOWN) */}
          <div className="lg:col-span-7 bg-white border border-blue-100/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-blue-50 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                  <PieChartIcon size={18} className="stroke-[2.5]" />
                </div>
                <h3 className="text-base font-black text-slate-900 uppercase tracking-tight font-heading">
                  2. Initial Investment (Capex Breakdown)
                </h3>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  Total: ₹{totalCapexLakhs.toFixed(2)} L
                </span>
                <span className={`text-[9px] font-bold mt-1 ${budgetVariance >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {budgetVariance >= 0 ? `₹${budgetVariance.toFixed(2)}L Surplus` : `₹${Math.abs(budgetVariance).toFixed(2)}L Over Budget`}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  One-time Franchise Fee (₹ Lakhs)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={franchiseFee}
                  onChange={(e) => setFranchiseFee(safeNumber(e.target.value))}
                  className={seekerTheme.input}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Setup & Construction Cost (₹ Lakhs)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={setupCost}
                  onChange={(e) => setSetupCost(safeNumber(e.target.value))}
                  className={seekerTheme.input}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Interior & Fit-out Cost (₹ Lakhs)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={interiorCost}
                  onChange={(e) => setInteriorCost(safeNumber(e.target.value))}
                  className={seekerTheme.input}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Kitchen / Machinery / Equipment (₹ Lakhs)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={equipmentCost}
                  onChange={(e) => setEquipmentCost(safeNumber(e.target.value))}
                  className={seekerTheme.input}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Technology / POS / Signage (₹ Lakhs)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={technologyCost}
                  onChange={(e) => setTechnologyCost(safeNumber(e.target.value))}
                  className={seekerTheme.input}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Security Deposit (₹ Lakhs)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(safeNumber(e.target.value))}
                  className={seekerTheme.input}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Initial Working Capital (₹ Lakhs)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={workingCapital}
                  onChange={(e) => setWorkingCapital(safeNumber(e.target.value))}
                  className={seekerTheme.input}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Other Initial Expenses & Licenses (₹ Lakhs)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={otherInitialExpenses}
                  onChange={(e) => setOtherInitialExpenses(safeNumber(e.target.value))}
                  className={seekerTheme.input}
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: MONTHLY REVENUE MODELING */}
          <div className="lg:col-span-5 bg-white border border-blue-100/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 border-b border-blue-50 pb-4 mb-6">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                  <TrendingUp size={18} className="stroke-[2.5]" />
                </div>
                <h3 className="text-base font-black text-slate-900 uppercase tracking-tight font-heading">
                  3. Monthly Revenue Modeling
                </h3>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Expected Monthly Revenue
                    </label>
                    <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200">
                      ₹{monthlyRevenueLakhs.toFixed(2)} Lakhs
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="0.5"
                    value={monthlyRevenueLakhs}
                    onChange={(e) => handleRevenueSliderChange(Number(e.target.value))}
                    className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Average Ticket (₹)
                    </label>
                    <input
                      type="number"
                      step="25"
                      value={avgCustomerValue}
                      onChange={(e) => setAvgCustomerValue(safeNumber(e.target.value))}
                      className={seekerTheme.input}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Estimated Monthly Orders
                    </label>
                    <input
                      type="number"
                      step="100"
                      value={estimatedMonthlyOrders}
                      onChange={(e) => setEstimatedMonthlyOrders(safeNumber(e.target.value))}
                      className={seekerTheme.input}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl space-y-1 mt-6">
              <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider">
                Annual Top-Line Revenue
              </span>
              <div className="text-2xl font-black text-slate-900">
                ₹{annualRevenueLakhs.toFixed(2)} Lakhs <span className="text-xs font-bold text-slate-500">/ year</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: MONTHLY EXPENSES (OPEX BREAKDOWN) */}
        <div className="bg-white border border-blue-100/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-50 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
                <BarChart2 size={18} className="stroke-[2.5]" />
              </div>
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight font-heading">
                4. Monthly Operating Expenses (Opex Breakdown)
              </h3>
            </div>

            <span className="text-xs font-black text-rose-700 bg-rose-50 px-3.5 py-1.5 rounded-full border border-rose-200">
              Total Opex: ₹{totalMonthlyExpensesRupees.toLocaleString('en-IN')} (₹{totalMonthlyExpensesLakhs.toFixed(2)}L)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Store / Outlet Rent (₹)
              </label>
              <input
                type="number"
                step="5000"
                value={rent}
                onChange={(e) => setRent(safeNumber(e.target.value))}
                className={seekerTheme.input}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Employee Payroll & Staffing (₹)
              </label>
              <input
                type="number"
                step="5000"
                value={employeeSalaries}
                onChange={(e) => setEmployeeSalaries(safeNumber(e.target.value))}
                className={seekerTheme.input}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Electricity & Utilities (₹)
              </label>
              <input
                type="number"
                step="2500"
                value={electricityUtilities}
                onChange={(e) => setElectricityUtilities(safeNumber(e.target.value))}
                className={seekerTheme.input}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Marketing & Promotions (₹)
              </label>
              <input
                type="number"
                step="2500"
                value={marketingCost}
                onChange={(e) => setMarketingCost(safeNumber(e.target.value))}
                className={seekerTheme.input}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Brand Royalty Fee (%)
              </label>
              <input
                type="number"
                step="0.5"
                value={royaltyPct}
                onChange={(e) => setRoyaltyPct(safeNumber(e.target.value))}
                className={seekerTheme.input}
              />
              <span className="text-[10px] text-slate-500 font-medium block mt-1">
                = ₹{royaltyExpenseRupees.toLocaleString('en-IN')} / mo
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Store Maintenance & Tech (₹)
              </label>
              <input
                type="number"
                step="2500"
                value={maintenanceCost}
                onChange={(e) => setMaintenanceCost(safeNumber(e.target.value))}
                className={seekerTheme.input}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Other Operating Expenses (₹)
              </label>
              <input
                type="number"
                step="2500"
                value={otherExpenses}
                onChange={(e) => setOtherExpenses(safeNumber(e.target.value))}
                className={seekerTheme.input}
              />
            </div>

            <div className="bg-slate-50 border border-blue-100 rounded-2xl p-4 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Opex to Revenue Ratio</span>
              <span className="text-base font-black text-slate-900">
                {grossMonthlyRevenueRupees > 0 ? ((totalMonthlyExpensesRupees / grossMonthlyRevenueRupees) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 5: PROFIT & ROI SUMMARY DASHBOARD */}
        <div className="bg-gradient-to-br from-blue-50/90 via-indigo-50/30 to-blue-50/80 rounded-3xl p-6 sm:p-8 shadow-xs border border-blue-100 text-left space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-100 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-100 px-3 py-1 rounded-full tracking-widest mb-2 inline-block">
                Automated Financial Yield Output
              </span>
              <h3 className="text-xl font-black font-heading text-slate-900 tracking-tight">
                5. Unit Economics & Profit Analysis
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportPDF}
                disabled={exportStatus.startsWith('generating')}
                className="px-4 py-2.5 bg-white text-blue-700 border border-blue-200 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-50 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <FileText size={14} /> {exportStatus === 'generating_pdf' ? 'Exporting PDF...' : 'Export PDF'}
              </button>
              <button
                onClick={handleExportExcel}
                disabled={exportStatus.startsWith('generating')}
                className="px-4 py-2.5 bg-white text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-50 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Download size={14} /> {exportStatus === 'generating_excel' ? 'Exporting Excel...' : 'Export Excel'}
              </button>
              <button
                onClick={() => setIsConsultModalOpen(true)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <PhoneCall size={14} /> Book Expert Call
              </button>
            </div>
          </div>

          {/* Export Generation Alerts */}
          {exportStatus !== 'idle' && (
            <div className={`p-3 rounded-2xl text-xs font-bold text-left border ${
              exportStatus.startsWith('generating') ? 'bg-blue-50 text-blue-800 border-blue-100 animate-pulse' :
              exportStatus.endsWith('success') ? 'bg-emerald-50 text-emerald-800 border-emerald-100' :
              'bg-rose-50 text-rose-800 border-rose-100'
            }`}>
              {exportStatus === 'generating_pdf' && "Generating report..."}
              {exportStatus === 'generating_excel' && "Generating report..."}
              {exportStatus === 'pdf_success' && "PDF report generated successfully"}
              {exportStatus === 'excel_success' && "Excel report generated successfully"}
              {exportStatus === 'error' && `Export failed: ${exportError}`}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-blue-100/80 p-5 rounded-2xl shadow-xs">
              <span className="text-[10px] font-black uppercase text-slate-500 block mb-1">Monthly Net Profit</span>
              <span className={`text-2xl font-black ${isLossMaking ? 'text-rose-600' : 'text-emerald-600'}`}>
                ₹{monthlyNetProfitLakhs.toFixed(2)} Lakhs
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">
                {isLossMaking ? 'Currently Loss-Making' : `₹${monthlyNetProfitRupees.toLocaleString('en-IN')} / mo`}
              </span>
            </div>

            <div className="bg-white border border-blue-100/80 p-5 rounded-2xl shadow-xs">
              <span className="text-[10px] font-black uppercase text-slate-500 block mb-1">Annual Net Profit</span>
              <span className={`text-2xl font-black ${isLossMaking ? 'text-rose-600' : 'text-blue-700'}`}>
                ₹{annualNetProfitLakhs.toFixed(2)} Lakhs
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">12 Months Operational Cashflow</span>
            </div>

            <div className="bg-white border border-blue-100/80 p-5 rounded-2xl shadow-xs">
              <span className="text-[10px] font-black uppercase text-slate-500 block mb-1">Annualized ROI</span>
              <span className={`text-2xl font-black ${isLossMaking ? 'text-rose-600' : 'text-emerald-700'}`}>
                {annualRoiPct.toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Return on ₹{totalCapexLakhs.toFixed(1)}L Capex</span>
            </div>

            <div className="bg-white border border-blue-100/80 p-5 rounded-2xl shadow-xs">
              <span className="text-[10px] font-black uppercase text-slate-500 block mb-1">Payback Period</span>
              <span className={`text-lg font-black block mt-0.5 ${isLossMaking ? 'text-rose-600' : 'text-blue-600'}`}>
                {isLossMaking ? 'Not achievable under current assumptions' : `${paybackPeriodMonths.toFixed(1)} Mos`}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">
                {isLossMaking ? 'Business is currently loss-making' : `~${(paybackPeriodMonths / 12).toFixed(1)} Years`}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-white border border-blue-100 rounded-2xl shadow-xs">
              <span className="text-[10px] font-black uppercase text-slate-500 block mb-1">Net Profit Margin</span>
              <span className={`text-xl font-extrabold ${isLossMaking ? 'text-rose-600' : 'text-slate-900'}`}>{netProfitMarginPct.toFixed(1)}%</span>
            </div>

            <div className="p-4 bg-white border border-blue-100 rounded-2xl shadow-xs">
              <span className="text-[10px] font-black uppercase text-slate-500 block mb-1">Breakeven Monthly Sales</span>
              <span className="text-xl font-extrabold text-blue-600">₹{breakevenMonthlyRevenueLakhs.toFixed(2)} Lakhs</span>
            </div>

            <div className="p-4 bg-white border border-blue-100 rounded-2xl shadow-xs">
              <span className="text-[10px] font-black uppercase text-slate-500 block mb-1">Initial Startup Capex</span>
              <span className="text-xl font-extrabold text-blue-700">₹{totalCapexLakhs.toFixed(2)} Lakhs</span>
            </div>
          </div>
        </div>

        {/* SECTION 6: SCENARIO ANALYSIS (3 SCENARIOS) */}
        <div className="bg-white border border-blue-100/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 text-left">
          <div className="flex items-center gap-3 border-b border-blue-50 pb-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
              <Layers size={18} className="stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight font-heading">
                6. Scenario Analysis (Conservative vs. Expected vs. Optimistic)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Evaluate resilience under varied market footfalls and operational cost dynamics.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(scenarios).map(([key, sc]) => (
              <div 
                key={key}
                className="bg-slate-50/60 border border-blue-100 rounded-3xl p-6 space-y-5 relative overflow-hidden flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${sc.badgeBg}`}>
                      {sc.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-4">{sc.subtitle}</p>

                  <div className="space-y-3 text-xs border-t border-slate-200/80 pt-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Monthly Revenue:</span>
                      <span className="font-extrabold text-slate-900">₹{sc.revenueLakhs.toFixed(2)} L</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Monthly Expenses:</span>
                      <span className="font-bold text-slate-700">₹{sc.expensesLakhs.toFixed(2)} L</span>
                    </div>

                    <div className="flex justify-between border-t border-slate-200 pt-2">
                      <span className="font-bold text-slate-700">Monthly Net Profit:</span>
                      <span className={`font-black text-sm ${sc.netProfitLakhs <= 0 ? 'text-rose-600' : 'text-blue-700'}`}>
                        ₹{sc.netProfitLakhs.toFixed(2)} L
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Annual Net Profit:</span>
                      <span className={`font-extrabold ${sc.annualNetProfitLakhs <= 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                        ₹{sc.annualNetProfitLakhs.toFixed(2)} L
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Net Profit Margin:</span>
                      <span className="font-bold text-slate-800">{sc.netMarginPct.toFixed(1)}%</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Projected Annual ROI:</span>
                      <span className={`font-black ${sc.roiPct <= 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {sc.roiPct.toFixed(1)}%
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Capex Payback:</span>
                      <span className={`font-bold ${sc.paybackMonths <= 0 ? 'text-rose-600' : 'text-blue-700'}`}>
                        {sc.paybackMonths > 0 ? `${sc.paybackMonths.toFixed(1)} Mos` : 'Not Achievable'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 7: VISUAL CHARTS & ADVANCED REPORTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          
          {/* Chart 1: Capex Allocation Donut */}
          <div className="lg:col-span-5 bg-white border border-blue-100/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="border-b border-blue-50 pb-3">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight font-heading">
                7A. Initial Capex Allocation
              </h3>
              <p className="text-xs text-slate-500">Capital distribution across setup buckets (₹ Lakhs)</p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={capexPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {capexPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`₹${value} Lakhs`, 'Cost']} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Scenario Comparison Bar Chart */}
          <div className="lg:col-span-7 bg-white border border-blue-100/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="border-b border-blue-50 pb-3">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight font-heading">
                7B. Scenario Yield Comparison (₹ Lakhs / mo)
              </h3>
              <p className="text-xs text-slate-500">Monthly Revenue vs. Expenses vs. Net Profit</p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scenarioBarData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(val: number) => [`₹${val} Lakhs`, '']} />
                  <Bar dataKey="Revenue" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Expenses" fill="#E11D48" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Net Profit" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Chart 3: 36-Month Cumulative Cashflow Trajectory */}
        <div className="bg-white border border-blue-100/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4 text-left">
          <div className="border-b border-blue-50 pb-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight font-heading">
              7C. 3-Year Cumulative Cash Flow & Capital Recovery Trajectory
            </h3>
            <p className="text-xs text-slate-500">
              Visualizes initial capex recovery month-by-month and compounding net wealth creation.
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trajectoryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.7}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="Month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <Tooltip formatter={(value: number) => [`₹${value} Lakhs`, 'Position']} />
                <Area type="monotone" dataKey="Net Cashflow (₹L)" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorNet)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom CTA & Disclaimers */}
        <div className="bg-white border border-blue-100 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-left shadow-xs">
          <div className="space-y-1">
            <h4 className="text-sm font-black text-slate-900 uppercase font-heading">Ready to finalize your investment due diligence?</h4>
            <p className="text-xs text-slate-500">Schedule a 1-on-1 financial review with BrizX India Senior Franchise Investment Consultants.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportPDF}
              disabled={exportStatus.startsWith('generating')}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <FileText size={15} /> {exportStatus === 'generating_pdf' ? 'Generating PDF...' : 'Export PDF Report'}
            </button>
            <button
              onClick={handleExportExcel}
              disabled={exportStatus.startsWith('generating')}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download size={15} /> {exportStatus === 'generating_excel' ? 'Generating Excel...' : 'Export Excel Model'}
            </button>
            <button
              onClick={() => setIsConsultModalOpen(true)}
              className="px-6 py-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <PhoneCall size={15} /> Book Advisory Call
            </button>
          </div>
        </div>

      </div>

      {/* REPORT DOWNLOAD / PRINT PREVIEW MODAL */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-blue-100 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-xl relative text-left max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex justify-between items-center border-b border-blue-50 pb-4">
              <div>
                <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">BrizX Institutional Report</span>
                <h3 className="text-xl font-black text-slate-900 font-heading">Franchise Financial Feasibility Summary</h3>
              </div>
              <button onClick={() => setIsReportModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-blue-100 space-y-2">
                <div className="flex justify-between font-bold">
                  <span>Selected Model:</span>
                  <span className="text-blue-700 font-black">{customBrandName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Capex Requirement:</span>
                  <span className="font-extrabold text-slate-900">₹{totalCapexLakhs.toFixed(2)} Lakhs</span>
                </div>
                <div className="flex justify-between">
                  <span>Est. Monthly Net Profit:</span>
                  <span className={`font-extrabold ${isLossMaking ? 'text-rose-600' : 'text-emerald-700'}`}>
                    ₹{monthlyNetProfitLakhs.toFixed(2)} Lakhs
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Annualized ROI:</span>
                  <span className={`font-extrabold ${isLossMaking ? 'text-rose-600' : 'text-blue-700'}`}>{annualRoiPct.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Payback Horizon:</span>
                  <span className={`font-extrabold ${isLossMaking ? 'text-rose-600' : 'text-slate-900'}`}>
                    {isLossMaking ? 'Not achievable under current assumptions' : `${paybackPeriodMonths.toFixed(1)} Months`}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-blue-50 text-blue-800 rounded-xl text-[11px] border border-blue-100">
                Report ID: BRZX-ROI-{Math.floor(100000 + Math.random() * 900000)} • Generated on {new Date().toLocaleDateString('en-IN')}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-blue-50">
              <button
                onClick={handleExportPDF}
                disabled={exportStatus.startsWith('generating')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs disabled:opacity-50"
              >
                Download PDF
              </button>
              <button
                onClick={handleExportExcel}
                disabled={exportStatus.startsWith('generating')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs disabled:opacity-50"
              >
                Download Excel
              </button>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXPERT CONSULTATION BOOKING MODAL */}
      {isConsultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-blue-100 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-xl relative text-left space-y-6">
            <div className="flex justify-between items-center border-b border-blue-50 pb-4">
              <div>
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">BrizX Advisory Desk</span>
                <h3 className="text-xl font-black text-slate-900 font-heading">Book Expert Consultation</h3>
              </div>
              <button onClick={() => setIsConsultModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer">
                ✕
              </button>
            </div>

            {consultSuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                <CheckCircle2 size={40} className="text-emerald-700 mx-auto" />
                <h4 className="text-base font-black text-slate-900 font-heading">Consultation Request Confirmed!</h4>
                <p className="text-xs text-slate-600">
                  A Senior BrizX Franchise Financial Advisor will contact you within 24 hours to review your capex and unit economics plan.
                </p>
                <button
                  onClick={() => {
                    setConsultSuccess(false);
                    setIsConsultModalOpen(false);
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                  <input type="text" defaultValue="Priya Sharma" className={seekerTheme.input} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input type="text" defaultValue="+91 98765 43210" className={seekerTheme.input} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Capital (₹ Lakhs)</label>
                  <input type="number" defaultValue={totalCapexLakhs} className={seekerTheme.input} />
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setConsultSuccess(true)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs cursor-pointer transition-all"
                  >
                    Confirm Consultation Booking
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
