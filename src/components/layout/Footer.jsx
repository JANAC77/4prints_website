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
    <footer className="bg-[#151515] text-gray-300 py-8 sm:py-10 md:py-12 border-t border-gray-800 font-poppins w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12">
          {/* Logo and Description */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="mb-3 sm:mb-4">
              <Link to="/">
                <img src={logo} alt="4prints Logo" className="h-8 sm:h-10 md:h-12 w-auto" />
              </Link>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mb-5 sm:mb-6 leading-relaxed">
              High-quality printing solutions for businesses and individuals. Designed to make your brand stand out.
            </p>
            <div className="flex space-x-2.5 sm:space-x-3">
              <a href="#" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center hover:bg-[#FBB03B] hover:text-white transition-colors text-white" aria-label="Facebook">
                <FaFacebookF className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
              </a>
              <a href="#" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center hover:bg-[#FBB03B] hover:text-white transition-colors text-white" aria-label="Instagram">
                <FaInstagram className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              </a>
              <a href="#" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center hover:bg-[#FBB03B] hover:text-white transition-colors text-white" aria-label="Twitter">
                <Icon icon="codicon:twitter" className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              </a>
              <a href="#" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center hover:bg-[#FBB03B] hover:text-white transition-colors text-white" aria-label="LinkedIn">
                <FaLinkedinIn className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold sm:font-medium mb-3 sm:mb-4 text-sm sm:text-base lg:text-base">Products</h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-400">
              <li><Link to="/products" className="hover:text-white transition-colors">Business Cards</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Flyers & Brochures</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Posters</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Stickers & Labels</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">View All Products</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold sm:font-medium mb-3 sm:mb-4 text-sm sm:text-base lg:text-base">Resources</h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-400">
              <li><Link to="/products" className="hover:text-white transition-colors">Templates</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Design Tools</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Shipping & Delivery</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Our Policy */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold sm:font-medium mb-3 sm:mb-4 text-sm sm:text-base lg:text-base">Our Policy</h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
            </ul>
          </div>

          {/* Need Help? */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold sm:font-medium mb-3 sm:mb-4 text-sm sm:text-base lg:text-base">Need Help?</h3>
            <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-gray-400">
              <li className="flex items-center space-x-2.5 sm:space-x-3">
                <FiMail className="text-sm sm:text-base shrink-0" />
                <a href="mailto:support@4prints.in" className="hover:text-white transition-colors break-all sm:break-normal">support@4prints.in</a>
              </li>
              <li className="flex items-center space-x-2.5 sm:space-x-3">
                <FiPhoneCall className="text-sm sm:text-base shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">+91 98765 43210</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 sm:pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-3 md:gap-0">
          <p className="text-[11px] sm:text-xs md:text-xs text-center md:text-left">&copy; {new Date().getFullYear()} 4prints. All rights reserved.</p>
          <div className="flex space-x-2.5 sm:space-x-3 items-center">
            <div className="bg-white rounded px-1.5 sm:px-2 py-1 flex items-center justify-center h-7 sm:h-8">
              <Icon icon="logos:mastercard" className="w-6 sm:w-7 h-auto" />
            </div>
            <div className="bg-white rounded px-1.5 sm:px-2 py-1 flex items-center justify-center h-7 sm:h-8">
              <Icon icon="logos:visa" className="w-6 sm:w-7 h-auto" />
            </div>
            <div className="bg-white rounded px-1.5 sm:px-2 flex items-center justify-center h-7 sm:h-8">
              <img src={upiLogo} alt="UPI" className="h-2.5 sm:h-3 w-auto object-contain" />
            </div>
            <div className="bg-white rounded px-1.5 sm:px-2 flex items-center justify-center h-7 sm:h-8">
              <img src={rupayLogo} alt="RuPay" className="h-3 sm:h-3.5 w-auto object-contain" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
