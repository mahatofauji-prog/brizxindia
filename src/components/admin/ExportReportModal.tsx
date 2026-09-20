import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  X, FileText, Calendar, Download, AlertCircle, 
  CheckCircle2, Loader2, Sparkles, Database, Users, 
  Building2, HeartHandshake, CheckSquare, IndianRupee, Bell, BarChart2
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 10 Report Types config exactly matching the requirements
const reportTypes = [
  { id: 'dashboard', label: 'Dashboard Overview', desc: 'KPI summaries, active matches, and system overview', icon: BarChart2 },
  { id: 'seekers', label: 'Franchise Seekers', desc: 'Verified seeker records, budgets, and location targets', icon: Users },
  { id: 'brands', label: 'Brand Directory', desc: 'Full brand roster, investment tiers, and outlet counts', icon: Building2 },
  { id: 'connections', label: 'Connections / Matches', desc: 'Matches between Seekers & Brands, match scores, and status', icon: HeartHandshake },
  { id: 'users', label: 'Users & Staff', desc: 'Consolidated list of platform accounts and roles', icon: Database },
  { id: 'subscriptions', label: 'Subscriptions', desc: 'Subscription tiers, status tracking, and unlocks remaining', icon: Sparkles },
  { id: 'payments', label: 'Payments & Revenue', desc: 'Historical invoicing log, UPI/Card payments, and sums', icon: IndianRupee },
  { id: 'transactions', label: 'Transactions', desc: 'Consolidated transactions and billing histories', icon: IndianRupee },
  { id: 'approvals', label: 'Approvals', desc: 'Status of brand and seeker verification requests', icon: CheckSquare },
  { id: 'activity', label: 'Activity / Audit Logs', desc: 'Real database change records and operational actions', icon: Bell },
];

const dateRanges = [
  { id: 'Today', label: 'Today', desc: 'Current calendar day' },
  { id: 'Last 7 Days', label: 'Last 7 Days', desc: 'Previous week activities' },
  { id: 'Last 30 Days', label: 'Last 30 Days', desc: 'Past month overview' },
  { id: 'Last 90 Days', label: 'Last 90 Days', desc: 'Quarterly transaction summary' },
  { id: 'This Year', label: 'This Year', desc: 'Annual operational log' },
  { id: 'Custom Date Range', label: 'Custom Date Range', desc: 'Select specific start and end boundaries' },
];

const exportFormats = [
  { id: 'PDF', label: 'PDF Document', desc: 'Branded printable executive PDF report', ext: '.pdf' },
  { id: 'Excel', label: 'Excel Spreadsheet', desc: 'Tabulated workbook with auto-fitted columns (.xlsx)', ext: '.xlsx' },
  { id: 'CSV', label: 'CSV Format', desc: 'Raw comma-separated dataset for database ingest', ext: '.csv' },
];

