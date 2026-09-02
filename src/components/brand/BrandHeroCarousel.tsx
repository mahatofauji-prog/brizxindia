import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router';
import { 
  Sparkles, ShieldCheck, ChevronLeft, ChevronRight, Search, Star, 
  Building2, Users, IndianRupee, TrendingUp, CheckCircle2, Play, Pause
} from 'lucide-react';
import { BrandShowcaseSlide, DEFAULT_BRAND_HERO_SLIDES } from '../../data/brandHeroShowcase';

interface BrandHeroCarouselProps {
  slides?: BrandShowcaseSlide[];
  currentBrandName?: string;
  verifiedSeekersCount?: number;
  unlocksRemaining?: number;
  autoPlayInterval?: number;
}

export function BrandHeroCarousel({
  slides = DEFAULT_BRAND_HERO_SLIDES,
  currentBrandName = 'Verified Franchise Partner',
  verifiedSeekersCount = 1250,
  unlocksRemaining = 12,
  autoPlayInterval = 5000
}: BrandHeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Autoplay management with timer cleanup
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused, nextSlide, autoPlayInterval, totalSlides, currentIndex]);

  // Touch Swipe Handlers for mobile 16:9 navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 40) {
      nextSlide();
    } else if (diff < -40) {
      prevSlide();
    }
    setTouchStart(null);
  };

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <div
      id="brand_hero_showcase_carousel"
      className="w-full relative overflow-hidden select-none bg-slate-950 group shadow-lg"
      style={{ aspectRatio: '16 / 9' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Brand Portal Hero Showcase"
    >
      {/* 10 Animated Slides - Strictly ONE Visible At A Time */}
      {slides.map((slide, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-all duration-1000 ease-out ${
              isActive
                ? 'opacity-100 scale-100 z-10 pointer-events-auto'
                : 'opacity-0 scale-105 pointer-events-none z-0'
            }`}
          >
            {/* High-Resolution Lifestyle Character & Brand Scene */}
            <img
              src={slide.image}
              alt={`${slide.brandName} - ${slide.category}`}
              className="w-full h-full object-cover object-center"
              loading={idx === 0 ? 'eager' : 'lazy'}
              decoding="async"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Graceful dedicated neutral hero fallback if any image fails
                const target = e.currentTarget;
                if (!target.src.startsWith('data:image/svg+xml')) {
                  target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><rect width="1920" height="1080" fill="%23090d16"/><rect x="40" y="40" width="1840" height="1000" rx="24" fill="%230f172a" stroke="%231e293b" stroke-width="2"/><text x="50%" y="50%" fill="%2360a5fa" font-family="system-ui,sans-serif" font-weight="bold" font-size="36" text-anchor="middle" dy=".3em">Franchise Brand Showcase</text></svg>';
                }
              }}
            />

            {/* High-Contrast Readability Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/65 to-slate-950/20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/30"></div>
          </div>
        );
      })}

      {/* Hero Interactive Content Overlay Layer */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-2.5 sm:p-5 md:p-7 lg:p-9 xl:p-11 text-white">
        
        {/* Top Bar: Sector Badges, Verification & Slide Counter */}
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            {/* Sector / Franchise Category Badge */}
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-blue-500/30 backdrop-blur-md text-blue-300 border border-blue-400/40 text-[7px] sm:text-[9px] md:text-[11px] font-black uppercase tracking-wider shadow-sm truncate">
              <Sparkles size={10} className="fill-blue-400 text-blue-300 shrink-0" />
              <span className="truncate">{currentSlide.badge}</span>
            </span>

            {/* Verification Status */}
            <span className="hidden xs:inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[7px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
              <ShieldCheck size={11} className="text-emerald-400 shrink-0" />
              <span className="truncate">GST Verified</span>
            </span>

            {/* Active Logged-in Brand Context */}
            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/70 text-slate-300 border border-white/10 text-[9px] md:text-[10px] font-semibold backdrop-blur-md">
              <Building2 size={11} className="text-blue-400 shrink-0" />
              <span className="truncate max-w-[150px] lg:max-w-[200px]">{currentBrandName}</span>
            </span>
          </div>

          {/* Right Controls: Slide Counter + Play/Pause & Indicators */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Slide Index Badge */}
            <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-950/70 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-white/15 text-[7px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-wider text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shrink-0"></span>
              <span>{String(currentIndex + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}</span>
            </div>

            {/* Play / Pause Toggle Button */}
            <button
              onClick={() => setIsPaused((prev) => !prev)}
              className="p-1 sm:p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/15 transition-all cursor-pointer"
              title={isPaused ? 'Resume Auto-showcase' : 'Pause Auto-showcase'}
              aria-label={isPaused ? 'Resume Auto-showcase' : 'Pause Auto-showcase'}
            >
              {isPaused ? <Play size={10} className="fill-current" /> : <Pause size={10} />}
            </button>
          </div>
        </div>

        {/* Center / Body Section: Brand Name, Tagline, Investment Details & CTAs */}
        <div className="space-y-1 sm:space-y-2 md:space-y-3 lg:space-y-4 max-w-3xl">
          {/* Main Brand Title & Category */}
          <div className="space-y-0.5 sm:space-y-1">
            <div className="text-[8px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider text-blue-400">
              {currentSlide.category}
            </div>
            <h1 className="text-sm sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-white tracking-tight font-heading leading-tight drop-shadow-md">
              {currentSlide.brandName}
            </h1>
            <p className="text-slate-200 text-[8px] sm:text-[11px] md:text-xs lg:text-sm leading-relaxed max-w-2xl font-normal drop-shadow line-clamp-1 sm:line-clamp-2">
              {currentSlide.tagline}
            </p>
          </div>

          {/* Franchise Investment & Expansion Highlights */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 pt-0.5">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-white/10 backdrop-blur-md text-slate-100 text-[7px] sm:text-[9px] md:text-[11px] font-bold border border-white/15">
              <IndianRupee size={10} className="text-amber-400 shrink-0" />
              <span>Investment: {currentSlide.investmentRange}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-white/10 backdrop-blur-md text-slate-100 text-[7px] sm:text-[9px] md:text-[11px] font-bold border border-white/15">
              <Building2 size={10} className="text-blue-400 shrink-0" />
              <span>{currentSlide.outletsCount}</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-md text-slate-100 text-[9px] md:text-[11px] font-bold border border-white/15">
              <TrendingUp size={10} className="text-emerald-400 shrink-0" />
              <span>{currentSlide.expansionModel}</span>
            </span>
            <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-200 text-[10px] font-semibold border border-blue-400/30">
              <Users size={10} className="text-blue-300 shrink-0" />
              <span>{currentSlide.characterTitle}</span>
            </span>
          </div>

          {/* Action CTAs & Logged-in Brand Status */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 pt-0.5 sm:pt-1">
            <Link
              to="/search"
              className="px-2.5 py-1 sm:px-4 sm:py-2 md:px-5 md:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider rounded-lg sm:rounded-xl transition-all shadow-md shadow-blue-600/30 flex items-center gap-1 sm:gap-1.5 cursor-pointer active:scale-95 shrink-0"
            >
              <Search size={12} className="shrink-0" />
              <span>Match Seekers ({verifiedSeekersCount}+)</span>
            </Link>

            <Link
              to="/brand/subscription"
              className="px-2.5 py-1 sm:px-4 sm:py-2 md:px-5 md:py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-bold text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider rounded-lg sm:rounded-xl transition-all border border-white/20 flex items-center gap-1 sm:gap-1.5 cursor-pointer active:scale-95 shrink-0"
            >
              <Star size={12} className="text-amber-400 shrink-0" />
              <span>{unlocksRemaining} Unlocks Left • Upgrade</span>
            </Link>

            <Link
              to="/brand/crm"
              className="hidden sm:inline-flex px-3 py-2 md:px-4 md:py-2.5 bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-md text-slate-200 hover:text-white font-bold text-[10px] md:text-xs uppercase tracking-wider rounded-xl transition-all border border-white/15 items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>CRM Pipeline</span>
            </Link>
          </div>
        </div>

        {/* Bottom Navigation Row: Left/Right Arrows + 10 Slide Dots */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
          {/* Persona / Executive Name highlight on bottom left */}
          <div className="text-[7px] sm:text-[9px] md:text-[10px] text-slate-300 font-medium truncate max-w-[200px] sm:max-w-[320px]">
            Featured: <strong className="text-white font-bold">{currentSlide.characterTitle.split('•')[0]}</strong>
          </div>

          {/* Navigation Controls: Previous / 10 Dots / Next */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Prev Button */}
            <button
              onClick={prevSlide}
              className="p-1 sm:p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white border border-white/20 transition-all cursor-pointer active:scale-90"
              title="Previous Brand"
              aria-label="Previous Brand"
            >
              <ChevronLeft size={12} className="sm:w-3.5 sm:h-3.5" />
            </button>

            {/* 10 Slide Dots */}
            <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/15">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`h-1 sm:h-1.5 rounded-full transition-all cursor-pointer ${
                    i === currentIndex
                      ? 'bg-blue-400 w-3 sm:w-5'
                      : 'bg-white/40 hover:bg-white/80 w-1 sm:w-1.5'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              className="p-1 sm:p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white border border-white/20 transition-all cursor-pointer active:scale-90"
              title="Next Brand"
              aria-label="Next Brand"
            >
              <ChevronRight size={12} className="sm:w-3.5 sm:h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
