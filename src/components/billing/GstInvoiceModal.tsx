import React from 'react';
import { 
  ShieldCheck, Printer, Download, X, Building2, 
  CheckCircle2, RotateCcw, AlertCircle, FileText, Check 
} from 'lucide-react';
import { PaymentInvoice, Brand, BrandBillingDetails } from '../../types';
import { convertNumberToIndianWords, BRIZX_COMPANY_PROFILE, calculateGstBreakdown } from '../../utils/gstInvoiceEngine';

interface GstInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: PaymentInvoice;
  brand: Brand;
  onRequestRefund?: (invoice: PaymentInvoice) => void;
}

export default function GstInvoiceModal({
  isOpen,
  onClose,
  invoice,
  brand,
  onRequestRefund
}: GstInvoiceModalProps) {
  if (!isOpen) return null;

  const billing: BrandBillingDetails = invoice.billingDetailsSnapshot || brand.billingDetails || {
    legalEntityName: `${brand.brandName} India Pvt Ltd`,
    billingEmail: brand.email,
    addressLine1: 'Commercial Hub, Outer Ring Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    stateCode: '29',
    pincode: '560103',
    gstin: '29AABCB1234F1Z5',
    gstinVerified: true,
    panNumber: 'AABCB1234F'
  };

  const gstBreakdown = calculateGstBreakdown(invoice.amount, billing.state);
  const amountInWords = convertNumberToIndianWords(invoice.totalAmount);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const textContent = `
============================================================
              BRIZX INDIA TECH PRIVATE LIMITED
                    OFFICIAL TAX INVOICE
============================================================
Invoice Number  : ${invoice.id}
Invoice Date    : ${invoice.date}
Place of Supply : ${billing.state || 'Karnataka'}
SAC Code        : ${invoice.sacCode || '998314'}

ISSUER DETAILS:
${BRIZX_COMPANY_PROFILE.legalName}
CIN: ${BRIZX_COMPANY_PROFILE.cin}
GSTIN: ${BRIZX_COMPANY_PROFILE.gstin} | PAN: ${BRIZX_COMPANY_PROFILE.pan}
${BRIZX_COMPANY_PROFILE.addressLine1}, ${BRIZX_COMPANY_PROFILE.city}, ${BRIZX_COMPANY_PROFILE.state} - ${BRIZX_COMPANY_PROFILE.pincode}

BILLED TO (RECIPIENT):
${billing.legalEntityName}
GSTIN: ${billing.gstin || 'N/A'} | PAN: ${billing.panNumber || 'N/A'}
${billing.addressLine1}${billing.addressLine2 ? ', ' + billing.addressLine2 : ''}
${billing.city}, ${billing.state} - ${billing.pincode}

------------------------------------------------------------
LINE ITEMS:
1. ${invoice.planName}
   Taxable Value : INR ${invoice.amount.toLocaleString()}
   ${gstBreakdown.gstType === 'INTRA_STATE' 
     ? `CGST (9%)     : INR ${gstBreakdown.cgstAmount.toLocaleString()}
   SGST (9%)     : INR ${gstBreakdown.sgstAmount.toLocaleString()}`
     : `IGST (18%)    : INR ${gstBreakdown.igstAmount.toLocaleString()}`
   }
------------------------------------------------------------
TOTAL TAXABLE AMOUNT : INR ${invoice.amount.toLocaleString()}
TOTAL GST (18%)      : INR ${invoice.gstAmount.toLocaleString()}
GRAND TOTAL PAID     : INR ${invoice.totalAmount.toLocaleString()}
AMOUNT IN WORDS      : ${amountInWords}

PAYMENT DETAILS:
Payment Method : ${invoice.paymentMode}
Payment Ref ID : ${invoice.paymentId || 'N/A'}
Status         : ${invoice.status}
Reverse Charge : No

* This is a computer-generated official tax invoice *
============================================================
    `.trim();

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invoice.id}_GST_Invoice.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200 print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Modal Top Bar (Hidden in Print) */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">GST Tax Receipt Preview</span>
            <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded-full border border-blue-500/30">
              Rule 46 Compliant
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Print Tax Invoice"
            >
              <Printer size={15} />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleDownloadText}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Download Invoice Text"
            >
              <Download size={15} />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer ml-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Tax Invoice Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 text-slate-800 text-xs font-sans space-y-6 print:p-0">
          {/* Header Title */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <img 
                  src="/logo.jpg" 
                  alt="BrizX India Logo" 
                  className="w-8 h-8 rounded-lg object-cover shadow-xs shrink-0"
                  referrerPolicy="no-referrer"
                />
                <span className="text-xl font-black text-blue-700 tracking-tight">BRIZX <span className="text-blue-500">INDIA</span></span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{BRIZX_COMPANY_PROFILE.legalName}</p>
              <p className="text-[10px] text-slate-500">CIN: {BRIZX_COMPANY_PROFILE.cin}</p>
            </div>

            <div className="text-right">
              <div className="inline-block bg-slate-900 text-white font-black text-xs uppercase px-3 py-1 rounded tracking-wider mb-1">
                TAX INVOICE
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Original For Recipient</p>
              <div className="font-mono font-black text-sm text-slate-900 mt-1">{invoice.id}</div>
              <p className="text-[11px] text-slate-600 font-semibold">Date: {invoice.date}</p>
            </div>
          </div>

          {/* Supplier & Recipient Two-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] p-4 bg-slate-50 rounded-2xl border border-slate-200">
            {/* Supplier */}
            <div className="space-y-1 pr-2 sm:border-r border-slate-200">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                Service Provider (Supplier)
              </span>
              <div className="font-bold text-slate-900 text-xs">{BRIZX_COMPANY_PROFILE.legalName}</div>
              <p className="text-slate-600">{BRIZX_COMPANY_PROFILE.addressLine1}</p>
              <p className="text-slate-600">{BRIZX_COMPANY_PROFILE.city}, {BRIZX_COMPANY_PROFILE.state} - {BRIZX_COMPANY_PROFILE.pincode}</p>
              <div className="pt-1 text-[10px] font-bold text-slate-700 space-y-0.5">
                <div>GSTIN: <span className="font-mono font-black text-blue-700">{BRIZX_COMPANY_PROFILE.gstin}</span></div>
                <div>PAN: <span className="font-mono">{BRIZX_COMPANY_PROFILE.pan}</span> | State Code: {BRIZX_COMPANY_PROFILE.stateCode}</div>
              </div>
            </div>

            {/* Recipient */}
            <div className="space-y-1 sm:pl-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                Billed To (Recipient / Buyer)
              </span>
              <div className="font-bold text-slate-900 text-xs">{billing.legalEntityName}</div>
              <p className="text-slate-600">{billing.addressLine1} {billing.addressLine2 || ''}</p>
              <p className="text-slate-600">{billing.city}, {billing.state} - {billing.pincode}</p>
              <div className="pt-1 text-[10px] font-bold text-slate-700 space-y-0.5">
                <div>GSTIN: <span className="font-mono font-black text-blue-700">{billing.gstin || 'Unregistered'}</span></div>
                <div>PAN: <span className="font-mono">{billing.panNumber || 'N/A'}</span> | State: {billing.state} ({billing.stateCode || '29'})</div>
              </div>
            </div>
          </div>

          {/* Invoice Particulars Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] p-3 bg-blue-50/50 rounded-xl border border-blue-100">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Place of Supply</span>
              <span className="font-bold text-slate-800">{gstBreakdown.placeOfSupply}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase block">SAC Service Code</span>
              <span className="font-bold text-slate-800 font-mono">{invoice.sacCode || '998314'}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Reverse Charge</span>
              <span className="font-bold text-slate-800">No</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Payment Status</span>
              <span className={`font-bold uppercase ${invoice.status === 'SUCCESS' ? 'text-emerald-700' : 'text-rose-600'}`}>
                {invoice.status === 'SUCCESS' ? 'Paid / Settled' : invoice.status}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-slate-300 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[9px] border-b border-slate-300">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Description of Services</th>
                  <th className="py-2.5 px-3">SAC</th>
                  <th className="py-2.5 px-3 text-right">Taxable Val (₹)</th>
                  {gstBreakdown.gstType === 'INTRA_STATE' ? (
                    <>
                      <th className="py-2.5 px-3 text-right">CGST (9%)</th>
                      <th className="py-2.5 px-3 text-right">SGST (9%)</th>
                    </>
                  ) : (
                    <th className="py-2.5 px-3 text-right">IGST (18%)</th>
                  )}
                  <th className="py-2.5 px-3 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-500">1</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{invoice.planName}</div>
                    <div className="text-[10px] text-slate-500">Online matchmaking, high-intent franchise lead unlocking, and CRM access.</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600">{invoice.sacCode || '998314'}</td>
                  <td className="py-3 px-3 text-right font-semibold">₹{invoice.amount.toLocaleString()}</td>
                  {gstBreakdown.gstType === 'INTRA_STATE' ? (
                    <>
                      <td className="py-3 px-3 text-right text-slate-600">₹{gstBreakdown.cgstAmount.toLocaleString()}</td>
                      <td className="py-3 px-3 text-right text-slate-600">₹{gstBreakdown.sgstAmount.toLocaleString()}</td>
                    </>
                  ) : (
                    <td className="py-3 px-3 text-right text-slate-600">₹{gstBreakdown.igstAmount.toLocaleString()}</td>
                  )}
                  <td className="py-3 px-3 text-right font-black text-slate-900">₹{invoice.totalAmount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals & Words Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px]">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Amount in Words</span>
                <span className="font-bold text-slate-800 capitalize leading-relaxed">{amountInWords}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500">
                <div>Payment Mode: <strong className="text-slate-800">{invoice.paymentMode}</strong></div>
                <div>Gateway Ref / TXN ID: <span className="font-mono text-slate-800">{invoice.paymentId || 'pay_verified_online'}</span></div>
              </div>
            </div>

            <div className="space-y-1.5 p-4 bg-slate-50 rounded-xl border border-slate-200 text-[11px]">
              <div className="flex justify-between text-slate-600">
                <span>Total Taxable Amount:</span>
                <span className="font-semibold text-slate-800">₹{invoice.amount.toLocaleString()}</span>
              </div>

              {gstBreakdown.gstType === 'INTRA_STATE' ? (
                <>
                  <div className="flex justify-between text-slate-600">
                    <span>Central GST (CGST @ 9%):</span>
                    <span>₹{gstBreakdown.cgstAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>State GST (SGST @ 9%):</span>
                    <span>₹{gstBreakdown.sgstAmount.toLocaleString()}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-slate-600">
                  <span>Integrated GST (IGST @ 18%):</span>
                  <span>₹{gstBreakdown.igstAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-300 flex justify-between items-center text-xs font-black text-slate-900">
                <span>Grand Total:</span>
                <span className="text-base text-blue-700">₹{invoice.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Declarations & Signature */}
          <div className="border-t border-slate-200 pt-4 text-[10px] text-slate-500 space-y-1">
            <p><strong>Declaration:</strong> We declare that this invoice shows the actual price of the services described and that all particulars are true and correct.</p>
            <p>This is a digitally generated document authorized by BrizX India Tech Pvt Ltd. No physical signature is required.</p>
          </div>
        </div>

        {/* Modal Bottom Actions (Hidden in Print) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div>
            {invoice.status === 'SUCCESS' && onRequestRefund && (
              <button
                onClick={() => onRequestRefund(invoice)}
                className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 font-bold hover:underline cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Request Refund / Credit Note</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="py-2 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Printer size={15} />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
