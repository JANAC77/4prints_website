import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../../assets/images/heroSection.png';
import mobileImage from '../../assets/images/mobile.png';
import { Icon } from '@iconify/react';

const HeroSection = () => {
  return (
    <div className="relative w-full font-poppins overflow-hidden flex flex-col bg-[#fdfbf6]">
      {/* Main Hero Content */}
      <div className="relative w-full flex flex-col md:flex-row">
        {/* Right Side Image */}
        <div className="hidden md:block absolute top-0 right-0 bottom-0 left-[50%]">
          <img
            src={heroImage}
            alt="Printing Products Collection"
            className="hidden lg:block w-full h-full object-contain object-center"
          />
          <img
            src={heroImage}
            alt="Printing Products Collection"
            className="block lg:hidden w-full h-full object-contain object-center"
          />
        </div>

        {/* Mobile Image */}
        <div className="block md:hidden w-full">
          <img
            src={mobileImage}
            alt="Printing Products Collection"
            className="w-full h-auto block object-cover"
          />
        </div>

        {/* Left Side Content */}
        <div className="relative z-10 w-full md:w-1/2 flex items-center self-stretch">
          <div className="w-full max-w-[750px] md:ml-auto px-6 sm:px-8 py-8 lg:py-12 flex flex-col items-center text-center md:items-start md:text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-1.5 bg-yellow-100/80 border border-yellow-200 text-yellow-900 text-[11px] lg:text-xs font-bold px-3.5 py-1.5 rounded-full mb-3.5 sm:mb-4 shadow-2xs">
              <Icon icon="solar:stars-minimalistic-bold" className="text-yellow-600 text-sm" />
              <span>High Quality Printing, Made Simple</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-extrabold text-[#111111] leading-[1.12] tracking-tight">
              Design. Print. <br className="hidden xl:block" />{' '}
              <span className="text-[#FFD40C] bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent">
                Impress.
              </span>
            </h1>

            <p className="mt-3.5 sm:mt-4 text-gray-600 text-xs sm:text-sm md:text-xs lg:text-sm xl:text-base 2xl:text-lg max-w-md leading-relaxed">
              Custom printing for every need. Business cards, apparel, packaging, and marketing materials engineered to perfection.
            </p>

            {/* Features Micro-Grid */}
            <div className="grid md:hidden lg:grid grid-cols-4 gap-3 lg:gap-4 mt-6 xl:mt-8 w-full max-w-lg place-items-center lg:place-items-start">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 text-amber-700 shadow-2xs">
                  <Icon icon="solar:medal-ribbons-star-bold" className="text-base" />
                </div>
                <div className="text-[11px] sm:text-xs font-bold leading-tight text-left text-gray-900">
                  Premium <br />
                  <span className="font-normal text-gray-500">Quality</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-700 shadow-2xs">
                  <Icon icon="solar:delivery-bold" className="text-base" />
                </div>
                <div className="text-[11px] sm:text-xs font-bold leading-tight text-left text-gray-900">
                  Fast <br />
                  <span className="font-normal text-gray-500">Delivery</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center shrink-0 text-purple-700 shadow-2xs">
                  <Icon icon="solar:palette-bold" className="text-base" />
                </div>
                <div className="text-[11px] sm:text-xs font-bold leading-tight text-left text-gray-900">
                  Custom <br />
                  <span className="font-normal text-gray-500">Design</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 text-blue-700 shadow-2xs">
                  <Icon icon="solar:headphones-round-sound-bold" className="text-base" />
                </div>
                <div className="text-[11px] sm:text-xs font-bold leading-tight text-left text-gray-900">
                  24/7 <br />
                  <span className="font-normal text-gray-500">Support</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row items-center justify-center md:justify-start gap-3 mt-7 sm:mt-8 w-full sm:w-auto">
              <Link
                to="/products"
                className="w-auto bg-[#FFD40C] hover:bg-[#ffc800] text-gray-950 font-bold px-6 sm:px-8 py-3 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-xs lg:text-sm shadow-md whitespace-nowrap gap-2"
              >
                <span>Shop All Prints</span>
                <Icon icon="solar:arrow-right-linear" className="text-base font-bold" />
              </Link>
              <Link
                to="/products?badge=featured"
                className="w-auto bg-white border-2 border-gray-200 hover:border-[#FFD40C] hover:bg-yellow-50 text-gray-800 font-bold px-6 sm:px-7 py-3 rounded-full flex items-center justify-center transition-all text-xs lg:text-sm whitespace-nowrap"
              >
                Start Designing
              </Link>
            </div>

            {/* Trust Section */}
            <div className="hidden lg:flex items-center mt-7 xl:mt-9 gap-3.5">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-tr from-amber-400 to-yellow-200 text-gray-900 text-xs font-bold flex items-center justify-center shadow-xs">
                  JD
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-tr from-blue-400 to-indigo-300 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                  AR
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-tr from-emerald-400 to-teal-300 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                  SK
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-tr from-purple-400 to-pink-300 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                  ML
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-[#110C0B] text-yellow-400 text-[10px] font-extrabold flex items-center justify-center shadow-xs z-10">
                  +10K
                </div>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs font-bold text-gray-900">
                  Trusted by 10,000+ businesses & creators
                </span>
                <div className="flex items-center text-amber-400 text-sm mt-0.5">
                  <Icon icon="solar:star-bold" />
                  <Icon icon="solar:star-bold" />
                  <Icon icon="solar:star-bold" />
                  <Icon icon="solar:star-bold" />
                  <Icon icon="solar:star-bold" />
                  <span className="text-gray-900 font-extrabold text-xs ml-1.5">
                    4.9 / 5.0
                  </span>
                  <span className="text-gray-400 text-xs ml-1 font-normal">(Verified Reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Features Cards Bar */}
      <div className="w-full bg-white/60 backdrop-blur-xs border-y border-amber-100/60 mt-auto relative z-20 px-4 sm:px-6 py-5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div className="flex items-center space-x-3 bg-white/80 p-3 sm:p-3.5 rounded-2xl border border-gray-100 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-yellow-100/70 text-yellow-800 flex items-center justify-center shrink-0">
              <Icon icon="solar:layers-minimalistic-bold" className="text-2xl" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight truncate">
                Wide Product Range
              </h3>
              <p className="text-[11px] text-gray-500 leading-snug">
                Custom prints for every purpose
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-white/80 p-3 sm:p-3.5 rounded-2xl border border-gray-100 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center shrink-0">
              <Icon icon="solar:magic-stick-3-bold" className="text-2xl" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight truncate">
                Vibrant HD Colors
              </h3>
              <p className="text-[11px] text-gray-500 leading-snug">
                High resolution CMYK accuracy
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-white/80 p-3 sm:p-3.5 rounded-2xl border border-gray-100 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0">
              <Icon icon="solar:shield-check-bold" className="text-2xl" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight truncate">
                100% Quality Guarantee
              </h3>
              <p className="text-[11px] text-gray-500 leading-snug">
                Carefully checked before dispatch
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-white/80 p-3 sm:p-3.5 rounded-2xl border border-gray-100 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-teal-100/70 text-teal-800 flex items-center justify-center shrink-0">
              <Icon icon="solar:leaf-bold" className="text-2xl" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight truncate">
                Eco-Friendly Inks
              </h3>
              <p className="text-[11px] text-gray-500 leading-snug">
                Sustainable green practices
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
