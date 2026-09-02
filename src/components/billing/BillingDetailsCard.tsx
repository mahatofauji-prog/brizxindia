import React from 'react';
import { 
  Building2, Mail, Phone, MapPin, ShieldCheck, 
  CheckCircle2, AlertCircle, Edit3, FileText, Check 
} from 'lucide-react';
import { BrandBillingDetails } from '../../types';
import { validateGstin } from '../../utils/gstInvoiceEngine';

interface BillingDetailsCardProps {
  billingDetails?: BrandBillingDetails;
  brandName: string;
  onEdit: () => void;
}

export default function BillingDetailsCard({
  billingDetails,
  brandName,
  onEdit
}: BillingDetailsCardProps) {
  const gstin = billingDetails?.gstin || '29AABCB1234F1Z5';
  const gstinStatus = validateGstin(gstin);
  const isGstinValid = gstinStatus.isValid;

  const legalEntityName = billingDetails?.legalEntityName || `${brandName} India Private Limited`;
  const billingEmail = billingDetails?.billingEmail || 'accounts@brand.in';
  const billingPhone = billingDetails?.billingPhone || '+91 98765 43210';
  const addressLine1 = billingDetails?.addressLine1 || 'Plot 42, Sector 18, Commercial Hub';
  const addressLine2 = billingDetails?.addressLine2 || 'Outer Ring Road';
  const city = billingDetails?.city || 'Bengaluru';
  const state = billingDetails?.state || 'Karnataka';
  const stateCode = billingDetails?.stateCode || '29';
  const pincode = billingDetails?.pincode || '560103';
  const pan = billingDetails?.panNumber || (gstin.length >= 12 ? gstin.substring(2, 12) : 'AABCB1234F');

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 size={18} className="text-blue-600" />
            <h3 className="text-xl font-black text-slate-900 font-heading">
              Legal Entity & GST Billing Profile
            </h3>
          </div>
          <p className="text-slate-500 text-xs font-medium">
            This information appears automatically on all your generated BrizX tax receipts & B2B GST credit notes.
          </p>
        </div>

        <button
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200 cursor-pointer self-start sm:self-auto"
        >
          <Edit3 size={14} />
          <span>Edit Details</span>
        </button>
      </div>

      {/* Grid of Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Card 1: Legal Entity & Contact */}
        <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Legal Business Name
          </span>
          <div className="font-black text-slate-900 text-sm leading-snug">
            {legalEntityName}
          </div>
          <div className="pt-2 border-t border-slate-200/60 space-y-1 text-slate-600 font-medium">
            <div className="flex items-center gap-1.5">
              <Mail size={13} className="text-slate-400 shrink-0" />
              <span className="truncate">{billingEmail}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone size={13} className="text-slate-400 shrink-0" />
              <span>{billingPhone}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Registered Business Address */}
        <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Registered Place of Supply
          </span>
          <div className="flex items-start gap-1.5 text-slate-800 font-semibold leading-relaxed">
            <MapPin size={15} className="text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p>{addressLine1}, {addressLine2}</p>
              <p>{city}, {state} - {pincode}</p>
              <p className="text-[10px] text-slate-500 font-bold mt-1">State Code: {stateCode} ({state})</p>
            </div>
          </div>
        </div>

        {/* Card 3: GSTIN & Tax Status */}
        <div className="p-4 bg-blue-50/40 rounded-2xl border border-blue-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Goods & Services Tax (GST)
            </span>
            {isGstinValid ? (
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase rounded-full flex items-center gap-1">
                <Check size={11} strokeWidth={3} /> Verified
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase rounded-full flex items-center gap-1">
                <AlertCircle size={11} /> Format Alert
              </span>
            )}
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">GSTIN Number</span>
            <span className="text-sm font-black font-mono text-blue-700 tracking-wide">{gstin}</span>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-blue-100/70 text-slate-600 font-medium">
            <span>Corporate PAN: <strong className="font-mono text-slate-800">{pan}</strong></span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              100% ITC Eligible
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
