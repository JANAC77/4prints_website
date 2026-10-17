import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import homeBannerImg from '../../assets/images/Homebanner.png';

const PromoBanner = () => {
  return (
    <section className="mb-6 sm:mb-8 lg:py-4 bg-[#fdfbf6]">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="relative w-full max-w-[1400px] mx-auto rounded-[24px] sm:rounded-[32px] overflow-hidden flex flex-col md:flex-row items-stretch bg-gradient-to-br from-[#fffdf5] via-[#fff8e7] to-[#fff3d4] border border-yellow-200/60 shadow-xs">
          
          {/* Yellow Background Element (Diagonal for Desktop) */}
          <div 
            className="hidden md:block absolute top-0 right-0 bottom-0 w-[55%] bg-[#FFD40C] z-0"
            style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' }}
          >
            {/* Decorative dots pattern */}
            <div className="absolute top-12 right-16 grid grid-cols-6 gap-2.5 opacity-25">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-white"></div>
              ))}
            </div>
            {/* Decorative circles */}
            <div className="absolute top-1/4 -right-12 w-64 h-64 rounded-full opacity-20 bg-white blur-xl"></div>
          </div>

          {/* Left Content */}
          <div className="relative z-10 w-full md:w-1/2 p-6 sm:p-8 md:p-10 lg:p-14 flex flex-col justify-center">
            <div className="inline-flex items-center gap-1.5 bg-yellow-200/80 text-yellow-900 text-[11px] font-bold px-3 py-1 rounded-full w-fit mb-3">
              <Icon icon="solar:crown-star-bold" className="text-yellow-700 text-xs" />
              <span>Tailored For Your Brand</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-gray-950 mb-3 font-poppins leading-[1.15] tracking-tight">
              Custom Prints <br className="hidden sm:inline" /> For Every Need
            </h2>
            <p className="text-gray-600 mb-6 max-w-md text-xs sm:text-sm lg:text-base leading-relaxed">
              Personalized printing solutions for corporate events, startups, merchandising, and personal milestones.
            </p>

            <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-7">
              {[
                { name: 'Custom Sizes', icon: 'solar:ruler-bold' },
                { name: 'Premium Materials', icon: 'solar:medal-ribbons-star-bold' },
                { name: 'Vibrant CMYK Colors', icon: 'solar:palette-bold' },
                { name: 'Fast Turnaround', icon: 'solar:delivery-bold' },
              ].map((feature) => (
                <div key={feature.name} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#110C0B] text-yellow-400 flex items-center justify-center shrink-0">
                    <Icon icon="lucide:check" className="text-xs font-bold" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-900">{feature.name}</span>
                </div>
              ))}
            </div>

            <Link
              to="/products"
              className="bg-[#110C0B] hover:bg-black text-white text-xs sm:text-sm font-bold px-7 py-3.5 rounded-full flex items-center justify-center gap-2.5 w-fit transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 active:scale-95 group"
            >
              <span>Explore Custom Prints</span> 
              <Icon icon="solar:arrow-right-linear" className="text-yellow-400 text-base transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Right Image Container */}
          <div className="relative z-10 w-full md:w-1/2 flex items-center justify-center bg-[#FFD40C] md:bg-transparent overflow-hidden md:overflow-visible p-6 md:p-0">
            {/* Product Image */}
            <img 
              src={homeBannerImg} 
              alt="Custom Printed Products like T-shirts, Mugs and Caps" 
              className="relative z-10 md:-left-[12%] w-[88%] sm:w-[80%] md:w-[95%] max-w-none h-auto object-contain drop-shadow-xl transition-transform duration-500 hover:scale-105"
            />
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
