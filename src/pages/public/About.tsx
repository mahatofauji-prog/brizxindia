import React from 'react';
import { Users, Target, ShieldCheck, Award, ArrowRight, Compass, Rocket, Briefcase, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router';
import { useCMS } from '../../context/CMSContext';

export default function About() {
  const { about } = useCMS();

  const teamMembers = about.teamMembers.map(tm => ({
    name: tm.name,
    role: tm.role,
    exp: 'Core Leadership Team',
    img: tm.name.split(' ').map(n => n[0]).join('')
  }));

  const businessGoals = [
    { title: "Empower 50,000 Entrepreneurs", desc: "Enable first-time franchise owners across Tier 1, Tier 2, and Tier 3 Indian cities by 2028." },
    { title: "Zero Franchise Failures", desc: "Utilize predictive AI matching to reduce early-stage franchise store closures to under 2%." },
    { title: "₹5,000 Crore Capital Facilitation", desc: "Become the backbone of India's franchise investments through streamlined digital matchmaking." },
  ];

  return (
    <main className="flex-1 bg-white">
      {/* Hero Section */}
      <section className="py-20 px-6 md:px-10 bg-indigo-950 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-block px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
            About BrizX India
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6">Revolutionizing India's Franchise Ecosystem</h1>
          <p className="text-lg md:text-xl text-indigo-200 max-w-2xl mx-auto font-medium leading-relaxed">
            We are on a mission to organize India's unorganized franchise sector through transparency, AI-driven matchmaking, and verified investor connections.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-blue-500 text-xs font-extrabold uppercase tracking-widest">Our Journey</span>
            <h2 className="text-3xl md:text-4xl font-black text-indigo-950 mb-6 mt-1">The BrizX Story</h2>
            <p className="text-slate-600 mb-4 leading-relaxed font-medium">
              BrizX India was founded with a simple yet powerful goal: finding the right franchise shouldn't be a high-stakes gamble. For years, brand owners struggled to find qualified, location-ready investors, while franchise seekers navigated a fragmented market filled with brokers and unverified claims.
            </p>
            <p className="text-slate-600 leading-relaxed font-medium">
              Today, BrizX India is the country's leading Smart Franchise Intelligence Platform. By leveraging multi-variable data analytics and a proprietary AI Match Engine, we ensure every franchise partnership is built on strategic compatibility, verified capital, and mutual long-term success.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-center shadow-sm">
              <div className="text-4xl font-black text-indigo-950 mb-1">10k+</div>
              <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Verified Seekers</div>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-center shadow-sm translate-y-4">
              <div className="text-4xl font-black text-blue-500 mb-1">500+</div>
              <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Partner Brands</div>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-center shadow-sm">
              <div className="text-4xl font-black text-indigo-950 mb-1">₹500Cr+</div>
              <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Capital Deployed</div>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-center shadow-sm translate-y-4">
              <div className="text-4xl font-black text-green-600 mb-1">98%</div>
              <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Match Accuracy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 px-6 md:px-10 bg-blue-700 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-indigo-950/80 p-8 md:p-10 rounded-3xl border border-indigo-800 relative">
            <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
              <Compass size={32} />
            </div>
            <h3 className="text-2xl font-black mb-4">Our Vision</h3>
            <p className="text-indigo-200 text-sm md:text-base leading-relaxed">
              To build the global benchmark for franchise intelligence where every aspiring entrepreneur in India can effortlessly discover, evaluate, and launch a thriving franchise business with complete confidence and zero friction.
            </p>
          </div>

          <div className="bg-indigo-950/80 p-8 md:p-10 rounded-3xl border border-indigo-800 relative">
            <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
              <Rocket size={32} />
            </div>
            <h3 className="text-2xl font-black mb-4">Our Mission</h3>
            <p className="text-indigo-200 text-sm md:text-base leading-relaxed">
              To democratize franchise ownership by replacing opaque middleman channels with data-backed AI matchmaking, mandatory brand verification, and automated deal-closing pipelines.
            </p>
          </div>
        </div>
      </section>

      {/* Why BrizX */}
      <section className="py-20 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-blue-500 text-xs font-extrabold uppercase tracking-widest">Unrivaled Advantage</span>
          <h2 className="text-3xl md:text-4xl font-black text-indigo-950 mt-1">Why Choose BrizX India?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mb-6 font-black text-xl">
              1
            </div>
            <h3 className="text-xl font-bold text-indigo-950 mb-3">100% Audited Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We audit GST compliance, store unit economics, and trademark registrations before granting the BrizX Verified badge.
            </p>
          </div>

          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 font-black text-xl">
              2
            </div>
            <h3 className="text-xl font-bold text-indigo-950 mb-3">AI Smart Compatibility</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We evaluate investment budget, operational background, city demand, and risk profile to produce true high-yield matches.
            </p>
          </div>

          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mb-6 font-black text-xl">
              3
            </div>
            <h3 className="text-xl font-bold text-indigo-950 mb-3">Direct Franchisor Access</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No middleman commission markups or hidden broker fees. Direct communications, scheduling, and LOI signing.
            </p>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 px-6 md:px-10 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-blue-500 text-xs font-extrabold uppercase tracking-widest">Leadership</span>
            <h2 className="text-3xl md:text-4xl font-black text-indigo-950 mt-1">Meet the BrizX Team</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 text-center shadow-sm">
                <div className="w-20 h-20 bg-indigo-950 text-blue-400 font-black text-2xl rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-inner">
                  {member.img}
                </div>
                <h3 className="font-black text-indigo-950 text-base">{member.name}</h3>
                <div className="text-xs font-extrabold text-blue-600 my-1">{member.role}</div>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{member.exp}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Goals */}
      <section className="py-20 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-blue-500 text-xs font-extrabold uppercase tracking-widest">Long Term Impact</span>
          <h2 className="text-3xl md:text-4xl font-black text-indigo-950 mt-1">Strategic Business Goals</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {businessGoals.map((goal, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-blue-500 mb-4"><CheckCircle2 size={24} /></div>
              <h3 className="font-black text-indigo-950 text-lg mb-2">{goal.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{goal.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 md:px-10 bg-indigo-950 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Ready to Grow Your Franchise Footprint?</h2>
          <p className="text-indigo-200 text-sm md:text-base mb-8">
            Join over 10,000 seekers and 500+ verified brand owners scaling across India with BrizX.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
            >
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link
              to="/brands"
              className="px-8 py-3.5 border border-indigo-700 text-white hover:bg-blue-700 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all"
            >
              Explore Brands
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

