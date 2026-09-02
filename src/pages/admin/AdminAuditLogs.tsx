import React, { useState } from 'react';
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs';
import { ConfirmationModal } from '../../components/admin/ConfirmationModal';
import { 
  ShieldAlert, Search, Filter, Download, Trash2, CheckCircle, 
  Terminal, UserCheck, Key, RefreshCw, AlertTriangle, ChevronLeft, ChevronRight, Laptop
} from 'lucide-react';
import UniversalExportModal from '../../components/admin/UniversalExportModal';
import { ExportField } from '../../lib/exportService';

const auditLogFields: ExportField[] = [
  { label: 'Log ID', key: 'id' },
  { label: 'Timestamp', key: 'timestamp' },
  { label: 'Operator Name', key: 'adminName' },
  { label: 'Operator Email', key: 'adminEmail' },
  { label: 'Action Tag', key: 'action' },
  { label: 'Affected Entity / Notes', key: 'entity' },
  { label: 'IP Address', key: 'ipAddress' },
  { label: 'Device UserAgent', key: 'device' },
];

export default function AdminAuditLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [isExportOpen, setIsExportOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [clearConfirm, setClearConfirm] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const initialLogs = [
    { id: 'log-101', timestamp: '2026-08-04 14:32:10', adminName: 'Super Admin', adminEmail: 'admin@brizx.in', action: 'VERIFY_SEEKER', entity: 'Seeker: Vikram Sethi (ID: seeker-1)', ipAddress: '103.21.124.8', device: 'Chrome / macOS San Francisco' },
    { id: 'log-102', timestamp: '2026-08-04 13:15:44', adminName: 'Super Admin', adminEmail: 'admin@brizx.in', action: 'FEATURE_BRAND', entity: 'Brand: Burger Kingsway (ID: brand-1)', ipAddress: '103.21.124.8', device: 'Chrome / macOS San Francisco' },
    { id: 'log-103', timestamp: '2026-08-04 11:04:02', adminName: 'Finance Manager', adminEmail: 'finance@brizx.in', action: 'PROCESS_REFUND', entity: 'Txn: #TXN-8842 (Amount: ₹2,499)', ipAddress: '49.207.180.12', device: 'Firefox / Windows 11' },
    { id: 'log-104', timestamp: '2026-08-04 09:45:00', adminName: 'Ops Admin', adminEmail: 'ops@brizx.in', action: 'UPDATE_SETTINGS', entity: 'System Setting: SMTP Credentials updated', ipAddress: '115.240.90.14', device: 'Safari / macOS Sonoma' },
    { id: 'log-105', timestamp: '2026-08-03 18:22:19', adminName: 'Super Admin', adminEmail: 'admin@brizx.in', action: 'CREATE_PLAN', entity: 'Plan: Enterprise Growth Tier ₹49,999', ipAddress: '103.21.124.8', device: 'Chrome / macOS San Francisco' },
    { id: 'log-106', timestamp: '2026-08-03 16:10:05', adminName: 'Support Specialist', adminEmail: 'support@brizx.in', action: 'RESET_PASSWORD', entity: 'User: brand.owner@chaitime.in', ipAddress: '122.161.45.90', device: 'Edge / Windows 11' },
    { id: 'log-107', timestamp: '2026-08-03 14:00:00', adminName: 'Super Admin', adminEmail: 'admin@brizx.in', action: 'SYSTEM_BACKUP', entity: 'Full Database Snapshot #BK-20260803', ipAddress: '103.21.124.8', device: 'Chrome / macOS San Francisco' }
  ];

  const [logs, setLogs] = useState(initialLogs);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      (log.adminName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.adminEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.entity || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.ipAddress || '').includes(searchQuery);
    
    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getActionBadgeClass = (action: string) => {
    if (action.includes('VERIFY') || action.includes('FEATURE')) return 'bg-green-100 text-green-800 border-green-200';
    if (action.includes('REFUND') || action.includes('RESET')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (action.includes('BACKUP') || action.includes('UPDATE')) return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto">
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-blue-700 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-indigo-700 animate-in fade-in">
          <CheckCircle size={18} className="text-blue-500" />
          <span className="text-xs font-bold uppercase tracking-wider">{toastMessage}</span>
        </div>
      )}

      <AdminBreadcrumbs items={[{ label: 'Super Admin', path: '/admin' }, { label: 'Audit Logs' }]} />

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-indigo-950 mb-2 font-heading flex items-center gap-3">
            <ShieldAlert size={32} className="text-blue-600" /> Platform Audit Trail & System Security
          </h1>
          <p className="text-slate-600">Immutable chronological log of administrative operations, security resets, and data edits.</p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => setIsExportOpen(true)}
            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Download size={14} /> Export Logs
          </button>
          <button 
            onClick={() => setClearConfirm(true)}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-red-200 flex items-center gap-2 cursor-pointer"
          >
            <Trash2 size={14} /> Archive Logs
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center shrink-0">
        <div className="relative flex-1 w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by admin name, email, IP or entity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 w-full md:w-auto">
          <Filter size={14} className="text-slate-400" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Action Type:</span>
          <select 
            value={actionFilter} 
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-transparent text-xs font-bold text-blue-700 outline-none cursor-pointer"
          >
            <option value="ALL">All Actions</option>
            <option value="VERIFY_SEEKER">VERIFY_SEEKER</option>
            <option value="FEATURE_BRAND">FEATURE_BRAND</option>
            <option value="PROCESS_REFUND">PROCESS_REFUND</option>
            <option value="UPDATE_SETTINGS">UPDATE_SETTINGS</option>
            <option value="CREATE_PLAN">CREATE_PLAN</option>
            <option value="RESET_PASSWORD">RESET_PASSWORD</option>
            <option value="SYSTEM_BACKUP">SYSTEM_BACKUP</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col overflow-hidden min-h-0">
        <div className="overflow-x-auto flex-1 min-w-[900px]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/90 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200">
              <tr>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Timestamp</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Admin User</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Action Triggered</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Target Entity / Detail</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">IP Address</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Device / Environment</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.map((log) => (
                <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 text-xs font-bold text-slate-500 font-mono whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-xs font-bold text-indigo-950">{log.adminName}</div>
                    <div className="text-[10px] text-slate-400">{log.adminEmail}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase border ${getActionBadgeClass(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-xs font-semibold text-slate-800">
                    {log.entity}
                  </td>
                  <td className="py-4 px-6 text-xs font-mono font-bold text-slate-600">
                    {log.ipAddress}
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-500 flex items-center gap-1.5 pt-5">
                    <Laptop size={14} className="text-slate-400 shrink-0" />
                    <span>{log.device}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
          <span className="text-xs font-semibold text-slate-500">
            Showing <span className="font-bold text-blue-700">{paginatedLogs.length}</span> of <span className="font-bold text-blue-700">{filteredLogs.length}</span> Audit Records
          </span>

          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold text-blue-700 px-3">Page {currentPage} of {totalPages}</span>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={clearConfirm}
        title="Archive Audit Logs"
        message="Are you sure you want to archive historical log records? Archived logs will be stored in encrypted cold storage."
        confirmText="Archive Logs"
        onConfirm={() => {
          showToast('Historical logs archived safely.');
          setClearConfirm(false);
        }}
        onCancel={() => setClearConfirm(false)}
      />

      <UniversalExportModal 
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title="Administrative Security Audit Trail"
        filenamePrefix="Security-Audit-Logs"
        currentData={filteredLogs}
        allData={logs}
        fields={auditLogFields}
      />
    </div>
  );
}
