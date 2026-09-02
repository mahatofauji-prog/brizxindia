import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PaymentInvoice } from '../../types';
import { 
  FileText, Download, CheckCircle2, ShieldCheck, IndianRupee, 
  Search, ArrowRight, Printer, Sparkles, Building2 
} from 'lucide-react';
import GstInvoiceModal from '../../components/billing/GstInvoiceModal';
import RefundRequestModal from '../../components/billing/RefundRequestModal';

export default function BrandPayments() {
  const { user } = useAuth();
  const { brands, invoices, requestInvoiceRefund } = useData();

  const currentBrand = brands.find(b => b.id === user?.id || (user?.email && b.email === user?.email));
  if (!currentBrand) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Complete your Brand Profile</h2>
        <p className="text-slate-500">Please set up your brand profile to access this page.</p>
      </div>
    );
  }
  const brandInvoices = invoices.filter(inv => inv.brandId === currentBrand.id);

  const [selectedInvoice, setSelectedInvoice] = useState<PaymentInvoice | null>(null);
  const [refundInvoice, setRefundInvoice] = useState<PaymentInvoice | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleRequestRefund = (invoice: PaymentInvoice) => {
    setSelectedInvoice(null);
    setRefundInvoice(invoice);
  };

  const handleRefundSuccess = () => {
    setSuccessMessage('Refund request submitted successfully.');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase mb-2 border border-emerald-100">
            <ShieldCheck size={14} className="text-emerald-600" /> GST Verified Tax Receipts
          </div>
          <h1 className="text-3xl font-black text-slate-900 font-heading">Payments & GST Invoices</h1>
          <p className="text-slate-600 text-sm mt-1 font-medium">View transaction history, download official tax invoices, and request refunds.</p>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-4 text-xs font-semibold">
          <div>
            <div className="text-blue-500 font-bold uppercase text-[10px]">Brand GSTIN</div>
            <div className="text-blue-900 font-black font-mono">{currentBrand.billingDetails?.gstin || '29AABCB1234F1Z5'}</div>
          </div>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-extrabold uppercase rounded-full">ITC Ready</span>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600" /> {successMessage}
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-slate-900 font-heading">Transaction History</h3>
          <span className="text-xs text-slate-500 font-bold bg-slate-100 px-3 py-1 rounded-full">{brandInvoices.length} Total Receipts</span>
        </div>

        {brandInvoices.length === 0 ? (
          <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <FileText size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-600">No payment receipts found yet.</p>
            <p className="text-xs text-slate-500 mt-1">Upgrade your plan or buy credits to generate invoices.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50/50">
                  <th className="py-3.5 px-4 rounded-tl-xl">Invoice ID</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Total Paid (₹)</th>
                  <th className="py-3.5 px-4 text-right rounded-tr-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-800">
                {brandInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-4 px-4 font-black text-slate-900 font-mono text-[11px]">{inv.id}</td>
                    <td className="py-4 px-4 font-bold text-blue-700">{inv.planName}</td>
                    <td className="py-4 px-4 text-slate-600 font-medium">{inv.date}</td>
                    <td className="py-4 px-4">
                      {inv.status === 'SUCCESS' ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Paid
                        </span>
                      ) : inv.status === 'REFUNDED' ? (
                        <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                          Refunded
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          {inv.status}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-black text-slate-900">₹{inv.totalAmount.toLocaleString()}</td>
                    <td className="py-4 px-4 text-right">
                      <button 
                        onClick={() => setSelectedInvoice(inv)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm group-hover:shadow-md"
                      >
                        <FileText size={14} /> 
                        <span className="hidden sm:inline">View GST Invoice</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedInvoice && (
        <GstInvoiceModal
          isOpen={true}
          onClose={() => setSelectedInvoice(null)}
          invoice={selectedInvoice}
          brand={currentBrand}
          onRequestRefund={handleRequestRefund}
        />
      )}

      {refundInvoice && (
        <RefundRequestModal
          isOpen={true}
          onClose={() => setRefundInvoice(null)}
          invoice={refundInvoice}
          onRequestRefund={requestInvoiceRefund}
          onSuccess={handleRefundSuccess}
        />
      )}
    </div>
  );
}
