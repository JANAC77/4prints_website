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
            <div className="text-xs sm:text-sm font-semibold text-gray-500 mb-2">
              High Quality Printing, Made Simple
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-extrabold text-[#111111] leading-[1.12] tracking-tight">
              Design. Print. <br className="hidden xl:block" />{' '}
              <span className="text-[#FFD40C]">Impress.</span>
            </h1>

            <p className="mt-3.5 sm:mt-4 text-gray-600 text-xs sm:text-sm md:text-xs lg:text-sm xl:text-base 2xl:text-lg max-w-md leading-relaxed">
              Custom printing for every need. Business or personal, we bring your ideas to life with vibrant quality.
            </p>

            {/* Features Grid — hidden on tablet screens only */}
            <div className="grid md:hidden lg:grid grid-cols-4 gap-3 lg:gap-4 mt-5 sm:mt-6 xl:mt-8 w-full max-w-lg place-items-center lg:place-items-start">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0">
                  <i className="las la-award text-sm sm:text-base lg:text-lg"></i>
                </div>
                <div className="text-[10px] sm:text-xs lg:text-xs xl:text-[13px] font-bold leading-tight text-left">Premium <br/><span className="font-normal text-gray-600">Quality</span></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0">
                  <i className="las la-truck text-sm sm:text-base lg:text-lg"></i>
                </div>
                <div className="text-[10px] sm:text-xs lg:text-xs xl:text-[13px] font-bold leading-tight text-left">Fast <br/><span className="font-normal text-gray-600">Delivery</span></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0">
                  <i className="las la-pen-nib text-sm sm:text-base lg:text-lg"></i>
                </div>
                <div className="text-[10px] sm:text-xs lg:text-xs xl:text-[13px] font-bold leading-tight text-left">Easy <br/><span className="font-normal text-gray-600">Design</span></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0">
                  <i className="las la-headset text-sm sm:text-base lg:text-lg"></i>
                </div>
                <div className="text-[10px] sm:text-xs lg:text-xs xl:text-[13px] font-bold leading-tight text-left">24/7 <br/><span className="font-normal text-gray-600">Support</span></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row items-center justify-center md:justify-start gap-2.5 sm:gap-3 mt-8 sm:mt-6 lg:mt-7 xl:mt-10 w-full sm:w-auto">
              <Link
                to="/products"
                className="w-auto bg-[#ffcc00] text-black font-semibold px-4 sm:px-6 lg:px-7 py-2.5 sm:py-3 rounded-full flex items-center justify-center hover:scale-105 transition-transform text-xs lg:text-sm whitespace-nowrap"
              >
                Shop Now <i className="las la-arrow-right ml-1.5 sm:ml-2 text-sm sm:text-base"></i>
              </Link>
              <Link
                to="/products"
                className="w-auto border-2 border-gray-200 text-gray-800 font-semibold px-4 sm:px-6 lg:px-7 py-2.5 sm:py-3 rounded-full flex items-center justify-center hover:border-[#ffcc00] hover:bg-yellow-50 transition-colors text-xs lg:text-sm whitespace-nowrap"
              >
                Start Designing <i className="las la-arrow-right ml-1.5 sm:ml-2 text-sm sm:text-base text-gray-400"></i>
              </Link>
            </div>

            {/* Trust Section */}
            <div className="hidden lg:flex flex-col sm:flex-row items-center lg:items-center mt-5 lg:mt-6 xl:mt-8 gap-3">
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://i.pravatar.cc/100?img=1" alt="user" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://i.pravatar.cc/100?img=2" alt="user" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://i.pravatar.cc/100?img=3" alt="user" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://i.pravatar.cc/100?img=4" alt="user" />
                <div className="w-8 h-8 rounded-full border-2 border-white bg-[#ffcc00] text-[10px] font-bold text-black flex items-center justify-center z-10">+2K</div>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <span className="text-[11px] font-semibold text-gray-800">Trusted by 10,000+ customers</span>
                <div className="flex items-center text-[#ffcc00] text-base mt-0.5">
                  <i className="las la-star"></i>
                  <i className="las la-star"></i>
                  <i className="las la-star"></i>
                  <i className="las la-star"></i>
                  <i className="las la-star"></i>
                  <span className="text-gray-800 font-bold text-[11px] ml-1.5">4.8/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Features Bar */}
      <div className="w-full bg-[#00000005] mt-auto relative z-20 px-4 sm:px-6 py-4 sm:py-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 xl:gap-8">

          <div className="flex items-center space-x-2 sm:space-x-2.5 lg:space-x-3 xl:space-x-4">
            <Icon icon="fluent:layer-20-regular" className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl flex-shrink-0 text-gray-800" />
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-[11px] sm:text-xs md:text-[11px] lg:text-sm xl:text-base mb-0.5 sm:mb-1 leading-tight whitespace-nowrap">Wide Range of Products</h3>
              <p className="text-[10px] sm:text-[11px] md:text-[11px] lg:text-xs xl:text-sm text-gray-700 leading-snug">Everything you need<br />under one roof.</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-2.5 lg:space-x-3 xl:space-x-4">
            <Icon icon="hugeicons:ai-magic" className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl flex-shrink-0 text-gray-800" />
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-[11px] sm:text-xs md:text-[11px] lg:text-sm xl:text-base mb-0.5 sm:mb-1 leading-tight whitespace-nowrap">Vibrant Colors</h3>
              <p className="text-[10px] sm:text-[11px] md:text-[11px] lg:text-xs xl:text-sm text-gray-700 leading-snug">High quality prints<br />that stand out.</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-2.5 lg:space-x-3 xl:space-x-4">
            <Icon icon="clarity:shield-line" className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl flex-shrink-0 text-gray-800" />
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-[11px] sm:text-xs md:text-[11px] lg:text-sm xl:text-base mb-0.5 sm:mb-1 leading-tight whitespace-nowrap">Secure & Reliable</h3>
              <p className="text-[10px] sm:text-[11px] md:text-[11px] lg:text-xs xl:text-sm text-gray-700 leading-snug">Your data and orders<br />are always safe.</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-2.5 lg:space-x-3 xl:space-x-4">
            <Icon icon="bi:leaf" className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl flex-shrink-0 text-gray-800" />
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-[11px] sm:text-xs md:text-[11px] lg:text-sm xl:text-base mb-0.5 sm:mb-1 leading-tight whitespace-nowrap">Sustainable Printing</h3>
              <p className="text-[10px] sm:text-[11px] md:text-[11px] lg:text-xs xl:text-sm text-gray-700 leading-snug">Eco-friendly materials<br />for a better tomorrow.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroSection;
