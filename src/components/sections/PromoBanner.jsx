import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import homeBannerImg from '../../assets/images/Homebanner.png';

const PromoBanner = () => {
  return (
    <section className="mb-4 sm:mb-6 lg:py-2 bg-[#fdfbf6]">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="relative w-full max-w-[1400px] mx-auto rounded-[20px] sm:rounded-[24px] overflow-hidden flex flex-col md:flex-row items-stretch bg-[#fffaf0] border border-yellow-100/50">
          
          {/* Yellow Background Element (Diagonal for Desktop) */}
          <div 
            className="hidden md:block absolute top-0 right-0 bottom-0 w-[55%] bg-[#ffcc00] z-0"
            style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' }}
          >
            {/* Decorative dots pattern */}
            <div className="absolute top-15 right-20 grid grid-cols-6 gap-2 opacity-30">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-white"></div>
              ))}
            </div>
            {/* Decorative lines/shapes */}
            <div className="absolute top-2/6 -right-7 w-47 h-47 rounded-[50%] rotate-45 translate-x-1/3 opacity-20 bg-white"></div>
          </div>

          {/* Left Content */}
          <div className="relative z-10 w-full md:w-1/2 p-5 sm:p-7 md:p-8 lg:p-12 xl:px-14 flex flex-col justify-center">
            <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold text-gray-900 mb-2.5 sm:mb-3 md:mb-4 font-poppins leading-[1.2] sm:leading-[1.15] tracking-tight">
              Custom Prints <br className="hidden sm:inline" /> For Every Need
            </h2>
            <p className="text-gray-600 mb-4 sm:mb-5 md:mb-6 max-w-md text-xs sm:text-sm md:text-xs lg:text-sm leading-relaxed">
              Personalized printing solutions for events, businesses, and everyday moments.
            </p>

            <div className="grid grid-cols-2 gap-y-3 sm:gap-y-4 gap-x-3 sm:gap-x-4 mb-5 sm:mb-6 md:mb-8">
              {['Custom Sizes', 'Premium Materials', 'Vibrant Colors', 'Fast Turnaround'].map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#ffcc00] flex items-center justify-center shrink-0">
                    <Icon icon="lucide:check" className="text-white text-[10px] font-bold" />
                  </div>
                  <span className="text-[11px] sm:text-xs md:text-xs lg:text-sm font-medium text-gray-800">{feature}</span>
                </div>
              ))}
            </div>

            <Link
              to="/products"
              className="bg-[#111111] hover:bg-[#222222] text-white text-xs sm:text-sm font-semibold px-5 sm:px-6 py-2.5 sm:py-3 mt-1 sm:mt-2 rounded-lg flex items-center justify-center gap-2 w-fit transition-all duration-300 group shadow-md hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Explore Custom Prints</span>
              <Icon icon="lucide:arrow-right" className="text-sm sm:text-base transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Right Image Container */}
          <div className="relative z-10 w-full md:w-1/2 flex items-center justify-center bg-[#ffcc00] md:bg-transparent overflow-hidden md:overflow-visible">
            {/* Decorative Dots Pattern (Mobile Only) */}
            <div className="absolute top-4 right-4 grid grid-cols-6 gap-2 opacity-35 pointer-events-none z-0 md:hidden">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-white"></div>
              ))}
            </div>

            {/* Decorative Oval / Circle Shape (Mobile Only) */}
            <div className="absolute top-1/2 -left-15 w-40 h-40 rounded-full bg-white/15 -translate-y-1/2 rotate-45 pointer-events-none z-0 md:hidden"></div>

            {/* Product Image */}
            <img 
              src={homeBannerImg} 
              alt="Custom Printed Products like T-shirts, Mugs and Caps" 
              className="relative z-10 md:-left-[15%] w-[85%] sm:w-[80%] md:w-[95%] max-w-none h-auto object-contain"
            />
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
