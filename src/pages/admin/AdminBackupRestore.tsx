import React, { useState } from 'react';
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs';
import { ConfirmationModal } from '../../components/admin/ConfirmationModal';
import { 
  Database, HardDrive, RefreshCw, Download, CheckCircle, Clock, 
  ShieldAlert, Server, Play, AlertTriangle
} from 'lucide-react';

export default function AdminBackupRestore() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [restoreConfirmId, setRestoreConfirmId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const [snapshots, setSnapshots] = useState([
    { id: 'snap-20260804', filename: 'brizx_prod_full_20260804.dump', date: '2026-08-04 03:00:00', size: '142.8 MB', type: 'AUTOMATED_DAILY', status: 'HEALTHY' },
    { id: 'snap-20260803', filename: 'brizx_prod_full_20260803.dump', date: '2026-08-03 03:00:00', size: '141.2 MB', type: 'AUTOMATED_DAILY', status: 'HEALTHY' },
    { id: 'snap-20260728', filename: 'brizx_prod_weekly_20260728.dump', date: '2026-07-28 00:00:00', size: '138.5 MB', type: 'WEEKLY_FULL', status: 'HEALTHY' }
  ]);

  const [schedule, setSchedule] = useState('DAILY');

  const triggerManualBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      const newSnap = {
        id: `snap-${Date.now()}`,
        filename: `brizx_manual_snap_${new Date().toISOString().slice(0, 10)}.dump`,
        date: new Date().toLocaleString(),
        size: '143.5 MB',
        type: 'MANUAL_TRIGGER',
        status: 'HEALTHY'
      };
      setSnapshots(prev => [newSnap, ...prev]);
      setIsBackingUp(false);
      showToast('System backup created successfully! Snapshot verified.');
    }, 2500);
  };

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto">
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-blue-700 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-indigo-700 animate-in fade-in">
          <CheckCircle size={18} className="text-blue-500" />
          <span className="text-xs font-bold uppercase tracking-wider">{toastMessage}</span>
        </div>
      )}

      <AdminBreadcrumbs items={[{ label: 'Super Admin', path: '/admin' }, { label: 'Backup & Disaster Recovery' }]} />

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-indigo-950 mb-2 font-heading flex items-center gap-3">
            <Database size={32} className="text-blue-600" /> Database Backup & Disaster Recovery
          </h1>
          <p className="text-slate-600">Schedule daily automated snapshots, execute instant manual backups, and restore platform state.</p>
        </div>

        <button 
          onClick={triggerManualBackup}
          disabled={isBackingUp}
          className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-indigo-200 flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isBackingUp ? (
            <>
              <RefreshCw size={16} className="animate-spin text-blue-400" /> Generating Snapshot...
            </>
          ) : (
            <>
              <Play size={16} className="text-blue-400" /> Create Backup Now
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        {/* Left Column: Schedule Settings */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between overflow-y-auto">
          <div>
            <h3 className="text-base font-black text-indigo-950 font-heading mb-4 flex items-center gap-2">
              <Server size={18} className="text-blue-600" /> Snapshot Schedule
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Automated Frequency</label>
                <select 
                  value={schedule}
                  onChange={(e) => {
                    setSchedule(e.target.value);
                    showToast('Updated backup schedule.');
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none cursor-pointer"
                >
                  <option value="DAILY">Daily at Midnight (00:00 IST)</option>
                  <option value="HOURLY">Every 6 Hours (Incremental)</option>
                  <option value="WEEKLY">Weekly on Sunday</option>
                  <option value="OFF">Disabled (Manual Only)</option>
                </select>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Storage Location</span>
                <span className="text-xs font-bold text-blue-700">Encrypted AWS S3 Bucket (ap-south-1)</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Retention Policy</span>
                <span className="text-xs font-bold text-blue-700">30 Days Rolling Snapshots</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Snapshots Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs flex flex-col min-h-0">
          <h3 className="text-lg font-black text-indigo-950 font-heading mb-4">Available System Snapshots</h3>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 text-xs font-bold text-slate-400 uppercase">Snapshot File</th>
                  <th className="py-3.5 px-4 text-xs font-bold text-slate-400 uppercase">Created Date</th>
                  <th className="py-3.5 px-4 text-xs font-bold text-slate-400 uppercase">Size</th>
                  <th className="py-3.5 px-4 text-xs font-bold text-slate-400 uppercase">Type</th>
                  <th className="py-3.5 px-4 text-xs font-bold text-slate-400 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {snapshots.map((snap) => (
                  <tr key={snap.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-4 font-mono font-bold text-xs text-indigo-950 flex items-center gap-2">
                      <HardDrive size={16} className="text-blue-600 shrink-0" /> {snap.filename}
                    </td>
                    <td className="py-4 px-4 text-xs font-semibold text-slate-600">{snap.date}</td>
                    <td className="py-4 px-4 text-xs font-black text-slate-800">{snap.size}</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-50 text-blue-700 border border-blue-100">
                        {snap.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => showToast(`Downloading ${snap.filename}...`)}
                          className="p-1.5 text-slate-400 hover:text-blue-700 cursor-pointer"
                          title="Download Snapshot"
                        >
                          <Download size={16} />
                        </button>
                        <button 
                          onClick={() => setRestoreConfirmId(snap.id)}
                          className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-[10px] font-bold uppercase rounded-md cursor-pointer"
                        >
                          Restore
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={!!restoreConfirmId}
        title="Restore Database Snapshot"
        message="DANGER: Restoring this snapshot will overwrite current platform state with data from the selected snapshot date. Are you sure you want to proceed?"
        confirmText="Confirm Restoration"
        variant="danger"
        onConfirm={() => {
          showToast('Database state restored successfully!');
          setRestoreConfirmId(null);
        }}
        onCancel={() => setRestoreConfirmId(null)}
      />
    </div>
  );
}
