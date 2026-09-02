import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export function BrizXWelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [step, setStep] = useState(1);
  const [isBlinking, setIsBlinking] = useState(false);

  // Auto eye-blink animation loop for characters
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Welcome sequence timing
  useEffect(() => {
    // Step 1: Background fades in (0ms)
    // Step 2: Characters enter from sides (500ms)
    const enterTimer = setTimeout(() => setStep(2), 200);

    // Step 3: Board scales & fades in (1200ms)
    const boardTimer = setTimeout(() => setStep(3), 1100);

    // Step 4: Welcome animation/Smile/Bounce (2200ms)
    const smileTimer = setTimeout(() => setStep(4), 2100);

    // Step 5: Start exit fade out (4300ms)
    const fadeOutTimer = setTimeout(() => setStep(5), 4100);

    // Step 6: Trigger completion to homepage (4800ms)
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4700);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(boardTimer);
      clearTimeout(smileTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Support prefers-reduced-motion fallback
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  if (prefersReducedMotion) {
    // Elegant, ultra-fast fade transition for reduced motion users
    return (
      <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="flex flex-col items-center max-w-md"
        >
          <img 
            src="/logo.jpg" 
            alt="BrizX India" 
            className="w-24 h-24 rounded-full object-cover shadow-md mb-6 ring-4 ring-blue-50"
            referrerPolicy="no-referrer"
          />
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            BRIZX<span className="text-blue-600">INDIA</span>
          </h1>
          <p className="text-slate-500 font-bold tracking-widest text-xs uppercase mt-2">
            Search. Match. Grow.
          </p>
          <div className="w-12 h-1 bg-blue-600 rounded-full mt-6 animate-pulse" />
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {step < 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-gradient-to-tr from-[#EEF4FF] via-white to-[#F0F5FF] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Subtle animated particles in background */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <motion.div 
              animate={{ y: [0, -15, 0], opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute top-1/4 left-1/5 w-4 h-4 bg-blue-500/20 rounded-full blur-xs"
            />
            <motion.div 
              animate={{ y: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-1/3 right-1/4 w-6 h-6 bg-blue-400/20 rounded-full blur-xs"
            />
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              className="absolute top-1/3 right-12 w-20 h-20 bg-sky-200/30 rounded-full blur-md"
            />
            <motion.div 
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.3, 0.15] }}
              transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut', delay: 0.5 }}
              className="absolute bottom-10 left-10 w-32 h-32 bg-blue-100/40 rounded-full blur-lg"
            />
          </div>

          {/* Core scene container with responsive scaling for mobile safety */}
          <div className="relative flex flex-col items-center justify-center w-full max-w-5xl px-4 scale-[0.62] xs:scale-[0.72] sm:scale-85 md:scale-100 transition-all duration-300">
            
            {/* The main stage containing characters and presentation board */}
            <div className="relative flex items-end justify-center w-full h-[400px] md:h-[460px] select-none">
              
              {/* 1. MALE CHARACTER (LEFT) */}
              <motion.div
                initial={{ x: -350, opacity: 0 }}
                animate={step >= 2 ? { x: -140, opacity: 1 } : {}}
                transition={{ type: 'spring', damping: 18, stiffness: 85 }}
                className="absolute z-10 bottom-0 origin-bottom"
              >
                {/* Male body shape inside motion container */}
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
                  className="w-48 h-[360px] relative flex flex-col items-center"
                >
                  <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-lg">
                    <defs>
                      <linearGradient id="maleSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFD3B6" />
                        <stop offset="100%" stopColor="#F5B289" />
                      </linearGradient>
                      <linearGradient id="maleSuit" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1E40AF" />
                        <stop offset="100%" stopColor="#1E3A8A" />
                      </linearGradient>
                      <linearGradient id="maleHair" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2D1500" />
                        <stop offset="100%" stopColor="#110800" />
                      </linearGradient>
                    </defs>

                    {/* Left Leg */}
                    <path d="M35,145 L35,190 C35,193 30,195 26,195 L22,195 C20,195 20,190 22,188 L26,145 Z" fill="#475569" />
                    {/* Right Leg */}
                    <path d="M50,145 L50,190 C50,193 54,195 58,195 L62,195 C64,195 64,190 62,188 L58,145 Z" fill="#475569" />

                    {/* Torso/Suit */}
                    <path d="M22,78 C25,70 60,70 63,78 L60,145 L25,145 Z" fill="url(#maleSuit)" />
                    {/* White Collar & Red Tie */}
                    <polygon points="40,78 45,78 42,95" fill="#EF4444" />
                    <polygon points="38,78 42,90 47,78" fill="#FFFFFF" />

                    {/* Left Hand (Greeting / Wave) */}
                    <motion.g
                      animate={step >= 4 ? { rotate: [0, -12, 0, -12, 0] } : {}}
                      transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.5 }}
                      className="origin-[18px_82px]"
                    >
                      {/* Left Arm sleeve */}
                      <path d="M23,78 L12,110 C10,115 5,110 8,105 L18,78 Z" fill="#1D4ED8" />
                      {/* Hand */}
                      <circle cx="8" cy="110" r="7" fill="url(#maleSkin)" />
                    </motion.g>

                    {/* Right Arm (Holding Board) */}
                    <path d="M62,78 L78,98 L72,106 L58,94 Z" fill="#1D4ED8" />
                    {/* Right Hand overlapping board later */}
                    <circle cx="78" cy="100" r="7" fill="url(#maleSkin)" className="z-20" />

                    {/* Neck */}
                    <rect x="38" y="58" width="10" height="15" rx="3" fill="url(#maleSkin)" />

                    {/* Head */}
                    <circle cx="43" cy="45" r="18" fill="url(#maleSkin)" />

                    {/* Eyes */}
                    {!isBlinking ? (
                      <>
                        <circle cx="37" cy="42" r="2.5" fill="#0F172A" />
                        <circle cx="49" cy="42" r="2.5" fill="#0F172A" />
                        {/* Eye reflections */}
                        <circle cx="38" cy="41" r="0.8" fill="#FFFFFF" />
                        <circle cx="50" cy="41" r="0.8" fill="#FFFFFF" />
                      </>
                    ) : (
                      <>
                        {/* Blink state lines */}
                        <line x1="34" y1="42" x2="40" y2="42" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
                        <line x1="46" y1="42" x2="52" y2="42" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
                      </>
                    )}

                    {/* Cheeks */}
                    <ellipse cx="33" cy="47" rx="3" ry="1.5" fill="#F43F5E" opacity="0.3" />
                    <ellipse cx="53" cy="47" rx="3" ry="1.5" fill="#F43F5E" opacity="0.3" />

                    {/* Cheerful Smile */}
                    <motion.path
                      d="M37,51 Q43,58 49,51"
                      stroke="#4F1D00"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                    />

                    {/* Eyebrows */}
                    <path d="M33,37 Q37,35 41,37" stroke="#2D1500" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                    <path d="M45,37 Q49,35 53,37" stroke="#2D1500" strokeWidth="1.8" fill="none" strokeLinecap="round" />

                    {/* Corporate Hair */}
                    <path d="M23,40 C22,30 30,22 43,22 C56,22 62,28 62,38 C55,36 48,38 43,34 C38,38 30,36 23,40 Z" fill="url(#maleHair)" />
                  </svg>
                </motion.div>
              </motion.div>

              {/* 2. PRESENTATION BOARD (CENTER) */}
              <motion.div
                initial={{ scale: 0.3, opacity: 0, y: 30 }}
                animate={step >= 3 ? { scale: 1, opacity: 1, y: 0 } : {}}
                transition={{ type: 'spring', damping: 15, stiffness: 95 }}
                className="absolute z-20 bottom-12 flex justify-center w-[360px] xs:w-[420px] sm:w-[480px] md:w-[560px]"
              >
                <div className="w-full bg-white border-[3px] border-blue-600 rounded-[28px] py-6 px-8 shadow-[0_24px_50px_rgba(30,58,138,0.18)] flex items-center justify-between gap-5 relative overflow-hidden">
                  
                  {/* Glowing board accent lines */}
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-sky-400" />
                  <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-blue-50 rounded-full opacity-50 blur-md pointer-events-none" />

                  {/* Left Side: Logo */}
                  <div className="flex-shrink-0 relative group">
                    <img 
                      src="/logo.jpg" 
                      alt="BrizX Logo" 
                      className="w-16 h-16 xs:w-20 xs:h-20 rounded-full object-cover shadow-md ring-4 ring-blue-50 group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.15, 1], rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 3, delay: 1 }}
                      className="absolute -top-1 -right-1 bg-amber-400 text-white p-1 rounded-full shadow-md border border-white"
                    >
                      <Sparkles size={11} className="text-white fill-current" />
                    </motion.div>
                  </div>

                  {/* Right Side: Text Information */}
                  <div className="flex-1 text-left">
                    <span className="inline-block text-[10px] font-black tracking-widest text-blue-600 uppercase mb-1">
                      Welcome To India's Smartest Network
                    </span>
                    <h2 className="text-2xl xs:text-3xl font-black text-slate-900 tracking-tight leading-none">
                      BRIZX<span className="text-blue-600 font-black">INDIA</span>
                    </h2>
                    <p className="text-xs font-bold text-slate-400 tracking-[0.14em] uppercase mt-1">
                      Search. Match. Grow.
                    </p>
                    
                    {/* Tiny stats representation in board to look detailed */}
                    <div className="mt-3.5 pt-3.5 border-t border-slate-100 flex gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Vetted Brands</p>
                        <p className="text-xs font-extrabold text-slate-800 mt-1">1,200+</p>
                      </div>
                      <div className="border-l border-slate-100 pl-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Active Seekers</p>
                        <p className="text-xs font-extrabold text-slate-800 mt-1">18,000+</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 3. FEMALE CHARACTER (RIGHT) */}
              <motion.div
                initial={{ x: 350, opacity: 0 }}
                animate={step >= 2 ? { x: 140, opacity: 1 } : {}}
                transition={{ type: 'spring', damping: 18, stiffness: 85 }}
                className="absolute z-10 bottom-0 origin-bottom"
              >
                {/* Female body shape inside motion container */}
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut', delay: 0.3 }}
                  className="w-48 h-[360px] relative flex flex-col items-center"
                >
                  <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-lg">
                    <defs>
                      <linearGradient id="femaleSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFE0CC" />
                        <stop offset="100%" stopColor="#E59E7E" />
                      </linearGradient>
                      <linearGradient id="femaleSuit" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0891B2" />
                        <stop offset="100%" stopColor="#0E7490" />
                      </linearGradient>
                      <linearGradient id="femaleHair" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4A2600" />
                        <stop offset="100%" stopColor="#251200" />
                      </linearGradient>
                    </defs>

                    {/* Left Leg */}
                    <path d="M38,145 L38,190 C38,193 34,195 30,195 L26,195 C24,195 24,190 26,188 L30,145 Z" fill="#64748B" />
                    {/* Right Leg */}
                    <path d="M53,145 L53,190 C53,193 57,195 61,195 L65,195 C67,195 67,190 65,188 L61,145 Z" fill="#64748B" />

                    {/* Torso/Suit/Blouse */}
                    <path d="M25,78 C28,70 58,70 61,78 L58,145 L28,145 Z" fill="url(#femaleSuit)" />
                    {/* White Blouse V-neck */}
                    <polygon points="38,78 45,78 42,92" fill="#FFFFFF" />

                    {/* Left Arm (Holding Board) */}
                    <path d="M25,78 L10,98 L16,106 L30,94 Z" fill="#0E7490" />
                    {/* Left Hand holding board */}
                    <circle cx="10" cy="100" r="7" fill="url(#femaleSkin)" className="z-20" />

                    {/* Right Arm (Greeting / Wave) */}
                    <motion.g
                      animate={step >= 4 ? { rotate: [0, 12, 0, 12, 0] } : {}}
                      transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.6 }}
                      className="origin-[65px_82px]"
                    >
                      {/* Right Arm sleeve */}
                      <path d="M59,78 L71,110 C73,115 78,110 75,105 L65,78 Z" fill="#0E7490" />
                      {/* Hand */}
                      <circle cx="75" cy="110" r="7" fill="url(#femaleSkin)" />
                    </motion.g>

                    {/* Neck */}
                    <rect x="38" y="58" width="10" height="15" rx="3" fill="url(#femaleSkin)" />

                    {/* Head */}
                    <circle cx="43" cy="45" r="18" fill="url(#femaleSkin)" />

                    {/* Eyes */}
                    {!isBlinking ? (
                      <>
                        <circle cx="37" cy="42" r="2.5" fill="#0F172A" />
                        <circle cx="49" cy="42" r="2.5" fill="#0F172A" />
                        {/* Eye reflections & eyelashes */}
                        <circle cx="38" cy="41" r="0.8" fill="#FFFFFF" />
                        <circle cx="50" cy="41" r="0.8" fill="#FFFFFF" />
                        <path d="M34,39 Q37,38 38,40" stroke="#0F172A" strokeWidth="1" fill="none" />
                        <path d="M52,39 Q49,38 48,40" stroke="#0F172A" strokeWidth="1" fill="none" />
                      </>
                    ) : (
                      <>
                        {/* Blink state lines */}
                        <line x1="34" y1="42" x2="40" y2="42" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
                        <line x1="46" y1="42" x2="52" y2="42" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
                      </>
                    )}

                    {/* Cute Cheeks */}
                    <ellipse cx="32" cy="47" rx="3.5" ry="1.8" fill="#F43F5E" opacity="0.4" />
                    <ellipse cx="54" cy="47" rx="3.5" ry="1.8" fill="#F43F5E" opacity="0.4" />

                    {/* Cheerful Friendly Smile */}
                    <motion.path
                      d="M37,51 Q43,58 49,51"
                      stroke="#4F1D00"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                    />

                    {/* Eyebrows */}
                    <path d="M33,37 Q37,35 41,37" stroke="#4A2600" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    <path d="M45,37 Q49,35 53,37" stroke="#4A2600" strokeWidth="1.5" fill="none" strokeLinecap="round" />

                    {/* Elegant Long Hair */}
                    <path d="M22,42 C20,30 28,18 43,18 C58,18 64,28 64,42 C64,56 61,65 58,68 C58,54 53,42 43,42 C33,42 28,54 28,68 C25,65 22,56 22,42 Z" fill="url(#femaleHair)" />
                  </svg>
                </motion.div>
              </motion.div>

            </div>

            {/* Subtle Progress Bar & Action Notice */}
            <div className="mt-8 flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100/50 rounded-full text-blue-800 text-xs font-black uppercase tracking-widest">
                <Sparkles size={13} className="text-blue-600 animate-spin" />
                Connecting Investors & Brands
              </div>
              
              <div className="w-48 h-1.5 bg-blue-100 rounded-full overflow-hidden relative shadow-inner">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 4.2, ease: 'linear' }}
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-600 to-sky-400 rounded-full"
                />
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
