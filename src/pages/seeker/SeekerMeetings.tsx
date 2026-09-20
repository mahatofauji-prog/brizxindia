import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  Calendar as CalendarIcon, Clock, Video, XCircle, CheckCircle, MapPin, 
  ExternalLink, Plus, RefreshCw, AlertCircle, Sparkles, ChevronLeft, ChevronRight, X 
} from 'lucide-react';
import { SeekerHero } from '../../components/seeker/SeekerHero';
import { seekerTheme } from '../../theme/seekerTheme';

export default function SeekerMeetings() {
  const { user } = useAuth();
  const { meetings, brands, scheduleMeeting, cancelMeeting } = useData();
  
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'PENDING' | 'COMPLETED' | 'CANCELLED'>('UPCOMING');
  const [showBookModal, setShowBookModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState<any>(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Booking Form State
  const [bookBrandId, setBookBrandId] = useState('');
  const [bookDate, setBookDate] = useState('');
  const [bookTime, setBookTime] = useState('11:00 AM');
  const [bookNotes, setBookNotes] = useState('');

  // Reschedule Form State
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('02:00 PM');

  const myMeetings = meetings.filter(m => m.seekerId === user?.id);

  // Split into categories
  const upcomingMeetings = myMeetings.filter(m => m.status === 'CONFIRMED');
  const pendingMeetings = myMeetings.filter(m => m.status === 'PENDING');
  const completedMeetings = myMeetings.filter(m => m.status === 'COMPLETED');
  const pastMeetings = myMeetings.filter(m => m.status === 'CANCELLED');

  const getFilteredMeetings = () => {
    switch (activeTab) {
      case 'UPCOMING': return upcomingMeetings;
      case 'PENDING': return pendingMeetings;
      case 'COMPLETED': return completedMeetings;
      case 'CANCELLED': return pastMeetings;
      default: return upcomingMeetings;
    }
  };

  const currentMeetings = getFilteredMeetings();

  const getBrandName = (meeting: any) => {
    if (meeting.brandName) return meeting.brandName;
    return brands.find(b => b.id === meeting.brandId)?.brandName || 'Franchise Partner';
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookBrandId || !bookDate) return;

    const brand = brands.find(b => b.id === bookBrandId);
    scheduleMeeting({
      brandId: bookBrandId,
      seekerId: user?.id || 'seeker-1',
      date: bookDate,
      time: bookTime,
      status: 'PENDING',
      brandName: brand?.brandName || 'Franchise Partner',
      notes: bookNotes || 'Regular consultation'
    });

    setShowBookModal(false);
    setBookNotes('');
    triggerSuccess('Consultation meeting requested successfully! Awaiting founder confirmation.');
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showRescheduleModal || !rescheduleDate) return;

    showRescheduleModal.date = rescheduleDate;
    showRescheduleModal.time = rescheduleTime;
    showRescheduleModal.status = 'PENDING';
    
    setShowRescheduleModal(null);
    triggerSuccess(`Meeting with ${getBrandName(showRescheduleModal)} rescheduled to ${rescheduleDate} at ${rescheduleTime}.`);
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4500);
  };

  // Static Mini Calendar Highlights
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const scheduledDays = myMeetings
    .filter(m => m.status === 'CONFIRMED' || m.status === 'PENDING')
    .map(m => new Date(m.date).getDate() || 15);

  return (
    <div className={seekerTheme.pageContainer}>
      
      {/* Toast message */}
      {successMsg && (
        <div className="fixed top-24 right-6 bg-slate-900 text-white border border-blue-100 rounded-2xl px-4 py-3 text-xs font-bold flex items-center gap-2 shadow-xl z-50 animate-fadeIn">
          <Sparkles className="text-blue-400" size={14} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Standardized Page Banner */}
      <SeekerHero
        pageKey="meetings"
        title="Consultation Scheduler"
        description="Book, manage, and track strategic discussions with certified franchise founders."
        badgeText="Strategy Calendar"
        actions={
          <button
            onClick={() => setShowBookModal(true)}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} /> Schedule Discussion
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: MEETING CALENDAR & TIPS */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Calendar Widget */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCE4F0] shadow-xs space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#EAF0F8]">
              <span className="text-xs font-extrabold text-[#172033] uppercase tracking-wider">August 2026</span>
              <div className="flex gap-1">
                <button className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"><ChevronLeft size={14} /></button>
                <button className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"><ChevronRight size={14} /></button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {/* Previous month padding */}
              <span className="text-slate-300 py-1 text-xs text-center font-medium">26</span>
              <span className="text-slate-300 py-1 text-xs text-center font-medium">27</span>
              <span className="text-slate-300 py-1 text-xs text-center font-medium">28</span>
              <span className="text-slate-300 py-1 text-xs text-center font-medium">29</span>
              <span className="text-slate-300 py-1 text-xs text-center font-medium">30</span>
              <span className="text-slate-300 py-1 text-xs text-center font-medium">31</span>
              {calendarDays.map(day => {
                const hasMeeting = scheduledDays.includes(day);
                return (
                  <button
                    key={day}
                    onClick={() => triggerSuccess(`Selected schedule index: Aug ${day}, 2026.`)}
                    className={`py-1 text-xs font-extrabold rounded-xl cursor-pointer transition-all ${
                      hasMeeting 
                        ? 'bg-blue-600 text-white shadow-xs' 
                        : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 text-[10px] font-semibold text-slate-500 border-t border-[#EAF0F8]">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-600 block"></span> Booked Call</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-200 block"></span> Available</span>
            </div>
          </div>

          <div className="p-5 bg-blue-50/70 border border-blue-200 rounded-3xl space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-blue-600" />
              <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider">Preparation Checklist</h4>
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed font-normal">
              Always review the brand's Capex and ROI estimates using the BrizX calculator before joining discussions. Note down questions regarding territory rights and supply-chain logistics.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: TABS & MEETINGS LIST */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex gap-2 p-1.5 bg-white border border-[#DCE4F0] rounded-2xl w-full shadow-xs">
            <button
              onClick={() => setActiveTab('UPCOMING')}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === 'UPCOMING' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
              }`}
            >
              Confirmed ({upcomingMeetings.length})
            </button>
            <button
              onClick={() => setActiveTab('PENDING')}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === 'PENDING' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
              }`}
            >
              Pending ({pendingMeetings.length})
            </button>
            <button
              onClick={() => setActiveTab('COMPLETED')}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === 'COMPLETED' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
              }`}
            >
              Completed ({completedMeetings.length})
            </button>
            <button
              onClick={() => setActiveTab('CANCELLED')}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === 'CANCELLED' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
              }`}
            >
              Past ({pastMeetings.length})
            </button>
          </div>

          <div className="space-y-4">
            {currentMeetings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#DCE4F0] shadow-xs flex flex-col items-center">
                <CalendarIcon size={36} className="text-slate-300 mb-3" />
                <h4 className="font-extrabold text-[#172033] text-sm">No scheduled consultations found</h4>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs">Use the schedule button to request a video consultation with verified brand leaders.</p>
              </div>
            ) : (
              currentMeetings.map(meeting => (
                <div 
                  key={meeting.id} 
                  className="bg-white rounded-3xl p-6 border border-[#DCE4F0] flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-xs">
                      <span className="text-[9px] font-bold uppercase text-blue-200">{new Date(meeting.date).toLocaleString('default', { month: 'short' })}</span>
                      <span className="text-lg font-black leading-none mt-0.5">{new Date(meeting.date).getDate() || '15'}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-extrabold text-[#172033] text-sm">{getBrandName(meeting)}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                          meeting.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          meeting.status === 'PENDING' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {meeting.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-500">
                        <span className="flex items-center gap-1"><Clock size={12} className="text-blue-600" /> {meeting.time || '11:00 AM IST'}</span>
                        <span className="flex items-center gap-1"><Video size={12} className="text-blue-600" /> {meeting.location || 'Google Meet Video Call'}</span>
                      </div>

                      {meeting.notes && (
                        <p className="text-[11px] text-slate-600 bg-[#F6F9FC] p-2.5 rounded-xl border border-[#E2EAF4]">
                          {meeting.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {meeting.status === 'CONFIRMED' && (
                      <a
                        href={meeting.meetingLink || '#'}
                        onClick={(e) => { if(!meeting.meetingLink) e.preventDefault(); }}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Video size={12} /> Join Call
                      </a>
                    )}

                    {(meeting.status === 'CONFIRMED' || meeting.status === 'PENDING') && (
                      <button
                        onClick={() => {
                          setRescheduleDate(meeting.date);
                          setRescheduleTime(meeting.time || '11:00 AM');
                          setShowRescheduleModal(meeting);
                        }}
                        className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer"
                      >
                        Reschedule
                      </button>
                    )}

                    {meeting.status === 'PENDING' && (
                      <button
                        onClick={() => {
                          cancelMeeting(meeting.id);
                          triggerSuccess('Meeting request cancelled.');
                        }}
                        className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl cursor-pointer transition-colors border border-rose-200"
                        title="Cancel Request"
                      >
                        <XCircle size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MODAL 1: SCHEDULE DISCUSSION */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleBookSubmit} className="bg-white rounded-3xl border border-[#DCE4F0] shadow-2xl w-full max-w-md p-6 sm:p-8 space-y-5 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-[#EAF0F8] pb-3">
              <h3 className="font-extrabold text-[#172033] text-base font-heading">Book Strategy Call</h3>
              <button type="button" onClick={() => setShowBookModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"><X size={18} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Select Franchise Brand</label>
                <select 
                  required
                  value={bookBrandId}
                  onChange={(e) => setBookBrandId(e.target.value)}
                  className="w-full bg-[#F6F9FC] border border-[#DCE4F0] rounded-xl px-4 py-3 text-xs font-semibold text-[#172033] cursor-pointer focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Choose Brand --</option>
                  {brands.map(b => (
                    <option key={b.id} value={b.id}>{b.brandName} ({b.industry})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Date</label>
                <input 
                  type="date" 
                  required
                  value={bookDate}
                  onChange={(e) => setBookDate(e.target.value)}
                  className="w-full bg-[#F6F9FC] border border-[#DCE4F0] rounded-xl px-4 py-3 text-xs font-semibold text-[#172033] cursor-pointer focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Time Slot</label>
                <select 
                  value={bookTime}
                  onChange={(e) => setBookTime(e.target.value)}
                  className="w-full bg-[#F6F9FC] border border-[#DCE4F0] rounded-xl px-4 py-3 text-xs font-semibold text-[#172033] cursor-pointer focus:outline-none focus:border-blue-500"
                >
                  <option value="10:00 AM">10:00 AM IST</option>
                  <option value="11:00 AM">11:00 AM IST</option>
                  <option value="02:00 PM">02:00 PM IST</option>
                  <option value="04:00 PM">04:00 PM IST</option>
                  <option value="06:00 PM">06:00 PM IST</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Strategic Agenda / Notes</label>
                <textarea 
                  rows={2}
                  value={bookNotes}
                  onChange={(e) => setBookNotes(e.target.value)}
                  placeholder="e.g. Territory exclusivity for Thane West, capex discount options."
                  className="w-full bg-[#F6F9FC] border border-[#DCE4F0] rounded-xl p-3.5 text-xs font-semibold text-[#172033] focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#EAF0F8]">
              <button 
                type="button" 
                onClick={() => setShowBookModal(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: RESCHEDULE DISCUSSION */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleRescheduleSubmit} className="bg-white rounded-3xl border border-[#DCE4F0] shadow-2xl w-full max-w-md p-6 sm:p-8 space-y-5 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-[#EAF0F8] pb-3">
              <h3 className="font-extrabold text-[#172033] text-base font-heading">Reschedule Slot</h3>
              <button type="button" onClick={() => setShowRescheduleModal(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"><X size={18} /></button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-slate-500">Revising time slot for meeting with <strong className="text-[#172033]">{getBrandName(showRescheduleModal)}</strong>.</p>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">New Date</label>
                <input 
                  type="date" 
                  required
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full bg-[#F6F9FC] border border-[#DCE4F0] rounded-xl px-4 py-3 text-xs font-semibold text-[#172033] cursor-pointer focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">New Time Slot</label>
                <select 
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full bg-[#F6F9FC] border border-[#DCE4F0] rounded-xl px-4 py-3 text-xs font-semibold text-[#172033] cursor-pointer focus:outline-none focus:border-blue-500"
                >
                  <option value="10:00 AM">10:00 AM IST</option>
                  <option value="11:00 AM">11:00 AM IST</option>
                  <option value="02:00 PM">02:00 PM IST</option>
                  <option value="04:00 PM">04:00 PM IST</option>
                  <option value="06:00 PM">06:00 PM IST</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#EAF0F8]">
              <button 
                type="button" 
                onClick={() => setShowRescheduleModal(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs"
              >
                Update Schedule
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
