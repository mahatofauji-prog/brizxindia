import React, { useState, useEffect } from 'react';

// Import 12 AI-generated premium portrait/landscape assets
import seekerYoung from '../assets/images/seeker_young_entrepreneur_1788063149516.jpg';
import seekerExp from '../assets/images/seeker_experienced_investor_1788063165517.jpg';
import seekerCouple from '../assets/images/seeker_couple_investors_1788063182984.jpg';
import seekerProf from '../assets/images/seeker_business_professional_1788063199119.jpg';
import seekerFirst from '../assets/images/seeker_first_time_entrepreneur_1788063290860.jpg';
import seekerMulti from '../assets/images/seeker_multi_business_investor_1788063305422.jpg';

import brandRest from '../assets/images/brand_restaurant_founder_1788063215618.jpg';
import brandHealth from '../assets/images/brand_healthcare_owner_1788063234518.jpg';
import brandFit from '../assets/images/brand_fitness_founder_1788063254276.jpg';
import brandRetail from '../assets/images/brand_retail_operator_1788063272602.jpg';
import brandEdu from '../assets/images/brand_education_franchise_owner_1788063326343.jpg';
import brandSuccess from '../assets/images/brand_successful_franchise_operator_1788063347381.jpg';

interface SliderImage {
  src: string;
  pos: string;
}

const IMAGE_CONFIGS: SliderImage[] = [
  { src: seekerYoung, pos: 'object-[75%_35%] md:object-[80%_30%]' },
  { src: brandRest, pos: 'object-[80%_40%] md:object-[85%_35%]' },
  { src: seekerExp, pos: 'object-[70%_30%] md:object-[75%_25%]' },
  { src: brandHealth, pos: 'object-[85%_45%] md:object-[90%_40%]' },
  { src: seekerCouple, pos: 'object-[75%_35%] md:object-[80%_30%]' },
  { src: brandFit, pos: 'object-[80%_40%] md:object-[85%_35%]' },
  { src: seekerProf, pos: 'object-[75%_30%] md:object-[80%_25%]' },
  { src: brandRetail, pos: 'object-[85%_35%] md:object-[90%_30%]' },
  { src: seekerFirst, pos: 'object-[75%_30%] md:object-[80%_25%]' },
  { src: brandEdu, pos: 'object-[80%_40%] md:object-[85%_35%]' },
  { src: seekerMulti, pos: 'object-[75%_35%] md:object-[80%_30%]' },
  { src: brandSuccess, pos: 'object-[80%_45%] md:object-[85%_40%]' }
];

export function HeroBackgroundNetwork() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrevIndex(currentIndex);
      setCurrentIndex((prev) => (prev + 1) % IMAGE_CONFIGS.length);
    }, 4500); // 4.5 seconds per image display

    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none bg-black">
      <style>{`
        /* Cinematic slow-panning & extremely subtle Ken Burns zoom keyframes */
        @keyframes kenburns-dir-0 {
          0% {
            transform: scale(1.00) translate(0%, 0%);
          }
          100% {
            transform: scale(1.04) translate(0.8%, 0.4%);
          }
        }
        @keyframes kenburns-dir-1 {
          0% {
            transform: scale(1.00) translate(0%, 0%);
          }
          100% {
            transform: scale(1.04) translate(-0.8%, -0.4%);
          }
        }
        @keyframes kenburns-dir-2 {
          0% {
            transform: scale(1.00) translate(0%, 0%);
          }
          100% {
            transform: scale(1.04) translate(0.4%, -0.8%);
          }
        }
        @keyframes kenburns-dir-3 {
          0% {
            transform: scale(1.00) translate(0%, 0%);
          }
          100% {
            transform: scale(1.04) translate(-0.4%, 0.8%);
          }
        }

        .kb-anim-0 { animation: kenburns-dir-0 6s ease-out forwards; }
        .kb-anim-1 { animation: kenburns-dir-1 6s ease-out forwards; }
        .kb-anim-2 { animation: kenburns-dir-2 6s ease-out forwards; }
        .kb-anim-3 { animation: kenburns-dir-3 6s ease-out forwards; }

        @media (prefers-reduced-motion: reduce) {
          .kb-anim-0, .kb-anim-1, .kb-anim-2, .kb-anim-3 {
            animation: none !important;
            transform: scale(1) !important;
          }
          .transition-opacity {
            transition: opacity 0.5s ease-in-out !important;
          }
        }
      `}</style>

      {/* Render slider images */}
      {IMAGE_CONFIGS.map((config, index) => {
        const isActive = index === currentIndex;
        const isPrev = index === prevIndex;
        const isVisible = isActive || isPrev;

        const animClass = isActive ? `kb-anim-${index % 4}` : '';

        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out pointer-events-none ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Lazy load / preload: only mount img if active, previous or immediate next in queue */}
            {(isActive || isPrev || index === (currentIndex + 1) % IMAGE_CONFIGS.length) && (
              <img
                src={config.src}
                alt=""
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover ${config.pos} ${animClass}`}
              />
            )}
          </div>
        );
      })}

      {/* Images only - no gradients or themes blocking the view as requested */}
    </div>
  );
}
