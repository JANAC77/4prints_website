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
    <section className="py-8 sm:py-10 lg:py-14 bg-[#fdfbf6]">
      <div className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div 
          className="w-full rounded-[24px] sm:rounded-[32px] border border-yellow-200/80 relative overflow-hidden flex flex-col md:flex-row items-center justify-between p-6 sm:p-8 lg:p-12 gap-8 shadow-xs"
          style={{ background: 'linear-gradient(135deg, #fff6e0 0%, #fffaf0 50%, #ffffff 100%)' }}
        >
          {/* Image Section */}
          <div className="w-full md:w-1/2 flex items-center justify-center relative z-10 shrink-0">
            <img 
              src={subscriptionImg} 
              alt="Subscribe Newsletter Envelope" 
              className="w-full h-auto max-w-[260px] sm:max-w-[300px] md:max-w-[360px] lg:max-w-[460px] object-contain drop-shadow-lg transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Right Content Section */}
          <div className="w-full md:w-1/2 relative z-10 flex flex-col items-center text-center md:items-start md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-yellow-200/80 text-yellow-900 text-[11px] font-bold px-3 py-1 rounded-full mb-3">
              <Icon icon="solar:letter-bold" className="text-yellow-700 text-xs" />
              <span>Exclusive Newsletter</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-950 mb-3 font-poppins leading-tight tracking-tight">
              Stay Inspired, Stay Updated
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-6 max-w-md leading-relaxed">
              Subscribe to get exclusive early-bird discounts, seasonal design templates, and print inspiration directly in your inbox.
            </p>
            
            {/* Subscription Form */}
            {subscribed ? (
              <div className="flex items-center gap-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-5 py-3.5 rounded-2xl font-bold text-sm">
                <Icon icon="solar:check-circle-bold" className="text-emerald-600 text-xl" />
                <span>🎉 You're in! Check your inbox for exclusive perks.</span>
              </div>
            ) : (
              <form 
                className="flex items-center w-full max-w-md bg-white rounded-2xl p-1.5 border border-gray-200 shadow-sm focus-within:border-yellow-400 focus-within:ring-3 focus-within:ring-yellow-400/20 transition-all duration-300" 
                onSubmit={handleSubmit}
              >
                <div className="pl-3 text-gray-400">
                  <Icon icon="solar:letter-linear" className="text-lg" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address" 
                  className="flex-grow px-3 py-2.5 text-xs sm:text-sm text-gray-800 outline-none min-w-0 placeholder:text-gray-400"
                  required
                />
                <button 
                  type="submit" 
                  className="bg-[#110C0B] hover:bg-black active:scale-95 text-white text-xs sm:text-sm font-bold px-5 sm:px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group shrink-0 shadow-xs cursor-pointer"
                >
                  <span>Subscribe</span>
                  <Icon icon="solar:arrow-right-linear" className="text-yellow-400 text-sm transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </form>
            )}

            <p className="text-[11px] text-gray-400 mt-3 flex items-center gap-1.5">
              <Icon icon="solar:shield-check-linear" className="text-gray-400 text-xs" />
              <span>We value your privacy. Unsubscribe at any time.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionBanner;
