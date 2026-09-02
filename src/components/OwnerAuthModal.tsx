import React, { useState } from 'react';
import { X, Lock, ShieldCheck, AlertCircle, ArrowRight, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';

interface OwnerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OwnerAuthModal({ isOpen, onClose }: OwnerAuthModalProps) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@brizx.in');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your owner credentials.');
      return;
    }

    // Authenticate Super Admin
    login(email, 'SUPER_ADMIN');
    onClose();
    navigate('/admin');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
            <div className="w-12 h-12 bg-blue-600/20 border border-blue-500/40 text-blue-400 rounded-2xl flex items-center justify-center mb-3">
              <Lock size={24} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-white font-heading">
              BrizX Owner Console Auth
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Restricted portal entry for BrizX India platform administrators.
            </p>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2 border border-red-200">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@brizx.in"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                Owner Passcode / Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter security passcode..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500 font-medium pr-10"
                />
                <KeyRound size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                Default Owner Passcode: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-600 dark:text-slate-300">admin123</code>
              </span>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="flex-1 py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                ACCESS OWNER CONSOLE <ArrowRight size={14} />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
