import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, ShoppingBag } from 'lucide-react';
import NavLogo from "../../assets/footer-logo.png"
const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <img src={NavLogo} className='w-20 h-20'></img>
            </Link>
            <p className="text-sm text-white">
              Premium clothing for the modern individual. Express your style with our exclusive collections.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-specialGrey transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-specialGrey transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-specialGrey transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shopping Column */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Shopping</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="text-white hover:text-specialGrey transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?collection=new" className="text-white hover:text-specialGrey transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/products?collection=men" className="text-white hover:text-specialGrey transition-colors">
                  Men's Collection
                </Link>
              </li>
              <li>
                <Link to="/products?collection=women" className="text-white hover:text-specialGrey transition-colors">
                  Women's Collection
                </Link>
              </li>
              <li>
                <Link to="/products?collection=sale" className="text-white hover:text-specialGrey transition-colors">
                  Sale Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Info Column */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Information</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-white hover:text-specialGrey transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white hover:text-specialGrey transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-white hover:text-specialGrey transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-white hover:text-specialGrey transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-white hover:text-specialGrey transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Newsletter</h3>
            <p className="text-sm text-white mb-4">
              Subscribe to our newsletter for the latest updates, exclusive offers, and style tips.
            </p>
            <form className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-4 w-4" />
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-white w-full pl-10 pr-4 py-2 rounded-md text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-yellow-500 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="border-t border-white mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-white text-sm">
          <p>&copy; {new Date().getFullYear()} EzyBuyy All rights reserved.</p>

          <p className="mt-4 md:mt-0 flex items-center space-x-1">
            <span>Made with</span>
            <span className="text-red-500">♥</span>
            <span>by</span>
            <a
              href="https://www.linkedin.com/in/ayush-s-009311238/" // replace with your actual LinkedIn URL if different
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-400 transition-colors"
            >
              Ayush Sotiya
            </a>
          </p>
        </div>


      </div>
    </footer>
  );
};

export default Footer;
