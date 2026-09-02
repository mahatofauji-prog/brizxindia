import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, Clock, Video, MapPin, Plus, CheckCircle2, XCircle, ExternalLink, 
  User, Check, AlertCircle, FileText 
} from 'lucide-react';

export default function BrandMeetings() {
  const { user } = useAuth();
  const { meetings, seekers, brands, scheduleMeeting, updateMeetingStatus, cancelMeeting } = useData();

  const currentBrand = brands.find(b => b.id === user?.id || (user?.email && b.email === user?.email));
  if (!currentBrand) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Complete your Brand Profile</h2>
        <p className="text-slate-500">Please set up your brand profile to access this page.</p>
      </div>
    );
  }
  const brandMeetings = meetings.filter(m => m.brandId === currentBrand.id);

  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('UPCOMING');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const [seekerId, setSeekerId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('11:00 AM');
  const [notes, setNotes] = useState('');

  const unlockedSeekers = seekers.filter(s => (currentBrand.unlockedLeads || []).includes(s.id));

  const filteredMeetings = brandMeetings.filter(m => {
    if (activeTab === 'UPCOMING') return m.status === 'CONFIRMED' || m.status === 'PENDING';
    if (activeTab === 'COMPLETED') return m.status === 'COMPLETED';
    return m.status === 'CANCELLED';
  });

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seekerId || !date) return;

    scheduleMeeting({
      brandId: currentBrand.id,
      seekerId,
      date,
      time,
      status: 'CONFIRMED',
      brandName: currentBrand.brandName,
      location: 'Google Meet (Online Video Call)',
      notes: notes || '1-on-1 Franchise Investment Strategy & Unit Economics Review',
      meetingLink: 'https://meet.google.com/brzx-m' + Math.random().toString(36).substr(2, 6)
    });

    setShowScheduleModal(false);
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-indigo-700 rounded-full text-xs font-bold uppercase mb-2 border border-blue-100">
            <Calendar size={14} className="text-blue-600" /> BrizX Meeting Manager
          </div>
          <h1 className="text-3xl font-black text-indigo-950 font-heading">Schedule & Meetings</h1>
          <p className="text-slate-600 text-sm mt-1">Host virtual meetings with verified franchise seekers and record notes.</p>
        </div>

        <button 
          onClick={() => setShowScheduleModal(true)}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-200 flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} /> Schedule New Meeting
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white p-2 rounded-2xl border shadow-sm">
        <button 
          onClick={() => setActiveTab('UPCOMING')}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'UPCOMING' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-500 hover:text-blue-700'
          }`}
        >
          Upcoming ({brandMeetings.filter(m => m.status === 'CONFIRMED' || m.status === 'PENDING').length})
        </button>
        <button 
          onClick={() => setActiveTab('COMPLETED')}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'COMPLETED' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-500 hover:text-blue-700'
          }`}
        >
          Completed ({brandMeetings.filter(m => m.status === 'COMPLETED').length})
        </button>
        <button 
          onClick={() => setActiveTab('CANCELLED')}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'CANCELLED' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-500 hover:text-blue-700'
          }`}
        >
          Cancelled ({brandMeetings.filter(m => m.status === 'CANCELLED').length})
        </button>
      </div>

      {/* Meetings List */}
      {filteredMeetings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
          <Calendar size={40} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-xl font-black text-indigo-950 font-heading mb-1">No {activeTab.toLowerCase()} meetings</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            {activeTab === 'UPCOMING' ? 'Schedule a new virtual session with unlocked leads to get started.' : 'History will appear here after sessions conclude.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMeetings.map(m => {
            const seeker = seekers.find(s => s.id === m.seekerId);

            return (
              <div key={m.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 font-black text-lg flex items-center justify-center border border-blue-200 overflow-hidden shrink-0">
                        {seeker?.avatar ? (
                          <img src={seeker.avatar} alt={seeker?.name || 'Franchise Seeker'} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          seeker?.name?.charAt(0) || 'S'
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-indigo-950 text-base">{seeker?.name || 'Franchise Seeker'}</h3>
                        <p className="text-xs text-slate-500 font-semibold">{seeker?.city} • ₹{seeker?.investment} Lakhs</p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                      m.status === 'CONFIRMED' ? 'bg-green-50 text-green-700 border border-green-200' :
                      m.status === 'COMPLETED' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {m.status}
                    </span>
                  </div>

                  <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6 text-xs text-slate-700 font-medium">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-blue-600" />
                      <span><strong>Date & Time:</strong> {m.date} at {m.time || '10:00 AM'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-blue-600" />
                      <span><strong>Location:</strong> {m.location || 'Google Meet'}</span>
                    </div>
                    {m.notes && (
                      <div className="flex items-start gap-2 pt-2 border-t border-slate-200/60">
                        <FileText size={14} className="text-slate-400 shrink-0 mt-0.5" />
                        <span className="text-slate-600">{m.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                  {m.status === 'CONFIRMED' && (
                    <>
                      <a 
                        href={m.meetingLink || 'https://meet.google.com'} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider text-center transition-colors shadow-md shadow-blue-200 flex items-center justify-center gap-1.5"
                      >
                        <Video size={14} /> Join Call <ExternalLink size={10} />
                      </a>
                      <button 
                        onClick={() => updateMeetingStatus(m.meetingId || m.id || '', 'COMPLETED', user?.id || 'brand1', user?.role || 'BRAND_OWNER')}
                        className="p-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl transition-colors cursor-pointer"
                        title="Mark Completed"
                      >
                        <Check size={16} />
                      </button>
                      <button 
                        onClick={() => cancelMeeting(m.id)}
                        className="p-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                        title="Cancel Meeting"
                      >
                        <XCircle size={16} />
                      </button>
                    </>
                  )}
                  {m.status === 'COMPLETED' && (
                    <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 size={16} /> Session Successfully Completed
                    </div>
                  )}
                  {m.status === 'CANCELLED' && (
                    <div className="text-xs font-bold text-rose-600 flex items-center gap-1">
                      <XCircle size={16} /> Session Cancelled
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule Meeting Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-indigo-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-xl font-black text-indigo-950 font-heading mb-1">Schedule Franchise Meeting</h3>
            <p className="text-xs text-slate-500 mb-6">Select an unlocked lead to invite them to a video call.</p>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Franchise Lead</label>
                <select 
                  required
                  value={seekerId}
                  onChange={(e) => setSeekerId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
                >
                  <option value="">-- Choose Unlocked Lead --</option>
                  {unlockedSeekers.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.city} - ₹{s.investment}L)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Meeting Date</label>
                <input 
                  type="date" 
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Time Slot</label>
                <select 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
                >
                  <option value="10:00 AM">10:00 AM IST</option>
                  <option value="11:30 AM">11:30 AM IST</option>
                  <option value="02:30 PM">02:30 PM IST</option>
                  <option value="04:00 PM">04:00 PM IST</option>
                  <option value="06:30 PM">06:30 PM IST</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Agenda / Instructions</label>
                <textarea 
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Unit economics review and site location finalization..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs uppercase rounded-xl transition-colors shadow-md shadow-blue-200 cursor-pointer"
                >
                  Schedule Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
