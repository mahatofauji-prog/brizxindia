import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Crown, Check, Sparkles, ShieldCheck, Zap, PhoneCall, FileText, 
  CheckCircle2, CreditCard, ArrowRight, Download, FileSpreadsheet, Send, ShieldAlert, X 
} from 'lucide-react';
import { SeekerHero } from '../../components/seeker/SeekerHero';
import { seekerTheme } from '../../theme/seekerTheme';

export default function SeekerPremium() {
  const { user } = useAuth();
  const { seekers, upgradeSeekerToPremium } = useData();

  const currentSeeker = seekers.find(s => s.id === user?.id) || seekers[0];
  const isAlreadyPremium = currentSeeker.isPremium;

  const [selectedPlan, setSelectedPlan] = useState<'PRO' | 'ELITE'>('ELITE');
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('ANNUAL');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD'>('CARD');

  // Sandbox inputs
  const [sandboxCard, setSandboxCard] = useState('4111 2222 3333 4444');
  const [sandboxCardName, setSandboxCardName] = useState(user?.name || 'Vikas Khanna');
  const [sandboxUpiId, setSandboxUpiId] = useState('vikas@okaxis');

  // Invoices list state
  const [invoices, setInvoices] = useState<any[]>([
    { id: 'INV-2026-001', date: '2026-08-01', amount: '₹4,999', plan: 'Seeker Elite (Annual)', status: 'PAID' }
  ]);

  const getPrice = (plan: 'PRO' | 'ELITE') => {
    if (billingCycle === 'ANNUAL') {
      return plan === 'PRO' ? 1999 : 4999;
    } else {
      return plan === 'PRO' ? 249 : 599;
    }
  };

  const handleUpgradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSeeker) return;

    upgradeSeekerToPremium(currentSeeker.id);
    
    const newInvoice = {
      id: `INV-2026-00${invoices.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      amount: `₹${getPrice(selectedPlan).toLocaleString('en-IN')}`,
      plan: `Seeker ${selectedPlan} (${billingCycle})`,
      status: 'PAID'
    };
    setInvoices(prev => [newInvoice, ...prev]);

    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentSuccess(false);
      setShowPaymentModal(false);
    }, 2500);
  };

  const handleDownloadInvoice = (invId: string) => {
    alert(`Receipt Compiled: Invoice ${invId} downloaded successfully.`);
  };

  return (
    <div className={seekerTheme.pageContainer}>
      
      {/* Standard Top Banner */}
      <SeekerHero
        pageKey="membership"
        badgeText="VIP Access Tier"
        badgeIcon={<Crown size={14} className="text-blue-700" />}
        title="Seeker Premium Membership"
        description="Accelerate your franchise investment pipeline with direct founder phone dials, dedicated legal draft reviews, and priority matching."
      />

      {isAlreadyPremium && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-600 shrink-0" size={28} />
            <div>
              <h3 className="font-extrabold text-slate-900 text-base font-heading">Active Premium VIP Account</h3>
              <p className="text-xs text-slate-600 mt-0.5">Your account is fully upgraded. Direct franchisor telephone dials and legal drafting are unlocked.</p>
            </div>
          </div>
          <span className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl self-start sm:self-center">
            VIP ACTIVE
          </span>
        </div>
      )}

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: <Zap className="text-blue-600" size={20} />, title: 'Priority Matching', desc: 'Appear at the top of brand dashboards matching your investable limit.' },
          { icon: <PhoneCall className="text-blue-600" size={20} />, title: 'Founder Dial Line', desc: 'Direct contact phone numbers and founder email addresses unlocked.' },
          { icon: <ShieldCheck className="text-blue-600" size={20} />, title: 'Vetted Advisor Desk', desc: 'Assigned corporate strategist to audit site conditions and FDD contracts.' },
          { icon: <FileText className="text-blue-600" size={20} />, title: 'LOI & Legal Support', desc: 'Corporate draft letters of intent compiled with standard exit provisions.' }
        ].map((item, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 border border-blue-100/80 shadow-xs space-y-2">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit mb-3 border border-blue-100">{item.icon}</div>
            <h4 className="font-extrabold text-slate-900 text-sm font-heading">{item.title}</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed font-normal">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Pricing Toggle */}
      <div className="flex justify-center items-center gap-3 pt-2">
        <span className={`text-xs font-bold ${billingCycle === 'MONTHLY' ? 'text-blue-700' : 'text-slate-400'}`}>Monthly Billing</span>
        <button 
          onClick={() => setBillingCycle(prev => prev === 'MONTHLY' ? 'ANNUAL' : 'MONTHLY')}
          className="w-12 h-6 bg-slate-200 rounded-full p-1 transition-colors flex items-center relative cursor-pointer"
        >
          <div className={`w-4 h-4 bg-blue-600 rounded-full transition-transform ${billingCycle === 'ANNUAL' ? 'translate-x-6' : 'translate-x-0'}`}></div>
        </button>
        <span className={`text-xs font-bold flex items-center gap-1.5 ${billingCycle === 'ANNUAL' ? 'text-blue-700' : 'text-slate-400'}`}>
          Annual Billing <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black uppercase rounded-lg">Save 30%</span>
        </span>
      </div>

      {/* Plans Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-2">
        
        {/* Pro Plan */}
        <div className="bg-white rounded-3xl p-8 border border-blue-100/80 shadow-xs flex flex-col justify-between relative">
          <div>
            <span className="bg-slate-100 text-slate-700 text-[10px] font-black uppercase px-3 py-1 rounded-full inline-block mb-3">
              INDIVIDUAL SEEKER
            </span>
            <h3 className="text-2xl font-black text-slate-900 font-heading">Seeker Pro</h3>
            <p className="text-xs text-slate-500 mb-6">Excellent for first-time franchise operators.</p>

            <div className="text-3xl font-black text-slate-900 mb-6 font-heading">
              ₹{getPrice('PRO').toLocaleString('en-IN')}{' '}
              <span className="text-xs font-normal text-slate-500">/ {billingCycle === 'ANNUAL' ? 'year' : 'month'}</span>
            </div>

            <ul className="space-y-3.5 text-xs font-semibold text-slate-700 mb-8">
              <li className="flex items-center gap-2.5"><Check size={15} className="text-blue-600 shrink-0" /> Unlock contacts for 15 verified Brands</li>
              <li className="flex items-center gap-2.5"><Check size={15} className="text-blue-600 shrink-0" /> ROI & Payback Calculator Suite</li>
              <li className="flex items-center gap-2.5"><Check size={15} className="text-blue-600 shrink-0" /> Standard Meeting Schedulers</li>
              <li className="flex items-center gap-2.5"><Check size={15} className="text-blue-600 shrink-0" /> 1 Free Due Diligence Verification Request</li>
            </ul>
          </div>

          <button
            onClick={() => {
              setSelectedPlan('PRO');
              setShowPaymentModal(true);
            }}
            disabled={isAlreadyPremium}
            className={`w-full py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
              isAlreadyPremium ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
            }`}
          >
            {isAlreadyPremium ? 'Active (Pro Included)' : 'Upgrade to Pro'}
          </button>
        </div>

        {/* Elite Plan */}
        <div className="bg-blue-50/50 rounded-3xl p-8 border-2 border-blue-600 shadow-sm flex flex-col justify-between relative">
          <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-blue-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
            <Sparkles size={12} /> RECOMMENDED
          </div>

          <div>
            <span className="bg-blue-100 text-blue-800 text-[10px] font-black uppercase px-3 py-1 rounded-full inline-block mb-3">
              MULTI-UNIT OPERATORS
            </span>
            <h3 className="text-2xl font-black text-slate-900 font-heading">Seeker Elite VIP</h3>
            <p className="text-xs text-slate-500 mb-6">Dedicated advisory support for deep deployment budgets.</p>

            <div className="text-3xl font-black text-blue-700 mb-6 font-heading">
              ₹{getPrice('ELITE').toLocaleString('en-IN')}{' '}
              <span className="text-xs font-normal text-slate-500">/ {billingCycle === 'ANNUAL' ? 'year' : 'month'}</span>
            </div>

            <ul className="space-y-3.5 text-xs font-semibold text-slate-700 mb-8">
              <li className="flex items-center gap-2.5"><Check size={15} className="text-blue-600 shrink-0" /> Unlimited Brand Contact Dial Unlocks</li>
              <li className="flex items-center gap-2.5"><Check size={15} className="text-blue-600 shrink-0" /> Featured Seeker status in franchisor search lists</li>
              <li className="flex items-center gap-2.5"><Check size={15} className="text-blue-600 shrink-0" /> Dedicated 1-on-1 Senior Advisor</li>
              <li className="flex items-center gap-2.5"><Check size={15} className="text-blue-600 shrink-0" /> Unlimited MCA Legal Due Diligence Audits</li>
              <li className="flex items-center gap-2.5"><Check size={15} className="text-blue-600 shrink-0" /> Standard LOI & Landlord Contract Drafting Support</li>
            </ul>
          </div>

          <button
            onClick={() => {
              setSelectedPlan('ELITE');
              setShowPaymentModal(true);
            }}
            disabled={isAlreadyPremium}
            className={`w-full py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
              isAlreadyPremium ? 'bg-blue-200 text-blue-800' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
            }`}
          >
            {isAlreadyPremium ? 'VIP Membership Active' : 'Upgrade to Elite VIP'}
          </button>
        </div>
      </div>

      {/* Invoice & Billing History */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-100/80 shadow-xs max-w-4xl mx-auto space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base font-heading pb-2 border-b border-blue-50">
          Billing History & Receipts
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead>
              <tr className="border-b border-blue-50 font-bold text-slate-400">
                <th className="py-3">Invoice ID</th>
                <th className="py-3">Date</th>
                <th className="py-3">Package Details</th>
                <th className="py-3">Amount</th>
                <th className="py-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {invoices.map(inv => (
                <tr key={inv.id}>
                  <td className="py-3.5 font-bold text-slate-900">{inv.id}</td>
                  <td className="py-3.5 text-slate-500">{new Date(inv.date).toLocaleDateString()}</td>
                  <td className="py-3.5 font-semibold text-slate-700">{inv.plan}</td>
                  <td className="py-3.5 font-black text-slate-900">{inv.amount}</td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => handleDownloadInvoice(inv.id)}
                      className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 ml-auto text-xs cursor-pointer"
                    >
                      <Download size={12} /> Download Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment simulation modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-blue-100 shadow-2xl relative animate-fadeIn">
            
            <button 
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={18} />
            </button>

            {paymentSuccess ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 size={44} className="mx-auto text-emerald-600" />
                <h3 className="text-xl font-black text-slate-900 font-heading">Payment Verified</h3>
                <p className="text-xs text-slate-500">Welcome to VIP Seeker Club. Direct franchisor dials and legal templates are now active.</p>
              </div>
            ) : (
              <form onSubmit={handleUpgradeSubmit} className="space-y-4">
                <div className="border-b border-blue-50 pb-3">
                  <h3 className="font-extrabold text-slate-900 text-base font-heading">Upgrade Seeker Tier</h3>
                  <p className="text-xs text-slate-500 mt-1">Plan: Seeker {selectedPlan} ({billingCycle}) • ₹{getPrice(selectedPlan).toLocaleString('en-IN')}</p>
                </div>

                <div className="space-y-3">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Payment Method</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      type="button" 
                      onClick={() => setPaymentMethod('CARD')}
                      className={`p-3 rounded-2xl text-xs font-bold border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        paymentMethod === 'CARD' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-blue-100 bg-white text-slate-600'
                      }`}
                    >
                      <CreditCard size={14} /> Credit Card
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setPaymentMethod('UPI')}
                      className={`p-3 rounded-2xl text-xs font-bold border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        paymentMethod === 'UPI' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-blue-100 bg-white text-slate-600'
                      }`}
                    >
                      UPI / QR Code
                    </button>
                  </div>
                </div>

                {paymentMethod === 'CARD' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Card Number</label>
                      <input 
                        type="text"
                        required
                        value={sandboxCard}
                        onChange={(e) => setSandboxCard(e.target.value)}
                        className={seekerTheme.input}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Cardholder Name</label>
                      <input 
                        type="text"
                        required
                        value={sandboxCardName}
                        onChange={(e) => setSandboxCardName(e.target.value)}
                        className={seekerTheme.input}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">UPI Address (VPA)</label>
                    <input 
                      type="text"
                      required
                      value={sandboxUpiId}
                      onChange={(e) => setSandboxUpiId(e.target.value)}
                      placeholder="e.g. vikas@upi"
                      className={seekerTheme.input}
                    />
                  </div>
                )}

                <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 text-[10px] text-slate-600 flex items-start gap-1.5 font-normal">
                  <ShieldAlert size={14} className="text-blue-600 shrink-0 mt-0.5" />
                  <span>Sandbox simulation environment. Your credentials are securely tested.</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold uppercase tracking-widest cursor-pointer shadow-xs transition-all"
                >
                  Confirm payment (₹{getPrice(selectedPlan).toLocaleString('en-IN')})
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
