import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Bell, Check, Trash2, Calendar, ShieldCheck, DollarSign, Tag, CheckCheck, Sparkles, AlertCircle 
} from 'lucide-react';
import { SeekerHero } from '../../components/seeker/SeekerHero';
import { seekerTheme } from '../../theme/seekerTheme';

export default function SeekerNotifications() {
  const { user } = useAuth();
  const { notifications, markNotificationRead, deleteNotification, clearAllNotifications } = useData();

  const userNotifications = notifications.filter(n => n.userId === user?.id);
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredNotifications = userNotifications.filter(n => {
    if (filterType === 'ALL') return true;
    return n.type === filterType;
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case 'MEETING': return <Calendar className="text-blue-600" size={16} />;
      case 'PAYMENT': return <DollarSign className="text-emerald-600" size={16} />;
      case 'SYSTEM': return <ShieldCheck className="text-blue-600" size={16} />;
      default: return <Tag className="text-blue-600" size={16} />;
    }
  };

  const handleMarkAllAsRead = () => {
    filteredNotifications.forEach(n => {
      if (!n.read) {
        markNotificationRead(n.id);
      }
    });
  };

  return (
    <div className={seekerTheme.pageContainer}>
      
      {/* Top Banner */}
      <SeekerHero
        pageKey="notifications"
        badgeText="Investor Updates"
        badgeIcon={<Bell size={14} className="text-blue-700" />}
        title="Activity & Notification Logs"
        description="Real-time alerts for brand connection approvals, meeting schedules, legal audit findings, and match updates."
        actions={
          <div className="flex gap-2">
            {userNotifications.length > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2.5 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                Mark Filtered Read
              </button>
            )}
            {userNotifications.length > 0 && user && (
              <button
                onClick={() => clearAllNotifications(user.id)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                Clear All
              </button>
            )}
          </div>
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-blue-200">
        {['ALL', 'MEETING', 'SYSTEM', 'PAYMENT', 'PROMOTIONAL'].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 border ${
              filterType === type 
                ? 'bg-blue-600 text-white border-transparent shadow-xs' 
                : 'bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700 border-blue-100'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-blue-100/80 shadow-xs flex flex-col items-center">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl mb-3 border border-blue-100">
            <Bell size={28} />
          </div>
          <h3 className="font-extrabold text-slate-900 text-base font-heading">Clear Alert Registry</h3>
          <p className="text-xs text-slate-500 mt-1">No pending updates matching your active category choice.</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredNotifications.map(n => (
            <div
              key={n.id}
              className={`rounded-2xl p-5 border transition-all duration-200 flex items-start justify-between gap-4 shadow-xs ${
                n.read 
                  ? 'bg-white border-blue-100/70 opacity-80' 
                  : 'bg-blue-50/40 border-blue-200'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl shadow-xs shrink-0">
                  {getIconForType(n.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-900 text-sm font-heading">{n.title}</h4>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 inline-block animate-pulse"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{n.message}</p>
                  
                  <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-400 font-medium">
                    <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>•</span>
                    <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {!n.read && (
                  <button
                    onClick={() => markNotificationRead(n.id)}
                    className="p-2 text-blue-600 hover:bg-blue-100/60 rounded-xl cursor-pointer transition-colors"
                    title="Mark as Read"
                  >
                    <CheckCheck size={16} />
                  </button>
                )}

                <button
                  onClick={() => deleteNotification(n.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer transition-colors"
                  title="Delete"
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
