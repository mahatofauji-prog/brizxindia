import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  
  const paramRole = searchParams.get('role');
  const defaultRole: Role = (paramRole === 'FRANCHISE_SEEKER' || paramRole === 'BRAND_OWNER') ? paramRole : 'BRAND_OWNER';
  const redirectTo = searchParams.get('redirectTo');

  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>(defaultRole);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let selectedRole = role;
    if (email.trim().toLowerCase() === 'admin@brizx.in') {
      selectedRole = 'SUPER_ADMIN';
    }
    
    await login(email, selectedRole);
    
    if (redirectTo) {
      navigate(redirectTo);
    } else if (selectedRole === 'SUPER_ADMIN') {
      navigate('/admin');
    } else if (selectedRole === 'BRAND_OWNER') {
      navigate('/brand');
    } else {
      navigate('/seeker');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-6 bg-slate-50/50">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-200/80">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-slate-950 mx-auto flex items-center justify-center rounded-xl mb-4 shadow-sm">
            <span className="text-blue-500 font-extrabold text-2xl">B</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight font-heading">Welcome Back</h2>
          <p className="text-xs text-slate-400 mt-2">Sign in to access your direct matching panel</p>
        </div>

        <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-xl">
          <button 
             type="button"
             onClick={() => setRole('BRAND_OWNER')}
             className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${role === 'BRAND_OWNER' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Brand
           </button>
           <button 
             type="button"
             onClick={() => setRole('FRANCHISE_SEEKER')}
             className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${role === 'FRANCHISE_SEEKER' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Seeker
           </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-slate-900 transition-colors"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex justify-between">
              <span>Password</span>
              <a href="#" className="text-blue-500 hover:text-blue-600 normal-case tracking-normal">Forgot?</a>
            </label>
            <input 
              type="password" 
              required
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-slate-900 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="w-full py-3.5 bg-slate-950 hover:bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md mt-6 cursor-pointer">
            Sign In
          </button>
        </form>

        <p className="text-center text-xs font-semibold text-slate-400 mt-8">
          Don't have an account? <Link to="/register" className="text-blue-500 font-bold hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}
