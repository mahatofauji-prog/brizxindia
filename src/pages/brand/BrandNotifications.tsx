import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  Bell, CheckCircle2, AlertCircle, Calendar, CreditCard, Sparkles, 
  Trash2, Check, ArrowRight, Filter, FileText 
} from 'lucide-react';

export default function BrandNotifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { notifications, markNotificationRead, clearNotification } = useData();

  const userNotifications = notifications.filter(n => n.userId === user?.id || n.userId === user?.brandId || n.userId === 'b1');
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredNotifications = userNotifications.filter(n => {
    if (filterType === 'UNREAD') return !n.read;
    return true;
  });

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'MEETING': return <Calendar size={18} className="text-blue-600" />;
      case 'PAYMENT': return <CreditCard size={18} className="text-emerald-600" />;
      case 'MATCH': return <Sparkles size={18} className="text-blue-500" />;
      case 'APPLICATION': return <FileText size={18} className="text-blue-700" />;
      default: return <Bell size={18} className="text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-indigo-700 rounded-full text-xs font-bold uppercase mb-2 border border-blue-100">
            <Bell size={14} className="text-blue-600" /> BrizX Realtime System Notifications
          </div>
          <h1 className="text-3xl font-black text-indigo-950 font-heading">Notifications</h1>
          <p className="text-slate-600 text-sm mt-1">Alerts on lead matches, scheduled meetings, and subscription updates.</p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => userNotifications.forEach(n => markNotificationRead(n.id))}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Check size={14} /> Mark All as Read
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200 bg-white p-2 rounded-2xl border shadow-sm gap-2">
        <button 
          onClick={() => setFilterType('ALL')}
          className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            filterType === 'ALL' ? 'bg-blue-700 text-white' : 'text-slate-500 hover:text-blue-700'
          }`}
        >
          All ({userNotifications.length})
        </button>
        <button 
          onClick={() => setFilterType('UNREAD')}
          className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            filterType === 'UNREAD' ? 'bg-blue-700 text-white' : 'text-slate-500 hover:text-blue-700'
          }`}
        >
          Unread ({userNotifications.filter(n => !n.read).length})
        </button>
      </div>

      {/* Notification Items */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
          <Bell size={40} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-xl font-black text-indigo-950 font-heading mb-1">No notifications</h3>
          <p className="text-slate-500 text-sm">You are all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map(n => (
            <div 
              key={n.id} 
              onClick={() => {
                markNotificationRead(n.id);
                if (n.linkUrl) {
                  navigate(n.linkUrl);
                } else if (n.applicationId) {
                  navigate(`/brand/applications?appId=${n.applicationId}`);
                }
              }}
              className={`p-5 rounded-3xl border transition-all flex items-start justify-between gap-4 cursor-pointer hover:border-blue-300 ${
                n.read ? 'bg-white border-slate-200 opacity-80' : 'bg-blue-50/50 border-blue-200 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm shrink-0">
                  {getCategoryIcon(n.type)}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-sm text-indigo-950">{n.title}</h4>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-400 font-bold uppercase mt-2 block">{n.timestamp || (n.createdAt ? new Date(n.createdAt).toLocaleString() : 'JUST NOW')}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!n.read && (
                  <button 
                    onClick={() => markNotificationRead(n.id)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer"
                    title="Mark as Read"
                  >
                    <Check size={16} />
                  </button>
                )}
                <button 
                  onClick={() => clearNotification(n.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  title="Clear Notification"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
