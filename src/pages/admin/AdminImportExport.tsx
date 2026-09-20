import React, { useState } from 'react';
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs';
import { 
  FileSpreadsheet, Upload, Download, CheckCircle, AlertCircle, 
  FileText, ArrowRight, Layers, Table, RefreshCw, X
} from 'lucide-react';

export default function AdminImportExport() {
  const [activeTab, setActiveTab] = useState<'IMPORT' | 'EXPORT'>('IMPORT');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [importTarget, setImportTarget] = useState<'SEEKERS' | 'BRANDS'>('SEEKERS');
  const [isSimulatingValidation, setIsSimulatingValidation] = useState(false);
  const [validationReport, setValidationReport] = useState<any | null>(null);

  const [exportTarget, setExportTarget] = useState('SEEKERS');
  const [exportFormat, setExportFormat] = useState('EXCEL');
  const [dateRange, setDateRange] = useState('ALL');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSimulateUpload = () => {
    setIsSimulatingValidation(true);
    setTimeout(() => {
      setIsSimulatingValidation(false);
      setValidationReport({
        totalRows: 50,
        validRows: 47,
        invalidRows: 3,
        errors: [
          { row: 12, field: 'Email', issue: 'Invalid email syntax (missing @domain)' },
          { row: 28, field: 'Phone', issue: 'Phone number contains less than 10 digits' },
          { row: 41, field: 'Investment', issue: 'Non-numeric character in liquid capital' }
        ]
      });
      showToast('Validation pre-check completed! Review report below.');
    }, 1800);
  };

  const handleExecuteImport = () => {
    setValidationReport(null);
    showToast(`Successfully imported ${validationReport?.validRows || 47} records into database!`);
  };

  const handleTriggerExport = () => {
    showToast(`Generating ${exportFormat} export for ${exportTarget}... Download starting.`);
  };

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto">
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-blue-700 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-indigo-700 animate-in fade-in">
          <CheckCircle size={18} className="text-blue-500" />
          <span className="text-xs font-bold uppercase tracking-wider">{toastMessage}</span>
        </div>
      )}

      <AdminBreadcrumbs items={[{ label: 'Super Admin', path: '/admin' }, { label: 'Import & Export Engine' }]} />

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-indigo-950 mb-2 font-heading flex items-center gap-3">
            <FileSpreadsheet size={32} className="text-blue-600" /> Data Import & Bulk Export Engine
          </h1>
          <p className="text-slate-600">Bulk upload seekers/brands with automated pre-validation, or export platform datasets.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 shrink-0 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('IMPORT')}
          className={`pb-4 px-4 text-xs font-bold uppercase tracking-wider transition-colors relative cursor-pointer flex items-center gap-2 ${activeTab === 'IMPORT' ? 'text-indigo-950 font-black' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Upload size={16} /> Bulk Data Import
          {activeTab === 'IMPORT' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('EXPORT')}
          className={`pb-4 px-4 text-xs font-bold uppercase tracking-wider transition-colors relative cursor-pointer flex items-center gap-2 ${activeTab === 'EXPORT' ? 'text-indigo-950 font-black' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Download size={16} /> Data Export Studio
          {activeTab === 'EXPORT' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
        </button>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto min-h-0 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 md:p-8">
        {activeTab === 'IMPORT' ? (
          <div className="max-w-3xl space-y-6">
            <h3 className="text-lg font-black text-indigo-950 font-heading">Step 1: Select Import Target & Download Template</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setImportTarget('SEEKERS')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${importTarget === 'SEEKERS' ? 'bg-blue-50 border-blue-600 text-indigo-950 font-bold' : 'bg-slate-50 border-slate-200'}`}
              >
                <span className="block text-sm font-bold mb-1">Franchise Seekers</span>
                <span className="text-xs text-slate-500">Name, Email, Phone, Budget, Target City</span>
              </button>
              <button 
                onClick={() => setImportTarget('BRANDS')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${importTarget === 'BRANDS' ? 'bg-blue-50 border-blue-600 text-indigo-950 font-bold' : 'bg-slate-50 border-slate-200'}`}
              >
                <span className="block text-sm font-bold mb-1">Brand Listings</span>
                <span className="text-xs text-slate-500">Brand Name, Outlets, Investment, Royalty</span>
              </button>
            </div>

            {/* Drag Drop */}
            <div className="border-2 border-dashed border-blue-200 bg-blue-50/40 rounded-3xl p-10 text-center">
              <Upload size={48} className="mx-auto text-blue-600 mb-3 opacity-80" />
              <h4 className="font-bold text-base text-indigo-950 mb-1">Upload CSV or Excel File</h4>
              <p className="text-xs text-slate-500 mb-6">Supports .csv, .xlsx up to 25MB</p>

              <button 
                onClick={handleSimulateUpload}
                disabled={isSimulatingValidation}
                className="px-8 py-3 bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-blue-800 transition-all cursor-pointer"
              >
                {isSimulatingValidation ? 'Running Pre-Validation Audit...' : 'Select File & Pre-Validate'}
              </button>
            </div>

            {/* Pre Validation Report */}
            {validationReport && (
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 animate-in fade-in space-y-4">
                <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                  <div>
                    <h4 className="font-bold text-indigo-950 text-base">Validation Audit Pre-Check Report</h4>
                    <p className="text-xs text-slate-500">Inspected {validationReport.totalRows} records prior to database ingestion.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg">
                      {validationReport.validRows} Valid
                    </span>
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg">
                      {validationReport.invalidRows} Errors
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Identified Row Exceptions</span>
                  {validationReport.errors.map((err: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-red-100 text-xs">
                      <AlertCircle size={16} className="text-red-500 shrink-0" />
                      <span className="font-bold text-slate-700">Row {err.row} ({err.field}):</span>
                      <span className="text-slate-500">{err.issue}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                  <button 
                    onClick={handleExecuteImport}
                    className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <CheckCircle size={16} /> Ingest {validationReport.validRows} Valid Records
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* EXPORT STUDIO */
          <div className="max-w-2xl space-y-6">
            <h3 className="text-lg font-black text-indigo-950 font-heading">Configure Dataset Export</h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Dataset Target</label>
                <select 
                  value={exportTarget}
                  onChange={(e) => setExportTarget(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-indigo-950 outline-none cursor-pointer"
                >
                  <option value="SEEKERS">All Franchise Seekers (Full Contact & KYC)</option>
                  <option value="BRANDS">Brand Directory & Subscription Logs</option>
                  <option value="TRANSACTIONS">Payment Transactions & Invoices</option>
                  <option value="AUDIT">System Security Audit Logs</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Export Format</label>
                  <select 
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-indigo-950 outline-none cursor-pointer"
                  >
                    <option value="EXCEL">Microsoft Excel (.xlsx)</option>
                    <option value="CSV">Comma Separated Values (.csv)</option>
                    <option value="PDF">Encrypted PDF Report (.pdf)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Timeframe Filter</label>
                  <select 
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-indigo-950 outline-none cursor-pointer"
                  >
                    <option value="ALL">All Time</option>
                    <option value="30">Last 30 Days</option>
                    <option value="90">This Quarter</option>
                    <option value="YEAR">Current Fiscal Year</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={handleTriggerExport}
                className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-6"
              >
                <Download size={16} className="text-blue-400" /> Export & Download File
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
