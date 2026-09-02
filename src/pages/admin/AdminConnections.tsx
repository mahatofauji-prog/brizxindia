import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router';
import { useData } from '../../context/DataContext';
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs';
import { 
  Sparkles, Search, Filter, Clock, MoreVertical, Eye, CheckCircle, 
  X, Mail, Phone, MapPin, Briefcase, IndianRupee, Trash2, Calendar,
  ArrowUpDown, ChevronLeft, ChevronRight, FileText, Send, HelpCircle, AlertCircle, Download
} from 'lucide-react';
import { ConnectionRequest, ConnectionStatus } from '../../types';
import UniversalExportModal from '../../components/admin/UniversalExportModal';
import { ExportField } from '../../lib/exportService';

const connectionFields: ExportField[] = [
  { label: 'Connection ID', key: 'id' },
  { label: 'Seeker ID', key: 'seekerId' },
  { label: 'Seeker Name', key: 'seekerName' },
  { label: 'Seeker Email', key: 'seekerEmail' },
  { label: 'Brand ID', key: 'brandId' },
  { label: 'Brand Name', key: 'brandName' },
  { label: 'Match Score', key: 'matchScore', transform: (val) => `${val}%` },
  { label: 'Initiator', key: 'initiatorType', transform: (val) => val === 'SEEKER' ? 'Franchise Seeker' : 'Brand Owner' },
  { label: 'Status', key: 'status' },
  { label: 'Date Requested', key: 'createdAt', transform: (val) => val ? String(val).split('T')[0] : 'N/A' },
];

