import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  BarChart3, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  FileText,
  Search,
  TrendingUp,
  Megaphone,
  Compass,
  MessageSquare,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router';

export default function Services() {
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [consultSubmitted, setConsultSubmitted] = useState(false);

  const allServices = [
    {
      id: 1,
      number: "01",
      title: "Brand Explore Franchise Prospect",
      desc: "Empowers franchisors and brand owners to browse, filter, and proactively connect with high-intent franchise seekers based on verified capital capacity, location, and operational readiness.",
      icon: Users,
      cta: "Find Verified Franchise Prospects",
      link: "/seekers",
      tag: "For Franchisors"
    },
    {
      id: 2,
      number: "02",
      title: "Verified Franchise Seeker Database",
      desc: "Access an audited directory of pre-screened investors across 50+ Indian cities with verified financial capabilities, ID checks, and target expansion timelines.",
      icon: ShieldCheck,
      cta: "Explore Seeker Database",
      link: "/seekers",
      tag: "Database Access"
    },
    {
      id: 3,
      number: "03",
      title: "Franchise Prospect Explore Brand",
      desc: "Enables prospective franchisees to inspect verified brand profiles, unit economics, payback timelines, royalty structures, and territory availability.",
      icon: Building2,
      cta: "Explore Franchise Opportunities",
      link: "/brands",
      tag: "For Franchise Seekers"
    },
    {
      id: 4,
      number: "04",
      title: "Franchise Prospect Search Portal",
      desc: "Multi-parameter search portal allowing investors to search franchise opportunities by budget (₹10L to ₹1Cr+), industry sector, space required, and city suitability.",
      icon: Search,
      cta: "Search Portal",
      link: "/brands",
      tag: "Search Engine"
    },
    {
      id: 5,
      number: "05",
      title: "Franchise Investment & ROI Guidance",
      desc: "In-depth financial modeling, unit-level profitability analysis, and interactive ROI calculation tools to guide capital allocation and risk management.",
      icon: TrendingUp,
      cta: "Calculate ROI",
      link: "/roi-calculator/advanced",
      tag: "Financial Intelligence"
    },
    {
      id: 6,
      number: "06",
      title: "Smart Franchise Matching",
      desc: "Proprietary AI compatibility engine that ranks matches between brands and seekers using 15+ weighted operational metrics, budget alignment, and territory demand.",
      icon: Sparkles,
      cta: "Start Smart Franchise Matching",
      link: "/register",
      tag: "AI Matching Engine"
    },
    {
      id: 7,
      number: "07",
      title: "Franchise Digital Marketing",
      desc: "Dedicated digital campaigns, localized search marketing, and targeted lead generation strategies designed to boost brand visibility and qualified inquiries.",
      icon: Megaphone,
      cta: "Talk to Our Expert",
      link: "/contact",
      tag: "Growth Marketing"
    },
    {
      id: 8,
      number: "08",
      title: "Franchise Opportunity Assessment",
      desc: "Comprehensive feasibility audit for brands and seekers, reviewing market demand, competition density, legal agreements, and store launch readiness.",
      icon: Compass,
      cta: "Book Free Consultation",
      link: "#consultation",
      tag: "Advisory & Assessment"
    }
  ];

  return (
    <main className="flex-1 bg-slate-50">
      {/* Hero */}
      <section className="bg-indigo-950 text-white py-20 px-6 md:px-10 text-center relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-block px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
            BrizX India Solutions
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6">Our Services</h1>
          <p className="text-lg md:text-xl text-indigo-200 max-w-3xl mx-auto font-medium leading-relaxed">
            BrizX India helps franchise brands connect with verified franchise seekers through intelligent matching, verified databases, ROI guidance and franchise business consulting.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              to="/brands"
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2"
            >
              Explore Franchise Opportunities <ArrowRight size={14} />
            </Link>
            <Link
              to="/seekers"
              className="px-6 py-3 bg-blue-700 border border-indigo-700 hover:bg-blue-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2"
            >
              Find Verified Franchise Prospects
            </Link>
            <a
              href="https://wa.me/919979510361?text=Hello%20BrizX%20India%2C%20I%20want%20to%20talk%20to%20an%20expert."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-md"
            >
              <MessageSquare size={14} /> Contact on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Services Grid (All 8 Services) */}
      <section className="py-16 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-blue-500 text-xs font-extrabold uppercase tracking-widest">End-To-End Franchise Intelligence</span>
          <h2 className="text-3xl md:text-4xl font-black text-indigo-950 mt-1">Full Service Suite</h2>
          <p className="text-slate-600 text-sm mt-2">Empowering brands to scale and investors to build profitable franchise businesses.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {allServices.map((srv) => {
            const Icon = srv.icon;
            return (
              <div key={srv.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group relative overflow-hidden">
                <div className="absolute top-4 right-4 text-xs font-black text-slate-300 group-hover:text-blue-400 transition-colors">
                  {srv.number}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-50 text-indigo-950 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <Icon size={24} />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider block">{srv.tag}</span>
                      <h3 className="font-black text-indigo-950 text-xl">{srv.title}</h3>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6 font-medium">{srv.desc}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  {srv.link === '#consultation' ? (
                    <button
                      onClick={() => setShowConsultModal(true)}
                      className="text-xs font-extrabold text-blue-700 group-hover:text-blue-600 flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
                    >
                      {srv.cta} <ArrowRight size={14} />
                    </button>
                  ) : (
                    <Link
                      to={srv.link}
                      className="text-xs font-extrabold text-blue-700 group-hover:text-blue-600 flex items-center gap-1.5 uppercase tracking-wider"
                    >
                      {srv.cta} <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Information & Advisory Banner */}
        <div id="consultation" className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-950 text-white p-10 md:p-14 rounded-3xl shadow-xl border border-indigo-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-blue-400 text-xs font-extrabold uppercase tracking-widest">BrizX India Headquarters</span>
              <h3 className="text-2xl md:text-4xl font-black mt-1">Book Free Consultation & Expert Guidance</h3>
              <p className="text-indigo-200 text-xs md:text-sm mt-2 leading-relaxed">
                Connect with our senior franchise architects in Ahmedabad or schedule a direct virtual strategy session.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-xs text-indigo-200 font-semibold">
                <div className="flex items-center gap-3 bg-blue-700/60 p-3 rounded-xl border border-indigo-800">
                  <MapPin size={18} className="text-blue-400 shrink-0" />
                  <span>Ahmedabad, Gujarat, India</span>
                </div>
                <div className="flex items-center gap-3 bg-blue-700/60 p-3 rounded-xl border border-indigo-800">
                  <Phone size={18} className="text-blue-400 shrink-0" />
                  <span>+91 99795 10361</span>
                </div>
                <div className="flex items-center gap-3 bg-blue-700/60 p-3 rounded-xl border border-indigo-800">
                  <MessageSquare size={18} className="text-emerald-400 shrink-0" />
                  <span>WhatsApp: +91 99795 10361</span>
                </div>
                <div className="flex items-center gap-3 bg-blue-700/60 p-3 rounded-xl border border-indigo-800">
                  <Mail size={18} className="text-blue-400 shrink-0" />
                  <span>info@brizxindia.com</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-3">
              <button
                onClick={() => setShowConsultModal(true)}
                className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-blue-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                Book Free Consultation <ArrowRight size={16} />
              </button>
              <a
                href="https://wa.me/919979510361?text=Hello%20BrizX%20India%2C%20I%20would%20like%20to%20Talk%20to%20Our%20Expert."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare size={16} /> Contact on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Modal */}
      {showConsultModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative">
            <h3 className="text-2xl font-black text-indigo-950 mb-2">Book Free Consultation</h3>
            <p className="text-xs text-slate-500 mb-6">Our BrizX India Franchise Expert will reach out within 2 hours.</p>

            {consultSubmitted ? (
              <div className="bg-green-50 text-green-800 p-6 rounded-2xl border border-green-200 text-center space-y-3">
                <CheckCircle2 size={40} className="mx-auto text-green-600" />
                <h4 className="font-bold text-base">Consultation Requested!</h4>
                <p className="text-xs">Thank you! A BrizX India Senior Advisory Consultant (+91 99795 10361) will call you shortly.</p>
                <button
                  onClick={() => {
                    setConsultSubmitted(false);
                    setShowConsultModal(false);
                  }}
                  className="mt-4 px-6 py-2 bg-green-700 text-white rounded-xl text-xs font-bold uppercase cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setConsultSubmitted(true);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Verma"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Service Interest</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-blue-500 font-bold text-slate-800">
                    <option>1. Brand Explore Franchise Prospect</option>
                    <option>2. Verified Franchise Seeker Database</option>
                    <option>3. Franchise Prospect Explore Brand</option>
                    <option>4. Franchise Prospect Search Portal</option>
                    <option>5. Franchise Investment & ROI Guidance</option>
                    <option>6. Smart Franchise Matching</option>
                    <option>7. Franchise Digital Marketing</option>
                    <option>8. Franchise Opportunity Assessment</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowConsultModal(false)}
                    className="w-1/2 py-3 border border-slate-300 text-slate-600 font-bold text-xs uppercase rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-3 bg-blue-700 hover:bg-blue-500 text-white font-extrabold text-xs uppercase rounded-xl transition-colors cursor-pointer shadow"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

