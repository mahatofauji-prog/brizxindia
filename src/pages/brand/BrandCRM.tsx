import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { calculateMatchScore } from '../../data/mockDb';
import { LeadStage, CRMTask } from '../../types';
import { 
  Search, Mail, Calendar, Phone, MapPin, Briefcase, IndianRupee, Clock, Plus, 
  Target, MessageSquare, CheckSquare, ChevronDown, Check, Sparkles, Filter, AlertCircle
} from 'lucide-react';

export default function BrandCRM() {
  const { user } = useAuth();
  const { 
    seekers, brands, crmNotes, crmTasks, leadStages, connectionRequests,
    addCRMNote, updateLeadStage, addCRMTask, toggleCRMTask, scheduleMeeting, updateConnectionStatus,
    recordLeadContactAction
  } = useData();

  const currentBrand = brands.find(b => b.id === user?.id || (user?.email && b.email === user?.email));
  if (!currentBrand) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Complete your Brand Profile</h2>
        <p className="text-slate-500">Please set up your brand profile to access this page.</p>
      </div>
    );
  }
  const brandRequests = connectionRequests.filter(cr => cr.brandId === currentBrand.id || cr.brandName === currentBrand.brandName);
  const unlockedSeekers = seekers.filter(s => (currentBrand.unlockedLeads || []).includes(s.id));

  const [selectedSeekerId, setSelectedSeekerId] = useState<string | null>(unlockedSeekers[0]?.id || null);
  const [noteText, setNoteText] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskPriority, setTaskPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [activeTab, setActiveTab] = useState<'NOTES' | 'TASKS'>('NOTES');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('11:00 AM');
  const [meetingAgenda, setMeetingAgenda] = useState('');

  const selectedSeeker = unlockedSeekers.find(s => s.id === selectedSeekerId);
  const seekerNotes = crmNotes.filter(n => n.seekerId === selectedSeekerId && n.brandId === currentBrand.id);
  const seekerTasks = crmTasks.filter(t => t.seekerId === selectedSeekerId && t.brandId === currentBrand.id);

  const currentStageRecord = leadStages.find(l => l.seekerId === selectedSeekerId && l.brandId === currentBrand.id);
  const currentStage: LeadStage = currentStageRecord?.stage || 'NEW';

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim() || !selectedSeekerId) return;
    
    addCRMNote({
      brandId: currentBrand.id,
      seekerId: selectedSeekerId,
      text: noteText
    });
    setNoteText('');
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !selectedSeekerId) return;

    addCRMTask({
      brandId: currentBrand.id,
      seekerId: selectedSeekerId,
      title: taskTitle,
      dueDate: taskDueDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      priority: taskPriority
    });
    setTaskTitle('');
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeekerId || !meetingDate) return;

    scheduleMeeting({
      brandId: currentBrand.id,
      seekerId: selectedSeekerId,
      date: meetingDate,
      time: meetingTime,
      status: 'CONFIRMED',
      brandName: currentBrand.brandName,
      location: 'Google Meet / Online',
      notes: meetingAgenda || '1-on-1 Franchise Investment Review'
    });

    setShowScheduleModal(false);
    setMeetingAgenda('');
  };

  const stageColors: Record<LeadStage, { bg: string, text: string, border: string }> = {
    NEW: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    CONTACTED: { bg: 'bg-blue-50', text: 'text-indigo-700', border: 'border-blue-200' },
    MEETING_SCHEDULED: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    NEGOTIATING: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    LOI_SIGNED: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    CONVERTED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    LOST: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' }
  };

  if (unlockedSeekers.length === 0) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <Briefcase size={28} />
          </div>
          <h3 className="text-xl font-black text-indigo-950 mb-2 font-heading">Your CRM Pipeline is Empty</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-6 text-sm">
            Unlock lead profile contacts from the Smart Match Engine to manage follow-ups, tasks, and meetings here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-indigo-950 font-heading">Franchise CRM Pipeline</h1>
          <p className="text-slate-600 text-sm">Track lead status, log meeting activity notes, and manage follow-up tasks.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowScheduleModal(true)}
            className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-blue-200 flex items-center gap-2 cursor-pointer"
          >
            <Calendar size={16} /> Schedule Meeting
          </button>
        </div>
      </div>

      {/* Incoming Connection Requests Bar */}
      {brandRequests.length > 0 && (
        <div className="bg-blue-50/80 p-6 rounded-3xl border border-blue-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-blue-600" />
              <h3 className="text-sm font-black uppercase tracking-wider text-indigo-950 font-heading">Incoming Matched Brand Connection Requests ({brandRequests.length})</h3>
            </div>
            <span className="text-[10px] font-bold text-blue-700 uppercase bg-blue-100 px-2.5 py-1 rounded-full border border-blue-200">
              Direct Seeker Inquiries
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {brandRequests.map((req) => (
              <div key={req.id} className="bg-white p-4 rounded-2xl border border-blue-100 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-indigo-950 text-sm">{req.seekerName}</h4>
                    <span className="text-[10px] text-slate-500 font-semibold block">{req.seekerEmail} • {req.seekerPhone}</span>
                  </div>
                  <span className="px-2.5 py-1 bg-blue-600 text-white text-[10px] font-black rounded-lg shadow-xs">
                    {req.matchScore}% MATCH
                  </span>
                </div>

                <div className="text-xs text-slate-700 grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-medium">
                  <div><span className="text-slate-400 block text-[9px] uppercase font-bold">Location</span>{req.preferredLocation}</div>
                  <div><span className="text-slate-400 block text-[9px] uppercase font-bold">Capital</span>{req.availableInvestment}</div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-bold text-slate-500">
                    Status: <strong className="text-blue-700 uppercase">{req.status.replace('_', ' ')}</strong>
                  </span>
                  <div className="flex items-center gap-1.5">
                    {(req.status === 'REQUEST_SENT' || req.status === 'PENDING') && (
                      <>
                        <button
                          onClick={() => updateConnectionStatus(req.id, 'ACCEPTED')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase rounded-lg transition-colors cursor-pointer shadow-xs"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateConnectionStatus(req.id, 'BRAND_REVIEWING')}
                          className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] uppercase rounded-lg transition-colors cursor-pointer shadow-xs"
                        >
                          Reviewing
                        </button>
                      </>
                    )}
                    {req.status === 'BRAND_REVIEWING' && (
                      <button
                        onClick={() => updateConnectionStatus(req.id, 'ACCEPTED')}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase rounded-lg transition-colors cursor-pointer"
                      >
                        Accept Request
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Leads List Sidebar */}
        <div className="w-full lg:w-1/3 bg-white rounded-3xl border border-slate-200 overflow-hidden flex flex-col shadow-sm">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 shrink-0 relative">
            <Search size={16} className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search leads in CRM..." 
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {unlockedSeekers.map(seeker => {
              const stage = leadStages.find(l => l.seekerId === seeker.id && l.brandId === currentBrand.id)?.stage || 'NEW';
              const isSelected = selectedSeekerId === seeker.id;

              return (
                <button 
                  key={seeker.id}
                  onClick={() => setSelectedSeekerId(seeker.id)}
                  className={`w-full text-left p-3.5 rounded-2xl transition-all flex items-center justify-between gap-3 ${
                    isSelected ? 'bg-blue-50 border border-blue-200 shadow-sm' : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-black text-sm flex items-center justify-center shrink-0 border border-blue-200 overflow-hidden">
                      {seeker.avatar ? (
                        <img src={seeker.avatar} alt={seeker.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        seeker.name.charAt(0)
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-sm text-indigo-950 truncate">{seeker.name}</div>
                      <div className="text-xs text-slate-500 truncate flex items-center gap-1">
                        <MapPin size={10} /> {seeker.city} • ₹{seeker.investment}L
                      </div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-lg border ${stageColors[stage].bg} ${stageColors[stage].text} ${stageColors[stage].border}`}>
                    {stage.replace('_', ' ')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Lead CRM Workspace */}
        {selectedSeeker && (
          <div className="w-full lg:w-2/3 bg-white rounded-3xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
            {/* Header / Pipeline Stage Banner */}
            <div className="p-6 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white relative">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-700 text-white font-black text-2xl flex items-center justify-center shadow-md overflow-hidden shrink-0">
                    {selectedSeeker.avatar ? (
                      <img src={selectedSeeker.avatar} alt={selectedSeeker.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      selectedSeeker.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-black text-indigo-950 font-heading">{selectedSeeker.name}</h2>
                      <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-md">
                        Verified
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-semibold flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1"><MapPin size={12}/> {selectedSeeker.city}</span>
                      <span className="flex items-center gap-1"><IndianRupee size={12}/> ₹{selectedSeeker.investment} Lakhs</span>
                      <span className="flex items-center gap-1"><Clock size={12}/> {selectedSeeker.timeline}</span>
                    </p>
                  </div>
                </div>

                {/* Pipeline Stage Selector */}
                <div className="w-full sm:w-auto">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Lead Pipeline Stage</label>
                  <select 
                    value={currentStage}
                    onChange={(e) => updateLeadStage(currentBrand.id, selectedSeeker.id, e.target.value as LeadStage)}
                    className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-extrabold uppercase border cursor-pointer outline-none transition-all ${stageColors[currentStage].bg} ${stageColors[currentStage].text} ${stageColors[currentStage].border}`}
                  >
                    <option value="NEW">STAGE: NEW LEAD</option>
                    <option value="CONTACTED">STAGE: CONTACTED</option>
                    <option value="MEETING_SCHEDULED">STAGE: MEETING SCHEDULED</option>
                    <option value="NEGOTIATING">STAGE: NEGOTIATING</option>
                    <option value="LOI_SIGNED">STAGE: LOI SIGNED</option>
                    <option value="CONVERTED">STAGE: CONVERTED</option>
                    <option value="LOST">STAGE: LOST</option>
                  </select>
                </div>
              </div>

              {/* Direct Quick Contact Bar */}
              <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <a 
                  href={`tel:${selectedSeeker.phone}`} 
                  onClick={() => recordLeadContactAction(currentBrand.id, selectedSeeker.id, 'PHONE')}
                  className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2 font-bold text-slate-800 hover:border-blue-500 transition-colors"
                >
                  <Phone size={14} className="text-blue-600 shrink-0" /> {selectedSeeker.phone}
                </a>
                <a 
                  href={`mailto:${selectedSeeker.email}`} 
                  onClick={() => recordLeadContactAction(currentBrand.id, selectedSeeker.id, 'EMAIL')}
                  className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2 font-bold text-slate-800 hover:border-blue-500 transition-colors truncate"
                >
                  <Mail size={14} className="text-blue-600 shrink-0" /> <span className="truncate">{selectedSeeker.email}</span>
                </a>
                <a 
                  href={`https://wa.me/${(selectedSeeker.whatsApp || selectedSeeker.phone || '').replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="noreferrer"
                  onClick={() => recordLeadContactAction(currentBrand.id, selectedSeeker.id, 'WHATSAPP')}
                  className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-center gap-2 font-bold hover:bg-emerald-100 transition-colors truncate"
                >
                  <span className="font-black text-emerald-600">WA</span> <span className="truncate">WhatsApp</span>
                </a>
                <button 
                  onClick={() => setShowScheduleModal(true)}
                  className="p-3 bg-blue-700 text-white rounded-xl font-bold uppercase tracking-wider hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Calendar size={14} /> Schedule
                </button>
              </div>
            </div>

            {/* Tab Navigation (Notes vs Tasks) */}
            <div className="flex border-b border-slate-100 bg-slate-50/50">
              <button 
                onClick={() => setActiveTab('NOTES')}
                className={`px-6 py-3 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'NOTES' ? 'border-indigo-900 text-indigo-950 bg-white' : 'border-transparent text-slate-400 hover:text-blue-700'
                }`}
              >
                <MessageSquare size={14} /> Activity Notes ({seekerNotes.length})
              </button>
              <button 
                onClick={() => setActiveTab('TASKS')}
                className={`px-6 py-3 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'TASKS' ? 'border-indigo-900 text-indigo-950 bg-white' : 'border-transparent text-slate-400 hover:text-blue-700'
                }`}
              >
                <CheckSquare size={14} /> Follow-Up Tasks ({seekerTasks.length})
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
              {activeTab === 'NOTES' ? (
                <div className="space-y-4">
                  {seekerNotes.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-xs font-semibold">No activity notes recorded yet.</p>
                    </div>
                  ) : (
                    seekerNotes.map(n => (
                      <div key={n.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
                        <p className="text-sm font-medium text-slate-800 leading-relaxed">{n.text}</p>
                        <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2">
                          <span>📅 {new Date(n.createdAt).toLocaleDateString()}</span>
                          <span>⏰ {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {seekerTasks.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <CheckSquare size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-xs font-semibold">No follow-up tasks scheduled.</p>
                    </div>
                  ) : (
                    seekerTasks.map(t => (
                      <div key={t.id} className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        t.completed ? 'bg-slate-100 border-slate-200 opacity-60' : 'bg-white border-slate-200 shadow-sm'
                      }`}>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => toggleCRMTask(t.id)}
                            className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                              t.completed ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 hover:border-blue-600'
                            }`}
                          >
                            {t.completed && <Check size={14} />}
                          </button>
                          <div>
                            <span className={`text-sm font-bold text-indigo-950 ${t.completed ? 'line-through text-slate-500' : ''}`}>
                              {t.title}
                            </span>
                            <div className="text-[10px] font-semibold text-slate-400 mt-0.5">
                              Due: {t.dueDate}
                            </div>
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${
                          t.priority === 'HIGH' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {t.priority}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Input Form at Bottom */}
            <div className="p-4 bg-white border-t border-slate-100">
              {activeTab === 'NOTES' ? (
                <form onSubmit={handleAddNote} className="flex gap-3">
                  <input 
                    type="text" 
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Log a new activity note or call outcome..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-blue-500 font-medium"
                  />
                  <button 
                    type="submit"
                    disabled={!noteText.trim()}
                    className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-indigo-200 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={14} /> Add Note
                  </button>
                </form>
              ) : (
                <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Task title (e.g. Send LOI document)..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-blue-500 font-medium"
                  />
                  <input 
                    type="date" 
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none"
                  />
                  <button 
                    type="submit"
                    disabled={!taskTitle.trim()}
                    className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-blue-200 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus size={14} /> Add Task
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Schedule Meeting Modal */}
      {showScheduleModal && selectedSeeker && (
        <div className="fixed inset-0 bg-indigo-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-xl font-black text-indigo-950 font-heading mb-2">Schedule Meeting</h3>
            <p className="text-xs text-slate-500 mb-6">Setup a 1-on-1 virtual franchise presentation with <strong>{selectedSeeker.name}</strong>.</p>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Meeting Date</label>
                <input 
                  type="date" 
                  required
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Time Slot</label>
                <select 
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
                >
                  <option value="10:00 AM">10:00 AM IST</option>
                  <option value="11:30 AM">11:30 AM IST</option>
                  <option value="02:00 PM">02:00 PM IST</option>
                  <option value="04:30 PM">04:30 PM IST</option>
                  <option value="06:00 PM">06:00 PM IST</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Meeting Agenda & Notes</label>
                <textarea 
                  rows={3}
                  value={meetingAgenda}
                  onChange={(e) => setMeetingAgenda(e.target.value)}
                  placeholder="e.g. Unit Economics, Territory Exclusivity & Site Approval Discussion..."
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
                  Confirm Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
