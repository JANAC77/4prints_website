import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { Icon } from '@iconify/react';
import { FiMail, FiPhoneCall } from 'react-icons/fi';
import logo from '../../assets/images/whitelogo.png';
import upiLogo from '../../assets/images/UPI-Logo-vector.svg.webp';
import rupayLogo from '../../assets/images/RuPay.svg.webp';

const Footer = () => {
  return (
    <footer className="bg-[#110C0B] text-gray-300 py-10 sm:py-14 border-t border-white/10 font-poppins w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12 mb-10 sm:mb-14">
          {/* Logo and Description */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img src={logo} alt="4prints Logo" className="h-9 sm:h-11 w-auto" />
            </Link>
            <p className="text-xs sm:text-sm text-gray-400 mb-6 leading-relaxed">
              Premium custom printing solutions engineered for businesses, creators, and individuals. Built for vibrant longevity.
            </p>
            <div className="flex space-x-2.5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#FFD40C] hover:text-black transition-all text-white active:scale-95"
                aria-label="Facebook"
              >
                <FaFacebookF className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#FFD40C] hover:text-black transition-all text-white active:scale-95"
                aria-label="Instagram"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#FFD40C] hover:text-black transition-all text-white active:scale-95"
                aria-label="Twitter"
              >
                <Icon icon="solar:close-circle-linear" className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#FFD40C] hover:text-black transition-all text-white active:scale-95"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div className="col-span-1">
            <h3 className="text-white font-bold mb-4 text-xs uppercase tracking-wider text-yellow-400">
              Print Catalog
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-400">
              <li>
                <Link to="/products" className="hover:text-yellow-400 transition-colors">
                  Business Cards
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-yellow-400 transition-colors">
                  Flyers & Brochures
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-yellow-400 transition-colors">
                  Custom Apparel
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-yellow-400 transition-colors">
                  Stickers & Decals
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-yellow-400 font-semibold hover:underline flex items-center gap-1">
                  <span>Browse All Products</span>
                  <Icon icon="solar:arrow-right-linear" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h3 className="text-white font-bold mb-4 text-xs uppercase tracking-wider text-yellow-400">
              Resources
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-400">
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Design Guidelines
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Color Matching (CMYK)
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-white transition-colors">
                  Track My Order
                </Link>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Shipping Rates
                </a>
              </li>
              <li>
                <a href="#help" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Our Policy */}
          <div className="col-span-1">
            <h3 className="text-white font-bold mb-4 text-xs uppercase tracking-wider text-yellow-400">
              Policies
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Return & Refund Guarantee
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Quality Assurance
                </a>
              </li>
            </ul>
          </div>

          {/* Need Help? */}
          <div className="col-span-1">
            <h3 className="text-white font-bold mb-4 text-xs uppercase tracking-wider text-yellow-400">
              Contact Us
            </h3>
            <ul className="space-y-3.5 text-xs sm:text-sm text-gray-400">
              <li className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 text-yellow-400">
                  <FiMail className="text-sm" />
                </div>
                <a href="mailto:support@4prints.in" className="hover:text-white transition-colors truncate">
                  support@4prints.in
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 text-yellow-400">
                  <FiPhoneCall className="text-sm" />
                </div>
                <a href="tel:+919876543210" className="hover:text-white transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="text-[11px] text-gray-500 pt-1">
                Mon - Sat: 9:00 AM - 7:00 PM IST
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4">
          <p className="text-[11px] sm:text-xs text-center md:text-left">
            &copy; {new Date().getFullYear()} 4prints Technologies. All rights reserved. Crafted for excellence.
          </p>
          <div className="flex space-x-2.5 items-center">
            <div className="bg-white rounded-lg px-2.5 py-1 flex items-center justify-center h-8 shadow-xs">
              <Icon icon="logos:mastercard" className="w-6 h-auto" />
            </div>
            <div className="bg-white rounded-lg px-2.5 py-1 flex items-center justify-center h-8 shadow-xs">
              <Icon icon="logos:visa" className="w-6 h-auto" />
            </div>
            <div className="bg-white rounded-lg px-2.5 py-1 flex items-center justify-center h-8 shadow-xs">
              <img src={upiLogo} alt="UPI" className="h-3 w-auto object-contain" />
            </div>
            <div className="bg-white rounded-lg px-2.5 py-1 flex items-center justify-center h-8 shadow-xs">
              <img src={rupayLogo} alt="RuPay" className="h-3.5 w-auto object-contain" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
