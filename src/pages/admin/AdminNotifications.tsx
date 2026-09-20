import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Bell, Search, CheckCircle, Trash2, Filter, AlertCircle, Settings,
  Mail, Clock, ShieldCheck, Sparkles, User, Building2, Check, 
  ArrowRight, RefreshCw, AlertTriangle, Eye, Send, ArrowUpRight, X
} from 'lucide-react';
import { ConnectionRequest, ConnectionStatus } from '../../types';

export default function AdminNotifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    notifications, connectionRequests, emailLogs, simulateEmailFailure, 
    setSimulateEmailFailure, clearEmailLogs, markNotificationRead, deleteNotification,
    updateConnectionStatus
  } = useData();

  const [activeTab, setActiveTab] = useState<'NOTIFICATIONS' | 'CONNECTIONS' | 'EMAIL_LOGS'>(() => {
    if (window.location.hash === '#connections') return 'CONNECTIONS';
    if (window.location.hash === '#emails') return 'EMAIL_LOGS';
    return 'NOTIFICATIONS';
  });

  // Handle Hash Changes dynamically
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#connections') setActiveTab('CONNECTIONS');
      else if (window.location.hash === '#emails') setActiveTab('EMAIL_LOGS');
      else if (window.location.hash === '#notifications') setActiveTab('NOTIFICATIONS');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConnection, setSelectedConnection] = useState<ConnectionRequest | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Filter for super admin notifications
  const adminNotifications = notifications.filter(n => n.userId === 'admin1' || n.userId === user?.id);

  const filteredNotifications = adminNotifications.filter(n => {
    if (!searchQuery) return true;
    return n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           n.message.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredConnections = connectionRequests.filter(cr => {
    const matchesSearch = 
      cr.seekerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      cr.brandName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      cr.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'ALL') return matchesSearch;
    return matchesSearch && cr.status === statusFilter;
  });

  const filteredEmailLogs = emailLogs.filter(e => {
    if (!searchQuery) return true;
    return e.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
           e.body.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleStatusChange = (requestId: string, nextStatus: ConnectionStatus) => {
    updateConnectionStatus(requestId, nextStatus);
    if (selectedConnection && selectedConnection.id === requestId) {
      setSelectedConnection(prev => prev ? { ...prev, status: nextStatus } : null);
    }
  };

  const getStatusBadge = (status: ConnectionStatus) => {
    const configs: Record<ConnectionStatus, { bg: string, text: string, border: string }> = {
      PENDING: { bg: 'bg-amber-50 dark:bg-amber-950/20', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
      REQUEST_SENT: { bg: 'bg-amber-50 dark:bg-amber-950/20', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
      AWAITING_RESPONSE: { bg: 'bg-blue-50 dark:bg-blue-950/20', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
      BRAND_REVIEWING: { bg: 'bg-purple-50 dark:bg-purple-950/20', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
      ACCEPTED: { bg: 'bg-green-50 dark:bg-green-950/20', text: 'text-green-700 dark:text-green-400', border: 'border-green-200 dark:border-green-800' },
      CONNECTED: { bg: 'bg-emerald-50 dark:bg-emerald-950/20', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
      DECLINED: { bg: 'bg-rose-50 dark:bg-rose-950/20', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800' },
      CANCELLED: { bg: 'bg-slate-50 dark:bg-slate-950/20', text: 'text-slate-700 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-800' },
      CLOSED: { bg: 'bg-slate-50 dark:bg-slate-950/20', text: 'text-slate-700 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-800' },
      COMPLETED: { bg: 'bg-teal-50 dark:bg-teal-950/20', text: 'text-teal-700 dark:text-teal-400', border: 'border-teal-200 dark:border-teal-800' }
    };

    const config = configs[status] || configs.PENDING;

    return (
      <span className={`px-2.5 py-1 rounded-full text-[11px] font-black tracking-wide uppercase border ${config.bg} ${config.text} ${config.border} flex items-center gap-1.5 w-fit`}>
        <Clock size={12} />
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto px-4 md:px-0">
      <AdminBreadcrumbs items={[{ label: 'Super Admin', path: '/admin' }, { label: 'Notification & Connection Center' }]} />
      
      {/* Upper Status Header */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 font-heading tracking-tight">
            Notification & Connection Center
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Platform Owner control center to monitor connection requests, inspect real-time logs, and review automated email alerts.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button 
            onClick={() => setSimulateEmailFailure(!simulateEmailFailure)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider border transition-all flex items-center gap-2 cursor-pointer ${
              simulateEmailFailure 
                ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-sm shadow-rose-100' 
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <AlertTriangle size={16} className={simulateEmailFailure ? 'text-rose-600' : 'text-slate-400'} />
            {simulateEmailFailure ? 'Email Failures: ON' : 'Simulate Email Failures'}
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col flex-1">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-slate-50/50 dark:bg-slate-950/20">
          <div className="flex bg-slate-100 dark:bg-slate-850 p-1.5 rounded-2xl w-fit">
            <button
              onClick={() => { setActiveTab('NOTIFICATIONS'); window.location.hash = 'notifications'; }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all tracking-wider uppercase flex items-center gap-2 ${
                activeTab === 'NOTIFICATIONS' 
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <Bell size={14} /> Alerts ({filteredNotifications.length})
            </button>
            <button
              onClick={() => { setActiveTab('CONNECTIONS'); window.location.hash = 'connections'; }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all tracking-wider uppercase flex items-center gap-2 ${
                activeTab === 'CONNECTIONS' 
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <ShieldCheck size={14} /> Connections ({connectionRequests.length})
            </button>
            <button
              onClick={() => { setActiveTab('EMAIL_LOGS'); window.location.hash = 'emails'; }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all tracking-wider uppercase flex items-center gap-2 ${
                activeTab === 'EMAIL_LOGS' 
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <Mail size={14} /> Email logs ({emailLogs.length})
            </button>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'CONNECTIONS' && (
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500 transition-colors cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="DECLINED">Declined</option>
                  <option value="CONNECTED">Connected</option>
                </select>
              </div>
            )}

            <div className="relative flex-1 sm:max-w-xs">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={
                  activeTab === 'NOTIFICATIONS' ? "Search alerts..." : 
                  activeTab === 'CONNECTIONS' ? "Search seeker or brand..." : "Search emails..."
                }
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold focus:border-blue-500 outline-none text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* ==================================== */}
        {/* TAB 1: SYSTEM ALERTS */}
        {/* ==================================== */}
        {activeTab === 'NOTIFICATIONS' && (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 overflow-y-auto flex-1 min-h-[450px]">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map(notif => (
                <div key={notif.id} className={`p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-start gap-4 ${!notif.read ? 'bg-blue-50/10 dark:bg-blue-950/5' : ''}`}>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                    !notif.read 
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100' 
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200'
                  }`}>
                    <Bell size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-sm font-black truncate ${!notif.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap ml-4 flex items-center gap-1">
                        <Clock size={12} /> {notif.createdAt ? new Date(notif.createdAt).toLocaleDateString() : 'Just now'}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 leading-relaxed mb-2">{notif.message}</p>
                    
                    {/* Deep link CTA helper */}
                    {notif.applicationId && (
                      <button
                        onClick={() => {
                          markNotificationRead(notif.id);
                          navigate(`/admin/applications?appId=${notif.applicationId}`);
                        }}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-black text-xs uppercase tracking-wider flex items-center gap-1 mt-1 cursor-pointer"
                      >
                        Inspect Application Details <ArrowUpRight size={14} />
                      </button>
                    )}
                    {notif.message.includes('cr_') && (
                      <button
                        onClick={() => {
                          const idMatch = notif.message.match(/cr_[a-z0-9]+/);
                          if (idMatch) {
                            const conn = connectionRequests.find(c => c.id === idMatch[0]);
                            if (conn) {
                              setSelectedConnection(conn);
                            } else {
                              setActiveTab('CONNECTIONS');
                            }
                          }
                        }}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-black text-xs uppercase tracking-wider flex items-center gap-1 mt-1 cursor-pointer"
                      >
                        Inspect Connection Details <ArrowUpRight size={14} />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!notif.read && (
                      <button 
                        onClick={() => markNotificationRead(notif.id)}
                        className="text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Mark read"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteNotification(notif.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                      title="Delete alert"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-500">
                <Bell size={36} className="mx-auto mb-3 text-slate-300" />
                <h4 className="text-base font-bold text-indigo-950 dark:text-slate-200">No Notifications Available</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">Alerts regarding connection requests, profile updates, and billing will populate here.</p>
              </div>
            )}
          </div>
        )}

        {/* ==================================== */}
        {/* TAB 2: CONNECTIONS TRACKER */}
        {/* ==================================== */}
        {activeTab === 'CONNECTIONS' && (
          <div className="flex-1 flex flex-col min-h-[450px]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 text-slate-400 text-[10px] font-black uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    <th className="py-4 px-6">Connection ID</th>
                    <th className="py-4 px-6">Seeker Details</th>
                    <th className="py-4 px-6">Brand Details</th>
                    <th className="py-4 px-6">Initiated By</th>
                    <th className="py-4 px-6">Match Score</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {filteredConnections.length > 0 ? (
                    filteredConnections.map(req => (
                      <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 px-6 font-mono font-bold text-blue-600 dark:text-blue-400">
                          {req.id}
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-black text-slate-900 dark:text-white">{req.seekerName}</div>
                          <div className="text-[10px] text-slate-400">{req.seekerEmail}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-black text-slate-900 dark:text-white">{req.brandName}</div>
                          <div className="text-[10px] text-slate-400">{req.industry}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            req.initiatorType === 'BRAND' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-blue-50 text-blue-700 border border-blue-100'
                          }`}>
                            {req.initiatorType || 'SEEKER'}
                          </span>
                          <div className="text-[10px] text-slate-400 mt-1">{req.connectionDate}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1.5 font-black text-slate-900 dark:text-white">
                            <Sparkles size={14} className="text-amber-500" />
                            {req.matchScore}%
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {getStatusBadge(req.status)}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setSelectedConnection(req)}
                            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-indigo-950 dark:text-slate-200 rounded-xl font-bold uppercase tracking-wider transition-colors cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <Eye size={13} /> View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        <ShieldCheck size={36} className="mx-auto mb-3 text-slate-300" />
                        <h4 className="text-base font-bold text-indigo-950 dark:text-slate-200">No Connection Records found</h4>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">Submit connection requests on matched cards to see records populated here.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================== */}
        {/* TAB 3: EMAIL SIMULATOR LOGS */}
        {/* ==================================== */}
        {activeTab === 'EMAIL_LOGS' && (
          <div className="flex-1 flex flex-col md:flex-row min-h-[450px]">
            {/* Sidebar with Inbox/Sent list */}
            <div className="w-full md:w-1/3 border-r border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-y-auto max-h-[500px]">
              <div className="p-4 bg-slate-50 dark:bg-slate-950/40 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Owner Inbox Outbox</span>
                {emailLogs.length > 0 && (
                  <button 
                    onClick={clearEmailLogs}
                    className="text-rose-600 hover:text-rose-700 font-extrabold text-[10px] uppercase tracking-wider cursor-pointer"
                  >
                    Clear Logs
                  </button>
                )}
              </div>

              {filteredEmailLogs.length > 0 ? (
                filteredEmailLogs.map(log => (
                  <div 
                    key={log.id} 
                    onClick={() => setSelectedEmail(log)}
                    className={`p-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all cursor-pointer ${
                      selectedEmail?.id === log.id ? 'bg-blue-50/40 dark:bg-blue-900/10 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <span className="font-black text-slate-900 dark:text-white text-xs truncate max-w-[150px]">
                        {log.recipient || 'info@brizxindia.com'}
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold whitespace-nowrap">
                        {new Date(log.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate mb-1">
                      {log.subject}
                    </h5>
                    <p className="text-[11px] text-slate-500 truncate mb-2">
                      {log.body.replace(/\n+/g, ' ')}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                        log.status === 'SUCCESS' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {log.status === 'SUCCESS' ? 'Delivered ✓' : 'Failed ⚠'}
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold">
                        {new Date(log.sentAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500">
                  <Mail size={24} className="mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-semibold">No emails sent yet</p>
                </div>
              )}
            </div>

            {/* Email Body Inspector */}
            <div className="flex-1 p-6 bg-slate-50/30 dark:bg-slate-900/10 flex flex-col min-h-[400px]">
              {selectedEmail ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col flex-1">
                  {/* Subject and Header */}
                  <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h4 className="text-base font-black text-slate-900 dark:text-white">
                        {selectedEmail.subject}
                      </h4>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border shrink-0 ${
                        selectedEmail.status === 'SUCCESS' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {selectedEmail.status === 'SUCCESS' ? 'Delivered successfully' : 'Delivery failed'}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 font-semibold space-y-1">
                      <div><strong className="text-slate-400 uppercase mr-1">To:</strong> {selectedEmail.recipient}</div>
                      <div><strong className="text-slate-400 uppercase mr-1">Date:</strong> {new Date(selectedEmail.sentAt).toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Delivery Error banner if any */}
                  {selectedEmail.status === 'FAILED' && (
                    <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border-b border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-start gap-2.5">
                      <AlertTriangle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold">Email dispatch failed:</strong>
                        <p className="text-[11px] mt-0.5 font-mono">{selectedEmail.errorDetails}</p>
                        <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-1 uppercase font-black">Note: Connection record was preserved and saved in CRM regardless of delivery fail.</p>
                      </div>
                    </div>
                  )}

                  {/* Body Text */}
                  <div className="p-6 overflow-y-auto flex-1 font-sans text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[350px]">
                    {selectedEmail.body}
                  </div>

                  {/* Simulated Email Client Footer with Interactive CTA Button */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/30 border-t border-slate-200 dark:border-slate-800 flex justify-center">
                    <button
                      onClick={() => {
                        // "Open Owner Admin Portal" CTA link simulation!
                        setActiveTab('CONNECTIONS');
                        window.location.hash = 'connections';
                        // Look up corresponding connection request
                        const idMatch = selectedEmail.body.match(/cr_[a-z0-9]+/);
                        if (idMatch) {
                          const conn = connectionRequests.find(c => c.id === idMatch[0]);
                          if (conn) setSelectedConnection(conn);
                        }
                      }}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-blue-200 flex items-center gap-2 cursor-pointer"
                    >
                      Open Owner Admin Portal <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="m-auto text-center text-slate-400">
                  <Mail size={44} className="mx-auto mb-3 text-slate-300" />
                  <h4 className="text-base font-bold text-indigo-950 dark:text-slate-300">Select an Email Log</h4>
                  <p className="text-xs text-slate-400 max-w-xs mt-1">
                    Select a simulated notification email from the outbox list to inspect its formatted layout and verify content parameters.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ==================================== */}
      {/* CONNECTION DETAILS MODAL */}
      {/* ==================================== */}
      {selectedConnection && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full overflow-hidden my-8 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-950 to-slate-900 text-white p-6 relative">
              <button 
                onClick={() => setSelectedConnection(null)}
                className="absolute top-5 right-5 p-2 text-indigo-200 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
              <div className="text-[10px] font-black uppercase bg-blue-500/20 text-blue-400 border border-blue-400/30 px-2.5 py-0.5 rounded-full w-fit mb-2">
                Connection Audit File
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight">
                Connection: {selectedConnection.id}
              </h2>
              <p className="text-indigo-200 text-xs font-medium">
                Initiated by {selectedConnection.initiatedBy} ({selectedConnection.initiatorType}) on {selectedConnection.connectionDate} at {selectedConnection.connectionTime}
              </p>
            </div>

            {/* Content body */}
            <div className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Dynamic Status Action Bar */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950/30 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Current Status:</span>
                  {getStatusBadge(selectedConnection.status)}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Update Status:</span>
                  <div className="flex bg-slate-200/50 dark:bg-slate-850 p-1 rounded-xl">
                    {(['PENDING', 'ACCEPTED', 'DECLINED', 'CONNECTED', 'CLOSED'] as ConnectionStatus[]).map(s => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(selectedConnection.id, s)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
                          selectedConnection.status === s 
                            ? 'bg-blue-600 text-white shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {s.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Profiles side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Seeker details card */}
                <div className="bg-slate-50/60 dark:bg-slate-950/10 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <User size={15} className="text-blue-500" /> Seeker Investor Profile
                  </h4>
                  <div className="space-y-2.5 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Full Name</span>
                      <strong className="text-slate-900 dark:text-white font-extrabold">{selectedConnection.seekerName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Email Contact</span>
                      <span className="text-slate-700 dark:text-slate-300 font-bold">{selectedConnection.seekerEmail}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Phone Dial</span>
                      <span className="text-slate-700 dark:text-slate-300 font-bold">{selectedConnection.seekerPhone || '+91 98765 43210'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Target Sector / Industry</span>
                      <span className="text-slate-700 dark:text-slate-300 font-bold">{selectedConnection.targetSector}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Available Capital Wallet</span>
                      <strong className="text-slate-800 dark:text-slate-200 font-black">{selectedConnection.availableInvestment}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Preferred Catchment Cities</span>
                      <span className="text-slate-700 dark:text-slate-300 font-bold">{selectedConnection.preferredLocation}</span>
                    </div>
                  </div>
                </div>

                {/* Brand details card */}
                <div className="bg-slate-50/60 dark:bg-slate-950/10 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <Building2 size={15} className="text-indigo-500" /> Franchisor Brand Profile
                  </h4>
                  <div className="space-y-2.5 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Franchise Brand Name</span>
                      <strong className="text-slate-900 dark:text-white font-extrabold">{selectedConnection.brandName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Brand Contact Email</span>
                      <span className="text-slate-700 dark:text-slate-300 font-bold">{selectedConnection.brandEmail || 'franchise@brizx.in'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Brand Phone Dial</span>
                      <span className="text-slate-700 dark:text-slate-300 font-bold">{selectedConnection.brandPhone || '+91 99999 88888'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Brand Industry Classification</span>
                      <span className="text-slate-700 dark:text-slate-300 font-bold">{selectedConnection.brandIndustry || selectedConnection.industry}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Investment Required</span>
                      <strong className="text-slate-800 dark:text-slate-200 font-black">{selectedConnection.brandInvestmentRequirement || selectedConnection.investmentRequired}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Headquarters / Location</span>
                      <span className="text-slate-700 dark:text-slate-300 font-bold">{selectedConnection.brandLocation || 'Delhi, India'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Match Score & Reasons */}
              <div className="bg-blue-50/30 dark:bg-blue-950/10 p-5 rounded-2xl border border-blue-200 dark:border-blue-900/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-sm border border-blue-200 dark:border-blue-800">
                    {selectedConnection.matchScore}%
                  </div>
                  <div>
                    <h5 className="font-black text-slate-900 dark:text-white text-xs uppercase">BrizX AI Smart Match Report</h5>
                    <p className="text-[11px] text-slate-500 font-medium">Compatibility report calculated based on capital, target timelines, rent indexes and QSR sector parameters.</p>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  {selectedConnection.whyMatched && selectedConnection.whyMatched.length > 0 ? (
                    selectedConnection.whyMatched.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </li>
                    ))
                  ) : (
                    <li className="flex items-start gap-2">
                      <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>Capital capacity aligns with brand investment benchmark targets.</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Inspect Simulated Email Action */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    // Find email log corresponding to this connection
                    const matchingEmail = emailLogs.find(e => e.body.includes(selectedConnection.id));
                    if (matchingEmail) {
                      setSelectedEmail(matchingEmail);
                      setActiveTab('EMAIL_LOGS');
                      window.location.hash = 'emails';
                      setSelectedConnection(null);
                    } else {
                      // fallback: go to email tab
                      setActiveTab('EMAIL_LOGS');
                      window.location.hash = 'emails';
                      setSelectedConnection(null);
                    }
                  }}
                  className="w-full py-3 bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-indigo-950 dark:text-slate-200 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-indigo-200 dark:border-slate-700 flex justify-center items-center gap-2 cursor-pointer"
                >
                  <Mail size={16} /> View Simulated Dispatch Email Log <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950/30 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button 
                onClick={() => setSelectedConnection(null)}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close Audit File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
