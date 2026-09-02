import React from 'react';

import verificationImg from '../assets/images/stage_verification_1788089362329.jpg';
import matchmakingImg from '../assets/images/stage_matchmaking_1788089376515.jpg';
import closeoutImg from '../assets/images/stage_closeout_1788089390165.jpg';

interface StageVisualProps {
  className?: string;
}

export const VerificationVisual: React.FC<StageVisualProps> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full group overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-50/80 via-white to-sky-50/60 p-1 border border-blue-100/80 shadow-[0_8px_20px_-6px_rgba(37,99,235,0.08)] ${className}`}>
      <img
        src={verificationImg}
        alt="Verified & Audited Business"
        loading="lazy"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover object-center rounded-lg sm:rounded-xl group-hover:scale-105 transition-transform duration-500 ease-out"
      />
      <div className="absolute inset-0 rounded-lg sm:rounded-xl ring-1 ring-inset ring-black/5 pointer-events-none" />
    </div>
  );
};

export const MatchmakingVisual: React.FC<StageVisualProps> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full group overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-50 via-white to-blue-50/60 p-1 border border-blue-100/80 shadow-[0_8px_20px_-6px_rgba(37,99,235,0.08)] ${className}`}>
      <img
        src={matchmakingImg}
        alt="Smart Brand–Investor Matching"
        loading="lazy"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover object-center rounded-lg sm:rounded-xl group-hover:scale-105 transition-transform duration-500 ease-out"
      />
      <div className="absolute inset-0 rounded-lg sm:rounded-xl ring-1 ring-inset ring-black/5 pointer-events-none" />
    </div>
  );
};

export const CloseoutVisual: React.FC<StageVisualProps> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full group overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-50/80 via-white to-emerald-50/40 p-1 border border-blue-100/80 shadow-[0_8px_20px_-6px_rgba(37,99,235,0.08)] ${className}`}>
      <img
        src={closeoutImg}
        alt="Deal Successfully Closed"
        loading="lazy"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover object-center rounded-lg sm:rounded-xl group-hover:scale-105 transition-transform duration-500 ease-out"
      />
      <div className="absolute inset-0 rounded-lg sm:rounded-xl ring-1 ring-inset ring-black/5 pointer-events-none" />
    </div>
  );
};