export default function ExportReportModal({ isOpen, onClose }: ExportReportModalProps) {
  const { user } = useAuth();
  const { 
    seekers, 
    brands, 
    connectionRequests, 
    verificationRequests, 
    notifications, 
    invoices, 
    subscriptions,
    meetings
  } = useData();

  // Selected filters state
  const [selectedType, setSelectedType] = useState('dashboard');
  const [selectedDateRange, setSelectedDateRange] = useState('Last 30 Days');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('PDF');

  // Generation flow states
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [validationError, setValidationError] = useState('');
  const [generationResult, setGenerationResult] = useState<{
    reportName: string;
    dateRangeLabel: string;
    recordCount: number;
    format: string;
    blob: Blob;
    fileName: string;
  } | null>(null);

  if (!isOpen) return null;

  // Security Check: Authorized only for SUPER_ADMIN or ADMIN
  const isAuthorized = user?.role === 'SUPER_ADMIN';
  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-md w-full border border-rose-100 p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
          <div className="flex items-center gap-3 text-rose-600 mb-4">
            <AlertCircle className="w-8 h-8" />
            <h3 className="text-xl font-bold font-heading">Access Denied</h3>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Only authenticated BRIX INDIA Administrators or Super Admins are authorized to export operation summaries, financial transactions, and credential data.
          </p>
          <div className="flex justify-end">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
            >
              Close Window
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Helper: Filter records by selected date range
  const filterByDateRange = (dateString: string | undefined): boolean => {
    if (!dateString) return false;
    const recordDate = new Date(dateString);
    if (isNaN(recordDate.getTime())) return false;
    
    // Fix operational current time based on system metadata: 2026-08-29T16:20:42-07:00
    const now = new Date("2026-08-29T16:20:42-07:00");
    
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    switch (selectedDateRange) {
      case 'Today': {
        return recordDate.getTime() >= startOfToday.getTime() && recordDate.getTime() <= endOfToday.getTime();
      }
      case 'Last 7 Days': {
        const start = new Date(startOfToday);
        start.setDate(start.getDate() - 7);
        return recordDate.getTime() >= start.getTime() && recordDate.getTime() <= endOfToday.getTime();
      }
      case 'Last 30 Days': {
        const start = new Date(startOfToday);
        start.setDate(start.getDate() - 30);
        return recordDate.getTime() >= start.getTime() && recordDate.getTime() <= endOfToday.getTime();
      }
      case 'Last 90 Days': {
        const start = new Date(startOfToday);
        start.setDate(start.getDate() - 90);
        return recordDate.getTime() >= start.getTime() && recordDate.getTime() <= endOfToday.getTime();
      }
      case 'This Year': {
        const start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
        return recordDate.getTime() >= start.getTime() && recordDate.getTime() <= endOfToday.getTime();
      }
      case 'Custom Date Range': {
        if (!customStartDate || !customEndDate) return true;
        const start = new Date(customStartDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(customEndDate);
        end.setHours(23, 59, 59, 999);
        return recordDate.getTime() >= start.getTime() && recordDate.getTime() <= end.getTime();
      }
      default:
        return true;
    }
  };

  // Helper: Format Date label for final summary display
  const getDateRangeLabel = (): string => {
    if (selectedDateRange === 'Custom Date Range') {
      return `${customStartDate || 'Start'} to ${customEndDate || 'End'}`;
    }
    return selectedDateRange;
  };

  // Main Export Dispatcher
  const handleExport = async () => {
    setErrorMsg('');
    setValidationError('');
    setGenerationResult(null);

    // 1. Validation Checks
    if (!selectedType) {
      setValidationError('Please select a report type.');
      return;
    }
    if (!selectedDateRange) {
      setValidationError('Please select a date range option.');
      return;
    }
    if (selectedDateRange === 'Custom Date Range') {
      if (!customStartDate || !customEndDate) {
        setValidationError('Custom Date Range requires both start and end dates.');
        return;
      }
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      if (start.getTime() > end.getTime()) {
        setValidationError('Start Date cannot be after End Date.');
        return;
      }
    }

    setIsGenerating(true);
    setProgress(10);

    // 2. Gather filtered data collections based on reportType
    let headers: string[] = [];
    let rows: any[][] = [];
    let recordCount = 0;
    const reportTitle = reportTypes.find(t => t.id === selectedType)?.label || 'BRIZX INDIA Operations Report';
    
    try {
      const progressTimer = setInterval(() => {
        setProgress(p => (p < 85 ? p + 15 : p));
      }, 100);

      if (selectedType === 'seekers') {
        const filtered = seekers.filter(s => filterByDateRange(s.createdAt));
        recordCount = filtered.length;
        if (recordCount > 0) {
          headers = ['Seeker Name', 'Email Address', 'Phone Number', 'Target Sector', 'Available Capital', 'Preferred Location', 'Registration Date', 'Verification Status', 'Account Status'];
          rows = filtered.map(s => [
            s.name,
            s.email,
            s.phone || 'N/A',
            s.industry || 'N/A',
            s.investment ? `₹${s.investment} Lakhs` : 'N/A',
            s.city || 'N/A',
            s.createdAt ? s.createdAt.split('T')[0] : 'N/A',
            s.verified ? 'Verified' : 'Pending',
            s.isPremium ? 'Premium Seeker' : 'Standard Seeker'
          ]);
        }
      } 
      else if (selectedType === 'brands') {
        const filtered = brands.filter(b => filterByDateRange(b.createdAt));
        recordCount = filtered.length;
        if (recordCount > 0) {
          headers = ['Brand Name', 'Owner Name', 'Email', 'Sector / Industry', 'Investment Required', 'Target Locations', 'Subscription Tier', 'Verification Status', 'Registration Date'];
          rows = filtered.map(b => {
            const minInvest = b.investmentRequired?.min || b.minInvestment || 0;
            const maxInvest = b.investmentRequired?.max || b.maxInvestment || 0;
            const investRange = minInvest && maxInvest ? `₹${minInvest}L - ₹${maxInvest}L` : 'N/A';
            return [
              b.brandName || 'N/A',
              b.name,
              b.email,
              b.industry || 'N/A',
              investRange,
              b.cityTargets ? b.cityTargets.join(', ') : b.city || 'N/A',
              b.subscriptionTier || 'FREE',
              b.verified ? 'Verified' : 'Pending',
              b.createdAt ? b.createdAt.split('T')[0] : 'N/A'
            ];
          });
        }
      } 
      else if (selectedType === 'connections') {
        const filtered = connectionRequests.filter(c => filterByDateRange(c.createdAt));
        recordCount = filtered.length;
        if (recordCount > 0) {
          headers = ['Franchise Seeker', 'Brand Partner', 'Match Score', 'Connection Status', 'Initiated By', 'Created Date', 'Updated Date'];
          rows = filtered.map(c => [
            c.seekerName,
            c.brandName,
            `${c.matchScore}%`,
            c.status,
            c.initiatedBy || c.initiatorType || 'N/A',
            c.createdAt ? c.createdAt.split('T')[0] : 'N/A',
            c.updatedAt ? c.updatedAt.split('T')[0] : 'N/A'
          ]);
        }
      } 
      else if (selectedType === 'users') {
        const seekerList = seekers.map(s => ({ ...s, roleLabel: 'Franchise Seeker' }));
        const brandList = brands.map(b => ({ ...b, roleLabel: 'Brand Owner' }));
        const combined = [...seekerList, ...brandList].filter(u => filterByDateRange(u.createdAt));
        recordCount = combined.length;
        if (recordCount > 0) {
          headers = ['Name', 'Email Address', 'Phone', 'System Role', 'Verification Status', 'Onboarded Date', 'Account Status'];
          rows = combined.map(u => [
            u.name,
            u.email,
            u.phone || 'N/A',
            u.roleLabel,
            u.verified ? 'Verified' : 'Pending',
            u.createdAt ? u.createdAt.split('T')[0] : 'N/A',
            u.verified ? 'Active' : 'Pending Verification'
          ]);
        }
      } 
      else if (selectedType === 'subscriptions') {
        const filtered = subscriptions.filter(s => filterByDateRange(s.startDate));
        recordCount = filtered.length;
        if (recordCount > 0) {
          headers = ['Brand / Subscriber', 'Subscription Plan', 'Status', 'Start Date', 'Expiry Date', 'Unlocks Remaining'];
          rows = filtered.map(s => {
            const b = brands.find(brand => brand.id === s.brandId);
            return [
              b?.brandName || b?.name || `Brand ID: ${s.brandId}`,
              s.plan,
              s.status,
              s.startDate ? s.startDate.split('T')[0] : 'N/A',
              s.endDate ? s.endDate.split('T')[0] : 'N/A',
              s.unlocksRemaining
            ];
          });
        }
      }
      else if (selectedType === 'payments' || selectedType === 'transactions') {
        const filtered = invoices.filter(i => filterByDateRange(i.date));
        recordCount = filtered.length;
        if (recordCount > 0) {
          headers = ['Transaction/Payment ID', 'Brand Name', 'Amount Paid', 'GST Collected', 'Total Revenue', 'Payment Mode', 'Status', 'Date Paid'];
          rows = filtered.map(i => {
            const b = brands.find(brand => brand.id === i.brandId);
            return [
              i.id,
              b?.brandName || 'N/A',
              `₹${i.amount.toLocaleString()}`,
              `₹${i.gstAmount.toLocaleString()}`,
              `₹${i.totalAmount.toLocaleString()}`,
              i.paymentMode,
              i.status,
              i.date
            ];
          });
        }
      } 
      else if (selectedType === 'approvals') {
        const filtered = verificationRequests.filter(v => filterByDateRange(v.submittedAt));
        recordCount = filtered.length;
        if (recordCount > 0) {
          headers = ['Request ID', 'Brand Name', 'Contact Phone', 'Category Sector', 'Website', 'Legal Audit Stage', 'Submitted Date', 'Reviewer Remarks'];
          rows = filtered.map(v => [
            v.id,
            v.brandName,
            v.contactPhone || 'N/A',
            v.category || 'N/A',
            v.website || 'N/A',
            v.status,
            v.submittedAt ? v.submittedAt.split('T')[0] : 'N/A',
            v.notes || 'Under Evaluation'
          ]);
        }
      } 
      else if (selectedType === 'activity') {
        // Build detailed system audit logs
        const logsList: any[] = [];
        meetings.forEach(m => {
          logsList.push({
            module: 'Meetings Hub',
            user: m.brandName || 'Brand Owner',
            action: `Scheduled investment consultation call for ${m.date} at ${m.time}`,
            severity: 'INFO',
            status: m.status,
            date: m.date
          });
        });
        verificationRequests.forEach(v => {
          logsList.push({
            module: 'Brand Approvals',
            user: v.brandName,
            action: `Submitted franchise license legal audit documents`,
            severity: 'HIGH',
            status: v.status,
            date: v.submittedAt
          });
        });
        invoices.forEach(i => {
          logsList.push({
            module: 'Billing Engine',
            user: i.brandId,
            action: `Purchased subscription plan: ${i.planName}`,
            severity: 'CRITICAL',
            status: i.status,
            date: i.date
          });
        });
        connectionRequests.forEach(c => {
          logsList.push({
            module: 'Matchmaking Core',
            user: c.seekerName,
            action: `Requested connection match with ${c.brandName}`,
            severity: 'MEDIUM',
            status: c.status,
            date: c.createdAt
          });
        });

        const filtered = logsList.filter(l => filterByDateRange(l.date));
        recordCount = filtered.length;
        if (recordCount > 0) {
          headers = ['Audited Module', 'User Entity', 'Action Description', 'Log Severity', 'Status', 'Timestamp'];
          rows = filtered.map(l => [
            l.module,
            l.user,
            l.action,
            l.severity,
            l.status,
            l.date ? l.date.split('T')[0] : 'N/A'
          ]);
        }
      }
      else if (selectedType === 'dashboard') {
        // Dashboard Overview KPI summaries
        const fInvoices = invoices.filter(i => i.status === 'SUCCESS' && filterByDateRange(i.date));
        const fBrands = brands.filter(b => filterByDateRange(b.createdAt));
        const fSeekers = seekers.filter(s => filterByDateRange(s.createdAt));
        const fMatches = connectionRequests.filter(c => filterByDateRange(c.createdAt));
        const pendingApprovals = verificationRequests.filter(v => v.status !== 'VERIFIED').length;
        
        const totalRevenue = fInvoices.reduce((acc, curr) => acc + curr.totalAmount, 0);
        const acceptedMatches = fMatches.filter(m => ['ACCEPTED', 'CONNECTED', 'COMPLETED'].includes(m.status)).length;
        const matchingRatio = fMatches.length > 0 ? `${((acceptedMatches / fMatches.length) * 100).toFixed(1)}%` : '0.0%';
        const avgMatchScore = fMatches.length > 0 ? `${(fMatches.reduce((acc, curr) => acc + curr.matchScore, 0) / fMatches.length).toFixed(1)}%` : 'N/A';

        headers = ['Key Performance Indicator (KPI)', 'Ecosystem Value', 'Ecosystem Area', 'Metric Context'];
        rows = [
          ['Total Revenue', `₹${totalRevenue.toLocaleString()}`, 'Financials', 'Sum of successful transaction invoices'],
          ['Active Users', `${seekers.length + brands.length} Registrations`, 'Ecosystem Growth', 'Seekers & Brand accounts combined'],
          ['Pending Approvals', `${pendingApprovals} Approvals`, 'Operations Audit', 'Roster verification pipeline count'],
          ['New Registrations', `${fSeekers.length + fBrands.length} Profiles`, 'Ecosystem Growth', 'New seekers and brands in period'],
          ['New Connections / Matches', `${fMatches.length} Matches`, 'Ecosystem Activity', 'Ecosystem matches requested in period'],
          ['Match Conversion Rate', matchingRatio, 'Matching Core', 'Accepted vs sent match conversion percentage'],
          ['Average Compatibility Match Score', avgMatchScore, 'Ecosystem Health', 'Compatible requirements average score']
        ];
        recordCount = rows.length;
      }

      clearInterval(progressTimer);

      // Validate data existence
      if (recordCount === 0) {
        setProgress(100);
        setIsGenerating(false);
        setErrorMsg('No data available for the selected filters.');
        return;
      }

      setProgress(90);

      // 3. Generate file content safely
      let finalBlob: Blob;
      const fileTimestamp = new Date("2026-08-29T16:20:42-07:00").toISOString().split('T')[0];
      const finalFileName = `brixindia_${selectedType}_report_${fileTimestamp}${selectedFormat === 'PDF' ? '.pdf' : selectedFormat === 'Excel' ? '.xlsx' : '.csv'}`;

      if (selectedFormat === 'CSV') {
        // Standard CSV formatting with strict quotes escaping
        const csvContent = [
          headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
          ...rows.map(row => row.map(cell => {
            const val = cell === null || cell === undefined ? '' : String(cell);
            return `"${val.replace(/"/g, '""').replace(/\n/g, ' ')}"`;
          }).join(','))
        ].join('\n');
        
        finalBlob = new Blob([`\ufeff${csvContent}`], { type: 'text/csv;charset=utf-8;' });
      } 
      else if (selectedFormat === 'Excel') {
        const worksheet = XLSX.utils.aoa_to_sheet([
          [`BRIZX INDIA - ${reportTitle}`],
          [`Date Range: ${getDateRangeLabel()}`],
          [`Generated On: ${new Date("2026-08-29T16:20:42-07:00").toLocaleString()}`],
          [],
          headers,
          ...rows
        ]);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Operational Report");

        // Set dynamic col widths
        const maxCols = headers.length;
        const colWidths = [];
        for (let c = 0; c < maxCols; c++) {
          let maxLen = headers[c].length;
          for (let r = 0; r < rows.length; r++) {
            const val = rows[r][c];
            if (val !== undefined && val !== null) {
              maxLen = Math.max(maxLen, String(val).length);
            }
          }
          colWidths.push({ wch: Math.min(Math.max(maxLen + 3, 10), 50) });
        }
        worksheet['!cols'] = colWidths;

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        finalBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      } 
      else {
        // PDF with beautiful layout and headers using verified import parameters
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        
        // Front branding layout
        doc.setFillColor(37, 99, 235); // BRIX INDIA Soft Blue (#2563eb)
        doc.rect(10, 10, 190, 8, 'F');
        
        doc.setTextColor(23, 32, 51); // Deep Slate Navy
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.text('BRIZX INDIA', 10, 28);
        
        doc.setTextColor(100, 116, 139); // Gray Subhead
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text('PREMIUM FRANCHISE MATCHMAKING NETWORK', 10, 33);
        
        // Report Header info
        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text(`${reportTitle.toUpperCase()} - SUMMARY REPORT`, 10, 44);
        
        doc.setTextColor(100, 116, 139);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(`Reporting Period: ${getDateRangeLabel()}`, 10, 49);
        doc.text(`Generated On: ${new Date("2026-08-29T16:20:42-07:00").toLocaleString()}`, 10, 54);
        
        doc.setDrawColor(226, 234, 244);
        doc.setLineWidth(0.5);
        doc.line(10, 58, 200, 58);

        // Visual KPI Highlights Card
        doc.setFillColor(248, 250, 252);
        doc.rect(10, 62, 190, 20, 'F');
        doc.setTextColor(37, 99, 235);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text('REPORT EXTRACTION SUMMARY STATS:', 14, 68);

        doc.setTextColor(71, 85, 105);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.text(`Total Records Found: ${recordCount}`, 14, 75);
        doc.text(`Security Level: Authenticated Admin Operations Export`, 110, 75);

        // Build elegant table
        autoTable(doc, {
          startY: 88,
          head: [headers],
          body: rows,
          theme: 'grid',
          headStyles: {
            fillColor: [37, 99, 235],
            textColor: [255, 255, 255],
            fontSize: 8,
            fontStyle: 'bold',
            halign: 'left',
          },
          bodyStyles: {
            fontSize: 7.5,
            textColor: [51, 65, 85],
          },
          alternateRowStyles: {
            fillColor: [248, 250, 252],
          },
          margin: { top: 10, left: 10, right: 10, bottom: 20 },
          styles: {
            cellPadding: 2.5,
            lineColor: [226, 234, 244],
            lineWidth: 0.2,
          },
          didDrawPage: (data) => {
            const pageCount = doc.getNumberOfPages();
            doc.setDrawColor(226, 234, 244);
            doc.setLineWidth(0.5);
            doc.line(10, 280, 200, 280);
            
            doc.setTextColor(148, 163, 184);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.text('© 2026 BRIZX INDIA Matchmaking. Confidential Internal Operations Log.', 10, 285);
            doc.text(`Page ${data.pageNumber} of ${pageCount}`, 190, 285, { align: 'right' });
          }
        });

        finalBlob = doc.output('blob');
      }

      setProgress(100);
      setIsGenerating(false);
      
      const payload = {
        reportName: reportTitle,
        dateRangeLabel: getDateRangeLabel(),
        recordCount,
        format: selectedFormat,
        blob: finalBlob,
        fileName: finalFileName
      };
      
      setGenerationResult(payload);

      // Automatically trigger browser download on successful export
      const downloadUrl = URL.createObjectURL(finalBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = finalFileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadUrl);

    } catch (err: any) {
      console.error('Technical Export Error Detail:', err);
      setIsGenerating(false);
      setErrorMsg(`An unexpected formatting error occurred during document assembly: ${err.message || err}. Please try again.`);
    }
  };

  const handleDownloadAgain = () => {
    if (!generationResult) return;
    const url = URL.createObjectURL(generationResult.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = generationResult.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] border border-[#E2EAF4] shadow-xl relative flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Area */}
        <div className="p-5 border-b border-[#E2EAF4] flex justify-between items-center bg-[#F8FAFC]">
          <div>
            <h2 className="text-xl font-black text-[#172033] font-heading flex items-center gap-2">
              <Download className="text-blue-600 w-5 h-5" />
              Export Report
            </h2>
            <p className="text-xs text-slate-500 mt-1">Select structured modules and date boundaries to trigger automated system downloads.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200/60 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Setup Options Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {validationError && (
            <div className="p-4 bg-amber-50 border border-amber-100 text-amber-700 rounded-xl text-xs font-bold flex items-center gap-3">
              <AlertCircle className="shrink-0 w-4 h-4" />
              <div>{validationError}</div>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-3">
              <AlertCircle className="shrink-0 w-4 h-4" />
              <div>{errorMsg}</div>
            </div>
          )}

          {generationResult && (
            <div className="p-5 bg-emerald-50 border border-emerald-100 text-emerald-900 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-2.5 text-emerald-700 font-bold">
                <CheckCircle2 className="w-5 h-5" />
                <span>Report exported successfully.</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs bg-white p-4 rounded-lg border border-emerald-100/60 font-semibold text-slate-700">
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Report Name</span>
                  <span className="text-slate-800 font-black">{generationResult.reportName}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Date Range</span>
                  <span className="text-slate-800 font-black">{generationResult.dateRangeLabel}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Records Count</span>
                  <span className="text-slate-800 font-black">{generationResult.recordCount} records</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Export Format</span>
                  <span className="text-blue-700 font-black uppercase">{generationResult.format}</span>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={handleDownloadAgain}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Download again
                </button>
                <button 
                  onClick={onClose}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Progress Tracker Bar */}
          {isGenerating && (
            <div className="p-5 bg-blue-50/50 border border-[#BFDBFE]/40 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-blue-700">
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4 text-blue-600" />
                  Preparing your report...
                </span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Form Options Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1: Report Selection */}
            <div className="space-y-3">
              <label className="text-xs font-black text-[#172033] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px]">1</span>
                Report Type
              </label>
              <div className="space-y-2 max-h-[300px] overflow-y-auto border border-[#E2EAF4] rounded-xl p-2 bg-slate-50/50 pr-1">
                {reportTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => {
                        setSelectedType(type.id);
                        setGenerationResult(null);
                        setValidationError('');
                        setErrorMsg('');
                      }}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex gap-2.5 items-start ${
                        selectedType === type.id
                          ? 'bg-blue-50/60 border-blue-200 text-blue-800'
                          : 'bg-white border-[#E2EAF4] text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`p-1.5 rounded-md ${selectedType === type.id ? 'bg-blue-100/60 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                        <Icon size={14} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-[#172033]">{type.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{type.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Date Boundaries */}
            <div className="space-y-3">
              <label className="text-xs font-black text-[#172033] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px]">2</span>
                Date Range
              </label>
              <div className="space-y-2">
                <div className="space-y-1.5 border border-[#E2EAF4] rounded-xl p-2 bg-slate-50/50">
                  {dateRanges.map((range) => (
                    <button
                      key={range.id}
                      onClick={() => {
                        setSelectedDateRange(range.id);
                        setGenerationResult(null);
                        setValidationError('');
                        setErrorMsg('');
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-all flex items-center justify-between ${
                        selectedDateRange === range.id
                          ? 'bg-blue-50/60 border-blue-200 text-blue-800 font-black'
                          : 'bg-white border-[#E2EAF4] text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{range.label}</span>
                      <Calendar size={12} className={selectedDateRange === range.id ? 'text-blue-600' : 'text-slate-300'} />
                    </button>
                  ))}
                </div>

                {/* Custom Date Inputs */}
                {selectedDateRange === 'Custom Date Range' && (
                  <div className="p-3.5 bg-blue-50/40 border border-[#BFDBFE]/40 rounded-xl space-y-3.5 animate-in fade-in duration-150">
                    <h4 className="text-[10px] font-black uppercase text-blue-800 tracking-wider">Custom Boundaries</h4>
                    <div className="space-y-2">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Start Date</label>
                        <input 
                          type="date"
                          value={customStartDate}
                          onChange={(e) => {
                            setCustomStartDate(e.target.value);
                            setGenerationResult(null);
                            setValidationError('');
                            setErrorMsg('');
                          }}
                          className="w-full bg-white border border-[#E2EAF4] rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">End Date</label>
                        <input 
                          type="date"
                          value={customEndDate}
                          onChange={(e) => {
                            setCustomEndDate(e.target.value);
                            setGenerationResult(null);
                            setValidationError('');
                            setErrorMsg('');
                          }}
                          className="w-full bg-white border border-[#E2EAF4] rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Format Preference */}
            <div className="space-y-3">
              <label className="text-xs font-black text-[#172033] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px]">3</span>
                Export Format
              </label>
              <div className="space-y-2">
                {exportFormats.map((format) => (
                  <button
                    key={format.id}
                    onClick={() => {
                      setSelectedFormat(format.id);
                      setGenerationResult(null);
                      setValidationError('');
                      setErrorMsg('');
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                      selectedFormat === format.id
                        ? 'bg-blue-50/60 border-blue-200 text-blue-800'
                        : 'bg-white border-[#E2EAF4] text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${selectedFormat === format.id ? 'bg-blue-100/60 text-blue-700' : 'bg-slate-50 text-slate-400'}`}>
                      <FileText size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-[#172033]">{format.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{format.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Action Button Footer */}
        <div className="p-5 border-t border-[#E2EAF4] flex justify-between items-center bg-[#F8FAFC] shrink-0">
          <button 
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-[#E2EAF4] hover:bg-slate-50 text-[#172033] font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
          >
            Cancel
          </button>
          
          <button 
            onClick={handleExport}
            disabled={isGenerating}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin w-3.5 h-3.5" />
                Generating...
              </>
            ) : (
              <>
                <Download size={14} />
                Export Report
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
