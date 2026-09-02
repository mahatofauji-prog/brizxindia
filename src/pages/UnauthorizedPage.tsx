import React from 'react';
import { ShieldAlert, ArrowLeft, Home, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';

export default function UnauthorizedPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleReturn = () => {
    if (user?.role === 'FRANCHISE_SEEKER') {
      navigate('/seeker');
    } else if (user?.role === 'BRAND_OWNER') {
      navigate('/brand');
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800/80 border border-slate-700 rounded-3xl p-8 text-center space-y-6 shadow-2xl backdrop-blur-xl">
        <div className="w-20 h-20 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert size={40} />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-red-500/20">
            Access Restricted
          </span>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white font-heading">
            Super Admin Privileges Required
          </h1>
          <p className="text-slate-400 text-xs leading-relaxed">
            You do not have permission to access the Owner Console directly. Normal user actions do not open administrative controls.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <button
            onClick={handleReturn}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
          >
            <LayoutDashboard size={16} /> RETURN TO YOUR PORTAL
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl text-xs font-black uppercase tracking-wider border border-red-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <LogOut size={16} /> LOG OUT FROM CURRENT ACCOUNT
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Home size={16} /> BACK TO HOME PAGE
          </button>
        </div>
      </div>
    </div>
  );
}
