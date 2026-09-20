import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Search, Filter, Download, ArrowUpRight, ArrowDownRight, IndianRupee, FileText } from 'lucide-react';
import UniversalExportModal from '../components/admin/UniversalExportModal';
import { ExportField } from '../lib/exportService';

const paymentFields: ExportField[] = [
  { label: 'Transaction ID', key: 'id' },
  { label: 'Brand Name', key: 'brandName' },
  { label: 'Subscription Plan', key: 'plan' },
  { label: 'Amount (INR)', key: 'amount', transform: (val) => `Rs. ${val.toLocaleString('en-IN')}` },
  { label: 'Status', key: 'status' },
  { label: 'Payment Date', key: 'date', transform: (val) => val ? String(val).split('T')[0] : 'N/A' },
  { label: 'Invoice Number', key: 'invoice' },
];

export default function AdminPayments() {
  const { subscriptions, brands } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Generate mock transactions based on subscriptions
  const transactions = subscriptions.map((sub, i) => {
    const brand = brands.find(b => b.id === sub.brandId);
    const amount = sub.plan === 'ENTERPRISE' ? 249999 : sub.plan === 'PROFESSIONAL' ? 149999 : 49999;
    return {
      id: `TXN-${1000 + i}`,
      brandName: brand?.brandName || 'Unknown',
      plan: sub.plan,
      amount: amount,
      status: 'SUCCESS',
      date: sub.startDate,
      invoice: `INV-${2023000 + i}`
    };
  });

  const filteredTransactions = transactions.filter(txn => 
    txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    txn.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    txn.plan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    txn.invoice.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = transactions.reduce((acc, txn) => acc + txn.amount, 0);

  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-indigo-950 mb-2 font-heading">Payment Monitoring</h1>
          <p className="text-slate-600">Track transactions, invoices, and revenue.</p>
        </div>
        <button 
          onClick={() => setIsExportOpen(true)}
          className="px-6 py-2.5 bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-800 transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download size={14} /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 shrink-0">
         <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
               <IndianRupee size={24} />
            </div>
            <div>
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Revenue</div>
               <div className="text-2xl font-black text-blue-700">₹{(totalRevenue / 100000).toFixed(2)}L</div>
            </div>
         </div>
         <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
               <ArrowUpRight size={24} />
            </div>
            <div>
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Successful Txns</div>
               <div className="text-2xl font-black text-blue-700">{transactions.length}</div>
            </div>
         </div>
         <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
               <ArrowDownRight size={24} />
            </div>
            <div>
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Failed Txns</div>
               <div className="text-2xl font-black text-blue-700">0</div>
            </div>
         </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6 shrink-0 border-b border-slate-200">
         <h3 className="text-lg font-black text-blue-700 font-heading">Recent Transactions</h3>
         <div className="flex gap-2 w-full md:w-auto pb-2">
            <div className="relative flex-1 md:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm font-semibold outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-blue-700 transition-colors cursor-pointer shadow-sm">
               <Filter size={18} />
            </button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 bg-white rounded-3xl border border-slate-200 shadow-sm relative">
        <div className="overflow-x-auto min-w-[800px]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200">
              <tr>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Transaction ID</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Brand</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-slate-500">No transactions found.</td></tr>
              ) : (
                transactions.map(txn => (
                  <tr key={txn.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6">
                       <div className="text-sm font-bold text-blue-700">{txn.id}</div>
                    </td>
                    <td className="py-4 px-6">
                       <div className="text-sm font-bold text-slate-700">{txn.brandName}</div>
                       <div className="text-xs text-slate-500">{txn.plan} Plan</div>
                    </td>
                    <td className="py-4 px-6">
                       <div className="text-sm font-bold text-slate-800">
                         ₹{txn.amount.toLocaleString('en-IN')}
                       </div>
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-slate-500">
                       {new Date(txn.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                       <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-xs font-bold">
                         {txn.status}
                       </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors cursor-pointer inline-flex items-center gap-1.5">
                        <FileText size={14} /> {txn.invoice}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UniversalExportModal 
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title="Payments, Invoices & Transaction History"
        filenamePrefix="Payments-Transactions-Invoices"
        currentData={filteredTransactions}
        allData={transactions}
        fields={paymentFields}
      />
    </div>
  );
}
