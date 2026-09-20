import React, { useState } from 'react';
import { Search, Calendar, Clock, ArrowRight, User, Tag, BookOpen, Sparkles } from 'lucide-react';
import { Link } from 'react-router';

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const articles = [
    {
      id: 1,
      title: "Top 10 High-Yield Franchise Business Models in India for 2026",
      summary: "An in-depth analysis of QSR cloud kitchens, diagnostic hubs, EV charging networks, and boutique fitness centers driving maximum ROI.",
      category: "STRATEGY",
      author: "Vikramaditya Roy",
      date: "August 1, 2026",
      readTime: "6 min read",
      imageTag: "🍔 Food & Retail",
      featured: true
    },
    {
      id: 2,
      title: "Understanding Franchise Agreements: Key Legal Clauses Every Investor Must Know",
      summary: "Don't sign without reading this breakdown of royalty calculations, territorial exclusivity rights, and exit indemnity conditions.",
      category: "LEGAL",
      author: "Kavita Nair",
      date: "July 28, 2026",
      readTime: "8 min read",
      imageTag: "⚖️ Legal & LOI",
      featured: false
    },
    {
      id: 3,
      title: "Tier 2 & Tier 3 City Expansion: Why Regional India is the New Franchise Goldmine",
      summary: "How rising disposable incomes and lower real estate overheads in cities like Jaipur, Lucknow, and Surat are outperforming metros.",
      category: "INDUSTRY",
      author: "Siddharth Mehta",
      date: "July 24, 2026",
      readTime: "5 min read",
      imageTag: "🏙️ Market Trends",
      featured: false
    },
    {
      id: 4,
      title: "Calculating True Unit Economics: Capex vs. Opex in Modern QSR Franchises",
      summary: "Learn how to accurately evaluate breakeven periods, payback timelines, and hidden working capital requirements before investing.",
      category: "FINANCE",
      author: "Ananya Deshmukh",
      date: "July 18, 2026",
      readTime: "7 min read",
      imageTag: "📊 ROI & Capital",
      featured: false
    },
    {
      id: 5,
      title: "Master Franchise vs. Single-Unit Franchise: Which Model Suits Your Capital?",
      summary: "A comparative guide for high-net-worth investors considering regional area development rights vs single-store operational leases.",
      category: "STRATEGY",
      author: "Vikramaditya Roy",
      date: "July 12, 2026",
      readTime: "6 min read",
      imageTag: "💼 Expansion",
      featured: false
    },
    {
      id: 6,
      title: "How BrizX AI Smart Match Engine Eliminates Bad Franchise Partnerships",
      summary: "Discover the multi-factor algorithmic scoring system behind BrizX that guarantees 98% operational compatibility between franchisors and seekers.",
      category: "TECH",
      author: "Ananya Deshmukh",
      date: "July 05, 2026",
      readTime: "4 min read",
      imageTag: "🤖 AI Intelligence",
      featured: false
    }
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesCat = activeCategory === 'ALL' || art.category === activeCategory;
    const matchesSearch =
      (art.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (art.summary || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (art.author || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const featuredArticle = articles.find((art) => art.featured) || articles[0];

  return (
    <main className="flex-1 bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-indigo-950 text-white p-8 md:p-12 rounded-3xl mb-12 relative overflow-hidden shadow-xl text-center md:text-left">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">
              Franchise Insights & Knowledge
            </span>
            <h1 className="text-3xl md:text-5xl font-black mb-3">BrizX Franchise Intelligence Blog</h1>
            <p className="text-indigo-200 text-sm md:text-base leading-relaxed">
              Expert guides, legal blueprints, ROI analysis, and market reports to guide your franchise expansion journey in India.
            </p>
          </div>
        </div>

        {/* Categories & Search Bar */}
        <div className="bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {['ALL', 'STRATEGY', 'LEGAL', 'INDUSTRY', 'FINANCE', 'TECH'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                  activeCategory === cat ? 'bg-blue-700 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search articles & guides..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Featured Article */}
        {activeCategory === 'ALL' && !searchTerm && (
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm hover:shadow-xl transition-all mb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <span className="bg-blue-100 text-blue-700 text-[10px] font-black uppercase px-3 py-1 rounded-full">
                  Featured Guide
                </span>
                <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                  <Calendar size={12} /> {featuredArticle.date}
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-black text-indigo-950 hover:text-blue-500 transition-colors">
                {featuredArticle.title}
              </h2>

              <p className="text-slate-600 text-xs md:text-sm leading-relaxed">{featuredArticle.summary}</p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <User size={14} className="text-blue-500" /> {featuredArticle.author}
                </div>
                <button className="text-blue-700 font-black text-xs uppercase tracking-wider flex items-center gap-1 hover:text-blue-500 transition-colors cursor-pointer">
                  Read Full Guide <ArrowRight size={14} />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-2xl p-8 text-center flex flex-col justify-center items-center h-full min-h-[200px]">
              <BookOpen size={48} className="text-blue-400 mb-3" />
              <div className="text-sm font-extrabold uppercase tracking-widest text-blue-400">{featuredArticle.imageTag}</div>
              <div className="text-xs text-indigo-200 mt-2">{featuredArticle.readTime}</div>
            </div>
          </div>
        )}

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-slate-100 text-blue-700 text-[10px] font-black uppercase px-2.5 py-1 rounded-md">
                    {art.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                    <Clock size={12} /> {art.readTime}
                  </span>
                </div>

                <h3 className="font-black text-indigo-950 text-base group-hover:text-blue-500 transition-colors mb-3 leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-6 line-clamp-3">{art.summary}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <User size={12} className="text-blue-500" /> {art.author}
                </div>
                <button className="text-xs font-black text-blue-700 hover:text-blue-500 transition-colors flex items-center gap-1 cursor-pointer">
                  Read <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
