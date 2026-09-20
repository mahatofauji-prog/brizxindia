import React, { useState } from 'react';
import { 
  Building2, Mail, Phone, MapPin, ShieldCheck, 
  CheckCircle2, AlertCircle, X, Save 
} from 'lucide-react';
import { BrandBillingDetails } from '../../types';
import { validateGstin, INDIAN_STATES } from '../../utils/gstInvoiceEngine';

interface EditBillingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDetails?: BrandBillingDetails;
  onSave: (details: BrandBillingDetails) => void;
}

export default function EditBillingDetailsModal({
  isOpen,
  onClose,
  initialDetails,
  onSave
}: EditBillingDetailsModalProps) {
  const [legalName, setLegalName] = useState(initialDetails?.legalEntityName || '');
  const [email, setEmail] = useState(initialDetails?.billingEmail || '');
  const [phone, setPhone] = useState(initialDetails?.billingPhone || '');
  const [address1, setAddress1] = useState(initialDetails?.addressLine1 || '');
  const [address2, setAddress2] = useState(initialDetails?.addressLine2 || '');
  const [city, setCity] = useState(initialDetails?.city || '');
  const [stateName, setStateName] = useState(initialDetails?.state || 'Karnataka');
  const [pincode, setPincode] = useState(initialDetails?.pincode || '');
  const [gstin, setGstin] = useState(initialDetails?.gstin || '');
  const [panNumber, setPanNumber] = useState(initialDetails?.panNumber || '');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStateChange = (selectedState: string) => {
    setStateName(selectedState);
  };

  const handleGstinChange = (value: string) => {
    const uppercase = value.toUpperCase().trim();
    setGstin(uppercase);
    if (uppercase.length >= 10 && !panNumber) {
      // Auto-extract PAN from GSTIN (Characters 3-12)
      setPanNumber(uppercase.substring(2, 12));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (gstin) {
      const gstinCheck = validateGstin(gstin);
      if (!gstinCheck.isValid) {
        setValidationError(gstinCheck.message || 'Invalid GSTIN format. Expected 15-character alphanumeric format.');
        return;
      }
    }

    const stateObj = INDIAN_STATES.find(s => s.name.toLowerCase() === stateName.toLowerCase()) || { code: '29', name: stateName };

    const updatedBilling: BrandBillingDetails = {
      legalEntityName: legalName.trim(),
      billingEmail: email.trim(),
      billingPhone: phone.trim(),
      addressLine1: address1.trim(),
      addressLine2: address2.trim(),
      city: city.trim(),
      state: stateObj.name,
      stateCode: stateObj.code,
      pincode: pincode.trim(),
      gstin: gstin.trim() || undefined,
      gstinVerified: Boolean(gstin && validateGstin(gstin).isValid),
      panNumber: panNumber.trim() || (gstin.length >= 12 ? gstin.substring(2, 12) : undefined)
    };

    onSave(updatedBilling);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Edit Legal & GST Billing Details</h3>
              <p className="text-xs text-slate-500 font-medium">Used for generating official Indian GST invoices and ITC claims.</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {validationError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 font-semibold rounded-2xl flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Legal Business Name */}
          <div>
            <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Registered Legal Entity Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Burger Kingsway India Private Limited"
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Billing Email */}
            <div>
              <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Billing & Accounts Email *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="accounts@yourbrand.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-3.5 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600"
                />
                <Mail size={15} className="absolute right-3 top-3 text-slate-400" />
              </div>
            </div>

            {/* Billing Phone */}
            <div>
              <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Accounts Contact Phone
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-3.5 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600"
                />
                <Phone size={15} className="absolute right-3 top-3 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Address Lines */}
          <div className="space-y-2.5">
            <label className="font-bold text-slate-700 uppercase tracking-wider block">
              Registered Office Address *
            </label>
            <input
              type="text"
              required
              placeholder="Address Line 1 (Building, Street, Landmark)"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600"
            />
            <input
              type="text"
              placeholder="Address Line 2 (Area, Tech Park, Suite)"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* City */}
            <div>
              <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                City *
              </label>
              <input
                type="text"
                required
                placeholder="Bengaluru"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* State */}
            <div>
              <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                State *
              </label>
              <select
                value={stateName}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600"
              >
                {INDIAN_STATES.map(s => (
                  <option key={s.code} value={s.name}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>

            {/* Pincode */}
            <div>
              <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                PIN Code *
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="560103"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* GSTIN & PAN */}
          <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-blue-600" />
              <span className="font-bold text-slate-900 text-xs">GSTIN & Input Tax Credit (ITC) Setup</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  15-Digit GSTIN Number
                </label>
                <input
                  type="text"
                  maxLength={15}
                  placeholder="29AABCB1234F1Z5"
                  value={gstin}
                  onChange={(e) => handleGstinChange(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-mono font-bold text-xs text-slate-900 uppercase focus:outline-none focus:border-blue-600"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">Format: 29 [State] + 10 PAN + 1 Entity + Z + 1 Check</span>
              </div>

              <div>
                <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Company PAN Number
                </label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="AABCB1234F"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-mono font-bold text-xs text-slate-900 uppercase focus:outline-none focus:border-blue-600"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">10-digit Permanent Account Number</span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Save size={15} /> Save Billing Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
