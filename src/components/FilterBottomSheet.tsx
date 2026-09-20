import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, RotateCcw, Check } from 'lucide-react';

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
  badge?: string;
}

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  options: FilterOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  onReset?: () => void;
  resetLabel?: string;
}

export function FilterBottomSheet({
  isOpen,
  onClose,
  title,
  icon,
  options,
  selectedId,
  onSelect,
  onReset,
  resetLabel = 'Reset',
}: FilterBottomSheetProps) {
  const selectedItemRef = useRef<HTMLButtonElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // Scroll selected option into view when opened
  useEffect(() => {
    if (isOpen && selectedItemRef.current) {
      const timer = setTimeout(() => {
        selectedItemRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleOptionClick = (id: string) => {
    onSelect(id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay - matching Investment filter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-xs cursor-pointer"
            onClick={onClose}
          />

          {/* Centered White Modal Card - matching Investment Range styling */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`
              relative z-50 w-full max-w-[400px]
              bg-white text-slate-900
              rounded-3xl border border-slate-200
              shadow-2xl shadow-slate-900/30 overflow-hidden flex flex-col
              max-h-[78vh] sm:max-h-[72vh] p-5
            `}
          >
            {/* Header - Identical to Investment Range Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                {icon}
                <h4 className="text-xs font-black tracking-widest text-blue-900 uppercase">
                  {title}
                </h4>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Options List with Clean White Theme */}
            <div className="overflow-y-auto divide-y divide-slate-100 my-2 pr-1 overscroll-contain">
              {options.map((option) => {
                const isSelected = option.id === selectedId;

                return (
                  <button
                    key={option.id}
                    ref={isSelected ? selectedItemRef : undefined}
                    type="button"
                    onClick={() => handleOptionClick(option.id)}
                    className={`
                      w-full flex items-center justify-between px-3.5 py-3 text-left transition-all cursor-pointer rounded-xl my-0.5
                      ${
                        isSelected
                          ? 'bg-blue-50/90 text-blue-950 font-extrabold border border-blue-200 shadow-xs'
                          : 'hover:bg-slate-50 text-slate-700 font-semibold border border-transparent'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2.5 pr-3 min-w-0">
                      <span
                        className={`text-xs sm:text-sm truncate ${
                          isSelected ? 'text-blue-950 font-bold' : 'text-slate-700'
                        }`}
                      >
                        {option.label}
                      </span>
                      {option.badge && (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 shrink-0">
                          {option.badge}
                        </span>
                      )}
                    </div>

                    {/* Radio Button on Right */}
                    <div className="shrink-0 ml-2">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full border-2 border-blue-600 bg-blue-600 flex items-center justify-center shadow-xs">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 hover:border-blue-400 bg-white transition-colors" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer Actions - Matching Investment Range Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2.5 shrink-0 mt-auto">
              {onReset && (
                <button
                  type="button"
                  onClick={() => {
                    onReset();
                    onClose();
                  }}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                >
                  <RotateCcw size={13} /> {resetLabel}
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                Apply Filter
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
