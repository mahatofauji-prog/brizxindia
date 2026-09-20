import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { 
  Lock, Sparkles, CheckCircle2, ArrowRight, X
} from 'lucide-react';

interface UnlockROIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

export default function UnlockROIModal({ isOpen, onClose, onUnlock }: UnlockROIModalProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  if (!isOpen) return null;

  const isSeeker = isAuthenticated && user && user.role === 'FRANCHISE_SEEKER';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Decorative Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 rounded-2xl">
            <Lock size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase tracking-wider mb-1">
              <Sparkles size={11} /> BrizX Pro Intelligence
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading tracking-tight">
              Unlock Advanced ROI Calculator
            </h2>
          </div>
        </div>

        {!isSeeker ? (
          <>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-medium">
              Create your free Seeker account to access advanced ROI calculations and investment insights.
            </p>

            {/* Feature Highlights Grid */}
            <div className="space-y-3 mb-6 bg-slate-50 dark:bg-slate-950/50 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Brand & Custom Unit Economics Models</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Select top Indian brands or input custom franchise parameters.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Itemized Capex & Monthly Opex Engine</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Detailed setup costs, fitouts, equipment, rent, payroll, and royalties.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">3-Scenario Financial Modeling</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Compare Conservative, Expected, and Optimistic revenue & profit yields.</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  navigate('/register');
                }}
                className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer animate-pulse"
              >
                <span>Sign Up Free</span>
                <ArrowRight size={15} />
              </button>
              
              <button
                onClick={() => {
                  onClose();
                  navigate('/login?redirectTo=/seeker/roi-calculator/advanced&role=FRANCHISE_SEEKER');
                }}
                className="w-full sm:w-auto py-3.5 px-5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-medium">
              Get detailed financial projections, 3-tier scenario analysis, itemized capex & opex modeling, ROI estimates, and investment recovery insights before deploying capital.
            </p>

            {/* Feature Highlights Grid */}
            <div className="space-y-3 mb-6 bg-slate-50 dark:bg-slate-950/50 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Brand & Custom Unit Economics Models</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Select top Indian brands or input custom franchise parameters.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Itemized Capex & Monthly Opex Engine</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Detailed setup costs, fitouts, equipment, rent, payroll, and royalties.</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => {
                  onUnlock();
                }}
                className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Unlock Advanced Calculator</span>
                <ArrowRight size={15} />
              </button>
              
              <button
                onClick={onClose}
                className="w-full sm:w-auto py-3.5 px-5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
