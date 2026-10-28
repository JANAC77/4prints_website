import React, { useState } from 'react';
import subscriptionImg from '../../assets/images/Subscription.png';
import { Icon } from '@iconify/react';

const SubscriptionBanner = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <section className="py-6 sm:py-8 lg:py-12 bg-[#fdfbf6]">
      <div className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div 
          className="w-full rounded-[20px] sm:rounded-[24px] lg:rounded-[32px] border border-yellow-100/60 relative overflow-hidden flex flex-col md:flex-row items-center justify-between p-5 md:p-6 lg:p-8 gap-6 sm:gap-8 md:gap-6"
          style={{ background: 'linear-gradient(135deg, #fcf0da 0%, #f8f4ed 70%, #ffffff 100%)' }}
        >
          
          {/* Image Section */}
          <div className="w-full md:w-1/2 flex items-center justify-center relative z-10 shrink-0">
            <img 
              src={subscriptionImg} 
              alt="Subscribe Newsletter Envelope" 
              className="w-full h-auto max-w-[270px] md:max-w-[320px] lg:max-w-[440px] xl:max-w-[500px] object-contain transition-transform duration-500"
            />
          </div>

          {/* Right Content Section */}
          <div className="w-full md:w-1/2 relative z-10 flex flex-col items-center text-center md:items-start md:text-left">
            <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-extrabold text-gray-900 mb-2 sm:mb-3 font-poppins leading-snug sm:leading-tight tracking-tight">
              Stay Inspired, Stay Updated
            </h2>
            <p className="text-xs sm:text-xs md:text-[11px] lg:text-base text-gray-700/90 mb-5 sm:mb-6 max-w-[320px] sm:max-w-[470px] font-medium leading-relaxed">
              Subscribe to get exclusive offers, design tips, and new product updates straight to your inbox.
            </p>
            
            {/* Subscription Form */}
            {subscribed ? (
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm">
                <Icon icon="solar:check-circle-bold" className="text-emerald-600 text-lg" />
                <span>Subscribed successfully! Thank you.</span>
              </div>
            ) : (
              <form 
                className="flex items-center w-full max-w-md md:max-w-[320px] lg:max-w-md bg-white rounded-xl sm:rounded-2xl md:rounded-xl lg:rounded-2xl p-1 sm:p-1.5 md:p-1 lg:p-1.5 border border-gray-200/80 focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400/20 transition-all duration-300" 
                onSubmit={handleSubmit}
              >
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address" 
                  className="flex-grow px-3 sm:px-4 md:px-3 lg:px-4 py-2.5 sm:py-3 md:py-2 lg:py-3 text-xs sm:text-sm md:text-xs lg:text-sm text-gray-800 outline-none min-w-0 placeholder:text-gray-400"
                  required
                />
                <button 
                  type="submit" 
                  className="bg-[#111111] hover:bg-[#222222] active:scale-[0.98] text-white text-xs sm:text-sm md:text-xs lg:text-sm font-semibold px-4 sm:px-6 md:px-3.5 lg:px-6 py-2.5 sm:py-3 md:py-2 lg:py-3 rounded-lg sm:rounded-xl md:rounded-lg lg:rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 group shrink-0 cursor-pointer"
                >
                  <span>Subscribe</span>
                  <Icon icon="weui:arrow-filled" className="text-[#ffcc00] text-sm sm:text-base md:text-xs lg:text-base transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default SubscriptionBanner;
