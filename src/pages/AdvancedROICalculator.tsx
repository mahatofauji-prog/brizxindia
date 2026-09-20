import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, TrendingUp, Calendar, ShieldCheck, 
  ArrowRight, Download, PhoneCall, Layers, CheckCircle2, 
  HelpCircle, Building2, PieChart as PieChartIcon, BarChart2,
  FileText, Check, AlertCircle, Clock, Lock, Sparkles, AlertTriangle
} from 'lucide-react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { useSearchParams, Link } from 'react-router';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { SeekerPageBanner } from '../components/seeker/SeekerPageBanner';
import { seekerTheme } from '../theme/seekerTheme';
import { BrandFinancialLockBadge } from '../components/roi/BrandFinancialLockBadge';
import { BrandCapexCard } from '../components/roi/BrandCapexCard';
import { BrandRevenueCard } from '../components/roi/BrandRevenueCard';
import { BrandOpexCard } from '../components/roi/BrandOpexCard';
import { SeekerSensitivitySimulator } from '../components/roi/SeekerSensitivitySimulator';
import { Brand, BrandFinancialProfile } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function AdvancedROICalculator() {
  const { user } = useAuth();
  const { brands } = useData();
  const [searchParams, setSearchParams] = useSearchParams();

  // Brand selection state
  const brandQueryId = searchParams.get('brandId') || searchParams.get('brand') || '';
  const [selectedBrandId, setSelectedBrandId] = useState<string>(() => {
    if (brandQueryId && brands.some(b => b.id === brandQueryId)) {
      return brandQueryId;
    }
    // Default to 'b1' (Burger Kingsway) or the first available brand
    return brands.some(b => b.id === 'b1') ? 'b1' : (brands[0]?.id || 'custom');
  });

  // Keep search params in sync
  useEffect(() => {
    if (brandQueryId && brandQueryId !== selectedBrandId && brands.some(b => b.id === brandQueryId)) {
      setSelectedBrandId(brandQueryId);
    }
  }, [brandQueryId, brands]);

  // Selected Brand Object
  const selectedBrand = useMemo(() => {
    return brands.find(b => b.id === selectedBrandId) || null;
  }, [brands, selectedBrandId]);

  const isCustomMode = selectedBrandId === 'custom';

  // Custom mode fallback state (only active when seeker explicitly selects 'custom')
  const [customName, setCustomName] = useState('My Custom Business Plan');
  const [customCapex, setCustomCapex] = useState({
    franchiseFee: 5,
    setupCost: 6,
    interiorCost: 8,
    equipmentCost: 5,
    technologyCost: 2,
    securityDeposit: 4,
    workingCapital: 3,
    otherInitialExpenses: 2
  });
  const [customRevenue, setCustomRevenue] = useState({
    expectedMonthlyRevenue: 7.5,
    avgCustomerTicket: 350,
    estimatedMonthlyOrders: 2140
  });
  const [customOpex, setCustomOpex] = useState({
    rent: 65000,
    employeeSalaries: 95000,
    electricityUtilities: 35000,
    marketingCost: 25000,
    royaltyPercentage: 4,
    maintenanceCost: 15000,
    otherOperatingExpenses: 20000,
    cogsPercentage: 35
  });

  // Effective Financial Profile: Purely from selected brand in brand mode
  const effectiveFp: Partial<BrandFinancialProfile> = useMemo(() => {
    if (isCustomMode) {
      const totalCapex = Object.values(customCapex).reduce((a, b) => a + b, 0);
      return {
        ...customCapex,
        totalInitialInvestment: totalCapex,
        ...customRevenue,
        ...customOpex,
        isComplete: true
      };
    }
    return selectedBrand?.financialProfile || {};
  }, [isCustomMode, selectedBrand, customCapex, customRevenue, customOpex]);

  // Check if brand data is missing or incomplete
  const isDataMissing = useMemo(() => {
    if (isCustomMode) return false;
    if (!selectedBrand?.financialProfile) return true;
    const fp = selectedBrand.financialProfile;
    return !(
      fp.totalInitialInvestment && fp.totalInitialInvestment > 0 &&
      fp.expectedMonthlyRevenue && fp.expectedMonthlyRevenue > 0 &&
      fp.rent !== undefined && fp.employeeSalaries !== undefined
    );
  }, [isCustomMode, selectedBrand]);

  // Calculations for Capex, Revenue, and OPEX
  const totalCapexLakhs = useMemo(() => {
    if (effectiveFp.totalInitialInvestment && effectiveFp.totalInitialInvestment > 0) {
      return effectiveFp.totalInitialInvestment;
    }
    return (
      (effectiveFp.franchiseFee || 0) +
      (effectiveFp.setupCost || 0) +
      (effectiveFp.interiorCost || 0) +
      (effectiveFp.equipmentCost || 0) +
      (effectiveFp.technologyCost || 0) +
      (effectiveFp.securityDeposit || 0) +
      (effectiveFp.workingCapital || 0) +
      (effectiveFp.otherInitialExpenses || 0)
    );
  }, [effectiveFp]);

  const grossMonthlyRevenueRupees = useMemo(() => {
    return (effectiveFp.expectedMonthlyRevenue || 0) * 100000;
  }, [effectiveFp.expectedMonthlyRevenue]);

  const cogsRupees = useMemo(() => {
    return Math.round((grossMonthlyRevenueRupees * (effectiveFp.cogsPercentage || 0)) / 100);
  }, [grossMonthlyRevenueRupees, effectiveFp.cogsPercentage]);

  const royaltyRupees = useMemo(() => {
    return Math.round((grossMonthlyRevenueRupees * (effectiveFp.royaltyPercentage || 0)) / 100);
  }, [grossMonthlyRevenueRupees, effectiveFp.royaltyPercentage]);

  const totalMonthlyOpexRupees = useMemo(() => {
    return (
      (effectiveFp.rent || 0) +
      (effectiveFp.employeeSalaries || 0) +
      (effectiveFp.electricityUtilities || 0) +
      (effectiveFp.marketingCost || 0) +
      royaltyRupees +
      (effectiveFp.maintenanceCost || 0) +
      (effectiveFp.otherOperatingExpenses || 0) +
      cogsRupees
    );
  }, [effectiveFp, royaltyRupees, cogsRupees]);

  const monthlyNetProfitRupees = useMemo(() => {
    if (isDataMissing) return 0;
    return grossMonthlyRevenueRupees - totalMonthlyOpexRupees;
  }, [grossMonthlyRevenueRupees, totalMonthlyOpexRupees, isDataMissing]);

  const annualNetProfitRupees = useMemo(() => {
    return monthlyNetProfitRupees * 12;
  }, [monthlyNetProfitRupees]);

  const annualRoiPct = useMemo(() => {
    const capexRupees = totalCapexLakhs * 100000;
    if (capexRupees <= 0 || monthlyNetProfitRupees <= 0 || isDataMissing) return 0;
    return (annualNetProfitRupees / capexRupees) * 100;
  }, [totalCapexLakhs, annualNetProfitRupees, monthlyNetProfitRupees, isDataMissing]);

  const paybackPeriodMonths = useMemo(() => {
    const capexRupees = totalCapexLakhs * 100000;
    if (capexRupees <= 0 || monthlyNetProfitRupees <= 0 || isDataMissing) return 0;
    return Math.round(capexRupees / monthlyNetProfitRupees);
  }, [totalCapexLakhs, monthlyNetProfitRupees, isDataMissing]);

  const netProfitMarginPct = useMemo(() => {
    if (grossMonthlyRevenueRupees <= 0 || isDataMissing) return 0;
    return (monthlyNetProfitRupees / grossMonthlyRevenueRupees) * 100;
  }, [monthlyNetProfitRupees, grossMonthlyRevenueRupees, isDataMissing]);

  // Handle brand change
  const handleBrandSelect = (newBrandId: string) => {
    setSelectedBrandId(newBrandId);
    setSearchParams({ brandId: newBrandId });
  };

  // Visual Chart Data
  const capexPieData = useMemo(() => {
    return [
      { name: 'Franchise Fee', value: effectiveFp.franchiseFee || 0, color: '#2563EB' },
      { name: 'Setup & Civil', value: effectiveFp.setupCost || 0, color: '#3B82F6' },
      { name: 'Interior Fit-out', value: effectiveFp.interiorCost || 0, color: '#60A5FA' },
      { name: 'Machinery/Equip', value: effectiveFp.equipmentCost || 0, color: '#93C5FD' },
      { name: 'Tech/POS', value: effectiveFp.technologyCost || 0, color: '#38BDF8' },
      { name: 'Security Deposit', value: effectiveFp.securityDeposit || 0, color: '#F59E0B' },
      { name: 'Working Capital', value: effectiveFp.workingCapital || 0, color: '#10B981' },
      { name: 'Other Capex', value: effectiveFp.otherInitialExpenses || 0, color: '#64748B' }
    ].filter(item => item.value > 0);
  }, [effectiveFp]);

  const opexPieData = useMemo(() => {
    return [
      { name: 'Store Rent', value: effectiveFp.rent || 0, color: '#EF4444' },
      { name: 'Staff Salaries', value: effectiveFp.employeeSalaries || 0, color: '#F97316' },
      { name: 'Electricity/Power', value: effectiveFp.electricityUtilities || 0, color: '#F59E0B' },
      { name: 'Marketing & Ads', value: effectiveFp.marketingCost || 0, color: '#8B5CF6' },
      { name: 'Brand Royalty', value: royaltyRupees, color: '#3B82F6' },
      { name: 'Maintenance', value: effectiveFp.maintenanceCost || 0, color: '#06B6D4' },
      { name: 'Other OPEX', value: effectiveFp.otherOperatingExpenses || 0, color: '#64748B' },
      { name: 'COGS / Materials', value: cogsRupees, color: '#EC4899' }
    ].filter(item => item.value > 0);
  }, [effectiveFp, royaltyRupees, cogsRupees]);

  // 36-Month Cumulative Cashflow & Payback Breakeven Trajectory
  const trajectoryData = useMemo(() => {
    const data = [];
    const monthlyNetLakhs = monthlyNetProfitRupees / 100000;
    const capex = totalCapexLakhs;

    for (let m = 0; m <= 36; m += 3) {
      const cumulativeEarnings = m * monthlyNetLakhs;
      const netCashPosition = cumulativeEarnings - capex;
      data.push({
        Month: `M${m}`,
        'Net Cash Position (₹L)': parseFloat(netCashPosition.toFixed(2)),
        'Initial Capex Target': parseFloat((-capex).toFixed(2)),
        'Breakeven Line': 0
      });
    }
    return data;
  }, [monthlyNetProfitRupees, totalCapexLakhs]);

  // UI state for Export & Consultation
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [consultSuccess, setConsultSuccess] = useState(false);
  const [exportStatus, setExportStatus] = useState<string>('idle');

  // PDF Export
  const handleExportPDF = () => {
    try {
      setExportStatus('generating_pdf');
      const doc = new jsPDF();
      const brandName = isCustomMode ? customName : (selectedBrand?.brandName || 'Franchise Brand');

      // Header Banner
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 210, 40, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text("BRIZX INDIA", 14, 16);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(191, 219, 254);
      doc.text("OFFICIAL BRAND UNIT ECONOMICS & ADVANCED ROI REPORT", 14, 23);
      doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 14, 29);

      // Status Badge
      doc.setFillColor(30, 58, 138);
      doc.rect(14, 46, 182, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(
        isCustomMode 
          ? "CUSTOM SEEKER SIMULATION (HYPOTHETICAL)" 
          : `OFFICIAL BRAND MODEL — VERIFIED & CERTIFIED BY ${brandName.toUpperCase()}`,
        18, 52.5
      );

      // Metadata
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(9);
      doc.text("FRANCHISE BRAND:", 14, 64);
      doc.setFont('helvetica', 'bold');
      doc.text(brandName, 55, 64);

      doc.setFont('helvetica', 'normal');
      doc.text("INDUSTRY:", 14, 70);
      doc.setFont('helvetica', 'bold');
      doc.text(selectedBrand?.industry || "Retail / QSR", 55, 70);

      doc.setFont('helvetica', 'normal');
      doc.text("SEEKER / INVESTOR:", 14, 76);
      doc.setFont('helvetica', 'bold');
      doc.text(user?.name || "Verified BrizX Investor", 55, 76);

      // Executive Summary Metrics Table
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(37, 99, 235);
      doc.text("1. Executive Financial Summary", 14, 88);

      const metricsRows = [
        ["Total Initial Investment (Capex)", `INR ${totalCapexLakhs.toFixed(2)} Lakhs`, "Expected Monthly Revenue", `INR ${(grossMonthlyRevenueRupees / 100000).toFixed(2)} Lakhs`],
        ["Monthly Operating Expenses", `INR ${(totalMonthlyOpexRupees / 100000).toFixed(2)} Lakhs`, "Net Monthly Profit", `INR ${(monthlyNetProfitRupees / 100000).toFixed(2)} Lakhs`],
        ["Projected Annual Net Profit", `INR ${(annualNetProfitRupees / 100000).toFixed(2)} Lakhs`, "Annualized ROI (%)", `${annualRoiPct.toFixed(1)}%`],
        ["Payback Horizon", paybackPeriodMonths > 0 ? `${paybackPeriodMonths} Months` : 'N/A', "Net Profit Margin", `${netProfitMarginPct.toFixed(1)}%`]
      ];

      autoTable(doc, {
        startY: 92,
        body: metricsRows,
        theme: 'plain',
        styles: { fontSize: 8.5, cellPadding: 3.5, font: 'helvetica' },
        columnStyles: {
          0: { fontStyle: 'bold', textColor: [71, 85, 105], cellWidth: 45 },
          1: { fontStyle: 'bold', textColor: [30, 58, 138], cellWidth: 45 },
          2: { fontStyle: 'bold', textColor: [71, 85, 105], cellWidth: 45 },
          3: { fontStyle: 'bold', textColor: [5, 150, 105], cellWidth: 45 }
        }
      });

      // Capex Table
      let currentY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(37, 99, 235);
      doc.text("2. Certified Capex Breakdown", 14, currentY);

      const capexRows = [
        ["One-time Franchise Fee", `INR ${(effectiveFp.franchiseFee || 0).toFixed(2)} Lakhs`, `${totalCapexLakhs > 0 ? (((effectiveFp.franchiseFee || 0) / totalCapexLakhs) * 100).toFixed(1) : 0}%`],
        ["Setup & Civil Work", `INR ${(effectiveFp.setupCost || 0).toFixed(2)} Lakhs`, `${totalCapexLakhs > 0 ? (((effectiveFp.setupCost || 0) / totalCapexLakhs) * 100).toFixed(1) : 0}%`],
        ["Interior & Fit-out", `INR ${(effectiveFp.interiorCost || 0).toFixed(2)} Lakhs`, `${totalCapexLakhs > 0 ? (((effectiveFp.interiorCost || 0) / totalCapexLakhs) * 100).toFixed(1) : 0}%`],
        ["Machinery & Equipment", `INR ${(effectiveFp.equipmentCost || 0).toFixed(2)} Lakhs`, `${totalCapexLakhs > 0 ? (((effectiveFp.equipmentCost || 0) / totalCapexLakhs) * 100).toFixed(1) : 0}%`],
        ["Technology & POS", `INR ${(effectiveFp.technologyCost || 0).toFixed(2)} Lakhs`, `${totalCapexLakhs > 0 ? (((effectiveFp.technologyCost || 0) / totalCapexLakhs) * 100).toFixed(1) : 0}%`],
        ["Landlord Security Deposit", `INR ${(effectiveFp.securityDeposit || 0).toFixed(2)} Lakhs`, `${totalCapexLakhs > 0 ? (((effectiveFp.securityDeposit || 0) / totalCapexLakhs) * 100).toFixed(1) : 0}%`],
        ["Working Capital Reserve", `INR ${(effectiveFp.workingCapital || 0).toFixed(2)} Lakhs`, `${totalCapexLakhs > 0 ? (((effectiveFp.workingCapital || 0) / totalCapexLakhs) * 100).toFixed(1) : 0}%`],
        ["Other Capex & Licenses", `INR ${(effectiveFp.otherInitialExpenses || 0).toFixed(2)} Lakhs`, `${totalCapexLakhs > 0 ? (((effectiveFp.otherInitialExpenses || 0) / totalCapexLakhs) * 100).toFixed(1) : 0}%`],
        ["TOTAL INITIAL OUTLAY", `INR ${totalCapexLakhs.toFixed(2)} Lakhs`, "100.0%"]
      ];

      autoTable(doc, {
        startY: currentY + 4,
        head: [["Capital Item", "Amount (₹ Lakhs)", "% of Outlay"]],
        body: capexRows,
        theme: 'grid',
        headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 8, cellPadding: 2.5 }
      });

      // OPEX Table
      currentY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(37, 99, 235);
      doc.text("3. Monthly Operating Expenditures (OPEX)", 14, currentY);

      const opexRows = [
        ["Store Rent", `INR ${(effectiveFp.rent || 0).toLocaleString('en-IN')}`, `${totalMonthlyOpexRupees > 0 ? (((effectiveFp.rent || 0) / totalMonthlyOpexRupees) * 100).toFixed(1) : 0}%`],
        ["Staff Payroll", `INR ${(effectiveFp.employeeSalaries || 0).toLocaleString('en-IN')}`, `${totalMonthlyOpexRupees > 0 ? (((effectiveFp.employeeSalaries || 0) / totalMonthlyOpexRupees) * 100).toFixed(1) : 0}%`],
        ["Electricity & Utilities", `INR ${(effectiveFp.electricityUtilities || 0).toLocaleString('en-IN')}`, `${totalMonthlyOpexRupees > 0 ? (((effectiveFp.electricityUtilities || 0) / totalMonthlyOpexRupees) * 100).toFixed(1) : 0}%`],
        ["Marketing & Ads", `INR ${(effectiveFp.marketingCost || 0).toLocaleString('en-IN')}`, `${totalMonthlyOpexRupees > 0 ? (((effectiveFp.marketingCost || 0) / totalMonthlyOpexRupees) * 100).toFixed(1) : 0}%`],
        [`Royalty Fee (${effectiveFp.royaltyPercentage || 0}%)`, `INR ${royaltyRupees.toLocaleString('en-IN')}`, `${totalMonthlyOpexRupees > 0 ? ((royaltyRupees / totalMonthlyOpexRupees) * 100).toFixed(1) : 0}%`],
        ["Maintenance & Tech", `INR ${(effectiveFp.maintenanceCost || 0).toLocaleString('en-IN')}`, `${totalMonthlyOpexRupees > 0 ? (((effectiveFp.maintenanceCost || 0) / totalMonthlyOpexRupees) * 100).toFixed(1) : 0}%`],
        ["Other OPEX", `INR ${(effectiveFp.otherOperatingExpenses || 0).toLocaleString('en-IN')}`, `${totalMonthlyOpexRupees > 0 ? (((effectiveFp.otherOperatingExpenses || 0) / totalMonthlyOpexRupees) * 100).toFixed(1) : 0}%`],
        [`COGS / Material (${effectiveFp.cogsPercentage || 0}%)`, `INR ${cogsRupees.toLocaleString('en-IN')}`, `${totalMonthlyOpexRupees > 0 ? ((cogsRupees / totalMonthlyOpexRupees) * 100).toFixed(1) : 0}%`],
        ["TOTAL MONTHLY OPEX", `INR ${totalMonthlyOpexRupees.toLocaleString('en-IN')}`, "100.0%"]
      ];

      autoTable(doc, {
        startY: currentY + 4,
        head: [["Expense Head", "Monthly Amount (₹)", "% of OPEX"]],
        body: opexRows,
        theme: 'grid',
        headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 8, cellPadding: 2.5 }
      });

      // Disclaimer
      const finalY = (doc as any).lastAutoTable.finalY + 12;
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text(
        "CONFIDENTIAL & PROPRIETARY: This report reflects the verified financial model provided by the franchisor on the BrizX platform. Actual outlet performance may vary depending on local micro-market dynamics, footfall, and operational execution.",
        14, finalY, { maxWidth: 182 }
      );

      doc.save(`BrizX_${brandName.replace(/\s+/g, '_')}_Financial_Report.pdf`);
      setExportStatus('idle');
      setIsReportModalOpen(false);
    } catch (err) {
      console.error('PDF Generation Error', err);
      setExportStatus('error');
    }
  };

  // Excel Export
  const handleExportExcel = () => {
    try {
      setExportStatus('generating_excel');
      const brandName = isCustomMode ? customName : (selectedBrand?.brandName || 'Franchise Brand');

      const summaryData = [
        ["BrizX Franchise Financial Feasibility Report"],
        [`Brand: ${brandName}`],
        [`Generated: ${new Date().toLocaleString('en-IN')}`],
        [],
        ["Metric", "Value", "Unit"],
        ["Total Initial Investment (Capex)", totalCapexLakhs, "₹ Lakhs"],
        ["Expected Monthly Revenue", grossMonthlyRevenueRupees / 100000, "₹ Lakhs"],
        ["Monthly Operating Expenses", totalMonthlyOpexRupees, "₹ Rupees"],
        ["Net Monthly Profit", monthlyNetProfitRupees, "₹ Rupees"],
        ["Projected Annual Net Profit", annualNetProfitRupees, "₹ Rupees"],
        ["Annualized ROI", annualRoiPct.toFixed(2), "%"],
        ["Payback Period", paybackPeriodMonths, "Months"],
        ["Net Margin", netProfitMarginPct.toFixed(2), "%"],
        [],
        ["CAPEX BREAKDOWN", "AMOUNT (₹ LAKHS)"],
        ["Franchise Fee", effectiveFp.franchiseFee || 0],
        ["Setup & Civil Work", effectiveFp.setupCost || 0],
        ["Interior & Fit-out", effectiveFp.interiorCost || 0],
        ["Machinery & Equipment", effectiveFp.equipmentCost || 0],
        ["Technology & POS", effectiveFp.technologyCost || 0],
        ["Security Deposit", effectiveFp.securityDeposit || 0],
        ["Working Capital Reserve", effectiveFp.workingCapital || 0],
        ["Other Expenses & Licenses", effectiveFp.otherInitialExpenses || 0],
        ["TOTAL CAPEX", totalCapexLakhs],
        [],
        ["MONTHLY OPEX BREAKDOWN", "MONTHLY AMOUNT (₹)"],
        ["Store Rent", effectiveFp.rent || 0],
        ["Staff Payroll", effectiveFp.employeeSalaries || 0],
        ["Electricity & Utilities", effectiveFp.electricityUtilities || 0],
        ["Marketing & Ads", effectiveFp.marketingCost || 0],
        ["Royalty Fee", royaltyRupees],
        ["Maintenance & Tech", effectiveFp.maintenanceCost || 0],
        ["Other OPEX", effectiveFp.otherOperatingExpenses || 0],
        ["COGS / Material Cost", cogsRupees],
        ["TOTAL MONTHLY OPEX", totalMonthlyOpexRupees]
      ];

      const ws = XLSX.utils.aoa_to_sheet(summaryData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Financial Model");
      XLSX.writeFile(wb, `BrizX_${brandName.replace(/\s+/g, '_')}_Financials.xlsx`);

      setExportStatus('idle');
      setIsReportModalOpen(false);
    } catch (err) {
      console.error('Excel Export Error', err);
      setExportStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24 text-slate-900">
      {/* Top Banner */}
      <SeekerPageBanner
        badgeText="Franchise Due Diligence Engine"
        badgeIcon={<ShieldCheck size={14} className="text-blue-600" />}
        title="Official Brand Unit Economics & Advanced ROI Calculator"
        description="Review authentic, franchisor-published financial projections. Capex, OPEX, and unit economics are locked directly from the brand's verified listing to protect data integrity."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* ============================================================ */}
        {/* BRAND SELECTION & VERIFICATION STATUS BAR */}
        {/* ============================================================ */}
        <div className="bg-white border border-blue-100 rounded-3xl p-6 sm:p-8 shadow-xs text-left">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-blue-600 tracking-wider flex items-center gap-1.5">
                  <Building2 size={15} /> Select Target Franchise Opportunity
                </span>
                {!isCustomMode && selectedBrand?.financialProfile?.isComplete && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-wider">
                    <CheckCircle2 size={11} /> Verified Franchisor Model
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={selectedBrandId}
                  onChange={(e) => handleBrandSelect(e.target.value)}
                  className="bg-slate-50 border-2 border-blue-200 hover:border-blue-400 focus:border-blue-600 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 outline-none transition-all shadow-xs cursor-pointer min-w-[280px]"
                >
                  <optgroup label="Verified Franchise Brands (Official Models)">
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.brandName} — {b.industry} {b.financialProfile?.isComplete ? '✓ (Official Model)' : ''}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Investor Sandbox">
                    <option value="custom">★ Custom Franchise Plan (Editable Sandbox)</option>
                  </optgroup>
                </select>

                {!isCustomMode && selectedBrand && (
                  <Link
                    to={`/brands/${selectedBrand.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3.5 py-2.5 rounded-xl border border-blue-100 transition-colors"
                  >
                    View Brand Dossier <ArrowRight size={13} />
                  </Link>
                )}
              </div>

              <p className="text-xs text-slate-500 font-medium">
                {isCustomMode 
                  ? "You are in Custom Sandbox mode. You can edit all input parameters freely."
                  : `Currently viewing authentic financial figures provided directly by ${selectedBrand?.brandName || 'this brand'}. All inputs are read-only to preserve verification standards.`
                }
              </p>
            </div>

            {/* Quick Summary Strip */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="px-3 border-r border-slate-200 last:border-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Investment</span>
                <span className="text-base font-black text-slate-900 font-heading">
                  ₹{totalCapexLakhs.toFixed(1)}L
                </span>
              </div>
              <div className="px-3 border-r border-slate-200 last:border-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Projected ROI</span>
                <span className="text-base font-black text-blue-600 font-heading">
                  {annualRoiPct > 0 ? `${annualRoiPct.toFixed(1)}%` : 'Pending'}
                </span>
              </div>
              <div className="px-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Payback</span>
                <span className="text-base font-black text-emerald-600 font-heading">
                  {paybackPeriodMonths > 0 ? `${paybackPeriodMonths} Mos` : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Missing Data Warning Alert (if any) */}
          {isDataMissing && (
            <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900">
                <strong className="font-bold">Official Financial Data Incomplete:</strong> {selectedBrand?.brandName || 'This brand'} has not yet submitted its complete itemized Capex and OPEX unit economics. Missing values are displayed as <span className="font-black text-amber-800">"Not provided by brand"</span>, and calculations requiring those figures are safely held until the franchisor completes its profile.
              </div>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* EXECUTIVE KPI METRIC TILES */}
        {/* ============================================================ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          {/* Tile 1: Total Initial Investment */}
          <div className="bg-white border border-blue-100 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Total Initial Capex
              </span>
              <BrandFinancialLockBadge brandName={selectedBrand?.brandName} />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-heading block">
                ₹{totalCapexLakhs.toFixed(2)}
              </span>
              <span className="text-xs font-bold text-blue-600">Lakhs Total Outlay</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">
              Sum of franchise fee, civil, interior, machinery & deposits
            </p>
          </div>

          {/* Tile 2: Monthly Net Profit */}
          <div className="bg-white border border-blue-100 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Net Monthly Profit
              </span>
              <BrandFinancialLockBadge brandName={selectedBrand?.brandName} />
            </div>
            <div>
              <span className={`text-2xl sm:text-3xl font-black font-heading block ${monthlyNetProfitRupees >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isDataMissing ? 'Pending' : `₹${monthlyNetProfitRupees.toLocaleString('en-IN')}`}
              </span>
              <span className="text-xs font-bold text-slate-500">
                {isDataMissing ? 'Franchisor input needed' : `≈ ₹${(monthlyNetProfitRupees / 100000).toFixed(2)} Lakhs / mo`}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">
              Net earnings after rent, payroll, COGS, utilities & royalties
            </p>
          </div>

          {/* Tile 3: Projected Annual ROI */}
          <div className="bg-white border border-blue-100 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Annualized ROI
              </span>
              <BrandFinancialLockBadge brandName={selectedBrand?.brandName} />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-blue-700 font-heading block">
                {annualRoiPct > 0 ? `${annualRoiPct.toFixed(1)}%` : 'Pending'}
              </span>
              <span className="text-xs font-bold text-slate-500">
                {annualNetProfitRupees > 0 ? `Annual Profit: ₹${(annualNetProfitRupees / 100000).toFixed(2)}L` : 'Requires verified opex'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">
              Annual net profit divided by total upfront capital outlay
            </p>
          </div>

          {/* Tile 4: Payback Horizon */}
          <div className="bg-white border border-blue-100 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Payback Horizon
              </span>
              <BrandFinancialLockBadge brandName={selectedBrand?.brandName} />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-amber-600 font-heading block">
                {paybackPeriodMonths > 0 ? `${paybackPeriodMonths} Months` : 'Pending'}
              </span>
              <span className="text-xs font-bold text-slate-500">
                {paybackPeriodMonths > 0 ? `≈ ${(paybackPeriodMonths / 12).toFixed(1)} Years Breakeven` : 'Awaiting complete model'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">
              Months of operation required to fully recover capital outlay
            </p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* OFFICIAL BRAND FINANCIAL CARDS (READ-ONLY & LOCKED) */}
        {/* ============================================================ */}
        <div className="space-y-6">
          {/* Section 1: Initial Capex Breakdown */}
          <BrandCapexCard
            financialProfile={effectiveFp as BrandFinancialProfile}
            brandName={selectedBrand?.brandName || customName}
            totalCapexLakhs={totalCapexLakhs}
            isComplete={!isDataMissing}
          />

          {/* Section 2: Revenue Model & Unit Economics */}
          <BrandRevenueCard
            financialProfile={effectiveFp as BrandFinancialProfile}
            brandName={selectedBrand?.brandName || customName}
          />

          {/* Section 3: Monthly Operating Expenses (OPEX) */}
          <BrandOpexCard
            financialProfile={effectiveFp as BrandFinancialProfile}
            brandName={selectedBrand?.brandName || customName}
            grossMonthlyRevenueRupees={grossMonthlyRevenueRupees}
            totalMonthlyOpexRupees={totalMonthlyOpexRupees}
            cogsRupees={cogsRupees}
            royaltyRupees={royaltyRupees}
            isComplete={!isDataMissing}
          />
        </div>

        {/* ============================================================ */}
        {/* VISUAL CHARTS: CAPEX, OPEX, & CASHFLOW RECOVERY */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
          {/* Capex Breakdown Pie */}
          <div className="bg-white border border-blue-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-blue-50 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase font-heading flex items-center gap-2">
                  <PieChartIcon size={18} className="text-blue-600" /> Capital Allocation (Capex)
                </h3>
                <p className="text-xs text-slate-400 font-medium">Breakdown of ₹{totalCapexLakhs.toFixed(2)} Lakhs initial investment</p>
              </div>
              <BrandFinancialLockBadge brandName={selectedBrand?.brandName} />
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
                      <Cell key={`capex-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`₹${Number(value).toFixed(2)} Lakhs`, 'Amount']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly OPEX Breakdown Pie */}
          <div className="bg-white border border-blue-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-blue-50 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase font-heading flex items-center gap-2">
                  <PieChartIcon size={18} className="text-blue-600" /> Monthly Expense Structure (OPEX)
                </h3>
                <p className="text-xs text-slate-400 font-medium">Breakdown of ₹{totalMonthlyOpexRupees.toLocaleString('en-IN')} monthly opex</p>
              </div>
              <BrandFinancialLockBadge brandName={selectedBrand?.brandName} />
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={opexPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {opexPieData.map((entry, index) => (
                      <Cell key={`opex-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Monthly Cost']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 36-Month Cumulative Cashflow Recovery Curve */}
        <div className="bg-white border border-blue-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-50 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 uppercase font-heading flex items-center gap-2">
                <TrendingUp size={18} className="text-blue-600" /> 3-Year Cumulative Cashflow & Breakeven Recovery Curve
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Tracks capital payback trajectory from Month 0 through Month 36 based on official monthly net profit.
              </p>
            </div>
            {paybackPeriodMonths > 0 && (
              <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                Breakeven at Month {paybackPeriodMonths}
              </span>
            )}
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trajectoryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCashflow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="Month" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} unit="L" />
                <Tooltip 
                  formatter={(val: any) => [`₹${Number(val).toFixed(2)} Lakhs`, 'Net Position']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="Net Cash Position (₹L)" 
                  stroke="#2563EB" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorCashflow)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ============================================================ */}
        {/* INTERACTIVE SENSITIVITY & SEEKER FINANCING SIMULATOR */}
        {/* ============================================================ */}
        <SeekerSensitivitySimulator
          financialProfile={effectiveFp as BrandFinancialProfile}
          brandName={selectedBrand?.brandName || customName}
          totalCapexLakhs={totalCapexLakhs}
          baselineRevenueRupees={grossMonthlyRevenueRupees}
          baselineOpexRupees={totalMonthlyOpexRupees}
          baselineProfitRupees={monthlyNetProfitRupees}
          cogsPercentage={effectiveFp.cogsPercentage || 35}
          royaltyPercentage={effectiveFp.royaltyPercentage || 4}
        />

        {/* ============================================================ */}
        {/* EXPORT & ADVISORY ACTION DECK */}
        {/* ============================================================ */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-3xl p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-100 text-xs font-bold uppercase tracking-wider">
              <FileText size={13} /> Formal Due Diligence Dossier
            </div>
            <h3 className="text-2xl font-black font-heading">
              Export {selectedBrand?.brandName || 'Brand'} Financial Projections
            </h3>
            <p className="text-xs text-blue-100 max-w-xl">
              Download certified financial sheets formatted with franchisor verification timestamps, line-item breakdowns, and debt coverage analysis.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              <Download size={15} /> Export Reports
            </button>
            <button
              onClick={() => setIsConsultModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-900/60 hover:bg-blue-900 text-white border border-blue-400/30 text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
            >
              <PhoneCall size={15} /> Book Due Diligence Call
            </button>
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* REPORT DOWNLOAD MODAL */}
      {/* ============================================================ */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-blue-100 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-left space-y-6">
            <div className="flex justify-between items-center border-b border-blue-50 pb-4">
              <div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Official BrizX Export</span>
                <h3 className="text-xl font-black text-slate-900 font-heading">Export Due Diligence Report</h3>
              </div>
              <button 
                onClick={() => setIsReportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl space-y-1">
                <span className="font-black text-slate-900 block text-sm">{selectedBrand?.brandName || customName} Official Model</span>
                <p className="text-slate-500">
                  Includes full Capex schedule (₹{totalCapexLakhs.toFixed(2)}L), Monthly OPEX (₹{totalMonthlyOpexRupees.toLocaleString()}), and 3-year cashflow breakeven forecast.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleExportPDF}
                  disabled={exportStatus === 'generating_pdf'}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Download size={14} /> {exportStatus === 'generating_pdf' ? 'Generating...' : 'Download PDF'}
                </button>
                <button
                  onClick={handleExportExcel}
                  disabled={exportStatus === 'generating_excel'}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Download size={14} /> {exportStatus === 'generating_excel' ? 'Generating...' : 'Download Excel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* EXPERT CONSULTATION BOOKING MODAL */}
      {/* ============================================================ */}
      {isConsultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-blue-100 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-left space-y-6">
            <div className="flex justify-between items-center border-b border-blue-50 pb-4">
              <div>
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">BrizX Advisory Desk</span>
                <h3 className="text-xl font-black text-slate-900 font-heading">Schedule Financial Due Diligence Review</h3>
              </div>
              <button 
                onClick={() => setIsConsultModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {consultSuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                <CheckCircle2 size={44} className="text-emerald-700 mx-auto" />
                <h4 className="text-base font-black text-slate-900 font-heading">Consultation Scheduled!</h4>
                <p className="text-xs text-slate-600">
                  A Senior BrizX Franchise Investment Advisor will contact you within 24 hours to review the unit economics of {selectedBrand?.brandName || 'your selected brand'}.
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
                  <input type="text" defaultValue={user?.name || "Priya Sharma"} className={seekerTheme.input} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input type="text" defaultValue="+91 98765 43210" className={seekerTheme.input} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Brand</label>
                  <input type="text" readOnly value={selectedBrand?.brandName || customName} className={`${seekerTheme.input} bg-slate-100 font-bold`} />
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setConsultSuccess(true)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs cursor-pointer transition-all"
                  >
                    Confirm Due Diligence Booking
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