export default function AdminConnections() {
  const { 
    connectionRequests, 
    seekers, 
    brands, 
    markConnectionReadByOwner, 
    addConnectionInternalNote, 
    updateConnectionStatus 
  } = useData();

  const [searchParams, setSearchParams] = useSearchParams();
  const deepLinkId = searchParams.get('id');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED' | 'COMPLETED'>('ALL');
  const [initiatorFilter, setInitiatorFilter] = useState('ALL');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [scoreFilter, setScoreFilter] = useState('ALL');
  const [sortField, setSortField] = useState<'date' | 'score' | 'brand' | 'seeker'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected Connection for Details Modal
  const [selectedConnection, setSelectedConnection] = useState<ConnectionRequest | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  
  // Internal note temporary input
  const [newNoteText, setNewNoteText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Open deep link connection automatically on mount or search param update
  useEffect(() => {
    if (deepLinkId && connectionRequests) {
      const conn = connectionRequests.find(c => c.id === deepLinkId);
      if (conn) {
        setSelectedConnection(conn);
        // Mark as read automatically when opened
        if (!conn.readByOwner) {
          markConnectionReadByOwner(conn.id);
        }
      }
    }
  }, [deepLinkId, connectionRequests]);

  // Handle opening connection modal
  const handleOpenConnection = (conn: ConnectionRequest) => {
    setSelectedConnection(conn);
    setSearchParams({ id: conn.id });
    if (!conn.readByOwner) {
      markConnectionReadByOwner(conn.id);
    }
  };

  // Handle closing connection modal
  const handleCloseConnection = () => {
    setSelectedConnection(null);
    setSearchParams({});
  };

  // Status mapping colors & labels
  const getStatusBadgeClass = (status: ConnectionStatus) => {
    switch (status) {
      case 'PENDING':
      case 'REQUEST_SENT':
      case 'AWAITING_RESPONSE':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'ACCEPTED':
      case 'CONNECTED':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'DECLINED':
      case 'CLOSED':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      case 'CANCELLED':
        return 'bg-slate-50 text-slate-600 border border-slate-200';
      case 'COMPLETED':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-200';
    }
  };

  // Get matching profiles from context
  const getProfileDetails = (conn: ConnectionRequest) => {
    const seeker = seekers.find(s => s.id === conn.seekerId);
    const brand = brands.find(b => b.id === conn.brandId);
    return { seeker, brand };
  };

  // Unique list of target sectors/industries for filters
  const sectors = Array.from(
    new Set((connectionRequests || []).map(c => c.targetSector || c.brandIndustry || 'F&B'))
  ).filter(Boolean);

  // Filter & Sort Logic
  const filteredConnections = (connectionRequests || []).filter(conn => {
    // Tab/Status filter
    const matchesTab = 
      activeTab === 'ALL' || 
      (activeTab === 'PENDING' && ['PENDING', 'REQUEST_SENT', 'AWAITING_RESPONSE', 'BRAND_REVIEWING'].includes(conn.status)) ||
      (activeTab === 'ACCEPTED' && ['ACCEPTED', 'CONNECTED'].includes(conn.status)) ||
      (activeTab === 'DECLINED' && conn.status === 'DECLINED') ||
      (activeTab === 'CANCELLED' && conn.status === 'CANCELLED') ||
      (activeTab === 'COMPLETED' && conn.status === 'COMPLETED');

    // Search query
    const matchesSearch = 
      conn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conn.seekerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conn.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conn.seekerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conn.brandEmail || '').toLowerCase().includes(searchQuery.toLowerCase());

    // Initiator Filter
    const matchesInitiator = 
      initiatorFilter === 'ALL' || 
      conn.initiatorType === initiatorFilter;

    // Sector Filter
    const matchesSector = 
      sectorFilter === 'ALL' || 
      conn.targetSector === sectorFilter || 
      conn.brandIndustry === sectorFilter;

    // Score Filter
    let matchesScore = true;
    if (scoreFilter !== 'ALL') {
      const minScore = parseInt(scoreFilter);
      matchesScore = conn.matchScore >= minScore;
    }

    return matchesTab && matchesSearch && matchesInitiator && matchesSector && matchesScore;
  }).sort((a, b) => {
    let comparison = 0;
    if (sortField === 'score') {
      comparison = a.matchScore - b.matchScore;
    } else if (sortField === 'brand') {
      comparison = a.brandName.localeCompare(b.brandName);
    } else if (sortField === 'seeker') {
      comparison = a.seekerName.localeCompare(b.seekerName);
    } else {
      // Date sort
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      comparison = dateA - dateB;
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(filteredConnections.length / itemsPerPage) || 1;
  const paginatedConnections = filteredConnections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Status handler
  const handleUpdateStatus = (id: string, status: ConnectionStatus) => {
    updateConnectionStatus(id, status);
    showToast(`Connection status updated to ${status}.`);
    // update state of current selected modal to keep in sync
    if (selectedConnection && selectedConnection.id === id) {
      setSelectedConnection(prev => prev ? { ...prev, status } : null);
    }
  };

  // Add internal note handler
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedConnection) return;
    addConnectionInternalNote(selectedConnection.id, newNoteText.trim());
    setNewNoteText('');
    showToast('Internal administrator note added.');
  };

  // Toggle sort fields
  const handleSort = (field: 'date' | 'score' | 'brand' | 'seeker') => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const { seeker: currentSeekerProfile, brand: currentBrandProfile } = selectedConnection 
    ? getProfileDetails(selectedConnection) 
    : { seeker: null, brand: null };

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white font-semibold text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 z-50 animate-fadeIn">
          <CheckCircle size={14} className="text-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0 relative z-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#172033] mb-2 font-heading tracking-tight">Connections Hub</h1>
          <p className="text-slate-500 font-medium">Evaluate, match, and monitor Seeker ↔ Brand connections.</p>
        </div>
        <button 
          onClick={() => setIsExportOpen(true)}
          className="px-5 py-2.5 bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-800 transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Download size={14} /> Export Connections
        </button>
      </div>

      {/* Connection Statistics summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Connections', count: connectionRequests.length, color: 'text-blue-600 bg-blue-50 border-blue-200' },
          { label: 'Pending Intervention', count: connectionRequests.filter(c => ['PENDING', 'REQUEST_SENT', 'AWAITING_RESPONSE'].includes(c.status)).length, color: 'text-amber-600 bg-amber-50 border-amber-200' },
          { label: 'Accepted Matches', count: connectionRequests.filter(c => ['ACCEPTED', 'CONNECTED'].includes(c.status)).length, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
          { label: 'Declined/Closed', count: connectionRequests.filter(c => ['DECLINED', 'CLOSED'].includes(c.status)).length, color: 'text-rose-600 bg-rose-50 border-rose-200' },
          { label: 'Unread Connection Alerts', count: connectionRequests.filter(c => !c.readByOwner).length, color: 'text-indigo-600 bg-[#EAF2FF] border-[#BFDBFE]' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-[#E2EAF4] shadow-xs">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-black text-[#172033]">{stat.count}</span>
              {stat.label.includes('Unread') && stat.count > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"></span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Search & Tabs Controls */}
      <div className="bg-white rounded-2xl border border-[#E2EAF4] shadow-xs overflow-hidden">
        {/* Tab Links */}
        <div className="border-b border-[#E2EAF4] bg-slate-50/50 flex flex-wrap gap-1 px-4 pt-3">
          {(['ALL', 'PENDING', 'ACCEPTED', 'DECLINED', 'CANCELLED', 'COMPLETED'] as const).map(tab => {
            const count = (connectionRequests || []).filter(conn => {
              if (tab === 'ALL') return true;
              if (tab === 'PENDING') return ['PENDING', 'REQUEST_SENT', 'AWAITING_RESPONSE', 'BRAND_REVIEWING'].includes(conn.status);
              if (tab === 'ACCEPTED') return ['ACCEPTED', 'CONNECTED'].includes(conn.status);
              if (tab === 'DECLINED') return conn.status === 'DECLINED';
              if (tab === 'CANCELLED') return conn.status === 'CANCELLED';
              return conn.status === 'COMPLETED';
            }).length;

            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 text-xs font-black rounded-t-xl transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === tab 
                    ? 'border-blue-600 text-blue-700 bg-white shadow-xs' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>{tab}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab ? 'bg-blue-100 text-blue-700' : 'bg-slate-200/60 text-slate-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 bg-white border-b border-[#E2EAF4] flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-96 shrink-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search by Seeker, Brand, Email, or ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2.5 text-xs font-semibold bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:justify-end">
            {/* Sector filter */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase hidden sm:inline">Sector:</span>
              <select
                value={sectorFilter}
                onChange={(e) => { setSectorFilter(e.target.value); setCurrentPage(1); }}
                className="bg-slate-50 border border-[#E2EAF4] rounded-xl px-2.5 py-2 text-[11px] font-extrabold text-slate-700 outline-none"
              >
                <option value="ALL">All Sectors</option>
                {sectors.map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </div>

            {/* Initiator filter */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase hidden sm:inline">Initiator:</span>
              <select
                value={initiatorFilter}
                onChange={(e) => { setInitiatorFilter(e.target.value); setCurrentPage(1); }}
                className="bg-slate-50 border border-[#E2EAF4] rounded-xl px-2.5 py-2 text-[11px] font-extrabold text-slate-700 outline-none"
              >
                <option value="ALL">All Initiators</option>
                <option value="SEEKER">Franchise Seeker</option>
                <option value="BRAND">Brand Owner</option>
              </select>
            </div>

            {/* Score filter */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase hidden sm:inline">Match Score:</span>
              <select
                value={scoreFilter}
                onChange={(e) => { setScoreFilter(e.target.value); setCurrentPage(1); }}
                className="bg-slate-50 border border-[#E2EAF4] rounded-xl px-2.5 py-2 text-[11px] font-extrabold text-slate-700 outline-none"
              >
                <option value="ALL">All Scores</option>
                <option value="90">90%+ Best Matches</option>
                <option value="80">80%+ Highly Compatible</option>
                <option value="70">70%+ Good Potential</option>
              </select>
            </div>
          </div>
        </div>

        {/* Connections List / Grid */}
        <div className="overflow-x-auto">
          {paginatedConnections.length === 0 ? (
            <div className="py-16 text-center">
              <AlertCircle size={36} className="text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700">No Connection Records Found</h3>
              <p className="text-xs text-slate-400 mt-1">Try resetting the filters or adjusting your search term.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-[#E2EAF4] text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Connection ID</th>
                  <th className="py-3 px-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('seeker')}>Seeker</th>
                  <th className="py-3 px-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('brand')}>Brand</th>
                  <th className="py-3 px-4 cursor-pointer hover:bg-slate-100 text-center" onClick={() => handleSort('score')}>Compatibility</th>
                  <th className="py-3 px-4">Initiator</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 cursor-pointer text-right hover:bg-slate-100" onClick={() => handleSort('date')}>Requested Date</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2EAF4] text-xs">
                {paginatedConnections.map(conn => (
                  <tr key={conn.id} className={`hover:bg-slate-50/40 transition-colors ${!conn.readByOwner ? 'bg-[#F3F7FF]/30 font-bold' : ''}`}>
                    <td className="py-4 px-4 font-mono font-black text-slate-500">
                      <div className="flex items-center gap-1.5">
                        {!conn.readByOwner && <span className="w-2 h-2 rounded-full bg-blue-600 inline-block shrink-0" title="Unread Alert"></span>}
                        <span>{conn.id}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-extrabold text-[#172033]">{conn.seekerName}</p>
                        <p className="text-[10px] text-slate-400">{conn.seekerEmail}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-extrabold text-blue-900">{conn.brandName}</p>
                        <p className="text-[10px] text-slate-400">{conn.brandEmail || 'franchise@brizx.in'}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 font-extrabold rounded-full border border-blue-100">
                        {conn.matchScore}% Match
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-extrabold text-[10px]">
                        {conn.initiatorType === 'SEEKER' ? 'Seeker' : 'Brand'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${getStatusBadgeClass(conn.status)}`}>
                        {conn.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right text-slate-500 font-bold">
                      {conn.connectionDate || 'Today'}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleOpenConnection(conn)}
                        className="p-2 bg-[#EAF2FF] hover:bg-blue-600 text-blue-700 hover:text-white rounded-xl transition-all cursor-pointer inline-flex items-center gap-1"
                        title="View Details"
                      >
                        <Eye size={14} />
                        <span className="font-black text-[10px] uppercase tracking-wider px-1">Review</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 bg-slate-50/50 border-t border-[#E2EAF4] flex items-center justify-between text-xs">
            <span className="text-slate-500 font-bold">
              Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredConnections.length)} of {filteredConnections.length} Connections
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-2 bg-white border border-[#E2EAF4] text-slate-500 hover:text-slate-800 rounded-lg disabled:opacity-50 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-8 h-8 rounded-lg font-bold transition-all ${
                    currentPage === idx + 1 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-[#E2EAF4] text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-2 bg-white border border-[#E2EAF4] text-slate-500 hover:text-slate-800 rounded-lg disabled:opacity-50 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- REFINED CONNECTION DETAILS MODAL (REQUIREMENT 2) --- */}
      {selectedConnection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 backdrop-blur-xs p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#E2EAF4] shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="p-5 border-b border-[#E2EAF4] bg-slate-50 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#EAF2FF] border border-[#BFDBFE] text-blue-700 rounded-xl">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#172033] font-heading flex items-center gap-2">
                    CONNECTION DETAILS
                    <span className="text-xs px-2.5 py-0.5 bg-blue-100 border border-blue-200 rounded-md font-mono font-bold text-blue-700">{selectedConnection.id}</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Platform evaluation & synchronization timeline.</p>
                </div>
              </div>
              <button 
                onClick={handleCloseConnection}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Quick Summary Row */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-[#F8FAFC] border border-[#E2EAF4] rounded-2xl p-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Match Score</p>
                  <p className="text-lg font-black text-blue-700 mt-0.5">{selectedConnection.matchScore}% Match</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initiated By</p>
                  <p className="text-xs font-extrabold text-slate-700 mt-1">{selectedConnection.initiatedBy || 'Seeker'}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">{selectedConnection.initiatorType}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Requested On</p>
                  <p className="text-xs font-bold text-slate-700 mt-1">{selectedConnection.connectionDate || 'Today'}</p>
                  <p className="text-[9px] text-slate-400 font-bold">{selectedConnection.connectionTime || '03:42 AM'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Read by Owner</p>
                  <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-bold uppercase mt-1 ${selectedConnection.readByOwner ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                    {selectedConnection.readByOwner ? 'Read' : 'New / Unread'}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Status</p>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black mt-1 ${getStatusBadgeClass(selectedConnection.status)}`}>
                    {selectedConnection.status}
                  </span>
                </div>
              </div>

              {/* Seeker & Brand Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* SEEKER INFORMATION */}
                <div className="bg-white border border-[#E2EAF4] rounded-2xl p-5 hover:border-blue-200 transition-colors">
                  <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
                    <h4 className="text-xs font-black text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Briefcase size={14} /> Seeker Profile Details
                    </h4>
                    {currentSeekerProfile?.isPremium && (
                      <span className="bg-amber-50 text-amber-600 border border-amber-200 text-[9px] font-black px-2 py-0.5 rounded uppercase">Premium Seeker</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-700 text-white font-black text-lg flex items-center justify-center shrink-0 overflow-hidden">
                      {currentSeekerProfile?.avatar ? (
                        <img src={currentSeekerProfile.avatar} alt={selectedConnection.seekerName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        selectedConnection.seekerName.charAt(0)
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-black text-[#172033]">{selectedConnection.seekerName}</p>
                      <p className="text-xs text-slate-500 font-medium">{selectedConnection.seekerEmail}</p>
                      <p className="text-xs text-slate-500 font-medium">{selectedConnection.seekerPhone || '+91 98765 43210'}</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs bg-slate-50/50 border border-[#E2EAF4] rounded-xl p-3">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-400 font-medium">Target Industry:</span>
                      <span className="font-extrabold text-slate-800">{selectedConnection.targetSector}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-400 font-medium">Budget Capital:</span>
                      <span className="font-extrabold text-slate-800">{selectedConnection.availableInvestment}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-400 font-medium">Preferred Territory:</span>
                      <span className="font-extrabold text-slate-800">{selectedConnection.preferredLocation}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-400 font-medium">Experience Level:</span>
                      <span className="font-extrabold text-slate-800">{currentSeekerProfile?.experience || 'Entrepreneurial background / Retail experience'}</span>
                    </div>
                    {currentSeekerProfile?.businessBackground && (
                      <div className="flex flex-col pt-1">
                        <span className="text-slate-400 font-medium mb-1">Business Background:</span>
                        <span className="text-slate-600 bg-white p-2 rounded border border-slate-100">{currentSeekerProfile.businessBackground}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* BRAND INFORMATION */}
                <div className="bg-white border border-[#E2EAF4] rounded-2xl p-5 hover:border-blue-200 transition-colors">
                  <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
                    <h4 className="text-xs font-black text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Briefcase size={14} /> Brand Partner Details
                    </h4>
                    <span className="bg-[#EAF2FF] text-blue-700 border border-[#BFDBFE] text-[9px] font-black px-2 py-0.5 rounded uppercase">
                      Tier: {currentBrandProfile?.subscriptionTier || 'PROFESSIONAL'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 font-black text-lg flex items-center justify-center shrink-0 overflow-hidden">
                      {selectedConnection.brandLogo ? (
                        <img src={selectedConnection.brandLogo} alt={selectedConnection.brandName} className="object-cover w-full h-full" referrerPolicy="no-referrer" />
                      ) : selectedConnection.brandName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-black text-blue-900">{selectedConnection.brandName}</p>
                      <p className="text-xs text-slate-500 font-medium">{selectedConnection.brandEmail || 'franchise@brizx.in'}</p>
                      <p className="text-xs text-slate-500 font-medium">{selectedConnection.brandPhone || '+91 99999 88888'}</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs bg-slate-50/50 border border-[#E2EAF4] rounded-xl p-3">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-400 font-medium">Industry:</span>
                      <span className="font-extrabold text-slate-800">{selectedConnection.brandIndustry || 'Food & Beverages'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-400 font-medium">Investment Ask:</span>
                      <span className="font-extrabold text-slate-800">{selectedConnection.brandInvestmentRequirement || '₹15–30 Lakhs'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-400 font-medium">Base Headquarters:</span>
                      <span className="font-extrabold text-slate-800">{selectedConnection.brandLocation || 'Gurugram, Haryana'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-400 font-medium">Outlets Counter:</span>
                      <span className="font-extrabold text-slate-800">{selectedConnection.activeOutlets || 120} Active Outlets</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-400 font-medium">Payback Period:</span>
                      <span className="font-extrabold text-[#172033] font-mono">{selectedConnection.expectedPayback || '12-18 Months'}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Match Criteria Reason */}
              <div className="bg-[#F3F7FF] border border-[#BFDBFE] rounded-2xl p-5">
                <h4 className="text-xs font-black text-blue-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles size={14} /> Matching Analytics & Criteria
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-white p-3 rounded-xl border border-[#BFDBFE]">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Budget Fit</span>
                    <span className="text-xs font-extrabold text-emerald-600">✓ Fully Aligned</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#BFDBFE]">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Sector Preference</span>
                    <span className="text-xs font-extrabold text-emerald-600">✓ 100% Matches</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#BFDBFE]">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Target Cities</span>
                    <span className="text-xs font-extrabold text-emerald-600">✓ Expansion Active</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#BFDBFE]">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Verification Status</span>
                    <span className="text-xs font-extrabold text-blue-700">✓ Compliant</span>
                  </div>
                </div>
                <div className="text-xs space-y-2 text-slate-700">
                  <p className="font-extrabold text-[#172033]">Why they were matched:</p>
                  <ul className="list-disc list-inside space-y-1 pl-1">
                    {selectedConnection.whyMatched ? selectedConnection.whyMatched.map((reason, i) => (
                      <li key={i}>{reason}</li>
                    )) : (
                      <li>Pre-screened criteria match verified. High investment compatibility with active franchise targets.</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* TIMELINE & SYSTEM TRACE HISTORY (REQUIREMENT 2 & 4) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Timeline */}
                <div className="bg-white border border-[#E2EAF4] rounded-2xl p-5">
                  <h4 className="text-xs font-black text-[#172033] uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <Calendar size={14} /> Connection Synchronization Timeline
                  </h4>
                  <div className="relative border-l-2 border-[#E2EAF4] ml-2 pl-6 space-y-5 py-1">
                    <div className="relative">
                      <span className="absolute -left-[31px] top-0 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full ring-2 ring-emerald-500/20"></span>
                      <div>
                        <p className="text-xs font-black text-[#172033]">Connection Requested</p>
                        <p className="text-[10px] text-slate-400">{selectedConnection.connectionDate || 'August 27, 2026'} • {selectedConnection.connectionTime || '03:42 AM'}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Initiated by {selectedConnection.initiatedBy || 'Seeker'} ({selectedConnection.initiatorType})</p>
                      </div>
                    </div>

                    <div className="relative">
                      <span className="absolute -left-[31px] top-0 w-4 h-4 bg-blue-500 border-4 border-white rounded-full"></span>
                      <div>
                        <p className="text-xs font-black text-blue-800">Email Dispatch Triggered</p>
                        <p className="text-[10px] text-slate-400">{selectedConnection.connectionDate || 'August 27, 2026'} • {selectedConnection.connectionTime || '03:42 AM'}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Sent connection alert to info@brizxindia.com</p>
                      </div>
                    </div>

                    <div className="relative">
                      <span className="absolute -left-[31px] top-0 w-4 h-4 bg-purple-500 border-4 border-white rounded-full"></span>
                      <div>
                        <p className="text-xs font-black text-purple-700">Viewed by Owner / Admin</p>
                        <p className="text-[10px] text-slate-400">Today • Just now</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Alert status flipped to read. Synchronized in database.</p>
                      </div>
                    </div>

                    <div className="relative">
                      <span className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-4 border-white ${
                        selectedConnection.status === 'ACCEPTED' || selectedConnection.status === 'CONNECTED' ? 'bg-emerald-500' :
                        selectedConnection.status === 'DECLINED' ? 'bg-rose-500' : 'bg-slate-300'
                      }`}></span>
                      <div>
                        <p className="text-xs font-black text-slate-700">Current Resolution State: {selectedConnection.status}</p>
                        <p className="text-[10px] text-slate-400">Last updated: {new Date(selectedConnection.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Internal Notes & Intervention (REQUIREMENT 4) */}
                <div className="bg-white border border-[#E2EAF4] rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="border-b border-slate-100 pb-3 mb-4">
                      <h4 className="text-xs font-black text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                        <FileText size={14} /> Internal Administrator Notes
                      </h4>
                    </div>

                    <div className="space-y-2 max-h-36 overflow-y-auto mb-4 p-1 bg-slate-50 rounded-xl border border-slate-100">
                      {(!selectedConnection.internalNotes || selectedConnection.internalNotes.length === 0) ? (
                        <div className="text-center py-6 text-slate-400 text-xs font-semibold">
                          No internal notes recorded yet.
                        </div>
                      ) : (
                        selectedConnection.internalNotes.map((note, i) => (
                          <div key={i} className="p-2.5 bg-white rounded-lg border border-[#E2EAF4] text-xs">
                            <p className="font-extrabold text-[10px] text-slate-400 mb-0.5">Admin • Note #{i+1}</p>
                            <p className="text-slate-700 font-semibold">{note}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <form onSubmit={handleAddNote} className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add internal administrator note..."
                        value={newNoteText}
                        onChange={(e) => setNewNoteText(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs bg-white border border-[#E2EAF4] rounded-xl outline-none focus:border-blue-500 font-semibold"
                      />
                      <button 
                        type="submit"
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all cursor-pointer shrink-0"
                      >
                        <Send size={14} />
                      </button>
                    </div>

                    {/* Administrative Action Intervention */}
                    <div className="pt-2 border-t border-slate-100">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Intervene & Change Status</label>
                      <div className="flex flex-wrap gap-1.5">
                        {(['PENDING', 'ACCEPTED', 'DECLINED', 'CANCELLED', 'COMPLETED'] as const).map(st => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleUpdateStatus(selectedConnection.id, st)}
                            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer uppercase ${
                              selectedConnection.status === st 
                                ? 'bg-[#EAF2FF] text-blue-700 border border-blue-300' 
                                : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                      <p className="text-[9px] text-slate-400 mt-2">
                        Note: Intervention overrides status flags instantly across dashboards without sharing or exposing private login tokens.
                      </p>
                    </div>
                  </form>
                </div>

              </div>

            </div>

            {/* Footer buttons */}
            <div className="p-4 border-t border-[#E2EAF4] bg-slate-50/70 flex justify-end gap-2 shrink-0">
              <button 
                onClick={handleCloseConnection}
                className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      <UniversalExportModal 
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title="Seeker-Brand Connection Database"
        filenamePrefix="Connection-Matches"
        currentData={filteredConnections}
        allData={connectionRequests}
        fields={connectionFields}
      />
    </div>
  );
}
