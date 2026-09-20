import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare, ShieldCheck, Building2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    userType: 'BRAND_OWNER',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="flex-1 bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-indigo-950 text-white p-8 md:p-12 rounded-3xl mb-12 relative overflow-hidden shadow-xl text-center md:text-left">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">
              We're Here to Help
            </span>
            <h1 className="text-3xl md:text-5xl font-black mb-3">Contact BrizX India</h1>
            <p className="text-indigo-200 text-sm md:text-base leading-relaxed">
              Have questions about listing your brand, finding verified investors, or custom enterprise plans? Reach out to our team today.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Info & Offices */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-xl font-black text-indigo-950 border-b border-slate-100 pb-4">Head Office & Contact</h3>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center shrink-0 font-bold">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase">Head Office</div>
                  <div className="text-sm font-bold text-slate-800 leading-snug">
                    BrizX India, Ahmedabad, Gujarat, India
                  </div>
                </div>
              </div>

               <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 font-bold">
                  <Phone size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase">Mobile</div>
                  <a href="tel:+919979510361" className="text-sm font-bold text-slate-800 hover:text-blue-500 transition-colors">+91 99795 10361</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 font-bold">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase">WhatsApp Support</div>
                  <a href="https://wa.me/919979510361?text=Hello%20BrizX%20India%2C%20I%20would%20like%20to%20connect%20with%20an%20expert." target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-emerald-700 hover:underline">
                    +91 99795 10361
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center shrink-0 font-bold">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase">Email</div>
                  <a href="mailto:info@brizxindia.com" className="text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors">
                    info@brizxindia.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center shrink-0 font-bold">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase">Operating Hours</div>
                  <div className="text-sm font-bold text-slate-800">Monday - Saturday: 9:00 AM - 7:00 PM IST</div>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Call to Action */}
            <div className="bg-gradient-to-r from-emerald-900 to-indigo-950 text-white p-6 rounded-3xl border border-emerald-800 space-y-3 shadow-md">
              <span className="text-[10px] font-extrabold uppercase bg-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full">
                Instant Response Desk
              </span>
              <h4 className="font-black text-lg text-white">Contact on WhatsApp</h4>
              <p className="text-xs text-slate-200">Connect directly with our senior franchise match specialists for quick inquiry resolution.</p>
              <a
                href="https://wa.me/919979510361?text=Hello%20BrizX%20India%2C%20I%20want%20to%20talk%20to%20an%20expert%20regarding%20franchise%20matching."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare size={16} /> Talk to Our Expert on WhatsApp
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-2xl font-black text-indigo-950 mb-2">Send Us a Message</h3>
              <p className="text-xs text-slate-500 mb-8">Fill out the form below and a representative will connect with you in 2 business hours.</p>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 text-green-900 p-8 rounded-2xl text-center space-y-3">
                  <CheckCircle2 size={48} className="mx-auto text-green-600" />
                  <h4 className="text-xl font-black">Thank You for Reaching Out!</h4>
                  <p className="text-xs leading-relaxed max-w-md mx-auto">
                    Your inquiry has been logged successfully under Ticket #BRZX-8942. Our advisory team will contact you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 bg-green-700 text-white rounded-xl text-xs font-extrabold uppercase cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Rahul Verma"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. rahul@example.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">I am a...</label>
                      <select
                        value={formData.userType}
                        onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
                      >
                        <option value="BRAND_OWNER">Brand Owner / Franchisor</option>
                        <option value="FRANCHISE_SEEKER">Franchise Seeker / Investor</option>
                        <option value="OTHER">General Inquiry / Media</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Inquiry regarding Master Franchise listing"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please write your message or requirements here..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-blue-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-blue-700 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Send size={16} /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
