import React, { useState, useEffect, useRef } from 'react';
import { IndianRupee, ChevronDown, RotateCcw, Check, X, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface InvestmentStep {
  value: number; // in Lakhs
  label: string; // e.g. "₹5 Lakh"
  shortLabel: string; // e.g. "₹5L"
}

export const INVESTMENT_STEPS: InvestmentStep[] = [
  { value: 0, label: '₹0', shortLabel: '₹0' },
  { value: 1, label: '₹1 Lakh', shortLabel: '₹1L' },
  { value: 2, label: '₹2 Lakh', shortLabel: '₹2L' },
  { value: 3, label: '₹3 Lakh', shortLabel: '₹3L' },
  { value: 4, label: '₹4 Lakh', shortLabel: '₹4L' },
  { value: 5, label: '₹5 Lakh', shortLabel: '₹5L' },
  { value: 6, label: '₹6 Lakh', shortLabel: '₹6L' },
  { value: 7, label: '₹7 Lakh', shortLabel: '₹7L' },
  { value: 8, label: '₹8 Lakh', shortLabel: '₹8L' },
  { value: 9, label: '₹9 Lakh', shortLabel: '₹9L' },
  { value: 10, label: '₹10 Lakh', shortLabel: '₹10L' },
  { value: 15, label: '₹15 Lakh', shortLabel: '₹15L' },
  { value: 20, label: '₹20 Lakh', shortLabel: '₹20L' },
  { value: 25, label: '₹25 Lakh', shortLabel: '₹25L' },
  { value: 30, label: '₹30 Lakh', shortLabel: '₹30L' },
  { value: 40, label: '₹40 Lakh', shortLabel: '₹40L' },
  { value: 50, label: '₹50 Lakh', shortLabel: '₹50L' },
  { value: 75, label: '₹75 Lakh', shortLabel: '₹75L' },
  { value: 100, label: '₹1 Crore', shortLabel: '₹1Cr' },
  { value: 200, label: '₹2 Crore', shortLabel: '₹2Cr' },
  { value: 500, label: '₹5 Crore+', shortLabel: '₹5Cr+' },
];

export function formatBudgetDisplay(maxLakhs: number | null): string {
  if (maxLakhs === null) return 'Any Budget';
  if (maxLakhs === 0) return 'Up to ₹0';
  if (maxLakhs === 1) return 'Up to ₹1 Lakh';
  if (maxLakhs < 100) return `Up to ₹${maxLakhs} Lakhs`;
  if (maxLakhs === 100) return 'Up to ₹1 Crore';
  if (maxLakhs === 200) return 'Up to ₹2 Crore';
  if (maxLakhs >= 500) return 'Up to ₹5 Crore+';
  return `Up to ₹${maxLakhs} Lakhs`;
}

interface InvestmentRangeFilterProps {
  selectedMaxLakhs: number | null; // null = Any Budget
  onChange: (maxLakhs: number | null) => void;
}

export default function InvestmentRangeFilter({
  selectedMaxLakhs,
  onChange,
}: InvestmentRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Find initial step index corresponding to selectedMaxLakhs
  const getStepIndex = (lakhs: number | null): number => {
    if (lakhs === null) return 13; // Default slider position when Any Budget is selected (25 Lakhs)
    const idx = INVESTMENT_STEPS.findIndex((s) => s.value === lakhs);
    if (idx !== -1) return idx;
    // Find closest step
    let closestIdx = 0;
    let minDiff = Infinity;
    INVESTMENT_STEPS.forEach((step, i) => {
      const diff = Math.abs(step.value - lakhs);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = i;
      }
    });
    return closestIdx;
  };

  const [sliderIndex, setSliderIndex] = useState<number>(() => getStepIndex(selectedMaxLakhs));
  const [isAnyBudget, setIsAnyBudget] = useState<boolean>(selectedMaxLakhs === null);

  // Sync with props
  useEffect(() => {
    if (selectedMaxLakhs === null) {
      setIsAnyBudget(true);
    } else {
      setIsAnyBudget(false);
      setSliderIndex(getStepIndex(selectedMaxLakhs));
    }
  }, [selectedMaxLakhs]);

  // Handle click outside to close popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSliderChange = (newIndex: number) => {
    setSliderIndex(newIndex);
    setIsAnyBudget(false);
    const targetVal = INVESTMENT_STEPS[newIndex].value;
    onChange(targetVal);
  };

  const handleSelectAnyBudget = () => {
    setIsAnyBudget(true);
    onChange(null);
  };

  const handleQuickSelect = (lakhs: number | null) => {
    if (lakhs === null) {
      handleSelectAnyBudget();
    } else {
      setIsAnyBudget(false);
      const idx = getStepIndex(lakhs);
      setSliderIndex(idx);
      onChange(lakhs);
    }
  };

  const currentStep = INVESTMENT_STEPS[sliderIndex] || INVESTMENT_STEPS[13];
  const percentage = (sliderIndex / (INVESTMENT_STEPS.length - 1)) * 100;

  const currentDisplayText = isAnyBudget
    ? 'Any Budget'
    : formatBudgetDisplay(currentStep.value);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* TRIGGER BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-2xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer border ${
          isOpen || !isAnyBudget
            ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-slate-100'
        }`}
      >
        <IndianRupee size={14} className="text-blue-600 shrink-0" />
        <span className="text-slate-500 font-medium">Investment:</span>
        <span className="font-extrabold text-blue-800">{currentDisplayText}</span>
        <ChevronDown
          size={14}
          className={`text-slate-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-600' : ''
          }`}
        />
      </button>

      {/* DROPDOWN POPOVER & MOBILE BOTTOM SHEET */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Backdrop Overlay (visible on small screens) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
              onClick={() => setIsOpen(false)}
            />

            {/* Popover / Sheet Panel */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className={`
                fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-white p-6 shadow-2xl border-t border-slate-200
                md:absolute md:inset-auto md:left-0 md:top-full md:mt-2 md:w-96 md:rounded-3xl md:border md:shadow-2xl md:p-5
              `}
            >
              {/* Mobile Drag Indicator Bar */}
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto md:hidden mb-4" />

              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-blue-600" />
                  <h4 className="text-xs font-black tracking-widest text-blue-900 uppercase">
                    Investment Range
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={handleSelectAnyBudget}
                  className={`text-xs px-3 py-1 rounded-full font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    isAnyBudget
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {isAnyBudget && <Check size={12} />}
                  Any Budget
                </button>
              </div>

              {/* Selected Value Highlight Card */}
              <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/60 border border-blue-100 text-center relative overflow-hidden">
                <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest block mb-0.5">
                  Maximum Investment Limit
                </span>
                <div className="text-2xl font-black text-blue-950 tracking-tight">
                  {currentDisplayText}
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-1 leading-tight">
                  {isAnyBudget
                    ? 'Displaying all franchise opportunities across all investment ranges.'
                    : `Displaying franchises requiring up to ₹${currentStep.label.replace('₹', '')}.`}
                </p>
              </div>

              {/* Single Handle Slider Controls */}
              <div className="mt-5 mb-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2 px-1">
                  <span>₹0</span>
                  <span className="text-blue-700 font-extrabold">
                    {currentStep.label}
                  </span>
                  <span>₹5 Crore+</span>
                </div>

                <div className="relative py-2 flex items-center">
                  <input
                    type="range"
                    min={0}
                    max={INVESTMENT_STEPS.length - 1}
                    value={isAnyBudget ? INVESTMENT_STEPS.length - 1 : sliderIndex}
                    onChange={(e) => handleSliderChange(Number(e.target.value))}
                    className="w-full h-2.5 rounded-lg appearance-none cursor-pointer outline-none transition-all"
                    style={{
                      background: `linear-gradient(to right, #2563eb 0%, #2563eb ${
                        isAnyBudget ? 100 : percentage
                      }%, #e2e8f0 ${isAnyBudget ? 100 : percentage}%, #e2e8f0 100%)`,
                    }}
                  />
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="my-4">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
                  Popular Budget Caps
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Any', value: null },
                    { label: '₹5L', value: 5 },
                    { label: '₹10L', value: 10 },
                    { label: '₹25L', value: 25 },
                    { label: '₹50L', value: 50 },
                    { label: '₹1Cr', value: 100 },
                  ].map((preset) => {
                    const isSelected =
                      (preset.value === null && isAnyBudget) ||
                      (!isAnyBudget && currentStep.value === preset.value);
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handleQuickSelect(preset.value)}
                        className={`text-xs px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700 border border-slate-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSelectAnyBudget}
                  className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                >
                  <RotateCcw size={13} /> Reset
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  Apply Filter
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
