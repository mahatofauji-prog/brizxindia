import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ChevronDown } from 'lucide-react';
import { FilterBottomSheet, FilterOption } from './FilterBottomSheet';

interface SortFilterProps {
  sortBy: string;
  onChange: (sortKey: string) => void;
  allowedSortKeys?: string[];
  alignRight?: boolean;
}

const ALL_SORT_OPTIONS: { id: string; label: string; shortLabel: string }[] = [
  { id: 'RECOMMENDED', label: 'Recommended', shortLabel: 'Recommended' },
  { id: 'INVESTMENT_LOW', label: 'Investment: Low to High', shortLabel: 'Investment: Low to High' },
  { id: 'INVESTMENT_HIGH', label: 'Investment: High to Low', shortLabel: 'Investment: High to Low' },
  { id: 'MATCH', label: 'Smart Match %', shortLabel: 'Smart Match %' },
  { id: 'OUTLETS', label: 'Total Operating Outlets', shortLabel: 'Total Outlets' },
];

export default function SortFilter({
  sortBy,
  onChange,
  allowedSortKeys = ['RECOMMENDED', 'INVESTMENT_LOW', 'INVESTMENT_HIGH'],
  alignRight = true,
}: SortFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Filter allowed options
  const options: FilterOption[] = useMemo(() => {
    return ALL_SORT_OPTIONS.filter((opt) => allowedSortKeys.includes(opt.id)).map((opt) => ({
      id: opt.id,
      label: opt.label,
    }));
  }, [allowedSortKeys]);

  const currentOption = useMemo(() => {
    return (
      ALL_SORT_OPTIONS.find((opt) => opt.id === sortBy) ||
      ALL_SORT_OPTIONS[0]
    );
  }, [sortBy]);

  const isChanged = sortBy !== 'RECOMMENDED';

  return (
    <>
      {/* TRIGGER BUTTON (Styled identically to Investment and Industry triggers) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 rounded-2xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer border ${
          isOpen || isChanged
            ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-slate-100'
        }`}
      >
        <ArrowUpDown size={14} className="text-blue-600 shrink-0" />
        <span className="text-slate-500 font-medium">Sort:</span>
        <span className="font-extrabold text-blue-800">{currentOption.shortLabel}</span>
        <ChevronDown
          size={14}
          className={`text-slate-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-600' : ''
          }`}
        />
      </button>

      {/* BOTTOM SHEET MODAL */}
      <FilterBottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="SORT BY"
        icon={<ArrowUpDown size={16} className="text-blue-600" />}
        options={options}
        selectedId={sortBy}
        onSelect={(newSortId) => {
          onChange(newSortId);
        }}
        onReset={() => onChange('RECOMMENDED')}
        resetLabel="Reset"
      />
    </>
  );
}
