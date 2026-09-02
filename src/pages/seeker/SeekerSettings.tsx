import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Settings, KeyRound, Shield, Bell, Lock, CheckCircle2, AlertTriangle, Trash2, Save, ShieldAlert, Key 
} from 'lucide-react';
import { SeekerHero } from '../../components/seeker/SeekerHero';
import { seekerTheme } from '../../theme/seekerTheme';

export default function SeekerSettings() {
  const { user } = useAuth();

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Passcode pin state
  const [passcode, setPasscode] = useState('4488');
  const [isPasscodeEditing, setIsPasscodeEditing] = useState(false);
  const [passcodeSuccess, setPasscodeSuccess] = useState(false);

  // Privacy toggles
  const [hidePhoneUnverified, setHidePhoneUnverified] = useState(true);
  const [hideProfileSearch, setHideProfileSearch] = useState(false);

  // Notification toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState(false);
  const [showDeletionModal, setShowDeletionModal] = useState(false);
  const [deletionConfirmed, setDeletionConfirmed] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    setTimeout(() => {
      setPasswordSuccess(false);
    }, 3500);
  };

  const handleSavePreferences = () => {
    setSavedSettingsSuccess(true);
    setTimeout(() => setSavedSettingsSuccess(false), 2500);
  };

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.length !== 4) return;
    setPasscodeSuccess(true);
    setIsPasscodeEditing(false);
    setTimeout(() => setPasscodeSuccess(false), 2500);
  };

  return (
    <div className={seekerTheme.pageContainer}>
      
      {/* Top Banner */}
      <SeekerHero
        pageKey="settings"
        badgeText="Security & Preferences"
        badgeIcon={<Settings size={14} className="text-blue-700" />}
        title="Security & Platform Settings"
        description="Manage password registries, document privacy masking, SMS/WhatsApp hooks, and security PINs."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LEFT CARD: CHANGE PASSWORD & PIN */}
        <div className="space-y-6">
          
          {/* Change Password */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-100/80 shadow-xs space-y-5">
            <div className="flex items-center gap-2 border-b border-blue-50 pb-3">
              <KeyRound className="text-blue-600" size={18} />
              <h3 className="font-extrabold text-slate-900 text-base font-heading">Change Password</h3>
            </div>

            {passwordSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                Password updated successfully.
              </div>
            )}

            {passwordError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-xs font-bold">
                {passwordError}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Current Password *</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className={seekerTheme.input}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">New Password *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className={seekerTheme.input}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Confirm Password *</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type password"
                  className={seekerTheme.input}
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
              >
                Update Password
              </button>
            </form>
          </div>

          {/* Secure Passcode PIN for Document Vault */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-100/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-blue-50 pb-3">
              <Key className="text-blue-600" size={18} />
              <h3 className="font-extrabold text-slate-900 text-base font-heading">Document Vault PIN</h3>
            </div>

            {passcodeSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={14} /> Vault access PIN updated successfully.
              </div>
            )}

            {isPasscodeEditing ? (
              <form onSubmit={handlePasscodeSubmit} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">New 4-Digit Passcode PIN</label>
                  <input
                    type="text"
                    maxLength={4}
                    required
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 4488"
                    className="w-24 bg-white border border-blue-200 rounded-xl px-3 py-2 text-center text-xs font-black text-slate-900 outline-none tracking-widest"
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="px-3.5 py-1.5 bg-blue-600 text-white text-[11px] font-bold rounded-xl cursor-pointer shadow-xs">Save PIN</button>
                  <button type="button" onClick={() => setIsPasscodeEditing(false)} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-xl cursor-pointer">Cancel</button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block font-normal">Active passcode protection</span>
                  <span className="text-xs font-black text-slate-900 tracking-widest">••••</span>
                </div>
                <button 
                  onClick={() => setIsPasscodeEditing(true)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  Modify PIN
                </button>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT CARD: PRIVACY, CHANNELS, & DELETION */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-100/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-blue-50 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="text-blue-600" size={18} />
                <h3 className="font-extrabold text-slate-900 text-base font-heading">Privacy & Alert Preferences</h3>
              </div>

              {savedSettingsSuccess && (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 animate-pulse">
                  <CheckCircle2 size={13} /> Saved!
                </span>
              )}
            </div>

            <div className="space-y-5">
              
              {/* Privacy Toggles */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visibility Locks</h4>

                <label className="flex items-center justify-between p-3.5 bg-slate-50/70 rounded-2xl border border-blue-100 cursor-pointer">
                  <div className="max-w-[80%]">
                    <span className="font-bold text-slate-900 text-xs block">Mask Number from Non-VIP Franchisors</span>
                    <span className="text-[10px] text-slate-500 leading-normal block mt-0.5">Telephone and WhatsApp channels are locked unless you book a confirmed date slot.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={hidePhoneUnverified}
                    onChange={(e) => setHidePhoneUnverified(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 bg-slate-50/70 rounded-2xl border border-blue-100 cursor-pointer">
                  <div className="max-w-[80%]">
                    <span className="font-bold text-slate-900 text-xs block">Incognito Search Mode</span>
                    <span className="text-[10px] text-slate-500 leading-normal block mt-0.5">Keep profile records private from brand directory searches until expressing manual interest.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={hideProfileSearch}
                    onChange={(e) => setHideProfileSearch(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                  />
                </label>
              </div>

              {/* Alert channels */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alert Channels</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <label className="p-3 bg-slate-50/70 rounded-xl border border-blue-100 flex items-center justify-between cursor-pointer">
                    <span className="text-xs font-bold text-slate-700">Email</span>
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                      className="accent-blue-600 cursor-pointer"
                    />
                  </label>

                  <label className="p-3 bg-slate-50/70 rounded-xl border border-blue-100 flex items-center justify-between cursor-pointer">
                    <span className="text-xs font-bold text-slate-700">WhatsApp</span>
                    <input
                      type="checkbox"
                      checked={whatsappAlerts}
                      onChange={(e) => setWhatsappAlerts(e.target.checked)}
                      className="accent-blue-600 cursor-pointer"
                    />
                  </label>

                  <label className="p-3 bg-slate-50/70 rounded-xl border border-blue-100 flex items-center justify-between cursor-pointer">
                    <span className="text-xs font-bold text-slate-700">SMS</span>
                    <input
                      type="checkbox"
                      checked={smsAlerts}
                      onChange={(e) => setSmsAlerts(e.target.checked)}
                      className="accent-blue-600 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              <button
                onClick={handleSavePreferences}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                <Save size={14} /> Save Preferences
              </button>
            </div>
          </div>

          {/* Account Deletion Gate */}
          <div className="bg-rose-50/50 border border-rose-200 rounded-3xl p-6 space-y-3.5 shadow-xs">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="text-rose-600 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Deactivate Account</h4>
                <p className="text-[11px] text-slate-600 mt-1 leading-normal">
                  Permanently wipe your profile, saved brands list, custom due-diligence logs, and document vault records. This action cannot be undone.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowDeletionModal(true)}
              className="px-4 py-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-100 text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
            >
              Request Deletion
            </button>
          </div>

        </div>

      </div>

      {/* DELETION CONFIRMATION MODAL */}
      {showDeletionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-blue-100 w-full max-w-sm p-6 sm:p-8 space-y-5 shadow-2xl animate-fadeIn">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 border border-rose-200 rounded-full flex items-center justify-center mx-auto">
                <ShieldAlert size={24} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base font-heading">Are you absolutely sure?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                All saved brands, FDD due-diligence trackers, and strategy call schedules will be permanently purged.
              </p>
            </div>

            {deletionConfirmed ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold p-3.5 rounded-xl text-center">
                Deletion requested. Our privacy compliance team will reach out via email.
              </div>
            ) : (
              <div className="flex gap-2.5">
                <button
                  onClick={() => setShowDeletionModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setDeletionConfirmed(true);
                    setTimeout(() => {
                      setDeletionConfirmed(false);
                      setShowDeletionModal(false);
                    }, 3000);
                  }}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs transition-colors"
                >
                  Yes, Wipe Data
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
