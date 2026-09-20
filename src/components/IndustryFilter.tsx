import React, { useState, useMemo } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { FilterBottomSheet, FilterOption } from './FilterBottomSheet';

interface IndustryFilterProps {
  selectedIndustry: string;
  onChange: (industry: string) => void;
  availableIndustries?: string[];
}

const BASE_INDUSTRIES: { id: string; label: string; aliases: string[] }[] = [
  { id: 'ALL', label: 'All Industries', aliases: ['ALL', 'ALL INDUSTRIES'] },
  { id: 'Food & Beverages', label: 'Food & Beverage', aliases: ['FOOD & BEVERAGES', 'FOOD & BEVERAGE', 'FOOD', 'F&B'] },
  { id: 'Healthcare', label: 'Healthcare', aliases: ['HEALTHCARE', 'HEALTHCARE & WELLNESS'] },
  { id: 'Education', label: 'Education', aliases: ['EDUCATION', 'EDUCATION & EDTECH'] },
  { id: 'Retail', label: 'Retail', aliases: ['RETAIL', 'RETAIL & SUPERMARKETS'] },
  { id: 'Fitness & Wellness', label: 'Fitness', aliases: ['FITNESS', 'FITNESS & WELLNESS', 'FITNESS & SPORTS'] },
  { id: 'Home & Building Automation', label: 'Automation', aliases: ['AUTOMATION', 'HOME & BUILDING AUTOMATION'] },
  { id: 'Automobile & EV', label: 'Automobile & EV', aliases: ['AUTOMOBILE & EV', 'AUTOMOTIVE', 'AUTOMOTIVE & EV'] },
  { id: 'Beauty & Salon', label: 'Beauty & Salon', aliases: ['BEAUTY & SALON', 'BEAUTY & WELLNESS'] },
  { id: 'Other', label: 'Other', aliases: ['OTHER', 'MISCELLANEOUS', 'SERVICES'] },
];

export default function IndustryFilter({
  selectedIndustry,
  onChange,
  availableIndustries,
}: IndustryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Build the list of options
  const options: FilterOption[] = useMemo(() => {
    const list: FilterOption[] = BASE_INDUSTRIES.map((ind) => ({
      id: ind.id,
      label: ind.label,
    }));

    // If dynamic industries from the database are provided, add any not already covered
    if (availableIndustries && availableIndustries.length > 0) {
      availableIndustries.forEach((indName) => {
        if (!indName || indName.toUpperCase() === 'ALL') return;
        const alreadyExists = BASE_INDUSTRIES.some(
          (b) =>
            b.id.toUpperCase() === indName.toUpperCase() ||
            b.aliases.some((alias) => alias.toUpperCase() === indName.toUpperCase())
        );
        if (!alreadyExists) {
          list.push({
            id: indName,
            label: indName,
          });
        }
      });
    }

    return list;
  }, [availableIndustries]);

  // Find currently selected option ID for matching
  const currentSelectedId = useMemo(() => {
    if (!selectedIndustry || selectedIndustry.toUpperCase() === 'ALL') return 'ALL';
    const cleanSel = selectedIndustry.trim().toUpperCase();

    // Check base industries
    for (const b of BASE_INDUSTRIES) {
      if (
        b.id.toUpperCase() === cleanSel ||
        b.label.toUpperCase() === cleanSel ||
        b.aliases.some((a) => a.toUpperCase() === cleanSel)
      ) {
        return b.id;
      }
    }

    // Check extra options
    const found = options.find((o) => o.id.toUpperCase() === cleanSel || o.label.toUpperCase() === cleanSel);
    return found ? found.id : selectedIndustry;
  }, [selectedIndustry, options]);

  // Display label for the trigger button
  const currentDisplayLabel = useMemo(() => {
    if (!selectedIndustry || selectedIndustry.toUpperCase() === 'ALL') return 'All Industries';
    const found = options.find((o) => o.id === currentSelectedId);
    return found ? found.label : selectedIndustry;
  }, [selectedIndustry, currentSelectedId, options]);

  const isFiltered = selectedIndustry && selectedIndustry.toUpperCase() !== 'ALL';

  return (
    <>
      {/* TRIGGER BUTTON (Styled identically to Investment filter trigger) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 rounded-2xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer border ${
          isOpen || isFiltered
            ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-slate-100'
        }`}
      >
        <Filter size={14} className="text-blue-600 shrink-0" />
        <span className="text-slate-500 font-medium">Industry:</span>
        <span className="font-extrabold text-blue-800">{currentDisplayLabel}</span>
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
        title="INDUSTRY"
        icon={<Filter size={16} className="text-blue-600" />}
        options={options}
        selectedId={currentSelectedId}
        onSelect={(newId) => {
          onChange(newId);
        }}
        onReset={() => onChange('ALL')}
        resetLabel="All Industries"
      />
    </>
  );
}
