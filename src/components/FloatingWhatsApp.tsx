import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(true);
  const whatsappNumber = '919979510361';
  const whatsappMessage = encodeURIComponent(
    'Hello BrizX India! I am interested in Smart Franchise Matching and exploring franchise opportunities.'
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 group">
      {/* Tooltip banner */}
      {showTooltip && (
        <div className="bg-slate-950 text-white text-xs px-4 py-2.5 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-2 max-w-xs animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
          <div className="leading-tight">
            <span className="font-bold block">Talk to Our Expert</span>
            <span className="text-[10px] text-slate-400">WhatsApp: +91 99795 10361</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-slate-400 hover:text-white ml-1 cursor-pointer p-0.5"
            aria-label="Close message"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact on WhatsApp"
        className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 hover:scale-110 transition-all cursor-pointer relative"
      >
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-ping opacity-75"></span>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white"></span>
        <MessageCircle size={28} className="fill-current text-white" />
      </a>
    </div>
  );
}
